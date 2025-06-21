import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faUser, 
  faComment, 
  faSpinner,
  faCheck,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { crearExperiencia } from '../../services/experienciasService';
import './CrearExperiencia.css';

export default function CrearExperiencia({ user, onClose, onExperienciaCreada, setToast }) {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    valoracion: 5
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar cambio de valoración
  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      valoracion: rating
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (formData.titulo.trim().length < 5) {
      newErrors.titulo = 'El título debe tener al menos 5 caracteres';
    }
    
    if (!formData.contenido.trim()) {
      newErrors.contenido = 'El contenido es obligatorio';
    } else if (formData.contenido.trim().length < 20) {
      newErrors.contenido = 'El contenido debe tener al menos 20 caracteres';
    }
    
    if (formData.valoracion < 1 || formData.valoracion > 5) {
      newErrors.valoracion = 'La valoración debe ser entre 1 y 5 estrellas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const experienciaData = {
        titulo: formData.titulo.trim(),
        contenido: formData.contenido.trim(),
        valoracion: formData.valoracion,
        id_usuario: user.id
      };
      
      const result = await crearExperiencia(experienciaData);
      
      if (setToast) {
        setToast({
          message: '¡Experiencia enviada exitosamente! Será revisada antes de ser publicada.',
          type: 'success'
        });
      }
      
      if (onExperienciaCreada) {
        onExperienciaCreada(result);
      }
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        contenido: '',
        valoracion: 5
      });
      
      // Cerrar modal después de un breve delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error al crear experiencia:', error);
      
      if (setToast) {
        setToast({
          message: 'Error al enviar la experiencia. Por favor, inténtalo de nuevo.',
          type: 'error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar estrellas para la valoración
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`crear-experiencia__star ${i <= formData.valoracion ? 'active' : ''}`}
          onClick={() => handleRatingChange(i)}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faStar} />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="crear-experiencia">
      <div className="crear-experiencia__header">
        <h2 className="crear-experiencia__title">
          <FontAwesomeIcon icon={faComment} className="crear-experiencia__icon" />
          Compartir tu Experiencia
        </h2>
        <button 
          className="crear-experiencia__close"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="crear-experiencia__user">
        <FontAwesomeIcon icon={faUser} className="crear-experiencia__user-icon" />
        <span className="crear-experiencia__user-name">
          {user?.nombre || user?.email || 'Usuario'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="crear-experiencia__form">
        {/* Título */}
        <div className="crear-experiencia__field">
          <label htmlFor="titulo" className="crear-experiencia__label">
            Título de tu experiencia
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            className={`crear-experiencia__input ${errors.titulo ? 'error' : ''}`}
            placeholder="Ej: Excelente experiencia en familia"
            disabled={isSubmitting}
            maxLength={100}
          />
          {errors.titulo && (
            <span className="crear-experiencia__error">{errors.titulo}</span>
          )}
        </div>

        {/* Valoración */}
        <div className="crear-experiencia__field">
          <label className="crear-experiencia__label">
            ¿Cómo calificarías tu experiencia?
          </label>
          <div className="crear-experiencia__rating">
            {renderStars()}
            <span className="crear-experiencia__rating-text">
              {formData.valoracion} de 5 estrellas
            </span>
          </div>
          {errors.valoracion && (
            <span className="crear-experiencia__error">{errors.valoracion}</span>
          )}
        </div>

        {/* Contenido */}
        <div className="crear-experiencia__field">
          <label htmlFor="contenido" className="crear-experiencia__label">
            Cuéntanos sobre tu experiencia
          </label>
          <textarea
            id="contenido"
            name="contenido"
            value={formData.contenido}
            onChange={handleInputChange}
            className={`crear-experiencia__textarea ${errors.contenido ? 'error' : ''}`}
            placeholder="Describe tu experiencia con nosotros. ¿Qué fue lo que más te gustó? ¿Cómo fue el servicio?"
            disabled={isSubmitting}
            rows={5}
            maxLength={500}
          />
          <div className="crear-experiencia__char-count">
            {formData.contenido.length}/500 caracteres
          </div>
          {errors.contenido && (
            <span className="crear-experiencia__error">{errors.contenido}</span>
          )}
        </div>

        {/* Botones */}
        <div className="crear-experiencia__actions">
          <button
            type="button"
            className="crear-experiencia__btn crear-experiencia__btn--cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="crear-experiencia__btn crear-experiencia__btn--submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Enviando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                Compartir Experiencia
              </>
            )}
          </button>
        </div>
      </form>

      <div className="crear-experiencia__note">
        <p>
          <strong>Nota:</strong> Tu experiencia será revisada por nuestro equipo antes de ser publicada.
          Esto nos ayuda a mantener la calidad y autenticidad de todas las experiencias compartidas.
        </p>
      </div>
    </div>
  );
}
