import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faShieldAlt,
  faPhone,
  faEnvelope,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import './recover.css';

const RecoverPassword = () => {
  const [step, setStep] = useState('select'); // 'select' | 'codigo' | 'nueva'
  const [codigo, setCodigo] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Mock info
  const telefono = "+503 712 345 867";
  const email = "juan.p***@email.com";

  // Validaciones de requisitos
  const requisitos = [
    { msg: "Debe tener al menos 8 caracteres", valid: newPass.length >= 8 },
    { msg: "Debe contener al menos una letra mayúscula", valid: /[A-Z]/.test(newPass) },
    { msg: "Debe contener al menos un número", valid: /\d/.test(newPass) },
    { msg: "Debe contener al menos un carácter especial", valid: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(newPass) },
  ];
  const validForm = newPass && confirmPass && newPass === confirmPass && requisitos.every(r => r.valid);

  // Redirige a login al guardar
  const handleGuardar = (e) => {
    e.preventDefault();
    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  };

  return (
    <div className="recover">
      <div className="recover__card" style={{ maxWidth: 700 }}>
        <button className="recover__back" onClick={() => setStep('select')}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <div className="recover__header">
          <FontAwesomeIcon icon={faShieldAlt} className="recover__icon-lock" />
          <span className="recover__title">Cambiar Contraseña</span>
        </div>
        <div className="recover__subtitle" style={{ color: "#a22722" }}>
          Verificación de Identidad
        </div>
        <div className="recover__subtitle2">
          Selecciona cómo quieres recibir el código de verificación
        </div>

        {/* Paso 1: Selección método */}
        {step === 'select' && (
          <div className="recover__select-list">
            <div className="recover__select-card recover__select-card--selected">
              <FontAwesomeIcon icon={faPhone} className="recover__select-icon" />
              <div className="recover__select-info">
                <div className="recover__select-label">SMS al teléfono</div>
                <div className="recover__select-value">{telefono}</div>
              </div>
              <button
                className="recover__select-btn recover__select-btn--sms"
                onClick={() => setStep('codigo')}
              >
                Enviar SMS
              </button>
            </div>
            <div className="recover__select-card">
              <FontAwesomeIcon icon={faEnvelope} className="recover__select-icon" />
              <div className="recover__select-info">
                <div className="recover__select-label">Email</div>
                <div className="recover__select-value">{email}</div>
              </div>
              <button
                className="recover__select-btn"
                onClick={() => setStep('codigo')}
              >
                Enviar Email
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Ingreso código */}
        {step === 'codigo' && (
          <form
            className="recover__form-code"
            onSubmit={e => { e.preventDefault(); setStep('nueva'); }}
          >
            <div className="recover__subtitle" style={{marginBottom:12}}>Código de verificación</div>
            <input
              type="text"
              className="recover__input-code"
              placeholder="123456"
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                letterSpacing: "0.5em",
                marginBottom: "18px"
              }}
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
              maxLength={6}
              autoFocus
            />
            <button
              className="recover__btn recover__btn--orange"
              type="submit"
              style={{ width: '100%' }}
            >
              Verificar código
            </button>
          </form>
        )}

        {/* Paso 3: Nueva contraseña */}
        {step === 'nueva' && (
          <form className="recover__form-nueva" onSubmit={handleGuardar}>
            <div className="recover__input-label">Nueva contraseña</div>
            <div className="recover__pass-input-group">
              <input
                type={showPass ? "text" : "password"}
                className="recover__input-code"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                required
                style={{marginBottom:8}}
              />
              <button type="button" tabIndex={-1} className="recover__show-btn" onClick={() => setShowPass(p => !p)}>
                <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} />
              </button>
            </div>
            <div className="recover__pass-requisitos">
              <div>Requisitos de seguridad:</div>
              <ul>
                {requisitos.map((r, i) => (
                  <li key={i} style={{ color: r.valid ? "green" : "#c82c2c", fontWeight: 400 }}>
                    {r.msg}
                  </li>
                ))}
              </ul>
            </div>
            <div className="recover__input-label">Confirmar contraseña</div>
            <div className="recover__pass-input-group">
              <input
                type={showConfirm ? "text" : "password"}
                className="recover__input-code"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                required
              />
              <button type="button" tabIndex={-1} className="recover__show-btn" onClick={() => setShowConfirm(p => !p)}>
                <FontAwesomeIcon icon={showConfirm ? faEye : faEyeSlash} />
              </button>
            </div>
            <button
              className="recover__btn"
              type="submit"
              style={{
                width: '100%',
                background: "#fe7d0c",
                color: "#fff",
                opacity: validForm ? 1 : 0.7,
                marginTop: 18
              }}
              disabled={!validForm}
            >
              Cambiar contraseña
            </button>
          </form>
        )}

        {/* Volver al login */}
        <button
          className="recover-back-btn"
          onClick={() => window.location.href = "/login"}
          style={{ marginTop: 30 }}
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default RecoverPassword;
