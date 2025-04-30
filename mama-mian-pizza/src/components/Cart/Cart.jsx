import React, { useEffect } from 'react';
import './Cart.css';
import PizzaIcon from '../../assets/PizzaR.png';
import trashIcon from '../../assets/Basurero.png';
import { useNavigate } from 'react-router-dom';

const Cart = ({ isOpen, onClose, cartItems, setCartItems }) => {
  // Evitar scroll de fondo cuando el carrito está abierto
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const navigate = useNavigate();
  const [animateTotal, setAnimateTotal] = React.useState(false);
  const [newItemId, setNewItemId] = React.useState(null);

  // Calcula el total solo de los productos disponibles
  const total = cartItems.reduce((acc, item) => {
    return item.disponible !== false
      ? acc + item.precio * item.cantidad
      : acc;
  }, 0);

  // Cada vez que cambie el total, activa la animación
  React.useEffect(() => {
    setAnimateTotal(true);
    const timer = setTimeout(() => setAnimateTotal(false), 300);
    return () => clearTimeout(timer);
  }, [total]);

  // Detectar cuando se añade un nuevo producto al carrito
  React.useEffect(() => {
    if (cartItems.length > 0) {
      const lastItem = cartItems[cartItems.length - 1];
      setNewItemId(lastItem.id);
      
      // Quitar la animación después de 1.5 segundos
      const timer = setTimeout(() => {
        setNewItemId(null);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [cartItems.length]);

  // Manejo de cantidad
  const handleRemove = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const handleIncrement = (id) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems((current) =>
      current.map((item) => {
        if (item.id === id && item.cantidad > 1) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      })
    );
  };

  const handleContinuarPago = () => {
    if (cartItems.length === 0) return;
    navigate('/pideahora');
  };

  const handleSeguirNavegando = () => {
    onClose && onClose();
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className={`cart__overlay ${isOpen ? 'cart__open' : ''}`}
        onClick={handleSeguirNavegando}
      />

      {/* Panel lateral */}
      <div className={`cart__panel ${isOpen ? 'cart__open' : ''}`}>
        {/* Encabezado con la imagen PizzaR.png en lugar del emoji */}
        <div className="cart__header">
          <h2>
            Tu orden <img src={PizzaIcon} alt="Pizza Icon" className="cart-header-icon" />
          </h2>
        </div>

        {/* Lista de productos */}
        <div className="cart__items">
          {cartItems.length === 0 ? (
            <div className="cart__empty">
              <p>Tu carrito está vacío</p>
              <small>Añade productos para continuar con tu compra</small>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className={`cart__item ${item.id === newItemId ? 'cart__item-new' : ''}`}
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="cart__item-image"
                />
                <div className="cart__item-details">
                  {item.disponible !== false ? (
                    <>
                      {/* Línea 1: nombre y precio */}
                      <div className="cart__item-line1">
                        <h4 className="cart-item-name">{item.nombre}</h4>
                        <span className="cart-item-price">
                          ${item.precio.toFixed(2)}
                        </span>
                      </div>
                      {/* Línea 2: descripción */}
                      <p className="cart__item-desc">{item.descripcion}</p>
                      {/* Línea 3: cantidad y botón eliminar */}
                      <div className="cart__item-line2">
                        <div className="cart-item-quantity">
                          <button onClick={() => handleDecrement(item.id)}>-</button>
                          <span>{item.cantidad}</span>
                          <button onClick={() => handleIncrement(item.id)}>+</button>
                        </div>
                        <button
                          className="cart__item-remove"
                          onClick={() => handleRemove(item.id)}
                        >
                          <img
                            src={trashIcon}
                            alt="Eliminar"
                            className="cart__trash-icon"
                          />
                          Eliminar
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="cart__item-error">Producto no disponible</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: total y botones */}
        <div className="cart__footer">
          <div className={`cart__total ${animateTotal ? 'cart__animate' : ''}`}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className={`cart__checkout-button ${cartItems.length === 0 ? 'disabled' : ''}`}
            onClick={handleContinuarPago}
            disabled={cartItems.length === 0}
          >
            Continuar con el pago
          </button>
          <button className="cart__seguir-button" onClick={handleSeguirNavegando}>
            Seguir navegando
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
