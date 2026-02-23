/* ═══════════════════════════════════════════════════
   AKASHI PRODUCTS — Hopper Recipe
   script.js
   ═══════════════════════════════════════════════════ */

/* ── Header: darken on scroll ───────────────────── */
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/* ── Language switcher ──────────────────────────── */
const langBtns = document.querySelectorAll('.lang-btn');

function switchLang(lang) {
  /* Hide all sections */
  document.querySelectorAll('.lang-section').forEach(s => s.classList.remove('visible'));

  /* Pause every video in now-hidden sections */
  document.querySelectorAll('.step-video').forEach(v => { v.pause(); v.currentTime = 0; });

  /* Show target */
  const target = document.getElementById('lang-' + lang);
  if (target) {
    target.classList.add('visible');
    /* Re-run observers for new content */
    setTimeout(observeNewElements, 60);
  }

  /* Update button states */
  langBtns.forEach(b => b.classList.remove('active'));
  const idx = { si: 0, ta: 1, en: 2 };
  if (idx[lang] !== undefined) langBtns[idx[lang]].classList.add('active');
}


/* ── IntersectionObserver: step + section reveals ─ */
let stepObserver, headerObserver;

function buildObservers() {
  /* Step cards */
  stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        /* Auto-play video inside this step if present */
        const video = entry.target.querySelector('.step-video');
        if (video) {
          video.play().catch(() => {
            /* Autoplay blocked — mute and retry (browser policy) */
            video.muted = true;
            video.play();
          });
        }
        stepObserver.unobserve(entry.target); /* fire once */
      }
    });
  }, {
    threshold: 0.22,   /* trigger when 22% visible */
    rootMargin: '0px 0px -40px 0px'
  });

  /* Section headers */
  headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        headerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
}

function observeNewElements() {
  /* Observe all visible steps not yet triggered */
  document.querySelectorAll('.lang-section.visible .step:not(.in-view)').forEach(el => {
    stepObserver.observe(el);
  });

  /* Observe section headers */
  document.querySelectorAll('.lang-section.visible .section-header:not(.in-view)').forEach(el => {
    headerObserver.observe(el);
  });
}

/* ── Boot ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildObservers();
  observeNewElements();
});
