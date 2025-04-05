import React, { useState } from 'react';
import ProductsCards from '../productsCards/productsCards';
import pizzaIcon from '../../assets/PizzaR.png';
import pizzaCardImg from '../../assets/PizzaCard.png';
import menuBookIcon from '../../assets/menuBook.png';
import searchIcon from '../../assets/search.png';
import './Menu.css';
import Footer from '../footer/footer';

// Datos de prueba para "Recomendación de la Casa"
const datosPrueba = [
  {
    title: "Burrata",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Peperoni",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Jamon",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Burrata",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Peperoni",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Jamon",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Burrata",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Peperoni",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  },
  {
    title: "Jamon",
    Descripcion: "Mozzarella, cebolla caramelizada, jamón y vinagre balsámico",
    img: pizzaCardImg,
    price: "$15.00",
  }
];

// (Opcional) Datos para otra sección "Las más populares"
// const DatosPopular = [ ... ];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="menu-container">
      
      {/* SECCIÓN: CATEGORÍAS Y BÚSQUEDA */}
      <section className="menu-categories-section">
        <h2 className="menu-section-title">
          Nuestro Menú
          <img 
            src={menuBookIcon} 
            alt="Ícono Libro Menú" 
            className="menu-title-icon" 
          />
        </h2>
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
          <div className="menu-search-container">
  <input
    type="text"
    placeholder="Buscar..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="menu-search-input"
  />
  <img 
    src={searchIcon} 
    alt="Buscar" 
    className="menu-search-icon" 
  />
</div>

        </div>
      </section>

      {/* SECCIÓN: RECOMENDACIÓN DE LA CASA */}
      <section className="menu-recommendation-section">
        <div className="menu-recommendation-card">
          <h3 className="recommendation-title">
            Recomendación de la Casa{" "}
            <img src={pizzaIcon} alt="Pizza Icon" className="menu-pizza-icon" />
          </h3>
          <div className="menu-card-container">
            {datosPrueba.map((item, index) => (
              <ProductsCards data={item} key={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer noImage={true}/>
          </div>
    
  );
};

export default Menu;
