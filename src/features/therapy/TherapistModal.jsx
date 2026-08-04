import { useEffect, useRef, useState } from 'react';
import { getAvatarColor, getIniciales } from './therapyData';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const HORARIOS = ['09:00', '10:30', '12:00', '15:00', '16:30', '18:00'];

export default function TherapistModal({ especialista, onClose }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const [agendando, setAgendando] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState('10:30');
  const [confirmado, setConfirmado] = useState(false);

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

  const handleConfirmarReserva = (e) => {
    e.preventDefault();
    setConfirmado(true);

    const nuevaSesion = {
      id: Date.now(),
      terapeutaNombre: especialista.nombre,
      especialidad: especialista.especialidad,
      fecha,
      hora,
      estado: 'Confirmada'
    };

    try {
      const locales = JSON.parse(localStorage.getItem('mental-app-sesiones') || '[]');
      localStorage.setItem('mental-app-sesiones', JSON.stringify([nuevaSesion, ...locales]));
    } catch (err) {
      console.warn('Error guardando sesión local:', err);
    }

    setTimeout(() => {
      setConfirmado(false);
      setAgendando(false);
      onClose();
    }, 2500);
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

        {!agendando ? (
          <>
            <div className="terapia-modal-section">
              <h4>Enfoque terapéutico</h4>
              <p>{especialista.enfoque}</p>
            </div>

            <div className="terapia-modal-section">
              <h4>Comentarios anónimos</h4>
              <ul className="testimonial-list">
                {especialista.comentarios.map((comentario, index) => (
                  <li key={comentario}>
                    “{comentario}”
                    <span className="testimonial-author">— Comentario anónimo #{index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="terapia-modal-actions">
              <button type="button" className="btn-primary" onClick={() => setAgendando(true)}>
                Agendar sesión
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>Seguir explorando</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleConfirmarReserva} className="terapia-modal-section" style={{ background: 'rgba(62,123,250,0.06)', borderRadius: '16px', padding: '20px', marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'var(--brand-blue)' }}>
              Selecciona Fecha y Horario
            </h4>

            {confirmado ? (
              <div style={{ background: 'rgba(77,208,225,0.15)', border: '1px solid rgba(77,208,225,0.4)', padding: '16px', borderRadius: '14px', color: '#166572', textAlign: 'center' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>¡Sesión Agendada con Éxito! 🎉</strong>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Reserva confirmada con {especialista.nombre} para el {fecha} a las {hora} hrs.
                </p>
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
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.15)', background: 'white', fontFamily: 'inherit' }}
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
                          border: hora === h ? '2px solid #3E7BFA' : '1px solid rgba(0,0,0,0.1)',
                          background: hora === h ? 'rgba(62,123,250,0.15)' : 'white',
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
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Confirmar Reserva
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
