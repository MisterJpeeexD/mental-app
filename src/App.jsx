import { lazy, Suspense } from 'react';
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
const PageLayout = ({ heroTitle, heroSubtitle, eyebrow, children, fallback }) => {
  return (
    <>
      {/* Hero section — fiel al diseño legacy */}
      <section className="page-hero" aria-label="Encabezado de sección">
        <div className="mesh-background" aria-hidden="true">
          <div className="mesh-blob blob-blue" />
          <div className="mesh-blob blob-orange" />
          <div className="mesh-blob blob-teal" />
        </div>
        <div className="page-hero-inner">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            {eyebrow}
          </div>
          <h1>
            {heroTitle[0]}
            <br />
            <span className="gradient-text">{heroTitle[1]}</span>
          </h1>
          <p className="subtitle" style={{ maxWidth: '640px' }}>{heroSubtitle}</p>
        </div>
      </section>

      {/* Contenido de la feature */}
      <section className="page-body">
        <div className="page-body-inner">
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
      <Header />

      <main className="main-content">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Botiquín — card oscuro */}
            <Route
              path="/botiquin/breathing"
              element={(
                <FeatureLayout
                  title="Botiquín de Apoyo Inmediato"
                  description="Técnicas inmediatas para momentos de crisis y ansiedad."
                  showTabs
                  currentTab="breathing"
                  fallback={<TimerSkeleton />}
                >
                  <BreathingTimer />
                </FeatureLayout>
              )}
            />
            <Route
              path="/botiquin/grounding"
              element={(
                <FeatureLayout
                  title="Botiquín de Apoyo Inmediato"
                  description="Técnicas inmediatas para momentos de crisis y ansiedad."
                  showTabs
                  currentTab="grounding"
                  fallback={<CardSkeleton count={1} label="Cargando ejercicio de grounding" />}
                >
                  <GroundingWizard />
                </FeatureLayout>
              )}
            />
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
              path="/professionals"
              element={(
                <PageLayout
                  eyebrow="Terapia · Especialistas · Bienestar"
                  heroTitle={['Descubre la terapia', 'que te acompaña mejor.']}
                  heroSubtitle="Explora terapias, filtra especialistas por enfoque, especialidad o perfil, y revisa comentarios anónimos de quienes ya iniciaron su proceso."
                  fallback={<CardSkeleton count={3} label="Cargando especialistas" />}
                >
                  <ProfessionalDirectory />
                </PageLayout>
              )}
            />

            {/* Recursos — página completa */}
            <Route
              path="/recursos"
              element={(
                <PageLayout
                  eyebrow="Biblioteca · Material clínico · Autoayuda"
                  heroTitle={['Recursos para entender,', 'aprender y acompañar.']}
                  heroSubtitle="Libros, guías clínicas, podcasts y videos seleccionados y validados por profesionales de la salud mental."
                  fallback={<CardSkeleton count={2} label="Cargando biblioteca" />}
                >
                  <ResourceLibrary />
                </PageLayout>
              )}
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
    </AuthProvider>
  );
}
