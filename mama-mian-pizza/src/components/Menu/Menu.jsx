import React, { useState } from 'react';
import './Menu.css';
import Footer from '../footer/footer';

// Imágenes e íconos (ajusta las rutas según tu estructura)
import burrataImg from '../../assets/PizzaCard.png';
import starFull from '../../assets/EstrellaCom.png';

const Menu = () => {
  // Estados para categoría y búsqueda (lógica de filtrado de ejemplo)
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo para productos (puedes reemplazar con datos reales)
  const products = [
    {
      id: 1,
      name: "Burrata",
      description: "Mozzarella, cebolla caramelizada, jamón, rúgula y vinagre balsámico",
      price: "$5.00",
      image: burrataImg,
      rating: 5
    },
    {
      id: 2,
      name: "Margherita",
      description: "Mozzarella, tomate, albahaca fresca y aceite de oliva",
      price: "$6.00",
      image: burrataImg,
      rating: 4
    },
    {
      id: 3,
      name: "Pepperoni",
      description: "Mozzarella, pepperoni, salsa de tomate y orégano",
      price: "$7.00",
      image: burrataImg,
      rating: 5
    }
    // Agrega más productos según necesites
  ];

  // Filtrado básico (en este ejemplo solo se filtra por nombre)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="menu-container">
      <section className="menu-section">
        <h2 className="menu-title">
          Nuestro Menú <span role="img" aria-label="libro">📖</span>
        </h2>

        {/* Categorías y búsqueda */}
        <div className="menu-categories">
          <button
            className={`menu-category-button ${activeCategory === "Todos" ? "active" : ""}`}
            onClick={() => setActiveCategory("Todos")}
          >
            Todos
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Pizzas" ? "active" : ""}`}
            onClick={() => setActiveCategory("Pizzas")}
          >
            Pizzas
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Bebidas" ? "active" : ""}`}
            onClick={() => setActiveCategory("Bebidas")}
          >
            Bebidas
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Postres" ? "active" : ""}`}
            onClick={() => setActiveCategory("Postres")}
          >
            Postres
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Complementos" ? "active" : ""}`}
            onClick={() => setActiveCategory("Complementos")}
          >
            Complementos
          </button>

          <div className="menu-search">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="menu-search-button">🔍</button>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="menu-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="menu-card">
              <img src={product.image} alt={product.name} className="menu-card-image" />
              <h3 className="menu-card-title">{product.name}</h3>
              <p className="menu-card-description">{product.description}</p>
              <div className="menu-card-rating">
                {[...Array(product.rating)].map((_, index) => (
                  <img key={index} src={starFull} alt="Estrella completa" className="menu-star-icon" />
                ))}
              </div>
              <p className="menu-card-price">{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer sin imagen de fondo */}
      <Footer noImage />
    </div>
  );
};

export default Menu;
