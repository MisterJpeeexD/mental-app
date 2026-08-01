import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mente-footer reveal">
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
            <li><a href="/legacy/public/terapia.html">Especialistas</a></li>
            <li><a href="/legacy/public/recursos.html">Herramientas</a></li>
            <li><a href="/legacy/public/comunidad.html">Comunidad</a></li>
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
            <li><span>hola@menteconecta.cl</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>Mente Conecta SpA <span className="separator">|</span> Diseñado por <strong>Grupo 1</strong> <span className="separator">|</span> © Todos los derechos reservados 2026</p>
        </div>
      </div>
    </footer>
  );
}
