/* ==========================================================================
   PORTFOLIO SCRIPT
   Modules: Loader, Theme, Cursor, Particles, Nav, Reveal, Typing,
            Tilt, Ripple, Skills, Certificates/Lightbox, Contact Form,
            Scroll Progress / Back-to-top
   All modules are defensive: they check that their DOM targets exist
   before wiring up, so sections can be added/removed without breaking JS.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initCustomCursor();
  initParticles();
  initNavigation();
  initScrollProgress();
  initBackToTop();
  initRevealAnimations();
  initTypingEffect();
  initHeroTilt();
  initRipple();
  initLightbox();
  initContactForm();
  initFooterYear();
});

/* --------------------------------------------------------------------------
   LOADING SCREEN
   -------------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  const reveal = () => {
    loader.classList.add('loaded');
    document.body.classList.add('page-revealed');
  };

  // Give the page a minimum "premium" loading moment, but never block too long.
  window.addEventListener('load', () => setTimeout(reveal, 600));
  // Fallback in case 'load' is delayed unexpectedly.
  setTimeout(reveal, 3000);
}

/* --------------------------------------------------------------------------
   DARK / LIGHT THEME TOGGLE (persisted via localStorage)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  const STORAGE_KEY = 'portfolio-theme';

  const applyTheme = (theme) => {
    body.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark');
  };

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage unavailable */ }
  });
}

/* --------------------------------------------------------------------------
   CUSTOM CURSOR + GLOW (desktop / mouse only)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const glow = document.querySelector('.cursor-glow');
  if (!dot || !glow) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smoothly trail the glow behind the dot for a soft, premium feel.
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  const hoverTargets = 'a, button, input, textarea, .skill-card, .project-card, .cert-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) glow.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) glow.classList.remove('hovering');
  });

  document.addEventListener('mousedown', () => dot.style.transform = 'translate(-50%, -50%) scale(0.7)');
  document.addEventListener('mouseup', () => dot.style.transform = 'translate(-50%, -50%) scale(1)');
}

/* --------------------------------------------------------------------------
   FLOATING PARTICLE BACKGROUND (canvas, lightweight, 60fps target)
   -------------------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const colors = ['rgba(180,151,214,0.35)', 'rgba(248,200,220,0.35)', 'rgba(214,228,240,0.4)', 'rgba(230,230,250,0.4)'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  if (!prefersReducedMotion) {
    requestAnimationFrame(draw);
  } else {
    draw(); // draw a single static frame, then stop
  }
}

/* --------------------------------------------------------------------------
   NAVIGATION: scroll shadow, mobile toggle, active-link tracking
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    links.forEach((link) => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  if (sections.length && links.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
  }
}

/* --------------------------------------------------------------------------
   SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* --------------------------------------------------------------------------
   BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  const toggleVisible = () => btn.classList.toggle('visible', window.scrollY > 500);
  toggleVisible();
  window.addEventListener('scroll', toggleVisible, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL (AOS-style, powered by IntersectionObserver only)
   -------------------------------------------------------------------------- */
function initRevealAnimations() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .skill-card');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   HERO TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const roles = ['Cybersecurity Engineer', 'Threat Detection & Automation', 'B.Tech Student'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400); // pause at full word
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(tick, deleting ? 45 : 80);
  }

  tick();
}

/* --------------------------------------------------------------------------
   HERO PROFILE IMAGE: 3D MOUSE PARALLAX TILT
   -------------------------------------------------------------------------- */
function initHeroTilt() {
  const tiltEl = document.getElementById('hero-tilt');
  if (!tiltEl) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const wrap = tiltEl.closest('.hero-image-wrap');
  if (!wrap) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltEl.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
  });

  wrap.addEventListener('mouseleave', () => {
    tiltEl.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

/* --------------------------------------------------------------------------
   RIPPLE CLICK EFFECT (buttons)
   -------------------------------------------------------------------------- */
function initRipple() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.ripple');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const circle = document.createElement('span');
    circle.className = 'ripple-circle';
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;

    target.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  });
}

/* --------------------------------------------------------------------------
   CERTIFICATES: LIGHTBOX POPUP
   -------------------------------------------------------------------------- */
function initLightbox() {
  const cards = document.querySelectorAll('.cert-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  if (!cards.length || !lightbox || !lightboxImg || !closeBtn) return;

  let lastFocused = null;

  function open(card) {
    const img = card.querySelector('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    lastFocused = document.activeElement;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach((card) => card.addEventListener('click', () => open(card)));
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) close(); });
}

/* --------------------------------------------------------------------------
   CONTACT FORM: client-side validation + friendly success animation
   (No backend included — swap the submit handler for your API/email service.)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email.',
    subject: (v) => v.trim().length >= 3 || 'Please enter a subject.',
    message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(validators).forEach((field) => {
      const input = form.elements[field];
      const errorEl = form.querySelector(`.form-error[data-for="${field}"]`);
      const result = validators[field](input.value);

      if (result !== true) {
        isValid = false;
        if (errorEl) errorEl.textContent = result;
        input.closest('.form-row').classList.add('shake');
        setTimeout(() => input.closest('.form-row').classList.remove('shake'), 400);
      } else if (errorEl) {
        errorEl.textContent = '';
      }
    });

    if (!isValid) return;

    // No backend wired up — this simply confirms receipt in the UI.
    if (successMsg) {
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 4500);
    }
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   FOOTER: current year
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
