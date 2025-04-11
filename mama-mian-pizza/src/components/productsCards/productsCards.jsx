import React from 'react';
import './productsCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faCartShopping } from '@fortawesome/free-solid-svg-icons';

function ProductsCards({ data, onCardClick }) {
  // Compatibilidad con diferentes estructuras de datos
  // Usar propiedades del API o las propiedades anteriores si están disponibles
  const title = data.title || data.titulo || '';
  const description = data.Descripcion || data.descripcion || '';
  const image = data.img || data.imagen || '';
  const price = data.price || data.precio || '';

  return (
    <div className="prodcard-container" onClick={onCardClick}>
      <div className="prodcard-image-container">
        <img src={image} alt={title} className="prodcard-image" />
      </div>
      <h3 className="prodcard-titulo" title={title}>{title}</h3>
      <p className="card__product__description">{description}</p>
      
      <div className="stars__containers">
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStarHalf} />      
      </div>
      
      <div className="card__footer">
        <p className="card__product__price">{price}</p>
        {/* Si deseas que también se active el modal al hacer click en el botón, 
            asegúrate de evitar que el click se duplique usando e.stopPropagation() */}
        <button 
          className="show__modal" 
          onClick={(e) => {
            e.stopPropagation();
            onCardClick && onCardClick();
          }}
        >
          <FontAwesomeIcon icon={faCartShopping} />
        </button>
      </div>
    </div>
  );
}

export default ProductsCards;
