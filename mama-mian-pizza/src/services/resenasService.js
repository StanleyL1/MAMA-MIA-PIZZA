/**
 * Servicio para manejar todas las peticiones relacionadas con reseñas
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
 * Obtener reseñas de un usuario específico
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} - Información del usuario y sus reseñas
 */
export const obtenerResenasUsuario = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resenas/usuario/${userId}`, getRequestConfig());
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener reseñas del usuario:', error);
    throw error;
  }
};

/**
 * Crear una nueva reseña
 * @param {Object} resenaData - Datos de la reseña
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const crearResena = async (resenaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resenas`, getRequestConfig('POST', resenaData));
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al crear reseña:', error);
    throw error;
  }
};

/**
 * Actualizar una reseña existente
 * @param {number} resenaId - ID de la reseña
 * @param {Object} resenaData - Datos actualizados de la reseña
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const actualizarResena = async (resenaId, resenaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resenas/${resenaId}`, getRequestConfig('PUT', resenaData));
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    throw error;
  }
};

/**
 * Eliminar una reseña
 * @param {number} resenaId - ID de la reseña
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const eliminarResena = async (resenaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resenas/${resenaId}`, getRequestConfig('DELETE'));
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    throw error;
  }
};
