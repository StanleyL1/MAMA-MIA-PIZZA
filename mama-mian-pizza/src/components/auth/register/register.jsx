import React, { useState } from "react";
import CustomDatePicker from "../../customDatePicker/customDatepicker";
import "./register.css";

const Register = () => {
  const [birthDate, setBirthDate] = useState(null);

  return (
    <div className="register">
      <div className="register__container">
        <header className="register__header">
          <h3>Registro</h3>
        </header>
        <main className="register__main">
          <form className="register__form">
            <input
              type="text"
              placeholder="Nombre Completo"
              className="register__input"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="register__input"
            />
            <input
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
              placeholder="N° de DUI sin guion"
              className="register__input"
            />
            <input
              type="text"
              placeholder="Número de Teléfono"
              className="register__input"
            />
            <select className="register__input register__select">
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
            </select>
            <p className="register__instructions">
              Debe contener al menos 8 caracteres, 1 número y 1 caracter especial.
            </p>
          </form>
        </main>
        <button className="register__btn" type="submit">
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
