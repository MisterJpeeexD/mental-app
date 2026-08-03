import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

/* ─── Paleta ─────────────────────────────────────────────── */
const BRAND = {
  blue:   '#3E7BFA',
  orange: '#FF8A65',
  teal:   '#4DD0E1',
};

/* ─── Overlay para visitantes no autenticados ─────────────── */
function GuestOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      background: 'rgba(18,18,18,0.55)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      borderRadius: '24px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: '28px',
        padding: '40px 36px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Ícono */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 20px',
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 28px rgba(62,123,250,0.3)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 10px', letterSpacing: '-0.03em' }}>
          Únete a la comunidad
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 28px' }}>
          Crea una cuenta para acceder al espacio de comunidad: un lugar moderado para compartir tu proceso y conectar con personas que entienden lo que vives.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/registro"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '48px', borderRadius: '14px',
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`,
              color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem',
              boxShadow: '0 8px 20px rgba(62,123,250,0.3)',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Crear cuenta gratis
          </Link>
          <Link
            to="/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '44px', borderRadius: '14px',
              background: 'rgba(62,123,250,0.08)',
              border: '1px solid rgba(62,123,250,0.2)',
              color: BRAND.blue, textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(62,123,250,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(62,123,250,0.08)'}
          >
            Ya tengo cuenta → Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Vista principal ─────────────────────────────────────── */
export default function CommunityForum() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Contenedor con posición relativa para el overlay */}
      <div style={{ position: 'relative', minHeight: '420px' }}>

        {/* Vista preview (siempre visible, pero borrosa sin auth) */}
        <div style={{
          display: 'flex', gap: '20px',
          filter: isAuthenticated ? 'none' : 'blur(4px)',
          pointerEvents: isAuthenticated ? 'auto' : 'none',
          userSelect: 'none',
        }}>

          {/* Columna temáticas */}
          <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.72)', borderRadius: '24px', padding: '20px', boxShadow: '0 20px 45px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '12px' }}>Temáticas</div>
              {['Ansiedad', 'Depresión', 'Autoestima', 'Estrés', 'Duelo', 'Relaciones'].map((t, i) => {
                const colors = [BRAND.blue, BRAND.orange, BRAND.teal, BRAND.purple, '#E57373', '#81C784'];
                return (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '12px', marginBottom: '2px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feed central */}
          <div style={{ flex: 1 }}>
            {isAuthenticated ? (
              <>
                {/* Compositor */}
                <div style={{ background: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.72)', borderRadius: '24px', padding: '20px', marginBottom: '16px', boxShadow: '0 20px 45px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                      {user?.nombres?.[0]?.toUpperCase() || '?'}
                    </div>
                    <textarea
                      placeholder="¿Qué estás pensando o sintiendo hoy? Compártelo con la comunidad…"
                      rows={3}
                      style={{ flex: 1, border: '1px solid rgba(134,134,139,0.18)', borderRadius: '14px', padding: '10px 14px', resize: 'none', fontFamily: 'inherit', fontSize: '0.88rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.7)', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button style={{ padding: '8px 20px', borderRadius: '12px', background: BRAND.blue, color: 'white', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                      Publicar
                    </button>
                  </div>
                </div>

                {/* Estado vacío */}
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.4)', borderRadius: '24px', border: '1px dashed rgba(134,134,139,0.25)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💬</div>
                  <p style={{ fontWeight: 600, fontSize: '1rem', margin: '0 0 6px', color: 'var(--text-main)' }}>La comunidad está creciendo</p>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Sé el primero en compartir algo con la comunidad.</p>
                </div>
              </>
            ) : (
              /* Preview borroso de placeholder posts */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.62)', border: '1px solid rgba(255,255,255,0.72)', borderRadius: '20px', padding: '20px', height: `${80 + i * 20}px` }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overlay para no autenticados */}
        {!isAuthenticated && <GuestOverlay />}
      </div>
    </div>
  );
}
