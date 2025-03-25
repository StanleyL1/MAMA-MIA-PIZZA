import React from 'react';
import './Home.css';


import pizzaHero from '../../assets/PizzaPrin.png';
import burrataImg from '../../assets/PizzaCard.png';
import pizzaIcon from '../../assets/PizzaR.png';
import fireIcon from '../../assets/fuego.png'; 


import starFull from '../../assets/EstrellaCom.png';
import starHalf from '../../assets/EstrellaMedia.png';
import cartIcon from '../../assets/Comprar.png';

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
          <button className="home-hero-button">Ver Menú</button>
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

   
      <section className="home-popular-section">
        <div className="home-popular-card">
  
        <h3>
            Las mas populares{" "}
            <img src={fireIcon} alt="Fuego Icon" className="home-fire-icon" />
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
    </div>
  );
};

export default Home;
