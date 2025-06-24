import React, { useState, useEffect } from 'react';
import './productsCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCartShopping } from '@fortawesome/free-solid-svg-icons';

function ProductsCards({ data, onCardClick, isRecommendation = false }) {
  // TODOS los hooks deben ir AL PRINCIPIO, antes de cualquier return o condicional
  const [precioMediana, setPrecioMediana] = useState(data?.precio || '$0');
  const [cargandoPrecio, setCargandoPrecio] = useState(false);

  // useEffect también debe ir antes de cualquier return
  useEffect(() => {
    // Solo ejecutar si tenemos datos válidos
    if (!data || !data.titulo) return;
    
    const { titulo, precio, id_categoria } = data;
    
    const fetchPrecioMediana = async () => {
      // Solo buscar precio de mediana para pizzas (id_categoria === 1)
      if (id_categoria === 1 || (titulo && titulo.toLowerCase().includes('pizza'))) {
        setCargandoPrecio(true);
        try {
          const response = await fetch('https://api.mamamianpizza.com/api/tamanos/tamanosandprices');
          const responseData = await response.json();
          
          // Buscar el precio de la pizza mediana
          const mediana = responseData.find(item => 
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
  }, [data]);

  // DESPUÉS de todos los hooks, ahora sí podemos hacer verificaciones y returns
  if (!data) {
    console.warn('ProductsCards: data prop is undefined');
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Error: No se pudo cargar el producto
      </div>
    );
  }

  const { titulo, descripcion, imagen, id_categoria } = data;  return (
    <div className={`prodcard-container ${isRecommendation ? 'prodcard-container--recommendation' : ''}`} onClick={() => {
      if (data && onCardClick) {
        onCardClick(data);
      }
    }}>

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
        </div>        <button 
          className="show__modal" 
          onClick={(e) => {
            e.stopPropagation();
            if (data && onCardClick) {
              onCardClick(data);
            }
          }}        >
          <FontAwesomeIcon icon={faCartShopping} />
        </button>
      </div>
    </div>
  );
}

export default ProductsCards;
