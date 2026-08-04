import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Cross } from 'lucide-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FeatureLayout from './components/layout/FeatureLayout';
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
const Landing = lazy(() => import('./pages/Landing'));
const TerapiaPage = lazy(() => import('./pages/TerapiaPage'));
const BreathingTimer = lazy(() => import('./features/breathing/BreathingTimer'));
const GroundingWizard = lazy(() => import('./features/grounding/GroundingWizard'));
const MoodTracker = lazy(() => import('./features/journal/MoodTracker'));
const ProfessionalDirectory = lazy(() => import('./features/professionals/ProfessionalDirectory'));
const AuthModal = lazy(() => import('./features/auth/AuthModal'));
const CommunityForum = lazy(() => import('./features/community/CommunityForum'));
const ResourceLibrary = lazy(() => import('./features/resources/ResourceLibrary'));

const botiquinIcon = (
  <span className="feature-card__badge" aria-hidden="true">
    <Cross strokeWidth={2.5} />
  </span>
);

/* El botiquín se renderiza dos veces: como página propia (visita directa a la
   URL) y flotando sobre la página anterior cuando se abre desde la cruz. */
const BotiquinRoute = ({ tab, asModal }) => (
  <FeatureLayout
    title="Botiquín de Apoyo Inmediato"
    description="Técnicas inmediatas para momentos de crisis y ansiedad."
    showTabs
    tone="adaptive"
    icon={botiquinIcon}
    asModal={asModal}
    fallback={tab === 'breathing'
      ? <TimerSkeleton />
      : <CardSkeleton count={1} label="Cargando ejercicio de grounding" />}
  >
    {tab === 'breathing' ? <BreathingTimer /> : <GroundingWizard />}
  </FeatureLayout>
);

const RouteLoadingFallback = () => {
  const { pathname } = useLocation();

  if (pathname === '/botiquin/breathing') {
    return <TimerSkeleton />;
  }

  return <CardSkeleton count={pathname === '/' ? 3 : 2} />;
};

export default function App() {
  const location = useLocation();
  // Lo deja la cruz de emergencia: la página que estaba abierta al pulsarla.
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <AuthProvider>
      <Header />

      <main className="main-content">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes location={backgroundLocation ?? location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/terapia" element={<TerapiaPage />} />

            {/* Ariel's separate views */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="/botiquin/breathing" element={<BotiquinRoute tab="breathing" />} />
            <Route path="/botiquin/grounding" element={<BotiquinRoute tab="grounding" />} />
            <Route
              path="/journal"
              element={(
                <FeatureLayout
                  title="Tu Diario Emocional Express"
                  description="Monitorea tu estado de ánimo de forma privada."
                  tone="adaptive"
                  fallback={<CardSkeleton count={2} label="Cargando diario emocional" />}
                >
                  <MoodTracker />
                </FeatureLayout>
              )}
            />
            <Route
              path="/professionals"
              element={(
                <FeatureLayout
                  title="Directorio de Terapeutas"
                  description="Agenda atención con profesionales verificados."
                  fallback={<CardSkeleton count={3} label="Cargando profesionales" />}
                >
                  <ProfessionalDirectory />
                </FeatureLayout>
              )}
            />
            <Route
              path="/recursos"
              element={(
                <FeatureLayout
                  title="Recursos Psicoeducativos"
                  description="Biblioteca de guías, artículos y contenidos psicoeducativos."
                  fallback={<CardSkeleton count={2} label="Cargando biblioteca de recursos" />}
                >
                  <ResourceLibrary />
                </FeatureLayout>
              )}
            />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/comunidad"
                element={(
                  <FeatureLayout
                    title="Foro de la Comunidad"
                    description="Conecta, comparte y recibe apoyo en un ambiente seguro."
                    fallback={<CardSkeleton count={4} label="Cargando foro de la comunidad" />}
                  >
                    <CommunityForum />
                  </FeatureLayout>
                )}
              />
            </Route>
// Deprecated auth route removed; use /login and /registro pages
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route path="/botiquin/breathing" element={<BotiquinRoute tab="breathing" asModal />} />
              <Route path="/botiquin/grounding" element={<BotiquinRoute tab="grounding" asModal />} />
            </Routes>
          )}
        </Suspense>
      </main>

      <Footer />
    </AuthProvider>
  );
}
