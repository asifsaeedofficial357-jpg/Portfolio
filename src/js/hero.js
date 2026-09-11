/**
 * ========================================
 * HERO SECTION — Animation & Interactions
 * DevByAsif®
 * ========================================
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Skip animations but still show content
    hero.classList.add('hero-loaded');
    return;
  }
  
  // Set up parallax effects
  setupParallax(hero);
  
  // Trigger initial animation after a short delay
  setTimeout(() => {
    hero.classList.add('hero-loaded');
  }, 100);
}

/**
 * Set up subtle parallax effects on scroll
 */
function setupParallax(hero) {
  const typography = hero.querySelector('.hero-typography');
  const portrait = hero.querySelector('.hero-portrait-container');
  const badges = hero.querySelector('.hero-badges');
  const cta = hero.querySelector('.hero-cta');
  
  // Typography parallax - moves slower than scroll
  if (typography && window.lenis) {
    gsap.to(typography, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
  
  // Portrait subtle movement
  if (portrait && window.lenis) {
    gsap.to(portrait, {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
  
  // Badges fade out on scroll
  if (badges && window.lenis) {
    gsap.to(badges, {
      opacity: 0,
      y: -30,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=400',
        scrub: true
      }
    });
  }
  
  // CTA fade and move on scroll
  if (cta && window.lenis) {
    gsap.to(cta, {
      opacity: 0,
      y: -20,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=300',
        scrub: true
      }
    });
  }
}

/**
 * Animate hero entrance sequence
 */
export function animateHeroEntrance() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  
  // Background establishes first
  tl.from('.hero-background', {
    opacity: 0,
    duration: 1
  });
  
  // Typography reveals
  tl.from('.hero-line', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15
  }, '-=0.5');
  
  // Portrait enters
  tl.from('.portrait-image', {
    y: 60,
    opacity: 0,
    duration: 1.2
  }, '-=0.8');
  
  // Metadata becomes visible
  tl.from('.badge', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1
  }, '-=0.6');
  
  // CTA appears
  tl.from('.cta-button', {
    y: 20,
    opacity: 0,
    duration: 0.8
  }, '-=0.4');
  
  return tl;
}
