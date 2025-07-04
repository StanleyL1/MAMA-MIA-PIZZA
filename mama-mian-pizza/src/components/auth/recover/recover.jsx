import './recover.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitarCodigoReset, verificarCodigoReset, restablecerPassword } from '../../../services/authService';

const RecoverPassword = () => {
    const navigate = useNavigate();
    
    // Estados para manejar las diferentes etapas del proceso
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpExpiry, setOtpExpiry] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [maskedEmail, setMaskedEmail] = useState('');
    
    // Estados para manejo de errores y feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Efecto para el contador regresivo del OTP
    useEffect(() => {
        let timer;
        if (otpExpiry) {
            timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = otpExpiry - now;
                
                if (distance <= 0) {
                    clearInterval(timer);
                    setCountdown('Expirado');
                    setError('El código ha expirado. Solicita uno nuevo.');
                } else {
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setCountdown(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
                }
            }, 1000);
        }
        
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [otpExpiry]);
    
    // Función para enmascarar el email
    const maskEmail = (email) => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        let maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
        return `${maskedUsername}@${domain}`;
    };
    
    // Paso 1: Solicitar código de restablecimiento
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            await solicitarCodigoReset(email);
            
            setSuccess('Se ha enviado un código de verificación a tu correo.');
            setMaskedEmail(maskEmail(email));
            setStep(2);
            
            // Establecer el tiempo de expiración para el contador (10 minutos)
            const expiryTime = new Date().getTime() + (10 * 60 * 1000);
            setOtpExpiry(expiryTime);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Error al solicitar restablecimiento. Verifica tu correo.');
        } finally {
            setLoading(false);
        }
    };
    
    // Paso 2: Verificar el código OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const data = await verificarCodigoReset(email, otp);
            
            setSuccess('Código verificado correctamente.');
            setResetToken(data.token);
            setStep(3);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Código inválido o expirado. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };
    
    // Paso 3: Establecer nueva contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        
        // Validar complejidad de la contraseña
        if (newPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            await restablecerPassword(resetToken, newPassword);
            
            setSuccess('¡Contraseña restablecida exitosamente!');
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Error al restablecer contraseña. Intenta nuevamente.');
            
            // Si el token expiró, volver al paso 1
            if (error.message && error.message.includes('token')) {
                setStep(1);
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Solicitar nuevo código OTP
    const handleRequestNewOTP = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            await solicitarCodigoReset(email);
            
            setSuccess('Se ha enviado un nuevo código de verificación a tu correo.');
            
            // Resetear el contador OTP
            const expiryTime = new Date().getTime() + (10 * 60 * 1000);
            setOtpExpiry(expiryTime);
            setCountdown(null); // Resetear el contador
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Error al solicitar nuevo código. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };
    
    // Renderizado condicional según el paso actual
    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <form onSubmit={handleRequestReset} className="recover__form">
                        <p className="recover__text">
                            Introduce tu correo y te enviaremos un código de verificación para restablecer tu contraseña.
                        </p>
                        <div className="recover__form-group">
                            <input
                                type="email"
                                className="recover__input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo electrónico"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="recover__btn" 
                            disabled={loading || !email}
                        >
                            {loading ? 'Enviando...' : 'Enviar Código de Verificación'}
                        </button>
                    </form>
                );
                
            case 2:
                return (
                    <form onSubmit={handleVerifyOTP} className="recover__form">
                        <p className="recover__email-info">
                            Se ha enviado un código de verificación al correo: <strong>{maskedEmail}</strong>
                        </p>
                        
                        {countdown && (
                            <div className="recover__countdown">
                                <p>Tiempo restante: <span className="recover__countdown-time">{countdown}</span></p>
                            </div>
                        )}
                        
                        <div className="recover__form-group">
                            <label className="recover__label">Código de Verificación (6 dígitos)</label>
                            <input
                                type="text"
                                className="recover__input recover__input--otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                placeholder="Ingresa el código de 6 dígitos"
                                maxLength={6}
                                pattern="[0-9]{6}"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="recover__btn" 
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? 'Verificando...' : 'Verificar Código'}
                        </button>
                        
                        <div className="recover__actions">
                            <p className="recover__resend">
                                ¿No recibiste el código? {' '}
                                <button 
                                    type="button"
                                    onClick={handleRequestNewOTP}
                                    disabled={loading || countdown === null || countdown === 'Expirado'}
                                    className="recover__link-button"
                                >
                                    Enviar de nuevo
                                </button>
                            </p>
                            
                            <p className="recover__back">
                                <button 
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="recover__link-button"
                                >
                                    Volver atrás
                                </button>
                            </p>
                        </div>
                    </form>
                );
                
            case 3:
                return (
                    <form onSubmit={handleResetPassword} className="recover__form">
                        <div className="recover__form-group">
                            <label className="recover__label">Nueva Contraseña</label>
                            <input
                                type="password"
                                className="recover__input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Ingresa tu nueva contraseña"
                                required
                                minLength={8}
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="recover__form-group">
                            <label className="recover__label">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className="recover__input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirma tu nueva contraseña"
                                required
                                minLength={8}
                                disabled={loading}
                            />
                            {newPassword !== confirmPassword && confirmPassword !== '' && (
                                <p className="recover__password-mismatch">Las contraseñas no coinciden</p>
                            )}
                        </div>
                        
                        <div className="recover__password-requirements">
                            <p>La contraseña debe:</p>
                            <ul>
                                <li className={newPassword.length >= 8 ? 'valid' : ''}>
                                    Tener al menos 8 caracteres
                                </li>
                                <li className={/[A-Z]/.test(newPassword) ? 'valid' : ''}>
                                    Contener al menos una letra mayúscula
                                </li>
                                <li className={/[0-9]/.test(newPassword) ? 'valid' : ''}>
                                    Contener al menos un número
                                </li>
                            </ul>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="recover__btn" 
                            disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                        >
                            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </form>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <div className="recover">
            <div className="recover__container">
                <header className="recover__header">
                    <h3>Recuperación de Contraseña</h3>
                </header>
                
                <main className="recover__main">
                    {/* Mostrar mensajes de error o éxito */}
                    {error && (
                        <div className="recover__error">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="recover__success">
                            {success}
                        </div>
                    )}
                    
                    {/* Mostrar pasos numerados */}
                    <div className="recover__steps">
                        <div className={`recover__step ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <span className="recover__step-number">1</span>
                            <span className="recover__step-text">Email</span>
                        </div>
                        <div className={`recover__step ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <span className="recover__step-number">2</span>
                            <span className="recover__step-text">Verificación</span>
                        </div>
                        <div className={`recover__step ${step === 3 ? 'active' : ''}`}>
                            <span className="recover__step-number">3</span>
                            <span className="recover__step-text">Nueva Contraseña</span>
                        </div>
                    </div>
                    
                    {/* Contenido dinámico según el paso */}
                    {renderStep()}
                </main>
                
                <footer className="recover__footer">
                    <p>¿Recordaste tu contraseña? <a href="/login" className="recover__link">Inicia sesión</a></p>
                </footer>
            </div>
        </div>
    );
};

export default RecoverPassword;
