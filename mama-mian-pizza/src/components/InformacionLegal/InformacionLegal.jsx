import React, { useEffect } from 'react';
import './InformacionLegal.css';
import Footer from '../footer/footer';
import { 
  FaInfoCircle, 
  FaQuestionCircle, 
  FaBoxOpen, 
  FaShippingFast, 
  FaShieldAlt, 
  FaFileContract, 
  FaTimes, 
  FaCreditCard, 
  FaCookie, 
  FaUndo, 
  FaArrowLeft 
} from 'react-icons/fa';

const InformacionLegal = () => {
  // Función para hacer scroll automático al anchor
  useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="informacion-legal-container">
      <main className="informacion-legal-content">
        <div className="legal-header">
          <h1>Información y Políticas</h1>
          <p>Toda la información importante sobre tus derechos como cliente y nuestras políticas operativas</p>
        </div>

        <div className="legal-sections">
          {/* 1. Acerca de Nosotros */}
          <section id="acerca-de-nosotros" className="legal-section">
            <h2><FaInfoCircle className="section-icon" /> 1. Acerca de Nosotros</h2>
            <p>
              Bienvenido a Mamá Mian Pizza. Esta sección contiene información importante sobre tus derechos como cliente, 
              así como nuestras políticas operativas. Te recomendamos leer cada apartado antes de hacer tu pedido.
            </p>
          </section>

          {/* 2. Preguntas Frecuentes */}
          <section id="preguntas-frecuentes" className="legal-section">
            <h2><FaQuestionCircle className="section-icon" /> 2. Preguntas Frecuentes</h2>
            
            <div className="faq-item">
              <h3>¿Qué tipos de pizza ofrecen?</h3>
              <p>Clásicas (pepperoni, hawaiana, suprema, 4 quesos) y especiales como "camarón y curil".</p>
            </div>

            <div className="faq-item">
              <h3>¿Cómo hago un pedido?</h3>
              <p>Desde el sitio web, eligiendo productos, tamaños, y completando la compra en el carrito.</p>
            </div>

            <div className="faq-item">
              <h3>¿Puedo pedir sin registrarme?</h3>
              <p>Sí, se puede como invitado.</p>
            </div>

            <div className="faq-item">
              <h3>¿Qué hago si tengo un problema con mi pedido?</h3>
              <p>Contactanos por WhatsApp o Facebook en los primeros 30 minutos.</p>
            </div>

            <div className="faq-item">
              <h3>¿Qué formas de pago aceptan?</h3>
              <p>Tarjeta, transferencia bancaria, y efectivo contra entrega.</p>
            </div>

            <div className="faq-item">
              <h3>¿Tienen promociones o cupones?</h3>
              <p>Sí, en redes sociales y la página principal.</p>
            </div>

            <div className="faq-item">
              <h3>¿Qué días atienden?</h3>
              <p>Todos los días, de 10:00 a.m. a 9:00 p.m.</p>
            </div>
          </section>

          {/* 3. Garantías y Retornos */}
          <section id="garantias-retornos" className="legal-section">
            <h2><FaBoxOpen className="section-icon" /> 3. Garantías y Retornos (Política de Devoluciones)</h2>
            <ul>
              <li>Puedes reportar problemas dentro de los primeros 30 minutos tras recibir el pedido.</li>
              <li>Debes enviar evidencia (foto, número de orden).</li>
              <li>No se aceptan reclamos por consumo parcial o almacenamiento incorrecto.</li>
              <li>Las devoluciones se realizan mediante reposiciones o cupones.</li>
            </ul>
          </section>

          {/* 4. Política de Envíos */}
          <section id="politica-envios" className="legal-section">
            <h2><FaShippingFast className="section-icon" /> 4. Política de Envíos</h2>
            <p><strong>Zonas:</strong> Puerto El Triunfo (gratis) y Jiquilisco ($1.50).</p>
            <p><strong>Tiempo estimado:</strong> 25–30 minutos.</p>
            <p><strong>Seguimiento:</strong> Se notificará por WhatsApp o correo electrónico.</p>
          </section>

          {/* 5. Políticas de Privacidad */}
          <section id="politicas-privacidad" className="legal-section">
            <h2><FaShieldAlt className="section-icon" /> 5. Políticas de Privacidad</h2>
            
            <div className="privacy-subsection">
              <h3>Datos que recopilamos:</h3>
              <ul>
                <li>Nombre completo</li>
                <li>Número de contacto</li>
                <li>Dirección</li>
                <li>Correo electrónico</li>
                <li>Información de pago (no almacenamos tarjetas)</li>
              </ul>
            </div>

            <div className="privacy-subsection">
              <h3>Uso de datos:</h3>
              <ul>
                <li>Procesamiento y seguimiento de pedidos</li>
                <li>Mejora de experiencia</li>
              </ul>
            </div>

            <div className="privacy-subsection">
              <h3>Seguridad:</h3>
              <ul>
                <li>Navegación segura con HTTPS</li>
                <li>Procesamiento de pagos con plataformas certificadas</li>
                <li>No se comparte información con terceros no autorizados</li>
              </ul>
            </div>
          </section>

          {/* 6. Términos y Condiciones */}
          <section id="terminos-condiciones" className="legal-section">
            <h2><FaFileContract className="section-icon" /> 6. Términos y Condiciones</h2>
            <ul>
              <li>Al usar el sitio confirmas que sos mayor de edad y que los datos proporcionados son verídicos.</li>
              <li>La disponibilidad de productos está sujeta a cambios.</li>
              <li>En caso de errores evidentes, se puede cancelar el pedido con aviso.</li>
              <li>La operación se rige por la legislación de El Salvador.</li>
            </ul>
          </section>

          {/* 7. Cancelación de Compra */}
          <section id="cancelacion-compra" className="legal-section">
            <h2><FaTimes className="section-icon" /> 7. Cancelación de Compra</h2>
            <ul>
              <li>Podés cancelar tu pedido en los primeros 5 minutos.</li>
              <li>Si ya se inició la preparación, no se podrá cancelar.</li>
              <li>Cancelaciones aprobadas se reembolsan en un máximo de 72 horas.</li>
            </ul>
          </section>

          {/* 8. Formas de Pago */}
          <section id="formas-pago" className="legal-section">
            <h2><FaCreditCard className="section-icon" /> 8. Formas de Pago</h2>
            <ul>
              <li>Tarjetas de crédito y débito (Wompi)</li>
              <li>Transferencia bancaria (Banco Agrícola)</li>
              <li>Efectivo contra entrega</li>
            </ul>
          </section>

          {/* 9. Política de Cookies */}
          <section id="politica-cookies" className="legal-section">
            <h2><FaCookie className="section-icon" /> 9. Política de Cookies</h2>
            <p>Se usan para recordar sesión, carrito, estadísticas, y personalización.</p>
            <p>Puedes desactivarlas desde tu navegador (afectará algunas funciones).</p>
          </section>

          {/* 10. Reversión de Pago */}
          <section id="reversion-pago" className="legal-section">
            <h2><FaUndo className="section-icon" /> 10. Reversión de Pago</h2>
            <p>Las devoluciones de dinero por errores se procesan en un plazo máximo de 72 horas, en casos justificados.</p>
          </section>

          {/* 11. Derecho a Retracto */}
          <section id="derecho-retracto" className="legal-section">
            <h2><FaArrowLeft className="section-icon" /> 11. Derecho a Retracto</h2>
            <p>
              Podés ejercer tu derecho a retracto si el pedido aún no ha sido preparado. 
              Una vez iniciado el despacho o cocción, no aplica.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InformacionLegal;