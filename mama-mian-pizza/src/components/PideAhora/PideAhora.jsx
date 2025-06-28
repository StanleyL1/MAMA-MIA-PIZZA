import React, { useState, useEffect, useCallback } from 'react';
import './PideAhora.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../utils/userStorage';

/* IMPORTA TUS ASSETS: íconos, imágenes, etc. Ajusta las rutas según tu proyecto */
import { 
  FaCheck, 
  FaFilePdf, 
  FaMapMarkerAlt, 
  FaSpinner, 
  FaUser, 
  FaUserTie,
  FaCreditCard,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaPizzaSlice,
  FaMotorcycle,
  FaStore
} from 'react-icons/fa';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDAiO05_RG1ycHFVfvcUyCEG6g4pfWQ8VY';

// Estilos para el mapa de Google
const mapContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const PideAhora = ({ cartItems = [], setCartItems }) => {
  const navigate = useNavigate();  const [step, setStep] = useState('Cuenta');
  const [modo, setModo] = useState('invitado');
  const [modoDireccion, setModoDireccion] = useState('formulario');
  const [pagoMetodo, setPagoMetodo] = useState('');

  const [metodoEntrega, setMetodoEntrega] = useState('');
  
  // Estados para la geolocalización
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationShared, setLocationShared] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  // Estados adicionales para manejo del pedido
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [orderError, setOrderError] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [orderSuccess, setOrderSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [orderCode, setOrderCode] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [invitadoData, setInvitadoData] = useState({
    nombreCompleto: '',
    telefono: '',
  });  const [cuentaData, setCuentaData] = useState({
    nombreCompleto: '',
    telefono: '',
    email: '',
  });
    const [direccionData, setDireccionData] = useState({
    direccionExacta: '',
    referencias: '',
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

  // Estados para manejo de usuario logueado
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

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

// Función para redirigir a Wompi con enlace predefinido (solución CORS)
const redirigirAWompi = () => {
  try {
    // Calcular totales del pedido
    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const impuestos = subtotal * 0.13;
    const costoEnvio = metodoEntrega === 'domicilio' ? 2.50 : 0.00;
    const total = subtotal + impuestos + costoEnvio;

    // Obtener nombre del cliente
    const nombreCliente = modo === 'invitado' 
      ? invitadoData.nombreCompleto 
      : cuentaData.nombreCompleto;

    // Crear identificador único para el pedido
    const identificadorUnico = `mama-mia-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Guardar información del pedido en localStorage para el retorno
    const pedidoInfo = {
      identificador: identificadorUnico,
      cliente: nombreCliente,
      productos: cartItems,
      total: total,
      metodoEntrega: metodoEntrega,
      fecha: new Date().toISOString(),
      subtotal: subtotal,
      impuestos: impuestos,
      costoEnvio: costoEnvio
    };
    localStorage.setItem('pedido_actual', JSON.stringify(pedidoInfo));

    // Crear descripción del pedido para mostrar al usuario
    const descripcionProductos = cartItems.map(item => 
      `${item.nombre} (x${item.cantidad})`
    ).join(', ');

    console.log('🏪 Redirigiendo a Wompi con información del pedido:', {
      cliente: nombreCliente,
      total: total,
      productos: descripcionProductos,
      identificador: identificadorUnico
    });

    // Mostrar información del pedido antes de redirigir
    const confirmacion = window.confirm(
      `¿Confirmas el pago de $${total.toFixed(2)} para el pedido:\n\n` +
      `Cliente: ${nombreCliente}\n` +
      `Productos: ${descripcionProductos}\n` +
      `Subtotal: $${subtotal.toFixed(2)}\n` +
      `Impuestos: $${impuestos.toFixed(2)}\n` +
      `Envío: $${costoEnvio.toFixed(2)}\n` +
      `Total: $${total.toFixed(2)}\n\n` +
      `Serás redirigido a la plataforma de pago de Wompi.`
    );

    if (confirmacion) {
      // Usar el enlace predefinido de Wompi con parámetros
      const urlWompi = `https://u.wompi.sv/398524Auq?amount=${total.toFixed(2)}&reference=${identificadorUnico}&customer_name=${encodeURIComponent(nombreCliente)}`;
      
      console.log('🔗 Redirigiendo a URL de Wompi:', urlWompi);
      
      // Redirigir a Wompi
      window.open(urlWompi, '_self');
    }
    
  } catch (error) {
    console.error('❌ Error al preparar pago con Wompi:', error);
    alert('Error al preparar el pago. Por favor intenta nuevamente.');
    throw error;
  }
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
        setAddressInfo({
          formattedAddress: 'Ubicación sin dirección disponible'
        });
      }
    } catch (error) {
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
  const handleContinuar = async () => {
    if (step === 'Cuenta') {
      // Validar campos de invitado
      if (modo === 'invitado') {
        if (!invitadoData.nombreCompleto || !invitadoData.telefono) {
          alert('Por favor completa todos los campos requeridos.');
          return;
        }      } else {
        // Validar campos de cuenta registrada
        if (!cuentaData.nombreCompleto || !cuentaData.telefono || !cuentaData.email) {
          alert('Por favor completa todos los campos requeridos.');
          return;
        }
      }
      setStep('Dirección');
    } else if (step === 'Dirección') {
      setStep('Pago');
    } else if (step === 'Pago') {
      if (!pagoMetodo) {
        alert('Por favor selecciona un método de pago.');
        return;
      }
      
      // Si el método de pago es transferencia (pago en línea), procesar inmediatamente
      if (pagoMetodo === 'transferencia') {
        try {
          setIsProcessingPayment(true);
          redirigirAWompi(); // Usar la nueva función sin CORS
        } catch (error) {
          // Error ya manejado en redirigirAWompi
        } finally {
          setIsProcessingPayment(false);
        }
      } else {
        // Para pago en efectivo, continuar al paso de confirmación
        setStep('Confirmar');
      }
    }
  };
  // Función para enviar el pedido al servidor adaptada para el nuevo backend
  const enviarPedido = async () => {
    
    if (!pagoMetodo) {
      alert('Por favor selecciona un método de pago.');
      return;
    }
    
    setIsSubmitting(true);
    setOrderError('');
    
    try {
      // Construir objeto con la estructura exacta esperada por el backend
      const pedidoData = {
        // Tipo de cliente: registrado o invitado
        tipo_cliente: modo === 'invitado' ? 'invitado' : 'registrado',        // Datos del cliente según el payload exacto
        cliente: modo === 'invitado'
          ? { 
              nombre: invitadoData.nombreCompleto,
              telefono: invitadoData.telefono
            }          : {
              nombre: cuentaData.nombreCompleto,
              telefono: cuentaData.telefono,
              email: cuentaData.email
            },
        
        // Dirección según el tipo seleccionado
        direccion: metodoEntrega === 'domicilio'
          ? (modoDireccion === 'formulario' 
              ? {
                  tipo_direccion: 'formulario',
                  direccion: direccionData.direccionExacta,
                  referencias: direccionData.referencias,
                  pais: direccionData.pais,
                  departamento: direccionData.departamento,
                  municipio: direccionData.municipio
                }
              : {
                  tipo_direccion: 'tiempo_real',
                  latitud: userLocation.lat,
                  longitud: userLocation.lng,
                  precision_ubicacion: Math.round(userLocation.accuracy),
                  direccion_formateada: addressInfo?.formattedAddress || "Ubicación compartida en tiempo real"
                })
          : {
              // Para recoger en local - usar dirección del local
              tipo_direccion: 'formulario',
              direccion: "CP #3417, Puerto El Triunfo, EL salvador",
              referencias: "Local principal",
              pais: "El Salvador",
              departamento: "Usulután",
              municipio: "Jiquilisco"
            },
        
        // Productos con la estructura exacta del payload
        productos: cartItems.map(item => ({
          id_producto: item.id,
          nombre_producto: item.nombre,
          cantidad: parseInt(item.cantidad),
          precio_unitario: parseFloat(item.precio),
          subtotal: parseFloat(item.precio * item.cantidad),
          masa: item.masa || null,
          tamano: item.tamano || null,
          instrucciones_especiales: item.instrucciones || null,
          metodo_entrega: metodoEntrega === 'recoger' ? 1 : 0
        })),
        
        // Método de pago
        metodo_pago: pagoMetodo,
        
        // Cálculos financieros exactos
        subtotal: parseFloat(cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)),
        costo_envio: metodoEntrega === 'domicilio' ? 2.50 : 0.00,
        impuestos: parseFloat((cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) * 0.13).toFixed(2)),
        total: parseFloat((
          cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) + 
          (metodoEntrega === 'domicilio' ? 2.50 : 0.00) + 
          (cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) * 0.13)
        ).toFixed(2)),
        
        // Términos y tiempo estimado
        aceptado_terminos: true,
        tiempo_estimado_entrega: metodoEntrega === 'domicilio' ? 30 : 25
      };
      
      // Enviar los datos al servidor
      const response = await fetch('https://api.mamamianpizza.com/api/orders/neworder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoData)
      });
      
      // Analizar el resultado
      if (response.ok) {
        const result = await response.json();
        
        // Obtener código de pedido de la respuesta o usar un valor por defecto
        const codigoPedido = result.codigo_pedido || '#78657';
        
        // Continuar con el flujo normal después de un pedido exitoso
        setOrderSuccess(true);
        setOrderCode(codigoPedido);
        setShowTerms(false);
        setShowSuccess(true);
      } else {
        const errorResult = await response.json();
        setOrderError(errorResult.message || 'Error al procesar el pedido');
        setShowTerms(false);
        alert(`Error al procesar el pedido: ${errorResult.message || 'Intenta nuevamente'}`);
      }
    } catch (error) {
      setOrderError('Error de conexión al procesar el pedido');
      setShowTerms(false);
      alert('Hubo un problema al procesar el pedido. Por favor intenta nuevamente más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modificar la función handleAceptarTerminos para añadir más logs de depuración
  const handleAceptarTerminos = () => {
    console.log('Función handleAceptarTerminos ejecutada');
    console.log('Estado aceptoTerminos:', aceptoTerminos);
    
    if (aceptoTerminos) {
      enviarPedido();
    } else {
      alert('Debes aceptar los términos y condiciones para continuar');
    }
  };

  // Funciones para el flujo de modales
  const handleRealizarPedido = () => {
    setShowTerms(true);
  };
  const handleCerrarExito = () => {
    setShowSuccess(false);
    // Limpiar el carrito
    if (setCartItems) {
      setCartItems([]);
    }
    // Redirigir a la tienda (menu)
    navigate('/menu');
  };
  
  const handleDescargaPDF = () => {
    setShowSuccess(false);
    // Limpiar el carrito
    if (setCartItems) {
      setCartItems([]);
    }
    // Redirigir a la tienda (menu)
    navigate('/menu');
  };
  
  // useEffect para verificar si el usuario está logueado
  useEffect(() => {
    const checkUserLogin = () => {
      const storedUserData = getUserData();
      if (storedUserData && storedUserData.id) {
        setIsUserLoggedIn(true);
        setUserData(storedUserData);
      } else {
        setIsUserLoggedIn(false);
        setUserData(null);
      }
    };

    checkUserLogin();

    // Escuchar cambios en el localStorage (por si el usuario se logea en otra pestaña)
    window.addEventListener('storage', checkUserLogin);
    
    // Escuchar evento personalizado cuando el usuario se logea
    const handleLogin = (event) => {
      if (event.detail && event.detail.userData) {
        setIsUserLoggedIn(true);
        setUserData(event.detail.userData);
        // Si estamos en modo cuenta, prellenar datos
        if (modo === 'cuenta') {
          fillUserData(event.detail.userData);
        }
      }
    };

    window.addEventListener('userLoggedIn', handleLogin);

    return () => {
      window.removeEventListener('storage', checkUserLogin);
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, [modo]);

  // Función para prellenar datos del usuario logueado
  const fillUserData = (user) => {
    if (user) {
      setCuentaData({
        nombreCompleto: user.nombre || '',
        telefono: user.telefono || user.celular || '',
        email: user.correo || user.email || '',
      });
    }
  };

  // Función para manejar el cambio a modo "cuenta"
  const handleModoChange = (newModo) => {
    if (newModo === 'cuenta') {
      if (isUserLoggedIn && userData) {
        // Si está logueado, prellenar datos
        fillUserData(userData);
        setModo(newModo);
      } else {
        // Si no está logueado, redirigir al login
        // Guardar en localStorage que el usuario quería comprar con cuenta
        localStorage.setItem('pendingPurchaseMode', 'cuenta');
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/login');
        return;
      }
    } else {
      setModo(newModo);
    }
  };

  // useEffect para manejar el regreso del login
  useEffect(() => {
    const pendingMode = localStorage.getItem('pendingPurchaseMode');
    const savedCartItems = localStorage.getItem('cartItems');
    
    if (pendingMode === 'cuenta' && isUserLoggedIn && userData) {
      // Restaurar items del carrito si es necesario
      if (savedCartItems && !cartItems.length) {
        try {
          const parsedCart = JSON.parse(savedCartItems);
          setCartItems(parsedCart);
        } catch (error) {
          // Error al restaurar carrito
        }
      }
      
      // Establecer modo cuenta y prellenar datos
      setModo('cuenta');
      fillUserData(userData);
      
      // Limpiar localStorage
      localStorage.removeItem('pendingPurchaseMode');
      localStorage.removeItem('cartItems');
    }
  }, [isUserLoggedIn, userData, cartItems, setCartItems]);

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
              </p>              {/* Toggle: Invitado / Cuenta */}
              <div className="toggle-compra">
                <button
                  className={`toggle-btn ${modo === 'invitado' ? 'activo' : ''}`}
                  onClick={() => handleModoChange('invitado')}
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
                  onClick={() => handleModoChange('cuenta')}
                >
                  <FaUserTie 
                    className={`icono-usuario ${modo === 'cuenta' ? 'active-icon' : ''}`}
                  />
                  <span className="toggle-titulo">Con una cuenta</span>
                  <span className="toggle-desc">
                    {isUserLoggedIn ? 'Datos automáticos' : 'Inicia sesión primero'}
                  </span>
                </button>
              </div>{/* Formulario de Invitado */}
              {modo === 'invitado' && (
                <div className="formulario-invitado">
                  <div className="campo">
                    <label htmlFor="nombreCompleto">Nombre completo</label>
                    <input
                      name="nombreCompleto"
                      id="nombreCompleto"
                      type="text"
                      className="input-small"
                      value={invitadoData.nombreCompleto}
                      onChange={handleInputInvitado}
                    />
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
              )}              {/* Formulario de Cuenta */}
              {modo === 'cuenta' && (
                <div className="formulario-cuenta">
                  {isUserLoggedIn && userData && (
                    <div className="cuenta-logueada-info">
                      <FaCheck className="icono-check" />
                      <span>Datos obtenidos de tu cuenta</span>
                    </div>
                  )}
                  <div className="campo">
                    <label htmlFor="nombreCompletoCuenta">Nombre completo</label>
                    <input
                      name="nombreCompleto"
                      id="nombreCompletoCuenta"
                      type="text"
                      className={`input-small ${isUserLoggedIn && userData ? 'input-readonly' : ''}`}
                      value={cuentaData.nombreCompleto}
                      onChange={handleInputCuenta}
                      readOnly={isUserLoggedIn && userData}
                      placeholder={!isUserLoggedIn ? "Inicia sesión para autocompletar" : ""}
                    />
                  </div>
                  <div className="campos-dobles">
                    <div className="campo">
                      <label htmlFor="telefonoCuenta">Teléfono</label>
                      <div className="telefono-container">
                        <span className="telefono-prefix">+503</span>
                        <span className="separador"></span>
                        {console.log(cuentaData)}
                        <input
                          name="telefono"
                          id="telefonoCuenta"
                          type="tel"
                          className={`input-telefono ${isUserLoggedIn && userData ? 'input-readonly' : ''}`}
                          placeholder={!isUserLoggedIn ? "Inicia sesión primero" : "000-0000"}
                          value={cuentaData.telefono}
                          onChange={handleInputCuenta}
                          readOnly={isUserLoggedIn && userData}
                        />
                      </div>
                    </div>
                    <div className="campo">
                      <label htmlFor="email">Correo electrónico</label>
                      <input
                        name="email"
                        id="email"
                        type="email"
                        className={`input-small ${isUserLoggedIn && userData ? 'input-readonly' : ''}`}
                        value={cuentaData.email}
                        onChange={handleInputCuenta}
                        readOnly={isUserLoggedIn && userData}
                        placeholder={!isUserLoggedIn ? "Inicia sesión para autocompletar" : ""}
                      />                    </div>
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
              <h3 className="titulo-compra">Método de entrega</h3>
              
              {/* Selección de método de entrega */}
              <div className="toggle-metodo-entrega">
                <button
                  className={`toggle-metodo-btn ${metodoEntrega === 'domicilio' ? 'activo' : ''}`}
                  onClick={() => setMetodoEntrega('domicilio')}
                >
                  <FaMotorcycle className={`icono-metodo ${metodoEntrega === 'domicilio' ? 'active-icon' : ''}`} />
                  <span>Entrega a domicilio</span>
                </button>
                <button
                  className={`toggle-metodo-btn ${metodoEntrega === 'recoger' ? 'activo' : ''}`}
                  onClick={() => setMetodoEntrega('recoger')}
                >
                  <FaStore className={`icono-metodo ${metodoEntrega === 'recoger' ? 'active-icon' : ''}`} />
                  <span>Recoger en local</span>
                </button>
              </div>

              {/* Muestra la sección de dirección solo si eligió entrega a domicilio */}
              {metodoEntrega === 'domicilio' && (
                <>
                  <h4 className="subtitulo-direccion">Dirección de entrega</h4>
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
                  </div>                  {modoDireccion === 'formulario' && (
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
                      {/* Referencias */}
                      <div className="campo">
                        <label htmlFor="referencias">Referencias (opcional)</label>
                        <input
                          type="text"
                          name="referencias"
                          id="referencias"
                          value={direccionData.referencias}
                          onChange={handleInputDireccion}
                          className="input-full"
                          placeholder="Ej: Casa azul, portón negro, frente al parque"
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
                            <option value="Usulután">Usulután</option>
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
                                    </p>                                  )}
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
                          Cobertura de entrega en Puerto el triunfo y Jiquilisco, Usulután, El Salvador
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {metodoEntrega === 'recoger' && (
                <div className="contenido-recoger-local">
                  <div className="info-local">
                    <h4>Información del local</h4>
                    <p><strong>Dirección:</strong>CP #3417, Puerto El Triunfo, EL salvador</p>
                    <p><strong>Horario:</strong> Lunes a Viernes de 10:00 AM a 07:00 PM, Sabado y Domingo de 10:00
                    a 08:00 PM</p>
                    <p><strong>Teléfono:</strong> +503 7515-5863</p>
                    <div className="nota-importante">
                      <FaExclamationTriangle className="warning-icon" />
                      <p>Tu pedido estará listo para recoger en aproximadamente 25-30 minutos</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="botones">
                <button className="btn-volver-Direccion" onClick={() => setStep('Cuenta')}>
                  Atrás
                </button>
                <button 
                  className="btn-continuar-Direccion" 
                  onClick={handleContinuar}
                  disabled={!metodoEntrega || (metodoEntrega === 'domicilio' && modoDireccion === 'tiempoReal' && !locationShared)}
                >
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
  <button
    className={`toggle-btn ${pagoMetodo === 'transferencia' ? 'activo' : ''}`}
    onClick={() => setPagoMetodo('transferencia')}
  >
    <FaCreditCard className={`icono-metodo ${pagoMetodo === 'transferencia' ? 'active-icon' : ''}`} />
    <span>Pago en línea</span>
  </button>

  <button
    className={`toggle-btn ${pagoMetodo === 'efectivo' ? 'activo' : ''}`}
    onClick={() => setPagoMetodo('efectivo')}
  >
    <FaMoneyBillWave className={`icono-metodo ${pagoMetodo === 'efectivo' ? 'active-icon' : ''}`} />
    <span>Efectivo</span>
  </button>
</div>




    {pagoMetodo === 'transferencia' && (
      <div className="detalle-pagos">
        <p>
          Serás redirigido a la plataforma segura de Wompi para completar tu pago.
        </p>
        <p>
          Acepta tarjetas de crédito, débito y Punto Agrícola.
        </p>
        <div className="nota-importante">
          <FaExclamationTriangle className="warning-icon" />
          <small>Se mostrará una confirmación con los detalles del pedido antes de redirigir.</small>
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
      <button 
        className="btn-continuar-pago" 
        onClick={handleContinuar}
        disabled={isProcessingPayment}
      >
        {isProcessingPayment ? (
          <>
            <FaSpinner className="icono-spinner" />
            Procesando pago...
          </>
        ) : (
          pagoMetodo === 'transferencia' ? 'Pagar ahora' : 'Continuar'
        )}
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
      {modo === 'invitado' ? (
        <>
          <p>{invitadoData.nombreCompleto}</p>
          <p>Teléfono: +503 {invitadoData.telefono}</p>
        </>      ) : (
        <>
          <p>{cuentaData.nombreCompleto}</p>
          <p>Email: {cuentaData.email}</p>
          <p>Teléfono: +503 {cuentaData.telefono}</p>
        </>
      )}
    </div>
    {/* Sección de Método de entrega y dirección */}
    <div className="seccion-linea">
      <h4 className="subtitulo-seccion">
        {metodoEntrega === 'recoger' ? 'Método de entrega' : 'Dirección de entrega'}
      </h4>
      
      {metodoEntrega === 'recoger' ? (
        <div className="metodo-entrega-info">
          <div className="metodo-icon-container">
            <FaStore className="metodo-icon" />
          </div>
          <div className="metodo-details">
            <p className="metodo-tipo">Recoger en local</p>
            <p>CP #3417, Puerto El Triunfo, EL salvador</p>
            <p className="metodo-tiempo">Tiempo estimado para recoger: 25-30 minutos</p>
          </div>
        </div>
      ) : (
        <>
          <div className="metodo-entrega-info">
            <div className="metodo-icon-container">
              <FaMotorcycle className="metodo-icon" />
            </div>
            <div className="metodo-details">
              <p className="metodo-tipo">Entrega a domicilio</p>              {modoDireccion === 'formulario' ? (
                <>
                  <p>{direccionData.direccionExacta}</p>
                  {direccionData.referencias && (
                    <p><small>Referencias: {direccionData.referencias}</small></p>
                  )}
                  <p>{direccionData.pais} – {direccionData.departamento} – {direccionData.municipio}</p>
                </>
              ) : (
                <>
                  {addressInfo?.formattedAddress ? (
                    <p>{addressInfo.formattedAddress}</p>
                  ) : (
                    <p>Ubicación compartida en tiempo real</p>
                  )}
                </>
              )}
              <p className="metodo-tiempo">Tiempo estimado de entrega: 45-60 minutos</p>
            </div>
          </div>
        </>
      )}
    </div>

    {/* Sección de Método de pago */}
    <div className="seccion-linea">
      <h4 className="subtitulo-seccion">Método de pago</h4>
      <div className="metodo-pago-info">
        {pagoMetodo === 'efectivo' ? (
          <div className="metodo-entrega-info">
            <div className="metodo-icon-container">
              <FaMoneyBillWave className="metodo-icon pago-icon" />
            </div>
            <div className="metodo-details">
              <p className="metodo-tipo">Efectivo al momento de {metodoEntrega === 'recoger' ? 'recoger' : 'la entrega'}</p>
            </div>
          </div>
        ) : (
          <div className="metodo-entrega-info">
            <div className="metodo-icon-container">
              <FaCreditCard className="metodo-icon pago-icon" />
            </div>
            <div className="metodo-details">
              <p className="metodo-tipo">Pago en línea con Wompi</p>
              <p><small>Tarjetas de crédito/débito y Punto Agrícola</small></p>
            </div>
          </div>
        )}
      </div>
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
              style={{
                opacity: aceptoTerminos ? 1 : 0.5,
                cursor: aceptoTerminos ? 'pointer' : 'not-allowed'
              }}
            >
              Aceptar y realizar pedido
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
