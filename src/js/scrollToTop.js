/**
 * ========================================
 * SCROLL TO TOP — Custom Button Controller
 * DevByAsif®
 * ========================================
 */

import { scrollToTop } from './smoothScroll.js';

const scrollButton = document.getElementById('scrollToTop');
let isVisible = false;
const showAfterScroll = 400; // Show button after scrolling this far

export function initScrollToTop() {
  if (!scrollButton) return;
  
  // Initial visibility check
  updateVisibility();
  
  // Listen for scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Click handler
  scrollButton.addEventListener('click', () => {
    scrollToTop();
  });
  
  console.log('%cScroll to top initialized', 'color: #666; font-size: 10px;');
}

function handleScroll() {
  updateVisibility();
}

function updateVisibility() {
  const scrollPosition = window.scrollY;
  
  if (scrollPosition > showAfterScroll && !isVisible) {
    showButton();
  } else if (scrollPosition <= showAfterScroll && isVisible) {
    hideButton();
  }
}

function showButton() {
  isVisible = true;
  scrollButton?.classList.add('visible');
}

function hideButton() {
  isVisible = false;
  scrollButton?.classList.remove('visible');
}

/**
 * Programmatically show/hide the button
 */
export function setScrollToTopVisibility(visible) {
  if (visible) {
    showButton();
  } else {
    hideButton();
  }
}
