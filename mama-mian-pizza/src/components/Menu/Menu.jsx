import React, { useState, useEffect } from 'react';
import ProductsCards from '../productsCards/productsCards';
import Footer from '../footer/footer';
import PizzaModal from '../PizzaModal/PizzaModal';
import pizzaIcon from '../../assets/PizzaR.png';
import pizzaCardImg from '../../assets/PizzaCard.png';
import menuBookIcon from '../../assets/menuBook.png';
import searchIcon from '../../assets/search.png';
import './Menu.css';

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
