import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimes, FaExclamationTriangle, FaSpinner, FaRedo } from 'react-icons/fa';
import './PaymentFailure.css';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const verifyFailure = async () => {
      try {
        // Obtener parámetros de la URL
        const transactionId = searchParams.get('id');
        const status = searchParams.get('status');
        const error = searchParams.get('error');
        
        // Opcional: Verificar el estado del pago fallido en el backend
        if (transactionId) {
          try {
            const response = await fetch(`https://api.mamamianpizza.com/api/payments/verify-payment?transactionId=${transactionId}&status=${status}`);
            
            if (response.ok) {
              const result = await response.json();
              setErrorDetails({
                transactionId,
                status,
                error: error || result.error || 'Pago no completado',
                message: result.message || 'La transacción no pudo ser procesada correctamente.'
              });
            } else {
              throw new Error('Error del servidor');
            }
          } catch (serverError) {
            // Si hay error del servidor, usar parámetros de URL
            setErrorDetails({
              transactionId,
              status,
              error: error || 'Pago fallido',
              message: 'No se pudo completar el pago. Por favor, intenta nuevamente.'
            });
          }
        } else {
          // Sin transactionId, error genérico
          setErrorDetails({
            transactionId: null,
            status: status || 'FAILED',
            error: error || 'Error de pago',
            message: 'Hubo un problema procesando tu pago. Por favor, intenta nuevamente.'
          });
        }
      } catch (error) {
        console.error('Error verificando fallo de pago:', error);
        setErrorDetails({
          transactionId: null,
          status: 'ERROR',
          error: 'Error desconocido',
          message: 'Ocurrió un error inesperado. Por favor, contacta con soporte si el problema persiste.'
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyFailure();
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Redirigir al checkout para intentar nuevamente
    navigate('/checkout');
  };

  const handleBackToCart = () => {
    // Volver al carrito para revisar el pedido
    navigate('/cart');
  };

  const handleBackToStore = () => {
    // Volver a la tienda
    navigate('/menu');
  };

  const handleContactSupport = () => {
    // Implementar contacto con soporte
    window.open('https://wa.me/50375155863?text=Necesito%20ayuda%20con%20un%20pago%20fallido', '_blank');
  };

  if (isVerifying) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="loading-section">
            <FaSpinner className="spinner-large" />
            <h2>Verificando estado del pago...</h2>
            <p>Por favor espera mientras procesamos la información</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="failure-section">
          <div className="failure-icon">
            <FaTimes />
          </div>
          <h1>Pago no completado</h1>
          
          <div className="error-details">
            <p className="error-message">
              {errorDetails?.message || 'No se pudo procesar tu pago correctamente.'}
            </p>
            
            {errorDetails?.transactionId && (
              <div className="transaction-info">
                <p><strong>ID de transacción:</strong> {errorDetails.transactionId}</p>
              </div>
            )}
            
            <div className="common-reasons">
              <h3>Posibles causas:</h3>
              <ul>
                <li>Fondos insuficientes en la tarjeta</li>
                <li>Datos de tarjeta incorrectos</li>
                <li>Transacción cancelada por seguridad</li>
                <li>Problemas de conexión durante el proceso</li>
              </ul>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleRetryPayment}>
              <FaRedo />
              Intentar nuevamente
            </button>
            
            <button className="btn-secondary" onClick={handleBackToCart}>
              Revisar pedido
            </button>
            
            <button className="btn-secondary" onClick={handleBackToStore}>
              Volver a la tienda
            </button>
            
            <button className="btn-support" onClick={handleContactSupport}>
              <FaExclamationTriangle />
              Contactar soporte
            </button>
          </div>
          
          <div className="help-info">
            <p>
              <strong>¿Necesitas ayuda?</strong><br />
              Si el problema persiste, no dudes en contactarnos por WhatsApp o intentar con otra tarjeta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
