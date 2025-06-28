/**
 * Ejemplo de implementación del backend para Wompi 3DS
 * Este archivo proporciona la estructura esperada para los endpoints
 * 
 * NOTA: Este es un ejemplo de referencia. Adapta según tu tecnología backend.
 */

// ============================================
// ENDPOINT: POST /api/payments/create-transaction
// ============================================
app.post('/api/payments/create-transaction', async (req, res) => {
  try {
    const { amount, customer, orderData } = req.body;
    
    // Validar datos requeridos
    if (!amount || !customer || !orderData) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos para crear transacción'
      });
    }

    // Configuración de Wompi (obtener de variables de entorno)
    const WOMPI_API_URL = process.env.WOMPI_API_URL || 'https://api.wompi.sv';
    const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
    const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;

    // Generar referencia única de transacción
    const transactionReference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Datos para Wompi
    const wompiPayload = {
      amount_in_cents: Math.round(amount * 100), // Convertir a centavos
      currency: 'USD', // o 'CRC' según tu configuración
      reference: transactionReference,
      customer_email: customer.email,
      customer_data: {
        full_name: customer.name,
        phone_number: customer.phone
      },
      redirect_url: `${process.env.FRONTEND_URL}/payment/success?id=${transactionReference}`,
      confirmation_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      payment_source_id: null, // Se establece en el checkout
      payment_method: {
        type: 'CARD',
        installments: 1
      }
    };

    // Llamada a la API de Wompi
    const wompiResponse = await fetch(`${WOMPI_API_URL}/v1/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wompiPayload)
    });

    const wompiResult = await wompiResponse.json();

    if (wompiResponse.ok && wompiResult.data) {
      // Guardar transacción en base de datos
      const transaction = await saveTransaction({
        reference: transactionReference,
        wompi_id: wompiResult.data.id,
        amount: amount,
        customer: customer,
        order_data: orderData,
        status: 'PENDING',
        created_at: new Date()
      });

      // Responder con URL de redirección
      res.json({
        success: true,
        redirectUrl: wompiResult.data.payment_link_url,
        transactionReference: transactionReference,
        message: 'Transacción creada exitosamente'
      });

    } else {
      throw new Error(wompiResult.error?.messages || 'Error al crear transacción en Wompi');
    }

  } catch (error) {
    console.error('Error creando transacción Wompi:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
});

// ============================================
// ENDPOINT: GET /api/payments/verify-payment
// ============================================
app.get('/api/payments/verify-payment', async (req, res) => {
  try {
    const { transactionId, status } = req.query;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'ID de transacción requerido'
      });
    }

    // Buscar transacción en base de datos
    const transaction = await findTransactionByReference(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    // Verificar estado en Wompi
    const wompiResponse = await fetch(`${WOMPI_API_URL}/v1/transactions/${transaction.wompi_id}`, {
      headers: {
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`
      }
    });

    const wompiResult = await wompiResponse.json();

    if (wompiResponse.ok && wompiResult.data) {
      const finalStatus = wompiResult.data.status;
      
      // Actualizar estado en base de datos
      await updateTransactionStatus(transactionId, finalStatus);

      if (finalStatus === 'APPROVED') {
        // Procesar pedido exitoso
        const order = await processSuccessfulOrder(transaction.order_data);
        
        res.json({
          success: true,
          orderData: {
            codigo_pedido: order.codigo_pedido,
            total: transaction.amount,
            tiempo_estimado_entrega: transaction.order_data.tiempo_estimado_entrega
          }
        });
      } else {
        res.json({
          success: false,
          error: `Pago ${finalStatus.toLowerCase()}`,
          message: getStatusMessage(finalStatus)
        });
      }
    } else {
      throw new Error('Error al verificar estado en Wompi');
    }

  } catch (error) {
    console.error('Error verificando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el pago'
    });
  }
});

// ============================================
// ENDPOINT: POST /api/payments/webhook
// ============================================
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Verificar integridad del webhook (opcional pero recomendado)
    const signature = req.headers['x-wompi-signature'];
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({ error: 'Signature inválida' });
    }

    const transactionId = data.reference;
    const status = data.status;

    // Actualizar estado en base de datos
    const transaction = await findTransactionByReference(transactionId);
    
    if (transaction) {
      await updateTransactionStatus(transactionId, status);
      
      if (status === 'APPROVED') {
        // Procesar pedido y enviar notificaciones
        await processSuccessfulOrder(transaction.order_data);
        await sendNotificationEmail(transaction.customer.email);
      }
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

// ============================================
// ENDPOINT: GET /api/payments/config
// ============================================
app.get('/api/payments/config', (req, res) => {
  res.json({
    public_key: process.env.WOMPI_PUBLIC_KEY,
    environment: process.env.WOMPI_ENVIRONMENT || 'sandbox',
    currency: 'USD',
    supported_payment_methods: ['CARD'],
    three_ds_enabled: true
  });
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function saveTransaction(transactionData) {
  // Implementar según tu base de datos
  // return await db.transactions.create(transactionData);
}

async function findTransactionByReference(reference) {
  // Implementar según tu base de datos
  // return await db.transactions.findOne({ reference });
}

async function updateTransactionStatus(reference, status) {
  // Implementar según tu base de datos
  // return await db.transactions.update({ reference }, { status });
}

async function processSuccessfulOrder(orderData) {
  // Implementar lógica de negocio para pedido exitoso
  // 1. Crear pedido en sistema
  // 2. Actualizar inventario
  // 3. Enviar a cocina
  // 4. Programar entrega
  // return orderCode;
}

function getStatusMessage(status) {
  const messages = {
    'PENDING': 'Pago pendiente de confirmación',
    'APPROVED': 'Pago aprobado exitosamente',
    'DECLINED': 'Pago rechazado por el banco',
    'VOIDED': 'Pago cancelado',
    'ERROR': 'Error en el procesamiento del pago'
  };
  return messages[status] || 'Estado desconocido';
}

function verifyWebhookSignature(payload, signature) {
  // Implementar verificación de firma Wompi
  // const expectedSignature = generateWompiSignature(payload);
  // return expectedSignature === signature;
  return true; // Simplificado para el ejemplo
}

// ============================================
// VARIABLES DE ENTORNO REQUERIDAS
// ============================================
/*
WOMPI_API_URL=https://api.wompi.sv (o sandbox URL)
WOMPI_PRIVATE_KEY=prv_test_xxxxxxxxxxxx
WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxxxx
WOMPI_ENVIRONMENT=sandbox (o production)
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
*/

// ============================================
// CONFIGURACIÓN DE CORS (Si es necesario)
// ============================================
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yourdomain.com',
    'https://checkout.wompi.sv'
  ],
  credentials: true
}));

module.exports = app;
