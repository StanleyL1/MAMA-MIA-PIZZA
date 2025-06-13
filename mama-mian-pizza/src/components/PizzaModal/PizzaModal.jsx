import React, { useState, useEffect } from 'react';
import './PizzaModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCommentDots, faStar } from '@fortawesome/free-solid-svg-icons';

function PizzaModal({ pizza, onClose, onAddToCart }) {
  const [masa, setMasa] = useState('Tradicional');
  const [tamano, setTamano] = useState('Personal');
  const [instrucciones, setInstrucciones] = useState('');
  const [personalizarIngredientes, setPersonalizarIngredientes] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState('pedido');
  const [reseñas, setReseñas] = useState([]);
  const [mostrarFormularioResena, setMostrarFormularioResena] = useState(false);
  const [nuevaResena, setNuevaResena] = useState({ rating: 0, comentario: '' });
  const [tamanos, setTamanos] = useState([]);
  const [precioActual, setPrecioActual] = useState(pizza?.precio || '0');
  const [cargandoTamanos, setCargandoTamanos] = useState(false);

  const maxIngredientes = 4;
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

  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(0);
  
  const user = {
    nombre: "Juan Pérez",
    foto: require('../../assets/perfilfoto.png'),
  };

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
  }, [ingredientes]);

  // Cargar tamaños y precios desde la API o del objeto del producto
  useEffect(() => {
    const fetchTamanos = async () => {
      if (!pizza) return;
      
      // Determinar si es una pizza o un producto con tamaños configurables
      const isPizzaProduct = pizza.id_categoria === 1 || 
                         (pizza.titulo && pizza.titulo.toLowerCase().includes('pizza'));
      
      // Solo cargamos tamaños de la API para pizzas
      if (isPizzaProduct) {
        setCargandoTamanos(true);
        try {
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
      } else {
        // Para productos que no son pizzas, si tienen opciones, las utilizamos directamente
        if (pizza.opciones && pizza.opciones.length > 0) {
          // Convertir las opciones del producto a formato de tamaños
          const opcionesTamanos = pizza.opciones.map((opcion, index) => ({
            id: opcion.tamanoId || index + 1,
            nombre: opcion.nombre,
            indice: index + 1,
            precio: opcion.precio
          }));
          
          setTamanos(opcionesTamanos);
          
          if (opcionesTamanos.length > 0) {
            setTamano(opcionesTamanos[0].nombre);
            setPrecioActual(calcularPrecio(opcionesTamanos[0]));
          }
        } else {
          // Si no tiene opciones, dejamos el array de tamaños vacío
          setTamanos([]);
          // Y ponemos el precio directo si existe
          if (pizza.precio) {
            setPrecioActual(`$${parseFloat(pizza.precio).toFixed(0)}`);
          } else {
            setPrecioActual('$0');
          }
        }
        setCargandoTamanos(false);
      }
    };

    fetchTamanos();
  }, [pizza]);

  // Actualizar precio cuando cambia el tamaño
  useEffect(() => {
    if (tamanos.length > 0) {
      const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
      if (tamanosSeleccionado) {
        setPrecioActual(calcularPrecio(tamanosSeleccionado));
      }
    } else if (pizza && pizza.opciones && pizza.opciones.length > 0) {
      // Si no hay tamaños pero hay opciones disponibles, usar el precio de la primera opción
      setPrecioActual(`$${parseFloat(pizza.opciones[0].precio).toFixed(0)}`);
    } else if (pizza && pizza.precio) {
      // Si hay precio directo en el producto
      setPrecioActual(`$${parseFloat(pizza.precio).toFixed(0)}`);
    }
  }, [tamano, tamanos, pizza]);

  // Establecer precio inicial basado en opciones cuando no hay tamaños disponibles
  useEffect(() => {
    if (pizza && (!tamanos || tamanos.length === 0)) {
      if (pizza.opciones && pizza.opciones.length > 0) {
        setPrecioActual(`$${parseFloat(pizza.opciones[0].precio).toFixed(0)}`);
      } else if (pizza.precio) {
        setPrecioActual(`$${parseFloat(pizza.precio).toFixed(0)}`);
      }
    }
  }, [pizza, tamanos]);

  if (!pizza) return null;

  // Determinar si es una pizza basado en el nombre o categoría
  const isPizza = pizza.id_categoria === 1 || 
                 (pizza.titulo && pizza.titulo.toLowerCase().includes('pizza'));

  const handleAddToOrder = () => {
  // Si es una pizza, incluir masa, tamaño e instrucciones, de lo contrario, enviar solo el producto
  if (isPizza) {
    const ingredientesSeleccionadosArray = personalizarIngredientes 
      ? ingredientes.filter(ing => ing.seleccionado).map(ing => ing.nombre)
      : [];
    
    // Encontrar el precio actual del tamaño seleccionado
    const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
    const precioFinal = tamanosSeleccionado ? tamanosSeleccionado.precio : 
                       (pizza.opciones && pizza.opciones.length > 0 ? pizza.opciones[0].precio : pizza.precio);
      
    onAddToCart(
      {...pizza, precio: precioFinal}, 
      masa, 
      tamano, 
      instrucciones, 
      personalizarIngredientes ? ingredientesSeleccionadosArray : []
    );
  } else {
    // Para productos que no son pizzas pero tienen opciones de tamaño
    const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
    const precioFinal = tamanosSeleccionado ? tamanosSeleccionado.precio : 
                       (pizza.opciones && pizza.opciones.length > 0 ? pizza.opciones[0].precio : pizza.precio);
    
    onAddToCart({...pizza, precio: precioFinal}, null, tamanosSeleccionado, instrucciones);
  }
    // Mostrar la notificación de éxito
  setShowNotification(true);
  
  // Ocultar la notificación después de 2 segundos
  setTimeout(() => {
    setShowNotification(false);
    onClose();
  }, 2000);
};

  const handleToggleMasa = (tipo) => setMasa(tipo);

  const handleTogglePersonalizar = () => {
    if (personalizarIngredientes) {
      setIngredientes(ingredientes.map(ing => ({ ...ing, seleccionado: false })));
    }
    setPersonalizarIngredientes(!personalizarIngredientes);
  };

  const handleIngredienteChange = (id) => {
    const ingrediente = ingredientes.find(ing => ing.id === id);

    if (ingrediente.seleccionado) {
      setIngredientes(ingredientes.map(ing =>
        ing.id === id ? { ...ing, seleccionado: false } : ing
      ));
    } else if (ingredientesSeleccionados < maxIngredientes) {
      setIngredientes(ingredientes.map(ing =>
        ing.id === id ? { ...ing, seleccionado: true } : ing
      ));
    }
  };

  const handlePublicarResena = () => {
    if (nuevaResena.rating > 0 && nuevaResena.comentario.trim()) {
      const hoy = new Date();
      setReseñas([
        ...reseñas,
        {
          ...nuevaResena,
          nombre: user.nombre,
          foto: user.foto,
          fecha: hoy.toISOString().slice(0, 10), // YYYY-MM-DD
        }
      ]);
      setNuevaResena({ rating: 0, comentario: '' });
      setMostrarFormularioResena(false);
    }
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className={`modal__content ${activeTab === 'resenas' ? 'modal__full-white' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close-button" onClick={onClose}>×</button>

        {/* Barra superior */}
        <div className="modal__topbar">
          <span
            className={`modal__topbar-item ${activeTab === 'pedido' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedido')}
          >
            <FontAwesomeIcon icon={faCartShopping} style={{ marginRight: 8 }} />
            Realizar Pedido
          </span>
          <span
            className={`modal__topbar-item ${activeTab === 'resenas' ? 'active' : ''}`}
            onClick={() => setActiveTab('resenas')}
          >
            <FontAwesomeIcon icon={faStar} style={{ marginRight: 8 }} />
            Reseñas
          </span>
        </div>

        {/* Notificación */}
{showNotification && (
  <div className="modal__notification">
    <p>✓ Agregado al carrito</p>
  </div>
)}

        {/* Layout principal */}
        <div className="modal__layout">
          {activeTab === 'pedido' && (
            <div className="modal__left">
              <img src={pizza.imagen} alt={pizza.titulo} className="modal__pizza-image" />
            </div>
          )}
          <div className={`modal__right ${activeTab === 'resenas' ? 'full-width' : ''}`}>
            <h2 className="modal__pizza-title">{pizza.titulo}</h2>
            {activeTab === 'pedido' && (
              <>
                {isPizza && (
                  <>
                    <div className="modal__option-section">
                      <span className="modal__option-label">Tipo de masa</span>
                      <div className="modal__option-toggle">
                        <button className={`modal__toggle-button ${masa === 'Delgada' ? 'modal__active' : ''}`} onClick={() => handleToggleMasa('Delgada')}>Delgada</button>
                        <button className={`modal__toggle-button ${masa === 'Tradicional' ? 'modal__active' : ''}`} onClick={() => handleToggleMasa('Tradicional')}>Tradicional</button>
                      </div>
                    </div>
                    
                    <div className="modal__option-section">
                      <div className="modal__personalizar-wrapper">
                        <span className="modal__option-label">Personalizar ingredientes</span>
                        <div className="modal__toggle-slider-wrapper">
                          <label className="modal__toggle-slider">
                            <input type="checkbox" checked={personalizarIngredientes} onChange={handleTogglePersonalizar} />
                            <span className="modal__slider"></span>
                          </label>
                          <span className="modal__cambios-counter">{ingredientesSeleccionados}/{maxIngredientes} ingredientes</span>
                        </div>
                      </div>
                      {personalizarIngredientes && (
                        <div className="modal__ingredientes-section">
                          <div className="modal__ingredientes-hint">
                            {ingredientesSeleccionados === maxIngredientes
                              ? "Has alcanzado el máximo de 4 ingredientes"
                              : `Selecciona hasta ${maxIngredientes} ingredientes`}
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
                
                {/* Sección de tamaños - mostrar para todos los productos con opciones/tamaños */}
                {tamanos && tamanos.length > 0 && (
                  <div className="modal__option-section">
                    <span className="modal__option-label">Tamaño</span>
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
                  <span className="modal__pizza-price">
                    {cargandoTamanos ? 'Cargando...' : precioActual}
                  </span>
                  <button className="modal__add-button" onClick={handleAddToOrder}>
                    Añadir a mi orden <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                </div>
              </>
            )}
            {activeTab === 'resenas' && (
              <div className="reseñas__container">
                {/* Encabezado: estrellas y promedio */}
                <div className="reseñas__header">
                  <div className="reseñas__header-stars">
                    {(() => {
                      // Calcular promedio
                      const avg = reseñas.length
                        ? reseñas.reduce((s, r) => s + r.rating, 0) / reseñas.length
                        : 0;
                      // Mostrar estrellas promedio
                      return [1,2,3,4,5].map(star => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className="reseñas__star"
                          style={{
                            color: avg >= star - 0.5 ? "#eab308" : "#d1d5db",
                            fontSize: 22
                          }}
                        />
                      ));
                    })()}
                  </div>
                  <div className="reseñas__header-rating">
                    <span className="reseñas__average">
                      {reseñas.length ? (reseñas.reduce((s, r) => s + r.rating, 0) / reseñas.length).toFixed(1) : "0.0"} de 5
                    </span>
                    <span className="reseñas__count">{reseñas.length} reseñas</span>
                  </div>
                </div>

                {/* Formulario o botón */}
                {mostrarFormularioResena ? (
                  <>
                    <div className="reseñas__form-card">
                      <div className="reseñas__form-title">
                        Escribe tu reseña
                      </div>
                      <div className="reseñas__form-field">
                        <label className="reseñas__form-label">Calificación</label>
                        <div className="reseñas__form-stars">
                          {[1,2,3,4,5].map((star) => (
                            <FontAwesomeIcon
                              key={star}
                              icon={faStar}
                              className={`reseñas__form-star${nuevaResena.rating >= star ? " selected" : ""}`}
                              onClick={() => setNuevaResena({ ...nuevaResena, rating: star })}
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="reseñas__form-field">
                        <label className="reseñas__form-label">Comentario</label>
                        <textarea
                          className="reseñas__form-textarea"
                          placeholder="Comparte tu experiencia con esta pizza..."
                          value={nuevaResena.comentario}
                          onChange={e => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="reseñas__form-actions">
                        <button
                          className="reseñas__form-btn reseñas__form-btn--red"
                          type="button"
                          onClick={handlePublicarResena}
                        >
                          Publicar reseña
                        </button>
                        <button
                          className="reseñas__form-btn"
                          type="button"
                          onClick={() => setMostrarFormularioResena(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </>
                ) : reseñas.length === 0 ? (
                  <>
                    {/* Estado vacío de reseñas */}
                    <div className="reseñas__clientes-titulo">
                      Reseñas de clientes
                    </div>
                    <div className="reseñas__empty">
                      <div className="reseñas__empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" fill="none" viewBox="0 0 58 58" style={{opacity:0.18}}>
                          <circle cx="29" cy="29" r="28" stroke="#414141" strokeWidth="2" fill="none"/>
                          <path d="M19 34c0 1.657 3.134 3 7 3s7-1.343 7-3M23 26a2 2 0 104 0 2 2 0 00-4 0zM31 26a2 2 0 104 0 2 2 0 00-4 0z" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </div>
                      <div className="reseñas__empty-titulo">
                        ¡Sé el primero en reseñar!
                      </div>
                      <div className="reseñas__empty-text">
                        Comparte tu experiencia con esta deliciosa pizza
                      </div>
                      <button className="reseñas__empty-btn" onClick={() => setMostrarFormularioResena(true)}>
                        <FontAwesomeIcon icon={faCommentDots} style={{marginRight: 8}} />
                        Escribir reseña
                      </button>
                    </div>
                  </>
                ) : null}

                {/* Mostrar reseñas ya publicadas */}
                {reseñas.length > 0 && (
                  <div className="reseñas__lista">
                    <div className="reseñas__clientes-titulo">
                      Reseñas de clientes
                    </div>
                    {reseñas.map((resena, i) => (
                      <div key={i} className="reseñas__review">
                        <img
                          src={resena.foto || require('../../assets/perfilfoto.png')}
                          alt={resena.nombre || "Usuario"}
                          className="reseñas__review-foto"
                          style={{
                            width: 55, height: 55, borderRadius: "50%", objectFit: "cover", marginRight: 24, float: "left"
                          }}
                        />
                        <div style={{ marginLeft: 80 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                            {[1,2,3,4,5].map(star => (
                              <FontAwesomeIcon
                                key={star}
                                icon={faStar}
                                className="reseñas__review-star"
                                style={{ color: resena.rating >= star ? "#eab308" : "#d1d5db", fontSize: 24 }}
                              />
                            ))}
                          </div>
                          <div className="reseñas__review-comment" style={{ fontSize: 17, marginBottom: 5 }}>
                            {resena.comentario}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 16, marginTop: 7 }}>{resena.nombre}</div>
                          <div style={{ fontSize: 14, color: "#7c7c7c" }}>{resena.fecha}</div>
                        </div>
                        <div style={{ clear: "both" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaModal;