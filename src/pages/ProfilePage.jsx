import { Link, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-container">
        {location.state?.registered && <div className="form-alert form-alert--success">Tu cuenta fue creada y la sesión se inició correctamente.</div>}
        <section className="profile-card">
          <div className="profile-avatar">{user?.nombres?.[0]}{user?.apellidos?.[0]}</div>
          <div><span className="profile-eyebrow">Sesión activa</span><h1>{user?.nombres} {user?.apellidos}</h1><p>{user?.email}</p></div>
        </section>
        <section className="profile-details">
          <h2>Datos de la cuenta</h2>
          <dl>
            <div><dt>RUT</dt><dd>{user?.run}</dd></div>
            <div><dt>Fecha de nacimiento</dt><dd>{user?.fechaNacimiento || 'No registrada'}</dd></div>
            <div><dt>Ciudad</dt><dd>{user?.ciudad}</dd></div>
            <div><dt>Teléfono</dt><dd>{user?.telefono || 'No registrado'}</dd></div>
            <div><dt>Estado</dt><dd>{user?.estado}</dd></div>
            <div><dt>Rol</dt><dd>{user?.roles?.join(', ') || 'usuario'}</dd></div>
          </dl>
          <div className="profile-actions"><Link to="/" className="profile-primary">Ir al inicio</Link><button type="button" onClick={logout}>Cerrar sesión</button></div>
        </section>
      </main>
    </div>
  );
}
