import React from 'react';
import quesoR from '../../assets/quesoR.png';
import './sobrenosotros.css';
//import Footer from '../footer/footer';

function SobreNosotros() {
  return (
    <div className="sobrenos-container">
      {/* Primer bloque: Imagen izquierda, texto derecha */}
      <div className="sobrenos-content">
        <div className="sobrenos-image-container">
          <img src={quesoR} alt="Queso" className="sobrenos-image" />
        </div>
        <div className="sobrenos-text">
          <h2>Historia de Mama Mian Pizza</h2>
          <p>
          🍕 Mamá Mian Pizza una historia que nació del corazón

En los momentos más inciertos, es donde nacen las historias más genuinas.  
Así surgió Mamá Mian Pizza  no solo como un negocio, sino como un sueño tejido con dedicación, amor y mucha esperanza.

Corría abril de 2020, y como a muchos, la pandemia nos tomó por sorpresa.  
Antes de todo esto, nuestra vida transcurría en un pequeño cafetín dentro de un centro escolar de Puerto El Triunfo. Cada día servíamos a nuestros pequeños y queridos clientes, llevando sabor y alegría entre libros y risas escolares.  
Dos días a la semana, como parte de las iniciativas de “escuela saludable”, ofrecíamos pizzas artesanales hechas con nuestras propias manos, preparadas con todo el cariño de una cocina familiar.

Pero cuando en 2020 las escuelas cerraron, fuimos de los primeros en sentir el golpe.  
Lo que pensábamos sería una semana, luego un mes... terminó convirtiéndose en un cierre indefinido.  
Nos vimos a la deriva, pero también vimos una oportunidad, el deseo de seguir adelante y no rendirnos

Mamá Mian Pizza no  nació en grandes cocinas industriales, sino desde nuestra propio rinconcito hogareño, en nuestro querido Puerto El Triunfo.
</p>
        </div>
      </div>

      {/* Segundo bloque: Texto izquierda, imagen derecha */}
      <div className="sobrenos-content reverse">
        <div className="sobrenos-text">
          <p>
          Cada pizza que sale de nuestro horno lleva consigo esa historia
El amor de una familia que se niega a rendirse, la calidez de un hogar con las puertas abiertas para quien quiera disfrutar de un trozo de felicidad, y por siempre nuestro toque artesanal con masas hechas a mano, salsas cocinadas con calma y sabores que huelen a casa.

Hoy, más que vender pizzas, llevamos una parte de nuestra historia a cada familia que nos elige.  
Cada mordida es una celebración de lo que somos, una pequeña gran familia que cree que, incluso en medio de las tormentas, los sueños sí pueden crecer... y saben a pizza recién horneada.

Bienvenidos a Mamá Mian Pizza. Bienvenidos a nuestro hogar.
          </p>
        </div>
        <div className="sobrenos-image-container">
          <img src={quesoR} alt="Nuestra Filosofía" className="sobrenos-image" />
        </div>
      </div>
    </div>
  );
}

export default SobreNosotros;

