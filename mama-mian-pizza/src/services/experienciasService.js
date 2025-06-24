/**
 * Servicio para manejar todas las peticiones relacionadas con experiencias
 */

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

// Configuración base para las peticiones
const getRequestConfig = (method = 'GET', body = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  return config;
};

// Manejo de errores centralizado
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * SERVICIOS DE LECTURA (GET)
 */

// Obtener todas las experiencias aprobadas (estado = 1)
export const obtenerExperienciasAprobadas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/experiencias/status/1`, getRequestConfig());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener experiencias aprobadas:', error);
    throw error;
  }
};

// Obtener todas las experiencias
export const obtenerTodasLasExperiencias = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/experiencias`, getRequestConfig());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener todas las experiencias:', error);
    throw error;
  }
};

// Obtener experiencias de un usuario específico
export const obtenerExperienciasUsuario = async (idUsuario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/experiencias/user/${idUsuario}`, getRequestConfig());
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener experiencias del usuario ${idUsuario}:`, error);
    throw error;
  }
};

// Obtener experiencias pendientes de aprobación (estado = 0)
export const obtenerExperienciasPendientes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/experiencias/status/0`, getRequestConfig());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener experiencias pendientes:', error);
    throw error;
  }
};

/**
 * SERVICIOS DE ESCRITURA (POST/PUT)
 */

// Crear una nueva experiencia
export const crearExperiencia = async (experienciaData) => {
  try {
    const payload = {
      titulo: experienciaData.titulo,
      valoracion: experienciaData.valoracion,
      id_usuario: experienciaData.id_usuario,
      contenido: experienciaData.contenido
    };
    
    const response = await fetch(`${API_BASE_URL}/experiencias`, getRequestConfig('POST', payload));
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al crear experiencia:', error);
    throw error;
  }
};

// Actualizar una experiencia existente
export const actualizarExperiencia = async (idExperiencia, experienciaData) => {
  try {
    const payload = {
      titulo: experienciaData.titulo,
      valoracion: experienciaData.valoracion,
      contenido: experienciaData.contenido
    };
    
    // Solo incluir campos que no sean undefined/null
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/experiencias/${idExperiencia}`, getRequestConfig('PUT', payload));
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al actualizar experiencia ${idExperiencia}:`, error);
    throw error;
  }
};

// Aprobar o desaprobar una experiencia
export const cambiarAprobacionExperiencia = async (idExperiencia, aprobado) => {
  try {
    const payload = {
      aprobado: aprobado ? 1 : 0
    };
    
    const response = await fetch(`${API_BASE_URL}/experiencias/${idExperiencia}/approval`, getRequestConfig('PUT', payload));
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al cambiar aprobación de experiencia ${idExperiencia}:`, error);
    throw error;
  }
};

/**
 * FUNCIONES DE UTILIDAD
 */

