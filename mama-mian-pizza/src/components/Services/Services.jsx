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
  
  const handleWhatsAppClick = () => {
    const phoneNumber = "50376353773"; // Número de WhatsApp sin espacios ni símbolos
    const message = encodeURIComponent("¡Hola! Me interesa reservar el servicio de catering para eventos de Mama Mian Pizza. ¿Podrían proporcionarme más información?");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="services-container">
      <div className="services-header">
        <h1 className="services-title">
          <span className="services-title-text">Pizza para llevar</span>
          <img 
            src={menuBookIcon} 
            alt="Ícono Libro Menú" 
            className="menu-title-icon" 
          />
        </h1>
        <p className="services-subtitle">Disfruta de nuestras deliciosas pizzas donde prefieras</p>
      </div>

      {/* Cards superiores */}
      <div className="services-top-row">        {/* Tarjeta 1: Pizza Móvil */}
        <div className="services-card">
          <div className="services-card-image-container">
            <img src={pizzaMovilImg} alt="Pizza Móvil" className="services-card-image" />
          </div>
          <div className="services-card-body">
            <div className="services-card-header">
              <h3 className="services-card-title">Envío a Domicilio</h3>
              <span className="services-card-badge">🚗 Delivery</span>
            </div>
            <p className="services-card-description">
              Lleva el sabor de nuestra pizzería directo a tu hogar.
              Disfruta de nuestras pizzas artesanales con servicio a domicilio para tus celebraciones, reuniones o momentos especiales.
            </p>
            <div className="services-card-icon-label">
              <img src={iconoCamion} alt="Disponible" className="services-icon" />
              <span><strong>Disponible en Jiquilisco y Puerto el Triunfo</strong></span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Retiro */}
        <div className="services-card">
          <div className="services-card-image-container">
            <img src={cateringImg} alt="Retiro en restaurante" className="services-card-image" />
          </div>
          <div className="services-card-body">
            <div className="services-card-header">
              <h3 className="services-card-title">Retiro en restaurante</h3>
              <span className="services-card-badge">🏪 Pick Up</span>
            </div>
            <p className="services-card-description">
              ¡Pide, pasa y disfruta! 
              Tus pizzas favoritas y personalizadas listas para llevar, recién horneadas y llenas de sabor.
              Haz tu pedido y recógelo en nuestro local sin esperas.
            </p>
            <div className="services-card-icon-label">
              <img src={iconoGrupo} alt="Grupo" className="services-icon" />
              <span><strong>Perfecto para grupos de cualquier tamaño</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Card inferior mejorada */}
      <div className="services-bottom-section">
        <div className="services-bottom-card">
          <div className="services-bottom-text">
            <div className="services-bottom-header">
              <h2>Contratación para eventos</h2>
              <span className="services-event-badge">🎉 Eventos Especiales</span>
            </div>
            <p>¡Lleva la experiencia Mama Mian a tu próximo evento! Nuestro servicio de pizza móvil es perfecto para:</p>
            <ul className="services-event-list">
              <li>
                <img src={iconoGrupo1} alt="Icono evento" className="services-list-icon" /> 
                <span>Bodas y fiestas de compromiso</span>
              </li>
              <li>
                <img src={iconoGrupo1} alt="Icono evento" className="services-list-icon" /> 
                <span>Celebraciones de cumpleaños y reuniones familiares</span>
              </li>
              <li>
                <img src={iconoGrupo1} alt="Icono evento" className="services-list-icon" /> 
                <span>Eventos y festivales comunitarios</span>
              </li>
            </ul>
            <button 
              className="services-reserve-button"
              onClick={handleWhatsAppClick}
            >
              <span className="whatsapp-icon">📱</span>
              Reservar por WhatsApp
            </button>
          </div>

          <div className="services-bottom-image-container">
            <div className="services-image-decoration"></div>
            <img src={bigPizzaImg} alt="Pizza Grande" className="services-bottom-image" />
          </div>
        </div>
      </div>
      
      <Footer noImage={true} />
    </div>
  );
}

export default Services;
