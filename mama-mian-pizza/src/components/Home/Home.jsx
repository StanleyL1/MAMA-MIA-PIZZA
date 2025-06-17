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

import carrusel1 from '../../assets/carrusel1.jpeg';
import carrusel2 from '../../assets/carrusel2.jpeg';

import './Home.css';

const carouselImages = [carrusel1, carrusel2];

const Home = ({ onAddToCart, user }) => {
  const [popular, setPopular] = useState([]);
  const [recomendacion, setRecomendaciones] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [testimonios, setTestimonios] = useState([]);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
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
    };    const fetchTestimonios = async () => {
      try {
        // Aquí se podrá agregar la API para obtener testimonios reales
        // const response = await fetch('https://api.mamamianpizza.com/api/testimonios');
        // const data = await response.json();
        // eslint-disable-next-line no-unused-vars
        // setTestimonios(data.testimonios);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPopular();
    fetchRecomendations();
    fetchTestimonios();
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
  const handleOpenReviewModal = () => {
    if (!user) {
      setShowAuthAlert(true);
      return;
    }
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(0);
    setComment('');
  };

  const handleCloseAuthAlert = () => {
    setShowAuthAlert(false);
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = () => {
    // Aquí puedes agregar la lógica para enviar la reseña
    console.log('Calificación:', rating);
    console.log('Comentario:', comment);
    handleCloseReviewModal();
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
          </div>        </div>
      </section>      {/* Testimonios */}
      <section className="review__section">
        <h2 className="review__header">Lo que dicen nuestros clientes</h2>
        <div className="review__content">
          {testimonios.length > 0 ? (
            testimonios.map((item, index) => (
              <TestimonialCard data={item} key={index} />
            ))
          ) : (
            <p className="no__testimonios">Aún no hay testimonios. ¡Sé el primero en compartir tu experiencia!</p>
          )}
        </div>
        
        {/* Comparte tu experiencia */}
        <div className="share__experience__section">
          <h2 className="share__experience__title">Comparte tu experiencia</h2>
          <button className="write__review__button" onClick={handleOpenReviewModal}>
            Escribir comentario
          </button>
        </div>
      </section><Footer />

      {/* Modal de Pizza */}
      {selectedPizza && (
        <PizzaModal 
          pizza={selectedPizza}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          user={user}
        />
      )}      {/* Modal de Reseña */}
      {showReviewModal && (
        <div className="review__modal__overlay">
          <div className="review__modal">
            <h2 className="review__modal__title">Comparte tu experiencia</h2>
            
            <div className="rating__section">
              <p className="rating__label">Calificación</p>
              <div className="stars__container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="comment__section">
              <label className="comment__label">Tu comentario</label>
              <textarea
                className="comment__textarea"
                placeholder="Comparte tu experiencia con Mama Mian Pizza..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
            </div>

            <div className="modal__buttons">
              <button className="cancel__button" onClick={handleCloseReviewModal}>
                Cancelar
              </button>
              <button className="submit__button" onClick={handleSubmitReview}>
                Publicar comentario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Autenticación Requerida */}
      {showAuthAlert && (
        <div className="review__modal__overlay">
          <div className="auth__alert__modal">
            <div className="auth__alert__icon">🔒</div>
            <h2 className="auth__alert__title">¡Regístrate para continuar!</h2>
            <p className="auth__alert__message">
              Para compartir tu experiencia y calificar nuestro servicio, necesitas tener una cuenta.
            </p>
            <div className="auth__alert__buttons">
              <button className="auth__cancel__button" onClick={handleCloseAuthAlert}>
                Ahora no
              </button>
              <Link to="/register" className="auth__register__button">
                Crear cuenta
              </Link>
            </div>
            <p className="auth__login__text">
              ¿Ya tienes cuenta? <Link to="/login" className="auth__login__link">Accede aquí</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
