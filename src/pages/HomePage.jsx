import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import { useReveal } from '../hooks/useReveal';

const services = [
  { color: 'blue', title: 'Terapia Profesional', text: 'Conecta a través de videollamadas seguras con especialistas que se adaptan a tus necesidades y horarios.', link: '/legacy/public/terapia.html', label: 'Saber más' },
  { color: 'orange', title: 'Herramientas Emocionales', text: 'Registra tu estado de ánimo, accede a meditaciones guiadas y ejercicios de respiración validados clínicamente.', link: '/legacy/public/recursos.html', label: 'Explorar recursos' },
  { color: 'teal', title: 'Comunidad Moderada', text: 'Participa en grupos de apoyo anónimos facilitados por profesionales. Nunca estarás solo en tu proceso.', link: '/legacy/public/comunidad.html', label: 'Unirse al grupo' },
];

const steps = [
  ['01', 'Completa tu perfil', 'Responde un breve y seguro cuestionario para entender qué estás experimentando y tus preferencias de horario.'],
  ['02', 'Conecta con tu especialista', 'Nuestro equipo te ayudará a encontrar al profesional idóneo y certificado para tu caso específico.'],
  ['03', 'Inicia tu proceso', 'Agenda tu primera videollamada desde la plataforma y accede a herramientas de soporte diario.'],
];

const specialists = [
  ['DR', 'blue', 'Dra. Daniela Rojas', 'Cognitivo-Conductual', 'Especialista en trastornos de ansiedad y regulación del estrés.'],
  ['CM', 'orange', 'Psic. Carlos Méndez', 'Terapia Sistémica', 'Enfocado en terapia de pareja, vínculos familiares y duelo.'],
  ['SV', 'teal', 'Lic. Sofía Vargas', 'Crecimiento Personal', 'Acompañamiento en autoestima, transiciones de vida y mindfulness.'],
];

const testimonials = [
  ['"La interfaz es tan tranquila que desde que entras ya sientes que es un espacio seguro. Encontrar a mi terapeuta fue cuestión de minutos y el seguimiento de emociones diario me ha ayudado muchísimo."', 'A. G.', 'Terapia para Ansiedad'],
  ['"Nunca había hecho terapia online por miedo a la privacidad. Ver lo cuidada que está esta plataforma y participar en la comunidad anónima cambió completamente mi perspectiva."', 'Martín V.', 'Crecimiento Personal'],
  ['"Mi terapeuta es excelente y los ejercicios de respiración que me dejan en la app son un apoyo importante cuando estoy en la oficina. Todo está integrado en un solo lugar."', 'Elena R.', 'Regulación del Estrés'],
];

const faqs = [
  ['¿Las sesiones son completamente confidenciales?', 'Sí. La plataforma está diseñada para proteger los datos personales y clínicos, limitando el acceso a la información según la función de cada usuario.'],
  ['¿Qué pasa si no conecto con mi terapeuta en la primera sesión?', 'El vínculo terapéutico es importante. Podrás revisar otros especialistas y solicitar un cambio para continuar tu proceso con un profesional adecuado para ti.'],
  ['¿Cómo funcionan las herramientas de regulación gratuitas?', 'Al crear tu cuenta podrás acceder a recursos, ejercicios de respiración y material educativo disponible en la plataforma.'],
];

