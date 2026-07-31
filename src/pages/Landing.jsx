import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    // Animación Scroll Reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    reveals.forEach(el => observer.observe(el));

    // Efectos Hover Orbes
    const orbs = document.querySelectorAll('.orb');
    const handleMouseEnter = (e) => {
      const orb = e.currentTarget;
      const emotionName = orb.dataset.emotion;
      if (!emotionName) {
        return;
      }
      
      const tooltip = document.createElement('div');
      tooltip.className = 'apple-tooltip';
      tooltip.textContent = emotionName;
      document.body.appendChild(tooltip);
      
      const rect = orb.getBoundingClientRect();
      tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
      tooltip.style.top = `${rect.top - 10}px`;
      requestAnimationFrame(() => tooltip.classList.add('visible'));
      orb._tooltip = tooltip;
    };

    const handleMouseLeave = (e) => {
      const orb = e.currentTarget;
      if (orb._tooltip) {
        orb._tooltip.classList.remove('visible');
        const tt = orb._tooltip; // Capturamos la referencia actual
        setTimeout(() => {
          if (document.body.contains(tt)) {
            tt.remove();
          }
        }, 200);
        orb._tooltip = null;
      }
    };

    orbs.forEach(orb => {
      orb.addEventListener('mouseenter', handleMouseEnter);
      orb.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      observer.disconnect();
      orbs.forEach(orb => {
        orb.removeEventListener('mouseenter', handleMouseEnter);
        orb.removeEventListener('mouseleave', handleMouseLeave);
        if (orb._tooltip && document.body.contains(orb._tooltip)) {
          orb._tooltip.remove();
        }
      });
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="landing-page-container">
      <section className="apple-hero">
        <div className="mesh-background">
          <div className="mesh-blob blob-blue"></div>
          <div className="mesh-blob blob-orange"></div>
          <div className="mesh-blob blob-teal"></div>
        </div>

        <div className="hero-container">
          <div className="text-column">
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              Terapia · Comunidad · Bienestar
            </div>

            <h1>
              Entiende tus emociones,
              <br />
              <span className="gradient-text">acompaña tu proceso.</span>
            </h1>

            <p className="subtitle">
              Agenda terapia, accede a herramientas de regulación emocional, explora recursos educativos y participa en comunidades moderadas por profesionales.
            </p>

            <div className="actions">
              <Link to="/auth" className="btn-primary">Comenzar ahora</Link>
              <button onClick={() => {document.getElementById('ecosistema').scrollIntoView({behavior: 'smooth'})}} className="btn-secondary" style={{cursor: 'pointer'}}>Conocer la app</button>
            </div>

            <div className="feature-cards">
              <div className="feat-card">
                <span className="feat-num">01</span>
                <span className="feat-text">Terapia profesional</span>
              </div>
              <div className="feat-card">
                <span className="feat-num">02</span>
                <span className="feat-text">Herramientas emocionales</span>
              </div>
              <div className="feat-card">
                <span className="feat-num">03</span>
                <span className="feat-text">Comunidad moderada</span>
              </div>
            </div>
          </div>

          <div className="visual-column">
            <div className="premium-glass-card">
              <div className="floating-badge badge-top-left">
                <span className="dot orange"></span> Reconoce
              </div>
              <div className="floating-badge badge-bottom-left">
                <span className="dot blue"></span> Transforma
              </div>
              <div className="floating-badge badge-bottom-right">
                <span className="dot teal"></span> Acompaña
              </div>

              <div className="emotion-cluster">
                <div className="cluster-backdrop"></div>
                
                <div className="orb orb-blue" data-emotion="Calma">
                  <div className="orb-face face-calma">
                    <span className="eye"></span><span className="eye"></span>
                  </div>
                </div>
                
                <div className="orb orb-purple" data-emotion="Reflexión">
                  <div className="orb-face face-reflexion">
                    <div className="eyes-row"><span className="eye"></span><span className="eye"></span></div>
                    <div className="mouth"></div>
                  </div>
                </div>
                
                <div className="orb orb-orange" data-emotion="Energía">
                  <div className="orb-face face-energia">
                    <div className="eyes-row"><span className="eye"></span><span className="eye"></span></div>
                    <div className="mouth"></div>
                  </div>
                </div>
                
                <div className="orb orb-teal" data-emotion="Serenidad">
                  <div className="orb-face face-serenidad">
                    <span className="eye"></span><span className="eye"></span>
                  </div>
                </div>

                <div className="center-heart-orb">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="heart-icon">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trust-wrapper">
        <div className="trust-glass-pill">
          
          <div className="trust-item">
            <div className="trust-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div className="trust-text">
              <strong>Privacidad Asegurada</strong>
              <span>Datos encriptados</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="trust-item">
            <div className="trust-icon-box blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="trust-text">
              <strong>Verificados</strong>
              <span>Licencia activa</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="trust-item">
            <div className="trust-icon-box orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <div className="trust-text">
              <strong>Espacio Seguro</strong>
              <span>Libre de juicios</span>
            </div>
          </div>

        </div>
      </div>

      <section id="ecosistema" className="services-section">
        <div className="section-header">
          <div className="eyebrow center">Nuestro Ecosistema</div>
          <h2 className="section-title">Diseñado para tu bienestar</h2>
          <p className="section-subtitle">Todo lo que necesitas para tu proceso terapéutico, integrado en una sola plataforma intuitiva y funcional.</p>
        </div>

        <div className="bento-grid">
          <div className="bento-card">
            <div className="card-icon-wrapper">
              <div className="volumetric-orb orb-blue-small"></div>
            </div>
            <h3>Terapia Profesional</h3>
            <p>Conecta a través de videollamadas seguras con especialistas que se adaptan a tus necesidades y horarios.</p>
            <Link to="/professionals" className="card-link">Saber más <span>→</span></Link>
          </div>

          <div className="bento-card">
            <div className="card-icon-wrapper">
              <div className="volumetric-orb orb-orange-small"></div>
            </div>
            <h3>Herramientas Emocionales</h3>
            <p>Registra tu estado de ánimo, accede a meditaciones guiadas y ejercicios de respiración validados clínicamente.</p>
            <Link to="/botiquin/breathing" className="card-link">Explorar recursos <span>→</span></Link>
          </div>

          <div className="bento-card">
            <div className="card-icon-wrapper">
              <div className="volumetric-orb orb-teal-small"></div>
            </div>
            <h3>Diario Privado</h3>
            <p>Escribe en un espacio seguro y observa tus tendencias anímicas a lo largo del mes con herramientas integradas.</p>
            <Link to="/journal" className="card-link">Empezar a escribir <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-header reveal">
          <div className="eyebrow center">Proceso Simple</div>
          <h2 className="section-title">Comenzar es fácil</h2>
          <p className="section-subtitle">Tres pasos pensados para eliminar cualquier fricción entre tú y tu bienestar emocional.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card reveal">
            <span className="step-number">01</span>
            <h3>Completa tu perfil</h3>
            <p>Responde un breve y seguro cuestionario para entender qué estás experimentando y tus preferencias de horario.</p>
          </div>
          <div className="step-card reveal" style={{transitionDelay: '0.1s'}}>
            <span className="step-number">02</span>
            <h3>Conecta con tu especialista</h3>
            <p>Nuestro algoritmo y equipo clínico te sugerirán al profesional idóneo y certificado para tu caso específico.</p>
          </div>
          <div className="step-card reveal" style={{transitionDelay: '0.2s'}}>
            <span className="step-number">03</span>
            <h3>Inicia tu proceso</h3>
            <p>Agenda tu primera videollamada desde la plataforma y desbloquea herramientas de soporte diarias.</p>
          </div>
        </div>
      </section>

      <section className="specialists-section">
        <div className="section-header reveal">
          <div className="eyebrow center">Nuestra Red</div>
          <h2 className="section-title">En las mejores manos</h2>
          <p className="section-subtitle">Profesionales licenciados, verificados y con amplia experiencia clínica, listos para acompañarte.</p>
        </div>

        <div className="specialists-grid">
          <div className="specialist-card reveal">
            <div className="avatar-circle avatar-blue">DR</div>
            <div className="specialist-info">
              <h3>Dra. Daniela Rojas</h3>
              <span className="specialty-tag">Cognitivo-Conductual</span>
              <p>Especialista en trastornos de ansiedad y regulación del estrés.</p>
              <Link to="/professionals" className="card-link">Ver perfil <span>→</span></Link>
            </div>
          </div>
          
          <div className="specialist-card reveal" style={{transitionDelay: '0.1s'}}>
            <div className="avatar-circle avatar-orange">CM</div>
            <div className="specialist-info">
              <h3>Psic. Carlos Méndez</h3>
              <span className="specialty-tag">Terapia Sistémica</span>
              <p>Enfocado en terapia de pareja, vínculos familiares y duelo.</p>
              <Link to="/professionals" className="card-link">Ver perfil <span>→</span></Link>
            </div>
          </div>

          <div className="specialist-card reveal" style={{transitionDelay: '0.2s'}}>
            <div className="avatar-circle avatar-teal">SV</div>
            <div className="specialist-info">
              <h3>Lic. Sofía Vargas</h3>
              <span className="specialty-tag">Crecimiento Personal</span>
              <p>Acompañamiento en autoestima, transiciones de vida y mindfulness.</p>
              <Link to="/professionals" className="card-link">Ver perfil <span>→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-header reveal">
          <div className="eyebrow center">Comunidad</div>
          <h2 className="section-title">Historias de cambio</h2>
          <p className="section-subtitle">Espacios seguros que han transformado el día a día de nuestra comunidad.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card reveal">
            <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
            <p className="testimonial-text">"La interfaz es tan tranquila que desde que entras ya sientes que es un espacio seguro. Encontrar a mi terapeuta fue cuestión de minutos y el seguimiento de emociones diario me ha ayudado muchísimo."</p>
            <div className="testimonial-author">
              <strong>A. G.</strong>
              <span>Terapia para Ansiedad</span>
            </div>
          </div>

          <div className="testimonial-card reveal" style={{transitionDelay: '0.1s'}}>
            <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
            <p className="testimonial-text">"Nunca había hecho terapia online por miedo a la privacidad. Ver lo cuidada que está esta plataforma y participar en la comunidad anónima cambió completamente mi perspectiva."</p>
            <div className="testimonial-author">
              <strong>Martín V.</strong>
              <span>Crecimiento Personal</span>
            </div>
          </div>

          <div className="testimonial-card reveal" style={{transitionDelay: '0.2s'}}>
            <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
            <p className="testimonial-text">"Mi terapeuta es excelente y los ejercicios de respiración que me dejan en la app son un salvavidas cuando estoy en la oficina. Todo integrado en un solo lugar de forma muy estética."</p>
            <div className="testimonial-author">
              <strong>Elena R.</strong>
              <span>Regulación del Estrés</span>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-header reveal">
          <div className="eyebrow center">Soporte</div>
          <h2 className="section-title">Preguntas frecuentes</h2>
          <p className="section-subtitle">Resolvemos tus dudas para que des el primer paso con total tranquilidad.</p>
        </div>

        <div className="faq-container reveal">
          
          <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(0)}>
              <span>¿Las sesiones son completamente confidenciales?</span>
              <div className="faq-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg>
              </div>
            </button>
            <div className="faq-answer" style={{ maxHeight: activeFaq === 0 ? '200px' : '0' }}>
              <p>Absolutamente. Cumplimos con los más altos estándares de protección de datos médicos. Todas tus videollamadas, mensajes y registros emocionales están encriptados de extremo a extremo.</p>
            </div>
          </div>

          <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(1)}>
              <span>¿Qué pasa si no conecto con mi terapeuta en la primera sesión?</span>
              <div className="faq-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg>
              </div>
            </button>
            <div className="faq-answer" style={{ maxHeight: activeFaq === 1 ? '200px' : '0' }}>
              <p>Es completamente normal. El vínculo terapéutico es vital. Por eso, ofrecemos una "Garantía de Conexión": si no te sientes cómodo, puedes cambiar de especialista sin costo adicional y sin dar explicaciones.</p>
            </div>
          </div>

          <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(2)}>
              <span>¿Cómo funcionan las herramientas de regulación gratuitas?</span>
              <div className="faq-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg>
              </div>
            </button>
            <div className="faq-answer" style={{ maxHeight: activeFaq === 2 ? '200px' : '0' }}>
              <p>Al crear tu cuenta, tendrás acceso inmediato a un panel con ejercicios de respiración, un diario emocional y meditaciones guiadas, diseñados para ayudarte en momentos de ansiedad o estrés diario, independientemente de si tienes una sesión agendada.</p>
            </div>
          </div>

        </div>
      </section>

      <section className="cta-section reveal">
        <div className="cta-container">
          <div className="cta-glow glow-blue"></div>
          <div className="cta-glow glow-orange"></div>

          <div className="cta-content">
            <h2>Tu bienestar emocional no tiene por qué esperar.</h2>
            <p>Da el primer paso hoy. Únete a nuestra comunidad y comienza a construir una vida más equilibrada con el apoyo de profesionales.</p>
            
            <div className="cta-actions">
              <Link to="/auth" className="btn-primary-dark">Comenzar mi proceso</Link>
              <button onClick={() => {document.getElementById('ecosistema').scrollIntoView({behavior: 'smooth'})}} className="btn-secondary-dark" style={{cursor: 'pointer'}}>Explorar funciones</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
