/**
 * Servicio para manejar operaciones relacionadas con usuarios
 */

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

/**
 * Obtiene la información detallada de un usuario por su ID
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} - Información del usuario
 */
export const obtenerUsuario = async (userId) => {
  try {
    console.log(`Obteniendo información del usuario ${userId} desde: ${API_BASE_URL}/users/${userId}`);
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Datos del usuario recibidos:', data);
    
    // Asegurar que los datos tengan la estructura correcta
    const userData = {
      id_usuario: data.id_usuario,
      nombre: data.nombre || '',
      correo: data.correo || '',
      celular: data.celular || '',
      fecha_nacimiento: data.fecha_nacimiento,
      sexo: data.sexo,
      dui: data.dui,
      foto_perfil: data.foto_perfil
    };
    
    console.log('Datos del usuario procesados:', userData);
    return userData;
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    throw error;
  }
};

/**
 * Actualiza la información de un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} userData - Datos del usuario a actualizar
 * @returns {Promise<Object>} - Usuario actualizado
 */
export const actualizarUsuario = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Actualiza la foto de perfil de un usuario
 * @param {number} userId - ID del usuario
 * @param {File} file - Archivo de imagen
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const actualizarFotoPerfil = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('foto_perfil', file);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/foto`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar foto de perfil:', error);
    throw error;
  }
};

/**
 * Cambia la contraseña de un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} passwordData - Datos de contraseña (actual y nueva)
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const cambiarPassword = async (userId, passwordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    throw error;
  }
};
