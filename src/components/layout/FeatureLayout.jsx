import { Suspense, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import CardSkeleton from '../skeletons/CardSkeleton';

const BOTIQUIN_TABS = [
  { to: '/botiquin/breathing', label: 'Respiración Guiada' },
  { to: '/botiquin/grounding', label: 'Grounding 5-4-3-2-1' },
];

/* `tone="dark"` conserva el aspecto original del resto de features;
   `tone="adaptive"` sigue el tema claro/oscuro del sitio.
   `asModal` lo muestra flotando sobre la página anterior (ver App.jsx). */
export default function FeatureLayout({
  title,
  description,
  children,
  showTabs,
  fallback,
  tone = 'dark',
  icon,
  asModal = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const close = () => (asModal ? navigate(-1) : navigate('/'));

  // Escape y bloqueo de scroll solo aplican a la versión flotante.
  useEffect(() => {
    if (!asModal) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') navigate(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [asModal, navigate]);

  const card = (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`feature-card-wrapper feature-card feature-card--${tone}${asModal ? ' feature-card--floating' : ''}`}
      aria-labelledby="feature-title"
      role={asModal ? 'dialog' : undefined}
      aria-modal={asModal || undefined}
    >
      <div className="feature-card__head">
        <div className="feature-card__heading">
          {icon}
          <div>
            <h2 className="feature-card__title" id="feature-title">{title}</h2>
            <p className="feature-card__desc">{description}</p>
          </div>
        </div>
        <button
          type="button"
          className="feature-card__close"
          onClick={close}
          aria-label={asModal ? 'Cerrar el botiquín' : 'Cerrar y volver al inicio'}
        >
          <X aria-hidden="true" width={20} height={20} />
        </button>
      </div>

      {/* NavLink marca la pestaña activa con aria-current="page"; el CSS se engancha ahí.
          Al flotar, las pestañas arrastran el backgroundLocation para no salirse del modal. */}
      {showTabs && (
        <nav className="feature-tabs" aria-label="Técnicas del botiquín">
          {BOTIQUIN_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="feature-tab"
              state={backgroundLocation ? { backgroundLocation } : undefined}
              replace={Boolean(backgroundLocation)}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="feature-card__body">
        <Suspense fallback={fallback ?? <CardSkeleton count={2} />}>
          {children}
        </Suspense>
      </div>
    </motion.section>
  );

  if (asModal) {
    return (
      <div
        className="feature-overlay"
        onClick={(event) => { if (event.target === event.currentTarget) navigate(-1); }}
      >
        {card}
      </div>
    );
  }

  return <div className="feature-shell">{card}</div>;
}
