(function () {
  const checkoutLink = 'https://pay.kiwify.com.br/4mlsCVE';
  const body = document.body;
  const header = document.getElementById('siteHeader');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeTriggers = document.querySelectorAll('[data-menu-close]');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  const checkoutAnchors = document.querySelectorAll('[data-checkout-link]');
  const lotCards = Array.from(document.querySelectorAll('[data-lot-card]'));

  checkoutAnchors.forEach((anchor) => {
    anchor.setAttribute('href', checkoutLink);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');

    if (!anchor.hasAttribute('aria-label')) {
      anchor.setAttribute('aria-label', 'Garantir minha vaga no workshop LinkedIn Estrategico');
    }
  });

  function parseLocalDate(dateValue) {
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function getCurrentLot(cards, currentDate = new Date()) {
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const ranges = cards.map((card) => ({
      card,
      start: parseLocalDate(card.dataset.lotStart),
      end: parseLocalDate(card.dataset.lotEnd),
    }));

    const activeRange = ranges.find(({ start, end }) => today >= start && today <= end);
    return activeRange?.card ?? ranges.at(-1)?.card ?? null;
  }

  function syncCurrentLot() {
    if (!lotCards.length) return;

    const currentLot = getCurrentLot(lotCards);
    lotCards.forEach((card) => {
      const isCurrent = card === currentLot;
      card.classList.toggle('active', isCurrent);
      card.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  }

  syncCurrentLot();

  function openMenu() {
    body.classList.add('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    mobileMenu?.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  }

  menuToggle?.addEventListener('click', () => {
    body.classList.contains('menu-open') ? closeMenu() : openMenu();
  });

  closeTriggers.forEach((trigger) => trigger.addEventListener('click', closeMenu));
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', targetId);
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    button?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const testimonialTrack = document.getElementById('testimonialTrack');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');

  function getCardScrollAmount() {
    if (!testimonialTrack) return 0;
    const card = testimonialTrack.querySelector('.testimonial-card');
    const gap = Number.parseInt(getComputedStyle(testimonialTrack).columnGap || '22', 10);
    return card ? card.getBoundingClientRect().width + gap : 360;
  }

  function scrollTestimonials(direction) {
    if (!testimonialTrack) return;
    const maxScroll = testimonialTrack.scrollWidth - testimonialTrack.clientWidth;
    const nextPosition = testimonialTrack.scrollLeft + direction * getCardScrollAmount();
    testimonialTrack.scrollTo({
      left: Math.max(0, Math.min(nextPosition, maxScroll)),
      behavior: 'smooth',
    });
  }

  prevButton?.addEventListener('click', () => {
    scrollTestimonials(-1);
  });

  nextButton?.addEventListener('click', () => {
    scrollTestimonials(1);
  });

  const revealElements = document.querySelectorAll('.reveal, .reveal-group');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }
})();
