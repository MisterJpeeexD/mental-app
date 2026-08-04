import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Headphones, Video, FileText, ClipboardList, X, ExternalLink, Download, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

/* ─── Paleta (igual que global.css) ─────────────────────────── */
const BRAND = {
  blue:   '#3E7BFA',
  orange: '#FF8A65',
  teal:   '#4DD0E1',
  purple: '#BA68C8',
};

/* ─── Datos obtenidos desde API ─────── */
// La lista de recursos ahora se carga dinámicamente desde el backend

/* ─── Configuración del menú lateral ──────────────────────── */
const MENU_TIPO = [
  { key: 'todos',    label: 'Todos',      icon: BookOpen },
  { key: 'libro',    label: 'Libros',     icon: BookOpen },
  { key: 'podcast',  label: 'Podcast',    icon: Headphones },
  { key: 'video',    label: 'Videos',     icon: Video },
  { key: 'guia',     label: 'Guías',      icon: FileText },
  { key: 'protocolo',label: 'Protocolos', icon: ClipboardList },
];

const MENU_ACCESO = [
  { key: 'todos',    label: 'Todos' },
  { key: 'gratis',   label: 'Gratuitos' },
  { key: 'pago',     label: 'De pago' },
];

/* ─── Color por tipo de recurso ────────────────────────────── */
const TIPO_CONFIG = {
  libro:     { color: BRAND.purple, bg: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)', label: 'LIBRO', icon: BookOpen },
  protocolo: { color: BRAND.blue,   bg: 'linear-gradient(135deg, #3E7BFA 0%, #2962FF 100%)', label: 'PROTOCOLO', icon: ClipboardList },
  podcast:   { color: BRAND.orange, bg: 'linear-gradient(135deg, #FF8A65 0%, #FF5722 100%)', label: 'PODCAST', icon: Headphones },
  video:     { color: BRAND.teal,   bg: 'linear-gradient(135deg, #4DD0E1 0%, #00BCD4 100%)', label: 'VIDEO', icon: Video },
  guia:      { color: BRAND.blue,   bg: 'linear-gradient(135deg, #4DD0E1 0%, #00BCD4 100%)', label: 'GUÍA', icon: FileText },
};

function ResourceCard({ recurso, onClick }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const config = TIPO_CONFIG[recurso.tipo] || TIPO_CONFIG.guia;
  const Icon = config.icon;

  const handleDescargar = () => {
    if (isAuthenticated) {
      window.open(recurso.url, '_blank', 'noopener noreferrer');
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  return (
    <article
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        position: 'relative'
      }}
      onClick={() => onClick(recurso)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
    >
      {/* Top Banner */}
      <div style={{
        background: config.bg || config.color,
        height: '140px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Type pill top-left */}
        <div style={{
           position: 'absolute', top: '16px', left: '16px',
           background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)',
           color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px',
           borderRadius: '100px', letterSpacing: '0.05em'
        }}>
           {config.label}
        </div>
        {/* Heart icon top-right */}
        <button style={{
           position: 'absolute', top: '16px', right: '16px',
           background: 'rgba(255,255,255,0.9)', border: 'none',
           width: '28px', height: '28px', borderRadius: '50%',
           display: 'flex', alignItems: 'center', justifyContent: 'center',
           cursor: 'pointer', color: 'var(--text-muted)'
        }}>
           <span style={{ fontSize: '14px' }}>♡</span>
        </button>

        {/* Center Icon */}
        <Icon style={{ width: '48px', height: '48px', color: 'rgba(255,255,255,0.85)' }} strokeWidth={1.5} />

        {/* Recomendado Pill */}
        <div style={{
           position: 'absolute', bottom: '-12px', left: '20px',
           background: 'white', border: '1px solid rgba(0,0,0,0.05)',
           borderRadius: '100px', padding: '4px 10px',
           fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-main)',
           display: 'flex', alignItems: 'center', gap: '4px',
           boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}>
           <span style={{ color: '#FF8A65' }}>✓</span> Recomendado
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 20px 20px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
        
        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
           <span style={{
             fontSize: '0.62rem', fontWeight: 700,
             background: 'rgba(62,123,250,0.08)', color: BRAND.blue,
             borderRadius: '100px', padding: '2px 8px', textTransform: 'uppercase'
           }}>
             {recurso.tags[0]}
           </span>
           <span style={{
             fontSize: '0.62rem', fontWeight: 700,
             background: 'rgba(255,138,101,0.08)', color: BRAND.orange,
             borderRadius: '100px', padding: '2px 8px', textTransform: 'uppercase'
           }}>
             {recurso.gratis ? 'GRATUITO' : 'DE PAGO'}
           </span>
        </div>

        {/* Title & Author */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3, margin: '0 0 6px 0' }}>
            {recurso.titulo}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            {recurso.autor} · {recurso.editorial} · {recurso.anio}
          </p>
        </div>

        {/* Descripcion */}
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {recurso.descripcion}
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
           <span>{recurso.vistas} vistas</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={e => { e.stopPropagation(); handleDescargar(); }}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 700,
              background: BRAND.blue, color: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 4px 12px rgba(62,123,250,0.3)'
            }}
          >
              {isAuthenticated ? (
                <>
                  <Download style={{ width: '16px', height: '16px' }} />
                  Acceder
                </>
              ) : 'Ver detalles'}
          </button>
          
          <a
            href={recurso.url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
               width: '42px', height: '42px', borderRadius: '14px',
               border: '1px solid rgba(0,0,0,0.1)', background: 'transparent',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none'
            }}
          >
            <BookOpen style={{ width: '18px', height: '18px' }} />
          </a>
        </div>
      </div>
    </article>
  );
}

