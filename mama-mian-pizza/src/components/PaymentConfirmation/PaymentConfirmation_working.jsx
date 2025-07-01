import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaCheck } from 'react-icons/fa';
import './PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processingMessage, setProcessingMessage] = useState('Verificando el estado del pago...');

  useEffect(() => {
    const processPaymentConfirmation = async () => {
      try {
        // Obtener parámetros de Wompi
        const idTransaccion = searchParams.get('idTransaccion');
        const monto = searchParams.get('monto');
        const esReal = searchParams.get('esReal');
        const formaPago = searchParams.get('formaPago');
        const esAprobada = searchParams.get('esAprobada');
        const codigoAutorizacion = searchParams.get('codigoAutorizacion');
        const mensaje = searchParams.get('mensaje');
        const hash = searchParams.get('hash');

        console.log('🎉 PaymentConfirmation - Parámetros de Wompi:', {
          idTransaccion,
          monto,
          esAprobada,
          mensaje,
          codigoAutorizacion
        });

        // Recuperar datos temporales
        const tempOrderDataString = localStorage.getItem('tempOrderData');
        if (!tempOrderDataString) {
          throw new Error('No se encontraron datos temporales del pedido');
        }

        const tempOrderData = JSON.parse(tempOrderDataString);
        console.log('📦 Datos temporales recuperados:', tempOrderData);

        // Verificar si el pago fue aprobado
        const isApproved = esAprobada === 'True' || esAprobada === 'true';
        const isAuthorized = mensaje && mensaje.toUpperCase() === 'AUTORIZADO';
        const hasAuthCode = codigoAutorizacion && codigoAutorizacion !== 'null' && codigoAutorizacion !== '';

        const paymentSuccessful = isApproved || isAuthorized || hasAuthCode;

        console.log('🔍 Estado del pago:', {
          isApproved,
          isAuthorized,
          hasAuthCode,
          paymentSuccessful
        });

        if (paymentSuccessful) {
          setProcessingMessage('Pago aprobado. Creando tu pedido...');
          
          // FLUJO SIMPLIFICADO: Intentar crear el pedido usando los datos originales
          // Si el backend original funcionaba, usemos la misma estructura
          
          try {
            // Usar el endpoint original que funcionaba para efectivo, pero con los datos de tarjeta
            const pedidoData = {
              cliente: tempOrderData.clienteData,
              productos: tempOrderData.cartItems.map(item => ({
                id_producto: item.id,
                nombre_producto: item.nombre,
                cantidad: parseInt(item.cantidad),
                precio_unitario: parseFloat(item.precio),
                subtotal: parseFloat(item.precio * item.cantidad),
                masa: item.masa || null,
                tamano: item.tamano || null,
                instrucciones_especiales: item.instrucciones || null,
                metodo_entrega: tempOrderData.metodoEntrega === 'recoger' ? 1 : 0
              })),
              metodo_pago: 'tarjeta', // IMPORTANTE: Asegurar que sea tarjeta
              subtotal: parseFloat(tempOrderData.monto),
              costo_envio: 0.00,
              total: parseFloat(tempOrderData.monto),
              // Agregar información de la transacción de Wompi
              wompi_transaction_id: idTransaccion,
              wompi_authorization_code: codigoAutorizacion,
              aceptado_terminos: true,
              tiempo_estimado_entrega: tempOrderData.metodoEntrega === 'domicilio' ? 30 : 25
            };

            console.log('📤 Creando pedido con datos:', pedidoData);

            // Usar el mismo endpoint que funciona para efectivo
            const response = await fetch('https://api.mamamianpizza.com/api/orders/neworder', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(pedidoData)
            });

            if (response.ok) {
              const result = await response.json();
              console.log('✅ Pedido creado exitosamente:', result);

              // Limpiar datos temporales
              localStorage.removeItem('tempOrderData');
              localStorage.removeItem('cartItems');

              // Redirigir a página de éxito
              const successParams = new URLSearchParams({
                transaction_id: idTransaccion,
                order_id: result.codigo_pedido || `WOMPI-${idTransaccion}`,
                status: 'success',
                amount: monto,
                authorization_code: codigoAutorizacion || '',
                payment_method: 'tarjeta'
              });

              window.location.href = `/payment/success?${successParams.toString()}`;
              return;
            } else {
              console.error('❌ Error al crear pedido:', response.status);
              // Aun así redirigir a éxito porque Wompi ya cobró
              fallbackSuccess();
            }
          } catch (error) {
            console.error('❌ Error de conexión al crear pedido:', error);
            // Aun así redirigir a éxito porque Wompi ya cobró
            fallbackSuccess();
          }
        } else {
          // Pago rechazado
          console.log('❌ Pago rechazado por Wompi');
          redirectToFailure();
        }

        function fallbackSuccess() {
          console.log('⚠️ Redirigiendo a éxito como fallback (pago ya procesado por Wompi)');
          localStorage.removeItem('tempOrderData');
          localStorage.removeItem('cartItems');

          const successParams = new URLSearchParams({
            transaction_id: idTransaccion,
            order_id: `WOMPI-${idTransaccion}`,
            status: 'success',
            amount: monto,
            authorization_code: codigoAutorizacion || '',
            payment_method: 'tarjeta'
          });

          window.location.href = `/payment/success?${successParams.toString()}`;
        }

        function redirectToFailure() {
          localStorage.removeItem('tempOrderData');
          
          const failureParams = new URLSearchParams({
            transaction_id: idTransaccion || 'unknown',
            error_code: 'PAYMENT_DECLINED',
            error_message: mensaje || 'Pago rechazado',
            amount: monto || '0',
            payment_method: 'Tarjeta'
          });

          window.location.href = `/payment/failure?${failureParams.toString()}`;
        }

      } catch (error) {
        console.error('❌ Error general en confirmación:', error);
        
        // Si hay cualquier error pero Wompi indica éxito, asumir éxito
        const esAprobada = searchParams.get('esAprobada');
        if (esAprobada === 'True' || esAprobada === 'true') {
          console.log('🚨 Error en procesamiento pero Wompi indica éxito - Asumiendo éxito');
          
          const successParams = new URLSearchParams({
            transaction_id: searchParams.get('idTransaccion') || 'unknown',
            order_id: `WOMPI-${searchParams.get('idTransaccion')}`,
            status: 'success',
            amount: searchParams.get('monto') || '0',
            authorization_code: searchParams.get('codigoAutorizacion') || '',
            payment_method: 'tarjeta'
          });

          window.location.href = `/payment/success?${successParams.toString()}`;
        } else {
          // Error real
          const failureParams = new URLSearchParams({
            transaction_id: 'unknown',
            error_code: 'CONFIRMATION_ERROR',
            error_message: error.message,
            amount: '0',
            payment_method: 'Tarjeta'
          });

          window.location.href = `/payment/failure?${failureParams.toString()}`;
        }
      }
    };

    // Delay pequeño para mostrar el loading
    const timer = setTimeout(processPaymentConfirmation, 1000);
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
