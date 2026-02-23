/* ═══════════════════════════════════════════
   AKASHI PRODUCTS — Hopper Recipe
   script.js
   ═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   LANGUAGE SWITCHER
───────────────────────────────────────── */
const langBtns = document.querySelectorAll('.lang-btn');

function switchLang(lang) {
  /* Hide all language sections */
  document.querySelectorAll('.lang-section').forEach(section => {
    section.classList.remove('visible');
  });

  /* Show the selected section */
  const target = document.getElementById('lang-' + lang);
  if (target) {
    target.classList.add('visible');
    /* Trigger scroll-reveal for newly visible steps */
    setTimeout(revealSteps, 60);
  }

  /* Update active button */
  langBtns.forEach(btn => btn.classList.remove('active'));
  const btnIndex = { si: 0, ta: 1, en: 2 };
  if (btnIndex[lang] !== undefined) {
    langBtns[btnIndex[lang]].classList.add('active');
  }
}

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
function revealSteps() {
  const steps = document.querySelectorAll('.lang-section.visible .step');
  steps.forEach((step, i) => {
    if (step.getBoundingClientRect().top < window.innerHeight - 40) {
      step.style.transitionDelay = (i * 0.09) + 's';
      step.classList.add('revealed');
    }
  });
}

window.addEventListener('scroll', revealSteps, { passive: true });
window.addEventListener('load', () => setTimeout(revealSteps, 400));

/* ─────────────────────────────────────────
   VIDEO TOGGLE  (collapsible — local video.mp4)
───────────────────────────────────────── */
function toggleVideo(cardId) {
  const card     = document.getElementById(cardId);
  const embedDiv = card.querySelector('.video-embed');
  const isOpen   = card.classList.contains('open');

  if (isOpen) {
    /* Collapse: stop & remove the video element */
    const vid = embedDiv.querySelector('video');
    if (vid) { vid.pause(); vid.src = ''; }
    card.classList.remove('open');
    embedDiv.innerHTML = '';
  } else {
    /* Expand: inject a <video> pointing at the local file */
    card.classList.add('open');
    embedDiv.innerHTML = `
      <video
        src="video.mp4"
        controls
        autoplay
        playsinline>
        Your browser does not support the video tag.
      </video>`;
  }
}

/* ─────────────────────────────────────────
   SPLASH PARALLAX FADE
───────────────────────────────────────── */
const splash = document.querySelector('.splash');
let ticking  = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (splash) {
        splash.style.opacity = Math.max(0, 1 - y / 480);
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
