import React, { useState } from 'react';
// Importa el componente de Font Awesome y los íconos necesarios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Nota: faUser en free-regular para que se vea como outline
import { faUser } from '@fortawesome/free-regular-svg-icons';
// Los siguientes íconos se usan en versión sólida (porque no tienen variante outline gratuita)
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo1.png';
import './Navbar.css';

const Navbar = ({ onCartToggle, cartItemCount }) => {
  const [mostrarLinks, setMostrarLinks] = useState(false); // Para el usuario
  const [menuOpen, setMenuOpen] = useState(false);         // Para el menú hamburguesa
  
  
  const toggleUserLinks = () => {
    setMostrarLinks(!mostrarLinks);
  };
  
    const toggleMenu = () => {
      setMenuOpen(prev => !prev);
    };
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <nav className="navbar-title">
          <ul>
            <li>
              <a href="/" className="brand-link">
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img 
      src={Logo} 
      alt="Logo de pizza" 
      className="brand-logo" 
    />
    <h1 style={{ margin: 15, lineHeight: '1.2' }}>
      Mama Mian Pizza
    </h1>
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

    <button className="navbar__toggle" onClick={toggleMenu}>☰</button>

    {menuOpen && (
      <div className="navbar__menu">
        <ul>
          <li><a href="/services">Servicios</a></li>
          <li><a href="/sobrenosotros">Sobre Nosotros</a></li>
        </ul>
      </div>
    )}
      <div className="navbar__icons">
        {/* Sección de usuario */}
        <div className="navbar__user-section">
      <button
        className="icon-button"
        aria-label="Usuario"
        onClick={toggleUserLinks}
      >
        <FontAwesomeIcon
          icon={faUser}
          className="icon-img"
          style={{ color: "#fff", background: "transparent" }}
        />
      </button>

      <div className={`navbar__user-links ${mostrarLinks ? "" : "hidden"}`}>
        <a href="/login">Iniciar Sesión</a>
        <a href="/registro">Registrarse</a>
      </div>
    </div>

      
        {/* Botón del carrito */}
        <button
          className="icon-button cart-button"
          aria-label="Carrito"
          onClick={onCartToggle}
        >
          <FontAwesomeIcon 
            icon={faCartShopping} 
            className="icon-img" 
            style={{ color: "#fff", background: "transparent" }} 
          />
          {cartItemCount > 0 && (
            <span className="cart__badge">{cartItemCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;