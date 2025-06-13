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

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  // Estado para notificaciones tipo toast
  const [toast, setToast] = useState({ show: false, message: '' });

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
const [user, setUser] = useState(null); // Estado del usuario

// Cargar usuario desde localStorage al iniciar la app
useEffect(() => {
  const savedUser = localStorage.getItem('mamamia_user');
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      console.log('👤 APP - Usuario cargado desde localStorage:', parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('❌ Error al cargar usuario desde localStorage:', error);
      localStorage.removeItem('mamamia_user');
    }
  }
}, []);

const handleLogin = (userData) => {
  console.log('🔑 APP - Datos recibidos en handleLogin:', userData);
  setUser(userData);
  // Guardar en localStorage para persistencia
  localStorage.setItem('mamamia_user', JSON.stringify(userData));
  console.log('✅ APP - Usuario guardado en estado y localStorage');
};

const handleLogout = () => {
  console.log('🚪 APP - Cerrando sesión');
  setUser(null);
  localStorage.removeItem('mamamia_user');
  console.log('✅ APP - Usuario removido del estado y localStorage');
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
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/menu" element={<Menu onAddToCart={handleAddToCart} />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route path="/Perfil" element={<Perfil onAddToCart={handleAddToCart} user={user} />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/pideahora" element={<PideAhora cartItems={cartItems} />} />
        <Route path="/equipo-desarrollo" element={<Team />} />
        <Route path="/informacion-legal" element={<InformacionLegal />} />
      </Routes>

      {/* Overlay de notificación tipo toast */}
      {toast.show && (
        <div className="toast-notification">
          <p>{toast.message}</p>
        </div>
      )}

      {/* Componente Cart - Solo se renderiza si isCartOpen es true */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </BrowserRouter>
  );
}

export default App;
