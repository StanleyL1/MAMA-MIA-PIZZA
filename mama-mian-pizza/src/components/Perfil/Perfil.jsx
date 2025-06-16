import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt, faCamera,
  faArrowLeft, faPhone, faEnvelope, faEye, faEyeSlash,
  faRefresh, faSpinner, faExclamationTriangle, faShoppingBag,
  faClock, faCreditCard, faTruck
} from "@fortawesome/free-solid-svg-icons";

import perfilFoto from '../../assets/perfilfoto.png';
import './Perfil.css';

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

export default function Perfil({ onAddToCart, user, setToast, onOrderUpdate }) {
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
  });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  
  // Estado de perfil del usuario - usar datos reales si están disponibles
  const [userPerfil, setUserPerfil] = useState({
    nombre: user?.nombre || 'Usuario',
    email: user?.correo || user?.email || 'usuario@email.com',
    telefono: user?.telefono || user?.celular || '+503 0000-0000',
    foto: user?.foto_perfil || user?.foto || perfilFoto,
    miembroDesde: user?.fecha_registro ? new Date(user.fecha_registro).getFullYear() : 2023,
  });

  console.log('👤 PERFIL - Usuario recibido:', user);
  console.log('👤 PERFIL - Estado userPerfil:', userPerfil);
  // Formulario de edición
  const [formData, setFormData] = useState({
    nombre: userPerfil.nombre,
    email: userPerfil.email,
    telefono: userPerfil.telefono,
  });
  const [editSuccess, setEditSuccess] = useState(false);
  
  // Estados para manejo de foto de perfil
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);// Función para obtener pedidos del usuario desde la API
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
      
      const response = await fetch(`${API_BASE_URL}/customers/${userId}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener pedidos: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Respuesta completa de la API:', data);

      // Extraer pedidos y estadísticas de la respuesta
      const pedidos = data.pedidos || [];
      const estadisticas = data.estadisticas || {};

      // Procesar los datos de pedidos
      const processedOrders = pedidos.map(order => ({
        id: order.id || order.order_id,
        fecha: order.fecha_pedido || order.created_at || order.fecha,
        productos: order.productos || order.items || order.detalles || [],
        total: parseFloat(order.total) || 0,
        estado: order.estado || order.status || 'Pendiente',
        metodo_pago: order.metodo_pago || order.payment_method || 'No especificado',
        tipo_entrega: order.tipo_entrega || order.delivery_type || 'No especificado',
        tiempo_entrega: order.tiempo_entrega || order.delivery_time || null,
        direccion: order.direccion || order.address || null,
        telefono: order.telefono || order.phone || null,
        observaciones: order.observaciones || order.notes || null,
      }));

      setUserOrders(processedOrders);

      // Usar estadísticas de la API si están disponibles, sino calcular
      const stats = {
        totalOrders: parseInt(estadisticas.totalPedidos) || processedOrders.length,
        totalSpent: parseFloat(estadisticas.totalGastado) || processedOrders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: parseFloat(estadisticas.promedioPedido) || (
          processedOrders.length > 0 
            ? processedOrders.reduce((sum, order) => sum + order.total, 0) / processedOrders.length 
            : 0
        ),
        favoriteProducts: processedOrders.reduce((count, order) => 
          count + (Array.isArray(order.productos) ? order.productos.length : 0), 0
        ),
        primerPedido: estadisticas.primerPedido,
        ultimoPedido: estadisticas.ultimoPedido,
        pedidoMinimo: parseFloat(estadisticas.pedidoMinimo) || 0,
        pedidoMaximo: parseFloat(estadisticas.pedidoMaximo) || 0,
      };

      setUserStats(stats);

      console.log('✅ Pedidos procesados:', processedOrders);
      console.log('📊 Estadísticas calculadas:', stats);

    } catch (error) {
      console.error('❌ Error al obtener pedidos:', error);
      setErrorOrders('Error al cargar los pedidos. Por favor, intenta de nuevo.');
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.id]);  // Función para actualizar perfil en la API
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
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        if (setToast) {
          setToast('Por favor selecciona un archivo de imagen válido.');
        }
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        if (setToast) {
          setToast('La imagen debe ser menor a 5MB.');
        }
        return;
      }      setSelectedImage(file);
      
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
      console.log('✅ Foto de perfil actualizada:', result);

      // Actualizar la foto en el estado local con la URL real de la API
      const newPhotoUrl = result.foto_perfil || result.foto;
      if (newPhotoUrl) {
        setUserPerfil(prev => ({
          ...prev,
          foto: newPhotoUrl
        }));

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
        fileInput.value = '';
      }

      if (setToast) {
        setToast('¡Foto de perfil actualizada correctamente!');
      }

      return true;

    } catch (error) {
      console.error('❌ Error al subir foto de perfil:', error);
      if (setToast) {
        setToast('Error al subir la foto. Intenta de nuevo.');
      }
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
      }));
    }
  }, [user]);  // Sincroniza los datos del formulario cuando el tab o usuario cambian
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
  };

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'entregado':
      case 'completed':
        return '#4caf50';
      case 'en preparacion':
      case 'preparing':
        return '#ff9800';
      case 'enviado':
      case 'shipped':
        return '#2196f3';
      case 'cancelado':
      case 'cancelled':
        return '#f44336';
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
      <div className="perfil__card">
        <div className="perfil__foto-wrapper">
          <img src={userPerfil.foto} alt="Perfil" className="perfil__foto" />
          <div className="perfil__foto-edit">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>        <div className="perfil__info">
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
      </div>

      {/* TABS */}
      <div className="perfil__tabs">
        <button className={`perfil__tab-btn${activeTab === 'pedidos' ? ' active' : ''}`} onClick={() => setActiveTab('pedidos')}>
          <FontAwesomeIcon icon={faUser} /> Mis Pedidos
        </button>        <button className={`perfil__tab-btn${activeTab === 'reseñas' ? ' active' : ''}`} onClick={() => setActiveTab('reseñas')}>
          <FontAwesomeIcon icon={faHeart} /> Mis reseñas
        </button>
        <button className={`perfil__tab-btn${activeTab === 'editar' ? ' active' : ''}`} onClick={() => setActiveTab('editar')}>
          <FontAwesomeIcon icon={faEdit} /> Editar Perfil
        </button>
        <button className={`perfil__tab-btn${activeTab === 'seguridad' ? ' active' : ''}`} onClick={() => setActiveTab('seguridad')}>
          <FontAwesomeIcon icon={faShieldAlt} /> Seguridad
        </button>
      </div>      {/* CONTENIDO SEGÚN TAB */}
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
            )}

            {errorOrders && (
              <div className="perfil__error">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                {errorOrders}
                <button className="perfil__retry-btn" onClick={handleRefreshOrders}>
                  Reintentar
                </button>
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
            )}

            {!loadingOrders && !errorOrders && userOrders.length > 0 && 
              userOrders.map(pedido => (
                <div className="perfil__pedido-card" key={pedido.id}>
                  <div className="perfil__pedido-header">
                    <div>
                      <span className="perfil__pedido-id">Pedido #{pedido.id}</span>
                      <span 
                        className="perfil__estado-badge"
                        style={{ backgroundColor: getStatusColor(pedido.estado) }}
                      >
                        {pedido.estado}
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
                      {pedido.metodo_pago}
                    </div>
                    <div className="perfil__pedido-entrega">
                      <FontAwesomeIcon icon={faTruck} />
                      {pedido.tipo_entrega}
                    </div>
                    {pedido.tiempo_entrega && (
                      <div className="perfil__pedido-tiempo">
                        <FontAwesomeIcon icon={faClock} />
                        {pedido.tiempo_entrega} min
                      </div>
                    )}
                  </div>                  {/* Productos del pedido */}
                  {Array.isArray(pedido.productos) && pedido.productos.length > 0 && (
                    <div className="perfil__pedido-productos">
                      <div className="perfil__productos-titulo">
                        Productos ({pedido.productos.length})
                      </div>
                      {pedido.productos.map((producto, index) => (
                        <div className="perfil__producto-item" key={index}>
                          {/* Imagen del producto */}
                          {(producto.imagen || producto.image || producto.img) && (
                            <div className="perfil__producto-imagen-wrapper">
                              <img 
                                src={producto.imagen || producto.image || producto.img} 
                                alt={producto.titulo || producto.nombre || producto.name || 'Producto'}
                                className="perfil__producto-imagen"
                              /> {console.log(pedido.productos)}
                            </div>
                          )}
                          
                          <div className="perfil__producto-info">
                            {/* Título del producto */}
                            <div className="perfil__producto-nombre">
                              { producto.nombre_producto}
                            </div>
                            
                            {/* Descripción del producto */}
                            {(producto.descripcion || producto.detalles || producto.description) && (
                              <div className="perfil__producto-descripcion">
                                {producto.descripcion || producto.detalles || producto.description}
                              </div>
                            )}
                            
                            {/* Cantidad */}
                            {producto.cantidad && (
                              <div className="perfil__producto-detalle">
                                Cantidad: {producto.cantidad}
                              </div>
                            )}
                            
                            {/* Masa y Tamaño */}
                            {(producto.masa || producto.tamano) && (
                              <div className="perfil__producto-detalle">
                                {producto.masa && `Masa: ${producto.masa}`}
                                {producto.masa && producto.tamano && ' • '}
                                {producto.tamano && `Tamaño: ${producto.tamano}`}
                              </div>
                            )}
                            
                            {/* Ingredientes */}
                            {producto.ingredientes && Array.isArray(producto.ingredientes) && (
                              <div className="perfil__producto-detalle">
                                Ingredientes: {producto.ingredientes.join(', ')}
                              </div>
                            )}
                            
                            {/* Instrucciones */}
                            {producto.instrucciones && (
                              <div className="perfil__producto-detalle">
                                Instrucciones: {producto.instrucciones}
                              </div>
                            )}
                          </div>
                          
                          <div className="perfil__producto-precio">
                            ${producto.subtotal || 0}
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
                          <strong>Dirección:</strong> {pedido.direccion}
                        </div>
                      )}
                      {pedido.telefono && (
                        <div className="perfil__pedido-detalle">
                          <strong>Teléfono:</strong> {pedido.telefono}
                        </div>
                      )}
                      {pedido.observaciones && (
                        <div className="perfil__pedido-detalle">
                          <strong>Observaciones:</strong> {pedido.observaciones}
                        </div>
                      )}
                    </div>
                  )}

                  <button className="perfil__pedido-detalles-btn">
                    Ver Detalles Completos
                  </button>
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
        )}        {/* --- EDITAR PERFIL --- */}
        {activeTab === 'editar' && (
          <div>
            <div className="perfil__titulo-editar">Editar Perfil</div>
              {/* Sección de foto de perfil */}
            <div className="perfil__foto-section">
              <div className="perfil__foto-title">Foto de perfil</div>
              <div className="perfil__foto-container">
                <div className="perfil__foto-preview">
                  <img 
                    src={imagePreview || userPerfil.foto} 
                    alt="Vista previa" 
                    className="perfil__foto-preview-img"
                  />
                </div>
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
                    <FontAwesomeIcon icon={uploadingImage ? faSpinner : faCamera} className={uploadingImage ? 'spinning' : ''} />
                    {uploadingImage ? 'Subiendo...' : 'Seleccionar foto'}
                  </label>
                  {uploadingImage && (
                    <div className="perfil__foto-uploading">
                      <FontAwesomeIcon icon={faSpinner} className="spinning" />
                      Actualizando foto de perfil...
                    </div>
                  )}
                </div>
              </div>
              <div className="perfil__foto-info">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                {!uploadingImage && <br />}
                {!uploadingImage && <span style={{ color: '#ab1319', fontWeight: '500' }}>La foto se actualiza automáticamente al seleccionarla</span>}
              </div>
            </div>

            <form
              className="perfil__form-editar"
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
                  if (setToast) {
                    setToast('¡Perfil actualizado correctamente!');
                  }
                  setTimeout(() => setEditSuccess(false), 3000);
                } else {
                  if (setToast) {
                    setToast('Error al actualizar el perfil. Intenta de nuevo.');
                  }
                }
              }}
            >
              <div className="perfil__form-row">
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
              </div>
              <div className="perfil__form-row">
                <div className="perfil__form-group" style={{ width: '100%' }}>
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+503 7123-4567"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="perfil__guardar-btn">
                Guardar cambios
              </button>
              {editSuccess && (
                <div className="perfil__edit-success">¡Perfil actualizado correctamente!</div>
              )}
            </form>
          </div>
        )}

        {/* --- SEGURIDAD --- */}
        {activeTab === 'seguridad' && (
          <div>
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
            {/* Información de contacto */}
            <div className="perfil__contacto-titulo">
              Información de contacto
            </div>
            <div className="perfil__contacto-cards">
              <div className="perfil__contacto-card">
                <div className="perfil__contacto-row">
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: 10, color: "#a81818" }} />
                  <div>
                    <div className="perfil__contacto-label">Teléfono</div>
                    <div className="perfil__contacto-value">{userPerfil.telefono}</div>
                  </div>
                  <button className="perfil__verificar-btn">Verificar</button>
                </div>
              </div>
              <div className="perfil__contacto-card">
                <div className="perfil__contacto-row">
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 10, color: "#a81818" }} />
                  <div>
                    <div className="perfil__contacto-label">Email</div>
                    <div className="perfil__contacto-value">{userPerfil.email}</div>
                  </div>
                  <span className="perfil__verificado-label">Verificado</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {showCambiarContra && (
        <CambiarContraseñaModal
          telefono={userPerfil.telefono}
          email={userPerfil.email}
          onClose={() => setShowCambiarContra(false)}
        />
      )}
    </div>
  );
}


// --- MODAL CAMBIAR CONTRASEÑA ---
function CambiarContraseñaModal({ telefono, email, onClose, onSuccess }) {
  const [step, setStep] = useState("select");
  const [codigo, setCodigo] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [changing, setChanging] = useState(false);

  const maskPhone = (phone) => phone ? phone.slice(0, 9) + "**" + phone.slice(-2) : "";
  const maskEmail = (mail) => {
    if (!mail) return "";
    const [user, domain] = mail.split('@');
    return user[0] + '.p***@' + domain;
  };
  const requisitos = [
    { msg: "Debe tener al menos 8 caracteres", valid: newPass.length >= 8 },
    { msg: "Debe contener al menos una letra mayúscula", valid: /[A-Z]/.test(newPass) },
    { msg: "Debe contener al menos un número", valid: /\d/.test(newPass) },
    { msg: "Debe contener al menos un carácter especial", valid: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(newPass) },
  ];

  const handleChangePass = (e) => {
    e.preventDefault();
    setChanging(true);
    setTimeout(() => {
      setChanging(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };
 return (
    <div className="modal__overlay" style={{ zIndex: 99999 }}>
      <div className="modal__content modal__full-white" style={{ maxWidth: 650, padding: 0 }}>
        {/* Header */}
        <button className="modal__back-btn" onClick={onClose} style={{ margin: 20 }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <div className="cambiar__titulo">Cambiar Contraseña</div>
        <div className="cambiar__box">
          <div className="cambiar__verif-title">
            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 7, color: "#c42f2f" }} />
            Verificación de Identidad
          </div>

          {/* Paso 1 */}
          {step === "select" && (
            <>
              <div className="cambiar__verif-sub">Selecciona cómo quieres recibir el código de verificación</div>
              {/* SMS */}
              <div className="cambiar__verif-card cambiar__verif-card--selected">
                <FontAwesomeIcon icon={faPhone} style={{ fontSize: 24, color: "#fe7d0c", marginRight: 16 }} />
                <div style={{ flex: 1 }}>
                  <div className="cambiar__verif-label">SMS al teléfono</div>
                  <div className="cambiar__verif-value">{maskPhone(telefono)}</div>
                </div>
                <button className="cambiar__verif-btn cambiar__verif-btn--orange" onClick={() => setStep("codigo")}>
                  Enviar SMS
                </button>
              </div>
              {/* Email */}
              <div className="cambiar__verif-card">
                <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: 24, color: "#b7262b", marginRight: 16 }} />
                <div style={{ flex: 1 }}>
                  <div className="cambiar__verif-label">Email</div>
                  <div className="cambiar__verif-value">{maskEmail(email)}</div>
                </div>
                <button className="cambiar__verif-btn" onClick={() => setStep("codigo")}>
                  Enviar Email
                </button>
              </div>
            </>
          )}

          {/* Paso 2: Código */}
          {step === "codigo" && (
            <form className="cambiar__codigo-form" onSubmit={e => { e.preventDefault(); setStep("nueva"); }}>
              <div className="cambiar__verif-sub" style={{ marginBottom: 16 }}>Código de verificación</div>
              <input
                className="cambiar__codigo-input"
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="123456"
                maxLength={6}
                style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5em',
                  width: '100%',
                  marginBottom: 18
                }}
                autoFocus
                required
              />
              <button className="cambiar__verif-btn cambiar__verif-btn--orange" style={{ width: '100%', fontWeight: 500 }} type="submit">
                Verificar código
              </button>
            </form>
          )}

          {/* Paso 3: Nueva contraseña */}
          {step === "nueva" && (
            <form className="cambiar__pass-form" onSubmit={handleChangePass}>
              <div className="cambiar__pass-label">Nueva contraseña</div>
              <div className="cambiar__pass-input-group">
                <input
                  type={showPass ? "text" : "password"}
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="cambiar__pass-input"
                  required
                  autoFocus
                />
                <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowPass(p => !p)}>
                  <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
                </button>
              </div>
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
              <div className="cambiar__pass-label">Confirmar contraseña</div>
              <div className="cambiar__pass-input-group">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="cambiar__pass-input"
                  required
                />
                <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowConfirm(p => !p)}>
                  <FontAwesomeIcon icon={showConfirm ? faEye : faEyeSlash} />
                </button>
              </div>
              <button
                className="cambiar__verif-btn cambiar__verif-btn--orange"
                style={{ width: '100%', fontWeight: 500, marginTop: 18, opacity: (newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) ? 1 : 0.5 }}
                type="submit"
                disabled={!(newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) || changing}
              >
                Cambiar contraseña
              </button>
            </form>
          )}

         
        </div>
      </div>
    </div>
  );
}

