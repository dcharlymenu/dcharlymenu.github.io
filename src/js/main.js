import 'lenis/dist/lenis.css';
import '../styles/main.css';
import menuData from '../data/menu.json';
import { renderMenu, getCategories } from './menu-renderer.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { ScrollTrigger } from './gsap-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('menu-container');
  if (!container) return;

  // Init Lenis smooth scroll first
  const lenis = initSmoothScroll();

  // Render menu sections
  renderMenu(menuData, container);

  // Build navigation from categories, pass lenis for smooth nav clicks
  const categories = getCategories(menuData);
  initNavigation(categories, lenis);

  // Initialize GSAP scroll animations
  initAnimations();

  // Refresh ScrollTrigger after dynamic content is rendered
  ScrollTrigger.refresh();
});
