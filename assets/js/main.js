/* BAUVIA - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {

  /* --- HEADER SCROLL --- */
  const header = document.querySelector('.header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- HAMBURGER / MOBILE MENU --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- SMOOTH SCROLL --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* --- HERO SCROLL INDICATOR --- */
  const heroScroll = document.querySelector('.hero__scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const nextSection = document.querySelector('.hero').nextElementSibling;
      if (nextSection) {
        const headerHeight = header.offsetHeight;
        const targetPos = nextSection.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  }

  /* --- FAQ ACCORDION --- */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isActive = item.classList.contains('active');

      // Close all
      item.closest('.faq').querySelectorAll('.faq__item').forEach(i => {
        i.classList.remove('active');
      });

      // Open clicked (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- COOKIE BANNER --- */
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('bauvia-cookies')) {
    setTimeout(() => {
      cookieBanner.classList.add('active');
    }, 2000);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('bauvia-cookies', 'accepted');
      cookieBanner.classList.remove('active');
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('bauvia-cookies', 'declined');
      cookieBanner.classList.remove('active');
    });
  }

  /* --- SCROLL ANIMATIONS (Intersection Observer) --- */
  const animateElements = document.querySelectorAll('.card, .testimonial, .process__step, .section-header');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${i % 4 * 0.1}s, transform 0.6s ease ${i % 4 * 0.1}s`;
      observer.observe(el);
    });
  }

  /* --- ACTIVE NAV LINK HIGHLIGHT --- */
  const navLinks = document.querySelectorAll('.nav__link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace('./', '/'))) {
      link.style.color = 'var(--blue)';
    }
  });

  /* --- PHONE NUMBER CLICK TRACKING (optional GA event) --- */
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_click', { event_category: 'contact' });
      }
    });
  });

  /* --- WHATSAPP CLICK TRACKING (optional GA event) --- */
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { event_category: 'contact' });
      }
    });
  }

});
