import React, { useState } from 'react';
import './PideAhora.css';

/* IMPORTA TUS ASSETS: íconos, imágenes, etc. Ajusta las rutas según tu proyecto */
import pizzaIcon from '../../assets/PizzaR.png';
import userIcon from '../../assets/Usuario1.png';
import userIcon5 from '../../assets/usuario3.png';  // Icono para "Con una cuenta" activo
import userIcon4 from '../../assets/usuario4.png';  // Icono para "Como invitado" activo
import userIcon2 from '../../assets/Usuario2.png';
import deleteIcon from '../../assets/Basurero.png';
import pizzaCardImg from '../../assets/PizzaCard.png';

const PideAhora = () => {
  // Estado del paso actual: inicialmente "Cuenta"
  const [step, setStep] = useState('Cuenta');
  // Modo de compra: 'invitado' o 'cuenta'
  const [modo, setModo] = useState('invitado');

  // Datos modo invitado
  const [invitadoData, setInvitadoData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });

  // Datos modo cuenta
  const [cuentaData, setCuentaData] = useState({
    email: '',
    password: '',
  });

  // Handlers para formulario invitado
  const handleInputInvitado = (e) => {
    setInvitadoData({
      ...invitadoData,
      [e.target.name]: e.target.value,
    });
  };

  // Handlers para formulario cuenta
  const handleInputCuenta = (e) => {
    setCuentaData({
      ...cuentaData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el botón "Continuar"
  const handleContinuar = () => {
    // Aquí podrías validar los datos del paso actual
    if (step === 'Cuenta') {
      setStep('Dirección');
    }
    // Agrega más lógica para otros pasos según tu flujo
  };

  return (
    <div className="contenedor-pideahora">
      <div className="layout">
        {/* Columna izquierda: Barra de navegación y Card según el paso */}
        <div className="col-izquierda">
          {/* Barra de progreso */}
          <div className="barra-progreso">
            {['Cuenta', 'Dirección', 'Pago', 'Confirmar'].map((p, idx) => {
              const isActive = p === step;
              return (
                <div key={p} className={`paso ${isActive ? 'activo' : ''}`}>
                  <div className="circulo">{idx + 1}</div>
                  <span className="texto-paso">{p}</span>
                </div>
              );
            })}
          </div>

          {step === 'Cuenta' && (
            <div className="card-cuenta">
              <h3 className="titulo-compra">
                ¿Cómo quieres continuar con tu compra?
                <img src={pizzaIcon} alt="Pizza Icon" className="icono-pizza" />
              </h3>
              <p className="descripcion-compra">Elige cómo quieres continuar</p>

              {/* Toggle: Invitado / Cuenta */}
              <div className="toggle-compra">
                <button
                  className={`toggle-btn ${modo === 'invitado' ? 'activo' : ''}`}
                  onClick={() => setModo('invitado')}
                >
                  <img
                    src={modo === 'invitado' ? userIcon4 : userIcon}
                    alt="Invitado"
                    className="icono-usuario"
                  />
                  <span className="toggle-titulo">Como invitado</span>
                  <span className="toggle-desc">Sin necesidad de registro</span>
                </button>

                <button
                  className={`toggle-btn ${modo === 'cuenta' ? 'activo' : ''}`}
                  onClick={() => setModo('cuenta')}
                >
                  <img
                    src={modo === 'cuenta' ? userIcon5 : userIcon2}
                    alt="Cuenta"
                    className="icono-usuario"
                  />
                  <span className="toggle-titulo">Con una cuenta</span>
                  <span className="toggle-desc">Guarda tu historial</span>
                </button>
              </div>

              {/* Formulario de Invitado */}
              {modo === 'invitado' && (
                <div className="formulario-invitado">
                  <div className="campos-dobles">
                    <div className="campo">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        name="nombre"
                        id="nombre"
                        type="text"
                        className="input-small"
                        value={invitadoData.nombre}
                        onChange={handleInputInvitado}
                      />
                    </div>
                    <div className="campo">
                      <label htmlFor="apellido">Apellido</label>
                      <input
                        name="apellido"
                        id="apellido"
                        type="text"
                        className="input-small"
                        value={invitadoData.apellido}
                        onChange={handleInputInvitado}
                      />
                    </div>
                  </div>
                  <div className="campo">
                    <label htmlFor="telefono">Numero de teléfono</label>
                    <div className="telefono-container">
                      <span className="telefono-prefix">+503</span>
                      <span className="separador"></span>
                      <input
                        name="telefono"
                        id="telefono"
                        type="tel"
                        className="input-telefono"
                        placeholder="000-0000"
                        value={invitadoData.telefono}
                        onChange={handleInputInvitado}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario de Cuenta */}
              {modo === 'cuenta' && (
                <div className="formulario-cuenta">
                  <div className="campo">
                    <label htmlFor="email">Correo electronico</label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      className="input-full"
                      value={cuentaData.email}
                      onChange={handleInputCuenta}
                    />
                  </div>
                  <div className="campo">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      name="password"
                      id="password"
                      type="password"
                      className="input-full"
                      value={cuentaData.password}
                      onChange={handleInputCuenta}
                    />
                  </div>
                </div>
              )}

              {/* Botones: Volver / Continuar */}
              <div className="botones">
                <button className="btn-volver">Volver</button>
                <button className="btn-continuar" onClick={handleContinuar}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Placeholder para el paso "Dirección" */}
          {step === 'Dirección' && (
            <div className="card-direccion">
              <h3 className="titulo-compra">
                Ingresa tu dirección
              </h3>
              <p>Aquí va el formulario de Dirección.</p>
              <div className="botones">
                <button className="btn-volver" onClick={() => setStep('Cuenta')}>
                  Volver
                </button>
                <button className="btn-continuar">
                  Continuar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: Card Resumen */}
        <div className="col-derecha">
          <div className="card-resumen">
            <h3 className="resumen-titulo">Resumen de la orden</h3>
            {[1, 2].map((item, idx) => (
              <div className="resumen-item" key={item}>
                <img src={pizzaCardImg} alt="Pizza" className="resumen-img" />
                <div className="resumen-detalle">
                  <h4>Burrata</h4>
                  <p>
                    Mozzarella, cebolla caramelizada, queso burrata, jamón, rúgula
                    y vinagre balsámico
                  </p>
                  <div className="cantidad">
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <div className="resumen-footer">
                    <span className="precio">
                      ${idx === 0 ? '5.00' : '8.00'}
                    </span>
                    <button className="eliminar">
                      <img src={deleteIcon} alt="Eliminar" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="resumen-total">
              <span>Total:</span>
              <span>$16.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PideAhora;
