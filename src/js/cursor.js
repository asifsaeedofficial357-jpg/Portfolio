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
  // Check for touch device - must have BOTH hover:none AND pointer:coarse (true touch)
  // Using comma (OR) was too broad for desktop environments
  isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  
  // Check for reduced motion preference
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Don't initialize on actual touch devices
  if (isTouchDevice) {
    return;
  }
  
  const cursorEl = document.getElementById('cursor');
  if (!cursorEl) return;
  
  cursor = cursorEl;
  cursorDot = cursor.querySelector('.cursor-dot');
  cursorRing = cursor.querySelector('.cursor-ring');
  
  // Remove inline opacity, let CSS handle it via .is-visible
  // cursor.style.opacity = '1';
  
  // Track mouse movement
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('mouseenter', handleMouseEnter);
  
  // Add hover states for interactive elements
  setupCursorInteractions();
  
  // Start animation loop (respects reduced motion internally)
  requestAnimationFrame(animateCursor);
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor?.classList.add('is-visible');
  cursor?.classList.remove('hidden');
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
  
  // If reduced motion is preferred, snap to position without smooth interpolation
  if (prefersReducedMotion) {
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  } else {
    // Smooth interpolation for dot
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    
    // Slower interpolation for ring (lag effect)
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    
    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
  }
  
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
