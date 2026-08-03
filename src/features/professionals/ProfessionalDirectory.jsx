import { useState, useMemo } from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/apiClient';

/* ─── Paleta ─────────────────────────────────────────────── */
const BRAND = {
  blue:   '#3E7BFA',
  orange: '#FF8A65',
  teal:   '#4DD0E1',
  purple: '#BA68C8',
};

/* ─── Datos de especialistas (migrados de terapia.js) ─────── */
const ESPECIALISTAS = [
  { id:1,  nombre:'Dra. Camila Rojas',       sexo:'Mujer',  especialidad:'Psicología Clínica',     terapia:'Terapia cognitivo-conductual',  descripcion:'Especialista en manejo de ansiedad y estrés con enfoque práctico y basado en evidencia.', enfoque:'Ayudar a identificar y transformar patrones de pensamiento que generan malestar, fortaleciendo herramientas prácticas para el día a día.', comentarios:['Me ayudó a entender mis pensamientos automáticos y a manejarlos mejor.','Las sesiones son estructuradas y con ejercicios muy útiles.','Sentí un ambiente de confianza desde la primera sesión.'] },
  { id:2,  nombre:'Lic. Andrés Fuenzalida',  sexo:'Hombre', especialidad:'Psicología Humanista',   terapia:'Terapia humanista',             descripcion:'Enfocado en el crecimiento personal y la exploración emocional desde una mirada cálida y no directiva.', enfoque:'Acompañar procesos de autoconocimiento y aceptación personal, respetando el ritmo propio de cada persona.', comentarios:['Nunca sentí juicio, solo escucha genuina.','Me permitió reconectar conmigo mismo después de un momento difícil.'] },
  { id:3,  nombre:'Dra. Valentina Soto',     sexo:'Mujer',  especialidad:'Terapia Familiar',       terapia:'Terapia familiar',              descripcion:'Trabaja con dinámicas familiares complejas, mediación y resolución de conflictos.', enfoque:'Fortalecer la comunicación y los vínculos familiares, promoviendo espacios seguros de diálogo.', comentarios:['Nuestra familia logró comunicarse de una forma que no habíamos podido antes.','Muy profesional y respetuosa con todos los integrantes.'] },
  { id:4,  nombre:'Lic. Martín Ibáñez',      sexo:'Hombre', especialidad:'Terapia de Pareja',      terapia:'Terapia de pareja',             descripcion:'Especialista en conflictos de pareja, comunicación y reconstrucción de confianza.', enfoque:'Promover la comprensión mutua y el fortalecimiento del vínculo a través de la comunicación consciente.', comentarios:['Nos dio herramientas concretas para dejar de repetir las mismas peleas.','Un espacio neutral donde ambos pudimos hablar con libertad.'] },
  { id:5,  nombre:'Dra. Fernanda Muñoz',     sexo:'Mujer',  especialidad:'Psicología Clínica',     terapia:'Terapia para ansiedad',         descripcion:'Amplia experiencia en trastornos de ansiedad y técnicas de respiración y relajación.', enfoque:'Brindar herramientas de regulación emocional para reducir el impacto de la ansiedad en la vida diaria.', comentarios:['Aprendí a reconocer mis crisis de ansiedad antes de que escalaran.','Sus técnicas de respiración cambiaron mi día a día.'] },
  { id:6,  nombre:'Lic. Ignacio Pardo',      sexo:'Hombre', especialidad:'Psicología Clínica',     terapia:'Terapia para depresión',        descripcion:'Trabaja con procesos de duelo, desmotivación y episodios depresivos desde un enfoque compasivo.', enfoque:'Acompañar el proceso de reconexión con actividades y vínculos significativos, a paso constante.', comentarios:['Me ayudó a dar pequeños pasos cuando sentía que no podía con nada.','Muy paciente y respetuoso con mis tiempos.'] },
  { id:7,  nombre:'Dra. Josefina Herrera',   sexo:'Mujer',  especialidad:'Coaching Emocional',     terapia:'Terapia de crecimiento personal',descripcion:'Enfocada en procesos de crecimiento personal, autoestima y toma de decisiones vitales.', enfoque:'Potenciar la autoestima y el propósito personal a través de la reflexión guiada y metas concretas.', comentarios:['Me ayudó a clarificar qué quería realmente para mi vida.','Sesiones motivadoras y muy prácticas.'] },
  { id:8,  nombre:'Lic. Rodrigo Vidal',      sexo:'Hombre', especialidad:'Orientación Emocional',  terapia:'Orientación emocional',         descripcion:'Ideal como primer acercamiento para quienes no saben por dónde empezar su proceso emocional.', enfoque:'Ofrecer un primer espacio de contención y orientación para identificar el tipo de apoyo que se necesita.', comentarios:['Me orientó muy bien hacia el tipo de terapia que realmente necesitaba.','Un primer espacio muy contenedor y claro.'] },
  { id:9,  nombre:'Dra. Paula Contreras',    sexo:'Mujer',  especialidad:'Psicología Humanista',   terapia:'Terapia humanista',             descripcion:'Especialista en procesos de transición vital y búsqueda de sentido.', enfoque:'Explorar el sentido de vida y la coherencia entre valores personales y acciones cotidianas.', comentarios:['Me acompañó en un cambio de vida muy grande con mucha calidez.','Sentí que podía hablar de todo sin miedo a ser juzgada.'] },
  { id:10, nombre:'Lic. Diego Salazar',      sexo:'Hombre', especialidad:'Terapia Familiar',       terapia:'Terapia familiar',              descripcion:'Enfoque sistémico orientado a mejorar la convivencia y los acuerdos familiares.', enfoque:'Trabajar en conjunto con las familias para construir acuerdos y mejorar la convivencia diaria.', comentarios:['Ayudó a que mis padres y yo pudiéramos entendernos mejor.','Muy claro y objetivo al mediar entre todos.'] },
];

