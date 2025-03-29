import React from 'react';
import './Home.css';
import pizzaHero from '../../assets/PizzaPrin.png';
import burrataImg from '../../assets/PizzaCard.png';
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png'; 
import robotIcon from '../../assets/Robot.png';
import comentarioImg from '../../assets/comentario.png';
import relojIcon from '../../assets/Reloj.png';
import medallaIcon from '../../assets/medalla.png';
import envioIcon from '../../assets/envio.png';
import ingredienteIcon from '../../assets/ingrediente.png';
import starFull from '../../assets/EstrellaCom.png';
import starHalf from '../../assets/EstrellaMedia.png';
import cartIcon from '../../assets/Comprar.png';
import { Link } from 'react-router-dom';
import Footer from '../footer/footer';

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
        <Link to="/menu">Ver Menú</Link>
      </button>
        </div>
      </section>


      <section className="home-recommendation-section">
        <div className="home-recommendation-card">
  
          <h3>
            Recomendación de la Casa{" "}
            <img src={pizzaIcon} alt="Pizza Icon" className="home-pizza-icon" />
          </h3>

          <div className="home-card-container">
    
            <div className="home-card">
              <img
                src={burrataImg}
                alt="Pizza Burrata"
                className="home-card-image"
              />
              <h4 className="home-card-title">Burrata</h4>
              <p className="home-card-description">
                Mozzarella, cebolla caramelizada,<br />
                jamón y vinagre balsámico
              </p>
              <div className="home-card-rating">
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starHalf} alt="Estrella media" className="home-star-icon" />
              </div>
              <div className="home-card-footer">
                <p className="home-card-price">$5.00</p>
                <button className="home-cart-button" aria-label="Agregar al carrito">
                  <img src={cartIcon} alt="Carrito" className="home-cart-icon" />
                </button>
              </div>
            </div>

       
            <div className="home-card">
              <img
                src={burrataImg}
                alt="Pizza Burrata"
                className="home-card-image"
              />
              <h4 className="home-card-title">Burrata</h4>
              <p className="home-card-description">
                Mozzarella, cebolla caramelizada,<br />
                jamón y vinagre balsámico
              </p>
              <div className="home-card-rating">
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
              </div>
              <div className="home-card-footer">
                <p className="home-card-price">$5.00</p>
                <button className="home-cart-button" aria-label="Agregar al carrito">
                  <img src={cartIcon} alt="Carrito" className="home-cart-icon" />
                </button>
              </div>
            </div>

    
            <div className="home-card">
              <img
                src={burrataImg}
                alt="Pizza Burrata"
                className="home-card-image"
              />
              <h4 className="home-card-title">Burrata</h4>
              <p className="home-card-description">
                Mozzarella, cebolla caramelizada,<br />
                jamón y vinagre balsámico
              </p>
              <div className="home-card-rating">
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
                <img src={starFull} alt="Estrella completa" className="home-star-icon" />
              </div>
              <div className="home-card-footer">
                <p className="home-card-price">$5.00</p>
                <button className="home-cart-button" aria-label="Agregar al carrito">
                  <img src={cartIcon} alt="Carrito" className="home-cart-icon" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

   
<section className="popular-section">
  <div className="popular-wrapper">
    <h2 className="popular-title">
      Las mas populares{" "}
      <img src={fireIcon} alt="Fuego" className="popular-icon" />
    </h2>
    
    <div className="popular-cards">
      <div className="popular-card">
        <img
          src={burrataImg}
          alt="Pizza Burrata"
          className="popular-card-image"
        />
        <h3 className="popular-card-title">Burrata</h3>
        <p className="popular-card-desc">
          Mozzarella, cebolla caramelizada,<br />
          jamón y vinagre balsámico
        </p>
        <div className="popular-card-rating">
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starHalf} alt="Estrella media" className="popular-star-icon" />
        </div>
        <div className="popular-card-footer">
          <p className="popular-card-price">$5.00</p>
          <button className="popular-cart-button" aria-label="Agregar al carrito">
            <img src={cartIcon} alt="Carrito" className="popular-cart-icon" />
          </button>
        </div>
      </div>

      <div className="popular-card">
        <img
          src={burrataImg}
          alt="Pizza Burrata"
          className="popular-card-image"
        />
        <h3 className="popular-card-title">Burrata</h3>
        <p className="popular-card-desc">
          Mozzarella, cebolla caramelizada,<br />
          jamón y vinagre balsámico
        </p>
        <div className="popular-card-rating">
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
        </div>
        <div className="popular-card-footer">
          <p className="popular-card-price">$5.00</p>
          <button className="popular-cart-button" aria-label="Agregar al carrito">
            <img src={cartIcon} alt="Carrito" className="popular-cart-icon" />
          </button>
        </div>
      </div>

      <div className="popular-card">
        <img
          src={burrataImg}
          alt="Pizza Burrata"
          className="popular-card-image"
        />
        <h3 className="popular-card-title">Burrata</h3>
        <p className="popular-card-desc">
          Mozzarella, cebolla caramelizada,<br />
          jamón y vinagre balsámico
        </p>
        <div className="popular-card-rating">
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
          <img src={starFull} alt="Estrella completa" className="popular-star-icon" />
        </div>
        <div className="popular-card-footer">
          <p className="popular-card-price">$5.00</p>
          <button className="popular-cart-button" aria-label="Agregar al carrito">
            <img src={cartIcon} alt="Carrito" className="popular-cart-icon" />
          </button>
        </div>
      </div>
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



<section className="feedback-section">
      <h2 className="feedback-title">Lo que dicen nuestros clientes</h2>
      
      <div className="feedback-cards">
        
        <div className="feedback-card">
          <div className="feedback-card-header">
            <img
              src={comentarioImg}
              alt="Foto de María Rodríguez"
              className="feedback-avatar"
            />
            <div className="feedback-user-info">
              <h3 className="feedback-name">María Rodríguez</h3>
              <p className="feedback-time">hace 2 semanas</p>
            </div>
          </div>

          <div className="feedback-rating">
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
          </div>

          <p className="feedback-text">
            Garantizan su entrega en 30 min y si no se hace 
            me devuelven mi dinero. Masa fresca y 
            artesanal. ¡100% recomendados!
          </p>
        </div>

        <div className="feedback-card">
        <div className="feedback-card-header">
            <img
              src={comentarioImg}
              alt="Foto de María Rodríguez"
              className="feedback-avatar"
            />
            <div className="feedback-user-info">
              <h3 className="feedback-name">María Rodríguez</h3>
              <p className="feedback-time">hace 2 semanas</p>
            </div>
          </div>

          <div className="feedback-rating">
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
          </div>

          <p className="feedback-text">
            Garantizan su entrega en 30 min y si no se hace 
            me devuelven mi dinero. Masa fresca y 
            artesanal. ¡100% recomendados!
          </p>
        </div>

        <div className="feedback-card">
           <div className="feedback-card-header">
            <img
              src={comentarioImg}
              alt="Foto de María Rodríguez"
              className="feedback-avatar"
            />
            <div className="feedback-user-info">
              <h3 className="feedback-name">María Rodríguez</h3>
              <p className="feedback-time">hace 2 semanas</p>
            </div>
          </div>

          <div className="feedback-rating">
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
            <img src={starFull} alt="Estrella completa" className="feedback-star-icon" />
          </div>

          <p className="feedback-text">
            Garantizan su entrega en 30 min y si no se hace 
            me devuelven mi dinero. Masa fresca y 
            artesanal. ¡100% recomendados!
          </p>
        </div>

      </div>
    </section>
    <Footer/>

    </div>
  );
};

export default Home;
