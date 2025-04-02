import React from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMedal, faTruck, faCarrot } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';

import pizzaHero from '../../assets/PizzaPrin.png';
import pizzaCardImg from '../../assets/PizzaCard.png';
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png'; 
import robotIcon from '../../assets/Robot.png';
import comentarioImg from '../../assets/comentario.png';

import Footer from '../footer/footer';
import ProductsCards from '../productsCards/productsCards';
import TestimonialCard from '../ComentsCards/ComentCards';

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
  }
];

const DatosPopular = [
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
            <Link to="/menu" className='link'>Ver Menú</Link>
          </button>
        </div>
      </section>
      
      {/* Sección de Recomendación de la Casa */}
      <section className="house__choice__section">
        <h1 className="house__choice__title">
          Recomendación de la Casa <img src={pizzaIcon} alt="Pizza Icon" />
        </h1>
        <div className="whyus__content">
          {datosPrueba.map((item, index) => (
            <ProductsCards data={item} key={index} />
          ))}
        </div>
      </section>
      
      {/* Sección de Pizzas Populares */}
      <section className="trending__section">
        <h2 className="trending__title">
          La más populares <img src={fireIcon} alt="Fire Icon" />
        </h2>
        <div className="whyus__content">
          {DatosPopular.map((item, index) => (
            <ProductsCards data={item} key={index} />
          ))}
        </div>
      </section>
      
      {/* Sección "¿Por qué elegir Mama Mian Pizza?" */}
      <section className="whyus__section">
        <h2 className="whyus__header">¿Por qué elegir Mama Mian Pizza?</h2>
        <div className="whyus__content">
          <div className="whyus__cards">
            <i>
              <FontAwesomeIcon icon={faClock} />
            </i>
            <h3 className="whyus__card__title">Entrega rápida</h3>
            <p className="whyus__card__description">
              Garantizamos tu entrega en 30 minutos o menos. Nuestro equipo de reparto es rápido, eficiente y siempre puntual.
            </p>
          </div>
          
          <div className="whyus__cards">
            <i>
              <FontAwesomeIcon icon={faMedal} />
            </i>
            <h3 className="whyus__card__title">Recetas premiadas</h3>
            <p className="whyus__card__description">
              Nuestras pizzas han ganado múltiples premios por su sabor único. Desde Nápoles, la cuna de la pizza.
            </p>
          </div>
          
          <div className="whyus__cards">
            <i>
              <FontAwesomeIcon icon={faTruck} />
            </i>
            <h3 className="whyus__card__title">Envío gratuito</h3>
            <p className="whyus__card__description">
              Disfruta de envío gratis en todos los pedidos superiores a $25. No hay costos ocultos ni restricciones, ¡tu pizza llega sin costos extra!
            </p>
          </div>
          
          <div className="whyus__cards">
            <i>
              <FontAwesomeIcon icon={faCarrot} />
            </i>
            <h3 className="whyus__card__title">Ingredientes frescos</h3>
            <p className="whyus__card__description">
              Obtenemos nuestros ingredientes directamente de productores locales. Sin conservantes ni sabores artificiales.
            </p>
          </div>
        </div>
      </section>
      
      {/* Botón flotante de Chat */}
      <div className="chat-floating-button">
        <span className="chat-button-text">¡Chatea conmigo!</span>
        <div className="chat-icon-circle">
          <img src={robotIcon} alt="Robot" className="chat-robot-icon" />
        </div>
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
      
    </div>
  );
};

export default Home;
