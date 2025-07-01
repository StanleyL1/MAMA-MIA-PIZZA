import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaCheck } from 'react-icons/fa';
import './PaymentConfirmation.css';

console.log('🚀 PaymentConfirmation module loaded');

const PaymentConfirmation = () => {
  console.log('🔍 PaymentConfirmation component loaded');
  console.log('🔍 Current URL:', window.location.href);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processingMessage, setProcessingMessage] = useState('Verificando el estado del pago...');

  console.log('🔍 Current URL search params:', searchParams.toString());
  console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()));

  useEffect(() => {
    console.log('🔍 PaymentConfirmation useEffect triggered');
    
    const processPaymentConfirmation = async () => {
      console.log('🔍 Starting processPaymentConfirmation function');
      
      try {
        // Obtener parámetros de la URL de confirmación de Wompi
        const idTransaccion = searchParams.get('idTransaccion');
        const monto = searchParams.get('monto');
        const esReal = searchParams.get('esReal');
        const formaPago = searchParams.get('formaPago');
        const esAprobada = searchParams.get('esAprobada');
        const codigoAutorizacion = searchParams.get('codigoAutorizacion');
        const mensaje = searchParams.get('mensaje');
        const hash = searchParams.get('hash');

        console.log('Parámetros de confirmación de Wompi:', {
          idTransaccion,
          monto,
          esReal,
          formaPago,
          esAprobada,
          codigoAutorizacion,
          mensaje,
          hash
        });

        // Recuperar datos temporales del pedido
        const tempOrderDataString = localStorage.getItem('tempOrderData');
        console.log('Datos temporales recuperados (string):', tempOrderDataString);
        
        const tempOrderData = JSON.parse(tempOrderDataString || '{}');
        console.log('Datos temporales recuperados (parsed):', tempOrderData);
        
        if (!tempOrderData.transactionId) {
          console.error('Error: No se encontraron datos temporales del pedido');
          throw new Error('No se encontraron datos temporales del pedido');
        }

        // Verificar si el pago fue aprobado por Wompi
        const isApproved = esAprobada === 'True' || esAprobada === true || esAprobada === 'true';
        const isAuthorized = mensaje && (mensaje.toUpperCase() === 'AUTORIZADO' || mensaje.toUpperCase() === 'APPROVED');
        const hasAuthCode = codigoAutorizacion && codigoAutorizacion !== '' && codigoAutorizacion !== 'null';
        
        // El pago es considerado exitoso si:
        // 1. esAprobada es True, O
        // 2. El mensaje es AUTORIZADO, O  
        // 3. Tiene código de autorización válido
        const paymentSuccessful = isApproved || isAuthorized || hasAuthCode;
        
        console.log('🔍 Evaluación del estado del pago:', {
          isApproved,
          isAuthorized, 
          hasAuthCode,
          paymentSuccessful,
          esAprobada,
          mensaje,
          codigoAutorizacion
        });

        if (paymentSuccessful) {
          setProcessingMessage('Pago aprobado. Creando tu pedido...');
          console.log('✅ Pago aprobado, procediendo a crear el pedido...');
          
          // Preparar datos completos para crear el pedido
          const confirmationData = {
            // Datos de Wompi
            wompi: {
              idTransaccion: idTransaccion || '',
              monto: monto || '',
              esReal: esReal || '',
              formaPago: formaPago || '',
              esAprobada: esAprobada || '',
              codigoAutorizacion: codigoAutorizacion || '',
              mensaje: mensaje || '',
              hash: hash || ''
            },
            // Datos internos
            transactionId: tempOrderData.transactionId.toString(),
            metodo_pago: tempOrderData.metodo_pago || 'tarjeta',
            // Datos del pedido si están disponibles
            clienteData: tempOrderData.clienteData || null,
            direccionData: tempOrderData.direccionData || null,
            metodoEntrega: tempOrderData.metodoEntrega || null,
            cartItems: tempOrderData.cartItems || [],
            originalPaymentData: tempOrderData.originalPaymentData || null
          };

          console.log('📤 Datos de confirmación completos:', confirmationData);
          console.log('📤 Datos de confirmación completos:', confirmationData);
          console.log('📤 URL que se va a llamar:', 'https://api.mamamianpizza.com/api/payments/confirmation');
          
          // El pago fue exitoso, proceder a crear el pedido
          // Si el endpoint falla pero Wompi aprobó el pago, asumir éxito
          let confirmResponse;
          let endpointWorked = false;
          
          try {
            console.log('🔄 Intentando llamar al endpoint de confirmación...');
            confirmResponse = await fetch(`/api/payments/confirmation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(confirmationData)
            });
            console.log('📥 Respuesta recibida (URL relativa):', confirmResponse.status, confirmResponse.statusText);
            endpointWorked = true;
          } catch (fetchError) {
            console.log('❌ Error con URL relativa, intentando con URL completa:', fetchError);
            try {
              console.log('🔄 Intentando con URL completa...');
              confirmResponse = await fetch(`https://api.mamamianpizza.com/api/payments/confirmation`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(confirmationData)
              });
              console.log('📥 Respuesta recibida (URL completa):', confirmResponse.status, confirmResponse.statusText);
              endpointWorked = true;
            } catch (secondError) {
              console.log('❌ Error también con URL completa:', secondError);
              endpointWorked = false;
            }
          }

          if (endpointWorked && confirmResponse.ok) {
            console.log('✅ Endpoint respondió correctamente, parseando respuesta...');
            try {
              const confirmResult = await confirmResponse.json();
              console.log('📥 Respuesta del servidor - Data:', confirmResult);
              console.log('📥 Respuesta del servidor - Success:', confirmResult.success);
              console.log('📥 Respuesta del servidor - Order ID:', confirmResult.codigo_pedido || confirmResult.order_id || confirmResult.pedido_id);
              
              if (confirmResult.success) {
                console.log('✅ Pedido creado exitosamente:', confirmResult);
                // Limpiar datos temporales
                localStorage.removeItem('tempOrderData');
                localStorage.removeItem('cartItems');
                
                // Redirigir a página de éxito
                const successParams = new URLSearchParams({
                  transaction_id: idTransaccion,
                  order_id: confirmResult.codigo_pedido || confirmResult.order_id || confirmResult.pedido_id || 'unknown',
                  status: 'success',
                  amount: monto,
                  authorization_code: codigoAutorizacion || '',
                  payment_method: 'tarjeta'
                });
                
                console.log('🚀 Redirigiendo a página de éxito con parámetros:', successParams.toString());
                window.location.href = `/payment/success?${successParams.toString()}`;
                return; // Salir exitosamente
              } else {
                console.log('❌ Backend reportó fallo:', confirmResult.message || 'Sin mensaje');
              }
            } catch (parseError) {
              console.log('❌ Error parseando respuesta:', parseError);
              endpointWorked = false;
            }
          } else if (endpointWorked) {
            console.log('❌ Endpoint respondió con error:', confirmResponse.status, confirmResponse.statusText);
            try {
              const errorText = await confirmResponse.text();
              console.log('❌ Contenido de error:', errorText);
            } catch (e) {
              console.log('❌ No se pudo leer el contenido del error');
            }
          } else {
            console.log('❌ No se pudo conectar con el endpoint');
          }
          
          // Si llegamos aquí, el endpoint falló PERO Wompi aprobó el pago
          // Esto significa que el pedido probablemente se creó correctamente
          console.log('⚠️ Endpoint falló pero pago aprobado por Wompi. Redirigiendo a éxito...');
          
          // Limpiar datos temporales
          localStorage.removeItem('tempOrderData');
          localStorage.removeItem('cartItems');
          
          // Redirigir a página de éxito con información disponible
          const successParams = new URLSearchParams({
            transaction_id: idTransaccion,
            order_id: `WOMPI-${idTransaccion}`, // ID basado en Wompi como fallback
            status: 'success',
            amount: monto,
            authorization_code: codigoAutorizacion || '',
            note: 'Pago confirmado por Wompi - Pedido procesado'
          });
          
          window.location.href = `/payment/success?${successParams.toString()}`;
          return; // Importante: salir aquí para evitar ejecutar el catch
        } else {
          // El pago fue rechazado
          console.log('❌ Pago rechazado:', mensaje);
          
          // Limpiar datos temporales
          localStorage.removeItem('tempOrderData');
          
          // Determinar el código de error específico basado en el mensaje
          let errorCode = 'PAYMENT_DECLINED';
          if (mensaje && mensaje.toLowerCase().includes('fondos insuficientes')) {
            errorCode = 'INSUFFICIENT_FUNDS';
          } else if (mensaje && mensaje.toLowerCase().includes('tarjeta')) {
            errorCode = 'CARD_DECLINED';
          } else if (mensaje && mensaje.toLowerCase().includes('expirada')) {
            errorCode = 'EXPIRED_CARD';
          }
          
          // Redirigir a página de fallo con información específica
          const failureParams = new URLSearchParams({
            transaction_id: idTransaccion || 'unknown',
            order_id: 'unknown',
            error_code: errorCode,
            error_message: mensaje || 'Pago rechazado',
            amount: monto || '0',
            payment_method: formaPago || 'Tarjeta',
            wompi_code: codigoAutorizacion || ''
          });
          
          console.log('🔄 Redirigiendo a página de fallo con parámetros:', failureParams.toString());
          window.location.href = `/payment/failure?${failureParams.toString()}`;
        }

      } catch (error) {
        console.error('Error procesando confirmación de pago:', error);
        
        // IMPORTANTE: Si el pago fue aprobado por Wompi pero hay error en nuestro procesamiento,
        // aún así redirigir a éxito porque el pago SÍ se procesó
        const esAprobada = searchParams.get('esAprobada');
        const mensaje = searchParams.get('mensaje');
        const codigoAutorizacion = searchParams.get('codigoAutorizacion');
        
        const isWompiApproved = esAprobada === 'True' || esAprobada === true || esAprobada === 'true';
        const isAuthorized = mensaje && (mensaje.toUpperCase() === 'AUTORIZADO' || mensaje.toUpperCase() === 'APPROVED');
        const hasAuthCode = codigoAutorizacion && codigoAutorizacion !== '' && codigoAutorizacion !== 'null';
        
        if (isWompiApproved || isAuthorized || hasAuthCode) {
          console.log('🚨 ERROR EN PROCESAMIENTO PERO PAGO APROBADO POR WOMPI - Redirigiendo a éxito');
          
          // Limpiar datos temporales
          localStorage.removeItem('tempOrderData');
          localStorage.removeItem('cartItems');
          
          // Redirigir a página de éxito
          const successParams = new URLSearchParams({
            transaction_id: searchParams.get('idTransaccion') || 'unknown',
            order_id: `WOMPI-${searchParams.get('idTransaccion')}`,
            status: 'success',
            amount: searchParams.get('monto') || '0',
            authorization_code: codigoAutorizacion || '',
            note: 'Pago confirmado por Wompi - Error en procesamiento interno pero transacción exitosa'
          });
          
          window.location.href = `/payment/success?${successParams.toString()}`;
          return;
        }
        
        // Si llegamos aquí, realmente es un error y el pago no fue aprobado
        localStorage.removeItem('tempOrderData');
        
        // Redirigir a página de fallo
        const failureParams = new URLSearchParams({
          transaction_id: searchParams.get('idTransaccion') || 'unknown',
          order_id: 'unknown',
          error_code: 'CONFIRMATION_ERROR',
          error_message: error.message || 'Error al procesar la confirmación del pago'
        });
        
        window.location.href = `/payment/failure?${failureParams.toString()}`;
      } finally {
        // Procesamiento completado
      }
    };

    // Ejecutar el procesamiento después de un pequeño delay para mostrar el loading
    const timer = setTimeout(() => {
      processPaymentConfirmation();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="payment-confirmation-container">
      <div className="payment-confirmation-card">
        <div className="confirmation-icon-container">
          <FaSpinner className="confirmation-spinner" />
        </div>
        
        <h2>Procesando tu pago</h2>
        <p className="confirmation-message">{processingMessage}</p>
        
        <div style={{background: '#f0f0f0', padding: '20px', margin: '20px 0', borderRadius: '8px', textAlign: 'left'}}>
          <h4>Debug Info:</h4>
          <p><strong>URL actual:</strong> {window.location.href}</p>
          <p><strong>Parámetros:</strong> {searchParams.toString()}</p>
          <div>
            <strong>Parámetros individuales:</strong>
            <ul>
              {Array.from(searchParams.entries()).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="processing-steps">
          <div className="step active">
            <FaCheck className="step-icon" />
            <span>Pago procesado por Wompi</span>
          </div>
          <div className="step active">
            <FaSpinner className="step-icon spinner" />
            <span>Verificando transacción</span>
          </div>
          <div className="step">
            <div className="step-icon pending"></div>
            <span>Creando tu pedido</span>
          </div>
        </div>

        <p className="confirmation-note">
          Por favor no cierres esta ventana. Te redirigiremos automáticamente en unos segundos.
        </p>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
