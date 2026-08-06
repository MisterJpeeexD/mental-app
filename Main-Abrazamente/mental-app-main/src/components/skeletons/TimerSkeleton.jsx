export default function TimerSkeleton({ label = 'Cargando temporizador de respiración' }) {
  return (
    <section className="timer-skeleton" aria-busy="true" aria-live="polite" aria-label={label}>
      <span className="skeleton-sr-only">{label}</span>

      <div className="timer-skeleton__dial" aria-hidden="true">
        <div className="timer-skeleton__ring skeleton-shimmer">
          <span className="timer-skeleton__time">00:00</span>
        </div>
      </div>

      <div className="timer-skeleton__content" aria-hidden="true">
        <span className="skeleton-shimmer timer-skeleton__title" />
        <span className="skeleton-shimmer timer-skeleton__line" />
        <span className="skeleton-shimmer timer-skeleton__line timer-skeleton__line--short" />
        <span className="skeleton-shimmer timer-skeleton__button" />
      </div>
    </section>
  );
}
