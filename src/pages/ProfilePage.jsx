import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function ProfilePage() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [sesiones, setSesiones] = useState([]);
  const [loadingSesiones, setLoadingSesiones] = useState(true);

  import('react').then(({ useEffect }) => {
    useEffect(() => {
      if (user) {
        import('../services/apiClient').then(({ apiRequest }) => {
          apiRequest('/api/sesiones/mis-sesiones')
            .then(data => {
              setSesiones(data);
              setLoadingSesiones(false);
            })
            .catch(err => {
              console.error('Error fetching sesiones', err);
              setLoadingSesiones(false);
            });
        });
      }
    }, [user]);
  });

  return (
    <main className="profile-container">
      {location.state?.registered && <div className="form-alert form-alert--success">Tu cuenta fue creada y la sesión se inició correctamente.</div>}
      
      <section className="profile-card">
        <div className="profile-avatar">{user?.nombres?.[0]}{user?.apellidos?.[0]}</div>
        <div><span className="profile-eyebrow">Sesión activa</span><h1>{user?.nombres} {user?.apellidos}</h1><p>{user?.email}</p></div>
      </section>

      {/* SECCIÓN MIS SESIONES (Teams) */}
      <section className="profile-details" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Mis Sesiones</h2>
          <Link to="/terapia" style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 600, textDecoration: 'none' }}>+ Agendar Nueva</Link>
        </div>
        
        {loadingSesiones ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cargando sesiones...</p>
        ) : sesiones.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', marginTop: '12px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No tienes sesiones agendadas.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {sesiones.map(sesion => (
              <div key={sesion.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px',
                background: 'var(--bg-card)'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600 }}>Sesión con {sesion.profesionalNombre}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(sesion.fechaHora).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  <span style={{ 
                    display: 'inline-block', marginTop: '8px', padding: '2px 8px', borderRadius: '100px',
                    fontSize: '0.7rem', fontWeight: 700,
                    background: sesion.estado === 'PENDIENTE' ? 'rgba(255, 138, 101, 0.15)' : 'rgba(77, 208, 225, 0.15)',
                    color: sesion.estado === 'PENDIENTE' ? '#c75e35' : '#009aab'
                  }}>
                    {sesion.estado}
                  </span>
                </div>
                {sesion.teamsMeetingUrl && sesion.estado === 'PENDIENTE' && (
                  <a href={sesion.teamsMeetingUrl} target="_blank" rel="noopener noreferrer" style={{
                    padding: '8px 16px', background: '#5B5FC7', color: 'white', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'opacity 0.2s'
                  }}>
                    Unirse por Teams
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="profile-details" style={{ marginTop: '24px' }}>
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
  );
}
