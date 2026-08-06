import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getToken } from '../../services/tokenStore';
import { getAvatarColor, getIniciales } from './therapyData';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const HORARIOS = ['09:00', '10:30', '12:00', '15:00', '16:30', '18:00'];

export default function TherapistModal({ especialista, onClose }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sesionesKey = `mental-app-sesiones-${user?.id ?? 'guest'}`;

  const [agendando, setAgendando] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState('10:30');
  const [confirmado, setConfirmado] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [sesionConfirmadaData, setSesionConfirmadaData] = useState(null);

  // Bloquea el scroll del fondo y devuelve el foco a la tarjeta al cerrar.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  // Escape cierra; Tab queda atrapado dentro del diálogo.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusables = [...modalRef.current.querySelectorAll(FOCUSABLE)];
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleStartAgendar = () => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }
    setAgendando(true);
  };

  const handleConfirmarReserva = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }
    setSubmitting(true);

    const dateStr = `${fecha}T${hora}:00.000Z`;
    const token = getToken();

    let teamsUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${Date.now()}@thread.v2/0`;
    let backendSesionId = Date.now();

    try {
      if (token) {
        const res = await fetch('/api/sesiones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            profesionalId: especialista.id,
            fechaHora: dateStr,
            notas: `Sesión agendada con ${especialista.nombre}`
          })
        });

        if (res.ok) {
          const apiSesion = await res.json();
          if (apiSesion?.teamsMeetingUrl) teamsUrl = apiSesion.teamsMeetingUrl;
          if (apiSesion?.id) backendSesionId = apiSesion.id;
        }
      }
    } catch (err) {
      console.warn('Backend agendamiento offline/fallback:', err);
    }

    const nuevaSesion = {
      id: backendSesionId,
      terapeutaNombre: especialista.nombre,
      especialidad: especialista.especialidad,
      fecha,
      hora,
      estado: 'Confirmada',
      teamsMeetingUrl: teamsUrl
    };

    try {
      const locales = JSON.parse(localStorage.getItem(sesionesKey) || '[]');
      localStorage.setItem(sesionesKey, JSON.stringify([nuevaSesion, ...locales]));
    } catch (err) {
      console.warn('Error al guardar sesión local:', err);
    }

    setSesionConfirmadaData(nuevaSesion);
    setConfirmado(true);
    setSubmitting(false);
  };

  return (
    <div
      className="terapia-modal-overlay"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="terapia-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modalName">
        <button type="button" className="terapia-modal-close" ref={closeRef} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="terapia-modal-header">
          <div className="terapia-modal-avatar" style={{ background: getAvatarColor(especialista.sexo) }} aria-hidden="true">
            {getIniciales(especialista.nombre)}
          </div>
          <div>
            <h3 id="modalName">{especialista.nombre}</h3>
            <p className="terapia-modal-role">{especialista.especialidad}</p>
          </div>
        </div>

        <div className="terapia-badges">
          <span className="terapia-badge badge-especialidad">{especialista.especialidad}</span>
          <span className="terapia-badge badge-terapia">{especialista.terapia}</span>
          <span className="terapia-badge badge-sexo">{especialista.sexo}</span>
        </div>

        <p className="terapia-modal-desc">{especialista.descripcion}</p>

        {showAuthWarning ? (
          <div style={{ background: 'rgba(255,138,101,0.12)', border: '1px solid rgba(255,138,101,0.4)', padding: '20px', borderRadius: '16px', marginTop: '16px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '1rem', color: '#D84315', fontWeight: 800 }}>
              🔒 Inicia sesión para agendar tu cita
            </h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.86rem', color: '#5C382C', lineHeight: 1.4 }}>
              Debes tener una cuenta en AbrazaMente para agendar sesiones terapéuticas y acceder al enlace de videollamada.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => { onClose(); navigate('/login', { state: { from: '/terapia' } }); }}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { onClose(); navigate('/registro'); }}
              >
                Registrarse
              </button>
            </div>
          </div>
        ) : !agendando ? (
          <>
            <div className="terapia-modal-section">
              <h4>Enfoque terapéutico</h4>
              <p>{especialista.enfoque}</p>
            </div>

            <div className="terapia-modal-section">
              <h4>Comentarios anónimos</h4>
              <ul className="testimonial-list">
                {Array.isArray(especialista?.comentarios) && especialista.comentarios.map((comentario, index) => {
                  const textVal = typeof comentario === 'string' ? comentario : (comentario?.texto || comentario?.comentario || 'Excelente profesional.');
                  const authorVal = typeof comentario === 'object' && comentario?.usuario ? comentario.usuario : `Comentario anónimo #${index + 1}`;
                  return (
                    <li key={index}>
                      “{textVal}”
                      <span className="testimonial-author">— {authorVal}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="terapia-modal-actions">
              <button type="button" className="btn-primary" onClick={handleStartAgendar}>
                Agendar sesión
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>Seguir explorando</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleConfirmarReserva} className="terapia-modal-section" style={{ background: isDark ? 'rgba(62,123,250,0.12)' : 'rgba(62,123,250,0.06)', borderRadius: '16px', padding: '20px', marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--brand-blue)' }}>
              Selecciona Fecha y Horario
            </h4>

            {confirmado ? (
              <div style={{ background: 'rgba(77,208,225,0.18)', border: '1.5px solid #4DD0E1', padding: '20px', borderRadius: '14px', color: isDark ? '#a5eef6' : '#0F5461', textAlign: 'center' }}>
                <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.05rem' }}>¡Sesión Agendada con Éxito! 🎉</strong>
                <p style={{ margin: '0 0 16px', fontSize: '0.88rem' }}>
                  Reserva confirmada con {especialista.nombre} para el {fecha} a las {hora} hrs.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => { onClose(); navigate('/perfil'); }}
                  >
                    Ver en Mi Perfil
                  </button>
                  {sesionConfirmadaData?.teamsMeetingUrl && (
                    <a
                      href={sesionConfirmadaData.teamsMeetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ background: '#5B5FC7', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem' }}
                    >
                      Enlace Teams 🎥
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>Fecha preferida:</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`, background: isDark ? 'rgba(30,30,32,0.8)' : 'white', color: 'var(--text-main)', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>Horario disponible:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {HORARIOS.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHora(h)}
                        style={{
                          padding: '8px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700,
                          border: hora === h ? '2px solid #3E7BFA' : `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
                          background: hora === h ? 'rgba(62,123,250,0.15)' : isDark ? 'rgba(30,30,32,0.8)' : 'white',
                          color: hora === h ? '#3E7BFA' : 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {h} hrs
                      </button>
                    ))}
                  </div>
                </div>

                <div className="terapia-modal-actions" style={{ marginTop: '12px' }}>
                  <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1 }}>
                    {submitting ? 'Agendando...' : 'Confirmar Reserva'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setAgendando(false)}>
                    Volver
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
