import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt, faPhone, faMapMarkerAlt, 
   faCalendarAlt, faEye, faEyeSlash, faLock, faEnvelope, faCamera
} from "@fortawesome/free-solid-svg-icons";

import './Perfil.css';
import { obtenerResenasUsuario } from '../../services/resenasService';
import { obtenerExperienciasUsuario } from '../../services/experienciasService';
import ModalExperiencia from '../CrearExperiencia/ModalExperiencia';

export default function Perfil({ onAddToCart, user, setToast, onOrderUpdate, updateUser }) {
  const navigate = useNavigate();
  // Tabs: pedidos | reseñas | editar | seguridad
  const [activeTab, setActiveTab] = useState('pedidos');
  
  const [profileMessage, setProfileMessage] = useState(''); // Mensaje local para mostrar abajo de la foto
  const [profileMessageType, setProfileMessageType] = useState('success'); // 'success' o 'error'
    // Estados para editar perfil
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: ''
  });
  // Estados para cambiar foto
  const [photoMode, setPhotoMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  // Estados para pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [errorPedidos, setErrorPedidos] = useState(null);
  // Estados para reseñas
  const [resenas, setResenas] = useState([]);
  const [loadingResenas, setLoadingResenas] = useState(false);
  const [errorResenas, setErrorResenas] = useState(null);
  const [userResenasInfo, setUserResenasInfo] = useState(null);
  // Estados para experiencias
  const [experiencias, setExperiencias] = useState([]);
  const [loadingExperiencias, setLoadingExperiencias] = useState(false);
  const [errorExperiencias, setErrorExperiencias] = useState(null);

  // Estado para modal de crear experiencia
  const [isModalExperienciaOpen, setIsModalExperienciaOpen] = useState(false);

  // Estados para cambiar contraseña
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });  // Función helper para mostrar mensajes locales
  const showProfileMessage = (message, type = 'success') => {
    setProfileMessage(message);
    setProfileMessageType(type);
    setTimeout(() => setProfileMessage(''), 3000);
  };
  // Función para renderizar estrellas
  const renderEstrellas = (valoracion) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= valoracion) {
        estrellas.push(<span key={i} className="perfil__estrella">⭐</span>);
      } else {
        estrellas.push(<span key={i} className="perfil__estrella-vacia">☆</span>);
      }
    }
    return estrellas;
  };

  // Función para obtener el estado de experiencia
  const getEstadoExperiencia = (estado) => {
    return estado === 1 ? 'aprobada' : 'pendiente';
  };// Obtener pedidos del usuario
  const fetchPedidos = useCallback(async () => {
    if (!user?.id) return;
    
    setLoadingPedidos(true);
    setErrorPedidos(null);
    
    try {
      const response = await fetch(`https://api.mamamianpizza.com/api/orders/orders/user/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      
      const data = await response.json();
      
      // Extraer el array de pedidos del payload
      if (data.message && data.pedidos && Array.isArray(data.pedidos)) {
        setPedidos(data.pedidos);
      } else {
        // Fallback si la estructura es diferente
        setPedidos([]);
      }
      
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      setErrorPedidos('Error al cargar los pedidos');
      setPedidos([]);
    } finally {
      setLoadingPedidos(false);
    }
  }, [user?.id]);

  // Obtener reseñas del usuario
  const fetchResenas = useCallback(async () => {
    if (!user?.id) return;
    
    setLoadingResenas(true);
    setErrorResenas(null);
    
    try {
      const data = await obtenerResenasUsuario(user.id);
      
      if (data.message && data.resenas && Array.isArray(data.resenas)) {
        setResenas(data.resenas);
        setUserResenasInfo(data.usuario);
      } else {
        setResenas([]);
        setUserResenasInfo(null);
      }
      
    } catch (error) {
      console.error('Error fetching reseñas:', error);
      setErrorResenas('Error al cargar las reseñas');
      setResenas([]);
      setUserResenasInfo(null);
    } finally {      setLoadingResenas(false);
    }
  }, [user?.id]);

  // Obtener experiencias del usuario
  const fetchExperiencias = useCallback(async () => {
    if (!user?.id) return;
    
    setLoadingExperiencias(true);
    setErrorExperiencias(null);
    
    try {
      const data = await obtenerExperienciasUsuario(user.id);
      
      if (data.message && data.experiencias && Array.isArray(data.experiencias)) {
        setExperiencias(data.experiencias);
      } else {
        setExperiencias([]);
      }
      
    } catch (error) {
      console.error('Error fetching experiencias:', error);
      setErrorExperiencias('Error al cargar las experiencias');
      setExperiencias([]);
    } finally {
      setLoadingExperiencias(false);
    }
  }, [user?.id]);
  // Función para refrescar tanto reseñas como experiencias
  const refreshResenasYExperiencias = () => {
    fetchResenas();
    fetchExperiencias();
  };

  // Manejar creación de nueva experiencia
  const handleExperienciaCreada = (nuevaExperiencia) => {
    setToast({
      message: '¡Experiencia creada exitosamente!',
      type: 'success'
    });
    
    // Refrescar la lista de experiencias
    fetchExperiencias();
    
    // Cerrar modal
    setIsModalExperienciaOpen(false);
  };

  // Abrir modal de crear experiencia
  const handleAbrirModalExperiencia = () => {
    setIsModalExperienciaOpen(true);
  };

  // Cerrar modal de crear experiencia
  const handleCerrarModalExperiencia = () => {
    setIsModalExperienciaOpen(false);
  };
  // Redirigir al login si no hay usuario logueado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Inicializar formulario con datos del usuario o datos de ejemplo
      setFormData({
        nombre: user.nombre || 'Juan Carlos García',
        telefono: user.telefono || '+57 300 123 4567',
        direccion: user.direccion || 'Calle 123 #45-67, Bogotá'
      });
        // Cargar pedidos, reseñas y experiencias del usuario
      fetchPedidos();
      fetchResenas();
      fetchExperiencias();
    }
  }, [user, navigate, fetchPedidos, fetchResenas, fetchExperiencias]);

  // Manejar cambios en el formulario de perfil
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de foto
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedPhoto(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        showProfileMessage('Por favor selecciona un archivo de imagen válido', 'error');
      }
    }
  };

  // Guardar nueva foto
  const handleSavePhoto = () => {
    if (selectedPhoto) {
      // Simular guardado de foto
      const updatedUser = {
        ...user,
        foto: photoPreview
      };
      
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setPhotoMode(false);
      setSelectedPhoto(null);
      setPhotoPreview(null);
      showProfileMessage('Foto de perfil actualizada correctamente');
      if (setToast) {
        setToast({ message: 'Foto de perfil actualizada correctamente', type: 'success' });
      }
    }
  };  // Cancelar cambio de foto
  const handleCancelPhoto = () => {
    setPhotoMode(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el color del estado
  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'entregado':
        return 'perfil__estado-entregado';
      case 'preparando':
        return 'perfil__estado-preparando';
      case 'enviado':
        return 'perfil__estado-enviado';
      case 'pendiente':
        return 'perfil__estado-preparando';
      case 'cancelado':
        return 'perfil__estado-cancelado';
      default:
        return 'perfil__estado-preparando';
    }
  };

  // Guardar cambios en el perfil
  const handleSaveProfile = () => {
    if (!formData.nombre.trim()) {
      showProfileMessage('El nombre es requerido', 'error');
      return;
    }

    // Simular actualización
    const updatedUser = {
      ...user,
      ...formData
    };
    
    if (updateUser) {
      updateUser(updatedUser);
    }
    
    setEditMode(false);
    showProfileMessage('Perfil actualizado correctamente');
    if (setToast) {
      setToast({ message: 'Perfil actualizado correctamente', type: 'success' });
    }
  };

  // Cambiar contraseña
  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showProfileMessage('Todos los campos son requeridos', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showProfileMessage('Las contraseñas no coinciden', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showProfileMessage('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    // Simular cambio de contraseña
    setPasswordMode(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    showProfileMessage('Contraseña cambiada correctamente');
    if (setToast) {
      setToast({ message: 'Contraseña cambiada correctamente', type: 'success' });
    }
  };

  // Si no hay usuario, no renderizar nada (se está redirigiendo)
  if (!user) {
    return null;
  }

  return (
    <div className="perfil__main">      {/* CARD DE PERFIL */}
      <div className="perfil__card">        <div className="perfil__foto-wrapper">
          <img 
            src={user.foto || "/assets/Usuario.png"} 
            alt="Foto de perfil" 
            className="perfil__foto"
          />
        </div>
        
        <div className="perfil__info">
          <h2 className="perfil__nombre">{user.nombre || 'Juan Carlos García'}</h2>
          <p className="perfil__email">{user.email || 'juan.garcia@ejemplo.com'}</p>
          
          <div className="perfil__datos">
            <span>
              <FontAwesomeIcon icon={faPhone} />
              {user.telefono || '+57 300 123 4567'}
            </span>
            <span>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              {user.direccion || 'Calle 123 #45-67, Bogotá'}
            </span>
            <span>
              <FontAwesomeIcon icon={faCalendarAlt} />
              Miembro desde {user.fechaRegistro || 'Enero 2024'}
            </span>
          </div>
          
          {profileMessage && (
            <div className={`perfil__message ${profileMessageType === 'error' ? 'error' : 'success'}`}>
              {profileMessage}
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="perfil__tabs">
        <button className={`perfil__tab-btn${activeTab === 'pedidos' ? ' active' : ''}`} onClick={() => setActiveTab('pedidos')}>
          <FontAwesomeIcon icon={faUser} /> <span className="perfil__tab-text">Mis Pedidos</span>
        </button>          <button className={`perfil__tab-btn${activeTab === 'reseñas' ? ' active' : ''}`} onClick={() => setActiveTab('reseñas')}>
          <FontAwesomeIcon icon={faHeart} /> <span className="perfil__tab-text">Mis reseñas y experiencias</span>
        </button>
        <button className={`perfil__tab-btn${activeTab === 'editar' ? ' active' : ''}`} onClick={() => setActiveTab('editar')}>
          <FontAwesomeIcon icon={faEdit} /> <span className="perfil__tab-text">Perfil</span>
        </button>
        <button className={`perfil__tab-btn${activeTab === 'seguridad' ? ' active' : ''}`} onClick={() => setActiveTab('seguridad')}>
          <FontAwesomeIcon icon={faShieldAlt} /> <span className="perfil__tab-text">Seguridad</span>
        </button>
      </div>

      {/* CONTENIDO SEGÚN TAB */}
      <div className="perfil__contenido">        {/* --- HISTORIAL DE PEDIDOS --- */}
        {activeTab === 'pedidos' && (
          <div className="perfil__pedidos-section">
            <div className="perfil__titulo-historial">
              Historial de Pedidos
              <button 
                className="perfil__refresh-btn"
                onClick={fetchPedidos}
                disabled={loadingPedidos}
              >
                <FontAwesomeIcon icon={faUser} className={loadingPedidos ? 'spinning' : ''} />
                {loadingPedidos ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            
            {/* Estadísticas */}
            <div className="perfil__estadisticas">
              <div className="perfil__estadistica-card">
                <div className="perfil__estadistica-numero">{pedidos.length}</div>
                <div className="perfil__estadistica-label">Pedidos Totales</div>
              </div>
              <div className="perfil__estadistica-card">
                <div className="perfil__estadistica-numero">
                  ${pedidos.reduce((total, pedido) => total + parseFloat(pedido.total || 0), 0).toFixed(2)}
                </div>
                <div className="perfil__estadistica-label">Total Gastado</div>
              </div>
              <div className="perfil__estadistica-card">
                <div className="perfil__estadistica-numero">
                  {pedidos.filter(p => p.estado === 'entregado').length > 0 ? '5★' : '-'}
                </div>
                <div className="perfil__estadistica-label">Calificación Promedio</div>
              </div>
            </div>

            {/* Estados de carga y error */}
            {loadingPedidos && (
              <div className="perfil__loading">
                <FontAwesomeIcon icon={faUser} className="spinning" />
                Cargando pedidos...
              </div>
            )}

            {errorPedidos && (
              <div className="perfil__error">
                <span>❌ {errorPedidos}</span>
                <button className="perfil__retry-btn" onClick={fetchPedidos}>
                  Reintentar
                </button>
              </div>
            )}

            {/* Lista de pedidos */}
            {!loadingPedidos && !errorPedidos && pedidos.length > 0 && (
              pedidos.map((pedido) => (
                <div key={pedido.id_pedido} className="perfil__pedido-card">
                  <div className="perfil__pedido-header">
                    <div className="perfil__pedido-id">{pedido.codigo_pedido}</div>
                    <div className={getEstadoClass(pedido.estado)}>
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </div>
                  </div>
                  <div className="perfil__pedido-total">${parseFloat(pedido.total).toFixed(2)}</div>
                  <div className="perfil__pedido-fecha">
                    {formatearFecha(pedido.fecha_pedido)}
                  </div>
                  
                  <div className="perfil__pedido-info">
                    <div className="perfil__pedido-cliente">
                      <strong>Cliente:</strong> {pedido.nombre_cliente}
                    </div>
                    <div className="perfil__pedido-direccion">
                      <strong>Dirección:</strong> {pedido.direccion}
                    </div>
                    <div className="perfil__pedido-pago">
                      <strong>Método de pago:</strong> {pedido.metodo_pago}
                    </div>
                    {pedido.tiempo_estimado_entrega && (
                      <div className="perfil__pedido-tiempo">
                        <strong>Tiempo estimado:</strong> {pedido.tiempo_estimado_entrega} minutos
                      </div>
                    )}
                  </div>

                  <div className="perfil__pedido-resumen">
                    <div className="perfil__pedido-resumen-left">
                      <div className="perfil__pedido-subtotal">Subtotal: ${parseFloat(pedido.subtotal).toFixed(2)}</div>
                      <div className="perfil__pedido-envio">Envío: ${parseFloat(pedido.costo_envio).toFixed(2)}</div>
                      <div className="perfil__pedido-impuestos">Impuestos: ${parseFloat(pedido.impuestos).toFixed(2)}</div>
                    </div>
                    <div className="perfil__pedido-total-final">${parseFloat(pedido.total).toFixed(2)}</div>
                  </div>

                  {pedido.notas_adicionales && (
                    <div className="perfil__pedido-notas">
                      <strong>Notas:</strong> {pedido.notas_adicionales}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Estado vacío */}
            {!loadingPedidos && !errorPedidos && pedidos.length === 0 && (
              <div className="perfil__empty">
                <FontAwesomeIcon icon={faUser} />
                <h3>No tienes pedidos aún</h3>
                <p>¡Realiza tu primer pedido y disfruta de nuestras deliciosas pizzas!</p>
                <button 
                  className="perfil__empty-btn"
                  onClick={() => navigate('/menu')}
                >
                  Ver Menú
                </button>
              </div>
            )}
          </div>        )}{/* --- MIS RESEÑAS Y EXPERIENCIAS --- */}
        {activeTab === 'reseñas' && (
          <div className="perfil__reseñas-section">
            <div className="perfil__titulo-historial">
              Mis Reseñas y Experiencias
              <button 
                className="perfil__refresh-btn"
                onClick={refreshResenasYExperiencias}
                disabled={loadingResenas || loadingExperiencias}
                title="Actualizar reseñas y experiencias"
              >
                🔄
              </button>
            </div>
              {/* Información del usuario sobre reseñas y experiencias */}
            {(userResenasInfo || experiencias.length > 0) && (
              <div className="perfil__resenas-stats">
                {userResenasInfo && (
                  <>
                    <div className="perfil__stat-item">
                      <span className="perfil__stat-number">{userResenasInfo.total_resenas}</span>
                      <span className="perfil__stat-label">Total reseñas</span>
                    </div>
                    <div className="perfil__stat-item">
                      <span className="perfil__stat-number">{userResenasInfo.resenas_aprobadas}</span>
                      <span className="perfil__stat-label">Reseñas aprobadas</span>
                    </div>
                    <div className="perfil__stat-item">
                      <span className="perfil__stat-number">{userResenasInfo.resenas_pendientes}</span>
                      <span className="perfil__stat-label">Reseñas pendientes</span>
                    </div>
                  </>
                )}
                <div className="perfil__stat-item">
                  <span className="perfil__stat-number">{experiencias.length}</span>
                  <span className="perfil__stat-label">Total experiencias</span>
                </div>
                <div className="perfil__stat-item">
                  <span className="perfil__stat-number">
                    {experiencias.filter(exp => exp.estado === 1).length}
                  </span>
                  <span className="perfil__stat-label">Experiencias aprobadas</span>
                </div>
                <div className="perfil__stat-item">
                  <span className="perfil__stat-number">
                    {experiencias.filter(exp => exp.estado === 0).length}
                  </span>
                  <span className="perfil__stat-label">Experiencias pendientes</span>
                </div>
              </div>
            )}            {/* Estado de carga */}
            {(loadingResenas || loadingExperiencias) && (
              <div className="perfil__loading">
                <p>Cargando reseñas y experiencias...</p>
              </div>
            )}

            {/* Error */}
            {(errorResenas || errorExperiencias) && (
              <div className="perfil__error">
                {errorResenas && <p>{errorResenas}</p>}
                {errorExperiencias && <p>{errorExperiencias}</p>}
                <button 
                  className="perfil__retry-btn"
                  onClick={refreshResenasYExperiencias}
                >
                  Reintentar
                </button>
              </div>
            )}            {/* Lista de reseñas y experiencias */}
            {!loadingResenas && !loadingExperiencias && !errorResenas && !errorExperiencias && (resenas.length > 0 || experiencias.length > 0) && (
              <div className="perfil__contenido-container">
                
                {/* Sección de Reseñas */}
                {resenas.length > 0 && (
                  <div className="perfil__seccion">
                    <h3 className="perfil__seccion-titulo">🍕 Mis Reseñas de Productos</h3>
                    <div className="perfil__resenas-list">
                      {resenas.map((resena) => (
                        <div key={`resena-${resena.id_resena}`} className="perfil__reseña-card">
                          <div className="perfil__reseña-header">
                            <div className="perfil__reseña-producto">{resena.nombre_producto}</div>
                            <div className="perfil__reseña-estrellas">
                              {renderEstrellas(resena.valoracion)}
                            </div>
                          </div>
                          <div className="perfil__reseña-meta">
                            <div className="perfil__reseña-fecha">
                              {formatearFecha(resena.fecha_creacion)}
                            </div>
                            <div className={`perfil__reseña-estado ${resena.aprobada ? 'aprobada' : 'pendiente'}`}>
                              {resena.estado}
                            </div>
                          </div>
                          <p className="perfil__reseña-comentario">
                            "{resena.comentario}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}                {/* Sección de Experiencias */}
                {experiencias.length > 0 && (
                  <div className="perfil__seccion">
                    <h3 className="perfil__seccion-titulo">✨ Mis Experiencias</h3>
                    <div className="perfil__experiencias-list">
                      {experiencias.map((experiencia) => (
                        <div key={`experiencia-${experiencia.id}`} className="perfil__experiencia-card">
                          <div className="perfil__experiencia-header">
                            <div className="perfil__experiencia-titulo">{experiencia.titulo}</div>
                            <div className="perfil__experiencia-estrellas">
                              {renderEstrellas(experiencia.valoracion)}
                            </div>
                          </div>
                          <div className="perfil__experiencia-meta">
                            <div className="perfil__experiencia-fecha">
                              {formatearFecha(experiencia.fecha_creacion)}
                            </div>
                            <div className={`perfil__experiencia-estado ${getEstadoExperiencia(experiencia.estado)}`}>
                              {experiencia.estado === 1 ? 'aprobada' : 'pendiente'}
                            </div>
                          </div>
                          <p className="perfil__experiencia-contenido">
                            "{experiencia.contenido}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}            {/* Sin reseñas ni experiencias */}
            {!loadingResenas && !loadingExperiencias && !errorResenas && !errorExperiencias && resenas.length === 0 && experiencias.length === 0 && (
              <div className="perfil__empty-state">
                <p>Aún no has dejado ninguna reseña ni experiencia.</p>
                <div className="perfil__add-reseña">
                  <h4>¿Quieres compartir tu experiencia?</h4>
                  <p>Comparte tus reseñas de productos y experiencias con otros usuarios</p>
                  <div className="perfil__empty-actions">
                    <button 
                      className="perfil__empty-btn"
                      onClick={() => navigate('/menu')}
                    >
                      Ver Menú para Reseñar
                    </button>                    <button 
                      className="perfil__empty-btn"
                      onClick={handleAbrirModalExperiencia}
                    >
                      Compartir Experiencia
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- EDITAR PERFIL --- */}
        {activeTab === 'editar' && (
          <div className="perfil__editar-section">            <div className="perfil__titulo-editar">Editar Perfil</div>
            
            <div className="perfil__form-container">
              {/* Sección de foto de perfil */}
              <div className="perfil__photo-section">
                <h4 className="perfil__section-title">Foto de Perfil</h4>
                <div className="perfil__photo-container">
                  <div className="perfil__photo-preview">
                    <img 
                      src={photoPreview || user.foto || "/assets/Usuario.png"} 
                      alt="Vista previa"
                      className="perfil__photo-preview-img"
                    />
                  </div>
                  
                  {!photoMode ? (
                    <button 
                      className="perfil__btn-secondary"
                      onClick={() => setPhotoMode(true)}
                    >
                      <FontAwesomeIcon icon={faCamera} />
                      Cambiar Foto
                    </button>
                  ) : (
                    <div className="perfil__photo-controls">
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="photo-upload" className="perfil__btn-secondary">
                        <FontAwesomeIcon icon={faCamera} />
                        Seleccionar Foto
                      </label>
                      
                      {selectedPhoto && (
                        <div className="perfil__photo-actions">
                          <button 
                            className="perfil__btn-primary"
                            onClick={handleSavePhoto}
                          >
                            Guardar Foto
                          </button>
                          <button 
                            className="perfil__btn-secondary"
                            onClick={handleCancelPhoto}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faUser} />
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  className={`perfil__input ${!editMode ? 'disabled' : ''}`}
                />
              </div>              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || 'juan.garcia@ejemplo.com'}
                  disabled
                  className="perfil__input disabled"
                />
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faPhone} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  className={`perfil__input ${!editMode ? 'disabled' : ''}`}
                />
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  className={`perfil__input ${!editMode ? 'disabled' : ''}`}
                />
              </div>

              <div className="perfil__form-actions">
                {!editMode ? (
                  <button 
                    className="perfil__btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Editar Información
                  </button>
                ) : (
                  <div className="perfil__edit-actions">
                    <button 
                      className="perfil__btn-secondary"                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          nombre: user.nombre || 'Juan Carlos García',
                          telefono: user.telefono || '+57 300 123 4567',
                          direccion: user.direccion || 'Calle 123 #45-67, Bogotá'
                        });
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      className="perfil__btn-primary"
                      onClick={handleSaveProfile}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SEGURIDAD --- */}
        {activeTab === 'seguridad' && (
          <div className="perfil__seguridad-section">
            <div className="perfil__titulo-seguridad">Seguridad</div>
            
            <div className="perfil__form-container">
              <div className="perfil__security-item">
                <div className="perfil__security-info">
                  <h4>Cambiar Contraseña</h4>
                  <p>Actualiza tu contraseña para mantener tu cuenta segura</p>
                </div>
                
                {!passwordMode ? (
                  <button 
                    className="perfil__btn-primary"
                    onClick={() => setPasswordMode(true)}
                  >
                    <FontAwesomeIcon icon={faLock} />
                    Cambiar Contraseña
                  </button>
                ) : (
                  <div className="perfil__password-form">
                    <div className="perfil__form-row">
                      <label className="perfil__label">Contraseña actual</label>
                      <div className="perfil__password-input">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="perfil__input"
                        />
                        <button
                          type="button"
                          className="perfil__password-toggle"
                          onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                        >
                          <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>

                    <div className="perfil__form-row">
                      <label className="perfil__label">Nueva contraseña</label>
                      <div className="perfil__password-input">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="perfil__input"
                        />
                        <button
                          type="button"
                          className="perfil__password-toggle"
                          onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                        >
                          <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>

                    <div className="perfil__form-row">
                      <label className="perfil__label">Confirmar nueva contraseña</label>
                      <div className="perfil__password-input">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="perfil__input"
                        />
                        <button
                          type="button"
                          className="perfil__password-toggle"
                          onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                        >
                          <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>

                    <div className="perfil__edit-actions">
                      <button 
                        className="perfil__btn-secondary"
                        onClick={() => {
                          setPasswordMode(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="perfil__btn-primary"
                        onClick={handleChangePassword}
                      >
                        Cambiar Contraseña
                      </button>
                    </div>
                  </div>
                )}
              </div>            </div>
          </div>
        )}
      </div>

      {/* Modal para crear experiencia */}
      <ModalExperiencia 
        isOpen={isModalExperienciaOpen}
        onClose={handleCerrarModalExperiencia}
        user={user}
        onExperienciaCreada={handleExperienciaCreada}
        setToast={setToast}
      />
    </div>
  );
}

