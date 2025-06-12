import React from 'react';
import './footer.css';
import footerImage from '../../assets/footer.png'; // Ruta de la imagen de fondo

const Footer = ({ noImage }) => {
  return (
    <footer className="final-footer-section">
      {!noImage && (
        <div
          className="final-footer-background"
          style={{ backgroundImage: `url(${footerImage})` }}
        >
          <div className="final-footer-overlay">
            <div className="final-footer-text-box final-footer-text-left">
              Del horno a tu paladar, Mamá Mian te invita a disfrutar
            </div>
          </div>
        </div>
      )}
      
      {/* Nueva sección de enlaces legales y políticas */}
      <div className="final-footer-links">
        <div className="footer-links-grid">
          <div className="footer-links-column">
            <h4>Información</h4>
            <a href="/informacion-legal">Acerca de Nosotros</a>
            <a href="/informacion-legal">Preguntas Frecuentes</a>
            <a href="/informacion-legal">Garantías y Retornos</a>
          </div>
          
          <div className="footer-links-column">
            <h4>Políticas</h4>
            <a href="/informacion-legal">Política de Envíos</a>
            <a href="/informacion-legal">Políticas de Privacidad</a>
            <a href="/informacion-legal">Términos y Condiciones</a>
          </div>
          
          <div className="footer-links-column">
            <h4>Compras</h4>
            <a href="/informacion-legal">Cancelación de Compra</a>
            <a href="/informacion-legal">Formas de Pago</a>
            <a href="/informacion-legal">Derecho a Retracto</a>
          </div>
          
          <div className="footer-links-column">
            <h4>Legal</h4>
            <a href="/informacion-legal">Política de Cookies</a>
            <a href="/informacion-legal">Reversión de Pago</a>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="footer-separator"></div>

      <div className="final-footer-bottom">
        <p className="final-footer-rights">© todos los derechos reservados 2025</p>
        <div className="final-footer-social">
          <a href="/equipo-desarrollo" className="footer-team-link">Equipo de desarrollo</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;