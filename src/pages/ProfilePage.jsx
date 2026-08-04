import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/apiClient';
import { Calendar, User, LogOut, Home, CheckCircle, Clock } from 'lucide-react';

const BRAND = {
  blue:   '#3E7BFA',
  orange: '#FF8A65',
  teal:   '#4DD0E1',
  purple: '#BA68C8',
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [sesiones, setSesiones] = useState([]);
  const [loadingSesiones, setLoadingSesiones] = useState(true);

  useEffect(() => {
    const getLocalSesiones = () => {
      try {
        return JSON.parse(localStorage.getItem('mental-app-sesiones') || '[]');
      } catch {
        return [];
      }
    };

    if (user) {
      apiRequest('/api/sesiones/mis-sesiones')
        .then(data => { 
          const combined = Array.isArray(data) && data.length > 0 ? data : getLocalSesiones();
          setSesiones(combined); 
          setLoadingSesiones(false); 
        })
        .catch(() => {
          setSesiones(getLocalSesiones());
          setLoadingSesiones(false);
        });
    } else {
      setSesiones(getLocalSesiones());
      setLoadingSesiones(false);
    }
  }, [user]);

  const initials = `${user?.nombres?.[0] || ''}${user?.apellidos?.[0] || ''}`.toUpperCase();

  return (
    <div style={{ minHeight: '100vh', paddingTop: '130px', paddingBottom: '100px' }}>
      {/* Mesh background */}
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob blob-blue" />
        <div className="mesh-blob blob-orange" />
        <div className="mesh-blob blob-teal" />
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>

        {/* Success alert */}
        {location.state?.registered && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(77,208,225,0.12)', border: '1px solid rgba(77,208,225,0.3)',
            borderRadius: '16px', padding: '14px 20px', marginBottom: '28px',
            color: '#007a8a', fontSize: '0.9rem', fontWeight: 600,
          }}>
            <CheckCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            Tu cuenta fue creada y la sesión se inició correctamente.
          </div>
        )}

        {/* Profile Hero Card */}
        <div style={{
          background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.85)',
          borderRadius: '32px', padding: '36px', marginBottom: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.blue})`,
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-0.04em',
            boxShadow: 'var(--orb-shadow)',
          }}>
            {initials || <User style={{ width: '36px', height: '36px' }} />}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--text-muted)', background: 'rgba(255,255,255,0.5)',
              padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.8)',
              marginBottom: '10px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: BRAND.teal, display: 'inline-block' }} />
              Sesión activa
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: '0 0 4px' }}>
              {user?.nombres} {user?.apellidos}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{user?.email}</p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '14px',
                background: `linear-gradient(135deg, ${BRAND.blue}, #5a91f5)`,
                color: 'white', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700,
                boxShadow: '0 6px 20px rgba(62,123,250,0.3)',
              }}
            >
              <Home style={{ width: '16px', height: '16px' }} />
              Inicio
            </Link>
            <button
              type="button" onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '14px', border: '1px solid rgba(134,134,139,0.2)',
                background: 'rgba(255,255,255,0.5)', color: 'var(--text-muted)',
                fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div style={{
          background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.85)',
          borderRadius: '32px', padding: '32px', marginBottom: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            Datos de la cuenta
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { label: 'RUT', value: user?.run },
              { label: 'Fecha de nacimiento', value: user?.fechaNacimiento || 'No registrada' },
              { label: 'Ciudad', value: user?.ciudad },
              { label: 'Teléfono', value: user?.telefono || 'No registrado' },
              { label: 'Estado', value: user?.estado },
              { label: 'Rol', value: user?.roles?.join(', ') || 'usuario' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '16px', padding: '16px',
              }}>
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {label}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div style={{
          background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.85)',
          borderRadius: '32px', padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Mis Sesiones
            </h2>
            <Link
              to="/terapia"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.82rem', color: BRAND.blue, fontWeight: 700,
                textDecoration: 'none', padding: '6px 14px', borderRadius: '10px',
                background: 'rgba(62,123,250,0.08)', border: '1px solid rgba(62,123,250,0.2)',
              }}
            >
              <Calendar style={{ width: '14px', height: '14px' }} />
              + Agendar Nueva
            </Link>
          </div>

          {loadingSesiones ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px' }}>
              Cargando sesiones...
            </p>
          ) : sesiones.length === 0 ? (
            <div style={{
              padding: '40px 24px', textAlign: 'center',
              background: 'rgba(255,255,255,0.4)', borderRadius: '20px',
              border: '1px dashed rgba(134,134,139,0.3)',
            }}>
              <Calendar style={{ width: '36px', height: '36px', color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 16px' }}>No tienes sesiones agendadas.</p>
              <Link
                to="/terapia"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '10px 22px', borderRadius: '14px',
                  background: `linear-gradient(135deg, ${BRAND.blue}, #5a91f5)`,
                  color: 'white', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700,
                  boxShadow: '0 6px 20px rgba(62,123,250,0.3)',
                }}
              >
                Explorar especialistas
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sesiones.map(sesion => (
                <div key={sesion.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '18px 20px', border: '1px solid rgba(255,255,255,0.8)',
                  borderRadius: '20px', background: 'rgba(255,255,255,0.5)',
                  gap: '16px', flexWrap: 'wrap',
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Sesión con {sesion.profesionalNombre}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <Clock style={{ width: '13px', height: '13px' }} />
                      {new Date(sesion.fechaHora).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    <span style={{
                      display: 'inline-block', marginTop: '8px', padding: '3px 10px', borderRadius: '100px',
                      fontSize: '0.7rem', fontWeight: 800,
                      background: sesion.estado === 'PENDIENTE' ? 'rgba(255,138,101,0.15)' : 'rgba(77,208,225,0.15)',
                      color: sesion.estado === 'PENDIENTE' ? '#c75e35' : '#009aab',
                    }}>
                      {sesion.estado}
                    </span>
                  </div>
                  {sesion.teamsMeetingUrl && sesion.estado === 'PENDIENTE' && (
                    <a
                      href={sesion.teamsMeetingUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        padding: '10px 18px', background: '#5B5FC7', color: 'white', borderRadius: '14px',
                        textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(91,95,199,0.3)', whiteSpace: 'nowrap',
                      }}
                    >
                      Unirse por Teams
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
