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
  const scaleX = viewBoxWidth / svgRect.width;
  const scaleY = viewBoxHeight / svgRect.height;

  // Safeguard against zero or NaN scale
  if (!scaleX || !scaleY || !isFinite(scaleX) || !isFinite(scaleY)) {
    return;
  }

  // LEFT BADGE: Connect from inner RIGHT edge (the side facing center)
  // The node should be exactly at the badge's inner edge, centered vertically
  const leftBadgeInnerX = badgeLeftRect.right - svgRect.left;
  const leftBadgeCenterY = badgeLeftRect.top + badgeLeftRect.height / 2 - svgRect.top;
  
  // Convert to SVG coordinates
  const leftBadgeNodeX = leftBadgeInnerX * scaleX;
  const leftBadgeNodeY = leftBadgeCenterY * scaleY;

  // RIGHT BADGE: Connect from inner LEFT edge (the side facing center)
  const rightBadgeInnerX = badgeRightRect.left - svgRect.left;
  const rightBadgeCenterY = badgeRightRect.top + badgeRightRect.height / 2 - svgRect.top;
  
  // Convert to SVG coordinates
  const rightBadgeNodeX = rightBadgeInnerX * scaleX;
  const rightBadgeNodeY = rightBadgeCenterY * scaleY;

  // Calculate diagonal start points (coming from below, angling up toward badges)
  // The diagonal should start below the badge level and angle up to meet the horizontal segment
  const diagonalOffsetY = 140 * scaleY; // Vertical offset for diagonal start
  const horizontalSegmentLength = 150 * scaleX; // Length of horizontal segment
  
  // Left connector: diagonal starts lower and to the left, angles up-right to horizontal, then straight to badge
  const leftDiagonalStartX = leftBadgeNodeX - horizontalSegmentLength;
  const leftDiagonalStartY = leftBadgeNodeY + diagonalOffsetY;
  const leftHorizontalStartX = leftBadgeNodeX - horizontalSegmentLength;
  const leftHorizontalStartY = leftBadgeNodeY;
  
  // Right connector: diagonal starts lower and to the right, angles up-left to horizontal, then straight to badge
  const rightDiagonalStartX = rightBadgeNodeX + horizontalSegmentLength;
  const rightDiagonalStartY = rightBadgeNodeY + diagonalOffsetY;
  const rightHorizontalStartX = rightBadgeNodeX + horizontalSegmentLength;
  const rightHorizontalStartY = rightBadgeNodeY;

  // Update paths: diagonal segment -> horizontal segment -> badge connection
  const leftPath = `M ${leftDiagonalStartX} ${leftDiagonalStartY} L ${leftHorizontalStartX} ${leftHorizontalStartY} L ${leftBadgeNodeX} ${leftBadgeNodeY}`;
  const rightPath = `M ${rightDiagonalStartX} ${rightDiagonalStartY} L ${rightHorizontalStartX} ${rightHorizontalStartY} L ${rightBadgeNodeX} ${rightBadgeNodeY}`;

  connectorLeft.setAttribute('d', leftPath);
  connectorRight.setAttribute('d', rightPath);

  // Update endpoint circles to sit exactly at badge connection points
  endpointLeft.setAttribute('cx', leftBadgeNodeX);
  endpointLeft.setAttribute('cy', leftBadgeNodeY);

  endpointRight.setAttribute('cx', rightBadgeNodeX);
  endpointRight.setAttribute('cy', rightBadgeNodeY);
}

export function destroyConnectors() {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', updateConnectorPaths);
}
