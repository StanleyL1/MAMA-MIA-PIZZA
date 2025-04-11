import React, { useState } from 'react';
import './PizzaModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

function PizzaModal({ pizza, onClose, onAddToCart }) {
  const [masa, setMasa] = useState('Pan');
  const [tamano, setTamano] = useState('Personal (4 porciones)');

  if (!pizza) return null;

  const isPizza = pizza.id_categoria === 1;

  const handleAddToOrder = () => {
    // Si es una pizza, incluir masa y tamaño, de lo contrario, enviar solo el producto
    if (isPizza) {
      onAddToCart(pizza, masa, tamano);
    } else {
      onAddToCart(pizza);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <div className="modal-layout">
          <div className="modal-left">
            <img src={pizza.imagen} alt={pizza.titulo} className="modal-pizza-image" />
          </div>
          <div className="modal-right">
            <h2 className="modal-pizza-title">{pizza.titulo}</h2>
            
            {isPizza && (
              <div className="modal-selectors">
                <div className="selector-item">
                  <label htmlFor="masaSelect">Masa</label>
                  <select 
                    id="masaSelect" 
                    value={masa} 
                    onChange={(e) => setMasa(e.target.value)}
                  >
                    <option value="Pan">Pan</option>
                    <option value="Delgada">Delgada</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>
                <div className="selector-item">
                  <label htmlFor="tamanoSelect">Tamaño</label>
                  <select 
                    id="tamanoSelect" 
                    value={tamano} 
                    onChange={(e) => setTamano(e.target.value)}
                  >
                    <option value="Personal (4 porciones)">Personal (4 porciones)</option>
                    <option value="Mediana (6 porciones)">Mediana (6 porciones)</option>
                    <option value="Grande (8 porciones)">Grande (8 porciones)</option>
                  </select>
                </div>
              </div>
            )}
            
            <h3 className="modal-desc-title">Descripción</h3>
            <p className="modal-pizza-description">{pizza.descripcion}</p>
            <div className="modal-bottom-row">
              <span className="modal-pizza-price">{pizza.precio}</span>
              <button className="modal-add-button" onClick={handleAddToOrder}>
                Añadir a mi orden <FontAwesomeIcon icon={faCartShopping} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaModal;
