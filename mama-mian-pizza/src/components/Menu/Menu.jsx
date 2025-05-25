import React, { useState, useEffect, useMemo } from 'react';
import ProductsCards from '../productsCards/productsCards';
import Footer from '../footer/footer';
import PizzaModal from '../PizzaModal/PizzaModal';
import pizzaIcon from '../../assets/PizzaR.png';
import menuBookIcon from '../../assets/menuBook.png';
import searchIcon from '../../assets/search.png';
import './Menu.css';

// Mapeo de categorías a sus IDs correspondientes
const CATEGORY_MAP = {
  'Todos': 'all',
  'Pizzas': '1',
  'Complementos': '3',
  'Bebidas': '5',
  'Postres': '4' // Asumiendo que postres es ID 4, ajustar según sea necesario
};

// Mapeo inverso para mostrar nombres en la UI
const ID_TO_CATEGORY = {
  '1': 'Pizzas',
  '3': 'Complementos',
  '4': 'Postres',
  '5': 'Bebidas'
};

const Menu = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://server.tiznadodev.com/api/content/getMenu');
        const data = await response.json();
        setMenu(data.productos);
        console.log("Productos obtenidos:", data.productos);
        // Visualizar las categorías disponibles
        const categorias = [...new Set(data.productos.map(item => `${item.Id_Categoria} - ${ID_TO_CATEGORY[item.Id_Categoria] || 'Desconocido'}`))];
        console.log("Categorías disponibles:", categorias);
      } catch (error) {
        console.log(error)
      } finally {
        console.log('Petición realizada');
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Filtrar productos según la categoría activa y término de búsqueda
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      // Verificar si el producto pertenece a la categoría seleccionada
      const categoryId = CATEGORY_MAP[activeCategory];
      const matchesCategory = 
        activeCategory === 'Todos' || 
        (item.id_categoria && item.id_categoria.toString() === categoryId);
      
      // Verificar si el producto coincide con el término de búsqueda
      const matchesSearch = 
        !searchTerm || 
        (item.titulo && item.titulo.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // El producto debe coincidir con ambas condiciones para ser incluido
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchTerm]);

  const handleOpenPizza = (pizza) => {
    console.log("Abriendo modal para pizza:", pizza);
    setSelectedPizza(pizza);
  };

  const handleCloseModal = () => {
    setSelectedPizza(null);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToCart = (pizza, masa, tamano, instrucciones, ingredientes) => {
    // Simplemente usamos la función onAddToCart que nos pasaron como prop
    console.log("Menu: Añadiendo al carrito", pizza);
    onAddToCart(pizza, masa, tamano, instrucciones, ingredientes);
    handleCloseModal();
  };

  return (
    <div className="menu-container">
      
      {/* SECCIÓN: CATEGORÍAS Y BÚSQUEDA */}
      <section className="menu-categories-section">
      <h2 className="menu-section-title">
  <span className="menu-title-text">Nuestro Menú</span>
  <img 
    src={menuBookIcon} 
    alt="Ícono Libro Menú" 
    className="menu-title-icon" 
  />
</h2>

        <div className="menu-categories">
          <button
            className={`menu-category-button ${activeCategory === "Todos" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Todos")}
          >
            Todos
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Pizzas" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Pizzas")}
          >
            Pizzas
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Bebidas" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Bebidas")}
          >
            Bebidas
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Postres" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Postres")}
          >
            Postres
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Complementos" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Complementos")}
          >
            Complementos
          </button>
          <div className="menu-search-container">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
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

      {/* SECCIÓN: PRODUCTOS FILTRADOS */}
      <section className="menu-recommendation-section">
        <div className="menu-recommendation-card">
          <h3 className="recommendation-title">
            {activeCategory === 'Todos' ? 'Todos los Productos' : activeCategory}{" "}
            <img src={pizzaIcon} alt="Pizza Icon" className="menu-pizza-icon" />
          </h3>
          
          {loading ? (
            <div className="loading-container">
              <p>Cargando productos...</p>
            </div>
          ) : filteredMenu.length > 0 ? (
            <div className="menu-card-container">
              {filteredMenu.map((item, index) => (
                <ProductsCards 
                  data={item} 
                  key={index} 
                  onCardClick={() => handleOpenPizza(item)} 
                />
              ))}
            </div>
          ) : (
            <div className="no-products-message">
              <img src={pizzaIcon} alt="No hay productos" className="no-products-icon" />
              <p>No se encontraron productos {searchTerm ? `que coincidan con "${searchTerm}"` : ''} 
                 {activeCategory !== 'Todos' ? ` en la categoría "${activeCategory}"` : ''}</p>
              <p>Intenta con otra búsqueda o categoría</p>
            </div>
          )}
        </div>
      </section>

      <Footer noImage={true} />

      {/* Modal de Pizza */}
      {selectedPizza && (
        <PizzaModal 
          pizza={selectedPizza}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Menu;
