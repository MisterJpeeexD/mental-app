import { useMemo, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { especialistas, orientacionGuia } from '../features/therapy/therapyData';
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

export default function TerapiaPage() {
  useReveal();
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [seleccionado, setSeleccionado] = useState(null);

  const filtrados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();
    return especialistas.filter((esp) => (
      esp.nombre.toLowerCase().includes(texto)
      && (!filtros.especialidad || esp.especialidad === filtros.especialidad)
      && (!filtros.terapia || esp.terapia === filtros.terapia)
      && (!filtros.sexo || esp.sexo === filtros.sexo)
    ));
  }, [filtros]);

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
