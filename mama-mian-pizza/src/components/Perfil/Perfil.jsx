import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHeart, faUser, faEdit, faShieldAlt, faCamera,
  faArrowLeft, faPhone, faEnvelope, faEye, faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

import perfilFoto from '../../assets/perfilfoto.png'; // Ajusta la ruta si tu foto está en otro lado
import './Perfil.css';

// Mock de pedidos
const pedidosMock = [
  {
    id: 1,
    fecha: '2024-01-15',
    productos: ['Pizza Suprema', 'Pizza Margherita'],
    total: 15,
    estado: 'Entregado',
  },
  {
    id: 2,
    fecha: '2024-01-10',
    productos: ['Pizza Pepperoni'],
    total: 9,
    estado: 'Entregado',
  },
];

// Mock de favoritos
const favoritos = [
  {
    id: 1,
    nombre: "Pizza Suprema",
    precio: 8.00,
    imagen: require('../../assets/PizzaCard.png'),
  },
  {
    id: 2,
    nombre: "Pizza Margherita",
    precio: 7.00,
    imagen: require('../../assets/PizzaCard.png'),
  },
];

export default function Perfil({ onAddToCart }) {
  // Tabs: pedidos | favoritos | editar | seguridad
  const [activeTab, setActiveTab] = useState('pedidos');
  const [showCambiarContra, setShowCambiarContra] = useState(false);

  // Estado de perfil del usuario
  const [userPerfil, setUserPerfil] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+503 7123-4567',
    foto: perfilFoto,
    pedidos: 12,
    favoritos: 2,
    miembroDesde: 2023,
  });

  // Formulario de edición
  const [formData, setFormData] = useState({
    nombre: userPerfil.nombre,
    email: userPerfil.email,
    telefono: userPerfil.telefono,
  });
  const [editSuccess, setEditSuccess] = useState(false);

  // Sincroniza los datos del formulario cuando el tab o usuario cambian
  useEffect(() => {
    if (activeTab === 'editar') {
      setFormData({
        nombre: userPerfil.nombre,
        email: userPerfil.email,
        telefono: userPerfil.telefono,
      });
    }
  }, [activeTab, userPerfil]);

  return (
    <div className="perfil__main">
      {/* CARD DE PERFIL */}
      <div className="perfil__card">
        <div className="perfil__foto-wrapper">
          <img src={userPerfil.foto} alt="Perfil" className="perfil__foto" />
          <div className="perfil__foto-edit">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
        <div className="perfil__info">
          <div className="perfil__nombre">{userPerfil.nombre}</div>
          <div className="perfil__email">{userPerfil.email}</div>
          <div className="perfil__datos">
            <span>
              <FontAwesomeIcon icon={faUser} /> {userPerfil.pedidos} pedidos realizados
            </span>
            <span>
              <FontAwesomeIcon icon={faHeart} style={{ color: '#ab1319' }} /> {userPerfil.favoritos} pizzas favoritas
            </span>
            <span>
              <FontAwesomeIcon icon={faUser} /> Miembro desde {userPerfil.miembroDesde}
            </span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="perfil__tabs">
        <button className={`perfil__tab-btn${activeTab === 'pedidos' ? ' active' : ''}`} onClick={() => setActiveTab('pedidos')}>
          <FontAwesomeIcon icon={faUser} /> Mis Pedidos
        </button>
        <button className={`perfil__tab-btn${activeTab === 'favoritos' ? ' active' : ''}`} onClick={() => setActiveTab('favoritos')}>
          <FontAwesomeIcon icon={faHeart} /> Favoritos
        </button>
        <button className={`perfil__tab-btn${activeTab === 'editar' ? ' active' : ''}`} onClick={() => setActiveTab('editar')}>
          <FontAwesomeIcon icon={faEdit} /> Editar Perfil
        </button>
        <button className={`perfil__tab-btn${activeTab === 'seguridad' ? ' active' : ''}`} onClick={() => setActiveTab('seguridad')}>
          <FontAwesomeIcon icon={faShieldAlt} /> Seguridad
        </button>
      </div>

      {/* CONTENIDO SEGÚN TAB */}
      <div className="perfil__contenido">
        {/* --- HISTORIAL DE PEDIDOS --- */}
        {activeTab === 'pedidos' && (
          <>
            <div className="perfil__titulo-historial">Historial de Pedidos</div>
            {pedidosMock.map(p => (
              <div className="perfil__pedido-card" key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="perfil__pedido-id">Pedido #{p.id}</span>
                    <span className="perfil__estado-entregado">Entregado</span>
                  </div>
                  <div className="perfil__pedido-total">${p.total.toFixed(2)}</div>
                </div>
                <div className="perfil__pedido-fecha">{p.fecha}</div>
                <div>{p.productos.join(', ')}</div>
                <button className="perfil__pedido-detalles-btn">Ver detalles</button>
              </div>
            ))}
          </>
        )}

        {/* --- FAVORITOS --- */}
        {activeTab === 'favoritos' && (
          <div>
            <div className="perfil__titulo-favoritos">Pizzas Favoritas</div>
            <div className="perfil__favoritos-grid">
              {favoritos.map(pizza => (
                <div className="perfil__favorito-card" key={pizza.id}>
                  <img src={pizza.imagen} alt={pizza.nombre} className="perfil__favorito-img" />
                  <div className="perfil__favorito-nombre">{pizza.nombre}</div>
                  <div className="perfil__favorito-precio">${pizza.precio.toFixed(2)}</div>
                  <button
                    className="perfil__favorito-btn"
                    onClick={() => onAddToCart(pizza)}
                  >
                    Ordenar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- EDITAR PERFIL --- */}
        {activeTab === 'editar' && (
          <div>
            <div className="perfil__titulo-editar">Editar Perfil</div>
            <form
              className="perfil__form-editar"
              onSubmit={e => {
                e.preventDefault();
                setUserPerfil(prev => ({
                  ...prev,
                  nombre: formData.nombre,
                  email: formData.email,
                  telefono: formData.telefono,
                }));
                setEditSuccess(true);
                setTimeout(() => setEditSuccess(false), 2000);
              }}
            >
              <div className="perfil__form-row">
                <div className="perfil__form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="perfil__form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="perfil__form-row">
                <div className="perfil__form-group" style={{ width: '100%' }}>
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+503 7123-4567"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="perfil__guardar-btn">
                Guardar cambios
              </button>
              {editSuccess && (
                <div className="perfil__edit-success">¡Perfil actualizado correctamente!</div>
              )}
            </form>
          </div>
        )}

        {/* --- SEGURIDAD --- */}
        {activeTab === 'seguridad' && (
          <div>
            <div className="perfil__titulo-seguridad">Configuración de Seguridad</div>
            {/* Contraseña */}
            <div className="perfil__security-card">
              <div className="perfil__security-title">
                <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 7, color: "#a81818" }} />
                Contraseña
              </div>
              <div className="perfil__security-desc">
                Mantén tu cuenta segura con una contraseña fuerte
              </div>
              <button className="perfil__security-btn" onClick={() => setShowCambiarContra(true)}>
                Cambiar contraseña
              </button>
            </div>
            {/* Información de contacto */}
            <div className="perfil__contacto-titulo">
              Información de contacto
            </div>
            <div className="perfil__contacto-cards">
              <div className="perfil__contacto-card">
                <div className="perfil__contacto-row">
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: 10, color: "#a81818" }} />
                  <div>
                    <div className="perfil__contacto-label">Teléfono</div>
                    <div className="perfil__contacto-value">{userPerfil.telefono}</div>
                  </div>
                  <button className="perfil__verificar-btn">Verificar</button>
                </div>
              </div>
              <div className="perfil__contacto-card">
                <div className="perfil__contacto-row">
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 10, color: "#a81818" }} />
                  <div>
                    <div className="perfil__contacto-label">Email</div>
                    <div className="perfil__contacto-value">{userPerfil.email}</div>
                  </div>
                  <span className="perfil__verificado-label">Verificado</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {showCambiarContra && (
        <CambiarContraseñaModal
          telefono={userPerfil.telefono}
          email={userPerfil.email}
          onClose={() => setShowCambiarContra(false)}
        />
      )}
    </div>
  );
}