// Formatear fecha para mostrar
export const formatearFecha = (fechaString) => {
  const fecha = new Date(fechaString);
  const ahora = new Date();
  const diferencia = ahora - fecha;
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  
  if (dias === 0) {
    return 'Hoy';
  } else if (dias === 1) {
    return 'Ayer';
  } else if (dias < 7) {
    return `Hace ${dias} días`;
  } else if (dias < 30) {
    const semanas = Math.floor(dias / 7);
    return `Hace ${semanas} semana${semanas > 1 ? 's' : ''}`;
  } else {
    return fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

// Transformar experiencia para componente TestimonialCard
export const transformarExperienciaParaCard = (experiencia) => {
  return {
    id: experiencia.id_experiencia,
    name: experiencia.usuario ? experiencia.usuario.nombre : 'Usuario Anónimo',
    avatar: experiencia.usuario ? experiencia.usuario.foto_perfil : null,
    time: formatearFecha(experiencia.fecha_creacion),
    comment: experiencia.contenido,
    rating: experiencia.valoracion,
    titulo: experiencia.titulo,
    estado: experiencia.estado,
    aprobado: experiencia.aprobado,
    // Nueva propiedad para la foto de la experiencia
    experienciaFoto: experiencia.ruta_foto || null
  };
};

/**
 * FUNCIONES ESPECÍFICAS PARA COMPONENTES
 */

// Obtener experiencias para mostrar en el Home (solo aprobadas)
export const obtenerExperienciasParaHome = async () => {
  try {
    const data = await obtenerExperienciasAprobadas();
    
    if (data.experiencias && data.experiencias.length > 0) {
      return data.experiencias.map(exp => transformarExperienciaParaCard(exp));
    }
    
    return [];
  } catch (error) {
    console.error('Error al obtener experiencias para Home:', error);
    return [];
  }
};

// Crear experiencia desde el modal del Home
export const crearExperienciaDesdeModal = async (usuario, titulo, valoracion, contenido) => {
  try {
    if (!usuario || !usuario.id) {
      throw new Error('Usuario no válido');
    }
    
    const experienciaData = {
      titulo: titulo || 'Mi experiencia en Mama Mian Pizza',
      valoracion: valoracion,
      id_usuario: usuario.id,
      contenido: contenido
    };
    
    return await crearExperiencia(experienciaData);
  } catch (error) {
    console.error('Error al crear experiencia desde modal:', error);
    throw error;
  }
};

// Obtener experiencias de un usuario específico transformadas
export const obtenerExperienciasUsuarioTransformadas = async (idUsuario) => {
  try {
    const data = await obtenerExperienciasUsuario(idUsuario);
    
    if (data.experiencias && data.experiencias.length > 0) {
      return data.experiencias.map(exp => {
        // Para experiencias de usuario específico, usar la info del usuario del response
        if (data.usuario) {
          return {
            ...transformarExperienciaParaCard(exp),
            name: data.usuario.nombre_usuario,
            avatar: data.usuario.foto_perfil
          };
        }
        return transformarExperienciaParaCard(exp);
      });
    }
    
    return [];
  } catch (error) {
    console.error(`Error al obtener experiencias transformadas del usuario ${idUsuario}:`, error);
    return [];
  }
};

// Función para obtener estadísticas de experiencias
export const obtenerEstadisticasExperiencias = async () => {
  try {
    const [aprobadas, pendientes, todas] = await Promise.all([
      obtenerExperienciasAprobadas(),
      obtenerExperienciasPendientes(),
      obtenerTodasLasExperiencias()
    ]);
    
    return {
      total: todas.experiencias ? todas.experiencias.length : 0,
      aprobadas: aprobadas.experiencias ? aprobadas.experiencias.length : 0,
      pendientes: pendientes.experiencias ? pendientes.experiencias.length : 0,
      promedioCalificacion: calcularPromedioCalificacion(aprobadas.experiencias || [])
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      total: 0,
      aprobadas: 0,
      pendientes: 0,
      promedioCalificacion: 0
    };
  }
};

// Calcular promedio de calificaciones
const calcularPromedioCalificacion = (experiencias) => {
  if (!experiencias || experiencias.length === 0) return 0;
  
  const suma = experiencias.reduce((acc, exp) => acc + exp.valoracion, 0);
  return Math.round((suma / experiencias.length) * 10) / 10; // Redondear a 1 decimal
};

const experienciasService = {
  // Funciones de lectura
  obtenerExperienciasAprobadas,
  obtenerTodasLasExperiencias,
  obtenerExperienciasUsuario,
  obtenerExperienciasPendientes,
  
  // Funciones de escritura
  crearExperiencia,
  actualizarExperiencia,
  cambiarAprobacionExperiencia,
  
  // Funciones específicas para componentes
  obtenerExperienciasParaHome,
  obtenerExperienciasUsuarioTransformadas,
  crearExperienciaDesdeModal,
  obtenerEstadisticasExperiencias,
  
  // Utilidades
  formatearFecha,
  transformarExperienciaParaCard
};

export default experienciasService;
