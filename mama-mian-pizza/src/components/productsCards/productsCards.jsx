import React from 'react';
import './productsCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faCartShopping } from '@fortawesome/free-solid-svg-icons';

function ProductsCards({ data: { titulo, descripcion, imagen, precio }, onCardClick }) {
  return (
    <div className="prodcard-container" onClick={onCardClick}>
      <div className="prodcard-image-container">
        <img src={imagen} alt={titulo} className="prodcard-image" />
      </div>
      <h3 className="prodcard-titulo" title={titulo}>{titulo}</h3>
      <p className="card__product__description">{descripcion}</p>
      
      <div className="stars__containers">
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon icon={faStarHalf} />      
      </div>
      
      <div className="card__footer">
        <p className="card__product__price">{precio}</p>
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