/* ─── Orientación (de terapia.js legacy) ─────────────────── */
const ORIENTACION = [
  { titulo:'Ansiedad o estrés constante',          texto:'La terapia cognitivo-conductual y la terapia para ansiedad suelen ofrecer herramientas prácticas de regulación.' },
  { titulo:'Tristeza o desmotivación prolongada',  texto:'La terapia para depresión puede acompañar el proceso con un ritmo compasivo y sostenido.' },
  { titulo:'Conflictos familiares',                texto:'La terapia familiar ayuda a mejorar la comunicación y construir acuerdos entre todos los integrantes.' },
  { titulo:'Dificultades en la pareja',            texto:'La terapia de pareja ofrece un espacio neutral para trabajar la comunicación y la confianza.' },
  { titulo:'Búsqueda de sentido o autoconocimiento',texto:'La terapia humanista y la terapia de crecimiento personal exploran el propósito y la aceptación personal.' },
  { titulo:'No sabes por dónde empezar',           texto:'La orientación emocional es un buen primer paso para identificar qué tipo de apoyo necesitas.' },
];

/* ─── Utilidades ─────────────────────────────────────────── */
function getIniciales(nombre) {
  const partes = nombre.replace(/^(Dra?\.|Lic\.)\s*/i, '').split(' ');
  return ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase();
}

function getAvatarGradient(sexo) {
  return sexo === 'Mujer'
    ? `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.blue})`
    : `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.blue})`;
}

/* ─── Sub-componentes ───────────────────────────────────── */
function OrientacionCard({ item }) {
  return (
    <article style={{
      background: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.72)',
      borderRadius: '24px', padding: '28px',
      boxShadow: '0 20px 45px rgba(0,0,0,0.05)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 26px 54px rgba(0,0,0,0.08)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.05)'; }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 10px' }}>{item.titulo}</h3>
      <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text-muted)', margin: 0 }}>{item.texto}</p>
    </article>
  );
}

function EspecialistaCard({ esp, onClick }) {
  return (
    <article
      onClick={() => onClick(esp)}
      style={{
        background: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.72)',
        borderRadius: '28px', padding: '26px', cursor: 'pointer',
        boxShadow: '0 20px 45px rgba(0,0,0,0.05)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 28px 56px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = 'rgba(62,123,250,0.24)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.72)'; }}
    >
      {/* Top: avatar + nombre */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
          background: getAvatarGradient(esp.sexo), color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.04em',
          boxShadow: 'var(--orb-shadow)',
        }}>
          {getIniciales(esp.nombre)}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{esp.nombre}</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{esp.especialidad}</p>
        </div>
      </div>

      {/* Descripción */}
      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {esp.descripcion}
      </p>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', background: 'rgba(77,208,225,0.16)', color: '#19707d' }}>{esp.especialidad}</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', background: 'rgba(62,123,250,0.14)', color: BRAND.blue }}>{esp.terapia}</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', background: 'rgba(255,138,101,0.17)', color: '#b65031' }}>{esp.sexo}</span>
      </div>
    </article>
  );
}

