import React, { useState, useEffect } from 'react';
import { obtenerExperienciasParaHome, crearExperienciaDesdeModal } from '../../services/experienciasService';

const TestExperiencias = () => {
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const testAPI = async () => {
    setLoading(true);
    setResult('Probando API...');
    
    try {
      const data = await obtenerExperienciasParaHome();
      setExperiencias(data);
      setResult(`✅ API funcionando! Se obtuvieron ${data.length} experiencias aprobadas.`);
      console.log('Experiencias obtenidas:', data);
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
      console.error('Error en test:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCreateExperience = async () => {
    setLoading(true);
    
    const testUser = {
      id: 1,
      nombre: 'Usuario Test',
      correo: 'test@test.com',
      foto_perfil: 'https://via.placeholder.com/150'
    };

    try {
      await crearExperienciaDesdeModal(
        testUser,
        'Experiencia de prueba',
        5,
        'Esta es una experiencia de prueba para verificar que el sistema funciona correctamente.'
      );
      setResult('✅ Experiencia de prueba creada exitosamente!');
      // Recargar experiencias
      testAPI();
    } catch (error) {
      setResult(`❌ Error al crear experiencia: ${error.message}`);
      console.error('Error creando experiencia:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test de Integración - Experiencias API</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAPI} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Cargando...' : 'Probar GET Experiencias'}
        </button>
        
        <button 
          onClick={testCreateExperience} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creando...' : 'Probar POST Experiencia'}
        </button>
      </div>

      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        marginBottom: '20px',
        fontFamily: 'monospace' 
      }}>
        <strong>Resultado:</strong> {result}
      </div>

      <h2>Experiencias Cargadas ({experiencias.length})</h2>
      
      {experiencias.length > 0 ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          {experiencias.map((exp, index) => (
            <div 
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img 
                  src={exp.avatar} 
                  alt={exp.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '10px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
                <div>
                  <strong>{exp.name}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {exp.time} - ⭐ {exp.rating}/5
                  </div>
                </div>
              </div>
                <h4 style={{ margin: '5px 0', color: '#333' }}>{exp.titulo}</h4>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}>{exp.comment}</p>
              
              {/* Mostrar foto de la experiencia si existe */}
              {exp.experienciaFoto && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={exp.experienciaFoto}
                    alt={`Foto de la experiencia: ${exp.titulo}`}
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No hay experiencias para mostrar
        </p>
      )}
    </div>
  );
};

export default TestExperiencias;