function FilterGroup({ title, open, onToggle, children }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}
      >
        <span>{title}</span>
        {open ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
      </button>
      {open && <div style={{ paddingBottom: '14px' }}>{children}</div>}
    </div>
  );
}

function ResourceModal({ recurso, onClose }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!recurso) return null;

  const config = TIPO_CONFIG[recurso.tipo] || TIPO_CONFIG.guia;
  const Icon = config.icon;

  const handleAction = () => {
    if (isAuthenticated) {
      window.open(recurso.url, '_blank', 'noopener noreferrer');
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-start justify-center p-4 sm:p-10 md:py-[60px] md:px-5 overflow-y-auto bg-black/45 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[920px] bg-[#f5f5f8]/95 border border-white/70 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] backdrop-blur-[40px] saturate-150 p-7 md:p-11 my-auto mx-auto transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-[38px] h-[38px] rounded-full border-none bg-black/5 hover:bg-black/10 text-gray-800 flex items-center justify-center transition-colors"
        >
          <X strokeWidth={2} style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Modal Top */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 mb-8">
          <div 
            className="h-[200px] md:h-[280px] rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            style={{ background: config.bg || config.color }}
          >
             <Icon style={{ width: '64px', height: '64px', color: 'rgba(255,255,255,0.92)' }} strokeWidth={1.5} />
          </div>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap gap-1.5 mb-1">
               {recurso.tags.slice(0,3).map(t => (
                  <span key={t} className="text-[0.68rem] font-bold uppercase tracking-[0.03em] px-[9px] py-[3px] rounded-full text-blue-600 bg-blue-500/10">
                    {t}
                  </span>
               ))}
            </div>
            
            <h2 className="text-[1.5rem] md:text-[1.7rem] font-extrabold tracking-[-0.03em] leading-[1.15] text-gray-900 mb-1">
              {recurso.titulo}
            </h2>
            
            <p className="text-[0.92rem] text-gray-500">
              Por <strong className="text-gray-900">{recurso.autor}</strong> · {recurso.editorial} · {recurso.anio}
            </p>
            
            <div className="flex items-center gap-4 text-[0.86rem] text-gray-500 mt-2">
               <span className="flex items-center gap-1"><Download style={{ width: '14px', height: '14px' }}/> {Math.floor(recurso.vistas / 2)} descargas</span>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-auto pt-2">
              <button 
                onClick={handleAction}
                className="h-11 px-6 rounded-full text-[0.88rem] font-bold border-none cursor-pointer transition-transform bg-blue-600 text-white shadow-[0_8px_18px_rgba(62,123,250,0.25)] hover:bg-blue-700 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {recurso.tipo === 'video' || recurso.tipo === 'podcast' ? 'Ver contenido' : 'Descargar'}
              </button>
              <button className="w-11 h-11 rounded-full inline-flex items-center justify-center border border-black/10 bg-white/60 text-gray-800 cursor-pointer transition-colors hover:bg-black/5">
                <span className="text-[17px]">♡</span>
              </button>
              <button className="w-11 h-11 rounded-full inline-flex items-center justify-center border border-black/10 bg-white/60 text-gray-800 cursor-pointer transition-colors hover:bg-black/5">
                <ExternalLink style={{ width: '17px', height: '17px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mb-7">
          <h4 className="text-[0.95rem] font-bold mb-2.5 text-gray-900">Descripción</h4>
          <p className="text-[0.95rem] leading-[1.7] text-gray-500">
            {recurso.descripcion}
          </p>
        </div>

        <div className="mb-7">
          <h4 className="text-[0.95rem] font-bold mb-3.5 text-gray-900">Información del recurso</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.72rem] uppercase tracking-[0.05em] text-gray-400 font-bold">Autor</span>
              <span className="text-[0.9rem] text-gray-800 font-semibold">{recurso.autor}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.72rem] uppercase tracking-[0.05em] text-gray-400 font-bold">Editorial</span>
              <span className="text-[0.9rem] text-gray-800 font-semibold">{recurso.editorial}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.72rem] uppercase tracking-[0.05em] text-gray-400 font-bold">Idioma</span>
              <span className="text-[0.9rem] text-gray-800 font-semibold">Español</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.72rem] uppercase tracking-[0.05em] text-gray-400 font-bold">Tipo</span>
              <span className="text-[0.9rem] text-gray-800 font-semibold">{config.label}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.72rem] uppercase tracking-[0.05em] text-gray-400 font-bold">Acceso</span>
              <span className="text-[0.9rem] text-gray-800 font-semibold">{recurso.gratis ? "Gratuito" : "De pago"}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[0.95rem] font-bold mb-2.5 text-gray-900">Etiquetas</h4>
          <div className="flex flex-wrap gap-2">
            {recurso.tags.map(t => (
              <span key={t} className="bg-black/5 text-gray-800 text-[0.68rem] font-bold uppercase tracking-[0.03em] px-[9px] py-[3px] rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResourceLibrary() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroAcceso, setFiltroAcceso] = useState('todos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [grupoTipoOpen, setGrupoTipoOpen] = useState(true);
  const [grupoAccesoOpen, setGrupoAccesoOpen] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/recursos-digitales')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
          if (!Array.isArray(data)) {
            throw new Error('La respuesta no es un arreglo de recursos');
          }
          const mapped = data.map(r => {
              const tipoBruto = r.tipoContenido?.toLowerCase() || 'guia';
              let tipoMapped = tipoBruto;
              if (tipoBruto === 'libros') tipoMapped = 'libro';
              if (tipoBruto === 'videos') tipoMapped = 'video';
              if (tipoBruto === 'podcasts') tipoMapped = 'podcast';
              
              const allTags = r.categorias && r.categorias.length > 0 
                ? r.categorias.map(c => c.nombre) 
                : ['General'];

              return {
                  id: r.id.toString(),
                  tipo: tipoMapped,
                  titulo: r.titulo,
                  autor: r.autor,
                  editorial: 'Abrazamente API',
                  anio: new Date(r.fechaCreacion || Date.now()).getFullYear(),
                  tags: allTags,
                  gratis: !r.esPremium,
                  url: r.urlContenido,
                  descargable: true,
                  descripcion: r.descripcion || 'Material seleccionado por el equipo clínico, pensado para autogestión y acompañamiento integral.',
                  vistas: r.vistas || Math.floor(Math.random() * 2000) + 1000,
                  duracion: r.duracionMinutos
              };
          });
          setRecursos(mapped);
          setLoading(false);
      })
      .catch(err => {
          console.error('Error fetching resources:', err);
          setRecursos([]); // Evitar que falle en cascada
          setLoading(false);
      });
  }, []);

  const recursosFiltered = useMemo(() => {
    return recursos.filter(r => {
      const q = busqueda.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const haystack = `${r.titulo} ${r.autor} ${r.tags.join(' ')} ${r.tipo}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (busqueda && !haystack.includes(q)) return false;
      if (filtroTipo !== 'todos' && r.tipo !== filtroTipo) return false;
      if (filtroAcceso === 'gratis' && !r.gratis) return false;
      if (filtroAcceso === 'pago' && r.gratis) return false;
      return true;
    });
  }, [busqueda, filtroTipo, filtroAcceso, recursos]);

  const statGratis = recursos.filter(r => r.gratis).length;

  return (
    <>
      <section
        aria-label="Encabezado de sección"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(100px, 130px, 14vh) clamp(20px, 7vw, 80px) 56px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div className="mesh-background" aria-hidden="true">
          <div className="mesh-blob blob-blue" />
          <div className="mesh-blob blob-orange" />
          <div className="mesh-blob blob-teal" />
        </div>
        
        {/* Inner container */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0' }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.5)', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(255, 255, 255, 0.8)', marginBottom: '24px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: BRAND.orange }} />
            Biblioteca · Material clínico · Autoayuda
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 20px 0', color: 'var(--text-main)' }}>
            Recursos para entender,
            <br />
            <span style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.orange})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingRight: '4px' }}>aprender y acompañar.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            Libros, guías clínicas, artículos, investigaciones, podcasts y videos seleccionados y validados por profesionales de la salud mental.
          </p>

          {/* Buscador */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.9)', borderRadius: '100px', padding: '6px 8px 6px 22px', backdropFilter: 'blur(30px) saturate(160%)', WebkitBackdropFilter: 'blur(30px) saturate(160%)', boxShadow: '0 24px 48px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1)', transition: 'box-shadow 0.25s ease, border-color 0.25s ease' }}>
              <Search style={{ width: '20px', height: '20px', color: 'var(--text-muted)', flexShrink: 0 }} />
              <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Busca en tiempo real por título, autor, formato (video, podcast), tema o síntoma…" aria-label="Buscar recursos" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', color: 'var(--text-main)', height: '52px' }} />
              {busqueda && (
                <button onClick={() => setBusqueda('')} style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: 'rgba(0, 0, 0, 0.06)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.12)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}>
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Format Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {[
              { id: 'todos', label: 'Todos los formatos', icon: BookOpen },
              { id: 'video', label: 'Videos (YouTube)', icon: Video },
              { id: 'podcast', label: 'Podcasts (Spotify)', icon: Headphones },
              { id: 'guia', label: 'Guías & Lecturas', icon: FileText },
              { id: 'protocolo', label: 'Protocolos', icon: ClipboardList },
            ].map(f => {
              const active = filtroTipo === f.id;
              const IconComp = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFiltroTipo(f.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: active ? `1.5px solid ${BRAND.blue}` : '1px solid rgba(255,255,255,0.8)',
                    background: active ? 'rgba(62,123,250,0.14)' : 'rgba(255,255,255,0.6)',
                    color: active ? BRAND.blue : 'var(--text-main)',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <IconComp style={{ width: '14px', height: '14px' }} />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stat pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', background: 'rgba(255, 255, 255, 0.55)', border: '1px solid rgba(255, 255, 255, 0.8)', padding: '8px 18px', borderRadius: '100px', backdropFilter: 'blur(14px)' }}>
              <strong style={{ fontSize: '1rem', fontWeight: 800, color: BRAND.blue }}>{recursosFiltered.length}</strong> <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{recursosFiltered.length === 1 ? 'Recurso visible' : 'Recursos visibles'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', background: 'rgba(255, 255, 255, 0.55)', border: '1px solid rgba(255, 255, 255, 0.8)', padding: '8px 18px', borderRadius: '100px', backdropFilter: 'blur(14px)' }}>
              <strong style={{ fontSize: '1rem', fontWeight: 800, color: BRAND.orange }}>28</strong> <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Temáticas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', background: 'rgba(255, 255, 255, 0.55)', border: '1px solid rgba(255, 255, 255, 0.8)', padding: '8px 18px', borderRadius: '100px', backdropFilter: 'blur(14px)' }}>
              <strong style={{ fontSize: '1rem', fontWeight: 800, color: BRAND.teal }}>{statGratis}</strong> <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gratuitos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', background: 'rgba(255, 255, 255, 0.55)', border: '1px solid rgba(255, 255, 255, 0.8)', padding: '8px 18px', borderRadius: '100px', backdropFilter: 'blur(14px)' }}>
              <strong style={{ fontSize: '1rem', fontWeight: 800, color: BRAND.purple }}>100%</strong> <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Curado por clínicos</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', padding: '0 clamp(20px, 7vw, 80px) 140px' }}>
        <div className="page-body-inner">
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Sidebar de filtros */}
        <aside style={{
          width: sidebarOpen ? '250px' : '0',
          minWidth: sidebarOpen ? '250px' : '0',
          flex: '1 1 250px',
          maxWidth: '300px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          flexShrink: 0,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.75)',
            borderRadius: '18px', padding: '20px',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Filtrar recursos</h2>
              {(filtroTipo !== 'todos' || filtroAcceso !== 'todos') && (
                <button
                  onClick={() => { setFiltroTipo('todos'); setFiltroAcceso('todos'); }}
                  style={{ fontSize: '0.7rem', color: BRAND.blue, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Limpiar todo
                </button>
              )}
            </div>

            {/* Tipo de recurso */}
            <FilterGroup title="Tipo" open={grupoTipoOpen} onToggle={() => setGrupoTipoOpen(v => !v)}>
              <nav aria-label="Filtrar por tipo">
                {MENU_TIPO.map(item => {
                  const Icon = item.icon;
                  const active = filtroTipo === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setFiltroTipo(item.key)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 10px', borderRadius: '10px', marginBottom: '2px',
                        background: active ? 'rgba(62,123,250,0.12)' : 'transparent',
                        border: active ? '1px solid rgba(62,123,250,0.25)' : '1px solid transparent',
                        color: active ? BRAND.blue : 'var(--text-muted)',
                        fontSize: '0.82rem', fontWeight: active ? 700 : 500,
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </FilterGroup>

            {/* Disponibilidad */}
            <FilterGroup title="Disponibilidad" open={grupoAccesoOpen} onToggle={() => setGrupoAccesoOpen(v => !v)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {MENU_ACCESO.map(item => {
                  const active = filtroAcceso === item.key;
                  return (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '5px 0' }}>
                      <input
                        type="radio"
                        name="acceso"
                        value={item.key}
                        checked={active}
                        onChange={() => setFiltroAcceso(item.key)}
                        style={{ accentColor: BRAND.blue }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: active ? 700 : 500, color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </FilterGroup>
          </div>
        </aside>

        {/* Grid de recursos */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              {loading ? 'Cargando recursos desde APIs...' : 
               (recursosFiltered.length === recursos.length
                ? `${recursos.length} recursos disponibles`
                : `${recursosFiltered.length} de ${recursos.length} recursos`)}
            </p>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600,
                background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.75)',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              {sidebarOpen ? 'Ocultar filtros' : 'Ver filtros'}
            </button>
          </div>

          {recursosFiltered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Search style={{ width: '48px', height: '48px', marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 8px 0' }}>No encontramos recursos con esos filtros</p>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Prueba con otras palabras o ajusta los filtros</p>
              <button
                onClick={() => { setBusqueda(''); setFiltroTipo('todos'); setFiltroAcceso('todos'); }}
                style={{
                  marginTop: '16px', padding: '8px 20px', borderRadius: '12px',
                  background: 'rgba(62,123,250,0.1)', border: '1px solid rgba(62,123,250,0.25)',
                  color: BRAND.blue, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}>
              {recursosFiltered.map(r => <ResourceCard key={r.id} recurso={r} onClick={setSelectedResource} />)}
            </div>
          )}
        </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      <ResourceModal recurso={selectedResource} onClose={() => setSelectedResource(null)} />
    </>
  );
}
