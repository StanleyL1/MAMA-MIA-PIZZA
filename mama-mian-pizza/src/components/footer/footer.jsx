import React from 'react';
import './footer.css';
import bannerVideo from '../../assets/banner final.mp4'; // Ruta del video de fondo del banner final

const Footer = ({ noImage }) => {
  return (    <footer className="final-footer-section">
      {!noImage && (
        <div className="final-footer-background">
          <video
            className="final-footer-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
          >
            <source src={bannerVideo} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
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
            <a href="/informacion-legal#acerca-de-nosotros">Acerca de Nosotros</a>
            <a href="/informacion-legal#preguntas-frecuentes">Preguntas Frecuentes</a>
            <a href="/informacion-legal#garantias-retornos">Garantías y Retornos</a>
            <a href="/equipo-desarrollo">Equipo de desarrollo</a>
          </div>
          
          <div className="footer-links-column">
            <h4>Políticas</h4>
            <a href="/informacion-legal#politica-envios">Política de Envíos</a>
            <a href="/informacion-legal#politicas-privacidad">Políticas de Privacidad</a>
            <a href="/informacion-legal#terminos-condiciones">Términos y Condiciones</a>
          </div>
          
          <div className="footer-links-column">
            <h4>Compras</h4>
            <a href="/informacion-legal#cancelacion-compra">Cancelación de Compra</a>
            <a href="/informacion-legal#formas-pago">Formas de Pago</a>
            <a href="/informacion-legal#derecho-retracto">Derecho a Retracto</a>
          </div>
          
          <div className="footer-links-column">
            <h4>Legal</h4>
            <a href="/informacion-legal#politica-cookies">Política de Cookies</a>
            <a href="/informacion-legal#reversion-pago">Reversión de Pago</a>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="footer-separator"></div>

      <div className="final-footer-bottom">
        <p className="final-footer-rights">© todos los derechos reservados 2025</p>
      </div>
    </footer>
  );
};

export default Footer;