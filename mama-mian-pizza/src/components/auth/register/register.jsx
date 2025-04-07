import React, { useState } from "react";
import CustomDatePicker from "../../customDatePicker/customDatepicker";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [isGenderSelectOpen, setIsGenderSelectOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo:"",
    contrasena: "",
    celular: "",
    dui: "",
    sexo: ""
  })

  const navigate = useNavigate();

    const dataToSend ={
      ...formData,
      fecha_nacimiento: birthDate ? birthDate.toISOString().split("T")[0] : null,
      sexo: gender ? gender.toString() : null,

    }

    const handleSunmit =  async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/users/users_register' ,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dataToSend)
           })

           if (response.status === 201) {
            navigate('/')
           }
      }catch (error) {
        console.log(error)
      }
    }

  	const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value})
    }

  const handleGenderChange = (e) => {
    setGender(e.target.value);
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
        </header>
        <main className="register__main">
          <form className="register__form">
            <input
              name="nombre"
              onChange={handleInputChange}
              type="text"
              placeholder="Nombre Completo"
              className="register__input"
            />
            <input
              name="correo"
              onChange={handleInputChange}
              type="email"
              placeholder="Correo Electrónico"
              className="register__input"
            />
            <input
              name="contrasena"
              onChange={handleInputChange}
              type="password"
              placeholder="Contraseña"
              className="register__input"
            />
            <input
              
              type="password"
              placeholder="Confirmar Contraseña"
              className="register__input"
            />
            <CustomDatePicker value={birthDate} onChange={setBirthDate} />
            <input
              
              type="text"
              name="dui"
              onChange={handleInputChange}
              placeholder="N° de DUI sin guion"
              className="register__input"
            />
            <input
              name="celular"
              onChange={handleInputChange}
              type="text"
              placeholder="Número de Teléfono"
              className="register__input"
            />
            <div className={`register__select-container ${isGenderSelectOpen ? 'open' : ''}`}>
              <select 
                className="register__input register__select"
                value={gender} 
                onChange={handleGenderChange}
                aria-label="Seleccionar género"
                onFocus={handleSelectFocus}
                onBlur={handleSelectBlur}
              >
                <option value="" disabled>Seleccionar género</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
              <div className="register__select-arrow"></div>
            </div>
            <p className="register__instructions">
              Debe contener al menos 8 caracteres, 1 número y 1 caracter especial.
            </p>
          </form>
        </main>
        <button onClick={handleSunmit} className="register__btn" type="submit">
          Registrarse
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
