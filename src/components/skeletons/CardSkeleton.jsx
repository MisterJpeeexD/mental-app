const DEFAULT_CARD_COUNT = 3;

export default function CardSkeleton({ count = DEFAULT_CARD_COUNT, label = 'Cargando contenido' }) {
  const normalizedCount = Number.isInteger(count) && count > 0 ? count : DEFAULT_CARD_COUNT;

  return (
    <section className="card-skeleton" aria-busy="true" aria-live="polite" aria-label={label}>
      <span className="skeleton-sr-only">{label}</span>
      <div className="card-skeleton__heading" aria-hidden="true">
        <span className="skeleton-shimmer card-skeleton__eyebrow" />
        <span className="skeleton-shimmer card-skeleton__title" />
        <span className="skeleton-shimmer card-skeleton__subtitle" />
      </div>

      <div className="card-skeleton__grid" aria-hidden="true">
        {Array.from({ length: normalizedCount }, (_, index) => (
          <article className="card-skeleton__item" key={`card-skeleton-${index}`}>
            <span className="skeleton-shimmer card-skeleton__icon" />
            <span className="skeleton-shimmer card-skeleton__line card-skeleton__line--title" />
            <span className="skeleton-shimmer card-skeleton__line" />
            <span className="skeleton-shimmer card-skeleton__line card-skeleton__line--short" />
            <span className="skeleton-shimmer card-skeleton__action" />
          </article>
        ))}
      </div>
    </section>
  );
}
