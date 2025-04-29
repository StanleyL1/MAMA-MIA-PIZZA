// SocialIcon.jsx
import React from 'react';
import { MessageCircle, Instagram, Send, Video } from 'lucide-react';
import PropTypes from 'prop-types';

export default function SocialIcon({ platform, index, total, isOpen }) {
  const getIconStyles = () => {
    if (!isOpen) return {};

    const angle = Math.PI / 2;            // 90°
    const arcStartAngle = Math.PI / 4;    // 45°
    const itemAngle = arcStartAngle + (angle * index) / (total - 1);
    const radius = 100; // increased radius to add more space between icons
    const x = Math.cos(itemAngle) * radius;
    const y = -Math.sin(itemAngle) * radius;

    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };

  const getIcon = () => {
    switch (platform.name) {
      case 'whatsapp':
        return <MessageCircle size={20} />;
      case 'messenger':
        return <Send size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'tiktok':
        return <Video size={20} />;
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
