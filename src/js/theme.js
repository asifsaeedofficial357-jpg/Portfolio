/**
 * ========================================
 * THEME CONTROLLER — Dark/Light Mode
 * DevByAsif®
 * ========================================
 */

let currentTheme = 'dark';
const themeToggle = document.getElementById('themeToggle');

export function initTheme() {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('devbyasif-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme) {
    currentTheme = savedTheme;
  } else {
    currentTheme = systemPrefersDark ? 'dark' : 'light';
  }
  
  // Apply theme
  applyTheme(currentTheme);
  
  // Set up toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('devbyasif-theme')) {
      currentTheme = e.matches ? 'dark' : 'light';
      applyTheme(currentTheme);
    }
  });
  
  console.log('%cTheme initialized: ' + currentTheme, 'color: #666; font-size: 10px;');
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  localStorage.setItem('devbyasif-theme', currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update meta theme color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f5f5f0');
  }
  
  // Dispatch custom event for other modules
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
  return currentTheme;
}

/**
 * Set theme programmatically
 */
export function setTheme(theme) {
  if (theme === 'dark' || theme === 'light') {
    currentTheme = theme;
    applyTheme(currentTheme);
    localStorage.setItem('devbyasif-theme', currentTheme);
  }
}
