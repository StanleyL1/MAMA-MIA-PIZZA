import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import SobreNosotros from './components/SobreNosotros/sobrenosotros';
import Login from './components/auth/login/login';
import Register from './components/auth/register/register';
import Recover from './components/auth/recover/recover';
import Navbar from './components/Navbar';
import PideAhora from './components/PideAhora/PideAhora';
import Cart from './components/Cart/Cart';
import Services from './components/Services/Services';
import Team from './components/Team/Team';
import InformacionLegal from './components/InformacionLegal/InformacionLegal';
import Perfil from './components/Perfil/Perfil';
import SocialMediaButton from './components/socialMediaButton/SocialMediaButton';
import AdminExperiencias from './components/AdminExperiencias/AdminExperiencias';
import TestExperiencias from './components/TestExperiencias/TestExperiencias';
import { saveUserData, clearUserData } from './utils/userStorage';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  // Estado para notificaciones tipo toast
  const [toast, setToast] = useState({ show: false, message: '' });
  const [user, setUser] = useState(null); // Estado del usuario

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAddToCart = (item, masa, tamano, instrucciones, ingredientes) => {
    console.log("Añadiendo al carrito:", item); // Log para debug
    
    if (!item) {
      console.error("Error: No se puede añadir un producto indefinido");
      return;
    }
    
    // Generar un ID único para el nuevo elemento
    const newItemId = Date.now();
    
    // Crear el nuevo item con todas las propiedades necesarias
    const newItem = {
      id: newItemId,
      nombre: item.titulo || item.nombre || 'Producto',
      descripcion: item.descripcion || '',
      precio: parseFloat(item.precio) || 0,
      cantidad: 1,
      imagen: item.imagen, // Asegurar que imagen se pase correctamente
      masa,
      tamano,
      instrucciones,
      ingredientes,
      disponible: true
    };
    
    // Agregar el producto al carrito
    setCartItems(prev => [...prev, newItem]);
    
    // Abrir el carrito automáticamente cuando se añade un producto
    setIsCartOpen(true);    // Mostrar notificación breve
    setToast({ show: true, message: `✓ Agregado al carrito` });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };
  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('mamamia_user');
    const fallbackUser = localStorage.getItem('userData');
    
    let userToLoad = null;
    
    if (savedUser) {
      try {
        userToLoad = JSON.parse(savedUser);
        console.log('👤 APP - Usuario cargado desde mamamia_user:', userToLoad);
      } catch (error) {
        console.error('❌ Error al cargar usuario desde mamamia_user:', error);
        localStorage.removeItem('mamamia_user');
      }
    } else if (fallbackUser) {
      try {
        userToLoad = JSON.parse(fallbackUser);
        console.log('👤 APP - Usuario cargado desde userData (fallback):', userToLoad);
        // Sincronizar con la clave principal
        localStorage.setItem('mamamia_user', fallbackUser);
      } catch (error) {
        console.error('❌ Error al cargar usuario desde userData:', error);
        localStorage.removeItem('userData');
      }
    }
    
    if (userToLoad) {
      setUser(userToLoad);
      // Asegurar que ambas claves estén sincronizadas
      saveUserData(userToLoad);
    }
  }, []);

  // Escuchar eventos de actualización de perfil
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('📝 APP - Actualizando datos de usuario:', event.detail);
      if (event.detail && user) {
        const updatedUser = {
          ...user,
          nombre: event.detail.nombre || user.nombre,
          correo: event.detail.email || user.correo,
          telefono: event.detail.telefono || user.telefono
        };
        setUser(updatedUser);
        localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
      }
    };

    const handlePhotoUpdate = (event) => {
      console.log('📸 APP - Actualizando foto de usuario:', event.detail);
      if (event.detail && event.detail.newPhoto && user) {
        const updatedUser = {
          ...user,
          foto_perfil: event.detail.newPhoto,
          foto: event.detail.newPhoto
        };
        setUser(updatedUser);
        localStorage.setItem('mamamia_user', JSON.stringify(updatedUser));
      }
    };

    window.addEventListener('profileDataUpdated', handleProfileUpdate);
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);

    return () => {
      window.removeEventListener('profileDataUpdated', handleProfileUpdate);
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
    };
  }, [user]);
  const handleLogin = (userData) => {
    console.log('🔑 APP - Datos recibidos en handleLogin:', userData);
    setUser(userData);
    // Guardar en localStorage usando las utilidades mejoradas
    saveUserData(userData);
    console.log('✅ APP - Usuario guardado en estado y localStorage');
  };

  // Función para actualizar datos del usuario
  const updateUser = (updates) => {
    console.log('🔄 APP - Actualizando usuario:', updates);
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Usar la función mejorada de userStorage
      saveUserData(updatedUser);
      console.log('✅ APP - Usuario actualizado en estado y localStorage:', updatedUser);
    }
  };

  const handleLogout = () => {
    console.log('🚪 APP - Cerrando sesión');
    setUser(null);
    // Usar la función mejorada para limpiar datos
    clearUserData();
    console.log('✅ APP - Usuario removido del estado y localStorage');
  };

  // Función para mostrar toast desde componentes hijos
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Trigger para actualizaciones de pedidos
  const triggerOrderUpdate = () => {
    // Disparar evento para que el perfil se actualice
    window.dispatchEvent(new CustomEvent('orderCompleted'));
  };

  return (
    <BrowserRouter>
      <Navbar
        onCartToggle={handleCartToggle}
        cartItemCount={cartItems.length}
        user={user}
        onLogout={handleLogout}
     />
      <Routes>
        <Route path="/forgot-password" element={<Recover />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />        <Route path="/" element={<Home onAddToCart={handleAddToCart} user={user} />} />
        <Route path="/menu" element={<Menu onAddToCart={handleAddToCart} user={user} />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />        <Route path="/Perfil" element={
          <Perfil 
            onAddToCart={handleAddToCart} 
            user={user} 
            setUser={setUser}
            updateUser={updateUser}
            setToast={showToast}
            onOrderUpdate={triggerOrderUpdate}
          />
        } />
        <Route path="/Services" element={<Services />} />        <Route path="/pideahora" element={
          <PideAhora 
            cartItems={cartItems} 
            setCartItems={setCartItems}
            user={user}
            onOrderComplete={triggerOrderUpdate}
            setToast={showToast}
          />
        } />        <Route path="/equipo-desarrollo" element={<Team />} />
        <Route path="/informacion-legal" element={<InformacionLegal />} />
        <Route path="/admin/experiencias" element={<AdminExperiencias />} />
        <Route path="/test/experiencias" element={<TestExperiencias />} />
      </Routes>

      {/* Overlay de notificación tipo toast */}
      {toast.show && (
        <div className="toast-notification">
          <p>{toast.message}</p>
        </div>
      )}      {/* Componente Cart - Solo se renderiza si isCartOpen es true */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />

      {/* Botón flotante de redes sociales - visible en toda la aplicación */}
      <SocialMediaButton />
    </BrowserRouter>
  );
}

export default App;
