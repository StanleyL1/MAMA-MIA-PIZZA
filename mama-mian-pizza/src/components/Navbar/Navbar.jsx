import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCartShopping, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo1.png';
import './Navbar.css';
import { Link } from 'react-router-dom';


const Navbar = ({ onCartToggle, cartItemCount, user, onLogout }) => {
  // Debug mejorado - más claro y conciso
  console.log('🔍 NAVBAR - User recibido:', user ? {
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    foto: user.foto,
    foto_perfil: user.foto_perfil
  } : 'NO USER');

const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

// Estado local para el nombre del usuario para actualizaciones en tiempo real
const [currentUserName, setCurrentUserName] = useState(() => {
  // Inicializar con datos del usuario o desde localStorage como fallback
  if (user?.nombre) {
    console.log('🎯 NAVBAR - Inicializando con nombre del usuario:', user.nombre);
    return user.nombre;
  }
  
  // Intentar cargar desde localStorage si no hay usuario todavía
  try {
    const savedUser = localStorage.getItem('mamamia_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.nombre) {
        console.log('🎯 NAVBAR - Inicializando con nombre de localStorage:', parsedUser.nombre);
        return parsedUser.nombre;
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar nombre desde localStorage:', error);
  }
  
  console.log('🎯 NAVBAR - Sin nombre disponible, usando "Usuario"');
  return 'Usuario';
});

// Estado local para la foto de perfil para actualizaciones en tiempo real
const [currentProfilePhoto, setCurrentProfilePhoto] = useState(() => {
  // Inicializar con datos del usuario o desde localStorage como fallback
  if (user?.foto_perfil || user?.foto) {
    console.log('🎯 NAVBAR - Inicializando con foto del usuario:', user.foto_perfil || user.foto);
    return user.foto_perfil || user.foto;
  }
  
  // Intentar cargar desde localStorage si no hay usuario todavía
  try {
    const savedUser = localStorage.getItem('mamamia_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.foto_perfil || parsedUser.foto) {
        console.log('🎯 NAVBAR - Inicializando con foto de localStorage:', parsedUser.foto_perfil || parsedUser.foto);
        return parsedUser.foto_perfil || parsedUser.foto;
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar foto desde localStorage:', error);
  }
  
  console.log('🎯 NAVBAR - Sin foto disponible, inicializando como null');
  return null;
});

// Cargar datos del usuario desde localStorage al montar el componente
useEffect(() => {
  const loadUserDataFromStorage = async () => {
    try {
      const savedUser = localStorage.getItem('mamamia_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        
        // Cargar foto de perfil
        if (parsedUser && (parsedUser.foto_perfil || parsedUser.foto)) {
          const photoUrl = parsedUser.foto_perfil || parsedUser.foto;
          setCurrentProfilePhoto(photoUrl);
          console.log('🔄 NAVBAR - Foto cargada desde localStorage al montar:', photoUrl);
        }
        
        // Cargar nombre de usuario
        if (parsedUser && parsedUser.nombre) {
          setCurrentUserName(parsedUser.nombre);
          console.log('🔄 NAVBAR - Nombre cargado desde localStorage al montar:', parsedUser.nombre);
        }
        
        // Si hay usuario en localStorage pero sin datos completos, buscar en API
        if (parsedUser && parsedUser.id && (!parsedUser.foto_perfil && !parsedUser.foto)) {
          console.log('🔍 NAVBAR - Usuario en localStorage sin datos completos, buscando en API...');
          try {
            const response = await fetch(`https://api.mamamianpizza.com/api/users/${parsedUser.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            });
              if (response.ok) {
              const userData = await response.json();
              if (userData.foto_perfil) {
                setCurrentProfilePhoto(userData.foto_perfil);
                console.log('✅ NAVBAR - Foto cargada desde API al montar:', userData.foto_perfil);
                
                // Actualizar localStorage con la foto
                const updatedUser = { ...parsedUser, foto_perfil: userData.foto_perfil };
                localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
              }
              
              if (userData.nombre) {
                setCurrentUserName(userData.nombre);
                console.log('✅ NAVBAR - Nombre cargado desde API al montar:', userData.nombre);
                
                // Actualizar localStorage con el nombre
                const updatedUser = { ...parsedUser, nombre: userData.nombre };
                localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
              }
            }          } catch (apiError) {
            console.error('❌ NAVBAR - Error al cargar datos desde API:', apiError);
          }
        }
      }
    } catch (error) {
      console.error('❌ NAVBAR - Error al cargar datos desde localStorage:', error);
    }
  };

  // Ejecutar inmediatamente al montar
  loadUserDataFromStorage();
}, []); // Solo ejecutar una vez al montar

// Actualizar foto y nombre cuando cambie el usuario
useEffect(() => {
  const fetchUserDataIfNeeded = async () => {
    // Si hay usuario pero no tiene foto, buscar datos completos
    if (user?.id && !user?.foto_perfil && !user?.foto) {
      console.log('🔍 NAVBAR - Usuario sin foto, buscando datos completos...');
      try {
        const response = await fetch(`https://api.mamamianpizza.com/api/users/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('📸 NAVBAR - Datos completos obtenidos:', userData);
          
          if (userData.foto_perfil) {
            setCurrentProfilePhoto(userData.foto_perfil);
            console.log('✅ NAVBAR - Foto actualizada desde API:', userData.foto_perfil);
          }
          
          if (userData.nombre) {
            setCurrentUserName(userData.nombre);
            console.log('✅ NAVBAR - Nombre actualizado desde API:', userData.nombre);
          }
          return;
        }
      } catch (error) {
        console.error('❌ NAVBAR - Error al obtener datos del usuario:', error);
      }
    }
    
    // Lógica normal para cuando ya hay datos o no hay usuario
    const newPhoto = user?.foto_perfil || user?.foto || null;
    const newName = user?.nombre || user?.name || 'Usuario';
    
    if (newPhoto !== currentProfilePhoto) {
      console.log('🔄 NAVBAR - Actualizando foto por cambio de usuario:', {
        oldPhoto: currentProfilePhoto,
        newPhoto: newPhoto,
        user: user ? { id: user.id, nombre: user.nombre } : null
      });
      setCurrentProfilePhoto(newPhoto);
    }
    
    if (newName !== currentUserName) {
      console.log('🔄 NAVBAR - Actualizando nombre por cambio de usuario:', {
        oldName: currentUserName,
        newName: newName,
        user: user ? { id: user.id, nombre: user.nombre } : null
      });
      setCurrentUserName(newName);
    }
  };
  fetchUserDataIfNeeded();
}, [user, currentProfilePhoto, currentUserName]); // Incluir user completo para acceso a todas las propiedades

// Debug: Observar cambios en currentProfilePhoto
useEffect(() => {
  console.log('🔍 NAVBAR - currentProfilePhoto cambió a:', currentProfilePhoto);
}, [currentProfilePhoto]);

// Debug: Observar cambios en currentUserName
useEffect(() => {
  console.log('🔍 NAVBAR - currentUserName cambió a:', currentUserName);
}, [currentUserName]);

// Escuchar eventos de actualización de foto de perfil
useEffect(() => {
  const handleProfilePhotoUpdate = (event) => {
    console.log('📸 NAVBAR - Evento profilePhotoUpdated recibido:', event.detail);
    if (event.detail && event.detail.newPhoto) {
      console.log('📸 NAVBAR - Actualizando foto desde evento profilePhotoUpdated:', event.detail.newPhoto);
      setCurrentProfilePhoto(event.detail.newPhoto);
      
      // También actualizar localStorage inmediatamente
      try {
        const savedUser = localStorage.getItem('mamamia_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const updatedUser = { ...parsedUser, foto_perfil: event.detail.newPhoto, foto: event.detail.newPhoto };
          localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
          console.log('💾 NAVBAR - localStorage actualizado con nueva foto');
        }
      } catch (error) {
        console.error('❌ Error al actualizar localStorage:', error);
      }
    }
  };
  
  // Evento personalizado para actualización inmediata de foto
  const handleImmediatePhotoUpdate = (event) => {
    console.log('⚡ NAVBAR - Evento immediatePhotoUpdate recibido:', event.detail);
    if (event.detail && event.detail.photo) {
      console.log('⚡ NAVBAR - Actualizando foto inmediatamente:', event.detail.photo);
      setCurrentProfilePhoto(event.detail.photo);
    }
  };
    const handleProfileDataUpdate = (event) => {
    console.log('📝 NAVBAR - Evento profileDataUpdated recibido:', event.detail);
    if (event.detail && user) {
      // Si viene un nombre en los datos actualizados, usarlo
      if (event.detail.nombre) {
        console.log('📝 NAVBAR - Actualizando nombre desde profileDataUpdated:', event.detail.nombre);
        setCurrentUserName(event.detail.nombre);
      }
      
      // Si viene una foto en los datos actualizados, usarla
      if (event.detail.foto_perfil || event.detail.foto) {
        const newPhoto = event.detail.foto_perfil || event.detail.foto;
        console.log('📸 NAVBAR - Actualizando foto desde profileDataUpdated:', newPhoto);
        setCurrentProfilePhoto(newPhoto);
      }
    }
  };
    // También escuchar cambios en localStorage para sincronización
  const handleStorageChange = (event) => {
    // Solo procesar si el cambio es en mamamia_user
    if (event.key === 'mamamia_user' || !event.key) {
      console.log('📦 NAVBAR - Cambio detectado en localStorage mamamia_user');
      const savedUser = localStorage.getItem('mamamia_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Sincronizar foto
          const newPhoto = parsedUser.foto_perfil || parsedUser.foto || null;
          if (newPhoto !== currentProfilePhoto) {
            console.log('📦 NAVBAR - Sincronizando foto desde localStorage:', newPhoto);
            setCurrentProfilePhoto(newPhoto);
          }
          
          // Sincronizar nombre
          const newName = parsedUser.nombre || 'Usuario';
          if (newName !== currentUserName) {
            console.log('📦 NAVBAR - Sincronizando nombre desde localStorage:', newName);
            setCurrentUserName(newName);
          }
        } catch (error) {
          console.error('❌ Error al sincronizar desde localStorage:', error);
        }
      }
    }
  };
  
  // Agregar todos los event listeners
  window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
  window.addEventListener('immediatePhotoUpdate', handleImmediatePhotoUpdate);
  window.addEventListener('profileDataUpdated', handleProfileDataUpdate);  window.addEventListener('storage', handleStorageChange);

  // Cleanup
  return () => {
    window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    window.removeEventListener('immediatePhotoUpdate', handleImmediatePhotoUpdate);
    window.removeEventListener('profileDataUpdated', handleProfileDataUpdate);
    window.removeEventListener('storage', handleStorageChange);
  };
}, [user, currentProfilePhoto, currentUserName]); // Incluir currentUserName para evitar stale closures


const toggleMobileMenu = () => {
  setIsMobileMenuOpen(prev => !prev);
  setIsUserMenuOpen(false);
  setIsProfileMenuOpen(false);
};

const toggleProfileMenu = () => {
  console.log('toggleProfileMenu llamado, estado actual:', isProfileMenuOpen);
  setIsProfileMenuOpen(prev => {
    console.log('Cambiando de', prev, 'a', !prev);
    return !prev;
  });
  setIsUserMenuOpen(false);
  setIsMobileMenuOpen(false);
};

// Cerrar menús cuando se hace clic fuera
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.navbar__user-section')) {
      setIsProfileMenuOpen(false);
      setIsUserMenuOpen(false);
    }
    if (!event.target.closest('.hamburger-button') && !event.target.closest('.mobile-menu')) {
      setIsMobileMenuOpen(false);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);

// Debug: Mostrar información en consola sobre el estado actual
useEffect(() => {
  console.log('🔍 NAVBAR DEBUG - Estado actual:', {
    user: user ? {
      id: user.id,
      nombre: user.nombre,
      foto_perfil: user.foto_perfil,
      foto: user.foto
    } : 'NO USER',
    currentProfilePhoto,
    currentUserName,
    localStorage: (() => {
      try {
        const saved = localStorage.getItem('mamamia_user');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return 'ERROR';
      }
    })()
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, currentProfilePhoto, currentUserName]); // Incluir todas las dependencias pero con disable para evitar renders excesivos



  return (
    <header className="navbar">
      <div className="navbar__brand">
        <nav className="navbar-title">
          <ul>
            <li>
              <a href="/" className="brand-link">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={Logo} alt="Logo de pizza" className="brand-logo" />
                  <h1 style={{ margin: 15, lineHeight: '1.2' }}>Mamá Mian Pizza</h1>
                </div>
              </a>
            </li>
          </ul>
        </nav>
      </div>

  

   <div className="navbar__links">
        <ul>
          <li><a href="/services">Servicios</a></li>
          <li><a href="/sobrenosotros">Sobre Nosotros</a></li>
        </ul>
      </div>
      <div className="navbar__icons">
        {/* Usuario */}     
        <div className="navbar__user-section" style={{ position: 'relative' }}>
          {/* Si hay usuario logueado, muestra perfil y cerrar sesión */}
          {user ? (
            <div className="navbar__profile-logged" style={{ position: 'relative' }}>
              <button
                className="navbar__profile-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔘 Click en botón de perfil');
                  toggleProfileMenu();
                }}
                aria-label="Perfil de usuario"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}              >                {currentProfilePhoto ? (
                  <img 
                    alt='Foto de perfil'
                    src={`${currentProfilePhoto}${currentProfilePhoto.includes('?') ? '&' : '?'}t=${Date.now()}`}
                    className="navbar__profile-photo"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      marginRight: '8px',
                      objectFit: 'cover',
                      border: '2px solid rgba(255,255,255,0.3)'
                    }}
                    onLoad={() => {
                      console.log('✅ NAVBAR - Imagen cargada exitosamente:', currentProfilePhoto);
                    }}
                    onError={(e) => {
                      console.log('❌ NAVBAR - Error cargando imagen de perfil:', currentProfilePhoto);
                      console.log('❌ NAVBAR - Ocultando imagen y mostrando placeholder');
                      setCurrentProfilePhoto(null);
                    }}
                  />
                ) : (
                  <div 
                    className="navbar__profile-placeholder"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      marginRight: '8px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid rgba(255,255,255,0.3)',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    {(currentUserName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}                <span className="navbar__profile-name" style={{ fontWeight: '500' }}>
                  {currentUserName}
                </span>
                <span style={{ 
                  marginLeft: '6px', 
                  fontSize: '10px',
                  transform: isProfileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}>▼</span>
              </button>
      
                    {/* Menú desplegable del perfil */}
              {isProfileMenuOpen && (
                <ul 
                  className="profile-dropdown"                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    minWidth: '200px',
                    zIndex: 10000,
                    listStyle: 'none',
                    margin: 0,
                    padding: '12px 0',
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >                  <li style={{ padding: '0 16px 8px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      fontWeight: '500' 
                    }}>
                      {currentUserName}
                    </div>
                  </li>                  <li>
                    <Link 
                      to="/Perfil" 
                      onClick={() => {
                        console.log('🔗 Navegando a Perfil');
                        setIsProfileMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <FontAwesomeIcon 
                        icon={faUserCircle} 
                        style={{ 
                          marginRight: '8px', 
                          color: '#007bff',
                          fontSize: '16px' 
                        }} 
                      />
                      Ver Perfil                    </Link>
                  </li>

                  <li style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0 0 0' }}>
                    <button 
                      onClick={() => {
                        console.log('🚪 Cerrando sesión');
                        onLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '12px 16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#dc3545',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <FontAwesomeIcon 
                        icon={faSignOutAlt} 
                        style={{ 
                          marginRight: '8px', 
                          color: '#dc3545',
                          fontSize: '16px' 
                        }} 
                      />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
  ) : (
    // Si no está logueado, icono user como antes
    <button
      className="icon-button"
      onClick={() => {
        if (window.innerWidth > 768) {
          window.location.href = "/login";
        } else {
          setIsUserMenuOpen(prev => !prev);
          setIsMobileMenuOpen(false);
        }
      }}
      aria-label="Usuario"
    >
      <FontAwesomeIcon icon={faUser} className="icon-img" />
    </button>
  )}

  {/* Dropdown solo si no hay usuario */}
  {!user && isUserMenuOpen && (
    <ul className="user-dropdown">
      <li><Link to="/login" onClick={() => setIsUserMenuOpen(false)}>Iniciar Sesión</Link></li>
      <li><Link to="/register" onClick={() => setIsUserMenuOpen(false)}>Registrarse</Link></li>
    </ul>
  )}
</div>

        {/* Carrito */}
        <button className="icon-button cart-button" aria-label="Carrito" onClick={onCartToggle}>
          <FontAwesomeIcon icon={faCartShopping} className="icon-img" style={{ color: "#fff", background: "transparent" }} />
          {cartItemCount > 0 && <span className="cart__badge">{cartItemCount}</span>}
        </button>

        {/* Menú Hamburguesa - visible solo en mobile */}
       <button
  className="hamburger-button"
  aria-label="Menú"
  onClick={toggleMobileMenu}
>
  <FontAwesomeIcon icon={faBars} />
</button>
      </div>

      {/* Menú desplegable en modo móvil */}
      {isMobileMenuOpen && (
        <ul className="mobile-menu">
          <li><Link to="/Services" onClick={() => setIsMobileMenuOpen(false)}>Servicio</Link></li>
          <li><Link to="/SobreNosotros" onClick={() => setIsMobileMenuOpen(false)}>Sobre Nosotros</Link></li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;
