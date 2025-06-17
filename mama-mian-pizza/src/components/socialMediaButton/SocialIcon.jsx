// SocialIcon.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebookMessenger, faInstagram } from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';

export default function SocialIcon({ platform, index, total, isOpen }) {
  const getIcon = () => {
    switch (platform.name) {
      case 'whatsapp':
        return <FontAwesomeIcon icon={faWhatsapp} size="lg" color="white" />;
      case 'messenger':
        return <FontAwesomeIcon icon={faFacebookMessenger} size="lg" color="white" />;
      case 'instagram':
        return <FontAwesomeIcon icon={faInstagram} size="lg" color="white" />;
      default:
        return null;
    }
  };

  return (
    <a
      href={platform.url}
      className="social-icon"
      style={{
        backgroundColor: platform.color,
        transitionDelay: isOpen ? `${index * 0.1}s` : '0s', // Delay escalonado para animación
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
