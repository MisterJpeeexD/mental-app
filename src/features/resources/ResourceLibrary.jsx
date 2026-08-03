import { useState, useMemo } from 'react';
import { Search, BookOpen, Headphones, Video, FileText, ClipboardList, X, ExternalLink, Download, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  libro:     { color: BRAND.blue,   bg: 'rgba(62,123,250,0.12)',   border: 'rgba(62,123,250,0.25)',   label: 'Libro',     icon: BookOpen },
  podcast:   { color: BRAND.orange, bg: 'rgba(255,138,101,0.12)', border: 'rgba(255,138,101,0.25)', label: 'Podcast',   icon: Headphones },
  video:     { color: BRAND.teal,   bg: 'rgba(77,208,225,0.12)',  border: 'rgba(77,208,225,0.25)',  label: 'Video',     icon: Video },
  guia:      { color: BRAND.purple, bg: 'rgba(186,104,200,0.12)', border: 'rgba(186,104,200,0.25)', label: 'Guía',      icon: FileText },
  protocolo: { color: '#E57373',    bg: 'rgba(229,115,115,0.12)', border: 'rgba(229,115,115,0.25)', label: 'Protocolo', icon: ClipboardList },
};

function ResourceCard({ recurso }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const config = TIPO_CONFIG[recurso.tipo] || TIPO_CONFIG.guia;
  const Icon = config.icon;

  const handleDescargar = () => {
    if (isAuthenticated) {
      window.open(recurso.url, '_blank', 'noopener noreferrer');
    } else {
      navigate('/login');
    }
  };

  return (
    <article
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.75)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.10)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
    >
      {/* Header con badge de tipo */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: config.bg, border: `1px solid ${config.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon style={{ width: '18px', height: '18px', color: config.color }} />
          </div>
          <div>
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.06em', color: config.color,
            }}>
              {config.label}
            </span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600,
                background: recurso.gratis ? 'rgba(77,208,225,0.15)' : 'rgba(255,138,101,0.15)',
                color: recurso.gratis ? '#009aab' : '#c75e35',
                border: `1px solid ${recurso.gratis ? 'rgba(77,208,225,0.35)' : 'rgba(255,138,101,0.35)'}`,
                borderRadius: '100px', padding: '1px 8px',
              }}>
                {recurso.gratis ? '✓ Gratuito' : '$ De pago'}
              </span>
            </div>
          </div>
        </div>
        {/* Tag */}
        <span style={{
          fontSize: '0.62rem', fontWeight: 700,
          background: 'rgba(62,123,250,0.08)',
          color: BRAND.blue,
          border: '1px solid rgba(62,123,250,0.2)',
          borderRadius: '100px', padding: '2px 10px',
          whiteSpace: 'nowrap',
        }}>
          {recurso.tag}
        </span>
      </div>

      {/* Título */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.35, margin: 0 }}>
          {recurso.titulo}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {recurso.autor} · {recurso.editorial} · {recurso.anio}
        </p>
      </div>

      {/* Descripción automática */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0, flexGrow: 1 }}>
        Material seleccionado por el equipo clínico de Abrazamente sobre <strong>{recurso.tag.toLowerCase()}</strong>, pensado para autogestión y acompañamiento profesional.
      </p>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {/* Ver online — público para todos */}
        <a
          href={recurso.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '9px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
            background: config.bg, border: `1px solid ${config.border}`,
            color: config.color, textDecoration: 'none',
            transition: 'filter 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.88)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          <ExternalLink style={{ width: '13px', height: '13px' }} />
          Ver online
        </a>

        {/* Descargar — solo autenticados */}
        {recurso.descargable && (
          <button
            onClick={handleDescargar}
            title={isAuthenticated ? 'Descargar' : 'Inicia sesión para descargar'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              padding: '9px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
              background: isAuthenticated ? 'rgba(62,123,250,0.1)' : 'rgba(134,134,139,0.08)',
              border: `1px solid ${isAuthenticated ? 'rgba(62,123,250,0.25)' : 'rgba(134,134,139,0.2)'}`,
              color: isAuthenticated ? BRAND.blue : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {isAuthenticated
              ? <Download style={{ width: '13px', height: '13px' }} />
              : <Lock style={{ width: '13px', height: '13px' }} />
            }
            {isAuthenticated ? 'Descargar' : 'Registrarte'}
          </button>
        )}
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

export default function ResourceLibrary() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroAcceso, setFiltroAcceso] = useState('todos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [grupoTipoOpen, setGrupoTipoOpen] = useState(true);
  const [grupoAccesoOpen, setGrupoAccesoOpen] = useState(true);

  import('react').then(({ useEffect }) => {
    useEffect(() => {
      fetch('http://localhost:8080/api/recursos-digitales')
        .then(res => res.json())
        .then(data => {
            // Mapeamos los datos del backend al formato que espera la vista
            const mapped = data.map(r => ({
                id: r.id.toString(),
                tipo: r.tipoContenido?.toLowerCase() || 'guia',
                titulo: r.titulo,
                autor: r.autor,
                editorial: 'Abrazamente API',
                anio: new Date(r.fechaCreacion || Date.now()).getFullYear(),
                tag: r.categorias?.[0]?.nombre || 'General',
                gratis: !r.esPremium,
                url: r.urlContenido,
                descargable: true
            }));
            setRecursos(mapped);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching resources:', err);
            setLoading(false);
        });
    }, []);
  });

  const recursosFiltered = useMemo(() => {
    return recursos.filter(r => {
      const q = busqueda.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const haystack = `${r.titulo} ${r.autor} ${r.tag} ${r.tipo}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (busqueda && !haystack.includes(q)) return false;
      if (filtroTipo !== 'todos' && r.tipo !== filtroTipo) return false;
      if (filtroAcceso === 'gratis' && !r.gratis) return false;
      if (filtroAcceso === 'pago' && r.gratis) return false;
      return true;
    });
  }, [busqueda, filtroTipo, filtroAcceso, recursos]);

  const statGratis = recursos.filter(r => r.gratis).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>

      {/* ── Buscador ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Busca por título, autor, temática o tipo…"
          aria-label="Buscar recursos"
          style={{
            width: '100%', padding: '11px 42px 11px 42px',
            background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: '14px', fontSize: '0.85rem', color: 'var(--text-main)',
            outline: 'none', backdropFilter: 'blur(12px)',
          }}
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X style={{ width: '15px', height: '15px' }} />
          </button>
        )}
      </div>

      {/* ── Stat pills ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          [`${recursos.length}`, 'Recursos'],
          [`${statGratis}`, 'Gratuitos'],
          ['100%', 'Curado por clínicos'],
        ].map(([num, label]) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: '100px', padding: '5px 14px', backdropFilter: 'blur(12px)',
            fontSize: '0.78rem',
          }}>
            <strong style={{ color: BRAND.blue }}>{num}</strong>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Layout principal: sidebar + grid ─────────────────── */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* Sidebar de filtros */}
        <aside style={{
          width: sidebarOpen ? '220px' : '0',
          minWidth: sidebarOpen ? '220px' : '0',
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
              <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Filtros</h2>
              {(filtroTipo !== 'todos' || filtroAcceso !== 'todos') && (
                <button
                  onClick={() => { setFiltroTipo('todos'); setFiltroAcceso('todos'); }}
                  style={{ fontSize: '0.7rem', color: BRAND.blue, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Limpiar
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

            {/* Nota de acceso */}
            <div style={{
              marginTop: '14px', padding: '10px 12px',
              background: 'rgba(62,123,250,0.06)', border: '1px solid rgba(62,123,250,0.15)',
              borderRadius: '10px',
            }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                <Lock style={{ width: '10px', height: '10px', display: 'inline', marginRight: '4px' }} />
                El contenido es <strong>accesible online</strong> para todos. La descarga requiere registro.
              </p>
            </div>
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
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              <Search style={{ width: '36px', height: '36px', marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No encontramos recursos con esos filtros</p>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Prueba con otras palabras o ajusta los filtros</p>
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
              {recursosFiltered.map(r => <ResourceCard key={r.id} recurso={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
