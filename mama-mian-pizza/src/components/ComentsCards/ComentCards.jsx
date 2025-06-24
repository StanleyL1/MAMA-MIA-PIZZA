import './ComentCards.css';

// Importa tus imágenes de estrellas y avatar
import estrellaCom from '../../assets/EstrellaCom.png';
import estrellaMedia from '../../assets/EstrellaMedia.png';
import comentarioImg from '../../assets/comentario.png';

function TestimonialCard({ data: { name, avatar, time, comment, rating, titulo, experienciaFoto } }) {
  // Función para renderizar las estrellas según la valoración
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <img 
          key={`full-${i}`} 
          src={estrellaCom} 
          alt="Estrella completa" 
          className="testimonial-star-icon" 
        />
      );
    }
    
    // Estrella media si es necesaria
    if (hasHalfStar) {
      stars.push(
        <img 
          key="half" 
          src={estrellaMedia} 
          alt="Estrella media" 
          className="testimonial-star-icon" 
        />
      );
    }
    
    // Estrellas vacías para completar 5
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span 
          key={`empty-${i}`} 
          className="testimonial-star-empty"
        >
          ☆
        </span>
      );
    }
    
    return stars;
  };
  return (
    <div className="testimonial-card">
      {/* Encabezado con foto, nombre y tiempo */}
      <div className="testimonial-header">
        <img 
          src={avatar || comentarioImg} 
          alt={name} 
          className="testimonial-avatar"
          onError={(e) => { e.target.src = comentarioImg; }}
        />
        <div className="testimonial-user-info">
          <h3 className="testimonial-name">{name}</h3>
          <p className="testimonial-time">{time}</p>
        </div>
      </div>      {/* Sección de estrellas dinámicas */}
      <div className="testimonial-stars">
        {renderStars(rating || 5)}
        <span className="testimonial-rating-number">({rating}/5)</span>
      </div>      {/* Título de la experiencia si existe */}
      {titulo && (
        <h4 className="testimonial-title">{titulo}</h4>
      )}

      {/* Texto del testimonio */}
      <p className="testimonial-text">{comment}</p>

      {/* Foto de la experiencia si existe */}
      {experienciaFoto && (
        <div className="testimonial-photo-container">
          <img 
            src={experienciaFoto}
            alt={`Foto de la experiencia: ${titulo || 'experiencia'}`}
            className="testimonial-experience-photo"
            onError={(e) => {
              console.log('Error cargando foto de experiencia, ocultando...');
              e.target.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TestimonialCard;
