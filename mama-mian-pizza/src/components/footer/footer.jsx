import React from 'react';
import './footer.css';
import footerImage from '../../assets/footer.png'; 
import faceIcon from '../../assets/face.png';
import instaIcon from '../../assets/insta.png';

const Footer = () => {
  return (
    <footer className="final-footer-section">
      <div
        className="final-footer-background"
        style={{ backgroundImage: `url(${footerImage})` }}
      >
        <div className="final-footer-overlay">
          <div className="final-footer-text-box final-footer-text-left">
            Del horno a tu paladar, Mamá Mian te invita a disfrutar
          </div>
          <div className="final-footer-text-box final-footer-text-right">
            Ven y adquiere la tuyaa ya!!!
          </div>
        </div>
      </div>

      <div className="final-footer-bottom">
  <p className="final-footer-rights">© todos los derechos reservados 2025</p>
  <div className="final-footer-social">
    <img src={faceIcon} alt="Facebook" className="final-footer-icon" />
    <img src={instaIcon} alt="Instagram" className="final-footer-icon" />
  </div>
</div>
    </footer>
  );
};

export default Footer;
