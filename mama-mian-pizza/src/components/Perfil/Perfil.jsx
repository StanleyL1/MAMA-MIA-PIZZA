import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt, faPhone, faMapMarkerAlt, 
   faCalendarAlt, faLock, faEnvelope, faCamera, faSpinner, faSync,
   faTrash, faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

import './Perfil.css';
import { obtenerResenasUsuario } from '../../services/resenasService';
import { obtenerExperienciasUsuario } from '../../services/experienciasService';
import { useUsuario } from '../../hooks/useUsuario';
import ModalExperiencia from '../CrearExperiencia/ModalExperiencia';
import Toast from '../Toast/Toast';

export default function Perfil({ onAddToCart, user, setToast, onOrderUpdate, updateUser }) {
  const navigate = useNavigate();  // Hook para manejar información del usuario
  const {
    userInfo,
    loading: loadingUserInfo,
    error: errorUserInfo,
    fetchUserInfo,
    updateUserInfo,
    updateProfilePhoto
  } = useUsuario();
    // Tabs: pedidos | reseñas | editar | seguridad
  const [activeTab, setActiveTab] = useState('pedidos');
  
  // Estados para errores específicos de edición
  const [photoError, setPhotoError] = useState('');
  // Estados para editar perfil
  const [editMode, setEditMode] = useState(false);  const [formData, setFormData] = useState({
    nombre: '',
    celular: ''
  });// Estados para información del usuario desde API se manejan en el hook useUsuario
  // Estados para cambiar foto
  const [photoMode, setPhotoMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [savingPhoto, setSavingPhoto] = useState(false);  // Estados para pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
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
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  // Estados para desactivar cuenta
  const [deactivateMode, setDeactivateMode] = useState(false);
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);
  const [deactivateData, setDeactivateData] = useState({
    motivo: '',
    confirmacion: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estado local para el Toast del perfil
  const [profileToast, setProfileToast] = useState({ show: false, message: '', type: 'success' });
  // Función helper para mostrar mensajes usando toast
  const showProfileMessage = useCallback((message, type = 'success') => {
    // Usar solo el toast local para mostrar el mensaje en el perfil
    setProfileToast({ show: true, message, type });
    setTimeout(() => setProfileToast({ show: false, message: '', type: 'success' }), 4000);
  }, []);
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
  };  // Manejar creación de nueva experiencia
  const handleExperienciaCreada = (nuevaExperiencia) => {
    showProfileMessage('¡Experiencia creada exitosamente!', 'success');
    
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
          console.log('Información del usuario cargada exitosamente:', userData);            // Inicializar formData con los datos reales del usuario desde la API
          const newFormData = {
            nombre: userData.nombre || '',
            celular: userData.celular || ''
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
  };
  
  // Manejar cambios en el formulario de desactivación
  const handleDeactivateChange = (e) => {
    const { name, value } = e.target;
    setDeactivateData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar selección de foto
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
        
        showProfileMessage('Foto de perfil actualizada correctamente', 'success');      } catch (error) {        console.error('Error al actualizar la foto de perfil:', error);
        setPhotoError('Error al actualizar la foto de perfil. Por favor intenta de nuevo.');
        
        showProfileMessage('Error al actualizar la foto de perfil', 'error');
      } finally {
        setSavingPhoto(false);
      }
    }
  };

  // Cancelar cambio de foto
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
        fecha_nacimiento: userInfo.fecha_nacimiento || null, // Mantener fecha existente
        sexo: userInfo.sexo || null // Mantener sexo existente
      };

      // Mantener DUI existente si lo hay
      if (userInfo.dui) {
        updateData.dui = userInfo.dui;
      }console.log('Datos a enviar al servidor:', updateData);
      console.log('ID de usuario:', userInfo.id_usuario);
        const result = await updateUserInfo(userInfo.id_usuario, updateData);
      console.log('Resultado de la actualización:', result);
      
      // Disparar evento para actualizar el nombre en el navbar en tiempo real
      const profileUpdateEvent = new CustomEvent('profileDataUpdated', {
        detail: {
          nombre: updateData.nombre,
          email: updateData.correo,
          telefono: updateData.telefono,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(profileUpdateEvent);
      console.log('📝 PERFIL - Evento profileDataUpdated disparado con nombre:', updateData.nombre);
      
      // También actualizar localStorage inmediatamente para sincronización
      try {
        const savedUser = localStorage.getItem('mamamia_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const updatedUser = { 
            ...parsedUser, 
            nombre: updateData.nombre,
            correo: updateData.correo,
            telefono: updateData.telefono,
            celular: updateData.telefono
          };
          localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
          console.log('💾 PERFIL - localStorage actualizado con nuevos datos');
        }
      } catch (storageError) {
        console.error('❌ Error al actualizar localStorage:', storageError);
      }
      
      // Llamar updateUser si está disponible para actualizar el estado del App
      if (updateUser && typeof updateUser === 'function') {
        updateUser({ 
          nombre: updateData.nombre,
          correo: updateData.correo,
          telefono: updateData.telefono,
          celular: updateData.telefono
        });
        console.log('🔄 PERFIL - updateUser llamado con nuevos datos');
      }
      
      setEditMode(false);
      showProfileMessage('Perfil actualizado correctamente');
      
      console.log('=== GUARDADO EXITOSO ===');
    } catch (error) {
      console.error('=== ERROR AL GUARDAR PERFIL ===');
      console.error('Error completo:', error);      console.error('Mensaje del error:', error.message);
      
      showProfileMessage('Error al actualizar el perfil', 'error');
    }
  };  // Cambiar contraseña
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
    }

    // Verificar que tenga al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(passwordData.newPassword)) {
      showProfileMessage('La contraseña debe contener al menos un carácter especial (!@#$%^&*)', 'error');
      return;
    }

    if (!userInfo?.id_usuario) {
      showProfileMessage('Error: No se pudo obtener la información del usuario', 'error');
      return;
    }    try {
      setLoadingPassword(true);
      
      const payload = {
        id_usuario: userInfo.id_usuario,
        contrasenaActual: passwordData.currentPassword,
        nuevaContrasena: passwordData.newPassword
      };
      
      console.log('Enviando payload para cambio de contraseña:', payload);
      
      // Usar el nuevo endpoint para cambiar contraseña
      const response = await fetch('https://api.mamamianpizza.com/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        console.log('Response text (no JSON):', textResult);
        result = { message: textResult || 'Error del servidor' };
      }

      console.log('Response result:', result);

      if (!response.ok) {
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
        
        // Proporcionar mensajes de error más específicos
        let errorMessage = 'Error al cambiar la contraseña';
        
        if (response.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
        } else if (response.status === 401) {
          errorMessage = 'La contraseña actual es incorrecta.';
        } else if (response.status === 400) {
          errorMessage = result.message || 'Datos inválidos. Verifica los campos.';
        } else if (result.message) {
          errorMessage = result.message;
        }
        
        throw new Error(errorMessage);
      }

      console.log('Contraseña cambiada exitosamente:', result);
      
      setPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''      });
      
      showProfileMessage('Contraseña cambiada correctamente', 'success');    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      showProfileMessage(error.message || 'Error al cambiar la contraseña', 'error');
    } finally {
      setLoadingPassword(false);
    }
  };

  // Desactivar cuenta
  const handleDeactivateAccount = async () => {
    if (!deactivateData.motivo.trim()) {
      showProfileMessage('El motivo es requerido', 'error');
      return;
    }

    if (deactivateData.confirmacion !== 'DESACTIVAR') {
      showProfileMessage('Debes escribir "DESACTIVAR" para confirmar', 'error');
      return;
    }

    if (!userInfo?.id_usuario) {
      showProfileMessage('Error: No se pudo obtener la información del usuario', 'error');
      return;
    }

    try {
      setLoadingDeactivate(true);
      
      const payload = {
        id_usuario: userInfo.id_usuario,
        motivo: deactivateData.motivo
      };
      
      console.log('Enviando payload para desactivar cuenta:', payload);
      
      const response = await fetch('https://api.mamamianpizza.com/api/account/deactivate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        console.log('Response text (no JSON):', textResult);
        result = { message: textResult || 'Error del servidor' };
      }

      console.log('Response result:', result);      // Manejar respuestas del servidor
      if (!response.ok) {
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
        
        // Si la cuenta ya está desactivada, también cerrar sesión
        if (result.message && result.message.includes('ya está desactivada')) {
          console.log('La cuenta ya estaba desactivada, cerrando sesión...');
          showProfileMessage('Tu cuenta ya estaba desactivada. Cerrando sesión...', 'info');
          
          // Cerrar sesión inmediatamente
          setTimeout(() => {
            localStorage.removeItem('mamamia_user');
            localStorage.removeItem('mamamia_token');
            navigate('/');
            window.location.reload();
          }, 1500);
          
          return; // Salir de la función
        }
        
        let errorMessage = 'Error al desactivar la cuenta';
        
        if (response.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
        } else if (response.status === 404) {
          errorMessage = 'Usuario no encontrado.';
        } else if (response.status === 400) {
          errorMessage = result.message || 'Datos inválidos. Verifica los campos.';
        } else if (result.message) {
          errorMessage = result.message;
        }
        
        throw new Error(errorMessage);
      }

      // Verificar si la respuesta es exitosa o si indica que ya estaba desactivada
      if (result.success === true || (result.message && result.message.includes('ya está desactivada'))) {
        console.log('Cuenta desactivada exitosamente o ya estaba desactivada:', result);
        
        const mensaje = result.success === true 
          ? 'Cuenta desactivada exitosamente. Cerrando sesión...' 
          : 'Tu cuenta ya estaba desactivada. Cerrando sesión...';
            showProfileMessage(mensaje, 'success');

        // Limpiar localStorage y redirigir después de 2 segundos
        setTimeout(() => {
          localStorage.removeItem('mamamia_user');
          localStorage.removeItem('mamamia_token');
          
          // Disparar evento para notificar al resto de la aplicación
          const logoutEvent = new CustomEvent('userLogout', {
            detail: { reason: 'account_deactivated' }
          });
          window.dispatchEvent(logoutEvent);
          
          navigate('/');
          window.location.reload(); // Forzar recarga para limpiar estado
        }, 2000);
      } else {
        throw new Error(result.message || 'Error desconocido al desactivar la cuenta');
      }
        } catch (error) {
      console.error('Error al desactivar la cuenta:', error);
      showProfileMessage(error.message || 'Error al desactivar la cuenta', 'error');
    } finally {
      setLoadingDeactivate(false);
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
      </div>      {/* Notificaciones generales */}
      {profileToast.show && (
        <Toast
          message={profileToast.message}
          type={profileToast.type}
          category="profile"
          position="top-left"
          onClose={() => setProfileToast({ show: false, message: '', type: 'success' })}
        />
      )}

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
            </div>            {/* Estados de carga */}
            {loadingPedidos && (
              <div className="perfil__loading">
                <FontAwesomeIcon icon={faUser} className="spinning" />
                Cargando pedidos...
              </div>
            )}            {/* Lista de pedidos */}
            {!loadingPedidos && pedidos.length > 0 && (
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
            )}            {/* Estado vacío */}
            {!loadingPedidos && pedidos.length === 0 && (
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
        )}        {/* --- EDITAR PERFIL --- */}
        {activeTab === 'editar' && (
          <div className="perfil__editar-section">            <div className="perfil__titulo-editar-container">
              <div className="perfil__titulo-editar">Editar Perfil</div>
            </div>
            
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
              </div>              <div className="perfil__form-row">
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
                  placeholder="Ingresa tu nombre completo"
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
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email (Bloqueado)
                </label>
                <input
                  type="email"
                  value={loadingUserInfo ? 'Cargando...' : (userInfo?.correo || 'No disponible')}
                  disabled
                  className="perfil__input disabled"
                  title="El correo electrónico no puede ser modificado por seguridad"
                />
                <small className="perfil__field-note">
                  El correo electrónico no puede ser modificado por razones de seguridad
                </small>
              </div>              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faUser} />
                  DUI (Bloqueado)
                </label>
                <input
                  type="text"
                  value={loadingUserInfo ? 'Cargando...' : (userInfo?.dui || 'No disponible')}
                  disabled
                  className="perfil__input disabled"
                  placeholder="00000000-0"
                  title="El DUI no puede ser modificado por seguridad"
                />
                <small className="perfil__field-note">
                  El DUI no puede ser modificado por razones de seguridad
                </small>
              </div>

              <div className="perfil__form-row">
                <label className="perfil__label">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Fecha de Nacimiento (Bloqueado)
                </label>
                <input
                  type="text"
                  value={loadingUserInfo ? 'Cargando...' : (userInfo?.fecha_nacimiento ? formatearFechaParaMostrar(userInfo.fecha_nacimiento) : 'No disponible')}
                  disabled
                  className="perfil__input disabled"
                  title="La fecha de nacimiento no puede ser modificada por seguridad"
                />
                <small className="perfil__field-note">
                  La fecha de nacimiento no puede ser modificada por razones de seguridad
                </small>
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
                            celular: userInfo.celular || ''
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
        )}        {/* --- SEGURIDAD --- */}
        {activeTab === 'seguridad' && (
          <div className="perfil__seguridad-section">            <div className="perfil__titulo-seguridad-container">
              <div className="perfil__titulo-seguridad">Seguridad</div>
            </div>
            
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
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="perfil__input"
                      />
                    </div>

                    <div className="perfil__form-row">
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
                    </div>

                    <div className="perfil__form-row">
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
                        disabled={loadingPassword}
                      >
                        Cancelar
                      </button>

                      <button 
                        className="perfil__btn-primary"
                        onClick={handleChangePassword}
                        disabled={loadingPassword}
                      >
                        {loadingPassword ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="spinning" />
                            Cambiando...
                          </>
                        ) : (
                          'Cambiar Contraseña'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>              {/* Sección de desactivar cuenta */}
              <div className="perfil__security-item perfil__security-item--danger">
                <div className="perfil__security-info">
                  <h4>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Desactivar Cuenta
                  </h4>
                  <p>Esta acción desactivará tu cuenta. Podrás reactivarla contactando al soporte.</p>
                  <div className="perfil__warning">
                    <strong>⚠️ Advertencia:</strong> Al desactivar tu cuenta:
                    <ul>
                      <li>No podrás iniciar sesión</li>
                      <li>Tus pedidos anteriores se mantendrán en el historial</li>
                      <li>Tus reseñas y experiencias permanecerán públicas</li>
                      <li>Para reactivar deberás contactar al soporte</li>
                    </ul>
                  </div>
                </div>
                  {!deactivateMode ? (
                  <button 
                    className="perfil__btn-danger"
                    onClick={() => setDeactivateMode(true)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Desactivar Cuenta
                  </button>
                ) : (
                  <div className="perfil__deactivate-form">
                    <div className="perfil__form-row">
                      <label className="perfil__label">Motivo de desactivación *</label>
                      <textarea
                        name="motivo"
                        value={deactivateData.motivo}
                        onChange={handleDeactivateChange}
                        className="perfil__textarea"
                        placeholder="Explica brevemente por qué deseas desactivar tu cuenta..."
                        rows="4"
                        maxLength="500"
                      />
                      <small className="perfil__field-note">
                        {deactivateData.motivo.length}/500 caracteres
                      </small>
                    </div>

                    <div className="perfil__form-row">
                      <label className="perfil__label">
                        Confirmación *
                      </label>
                      <input
                        type="text"
                        name="confirmacion"
                        value={deactivateData.confirmacion}
                        onChange={handleDeactivateChange}
                        className="perfil__input"
                        placeholder='Escribe "DESACTIVAR" para confirmar'
                      />
                      <small className="perfil__field-note">
                        Debes escribir exactamente "DESACTIVAR" para confirmar la acción
                      </small>
                    </div>

                    <div className="perfil__edit-actions">
                      <button 
                        className="perfil__btn-secondary"
                        onClick={() => {
                          setDeactivateMode(false);
                          setDeactivateData({
                            motivo: '',
                            confirmacion: ''
                          });
                        }}
                        disabled={loadingDeactivate}
                      >
                        Cancelar
                      </button>

                      <button 
                        className="perfil__btn-danger"
                        onClick={handleDeactivateAccount}
                        disabled={loadingDeactivate || !deactivateData.motivo.trim() || deactivateData.confirmacion !== 'DESACTIVAR'}
                      >
                        {loadingDeactivate ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="spinning" />
                            Desactivando...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faTrash} />
                            Confirmar Desactivación
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

