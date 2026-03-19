/**
 * Staggered fade-in animation for menu cards using IntersectionObserver.
 */

export function initAnimations() {
  const cards = document.querySelectorAll('.menu-card');

  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.children);
          const index = siblings.indexOf(entry.target);
          // Stagger: each card in a grid animates 100ms after the previous
          entry.target.style.animationDelay = `${index * 0.1}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05,
    }
  );

  cards.forEach((card) => observer.observe(card));
}
