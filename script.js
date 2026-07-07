(function () {
  const body = document.body;
  const header = document.getElementById('siteHeader');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeTriggers = document.querySelectorAll('[data-menu-close]');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

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

  prevButton?.addEventListener('click', () => {
    testimonialTrack?.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
  });

  nextButton?.addEventListener('click', () => {
    testimonialTrack?.scrollBy({ left: getCardScrollAmount(), behavior: 'smooth' });
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
