import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mente-footer reveal">
      <div className="footer-container">
        {/* Marca */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <img src="/assets/AbrazaMente_Logo.svg" alt="Abrazamente" className="footer-logo-img" />
          </Link>
          <p className="footer-description">
            Plataforma integral orientada al bienestar emocional. Conectamos a profesionales certificados con personas que buscan un espacio seguro para su crecimiento personal.
          </p>
          <div className="crisis-disclaimer">
            <strong>Importante:</strong> Si estás en una crisis o emergencia médica, comunícate inmediatamente con los servicios de urgencia de tu localidad.
          </div>
        </div>

        {/* Plataforma */}
        <div className="footer-col">
          <h4 className="footer-heading">Plataforma</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/professionals">Terapia</Link></li>
            <li><Link to="/botiquin/breathing">Botiquín</Link></li>
            <li><Link to="/recursos">Recursos</Link></li>
            <li><Link to="/comunidad">Comunidad</Link></li>
          </ul>
        </div>

        {/* Cuenta */}
        <div className="footer-col">
          <h4 className="footer-heading">Cuenta</h4>
          <ul className="footer-links">
            <li><Link to="/login">Iniciar sesión</Link></li>
            <li><Link to="/registro">Crear cuenta</Link></li>
            <li><Link to="/perfil">Mi perfil</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Contacto</h4>
          <ul className="footer-contact-info">
            <li><span>Santiago, Chile</span></li>
            <li><span>+56 9 0000 0000</span></li>
            <li>
              <a href="mailto:hola@abrazamente.cl" style={{ color: 'inherit', textDecoration: 'none' }}>
                hola@abrazamente.cl
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            Abrazamente
            <span className="separator"> | </span>
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
