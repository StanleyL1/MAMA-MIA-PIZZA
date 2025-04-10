import React, { useState } from 'react';
import './Navbar.css';

// Importa tus imágenes
import pizzaLogo from '../../assets/Pizza.png';
import userIcon from '../../assets/Usuario.png';
import cartIcon from '../../assets/Carrito.png';

const Navbar = ({ onCartToggle }) => {
  const [mostrarLinks, setMostrarLinks] = useState(false);

  const toggleUserLinks = () => {
    setMostrarLinks(!mostrarLinks);
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <nav className="navbar__links">
          <ul>
            <li>
              <a href="/">
                <h1>
                  Mama Mian <br /> Pizza
                  <img src={pizzaLogo} alt="Logo Pizza" className="brand-logo" />
                </h1>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <nav className="navbar__links">
        <ul>
          <li><a href="/services">Servicios</a></li>
          <li><a href="#pideahora">Pide Ahora!!</a></li>
          <li><a href="/sobrenosotros">Sobre Nosotros</a></li>
        </ul>
      </nav>

      <div className="navbar__icons">
        {/* Sección de usuario */}
        <div className="navbar__user-section">
          <button 
            className="icon-button" 
            aria-label="Usuario"
            onClick={toggleUserLinks}
          >
            <img src={userIcon} alt="Usuario" className="icon-img" />
          </button>

          {mostrarLinks && (
            <div className="navbar__user-links">
              <a href="/login">Iniciar sesión</a>
              <a href="/register">Registrar</a>
            </div>
          )}
        </div>

        {/* Icono de Carrito */}
        <button 
          className="icon-button cart-button" 
          aria-label="Carrito"
          onClick={onCartToggle}
        >
          <img src={cartIcon} alt="Carrito" className="icon-img" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
