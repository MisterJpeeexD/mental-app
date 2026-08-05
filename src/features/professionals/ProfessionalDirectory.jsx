import { useState, useMemo, useEffect } from 'react';
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

/* ─── Orientación (de terapia.js legacy) ─────────────────── */
const ORIENTACION = [
  { titulo:'Ansiedad o estrés constante',          texto:'La terapia cognitivo-conductual y la terapia para ansiedad suelen ofrecer herramientas prácticas de regulación.' },
  { titulo:'Tristeza o desmotivación prolongada',  texto:'La terapia para depresión puede acompañar el proceso con un ritmo compasivo y sustentado.' },
  { titulo:'Conflictos familiares',                texto:'La terapia familiar ayuda a mejorar la comunicación y construir acuerdos entre todos los integrantes.' },
  { titulo:'Dificultades en la pareja',            texto:'La terapia de pareja ofrece un espacio neutral para trabajar la comunicación y la confianza.' },
  { titulo:'Búsqueda de sentido o autoconocimiento',texto:'La terapia humanista y la terapia de crecimiento personal exploran el propósito y la aceptación personal.' },
  { titulo:'No sabes por dónde empezar',           texto:'La orientación emocional es un buen primer paso para identificar qué tipo de apoyo necesitas.' },
];

/* ─── Utilidades ─────────────────────────────────────────── */
function getIniciales(nombre = '') {
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
    <div style={{
      background: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.9)',
      borderRadius: '20px', padding: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
      backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', gap: '8px'
    }}>
      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{item.titulo}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.texto}</p>
    </div>
  );
}

