import './login.css';

const Login = () => {
    return(
      <div className='login'>
            <div className='login__container'>
                <header className='login__header'>
                    <h3>Iniciar Sesion</h3>
                </header>
                <main className='login__main'>
                    <form action="" className='login__form'>
                        <input type="text" placeholder='Correo Electronico'/>
                        <input type="password" placeholder='Contraseña'/>
                    </form>
                </main>
                <button className='login__btn' type="submit">Ingresar</button>
                <footer className='login__footer'>
                        <p>¿No tienes una cuenta? <a href="/register">Registrate</a></p>
                        <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recuperar</a></p>
                </footer>
            </div>
      </div>      
    );    
}

export default Login;