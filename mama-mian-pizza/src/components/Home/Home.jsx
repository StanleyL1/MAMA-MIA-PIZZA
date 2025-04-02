import React from 'react';
import './Home.css';
import pizzaHero from '../../assets/PizzaPrin.png';
import pizzaCardImg from '../../assets/PizzaCard.png';
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png'; 
import robotIcon from '../../assets/Robot.png';
import comentarioImg from '../../assets/comentario.png';
import relojIcon from '../../assets/Reloj.png';
import medallaIcon from '../../assets/medalla.png';
import envioIcon from '../../assets/envio.png';
import ingredienteIcon from '../../assets/ingrediente.png';
//import starFull from '../../assets/EstrellaCom.png';
//import starHalf from '../../assets/EstrellaMedia.png';
//import cartIcon from '../../assets/Comprar.png';
import { Link } from 'react-router-dom';
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
    avatar: comentarioImg, // Ajusta la ruta real de tu imagen
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
    <div className="home-container">
    
      <section 
        className="home-hero-section"
        style={{ backgroundImage: `url(${pizzaHero})` }}
      >
        <div className="home-hero-text">
          <h2>Las mejores pizzas</h2>
          <p>Ingredientes frescos, masa artesanal y sabores únicos que te harán volver por más.</p>
          <button className="hero-button">
  <Link to="/menu" className="hero-button-link">Ver Menú</Link>
</button>

        </div>
      </section>


      <section className="home-recommendation-section">
        <header className='home-recommendation-header'>
        <h1>
            Recomendación de la Casa{" "}
            <img src={pizzaIcon} alt="Pizza Icon" className="home-pizza-icon" />
          </h1>
        </header>
          
          <div className="home-card-container"> 

          {datosPrueba.map((item, index) => (
          <ProductsCards data={item} key={index} />

          //item = title, price, img, descripcion
        ))}

          </div>
      </section>
  

      <section className="home-popular-section">
        <div className="home-popular-card">
  
          <h4>
            La mas populares{" "}
            <img src={fireIcon} alt="Pizza Icon" className="home-pizza-icon" />
          </h4>

          <div className="home-card-container"> 

          {DatosPopular.map((item, index) => (
          <ProductsCards data={item} key={index} />

          //item = title, price, img, descripcion
        ))}

          </div>
        </div>
      </section>
      <section className="why-section">
        <h2 className="why-title">¿Por qué elegir Mama Mian Pizza?</h2>
        
        <div className="why-cards">
          <div className="why-card">
            <img 
              src={relojIcon} 
              alt="Entrega rápida" 
              className="why-card-icon" 
            />
            <h3 className="why-card-heading">Entrega rápida</h3>
            <p className="why-card-text">
              Garantizamos tu entrega en 30 minutos o menos. 
              Nuestro equipo de reparto es rápido, eficiente y siempre puntual.
            </p>
          </div>

          <div className="why-card">
            <img 
              src={medallaIcon} 
              alt="Recetas premiadas" 
              className="why-card-icon" 
            />
            <h3 className="why-card-heading">Recetas premiadas</h3>
            <p className="why-card-text">
              Nuestras pizzas han ganado múltiples premios por su sabor único.
              Desde Nápoles, la cuna de la pizza.
            </p>
          </div>

          <div className="why-card">
            <img 
              src={envioIcon} 
              alt="Envío gratuito" 
              className="why-card-icon" 
            />
            <h3 className="why-card-heading">Envío gratuito</h3>
            <p className="why-card-text">
              Disfruta de envío gratis en todos los pedidos superiores a $25.
              No hay costos ocultos ni restricciones, ¡tu pizza llega sin costos extra!
            </p>
          </div>

          <div className="why-card">
            <img 
              src={ingredienteIcon} 
              alt="Ingredientes frescos" 
              className="why-card-icon" 
            />
            <h3 className="why-card-heading">Ingredientes frescos</h3>
            <p className="why-card-text">
              Obtenemos nuestros ingredientes directamente de productores locales.
              Sin conservantes ni sabores artificiales.
            </p>
          </div>
        </div>
      </section>

      <div className="chat-floating-button">
 
 <span className="chat-button-text">¡Chatea conmigo!</span>
 <div className="chat-icon-circle">
   <img src={robotIcon} alt="Robot" className="chat-robot-icon" />
 </div>
</div>

<section className="testimonials-section">
      <h2 className="testimonials-title">Lo que dicen nuestros clientes</h2>
      
      <div className="testimonials-container">
        {datosTestimonios.map((item, index) => (
          <TestimonialCard data={item} key={index} />
        ))}
      </div>
    </section>


    <Footer/>

    </div>
  );
};

export default Home;
