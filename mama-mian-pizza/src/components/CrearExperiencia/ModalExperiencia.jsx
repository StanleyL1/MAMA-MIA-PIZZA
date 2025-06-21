import React from 'react';
import CrearExperiencia from './CrearExperiencia';
import './ModalExperiencia.css';

export default function ModalExperiencia({ 
  isOpen, 
  onClose, 
  user, 
  onExperienciaCreada, 
  setToast 
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-experiencia" onClick={handleBackdropClick}>
      <div className="modal-experiencia__content">
        <CrearExperiencia 
          user={user}
          onClose={onClose}
          onExperienciaCreada={onExperienciaCreada}
          setToast={setToast}
        />
      </div>
    </div>
  );
}
