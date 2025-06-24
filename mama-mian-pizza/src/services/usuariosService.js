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
    console.log('=== ACTUALIZANDO USUARIO EN API ===');
    console.log('userId:', userId);
    console.log('userData:', userData);
    console.log('URL completa:', `${API_BASE_URL}/users/${userId}/profile`);
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    console.log('=== ACTUALIZACIÓN EXITOSA ===');
    return data;
  } catch (error) {
    console.error('=== ERROR EN ACTUALIZACIÓN ===');
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Actualiza la foto de perfil de un usuario
 * @param {number} userId - ID del usuario
 * @param {File} file - Archivo de imagen
 * @param {Object} currentUserData - Datos actuales del usuario para mantenerlos
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const actualizarFotoPerfil = async (userId, file, currentUserData = {}) => {
  try {
    console.log('=== ACTUALIZANDO FOTO DE PERFIL ===');
    console.log('userId:', userId);
    console.log('file:', file);
    console.log('currentUserData:', currentUserData);
    
    const formData = new FormData();
    
    // Agregar todos los datos del usuario existentes
    if (currentUserData.nombre) formData.append('nombre', currentUserData.nombre);
    if (currentUserData.correo) formData.append('correo', currentUserData.correo);
    if (currentUserData.celular) formData.append('telefono', currentUserData.celular);
    if (currentUserData.fecha_nacimiento) formData.append('fecha_nacimiento', currentUserData.fecha_nacimiento);
    if (currentUserData.sexo) formData.append('sexo', currentUserData.sexo);
    
    // Agregar la foto
    formData.append('foto_perfil', file);

    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    console.log('=== ACTUALIZACIÓN DE FOTO EXITOSA ===');
    return data;
  } catch (error) {
    console.error('=== ERROR EN ACTUALIZACIÓN DE FOTO ===');
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
    console.log('=== CAMBIANDO CONTRASEÑA ===');
    console.log('userId:', userId);
    console.log('URL completa:', `${API_BASE_URL}/users/${userId}/profile`);
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    console.log('=== CAMBIO DE CONTRASEÑA EXITOSO ===');
    return data;
  } catch (error) {
    console.error('=== ERROR EN CAMBIO DE CONTRASEÑA ===');
    console.error('Error al cambiar contraseña:', error);
    throw error;
  }
};
