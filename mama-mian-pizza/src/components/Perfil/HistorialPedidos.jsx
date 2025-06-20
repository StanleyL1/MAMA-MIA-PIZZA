import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh, faSpinner, faExclamationTriangle, faShoppingBag,
  faClock, faCreditCard, faTruck
} from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

export default function HistorialPedidos({ user, setToast, onOrderUpdate }) {
  const navigate = useNavigate();
  
  // Estados para datos de la API
  const [userOrders, setUserOrders] = useState([]);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    favoriteProducts: 0
  });  
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  
  // Ref para controlar si ya se han cargado los datos iniciales
  const initialDataLoaded = useRef(false);

  // Función para obtener pedidos del usuario desde la API
  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) {
      console.log('❌ No hay ID de usuario para obtener pedidos');
      return;
    }

    // Verificar si el ID es válido (no es un timestamp)
    const userId = user.id;
    if (typeof userId === 'number' && userId > 1000000000000) {
      console.log('❌ ID parece ser un timestamp temporal:', userId);
      setErrorOrders('Error: ID de usuario no válido. Por favor, cierra sesión e inicia sesión nuevamente.');
      return;
    }

    // Evitar llamadas múltiples si ya estamos cargando
    if (loadingOrders) {
      console.log('⏳ Ya hay una carga de pedidos en progreso, saltando...');
      return;
    }

    setLoadingOrders(true);
    setErrorOrders(null);

    try {
      console.log('🔍 Obteniendo pedidos para usuario ID:', userId);
      
      // Usar el endpoint exacto proporcionado
      const response = await fetch(`${API_BASE_URL}/orders/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Status de respuesta:', response.status);

      if (!response.ok) {
        // Si el endpoint no existe o retorna error, mostrar mensaje específico
        if (response.status === 404) {
          console.log('📭 No se encontraron pedidos para este usuario');
          setUserOrders([]);
          setUserStats({
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0,
            favoriteProducts: 0,
            pedidoMinimo: 0,
            pedidoMaximo: 0,
          });
          return;
        }
        throw new Error(`Error al obtener pedidos: ${response.status}`);
      }      

      const data = await response.json();
      console.log('📦 Respuesta completa de la API:', data);

      // Verificar si la respuesta es HTML (error 404 del servidor)
      if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        console.log('⚠️ El endpoint no está implementado en el servidor');
        setErrorOrders('La funcionalidad de historial de pedidos estará disponible próximamente.');
        return;
      }      

      // Verificar si la respuesta indica que no hay pedidos
      if (data.message && data.message.includes('No se encontraron pedidos')) {
        console.log('📭 No hay pedidos para este usuario según la API');
        setUserOrders([]);
        setUserStats({
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          favoriteProducts: 0,
          pedidoMinimo: 0,
          pedidoMaximo: 0,
        });
        return;
      }

      // Extraer pedidos de la estructura de respuesta exacta
      const pedidos = data.pedidos || [];
      const totalPedidos = data.total_pedidos || 0;
      
      console.log(`📊 Total de pedidos encontrados: ${totalPedidos}`);

      // Procesar los datos de pedidos con la estructura exacta del endpoint
      const processedOrders = pedidos.map(order => ({
        id: order.id_pedido,
        codigo_pedido: order.codigo_pedido,
        fecha: order.fecha_pedido,
        productos: order.detalles || [],
        total: parseFloat(order.total) || 0,
        subtotal: parseFloat(order.subtotal) || 0,
        costo_envio: parseFloat(order.costo_envio) || 0,
        impuestos: parseFloat(order.impuestos) || 0,
        estado: order.estado || 'Pendiente',
        metodo_pago: order.metodo_pago || '',
        tiempo_entrega: order.tiempo_estimado_entrega || null,
        fecha_entrega: order.fecha_entrega || null,
        direccion: order.direccion || null,
        telefono: order.telefono || null,
        observaciones: order.notas_adicionales || null,
        nombre_cliente: order.nombre_cliente || '',
        apellido_cliente: order.apellido_cliente || '',
        email: order.email || '',
        tipo_cliente: order.tipo_cliente || '',
        aceptado_terminos: order.aceptado_terminos || 0,
        nombre_usuario: order.nombre_usuario || '',
        latitud: order.latitud || null,
        longitud: order.longitud || null,
        direccion_formateada: order.direccion_formateada || null,
      }));

      setUserOrders(processedOrders);

      // Calcular estadísticas basadas en los pedidos obtenidos
      const stats = {
        totalOrders: totalPedidos,
        totalSpent: processedOrders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: processedOrders.length > 0 
          ? processedOrders.reduce((sum, order) => sum + order.total, 0) / processedOrders.length 
          : 0,
        favoriteProducts: processedOrders.reduce((count, order) => 
          count + (Array.isArray(order.productos) ? order.productos.length : 0), 0
        ),
        pedidoMinimo: processedOrders.length > 0 
          ? Math.min(...processedOrders.map(order => order.total)) 
          : 0,
        pedidoMaximo: processedOrders.length > 0 
          ? Math.max(...processedOrders.map(order => order.total)) 
          : 0,
      };

      setUserStats(stats);
      console.log('📊 Estadísticas calculadas:', stats);

    } catch (error) {
      console.error('❌ Error al obtener pedidos:', error);
      setErrorOrders('Error al cargar tus pedidos. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.id, loadingOrders]);

  // Función para refrescar pedidos
  const handleRefreshOrders = useCallback(async () => {
    if (loadingOrders) return;
    
    setUpdateMessage('Actualizando historial de pedidos...');
    
    try {
      await fetchUserOrders();
      setUpdateMessage('');
      
      if (setToast) {
        setToast('Historial de pedidos actualizado');
      }
      
      if (onOrderUpdate) {
        onOrderUpdate();
      }
    } catch (error) {
      setUpdateMessage('');
      console.error('Error al refrescar pedidos:', error);
    }
  }, [fetchUserOrders, loadingOrders, setToast, onOrderUpdate]);

  // Cargar datos inicialmente
  useEffect(() => {
    if (user?.id && !initialDataLoaded.current) {
      initialDataLoaded.current = true;
      fetchUserOrders();
    }
  }, [user?.id, fetchUserOrders]);

  // Función para formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Función para obtener color del estado
  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return '#ff9800';
      case 'confirmado': return '#2196f3';
      case 'en preparación': return '#ff5722';
      case 'listo': return '#4caf50';
      case 'entregado': return '#8bc34a';
      case 'cancelado': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <>
      <div className="perfil__titulo-historial">
        Mis Pedidos
        <button 
          className="perfil__refresh-btn" 
          onClick={handleRefreshOrders}
          disabled={loadingOrders}
        >
          <FontAwesomeIcon 
            icon={faRefresh} 
            className={loadingOrders ? 'spinning' : ''} 
          />
          {loadingOrders ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Mensaje de actualización */}
      {updateMessage && (
        <div className="perfil__update-message">
          <FontAwesomeIcon icon={faSpinner} className="spinning" />
          {updateMessage}
        </div>
      )}            

      {/* Estadísticas */}
      <div className="perfil__estadisticas">
        <div className="perfil__estadistica-card">
          <div className="perfil__estadistica-numero">{userStats.totalOrders}</div>
          <div className="perfil__estadistica-label">Pedidos Totales</div>
        </div>
        <div className="perfil__estadistica-card">
          <div className="perfil__estadistica-numero">${userStats.totalSpent.toFixed(2)}</div>
          <div className="perfil__estadistica-label">Total Gastado</div>
        </div>
        <div className="perfil__estadistica-card">
          <div className="perfil__estadistica-numero">${userStats.averageOrderValue.toFixed(2)}</div>
          <div className="perfil__estadistica-label">Promedio por Pedido</div>
        </div>
        {userStats.pedidoMaximo > 0 && (
          <div className="perfil__estadistica-card">
            <div className="perfil__estadistica-numero">${userStats.pedidoMaximo.toFixed(2)}</div>
            <div className="perfil__estadistica-label">Pedido Más Alto</div>
          </div>
        )}
      </div>

      {/* Estados de carga, error y contenido */}
      {loadingOrders && (
        <div className="perfil__loading">
          <FontAwesomeIcon icon={faSpinner} className="spinning" />
          Cargando tus pedidos...
        </div>
      )}            

      {errorOrders && (
        <div className="perfil__error">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {errorOrders}
          {!errorOrders.includes('próximamente') && !errorOrders.includes('ID de usuario no válido') && (
            <button className="perfil__retry-btn" onClick={handleRefreshOrders}>
              Reintentar
            </button>
          )}
          {errorOrders.includes('ID de usuario no válido') && (
            <div className="perfil__coming-soon">
              <p>Para solucionarlo:</p>
              <button 
                className="perfil__empty-btn"
                onClick={() => {
                  // Limpiar localStorage y redirigir al login
                  localStorage.clear();
                  navigate('/login');
                }}
              >
                Cerrar sesión e iniciar sesión nuevamente
              </button>
            </div>
          )}
          {errorOrders.includes('próximamente') && (
            <div className="perfil__coming-soon">
              <p>Mientras tanto, puedes:</p>
              <button 
                className="perfil__empty-btn"
                onClick={() => navigate('/menu')}
              >
                Explorar Menú
              </button>
            </div>
          )}
        </div>
      )}

      {!loadingOrders && !errorOrders && userOrders.length === 0 && (
        <div className="perfil__empty">
          <FontAwesomeIcon icon={faShoppingBag} />
          <h3>No tienes pedidos aún</h3>
          <p>¡Explora nuestro delicioso menú y realiza tu primer pedido!</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
            Una vez que realices un pedido, aparecerá aquí con todos los detalles.
          </p>
          <button 
            className="perfil__empty-btn"
            onClick={() => navigate('/menu')}
          >
            Ver Menú
          </button>
        </div>
      )}

      {!loadingOrders && !errorOrders && userOrders.length > 0 && 
        userOrders.map((pedido, index) => (
          <div className="perfil__pedido-card" key={pedido.id}>
            <div className="perfil__pedido-header">
              <div>
                <span className="perfil__pedido-id">
                  Pedido #{pedido.codigo_pedido || pedido.id}
                </span>
                <span 
                  className="perfil__estado-badge"
                  style={{ backgroundColor: getStatusColor(pedido.estado) }}
                >
                  {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                </span>
              </div>
              <div className="perfil__pedido-total">${pedido.total.toFixed(2)}</div>
            </div>

            <div className="perfil__pedido-fecha">
              {formatDate(pedido.fecha)}
            </div>

            <div className="perfil__pedido-info">
              <div className="perfil__pedido-metodo">
                <FontAwesomeIcon icon={faCreditCard} />
                {pedido.metodo_pago.charAt(0).toUpperCase() + pedido.metodo_pago.slice(1)}
              </div>
              <div className="perfil__pedido-entrega">
                <FontAwesomeIcon icon={faTruck} />
                {pedido.tipo_cliente === 'registrado' ? 'Entrega a domicilio' : 'Recogida en tienda'}
              </div>
              {pedido.tiempo_entrega && (
                <div className="perfil__pedido-tiempo">
                  <FontAwesomeIcon icon={faClock} />
                  {pedido.tiempo_entrega} min estimados
                </div>
              )}
            </div>

            {/* Desglose del pedido */}
            <div className="perfil__pedido-desglose">
              <div className="perfil__pedido-desglose-item">
                <span>Subtotal:</span>
                <span>${pedido.subtotal.toFixed(2)}</span>
              </div>
              {pedido.costo_envio > 0 && (
                <div className="perfil__pedido-desglose-item">
                  <span>Costo de envío:</span>
                  <span>${pedido.costo_envio.toFixed(2)}</span>
                </div>
              )}
              {pedido.impuestos > 0 && (
                <div className="perfil__pedido-desglose-item">
                  <span>Impuestos:</span>
                  <span>${pedido.impuestos.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Productos del pedido */}
            {Array.isArray(pedido.productos) && pedido.productos.length > 0 && (
              <div className="perfil__pedido-productos">
                <div className="perfil__productos-titulo">
                  Productos ({pedido.productos.length})
                </div>
                {pedido.productos.map((producto, index) => (
                  <div className="perfil__producto-item" key={index}>
                    <div className="perfil__producto-info">
                      {/* Título del producto */}
                      <div className="perfil__producto-nombre">
                        {producto.nombre_producto}
                      </div>
                      
                      {/* Descripción del producto */}
                      {producto.descripcion && (
                        <div className="perfil__producto-descripcion">
                          {producto.descripcion}
                        </div>
                      )}
                      
                      {/* Cantidad */}
                      <div className="perfil__producto-detalle">
                        Cantidad: {producto.cantidad}
                      </div>
                      
                      {/* Masa y Tamaño */}
                      {(producto.masa || producto.tamano) && (
                        <div className="perfil__producto-detalle">
                          {producto.masa && `Masa: ${producto.masa}`}
                          {producto.masa && producto.tamano && ' • '}
                          {producto.tamano && `Tamaño: ${producto.tamano}`}
                        </div>
                      )}
                      
                      {/* Instrucciones especiales */}
                      {producto.instrucciones_especiales && (
                        <div className="perfil__producto-detalle">
                          Instrucciones: {producto.instrucciones_especiales}
                        </div>
                      )}

                      {/* Método de entrega */}
                      {producto.metodo_entrega !== undefined && (
                        <div className="perfil__producto-detalle">
                          Entrega: {producto.metodo_entrega === 1 ? 'A domicilio' : 'Recogida en tienda'}
                        </div>
                      )}
                    </div>
                    
                    <div className="perfil__producto-precio">
                      ${parseFloat(producto.subtotal || producto.precio_unitario || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Información adicional del pedido */}
            {(pedido.direccion || pedido.observaciones) && (
              <div className="perfil__pedido-adicional">
                {pedido.direccion && (
                  <div className="perfil__pedido-direccion">
                    <strong>Dirección de entrega:</strong> {pedido.direccion}
                  </div>
                )}
                {pedido.observaciones && (
                  <div className="perfil__pedido-observaciones">
                    <strong>Observaciones:</strong> {pedido.observaciones}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      }
    </>
  );
}
