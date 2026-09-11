/**
 * ========================================
 * CUSTOM CURSOR — Precision Tool
 * DevByAsif®
 * Desktop only, respects reduced motion
 * ========================================
 */

let cursor = null;
let cursorDot = null;
let cursorRing = null;
let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;
let ringX = 0;
let ringY = 0;
let isTouchDevice = false;
let prefersReducedMotion = false;

export function initCursor() {
  // Check for touch device
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check for reduced motion preference
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Don't initialize on touch devices or if reduced motion is preferred
  if (isTouchDevice || prefersReducedMotion) {
    return;
  }
  
  const cursorEl = document.getElementById('cursor');
  if (!cursorEl) return;
  
  cursor = cursorEl;
  cursorDot = cursor.querySelector('.cursor-dot');
  cursorRing = cursor.querySelector('.cursor-ring');
  
  // Set initial position
  cursor.style.opacity = '1';
  
  // Track mouse movement
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('mouseenter', handleMouseEnter);
  
  // Add hover states for interactive elements
  setupCursorInteractions();
  
  // Start animation loop
  requestAnimationFrame(animateCursor);
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function handleMouseLeave() {
  cursor?.classList.add('hidden');
}

function handleMouseEnter() {
  cursor?.classList.remove('hidden');
}

function setupCursorInteractions() {
  // Links and buttons
  const links = document.querySelectorAll('a[href], button, .menu-toggle, .theme-toggle');
  links.forEach(el => {
    el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
  });
  
  // CTA buttons with expand effect
  const ctas = document.querySelectorAll('[data-cursor="expand"]');
  ctas.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.remove('hover');
      cursor?.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('expand');
    });
  });
  
  // Menu toggle special state
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('mouseenter', () => {
      cursor?.classList.add('hover');
    });
    menuToggle.addEventListener('mouseleave', () => {
      cursor?.classList.remove('hover');
    });
  }
  
  // Click effect
  document.addEventListener('mousedown', () => cursor?.classList.add('active'));
  document.addEventListener('mouseup', () => cursor?.classList.remove('active'));
}

function animateCursor() {
  if (!cursorDot || !cursorRing) return;
  
  // Smooth interpolation for dot
  dotX += (mouseX - dotX) * 0.2;
  dotY += (mouseY - dotY) * 0.2;
  
  // Slower interpolation for ring (lag effect)
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  
  cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  
  requestAnimationFrame(animateCursor);
}

/**
 * Update cursor state for menu open/close
 */
export function setCursorMenuState(isOpen) {
  if (!cursor) return;
  
  if (isOpen) {
    cursor.classList.add('menu-open');
  } else {
    cursor.classList.remove('menu-open');
  }
}
