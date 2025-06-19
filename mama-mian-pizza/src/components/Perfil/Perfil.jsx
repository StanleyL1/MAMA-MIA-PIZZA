import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt,
  faArrowLeft, faEye, faEyeSlash,
  faRefresh, faSpinner, faExclamationTriangle, faShoppingBag,
  faClock, faCreditCard, faTruck
} from "@fortawesome/free-solid-svg-icons";

import perfilFoto from '../../assets/perfilfoto.png';
import './Perfil.css';

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

export default function Perfil({ onAddToCart, user, setToast, onOrderUpdate, updateUser }) {
  const navigate = useNavigate();
  
  // Tabs: pedidos | reseñas | editar | seguridad
  const [activeTab, setActiveTab] = useState('pedidos');
  const [showCambiarContra, setShowCambiarContra] = useState(false);
  
  // Estados para datos de la API
  const [userOrders, setUserOrders] = useState([]);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    favoriteProducts: 0
  });  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState(''); // Mensaje local para mostrar abajo de la foto
  const [profileMessageType, setProfileMessageType] = useState('success'); // 'success' o 'error'
  
  // Estado de perfil del usuario - usar datos reales si están disponibles
  const [userPerfil, setUserPerfil] = useState({
    nombre: user?.nombre || 'Usuario',
    email: user?.correo || user?.email || 'usuario@email.com',
    telefono: user?.telefono || user?.celular || '+503 0000-0000',
    foto: user?.foto_perfil || user?.foto || perfilFoto,
    miembroDesde: user?.fecha_registro ? new Date(user.fecha_registro).getFullYear() : 2023,
    fecha_nacimiento: user?.fecha_nacimiento || '',
    dui: user?.dui || user?.numero_dui || '',
  });
  console.log('👤 PERFIL - Usuario recibido:', user);
  console.log('👤 PERFIL - Estado userPerfil:', userPerfil);
  
  // Función helper para mostrar mensajes locales
  const showProfileMessage = (message, type = 'success') => {
    setProfileMessage(message);
    setProfileMessageType(type);
    setTimeout(() => setProfileMessage(''), 3000);
  };
  // Formulario de edición
  const [formData, setFormData] = useState({
    nombre: userPerfil.nombre,
    email: userPerfil.email,
    telefono: userPerfil.telefono,
  });
  const [editSuccess, setEditSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para manejo de foto de perfil
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);  // Función para obtener pedidos del usuario desde la API
  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) {
      console.log('❌ No hay ID de usuario para obtener pedidos');
      return;
    }

    setLoadingOrders(true);
    setErrorOrders(null);

    try {
      const userId = user.id;
      console.log('🔍 Obteniendo pedidos para usuario ID:', userId);
        // Usar el endpoint correcto para obtener todos los pedidos del usuario
      const response = await fetch(`${API_BASE_URL}/orders/orders/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
      }      const data = await response.json();
      console.log('📦 Respuesta completa de la API:', data);

      // Verificar si la respuesta es HTML (error 404 del servidor)
      if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        console.log('⚠️ El endpoint no está implementado en el servidor');
        setErrorOrders('La funcionalidad de historial de pedidos estará disponible próximamente.');
        return;
      }

      // El endpoint puede devolver un objeto único o un array de pedidos
      // Si es un objeto único, lo convertimos en array
      const pedidos = Array.isArray(data) ? data : [data];

      // Procesar los datos de pedidos con la nueva estructura
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
      }));

      setUserOrders(processedOrders);

      // Calcular estadísticas basadas en los pedidos obtenidos
      const stats = {
        totalOrders: processedOrders.length,
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

      console.log('✅ Pedidos procesados:', processedOrders);
      console.log('📊 Estadísticas calculadas:', stats);

    } catch (error) {
      console.error('❌ Error al obtener pedidos:', error);
      if (error.message.includes('Cannot GET')) {
        setErrorOrders('La funcionalidad de historial de pedidos estará disponible próximamente.');
      } else {
        setErrorOrders('Error al cargar los pedidos. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.id]);// Función para actualizar perfil en la API
  const updateUserProfile = async (updatedData) => {
    if (!user?.id) {
      console.log('❌ No hay ID de usuario para actualizar perfil');
      return false;
    }

    try {
      console.log('🔄 Actualizando perfil para usuario ID:', user.id);
      console.log('📝 Datos a actualizar:', updatedData);
      
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: updatedData.nombre,
          correo: updatedData.email,
          telefono: updatedData.telefono,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(`Error al actualizar perfil: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }

      const result = await response.json();
      console.log('✅ Perfil actualizado:', result);
      return true;

    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      return false;
    }
  };
  // Función para manejar la selección de imagen
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        showProfileMessage('Por favor selecciona un archivo de imagen válido.', 'error');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showProfileMessage('La imagen debe ser menor a 5MB.', 'error');
        return;
      }setSelectedImage(file);
      
      // Crear preview de la imagen inmediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target.result;
        setImagePreview(previewUrl);
          // Actualizar también la foto en userPerfil inmediatamente para mostrar en tiempo real
        setUserPerfil(prev => ({
          ...prev,
          foto: previewUrl
        }));
        
        // Actualizar el usuario en App.jsx inmediatamente para sincronizar con navbar
        if (updateUser) {
          updateUser({
            foto_perfil: previewUrl,
            foto: previewUrl
          });
        }
        
        // Disparar evento para actualizar navbar inmediatamente con la vista previa
        const profileUpdateEvent = new CustomEvent('profilePhotoUpdated', {
          detail: {
            newPhoto: previewUrl,
            userId: user.id
          }
        });
        window.dispatchEvent(profileUpdateEvent);
        
        // Subir automáticamente la foto después de mostrar la vista previa
        setTimeout(() => {
          uploadProfilePhoto(file);
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir la foto de perfil
  const uploadProfilePhoto = async (file = selectedImage) => {
    if (!file || !user?.id) {
      return false;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('foto_perfil', file);

      console.log('📸 Subiendo foto de perfil para usuario ID:', user.id);

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/profile`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor al subir foto:', errorData);
        throw new Error(`Error al subir foto: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }      const result = await response.json();
      console.log('✅ Foto de perfil actualizada:', result);      // Actualizar la foto en el estado local con la URL real de la API
      const newPhotoUrl = result.foto_perfil || result.foto;
      if (newPhotoUrl) {
        setUserPerfil(prev => ({
          ...prev,
          foto: newPhotoUrl
        }));

        // Actualizar el usuario en App.jsx para sincronizar con navbar
        if (updateUser) {
          updateUser({
            foto_perfil: newPhotoUrl,
            foto: newPhotoUrl
          });
        }

        // Disparar evento para actualizar navbar con la URL real
        const profileUpdateEvent = new CustomEvent('profilePhotoUpdated', {
          detail: {
            newPhoto: newPhotoUrl,
            userId: user.id
          }
        });
        window.dispatchEvent(profileUpdateEvent);
      }// Limpiar estados de imagen
      setImagePreview(null);
      
      // Reset del input file
      const fileInput = document.getElementById('profile-photo-input');
      if (fileInput) {
        fileInput.value = '';      }

      showProfileMessage('¡Foto de perfil actualizada correctamente!');

      return true;

    } catch (error) {
      console.error('❌ Error al subir foto de perfil:', error);
      showProfileMessage('Error al subir la foto. Intenta de nuevo.', 'error');
      return false;
    } finally {
      setUploadingImage(false);
    }
  };
  // Efecto para cargar datos cuando se monta el componente o cambia el usuario
  useEffect(() => {
    if (user?.id) {
      console.log('🔄 Cargando datos del perfil para usuario ID:', user.id);
      fetchUserOrders();
    }
  }, [user?.id, fetchUserOrders]);

  // Escuchar actualizaciones de pedidos desde el componente padre
  useEffect(() => {
    if (onOrderUpdate) {
      const handleOrderUpdate = () => {
        console.log('🔄 Actualizando pedidos después de nueva orden...');
        setUpdateMessage('Actualizando historial de pedidos...');
        
        setTimeout(() => {
          fetchUserOrders();
          setUpdateMessage('');
          if (setToast) {
            setToast('¡Historial de pedidos actualizado!');
          }
        }, 1000);
      };

      window.addEventListener('orderCompleted', handleOrderUpdate);
      return () => window.removeEventListener('orderCompleted', handleOrderUpdate);
    }
  }, [onOrderUpdate, fetchUserOrders, setToast]);
  // Actualizar userPerfil cuando cambie el prop user
  useEffect(() => {
    if (user) {
      console.log('👤 PERFIL - Actualizando perfil con datos de usuario:', user);
      setUserPerfil(prev => ({
        ...prev,
        nombre: user.nombre || prev.nombre,
        email: user.correo || user.email || prev.email,
        telefono: user.telefono || user.celular || prev.telefono,
        foto: user.foto_perfil || user.foto || prev.foto,
        miembroDesde: user.fecha_registro ? new Date(user.fecha_registro).getFullYear() : prev.miembroDesde,
        fecha_nacimiento: user.fecha_nacimiento || prev.fecha_nacimiento,
        dui: user.dui || user.numero_dui || prev.dui,
      }));
    }
  }, [user]);// Sincroniza los datos del formulario cuando el tab o usuario cambian
  useEffect(() => {
    if (activeTab === 'editar') {
      setFormData({
        nombre: userPerfil.nombre,
        email: userPerfil.email,
        telefono: userPerfil.telefono,
      });
    } else {
      // Limpiar estados de imagen cuando se cambie de tab
      setImagePreview(null);
      const fileInput = document.getElementById('profile-photo-input');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }, [activeTab, userPerfil]);

  // Redirigir al login si no hay usuario logueado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Función para manejar la actualización manual de pedidos
  const handleRefreshOrders = async () => {
    await fetchUserOrders();
  };
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
    } catch (error) {
      return 'Fecha no disponible';
    }
  };  // Función para formatear fecha de nacimiento
  const formatBirthDate = (dateString) => {
    if (!dateString || dateString.trim() === '') {
      return '';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  // Función helper para mostrar campos vacíos
  const displayFieldValue = (value, placeholder = '') => {
    if (!value || value.trim() === '') {
      return placeholder ? (
        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>{placeholder}</span>
      ) : (
        <span style={{ color: '#d1d5db' }}>—</span>
      );
    }
    return value;
  };
  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'entregado':
      case 'completed':
      case 'completado':
        return '#4caf50';
      case 'en preparacion':
      case 'preparando':
      case 'preparing':
        return '#ff9800';
      case 'enviado':
      case 'en camino':
      case 'shipped':
        return '#2196f3';
      case 'cancelado':
      case 'cancelled':
        return '#f44336';
      case 'pendiente':
      case 'pending':
        return '#ffa726';
      case 'confirmado':
      case 'confirmed':
        return '#66bb6a';
      default:
        return '#9e9e9e';
    }
  };

  // Si no hay usuario, no renderizar nada (se está redirigiendo)
  if (!user) {
    return null;
  }

  return (
    <div className="perfil__main">
      {/* CARD DE PERFIL */}
      <div className="perfil__card">        <div className="perfil__foto-wrapper">
          <img src={userPerfil.foto} alt="Perfil" className="perfil__foto" />
        </div>{/* Mensaje local debajo de la foto */}
        {profileMessage && (
          <div className={`perfil__local-message ${profileMessageType === 'error' ? 'error' : ''}`}>
            {profileMessage}
          </div>
        )}<div className="perfil__info">
          <div className="perfil__nombre">{userPerfil.nombre}</div>
          <div className="perfil__email">{userPerfil.email}</div>
          <div className="perfil__datos">
            <span>
              <FontAwesomeIcon icon={faShoppingBag} /> {userStats.totalOrders} pedidos realizados
            </span>
            <span>
              <FontAwesomeIcon icon={faHeart} style={{ color: '#ab1319' }} /> ${userStats.totalSpent.toFixed(2)} gastado total
            </span>
            <span>
              <FontAwesomeIcon icon={faUser} /> Miembro desde {userPerfil.miembroDesde}
            </span>
          </div>
        </div>
      </div>      {/* TABS */}
      <div className="perfil__tabs">
        <button className={`perfil__tab-btn${activeTab === 'pedidos' ? ' active' : ''}`} onClick={() => setActiveTab('pedidos')}>
          <FontAwesomeIcon icon={faUser} /> <span className="perfil__tab-text">Mis Pedidos</span>
        </button>        <button className={`perfil__tab-btn${activeTab === 'reseñas' ? ' active' : ''}`} onClick={() => setActiveTab('reseñas')}>
          <FontAwesomeIcon icon={faHeart} /> <span className="perfil__tab-text">Mis reseñas</span>
        </button>        <button className={`perfil__tab-btn${activeTab === 'editar' ? ' active' : ''}`} onClick={() => setActiveTab('editar')}>
          <FontAwesomeIcon icon={faEdit} /> <span className="perfil__tab-text">Perfil</span>
        </button>
      </div>{/* CONTENIDO SEGÚN TAB */}
      <div className="perfil__contenido">
        {/* --- HISTORIAL DE PEDIDOS --- */}
        {activeTab === 'pedidos' && (
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
            )}            {/* Estadísticas */}
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
            )}            {errorOrders && (
              <div className="perfil__error">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                {errorOrders}
                {!errorOrders.includes('próximamente') && (
                  <button className="perfil__retry-btn" onClick={handleRefreshOrders}>
                    Reintentar
                  </button>
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
                <p>¡Explora nuestro menú y realiza tu primer pedido!</p>
                <button 
                  className="perfil__empty-btn"
                  onClick={() => navigate('/menu')}
                >
                  Ver Menú
                </button>
              </div>
            )}            {!loadingOrders && !errorOrders && userOrders.length > 0 && 
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
                  {(pedido.direccion || pedido.telefono || pedido.observaciones) && (
                    <div className="perfil__pedido-extra">
                      {pedido.direccion && (
                        <div className="perfil__pedido-detalle">
                          <strong>Dirección de entrega:</strong> {pedido.direccion}
                        </div>
                      )}
                      {pedido.telefono && (
                        <div className="perfil__pedido-detalle">
                          <strong>Teléfono de contacto:</strong> {pedido.telefono}
                        </div>
                      )}
                      {pedido.observaciones && (
                        <div className="perfil__pedido-detalle">
                          <strong>Notas adicionales:</strong> {pedido.observaciones}
                        </div>
                      )}
                      {pedido.fecha_entrega && (
                        <div className="perfil__pedido-detalle">
                          <strong>Fecha de entrega:</strong> {formatDate(pedido.fecha_entrega)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            }
          </>
        )}        {/* --- MIS RESEÑAS --- */}
        {activeTab === 'reseñas' && (
          <div>
            <div className="perfil__titulo-favoritos">Mis reseñas</div>
            <div className="perfil__empty">
              <FontAwesomeIcon icon={faHeart} />
              <h3>Función en desarrollo</h3>
              <p>Próximamente podrás ver y gestionar tus reseñas de productos aquí</p>
              <button 
                className="perfil__empty-btn"
                onClick={() => navigate('/menu')}
              >
                Explorar Menú
              </button>
            </div>
          </div>
        )}        {/* --- PERFIL --- */}
        {activeTab === 'editar' && (
          <div>
            <div className="perfil__titulo-editar">Mi Perfil</div>
            
            {/* Card con foto y datos del perfil */}
            <div className="perfil__data-card">
              {/* Sección de foto */}
              <div className="perfil__foto-section">
                <div className="perfil__foto-container">
                  <div className="perfil__foto-preview">
                    <img 
                      src={imagePreview || userPerfil.foto} 
                      alt="Foto de perfil" 
                      className="perfil__foto-preview-img"
                    />
                  </div>
                  {isEditing && (
                    <div className="perfil__foto-controls">
                      <input
                        type="file"
                        id="profile-photo-input"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                        disabled={uploadingImage}
                      />
                      <label 
                        htmlFor="profile-photo-input" 
                        className={`perfil__foto-select-btn ${uploadingImage ? 'disabled' : ''}`}
                        style={{ 
                          pointerEvents: uploadingImage ? 'none' : 'auto',
                          opacity: uploadingImage ? 0.6 : 1 
                        }}
                      >
                        {uploadingImage ? 'Subiendo...' : 'Cambiar foto'}
                      </label>
                      {uploadingImage && (
                        <div className="perfil__foto-uploading">
                          <FontAwesomeIcon icon={faSpinner} className="spinning" />
                          Actualizando foto...
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="perfil__foto-info">
                    Formatos: JPG, PNG, GIF. Max: 5MB
                  </div>
                )}
              </div>

              {/* Sección de datos */}
              <div className="perfil__data-section">
                {!isEditing ? (                  // Vista de solo lectura
                  <div className="perfil__data-view">
                    <div className="perfil__data-header">
                      <h3>Información Personal</h3>
                    </div>
                    
                    <div className="perfil__data-grid">
                      <div className="perfil__data-item">
                        <label>Nombre completo</label>
                        <div className="perfil__data-value">{userPerfil.nombre}</div>
                      </div>
                      <div className="perfil__data-item">
                        <label>Correo electrónico</label>
                        <div className="perfil__data-value">{userPerfil.email}</div>
                      </div>
                      <div className="perfil__data-item">
                        <label>Teléfono</label>
                        <div className="perfil__data-value">{userPerfil.telefono}</div>
                      </div>                      <div className="perfil__data-item">
                        <label>Fecha de nacimiento</label>
                        <div className="perfil__data-value">
                          {displayFieldValue(formatBirthDate(userPerfil.fecha_nacimiento))}
                        </div>
                      </div>
                      <div className="perfil__data-item">
                        <label>Número de DUI</label>
                        <div className="perfil__data-value">
                          {displayFieldValue(userPerfil.dui)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="perfil__button-container">
                      <button 
                        className="perfil__edit-btn"
                        onClick={() => setIsEditing(true)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Vista de edición
                  <form
                    className="perfil__edit-form"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const success = await updateUserProfile(formData);
                      if (success) {
                        setUserPerfil(prev => ({
                          ...prev,
                          nombre: formData.nombre,
                          email: formData.email,
                          telefono: formData.telefono,
                        }));
                        
                        // Actualizar el usuario en App.jsx para sincronizar con navbar
                        if (updateUser) {
                          updateUser({
                            nombre: formData.nombre,
                            correo: formData.email,
                            telefono: formData.telefono
                          });
                        }
                        
                        // Disparar evento para actualizar navbar con los nuevos datos
                        const profileDataUpdateEvent = new CustomEvent('profileDataUpdated', {
                          detail: {
                            nombre: formData.nombre,
                            email: formData.email,
                            telefono: formData.telefono,
                            userId: user.id
                          }
                        });
                        window.dispatchEvent(profileDataUpdateEvent);

                        setEditSuccess(true);
                        setIsEditing(false);
                        setTimeout(() => setEditSuccess(false), 3000);
                      } else {
                        showProfileMessage('Error al actualizar el perfil. Intenta de nuevo.', 'error');
                      }
                    }}                  >
                    <div className="perfil__data-header">
                      <h3>Editar Información Personal</h3>
                    </div>

                    <div className="perfil__form-grid">
                      <div className="perfil__form-group">
                        <label>Nombre completo</label>
                        <input
                          type="text"
                          value={formData.nombre}
                          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                          required
                        />
                      </div>
                      <div className="perfil__form-group">
                        <label>Correo electrónico</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="perfil__form-group">
                        <label>Teléfono</label>
                        <input
                          type="text"
                          value={formData.telefono}
                          onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                          placeholder="+503 7123-4567"
                          required
                        />
                      </div>                      <div className="perfil__form-group">
                        <label>Fecha de nacimiento</label>
                        <input
                          type="text"
                          value={formatBirthDate(userPerfil.fecha_nacimiento)}
                          placeholder="Sin fecha registrada"
                          readOnly
                          style={{ 
                            backgroundColor: '#f8f9fa', 
                            color: '#6c757d',
                            cursor: 'not-allowed',
                            border: '1.3px solid #e9ecef'
                          }}
                        />
                      </div>
                      <div className="perfil__form-group">
                        <label>Número de DUI</label>
                        <input
                          type="text"
                          value={userPerfil.dui}
                          placeholder="Sin DUI registrado"
                          readOnly
                          style={{ 
                            backgroundColor: '#f8f9fa', 
                            color: '#6c757d',
                            cursor: 'not-allowed',
                            border: '1.3px solid #e9ecef'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="perfil__button-container">
                      <div className="perfil__edit-buttons">
                        <button 
                          type="button"
                          className="perfil__cancel-btn"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              nombre: userPerfil.nombre,
                              email: userPerfil.email,
                              telefono: userPerfil.telefono,
                            });
                          }}
                        >
                          Cancelar
                        </button>
                        <button type="submit" className="perfil__save-btn">
                          Guardar cambios
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {editSuccess && (
              <div className="perfil__edit-success">¡Perfil actualizado correctamente!</div>
            )}

            {/* Sección de Seguridad */}
            <div className="perfil__security-section" style={{ marginTop: '40px' }}>
              <div className="perfil__titulo-seguridad">Configuración de Seguridad</div>
              {/* Contraseña */}
              <div className="perfil__security-card">
                <div className="perfil__security-title">
                  <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 7, color: "#a81818" }} />
                  Contraseña
                </div>
                <div className="perfil__security-desc">
                  Mantén tu cuenta segura con una contraseña fuerte
                </div>
                <button className="perfil__security-btn" onClick={() => setShowCambiarContra(true)}>
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </div>
        )}

      </div>      {/* MODAL CAMBIAR CONTRASEÑA */}
      {showCambiarContra && (
        <CambiarContraseñaModal
          email={userPerfil.email}
          user={user}
          onClose={() => setShowCambiarContra(false)}
          onSuccess={(message) => {
            showProfileMessage(message);
            if (setToast) {
              setToast(message);
            }
          }}
        />
      )}
    </div>
  );
}


// --- MODAL CAMBIAR CONTRASEÑA ---
function CambiarContraseñaModal({ email, onClose, onSuccess, user }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState("");

  const requisitos = [
    { msg: "Debe tener al menos 8 caracteres", valid: newPass.length >= 8 },
    { msg: "Debe contener al menos una letra mayúscula", valid: /[A-Z]/.test(newPass) },
    { msg: "Debe contener al menos un número", valid: /\d/.test(newPass) },
    { msg: "Debe contener al menos un carácter especial", valid: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(newPass) },
  ];
  const handleChangePass = async (e) => {
    e.preventDefault();
    setError("");
    
    if (newPass !== confirmPass) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!requisitos.every(r => r.valid)) {
      setError("La nueva contraseña no cumple con los requisitos de seguridad");
      return;
    }

    if (!user?.id) {
      setError("Error: No se pudo identificar el usuario");
      return;
    }

    setChanging(true);    try {
      console.log('🔐 Cambiando contraseña para usuario ID:', user.id);
      
      const requestBody = {
        id_usuario: user.id,
        contrasenaActual: currentPass,
        nuevaContrasena: newPass
      };
      
      console.log('📤 Datos enviados:', requestBody);
      
      const response = await fetch('https://api.mamamianpizza.com/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Status de respuesta:', response.status);
      console.log('📡 Headers de respuesta:', response.headers);

      const result = await response.json();
      console.log('📥 Respuesta completa del servidor:', result);if (!response.ok) {
        console.error('❌ Error HTTP:', response.status, response.statusText);
        console.error('❌ Respuesta de error del servidor:', result);
        
        // Manejar errores específicos del servidor
        if (response.status === 400) {
          setError(result.message || result.error || "Datos inválidos. Verifica que la contraseña actual sea correcta.");
        } else if (response.status === 401) {
          setError(result.message || result.error || "La contraseña actual es incorrecta.");
        } else if (response.status === 404) {
          setError(result.message || result.error || "Usuario no encontrado.");
        } else if (response.status === 422) {
          setError(result.message || result.error || "Error de validación. Verifica que las contraseñas cumplan los requisitos.");
        } else {
          setError(result.message || result.error || `Error del servidor (${response.status}). Inténtalo de nuevo.`);
        }
        return;
      }

      console.log('✅ Contraseña cambiada exitosamente:', result);
      
      // Éxito
      if (onSuccess) {
        onSuccess("¡Contraseña actualizada correctamente!");
      }
      
      onClose();
      
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      setError("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="modal__overlay" style={{ zIndex: 99999 }}>
      <div className="modal__content modal__full-white" style={{ maxWidth: 500, padding: 0 }}>
        {/* Header */}
        <button className="modal__back-btn" onClick={onClose} style={{ margin: 20 }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <div className="cambiar__titulo">Cambiar Contraseña</div>
        
        <div className="cambiar__box">
          <div className="cambiar__verif-title">
            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 7, color: "#c42f2f" }} />
            Actualizar Contraseña
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form className="cambiar__pass-form" onSubmit={handleChangePass}>
            {/* Contraseña actual */}
            <div className="cambiar__pass-label">Contraseña actual</div>
            <div className="cambiar__pass-input-group">
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                className="cambiar__pass-input"
                required
                autoFocus
                placeholder="Ingresa tu contraseña actual"
              />
              <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowCurrentPass(p => !p)}>
                <FontAwesomeIcon icon={showCurrentPass ? faEye : faEyeSlash} />
              </button>
            </div>

            {/* Nueva contraseña */}
            <div className="cambiar__pass-label">Nueva contraseña</div>
            <div className="cambiar__pass-input-group">
              <input
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                className="cambiar__pass-input"
                required
                placeholder="Ingresa tu nueva contraseña"
              />
              <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowNewPass(p => !p)}>
                <FontAwesomeIcon icon={showNewPass ? faEye : faEyeSlash} />
              </button>
            </div>

            {/* Requisitos de seguridad */}
            {newPass && (
              <div className="cambiar__pass-requisitos">
                <div>Requisitos de seguridad:</div>
                <ul>
                  {requisitos.map((r, i) => (
                    <li key={i} style={{ color: r.valid ? "green" : "#c82c2c", fontWeight: 400 }}>
                      {r.msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confirmar nueva contraseña */}
            <div className="cambiar__pass-label">Confirmar nueva contraseña</div>
            <div className="cambiar__pass-input-group">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                className="cambiar__pass-input"
                required
                placeholder="Confirma tu nueva contraseña"
              />
              <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowConfirmPass(p => !p)}>
                <FontAwesomeIcon icon={showConfirmPass ? faEye : faEyeSlash} />
              </button>
            </div>

            {/* Botón guardar cambios */}
            <button
              className="cambiar__verif-btn cambiar__verif-btn--orange"
              style={{ 
                width: '100%', 
                fontWeight: 500, 
                marginTop: 24,
                opacity: (currentPass && newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) ? 1 : 0.5 
              }}
              type="submit"
              disabled={!(currentPass && newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) || changing}
            >
              {changing ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
                  Guardando cambios...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

