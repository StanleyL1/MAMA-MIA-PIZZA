import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt
} from "@fortawesome/free-solid-svg-icons";

import './Perfil.css';
import InformacionUsuario from './InformacionUsuario';
import HistorialPedidos from './HistorialPedidos';
import PerfilUsuario from './PerfilUsuario';

export default function Perfil({ onAddToCart, user, setToast, onOrderUpdate, updateUser }) {
  const navigate = useNavigate();
    // Tabs: pedidos | reseñas | editar | seguridad
  const [activeTab, setActiveTab] = useState('pedidos');
  
  const [profileMessage, setProfileMessage] = useState(''); // Mensaje local para mostrar abajo de la foto
  const [profileMessageType, setProfileMessageType] = useState('success'); // 'success' o 'error'
  
  // Función helper para mostrar mensajes locales
  const showProfileMessage = (message, type = 'success') => {
    setProfileMessage(message);
    setProfileMessageType(type);
    setTimeout(() => setProfileMessage(''), 3000);
  };

  // Redirigir al login si no hay usuario logueado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Si no hay usuario, no renderizar nada (se está redirigiendo)
  if (!user) {
    return null;
  }

  return (
    <div className="perfil__main">      {/* CARD DE PERFIL */}
      <InformacionUsuario 
        user={user}
        profileMessage={profileMessage}
        profileMessageType={profileMessageType}
      />

      {/* TABS */}
      <div className="perfil__tabs">
        <button className={`perfil__tab-btn${activeTab === 'pedidos' ? ' active' : ''}`} onClick={() => setActiveTab('pedidos')}>
          <FontAwesomeIcon icon={faUser} /> <span className="perfil__tab-text">Mis Pedidos</span>
        </button>        
        <button className={`perfil__tab-btn${activeTab === 'reseñas' ? ' active' : ''}`} onClick={() => setActiveTab('reseñas')}>
          <FontAwesomeIcon icon={faHeart} /> <span className="perfil__tab-text">Mis reseñas</span>
        </button>        
        <button className={`perfil__tab-btn${activeTab === 'editar' ? ' active' : ''}`} onClick={() => setActiveTab('editar')}>
          <FontAwesomeIcon icon={faEdit} /> <span className="perfil__tab-text">Perfil</span>
        </button>
        <button className={`perfil__tab-btn${activeTab === 'seguridad' ? ' active' : ''}`} onClick={() => setActiveTab('seguridad')}>
          <FontAwesomeIcon icon={faShieldAlt} /> <span className="perfil__tab-text">Seguridad</span>
        </button>
      </div>

      {/* CONTENIDO SEGÚN TAB */}
      <div className="perfil__contenido">
        {/* --- HISTORIAL DE PEDIDOS --- */}
        {activeTab === 'pedidos' && (
          <HistorialPedidos
            user={user}
            setToast={setToast}
            onOrderUpdate={onOrderUpdate}
          />
        )}

        {/* --- MIS RESEÑAS --- */}
        {activeTab === 'reseñas' && (
          <div className="perfil__reseñas-section">
            <div className="perfil__form-title">Mis Reseñas</div>
            <div className="perfil__empty">
              <FontAwesomeIcon icon={faHeart} />
              <h3>No has dejado reseñas aún</h3>
              <p>¡Comparte tu experiencia después de tu próximo pedido!</p>
              <button 
                className="perfil__empty-btn"
                onClick={() => navigate('/menu')}
              >
                Ver Menú
              </button>
            </div>
          </div>
        )}

        {/* --- EDITAR PERFIL Y SEGURIDAD --- */}
        {(activeTab === 'editar' || activeTab === 'seguridad') && (
          <PerfilUsuario
            user={user}
            updateUser={updateUser}
            setToast={setToast}
            showProfileMessage={showProfileMessage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}

