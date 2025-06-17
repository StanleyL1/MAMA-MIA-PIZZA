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

// Estado local para la foto de perfil para actualizaciones en tiempo real
const [currentProfilePhoto, setCurrentProfilePhoto] = useState(
  user?.foto_perfil || user?.foto || require('../../assets/perfilfoto.png')
);

// Actualizar foto cuando cambie el usuario
useEffect(() => {
  setCurrentProfilePhoto(
    user?.foto_perfil || user?.foto || require('../../assets/perfilfoto.png')
  );
}, [user]);

// Escuchar eventos de actualización de foto de perfil
useEffect(() => {
  const handleProfilePhotoUpdate = (event) => {
    console.log('📸 NAVBAR - Evento de actualización de foto recibido:', event.detail);
    if (event.detail && event.detail.newPhoto) {
      setCurrentProfilePhoto(event.detail.newPhoto);
    }
  };

  const handleProfileDataUpdate = (event) => {
    console.log('📝 NAVBAR - Evento de actualización de datos recibido:', event.detail);
    // La actualización de datos se maneja a través del prop user
    // Este evento se puede usar para hacer refresh si es necesario
  };

  window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
  window.addEventListener('profileDataUpdated', handleProfileDataUpdate);

  return () => {
    window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    window.removeEventListener('profileDataUpdated', handleProfileDataUpdate);
  };
}, []);


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
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >        
                <img 
                  alt='Foto de perfil'
                  src={currentProfilePhoto}
                  className="navbar__profile-photo"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    marginRight: '8px',
                    objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}                  onError={(e) => {
                    console.log('❌ Error cargando imagen de perfil, usando por defecto');
                    e.target.src = require('../../assets/perfilfoto.png');
                    setCurrentProfilePhoto(require('../../assets/perfilfoto.png'));
                  }}
                />                <span className="navbar__profile-name" style={{ fontWeight: '500' }}>
                  {user.nombre || user.name || 'Usuario'}
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
                      {user.nombre || user.name || 'Usuario'}
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
                      Ver Perfil
                    </Link>
                  </li><li style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0 0 0' }}>
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
