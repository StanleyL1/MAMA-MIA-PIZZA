import React, { useState } from 'react';
import { MessageSquareMore, X } from 'lucide-react';
import SocialIcon from './SocialIcon';
import './SocialMediaButton.css';

const socialPlatforms = [
  {
    name: 'whatsapp',
    color: '#25D366',
    url: 'https://whatsapp.com/',
  },
  {
    name: 'messenger',
    color: '#0078FF',
    url: 'https://messenger.com/',
  },
  {
    name: 'instagram',
    color: '#E1306C',
    url: 'https://instagram.com/',
  },
];

export default function SocialMediaButton() {
  const [isOpen, setIsOpen] = useState(false);
  // Removido el estado isVisible para mantener el botón siempre visible

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Removido el useEffect del scroll para mantener el botón siempre visible

  return (
    <div className="social-media-container">
      <div className={`social-media-button ${isOpen ? 'active' : ''}`}>
        <button
          className="toggle-button"
          onClick={toggleMenu}
          aria-label={isOpen ? "Cerrar menú de redes sociales" : "Abrir menú de redes sociales"}
        >
          {isOpen ? (
            <X size={24} strokeWidth={2} />
          ) : (
            <MessageSquareMore size={24} strokeWidth={2} />
          )}
        </button>

        <div className="social-icons-container">
          {socialPlatforms.map((platform, index) => (
            <SocialIcon
              key={platform.name}
              platform={platform}
              index={index}
              total={socialPlatforms.length}
              isOpen={isOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
