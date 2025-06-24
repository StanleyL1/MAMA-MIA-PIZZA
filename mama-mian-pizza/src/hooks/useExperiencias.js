import { useState, useEffect, useCallback } from 'react';
import {
  obtenerExperienciasParaHome,
  obtenerExperienciasUsuario,
  obtenerExperienciasPendientes,
  crearExperienciaDesdeModal,
  cambiarAprobacionExperiencia,
  obtenerEstadisticasExperiencias
} from '../services/experienciasService';

// Hook para manejar experiencias en el Home
export const useExperienciasHome = () => {
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarExperiencias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerExperienciasParaHome();
      setExperiencias(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar experiencias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarExperiencias();
  }, [cargarExperiencias]);

  return {
    experiencias,
    loading,
    error,
    recargar: cargarExperiencias
  };
};

// Hook para manejar experiencias de un usuario específico
export const useExperienciasUsuario = (idUsuario) => {
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarExperiencias = useCallback(async () => {
    if (!idUsuario) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerExperienciasUsuario(idUsuario);
      setExperiencias(data.experiencias || []);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar experiencias del usuario:', err);
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  useEffect(() => {
    cargarExperiencias();
  }, [cargarExperiencias]);

  return {
    experiencias,
    loading,
    error,
    recargar: cargarExperiencias
  };
};

// Hook para crear experiencias
export const useCrearExperiencia = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const crearExperiencia = useCallback(async (usuario, titulo, valoracion, contenido) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await crearExperienciaDesdeModal(usuario, titulo, valoracion, contenido);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error al crear experiencia:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const resetear = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    crearExperiencia,
    submitting,
    error,
    success,
    resetear
  };
};

// Hook para administración de experiencias
export const useAdminExperiencias = () => {
  const [experienciasPendientes, setExperienciasPendientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendientes, stats] = await Promise.all([
        obtenerExperienciasPendientes(),
        obtenerEstadisticasExperiencias()
      ]);
      
      setExperienciasPendientes(pendientes.experiencias || []);
      setEstadisticas(stats);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos de admin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const aprobarExperiencia = useCallback(async (idExperiencia, aprobar = true) => {
    setProcesando(idExperiencia);
    try {
      await cambiarAprobacionExperiencia(idExperiencia, aprobar);
      
      // Remover de pendientes
      setExperienciasPendientes(prev => 
        prev.filter(exp => exp.id_experiencia !== idExperiencia)
      );
      
      // Actualizar estadísticas
      const nuevasStats = await obtenerEstadisticasExperiencias();
      setEstadisticas(nuevasStats);
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error al aprobar experiencia:', err);
      return false;
    } finally {
      setProcesando(null);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    experienciasPendientes,
    estadisticas,
    loading,
    procesando,
    error,
    aprobarExperiencia,
    recargar: cargarDatos
  };
};

// Hook para validaciones de formulario
export const useValidacionExperiencia = () => {
  const [errores, setErrores] = useState({});

  const validar = useCallback((datos) => {
    const nuevosErrores = {};

    if (!datos.valoracion || datos.valoracion < 1 || datos.valoracion > 5) {
      nuevosErrores.valoracion = 'La calificación es obligatoria (1-5 estrellas)';
    }

    if (!datos.contenido || datos.contenido.trim().length < 10) {
      nuevosErrores.contenido = 'El comentario debe tener al menos 10 caracteres';
    }

    if (datos.contenido && datos.contenido.length > 500) {
      nuevosErrores.contenido = 'El comentario no puede exceder 500 caracteres';
    }

    if (datos.titulo && datos.titulo.length > 100) {
      nuevosErrores.titulo = 'El título no puede exceder 100 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, []);

  const limpiarErrores = useCallback(() => {
    setErrores({});
  }, []);

  return {
    errores,
    validar,
    limpiarErrores,
    tieneErrores: Object.keys(errores).length > 0
  };
};
