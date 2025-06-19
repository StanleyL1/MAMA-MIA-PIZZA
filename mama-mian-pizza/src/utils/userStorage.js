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
    if (userData.correo) {
      localStorage.setItem('userEmail', userData.correo);
    }
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('💾 STORAGE - Datos del usuario guardados:', userData.id);
  } catch (error) {
    console.error('Error al guardar datos del usuario en localStorage:', error);
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
    email: userData.correo,
    foto: userData.foto_perfil || userData.foto
  };
};