function Modal({ esp, onClose }) {
  const { isAuthenticated, user } = useAuth();
  const [agendando, setAgendando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleAgendar = async () => {
    if (!isAuthenticated) {
      setMensaje({ error: true, texto: 'Inicia sesión para agendar' });
      return;
    }
    setAgendando(true);
    setMensaje(null);
    try {
      // Calculamos una fecha mock: mañana a las 10:00 AM
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      manana.setHours(10, 0, 0, 0);

      await apiRequest('/api/sesiones', {
        method: 'POST',
        body: JSON.stringify({
          profesionalId: esp.id,
          fechaHora: manana.toISOString(),
          notas: 'Primera sesión desde el directorio'
        })
      });

      setMensaje({ error: false, texto: 'Sesión agendada con éxito. Revisa tu perfil.' });
    } catch (err) {
      setMensaje({ error: true, texto: err.message || 'Error al agendar sesión' });
    } finally {
      setAgendando(false);
    }
  };

  if (!esp) return null;
  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="modal-name"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(18,18,18,0.48)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', zIndex: 2000,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div style={{
        width: 'min(600px, 100%)', maxHeight: '86vh', overflowY: 'auto',
        position: 'relative', background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.75)', borderRadius: '32px',
        padding: '32px', boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
        animation: 'slideUp 0.22s ease',
      }}>
        {/* Cerrar */}
        <button
          onClick={onClose} aria-label="Cerrar"
          style={{ position: 'absolute', top: '18px', right: '18px', width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'rgba(134,134,139,0.14)', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: getAvatarGradient(esp.sexo), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', flexShrink: 0, boxShadow: 'var(--orb-shadow)' }}>
            {getIniciales(esp.nombre)}
          </div>
          <div>
            <h3 id="modal-name" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>{esp.nombre}</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>{esp.especialidad}</p>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '5px 11px', borderRadius: '100px', background: 'rgba(77,208,225,0.16)', color: '#19707d' }}>{esp.especialidad}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '5px 11px', borderRadius: '100px', background: 'rgba(62,123,250,0.14)', color: BRAND.blue }}>{esp.terapia}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '5px 11px', borderRadius: '100px', background: 'rgba(255,138,101,0.17)', color: '#b65031' }}>{esp.sexo}</span>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 20px' }}>{esp.descripcion}</p>

        {/* Enfoque */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Enfoque terapéutico</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.65, margin: 0 }}>{esp.enfoque}</p>
        </div>

        {/* Comentarios anónimos */}
        <div>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Comentarios anónimos</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {esp.comentarios.map((c, i) => (
              <li key={i} style={{ background: 'rgba(62,123,250,0.08)', border: '1px solid rgba(62,123,250,0.12)', borderRadius: '16px', padding: '12px 16px', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                "{c}"
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.73rem', marginTop: '6px', fontStyle: 'italic' }}>— Comentario anónimo #{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Acciones */}
        <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mensaje && (
            <div style={{ 
              padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
              background: mensaje.error ? 'rgba(255, 138, 101, 0.15)' : 'rgba(77, 208, 225, 0.15)',
              color: mensaje.error ? '#c75e35' : '#009aab', border: `1px solid ${mensaje.error ? 'rgba(255, 138, 101, 0.3)' : 'rgba(77, 208, 225, 0.3)'}`
            }}>
              {mensaje.texto}
            </div>
          )}
          
          <button 
            onClick={handleAgendar}
            disabled={agendando}
            style={{
              width: '100%', padding: '14px', borderRadius: '16px', border: 'none',
              background: 'linear-gradient(135deg, var(--brand-blue), #5a91f5)',
              color: 'white', fontSize: '1rem', fontWeight: 700, cursor: agendando ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 24px rgba(62,123,250,0.25)', transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: agendando ? 0.7 : 1
            }}
          >
            <Calendar style={{ width: '18px', height: '18px' }} />
            {agendando ? 'Agendando...' : `Agendar Sesión con ${esp.nombre.split(' ')[1]}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────── */
export default function ProfessionalDirectory() {
  const [busqueda, setBusqueda] = useState('');
  const [filterEsp, setFilterEsp]   = useState('');
  const [filterTer, setFilterTer]   = useState('');
  const [filterSexo, setFilterSexo] = useState('');
  const [modalEsp, setModalEsp] = useState(null);

  const especialidades = useMemo(() => [...new Set(ESPECIALISTAS.map(e => e.especialidad))].sort(), []);
  const terapias       = useMemo(() => [...new Set(ESPECIALISTAS.map(e => e.terapia))].sort(), []);

  const filtrados = useMemo(() => {
    return ESPECIALISTAS.filter(e => {
      const hay = `${e.nombre} ${e.descripcion}`.toLowerCase();
      if (busqueda && !hay.includes(busqueda.toLowerCase())) return false;
      if (filterEsp  && e.especialidad !== filterEsp) return false;
      if (filterTer  && e.terapia !== filterTer) return false;
      if (filterSexo && e.sexo !== filterSexo) return false;
      return true;
    });
  }, [busqueda, filterEsp, filterTer, filterSexo]);

  const limpiar = () => { setBusqueda(''); setFilterEsp(''); setFilterTer(''); setFilterSexo(''); };
  const hayFiltros = busqueda || filterEsp || filterTer || filterSexo;

  return (
    <>
      {/* Sección de orientación */}
      <section id="orientacion" style={{ marginBottom: '56px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.5)', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.8)', marginBottom: '14px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: BRAND.orange, display: 'inline-block' }} />
            Orientación
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px', letterSpacing: '-0.03em' }}>¿Qué terapia puede acompañarte hoy?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Una guía práctica para identificar enfoques terapéuticos según lo que estás viviendo.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {ORIENTACION.map(item => <OrientacionCard key={item.titulo} item={item} />)}
        </div>
      </section>

      {/* Filtros */}
      <div id="especialistas" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr)) auto',
        gap: '14px', alignItems: 'end',
        background: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(22px)',
        border: '1px solid rgba(255,255,255,0.72)', borderRadius: '24px',
        padding: '20px', marginBottom: '24px',
        boxShadow: '0 20px 45px rgba(0,0,0,0.04)',
      }}>
        {/* Búsqueda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Buscar</label>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Nombre o descripción…" style={{ width: '100%', minHeight: '44px', paddingLeft: '34px', paddingRight: '12px', border: '1px solid rgba(134,134,139,0.18)', borderRadius: '14px', background: 'rgba(255,255,255,0.72)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none' }} />
          </div>
        </div>
        {/* Especialidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Especialidad</label>
          <select value={filterEsp} onChange={e => setFilterEsp(e.target.value)} style={{ minHeight: '44px', padding: '0 12px', border: '1px solid rgba(134,134,139,0.18)', borderRadius: '14px', background: 'rgba(255,255,255,0.72)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none' }}>
            <option value="">Todas</option>
            {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        {/* Tipo de terapia */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Tipo de terapia</label>
          <select value={filterTer} onChange={e => setFilterTer(e.target.value)} style={{ minHeight: '44px', padding: '0 12px', border: '1px solid rgba(134,134,139,0.18)', borderRadius: '14px', background: 'rgba(255,255,255,0.72)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none' }}>
            <option value="">Todas</option>
            {terapias.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {/* Perfil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Perfil</label>
          <select value={filterSexo} onChange={e => setFilterSexo(e.target.value)} style={{ minHeight: '44px', padding: '0 12px', border: '1px solid rgba(134,134,139,0.18)', borderRadius: '14px', background: 'rgba(255,255,255,0.72)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none' }}>
            <option value="">Todos</option>
            <option value="Mujer">Mujer</option>
            <option value="Hombre">Hombre</option>
          </select>
        </div>
        {/* Limpiar */}
        <button onClick={limpiar} disabled={!hayFiltros} style={{ minHeight: '44px', padding: '0 20px', borderRadius: '14px', border: '1px solid rgba(134,134,139,0.2)', background: hayFiltros ? 'rgba(62,123,250,0.08)' : 'rgba(134,134,139,0.06)', color: hayFiltros ? BRAND.blue : 'var(--text-muted)', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, cursor: hayFiltros ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>
          Limpiar
        </button>
      </div>

      {/* Contador */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 18px' }}>
        {filtrados.length} terapeuta{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
      </p>

      {/* Grid de especialistas */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 600 }}>No se encontraron terapeutas con esos filtros.</p>
          <button onClick={limpiar} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '12px', background: 'rgba(62,123,250,0.1)', border: '1px solid rgba(62,123,250,0.25)', color: BRAND.blue, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Limpiar filtros</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {filtrados.map(esp => <EspecialistaCard key={esp.id} esp={esp} onClick={setModalEsp} />)}
        </div>
      )}

      {/* Modal */}
      <Modal esp={modalEsp} onClose={() => setModalEsp(null)} />
    </>
  );
}
