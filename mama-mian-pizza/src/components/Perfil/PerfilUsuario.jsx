import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit, faShieldAlt, faArrowLeft, faEye, faEyeSlash,
  faSpinner, faCamera, faUser, faEnvelope, faPhone,
  faCalendarAlt, faIdCard
} from "@fortawesome/free-solid-svg-icons";
import perfilFoto from '../../assets/perfilfoto.png';
import { updateUserData, updateUserPhoto } from '../../utils/userStorage';

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

export default function PerfilUsuario({ 
  user, 
  updateUser, 
  setToast, 
  showProfileMessage,
  activeTab,
  setActiveTab 
}) {
  // Estado de perfil del usuario - usar datos reales si están disponibles
  const [userPerfil, setUserPerfil] = useState({
    nombre: user?.nombre || 'Usuario',
    email: user?.correo || user?.email || 'usuario@email.com',
    telefono: user?.telefono || user?.celular || '+503 0000-0000',
    foto: user?.foto_perfil || user?.foto || perfilFoto,
    miembroDesde: user?.fecha_registro ? new Date(user.fecha_registro).getFullYear() : new Date().getFullYear(),
    fecha_nacimiento: user?.fecha_nacimiento || '',
    dui: user?.dui || user?.numero_dui || '',
  });

  // Formulario de edición
  const [formData, setFormData] = useState({
    nombre: userPerfil.nombre,
    email: userPerfil.email,
    telefono: userPerfil.telefono,
  });
  const [editSuccess, setEditSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para manejo de foto de perfil
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Estados para modal de cambiar contraseña
  const [showCambiarContra, setShowCambiarContra] = useState(false);

  const fileInputRef = useRef(null);

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para guardar cambios del perfil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    
    try {
      console.log('💾 Guardando perfil para usuario ID:', user.id);
      console.log('📝 Datos a enviar:', formData);
      
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.email,
          telefono: formData.telefono,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }

      const result = await response.json();
      console.log('✅ Perfil actualizado:', result);

      // Actualizar estado local
      setUserPerfil(prev => ({
        ...prev,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
      }));

      // Actualizar datos en localStorage
      updateUserData({
        nombre: formData.nombre,
        correo: formData.email,
        telefono: formData.telefono,
      });

      // Actualizar usuario en el componente padre
      if (updateUser) {
        updateUser({
          ...user,
          nombre: formData.nombre,
          correo: formData.email,
          telefono: formData.telefono,
        });
      }

      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
      
      if (showProfileMessage) {
        showProfileMessage('¡Perfil actualizado correctamente!');
      }
      
      if (setToast) {
        setToast('Perfil actualizado correctamente');
      }

    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      if (showProfileMessage) {
        showProfileMessage('Error al actualizar el perfil. Intenta de nuevo.', 'error');
      }
    } finally {
      setIsEditing(false);
    }
  };

  // Función para manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        if (showProfileMessage) {
          showProfileMessage('La imagen debe ser menor a 5MB', 'error');
        }
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Función para subir foto de perfil
  const handleUploadPhoto = async () => {
    if (!selectedImage) return false;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('foto_perfil', selectedImage);

      console.log('📸 Subiendo foto de perfil para usuario ID:', user.id);

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/profile`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor al subir foto:', errorData);
        throw new Error(`Error al subir foto: ${response.status} - ${errorData.message || 'Error desconocido'}`);
      }      

      const result = await response.json();
      console.log('✅ Foto de perfil actualizada:', result);      

      // Actualizar la foto en el estado local con la URL real de la API
      const newPhotoUrl = result.foto_perfil || result.foto;
      if (newPhotoUrl) {
        setUserPerfil(prev => ({
          ...prev,
          foto: newPhotoUrl
        }));

        // INMEDIATAMENTE guardar en localStorage para persistencia
        const updatedUserData = updateUserPhoto(newPhotoUrl);
        
        // Actualizar el usuario en App.jsx para sincronizar con navbar
        if (updateUser) {
          updateUser({
            ...user,
            foto_perfil: newPhotoUrl,
            foto: newPhotoUrl
          });
        }

        // Disparar evento para actualizar navbar con la URL real
        const profileUpdateEvent = new CustomEvent('profilePhotoUpdated', {
          detail: {
            newPhoto: newPhotoUrl,
            userId: user.id
          }
        });
        window.dispatchEvent(profileUpdateEvent);
        
        console.log('💾 Foto guardada en localStorage:', updatedUserData);
      }

      // Limpiar estados de imagen
      setImagePreview(null);
      setSelectedImage(null);
      
      // Reset del input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (showProfileMessage) {
        showProfileMessage('¡Foto de perfil actualizada correctamente!');
      }

      return true;

    } catch (error) {
      console.error('❌ Error al subir foto de perfil:', error);
      if (showProfileMessage) {
        showProfileMessage('Error al subir la foto. Intenta de nuevo.', 'error');
      }
      return false;
    } finally {
      setUploadingImage(false);
    }
  };

  if (activeTab === 'editar') {
    return (
      <div className="perfil__edit-form">
        <div className="perfil__form-title">Editar Perfil</div>
        
        {/* Sección de foto de perfil */}
        <div className="perfil__photo-section">
          <div className="perfil__photo-current">
            <img 
              src={imagePreview || userPerfil.foto} 
              alt="Foto de perfil" 
              className="perfil__photo-preview"
            />
            <button 
              className="perfil__photo-change-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
            >
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            id="profile-photo-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          
          {imagePreview && (
            <div className="perfil__photo-actions">
              <button 
                className="perfil__photo-upload-btn"
                onClick={handleUploadPhoto}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Subiendo...
                  </>
                ) : (
                  'Guardar foto'
                )}
              </button>
              <button 
                className="perfil__photo-cancel-btn"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Formulario de datos personales */}
        <form onSubmit={handleSaveProfile}>
          <div className="perfil__form-group">
            <label className="perfil__form-label">
              <FontAwesomeIcon icon={faUser} />
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="perfil__form-input"
              required
            />
          </div>

          <div className="perfil__form-group">
            <label className="perfil__form-label">
              <FontAwesomeIcon icon={faEnvelope} />
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="perfil__form-input"
              required
            />
          </div>

          <div className="perfil__form-group">
            <label className="perfil__form-label">
              <FontAwesomeIcon icon={faPhone} />
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="perfil__form-input"
              required
            />
          </div>

          {/* Campos de solo lectura */}
          {userPerfil.fecha_nacimiento && (
            <div className="perfil__form-group">
              <label className="perfil__form-label">
                <FontAwesomeIcon icon={faCalendarAlt} />
                Fecha de nacimiento
              </label>
              <input
                type="date"
                value={userPerfil.fecha_nacimiento}
                className="perfil__form-input"
                disabled
              />
            </div>
          )}

          {userPerfil.dui && (
            <div className="perfil__form-group">
              <label className="perfil__form-label">
                <FontAwesomeIcon icon={faIdCard} />
                DUI
              </label>
              <input
                type="text"
                value={userPerfil.dui}
                className="perfil__form-input"
                disabled
              />
            </div>
          )}

          {editSuccess && (
            <div className="perfil__success-message">
              ¡Perfil actualizado correctamente!
            </div>
          )}

          <button
            type="submit"
            className="perfil__save-btn"
            disabled={isEditing}
          >
            {isEditing ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Guardando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEdit} />
                Guardar cambios
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  if (activeTab === 'seguridad') {
    return (
      <div className="perfil__security-section">
        <div className="perfil__form-title">Configuración de Seguridad</div>
        
        <div className="perfil__security-options">
          <div className="perfil__security-option">
            <div className="perfil__security-icon">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <div className="perfil__security-content">
              <div className="perfil__security-title">
                Contraseña
              </div>
              <div className="perfil__security-desc">
                Mantén tu cuenta segura con una contraseña fuerte
              </div>
              <button 
                className="perfil__security-btn" 
                onClick={() => setShowCambiarContra(true)}
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Modal Cambiar Contraseña */}
        {showCambiarContra && (
          <CambiarContraseñaModal
            email={userPerfil.email}
            user={user}
            onClose={() => setShowCambiarContra(false)}
            onSuccess={(message) => {
              if (showProfileMessage) {
                showProfileMessage(message);
              }
              if (setToast) {
                setToast(message);
              }
            }}
          />
        )}
      </div>
    );
  }

  return null;
}

// --- MODAL CAMBIAR CONTRASEÑA ---
function CambiarContraseñaModal({ email, onClose, onSuccess, user }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState("");

  const requisitos = [
    { msg: "Debe tener al menos 8 caracteres", valid: newPass.length >= 8 },
    { msg: "Debe contener al menos una letra mayúscula", valid: /[A-Z]/.test(newPass) },
    { msg: "Debe contener al menos un número", valid: /\d/.test(newPass) },
    { msg: "Debe contener al menos un carácter especial", valid: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(newPass) },
  ];

  const handleChangePass = async (e) => {
    e.preventDefault();
    setError("");
    
    if (newPass !== confirmPass) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!requisitos.every(r => r.valid)) {
      setError("La nueva contraseña no cumple con los requisitos de seguridad");
      return;
    }

    if (!user?.id) {
      setError("Error: No se pudo identificar el usuario");
      return;
    }

    setChanging(true);

    try {
      console.log('🔐 Cambiando contraseña para usuario ID:', user.id);
      
      const requestBody = {
        id_usuario: user.id,
        contrasenaActual: currentPass,
        nuevaContrasena: newPass
      };
      
      console.log('📤 Datos enviados:', requestBody);
      
      const response = await fetch('https://api.mamamianpizza.com/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Status de respuesta:', response.status);

      const result = await response.json();
      console.log('📥 Respuesta completa del servidor:', result);

      if (!response.ok) {
        console.error('❌ Error HTTP:', response.status, response.statusText);
        console.error('❌ Respuesta de error del servidor:', result);
        
        // Manejar errores específicos del servidor
        if (response.status === 400) {
          setError(result.message || result.error || "Datos inválidos. Verifica que la contraseña actual sea correcta.");
        } else if (response.status === 401) {
          setError(result.message || result.error || "La contraseña actual es incorrecta.");
        } else if (response.status === 404) {
          setError(result.message || result.error || "Usuario no encontrado.");
        } else if (response.status === 422) {
          setError(result.message || result.error || "Error de validación. Verifica que las contraseñas cumplan los requisitos.");
        } else {
          setError(result.message || result.error || `Error del servidor (${response.status}). Inténtalo de nuevo.`);
        }
        return;
      }

      console.log('✅ Contraseña cambiada exitosamente:', result);
      
      // Éxito
      if (onSuccess) {
        onSuccess("¡Contraseña actualizada correctamente!");
      }
      
      onClose();
      
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      setError("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="modal__overlay" style={{ zIndex: 99999 }}>
      <div className="modal__content modal__full-white" style={{ maxWidth: 500, padding: 0 }}>
        {/* Header */}
        <button className="modal__back-btn" onClick={onClose} style={{ margin: 20 }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <div className="cambiar__titulo">Cambiar Contraseña</div>
        
        <div className="cambiar__box">
          <div className="cambiar__verif-title">
            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 7, color: "#c42f2f" }} />
            Actualizar Contraseña
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form className="cambiar__pass-form" onSubmit={handleChangePass}>
            {/* Contraseña actual */}
            <div className="cambiar__pass-label">Contraseña actual</div>
            <div className="cambiar__pass-input-group">
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                className="cambiar__pass-input"
                required
                autoFocus
                placeholder="Ingresa tu contraseña actual"
              />
              <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowCurrentPass(p => !p)}>
                <FontAwesomeIcon icon={showCurrentPass ? faEye : faEyeSlash} />
              </button>
            </div>

            {/* Nueva contraseña */}
            <div className="cambiar__pass-label">Nueva contraseña</div>
            <div className="cambiar__pass-input-group">
              <input
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                className="cambiar__pass-input"
                required
                placeholder="Ingresa tu nueva contraseña"
              />
              <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowNewPass(p => !p)}>
                <FontAwesomeIcon icon={showNewPass ? faEye : faEyeSlash} />
              </button>
            </div>

            {/* Requisitos de seguridad */}
            {newPass && (
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
            )}

            {/* Confirmar nueva contraseña */}
            <div className="cambiar__pass-label">Confirmar nueva contraseña</div>
            <div className="cambiar__pass-input-group">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                className="cambiar__pass-input"
                required
                placeholder="Confirma tu nueva contraseña"
              />
              <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowConfirmPass(p => !p)}>
                <FontAwesomeIcon icon={showConfirmPass ? faEye : faEyeSlash} />
              </button>
            </div>

            {/* Botón guardar cambios */}
            <button
              className="cambiar__verif-btn cambiar__verif-btn--orange"
              style={{ 
                width: '100%', 
                fontWeight: 500, 
                marginTop: 24,
                opacity: (currentPass && newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) ? 1 : 0.5 
              }}
              type="submit"
              disabled={!(currentPass && newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) || changing}
            >
              {changing ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: 8 }} />
                  Guardando cambios...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
