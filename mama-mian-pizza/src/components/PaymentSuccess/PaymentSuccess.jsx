import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheck, FaFilePdf, FaHome, FaSpinner } from 'react-icons/fa';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  // Obtener parámetros de la URL
  const transactionId = searchParams.get('transaction_id');
  const orderId = searchParams.get('order_id');
  const status = searchParams.get('status');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId || !orderId) {
        setError('Información de pago incompleta');
        setLoading(false);
        return;
      }

      try {
        // Verificar el estado del pago en el backend
        const response = await fetch(`https://api.mamamianpizza.com/api/payments/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transaction_id: transactionId,
            order_id: orderId,
            status: status
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setOrderData(result.order);
          } else {
            setError(result.message || 'Error al verificar el pago');
          }
        } else {
          const errorResult = await response.json();
          setError(errorResult.message || 'Error del servidor');
        }
      } catch (error) {
        console.error('Error verificando pago:', error);
        setError('Error de conexión al verificar el pago');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [transactionId, orderId, status]);

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`https://api.mamamianpizza.com/api/orders/invoice/${orderData.codigo_pedido}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${orderData.codigo_pedido}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error al descargar la factura');
      }
    } catch (error) {
      console.error('Error descargando factura:', error);
      alert('Error al descargar la factura');
    }
  };

  const handleGoHome = () => {
    // Limpiar cualquier dato temporal del carrito
    localStorage.removeItem('cartItems');
    localStorage.removeItem('pendingOrder');
    navigate('/menu');
  };

  if (loading) {
    return (
      <div className="payment-status-container">
        <div className="payment-status-card">
          <FaSpinner className="spinner-icon payment-spinner" />
          <h2>Verificando pago...</h2>
          <p>Por favor espera mientras verificamos tu transacción</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-status-container">
        <div className="payment-status-card payment-error">
          <div className="error-icon-container">
            <span className="error-icon">❌</span>
          </div>
          <h2>Error al procesar el pago</h2>
          <p>{error}</p>
          <div className="payment-actions">
            <button className="btn-secondary" onClick={handleGoHome}>
              <FaHome /> Volver al inicio
            </button>
            <button className="btn-primary" onClick={() => navigate('/pideahora')}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-status-container">
      <div className="payment-status-card payment-success">
        <div className="success-icon-container">
          <FaCheck className="success-icon" />
        </div>
        
        <h1>¡Pago exitoso!</h1>
        <p className="success-message">
          Tu pago ha sido procesado correctamente
        </p>

        {orderData && (
          <div className="order-summary">
            <h3>Resumen del pedido</h3>
            <div className="order-details">
              <div className="detail-row">
                <span className="label">Número de pedido:</span>
                <span className="value">{orderData.codigo_pedido}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total pagado:</span>
                <span className="value">${orderData.total.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Método de pago:</span>
                <span className="value">Tarjeta de crédito/débito</span>
              </div>
              <div className="detail-row">
                <span className="label">Estado:</span>
                <span className="value status-paid">Pagado</span>
              </div>
            </div>
          </div>
        )}

        <div className="delivery-info">
          <h4>Información de entrega</h4>
          <p>
            <strong>Tiempo estimado:</strong> {orderData?.tiempo_estimado_entrega || 30}-{orderData?.tiempo_estimado_entrega + 15 || 45} minutos
          </p>
          <p>Recibirás una confirmación por correo electrónico con los detalles de tu pedido.</p>
        </div>

        <div className="payment-actions">
          {orderData && (
            <button className="btn-secondary" onClick={handleDownloadInvoice}>
              <FaFilePdf /> Descargar factura
            </button>
          )}
          <button className="btn-primary" onClick={handleGoHome}>
            <FaHome /> Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
