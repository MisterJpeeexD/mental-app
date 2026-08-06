export default function AuthVisual({ register = false }) {
  return (
    <section className="auth-visual" aria-label="Presentación de AbrazaMente">
      {/* Sin logo: el header global ya lo muestra y aquí quedaba tapado debajo */}
      <div className="auth-topbar">
        <div className="auth-badge"><span /> Tu espacio seguro</div>
      </div>
      <h1>{register ? 'Comienza a cuidar tu bienestar emocional.' : 'Tu bienestar emocional, en un solo lugar.'}</h1>
      <p>{register ? 'Crea una cuenta para acceder a profesionales, recursos y una comunidad moderada.' : 'Accede a tus herramientas, sesiones y recursos con una experiencia privada y cercana.'}</p>
      <div className="auth-orbit" aria-hidden="true"><div className="auth-heart">♥</div><span className="auth-orbit-dot dot-a" /><span className="auth-orbit-dot dot-b" /><span className="auth-orbit-dot dot-c" /></div>
      {register && <ul className="auth-points"><li>Datos protegidos</li><li>Registro gratuito</li><li>Acceso inmediato</li></ul>}
    </section>
  );
}
