import React, { useState, useEffect } from 'react';
import './Cart.css';
import PizzaIcon from '../../assets/PizzaR.png';
import trashIcon from '../../assets/Basurero.png';
import defaultPizza from '../../assets/PizzaCard.png';
import { useNavigate } from 'react-router-dom';

// Datos iniciales de ejemplo para el carrito (agrega la propiedad "disponible")
const initialCartItems = [
  {
    id: 1,
    nombre: 'Burrata',
    descripcion: 'Mozzarella, cebolla caramelizada, queso burrata, jamón, rúgula y vinagre balsámico',
    precio: 5.0,
    cantidad: 2,
    imagen: defaultPizza,
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Burrata',
    descripcion: 'Mozzarella, cebolla caramelizada, queso burrata, jamón, rúgula y vinagre balsámico',
    precio: 5.0,
    cantidad: 2,
    imagen: defaultPizza,
    disponible: true, // Simulamos que este producto no está disponible
  }
];

const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(
    initialCartItems);
  const [animateTotal, setAnimateTotal] = useState(false);

  // Calcula el total solo de los productos disponibles
  const total = cartItems.reduce((acc, item) => {
    return item.disponible !== false
      ? acc + item.precio * item.cantidad
      : acc;
  }, 0);

  // Cada vez que cambie el total, activa la animación
  useEffect(() => {
    setAnimateTotal(true);
    const timer = setTimeout(() => setAnimateTotal(false), 300);
    return () => clearTimeout(timer);
  }, [total]);

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
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={handleSeguirNavegando}
      />

      {/* Panel lateral */}
      <div className={`cart-panel ${isOpen ? 'open' : ''}`}>
        {/* Encabezado con la imagen PizzaR.png en lugar del emoji */}
        <div className="cart-header">
          <h2>
            Tu orden <img src={PizzaIcon} alt="Pizza Icon" className="cart-header-icon" />
          </h2>
        </div>

        {/* Lista de productos */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.imagen}
                alt={item.nombre}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                {item.disponible !== false ? (
                  <>
                    {/* Línea 1: nombre y precio */}
                    <div className="cart-item-line1">
                      <h4 className="cart-item-name">{item.nombre}</h4>
                      <span className="cart-item-price">
                        ${item.precio.toFixed(2)}
                      </span>
                    </div>
                    {/* Línea 2: descripción */}
                    <p className="cart-item-desc">{item.descripcion}</p>
                    {/* Línea 3: cantidad y botón eliminar */}
                    <div className="cart-item-line2">
                      <div className="cart-item-quantity">
                        <button onClick={() => handleDecrement(item.id)}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => handleIncrement(item.id)}>+</button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => handleRemove(item.id)}
                      >
                        <img
                          src={trashIcon}
                          alt="Eliminar"
                          className="trash-icon"
                        />
                        Eliminar
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="cart-item-error">Producto no disponible</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: total y botones */}
        <div className="cart-footer">
          <div className={`cart-total ${animateTotal ? 'animate' : ''}`}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className={`checkout-button ${cartItems.length === 0 ? 'disabled' : ''}`}
            onClick={handleContinuarPago}
            disabled={cartItems.length === 0}
            
          >
            Continuar con el pago
          </button>
          <button className="seguir-button" onClick={handleSeguirNavegando}>
            Seguir navegando
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
