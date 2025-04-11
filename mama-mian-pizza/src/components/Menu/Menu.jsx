import React, { useState, useEffect, useMemo } from 'react';
import ProductsCards from '../productsCards/productsCards';
import Footer from '../footer/footer';
import PizzaModal from '../PizzaModal/PizzaModal';
import pizzaIcon from '../../assets/PizzaR.png';
import menuBookIcon from '../../assets/menuBook.png';
import searchIcon from '../../assets/search.png';
import './Menu.css';

// Datos de prueba para "Recomendación de la Casa

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [menu, setMenu] = useState([]);


  useEffect(() => {
    const fetchMenu = async () =>{
      try {
        const response = await fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/content/getMenu');
        const data = await response.json();
        setMenu(data.productos);
      }catch (error){
        console.log(error)
      }finally{
        console.log('Petición realizada')
      }
    }
    fetchMenu();
  }, [])

  const handleOpenPizza = (pizza) => {
    setSelectedPizza(pizza);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedPizza(null);
  };


  const handleAddToCart = (pizza, masa, tamano) => {
    const exists = cartItems.find(
      (item) => item.title === pizza.title && item.masa === masa && item.tamano === tamano
    );
    if (exists) {
      setCartItems(
        cartItems.map((item) =>
          item === exists ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        title: pizza.title,
        Descripcion: pizza.Descripcion,
        img: pizza.img,
        price: pizza.price,
        cantidad: 1,
        masa,
        tamano,
        disponible: true,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  // Filtrar el menú basado en la categoría activa y el término de búsqueda
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      // Filtro por categoría
      const categoryMatch = 
        activeCategory === 'Todos' || 
        (item.categoria && item.categoria.toLowerCase() === activeCategory.toLowerCase());
      
      // Filtro por término de búsqueda (en título y descripción)
      const searchMatch = 
        searchTerm === '' || 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (item.Descripcion && item.Descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return categoryMatch && searchMatch;
    });
  }, [menu, activeCategory, searchTerm]);

  // Agregar mensaje para cuando no hay resultados
  const noResultsMessage = useMemo(() => {
    if (filteredMenu.length === 0) {
      return (
        <div className="no-results-message">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          <p>Intenta con otros términos o categorías.</p>
        </div>
      );
    }
    return null;
  }, [filteredMenu]);

  // Función para manejar cambios en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para cambiar la categoría activa
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  console.log(menu)
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
          
          {/* Mensaje cuando no hay resultados */}
          {noResultsMessage}
          
          <div className="menu-card-container">
            {filteredMenu.map((item, index) => (
              // Se pasa la función handleOpenPizza a la card para abrir el modal
              <ProductsCards data={item} key={index} onCardClick={() => handleOpenPizza(item)} />
            ))}
          </div>
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
