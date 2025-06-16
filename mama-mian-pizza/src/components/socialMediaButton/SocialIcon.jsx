// SocialIcon.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebookMessenger, faInstagram } from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';

export default function SocialIcon({ platform, index, total, isOpen }) {  const getIconStyles = () => {
    if (!isOpen) return {};

    // Posicionamiento vertical (de arriba hacia abajo)
    const spacing = 60; // Espaciado entre íconos
    const y = -(spacing * (index + 1)); // Negativo para ir hacia arriba
    const x = 0; // Sin desplazamiento horizontal

    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };
  const getIcon = () => {
    switch (platform.name) {
      case 'whatsapp':
        return <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '20px', color: 'white' }} />;
      case 'messenger':
        return <FontAwesomeIcon icon={faFacebookMessenger} style={{ fontSize: '20px', color: 'white' }} />;
      case 'instagram':
        return <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '20px', color: 'white' }} />;
      default:
        return null;
    }
  };

  return (
    <a
      href={platform.url}
      className="social-icon"
      style={{
        ...getIconStyles(),
        backgroundColor: platform.color,
        transitionDelay: isOpen ? `${index * 0.05}s` : '0s',
      }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visítanos en ${platform.name}`}
    >
      {getIcon()}
    </a>
  );
}

SocialIcon.propTypes = {
  platform: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
