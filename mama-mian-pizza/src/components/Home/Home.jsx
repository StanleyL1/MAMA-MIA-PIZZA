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
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png';
import comentarioImg from '../../assets/comentario.png';
import SocialMediaButton from '../socialMediaButton/SocialMediaButton';

import carrusel1 from '../../assets/carrusel1.jpeg';
import carrusel2 from '../../assets/carrusel2.jpeg';

import './Home.css';

const carouselImages = [carrusel1, carrusel2];


const Home = ({ onAddToCart }) => {
  const [popular, setPopular] = useState([]);
  const [recomendacion, setRecomendaciones] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
const [showCommentForm, setShowCommentForm] = useState(false);
const [nuevoComentario, setNuevoComentario] = useState({
  name: "Juan Pérez",         // O trae el nombre del usuario logueado
  categoria: "Servicio",
  rating: 5,
  comment: "",
});
const [testimonios, setTestimonios] = useState([
  // Ejemplo inicial
  // { name: "María", categoria: "Comida", rating: 4, comment: "¡Delicioso!" }
]);



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
const handlePublicarComentario = () => {
    if (!nuevoComentario.comment || !nuevoComentario.name) return;
    setTestimonios([
      {
        ...nuevoComentario,
        avatar: nuevoComentario.avatar || comentarioImg,
        time: "hace un momento",
      },
      ...testimonios
    ]);
    setNuevoComentario({ name: "", avatar: "", time: "hace un momento", comment: "", rating: 5 });
    setShowCommentForm(false);
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

     <section className="review__section">
  <h2 className="review__header">Lo que dicen nuestros clientes</h2>
  <div className="review__share-bar">
  <div className="review__share-left">
    <span className="review__share-text">Comparte tu experiencia</span>
  </div>
  <button
    className="review__share-btn"
    onClick={() => setShowCommentForm(true)}
  >
    Escribir comentario
  </button>
</div>


  {/* MODAL FORMULARIO */}
  {showCommentForm && (
  <div className="modal__overlay">
    <div className="modal__content review__comment-form-card">
      <button
        className="modal__close-btn"
        onClick={() => setShowCommentForm(false)}
      >×</button>
      <div className="review__form-header">
        <h3>Escribe tu reseña</h3>
      </div>
      <div className="review__form-row">
        <label>Categoría</label>
        <select
          className="review__form-select"
          value={nuevoComentario.categoria}
          onChange={e => setNuevoComentario({...nuevoComentario, categoria: e.target.value})}
          required
        >
          <option value="Servicio">Servicio</option>
          <option value="Entrega">Entrega</option>
          <option value="Comida">Comida</option>
        </select>
      </div>
      <div className="review__form-row">
        <label>Calificación</label>
        <div className="review__form-stars">
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              onClick={() => setNuevoComentario({...nuevoComentario, rating: star})}
              style={{
                cursor: "pointer",
                fontSize: 28,
                color: nuevoComentario.rating >= star ? "#eab308" : "#ddd",
                marginRight: 4
              }}
            >★</span>
          ))}
        </div>
      </div>
      <div className="review__form-row">
        <label>Comentario</label>
        <textarea
          className="review__form-textarea"
          placeholder="Escribe aquí tu reseña"
          rows={4}
          value={nuevoComentario.comment}
          onChange={e => setNuevoComentario({...nuevoComentario, comment: e.target.value})}
          required
        />
      </div>
      <div className="review__form-actions">
        <button
          className="review__form-btn review__form-btn--red"
          onClick={handlePublicarComentario}
          type="button"
        >
          Publicar reseña
        </button>
        <button className="review__form-btn" onClick={() => setShowCommentForm(false)} type="button">
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}


<div className="review__content">
  {testimonios.map((item, index) => (
   <div className="card__review">
  <div className="review__card__user">
    <img
      src={item.foto || comentarioImg}
      alt={item.name}
      className="review__avatar"
    />
    <div className="review__card__user__information">
      <h5>{item.name}</h5>
      <p>{item.time}</p>
    </div>
  </div>
  <div className="review__stars-cat-row">
    {[1,2,3,4,5].map(star => (
      <span
        key={star}
        style={{
          color: item.rating >= star ? "#ffd600" : "#d4d7dd",
          fontSize: 20,
          marginRight: 1
        }}
      >★</span>
    ))}
    <span
      className={`review__categoria-badge review__categoria-badge--${item.categoria.toLowerCase()}`}
      style={{
        marginLeft: 10
      }}
    >
      {item.categoria}
    </span>
  </div>
  <div className="review__comment">
    <p>{item.comment}</p>
  </div>
</div>
  ))}
</div>

</section>

      <Footer />

      {/* Modal */}
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
