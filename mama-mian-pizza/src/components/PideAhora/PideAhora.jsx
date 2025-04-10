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
import mapIcon from '../../assets/Map.png';  
import Ubicacion from '../../assets/Ubicacion.png';         // Imagen estática para el mapa
       // Imagen estática para el mapa
import warningIcon from '../../assets/Warning.png';    // Icono de advertencia

// Importa los íconos para la contraseña
import activoIcon from '../../assets/Activo.png';  // Ícono para mostrar la contraseña (ojo activo)
import ocultoIcon from '../../assets/Oculto.png';    // Ícono para ocultarla (ojo cerrado)

const PideAhora = () => {
  // Estado del paso actual: inicialmente "Cuenta"
  const [step, setStep] = useState('Cuenta');
  // Modo de compra: 'invitado' o 'cuenta'
  const [modo, setModo] = useState('invitado');
  // Estado para alternar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Estado para el modo de dirección: "formulario" o "tiempoReal"
  const [modoDireccion, setModoDireccion] = useState('formulario');

  // Datos para el formulario de "Invitado"
  const [invitadoData, setInvitadoData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });

  // Datos para el formulario de "Cuenta"
  const [cuentaData, setCuentaData] = useState({
    email: '',
    password: '',
  });

  // Datos para la dirección manual
  const [direccionData, setDireccionData] = useState({
    direccionExacta: '',
    pais: '',
    departamento: '',
    municipio: '',
  });

  // Handlers para cambios en los formularios
  const handleInputInvitado = (e) => {
    setInvitadoData({
      ...invitadoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputCuenta = (e) => {
    setCuentaData({
      ...cuentaData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputDireccion = (e) => {
    setDireccionData({
      ...direccionData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para avanzar al siguiente paso
  const handleContinuar = () => {
    if (step === 'Cuenta') {
      setStep('Dirección');
    } else if (step === 'Dirección') {
      setStep('Pago');
    }
  };

  return (
    <div className="contenedor-pideahora">
      <div className="layout">
        {/* Columna izquierda: Barra de progreso y Card según el paso */}
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
              <p className="descripcion-compra">
                Elige cómo quieres continuar
              </p>

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
                  <span className="toggle-desc">
                    Sin necesidad de registro
                  </span>
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
                  <span className="toggle-desc">
                    Guarda tu historial
                  </span>
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
                    <label htmlFor="telefono">Número de teléfono</label>
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
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      className="input-full"
                      value={cuentaData.email}
                      onChange={handleInputCuenta}
                    />
                  </div>
                  <div className="campo password-campo">
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-with-icon">
                      <input
                        name="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="input-full"
                        value={cuentaData.password}
                        onChange={handleInputCuenta}
                      />
                      <img
                        src={showPassword ? activoIcon : ocultoIcon}
                        alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="botones">
                <button className="btn-volver">Volver</button>
                <button className="btn-continuar" onClick={handleContinuar}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 'Dirección' && (
            <div className="card-direccion">
              <h3 className="titulo-compra">Dirección de entrega</h3>

              <div className="toggle-direccion">
                <button
                  className={`toggle-dir-btn ${modoDireccion === 'formulario' ? 'activo' : ''}`}
                  onClick={() => setModoDireccion('formulario')}
                >
                  Llenar Formulario
                </button>
                <button
                  className={`toggle-dir-btn ${modoDireccion === 'tiempoReal' ? 'activo' : ''}`}
                  onClick={() => setModoDireccion('tiempoReal')}
                >
                  Ubicación de tiempo real
                </button>
              </div>

              {modoDireccion === 'formulario' && (
                <div className="contenido-direccion">
                  {/* Dirección exacta va primero */}
                  <div className="campo">
                    <label htmlFor="direccionExacta">Dirección exacta</label>
                    <input
                      type="text"
                      name="direccionExacta"
                      id="direccionExacta"
                      value={direccionData.direccionExacta}
                      onChange={handleInputDireccion}
                      className="input-full"
                    />
                  </div>
                  {/* Fila con País, Departamento (select) y Municipio */}
                  <div className="campos-tres">
                    <div className="campo">
                      <label htmlFor="pais">País</label>
                      <input
                        type="text"
                        name="pais"
                        id="pais"
                        value={direccionData.pais}
                        onChange={handleInputDireccion}
                        className="input-full"
                      />
                    </div>
                    <div className="campo">
                      <label htmlFor="departamento">Departamento</label>
                      <select
                        name="departamento"
                        id="departamento"
                        value={direccionData.departamento}
                        onChange={handleInputDireccion}
                        className="select-departamento"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Usulután">Usulután</option>
                        <option value="San Salvador">San Salvador</option>
                        <option value="La Libertad">La Libertad</option>
                        {/* Agrega más opciones si lo requieres */}
                      </select>
                    </div>
                    <div className="campo">
                      <label htmlFor="municipio">Municipio</label>
                      <input
                        type="text"
                        name="municipio"
                        id="municipio"
                        value={direccionData.municipio}
                        onChange={handleInputDireccion}
                        className="input-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modoDireccion === 'tiempoReal' && (
                <div className="contenido-tiempo-real">
                 <p className="instruccion">
  Haz clic en el botón para compartir tu ubicación actual
</p>

                  <button className="btn-ubicacion">
                    <img
                      src={Ubicacion}
                      alt="Ubicación"
                      className="icono-ubicacion"
                    />
                    Compartir mi ubicación
                  </button>
                  <div className="map-container">
                    <img
                      src={mapIcon}
                      alt="Mapa"
                      className="map-image"
                    />
                  </div>
                  <div className="alerta-cobertura">
                    <img
                      src={warningIcon}
                      alt="Advertencia"
                      className="warning-icon"
                    />
                    <p>
                      Cobertura de entrega en Puerto Parada y en Jiquilisco, Usulután, El Salvador
                    </p>
                  </div>
                </div>
              )}

              <div className="botones">
                <button className="btn-volver" onClick={() => setStep('Cuenta')}>
                  Atrás
                </button>
                <button className="btn-continuar" onClick={handleContinuar}>
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
                    Mozzarella, cebolla caramelizada, queso burrata, jamón, rúgula y vinagre balsámico
                  </p>
                  <div className="cantidad">
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <div className="resumen-footer">
                    <span className="precio">${idx === 0 ? '5.00' : '8.00'}</span>
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
