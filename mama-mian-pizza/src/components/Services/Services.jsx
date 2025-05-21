import React from 'react';
import './Services.css';
import Footer from '../footer/footer';

import pizzaMovilImg from '../../assets/domicilio.jpeg';
import cateringImg from '../../assets/Retiro.jpeg';
import bigPizzaImg from '../../assets/Consumo.jpeg';


import iconoCamion from '../../assets/iconoCamion.png';
import iconoGrupo from '../../assets/iconoGrupo.png';
import iconoGrupo1 from '../../assets/iconoGrupo1.png';
import menuBookIcon from '../../assets/menuBook.png'

function Services() {
  
  return (
    <div className="services-container">

      <h1 className="services-title">Pizza para llevar
        <img 
                    src={menuBookIcon} 
                    alt="Ícono Libro Menú" 
                    className="menu-title-icon" 
                  />
      </h1>
      {/* Cards superiores */}
      <div className="services-top-row">
        {/* Tarjeta 1: Pizza Móvil */}
        <div className="services-card">
          <div className="services-card-image-container">
            <img src={pizzaMovilImg} alt="Pizza Móvil" className="services-card-image" />
            <div className="services-card-title-overlay">
              Envio a Domicilio
            </div>
          </div>
          <div className="services-card-body">
            <p>
              Haz que tu evento sea inolvidable con nuestro servicio de catering de pizzas.
              Desde eventos corporativos hasta bodas, ofrecemos una experiencia gastronómica 
              única que encantará a sus invitados.
            </p>
            <div className="services-card-icon-label">
              <img src={iconoCamion} alt="Disponible" />
              <span><strong>Disponible en todo el país</strong></span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Catering */}
        <div className="services-card">
          <div className="services-card-image-container">
            <img src={cateringImg} alt="Catering para eventos" className="services-card-image" />
            <div className="services-card-title-overlay">
              Retiro en restaurante
            </div>
          </div>
          <div className="services-card-body">
            <p>
              Haz que tu evento sea inolvidable con nuestro servicio de catering de pizzas.
              Desde eventos corporativos hasta bodas, ofrecemos una experiencia gastronómica 
              única que encantará a sus invitados.
            </p>
            <div className="services-card-icon-label">
              <img src={iconoGrupo} alt="Grupo" />
              <span><strong>Perfecto para grupos de cualquier tamaño</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Card inferior */}
      <div className="services-bottom-card">
        <div className="services-bottom-text">
          <h2>Contratacion para eventos</h2>
          <p>¡Lleva la experiencia PizzaMía a tu próximo evento! Nuestro servicio de pizza móvil es perfecto para:</p>
          <ul>
            <li><img src={iconoGrupo1} alt="Icono evento" /> Bodas y fiestas de compromiso</li>
            <li><img src={iconoGrupo1} alt="Icono evento" /> Celebraciones de cumpleaños y reuniones familiares</li>
            <li><img src={iconoGrupo1} alt="Icono evento" /> Eventos y festivales comunitarios</li>
          </ul>
          <button className="services-reserve-button">Reservar</button>
        </div>

        <div className="services-bottom-image-container">
          <img src={bigPizzaImg} alt="Pizza Grande" className="services-bottom-image" />
        </div>
      </div>
      <Footer noImage={true} />

    </div>
    
  );
}

export default Services;
