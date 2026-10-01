// Revela [data-reveal] (como unidad) y cada hijo directo de
// [data-reveal-group] (con stagger) la primera vez que entran al
// viewport. unobserve() tras revelar: es una entrada de una sola vez,
// no una animacion que deba rehacerse al volver a scrollear.
const STAGGER_MS = 70;

export function initScrollReveal() {
  const singles = document.querySelectorAll('[data-reveal]');
  const groups = document.querySelectorAll('[data-reveal-group]');

  if (!singles.length && !groups.length) return;

  if (!('IntersectionObserver' in window)) {
    singles.forEach((el) => el.classList.add('is-visible'));
    groups.forEach((group) => {
      Array.from(group.children).forEach((child) => child.classList.add('is-visible'));
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  singles.forEach((el) => observer.observe(el));

  groups.forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${i * STAGGER_MS}ms`);
      observer.observe(child);
    });
  });
}
