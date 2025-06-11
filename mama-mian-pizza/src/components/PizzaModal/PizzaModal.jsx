import React, { useState, useEffect } from 'react';
import './PizzaModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

function PizzaModal({ pizza, onClose, onAddToCart }) {
  const [masa, setMasa] = useState('Tradicional');
  const [tamano, setTamano] = useState('Personal');
  const [instrucciones, setInstrucciones] = useState('');
  const [personalizarIngredientes, setPersonalizarIngredientes] = useState(false);
  const maxIngredientes = 4;const [showNotification, setShowNotification] = useState(false);
  const [tamanos, setTamanos] = useState([]);
  const [precioActual, setPrecioActual] = useState(pizza?.precio || '0');
  const [cargandoTamanos, setCargandoTamanos] = useState(false);
  
  // Lista de ingredientes disponibles con su estado (seleccionado o no)
  const [ingredientes, setIngredientes] = useState([
    { id: 1, nombre: 'Queso', seleccionado: false },
    { id: 2, nombre: 'Pepperoni', seleccionado: false },
    { id: 3, nombre: 'Jamón', seleccionado: false },
    { id: 4, nombre: 'Piña', seleccionado: false },
    { id: 5, nombre: 'Carne', seleccionado: false },
    { id: 6, nombre: 'Champiñones', seleccionado: false },
    { id: 7, nombre: 'Aceitunas', seleccionado: false },
    { id: 8, nombre: 'Cebolla', seleccionado: false }
  ]);
  // Contador de ingredientes seleccionados
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(0);
  // Función para calcular el precio basado en el multiplicador del tamaño
  const calcularPrecio = (tamanoData) => {
    if (!tamanoData || !tamanoData.precio) return '$0';
    return `$${parseFloat(tamanoData.precio).toFixed(0)}`;
  };

  // Función para procesar los datos de la API y obtener tamaños únicos
  const procesarTamanos = (data) => {
    const tamanosUnicos = [];
    const tamanosVistos = new Set();
    
    data.forEach(item => {
      if (!tamanosVistos.has(item.id_tamano)) {
        tamanosVistos.add(item.id_tamano);
        tamanosUnicos.push({
          id: item.id_tamano,
          nombre: item.nombre,
          indice: item.indice,
          precio: item.precio
        });
      }
    });
    console.log('Tamaños únicos procesados:', tamanosUnicos);
    return tamanosUnicos.sort((a, b) => a.indice - b.indice);
  };

  // Actualiza el contador cuando cambian las selecciones
  useEffect(() => {
    const count = ingredientes.filter(ing => ing.seleccionado).length;
    setIngredientesSeleccionados(count);
  }, [ingredientes]);  // Cargar tamaños y precios desde la API
  useEffect(() => {
    const fetchTamanos = async () => {
      if (!pizza) return;
      
      setCargandoTamanos(true);      try {
        const response = await fetch('https://api.mamamianpizza.com/api/tamanos/tamanosandprices');
        const data = await response.json();
        console.log('Datos recibidos de la API:', data);
        
        // Procesar los datos para obtener tamaños únicos
        const tamanosUnicos = procesarTamanos(data);
        console.log('Tamaños procesados:', tamanosUnicos);
        setTamanos(tamanosUnicos);
        
        // Establecer el precio inicial para el primer tamaño
        if (tamanosUnicos.length > 0) {
          const primerTamano = tamanosUnicos[0];
          setTamano(primerTamano.nombre);
          setPrecioActual(calcularPrecio(primerTamano));
        }
      } catch (error) {
        console.error('Error al cargar tamaños:', error);
        // Si falla la API, usar valores por defecto
        const defaultTamanos = [
          { id: 1, nombre: 'Personal', indice: 1, precio: '6.00' },
          { id: 2, nombre: 'Mediana', indice: 2, precio: '8.00' },
          { id: 3, nombre: 'Grande', indice: 3, precio: '10.00' },
          { id: 4, nombre: 'Gigante', indice: 4, precio: '12.00' }
        ];
        setTamanos(defaultTamanos);
        setTamano(defaultTamanos[0].nombre);
        setPrecioActual(calcularPrecio(defaultTamanos[0]));
      } finally {
        setCargandoTamanos(false);
      }
    };

    fetchTamanos();  }, [pizza]);

  // Actualizar precio cuando cambia el tamaño
  useEffect(() => {
    if (tamanos.length > 0) {
      const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
      if (tamanosSeleccionado) {
        setPrecioActual(calcularPrecio(tamanosSeleccionado));
      }
    }
  }, [tamano, tamanos]);

  if (!pizza) return null;

  const isPizza = pizza.id_categoria === 1;
  const handleAddToOrder = () => {
    // Si es una pizza, incluir masa, tamaño e instrucciones, de lo contrario, enviar solo el producto
    if (isPizza) {
      const ingredientesSeleccionadosArray = personalizarIngredientes 
        ? ingredientes.filter(ing => ing.seleccionado).map(ing => ing.nombre)
        : [];
      
      // Encontrar el precio actual del tamaño seleccionado
      const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
      const precioFinal = tamanosSeleccionado ? tamanosSeleccionado.precio : pizza.precio;
        
      onAddToCart(
        {...pizza, precio: precioFinal}, 
        masa, 
        tamano, 
        instrucciones, 
        personalizarIngredientes ? ingredientesSeleccionadosArray : []
      );
    } else {
      onAddToCart(pizza, null, null, instrucciones);
    }
    
    // Mostrar la notificación de éxito
    setShowNotification(true);
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setShowNotification(false);
      onClose();
    }, 2000);
  };

  const handleToggleMasa = (tipo) => {
    setMasa(tipo);
  };

  const handleTogglePersonalizar = () => {
    // Al desactivar la personalización, resetear todas las selecciones
    if (personalizarIngredientes) {
      setIngredientes(ingredientes.map(ing => ({ ...ing, seleccionado: false })));
    }
    setPersonalizarIngredientes(!personalizarIngredientes);
  };
  
  const handleIngredienteChange = (id) => {
    const ingrediente = ingredientes.find(ing => ing.id === id);
    
    // Si ya está seleccionado, permitir deseleccionar
    if (ingrediente.seleccionado) {
      setIngredientes(ingredientes.map(ing => 
        ing.id === id ? { ...ing, seleccionado: false } : ing
      ));
    } 
    // Si no está seleccionado y no hemos alcanzado el máximo, permitir seleccionar
    else if (ingredientesSeleccionados < maxIngredientes) {
      setIngredientes(ingredientes.map(ing => 
        ing.id === id ? { ...ing, seleccionado: true } : ing
      ));
    }
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close-button" onClick={onClose}>×</button>
        
        {/* Notificación de éxito */}
        {showNotification && (
          <div className="modal__notification">
            <p>¡{pizza.titulo} agregado al carrito con éxito!</p>
          </div>
        )}
        
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
                </div>                <div className="modal__option-section">
                  <span className="modal__option-label">Tamaño</span>
                  <div className="modal__dropdown">
                    <select 
                      value={tamano} 
                      onChange={(e) => setTamano(e.target.value)}
                      className="modal__custom-select"
                    >
                      {tamanos.map(t => (
                        <option key={t.id} value={t.nombre}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                  {/* Mostrar precio del tamaño seleccionado */}
                  <div className="modal__precio-tamano">
                    <span className="modal__precio-label">Precio para {tamano}:</span>
                    <span className="modal__precio-valor">
                      {cargandoTamanos ? 'Calculando...' : precioActual}
                    </span>
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
                      <span className="modal__cambios-counter">{ingredientesSeleccionados}/{maxIngredientes} ingredientes</span>
                    </div>
                  </div>
                  
                  {personalizarIngredientes && (
                    <div className="modal__ingredientes-section">
                      <div className="modal__ingredientes-hint">
                        {ingredientesSeleccionados === maxIngredientes ? 
                          "Has alcanzado el máximo de 4 ingredientes" : 
                          `Selecciona hasta ${maxIngredientes} ingredientes`}
                      </div>
                      <div className="modal__ingredientes-container">
                        {ingredientes.map(ingrediente => (
                          <div key={ingrediente.id} className="modal__ingrediente-item">
                            <label className={`modal__checkbox-container ${!ingrediente.seleccionado && ingredientesSeleccionados >= maxIngredientes ? 'modal__disabled' : ''}`}>
                              <input
                                type="checkbox"
                                checked={ingrediente.seleccionado}
                                onChange={() => handleIngredienteChange(ingrediente.id)}
                                disabled={!ingrediente.seleccionado && ingredientesSeleccionados >= maxIngredientes}
                              />
                              <span className="modal__checkbox-custom"></span>
                              {ingrediente.nombre}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
            <p className="modal__pizza-description">{pizza.descripcion}</p>            <div className="modal__bottom-row">
              <span className="modal__pizza-price">
                {isPizza ? (cargandoTamanos ? 'Cargando...' : precioActual) : pizza.precio}
              </span>
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
