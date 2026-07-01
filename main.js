import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Loader ──────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power2.out',
    onComplete: () => {
      loader.classList.add('is-hidden');
      loader.style.display = 'none';
      ScrollTrigger.refresh();
    }
  });
});

/* ── Header darken on scroll ─────────────────────── */
const header = document.querySelector('.site-header');
ScrollTrigger.create({
  start: 40,
  onUpdate: (self) => header.classList.toggle('scrolled', self.scroll() > 40)
});

/* ── Hero pin + mask scrub ───────────────────────── */
let heroTimeline;

function buildHeroTimeline() {
  if (heroTimeline) heroTimeline.scrollTrigger.kill();

  heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-sequence',
      start: 'top top',
      end: '+=120%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1
    }
  });

  heroTimeline
    .to('.hero-mask-logo', { scale: 14, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero-bg-video', { scale: 1.15, opacity: 0, ease: 'power1.in' }, 0)
    .to('.hero-caption', { opacity: 0, y: -30, ease: 'power1.in' }, 0)
    .to('.hero-scroll-cue', { opacity: 0, duration: 0.15 }, 0);
}

buildHeroTimeline();

/* ── Language switcher ───────────────────────────── */
const langBtns = document.querySelectorAll('.lang-btn');

function switchLang(lang) {
  document.querySelectorAll('.lang-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.step-video').forEach(v => { v.pause(); v.currentTime = 0; });

  const target = document.getElementById('lang-' + lang);
  if (target) {
    target.classList.add('visible');
    requestAnimationFrame(() => {
      observeNewElements();
      ScrollTrigger.refresh();
    });
  }

  langBtns.forEach(b => b.classList.remove('active'));
  const idx = { si: 0, ta: 1, en: 2 };
  if (idx[lang] !== undefined) langBtns[idx[lang]].classList.add('active');
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => switchLang(btn.dataset.lang));
});

/* ── Recipe reveal (steps + section headers) via ScrollTrigger ── */
function observeNewElements() {
  document.querySelectorAll('.lang-section.visible .step:not([data-st-bound])').forEach((el, i) => {
    el.setAttribute('data-st-bound', '1');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        el.classList.add('in-view');
        const video = el.querySelector('.step-video');
        if (video) {
          video.play().catch(() => { video.muted = true; video.play(); });
        }
      }
    });
  });

  document.querySelectorAll('.lang-section.visible .section-header:not([data-st-bound])').forEach(el => {
    el.setAttribute('data-st-bound', '1');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('in-view')
    });
  });
}

/* ── Boot ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  observeNewElements();
  ScrollTrigger.refresh();
});
