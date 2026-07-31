import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const BreathingTimer = React.lazy(() => import('./features/breathing/BreathingTimer'));
const GroundingWizard = React.lazy(() => import('./features/grounding/GroundingWizard'));
const MoodTracker = React.lazy(() => import('./features/journal/MoodTracker'));
const ProfessionalDirectory = React.lazy(() => import('./features/professionals/ProfessionalDirectory'));
const AuthModal = React.lazy(() => import('./features/auth/AuthModal'));
const CommunityForum = React.lazy(() => import('./features/community/CommunityForum'));
const ResourceLibrary = React.lazy(() => import('./features/resources/ResourceLibrary'));

const FeatureLayout = ({ title, description, children, showTabs, currentTab }) => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 relative mt-10 w-full" style={{minHeight: '80vh', padding: '40px 20px'}}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
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
          overflow: 'hidden'
        }}
      >
        <div style={{padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'white'}}>{title}</h2>
            <p style={{fontSize: '0.8rem', color: '#A1A1A6', marginTop: '4px'}}>{description}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1A1A6', border: 'none', cursor: 'pointer'
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {showTabs && (
          <div style={{display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '0 24px', gap: '24px'}}>
            <Link
              to="/botiquin/breathing"
              style={{
                padding: '14px 0', fontSize: '0.85rem', fontWeight: 'bold', borderBottom: '2px solid', textDecoration: 'none',
                borderColor: currentTab === 'breathing' ? '#3E7BFA' : 'transparent',
                color: currentTab === 'breathing' ? '#3E7BFA' : '#A1A1A6'
              }}
            >
              Respiración Guiada
            </Link>
            <Link
              to="/botiquin/grounding"
              style={{
                padding: '14px 0', fontSize: '0.85rem', fontWeight: 'bold', borderBottom: '2px solid', textDecoration: 'none',
                borderColor: currentTab === 'grounding' ? '#3E7BFA' : 'transparent',
                color: currentTab === 'grounding' ? '#3E7BFA' : '#A1A1A6'
              }}
            >
              Grounding 5-4-3-2-1
            </Link>
          </div>
        )}
        
        <div style={{padding: '24px', overflowY: 'auto', flex: 1}}>
          <React.Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', padding: '32px'}}><span style={{color: '#A1A1A6', fontSize: '0.9rem'}}>Cargando...</span></div>}>
            {children}
          </React.Suspense>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (data) => {
    setUser({ email: data.email || data.username, role: data.role });
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <Header user={user} handleLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/botiquin/breathing" element={
            <FeatureLayout title="Botiquín de Apoyo Inmediato" description="Técnicas inmediatas para momentos de crisis y ansiedad." showTabs currentTab="breathing">
              <BreathingTimer />
            </FeatureLayout>
          } />
          <Route path="/botiquin/grounding" element={
            <FeatureLayout title="Botiquín de Apoyo Inmediato" description="Técnicas inmediatas para momentos de crisis y ansiedad." showTabs currentTab="grounding">
              <GroundingWizard />
            </FeatureLayout>
          } />
          <Route path="/journal" element={
            <FeatureLayout title="Tu Diario Emocional Express" description="Monitorea tu estado de ánimo de forma privada.">
              <MoodTracker />
            </FeatureLayout>
          } />
          <Route path="/professionals" element={
            <FeatureLayout title="Directorio de Terapeutas" description="Agenda atención con profesionales verificados.">
              <ProfessionalDirectory />
            </FeatureLayout>
          } />
          <Route path="/recursos" element={
            <FeatureLayout title="Recursos Psicoeducativos" description="Biblioteca de guías, artículos y contenidos psicoeducativos.">
              <ResourceLibrary />
            </FeatureLayout>
          } />
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/comunidad" element={
              <FeatureLayout title="Foro de la Comunidad" description="Conecta, comparte y recibe apoyo en un ambiente seguro.">
                <CommunityForum />
              </FeatureLayout>
            } />
          </Route>
          <Route path="/auth" element={
            <FeatureLayout title={user ? 'Mi Cuenta' : 'Autenticación'} description="Accede a tu espacio personalizado de salud mental.">
              <AuthModal onLogin={handleLogin} />
            </FeatureLayout>
          } />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
