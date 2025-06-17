import React, { useState } from 'react';
import { MessageSquareMore, X } from 'lucide-react';
import SocialIcon from './SocialIcon';
import './SocialMediaButton.css';

const socialPlatforms = [
  {
    name: 'messenger',
    color: '#0078FF',
    url: 'https://www.facebook.com/contrera05',
  },
  {
    name: 'instagram',
    color: '#E1306C',
    url: 'https://www.instagram.com/mamamianpizza2020/',
  },
  {
    name: 'whatsapp',
    color: '#25D366',
    url: 'https://api.whatsapp.com/send?phone=%2B50372928039&context=AfcmoFWxRioLE0peyRdiI58rm6GXMJqEvQwrJUiSV_NuYHmFh8T2tKURT2igaVics5wlqz1Q4wnIVQNegdGDKWeG7XhVXJZfhqoZH6_F8mwE1RYa1YAJnbAzTvsxVmC2HewHfsaEAtl7OpvF11gOoUDnbw&source=FB_Page&app=facebook&entry_point=page_cta&fbclid=IwY2xjawK92wpleHRuA2FlbQIxMABicmlkETFFZFRncTVUMGQ1Wjd1bDdiAR6-iy0em-jCsP-_dTP38sZkGL1C9ojlk1URhGMHwN_7eIt1Y9_Hw92Z9GoJ0w_aem_vDzE54p583hDCbMUdGQ_0Q',
  },
];

export default function SocialMediaButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
