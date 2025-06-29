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
      return errorMessage;
    }

    switch (errorCode) {
      case 'INSUFFICIENT_FUNDS':
        return 'Fondos insuficientes en tu tarjeta';
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
      default:
        return 'Ocurrió un error durante el procesamiento del pago';
    }
  };

  const getErrorSolution = () => {
    switch (errorCode) {
      case 'INSUFFICIENT_FUNDS':
        return 'Verifica el saldo de tu tarjeta o intenta con otra tarjeta';
      case 'CARD_DECLINED':
        return 'Contacta a tu banco o intenta con otra tarjeta';
      case 'EXPIRED_CARD':
        return 'Usa una tarjeta vigente';
      case 'INVALID_CARD':
        return 'Verifica que los datos ingresados sean correctos';
      case 'TIMEOUT':
      case 'NETWORK_ERROR':
        return 'Intenta nuevamente en unos minutos';
      case 'USER_CANCELLED':
        return 'Puedes reintentar el pago cuando desees';
      default:
        return 'Puedes intentar nuevamente o contactar a soporte';
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
      `Hola, tuve un problema con mi pago. ID de transacción: ${transactionId || 'N/A'}, Error: ${getErrorMessage()}`
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
