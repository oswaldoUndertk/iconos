(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) document.documentElement.classList.add('motion-ready');

  // Header density + active top-level section.
  const header = document.querySelector('[data-site-header]');
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const fileName = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const navMap = {
    'oferta.html': 'oferta.html', 'cursos-diplomados.html': 'oferta.html', 'doctorado.html': 'oferta.html',
    'investigacion.html': 'investigacion.html', 'rici.html': 'investigacion.html',
    'sistema-cultural.html': 'sistema-cultural.html', 'galeria.html': 'sistema-cultural.html',
    'instituto.html': 'instituto.html',
    'admisiones.html': 'admisiones.html', 'contacto.html': 'admisiones.html'
  };
  const activeHref = navMap[fileName];
  if (activeHref && header) {
    header.querySelectorAll('.navbar-nav > .nav-item > .nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (href === activeHref) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Scroll reveal: supports explicit .reveal-item plus card/info groups.
  const candidates = new Set(document.querySelectorAll('.reveal-item'));
  document.querySelectorAll('[data-reveal-section]').forEach(section => {
    section.querySelectorAll('.card, .info-tarjeta, .cta-fecha, .accordion-item, .evento-video, .evento-imagenes .duotono').forEach(el => candidates.add(el));
  });
  candidates.forEach((el, i) => {
    el.classList.add('reveal-item');
    const localIndex = [...(el.parentElement?.children || [])].indexOf(el);
    if (localIndex >= 0) el.style.setProperty('--delay', `${Math.min(localIndex, 5) * 70}ms`);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    candidates.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    candidates.forEach(el => observer.observe(el));
  }

  // Home carousel counter + re-triggered entrance sequence.
  const hero = document.getElementById('heroeCarrusel');
  const slideIndex = document.querySelector('[data-slide-index]');
  if (hero) {
    hero.addEventListener('slide.bs.carousel', event => {
      if (slideIndex) slideIndex.textContent = String(event.to + 1).padStart(2, '0');
    });
    hero.addEventListener('slid.bs.carousel', () => {
      const active = hero.querySelector('.carousel-item.active');
      if (!active || reducedMotion) return;
      active.querySelectorAll('[data-hero-animate], [data-hero-media]').forEach(el => {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = '';
      });
    });
  }

  // Very subtle pointer parallax for home and interior heroes.
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reducedMotion && finePointer) {
    document.querySelectorAll('.hero-media, [data-parallax-media]').forEach(media => {
      const image = media.querySelector('img');
      const shapeA = media.querySelector('.hero-shape-a, .shape-one');
      const shapeB = media.querySelector('.hero-shape-b, .shape-two');
      if (!image) return;
      media.addEventListener('pointermove', event => {
        const rect = media.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        image.style.transform = `scale(1.045) translate(${x * -5}px, ${y * -5}px)`;
        if (shapeA) shapeA.style.transform = `skewX(-8deg) translate(${x * 12}px, ${y * 8}px)`;
        if (shapeB) shapeB.style.transform = `translate(${x * -10}px, ${y * -8}px)`;
      });
      media.addEventListener('pointerleave', () => {
        image.style.transform = '';
        if (shapeA) shapeA.style.transform = '';
        if (shapeB) shapeB.style.transform = '';
      });
    });
  }

  // Academic level filters (Oferta + Cursos/Diplomados).
  const filterButtons = [...document.querySelectorAll('.filtro-nivel')];
  const programCards = [...document.querySelectorAll('[data-grid-programas] .card')];
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(b => { b.setAttribute('aria-pressed', 'false'); b.classList.remove('active'); });
      button.setAttribute('aria-pressed', 'true');
      button.classList.add('active');
      const filter = button.getAttribute('data-filtro');
      programCards.forEach(card => {
        const col = card.closest('.col');
        if (!col) return;
        const match = filter === 'todos' || card.getAttribute('data-nivel') === filter;
        col.style.display = match ? '' : 'none';
        if (match) {
          card.classList.remove('is-visible');
          requestAnimationFrame(() => card.classList.add('is-visible'));
        }
      });
    });
  });

  // Contact: live WhatsApp message builder. Safely no-ops elsewhere.
  const nameField = document.getElementById('campo-nombre');
  const checks = [...document.querySelectorAll('.btn-check[data-grupo]')];
  const preview = document.getElementById('mensaje-texto');
  const whatsappButton = document.getElementById('boton-whatsapp');
  if (nameField && checks.length && preview && whatsappButton) {
    const whatsappNumber = '525500000000'; // Sustituir por el número real de ICONOS.
    const buildMessage = () => {
      const groups = {};
      const order = [];
      checks.forEach(box => {
        if (!box.checked) return;
        const group = box.getAttribute('data-grupo');
        const label = document.querySelector(`label[for="${box.id}"]`);
        if (!label) return;
        if (!groups[group]) { groups[group] = []; order.push(group); }
        groups[group].push(label.textContent.trim());
      });
      if (!order.length) {
        preview.textContent = 'Selecciona al menos una opción para generar tu mensaje…';
        preview.classList.add('vacio');
        whatsappButton.setAttribute('aria-disabled', 'true');
        whatsappButton.setAttribute('href', '#');
        return;
      }
      const name = nameField.value.trim();
      const lines = [name ? `Hola, soy ${name}.` : 'Hola.'];
      order.forEach(group => lines.push(`${group}: ${groups[group].join(', ')}.`));
      const message = lines.join(' ');
      preview.textContent = message;
      preview.classList.remove('vacio');
      whatsappButton.removeAttribute('aria-disabled');
      whatsappButton.setAttribute('href', `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
    };
    checks.forEach(box => box.addEventListener('change', buildMessage));
    nameField.addEventListener('input', buildMessage);
    buildMessage();
  }
})();