function CardEspecialista({ esp, onVerPerfil }) {
  return (
    <article style={{
      background: 'rgba(255,255,255,0.75)',
      border: '1px solid rgba(255,255,255,0.9)',
      borderRadius: '24px', padding: '24px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
      backdropFilter: 'blur(16px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      gap: '18px', transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: getAvatarGradient(esp.sexo),
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '1.1rem', flexShrink: 0,
          boxShadow: 'var(--orb-shadow)'
        }}>
          {getIniciales(esp.nombre)}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{esp.nombre}</h3>
          <span style={{
            fontSize: '0.7rem', fontWeight: 800, color: BRAND.blue,
            background: 'rgba(62,123,250,0.1)', padding: '2px 10px', borderRadius: '100px',
            display: 'inline-block', marginTop: '4px'
          }}>
            {esp.especialidad}
          </span>
        </div>
      </div>

      <p style={{
        fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {esp.descripcion}
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onVerPerfil(esp)}
          style={{
            flex: 1, padding: '10px', borderRadius: '14px', border: 'none',
            background: 'rgba(62,123,250,0.1)', color: BRAND.blue,
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Ver Perfil
        </button>
      </div>
    </article>
  );
}

function ModalEspecialista({ esp, onClose }) {
  const { isAuthenticated } = useAuth();
  const [agendando, setAgendando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  if (!esp) return null;

  async function handleAgendar() {
    if (!isAuthenticated) {
      setMensaje({ texto: 'Debes iniciar sesión para agendar una sesión.', error: true });
      return;
    }
    setAgendando(true);
    setMensaje(null);
    try {
      await apiRequest('/citas', {
        method: 'POST',
        body: JSON.stringify({ especialistaId: esp.id, fecha: new Date().toISOString() })
      });
      setMensaje({ texto: `¡Cita solicitada exitosamente con ${esp.nombre}!`, error: false });
    } catch (err) {
      setMensaje({ texto: err.message || 'No se pudo agendar la cita.', error: true });
    } finally {
      setAgendando(false);
    }
  }

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%', maxWidth: '580px', background: '#f5f5f8',
          borderRadius: '32px', border: '1px solid rgba(255,255,255,0.8)',
          padding: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            background: 'rgba(0,0,0,0.05)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: getAvatarGradient(esp.sexo), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', flexShrink: 0, boxShadow: 'var(--orb-shadow)' }}>
            {getIniciales(esp.nombre)}
          </div>
          <div>
            <h3 id="modal-name" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>{esp.nombre}</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>{esp.especialidad}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '5px 11px', borderRadius: '100px', background: 'rgba(77,208,225,0.16)', color: '#19707d' }}>{esp.especialidad}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '5px 11px', borderRadius: '100px', background: 'rgba(62,123,250,0.14)', color: BRAND.blue }}>{esp.terapia}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '5px 11px', borderRadius: '100px', background: 'rgba(255,138,101,0.17)', color: '#b65031' }}>{esp.sexo}</span>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 20px' }}>{esp.descripcion}</p>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Enfoque terapéutico</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.65, margin: 0 }}>{esp.enfoque}</p>
        </div>

        {esp.comentarios && esp.comentarios.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Comentarios anónimos</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {esp.comentarios.map((c, i) => (
                <li key={i} style={{ background: 'rgba(62,123,250,0.08)', border: '1px solid rgba(62,123,250,0.12)', borderRadius: '16px', padding: '12px 16px', fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                  "{c}"
                </li>
              ))}
            </ul>
          </div>
        )}

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
            {agendando ? 'Agendando...' : `Agendar Sesión con ${esp.nombre}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────── */
export default function ProfessionalDirectory() {
  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filterEsp, setFilterEsp]   = useState('');
  const [filterTer, setFilterTer]   = useState('');
  const [filterSexo, setFilterSexo] = useState('');
  const [modalEsp, setModalEsp] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/profesionales');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setEspecialistas(data.map(p => ({
            id: p.id,
            nombre: p.nombre || `${p.nombres || ''} ${p.apellidos || ''}`.trim(),
            sexo: p.sexo || 'Mujer',
            especialidad: p.especialidad || 'Psicología Clínica',
            terapia: p.terapia || 'Terapia General',
            descripcion: p.descripcion || p.biografia || 'Profesional certificado de la salud mental.',
            enfoque: p.enfoque || 'Acompañamiento personalizado basado en evidencia.',
            comentarios: p.comentarios || []
          })));
        } else {
          setEspecialistas([]);
        }
      } catch (err) {
        console.warn('Error fetching API profesionales:', err);
        setEspecialistas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  const especialidades = useMemo(() => [...new Set(especialistas.map(e => e.especialidad))].sort(), [especialistas]);
  const terapias       = useMemo(() => [...new Set(especialistas.map(e => e.terapia))].sort(), [especialistas]);

  const filtrados = useMemo(() => {
    return especialistas.filter(e => {
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

      {/* Quick Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'Todos los terapeutas', esp: '', ter: '', sexo: '' },
          { label: '👩 Terapeuta Mujer', esp: '', ter: '', sexo: 'Mujer' },
          { label: '👨 Terapeuta Hombre', esp: '', ter: '', sexo: 'Hombre' },
          { label: '🧠 Psicología Clínica', esp: 'Psicología Clínica', ter: '', sexo: '' },
          { label: '💬 Terapia de Pareja', esp: 'Terapia de Pareja', ter: '', sexo: '' },
          { label: '🌱 Psicología Humanista', esp: 'Psicología Humanista', ter: '', sexo: '' },
        ].map((pill, idx) => {
          const isActive = filterSexo === pill.sexo && filterEsp === pill.esp && filterTer === pill.ter;
          return (
            <button
              key={idx}
              onClick={() => { setFilterSexo(pill.sexo); setFilterEsp(pill.esp); setFilterTer(pill.ter); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.8rem', fontWeight: 700, padding: '7px 14px', borderRadius: '100px',
                border: isActive ? `1.5px solid ${BRAND.blue}` : '1px solid rgba(255,255,255,0.8)',
                background: isActive ? 'rgba(62,123,250,0.14)' : 'rgba(255,255,255,0.6)',
                color: isActive ? BRAND.blue : 'var(--text-main)',
                backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      <div id="especialistas" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '14px', alignItems: 'end',
        background: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border: '1px solid rgba(255,255,255,0.72)', borderRadius: '24px',
        padding: '20px', marginBottom: '24px',
        boxShadow: '0 20px 45px rgba(0,0,0,0.04)',
      }}>
        {/* Búsqueda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Buscar</label>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre, especialidad o enfoque…" style={{ width: '100%', minHeight: '48px', paddingLeft: '42px', paddingRight: '16px', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }} />
          </div>
        </div>
        {/* Especialidad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Especialidad</label>
          <select value={filterEsp} onChange={e => setFilterEsp(e.target.value)} style={{ minHeight: '48px', padding: '0 16px', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <option value="">Todas</option>
            {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        {/* Tipo de terapia */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Tipo de terapia</label>
          <select value={filterTer} onChange={e => setFilterTer(e.target.value)} style={{ minHeight: '48px', padding: '0 16px', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <option value="">Todas</option>
            {terapias.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {/* Perfil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Perfil</label>
          <select value={filterSexo} onChange={e => setFilterSexo(e.target.value)} style={{ minHeight: '48px', padding: '0 16px', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <option value="">Todos</option>
            <option value="Mujer">Mujer</option>
            <option value="Hombre">Hombre</option>
          </select>
        </div>
        {/* Limpiar */}
        <button onClick={limpiar} disabled={!hayFiltros} style={{ minHeight: '48px', padding: '0 24px', borderRadius: '16px', border: `1px solid ${hayFiltros ? 'rgba(62,123,250,0.3)' : 'rgba(134,134,139,0.2)'}`, background: hayFiltros ? 'rgba(62,123,250,0.08)' : 'rgba(134,134,139,0.06)', color: hayFiltros ? BRAND.blue : 'var(--text-muted)', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 700, cursor: hayFiltros ? 'pointer' : 'default', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
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
          {filtrados.map(esp => <CardEspecialista key={esp.id} esp={esp} onVerPerfil={setModalEsp} />)}
        </div>
      )}

      {/* Modal */}
      <ModalEspecialista esp={modalEsp} onClose={() => setModalEsp(null)} />
    </>
  );
}
