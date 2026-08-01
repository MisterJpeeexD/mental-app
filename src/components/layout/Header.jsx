import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const legacyLinks = [
  { label: 'Terapia', href: '/legacy/public/terapia.html' },
  { label: 'Comunidad', href: '/legacy/public/comunidad.html' },
  { label: 'Recursos', href: '/legacy/public/recursos.html' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="mente-header">
      <div className="header-container">
        <Link to="/" className="logo-link" aria-label="Ir al inicio" onClick={closeMenu}>
          <img src="/assets/AbrazaMente_Logo.svg" alt="AbrazaMente" className="logo-img" />
        </Link>

        <nav id="main-nav" className={`main-nav ${menuOpen ? 'active' : ''}`} aria-label="Navegación principal">
          <NavLink to="/" className="nav-link" onClick={closeMenu}>Inicio</NavLink>
          {legacyLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link" onClick={closeMenu}>{link.label}</a>
          ))}
          {user ? (
            <Link to="/perfil" className="btn-login mobile-login" onClick={closeMenu}>Mi perfil</Link>
          ) : (
            <Link to="/login" className="btn-login mobile-login" onClick={closeMenu}>Iniciar sesión</Link>
          )}
        </nav>

        <div className="header-actions">
          <button className="theme-toggle-btn" aria-label="Cambiar tema" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun strokeWidth={2} /> : <Moon strokeWidth={2} />}
          </button>
          {user ? (
            <>
              <Link to="/perfil" className="btn-login desktop-login">Mi perfil</Link>
              <button type="button" className="header-logout" onClick={logout}>Salir</button>
            </>
          ) : (
            <Link to="/login" className="btn-login desktop-login">Iniciar sesión</Link>
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
