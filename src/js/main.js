import '../styles/main.css';
import menuData from '../data/menu.json';
import { renderMenu, getCategories } from './menu-renderer.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('menu-container');
  if (!container) return;

  // Render menu sections
  renderMenu(menuData, container);

  // Build navigation from categories
  const categories = getCategories(menuData);
  initNavigation(categories);

  // Initialize scroll animations
  initAnimations();
});
