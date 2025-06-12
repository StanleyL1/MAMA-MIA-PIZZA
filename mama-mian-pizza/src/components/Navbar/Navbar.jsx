import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo1.png';
import './Navbar.css';
import { Link } from 'react-router-dom';


const Navbar = ({ onCartToggle, cartItemCount, user, onLogout }) => {
const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


const toggleMobileMenu = () => {
  setIsMobileMenuOpen(prev => !prev);
  setIsUserMenuOpen(false);
};





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
     <div className="navbar__user-section">
  {/* Si hay usuario logueado, muestra perfil y cerrar sesión */}
  {user ? (
    <div className="navbar__profile-logged">
      <button
        className="navbar__profile-btn"
        onClick={() => window.location.href = "/Perfil"}
        aria-label="Perfil"
      >
       <img alt='PERFIL'
  src={user.foto}
  className="navbar__profile-photo"
/>

        <span className="navbar__profile-name">{user.nombre}</span>
      </button>
      <button className="navbar__logout-btn" onClick={onLogout}>
        Cerrar Sesión
      </button>
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
