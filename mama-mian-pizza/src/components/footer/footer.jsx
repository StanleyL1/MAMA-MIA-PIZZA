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
      )}      <div className="final-footer-bottom">
        <p className="final-footer-rights">© todos los derechos reservados 2025</p>
        <div className="final-footer-social">
          <a href="/equipo-desarrollo" className="footer-team-link">Equipo de desarrollo</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
