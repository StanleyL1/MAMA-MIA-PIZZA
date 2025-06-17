import React, { useState, useEffect } from 'react';
import { 
  obtenerExperienciasPendientes, 
  cambiarAprobacionExperiencia,
  obtenerEstadisticasExperiencias 
} from '../../services/experienciasService';
import Toast from '../Toast/Toast';
import './AdminExperiencias.css';

const AdminExperiencias = () => {
  const [experienciasPendientes, setExperienciasPendientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [pendientes, stats] = await Promise.all([
        obtenerExperienciasPendientes(),
        obtenerEstadisticasExperiencias()
      ]);
      
      setExperienciasPendientes(pendientes.experiencias || []);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setToast({
        message: 'Error al cargar las experiencias pendientes',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const manejarAprobacion = async (idExperiencia, aprobar) => {
    setProcesando(idExperiencia);
    try {
      await cambiarAprobacionExperiencia(idExperiencia, aprobar);
      
      setToast({
        message: `Experiencia ${aprobar ? 'aprobada' : 'rechazada'} exitosamente`,
        type: 'success'
      });
      
      // Remover de la lista de pendientes
      setExperienciasPendientes(prev => 
        prev.filter(exp => exp.id_experiencia !== idExperiencia)
      );
      
      // Actualizar estadísticas
      await obtenerEstadisticasExperiencias().then(setEstadisticas);
      
    } catch (error) {
      console.error('Error al cambiar aprobación:', error);
      setToast({
        message: 'Error al procesar la experiencia',
        type: 'error'
      });
    } finally {
      setProcesando(null);
    }
  };

  const renderEstrellasCalificacion = (valoracion) => {
    return '★'.repeat(valoracion) + '☆'.repeat(5 - valoracion);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Cargando experiencias pendientes...</p>
      </div>
    );
  }

  return (
    <div className="admin-experiencias">
      <div className="admin-header">
        <h1>Gestión de Experiencias</h1>
        <div className="estadisticas-grid">
          <div className="stat-card">
            <h3>Total</h3>
            <span className="stat-number">{estadisticas.total}</span>
          </div>
          <div className="stat-card">
            <h3>Aprobadas</h3>
            <span className="stat-number">{estadisticas.aprobadas}</span>
          </div>
          <div className="stat-card">
            <h3>Pendientes</h3>
            <span className="stat-number">{estadisticas.pendientes}</span>
          </div>
          <div className="stat-card">
            <h3>Promedio</h3>
            <span className="stat-number">{estadisticas.promedioCalificacion}/5</span>
          </div>
        </div>
      </div>

      <div className="experiencias-pendientes">
        <h2>Experiencias Pendientes de Aprobación</h2>
        
        {experienciasPendientes.length === 0 ? (
          <div className="no-pendientes">
            <p>🎉 ¡No hay experiencias pendientes de aprobación!</p>
          </div>
        ) : (
          <div className="experiencias-lista">
            {experienciasPendientes.map((experiencia) => (
              <div key={experiencia.id_experiencia} className="experiencia-card">
                <div className="experiencia-header">
                  <div className="usuario-info">
                    <img 
                      src={experiencia.usuario?.foto_perfil || '/default-avatar.png'} 
                      alt={experiencia.usuario?.nombre || 'Usuario'}
                      className="usuario-avatar"
                    />
                    <div>
                      <h4>{experiencia.usuario?.nombre || 'Usuario Anónimo'}</h4>
                      <p className="fecha">{new Date(experiencia.fecha_creacion).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <div className="calificacion">
                    <span className="estrellas">{renderEstrellasCalificacion(experiencia.valoracion)}</span>
                    <span className="numero">({experiencia.valoracion}/5)</span>
                  </div>
                </div>                <div className="experiencia-contenido">
                  {experiencia.titulo && (
                    <h3 className="titulo">{experiencia.titulo}</h3>
                  )}
                  <p className="contenido">{experiencia.contenido}</p>
                  
                  {/* Mostrar foto de la experiencia si existe */}
                  {experiencia.ruta_foto && (
                    <div className="experiencia-foto-container">
                      <img 
                        src={experiencia.ruta_foto}
                        alt={`Foto de la experiencia: ${experiencia.titulo || 'experiencia'}`}
                        className="experiencia-foto"
                        onError={(e) => {
                          console.log('Error cargando foto de experiencia en admin');
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="experiencia-acciones">
                  <button
                    className="btn-rechazar"
                    onClick={() => manejarAprobacion(experiencia.id_experiencia, false)}
                    disabled={procesando === experiencia.id_experiencia}
                  >
                    {procesando === experiencia.id_experiencia ? 'Procesando...' : 'Rechazar'}
                  </button>
                  <button
                    className="btn-aprobar"
                    onClick={() => manejarAprobacion(experiencia.id_experiencia, true)}
                    disabled={procesando === experiencia.id_experiencia}
                  >
                    {procesando === experiencia.id_experiencia ? 'Procesando...' : 'Aprobar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminExperiencias;
