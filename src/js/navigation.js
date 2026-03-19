/**
 * Sticky category navigation with scroll spy and smooth scrolling via Lenis.
 */

export function initNavigation(categories, lenis) {
  const nav = document.querySelector('#category-nav .nav-scroll');
  if (!nav) return;

  // Build nav pills
  categories.forEach((cat) => {
    const pill = document.createElement('button');
    pill.className =
      'nav-pill flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border border-amber-200/60 bg-white text-charcoal-light shadow-sm shrink-0 cursor-pointer';
    pill.dataset.category = cat.id;
    pill.innerHTML = `<span>${cat.emoji}</span><span>${cat.name}</span>`;

    pill.addEventListener('click', () => {
      const section = document.getElementById(`category-${cat.id}`);
      if (section) {
        if (lenis) {
          lenis.scrollTo(section, { offset: -80 });
        } else {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    nav.appendChild(pill);
  });

  // Scroll spy
  const pills = nav.querySelectorAll('.nav-pill');
  const sections = categories.map((c) => document.getElementById(`category-${c.id}`)).filter(Boolean);

  function setActive(id) {
    pills.forEach((p) => {
      if (p.dataset.category === id) {
        p.classList.add('active');
        p.classList.remove('bg-white', 'text-charcoal-light', 'border-amber-200/60');
        // Scroll pill into view in nav
        p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        p.classList.remove('active');
        p.classList.add('bg-white', 'text-charcoal-light', 'border-amber-200/60');
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('category-', '');
          setActive(id);
        }
      });
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Activate first pill
  if (categories.length > 0) {
    setActive(categories[0].id);
  }
}
