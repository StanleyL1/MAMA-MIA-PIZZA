import React from 'react';
import './Navbar.css';

// Importa tus imágenes (ajusta las rutas según tu estructura)
import pizzaLogo from '../../assets/Pizza.png';
import userIcon from '../../assets/Usuario.png';
import cartIcon from '../../assets/Carrito.png';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        
        <h1>Mama Mian <br />Pizza <img src={pizzaLogo} alt="Logo Pizza" className="brand-logo" /></h1>
      </div>
      
      <nav className="navbar__links">
        <ul>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#pide-ahora">Pide Ahora!!</a></li>
          <li><a href="#sobre-nosotros">Sobre Nosotros</a></li>
        </ul>
      </nav>
      
      <div className="navbar__icons">
        <button className="icon-button" aria-label="Usuario">
          <img src={userIcon} alt="Usuario" className="icon-img" />
        </button>
        <button className="icon-button" aria-label="Carrito">
          <img src={cartIcon} alt="Carrito" className="icon-img" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
