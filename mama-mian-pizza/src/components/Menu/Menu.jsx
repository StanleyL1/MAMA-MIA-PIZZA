import React, { useState, useEffect, useMemo } from 'react';
import ProductsCards from '../productsCards/productsCards';
import Footer from '../footer/footer';
import PizzaModal from '../PizzaModal/PizzaModal';
import pizzaIcon from '../../assets/PizzaR.png';
import menuBookIcon from '../../assets/menuBook.png';
import searchIcon from '../../assets/search.png';
import './Menu.css';

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
  }, []);

  // Filtrar productos en tiempo real según la categoría y término de búsqueda
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      // Primero filtrar por categoría
      const matchesCategory = 
        activeCategory === 'Todos' || 
        (item.categoria && item.categoria.toLowerCase() === activeCategory.toLowerCase());
      
      // Luego filtrar por término de búsqueda (título y descripción)
      const matchesSearch = 
        searchTerm === '' || 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.Descripcion && item.Descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // El producto se incluye si coincide con ambos filtros
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchTerm]);

  const handleOpenPizza = (pizza) => {
    setSelectedPizza(pizza);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedPizza(null);
  };

  // Función para manejar el cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
  
  // Verificar si hay productos en la categoría filtrada
  const noProductsMessage = useMemo(() => {
    if (filteredMenu.length === 0) {
      return (
        <div className="no-products-message">
          <p>No se encontraron productos {searchTerm ? `que coincidan con "${searchTerm}"` : ''} 
             {activeCategory !== 'Todos' ? ` en la categoría "${activeCategory}"` : ''}</p>
          <p>Intenta con otra búsqueda o categoría</p>
        </div>
      );
    }
    return null;
  }, [filteredMenu, searchTerm, activeCategory]);

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
          
          {/* Mostrar mensaje cuando no hay productos */}
          {noProductsMessage}
          
          <div className="menu-card-container">
            {filteredMenu.map((item, index) => (
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
