import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, handleLogout }) => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  return (
    <header className="mente-header">
      <div className="header-container">
        <Link to="/" className="logo-link" aria-label="Ir al inicio">
          <img src="/images/AbrazaMente_Logo.svg" alt="AbrazaMente Logo" className="logo-img" />
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/professionals" className="nav-link">Terapia</Link>
          {/* <Link to="/comunidad" className="nav-link">Comunidad</Link> - TODO */}
          <Link to="/journal" className="nav-link">Diario</Link>
          <Link to="/botiquin/breathing" className="nav-link">Recursos</Link>
        </nav>
        <div className="header-actions">
          <button id="theme-toggle" className="theme-toggle-btn" aria-label="Cambiar modo oscuro" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          
          {user ? (
            <button onClick={handleLogout} className="btn-login" style={{cursor: 'pointer'}}>Salir</button>
          ) : (
            <Link to="/auth" className="btn-login">Iniciar sesión</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
