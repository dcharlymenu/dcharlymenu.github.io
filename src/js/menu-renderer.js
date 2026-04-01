/**
 * Renders menu categories and item cards into the DOM from JSON data.
 * Uses inline styles for gradients (Tailwind can't detect dynamic class names).
 */

const CATEGORY_STYLES = {
  desayunos: { gradient: 'linear-gradient(135deg, #fcd34d, #f59e0b)', emoji: '🍳', image: '/images/categories/desayunos.webp' },
  entradas: { gradient: 'linear-gradient(135deg, #fbbf24, #d97706)', emoji: '🧀', image: '/images/categories/entradas.webp' },
  ensaladas: { gradient: 'linear-gradient(135deg, #4ade80, #16a34a)', emoji: '🥗', image: '/images/categories/ensaladas.webp' },
  tortas: { gradient: 'linear-gradient(135deg, #fb923c, #ea580c)', emoji: '🥖', image: '/images/categories/tortas.webp' },
  hamburguesas: { gradient: 'linear-gradient(135deg, #f97316, #dc2626)', emoji: '🍔', image: '/images/categories/hamburguesas.webp' },
  'algo-mas': { gradient: 'linear-gradient(135deg, #c084fc, #9333ea)', emoji: '🫔', image: '/images/categories/algo-mas.webp' },
  tacos: { gradient: 'linear-gradient(135deg, #f59e0b, #dc2626)', emoji: '🌮', image: '/images/categories/tacos.webp' },
  'comida-del-dia': { gradient: 'linear-gradient(135deg, #a3e635, #16a34a)', emoji: '🍲', image: '/images/categories/comida-del-dia.webp' },
  platillos: { gradient: 'linear-gradient(135deg, #f43f5e, #be123c)', emoji: '🍖', image: '/images/categories/platillos.webp' },
  mariscos: { gradient: 'linear-gradient(135deg, #22d3ee, #0284c7)', emoji: '🦐', image: '/images/categories/mariscos.webp' },
  burritos: { gradient: 'linear-gradient(135deg, #fb923c, #b45309)', emoji: '🌯', image: '/images/categories/burritos.webp' },
  menudo: { gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', emoji: '🍲', image: '/images/categories/menudo.webp' },
  postres: { gradient: 'linear-gradient(135deg, #f9a8d4, #ec4899)', emoji: '🍰', image: '/images/categories/postres.webp' },
  'bebidas-sin-alcohol': { gradient: 'linear-gradient(135deg, #67e8f9, #06b6d4)', emoji: '🥤', image: '/images/categories/bebidas-sin-alcohol.webp' },
  'bebidas-con-alcohol': { gradient: 'linear-gradient(135deg, #fcd34d, #d97706)', emoji: '🍺', image: '/images/categories/bebidas-con-alcohol.webp' },
};

function createItemCard(item, categoryId) {
  const isFeatured = item.featured;
  const style = CATEGORY_STYLES[categoryId] || { gradient: 'linear-gradient(135deg, #9ca3af, #6b7280)', emoji: '🍽️' };

  const card = document.createElement('div');
  card.className = `menu-card bg-white rounded-2xl overflow-hidden ${isFeatured ? 'featured-card' : 'shadow-md'}`;

  const tags = item.tags
    ? item.tags.map((tag) => `<span class="tag-badge">⭐ ${tag}</span>`).join('')
    : '';

  const featuredBadge = isFeatured
    ? `<span class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-primary-dark text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
        <span>⭐</span> Destacado
       </span>`
    : '';

  card.innerHTML = `
    <div class="card-placeholder h-40 md:h-44 flex items-center justify-center relative" style="background: ${style.gradient};">
      ${item.image
        ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover absolute inset-0" loading="lazy" />`
        : `<span class="text-6xl drop-shadow-xl" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">${style.emoji}</span>`
      }
      ${featuredBadge}
    </div>
    <div class="p-4 md:p-5">
      <div class="flex justify-between items-start gap-3 mb-2">
        <h4 class="font-heading font-bold text-charcoal text-base md:text-lg leading-snug">${item.name}</h4>
        ${item.price ? `<span class="price-badge">$${item.price}</span>` : ''}
      </div>
      ${item.description ? `<p class="text-charcoal-light text-sm line-clamp-2 leading-relaxed">${item.description}</p>` : ''}
      ${tags ? `<div class="flex flex-wrap gap-1.5 mt-3">${tags}</div>` : ''}
    </div>
  `;

  return card;
}

function createCategorySection(category) {
  const section = document.createElement('section');
  section.id = `category-${category.id}`;
  section.className = 'mb-14 scroll-mt-20';

  const style = CATEGORY_STYLES[category.id] || { emoji: '🍽️' };

  const thumbHtml = style.image
    ? `<div class="category-thumb shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-md"
           style="background: ${style.gradient};">
        <img src="${style.image}" alt="${category.name}"
             class="w-full h-full object-cover" loading="lazy" />
      </div>`
    : `<span class="text-4xl" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">${category.emoji}</span>`;

  const header = document.createElement('div');
  header.className = 'section-header mb-7';
  header.innerHTML = `
    <div class="flex items-center gap-4 mb-2">
      ${thumbHtml}
      <div>
        <h2 class="font-heading text-2xl md:text-3xl font-extrabold text-charcoal">${category.name}</h2>
        ${category.description ? `<p class="text-charcoal-light text-sm mt-0.5">${category.description}</p>` : ''}
      </div>
    </div>
    <div class="category-divider mt-3"></div>
  `;
  section.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';

  category.items.forEach((item) => {
    grid.appendChild(createItemCard(item, category.id));
  });

  section.appendChild(grid);
  return section;
}

export function renderMenu(menuData, container) {
  container.innerHTML = '';
  menuData.categories.forEach((category) => {
    container.appendChild(createCategorySection(category));
  });
}

export function getCategories(menuData) {
  return menuData.categories.map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
  }));
}
