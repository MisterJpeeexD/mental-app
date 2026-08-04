import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAvatarColor, getIniciales } from './therapyData';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function TherapistModal({ especialista, onClose }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);

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

        <div className="terapia-modal-section">
          <h4>Enfoque terapéutico</h4>
          <p>{especialista.enfoque}</p>
        </div>

        <div className="terapia-modal-section">
          <h4>Comentarios anónimos</h4>
          {/* No se muestra ningún dato personal de quien comenta */}
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
          <Link to="/professionals" className="btn-primary">Agendar sesión</Link>
          <button type="button" className="btn-secondary" onClick={onClose}>Seguir explorando</button>
        </div>
      </div>
    </div>
  );
}
