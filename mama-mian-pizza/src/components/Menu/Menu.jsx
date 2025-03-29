import React from 'react';
import './Menu.css'; // Ajusta la ruta

// Si usas imágenes, íconos, etc.
import burrataImg from '../../assets/PizzaCard.png';
import starFull from '../../assets/EstrellaCom.png';
// ... y así con otras imágenes

const Menu = () => {
  return (
    <section className="menu-section">
      <h2 className="menu-title">
        Nuestro Menú <span role="img" aria-label="libro">📖</span>
      </h2>

      {/* Categorías */}
      <div className="menu-categories">
        <button className="menu-category-button active">Todos</button>
        <button className="menu-category-button">Pizzas</button>
        <button className="menu-category-button">Bebidas</button>
        <button className="menu-category-button">Postres</button>
        <button className="menu-category-button">Complementos</button>

        {/* Search bar */}
        <div className="menu-search">
          <input type="text" placeholder="Buscar..." />
          <button className="menu-search-button">🔍</button>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="menu-grid">
        {/* Card 1 */}
        <div className="menu-card">
          <img src={burrataImg} alt="Pizza Burrata" className="menu-card-image" />
          <h3 className="menu-card-title">Burrata</h3>
          <p className="menu-card-description">
            Mozzarella, cebolla caramelizada, queso burrata, jamón, rúgula y vinagre balsámico
          </p>
          <div className="menu-card-rating">
            <img src={starFull} alt="Estrella completa" className="menu-star-icon" />
            <img src={starFull} alt="Estrella completa" className="menu-star-icon" />
            <img src={starFull} alt="Estrella completa" className="menu-star-icon" />
            <img src={starFull} alt="Estrella completa" className="menu-star-icon" />
            <img src={starFull} alt="Estrella completa" className="menu-star-icon" />
          </div>
          <p className="menu-card-price">$5.00</p>
        </div>

        {/* Repite más cards según tus datos */}
        <div className="menu-card">
          {/* ... */}
        </div>
        <div className="menu-card">
          {/* ... */}
        </div>
      </div>
    </section>
  );
};

export default Menu;
