import { gsap, ScrollTrigger } from './gsap-config.js';

/**
 * GSAP ScrollTrigger animations for the menu.
 * All motion is wrapped in matchMedia so prefers-reduced-motion is respected.
 */
export function initAnimations() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // ── Hero entrance timeline (not scroll-driven) ──
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from('.hero-emoji', {
      scale: 0,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
    .from('.hero-title', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-phone', { y: 20, opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.3');

    // ── Hero emoji parallax on scroll ──
    gsap.utils.toArray('.hero-emoji').forEach((emoji, i) => {
      gsap.to(emoji, {
        y: -80 - (i * 30),
        scrollTrigger: {
          trigger: 'header',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // ── Promo banner entrance ──
    gsap.from('#promo-banner', {
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#promo-banner',
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });

    // ── Category headers slide in from left + divider draws across ──
    gsap.utils.toArray('.section-header').forEach((header) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      tl.from(header.querySelector('.flex'), {
        x: -40,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from(header.querySelector('.category-divider'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.3');
    });

    // ── Staggered card entrances per category grid ──
    gsap.utils.toArray('[id^="category-"]').forEach((section) => {
      const cards = section.querySelectorAll('.menu-card');
      if (!cards.length) return;

      gsap.from(cards, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Featured cards get a slightly larger entrance
      section.querySelectorAll('.featured-card').forEach((card) => {
        gsap.from(card, {
          scale: 0.9,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    // ── Footer fade up ──
    gsap.from('footer', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: 'footer',
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ── Reduced motion: instant reveal, no animation ──
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.menu-card, .hero-title, .hero-tagline, .hero-phone, .hero-emoji, .section-header, footer', {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    });
    gsap.set('.category-divider', { scaleX: 1 });
  });
}
