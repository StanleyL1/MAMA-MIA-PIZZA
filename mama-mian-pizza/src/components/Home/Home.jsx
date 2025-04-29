import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMedal, faTruck, faCarrot } from '@fortawesome/free-solid-svg-icons';
import ProductsCards from '../productsCards/productsCards';
import PizzaModal from '../PizzaModal/PizzaModal';
import Footer from '../footer/footer';
import TestimonialCard from '../ComentsCards/ComentCards';
import pizzaHero from '../../assets/PizzaPrin.png';
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png'; 
import comentarioImg from '../../assets/comentario.png';

import './Home.css';
import SocialMediaButton from '../socialMediaButton/SocialMediaButton';


// Datos de testimonios
const datosTestimonios = [
  {
    avatar: comentarioImg,
    name: 'María Rodríguez',
    time: 'hace 2 semanas',
    comment: 'Garantizamos la entrega en 30 minutos o su pizza es gratis. Nuestro equipo de entrega es rápido, eficiente y siempre puntual.'
  },
  {
    avatar: comentarioImg,
    name: 'María Rodríguez',
    time: 'hace 2 semanas',
    comment: 'Garantizamos la entrega en 30 minutos o su pizza es gratis. Nuestro equipo de entrega es rápido, eficiente y siempre puntual.'
  },
  {
    avatar: comentarioImg,
    name: 'María Rodríguez',
    time: 'hace 2 semanas',
    comment: 'Garantizamos la entrega en 30 minutos o su pizza es gratis. Nuestro equipo de entrega es rápido, eficiente y siempre puntual.'
  },
];

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [recomendacion, setRecomendaciones] = useState([]);

  useEffect(() => {
    
    const fetchRecomendations = async () => {
      try{
        const response = await fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/content/recomendacion');
        const data = await response.json();
        setRecomendaciones(data.productos);
      }catch (error) {
        console.log(error)
      }finally {
        console.log('Petición realizada')
      }
    }

    const fetchPopular = async () => {
      try{
        const response = await fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/content/MostPopular');
        const data = await response.json();
        setPopular(data.productos);
      }catch (error) {
        console.log(error)
      }finally {
        console.log('Petición realizada')
      }
    }
    fetchPopular();
    fetchRecomendations();
  }, [])

  console.log(popular[0]);

  // Estado para el modal de pizza

  const [selectedPizza, setSelectedPizza] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Estado para controlar la visibilidad del carrito (ahora se usa)


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
      <section
        className="hero__container"
        style={{ backgroundImage: `url(${pizzaHero})` }}
      >
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
        <h1 className="house__choice__title">
          Recomendación de la Casa <img src={pizzaIcon} alt="Pizza Icon" />
        </h1>
        <div className="whyus__content">
          {recomendacion.map((item, index) => (
            <ProductsCards 
              data={item} 
              key={index}
              onCardClick={() => handleOpenPizza(item)}
            />
          ))}
        </div>
      </section>
      
      {/* Sección de Pizzas Populares */}
      <section className="trending__section">
        <h2 className="trending__title">
          La más populares <img src={fireIcon} alt="Fire Icon" />
        </h2>
        <div className="whyus__content">
          {popular.map((item, index) => (
            <ProductsCards 
              data={item} 
              key={index}
              onCardClick={() => handleOpenPizza(item)}
            />
          ))}
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
 
      {/* Botón flotante de Chat */}
      <div className="chat-floating-button">
        <SocialMediaButton/>
      </div>
      {/* Sección de Testimonios */}
      <section className="review__section">
        <h2 className="review__header">Lo que dicen nuestros clientes</h2>
        <div className="review__content">
          {datosTestimonios.map((item, index) => (
            <TestimonialCard data={item} key={index} />
          ))}
        </div>
      </section>
      
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
