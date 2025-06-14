import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMedal, faTruck, faCarrot } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ProductsCards from '../productsCards/productsCards';
import PizzaModal from '../PizzaModal/PizzaModal';
import Footer from '../footer/footer';
import TestimonialCard from '../ComentsCards/ComentCards';
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png';
import comentarioImg from '../../assets/comentario.png';
import SocialMediaButton from '../socialMediaButton/SocialMediaButton';

import carrusel1 from '../../assets/carrusel1.jpeg';
import carrusel2 from '../../assets/carrusel2.jpeg';

import './Home.css';

const carouselImages = [carrusel1, carrusel2];

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

const Home = ({ onAddToCart, user }) => {
  const [popular, setPopular] = useState([]);
  const [recomendacion, setRecomendaciones] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);

  useEffect(() => {
    const fetchRecomendations = async () => {
      try {
        const response = await fetch('https://api.mamamianpizza.com/api/content/recomendacion');
        const data = await response.json();
        setRecomendaciones(data.productos);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPopular = async () => {
      try {
        const response = await fetch('https://api.mamamianpizza.com/api/content/MostPopular');
        const data = await response.json();
        setPopular(data.productos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPopular();
    fetchRecomendations();
  }, []);

  const handleOpenPizza = (pizza) => {
    setSelectedPizza(pizza);
  };

  const handleCloseModal = () => {
    setSelectedPizza(null);
  };

  const handleAddToCart = (pizza, masa, tamano, instrucciones, ingredientes) => {
    onAddToCart(pizza, masa, tamano, instrucciones, ingredientes);
    handleCloseModal();
  };

  return (
    <div className="main__content">
      
   {/* Carrusel HERO */}
<section className="hero__carousel__container">
  <Swiper
    modules={[Autoplay]}
    autoplay={{ delay: 9000 }}
    loop
    className="hero__carousel"
  >
    {carouselImages.map((img, idx) => (
      <SwiperSlide key={idx}>
        <div
          className="hero__slide"
          style={{
            backgroundImage: `url(${img})`
          }}
        >
          <div className="hero__overlay"></div> 
            <div className="hero__text__container">
            <h1 className="hero__title">Las mejores <span>pizzas</span></h1>            <p className="hero__text">
              Ingredientes frescos, masa artesanal y sabores únicos que<br/>
              te harán volver por más.
            </p>
            <button className="hero__button">
              <Link to="/menu" className="link">Ver Menú</Link>
            </button>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</section>


      {/* Recomendación de la Casa */}
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

      {/* Pizzas Populares */}
      <section className="trending__section">
        <h2 className="trending__title">
          Las más populares <img src={fireIcon} alt="Fire Icon" />
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

      {/* Por qué elegir Mama Mian */}
      <section className="whyus__section">
        <h2 className="whyus__header">¿Por qué elegir Mamá Mian Pizza?</h2>
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
              Nuestros clientes tienen la opcion de personalizar sus pizzas a su gusto
            </p>
          </div>
          <div className="whyus__cards">
            <i><FontAwesomeIcon icon={faTruck} /></i>
            <h3 className="whyus__card__title">Envío gratuito</h3>
            <p className="whyus__card__description">
              Disfruta de envío gratis solamente en el area de Puerto el triunfo, en todos los pedidos superiores a $25.
            </p>
          </div>
          <div className="whyus__cards">
            <i><FontAwesomeIcon icon={faCarrot} /></i>
            <h3 className="whyus__card__title">Ingredientes frescos</h3>
            <p className="whyus__card__description">
              Ingredientes locales, frescos y sin conservantes.
            </p>
          </div>
        </div>
      </section>

      {/* Botón flotante de Chat */}
      <div className="chat-floating-button">
        <SocialMediaButton />
      </div>

      {/* Testimonios */}
      <section className="review__section">
        <h2 className="review__header">Lo que dicen nuestros clientes</h2>
        <div className="review__content">
          {datosTestimonios.map((item, index) => (
            <TestimonialCard data={item} key={index} />
          ))}
        </div>
      </section>

      <Footer />      {/* Modal */}
      {selectedPizza && (
        <PizzaModal 
          pizza={selectedPizza}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          user={user}
        />
      )}
    </div>
  );
};

export default Home;
