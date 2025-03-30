import React from 'react';
import './Home.css';
import pizzaHero from '../../assets/PizzaPrin.png';
import pizzaCardImg from '../../assets/PizzaCard.png';
import pizzaIcon from '../../assets/PizzaR.png';
//import fireIcon from '../../assets/fuego.png'; 
//import robotIcon from '../../assets/Robot.png';
//import comentarioImg from '../../assets/comentario.png';
//import relojIcon from '../../assets/Reloj.png';
//import medallaIcon from '../../assets/medalla.png';
//import envioIcon from '../../assets/envio.png';
//import ingredienteIcon from '../../assets/ingrediente.png';
//import starFull from '../../assets/EstrellaCom.png';
//import starHalf from '../../assets/EstrellaMedia.png';
//import cartIcon from '../../assets/Comprar.png';
import { Link } from 'react-router-dom';
import Footer from '../footer/footer';
import ProductsCards from '../productsCards/productsCards';

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

          {datosPrueba.map((item, index) => (
          <ProductsCards data={item} key={index} />

          //item = title, price, img, descripcion
        ))}

          </div>
        </div>
      </section>
  
      

    <Footer/>

    </div>
  );
};

export default Home;
