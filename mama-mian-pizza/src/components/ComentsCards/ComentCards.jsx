import './ComentCards.css';

// Importa tus imágenes de estrellas y avatar
import estrellaCom from '../../assets/EstrellaCom.png';
import estrellaMedia from '../../assets/EstrellaMedia.png';
import comentarioImg from '../../assets/comentario.png';

function TestimonialCard({ data: { name, avatar, time, comment } }) {
  return (
    <div className="testimonial-card">
      {/* Encabezado con foto, nombre y tiempo */}
      <div className="testimonial-header">
        <img 
          src={avatar || comentarioImg} 
          alt={name} 
          className="testimonial-avatar" 
        />
        <div className="testimonial-user-info">
          <h3 className="testimonial-name">{name}</h3>
          <p className="testimonial-time">{time}</p>
        </div>
      </div>

      {/* Sección de estrellas (ejemplo: 4 completas, 1 media) */}
      <div className="testimonial-stars">
        <img src={estrellaCom} alt="Estrella completa" className="testimonial-star-icon" />
        <img src={estrellaCom} alt="Estrella completa" className="testimonial-star-icon" />
        <img src={estrellaCom} alt="Estrella completa" className="testimonial-star-icon" />
        <img src={estrellaCom} alt="Estrella completa" className="testimonial-star-icon" />
        <img src={estrellaMedia} alt="Estrella media" className="testimonial-star-icon" />
      </div>

      {/* Texto del testimonio */}
      <p className="testimonial-text">{comment}</p>
    </div>
  );
}

export default TestimonialCard;
