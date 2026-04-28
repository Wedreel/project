/* ============================================================
   NovaCorp Solutions — script.js
   ============================================================ */

// ─── Navbar: scroll effect & active link ───────────────────
// ─── Navbar: scroll effect & active link ────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Active section highlight
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  // Back to top
  document.getElementById('backToTop')?.classList.toggle('visible', window.scrollY > 400);
});

// ─── Dropdown: toggle .open class on click (works desktop + mobile) ────────
const navDropdowns = document.querySelectorAll('.nav-dropdown');

navDropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('.dropdown-toggle');

  toggle.addEventListener('click', (e) => {
    const href = toggle.getAttribute('href') || '';
    const isHashTarget = href.startsWith('#');
    const isMobileView = window.innerWidth <= 768;

    // Keep dropdown click behavior for hash targets and mobile nav.
    if (!isHashTarget && !isMobileView) {
      return;
    }

    e.preventDefault();
    const isOpen = dropdown.classList.contains('open');

    // Close ALL dropdowns first
    navDropdowns.forEach(d => d.classList.remove('open'));

    // Re-open if it was closed
    if (!isOpen) dropdown.classList.add('open');
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    navDropdowns.forEach(d => d.classList.remove('open'));
  }
});

// Close dropdown when a dropdown-item is clicked
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    navDropdowns.forEach(d => d.classList.remove('open'));
  });
});

// ─── Hamburger Menu ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('navLinks');

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';

  // Close all dropdowns when closing menu
  if (!isOpen) navDropdowns.forEach(d => d.classList.remove('open'));
});

// Close mobile menu when a non-dropdown link is clicked
mobileNav.querySelectorAll('a:not(.dropdown-toggle):not(.dropdown-item)').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    navDropdowns.forEach(d => d.classList.remove('open'));
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && mobileNav.classList.contains('open')) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    navDropdowns.forEach(d => d.classList.remove('open'));
  }
});

// ─── Smooth Scroll for all anchors ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 74);
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ─── Scroll Reveal (Intersection Observer) ──────────────────
const revealElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children of grids
      const parent = entry.target.closest('.products-grid, .services-grid, .gallery-grid');
      if (parent) {
        const siblings = parent.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      } else {
        entry.target.classList.add('visible');
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ─── Product Filter ──────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    productCards.forEach((card, idx) => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, idx * 60);
      } else {
        card.style.transition = 'opacity 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 260);
      }
    });
  });
});

// ─── Gallery Lightbox ───────────────────────────────────────
function openLightbox(item) {
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  const bg = item.querySelector('.gallery-bg');
  const label = item.querySelector('.gallery-hover span');

  // Clone the bg div for full-size display
  const clone = bg.cloneNode(true);
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.borderRadius = '16px';
  clone.style.position = 'relative';

  // Add label overlay
  const labelEl = document.createElement('div');
  labelEl.style.cssText = `
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: white; padding: 30px 20px 20px;
    font-family: Poppins, sans-serif; font-weight: 600; font-size: 1rem;
    border-radius: 0 0 16px 16px;
  `;
  labelEl.textContent = label ? label.textContent : '';
  clone.appendChild(labelEl);

  content.innerHTML = '';
  content.appendChild(clone);

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Animate in
  content.style.transform = 'scale(0.85)';
  content.style.opacity = '0';
  content.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  requestAnimationFrame(() => {
    content.style.transform = 'scale(1)';
    content.style.opacity = '1';
  });
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── Contact Form ─────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const successMsg = document.getElementById('formSuccess');

  // Simulate loading
  btn.style.opacity = '0.7';
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.style.opacity = '1';
    btn.innerHTML = '<span>Message Sent ✓</span>';
    btn.style.background = '#449944';
    successMsg.classList.add('show');

    // Reset after 5s
    setTimeout(() => {
      e.target.reset();
      btn.innerHTML = `
        <span>Send Message</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      `;
      btn.style.background = '';
      btn.disabled = false;
      successMsg.classList.remove('show');
    }, 5000);
  }, 1400);
}

// ─── Back to Top ──────────────────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Animated Counter (stat numbers) ─────────────────────────
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const heroSection = document.getElementById('home');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      const statNums = document.querySelectorAll('.stat-num');
      const values = [20, 500, 50];
      const suffixes = ['+', '+', '+'];
      statNums.forEach((el, i) => {
        animateCounter(el, values[i], suffixes[i]);
      });
    }
  });
}, { threshold: 0.5 });

if (heroSection) statsObserver.observe(heroSection);

// ─── Navbar logo smooth return ────────────────────────────────
document.querySelector('.nav-logo').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Init: run once on load ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Trigger navbar scroll state on page refresh mid-page
  if (window.scrollY > 40) navbar.classList.add('scrolled');

  // Small delay before hero animations
  document.querySelectorAll('.reveal-up').forEach(el => {
    el.style.animationPlayState = 'running';
  });
});
