import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PideAhora.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

/* IMPORTA TUS ASSETS: íconos, imágenes, etc. Ajusta las rutas según tu proyecto */
import mapIcon from '../../assets/Map.png';  
import { 
  FaCheck, 
  FaFilePdf, 
  FaEye, 
  FaEyeSlash, 
  FaMapMarkerAlt, 
  FaSpinner, 
  FaUser, 
  FaUserTie,
  FaTrash,
  FaLock,
  FaCreditCard,
  FaMoneyBillWave,
  FaMapMarked,
  FaExclamationTriangle,
  FaPizzaSlice
} from 'react-icons/fa'; // Importamos todos los iconos que vamos a usar

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDAiO05_RG1ycHFVfvcUyCEG6g4pfWQ8VY';

// Estilos para el mapa de Google
const mapContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const PideAhora = ({ cartItems = [] }) => {
  const [step, setStep] = useState('Cuenta');
  const [modo, setModo] = useState('invitado');
  const [showPassword, setShowPassword] = useState(false);
  const [modoDireccion, setModoDireccion] = useState('formulario');
  const [pagoMetodo, setPagoMetodo] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaExp, setFechaExp] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Estados para la geolocalización
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationShared, setLocationShared] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  const [invitadoData, setInvitadoData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });
  
  const [cuentaData, setCuentaData] = useState({
    email: '',
    password: '',
  });
  
  const [direccionData, setDireccionData] = useState({
    direccionExacta: '',
    pais: '',
    departamento: '',
    municipio: '',
  });
  
  const pasos = ['Cuenta', 'Dirección', 'Pago', 'Confirmar'];
  const currentIndex = pasos.findIndex(p => p === step);

  // Estados para los modales
  const [showTerms, setShowTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  // Handlers para los formularios
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

  // Función para obtener la ubicación del usuario
  const getLocation = () => {
    // Restablecer estados
    setIsLocating(true);
    setLocationError('');
    setUserLocation(null);
    setLocationShared(false);
    setAddressInfo(null);
    
    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización.');
      setIsLocating(false);
      return;
    }
    
    // Opciones de geolocalización - alta precisión, timeout de 10 segundos
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    
    // Obtener ubicación
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy
        });
        setLocationShared(true);
        setIsLocating(false);
        
        // Obtener dirección aproximada basada en coordenadas
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
          .then(response => response.json())
          .then(data => {
            setAddressInfo({
              formattedAddress: data.display_name,
              locality: data.address.city || data.address.town || data.address.village || '',
              administrativeArea: data.address.state || '',
              country: data.address.country || ''
            });
            setLoadingAddress(false);
          })
          .catch(error => {
            console.error('Error al obtener la dirección:', error);
            setAddressInfo({
              formattedAddress: 'No se pudo obtener la dirección'
            });
            setLoadingAddress(false);
          });
      },
      // Error callback
      (error) => {
        let errorMsg;
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Permiso denegado para obtener ubicación.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            errorMsg = 'La solicitud de ubicación expiró.';
            break;
          case error.UNKNOWN_ERROR:
          default:
            errorMsg = 'Ocurrió un error desconocido.';
        }
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      // Options
      options
    );
  };

  // Función para obtener la dirección a partir de las coordenadas (reverse geocoding)
  const getAddressFromCoordinates = useCallback(async (lat, lng) => {
    setLoadingAddress(true);
    try {
      // Usamos la API de Geocoding de Google Maps
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const formattedAddress = data.results[0].formatted_address;
        
        // Extraer componentes de la dirección
        let locality = '';
        let subLocality = '';
        let administrativeArea = '';
        let country = '';
        
        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('locality')) {
            locality = component.long_name;
          } else if (types.includes('sublocality')) {
            subLocality = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            administrativeArea = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          }
        });
        
        setAddressInfo({
          formattedAddress,
          locality,
          subLocality,
          administrativeArea,
          country
        });
      } else {
        // Si hay un error en la respuesta de la API
        console.error('Error en geocodificación inversa:', data.status);
        setAddressInfo({
          formattedAddress: 'Ubicación sin dirección disponible'
        });
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setAddressInfo({
        formattedAddress: 'Error al obtener la dirección'
      });
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  // Efecto para obtener la dirección una vez que tenemos la ubicación
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      getAddressFromCoordinates(userLocation.lat, userLocation.lng);
    }
  }, [userLocation, getAddressFromCoordinates]);

  // Función para avanzar al siguiente paso
  const handleContinuar = () => {
    if (step === 'Cuenta') {
      setStep('Dirección');
    } else if (step === 'Dirección') {
      setStep('Pago');
    } else if (step === 'Pago') {
      if (!pagoMetodo) {
        alert('Por favor selecciona un método de pago.');
        return;
      }
      setStep('Confirmar');
    }
  };

  // Funciones para el flujo de modales
  const handleRealizarPedido = () => {
    setShowTerms(true);
  };

  const handleAceptarTerminos = () => {
    setShowTerms(false);
    setShowSuccess(true);
  };

  const handleCerrarExito = () => {
    setShowSuccess(false);
    // Aquí podrías redirigir o reiniciar el flujo, por ejemplo: setStep('Cuenta');
  };
  const handleDescargaPDF = () => {
    setShowSuccess(false);
    // Aquí podrías redirigir o reiniciar el flujo, por ejemplo: setStep('Cuenta');
  };
  return (
    <div className="contenedor-pideahora">
      <div className="layout">
        {/* Columna izquierda: Barra de progreso y Card según el paso */}
        <div className="col-izquierda">
          <div className="barra-progreso" data-step={step}>
            {pasos.map((p, idx) => {
              const isActive = idx <= currentIndex;
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
                <FaPizzaSlice className="icono-pizza" />
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
                  <FaUser 
                    className={`icono-usuario ${modo === 'invitado' ? 'active-icon' : ''}`}
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
                  <FaUserTie 
                    className={`icono-usuario ${modo === 'cuenta' ? 'active-icon' : ''}`}
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
                      <span 
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="botones">
                <button className="btn-volver-cuenta">Volver</button>
                <button className="btn-continuar-cuenta" onClick={handleContinuar}>
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
                  {/* Dirección exacta */}
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
                  <div className="campos-tres">
  <div className="campo">
    <label htmlFor="pais">País</label>
    <input
      type="text"
      name="pais"
      id="pais"
      value={direccionData.pais}
      onChange={handleInputDireccion}
      className="input-pais"
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
      <option value="Usulután">Jiquilisco</option>
      <option value="San Salvador">Usulutan</option>
      <option value="La Libertad">La Libertad</option>
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
      className="input-municipio"
    />
  </div>
</div>
                </div>
              )}

              {modoDireccion === 'tiempoReal' && (
                <div className="contenido-tiempo-real">
                  {!locationShared && !isLocating && !locationError && (
                    <>
                      <p className="instruccion">
                        Haz clic en el botón para compartir tu ubicación actual
                      </p>
                      <button className="btn-ubicacion" onClick={getLocation}>
                        <FaMapMarkerAlt className="icono-ubicacion" />
                        Compartir mi ubicación
                      </button>
                    </>
                  )}
                  

                  {isLocating && (
                    <div className="ubicacion-cargando">
                      <FaSpinner className="icono-spinner" />
                      <p>Obteniendo tu ubicación actual...</p>
                    </div>
                  )}
                  
                  {locationError && (
                    <div className="ubicacion-error">
                      <p className="error-mensaje">{locationError}</p>
                      <button className="btn-reintentar" onClick={getLocation}>
                        Reintentar
                      </button>
                    </div>
                  )}
                  
                  {locationShared && userLocation && (
                    <div className="ubicacion-compartida">
                      <div className="ubicacion-header">
                        <FaMapMarkerAlt className="icono-pin" />
                        <span>¡Ubicación compartida con éxito!</span>
                      </div>
                      
                      <div className="map-container">
                        {/* Google Maps integration */}
                        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={userLocation}
                            zoom={16}
                          >
                            <Marker position={userLocation} />
                          </GoogleMap>
                        </LoadScript>
                        
                        {/* Información de dirección mejorada */}
                        <div className="direccion-info">
                          {loadingAddress ? (
                            <div className="loading-address">
                              <FaSpinner className="icono-spinner-small" />
                              <span>Obteniendo dirección exacta...</span>
                            </div>
                          ) : addressInfo ? (
                            <div className="address-details">
                              <h4>Tu ubicación exacta:</h4>
                              <p className="direccion-completa">{addressInfo.formattedAddress || "Dirección no disponible"}</p>
                              {addressInfo.locality && (
                                <p className="locality-info">
                                  <FaMapMarkerAlt className="location-icon-small" />
                                  {addressInfo.locality}
                                  {addressInfo.administrativeArea && `, ${addressInfo.administrativeArea}`}
                                  {addressInfo.country && `, ${addressInfo.country}`}
                                </p>
                              )}
                              <div className="coordinates-box">
                                <p className="coordinates-text">
                                  <span className="coordinates-label">Latitud:</span> {userLocation.lat.toFixed(6)}
                                </p>
                                <p className="coordinates-text">
                                  <span className="coordinates-label">Longitud:</span> {userLocation.lng.toFixed(6)}
                                </p>
                                <p className="precision-text">
                                  <span className="coordinates-label">Precisión:</span> ±{Math.round(userLocation.accuracy)} metros
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      
                      <button className="btn-actualizar" onClick={getLocation}>
                        <FaMapMarkerAlt /> Actualizar ubicación
                      </button>
                    </div>
                  )}

                  <div className="alerta-cobertura">
                    <FaExclamationTriangle className="warning-icon" />
                    <p>
                      Cobertura de entrega en Puerto Parada y en Jiquilisco, Usulután, El Salvador
                    </p>
                  </div>
                </div>
              )}

              <div className="botones">
                <button className="btn-volver-Direccion" onClick={() => setStep('Cuenta')}>
                  Atrás
                </button>
                <button className="btn-continuar-Direccion" onClick={handleContinuar}>
                  Continuar
                </button>
              </div>
            </div>
          )}

{step === 'Pago' && (
  <div className="card-pago">
    <h3 className="titulo-compra">Método de Pago</h3>
    <p className="descripcion-pago">Elige cómo quieres pagar tu pedido</p>
    <div className="toggle-pago">
      {/* Primer botón: Tarjeta */}
      <button
        className={`toggle-btn ${pagoMetodo === 'tarjeta' ? 'activo' : ''}`}
        onClick={() => setPagoMetodo('tarjeta')}
      >
        <FaCreditCard 
          className={`icono-metodo ${pagoMetodo === 'tarjeta' ? 'active-icon' : ''}`}
        />
        <span>Tarjeta</span>
      </button>
      {/* Segundo botón: Efectivo */}
      <button
        className={`toggle-btn ${pagoMetodo === 'efectivo' ? 'activo' : ''}`}
        onClick={() => setPagoMetodo('efectivo')}
      >
        <FaMoneyBillWave 
          className={`icono-metodo ${pagoMetodo === 'efectivo' ? 'active-icon' : ''}`}
        />
        <span>Efectivo</span>
      </button>
    </div>

    {pagoMetodo === 'tarjeta' && (
      <div className="detalle-pago">
        <h4>Detalles de Tarjeta</h4>
        <div className="form-tarjeta">
          <div className="campo">
            <label htmlFor="nombreTarjeta">Nombre en la tarjeta</label>
            <input
              type="text"
              id="nombreTarjeta"
              name="nombreTarjeta"
              value={nombreTarjeta}
              onChange={(e) => setNombreTarjeta(e.target.value)}
              placeholder="Como aparece en la tarjeta"
              className="input-full"
            />
          </div>
          <div className="campo">
            <label htmlFor="numeroTarjeta">Número de tarjeta</label>
            <input
              type="text"
              id="numeroTarjeta"
              name="numeroTarjeta"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              className="input-full"
            />
          </div>
          <div className="fila-tarjeta">
            <div className="campo">
              <label htmlFor="fechaExp">Fecha de expiración</label>
              <input
                type="month"
                id="fechaExp"
                name="fechaExp"
                value={fechaExp}
                placeholder='MM/AA'
                onChange={(e) => setFechaExp(e.target.value)}
                className="input-full"
              />
            </div>
            <div className="campo">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={3}
                className="input-full"
              />
            </div>
          </div>
          <div className="seguridad-info">
            <FaLock className="icono-seguridadd" />
            <span>Tus datos están Protegidos con encriptación de alta seguridad</span>
          </div>
        </div>
      </div>
    )}

    {pagoMetodo === 'efectivo' && (
      <div className="detalle-pagos">
        <p>
          Pagarás en efectivo al momento de la entrega. 
        </p>
        <p>

          Por favor, ten el monto exacto para facilitar la entrega.
        </p>
      </div>
    )}

    <div className="botones">
      <button className="btn-volver-Direccion" onClick={() => setStep('Dirección')}>
        Atrás
      </button>
      <button className="btn-continuar-pago" onClick={handleContinuar}>
        Continuar
      </button>
    </div>
  </div>
)}

          {/* Aquí se podría implementar la Card de Confirmación para el paso 4 */}
          {step === 'Confirmar' && (
        <div className="card-confirmar">
          <h3 className="titulo-confirmar">Revisar y confirmar</h3>
          <p className="descripcion-confirmar">
            Revisa los detalles de tu pedido antes de confirmar
          </p>
          
          {/* Sección de Información Personal */}
          <div className="seccion-linea">
            <h4 className="subtitulo-seccion">Información personal</h4>
           
          </div>

          {/* Sección de Dirección de entrega */}
          <div className="seccion-linea">
            <h4 className="subtitulo-seccion">Dirección de entrega</h4>
            {modoDireccion === 'formulario' ? (
              <>
                <p>{direccionData.direccionExacta}</p>
                <p>{direccionData.pais} – {direccionData.departamento} – {direccionData.municipio}</p>
              </>
            ) : (
              <p>Ubicación compartida en tiempo real (Puerto Parada o Jiquilisco)</p>
            )}
          </div>

          {/* Sección de Método de pago */}
          <div className="seccion-linea">
            <h4 className="subtitulo-seccion">Método de pago</h4>
            {pagoMetodo === 'efectivo' && (
              <p>Efectivo al momento de la entrega</p>
            )}
            {pagoMetodo === 'tarjeta' && (
              <p>Tarjeta de crédito o débito</p>
            )}
          </div>

          <div className="botones-confirmar">
            <button className="btn-volver-pedido" onClick={() => setStep('Pago')}>
              Atrás
            </button>
            <button className="btn-continuar-pedido" onClick={handleRealizarPedido}>
              Realizar pedido
            </button>
          </div>
        </div>
      )}

      {/* Modal Términos y Condiciones */}
      {showTerms && (
        <div className="modal-overlay">
          <div className="modal-terminos">
            <button className="cerrar-modal" onClick={() => setShowTerms(false)}>X</button>
            <h2 className="titulo-modal">Términos y condiciones</h2>
            <ol className="lista-terminos">
              <li><strong>Uso Responsable:</strong> Usa la plataforma solo para comprar o explorar productos. Proporciona información correcta y no realices actividades fraudulentas.</li>
              <li><strong>Tus Datos:</strong> Recopilamos datos (nombre, dirección, correo, teléfono y pago) para procesar tu información y no la compartimos con terceros.</li>
              <li><strong>Derechos:</strong> Recibir productos como se describen, factura electrónica y soporte si hay problemas.</li>
              <li><strong>Responsabilidades:</strong> Revisa tu pedido antes de confirmar y no hagas reclamos falsos.</li>
              <li><strong>Compras y Envíos:</strong> Pago en línea obligatorio. Cancelaciones solo antes de la confirmación del envío. Reembolsos solo por errores comprobados.</li>
            </ol>
            <div className="check-acepto">
              <input
                type="checkbox"
                id="aceptoTerminos"
                checked={aceptoTerminos}
                onChange={() => setAceptoTerminos(!aceptoTerminos)}
              />
              <label htmlFor="aceptoTerminos"> He leído y acepto los términos y condiciones</label>
            </div>
            <button
              className="btn-aceptar"
              onClick={handleAceptarTerminos}
              disabled={!aceptoTerminos}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal Pedido Realizado con Éxito */}
  {/* Modal de Pedido Realizado con Éxito */}
{showSuccess && (
  <div className="modal-overlay">
    <div className="modal-exito">
      <button className="cerrar-modal" onClick={handleCerrarExito}>X</button>
      <div className="icono-verde">
        <FaCheck aria-hidden="true" />
      </div>
      <h1>¡Pedido realizado con éxito!</h1>
      <p>Tu pedido #78657 ha sido recibido y está siendo procesado.</p>
      <h3>
        Recibirás una confirmación por correo electrónico con los detalles de tu pedido.
      </h3>
      <h2>        <strong>Tiempo estimado de entrega: 30-45 minutos</strong>
      </h2>
      <button className="btn-confirm" onClick={handleDescargaPDF}>
        <FaFilePdf aria-hidden="true" style={{ marginRight: '8px' }} />
        Descargar factura
      </button>
      <button className="btn-volverr-tienda" onClick={handleCerrarExito}>
        Volver a la tienda
      </button>
    </div>
  </div>
)}

        </div>

        {/* Columna derecha: Card Resumen */}
        <div className="col-derecha">
          <div className="card-resumen wider right-align">
            <h3 className="resumen-titulo">Resumen de la orden</h3>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <div className="resumen-item" key={item.id}>
                    <img src={item.imagen} alt={item.nombre} className="resumen-img" />
                    <div className="resumen-detalle">
                      <h4>{item.nombre}</h4>
                      <p>{item.descripcion}</p>
                      {item.masa && <p><small>Masa: {item.masa}</small></p>}
                      {item.tamano && <p><small>Tamaño: {item.tamano}</small></p>}
                      {item.ingredientes && item.ingredientes.length > 0 && (
                        <p><small>Ingredientes: {item.ingredientes.join(', ')}</small></p>
                      )}
                      <div className="cantidad">
                        <span>Cantidad: {item.cantidad}</span>
                      </div>
                      <div className="resumen-footer">
                        <span className="precio">${(item.precio * item.cantidad).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="resumen-total">
                  <span>Total:</span>
                  <span>${cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <p>No hay productos en el carrito</p>
            )}
          </div>
        </div>
      </div>      
    </div>
  );
};

export default PideAhora;
