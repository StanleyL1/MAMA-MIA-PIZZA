import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo1.png';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ onCartToggle, cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
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
          <Link to="/login" className="icon-button" aria-label="Usuario">
            <FontAwesomeIcon icon={faUser} className="icon-img" style={{ color: "#fff", background: "transparent" }} />
          </Link>
        </div>

        {/* Menú hamburguesa */}
        <button className="navbar__toggle icon-button" onClick={toggleMenu} aria-label="Menú">
          <FontAwesomeIcon icon={faBars} className="icon-img" />
        </button>

        {/* Carrito */}
        <button className="icon-button cart-button" aria-label="Carrito" onClick={onCartToggle}>
          <FontAwesomeIcon icon={faCartShopping} className="icon-img" style={{ color: "#fff", background: "transparent" }} />
          {cartItemCount > 0 && <span className="cart__badge">{cartItemCount}</span>}
        </button>
      </div>

      {/* Menú hamburguesa desplegable */}
      {isMenuOpen && (
        <div className="navbar__menu">
        
        </div>
      )}
    </header>
  );
};

export default Navbar;
