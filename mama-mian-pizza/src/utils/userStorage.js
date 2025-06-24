// Utilidades para manejar datos del usuario en localStorage

/**
 * Obtener el ID del usuario desde localStorage
 * @returns {string|null} ID del usuario o null si no existe
 */
export const getUserId = () => {
  try {
    return localStorage.getItem('userId');
  } catch (error) {
    console.error('Error al obtener userId desde localStorage:', error);
    return null;
  }
};

/**
 * Obtener el email del usuario desde localStorage
 * @returns {string|null} Email del usuario o null si no existe
 */
export const getUserEmail = () => {
  try {
    return localStorage.getItem('userEmail');
  } catch (error) {
    console.error('Error al obtener userEmail desde localStorage:', error);
    return null;
  }
};

/**
 * Obtener todos los datos del usuario desde localStorage
 * @returns {object|null} Datos del usuario o null si no existen
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error al obtener userData desde localStorage:', error);
    return null;
  }
};

/**
 * Guardar datos del usuario en localStorage
 * @param {object} userData - Datos del usuario
 */
export const saveUserData = (userData) => {
  try {
    if (userData.id) {
      localStorage.setItem('userId', userData.id.toString());
    }
    if (userData.correo || userData.email) {
      localStorage.setItem('userEmail', userData.correo || userData.email);
    }
    localStorage.setItem('userData', JSON.stringify(userData));
    // También guardar en la clave que usa App.jsx para mejor compatibilidad
    localStorage.setItem('mamamia_user', JSON.stringify(userData));
    console.log('💾 STORAGE - Datos del usuario guardados:', userData.id);
  } catch (error) {
    console.error('Error al guardar datos del usuario en localStorage:', error);
  }
};

/**
 * Actualizar datos específicos del usuario sin sobrescribir todo
 * @param {object} updates - Datos a actualizar
 */
export const updateUserData = (updates) => {
  try {
    const currentUserData = getUserData();
    if (currentUserData) {
      const updatedUserData = { ...currentUserData, ...updates };
      saveUserData(updatedUserData);
      console.log('🔄 STORAGE - Datos del usuario actualizados:', updates);
      return updatedUserData;
    }
    return null;
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    return null;
  }
};

/**
 * Actualizar foto de perfil del usuario
 * @param {string} newPhotoUrl - Nueva URL de la foto
 */
export const updateUserPhoto = (newPhotoUrl) => {
  try {
    const updates = {
      foto_perfil: newPhotoUrl,
      foto: newPhotoUrl
    };
    return updateUserData(updates);
  } catch (error) {
    console.error('Error al actualizar foto del usuario:', error);
    return null;
  }
};

/**
 * Limpiar todos los datos del usuario de localStorage
 */
export const clearUserData = () => {
  try {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('mamamia_user'); // También limpiar la clave de App.jsx
    console.log('🧹 STORAGE - Datos del usuario limpiados');
  } catch (error) {
    console.error('Error al limpiar datos del usuario:', error);
  }
};

/**
 * Verificar si hay un usuario logueado
 * @returns {boolean} True si hay un usuario logueado, false en caso contrario
 */
export const isUserLoggedIn = () => {
  const userId = getUserId();
  const userData = getUserData();
  return !!(userId && userData);
};

/**
 * Obtener información básica del usuario para mostrar en la UI
 * @returns {object|null} Información básica del usuario
 */
export const getUserInfo = () => {
  const userData = getUserData();
  if (!userData) return null;
  
  return {
    id: userData.id,
    nombre: userData.nombre,
    email: userData.correo || userData.email,
    foto: userData.foto_perfil || userData.foto
  };
};

/**
 * Sincronizar datos entre las diferentes claves de localStorage
 */
export const syncUserDataKeys = () => {
  try {
    const userData = getUserData();
    const mamamiaUser = localStorage.getItem('mamamia_user');
    
    if (userData && !mamamiaUser) {
      localStorage.setItem('mamamia_user', JSON.stringify(userData));
    } else if (!userData && mamamiaUser) {
      localStorage.setItem('userData', mamamiaUser);
    }
  } catch (error) {
    console.error('Error al sincronizar claves de localStorage:', error);
  }
};
