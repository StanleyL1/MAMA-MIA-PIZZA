import React from 'react';
import './productsCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faCartShopping } from '@fortawesome/free-solid-svg-icons';

function ProductsCards({ data: { title, Descripcion, img, price }, onCardClick }) {
  return (
    <div className="prodcard-container" onClick={onCardClick}>
      <img src={img} alt={title} className="prodcard-image" />
      <h3 className="prodcard-title">{title}</h3>
      <p className="card__product__description">{Descripcion}</p>
      
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
