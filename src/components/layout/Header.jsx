import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Cross, Moon, Sun } from 'lucide-react';

/* El botiquín sale del nav: vive como icono en .header-actions, que no se
   colapsa tras el hamburguesa y queda accesible siempre, también en móvil. */
const navLinks = [
  { label: 'Terapia', href: '/terapia' },
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Recursos', href: '/recursos' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  // Ya dentro del botiquín no hay fondo nuevo que guardar.
  const backgroundLocation = location.state?.backgroundLocation ?? location;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="mente-header">
      <div className="header-container">
        <Link to="/" className="logo-link" aria-label="Ir al inicio" onClick={closeMenu}>
          <img src="/assets/AbrazaMente_Logo.svg" alt="AbrazaMente" className="logo-img" />
        </Link>

        <nav id="main-nav" className={`main-nav ${menuOpen ? 'active' : ''}`} aria-label="Navegación principal">
          <NavLink to="/" className="nav-link" onClick={closeMenu}>Inicio</NavLink>
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.href} className="nav-link" onClick={closeMenu}>{link.label}</NavLink>
          ))}
          {user ? (
            <Link to="/perfil" className="btn-login mobile-login" onClick={closeMenu}>Mi perfil</Link>
          ) : (
            <>
              <Link to="/login" className="btn-login mobile-login" onClick={closeMenu}>Iniciar sesión</Link>
              <Link to="/registro" className="btn-login mobile-login" onClick={closeMenu}>Registrarse</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          <Link
            to="/botiquin/breathing"
            state={{ backgroundLocation }}
            className="btn-emergency btn-emergency--header"
            aria-label="Botiquín de apoyo inmediato"
            title="Botiquín de apoyo inmediato"
            onClick={closeMenu}
          >
            {/* mismo strokeWidth que Moon/Sun para que pesen igual en la barra */}
            <Cross aria-hidden="true" strokeWidth={2} />
          </Link>
          <button className="theme-toggle-btn" aria-label="Cambiar tema" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun strokeWidth={2} /> : <Moon strokeWidth={2} />}
          </button>
          {user ? (
            <>
              <Link to="/perfil" className="btn-login desktop-login">Mi perfil</Link>
              <button type="button" className="header-logout" onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login desktop-login" onClick={closeMenu}>Iniciar sesión</Link>
              <Link to="/registro" className="btn-login desktop-login" onClick={closeMenu}>Registrarse</Link>
            </>
          )}
          <button
            className={`hamburger-btn ${menuOpen ? 'active' : ''}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
    </header>
  );
}
