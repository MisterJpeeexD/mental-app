import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { orientacionGuia } from '../features/therapy/therapyData';
import TherapistCard from '../features/therapy/TherapistCard';
import TherapistFilters from '../features/therapy/TherapistFilters';
import TherapistModal from '../features/therapy/TherapistModal';

const FILTROS_VACIOS = { texto: '', especialidad: '', terapia: '', sexo: '' };

function Hero() {
  return (
    <section className="terapia-hero">
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob blob-blue" />
        <div className="mesh-blob blob-orange" />
        <div className="mesh-blob blob-teal" />
      </div>

      <div className="hero-container terapia-hero-grid">
        <div className="text-column reveal">
          <div className="eyebrow"><span className="eyebrow-dot" />Terapia · Especialistas · Bienestar</div>
          <h1>
            Descubre la terapia
            <br />
            <span className="gradient-text">que te acompaña mejor.</span>
          </h1>
          <p className="subtitle">
            Explora terapias, filtra especialistas por enfoque, especialidad o perfil, y revisa comentarios anónimos
            de quienes ya iniciaron su proceso.
          </p>
          <div className="actions">
            <a href="#especialistas" className="btn-primary">Ver terapias</a>
            <a href="#orientacion" className="btn-secondary">Explorar opciones</a>
          </div>
          <div className="feature-cards terapia-stats">
            {['Sesiones seguras', 'Especialistas expertos', 'Acompañamiento confidencial'].map((texto, index) => (
              <div className="feat-card" key={texto}>
                <span className="feat-num">0{index + 1}</span>
                <span className="feat-text">{texto}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="visual-column reveal">
          <div className="premium-glass-card terapia-panel">
            <div className="floating-badge badge-top-left"><span className="dot blue" /> Seguro</div>
            <div className="floating-badge badge-bottom-left"><span className="dot orange" /> Cercano</div>
            <div className="floating-badge badge-bottom-right"><span className="dot teal" /> Guiado</div>
            <div className="community-orbit" aria-hidden="true">
              <div className="community-avatar avatar-main">AM</div>
              <div className="community-avatar avatar-one">DR</div>
              <div className="community-avatar avatar-two">CM</div>
              <div className="community-avatar avatar-three">SV</div>
              <div className="community-line line-one" />
              <div className="community-line line-two" />
              <div className="community-line line-three" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrientacionSection() {
  return (
    <section id="orientacion" className="services-section terapia-section">
      <div className="section-header reveal">
        <div className="eyebrow center">Orientación</div>
        <h2 className="section-title">¿Qué terapia puede acompañarte hoy?</h2>
        <p className="section-subtitle">
          Una guía práctica para identificar enfoques terapéuticos útiles según lo que estás viviendo.
        </p>
      </div>
      <div className="bento-grid orientation-grid">
        {orientacionGuia.map((item) => (
          <div className="orientation-card" key={item.titulo}>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const DEFAULT_ESPECIALISTAS = [
  { id: 1, nombre: 'Dra. Daniela Rojas', sexo: 'Mujer', especialidad: 'Cognitivo-Conductual', terapia: 'Terapia para Ansiedad', descripcion: 'Dra. en Psicología Clínica especialista en trastornos de ansiedad, rumiación y regulación del estrés.', enfoque: 'Reestructuración cognitiva y herramientas prácticas de afrontamiento.', comentarios: [{ usuario: 'Anónimo', texto: 'Muy empática y clara con las herramientas.' }] },
  { id: 2, nombre: 'Psic. Carlos Méndez', sexo: 'Hombre', especialidad: 'Terapia Sistémica', terapia: 'Terapia de Pareja', descripcion: 'Psicólogo Sistémico enfocado en terapia de pareja, vínculos familiares y procesos de duelo.', enfoque: 'Comunicación no violenta y dinámicas relacionales sanas.', comentarios: [{ usuario: 'Anónimo', texto: 'Excelente acompañamiento en pareja.' }] },
  { id: 3, nombre: 'Lic. Sofía Vargas', sexo: 'Mujer', especialidad: 'Psicología Humanista', terapia: 'Crecimiento Personal', descripcion: 'Lic. en Psicología Humanista experta en autoestima, transiciones de vida y mindfulness práctico.', enfoque: 'Atención plena, autocompasión y sentido de vida.', comentarios: [{ usuario: 'Anónimo', texto: 'Me ayudó muchísimo con mi autoestima.' }] },
  { id: 4, nombre: 'Dr. Andrés Morales', sexo: 'Hombre', especialidad: 'Terapia Somática', terapia: 'Regulación del Estrés', descripcion: 'Médico Psiquiatra y Terapeuta Somático enfocado en la regulación del sistema nervioso y trauma.', enfoque: 'Integración cuerpo-mente y desensibilización.', comentarios: [{ usuario: 'Anónimo', texto: 'Un enfoque integral muy sanador.' }] }
];

export default function TerapiaPage() {
  useReveal();
  const location = useLocation();
  const [especialistas, setEspecialistas] = useState(DEFAULT_ESPECIALISTAS);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    if (location.hash !== '#terapias') return;
    const timer = window.setTimeout(() => {
      document.getElementById('terapias')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    const fetchEspecialistas = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/profesionales');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(p => {
            const u = p.usuario || {};
            const nombreCompleto = p.nombre || `${u.nombres || ''} ${u.apellidos || ''}`.trim() || 'Especialista AbrazaMente';
            const generoRaw = u.genero || p.sexo || 'Femenino';
            const sexoMapped = (generoRaw.toLowerCase().includes('fem') || generoRaw === 'Mujer') ? 'Mujer' : 'Hombre';
            const espNombre = p.especialidadPrincipal?.nombre || p.descripcionProfesional || p.especialidad || 'Psicología Clínica';

            return {
              id: p.id,
              nombre: nombreCompleto,
              sexo: sexoMapped,
              especialidad: espNombre,
              terapia: p.terapia || espNombre || 'Terapia General',
              descripcion: p.biografiaProfesional || p.descripcionProfesional || p.descripcion || 'Profesional certificado de la salud mental.',
              enfoque: p.descripcionProfesional || p.enfoque || 'Acompañamiento personalizado basado en evidencia.',
              comentarios: p.comentarios || [
                { usuario: 'Paciente Anónimo', texto: 'Excelente profesional, genera un espacio de confianza y contención desde el primer minuto.' }
              ]
            };
          });
          setEspecialistas(mapped);
        } else {
          setEspecialistas(DEFAULT_ESPECIALISTAS);
        }
      } catch (err) {
        console.warn('Error al cargar profesionales desde la API, utilizando fallback:', err);
        setEspecialistas(DEFAULT_ESPECIALISTAS);
      } finally {
        setLoading(false);
      }
    };
    fetchEspecialistas();
  }, []);

  const filtrados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();
    return especialistas.filter((esp) => (
      esp.nombre.toLowerCase().includes(texto)
      && (!filtros.especialidad || esp.especialidad === filtros.especialidad)
      && (!filtros.terapia || esp.terapia === filtros.terapia)
      && (!filtros.sexo || esp.sexo === filtros.sexo)
    ));
  }, [filtros, especialistas]);

  return (
    <div className="terapia-page">
      <Hero />
      <OrientacionSection />

      <section id="terapias" className="specialists-section terapia-section terapia-soft-bg">
        <div className="section-header reveal">
          <div className="eyebrow center">Red de terapeutas</div>
          <h2 className="section-title" id="especialistas">Terapias y terapeutas disponibles</h2>
          <p className="section-subtitle">
            Filtra por nombre, especialidad, tipo de terapia o perfil para encontrar un acompañamiento profesional
            adecuado.
          </p>
        </div>

        <TherapistFilters
          listaBase={especialistas}
          filtros={filtros}
          onChange={setFiltros}
          onClear={() => setFiltros(FILTROS_VACIOS)}
        />

        <p className="results-count" role="status" aria-live="polite">
          {filtrados.length > 0 && `${filtrados.length} terapeuta(s) encontrado(s)`}
        </p>

        {filtrados.length > 0 ? (
          <div className="cards-grid specialists-grid">
            {filtrados.map((esp) => (
              <TherapistCard key={esp.id} especialista={esp} onSelect={setSeleccionado} />
            ))}
          </div>
        ) : (
          <p className="no-results">No se encontraron terapeutas con esos filtros.</p>
        )}
      </section>

      {seleccionado && (
        <TherapistModal especialista={seleccionado} onClose={() => setSeleccionado(null)} />
      )}
    </div>
  );
}
