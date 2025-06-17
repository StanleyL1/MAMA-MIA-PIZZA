import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Esperar a que termine la animación
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--show' : 'toast--hide'}`}>
      <div className="toast__content">
        <div className="toast__icon">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
        </div>
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
