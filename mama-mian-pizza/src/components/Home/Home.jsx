import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMedal, faTruck, faCarrot } from '@fortawesome/free-solid-svg-icons';

import ProductsCards from '../productsCards/productsCards';
import PizzaModal from '../PizzaModal/PizzaModal';
import Footer from '../footer/footer';
import TestimonialCard from '../ComentsCards/ComentCards';
import Toast from '../Toast/Toast';
import { obtenerExperienciasParaHome, crearExperienciaDesdeModal } from '../../services/experienciasService';
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png';
import bannerVideo from '../../assets/banner.mp4';

import './Home.css';

const Home = ({ onAddToCart, user }) => {
  const [popular, setPopular] = useState([]);
  const [recomendacion, setRecomendaciones] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [titulo, setTitulo] = useState('');
  const [testimonios, setTestimonios] = useState([]);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [loadingTestimonios, setLoadingTestimonios] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [toast, setToast] = useState(null);
  // Función para cargar experiencias
  const cargarExperiencias = async () => {
    setLoadingTestimonios(true);
    try {
      const experiencias = await obtenerExperienciasParaHome();
      setTestimonios(experiencias);
      console.log('Experiencias cargadas:', experiencias);
    } catch (error) {
      console.error('Error al cargar experiencias:', error);
      setTestimonios([]);
    } finally {
      setLoadingTestimonios(false);
    }
  };

  useEffect(() => {
    cargarExperiencias();
  }, []);
  
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
  const handleOpenReviewModal = () => {
    if (!user) {
      setShowAuthAlert(true);
      return;
    }
    setShowReviewModal(true);
  };  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(0);
    setComment('');
    setTitulo('');
  };

  const handleCloseAuthAlert = () => {
    setShowAuthAlert(false);
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };
  const handleSubmitReview = async () => {
    if (!user || !user.id) {
      setShowAuthAlert(true);
      return;
    }

    // Validar datos básicos
    if (!rating || !comment.trim()) {
      setToast({
        message: 'Por favor, califica tu experiencia y escribe un comentario.',
        type: 'warning'
      });
      return;
    }

    setSubmittingReview(true);

    try {
      await crearExperienciaDesdeModal(
        user,
        titulo.trim() || 'Mi experiencia en Mama Mian Pizza',
        rating,
        comment.trim()
      );

      setToast({
        message: '¡Gracias por compartir tu experiencia! Será revisada antes de publicarse.',
        type: 'success'
      });
      handleCloseReviewModal();
      // Recargar experiencias después de crear una nueva
      cargarExperiencias();
    } catch (error) {
      console.error('Error al crear experiencia:', error);
      setToast({
        message: 'Hubo un error al enviar tu experiencia. Por favor, inténtalo de nuevo.',
        type: 'error'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="main__content">
     {/* Video Banner HERO */}
<section className="hero__video__container">
  <div className="hero__video__wrapper">
    <video
      className="hero__video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
    >
      <source src={bannerVideo} type="video/mp4" />
      Tu navegador no soporta el elemento de video.
    </video>
    <div className="hero__overlay"></div>
    <div className="hero__text__container">
      <h1 className="hero__title">Las mejores <span>pizzas</span></h1>            
      <p className="hero__text">
        Ingredientes frescos, masa artesanal y sabores únicos que<br/>
        te harán volver por más.
      </p>
      <button className="hero__button">
        <Link to="/menu" className="link">Ver Menú</Link>
      </button>
    </div>
  </div>
</section>      {/* Recomendación de la Casa */}
      <section className="house__choice__section">
        <div className="section__header">
          <div className="section__header__content">
            <div className="section__badge">
              <img src={pizzaIcon} alt="Pizza Icon" className="section__icon" />
              <span className="section__badge__text">Chef's Choice</span>
            </div>
            <h1 className="section__title">
              Recomendación de la Casa
            </h1>
            <p className="section__subtitle">
              Nuestros platos más especiales, seleccionados cuidadosamente por nuestro chef
            </p>
          </div>
          <div className="section__decoration">
            <div className="decoration__circle decoration__circle--orange"></div>
            <div className="decoration__circle decoration__circle--red"></div>
          </div>
        </div>        <div className="products__grid">
          {recomendacion.map((item, index) => (
            <ProductsCards 
              data={item}
              key={index}
              onCardClick={() => handleOpenPizza(item)}
              isRecommendation={true}
            />
          ))}
        </div>
      </section>      {/* Pizzas Populares */}
      <section className="trending__section">
        <div className="section__header section__header--trending">
          <div className="section__header__content">
            <div className="section__badge section__badge--fire">
              <img src={fireIcon} alt="Fire Icon" className="section__icon section__icon--fire" />
              <span className="section__badge__text">Trending Now</span>
            </div>
            <h2 className="section__title section__title--trending">
              Las más populares
            </h2>
            <p className="section__subtitle">
              Los sabores que todos aman y que no puedes dejar de probar
            </p>
          </div>
          <div className="section__decoration section__decoration--trending">
            <div className="decoration__circle decoration__circle--yellow"></div>
            <div className="decoration__circle decoration__circle--orange"></div>
            <div className="decoration__spark"></div>
            <div className="decoration__spark decoration__spark--2"></div>
          </div>
        </div>
        <div className="products__grid products__grid--trending">
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
      </section>      {/* Experiencias de Clientes */}
      <section className="review__section">
        <h2 className="review__header">Experiencias de nuestros clientes</h2>
        <p className="review__subtitle">Testimonios verificados de clientes que han disfrutado nuestras pizzas</p>        <div className="review__content">
          {loadingTestimonios ? (
            <div className="loading__testimonios">
              <p>Cargando experiencias de nuestros clientes...</p>
            </div>
          ) : testimonios.length > 0 ? (
            testimonios.map((item, index) => (
              <TestimonialCard data={item} key={index} />
            ))
          ) : (
            <p className="no__testimonios">Aún no hay experiencias publicadas. ¡Sé el primero en compartir tu experiencia!</p>
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
              <p className="rating__label">Calificación *</p>
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
              {rating > 0 && (
                <span className="rating__text">
                  {rating === 1 && 'Muy malo'}
                  {rating === 2 && 'Malo'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bueno'}
                  {rating === 5 && 'Excelente'}
                </span>
              )}
            </div>

            <div className="title__section">
              <label className="title__label">Título de tu experiencia (opcional)</label>
              <input
                type="text"
                className="title__input"
                placeholder="Ej: Excelente experiencia en Mama Mian"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                maxLength="100"
              />
            </div>

            <div className="comment__section">
              <label className="comment__label">Tu comentario *</label>
              <textarea
                className="comment__textarea"
                placeholder="Comparte los detalles de tu experiencia con Mama Mian Pizza..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                maxLength="500"
              />
              <div className="character__count">
                {comment.length}/500 caracteres
              </div>
            </div>

            <div className="modal__buttons">
              <button 
                className="cancel__button" 
                onClick={handleCloseReviewModal}
                disabled={submittingReview}
              >
                Cancelar
              </button>
              <button 
                className="submit__button" 
                onClick={handleSubmitReview}
                disabled={submittingReview || !rating || !comment.trim()}
              >
                {submittingReview ? 'Enviando...' : 'Publicar experiencia'}
              </button>
            </div>
            
            <p className="modal__note">
              * Tu experiencia será revisada antes de ser publicada
            </p>
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
            </p>          </div>
        </div>
      )}
      
      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Home;
