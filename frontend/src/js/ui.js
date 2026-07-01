// src/js/ui.js
export function initUIEffects() {
  // Efectos Hover Orbes
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach(orb => {
    orb.addEventListener('mouseenter', (e) => {
      const emotionName = orb.dataset.emotion;
      if (!emotionName) return;
      const tooltip = document.createElement('div');
      tooltip.className = 'apple-tooltip';
      tooltip.textContent = emotionName;
      document.body.appendChild(tooltip);
      const rect = orb.getBoundingClientRect();
      tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
      tooltip.style.top = `${rect.top - 10}px`;
      requestAnimationFrame(() => tooltip.classList.add('visible'));
      orb._tooltip = tooltip;
    });

    orb.addEventListener('mouseleave', () => {
      if (orb._tooltip) {
        orb._tooltip.classList.remove('visible');
        setTimeout(() => orb._tooltip.remove(), 200);
        orb._tooltip = null;
      }
    });
  });

  // Animación Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealOnScroll.observe(el));
}