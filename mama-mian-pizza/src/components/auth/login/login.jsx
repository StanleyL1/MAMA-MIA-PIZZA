import './login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        correo: "",
        contrasena: ""
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        setFormData(
            { ...formData, [e.target.name]:e.target.value}
        )
        // Limpiar error y éxito cuando el usuario empiece a escribir
        if (error) setError("");
        if (success) setSuccess(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
          try{
            const response = await fetch('https://api.mamamianpizza.com/api/users/users_login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });            if(response.status === 200){
                const userData = await response.json();
                console.log('🔑 LOGIN - Respuesta API COMPLETA:', userData);
                console.log('🔑 LOGIN - Tipo de respuesta:', typeof userData);
                console.log('🔑 LOGIN - Claves disponibles:', Object.keys(userData));
                console.log('🔑 LOGIN - Contenido completo:', JSON.stringify(userData, null, 2));
                
                // Verificar si onLogin existe
                if (!onLogin) {
                    console.error('❌ ERROR: onLogin no está definido!');
                    setError('Error interno: función onLogin no disponible');
                    return;
                }
                
                // La API solo devuelve las credenciales, no los datos del usuario
                // Necesitamos hacer una segunda petición para obtener los datos del usuario
                // o crear un usuario básico con los datos disponibles
                
                // Verificar si la respuesta contiene datos de usuario
                const hasUserData = userData.user || (userData.nombre || userData.name || userData.id);
                
                let userDataToSave;
                
                if (!hasUserData) {
                    console.log('⚠️ LOGIN - API solo devolvió credenciales, creando usuario básico');
                    // Extraer nombre del email
                    const emailParts = formData.correo.split('@');
                    const nombreFromEmail = emailParts[0].replace(/[0-9]/g, ''); // Remover números del email
                    
                    userDataToSave = {
                        id: Date.now(), // ID temporal basado en timestamp
                        nombre: nombreFromEmail || 'Usuario',
                        correo: formData.correo,
                        foto_perfil: null,
                        foto: null,
                        telefono: '',
                        celular: '',
                        fecha_nacimiento: '',
                        sexo: '',
                        dui: '',
                        // Marcar que los datos son básicos para futuras mejoras
                        isBasicProfile: true
                    };
                } else {
                    // Procesar datos completos del usuario si están disponibles
                    const rawUser = userData.user || userData;
                    userDataToSave = {
                        id: rawUser.id || rawUser.user_id || rawUser.userId || Date.now(),
                        nombre: rawUser.nombre || rawUser.name || rawUser.full_name || rawUser.firstName || rawUser.usuario,
                        correo: rawUser.correo || rawUser.email || rawUser.mail || formData.correo,
                        foto_perfil: rawUser.foto_perfil || rawUser.foto || rawUser.profile_photo || rawUser.avatar || rawUser.image,
                        foto: rawUser.foto_perfil || rawUser.foto || rawUser.profile_photo || rawUser.avatar || rawUser.image,
                        telefono: rawUser.telefono || rawUser.phone || rawUser.celular || rawUser.mobile,
                        celular: rawUser.celular || rawUser.telefono || rawUser.phone || rawUser.mobile,
                        fecha_nacimiento: rawUser.fecha_nacimiento || rawUser.birthdate,
                        sexo: rawUser.sexo || rawUser.gender,
                        dui: rawUser.dui || rawUser.document_id,
                        isBasicProfile: false
                    };
                }
                  // Asegurar que al menos hay un nombre limpio
                if (!userDataToSave.nombre || userDataToSave.nombre.trim() === '') {
                    const emailParts = (userDataToSave.correo || formData.correo).split('@');
                    let nombreFromEmail = emailParts[0];
                    
                    // Limpiar el nombre extraído del email
                    nombreFromEmail = nombreFromEmail
                        .replace(/[0-9]/g, '') // Remover números
                        .replace(/[._-]/g, ' ') // Reemplazar puntos, guiones y guiones bajos con espacios
                        .trim(); // Remover espacios extra
                    
                    // Capitalizar primera letra de cada palabra
                    nombreFromEmail = nombreFromEmail
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                    
                    userDataToSave.nombre = nombreFromEmail || 'Usuario';
                }
                
                console.log('🔧 LOGIN - Nombre final procesado:', userDataToSave.nombre);
                  console.log('✅ LOGIN - Datos procesados:', {
                    nombre: userDataToSave.nombre,
                    correo: userDataToSave.correo,
                    foto_perfil: userDataToSave.foto_perfil,
                    foto: userDataToSave.foto,
                    isBasicProfile: userDataToSave.isBasicProfile
                });
                  // Si tenemos un perfil básico, intentar obtener datos completos
                if (userDataToSave.isBasicProfile) {
                    console.log('🔄 LOGIN - Intentando obtener datos completos del usuario...');
                    try {
                        // Necesitamos encontrar el ID del usuario basado en el email
                        // Primero, intentar obtener el ID del usuario por email
                        const userSearchResponse = await fetch(`https://api.mamamianpizza.com/api/users/search?email=${encodeURIComponent(formData.correo)}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        let userId = null;
                        
                        if (userSearchResponse.ok) {
                            const searchData = await userSearchResponse.json();
                            userId = searchData.id_usuario || searchData.id;
                            console.log('🔍 LOGIN - ID de usuario encontrado:', userId);                        } else {
                            // Si no hay endpoint de búsqueda, buscar usuario por email en los usuarios existentes
                            console.log('⚠️ LOGIN - Buscando usuario por email en la base de datos...');
                            
                            // Según veo en la BD, hay usuarios con IDs 1, 2, 3, 4
                            // Buscar en un rango más amplio para cubrir usuarios futuros
                            for (let i = 1; i <= 20; i++) {
                                try {
                                    const testResponse = await fetch(`https://api.mamamianpizza.com/api/users/${i}`, {
                                        method: 'GET',
                                        headers: { 'Content-Type': 'application/json' }
                                    });
                                    
                                    if (testResponse.ok) {
                                        const testUser = await testResponse.json();
                                        console.log(`🔍 LOGIN - Verificando usuario ID ${i}:`, testUser.correo);
                                        
                                        if (testUser.correo === formData.correo) {
                                            userId = testUser.id_usuario || testUser.id || i;
                                            console.log(`✅ LOGIN - Usuario encontrado en ID ${i}:`, testUser);
                                            break;
                                        }
                                    } else if (testResponse.status === 404) {
                                        // Usuario no existe, continuar
                                        continue;
                                    }
                                } catch (testError) {
                                    console.log(`⚠️ LOGIN - Error al verificar ID ${i}:`, testError.message);
                                    continue;
                                }
                            }
                        }
                        
                        if (userId) {
                            // Obtener datos completos del usuario
                            const profileResponse = await fetch(`https://api.mamamianpizza.com/api/users/${userId}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            
                            if (profileResponse.ok) {
                                const profileData = await profileResponse.json();
                                console.log('✅ LOGIN - Datos completos obtenidos desde BD:', profileData);
                                  // Actualizar con datos reales de la base de datos
                                userDataToSave = {
                                    id: profileData.id_usuario || profileData.id,
                                    nombre: profileData.nombre || userDataToSave.nombre,
                                    correo: profileData.correo || userDataToSave.correo,
                                    foto_perfil: profileData.foto_perfil,
                                    foto: profileData.foto_perfil,
                                    telefono: profileData.celular || profileData.telefono,
                                    celular: profileData.celular,
                                    fecha_nacimiento: profileData.fecha_nacimiento,
                                    sexo: profileData.sexo,
                                    dui: profileData.dui,
                                    isBasicProfile: false // Ya no es básico
                                };
                                
                                console.log('🎉 LOGIN - Perfil completo desde BD:', {
                                    id: userDataToSave.id,
                                    nombre: userDataToSave.nombre,
                                    correo: userDataToSave.correo,
                                    celular: userDataToSave.celular,
                                    foto_perfil: userDataToSave.foto_perfil
                                });
                            } else {
                                console.log('⚠️ LOGIN - Error al obtener perfil completo, usando básico');
                            }
                        } else {
                            console.log('⚠️ LOGIN - No se encontró ID de usuario, usando perfil básico');
                        }
                    } catch (profileError) {
                        console.log('⚠️ LOGIN - Error al obtener perfil completo:', profileError);
                        // Continuar con perfil básico
                    }
                }
                
                // Llamar a onLogin con los datos finales
                onLogin(userDataToSave);
                setSuccess(true);
                  // Redirigir después de 1 segundo
                setTimeout(() => {
                    console.log('Redirigiendo al home...');
                    navigate('/');
                }, 1500);
            } else {
                // Intentar obtener el mensaje de error de la respuesta
                let errorMessage = "Credenciales incorrectas";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // Si no se puede parsear el JSON, usar mensaje por defecto
                }
                setError(errorMessage);
            }
        }catch (error) {
            console.log(error);
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    }

    return(
  <div className='login'>
        <div className='login__container'>
            <header className='login__header'>
                <h3>Iniciar Sesion</h3>
            </header>            <main className='login__main'>
                {error && (
                    <div className="login__error" style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        border: '1px solid #ffcdd2'
                    }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="login__success" style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        border: '1px solid #c8e6c9'
                    }}>
                        ¡Inicio de sesión exitoso!
                    </div>
                )}
                <form action="" className='login__form'>
                    <input 
                        name='correo' 
                        onChange={handleInputChange} 
                        type="email" 
                        placeholder='Correo Electronico'
                        disabled={loading}
                        required
                    />
                    <input 
                        name="contrasena" 
                        onChange={handleInputChange} 
                        type="password" 
                        placeholder='Contraseña'
                        disabled={loading}
                        required
                    />
                </form>
            </main>
            <button 
                className='login__btn' 
                type="submit" 
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
            <footer className='login__footer'>
                    <p>¿No tienes una cuenta? <a href="/register" className="register-link">Registrate</a></p>
                    <p>¿Olvidaste tu contraseña? <a href="/forgot-password" className="recover-link">Recuperar</a></p>
            </footer>
        </div>
  </div>      
);
}

export default Login;