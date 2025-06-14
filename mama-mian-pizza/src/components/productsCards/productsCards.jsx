import React, { useState, useEffect } from 'react';
import './productsCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faCartShopping } from '@fortawesome/free-solid-svg-icons';

function ProductsCards({ data, onCardClick }) {
  const { titulo, descripcion, imagen, precio, id_categoria } = data;
  const [precioMediana, setPrecioMediana] = useState(precio);
  const [cargandoPrecio, setCargandoPrecio] = useState(false);

  // Función para obtener el precio de la pizza mediana
  useEffect(() => {
    const fetchPrecioMediana = async () => {
      // Solo buscar precio de mediana para pizzas (id_categoria === 1)
      if (id_categoria === 1 || (titulo && titulo.toLowerCase().includes('pizza'))) {
        setCargandoPrecio(true);
        try {
          const response = await fetch('https://api.mamamianpizza.com/api/tamanos/tamanosandprices');
          const data = await response.json();
          
          // Buscar el precio de la pizza mediana
          const mediana = data.find(item => 
            item.nombre && item.nombre.toLowerCase().includes('mediana')
          );
          
          if (mediana && mediana.precio) {
            setPrecioMediana(`$${parseFloat(mediana.precio).toFixed(0)}`);
          } else {
            // Si no se encuentra mediana, usar precio por defecto
            setPrecioMediana(precio || '$8');
          }
        } catch (error) {
          console.error('Error al cargar precio de mediana:', error);
          // En caso de error, usar precio por defecto para mediana
          setPrecioMediana(precio || '$8');
        } finally {
          setCargandoPrecio(false);
        }
      } else {
        // Para productos que no son pizzas, usar el precio original
        setPrecioMediana(precio);
        setCargandoPrecio(false);
      }
    };

    fetchPrecioMediana();
  }, [titulo, precio, id_categoria]);
  return (
    <div className="prodcard-container" onClick={() => onCardClick(data)}>
      <div className="prodcard-image-container">
        <img src={imagen} alt={titulo} className="prodcard-image" />
      </div>
      <div className="prodcard-content">
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
      </div>
      
      <div className="card__footer">
        <div className="price__container">
          {(id_categoria === 1 || (titulo && titulo.toLowerCase().includes('pizza'))) && (
            <span className="price__label">Mediana</span>
          )}
          <p className="card__product__price">
            {cargandoPrecio ? 'Cargando...' : precioMediana}
          </p>
        </div>
        <button 
          className="show__modal" 
          onClick={(e) => {
            e.stopPropagation();
            onCardClick && onCardClick();
          }}        >
          <FontAwesomeIcon icon={faCartShopping} />
        </button>
      </div>
    </div>
  );
}

export default ProductsCards;
