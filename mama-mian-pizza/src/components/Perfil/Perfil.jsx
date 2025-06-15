import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt, faCamera,
  faArrowLeft, faPhone, faEnvelope, faEye, faEyeSlash,
  faRefresh, faSpinner, faExclamationTriangle, faShoppingBag,
  faClock, faCreditCard, faTruck, faStar, faCommentDots
} from "@fortawesome/free-solid-svg-icons";

import perfilFoto from '../../assets/perfilfoto.png';
import './Perfil.css';

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

export default function Perfil({ onAddToCart, user, setToast, onOrderUpdate, setUser }) {
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
  const [errorOrders, setErrorOrders] = useState(null);  const [updateMessage, setUpdateMessage] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState('');
  
  // Estados para manejo de foto de perfil
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // Estados para reseñas del usuario
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorReviews, setErrorReviews] = useState(null);
    // Estado de perfil del usuario - usar datos reales si están disponibles
  const [userPerfil, setUserPerfil] = useState({
    nombre: user?.nombre || 'Usuario',
    email: user?.correo || user?.email || 'usuario@email.com',
    telefono: user?.telefono || user?.celular || '+503 0000-0000',
    foto: user?.foto_perfil || user?.foto || user?.profilePhoto || perfilFoto,
    miembroDesde: user?.fecha_registro ? new Date(user.fecha_registro).getFullYear() : 2023,
  });  console.log('👤 PERFIL - Usuario recibido:', user);
  console.log('👤 PERFIL - Estado userPerfil:', userPerfil);
  console.log('🖼️ PERFIL - Foto actual:', {
    userFoto: user?.foto,
    userFotoPerfil: user?.foto_perfil,
    userProfilePhoto: user?.profilePhoto,
    perfilFoto: userPerfil.foto
  });

  // Variable derivada para el ID del usuario (evita warnings de ESLint)
  const userId = user?.id || user?.id_usuario;

  // Formulario de edición
  const [formData, setFormData] = useState({
    nombre: userPerfil.nombre,
    email: userPerfil.email,
    telefono: userPerfil.telefono,
  });
  const [editSuccess, setEditSuccess] = useState(false);  // Función para obtener pedidos del usuario desde la API
  const fetchUserOrders = useCallback(async () => {
    // Verificar que tenemos el ID del usuario
    if (!userId) {
      console.log('❌ No hay ID de usuario para obtener pedidos');
      return;
    }

    setLoadingOrders(true);
    setErrorOrders(null);

    try {
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
      setErrorOrders('Error al cargar los pedidos. Por favor, intenta de nuevo.');    } finally {
      setLoadingOrders(false);
    }
  }, [userId]);
  // Función para actualizar perfil en la API
  const updateUserProfile = async (updatedData) => {
    // Verificar que tenemos el ID del usuario
    if (!userId) {
      console.log('❌ No hay ID de usuario para actualizar perfil');
      console.log('👤 Usuario disponible:', user);
      setToast && setToast('Error: No se pudo identificar el usuario');
      return false;
    }

    setIsUpdatingProfile(true);
    setProfileUpdateError(''); // Limpiar errores previos

    try {      console.log('🔄 INICIANDO actualización de perfil...');
      console.log('👤 Usuario actual:', user);
      console.log('🆔 UserId disponible:', userId);
      console.log('📝 Datos a actualizar:', updatedData);      // Preparar datos para enviar a la API - usando nombres de columnas exactos de la BD
      const dataToSend = {
        nombre: updatedData.nombre.trim(),
        correo: updatedData.email.trim(),
        celular: updatedData.telefono.trim(), // En la BD es 'celular', no 'telefono'
      };
      
      // Incluir foto si está presente en los datos actualizados
      if (updatedData.foto) {
        dataToSend.foto_perfil = updatedData.foto;
        console.log('📸 Incluyendo foto en la actualización:', updatedData.foto.substring(0, 50) + '...');
      }
      
      console.log('📤 Datos preparados para envío (con nombres de columnas de BD):', {
        ...dataToSend,
        foto_perfil: dataToSend.foto_perfil ? '[BASE64_DATA_INCLUDED]' : 'NO_PHOTO'
      });
      console.log('📝 Tipos de datos:', {
        nombre: typeof dataToSend.nombre,
        correo: typeof dataToSend.correo,
        celular: typeof dataToSend.celular,
        foto_perfil: typeof dataToSend.foto_perfil
      });// Usar el endpoint correcto: PUT /api/users/:id/profile
      // Usar el ID de usuario ya disponible en el scope superior
      const url = `${API_BASE_URL}/users/${userId}/profile`;
      console.log('🌐 URL del endpoint:', url);
      console.log('👤 ID de usuario usado:', userId);
      
      const requestConfig = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token de autorización si existe en el usuario
          ...(user.token && { 'Authorization': `Bearer ${user.token}` })
        },
        body: JSON.stringify(dataToSend),
      };
        console.log('⚙️ Configuración de la petición:', {
        method: requestConfig.method,
        headers: requestConfig.headers,
        url: url,
        bodySize: JSON.stringify(dataToSend).length + ' bytes',
        includesPhoto: !!dataToSend.foto_perfil
      });
      
      // Log específico para verificar el envío de la foto
      if (dataToSend.foto_perfil) {
        console.log('📸 ✅ FOTO INCLUIDA en la petición al endpoint PUT /api/users/:id/profile');
        console.log('📏 Tamaño de la foto Base64:', dataToSend.foto_perfil.length + ' caracteres');
      } else {
        console.log('📸 ❌ NO hay foto en esta petición');
      }
      
      console.log('🚀 Enviando petición a la API...');
      const response = await fetch(url, requestConfig);
      
      console.log('📥 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });      // Intentar leer la respuesta de manera segura
      let responseData;
      const responseClone = response.clone(); // Clonar para evitar "body stream already read"
      
      try {
        responseData = await response.json();
        console.log('📄 Datos de respuesta JSON:', responseData);
      } catch (jsonError) {
        console.log('⚠️ No se pudo parsear JSON, intentando como texto...', jsonError.message);
        try {
          responseData = await responseClone.text();
          console.log('📄 Respuesta como texto:', responseData);
        } catch (textError) {
          console.error('❌ Error leyendo respuesta:', textError);
          responseData = { error: 'No se pudo leer la respuesta del servidor' };
        }
      }if (!response.ok) {
        console.error('❌ Error del servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        // Manejar diferentes tipos de errores
        let errorMessage = 'Error desconocido al actualizar el perfil';
          if (response.status === 500) {
          if (responseData?.error?.includes('Unknown column')) {
            errorMessage = 'Error interno del servidor: Problema con la estructura de la base de datos. Por favor, contacta al administrador.';
            console.error('🚨 Error de base de datos:', responseData.error);
          } else if (typeof responseData === 'string' && responseData.includes('Something broke!')) {
            errorMessage = 'Error del servidor: La imagen es muy grande o el servidor no pudo procesarla. Inténtalo con una imagen más pequeña.';
            console.error('🚨 Error de servidor (posiblemente por tamaño de imagen)');
          } else {
            errorMessage = 'Error interno del servidor. La imagen podría ser muy grande. Por favor, intenta con una imagen más pequeña.';
          }
        } else if (response.status === 404) {
          errorMessage = 'Usuario no encontrado. Por favor, inicia sesión nuevamente.';
        } else if (response.status === 400) {
          errorMessage = responseData?.message || 'Datos inválidos. Verifica la información ingresada.';
        } else if (response.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else {
          errorMessage = responseData?.message || 
                       responseData?.error || 
                       `Error ${response.status}: No se pudo actualizar el perfil`;
        }
        
        throw new Error(errorMessage);
      }      console.log('✅ Perfil actualizado exitosamente en la API:', responseData);      // Actualizar el estado local del perfil inmediatamente
      const updatedProfile = {
        nombre: updatedData.nombre,
        email: updatedData.email,
        telefono: updatedData.telefono,
      };
      
      // Si hay una nueva foto, incluirla
      if (updatedData.foto) {
        updatedProfile.foto = updatedData.foto;
      }

      setUserPerfil(prev => {
        const newPerfil = {
          ...prev,
          ...updatedProfile
        };
        console.log('🔄 Actualizando userPerfil state:', newPerfil);
        return newPerfil;
      });

      // Si se proporciona setUser, actualizar el contexto global del usuario
      if (setUser) {        const updatedUser = {
          ...user,
          nombre: updatedData.nombre,
          correo: updatedData.email,
          email: updatedData.email, // mantener ambos formatos por compatibilidad
          telefono: updatedData.telefono,
          celular: updatedData.telefono, // mantener ambos formatos por compatibilidad
        };
          // Si hay nueva foto, incluirla
        if (updatedData.foto) {
          updatedUser.foto_perfil = updatedData.foto;
          updatedUser.foto = updatedData.foto;
          updatedUser.profilePhoto = updatedData.foto; // Campo adicional para compatibilidad
        }
        
        console.log('🔄 Actualizando usuario en el contexto global:', updatedUser);
        setUser(updatedUser);
        
        // Actualizar también en localStorage para persistencia
        try {
          localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
          console.log('✅ Usuario guardado en localStorage:', updatedUser);
        } catch (error) {
          console.error('❌ Error al guardar en localStorage:', error);
        }
      }      console.log('✅ Perfil actualizado completamente - Estado local y global actualizados');

      // Forzar recarga inmediata del perfil desde el servidor para sincronización
      await fetchUserProfile();

      return true;

    } catch (error) {      console.error('❌ Error completo al actualizar perfil:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setToast && setToast(`Error: ${error.message}`);
      setProfileUpdateError(error.message);
      return false;
    } finally {
      setIsUpdatingProfile(false);
    }
  };  // Función para obtener reseñas del usuario desde la API
  const fetchUserReviews = useCallback(async () => {
    // Verificar que tenemos el ID del usuario
    if (!userId) {
      console.log('❌ No hay ID de usuario para obtener reseñas');
      return;
    }

    setLoadingReviews(true);
    setErrorReviews(null);

    try {
      console.log('🔍 Obteniendo reseñas para usuario ID:', userId);
      
      const response = await fetch(`${API_BASE_URL}/resenas/usuario/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener reseñas: ${response.status}`);
      }

      const data = await response.json();
      console.log('⭐ Respuesta completa de reseñas:', data);

      // Extraer reseñas de la respuesta
      const reseñas = data.resenas || [];
      
      // Procesar los datos de reseñas
      const processedReviews = reseñas.map(review => ({
        id: review.id_resena,
        producto: {
          id: review.id_producto,
          nombre: review.nombre_producto
        },
        comentario: review.comentario,
        valoracion: review.valoracion,
        fecha: review.fecha_creacion,
        fechaFormateada: new Date(review.fecha_creacion).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }));

      setUserReviews(processedReviews);
      console.log('✅ Reseñas procesadas:', processedReviews);

    } catch (error) {
      console.error('❌ Error al obtener reseñas:', error);
      setErrorReviews(error.message);    } finally {
      setLoadingReviews(false);
    }
  }, [userId]);
  // Función para obtener perfil actualizado desde el servidor
  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      console.log('❌ No hay ID de usuario para obtener perfil');
      return;
    }

    try {
      console.log('🔄 Obteniendo perfil actualizado desde el servidor...');
      const url = `${API_BASE_URL}/users/${userId}/profile`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(user.token && { 'Authorization': `Bearer ${user.token}` })
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Perfil obtenido desde servidor:', profileData);
        
        // Actualizar el contexto del usuario con los datos del servidor
        if (setUser && profileData) {
          const updatedUser = {
            ...user,
            nombre: profileData.nombre || user.nombre,
            correo: profileData.correo || user.correo,
            email: profileData.correo || user.email,
            celular: profileData.celular || user.celular,
            telefono: profileData.celular || user.telefono,
            foto_perfil: profileData.foto_perfil || user.foto_perfil,
            foto: profileData.foto_perfil || user.foto,
            profilePhoto: profileData.foto_perfil || user.profilePhoto
          };
          
          setUser(updatedUser);
          localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
          console.log('✅ Usuario actualizado con datos del servidor');
        }
      } else {
        console.log('⚠️ No se pudo obtener perfil del servidor:', response.status);
      }
    } catch (error) {
      console.error('❌ Error al obtener perfil del servidor:', error);
    }
  }, [userId, user, setUser]);
  // Efecto para cargar datos cuando se monta el componente o cambia el usuario
  useEffect(() => {
    if (userId) {
      console.log('🔄 Cargando datos del perfil para usuario ID:', userId);
      fetchUserProfile(); // Obtener perfil actualizado del servidor
      fetchUserOrders();
      fetchUserReviews();
    }
  }, [userId, fetchUserProfile, fetchUserOrders, fetchUserReviews]);

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
  }, [onOrderUpdate, fetchUserOrders, setToast]);  // Actualizar userPerfil cuando cambie el prop user
  useEffect(() => {
    if (user) {      console.log('👤 PERFIL - Actualizando perfil con datos de usuario:', user);
        // Intentar obtener la foto de diferentes campos posibles
      let userPhoto = user.foto_perfil || user.foto || user.profilePhoto || user.avatar;
      
      console.log('🖼️ DEBUGGING FOTO - Campos de foto disponibles:', {
        foto_perfil: user.foto_perfil ? (user.foto_perfil.startsWith('data:') ? '[BASE64]' : user.foto_perfil) : 'null',
        foto: user.foto ? (user.foto.startsWith('data:') ? '[BASE64]' : user.foto) : 'null',
        profilePhoto: user.profilePhoto ? (user.profilePhoto.startsWith('data:') ? '[BASE64]' : user.profilePhoto) : 'null',
        avatar: user.avatar ? (user.avatar.startsWith('data:') ? '[BASE64]' : user.avatar) : 'null',
        selected: userPhoto ? (userPhoto.startsWith('data:') ? '[BASE64_SELECTED]' : userPhoto) : 'NO_PHOTO'
      });
      
      // Si no hay foto o es la foto por defecto, usar la imagen por defecto
      if (!userPhoto || userPhoto === perfilFoto) {
        console.log('🖼️ No hay foto válida, usando imagen por defecto');
        userPhoto = perfilFoto;
      }
      
      // Validar URL o Base64
      if (userPhoto && userPhoto !== perfilFoto) {
        if (userPhoto.startsWith('data:image/')) {
          // Es una imagen Base64, usarla directamente
          console.log('✅ Usando foto Base64 del usuario');
          setUserPerfil(prev => ({ ...prev, foto: userPhoto }));
        } else if (userPhoto.startsWith('http')) {
          // Es una URL, validar que sea accesible
          console.log('🖼️ Validando URL de foto:', userPhoto);
          
          const img = new Image();
          img.onload = () => {
            console.log('✅ Foto URL cargada correctamente:', userPhoto);
            setUserPerfil(prev => ({ ...prev, foto: userPhoto }));
          };
          img.onerror = () => {
            console.log('❌ Error al cargar foto URL, usando imagen por defecto');
            setUserPerfil(prev => ({ ...prev, foto: perfilFoto }));
          };
          img.src = userPhoto;
        } else {
          // Formato desconocido, usar por defecto
          console.log('⚠️ Formato de foto desconocido, usando imagen por defecto');
          userPhoto = perfilFoto;
        }
      }
      
      const newPerfil = {
        nombre: user.nombre || '',
        email: user.correo || user.email || '',
        telefono: user.telefono || user.celular || '',
        foto: userPhoto,
        miembroDesde: user.fecha_registro ? new Date(user.fecha_registro).getFullYear() : 2023,
      };
      
      setUserPerfil(newPerfil);
      
      // También actualizar el formulario si estamos en la pestaña de editar
      if (activeTab === 'editar') {
        setFormData({
          nombre: newPerfil.nombre,
          email: newPerfil.email,
          telefono: newPerfil.telefono,
        });
        console.log('📝 Datos del formulario sincronizados con usuario actualizado');
      }
    }
  }, [user, activeTab]);// Sincronizar datos del formulario cuando se cambia a la pestaña de editar
  useEffect(() => {
    if (activeTab === 'editar' && userPerfil.nombre) {
      setFormData({
        nombre: userPerfil.nombre,
        email: userPerfil.email,
        telefono: userPerfil.telefono,
      });
      console.log('📝 Formulario sincronizado al cambiar a pestaña editar');
    }
  }, [activeTab, userPerfil]);

  // Redirigir al login si no hay usuario logueado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);  // Cargar reseñas cuando se activa la pestaña de reseñas
  useEffect(() => {
    if (activeTab === 'reseñas' && userId) {
      fetchUserReviews();
    }  }, [activeTab, fetchUserReviews, userId]);

  // ============== FUNCIONES PARA MANEJO DE FOTOS ==============
  
  // Función para convertir imagen a Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };  // Función para redimensionar imagen antes de enviarla
  const resizeImageForUpload = (file, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con calidad reducida
        const base64 = canvas.toDataURL('image/jpeg', quality);
        console.log(`📏 Imagen redimensionada: ${width}x${height}, tamaño: ${base64.length} caracteres`);
        resolve(base64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Función optimizada para manejar cambio de foto de perfil
  const handlePhotoChange = async (file) => {
    if (!file) return;    // Validaciones básicas
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setToast && setToast('Formato no válido. Use JPG, PNG o WEBP');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Aumentado a 10MB para archivo original
      setToast && setToast('Archivo muy grande. Máximo 10MB');
      return;
    }

    setIsUploadingPhoto(true);
    console.log('📸 Procesando nueva foto...');
      try {
      // Redimensionar imagen para evitar archivos muy grandes
      console.log('🔧 Redimensionando imagen para optimizar envío...');
      const resizedBase64 = await resizeImageForUpload(file);
      
      // Verificar que el tamaño sea razonable (máximo 500KB)
      if (resizedBase64.length > 500000) {
        console.log('⚠️ Imagen aún muy grande, aplicando más compresión...');
        const extraCompressed = await resizeImageForUpload(file, 300, 300, 0.5);
        console.log(`📉 Tamaño después de compresión extra: ${extraCompressed.length} caracteres`);
        var base64 = extraCompressed;
      } else {
        var base64 = resizedBase64;
      }
        console.log('✅ Imagen procesada - Tamaño final:', base64.length, 'caracteres');
      
      // Validación final del tamaño antes de enviar
      if (base64.length > 800000) { // Máximo ~800KB en Base64
        setToast && setToast('La imagen procesada sigue siendo muy grande. Intenta con una imagen más pequeña.');
        setIsUploadingPhoto(false);
        setPhotoPreview(null);
        return;
      }
      
      // Actualizar inmediatamente en la UI para mejor UX
      setUserPerfil(prev => ({ ...prev, foto: base64 }));
      setPhotoPreview(base64);
      console.log('👁️ Vista actualizada inmediatamente');// Preparar datos para sincronizar con el backend
      const dataToUpdate = {
        nombre: userPerfil.nombre || user?.nombre || '',
        email: userPerfil.email || user?.correo || user?.email || '',
        telefono: userPerfil.telefono || user?.celular || user?.telefono || '',
        foto: base64
      };

      console.log('🔄 Datos preparados para sincronizar foto con backend:', {
        nombre: dataToUpdate.nombre,
        email: dataToUpdate.email,
        telefono: dataToUpdate.telefono,
        foto: '[BASE64_DATA_PRESENT]'
      });
      console.log('🌐 Enviando al endpoint: PUT /api/users/:id/profile');

      console.log('🔄 Sincronizando foto con el backend...');
      
      // Llamar a updateUserProfile para guardar en el backend
      const success = await updateUserProfile(dataToUpdate);
      
      if (success) {
        // Guardar en localStorage solo si se guardó exitosamente en el backend
        if (setUser && user) {
          const updatedUser = {
            ...user,
            foto_perfil: base64,
            foto: base64,
            profilePhoto: base64
          };
          setUser(updatedUser);
          localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
          console.log('💾 Guardado en localStorage tras éxito en backend');
        }
        
        setToast && setToast('¡Foto actualizada y guardada!');
      } else {
        // Si falló el backend, revertir la UI
        console.log('❌ Fallo en backend, revirtiendo UI...');
        setUserPerfil(prev => ({ ...prev, foto: prev.foto || user?.foto_perfil || '' }));
        setToast && setToast('Error al guardar la foto en el servidor');
      }
      
      // Limpiar preview después de un momento
      setTimeout(() => setPhotoPreview(null), 2000);

    } catch (error) {
      console.error('❌ Error procesando imagen:', error);
      setToast && setToast('Error al procesar la imagen');
      setPhotoPreview(null);
      // Revertir cambios en la UI
      setUserPerfil(prev => ({ ...prev, foto: prev.foto || user?.foto_perfil || '' }));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Función para manejar el clic en el botón de cambiar foto
  const handlePhotoClick = () => {
    if (isUploadingPhoto) return; // No permitir clicks durante la subida
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handlePhotoChange(file); // Usar la función optimizada
      }
    };
    input.click();
  };

  // ============== OTRAS FUNCIONES HELPER ==============
  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    console.log('❌ Error al cargar imagen:', e.target.src);
    console.log('🔄 Cambiando a imagen por defecto');
    e.target.src = perfilFoto; // Cambiar a imagen por defecto
    
    // También actualizar el estado para que no vuelva a intentar cargar la imagen rota
    setUserPerfil(prev => ({
      ...prev,
      foto: perfilFoto
    }));
    
    // Actualizar en localStorage para evitar futuros errores
    if (setUser && user) {
      const updatedUser = {
        ...user,
        foto_perfil: perfilFoto,
        foto: perfilFoto,
        profilePhoto: perfilFoto
      };
      setUser(updatedUser);
      
      try {
        localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
        console.log('🧹 Imagen rota limpiada de localStorage');
      } catch (error) {
        console.error('❌ Error al limpiar localStorage:', error);
      }
    }
  };

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
      {/* CARD DE PERFIL */}      <div className="perfil__card">        <div className="perfil__foto-wrapper">
          <img 
            src={photoPreview || userPerfil.foto} 
            alt="Perfil" 
            className="perfil__foto"
            onError={handleImageError}
            style={{ 
              opacity: isUploadingPhoto ? 0.7 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
          <div 
            className="perfil__foto-edit" 
            onClick={!isUploadingPhoto ? handlePhotoClick : undefined}
            style={{ 
              cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
              opacity: isUploadingPhoto ? 0.8 : 1
            }}
            title={isUploadingPhoto ? "Subiendo foto..." : "Cambiar foto de perfil"}
          >
            {isUploadingPhoto ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faCamera} />
            )}
          </div>
          {isUploadingPhoto && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '12px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              textAlign: 'center'
            }}>
              Subiendo...
            </div>
          )}
        </div><div className="perfil__info">
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
                                src={producto.imagen || producto.image || producto.img}                                alt={producto.titulo || producto.nombre || producto.name || 'Producto'}
                                className="perfil__producto-imagen"
                              />
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
            <div className="perfil__titulo-favoritos">
              Mis reseñas
              <button 
                className="perfil__refresh-btn"
                onClick={fetchUserReviews}
                disabled={loadingReviews}
                title="Actualizar reseñas"
              >
                <FontAwesomeIcon 
                  icon={faRefresh} 
                  className={loadingReviews ? 'spinning' : ''} 
                />
              </button>
            </div>

            {loadingReviews ? (
              <div className="perfil__loading">
                <FontAwesomeIcon icon={faSpinner} className="spinning" />
                <p>Cargando tus reseñas...</p>
              </div>
            ) : errorReviews ? (
              <div className="perfil__error">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <h3>Error al cargar reseñas</h3>
                <p>{errorReviews}</p>
                <button 
                  className="perfil__retry-btn"
                  onClick={fetchUserReviews}
                >
                  <FontAwesomeIcon icon={faRefresh} /> Reintentar
                </button>
              </div>
            ) : userReviews.length === 0 ? (
              <div className="perfil__empty">
                <FontAwesomeIcon icon={faCommentDots} />
                <h3>No tienes reseñas aún</h3>
                <p>Compra algunos productos y comparte tu experiencia escribiendo reseñas</p>
                <button 
                  className="perfil__empty-btn"
                  onClick={() => navigate('/menu')}
                >
                  Explorar Menú
                </button>
              </div>
            ) : (
              <div className="perfil__reviews-container">
                {userReviews.map((review) => (
                  <div key={review.id} className="perfil__review-card">
                    <div className="perfil__review-header">
                      <div className="perfil__review-product">
                        <h4>{review.producto.nombre}</h4>
                        <div className="perfil__review-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesomeIcon
                              key={star}
                              icon={faStar}
                              className={`perfil__star ${review.valoracion >= star ? 'filled' : 'empty'}`}
                            />
                          ))}
                          <span className="perfil__rating-text">({review.valoracion}/5)</span>
                        </div>
                      </div>
                      <div className="perfil__review-date">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{review.fechaFormateada}</span>
                      </div>
                    </div>
                    <div className="perfil__review-content">
                      <p>"{review.comentario}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}{/* --- EDITAR PERFIL --- */}
        {activeTab === 'editar' && (
          <div>
            <div className="perfil__titulo-editar">Editar Perfil</div>            <form
              className="perfil__form-editar"
              onSubmit={async (e) => {
                e.preventDefault();
                
                // Validaciones básicas
                if (!formData.nombre.trim()) {
                  setToast && setToast('El nombre es requerido');
                  return;
                }
                
                if (!formData.email.trim()) {
                  setToast && setToast('El email es requerido');
                  return;
                }
                
                if (!formData.telefono.trim()) {
                  setToast && setToast('El teléfono es requerido');
                  return;
                }

                // Validar formato de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                  setToast && setToast('Por favor ingresa un email válido');
                  return;
                }

                // Validar formato de teléfono (opcional: puedes ajustar según tus necesidades)
                const phoneRegex = /^(\+503\s?)?\d{4}-?\d{4}$/;
                if (!phoneRegex.test(formData.telefono)) {
                  setToast && setToast('Por favor ingresa un teléfono válido (formato: +503 7123-4567 o 7123-4567)');
                  return;
                }                console.log('💾 Guardando cambios del perfil...');
                setProfileUpdateError(''); // Limpiar errores previos
                const success = await updateUserProfile(formData);
                  if (success) {
                  setEditSuccess(true);
                  setToast && setToast('¡Perfil actualizado correctamente!');
                  
                  // Actualizar los datos del formulario con los nuevos valores
                  setFormData({
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                  });
                  
                  // Limpiar el mensaje de éxito después de 3 segundos
                  setTimeout(() => setEditSuccess(false), 3000);
                  
                  // Opcional: Mantener en la pestaña de editar para que el usuario vea los cambios aplicados
                  console.log('✅ Perfil actualizado y formulario sincronizado');
                } else {
                  // El error ya se maneja en updateUserProfile
                  console.error('❌ Error al actualizar el perfil');
                }
              }}
            >
              <div className="perfil__form-row">
                <div className="perfil__form-group">
                  <label>Nombre completo</label>                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={e => {
                      setFormData({ ...formData, nombre: e.target.value });
                      if (profileUpdateError) setProfileUpdateError('');
                    }}
                    required
                  />
                </div>
                <div className="perfil__form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => {
                      setFormData({ ...formData, email: e.target.value });
                      if (profileUpdateError) setProfileUpdateError('');
                    }}
                    required
                  />
                </div>
              </div>
              <div className="perfil__form-row">
                <div className="perfil__form-group" style={{ width: '100%' }}>
                  <label>Teléfono</label>                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={e => {
                      setFormData({ ...formData, telefono: e.target.value });
                      if (profileUpdateError) setProfileUpdateError('');
                    }}
                    placeholder="Ej: +503 7123-4567 o 7123-4567"
                    required
                  />
                </div>
              </div>              <button 
                type="submit" 
                className="perfil__guardar-btn"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="spinning" />
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </button>              {editSuccess && (
                <div className="perfil__edit-success">¡Perfil actualizado correctamente!</div>
              )}
              {profileUpdateError && (
                <div className="perfil__edit-error" style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '15px',
                  border: '1px solid #ffcdd2'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px' }} />
                    Error al actualizar perfil
                  </div>
                  <div style={{ fontSize: '14px' }}>{profileUpdateError}</div>
                  {profileUpdateError.includes('base de datos') && (                    <div style={{ 
                      fontSize: '13px', 
                      marginTop: '8px', 
                      padding: '8px',
                      backgroundColor: '#fff3e0',
                      border: '1px solid #ffcc02',
                      borderRadius: '4px',
                      color: '#e65100'
                    }}>
                      <strong>Información técnica para el desarrollador:</strong><br/>
                      • La tabla 'usuarios' no tiene columna 'updated_at'<br/>
                      • Columnas disponibles: id_usuario, nombre, correo, contrasena, celular, fecha_nacimiento, sexo, dui, foto_perfil<br/>
                      • El endpoint debe actualizar solo: nombre, correo, celular<br/>
                      • Remover referencias a 'updated_at' en el query SQL
                    </div>
                  )}
                </div>
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
    </div>  );
}
