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

  return (
    <div className="contenedor-pideahora">
      <div className="layout">
        {/* Columna izquierda: Barra de navegación y Card-Cuenta */}
        <div className="col-izquierda">
          {/* Barra de progreso */}
          <div className="barra-progreso">
            {['Cuenta', 'Dirección', 'Pago', 'Confirmar'].map((p, idx) => {
              const isActive = idx === 0; // Simulamos que "Cuenta" está activo
              return (
                <div key={p} className={`paso ${isActive ? 'activo' : ''}`}>
                  <div className="circulo">{idx + 1}</div>
                  <span className="texto-paso">{p}</span>
                </div>
              );
            })}
          </div>

          {/* Card: Cómo continuar con la compra */}
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
                  src={modo === 'invitado' ? userIcon : userIcon4}
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
                  src={modo === 'cuenta' ? userIcon5: userIcon2}
                  alt="Cuenta"
                  className="icono-usuario"
                />
                <span className="toggle-titulo">Con una cuenta</span>
                <span className="toggle-desc">Guarda tu historial</span>
              </button>
            </div>
            <div className="formulario-invitado">
  <div className="campos-dobles">
    <input
      name="nombre"
      type="text"
      className="input-small"
      placeholder="Nombre"
      value={invitadoData.nombre}
      onChange={handleInputInvitado}
    />
    <input
      name="apellido"
      type="text"
      className="input-small"
      placeholder="Apellido"
      value={invitadoData.apellido}
      onChange={handleInputInvitado}
    />
  </div>
  <div className="telefono-container">
    <span className="telefono-prefix">+503</span>
    <span className="separador"></span>
    <input
      name="telefono"
      type="tel"
      className="input-telefono"
      placeholder="000-0000"
      value={invitadoData.telefono}
      onChange={handleInputInvitado}
    />
  </div>
</div>

           

            {/* Formulario de Cuenta */}
            {modo === 'cuenta' && (
              <div className="formulario-cuenta">
                <input
                  name="email"
                  type="email"
                  className="input-full"
                  placeholder="Correo electrónico"
                  value={cuentaData.email}
                  onChange={handleInputCuenta}
                />
                <input
                  name="password"
                  type="password"
                  className="input-full"
                  placeholder="Contraseña"
                  value={cuentaData.password}
                  onChange={handleInputCuenta}
                />
              </div>
            )}

            {/* Botones: Volver / Continuar */}
            <div className="botones">
              <button className="btn-volver">Volver</button>
              <button className="btn-continuar">Continuar</button>
            </div>
          </div>
        </div>

        {/* Columna derecha: Card Resumen */}
        <div className="col-derecha">
          <div className="card-resumen">
            <h3 className="resumen-titulo">Resumen de la orden</h3>

            {/* Items de ejemplo */}
            {[1, 2].map((item, idx) => (
              <div className="resumen-item" key={item}>
                <img src={pizzaCardImg} alt="Pizza" className="resumen-img" />
                <div className="resumen-detalle">
                  <h4>Burrata</h4>
                  <p>
                    Mozzarella, cebolla caramelizada, queso burrata, jamón, rúgula
                    y vinagre balsámico
                  </p>

                  {/* Contador de cantidad */}
                  <div className="cantidad">
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                  </div>

                  {/* Footer: Precio y Eliminar */}
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

            {/* Total */}
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
