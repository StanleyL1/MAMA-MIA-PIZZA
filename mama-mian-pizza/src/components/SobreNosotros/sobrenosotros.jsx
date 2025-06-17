import React from 'react';
import './sobrenosotros.css';
import Footer from '../footer/footer';
import señora from '../../assets/señora.jpg';
import señor from '../../assets/señor.jpg';
import pizzaDia from '../../assets/pizzadia.jpg';
import pizzaNoche from '../../assets/pizzanoche.jpg';
import equipoMamaMian from '../../assets/grupo.jpg';

function SobreNosotros() {
  return (
    <div className="sobrenos-container">      {/* Header Section */}
      <div className="sobrenos-header">
        <h1 className="sobrenos-title">Nuestra Historia</h1>
        <div className="sobrenos-subtitle">
          <svg 
            className="pizza-icon" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            width="32" 
            height="32"
          >
            <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2M12 6.5L11.5 8.5L9.5 9L11.5 9.5L12 11.5L12.5 9.5L14.5 9L12.5 8.5L12 6.5M7 13.5L6.5 15.5L4.5 16L6.5 16.5L7 18.5L7.5 16.5L9.5 16L7.5 15.5L7 13.5M17 13.5L16.5 15.5L14.5 16L16.5 16.5L17 18.5L17.5 16.5L19.5 16L17.5 15.5L17 13.5"/>
          </svg>
          Una historia que nació del corazón
        </div>
      </div>

      {/* Historia Principal */}
      <div className="sobrenos-section">
        <div className="sobrenos-card">
          <h2>El Origen de Mamá Mian Pizza</h2>
          <div className="sobrenos-content-with-image">
            <div className="sobrenos-text-content">
              <p>
                En los momentos más inciertos, es donde nacen las historias más genuinas. 
                Así surgió Mamá Mian Pizza, no solo como un negocio, sino como un sueño tejido con dedicación, amor y mucha esperanza.
              </p>
              <p>
                Corría abril de 2020, y como a muchos, la pandemia nos tomó por sorpresa. 
                Antes de todo esto, nuestra vida transcurría en un pequeño cafetín dentro de un centro escolar de Puerto El Triunfo. 
                Cada día servíamos a nuestros pequeños y queridos clientes, llevando sabor y alegría entre libros y risas escolares.
              </p>
            </div>
            <div className="sobrenos-image-container">
              <img src={señora} alt="Fundadora de Mamá Mian Pizza" className="sobrenos-story-image" />
              <div className="image-caption">La historia comenzó con amor y dedicación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda Sección */}
      <div className="sobrenos-section">
        <div className="sobrenos-card">
          <h2>Del Desafío a la Oportunidad</h2>
          <div className="sobrenos-content-with-image reverse">
            <div className="sobrenos-image-container">
              <img src={señor} alt="Equipo de trabajo" className="sobrenos-story-image" />
              <div className="image-caption">Trabajo en equipo desde el principio</div>
            </div>
            <div className="sobrenos-text-content">
              <p>
                Dos días a la semana, como parte de las iniciativas de "escuela saludable", ofrecíamos pizzas artesanales 
                hechas con nuestras propias manos, preparadas con todo el cariño de una cocina familiar.
              </p>
              <p>
                Pero cuando en 2020 las escuelas cerraron, fuimos de los primeros en sentir el golpe. 
                Lo que pensábamos sería una semana, luego un mes... terminó convirtiéndose en un cierre indefinido. 
                Nos vimos a la deriva, pero también vimos una oportunidad, el deseo de seguir adelante y no rendirnos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tercera Sección */}
      <div className="sobrenos-section">
        <div className="sobrenos-card highlight">
          <h2>Nuestra Esencia</h2>          <div className="sobrenos-pizza-gallery">
            <div className="pizza-images">
              <img src={pizzaDia} alt="Pizzas artesanales" className="pizza-image" />
              <img src={pizzaNoche} alt="Pizzas recién horneadas" className="pizza-image" />
            </div>
            <div className="sobrenos-text-content">
              <p>
                Mamá Mian Pizza no nació en grandes cocinas industriales, sino desde nuestro propio rinconcito hogareño, 
                en nuestro querido Puerto El Triunfo.
              </p>
              <p>
                Cada pizza que sale de nuestro horno lleva consigo esa historia: el amor de una familia que se niega a rendirse, 
                la calidez de un hogar con las puertas abiertas para quien quiera disfrutar de un trozo de felicidad, 
                y por siempre nuestro toque artesanal con masas hechas a mano, salsas cocinadas con calma y sabores que huelen a casa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje Final */}
      <div className="sobrenos-final">
        <div className="sobrenos-message">
          <div className="team-image-container">
            <img src={equipoMamaMian} alt="Equipo de Mamá Mian Pizza" className="team-image" />
            <div className="team-caption">Nuestro equipo, nuestra familia</div>
          </div>          <p>
            Hoy, más que vender pizzas, llevamos una parte de nuestra historia a cada familia que nos elige. 
            Cada mordida es una celebración de lo que somos, una pequeña gran familia que cree que, 
            incluso en medio de las tormentas, los sueños sí pueden crecer... y saben a pizza recién horneada.
          </p>
          <div className="sobrenos-welcome">
            <strong>Bienvenidos a Mamá Mian Pizza. Bienvenidos a nuestro hogar.</strong>
          </div>
        </div>
      </div>

      <Footer noImage={true} />
    </div>
  );
}

export default SobreNosotros;

