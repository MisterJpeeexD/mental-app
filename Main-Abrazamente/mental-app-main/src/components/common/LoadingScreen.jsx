export default function LoadingScreen({ compact = false }) {
  return (
    <div className={compact ? 'loading-screen loading-screen--compact' : 'loading-screen'} role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>Cargando...</span>
    </div>
  );
}
