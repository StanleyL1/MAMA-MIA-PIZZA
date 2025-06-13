import React, { useState } from "react";
import CustomDatePicker from "../../customDatePicker/customDatepicker";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [isGenderSelectOpen, setIsGenderSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [formData, setFormData] = useState({
    nombre: "",
    correo:"",
    contrasena: "",
    celular: "",
    dui: "",
    sexo: ""
  })

  const navigate = useNavigate();    const dataToSend = {
      ...formData,
      fecha_nacimiento: birthDate ? birthDate.toISOString().split("T")[0] : null,
      sexo: gender || null,
    }

    const handleSunmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess(false);

      // Validaciones básicas
      if (!formData.nombre.trim()) {
        setError("El nombre es requerido");
        setLoading(false);
        return;
      }
      if (!formData.correo.trim()) {
        setError("El correo es requerido");
        setLoading(false);
        return;
      }
      if (!formData.contrasena.trim()) {
        setError("La contraseña es requerida");
        setLoading(false);
        return;
      }
      if (formData.contrasena !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }
      if (!formData.celular.trim()) {
        setError("El número de teléfono es requerido");
        setLoading(false);
        return;
      }
      if (!formData.dui.trim()) {
        setError("El DUI es requerido");
        setLoading(false);
        return;
      }
      if (!gender) {
        setError("Debe seleccionar un género");
        setLoading(false);
        return;
      }
      if (!birthDate) {
        setError("La fecha de nacimiento es requerida");
        setLoading(false);
        return;
      }

      console.log('📝 REGISTRO - Datos a enviar:', dataToSend);

      try {
        const response = await fetch('https://api.mamamianpizza.com/api/users/users_register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        });

        console.log('📝 REGISTRO - Status de respuesta:', response.status);
        console.log('📝 REGISTRO - Headers de respuesta:', response.headers);

        if (response.status === 201) {
          const responseData = await response.json();
          console.log('✅ REGISTRO - Registro exitoso:', responseData);
          setSuccess(true);
          
          // Redirigir después de mostrar mensaje de éxito
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          // Manejar errores de la API
          let errorMessage = "Error al registrar usuario";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            console.log('❌ REGISTRO - Error de API:', errorData);
          } catch (parseError) {
            console.log('❌ REGISTRO - Error al parsear respuesta de error:', parseError);
          }
          setError(errorMessage);
        }
      } catch (error) {
        console.error('❌ REGISTRO - Error de conexión:', error);
        setError("Error de conexión. Verifica tu internet e intenta nuevamente.");      } finally {
        setLoading(false);
      }
    };

  	const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value});
      // Limpiar errores cuando el usuario empiece a escribir
      if (error) setError("");
      if (success) setSuccess(false);
    };
  const handleGenderChange = (e) => {
    setGender(e.target.value);
    // Limpiar errores cuando el usuario seleccione género
    if (error) setError("");
    if (success) setSuccess(false);
  };
  
  const handleSelectFocus = () => {
    setIsGenderSelectOpen(true);
  };
  
  const handleSelectBlur = () => {
    setIsGenderSelectOpen(false);
  };



  return (
    <div className="register">
      <div className="register__container">
        <header className="register__header">
          <h3>Registro</h3>
        </header>        <main className="register__main">
          {error && (
            <div className="register__error" style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div className="register__success" style={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              border: '1px solid #c8e6c9'
            }}>
              ¡Registro exitoso! Redirigiendo al login...
            </div>
          )}
          <form className="register__form">            <input
              name="nombre"
              onChange={handleInputChange}
              type="text"
              placeholder="Nombre Completo"
              className="register__input"
              disabled={loading}
              required
            />
            <input
              name="correo"
              onChange={handleInputChange}
              type="email"
              placeholder="Correo Electrónico"
              className="register__input"
              disabled={loading}
              required
            /><input
              name="contrasena"
              onChange={handleInputChange}
              type="password"
              placeholder="Contraseña"
              className="register__input"
              disabled={loading}
              required
            />
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
                if (success) setSuccess(false);
              }}
              type="password"
              placeholder="Confirmar Contraseña"
              className="register__input"
              disabled={loading}
              required
            />
            <CustomDatePicker value={birthDate} onChange={setBirthDate} />            <input
              type="text"
              name="dui"
              onChange={handleInputChange}
              placeholder="N° de DUI sin guion"
              className="register__input"
              disabled={loading}
              required
            />
            <input
              name="celular"
              onChange={handleInputChange}
              type="text"
              placeholder="Número de Teléfono"
              className="register__input"
              disabled={loading}
              required
            />            <div className={`register__select-container ${isGenderSelectOpen ? 'open' : ''}`}>
              <select 
                className="register__input register__select"
                value={gender} 
                onChange={handleGenderChange}
                aria-label="Seleccionar género"
                onFocus={handleSelectFocus}
                onBlur={handleSelectBlur}
                disabled={loading}
                required
              >
                <option value="" disabled>Seleccionar género</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
              <div className="register__select-arrow"></div>
            </div>
            <p className="register__instructions">
            Debe contener al menos 8 caracteres, 1 número y 1 carácter especial.
            </p>
          </form>
        </main>        <button 
          onClick={handleSunmit} 
          className="register__btn" 
          type="submit"
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        <footer className="register__footer">
          <p>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </footer>
      </div>
    </div>
    
  );
};

export default Register;
