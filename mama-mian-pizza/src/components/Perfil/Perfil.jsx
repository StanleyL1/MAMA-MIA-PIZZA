import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt, faPhone, faMapMarkerAlt, 
   faCalendarAlt, faLock, faEnvelope, faCamera, faSpinner, faSync
} from "@fortawesome/free-solid-svg-icons";

import './Perfil.css';
import { obtenerResenasUsuario } from '../../services/resenasService';
import { obtenerExperienciasUsuario } from '../../services/experienciasService';
import { useUsuario } from '../../hooks/useUsuario';
import ModalExperiencia from '../CrearExperiencia/ModalExperiencia';

export default function Perfil({ onAddToCart, user, setToast, onOrderUpdate, updateUser }) {
  const navigate = useNavigate();  // Hook para manejar información del usuario
  const {
    userInfo,
    loading: loadingUserInfo,
    error: errorUserInfo,
    fetchUserInfo,
    updateUserInfo,
    updateProfilePhoto,
    changePassword
  } = useUsuario();
    // Tabs: pedidos | reseñas | editar | seguridad
  const [activeTab, setActiveTab] = useState('pedidos');
  
  // Estados para errores específicos de edición
  const [photoError, setPhotoError] = useState('');
  // Estados para editar perfil
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    fecha_nacimiento: '',
    sexo: '',
    dui: ''
  });  // Estados para información del usuario desde API se manejan en el hook useUsuario
  // Estados para cambiar foto
  const [photoMode, setPhotoMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [savingPhoto, setSavingPhoto] = useState(false);
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
  const [passwordMode, setPasswordMode] = useState(false);  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Función helper para mostrar mensajes usando toast
  const showProfileMessage = useCallback((message, type = 'success') => {
    // Usar toast para mostrar el mensaje
    if (setToast && typeof setToast === 'function') {
      setToast(message);
    }
  }, [setToast]);
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
  };

  // Obtener pedidos del usuario
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
    // Verificar que setToast existe y es una función antes de usarla
    if (setToast && typeof setToast === 'function') {
      setToast('¡Experiencia creada exitosamente!');
    }
    
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
  };  // Redirigir al login si no hay usuario logueado
  useEffect(() => {
    if (!user) {
      console.log('No hay usuario logueado, redirigiendo al login');
      navigate('/login');
    } else {
      console.log('Usuario logueado detectado:', user);
      console.log('Iniciando carga de información del usuario con ID:', user.id);
      
      // Cargar información del usuario desde la API real
      fetchUserInfo(user.id)
        .then((userData) => {
          console.log('Información del usuario cargada exitosamente:', userData);
            // Inicializar formData con los datos reales del usuario desde la API
          const newFormData = {
            nombre: userData.nombre || '',
            celular: userData.celular || '',
            fecha_nacimiento: formatearFechaNacimiento(userData.fecha_nacimiento) || '',
            sexo: userData.sexo || '',
            dui: userData.dui || ''
          };
          
          console.log('Inicializando formulario con datos:', newFormData);
          setFormData(newFormData);
        })
        .catch(error => {
          console.error('Error al cargar información del usuario:', error);
          // Mostrar mensaje de error al usuario
          showProfileMessage('Error al cargar la información del usuario. Por favor, inténtalo de nuevo.', 'error');
        });
      
      // Cargar pedidos, reseñas y experiencias del usuario
      console.log('Cargando datos adicionales del usuario...');
      fetchPedidos();
      fetchResenas();
      fetchExperiencias();
    }
  }, [user, navigate, fetchUserInfo, fetchPedidos, fetchResenas, fetchExperiencias, showProfileMessage]);

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
  };  // Manejar selección de foto
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setPhotoError('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF)');
        return;
      }

      // Validar tamaño del archivo (5MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        setPhotoError('El archivo es demasiado grande. El tamaño máximo permitido es 5MB');
        return;
      }

      setSelectedPhoto(file);
      setPhotoError(''); // Limpiar errores previos
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.onerror = () => {
        setPhotoError('Error al leer el archivo. Por favor intenta de nuevo.');
      };
      reader.readAsDataURL(file);
    }
  };  // Guardar nueva foto
  const handleSavePhoto = async () => {
    if (selectedPhoto && userInfo?.id_usuario) {
      setSavingPhoto(true);
      try {
        const result = await updateProfilePhoto(userInfo.id_usuario, selectedPhoto);
        console.log('📸 PERFIL - Foto actualizada exitosamente:', result);
        
        // Obtener la URL de la nueva foto
        let newPhotoUrl = null;
        if (result && result.foto_perfil) {
          newPhotoUrl = result.foto_perfil;
        } else {
          // Si no viene en el resultado, obtener datos actualizados del usuario
          try {
            const updatedUserData = await fetchUserInfo(userInfo.id_usuario);
            newPhotoUrl = updatedUserData.foto_perfil;
          } catch (fetchError) {
            console.error('Error al obtener datos actualizados:', fetchError);
          }
        }
          if (newPhotoUrl) {
          console.log('📸 PERFIL - Nueva URL de foto obtenida:', newPhotoUrl);
          
          // FASE 1: Disparar evento inmediato para actualización instantánea
          const immediateEvent = new CustomEvent('immediatePhotoUpdate', {
            detail: { photo: newPhotoUrl }
          });
          window.dispatchEvent(immediateEvent);
          console.log('⚡ PERFIL - Evento immediatePhotoUpdate disparado');
          
          // FASE 2: Disparar evento estándar con más información
          const photoEvent = new CustomEvent('profilePhotoUpdated', {
            detail: { 
              newPhoto: newPhotoUrl,
              userId: userInfo.id_usuario,
              timestamp: Date.now()
            }
          });
          window.dispatchEvent(photoEvent);
          console.log('📸 PERFIL - Evento profilePhotoUpdated disparado');
          
          // FASE 3: Actualizar localStorage inmediatamente
          try {
            const savedUser = localStorage.getItem('mamamia_user');
            if (savedUser) {
              const parsedUser = JSON.parse(savedUser);
              const updatedUser = { 
                ...parsedUser, 
                foto_perfil: newPhotoUrl, 
                foto: newPhotoUrl 
              };
              localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
              console.log('💾 PERFIL - localStorage actualizado con nueva foto');
              
              // Disparar evento de storage manualmente para asegurar sincronización
              const storageEvent = new CustomEvent('storage', {
                detail: { key: 'mamamia_user', newValue: JSON.stringify(updatedUser) }
              });
              window.dispatchEvent(storageEvent);
              console.log('📦 PERFIL - Evento storage disparado manualmente');
            }
          } catch (storageError) {
            console.error('❌ Error al actualizar localStorage:', storageError);
          }
          
          // FASE 4: Llamar updateUser si está disponible
          if (updateUser && typeof updateUser === 'function') {
            updateUser({ foto_perfil: newPhotoUrl, foto: newPhotoUrl });
            console.log('🔄 PERFIL - updateUser llamado con nueva foto');
          }
            // FASE 5: El estado visual del perfil se actualiza automáticamente
          // a través del refetch de userInfo que ya se hace en updateProfilePhoto
          console.log('🔄 PERFIL - Estado se actualizará automáticamente');
        }
        
        setPhotoMode(false);
        setSelectedPhoto(null);
        setPhotoPreview(null);
        setPhotoError(''); // Limpiar errores
          
        // Verificar que setToast existe y es una función antes de usarla
        if (setToast && typeof setToast === 'function') {
          setToast('Foto de perfil actualizada correctamente');
        }
      } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        setPhotoError('Error al actualizar la foto de perfil. Por favor intenta de nuevo.');
          
        // Verificar que setToast existe y es una función antes de usarla
        if (setToast && typeof setToast === 'function') {
          setToast('Error al actualizar la foto de perfil');
        }
      } finally {
        setSavingPhoto(false);
      }
    }
  };// Cancelar cambio de foto
  const handleCancelPhoto = () => {
    setPhotoMode(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setPhotoError(''); // Limpiar errores
    setSavingPhoto(false); // Resetear estado de guardado
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

  // Función para formatear fecha de nacimiento
  const formatearFechaNacimiento = (fechaISO) => {
    if (!fechaISO) return null;
    
    try {
      const fecha = new Date(fechaISO);
      // Verificar que la fecha es válida
      if (isNaN(fecha.getTime())) return null;
      
      // Formatear como YYYY-MM-DD para el input de tipo date
      return fecha.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error al formatear fecha de nacimiento:', error);
      return null;
    }
  };

  // Función para formatear fecha para mostrar al usuario
  const formatearFechaParaMostrar = (fechaISO) => {
    if (!fechaISO) return 'Fecha de nacimiento no registrada';
    
    try {
      const fecha = new Date(fechaISO);
      // Verificar que la fecha es válida
      if (isNaN(fecha.getTime())) return 'Fecha inválida';
      
      // Formatear como DD/MM/YYYY
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha para mostrar:', error);
      return 'Fecha inválida';
    }
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
  };  // Guardar cambios en el perfil
  const handleSaveProfile = async () => {
    console.log('=== INICIANDO GUARDADO DE PERFIL ===');
    console.log('formData:', formData);
    console.log('userInfo:', userInfo);
    
    if (!formData.nombre.trim()) {
      console.log('Error: Nombre vacío');
      showProfileMessage('El nombre es requerido', 'error');
      return;
    }
    
    if (!userInfo?.id_usuario) {
      console.log('Error: No hay id_usuario en userInfo');
      showProfileMessage('Error: No se pudo obtener la información del usuario', 'error');
      return;
    }    try {      
      const updateData = {
        nombre: formData.nombre,
        correo: userInfo.correo, // Mantener el correo existente
        telefono: formData.celular,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        sexo: formData.sexo || null
      };

      // Solo agregar campos opcionales si tienen valor
      if (formData.dui) {
        updateData.dui = formData.dui;
      }

      console.log('Datos a enviar al servidor:', updateData);
      console.log('ID de usuario:', userInfo.id_usuario);
      
      const result = await updateUserInfo(userInfo.id_usuario, updateData);
      console.log('Resultado de la actualización:', result);
      
      setEditMode(false);
      showProfileMessage('Perfil actualizado correctamente');
      
      if (setToast && typeof setToast === 'function') {
        setToast('Perfil actualizado correctamente');
      }
      
      console.log('=== GUARDADO EXITOSO ===');
    } catch (error) {
      console.error('=== ERROR AL GUARDAR PERFIL ===');
      console.error('Error completo:', error);
      console.error('Mensaje del error:', error.message);
      
      showProfileMessage('Error al actualizar el perfil', 'error');
      
      if (setToast && typeof setToast === 'function') {
        setToast('Error al actualizar el perfil');
      }
    }
  };// Cambiar contraseña
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showProfileMessage('Todos los campos son requeridos', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showProfileMessage('Las contraseñas no coinciden', 'error');
      return;
    }

    // Validaciones de seguridad para la nueva contraseña
    if (passwordData.newPassword.length < 8) {
      showProfileMessage('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    // Verificar que tenga al menos una letra mayúscula
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      showProfileMessage('La contraseña debe contener al menos una letra mayúscula', 'error');
      return;
    }    // Verificar que tenga al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordData.newPassword)) {
      showProfileMessage('La contraseña debe contener al menos un carácter especial (!@#$%^&*)', 'error');
      return;
    }if (!userInfo?.id_usuario) {
      showProfileMessage('Error: No se pudo obtener la información del usuario', 'error');
      return;
    }    try {      
      const passwordUpdateData = {
        nombre: userInfo.nombre,
        correo: userInfo.correo,
        telefono: userInfo.celular || '',
        fecha_nacimiento: userInfo.fecha_nacimiento || null,
        sexo: userInfo.sexo || null,
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      };

      // Solo agregar DUI si existe
      if (userInfo.dui) {
        passwordUpdateData.dui = userInfo.dui;
      }

      console.log('Datos para cambio de contraseña:', passwordUpdateData);

      await changePassword(userInfo.id_usuario, passwordUpdateData);
      
      setPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showProfileMessage('Contraseña cambiada correctamente');      if (setToast && typeof setToast === 'function') {
        setToast('Contraseña cambiada correctamente');
      }
    } catch (error) {
      showProfileMessage('Error al cambiar la contraseña', 'error');      if (setToast && typeof setToast === 'function') {
        setToast('Error al cambiar la contraseña');
      }
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
            src={userInfo?.foto_perfil || "/assets/Usuario.png"} 
            alt="Foto de perfil" 
            className="perfil__foto"
          />
          {loadingUserInfo && (
            <div className="perfil__loading-overlay">
              <FontAwesomeIcon icon={faUser} className="spinning" />
            </div>
          )}
        </div>          <div className="perfil__info">
          <h2 className="perfil__nombre">
            {loadingUserInfo ? 'Cargando...' : (userInfo?.nombre || user?.nombre || 'Usuario')}
          </h2>
          <p className="perfil__email">
            {loadingUserInfo ? 'Cargando...' : (userInfo?.correo || user?.email || 'No disponible')}
          </p>
          
          <div className="perfil__datos">
            <span>
              <FontAwesomeIcon icon={faPhone} />
              {loadingUserInfo ? 'Cargando...' : (userInfo?.celular || 'No disponible')}
            </span>
            {userInfo?.dui && (
              <span>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                DUI: {userInfo.dui}
              </span>
            )}
            {userInfo?.fecha_nacimiento && (
              <span>
                <FontAwesomeIcon icon={faCalendarAlt} />
                Nacimiento: {formatearFechaParaMostrar(userInfo.fecha_nacimiento)}
              </span>
            )}
            {userInfo?.sexo && (
              <span>
                <FontAwesomeIcon icon={faUser} />
                {userInfo.sexo === 'M' ? 'Masculino' : userInfo.sexo === 'F' ? 'Femenino' : userInfo.sexo}
              </span>
            )}
          </div>          {/* Error de carga de usuario */}
          {errorUserInfo && (
            <div className="perfil__message error">
              {errorUserInfo}
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
          <div className="perfil__pedidos-section">            <div className="perfil__titulo-historial">
              Historial de Pedidos
              <button 
                className="perfil__refresh-btn"
                onClick={fetchPedidos}
                disabled={loadingPedidos}
              >
                <FontAwesomeIcon icon={faSync} className={loadingPedidos ? 'spinning' : ''} />
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
              Mis Reseñas y Experiencias              <button
                className="perfil__refresh-btn"
                onClick={refreshResenasYExperiencias}
                disabled={loadingResenas || loadingExperiencias}
                title="Actualizar reseñas y experiencias"
              >
                <FontAwesomeIcon icon={faSync} />
              </button>
            </div>              {/* Información del usuario sobre reseñas y experiencias */}
            <div className="perfil__resenas-stats">
              <div className="perfil__stat-item">
                <span className="perfil__stat-number">
                  {userResenasInfo ? userResenasInfo.total_resenas : resenas.length}
                </span>
                <span className="perfil__stat-label">Total reseñas</span>
              </div>
              <div className="perfil__stat-item">
                <span className="perfil__stat-number">
                  {userResenasInfo ? userResenasInfo.resenas_aprobadas : resenas.filter(r => r.aprobada || r.estado === 'aprobada').length}
                </span>
                <span className="perfil__stat-label">Reseñas aprobadas</span>
              </div>
              <div className="perfil__stat-item">
                <span className="perfil__stat-number">
                  {userResenasInfo ? userResenasInfo.resenas_pendientes : resenas.filter(r => !r.aprobada && r.estado !== 'aprobada').length}
                </span>
                <span className="perfil__stat-label">Reseñas pendientes</span>
              </div>
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
            </div>{/* Estado de carga */}
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
            
            <div className="perfil__form-container">              {/* Sección de foto de perfil */}
              <div className="perfil__photo-section">
                <h4 className="perfil__section-title">
                  <FontAwesomeIcon icon={faCamera} />
                  Foto de Perfil
                </h4>
                <div className="perfil__photo-container">                  <div className="perfil__photo-preview">
                    <img 
                      src={photoPreview || userInfo?.foto_perfil || "/assets/Usuario.png"} 
                      alt="Vista previa"
                      className="perfil__photo-preview-img"
                    />                    {/* Estado de carga */}
                    {savingPhoto && (
                      <div className="perfil__photo-loading">
                        <FontAwesomeIcon icon={faSpinner} className="spinning" />
                      </div>
                    )}
                  </div>
                  
                  <div className="perfil__photo-controls">
                    {!photoMode ? (
                      <button 
                        className="perfil__photo-change-btn"
                        onClick={() => setPhotoMode(true)}
                      >
                        <FontAwesomeIcon icon={faCamera} />
                        Cambiar Foto
                      </button>
                    ) : (
                      <>
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="photo-upload">
                          <FontAwesomeIcon icon={faCamera} />
                          {selectedPhoto ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                        </label>
                          {selectedPhoto && (
                          <div className="perfil__photo-actions">                            <button 
                              className="perfil__photo-action-btn perfil__photo-action-btn--save"
                              onClick={handleSavePhoto}
                              disabled={!selectedPhoto || savingPhoto}
                            >
                              <FontAwesomeIcon icon={savingPhoto ? faSpinner : faCamera} className={savingPhoto ? 'spinning' : ''} />
                              {savingPhoto ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button 
                              className="perfil__photo-action-btn perfil__photo-action-btn--cancel"
                              onClick={handleCancelPhoto}
                              disabled={savingPhoto}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Error de foto */}
                {photoError && (
                  <div className="perfil__message error">
                    {photoError}
                  </div>
                )}

                {/* Información adicional */}
                {photoMode && !selectedPhoto && (
                  <div className="perfil__photo-info">
                    <p><strong>Formatos aceptados:</strong> JPG, PNG, GIF</p>
                    <p><strong>Tamaño máximo:</strong> 5MB</p>
                    <p><strong>Recomendación:</strong> Imagen cuadrada para mejor resultado</p>
                  </div>
                )}
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
                </label>                <input
                  type="email"
                  value={loadingUserInfo ? 'Cargando...' : (userInfo?.correo || 'No disponible')}
                  disabled
                  className="perfil__input disabled"
                />
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faPhone} />
                  Teléfono/Celular
                </label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  className={`perfil__input ${!editMode ? 'disabled' : ''}`}
                  placeholder="Número de teléfono"
                />
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  className={`perfil__input ${!editMode ? 'disabled' : ''}`}
                />
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faUser} />
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  className={`perfil__input ${!editMode ? 'disabled' : ''}`}
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faUser} />
                  DUI
                </label>
                <input
                  type="text"
                  name="dui"
                  value={formData.dui}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  className={`perfil__input ${!editMode ? 'disabled' : ''}`}
                  placeholder="00000000-0"
                  maxLength="10"
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
                  <div className="perfil__edit-actions">                    <button 
                      className="perfil__btn-secondary"                      onClick={() => {
                        setEditMode(false);                        // Resetear formData con la información actual del usuario
                        if (userInfo) {
                          setFormData({
                            nombre: userInfo.nombre || '',
                            celular: userInfo.celular || '',
                            fecha_nacimiento: formatearFechaNacimiento(userInfo.fecha_nacimiento) || '',
                            sexo: userInfo.sexo || '',
                            dui: userInfo.dui || ''
                          });
                        }
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      className="perfil__btn-primary"
                      onClick={handleSaveProfile}
                      disabled={loadingUserInfo}
                    >
                      {loadingUserInfo ? 'Guardando...' : 'Guardar Cambios'}
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
                  <div className="perfil__password-form">                    <div className="perfil__form-row">
                      <label className="perfil__label">Contraseña actual</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="perfil__input"
                      />
                    </div>                    <div className="perfil__form-row">
                      <label className="perfil__label">Nueva contraseña</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="perfil__input"
                        placeholder="Ingresa tu nueva contraseña"
                      />
                      <div className="perfil__password-requirements">
                        <small>
                          <strong>Requisitos de contraseña:</strong>
                          <ul>
                            <li>Mínimo 8 caracteres</li>
                            <li>Al menos una letra mayúscula</li>
                            <li>Al menos un carácter especial (!@#$%^&*)</li>
                          </ul>
                        </small>
                      </div>
                    </div><div className="perfil__form-row">
                      <label className="perfil__label">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="perfil__input"
                      />
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
                      </button>                      <button 
                        className="perfil__btn-primary"
                        onClick={handleChangePassword}
                        disabled={loadingUserInfo}
                      >
                        {loadingUserInfo ? 'Cambiando...' : 'Cambiar Contraseña'}
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

