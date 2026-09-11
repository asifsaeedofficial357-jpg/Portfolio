/**
 * ========================================
 * MAIN ENTRY POINT — DevByAsif®
 * Premium Digital Portfolio
 * ========================================
 */

import { initCursor } from './cursor.js';
import { initSmoothScroll } from './smoothScroll.js';
import { initHero } from './hero.js';
import { initMenu } from './menu.js';
import { initTheme } from './theme.js';
import { initScrollToTop } from './scrollToTop.js';
import { startLiveClock } from './utilities.js';

// Configuration
const CONFIG = {
  socialLinks: {
    linkedin: '#',
    upwork: '#',
    fiverr: '#',
    instagram: '#',
    email: 'hello@devbyasif.com'
  },
  
  menuSections: {
    home: '/',
    work: '/#work',
    about: '/#about',
    services: '/#services',
    contact: '/#contact'
  }
};

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // Start live Pakistan clock (updates every second)
  startLiveClock();
  
  // Initialize core functionality
  initTheme();
  initCursor();
  initSmoothScroll();
  initMenu(CONFIG);
  initHero();
  initScrollToTop();
  
  // Set up social links
  setupSocialLinks(CONFIG.socialLinks);
  
  // Mark page as loaded for animations
  setTimeout(() => {
    document.querySelector('.hero')?.classList.add('hero-loaded');
  }, 100);
  
  // Log initialization
  console.log('%cDevByAsif® — Portfolio Initialized', 'color: #F2572B; font-weight: bold; font-size: 12px;');
});

/**
 * Set up social link hrefs from config
 */
function setupSocialLinks(links) {
  const socialElements = document.querySelectorAll('.social-link');
  
  socialElements.forEach(link => {
    const label = link.querySelector('.social-label')?.textContent?.toLowerCase();
    
    if (label === 'linkedin' && links.linkedin) {
      link.href = links.linkedin;
    } else if (label === 'upwork' && links.upwork) {
      link.href = links.upwork;
    } else if (label === 'fiverr' && links.fiverr) {
      link.href = links.fiverr;
    } else if (label === 'instagram' && links.instagram) {
      link.href = links.instagram;
    }
  });
}

// Export config for other modules
export { CONFIG };
