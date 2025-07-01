import React, { useState, useEffect, useCallback } from 'react';
import './PideAhora.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
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
  FaStore,
  FaShieldAlt
} from 'react-icons/fa';

// Función auxiliar para obtener datos del usuario del localStorage
const getUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

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
  
  const navigate = useNavigate();
  
  const [step, setStep] = useState('Cuenta');
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderCode, setOrderCode] = useState('');
  
  // Estados para datos de tarjeta
  const [tarjetaData, setTarjetaData] = useState({
    numeroTarjeta: '',
    cvv: '',
    mesVencimiento: '',
    anioVencimiento: ''
  });


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

  const handleInputTarjeta = (e) => {
    const { name, value } = e.target;
    
    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    if (name === 'numeroTarjeta') {
      const formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.replace(/\s/g, '').length <= 16) {
        setTarjetaData({
          ...tarjetaData,
          [name]: formattedValue,
        });
      }
    }
    // Formatear CVV (máximo 4 dígitos)
    else if (name === 'cvv') {
      if (value.length <= 4 && /^\d*$/.test(value)) {
        setTarjetaData({
          ...tarjetaData,
          [name]: value,
        });
      }
    }
    // Formatear mes (máximo 2 dígitos, 01-12)
    else if (name === 'mesVencimiento') {
      if (value.length <= 2 && /^\d*$/.test(value)) {
        const monthValue = parseInt(value);
        if (value === '' || (monthValue >= 1 && monthValue <= 12)) {
          setTarjetaData({
            ...tarjetaData,
            [name]: value,
          });
        }
      }
    }
    // Formatear año (4 dígitos)
    else if (name === 'anioVencimiento') {
      if (value.length <= 4 && /^\d*$/.test(value)) {
        setTarjetaData({
          ...tarjetaData,
          [name]: value,
        });
      }
    }
    else {
      setTarjetaData({
        ...tarjetaData,
        [name]: value,
      });
    }
  };

  // Función para detectar tipo de tarjeta
  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) {
      return 'visa';
    } else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
      return 'mastercard';
    } else if (/^3[47]/.test(cleanNumber)) {
      return 'amex';
    }
    
    return '';
  };





  // Función para procesar pedido normal (efectivo)
  const procesarPedidoNormal = async (pedidoData) => {
    try {
      console.log('📤 ENVIANDO AL BACKEND - Datos completos:', pedidoData);
      console.log('📤 ENVIANDO AL BACKEND - Método de pago específico:', pedidoData.metodo_pago);
      
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
      throw error;
    }
  };

  // Función para procesar pago con tarjeta
  const procesarPagoConTarjeta = async () => {
    try {
      setIsSubmitting(true);
      setOrderError('');

      // Preparar datos del cliente según el modo
      const clienteData = modo === 'invitado' 
        ? {
            nombre: invitadoData.nombreCompleto,
            telefono: invitadoData.telefono,
            email: '', // Email vacío para invitados
            direccion: metodoEntrega === 'domicilio' 
              ? (modoDireccion === 'formulario' 
                  ? direccionData.direccionExacta 
                  : addressInfo?.formattedAddress || "Ubicación en tiempo real")
              : "CP #3417, Puerto El Triunfo, EL salvador"
          }
        : {
            nombre: cuentaData.nombreCompleto,
            telefono: cuentaData.telefono,
            email: cuentaData.email,
            direccion: metodoEntrega === 'domicilio' 
              ? (modoDireccion === 'formulario' 
                  ? direccionData.direccionExacta 
                  : addressInfo?.formattedAddress || "Ubicación en tiempo real")
              : "CP #3417, Puerto El Triunfo, EL salvador"
          };

      // Preparar datos de la tarjeta
      const tarjetaDataClean = {
        numeroTarjeta: tarjetaData.numeroTarjeta.replace(/\s/g, ''),
        cvv: tarjetaData.cvv,
        mesVencimiento: parseInt(tarjetaData.mesVencimiento),
        anioVencimiento: parseInt(tarjetaData.anioVencimiento)
      };

      // Preparar productos con el formato requerido
      const productosData = cartItems.map(item => ({
        id_producto: item.id,
        id_tamano: item.tamanoId || 2, // Default a mediana si no hay tamaño específico
        cantidad: parseInt(item.cantidad),
        precio_unitario: parseFloat(item.precio),
        observaciones: [
          item.masa ? `Masa: ${item.masa}` : '',
          item.tamano ? `Tamaño: ${item.tamano}` : '',
          item.instrucciones ? `Instrucciones: ${item.instrucciones}` : ''
        ].filter(Boolean).join(', ') || ""
      }));

      // Calcular descuento (si aplica)
      const descuento = 0.00; // Por ahora sin descuentos

      // Preparar el payload completo
      const paymentData = {
        cliente: clienteData,
        tarjeta: tarjetaDataClean,
        productos: productosData,
        tipo_entrega: metodoEntrega === 'domicilio' ? 'domicilio' : 'recoger',
        observaciones_generales: direccionData.referencias || "",
        descuento: descuento,
        metodo_pago: 'tarjeta'  // Especificar que es pago con tarjeta
      };

      console.log('🔴 DEBUG PAGO TARJETA - Método de pago configurado:', 'tarjeta');
      console.log('🔴 DEBUG PAGO TARJETA - PaymentData completo:', paymentData);
      console.log('🔴 DEBUG PAGO TARJETA - Campo metodo_pago específico:', paymentData.metodo_pago);

      // Enviar al endpoint de pagos
      const response = await fetch('https://api.mamamianpizza.com/api/payments/process-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        
        if (result.success && result.data && result.data.instructions && result.data.instructions.redirectUrl) {
          // El backend devolvió la URL de pago de Wompi
          console.log('Redirigiendo a Wompi:', result.data.instructions.redirectUrl);
          
          // Guardar datos temporalmente para recuperar después del pago
          const tempOrderData = {
            transactionId: result.data.transactionId,
            monto: result.data.monto,
            cartItems: cartItems,
            pedidoStatus: result.data.pedidoStatus,
            metodo_pago: 'tarjeta',  // Especificar que es pago con tarjeta
            timestamp: Date.now()
          };
          
          localStorage.setItem('tempOrderData', JSON.stringify(tempOrderData));
          
          // Redirigir a la URL de pago de Wompi
          window.location.href = result.data.instructions.redirectUrl;
          
        } else {
          // El pago falló en el procesamiento inicial
          console.error('Error en el procesamiento inicial:', result);
          
          // Redirigir a página de fallo con parámetros
          const failureParams = new URLSearchParams({
            transaction_id: result.data?.transactionId || 'unknown',
            order_id: 'unknown',
            error_code: 'PROCESSING_ERROR',
            error_message: result.message || 'Error en el procesamiento inicial del pago'
          });
          
          window.location.href = `/payment/failure?${failureParams.toString()}`;
        }
      } else {
        // Error HTTP del servidor
        const errorResult = await response.json();
        console.error('Error HTTP al procesar el pago:', errorResult);
        
        // Redirigir a página de fallo
        const failureParams = new URLSearchParams({
          transaction_id: 'unknown',
          order_id: 'unknown', 
          error_code: `HTTP_${response.status}`,
          error_message: errorResult.message || `Error del servidor: ${response.status}`
        });
        
        window.location.href = `/payment/failure?${failureParams.toString()}`;
      }
    } catch (error) {
      console.error('Error en el procesamiento del pago:', error);
      
      // Redirigir a página de fallo por error de conexión
      const failureParams = new URLSearchParams({
        transaction_id: 'unknown',
        order_id: 'unknown',
        error_code: 'NETWORK_ERROR',
        error_message: 'Error de conexión al procesar el pago'
      });
      
      window.location.href = `/payment/failure?${failureParams.toString()}`;
    } finally {
      setIsSubmitting(false);
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
  const handleContinuar = () => {
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
      
      // Validar datos de tarjeta si es pago con tarjeta
      if (pagoMetodo === 'tarjeta') {
        if (!tarjetaData.numeroTarjeta || !tarjetaData.cvv || !tarjetaData.mesVencimiento || !tarjetaData.anioVencimiento) {
          alert('Por favor completa todos los datos de la tarjeta.');
          return;
        }
        
        // Validaciones adicionales
        const numeroTarjeta = tarjetaData.numeroTarjeta.replace(/\s/g, '');
        if (numeroTarjeta.length < 15 || numeroTarjeta.length > 16) {
          alert('El número de tarjeta debe tener entre 15 y 16 dígitos.');
          return;
        }
        
        if (tarjetaData.cvv.length < 3 || tarjetaData.cvv.length > 4) {
          alert('El CVV debe tener entre 3 y 4 dígitos.');
          return;
        }
        
        const mes = parseInt(tarjetaData.mesVencimiento);
        const anio = parseInt(tarjetaData.anioVencimiento);
        const fechaActual = new Date();
        const anioActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth() + 1;
        
        if (mes < 1 || mes > 12) {
          alert('El mes de vencimiento debe estar entre 01 y 12.');
          return;
        }
        
        if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
          alert('La tarjeta está vencida.');
          return;
        }
        
        if (anio < 2024 || anio > 2040) {
          alert('El año de vencimiento no es válido.');
          return;
        }
      }
      
      setStep('Confirmar');
    }
  };
  // Función para enviar el pedido según el método de pago
  const enviarPedido = async () => {
    console.log('🚀 INICIANDO ENVIO DE PEDIDO');
    console.log('🚀 Método de pago seleccionado:', pagoMetodo);
    
    if (!pagoMetodo) {
      alert('Por favor selecciona un método de pago.');
      return;
    }
    
    if (pagoMetodo === 'tarjeta') {
      // Procesar pago con tarjeta usando el nuevo endpoint
      await procesarPagoConTarjeta();
    } else {
      // Procesar pedido normal para pagos en efectivo
      setIsSubmitting(true);
      setOrderError('');
      
      try {
        // Construir objeto con la estructura esperada por el backend para efectivo
        const pedidoData = {
          tipo_cliente: modo === 'invitado' ? 'invitado' : 'registrado',
          cliente: modo === 'invitado'
            ? { 
                nombre: invitadoData.nombreCompleto,
                telefono: invitadoData.telefono
              }
            : {
                nombre: cuentaData.nombreCompleto,
                telefono: cuentaData.telefono,
                email: cuentaData.email
              },
          
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
                tipo_direccion: 'formulario',
                direccion: "CP #3417, Puerto El Triunfo, EL salvador",
                referencias: "Local principal",
                pais: "El Salvador",
                departamento: "Usulután",
                municipio: "Jiquilisco"
              },
          
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
          
          metodo_pago: pagoMetodo,
          subtotal: parseFloat(cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)),
          costo_envio: 0.00,
          total: parseFloat(cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)),
          
          aceptado_terminos: true,
          tiempo_estimado_entrega: metodoEntrega === 'domicilio' ? 30 : 25
        };
        
        console.log('🟡 DEBUG PAGO EFECTIVO - Variable pagoMetodo:', pagoMetodo);
        console.log('🟡 DEBUG PAGO EFECTIVO - PedidoData completo:', pedidoData);
        console.log('🟡 DEBUG PAGO EFECTIVO - Campo metodo_pago específico:', pedidoData.metodo_pago);
        
        await procesarPedidoNormal(pedidoData);
      } catch (error) {
        console.error('Error en enviarPedido:', error);
      } finally {
        setIsSubmitting(false);
      }
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
        className={`toggle-btn ${pagoMetodo === 'tarjeta' ? 'activo' : ''}`}
        onClick={() => setPagoMetodo('tarjeta')}
      >
        <FaCreditCard className={`icono-metodo ${pagoMetodo === 'tarjeta' ? 'active-icon' : ''}`} />
        <span>Pago con tarjeta</span>
      </button>

      <button
        className={`toggle-btn ${pagoMetodo === 'efectivo' ? 'activo' : ''}`}
        onClick={() => setPagoMetodo('efectivo')}
      >
        <FaMoneyBillWave className={`icono-metodo ${pagoMetodo === 'efectivo' ? 'active-icon' : ''}`} />
        <span>Efectivo</span>
      </button>
    </div>

    {pagoMetodo === 'tarjeta' && (
      <div className="detalle-pago">
        <h4 className="subtitulo-pago">Datos de la tarjeta</h4>
        <div className="form-tarjeta">
          <div className="campo">
            <label htmlFor="numeroTarjeta">Número de tarjeta</label>
            <input
              name="numeroTarjeta"
              id="numeroTarjeta"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={tarjetaData.numeroTarjeta}
              onChange={handleInputTarjeta}
              className={`input-tarjeta ${detectCardType(tarjetaData.numeroTarjeta)}`}
              maxLength="19"
            />
            {detectCardType(tarjetaData.numeroTarjeta) && (
              <div className="card-type">
                {detectCardType(tarjetaData.numeroTarjeta).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="fila-tarjeta">
            <div className="campo">
              <label htmlFor="mesVencimiento">Mes</label>
              <input
                name="mesVencimiento"
                id="mesVencimiento"
                type="text"
                placeholder="MM"
                value={tarjetaData.mesVencimiento}
                onChange={handleInputTarjeta}
                className="input-small"
                maxLength="2"
              />
            </div>
            
            <div className="campo">
              <label htmlFor="anioVencimiento">Año</label>
              <input
                name="anioVencimiento"
                id="anioVencimiento"
                type="text"
                placeholder="YYYY"
                value={tarjetaData.anioVencimiento}
                onChange={handleInputTarjeta}
                className="input-small"
                maxLength="4"
              />
            </div>
            
            <div className="campo">
              <label htmlFor="cvv">CVV</label>
              <input
                name="cvv"
                id="cvv"
                type="text"
                placeholder="123"
                value={tarjetaData.cvv}
                onChange={handleInputTarjeta}
                className="input-small"
                maxLength="4"
              />
            </div>
          </div>
          
          <div className="seguridad-info">
            <FaShieldAlt className="icono-seguridad" />
            <span>Procesado de forma segura por nuestro sistema de pagos.</span>
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
      <button 
        className="btn-volver-Direccion" 
        onClick={() => setStep('Dirección')}
      >
        Atrás
      </button>
      <button 
        className="btn-continuar-pago" 
        onClick={handleContinuar}
        disabled={!pagoMetodo}
      >
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
              <p className="metodo-tipo">Pago con tarjeta</p>
              <p>Tarjeta terminada en {tarjetaData.numeroTarjeta.slice(-4)}</p>
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
            
            {orderError && (
              <div className="error-message">
                <p>{orderError}</p>
              </div>
            )}
            
            <button
              className="btn-aceptar"
              onClick={handleAceptarTerminos}
              disabled={!aceptoTerminos || isSubmitting}
              style={{
                opacity: (aceptoTerminos && !isSubmitting) ? 1 : 0.5,
                cursor: (aceptoTerminos && !isSubmitting) ? 'pointer' : 'not-allowed'
              }}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  Procesando...
                </>
              ) : (
                'Aceptar y realizar pedido'
              )}
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
      <p>Tu pedido #{orderCode || '78657'} ha sido recibido y está siendo procesado.</p>
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
    </div>
  );
};

export default PideAhora ;
