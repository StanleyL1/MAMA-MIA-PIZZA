import React, { useState } from 'react';
import './PizzaModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

function PizzaModal({ pizza, onClose, onAddToCart }) {
  const [masa, setMasa] = useState('Tradicional');
  const [tamano, setTamano] = useState('Personal (4 porciones)');
  const [instrucciones, setInstrucciones] = useState('');
  const [personalizarIngredientes, setPersonalizarIngredientes] = useState(false);
  const [cambiosIngredientes, setCambiosIngredientes] = useState(0);
  const maxCambios = 4;

  if (!pizza) return null;

  const isPizza = pizza.id_categoria === 1;

  const handleAddToOrder = () => {
    // Si es una pizza, incluir masa, tamaño e instrucciones, de lo contrario, enviar solo el producto
    if (isPizza) {
      onAddToCart(pizza, masa, tamano, instrucciones, personalizarIngredientes ? cambiosIngredientes : 0);
    } else {
      onAddToCart(pizza, null, null, instrucciones);
    }
    onClose();
  };

  const handleToggleMasa = (tipo) => {
    setMasa(tipo);
  };

  const handleTogglePersonalizar = () => {
    setPersonalizarIngredientes(!personalizarIngredientes);
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close-button" onClick={onClose}>×</button>
        <div className="modal__layout">
          <div className="modal__left">
            <img src={pizza.imagen} alt={pizza.titulo} className="modal__pizza-image" />
          </div>
          <div className="modal__right">
            <h2 className="modal__pizza-title">{pizza.titulo}</h2>
            
            {isPizza && (
              <>
                <div className="modal__option-section">
                  <span className="modal__option-label">Tipo de masa</span>
                  <div className="modal__option-toggle">
                    <button 
                      className={`modal__toggle-button ${masa === 'Delgada' ? 'modal__active' : ''}`}
                      onClick={() => handleToggleMasa('Delgada')}
                    >
                      Delgada
                    </button>
                    <button 
                      className={`modal__toggle-button ${masa === 'Tradicional' ? 'modal__active' : ''}`}
                      onClick={() => handleToggleMasa('Tradicional')}
                    >
                      Tradicional
                    </button>
                  </div>
                </div>

                <div className="modal__option-section">
                  <span className="modal__option-label">Tamaño</span>
                  <div className="modal__dropdown">
                    <select 
                      value={tamano} 
                      onChange={(e) => setTamano(e.target.value)}
                      className="modal__custom-select"
                    >
                      <option value="Personal (4 porciones)">Personal (4 porciones)</option>
                      <option value="Mediana (6 porciones)">Mediana (6 porciones)</option>
                      <option value="Grande (8 porciones)">Grande (8 porciones)</option>
                    </select>
                  </div>
                </div>

                <div className="modal__option-section">
                  <div className="modal__personalizar-wrapper">
                    <span className="modal__option-label">Personalizar ingredientes</span>
                    <div className="modal__toggle-slider-wrapper">
                      <label className="modal__toggle-slider">
                        <input 
                          type="checkbox" 
                          checked={personalizarIngredientes}
                          onChange={handleTogglePersonalizar}
                        />
                        <span className="modal__slider"></span>
                      </label>
                      <span className="modal__cambios-counter">{cambiosIngredientes}/{maxCambios} cambios</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="modal__option-section">
              <span className="modal__option-label">Instrucciones especiales</span>
              <textarea
                className="modal__instrucciones-input"
                placeholder="Ej: Poco queso, bien cocida, etc"
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
              />
            </div>
            
            <h3 className="modal__desc-title">Descripción</h3>
            <p className="modal__pizza-description">{pizza.descripcion}</p>
            
            <div className="modal__bottom-row">
              <span className="modal__pizza-price">{pizza.precio}</span>
              <button className="modal__add-button" onClick={handleAddToOrder}>
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
