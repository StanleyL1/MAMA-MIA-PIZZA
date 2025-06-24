import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimesCircle,
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 4000, onClose, category = 'general', position = 'top-right' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 400); // Esperar a que termine la animación
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400);
  };
  const getIcon = () => {
    if (category === 'profile') {
      switch (type) {
        case 'success':
          return faUser;
        case 'error':
          return faTimesCircle;
        default:
          return faUser;
      }
    }

    // Iconos generales
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faTimesCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faCheckCircle;
    }
  };
  const getTitle = () => {
    if (category === 'profile') {
      switch (type) {
        case 'success':
          return 'Perfil actualizado';
        case 'error':
          return 'Error en perfil';
        default:
          return 'Perfil';
      }
    }

    switch (type) {
      case 'success':
        return '¡Éxito!';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return 'Notificación';
    }
  };
  return (
    <div className={`toast toast--${type} toast--${category} toast--${position} ${isVisible ? 'toast--show' : 'toast--hide'}`}>
      <div className="toast__progress-bar" style={{ width: `${progress}%` }}></div>
      <div className="toast__content">
        <div className="toast__icon-wrapper">
          <FontAwesomeIcon icon={getIcon()} className="toast__icon" />
        </div>
        <div className="toast__text">
          <div className="toast__title">{getTitle()}</div>
          <div className="toast__message">{message}</div>
        </div>
        <button className="toast__close" onClick={handleClose} aria-label="Cerrar notificación">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>  );
};

export default Toast;
