import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimes, FaHome, FaRedo, FaQuestionCircle, FaSpinner } from 'react-icons/fa';
import './PaymentFailure.css';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Obtener parámetros de la URL
  const transactionId = searchParams.get('transaction_id');
  const orderId = searchParams.get('order_id');
  const errorCode = searchParams.get('error_code');
  const errorMessage = searchParams.get('error_message');
  const amount = searchParams.get('amount');
  const paymentMethod = searchParams.get('payment_method');

  useEffect(() => {
    const processFailure = async () => {
      try {
        // Registrar el fallo del pago en el backend
        if (transactionId || orderId) {
          const response = await fetch(`https://api.mamamianpizza.com/api/payments/payment-failed`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              transaction_id: transactionId,
              order_id: orderId,
              error_code: errorCode,
              error_message: errorMessage
            })
          });

          if (response.ok) {
            // Registro exitoso del fallo
            console.log('Fallo de pago registrado correctamente');
          }
        }
      } catch (error) {
        console.error('Error procesando fallo de pago:', error);
      } finally {
        setLoading(false);
      }
    };

    processFailure();
  }, [transactionId, orderId, errorCode, errorMessage]);

  const getErrorMessage = () => {
    if (errorMessage) {
      // Si el mensaje contiene "Fondos insuficientes", mostrar un mensaje más amigable
      if (errorMessage.toLowerCase().includes('fondos insuficientes')) {
        return 'No hay fondos suficientes en tu tarjeta';
      }
      // Decodificar mensaje de Wompi que viene codificado en URL
      return decodeURIComponent(errorMessage);
    }

    switch (errorCode) {
      case 'INSUFFICIENT_FUNDS':
        return 'No hay fondos suficientes en tu tarjeta';
      case 'CARD_DECLINED':
        return 'Tu tarjeta fue rechazada por el banco';
      case 'EXPIRED_CARD':
        return 'Tu tarjeta ha expirado';
      case 'INVALID_CARD':
        return 'Los datos de la tarjeta son inválidos';
      case 'TIMEOUT':
        return 'La transacción excedió el tiempo límite';
      case 'NETWORK_ERROR':
        return 'Error de conexión durante el proceso';
      case 'USER_CANCELLED':
        return 'El pago fue cancelado por el usuario';
      case 'PAYMENT_DECLINED':
        return 'El pago fue rechazado';
      default:
        return 'Ocurrió un error durante el procesamiento del pago';
    }
  };

  const getErrorSolution = () => {
    switch (errorCode) {
      case 'INSUFFICIENT_FUNDS':
        return 'Te recomendamos: verificar el saldo de tu tarjeta, intentar con otra tarjeta o contactar a tu banco';
      case 'CARD_DECLINED':
        return 'Te recomendamos: contactar a tu banco para verificar el estado de tu tarjeta o intentar con otra tarjeta';
      case 'EXPIRED_CARD':
        return 'Usa una tarjeta con fecha de vencimiento vigente';
      case 'INVALID_CARD':
        return 'Verifica que todos los datos de la tarjeta sean correctos (número, CVV, fecha de vencimiento)';
      case 'TIMEOUT':
      case 'NETWORK_ERROR':
        return 'Intenta nuevamente en unos minutos. Si el problema persiste, contacta a soporte';
      case 'USER_CANCELLED':
        return 'Puedes reintentar el pago cuando desees';
      case 'PAYMENT_DECLINED':
        return 'Verifica los datos de tu tarjeta o intenta con otra tarjeta. Si el problema persiste, contacta a tu banco';
      default:
        return 'Puedes intentar nuevamente o contactar a nuestro equipo de soporte para recibir ayuda';
    }
  };

  const handleRetry = () => {
    // Recuperar el carrito y redirigir al checkout
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      navigate('/pideahora');
    } else {
      navigate('/menu');
    }
  };

  const handleGoHome = () => {
    navigate('/menu');
  };

  const handleContactSupport = () => {
    // Abrir WhatsApp o modal de contacto
    const message = encodeURIComponent(
      `Hola, tuve un problema con mi pago en Mama Mia Pizza.
      
📋 Detalles:
• ID de transacción: ${transactionId || 'N/A'}
• Monto: $${amount || 'N/A'}
• Error: ${getErrorMessage()}
• Método de pago: ${paymentMethod || 'Tarjeta'}

¿Podrían ayudarme?`
    );
    window.open(`https://wa.me/50375155863?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="payment-status-container">
        <div className="payment-status-card">
          <FaSpinner className="spinner-icon payment-spinner" />
          <h2>Procesando información...</h2>
          <p>Por favor espera mientras procesamos la información del pago</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-status-container">
      <div className="payment-status-card payment-failure">
        <div className="failure-icon-container">
          <FaTimes className="failure-icon" />
        </div>
        
        <h1>Pago no procesado</h1>
        <p className="failure-message">
          No pudimos procesar tu pago en este momento
        </p>

        <div className="error-details">
          <h3>¿Qué pasó?</h3>
          <div className="error-info">
            <div className="error-row">
              <span className="error-label">Motivo:</span>
              <span className="error-value">{getErrorMessage()}</span>
            </div>
            
            {amount && (
              <div className="error-row">
                <span className="error-label">Monto del pago:</span>
                <span className="error-value">${amount}</span>
              </div>
            )}
            
            {paymentMethod && (
              <div className="error-row">
                <span className="error-label">Método de pago:</span>
                <span className="error-value">{paymentMethod}</span>
              </div>
            )}
            
            {transactionId && (
              <div className="error-row">
                <span className="error-label">ID de transacción:</span>
                <span className="error-value">{transactionId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="solution-info">
          <h4>¿Cómo solucionarlo?</h4>
          <p>{getErrorSolution()}</p>
          
          {errorCode === 'INSUFFICIENT_FUNDS' && (
            <div className="special-suggestion">
              <strong>💡 Sugerencia:</strong> También puedes elegir pagar en efectivo al momento de la entrega o recoger tu pedido sin necesidad de tarjeta.
            </div>
          )}
        </div>

        <div className="payment-options">
          <h4>También puedes:</h4>
          <ul>
            <li>Pagar en efectivo al momento de la entrega</li>
            <li>Intentar con otra tarjeta</li>
            <li>Contactar a nuestro soporte para ayuda</li>
          </ul>
        </div>

        <div className="payment-actions">
          <button className="btn-primary" onClick={handleRetry}>
            <FaRedo /> Intentar de nuevo
          </button>
          
          <button className="btn-secondary" onClick={handleContactSupport}>
            <FaQuestionCircle /> Contactar soporte
          </button>
          
          <button className="btn-tertiary" onClick={handleGoHome}>
            <FaHome /> Volver a la tienda
          </button>
        </div>

        <div className="support-info">
          <p>
            <strong>¿Necesitas ayuda?</strong><br />
            Contáctanos por WhatsApp: +503 7515-5863<br />
            Estamos disponibles de 10:00 AM a 9:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
