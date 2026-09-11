/**
 * ========================================
 * DYNAMIC CONNECTOR LINES — Precise Geometry
 * DevByAsif®
 * Calculates badge positions and updates connector paths
 * Uses ResizeObserver for responsive updates
 * ========================================
 */

let connectorSvg = null;
let connectorLeft = null;
let connectorRight = null;
let endpointLeft = null;
let endpointRight = null;
let resizeObserver = null;

export function initConnectors() {
  connectorSvg = document.querySelector('.hero-connectors');
  if (!connectorSvg) return;

  // Get path and endpoint elements
  const paths = connectorSvg.querySelectorAll('.connector-line');
  const endpoints = connectorSvg.querySelectorAll('.connector-endpoint');

  connectorLeft = paths[0];
  connectorRight = paths[1];
  endpointLeft = endpoints[0];
  endpointRight = endpoints[1];

  if (!connectorLeft || !connectorRight || !endpointLeft || !endpointRight) {
    return;
  }

  // Initial calculation
  updateConnectorPaths();

  // Watch for resize and recalculate
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      updateConnectorPaths();
    });

    // Observe the hero section for size changes
    const hero = document.querySelector('.hero');
    if (hero) {
      resizeObserver.observe(hero);
    }
  }

  // Also recalculate on window resize
  window.addEventListener('resize', updateConnectorPaths);
}

function updateConnectorPaths() {
  if (!connectorSvg || !connectorLeft || !connectorRight) return;

  // Get badge elements
  const badgeLeft = document.querySelector('.badge-left');
  const badgeRight = document.querySelector('.badge-right');

  if (!badgeLeft || !badgeRight) return;

  // Get actual positions in viewport
  const badgeLeftRect = badgeLeft.getBoundingClientRect();
  const badgeRightRect = badgeRight.getBoundingClientRect();
  
  // If badges are not visible (mobile), skip
  if (badgeLeftRect.width === 0 || badgeRightRect.width === 0) {
    return;
  }

  const svgRect = connectorSvg.getBoundingClientRect();
  
  // If SVG is not visible, skip
  if (svgRect.width === 0 || svgRect.height === 0) {
    return;
  }

  // Convert viewport coordinates to SVG coordinates
  // The SVG has viewBox="0 0 1440 900" and preserveAspectRatio="xMidYMid slice"
  const viewBox = connectorSvg.getAttribute('viewBox').split(' ').map(Number);
  const viewBoxWidth = viewBox[2];
  const viewBoxHeight = viewBox[3];

  // Calculate scale factors
  const scaleX = svgRect.width / viewBoxWidth;
  const scaleY = svgRect.height / viewBoxHeight;

  // Safeguard against zero or NaN scale
  if (!scaleX || !scaleY || !isFinite(scaleX) || !isFinite(scaleY)) {
    return;
  }

  // Convert viewport to SVG coordinates
  // Left badge: inner right edge, center vertical
  const leftBadgeRightX = (badgeLeftRect.right - svgRect.left) / scaleX;
  const leftBadgeCenterY = (badgeLeftRect.top + badgeLeftRect.height / 2 - svgRect.top) / scaleY;

  // Right badge: inner left edge, center vertical
  const rightBadgeLeftX = (badgeRightRect.left - svgRect.left) / scaleX;
  const rightBadgeCenterY = (badgeRightRect.top + badgeRightRect.height / 2 - svgRect.top) / scaleY;

  // Safeguard against Infinity values
  if (!isFinite(leftBadgeRightX) || !isFinite(leftBadgeCenterY) || 
      !isFinite(rightBadgeLeftX) || !isFinite(rightBadgeCenterY)) {
    return;
  }

  // Define connector points (coming from center, approaching badge centers)
  // Left connector: from diagonal down below intro, up to horizontal, to badge right edge
  // We'll aim the diagonal to end somewhere near the center, below the intro.
  const leftConnectorStartX = leftBadgeRightX - 180;
  const leftConnectorStartY = leftBadgeCenterY;
  const leftConnectorEndX = leftBadgeRightX;
  const leftConnectorEndY = leftBadgeCenterY;
  const leftDiagonalStartX = leftConnectorStartX + 120;
  const leftDiagonalStartY = leftConnectorStartY + 140;

  // Right connector: from right side of container, curving to badge left edge
  const rightConnectorStartX = rightBadgeLeftX + 180;
  const rightConnectorStartY = rightBadgeCenterY;
  const rightConnectorEndX = rightBadgeLeftX;
  const rightConnectorEndY = rightBadgeCenterY;
  const rightDiagonalStartX = rightConnectorStartX - 120;
  const rightDiagonalStartY = rightConnectorStartY + 140;

  // Update paths with straight line and diagonal
  const leftPath = `M ${leftDiagonalStartX} ${leftDiagonalStartY} L ${leftConnectorStartX} ${leftConnectorStartY} L ${leftConnectorEndX} ${leftConnectorEndY}`;
  const rightPath = `M ${rightDiagonalStartX} ${rightDiagonalStartY} L ${rightConnectorStartX} ${rightConnectorStartY} L ${rightConnectorEndX} ${rightConnectorEndY}`;

  connectorLeft.setAttribute('d', leftPath);
  connectorRight.setAttribute('d', rightPath);

  // Update endpoint circles to sit exactly at badge connection points
  endpointLeft.setAttribute('cx', leftBadgeRightX);
  endpointLeft.setAttribute('cy', leftBadgeCenterY);

  endpointRight.setAttribute('cx', rightBadgeLeftX);
  endpointRight.setAttribute('cy', rightBadgeCenterY);
}

export function destroyConnectors() {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', updateConnectorPaths);
}
