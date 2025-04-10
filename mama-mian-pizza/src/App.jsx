import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Cart from './components/Cart/Cart';
import SobreNosotros from './components/SobreNosotros/sobrenosotros';
import Navbar from './components/Navbar/Navbar';
import Login from './components/auth/login/login';
import Register from './components/auth/register/register';
import Services from './components/Services/Services';
import Recover from './components/auth/recover/recover';
import PideAhora from './components/PideAhora/PideAhora';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <BrowserRouter>
      <Navbar onCartToggle={handleCartToggle} />
      <Routes>
        <Route path="/forgot-password" element={<Recover />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pideahora" element={<PideAhora />} />
      </Routes>
      {isCartOpen && <Cart isOpen={isCartOpen} onClose={handleCartToggle} />}
    </BrowserRouter>
  );
}

export default App;
