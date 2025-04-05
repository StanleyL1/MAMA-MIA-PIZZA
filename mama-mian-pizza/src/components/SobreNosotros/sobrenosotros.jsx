import React from 'react';
import quesoR from '../../assets/quesoR.png';
import './sobrenosotros.css';
//import Footer from '../footer/footer';

function SobreNosotros() {
  return (
    <div className="sobrenos-container">
      <div className="sobrenos-content">
        {/* Contenedor para centrar la imagen */}
        <div className="sobrenos-image-container">
          <img src={quesoR} alt="Queso" className="sobrenos-image" />
        </div>
        {/* Contenedor del texto al lado */}
        <div className="sobrenos-text">
          <h2>Amor y pasión</h2>
          <p>
            Mama Mian Pizza nació hace muchos años como un sueño, un sueño que se vivía al límite con
            infinitas ganas de materializarse. Solo hasta julio de 2019 se logró pasar de la idea a la
            realidad y se registró la marca, un suceso que cambió para siempre la vida de sus creadores y
            vio la primera pizza ver la luz el 13 de septiembre de 2019. Somos Hernán Valencia y Juanita
            Escobar, y nuestro sueño se ha materializado al día de hoy. Nuestras pizzas artesanales hacen
            la diferencia, con materiales de la mejor calidad: quesos, carnes, masas y salsas ¡TOP!
          </p>
        </div>
      </div>


</div>
  );
}

export default SobreNosotros;
