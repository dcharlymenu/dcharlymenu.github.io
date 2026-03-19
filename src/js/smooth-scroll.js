import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap-config.js';

export function initSmoothScroll() {
  const lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
