import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheck, FaSpinner, FaFilePdf, FaHome } from 'react-icons/fa';
import './PagoExitoso.css';

const PagoExitoso = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState('cargando'); // 'cargando', 'exitoso', 'fallido'
  const [detallesPago, setDetallesPago] = useState(null);

  useEffect(() => {
    // Obtener parámetros de la URL (pueden venir de Wompi o de nuestra app)
    const pedidoId = searchParams.get('pedido') || searchParams.get('reference');
    const monto = searchParams.get('monto') || searchParams.get('amount');
    const estado = searchParams.get('estado') || searchParams.get('status');
    const idTransaccion = searchParams.get('id') || searchParams.get('transaction_id');
    
    // Parámetros específicos de Wompi
    const wompiStatus = searchParams.get('wompi_status');
    const wompiReference = searchParams.get('wompi_reference');
    const wompiTransactionId = searchParams.get('wompi_transaction_id');

    // Obtener información del pedido desde localStorage
    const pedidoInfo = localStorage.getItem('pedido_actual');
    let infoPedido = null;
    
    if (pedidoInfo) {
      try {
        infoPedido = JSON.parse(pedidoInfo);
      } catch (error) {
        console.error('Error al parsear información del pedido:', error);
      }
    }

    console.log('🔍 Parámetros de URL recibidos:', {
      pedidoId, monto, estado, idTransaccion,
      wompiStatus, wompiReference, wompiTransactionId
    });

    console.log('📦 Información del pedido desde localStorage:', infoPedido);

    // Simular validación del pago (en producción deberías validar con tu backend)
    setTimeout(() => {
      // Determinar si el pago fue exitoso
      const pagoExitoso = !estado || 
                         estado === 'exitoso' || 
                         estado === 'aprobado' || 
                         estado === 'success' ||
                         wompiStatus === 'approved' ||
                         wompiStatus === 'success';

      if (pagoExitoso) {
        setDetallesPago({
          idTransaccion: idTransaccion || wompiTransactionId || pedidoId || wompiReference || `#MAMA-${Date.now()}`,
          monto: monto || (infoPedido ? infoPedido.total.toFixed(2) : '0.00'),
          fecha: new Date().toLocaleDateString('es-ES'),
          metodoPago: 'Pago en línea - Wompi',
          cliente: infoPedido ? infoPedido.cliente : 'Cliente',
          productos: infoPedido ? infoPedido.productos : [],
          metodoEntrega: infoPedido ? infoPedido.metodoEntrega : 'domicilio',
          subtotal: infoPedido ? infoPedido.subtotal : 0,
          impuestos: infoPedido ? infoPedido.impuestos : 0,
          costoEnvio: infoPedido ? infoPedido.costoEnvio : 0
        });
        setEstado('exitoso');
        
        // Limpiar información del pedido después de mostrarla
        if (infoPedido) {
          localStorage.removeItem('pedido_actual');
        }
      } else {
        setEstado('fallido');
      }
    }, 2000);
  }, [searchParams]);

  const handleVolverTienda = () => {
    navigate('/menu');
  };

  const handleDescargarFactura = () => {
    // Implementar descarga de factura
    alert('Función de descarga de factura - por implementar');
  };

  const handleIrHome = () => {
    navigate('/');
  };

  if (estado === 'cargando') {
    return (
      <div className="pago-exitoso-container">
        <div className="pago-exitoso-card">
          <div className="loading-container">
            <FaSpinner className="spinner-large" />
            <h2>Verificando tu pago...</h2>
            <p>Por favor espera mientras confirmamos tu transacción.</p>
          </div>
        </div>
      </div>
    );
  }

  if (estado === 'fallido') {
    return (
      <div className="pago-exitoso-container">
        <div className="pago-exitoso-card">
          <div className="error-container">
            <div className="icono-error">❌</div>
            <h2>Pago no completado</h2>
            <p>Hubo un problema con tu pago. Por favor intenta nuevamente.</p>
            <div className="botones-error">
              <button className="btn-reintentar" onClick={() => navigate('/pide-ahora')}>
                Reintentar pago
              </button>
              <button className="btn-home" onClick={handleIrHome}>
                <FaHome /> Ir al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pago-exitoso-container">
      <div className="pago-exitoso-card">
        <div className="success-container">
          <div className="icono-success">
            <FaCheck />
          </div>
          <h1>¡Pago realizado con éxito!</h1>
          <p className="mensaje-principal">
            Tu pedido ha sido confirmado y está siendo procesado.
          </p>

          {detallesPago && (
            <div className="detalles-pago">
              <h3>Detalles de la transacción:</h3>
              <div className="detalle-item">
                <strong>ID de transacción:</strong> {detallesPago.idTransaccion}
              </div>
              <div className="detalle-item">
                <strong>Cliente:</strong> {detallesPago.cliente}
              </div>
              <div className="detalle-item">
                <strong>Monto pagado:</strong> ${detallesPago.monto}
              </div>
              <div className="detalle-item">
                <strong>Fecha:</strong> {detallesPago.fecha}
              </div>
              <div className="detalle-item">
                <strong>Método de pago:</strong> {detallesPago.metodoPago}
              </div>
              <div className="detalle-item">
                <strong>Entrega:</strong> {detallesPago.metodoEntrega === 'domicilio' ? 'A domicilio' : 'Recoger en local'}
              </div>
              
              {detallesPago.productos && detallesPago.productos.length > 0 && (
                <div className="productos-pedido">
                  <h4>Productos ordenados:</h4>
                  {detallesPago.productos.map((producto, index) => (
                    <div key={index} className="producto-item">
                      <span>{producto.nombre} x{producto.cantidad}</span>
                      <span>${(producto.precio * producto.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {/* Mostrar desglose de costos si está disponible */}
                  {(detallesPago.subtotal || detallesPago.impuestos || detallesPago.costoEnvio) && (
                    <div className="desglose-costos">
                      <div className="costo-item">
                        <span>Subtotal:</span>
                        <span>${(detallesPago.subtotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="costo-item">
                        <span>Impuestos (13%):</span>
                        <span>${(detallesPago.impuestos || 0).toFixed(2)}</span>
                      </div>
                      <div className="costo-item">
                        <span>Costo de envío:</span>
                        <span>${(detallesPago.costoEnvio || 0).toFixed(2)}</span>
                      </div>
                      <div className="costo-item total-final">
                        <span><strong>Total:</strong></span>
                        <span><strong>${detallesPago.monto}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="tiempo-entrega">
            <h3>⏱️ Tiempo estimado de entrega: 30-45 minutos</h3>
          </div>

          <p className="mensaje-confirmacion">
            Recibirás una confirmación por correo electrónico con los detalles de tu pedido.
          </p>

          <div className="botones-accion">
            <button className="btn-factura" onClick={handleDescargarFactura}>
              <FaFilePdf /> Descargar factura
            </button>
            <button className="btn-volver-tienda" onClick={handleVolverTienda}>
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso;
