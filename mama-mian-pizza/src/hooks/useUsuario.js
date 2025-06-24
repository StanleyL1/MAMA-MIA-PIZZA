import { useState, useCallback } from 'react';
import { obtenerUsuario, actualizarUsuario, actualizarFotoPerfil, cambiarPassword } from '../services/usuariosService';

/**
 * Hook personalizado para manejar la información del usuario
 */
export const useUsuario = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Obtener información del usuario
  const fetchUserInfo = useCallback(async (userId) => {
    if (!userId) {
      console.warn('No se proporcionó ID de usuario para fetchUserInfo');
      return;
    }
    
    console.log(`Iniciando carga de información del usuario ${userId}`);
    setLoading(true);
    setError(null);
    
    try {
      const userData = await obtenerUsuario(userId);
      console.log('Datos del usuario obtenidos exitosamente:', userData);
      
      // Validar que los datos esenciales estén presentes
      if (!userData || !userData.id_usuario) {
        throw new Error('Datos de usuario inválidos recibidos de la API');
      }
      
      setUserInfo(userData);
      console.log('Estado userInfo actualizado con:', userData);
      return userData;
    } catch (error) {
      console.error('Error en fetchUserInfo:', error);
      setError('Error al cargar la información del usuario');
      setUserInfo(null);
      throw error;
    } finally {
      setLoading(false);
      console.log('Carga de información del usuario finalizada');
    }
  }, []);
  // Actualizar información del usuario
  const updateUserInfo = useCallback(async (userId, updateData) => {
    console.log('=== HOOK useUsuario: updateUserInfo ===');
    console.log('userId:', userId);
    console.log('updateData:', updateData);
    console.log('userInfo antes de actualizar:', userInfo);
    
    if (!userId) {
      throw new Error('ID de usuario requerido');
    }

    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await actualizarUsuario(userId, updateData);
      console.log('Usuario actualizado desde API:', updatedUser);
      
      // Actualizar el estado local con la nueva información
      const newUserInfo = {
        ...userInfo,
        ...updatedUser
      };
      
      console.log('Nuevo userInfo que se va a setear:', newUserInfo);
      setUserInfo(newUserInfo);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user info:', error);
      setError('Error al actualizar la información del usuario');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userInfo]);
  // Actualizar foto de perfil
  const updateProfilePhoto = useCallback(async (userId, file) => {
    console.log('=== HOOK useUsuario: updateProfilePhoto ===');
    console.log('userId:', userId);
    console.log('file:', file);
    console.log('userInfo actual:', userInfo);
    
    if (!userId || !file) {
      throw new Error('ID de usuario y archivo requeridos');
    }

    setLoading(true);
    setError(null);
    
    try {
      // Pasar los datos actuales del usuario para mantenerlos
      const result = await actualizarFotoPerfil(userId, file, userInfo);
      console.log('Resultado actualización foto:', result);
      
      // Refrescar información del usuario para obtener la nueva URL de la foto
      await fetchUserInfo(userId);
      
      return result;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      setError('Error al actualizar la foto de perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo, userInfo]);

  // Cambiar contraseña
  const changePassword = useCallback(async (userId, passwordData) => {
    if (!userId || !passwordData) {
      throw new Error('ID de usuario y datos de contraseña requeridos');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await cambiarPassword(userId, passwordData);
      return result;
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Error al cambiar la contraseña');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reintentar operación
  const retry = useCallback(async (userId) => {
    if (userId) {
      return await fetchUserInfo(userId);
    }
  }, [fetchUserInfo]);

  return {
    userInfo,
    loading,
    error,
    fetchUserInfo,
    updateUserInfo,
    updateProfilePhoto,
    changePassword,
    clearError,
    retry
  };
};
