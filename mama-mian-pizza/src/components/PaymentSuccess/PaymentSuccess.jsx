import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheck, FaFilePdf, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState('');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Obtener parámetros de la URL
        const transactionId = searchParams.get('id');
        const status = searchParams.get('status');
        
        if (!transactionId) {
          throw new Error('ID de transacción no encontrado');
        }

        // Verificar el estado del pago en el backend
        const response = await fetch(`https://api.mamamianpizza.com/api/payments/verify-payment?transactionId=${transactionId}&status=${status}`);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.orderData) {
            setOrderData(result.orderData);
          } else {
            throw new Error(result.message || 'Error al verificar el pago');
          }
        } else {
          throw new Error('Error del servidor al verificar el pago');
        }
      } catch (error) {
        console.error('Error verificando pago:', error);
        setVerificationError(error.message);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleDownloadInvoice = () => {
    // Implementar descarga de factura
    alert('Función de descarga de factura en desarrollo');
  };

  const handleBackToStore = () => {
    // Limpiar el carrito del localStorage si existe
    localStorage.removeItem('cartItems');
    navigate('/menu');
  };

  if (isVerifying) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="loading-section">
            <FaSpinner className="spinner-large" />
            <h2>Verificando tu pago...</h2>
            <p>Por favor espera mientras confirmamos tu transacción</p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="error-section">
            <FaExclamationTriangle className="error-icon-large" />
            <h2>Error al verificar el pago</h2>
            <p>{verificationError}</p>
            <button className="btn-secondary" onClick={() => navigate('/menu')}>
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="success-section">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h1>¡Pago realizado con éxito!</h1>
          
          {orderData && (
            <>
              <p className="order-confirmation">
                Tu pedido <strong>#{orderData.codigo_pedido || 'N/A'}</strong> ha sido confirmado y está siendo procesado.
              </p>
              
              <div className="order-details">
                <h3>Detalles del pedido:</h3>
                <div className="detail-row">
                  <span>Total pagado:</span>
                  <span className="amount">${orderData.total}</span>
                </div>
                <div className="detail-row">
                  <span>Método de pago:</span>
                  <span>Tarjeta de crédito/débito</span>
                </div>
                <div className="detail-row">
                  <span>Tiempo estimado:</span>
                  <span>{orderData.tiempo_estimado_entrega || 30}-45 minutos</span>
                </div>
              </div>
              
              <div className="notification-info">
                <p>
                  <strong>Recibirás una confirmación por correo electrónico</strong> con todos los detalles de tu pedido.
                </p>
              </div>
            </>
          )}
          
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleDownloadInvoice}>
              <FaFilePdf />
              Descargar factura
            </button>
            <button className="btn-secondary" onClick={handleBackToStore}>
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
