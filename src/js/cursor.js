/**
 * CUSTOM CURSOR — Precision Tool
 * DevByAsif®
 * Desktop only, smooth trail, respects reduced motion
 */

let cursor = null;
let cursorDot = null;
let cursorRing = null;
let cursorTrail = null;
let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;
let ringX = 0;
let ringY = 0;
let trailX = 0;
let trailY = 0;
let trailAngle = 0;
let isTouchDevice = false;
let prefersReducedMotion = false;

export function initCursor() {
  isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouchDevice) return;

  const cursorEl = document.getElementById('cursor');
  if (!cursorEl) return;
  cursor = cursorEl;
  cursorDot = cursorEl.querySelector('.cursor-dot');
  cursorRing = cursorEl.querySelector('.cursor-ring');
  cursorTrail = cursorEl.querySelector('.cursor-trail');
  if (!cursorDot || !cursorRing || !cursorTrail) return;

  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('mouseenter', handleMouseEnter);
  setupCursorInteractions();
  requestAnimationFrame(animateCursor);
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!dotX && !dotY) {
    dotX = ringX = trailX = mouseX;
    dotY = ringY = trailY = mouseY;
  }
  cursor?.classList.add('is-visible');
  cursor?.classList.remove('hidden');
}

function handleMouseLeave() { cursor?.classList.add('hidden'); }
function handleMouseEnter() { cursor?.classList.remove('hidden'); }

function setupCursorInteractions() {
  const links = document.querySelectorAll('a[href], button, .menu-toggle, .theme-toggle');
  links.forEach(el => {
    el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
  });

  document.querySelectorAll('[data-cursor="expand"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.remove('hover');
      cursor?.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => cursor?.classList.remove('expand'));
  });

  document.addEventListener('mousedown', () => cursor?.classList.add('active'));
  document.addEventListener('mouseup', () => cursor?.classList.remove('active'));
}

function animateCursor() {
  if (!cursorDot || !cursorRing || !cursorTrail) return;

  if (prefersReducedMotion) {
    dotX = ringX = trailX = mouseX;
    dotY = ringY = trailY = mouseY;
  } else {
    dotX += (mouseX - dotX) * 0.24;
    dotY += (mouseY - dotY) * 0.24;
    ringX += (mouseX - ringX) * 0.10;
    ringY += (mouseY - ringY) * 0.10;
    trailX += (dotX - trailX) * 0.065;
    trailY += (dotY - trailY) * 0.065;
  }

  const dx = dotX - trailX;
  const dy = dotY - trailY;
  const distance = Math.hypot(dx, dy);
  if (distance > 0.5) trailAngle = Math.atan2(dy, dx) * 180 / Math.PI;
  const trailLength = Math.min(150, 65 + distance * 3.2);

  cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
  cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
  cursorTrail.style.width = `${trailLength}px`;
  cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) rotate(${trailAngle}deg) translateY(-50%)`;

  requestAnimationFrame(animateCursor);
}

export function setCursorMenuState(isOpen) {
  if (!cursor) return;
  cursor.classList.toggle('menu-open', isOpen);
}
