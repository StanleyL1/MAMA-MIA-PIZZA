import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import SobreNosotros from './components/SobreNosotros/sobrenosotros';
import Navbar from './components/Navbar/Navbar';
import Login from './components/auth/login/login';
import Register from './components/auth/register/register';
import Recover from './components/auth/recover/recover';
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/forgot-password" element={<Recover />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