function Hero() {
  return (
    <section className="apple-hero">
      <div className="mesh-background" aria-hidden="true">
        <div className="mesh-blob blob-blue" />
        <div className="mesh-blob blob-orange" />
        <div className="mesh-blob blob-teal" />
      </div>
      <div className="hero-container">
        <div className="text-column">
          <div className="eyebrow"><span className="eyebrow-dot" />Terapia · Comunidad · Bienestar</div>
          <h1>Entiende tus emociones,<br /><span className="gradient-text">acompaña tu proceso.</span></h1>
          <p className="subtitle">Agenda terapia, accede a herramientas de regulación emocional, explora recursos educativos y participa en comunidades moderadas por profesionales.</p>
          <div className="actions">
            <Link to="/registro" className="btn-primary">Comenzar ahora</Link>
            <a href="#ecosistema" className="btn-secondary">Conocer la app</a>
          </div>
          <div className="feature-cards">
            {['Terapia profesional', 'Herramientas emocionales', 'Comunidad moderada'].map((text, index) => (
              <div className="feat-card" key={text}><span className="feat-num">0{index + 1}</span><span className="feat-text">{text}</span></div>
            ))}
          </div>
        </div>
        <div className="visual-column">
          <div className="premium-glass-card">
            <div className="floating-badge badge-top-left"><span className="dot orange" /> Reconoce</div>
            <div className="floating-badge badge-bottom-left"><span className="dot blue" /> Transforma</div>
            <div className="floating-badge badge-bottom-right"><span className="dot teal" /> Acompaña</div>
            <div className="emotion-cluster">
              <div className="cluster-backdrop" />
              <div className="orb orb-blue" data-emotion="Calma" title="Calma"><div className="orb-face face-calma"><span className="eye" /><span className="eye" /></div></div>
              <div className="orb orb-purple" data-emotion="Reflexión" title="Reflexión"><div className="orb-face face-reflexion"><div className="eyes-row"><span className="eye" /><span className="eye" /></div><div className="mouth" /></div></div>
              <div className="orb orb-orange" data-emotion="Energía" title="Energía"><div className="orb-face face-energia"><div className="eyes-row"><span className="eye" /><span className="eye" /></div><div className="mouth" /></div></div>
              <div className="orb orb-teal" data-emotion="Serenidad" title="Serenidad"><div className="orb-face face-serenidad"><span className="eye" /><span className="eye" /></div></div>
              <div className="center-heart-orb"><span className="heart-icon" aria-hidden="true">♥</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    ['Privacidad Asegurada', 'Contraseñas cifradas'],
    ['Profesionales Verificados', 'Licencia activa'],
    ['Espacio Seguro', 'Comunidad moderada'],
  ];
  return (
    <div className="trust-wrapper"><div className="trust-glass-pill">
      {items.map(([title, text], index) => (
        <div className="trust-fragment" key={title}>
          {index > 0 && <div className="divider" />}
          <div className="trust-item"><div className={`trust-icon-box ${index === 1 ? 'blue' : index === 2 ? 'orange' : ''}`}>✓</div><div className="trust-text"><strong>{title}</strong><span>{text}</span></div></div>
        </div>
      ))}
    </div></div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="faq-section">
      <div className="section-header reveal"><div className="eyebrow center">Soporte</div><h2 className="section-title">Preguntas frecuentes</h2><p className="section-subtitle">Resolvemos tus dudas para que des el primer paso con tranquilidad.</p></div>
      <div className="faq-container reveal">
        {faqs.map(([question, answer], index) => (
          <div className={`faq-item ${openIndex === index ? 'active' : ''}`} key={question}>
            <button className="faq-question" type="button" aria-expanded={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? -1 : index)}>
              <span>{question}</span><div className="faq-icon">⌄</div>
            </button>
            <div className="faq-answer"><p>{answer}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  useReveal();
  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <section className="services-section" id="ecosistema">
          <div className="section-header"><div className="eyebrow center">Nuestro Ecosistema</div><h2 className="section-title">Diseñado para tu bienestar</h2><p className="section-subtitle">Todo lo que necesitas para tu proceso, integrado en una plataforma clara y accesible.</p></div>
          <div className="bento-grid">
            {services.map((service) => (
              <article className="bento-card" key={service.title}>
                <div className="card-icon-wrapper"><div className={`volumetric-orb orb-${service.color}-small`} /></div>
                <h3>{service.title}</h3><p>{service.text}</p><a href={service.link} className="card-link">{service.label} <span>→</span></a>
              </article>
            ))}
          </div>
        </section>
        <section className="how-it-works-section">
          <div className="section-header reveal"><div className="eyebrow center">Proceso Simple</div><h2 className="section-title">Comenzar es fácil</h2><p className="section-subtitle">Tres pasos pensados para eliminar la fricción entre tú y tu bienestar emocional.</p></div>
          <div className="steps-grid">
            {steps.map(([number, title, text], index) => <article className="step-card reveal" style={{ transitionDelay: `${index * 0.1}s` }} key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>
        <section className="specialists-section">
          <div className="section-header reveal"><div className="eyebrow center">Nuestra Red</div><h2 className="section-title">En las mejores manos</h2><p className="section-subtitle">Profesionales licenciados y con experiencia clínica, listos para acompañarte.</p></div>
          <div className="specialists-grid">
            {specialists.map(([initials, color, name, specialty, description], index) => <article className="specialist-card reveal" style={{ transitionDelay: `${index * 0.1}s` }} key={name}><div className={`avatar-circle avatar-${color}`}>{initials}</div><div className="specialist-info"><h3>{name}</h3><span className="specialty-tag">{specialty}</span><p>{description}</p><a href="/legacy/public/terapia.html" className="card-link">Ver perfil <span>→</span></a></div></article>)}
          </div>
        </section>
        <section className="testimonials-section">
          <div className="section-header reveal"><div className="eyebrow center">Comunidad</div><h2 className="section-title">Historias de cambio</h2><p className="section-subtitle">Espacios seguros que han transformado el día a día de nuestra comunidad.</p></div>
          <div className="testimonials-grid">
            {testimonials.map(([quote, author, context], index) => <article className="testimonial-card reveal" style={{ transitionDelay: `${index * 0.1}s` }} key={author}><div className="quote-icon">“</div><p className="testimonial-text">{quote}</p><div className="testimonial-author"><strong>{author}</strong><span>{context}</span></div></article>)}
          </div>
        </section>
        <FAQSection />
        <section className="cta-section reveal"><div className="cta-container"><div className="cta-glow glow-blue" /><div className="cta-glow glow-orange" /><div className="cta-content"><h2>Tu bienestar emocional no tiene por qué esperar.</h2><p>Da el primer paso hoy. Crea tu cuenta y comienza a construir una vida más equilibrada con apoyo profesional.</p><div className="cta-actions"><Link to="/registro" className="btn-primary-dark">Comenzar mi proceso</Link><a href="mailto:hola@menteconecta.cl" className="btn-secondary-dark">Hablar con soporte</a></div></div></div></section>
      </main>
      <Footer />
    </div>
  );
}
