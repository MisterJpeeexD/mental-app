import { getAvatarColor, getIniciales } from './therapyData';

/* Tarjeta clickeable de terapeuta. Es un <button> para que funcione
   con teclado y lectores de pantalla, no un <article> con onClick. */
export default function TherapistCard({ especialista, onSelect }) {
  return (
    <button
      type="button"
      className="spec-card"
      onClick={() => onSelect(especialista)}
      aria-label={`Ver detalle de ${especialista.nombre}`}
    >
      <div className="spec-card-top">
        <div className="spec-avatar" style={{ background: getAvatarColor(especialista.sexo) }} aria-hidden="true">
          {getIniciales(especialista.nombre)}
        </div>
        <div>
          <h3>{especialista.nombre}</h3>
          <p className="spec-role">{especialista.especialidad}</p>
        </div>
      </div>
      <p className="spec-desc">{especialista.descripcion}</p>
      <div className="terapia-badges">
        <span className="terapia-badge badge-especialidad">{especialista.especialidad}</span>
        <span className="terapia-badge badge-terapia">{especialista.terapia}</span>
        <span className="terapia-badge badge-sexo">{especialista.sexo}</span>
      </div>
    </button>
  );
}