// --- MODAL CAMBIAR CONTRASEÑA ---
function CambiarContraseñaModal({ telefono, email, onClose, onSuccess }) {
  const [step, setStep] = useState("select");
  const [codigo, setCodigo] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [changing, setChanging] = useState(false);

  const maskPhone = (phone) => phone ? phone.slice(0, 9) + "**" + phone.slice(-2) : "";
  const maskEmail = (mail) => {
    if (!mail) return "";
    const [user, domain] = mail.split('@');
    return user[0] + '.p***@' + domain;
  };
  const requisitos = [
    { msg: "Debe tener al menos 8 caracteres", valid: newPass.length >= 8 },
    { msg: "Debe contener al menos una letra mayúscula", valid: /[A-Z]/.test(newPass) },
    { msg: "Debe contener al menos un número", valid: /\d/.test(newPass) },
    { msg: "Debe contener al menos un carácter especial", valid: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(newPass) },
  ];

  const handleChangePass = (e) => {
    e.preventDefault();
    setChanging(true);
    setTimeout(() => {
      setChanging(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };
 return (
    <div className="modal__overlay" style={{ zIndex: 99999 }}>
      <div className="modal__content modal__full-white" style={{ maxWidth: 650, padding: 0 }}>
        {/* Header */}
        <button className="modal__back-btn" onClick={onClose} style={{ margin: 20 }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <div className="cambiar__titulo">Cambiar Contraseña</div>
        <div className="cambiar__box">
          <div className="cambiar__verif-title">
            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 7, color: "#c42f2f" }} />
            Verificación de Identidad
          </div>

          {/* Paso 1 */}
          {step === "select" && (
            <>
              <div className="cambiar__verif-sub">Selecciona cómo quieres recibir el código de verificación</div>
              {/* SMS */}
              <div className="cambiar__verif-card cambiar__verif-card--selected">
                <FontAwesomeIcon icon={faPhone} style={{ fontSize: 24, color: "#fe7d0c", marginRight: 16 }} />
                <div style={{ flex: 1 }}>
                  <div className="cambiar__verif-label">SMS al teléfono</div>
                  <div className="cambiar__verif-value">{maskPhone(telefono)}</div>
                </div>
                <button className="cambiar__verif-btn cambiar__verif-btn--orange" onClick={() => setStep("codigo")}>
                  Enviar SMS
                </button>
              </div>
              {/* Email */}
              <div className="cambiar__verif-card">
                <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: 24, color: "#b7262b", marginRight: 16 }} />
                <div style={{ flex: 1 }}>
                  <div className="cambiar__verif-label">Email</div>
                  <div className="cambiar__verif-value">{maskEmail(email)}</div>
                </div>
                <button className="cambiar__verif-btn" onClick={() => setStep("codigo")}>
                  Enviar Email
                </button>
              </div>
            </>
          )}

          {/* Paso 2: Código */}
          {step === "codigo" && (
            <form className="cambiar__codigo-form" onSubmit={e => { e.preventDefault(); setStep("nueva"); }}>
              <div className="cambiar__verif-sub" style={{ marginBottom: 16 }}>Código de verificación</div>
              <input
                className="cambiar__codigo-input"
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="123456"
                maxLength={6}
                style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5em',
                  width: '100%',
                  marginBottom: 18
                }}
                autoFocus
                required
              />
              <button className="cambiar__verif-btn cambiar__verif-btn--orange" style={{ width: '100%', fontWeight: 500 }} type="submit">
                Verificar código
              </button>
            </form>
          )}

          {/* Paso 3: Nueva contraseña */}
          {step === "nueva" && (
            <form className="cambiar__pass-form" onSubmit={handleChangePass}>
              <div className="cambiar__pass-label">Nueva contraseña</div>
              <div className="cambiar__pass-input-group">
                <input
                  type={showPass ? "text" : "password"}
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="cambiar__pass-input"
                  required
                  autoFocus
                />
                <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowPass(p => !p)}>
                  <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
                </button>
              </div>
              <div className="cambiar__pass-requisitos">
                <div>Requisitos de seguridad:</div>
                <ul>
                  {requisitos.map((r, i) => (
                    <li key={i} style={{ color: r.valid ? "green" : "#c82c2c", fontWeight: 400 }}>
                      {r.msg}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cambiar__pass-label">Confirmar contraseña</div>
              <div className="cambiar__pass-input-group">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="cambiar__pass-input"
                  required
                />
                <button type="button" tabIndex={-1} className="cambiar__show-btn" onClick={() => setShowConfirm(p => !p)}>
                  <FontAwesomeIcon icon={showConfirm ? faEye : faEyeSlash} />
                </button>
              </div>
              <button
                className="cambiar__verif-btn cambiar__verif-btn--orange"
                style={{ width: '100%', fontWeight: 500, marginTop: 18, opacity: (newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) ? 1 : 0.5 }}
                type="submit"
                disabled={!(newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid)) || changing}
              >
                Cambiar contraseña
              </button>
            </form>
          )}

         
        </div>
      </div>
    </div>
  );
}

