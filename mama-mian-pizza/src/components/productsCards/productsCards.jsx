import './productsCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faCartShopping } from '@fortawesome/free-solid-svg-icons';

function ProductsCards({ data: { title, Descripcion, img, price } }) {
  return (
    <div className="products__cards">
      <img src={img} alt={title} />
      <h3>{title}</h3>
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
        <button className="show__modal">
          <FontAwesomeIcon icon={faCartShopping} />
        </button>
      </div>
    </div>
  );
}

export default ProductsCards;
