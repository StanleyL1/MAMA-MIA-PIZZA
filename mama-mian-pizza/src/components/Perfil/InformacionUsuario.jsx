import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import perfilFoto from '../../assets/perfilfoto.png';

const API_BASE_URL = 'https://api.mamamianpizza.com/api';

export default function InformacionUsuario({ user, profileMessage, profileMessageType }) {
  // Estado de perfil del usuario - usar datos reales si están disponibles
  const userPerfil = {
    nombre: user?.nombre || 'Usuario',
    email: user?.correo || user?.email || 'usuario@email.com',
    telefono: user?.telefono || user?.celular || '+503 0000-0000',
    foto: user?.foto_perfil || user?.foto || perfilFoto,
    miembroDesde: user?.fecha_registro ? new Date(user.fecha_registro).getFullYear() : new Date().getFullYear(),
    fecha_nacimiento: user?.fecha_nacimiento || '',
    dui: user?.dui || user?.numero_dui || '',
  };

  // Estados para las estadísticas básicas
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    favoriteProducts: 0
  });

  // Función para obtener estadísticas básicas del usuario
  const fetchUserStats = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    // Verificar si el ID es válido (no es un timestamp)
    const userId = user.id;
    if (typeof userId === 'number' && userId > 1000000000000) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      // Verificar si la respuesta es HTML (error 404 del servidor)
      if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        return;
      }

      // Verificar si la respuesta indica que no hay pedidos
      if (data.message && data.message.includes('No se encontraron pedidos')) {
        setUserStats({
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          favoriteProducts: 0,
        });
        return;
      }

      // Extraer pedidos de la estructura de respuesta exacta
      const pedidos = data.pedidos || [];
      const totalPedidos = data.total_pedidos || 0;

      // Procesar los datos de pedidos
      const processedOrders = pedidos.map(order => ({
        total: parseFloat(order.total) || 0,
        productos: order.detalles || [],
      }));

      // Calcular estadísticas
      const stats = {
        totalOrders: totalPedidos,
        totalSpent: processedOrders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: processedOrders.length > 0 
          ? processedOrders.reduce((sum, order) => sum + order.total, 0) / processedOrders.length 
          : 0,
        favoriteProducts: processedOrders.reduce((count, order) => 
          count + (Array.isArray(order.productos) ? order.productos.length : 0), 0
        ),
      };

      setUserStats(stats);

    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
    }
  }, [user?.id]);

  // Cargar estadísticas cuando se monta el componente
  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id, fetchUserStats]);

  return (
    <div className="perfil__card">
      <div className="perfil__foto-wrapper">
        <img src={userPerfil.foto} alt="Perfil" className="perfil__foto" />
      </div>

      {/* Mensaje local debajo de la foto */}
      {profileMessage && (
        <div className={`perfil__local-message ${profileMessageType === 'error' ? 'error' : ''}`}>
          {profileMessage}
        </div>
      )}

      <div className="perfil__info">
        <div className="perfil__nombre">{userPerfil.nombre}</div>
        <div className="perfil__email">{userPerfil.email}</div>
        <div className="perfil__datos">
          <span>
            <FontAwesomeIcon icon={faShoppingBag} /> {userStats.totalOrders} pedidos realizados
          </span>
          <span>
            <FontAwesomeIcon icon={faHeart} style={{ color: '#ab1319' }} /> ${userStats.totalSpent.toFixed(2)} gastado total
          </span>
          <span>
            <FontAwesomeIcon icon={faUser} /> Miembro desde {userPerfil.miembroDesde}
          </span>
        </div>
      </div>
    </div>
  );
}
