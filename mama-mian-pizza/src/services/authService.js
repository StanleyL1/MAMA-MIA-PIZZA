/**
 * Servicio para manejar operaciones de autenticación y gestión de contraseñas
 */

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

/**
 * Solicita un código de verificación para restablecer la contraseña
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const solicitarCodigoReset = async (email) => {
  try {
    console.log('=== SOLICITANDO CÓDIGO DE RESET ===');
    console.log('email:', email);
    console.log('URL completa:', `${API_BASE_URL}/auth/request-reset`);
    
    const response = await fetch(`${API_BASE_URL}/auth/request-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: email }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response data:', data);
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    console.log('Response data:', data);
    console.log('=== SOLICITUD DE CÓDIGO EXITOSA ===');
    return data;
  } catch (error) {
    console.error('=== ERROR EN SOLICITUD DE CÓDIGO ===');
    console.error('Error al solicitar código de reset:', error);
    throw error;
  }
};

/**
 * Verifica un código OTP para restablecer la contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} otp - Código OTP a verificar
 * @returns {Promise<Object>} - Respuesta del servidor con el token de reset
 */
export const verificarCodigoReset = async (email, otp) => {
  try {
    console.log('=== VERIFICANDO CÓDIGO OTP ===');
    console.log('email:', email);
    console.log('otp:', otp);
    console.log('URL completa:', `${API_BASE_URL}/auth/verify-reset`);
    
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        correo: email, 
        otp: otp 
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response data:', data);
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    console.log('Response data:', data);
    console.log('=== VERIFICACIÓN DE CÓDIGO EXITOSA ===');
    return data;
  } catch (error) {
    console.error('=== ERROR EN VERIFICACIÓN DE CÓDIGO ===');
    console.error('Error al verificar código OTP:', error);
    throw error;
  }
};

/**
 * Restablece la contraseña usando un token de verificación
 * @param {string} token - Token de restablecimiento
 * @param {string} password - Nueva contraseña
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const restablecerPassword = async (token, password) => {
  try {
    console.log('=== RESTABLECIENDO CONTRASEÑA ===');
    console.log('token length:', token?.length);
    console.log('URL completa:', `${API_BASE_URL}/auth/reset-password`);
    
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token: token, 
        nuevaContrasena: password 
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response data:', data);
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    console.log('Response data:', data);
    console.log('=== RESTABLECIMIENTO DE CONTRASEÑA EXITOSO ===');
    return data;
  } catch (error) {
    console.error('=== ERROR EN RESTABLECIMIENTO DE CONTRASEÑA ===');
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
};
