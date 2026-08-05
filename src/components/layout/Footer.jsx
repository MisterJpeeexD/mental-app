import { Link } from 'react-router-dom';

/* Sin la clase `reveal`: el footer es chrome permanente, y como solo HomePage y
   TerapiaPage llaman a useReveal, en el resto de rutas se quedaba en opacity 0. */
export default function Footer() {
  return (
    <footer className="mente-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <img src="/assets/AbrazaMente_Logo.svg" alt="AbrazaMente" className="footer-logo-img" />
          </Link>
          <p className="footer-description">
            Plataforma integral orientada al bienestar emocional. Conectamos a profesionales certificados con personas que buscan un espacio seguro para su crecimiento personal.
          </p>
          <div className="crisis-disclaimer">
            <strong>Importante:</strong> Si estás en una crisis o emergencia médica, comunícate inmediatamente con los servicios de urgencia de tu localidad.
          </div>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Plataforma</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/terapia">Terapia</Link></li>
            <li><Link to="/professionals">Directorio de terapeutas</Link></li>
            <li><Link to="/botiquin/breathing">Botiquín de apoyo</Link></li>
            <li><Link to="/journal">Diario emocional</Link></li>
            <li><Link to="/recursos">Recursos</Link></li>
            <li><Link to="/comunidad">Comunidad</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-heading">Cuenta</h4>
          <ul className="footer-links">
            <li><Link to="/login">Iniciar sesión</Link></li>
            <li><Link to="/registro">Crear cuenta</Link></li>
            <li><Link to="/perfil">Mi perfil</Link></li>
          </ul>
        </div>
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Contacto</h4>
          <ul className="footer-contact-info">
            <li><span>Santiago, Chile</span></li>
            <li><span>+56 9 0000 0000</span></li>
            <li><a href="mailto:hola@abrazamente.cl">hola@abrazamente.cl</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>AbrazaMente SpA <span className="separator">|</span> Diseñado por <strong>Grupo 1</strong> <span className="separator">|</span> © Todos los derechos reservados 2026</p>
        </div>
      </div>
    </footer>
  );
}
