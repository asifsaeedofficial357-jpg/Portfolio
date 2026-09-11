/**
 * ========================================
 * SMOOTH SCROLL — Lenis Integration
 * DevByAsif®
 * ========================================
 */

import Lenis from '@studio-freight/lenis';

let lenis = null;

export function initSmoothScroll() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return;
  }
  
  // Initialize Lenis
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false
  });
  
  // Sync with requestAnimationFrame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (lenis) {
      lenis.resize();
    }
  });
  
  // Expose lenis instance for other modules
  window.lenis = lenis;
  
  console.log('%cSmooth scroll initialized', 'color: #666; font-size: 10px;');
}

/**
 * Scroll to top programmatically
 */
export function scrollToTop(duration = 1000) {
  if (!lenis) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  const start = performance.now();
  const startPos = window.scrollY;
  
  function animate(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutQuart(progress);
    
    const newPosition = startPos * (1 - easeProgress);
    lenis.scrollTo(newPosition, { immediate: true });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Easing function for smooth animations
 */
function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

/**
 * Scroll to specific element
 */
export function scrollToElement(element, offset = 0) {
  if (!element) return;
  
  const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
  
  if (lenis) {
    lenis.scrollTo(targetPosition, {
      duration: 1.2,
      offset: 0
    });
  } else {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}
