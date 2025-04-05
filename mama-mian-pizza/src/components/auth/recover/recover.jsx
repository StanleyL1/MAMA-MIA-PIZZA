import './recover.css';

const RecoverPassword = () => {
  return (
    <div className="recover">
      <div className="recover__container">
        <header className="recover__header">
          <h3>Recuperar Contraseña</h3>
        </header>
        <main className="recover__main">
          <p className="recover__text">
            Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <form className="recover__form">
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              className="recover__input" 
            />
          </form>
        </main>
        <button className="recover__btn" type="submit">
          Restablecer Contraseña
        </button>
        <footer className="recover__footer">
          <a href="/login" className="recover__link">
            Volver al inicio de sesión
          </a>
        </footer>
      </div>
    </div>
  );
};

export default RecoverPassword;
