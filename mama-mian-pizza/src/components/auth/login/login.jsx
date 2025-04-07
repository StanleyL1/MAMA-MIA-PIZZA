import './login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        correo: "",
        contrasena: ""
    })

    const handleInputChange = (e) => {
        setFormData(
            { ...formData, [e.target.name]:e.target.value}
        )
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await fetch('http://bkcww48c8swokk0s4wo4gkk8.82.29.198.111.sslip.io/api/users/users_login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })

        if(response.status === 200){
           navigate('/menu') 
        }
    }catch (error) {
        console.log(error)
    }
    }

    return(
      <div className='login'>
            <div className='login__container'>
                <header className='login__header'>
                    <h3>Iniciar Sesion</h3>
                </header>
                <main className='login__main'>
                    <form action="" className='login__form'>
                        <input name='correo' onChange={handleInputChange} type="text" placeholder='Correo Electronico'/>
                        <input name="contrasena" onChange={handleInputChange} type="password" placeholder='Contraseña'/>
                    </form>
                </main>
                <button className='login__btn' type="submit" onClick={handleSubmit}>Ingresar</button>
                <footer className='login__footer'>
                        <p>¿No tienes una cuenta? <a href="/register">Registrate</a></p>
                        <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recuperar</a></p>
                </footer>
            </div>
      </div>      
    );    
}

export default Login;