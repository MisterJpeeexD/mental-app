# Configuración de Rutas y Rutas Protegidas (Issue #35)

Esta guía técnica detalla la arquitectura de enrutamiento implementada en **AbrazaMente (`mental-app`)**, explicando el funcionamiento del componente guardián (`ProtectedRoute.jsx`), las jerarquías de rutas en la SPA y el dinamismo de la navegación en el encabezado global (`Header.jsx`).

---

## 🧭 Jerarquía de Rutas de la SPA

El mapa de navegación web está estructurado para segmentar de forma precisa el contenido libre y el contenido clínico/social restringido.

```text
/ (Página de Inicio / Landing - Público)
├── /recursos (Biblioteca Psicoeducativa - Público)
├── /professionals (Directorio de Terapeutas - Público)
├── /auth (Formulario de Acceso y OAuth Google - Público)
└── [Rutas Privadas / Protegidas]
    ├── /comunidad (Foro Comunitario y Red Social - Protegido)
    └── /journal (Diario de Calma / Mood Tracker - Protegido)
```

---

## ⚙️ Implementación Detallada del Sistema de Enrutamiento

### 1. El Guardián de Rutas (`ProtectedRoute.jsx`)
Este componente encapsula las vistas que requieren autenticación. Verifica tanto el estado reactivo del usuario en la aplicación como la persistencia del token de seguridad en la memoria física del navegador:

```javascript
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Filtro de seguridad (Guard) a nivel de enrutador.
 * @param {Object} user - Estado del usuario activo en la aplicación.
 * @param {string} redirectPath - Ruta de redirección en caso de no estar autenticado.
 */
const ProtectedRoute = ({ user, redirectPath = '/auth' }) => {
  // 1. Obtener credenciales desde localStorage (o cookies de sesión de forma segura)
  const token = localStorage.getItem('token');
  const sessionUser = localStorage.getItem('user');

  // 2. Determinar estado de autenticación (usuario reactivo o token persistido)
  const isAuthenticated = user || Boolean(token) || Boolean(sessionUser);

  // 3. Redirección condicional limpia
  if (!isAuthenticated) {
    console.warn("Acceso denegado: Redirigiendo a pantalla de autenticación.");
    return <Navigate to={redirectPath} replace />;
  }

  // 4. Renderizar rutas anidadas mediante Outlet
  return <Outlet />;
};

export default ProtectedRoute;
```

---

### 2. Configuración en el Enrutador Principal (`App.jsx`)
El archivo principal de la aplicación organiza el sistema de rutas dinámicas empleando **React Router**. Cuenta con división de código (*code-splitting*) mediante `React.lazy()` para acelerar el renderizado inicial reduciendo el peso de la página:

```javascript
// src/App.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';

// Importaciones dinámicas (Lazy Loading)
const BreathingTimer = React.lazy(() => import('./features/breathing/BreathingTimer'));
const GroundingWizard = React.lazy(() => import('./features/grounding/GroundingWizard'));
const MoodTracker = React.lazy(() => import('./features/journal/MoodTracker'));
const ProfessionalDirectory = React.lazy(() => import('./features/professionals/ProfessionalDirectory'));
const CommunityForum = React.lazy(() => import('./features/community/CommunityForum'));
const ResourceLibrary = React.lazy(() => import('./features/resources/ResourceLibrary'));
const AuthModal = React.lazy(() => import('./features/auth/AuthModal'));

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cargar sesión del usuario al montar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error al decodificar sesión persistida:", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (data) => {
    setUser({ email: data.email || data.username, role: data.role });
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F10] text-white">
      <Header user={user} handleLogout={handleLogout} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <span className="text-sm text-gray-400 animate-pulse">Cargando módulo de bienestar...</span>
          </div>
        }>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/recursos" element={<ResourceLibrary />} />
            <Route path="/professionals" element={<ProfessionalDirectory />} />
            
            {/* Rutas de Bienestar - Subrutas */}
            <Route path="/botiquin/breathing" element={<BreathingTimer />} />
            <Route path="/botiquin/grounding" element={<GroundingWizard />} />

            <Route path="/auth" element={<AuthModal onLogin={handleLogin} />} />

            {/* Rutas Protegidas (Filtro de Seguridad) */}
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/comunidad" element={<CommunityForum />} />
              <Route path="/journal" element={<MoodTracker />} />
            </Route>

            {/* Fallback de error 404 */}
            <Route path="*" element={
              <div className="text-center py-12">
                <h2 className="text-xl font-bold">Página no encontrada</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-sm text-purple-400 hover:underline">
                  Volver al inicio
                </button>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
```

---

### 3. Navegación Dinámica e Indicación Activa (`Header.jsx`)
Para mantener informados a los usuarios sobre su ubicación actual en la web, el `Header` emplea estilos condicionales interactivos mediante `<NavLink>`:

```javascript
// src/components/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ user, handleLogout }) {
  // Clase condicional activa dinámica basada en el estado de React Router
  const navLinkStyle = ({ isActive }) => 
    `text-sm font-medium transition-all duration-200 py-1.5 px-3 rounded-lg ${
      isActive 
        ? 'bg-white/10 text-white font-semibold shadow-inner border border-white/5' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="bg-[#1E1E20]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Isotipo Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <img src="/images/AbrazaMente_Logo.svg" alt="AbrazaMente Logo" className="h-7 w-auto" />
          <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
            ABRAZAMENTE
          </span>
        </Link>

        {/* Navegación Enlaces de SPA */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navLinkStyle} end>Inicio</NavLink>
          <NavLink to="/recursos" className={navLinkStyle}>Recursos</NavLink>
          <NavLink to="/professionals" className={navLinkStyle}>Terapia</NavLink>
          <NavLink to="/comunidad" className={navLinkStyle}>Comunidad</NavLink>
          <NavLink to="/journal" className={navLinkStyle}>Diario</NavLink>
        </nav>

        {/* Acciones de Login / Perfil */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {user.email.charAt(0)}
              </div>
              <span className="text-xs text-gray-300 hidden lg:inline max-w-[120px] truncate">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-[11px] text-gray-400 hover:text-red-400 font-semibold border-l border-white/10 pl-2 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
```
