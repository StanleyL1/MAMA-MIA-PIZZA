import './productsCards.css';
import { ShoppingCart } from 'lucide-react';

// Importa tus imágenes de estrella
import estrellaCom from '../../assets/EstrellaCom.png';
import estrellaMedia from '../../assets/EstrellaMedia.png';

function ProductsCards({ data: { title, Descripcion, img, price } }) {
  return (
    <div className="home-card">
      <img src={img} alt={title} className="home-card-image" />
      
      <h3 className="home-card-title">{title}</h3>
      <p className="home-card-desc">{Descripcion}</p>
      
      {/* Estrellas usando imágenes */}
      <div className="home-card-stars">
        <img src={estrellaCom} alt="Estrella completa" className="home-card-star-icon" />
        <img src={estrellaCom} alt="Estrella completa" className="home-card-star-icon" />
        <img src={estrellaCom} alt="Estrella completa" className="home-card-star-icon" />
        <img src={estrellaCom} alt="Estrella completa" className="home-card-star-icon" />
        <img src={estrellaMedia} alt="Estrella media" className="home-card-star-icon" />
      </div>
      
      {/* Precio y carrito */}
      <div className="home-card-footer">
        <span className="home-card-price">{price}</span>
        <ShoppingCart className="home-card-cart" />
      </div>
    </div>
  );
}


export default ProductsCards;
