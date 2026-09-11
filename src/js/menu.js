/**
 * ========================================
 * FULLSCREEN MENU — Navigation Controller
 * DevByAsif®
 * ========================================
 */

import gsap from 'gsap';
import { setCursorMenuState } from './cursor.js';
import { scrollToElement } from './smoothScroll.js';

let menuOverlay = null;
let menuToggle = null;
let menuNav = null;
let isOpen = false;

export function initMenu(config) {
  menuOverlay = document.getElementById('menuOverlay');
  menuToggle = document.getElementById('menuToggle');
  menuNav = document.getElementById('menuNav');
  
  if (!menuOverlay || !menuToggle) return;
  
  // Set up menu toggle click handler
  menuToggle.addEventListener('click', toggleMenu);
  
  // Set up navigation links
  setupNavigationLinks(config);
  
  // Close on ESC key
  document.addEventListener('keydown', handleKeyDown);
  
  // Close when clicking outside menu content
  menuOverlay.addEventListener('click', handleOverlayClick);
  
  console.log('%cMenu initialized', 'color: #666; font-size: 10px;');
}

function toggleMenu() {
  if (!menuOverlay || !menuToggle) return;
  
  isOpen = !isOpen;
  
  if (isOpen) {
    openMenu();
  } else {
    closeMenu();
  }
}

function openMenu() {
  if (!menuOverlay || !menuToggle) return;
  
  // Update ARIA attributes
  menuToggle.setAttribute('aria-expanded', 'true');
  menuOverlay.setAttribute('aria-hidden', 'false');
  
  // Prevent body scrolling
  document.body.classList.add('menu-open');
  
  // Update cursor state
  setCursorMenuState(true);
  
  // Animate background overlay with premium slow transition
  gsap.to(menuOverlay, {
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out'
  });
  
  // Focus first menu item for accessibility
  const firstLink = menuOverlay.querySelector('.menu-link');
  if (firstLink) {
    setTimeout(() => firstLink.focus(), 500);
  }
}

function closeMenu() {
  if (!menuOverlay || !menuToggle) return;
  
  // Update ARIA attributes
  menuToggle.setAttribute('aria-expanded', 'false');
  menuOverlay.setAttribute('aria-hidden', 'true');
  
  // Allow body scrolling
  document.body.classList.remove('menu-open');
  
  // Update cursor state
  setCursorMenuState(false);
  
  // Animate background overlay out
  gsap.to(menuOverlay, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in'
  });
  
  // Return focus to menu toggle
  setTimeout(() => menuToggle.focus(), 400);
}

function setupNavigationLinks(config) {
  const menuLinks = menuOverlay.querySelectorAll('.menu-link');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const section = link.getAttribute('data-section');
      const targetId = section === 'home' ? '#hero' : '#' + section;
      const targetElement = document.querySelector(targetId);
      
      // Close menu first
      closeMenu();
      
      // Scroll to section after a short delay
      setTimeout(() => {
        if (targetElement) {
          scrollToElement(targetElement, 80);
        } else if (section === 'home') {
          scrollToElement(document.getElementById('hero'), 0);
        }
      }, 500);
    });
    
    // Add smooth hover effects with GSAP
    link.addEventListener('mouseenter', () => {
      gsap.to(link.querySelector('.menu-number'), {
        color: 'var(--color-accent)',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(link.querySelector('.menu-label'), {
        color: 'var(--color-text-primary)',
        x: 8,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      gsap.to(link.querySelector('.menu-number'), {
        color: '',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(link.querySelector('.menu-label'), {
        color: '',
        x: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && isOpen) {
    closeMenu();
  }
  
  // Trap focus within menu when open
  if (isOpen && e.key === 'Tab') {
    trapFocus(e);
  }
}

function handleOverlayClick(e) {
  // Close if clicking directly on the overlay (not on nav content)
  if (e.target === menuOverlay) {
    closeMenu();
  }
}

function trapFocus(e) {
  const focusableElements = menuOverlay.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Programmatically open menu
 */
export function openMenuProgrammatically() {
  if (!isOpen) {
    toggleMenu();
  }
}

/**
 * Programmatically close menu
 */
export function closeMenuProgrammatically() {
  if (isOpen) {
    toggleMenu();
  }
}

/**
 * Check if menu is currently open
 */
export function isMenuOpen() {
  return isOpen;
}
