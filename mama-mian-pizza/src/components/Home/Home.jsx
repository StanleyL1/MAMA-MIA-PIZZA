import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMedal, faTruck, faCarrot } from '@fortawesome/free-solid-svg-icons';
import ProductsCards from '../productsCards/productsCards';
import PizzaModal from '../PizzaModal/PizzaModal';
import Footer from '../footer/footer';
import TestimonialCard from '../ComentsCards/ComentCards';

// Assets imports
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png'; 
import robotIcon from '../../assets/Robot.png';
import usuario1Img from '../../assets/Usuario1.png';
import usuario2Img from '../../assets/Usuario2.png';
import usuario3Img from '../../assets/usuario3.png';

import './Home.css';

// Datos de testimonios más variados y realistas
const datosTestimonios = [
  {
    avatar: usuario1Img,
    name: 'María Rodríguez',
    time: 'hace 2 semanas',
    comment: 'La pizza de pepperoni que pedí estaba increíble. La masa tenía el punto perfecto entre crujiente y esponjosa. ¡Definitivamente volveré a pedir!'
  },
  {
    avatar: usuario2Img,
    name: 'Carlos Méndez',
    time: 'hace 3 días',
    comment: 'El servicio de entrega fue super rápido. La pizza llegó caliente y el repartidor muy amable. La especialidad de la casa es realmente espectacular.'
  },
  {
    avatar: usuario3Img,
    name: 'Laura Sánchez',
    time: 'hace 1 semana',
    comment: 'Pedí para una reunión familiar y todos quedaron encantados. La variedad de ingredientes frescos se nota en el sabor. Su salsa de tomate es única.'
  },
];

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [recomendacion, setRecomendaciones] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Realizar ambas peticiones en paralelo
        const [recomendacionesRes, popularRes] = await Promise.all([
          fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/content/recomendacion'),
          fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/content/MostPopular')
        ]);
        
        const recomendacionData = await recomendacionesRes.json();
        const popularData = await popularRes.json();
        
        setRecomendaciones(recomendacionData.productos || []);
        setPopular(popularData.productos || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        // Establecer datos de respaldo en caso de error
        setRecomendaciones([]);
        setPopular([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleOpenPizza = (pizza) => {
    setSelectedPizza(pizza);
  };

  const handleCloseModal = () => {
    setSelectedPizza(null);
  };

  // Función para agregar la pizza al carrito (incluye opciones)
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

  return (
    <div className="main__content">
      {/* Sección HERO */}
      <section className="hero__container">
        <div className="hero__text__container">
          <h1 className="hero__title">Las mejores pizzas</h1>
          <p className="hero__text">
            Ingredientes frescos, masa artesanal y sabores únicos que te harán volver por más.
          </p>
          <button className="hero__button">
            <Link to="/menu" className="link">Ver Menú</Link>
          </button>
        </div>
      </section>
      
      {/* Sección de Recomendación de la Casa */}
      <section className="house__choice__section">
        <h2 className="house__choice__title">
          Recomendación de la Casa <img src={pizzaIcon} alt="Pizza Icon" />
        </h2>
        <div className="whyus__content">
          {isLoading ? (
            <p>Cargando recomendaciones...</p>
          ) : recomendacion && recomendacion.length > 0 ? (
            recomendacion.map((item, index) => (
              <ProductsCards 
                data={item} 
                key={index}
                onCardClick={() => handleOpenPizza(item)}
              />
            ))
          ) : (
            <p>No hay recomendaciones disponibles en este momento.</p>
          )}
        </div>
      </section>
      
      {/* Sección de Pizzas Populares */}
      <section className="trending__section">
        <h2 className="trending__title">
          Las más populares <img src={fireIcon} alt="Fire Icon" />
        </h2>
        <div className="whyus__content">
          {isLoading ? (
            <p>Cargando pizzas populares...</p>
          ) : popular && popular.length > 0 ? (
            popular.map((item, index) => (
              <ProductsCards 
                data={item} 
                key={index}
                onCardClick={() => handleOpenPizza(item)}
              />
            ))
          ) : (
            <p>No hay pizzas populares disponibles en este momento.</p>
          )}
        </div>
      </section>
      
      {/* Sección "¿Por qué elegir Mama Mian Pizza?" */}
      <section className="whyus__section">
        <h2 className="whyus__header">¿Por qué elegir Mama Mian Pizza?</h2>
        <div className="whyus__contentt">
          <div className="whyus__cards">
            <i><FontAwesomeIcon icon={faClock} /></i>
            <h3 className="whyus__card__title">Entrega rápida</h3>
            <p className="whyus__card__description">
              Garantizamos tu entrega en 30 minutos o menos. Nuestro equipo de reparto es rápido, eficiente y siempre puntual.
            </p>
          </div>
          
          <div className="whyus__cards">
            <i><FontAwesomeIcon icon={faMedal} /></i>
            <h3 className="whyus__card__title">Recetas premiadas</h3>
            <p className="whyus__card__description">
              Nuestras pizzas han ganado múltiples premios por su sabor único. Desde Nápoles, la cuna de la pizza.
            </p>
          </div>
          
          <div className="whyus__cards">
            <i><FontAwesomeIcon icon={faTruck} /></i>
            <h3 className="whyus__card__title">Envío gratuito</h3>
            <p className="whyus__card__description">
              Disfruta de envío gratis en todos los pedidos superiores a $25. No hay costos ocultos ni restricciones, ¡tu pizza llega sin costos extra!
            </p>
          </div>
          
          <div className="whyus__cards">
            <i><FontAwesomeIcon icon={faCarrot} /></i>
            <h3 className="whyus__card__title">Ingredientes frescos</h3>
            <p className="whyus__card__description">
              Obtenemos nuestros ingredientes directamente de productores locales. Sin conservantes ni sabores artificiales.
            </p>
          </div>
        </div>
      </section>
 
      {/* Sección de Testimonios */}
      <section className="review__section">
        <h2 className="review__header">Lo que dicen nuestros clientes</h2>
        <div className="review__content">
          {datosTestimonios.map((item, index) => (
            <TestimonialCard data={item} key={index} />
          ))}
        </div>
      </section>
      
      {/* Botón flotante de Chat */}
      <div className="chat-floating-button">
        <span className="chat-button-text">¡Chatea conmigo!</span>
        <div className="chat-icon-circle">
          <img src={robotIcon} alt="Robot" className="chat-robot-icon" />
        </div>
      </div>
      
      <Footer />

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

export default Home;
