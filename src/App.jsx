import { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CardSkeleton from './components/skeletons/CardSkeleton';
import TimerSkeleton from './components/skeletons/TimerSkeleton';
import { AuthProvider } from './context/AuthContext';

// Ariel's pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Main features
const BreathingTimer = lazy(() => import('./features/breathing/BreathingTimer'));
const GroundingWizard = lazy(() => import('./features/grounding/GroundingWizard'));
const MoodTracker = lazy(() => import('./features/journal/MoodTracker'));
const ProfessionalDirectory = lazy(() => import('./features/professionals/ProfessionalDirectory'));
const CommunityForum = lazy(() => import('./features/community/CommunityForum'));
const ResourceLibrary = lazy(() => import('./features/resources/ResourceLibrary'));

const RouteLoadingFallback = () => {
  const { pathname } = useLocation();
  if (pathname === '/botiquin/breathing') return <TimerSkeleton />;
  return <CardSkeleton count={pathname === '/' ? 3 : 2} />;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/* ─── FeatureLayout: card oscuro para Botiquín/Diario ──────── */
const FeatureLayout = ({ title, description, children, showTabs, currentTab, fallback }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 relative mt-10 w-full" style={{ minHeight: '80vh', padding: '40px 20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="feature-card-wrapper"
        style={{
          background: 'rgba(30, 30, 32, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>{title}</h2>
            <p style={{ fontSize: '0.8rem', color: '#A1A1A6', marginTop: '4px' }}>{description}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            aria-label="Cerrar y volver al inicio"
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1A1A6', border: 'none', cursor: 'pointer' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showTabs && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '0 24px', gap: '24px' }}>
            <Link to="/botiquin/breathing" style={{ padding: '14px 0', fontSize: '0.85rem', fontWeight: 'bold', borderBottom: '2px solid', textDecoration: 'none', borderColor: currentTab === 'breathing' ? '#3E7BFA' : 'transparent', color: currentTab === 'breathing' ? '#3E7BFA' : '#A1A1A6' }}>
              Respiración Guiada
            </Link>
            <Link to="/botiquin/grounding" style={{ padding: '14px 0', fontSize: '0.85rem', fontWeight: 'bold', borderBottom: '2px solid', textDecoration: 'none', borderColor: currentTab === 'grounding' ? '#3E7BFA' : 'transparent', color: currentTab === 'grounding' ? '#3E7BFA' : '#A1A1A6' }}>
              Grounding 5-4-3-2-1
            </Link>
          </div>
        )}

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <Suspense fallback={fallback ?? <CardSkeleton count={2} />}>
            {children}
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── PageLayout: vista completa con hero (Terapia, Recursos, Comunidad) ─ */
function PageLayout({ eyebrow, heroTitle, heroSubtitle, heroVisual, heroActions, heroBottom, fallback, children }) {
  const hasVisual = !!heroVisual;

  const heroInnerStyle = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: hasVisual ? 'row' : 'column',
    alignItems: hasVisual ? 'center' : 'center',
    justifyContent: hasVisual ? 'space-between' : 'center',
    gap: hasVisual ? '60px' : '0',
    textAlign: hasVisual ? 'left' : 'center',
  };

  return (
    <>
      {/* Hero section */}
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

        <div style={heroInnerStyle}>
          {/* Text side */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: hasVisual ? 'flex-start' : 'center',
            flex: hasVisual ? 1 : 'unset',
            maxWidth: hasVisual ? '520px' : '860px',
            width: '100%',
          }}>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--text-muted)', background: 'rgba(255,255,255,0.5)',
              padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.8)',
              marginBottom: '20px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-orange)', display: 'inline-block' }} />
              {eyebrow}
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(2rem, 4.2vw, 3.6rem)',
              lineHeight: 1.06, fontWeight: 800,
              letterSpacing: '-0.04em', color: 'var(--text-main)',
              margin: '0 0 18px',
              textAlign: hasVisual ? 'left' : 'center',
            }}>
              {heroTitle[0]}
              {heroTitle[1] && (
                <><br /><span className="gradient-text">{heroTitle[1]}</span></>
              )}
              {heroTitle[2] && (
                <><br /><span style={{ background: 'linear-gradient(135deg, var(--brand-orange), #FF6B35)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{heroTitle[2]}</span></>
              )}
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)', lineHeight: 1.65,
              color: 'var(--text-muted)', maxWidth: hasVisual ? '100%' : '640px',
              margin: '0 0 28px', textAlign: hasVisual ? 'left' : 'center',
            }}>
              {heroSubtitle}
            </p>

            {heroActions && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: hasVisual ? 'flex-start' : 'center' }}>
                {heroActions}
              </div>
            )}
          </div>

          {/* Visual side */}
          {heroVisual && (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
              {heroVisual}
            </div>
          )}
        </div>

        {/* Bottom pills/stats */}
        {heroBottom && (
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            {heroBottom}
          </div>
        )}
      </section>

      {/* Contenido de la feature */}
      <section style={{ padding: '0 clamp(20px, 7vw, 80px) 140px', width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Suspense fallback={fallback ?? <CardSkeleton count={3} />}>
            {children}
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen w-full bg-[#f5f5f8]">
        <ScrollToTop />
        <Header />

        <main className="main-content flex-1 w-full flex flex-col">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Auth pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Botiquín y Journal removidos temporalmente */}
              <Route
                path="/journal"
                element={(
                  <FeatureLayout
                    title="Tu Diario Emocional Express"
                    description="Monitorea tu estado de ánimo de forma privada."
                    fallback={<CardSkeleton count={2} label="Cargando diario emocional" />}
                  >
                    <MoodTracker />
                  </FeatureLayout>
                )}
              />

              {/* Terapia — página completa */}
              <Route
                path="/terapia"
                element={(
                  <PageLayout
                    eyebrow="Terapia · Especialistas · Bienestar"
                    heroTitle={['Descubre la terapia', 'que te acompaña', 'mejor.']}
                    heroSubtitle="Explora terapias, filtra especialistas por enfoque, especialidad o perfil, y revisa comentarios anónimos de quienes ya iniciaron su proceso."
                    heroActions={
                      <>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                          <a href="#especialistas" className="btn-primary">Ver terapias</a>
                          <a href="#orientacion" className="btn-secondary">Explorar opciones</a>
                        </div>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-blue)' }}>01</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sesiones seguras</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-blue)' }}>02</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Especialistas expertos</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-blue)' }}>03</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Acompañamiento confidencial</span>
                          </div>
                        </div>
                      </>
                    }
                    fallback={<CardSkeleton count={3} label="Cargando especialistas" />}
                    heroVisual={
                      <div className="premium-glass-card comunidad-panel" style={{ position: 'relative', width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <div className="floating-badge badge-top-left">
                          <span className="dot blue" />
                          Seguro
                        </div>
                        <div className="floating-badge badge-bottom-left">
                          <span className="dot orange" />
                          Cercano
                        </div>
                        <div className="floating-badge badge-bottom-right">
                          <span className="dot teal" />
                          Guiado
                        </div>
                        <div className="community-orbit" style={{ position: 'relative', width: 'min(390px, 74vw)', height: 'min(390px, 74vw)', borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(255,255,255,0.9), rgba(255,255,255,0.18) 58%, transparent 68%)' }}>
                          <div style={{ position: 'absolute', inset: '12%', borderRadius: '50%', border: '1px solid rgba(134,134,139,0.22)' }} />
                          <div style={{ position: 'absolute', inset: '26%', borderRadius: '50%', border: '1px dashed rgba(134,134,139,0.22)' }} />
                          
                          <div className="community-avatar avatar-main" style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, borderRadius: '50%', zIndex: 3, width: '118px', height: '118px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-purple))', fontSize: '1.6rem' }}>AM</div>
                          <div className="community-avatar avatar-one" style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, borderRadius: '50%', zIndex: 3, width: '72px', height: '72px', left: '8%', top: '22%', background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-teal))' }}>DR</div>
                          <div className="community-avatar avatar-two" style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, borderRadius: '50%', zIndex: 3, width: '72px', height: '72px', right: '7%', top: '28%', background: 'linear-gradient(135deg, var(--brand-orange), var(--brand-purple))' }}>CM</div>
                          <div className="community-avatar avatar-three" style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, borderRadius: '50%', zIndex: 3, width: '72px', height: '72px', left: '36%', bottom: '4%', background: 'linear-gradient(135deg, var(--brand-teal), var(--brand-blue))' }}>SV</div>
                          
                          <div className="community-line line-one" style={{ position: 'absolute', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(62,123,250,0.35), transparent)', transformOrigin: 'left center', zIndex: 1, width: '150px', left: '27%', top: '38%', transform: 'rotate(28deg)' }} />
                          <div className="community-line line-two" style={{ position: 'absolute', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(62,123,250,0.35), transparent)', transformOrigin: 'left center', zIndex: 1, width: '138px', left: '49%', top: '42%', transform: 'rotate(-21deg)' }} />
                          <div className="community-line line-three" style={{ position: 'absolute', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(62,123,250,0.35), transparent)', transformOrigin: 'left center', zIndex: 1, width: '120px', left: '43%', bottom: '34%', transform: 'rotate(88deg)' }} />
                        </div>
                      </div>
                    }
                  >
                    <ProfessionalDirectory />
                  </PageLayout>
                )}
              />

              {/* Recursos — página completa */}
              <Route
                path="/recursos"
                element={
                  <Suspense fallback={<CardSkeleton count={2} label="Cargando biblioteca" />}>
                    <ResourceLibrary />
                  </Suspense>
                }
              />

              {/* Comunidad — página completa */}
              <Route
                path="/comunidad"
                element={(
                  <PageLayout
                    eyebrow="Comunidad · Temáticas · Apoyo"
                    heroTitle={['Comparte tu proceso,', 'nunca estarás solo en esto.']}
                    heroSubtitle="Un espacio moderado para intercambiar experiencias por temática y conectar con otras personas que entienden tu proceso."
                    fallback={<CardSkeleton count={4} label="Cargando comunidad" />}
                    heroBottom={
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '100px', padding: '6px 18px', backdropFilter: 'blur(12px)', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>3.482</strong> <span style={{ color: 'var(--text-muted)' }}>miembros</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '100px', padding: '6px 18px', backdropFilter: 'blur(12px)', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>6</strong> <span style={{ color: 'var(--text-muted)' }}>temáticas</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '100px', padding: '6px 18px', backdropFilter: 'blur(12px)', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>128</strong> <span style={{ color: 'var(--text-muted)' }}>publicaciones hoy</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '100px', padding: '6px 18px', backdropFilter: 'blur(12px)', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>100%</strong> <span style={{ color: 'var(--text-muted)' }}>moderado por profesionales</span>
                        </div>
                      </div>
                    }
                  >
                    <CommunityForum />
                  </PageLayout>
                )}
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
