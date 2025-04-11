import React, { useState } from 'react';
// Importa el componente de Font Awesome y los íconos necesarios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Nota: faUser en free-regular para que se vea como outline
import { faUser } from '@fortawesome/free-regular-svg-icons';
// Los siguientes íconos se usan en versión sólida (porque no tienen variante outline gratuita)
import { faPizzaSlice, faCartShopping } from '@fortawesome/free-solid-svg-icons';

import './Navbar.css';

const Navbar = ({ onCartToggle }) => {
  const [mostrarLinks, setMostrarLinks] = useState(false);

  const toggleUserLinks = () => {
    setMostrarLinks(!mostrarLinks);
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <nav className="navbar-title">
          <ul>
            <li>
              <a href="/" className="brand-link">
                <h1>
                  Mama Mian <br /> Pizza
                  {/* Ícono de Pizza (sólido, ya que no hay versión outline gratuita) */}
                  <FontAwesomeIcon 
                    icon={faPizzaSlice} 
                    className="brand-logo" 
                    style={{ color: "#fff", background: "transparent" }} 
                  />
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
            {/* Ícono de usuario outline */}
            <FontAwesomeIcon 
              icon={faUser} 
              className="icon-img" 
              style={{ color: "#fff", background: "transparent" }} 
            />
          </button>
        </div>

        {/* Botón del carrito */}
        <button
          className="icon-button cart-button"
          aria-label="Carrito"
          onClick={onCartToggle}
        >
          {/* Ícono del carrito (sólido) */}
          <FontAwesomeIcon 
            icon={faCartShopping} 
            className="icon-img" 
            style={{ color: "#fff", background: "transparent" }} 
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;