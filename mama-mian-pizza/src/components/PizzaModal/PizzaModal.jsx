import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './PizzaModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCommentDots, faStar } from '@fortawesome/free-solid-svg-icons';

function PizzaModal({ pizza, onClose, onAddToCart, user, isRecommendation = false }) {
  const [masa, setMasa] = useState('Tradicional');
  const [tamano, setTamano] = useState('Personal');
  const [instrucciones, setInstrucciones] = useState('');
  const [personalizarIngredientes, setPersonalizarIngredientes] = useState(false);

  const [activeTab, setActiveTab] = useState('pedido');
  const [reseñas, setReseñas] = useState([]);
  const [mostrarFormularioResena, setMostrarFormularioResena] = useState(false);
  const [nuevaResena, setNuevaResena] = useState({ rating: 0, comentario: '' });
  const [tamanos, setTamanos] = useState([]);
  const [precioActual, setPrecioActual] = useState(pizza?.precio || '0');
  const [cargandoTamanos, setCargandoTamanos] = useState(false);
  const [cargandoReseñas, setCargandoReseñas] = useState(false);
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const maxIngredientes = 4;
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(0);
  const [cargandoIngredientes, setCargandoIngredientes] = useState(false);
  
  // Determinar si es una pizza basado en el nombre o categoría
  const isPizza = pizza?.id_categoria === 1 || 
                 (pizza?.titulo && pizza?.titulo.toLowerCase().includes('pizza'));
                 
  // Función para obtener ingredientes disponibles para personalización
  const getAvailableIngredients = () => {
    return [
      { id: 1, nombre: 'Queso Mozzarella Extra', seleccionado: false },
      { id: 2, nombre: 'Pepperoni', seleccionado: false },
      { id: 3, nombre: 'Jamón', seleccionado: false },
      { id: 4, nombre: 'Salami', seleccionado: false },
      { id: 5, nombre: 'Champiñones', seleccionado: false },
      { id: 6, nombre: 'Pimientos', seleccionado: false },
      { id: 7, nombre: 'Cebolla Blanca', seleccionado: false },
      { id: 8, nombre: 'Aceitunas Negras', seleccionado: false },
      { id: 9, nombre: 'Tomate Cherry', seleccionado: false },
      { id: 10, nombre: 'Piña', seleccionado: false },
      { id: 11, nombre: 'Maíz Dulce', seleccionado: false },
      { id: 12, nombre: 'Tocino Ahumado', seleccionado: false }
    ];
  };
  
  // Efecto para cargar ingredientes cuando se activa personalización
  useEffect(() => {
    // Solo cargar ingredientes si es una pizza y se activa la personalización
    if (personalizarIngredientes && isPizza && ingredientes.length === 0) {
      const fetchIngredientes = async () => {
        console.log('🍕 Cargando ingredientes desde la API...');
        setCargandoIngredientes(true);
        
        try {
          const response = await fetch('https://api.mamamianpizza.com/api/pizza-ingredients/getPizzaIngredients');
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Ingredientes cargados desde API:', data);
            
            if (Array.isArray(data) && data.length > 0) {
              const ingredientesFormateados = data.map(ingrediente => ({
                id: ingrediente.id || ingrediente.id_ingrediente,
                id_ingrediente: ingrediente.id_ingrediente,
                nombre: ingrediente.nombre,
                categoria: ingrediente.categoria,
                precio_extra: parseFloat(ingrediente.precio_extra || 0),
                seleccionado: false
              }));
              
              setIngredientes(ingredientesFormateados);
              console.log('📋 Ingredientes formateados:', ingredientesFormateados);
            } else {
              console.warn('⚠️ No se encontraron ingredientes en la API');
              setIngredientes(getAvailableIngredients());
            }
          } else {
            console.error('❌ Error al cargar ingredientes:', response.status);
            setIngredientes(getAvailableIngredients());
          }
        } catch (error) {
          console.error('❌ Error de conexión al cargar ingredientes:', error);
          setIngredientes(getAvailableIngredients());
        } finally {
          setCargandoIngredientes(false);
        }
      };
      
      fetchIngredientes();
    }
  }, [personalizarIngredientes, isPizza, ingredientes.length]);

  // La función cargarFotoUsuario ya no es necesaria porque obtenemos
  // la foto directamente del endpoint de reseñas
  
  // Función para cargar reseñas desde la API
  const cargarReseñas = useCallback(async () => {
    // Determinar el ID del producto de manera robusta
    const productId = pizza?.id || pizza?.id_producto || pizza?.product_id || pizza?.ID;
    
    if (!productId) {
      console.warn('⚠️ No se encontró ID de producto para cargar reseñas');
      return;
    }
    
    setCargandoReseñas(true);
    try {
      // Usar el endpoint general de reseñas
      const response = await fetch('https://api.mamamianpizza.com/api/resenas');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Reseñas cargadas:', data);
        
        // Filtrar solo las reseñas del producto actual y que estén aprobadas
        const reseñasDelProducto = data.resenas ? data.resenas.filter(resena => 
          resena.producto.id === productId && resena.aprobada === 1
        ) : [];        // Transformar las reseñas para que coincidan con el formato esperado
        console.log(`🔄 Procesando ${reseñasDelProducto.length} reseñas para mostrar...`);
        
        const reseñasFormateadas = reseñasDelProducto.map((resena, index) => {
          console.log(`👤 Procesando reseña ${index + 1} - Usuario: ${resena.usuario.nombre} (ID: ${resena.usuario.id})`);
            // Usar la foto de perfil directamente del endpoint, o imagen por defecto
          const fotoUsuario = resena.usuario.foto_perfil || require('../../assets/perfilfoto.png');
          console.log(`🖼️ Foto para ${resena.usuario.nombre}:`, fotoUsuario);
          
          // Formatear fecha de manera más legible
          const fechaFormateada = new Date(resena.fecha_creacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          const reseñaFormateada = {
            id: resena.id_resena,
            rating: resena.valoracion,
            comentario: resena.comentario,
            nombre: resena.usuario.nombre,
            userId: resena.usuario.id,
            fecha: fechaFormateada,
            foto: fotoUsuario,
            estado: resena.estado,
            aprobada: resena.aprobada === 1
          };
            console.log(`📝 Reseña formateada:`, reseñaFormateada);
          return reseñaFormateada;
        });
          setReseñas(reseñasFormateadas);
        console.log(`📊 Total de reseñas establecidas: ${reseñasFormateadas.length}`);
        console.log(`🖼️ Fotos de reseñas:`, reseñasFormateadas.map(r => ({ 
          nombre: r.nombre, 
          foto: r.foto,
          fechaOriginal: r.fecha,
          valoracion: r.rating        })));
        
        // Log para debugging
        console.log(`📊 Reseñas encontradas para producto ${productId}:`, reseñasFormateadas.length);
      } else {
        console.log('No se pudieron cargar las reseñas:', response.status);
        setReseñas([]);
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      setReseñas([]);    } finally {
      setCargandoReseñas(false);
    }  }, [pizza]);
  
  // Función para calcular el precio basado en el multiplicador del tamaño
  const calcularPrecio = (tamanoData) => {
    if (!tamanoData || !tamanoData.precio) return '$0';
    // Asegurarnos de que el precio sea un número antes de formatearlo
    const precio = typeof tamanoData.precio === 'string' 
      ? parseFloat(tamanoData.precio) 
      : tamanoData.precio;
    return `$${precio.toFixed(0)}`;
  };

  // Función para procesar los datos de la API y obtener tamaños únicos
  const procesarTamanos = (data) => {
    const tamanosUnicos = [];
    const tamanosVistos = new Set();
    
    data.forEach(item => {
      if (!tamanosVistos.has(item.id_tamano)) {
        tamanosVistos.add(item.id_tamano);
        tamanosUnicos.push({
          id: item.id_tamano,
          nombre: item.nombre,
          indice: item.indice,
          precio: item.precio
        });
      }
    });
    console.log('Tamaños únicos procesados:', tamanosUnicos);
    return tamanosUnicos.sort((a, b) => a.indice - b.indice);
  };
  // Cargar reseñas cuando se monta el componente o cambia la pizza
  useEffect(() => {
    if (pizza && activeTab === 'resenas') {
      cargarReseñas();
    }
  }, [pizza, activeTab, cargarReseñas]);
  
  // Reiniciar formulario de reseñas cuando cambia la pizza
  useEffect(() => {
    if (pizza) {
      setNuevaResena({ rating: 0, comentario: '' });
      setMostrarFormularioResena(false);
    }
  }, [pizza]);
  
  // Actualiza el contador cuando cambian las selecciones
  useEffect(() => {
    const count = ingredientes.filter(ing => ing.seleccionado).length;
    setIngredientesSeleccionados(count);
  }, [ingredientes]);

  // Cargar tamaños y precios desde la API o del objeto del producto
  useEffect(() => {
    const fetchTamanos = async () => {
      if (!pizza) return;
      
      // Determinar si es una pizza o un producto con tamaños configurables
      const isPizzaProduct = pizza.id_categoria === 1 || 
                         (pizza.titulo && pizza.titulo.toLowerCase().includes('pizza'));
      
      // Solo cargamos tamaños de la API para pizzas
      if (isPizzaProduct) {
        setCargandoTamanos(true);
        try {
          const response = await fetch('https://api.mamamianpizza.com/api/tamanos/tamanosandprices');
          const data = await response.json();
          console.log('Datos recibidos de la API:', data);
          
          // Procesar los datos para obtener tamaños únicos
          const tamanosUnicos = procesarTamanos(data);
          console.log('Tamaños procesados:', tamanosUnicos);
          setTamanos(tamanosUnicos);
          
          // Establecer el precio inicial para el primer tamaño
          if (tamanosUnicos.length > 0) {
            const primerTamano = tamanosUnicos[0];
            setTamano(primerTamano.nombre);
            setPrecioActual(calcularPrecio(primerTamano));
          }
        } catch (error) {
          console.error('Error al cargar tamaños:', error);
          // Si falla la API, usar valores por defecto
          const defaultTamanos = [
            { id: 1, nombre: 'Personal', indice: 1, precio: '6.00' },
            { id: 2, nombre: 'Mediana', indice: 2, precio: '8.00' },
            { id: 3, nombre: 'Grande', indice: 3, precio: '10.00' },
            { id: 4, nombre: 'Gigante', indice: 4, precio: '12.00' }
          ];
          setTamanos(defaultTamanos);
          setTamano(defaultTamanos[0].nombre);
          setPrecioActual(calcularPrecio(defaultTamanos[0]));
        } finally {
          setCargandoTamanos(false);
        }
      } else {
        // Para productos que no son pizzas, si tienen opciones, las utilizamos directamente
        if (pizza.opciones && pizza.opciones.length > 0) {
          // Convertir las opciones del producto a formato de tamaños
          const opcionesTamanos = pizza.opciones.map((opcion, index) => ({
            id: opcion.tamanoId || index + 1,
            nombre: opcion.nombre,
            indice: index + 1,
            precio: opcion.precio
          }));
          
          setTamanos(opcionesTamanos);
          
          if (opcionesTamanos.length > 0) {
            setTamano(opcionesTamanos[0].nombre);
            setPrecioActual(calcularPrecio(opcionesTamanos[0]));
          }
        } else {
          // Si no tiene opciones, dejamos el array de tamaños vacío
          setTamanos([]);
          // Y ponemos el precio directo si existe
          if (pizza.precio) {
            setPrecioActual(`$${parseFloat(pizza.precio).toFixed(0)}`);
          } else {
            setPrecioActual('$0');
          }
        }
        setCargandoTamanos(false);
      }
    };

    fetchTamanos();
  }, [pizza]);

  // Actualizar precio cuando cambia el tamaño
  useEffect(() => {
    if (tamanos.length > 0) {
      const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
      if (tamanosSeleccionado) {
        setPrecioActual(calcularPrecio(tamanosSeleccionado));
      }
    } else if (pizza && pizza.opciones && pizza.opciones.length > 0) {
      // Si no hay tamaños pero hay opciones disponibles, usar el precio de la primera opción
      setPrecioActual(`$${parseFloat(pizza.opciones[0].precio).toFixed(0)}`);
    } else if (pizza && pizza.precio) {
      // Si hay precio directo en el producto
      setPrecioActual(`$${parseFloat(pizza.precio).toFixed(0)}`);
    }
  }, [tamano, tamanos, pizza]);

  // Establecer precio inicial basado en opciones cuando no hay tamaños disponibles
  useEffect(() => {
    if (pizza && (!tamanos || tamanos.length === 0)) {
      if (pizza.opciones && pizza.opciones.length > 0) {
        setPrecioActual(`$${parseFloat(pizza.opciones[0].precio).toFixed(0)}`);
      } else if (pizza.precio) {
        setPrecioActual(`$${parseFloat(pizza.precio).toFixed(0)}`);
      }
    }
  }, [pizza, tamanos]);

  // Log cuando se recibe una nueva pizza
  useEffect(() => {
    if (pizza) {
      console.log('🍕 PizzaModal recibió nueva pizza:', pizza);
      console.log('🆔 Todas las propiedades de la pizza:', Object.keys(pizza));
      console.log('🆔 pizza.id:', pizza.id);
      console.log('🆔 pizza.id_producto:', pizza.id_producto);
      console.log('🆔 pizza.product_id:', pizza.product_id);
      console.log('🆔 pizza.ID:', pizza.ID);
    }  }, [pizza]);

  // Efecto de limpieza para las URLs de blob de las fotos
  useEffect(() => {
    return () => {
      // Limpiar URLs de blob cuando el componente se desmonte
      reseñas.forEach(resena => {
        if (resena.foto && resena.foto.startsWith('blob:')) {
          URL.revokeObjectURL(resena.foto);
        }
      });
    };
  }, [reseñas]);

  if (!pizza) return null;

  const handleAddToOrder = () => {
  // Si es una pizza, incluir masa, tamaño e instrucciones, de lo contrario, enviar solo el producto
  if (isPizza) {
    const ingredientesSeleccionadosArray = personalizarIngredientes 
      ? ingredientes.filter(ing => ing.seleccionado).map(ing => ({
          nombre: ing.nombre,
          categoria: ing.categoria,
          precio_extra: ing.precio_extra || 0
        }))
      : [];
    
    // Calcular precio extra de ingredientes seleccionados
    const precioExtraIngredientes = ingredientesSeleccionadosArray.reduce((total, ing) => {
      return total + (ing.precio_extra || 0);
    }, 0);
    
    // Encontrar el precio actual del tamaño seleccionado
    const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
    // Asegurar que el precio final sea el del tamaño seleccionado actual más ingredientes extra
    const precioNumerico = precioActual.replace('$', '');
    const precioBase = tamanosSeleccionado ? parseFloat(tamanosSeleccionado.precio) : parseFloat(precioNumerico);
    const precioFinal = (precioBase + precioExtraIngredientes).toFixed(2);
    
    console.log('🍕 Precio base:', precioBase);
    console.log('🍕 Precio extra ingredientes:', precioExtraIngredientes);
    console.log('🍕 Precio final:', precioFinal);
      
    onAddToCart(
      {...pizza, precio: precioFinal}, 
      masa, 
      tamano, 
      instrucciones, 
      personalizarIngredientes ? ingredientesSeleccionadosArray : []
    );
  } else {
    // Para productos que no son pizzas pero tienen opciones de tamaño
    const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
    // Usar el precio actual que ya está calculado correctamente en el estado
    const precioNumerico = precioActual.replace('$', '');
    const precioFinal = tamanosSeleccionado ? tamanosSeleccionado.precio : precioNumerico;
      
    onAddToCart({...pizza, precio: precioFinal}, null, tamanosSeleccionado, instrucciones);
  }
  // Cerrar el modal inmediatamente
  onClose();
};

  const handleToggleMasa = (tipo) => setMasa(tipo);

  const handleTogglePersonalizar = () => {
    if (personalizarIngredientes) {
      // Al desactivar personalización, reiniciar selecciones
      setIngredientes(ingredientes.map(ing => ({ ...ing, seleccionado: false })));
      
      // Al deshabilitar la personalización, volver al precio base del tamaño actual
      const tamanosSeleccionado = tamanos.find(t => t.nombre === tamano);
      if (tamanosSeleccionado) {
        setPrecioActual(calcularPrecio(tamanosSeleccionado));
      }
    } else {
      // Si no hay ingredientes cargados, el useEffect se encargará de cargarlos
      // cuando personalizarIngredientes cambie a true
      console.log('🍕 Activando personalización de ingredientes');
    }
    
    // Cambiar el estado de personalización
    setPersonalizarIngredientes(!personalizarIngredientes);
  };

  const handleIngredienteChange = (id) => {
    const ingrediente = ingredientes.find(ing => ing.id === id);

    if (ingrediente.seleccionado) {
      setIngredientes(ingredientes.map(ing =>
        ing.id === id ? { ...ing, seleccionado: false } : ing
      ));
    } else if (ingredientesSeleccionados < maxIngredientes) {
      setIngredientes(ingredientes.map(ing =>
        ing.id === id ? { ...ing, seleccionado: true } : ing
      ));
    }
  };  const handlePublicarResena = async () => {
    // Validar que la calificación esté en el rango correcto (1-5)
    if (nuevaResena.rating < 1 || nuevaResena.rating > 5) {
      alert('Por favor, selecciona una calificación válida (1-5 estrellas)');
      return;
    }
    
    if (nuevaResena.rating > 0 && nuevaResena.comentario.trim()) {      // Verificar que el usuario esté autenticado
      if (!user || !user.id) {
        alert('Debes estar autenticado para escribir una reseña');
        return;
      }      // Verificar que la pizza tenga un ID válido usando búsqueda robusta
      const productId = pizza?.id || pizza?.id_producto || pizza?.product_id || pizza?.ID;
      
      if (!pizza || !productId) {
        console.error('❌ Pizza sin ID válido:', pizza);
        console.error('❌ Propiedades disponibles:', pizza ? Object.keys(pizza) : 'No hay objeto pizza');
        alert('Error: No se puede identificar el producto. Por favor, recarga la página.');
        return;
      }

      setEnviandoResena(true);
        try {        // Log para verificar los datos de la pizza
        console.log('🍕 Objeto pizza completo:', pizza);
        console.log('🆔 pizza.id:', pizza.id);
        console.log('🆔 productId encontrado:', productId);
        console.log('👤 user.id:', user.id);
        console.log('👤 Tipo de user.id:', typeof user.id);
        console.log('🆔 Tipo de productId:', typeof productId);
        
        // Asegurar que los IDs sean enteros
        const userId = parseInt(user.id, 10);
        const productIdInt = parseInt(productId, 10);
        const valoracionInt = parseInt(nuevaResena.rating, 10);
        
        // Validar que la conversión fue exitosa
        if (isNaN(userId) || isNaN(productIdInt) || isNaN(valoracionInt)) {
          console.error('❌ Error en conversión de tipos:');
          console.error('userId:', userId, 'isNaN:', isNaN(userId));
          console.error('productIdInt:', productIdInt, 'isNaN:', isNaN(productIdInt));
          console.error('valoracionInt:', valoracionInt, 'isNaN:', isNaN(valoracionInt));
          alert('Error: Datos de usuario o producto inválidos');
          setEnviandoResena(false);
          return;
        }
          const resenaData = {
          id_usuario: userId,
          id_producto: productIdInt,
          comentario: nuevaResena.comentario.trim(),
          valoracion: valoracionInt
        };

        // Validación final antes del envío (similar al backend)
        const missingFields = [];
        if (!resenaData.id_usuario) missingFields.push('id_usuario');
        if (!resenaData.id_producto) missingFields.push('id_producto');
        if (!resenaData.comentario) missingFields.push('comentario');
        if (resenaData.valoracion === undefined || resenaData.valoracion === null || resenaData.valoracion === '') missingFields.push('valoracion');
        
        if (missingFields.length > 0) {
          console.error('❌ Campos faltantes detectados:', missingFields);
          console.error('❌ Datos actuales:', resenaData);
          alert(`Error: Faltan campos requeridos: ${missingFields.join(', ')}`);
          setEnviandoResena(false);
          return;
        }
        
        // Validar rango de valoración
        if (resenaData.valoracion < 1 || resenaData.valoracion > 5) {
          console.error('❌ Valoración fuera de rango:', resenaData.valoracion);
          alert('Error: La valoración debe estar entre 1 y 5 estrellas');
          setEnviandoResena(false);
          return;
        }

        console.log('📝 Enviando reseña con tipos correctos:', resenaData);
        console.log('📝 Tipos de datos:', {
          id_usuario: typeof resenaData.id_usuario,
          id_producto: typeof resenaData.id_producto,
          comentario: typeof resenaData.comentario,
          valoracion: typeof resenaData.valoracion
        });
        console.log('⭐ Rating seleccionado por el usuario:', nuevaResena.rating, 'estrellas');

        const response = await fetch('https://api.mamamianpizza.com/api/resenas/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resenaData)
        });        if (response.ok) {
          const data = await response.json();
          console.log('✅ Reseña creada exitosamente:', data);
          
          // Recargar todas las reseñas desde el endpoint para obtener datos actualizados
          await cargarReseñas();
          
          // Limpiar formulario
          setNuevaResena({ rating: 0, comentario: '' });
          setMostrarFormularioResena(false);
          
          // Mostrar mensaje de éxito
          alert('¡Reseña publicada exitosamente! Tu reseña será visible una vez que sea aprobada por nuestro equipo.');} else {
          const errorData = await response.json();
          console.error('❌ Error al crear reseña:', errorData);
          console.error('❌ Status:', response.status);
          console.error('❌ Response completa:', response);
          
          // Mostrar mensaje de error específico basado en el backend
          if (response.status === 400) {
            if (errorData.campos_faltantes) {
              alert(`Error: Faltan campos requeridos: ${errorData.campos_faltantes.join(', ')}\n\nDatos enviados: ${JSON.stringify(errorData.datos_recibidos, null, 2)}`);
            } else {
              alert(errorData.message || 'Datos inválidos enviados al servidor');
            }
          } else if (response.status === 409) {
            alert('Ya has escrito una reseña para este producto');
          } else if (response.status === 404) {
            alert('Usuario o producto no encontrado');
          } else {
            alert(`Error ${response.status}: ${errorData.message || 'Error al publicar la reseña'}`);
          }
        }
      } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('Error de conexión. Por favor, intenta nuevamente.');
      } finally {
        setEnviandoResena(false);
      }
    } else {
      alert('Por favor, selecciona una calificación y escribe un comentario');
    }
  };
  // Función para manejar la selección de estrellas de manera robusta
  const handleStarClick = (rating) => {
    // Asegurar que el rating esté en el rango válido
    if (rating >= 1 && rating <= 5) {
      console.log(`⭐ Usuario seleccionó ${rating} estrellas`);
      setNuevaResena(prev => ({ ...prev, rating: rating }));
    } else {
      console.warn('⚠️ Rating inválido seleccionado:', rating);
    }
  };

  // Función para abrir el formulario de reseña con validación de autenticación
  const handleOpenReviewForm = () => {
    if (!user || !user.id) {
      setShowAuthAlert(true);
      return;
    }
    setMostrarFormularioResena(true);
  };

  // Función para cerrar el modal de autenticación
  const handleCloseAuthAlert = () => {
    setShowAuthAlert(false);
  };



  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className={`modal__content ${activeTab === 'resenas' ? 'modal__full-white' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >        <button className="modal__close-button" onClick={onClose}>×</button>

        {activeTab === 'pedido' ? (
          // Vista de pedido
          <div className="modal__pedido-container">            {/* Imagen de la pizza */}
            <div className={`modal__image-section ${isRecommendation ? 'modal__image-section--recommendation' : ''}`}>
              <img src={pizza.imagen} alt={pizza.titulo} className="modal__pizza-image" />
            </div>

            {/* Contenido del pedido */}
            <div className="modal__content-section">
              {/* Header con título y tabs */}
              <div className="modal__header">
                <h2 className="modal__pizza-title">{pizza.titulo}</h2>
                <div className="modal__tabs">
                  <button
                    className={`modal__tab ${activeTab === 'pedido' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pedido')}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    Realizar Pedido
                  </button>
                  <button
                    className={`modal__tab ${activeTab === 'resenas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('resenas')}
                  >
                    <FontAwesomeIcon icon={faStar} />
                    Reseñas
                  </button>
                </div>
              </div>              {/* Formulario de opciones */}
              <div className="modal__form-section">
                {isPizza && (
                  <>
                    <div className="modal__option-group">
                      <label className="modal__option-label">Tipo de masa</label>
                      <div className="modal__option-toggle">
                        <button 
                          className={`modal__toggle-button ${masa === 'Delgada' ? 'modal__active' : ''}`} 
                          onClick={() => handleToggleMasa('Delgada')}
                        >
                          Delgada
                        </button>
                        <button 
                          className={`modal__toggle-button ${masa === 'Tradicional' ? 'modal__active' : ''}`} 
                          onClick={() => handleToggleMasa('Tradicional')}
                        >
                          Tradicional
                        </button>
                      </div>
                    </div>
                    
                    <div className="modal__option-group">
                      <div className="modal__personalizar-wrapper">
                        <label className="modal__option-label">Personalizar ingredientes</label>
                        <div className="modal__toggle-slider-wrapper">
                          <label className="modal__toggle-slider">
                            <input type="checkbox" checked={personalizarIngredientes} onChange={handleTogglePersonalizar} />
                            <span className="modal__slider"></span>
                          </label>
                          <span className="modal__cambios-counter">{ingredientesSeleccionados}/{maxIngredientes} ingredientes</span>
                        </div>
                      </div>
                      {personalizarIngredientes && (
                        <div className="modal__ingredientes-section">
                          <div className="modal__ingredientes-hint">
                            {ingredientesSeleccionados === maxIngredientes
                              ? "Has alcanzado el máximo de 4 ingredientes"
                              : `Selecciona hasta ${maxIngredientes} ingredientes`}
                          </div>
                          <div className="modal__ingredientes-container">
                            {cargandoIngredientes ? (
                              <div style={{ textAlign: 'center', padding: '15px 0', width: '100%' }}>
                                <p style={{ color: '#666', fontSize: '14px' }}>
                                  Cargando ingredientes desde la base de datos...
                                </p>
                              </div>
                            ) : ingredientes.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '15px 0', width: '100%' }}>
                                <p style={{ color: '#666', fontSize: '14px' }}>
                                  No hay ingredientes disponibles para personalización
                                </p>
                              </div>
                            ) : (
                              ingredientes.map(ingrediente => (
                                <div key={ingrediente.id} className="modal__ingrediente-item">
                                  <label className={`modal__checkbox-container ${!ingrediente.seleccionado && ingredientesSeleccionados >= maxIngredientes ? 'modal__disabled' : ''}`}>
                                    <input
                                      type="checkbox"
                                      checked={ingrediente.seleccionado}
                                      onChange={() => handleIngredienteChange(ingrediente.id)}
                                      disabled={!ingrediente.seleccionado && ingredientesSeleccionados >= maxIngredientes}
                                    />
                                    <span className="modal__checkbox-custom"></span>
                                    <span style={{ flex: 1 }}>{ingrediente.nombre}</span>
                                    {ingrediente.precio_extra && parseFloat(ingrediente.precio_extra) > 0 && (
                                      <span style={{ 
                                        color: '#991B1B', 
                                        fontSize: '12px', 
                                        fontWeight: '600',
                                        marginLeft: '8px'
                                      }}>
                                        +${parseFloat(ingrediente.precio_extra).toFixed(0)}
                                      </span>
                                    )}
                                  </label>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {/* Sección de tamaños */}
                {tamanos && tamanos.length > 0 && (
                  <div className="modal__option-group">
                    <label className="modal__option-label">Tamaño</label>
                    <select 
                      value={tamano} 
                      onChange={(e) => setTamano(e.target.value)}
                      className="modal__custom-select"
                    >
                      {tamanos.map(t => (
                        <option key={t.id} value={t.nombre}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="modal__option-group">
                  <label className="modal__option-label">Instrucciones especiales</label>
                  <textarea
                    className="modal__instrucciones-input"
                    placeholder="Ej: Poco queso, bien cocida, sin cebolla..."
                    value={instrucciones}
                    onChange={(e) => setInstrucciones(e.target.value)}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="modal__description-section">
                <h3 className="modal__desc-title">Descripción</h3>
                <p className="modal__pizza-description">{pizza.descripcion}</p>
              </div>

              {/* Footer con precio y botón */}
              <div className="modal__footer">
                <div className="modal__price-section">
                  <span className="modal__price-label">Precio total</span>
                  <span className="modal__pizza-price">
                    {cargandoTamanos ? 'Cargando...' : precioActual}
                  </span>
                </div>
                <button className="modal__add-button" onClick={handleAddToOrder}>
                  <FontAwesomeIcon icon={faCartShopping} />
                  Añadir a mi orden
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Vista de reseñas
          <div className="modal__resenas-container">
            <div className="modal__resenas-header">
              <h2 className="modal__pizza-title">{pizza.titulo}</h2>
              <div className="modal__tabs">
                <button
                  className={`modal__tab ${activeTab === 'pedido' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pedido')}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  Realizar Pedido
                </button>
                <button
                  className={`modal__tab ${activeTab === 'resenas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resenas')}
                >
                  <FontAwesomeIcon icon={faStar} />
                  Reseñas
                </button>
              </div>
            </div>              <div className="reseñas__container">
              {/* Estado de carga */}
              {cargandoReseñas && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Cargando reseñas...</p>
                </div>              )}

              {/* Formulario o botón */}
              {mostrarFormularioResena ? (
                <>
                  <div className="reseñas__form-card">
                    <div className="reseñas__form-title">
                      Escribe tu reseña
                    </div>                    <div className="reseñas__form-field">
                      <label className="reseñas__form-label">Calificación</label>
                      <div className="reseñas__form-stars">                        {[1,2,3,4,5].map((star) => (
                          <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            className={`reseñas__form-star${nuevaResena.rating >= star ? " selected" : ""}`}
                            onClick={() => handleStarClick(star)}
                            style={{ cursor: "pointer" }}
                          />
                        ))}
                      </div>
                      {nuevaResena.rating > 0 && (
                        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                          Calificación seleccionada: {nuevaResena.rating} {nuevaResena.rating === 1 ? 'estrella' : 'estrellas'}
                        </div>
                      )}
                    </div>
                    <div className="reseñas__form-field">
                      <label className="reseñas__form-label">Comentario</label>
                      <textarea
                        className="reseñas__form-textarea"
                        placeholder="Comparte tu experiencia con esta pizza..."
                        value={nuevaResena.comentario}
                        onChange={e => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
                        rows={3}
                      />
                    </div>                    <div className="reseñas__form-actions">
                      <button
                        className="reseñas__form-btn reseñas__form-btn--red"
                        type="button"
                        onClick={handlePublicarResena}
                        disabled={enviandoResena}
                      >
                        {enviandoResena ? 'Publicando...' : 'Publicar reseña'}
                      </button>
                      <button
                        className="reseñas__form-btn"
                        type="button"
                        onClick={() => setMostrarFormularioResena(false)}
                        disabled={enviandoResena}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </>              ) : reseñas.length === 0 && !cargandoReseñas ? (
                <>
                  {/* Estado vacío de reseñas */}
                  <div className="reseñas__clientes-titulo">
                    Reseñas de clientes
                  </div>
                  <div className="reseñas__empty">
                    <div className="reseñas__empty-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" fill="none" viewBox="0 0 58 58" style={{opacity:0.18}}>
                        <circle cx="29" cy="29" r="28" stroke="#414141" strokeWidth="2" fill="none"/>
                        <path d="M39 22l-10 10-6-6" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="reseñas__empty-text">
                      <h3 style={{margin: 0, marginBottom: 8, fontSize: 18, color: '#333'}}>
                        No hay reseñas aprobadas aún
                      </h3>
                      <p style={{margin: 0, color: '#666', fontSize: 14, lineHeight: 1.4}}>
                        Solo se muestran las reseñas que han sido verificadas y aprobadas por nuestro equipo.
                        <br />
                        ¡Sé el primero en dejar una reseña de este producto!
                      </p>                    </div>
                  </div>                  {user && user.id ? (
                    <button 
                      className="reseñas__empty-btn" 
                      onClick={handleOpenReviewForm}
                      style={{
                        backgroundColor: '#991B1B',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FontAwesomeIcon icon={faCommentDots} />
                      Escribir primera reseña
                    </button>
                  ) : (
                    <button 
                      className="reseñas__empty-btn" 
                      onClick={handleOpenReviewForm}
                      style={{
                        backgroundColor: '#991B1B',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FontAwesomeIcon icon={faCommentDots} />
                      Escribir primera reseña
                    </button>
                  )}
                </>
              ) : null}              {/* Mostrar reseñas ya publicadas */}
              {!cargandoReseñas && reseñas.length > 0 && (
                <div className="reseñas__lista">
                  {console.log(`🎨 Renderizando ${reseñas.length} reseñas:`, reseñas.map(r => ({ nombre: r.nombre, foto: r.foto })))}                  <div className="reseñas__clientes-titulo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Reseñas de clientes</span>
                    {!mostrarFormularioResena && (
                      <button 
                        className="reseñas__empty-btn" 
                        style={{ fontSize: '14px', padding: '8px 16px' }}
                        onClick={handleOpenReviewForm}
                      >
                        <FontAwesomeIcon icon={faCommentDots} style={{marginRight: 6}} />
                        Escribir reseña
                      </button>
                    )}
                  </div>{reseñas.map((resena, i) => (
                    <div key={resena.id || i} className="reseñas__review">
                      {/* Foto de perfil del usuario con mejores estilos */}
                      <div className="reseñas__user-avatar">
                        <img
                          src={resena.foto || require('../../assets/perfilfoto.png')}
                          alt={`Foto de perfil de ${resena.nombre || "Usuario"}`}
                          className="reseñas__review-foto"
                          style={{
                            width: 55, 
                            height: 55, 
                            borderRadius: "50%", 
                            objectFit: "cover", 
                            border: "3px solid #FEB248",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            backgroundColor: "#f8f9fa"
                          }}
                          onError={(e) => {
                            console.log(`❌ Error cargando imagen para ${resena.nombre}:`, e.target.src);
                            e.target.src = require('../../assets/perfilfoto.png');
                          }}
                          onLoad={(e) => {
                            console.log(`✅ Imagen cargada correctamente para ${resena.nombre}:`, e.target.src);
                            e.target.style.opacity = '1';
                          }}
                          onLoadStart={(e) => {
                            console.log(`🔄 Iniciando carga de imagen para ${resena.nombre}:`, e.target.src);
                            e.target.style.opacity = '0.7';
                          }}
                        />
                      </div>
                        {/* Contenido de la reseña */}
                      <div className="reseñas__review-content" style={{ flex: 1, marginLeft: 15 }}>
                        {/* Header con nombre y fecha */}
                        <div className="reseñas__review-header">
                          <div className="reviewer-name">
                            {resena.nombre}
                          </div>
                          <div className="review-date">
                            {resena.fecha}
                          </div>
                        </div>
                        
                        {/* Estrellas de calificación */}
                        <div className="reseñas__rating">
                          {[1,2,3,4,5].map(star => (
                            <FontAwesomeIcon
                              key={star}
                              icon={faStar}
                              className="reseñas__review-star"
                              style={{ 
                                color: resena.rating >= star ? "#eab308" : "#d1d5db", 
                                fontSize: 16
                              }}
                            />
                          ))}
                          <span className="reseñas__rating-text">
                            {resena.rating}/5
                          </span>
                        </div>
                        
                        {/* Comentario */}
                        <div className="reseñas__review-comment">
                          {resena.comentario}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>          </div>
        )}
      </div>

      {/* Modal de Autenticación Requerida */}
      {showAuthAlert && (
        <div className="modal__overlay" onClick={handleCloseAuthAlert}>
          <div className="auth__alert__modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth__alert__icon">🔒</div>
            <h2 className="auth__alert__title">¡Regístrate para continuar!</h2>
            <p className="auth__alert__message">
              Para compartir tu experiencia y calificar nuestro servicio, necesitas tener una cuenta.
            </p>
            <div className="auth__alert__buttons">
              <button className="auth__cancel__button" onClick={handleCloseAuthAlert}>
                Ahora no
              </button>
              <Link to="/register" className="auth__register__button">
                Crear cuenta
              </Link>
            </div>
            <p className="auth__login__text">
              ¿Ya tienes cuenta? <Link to="/login" className="auth__login__link">Accede aquí</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PizzaModal;