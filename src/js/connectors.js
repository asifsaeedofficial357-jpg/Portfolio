/**
 * DYNAMIC CONNECTOR LINES — Precise badge-edge geometry
 * DevByAsif®
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

  const paths = connectorSvg.querySelectorAll('.connector-line');
  const endpoints = connectorSvg.querySelectorAll('.connector-endpoint');
  connectorLeft = paths[0];
  connectorRight = paths[1];
  endpointLeft = endpoints[0];
  endpointRight = endpoints[1];
  if (!connectorLeft || !connectorRight || !endpointLeft || !endpointRight) return;

  updateConnectorPaths();

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(updateConnectorPaths);
    const hero = document.querySelector('.hero');
    if (hero) resizeObserver.observe(hero);
  }
  window.addEventListener('resize', updateConnectorPaths, { passive: true });
}

function updateConnectorPaths() {
  if (!connectorSvg || !connectorLeft || !connectorRight) return;
  const badgeLeft = document.querySelector('.badge-left');
  const badgeRight = document.querySelector('.badge-right');
  if (!badgeLeft || !badgeRight) return;

  const svgRect = connectorSvg.getBoundingClientRect();
  const leftRect = badgeLeft.getBoundingClientRect();
  const rightRect = badgeRight.getBoundingClientRect();
  if (!svgRect.width || !svgRect.height || !leftRect.width || !rightRect.width) return;

  const viewBox = (connectorSvg.getAttribute('viewBox') || '0 0 1440 900').split(/\s+/).map(Number);
  const [viewX, viewY, viewW, viewH] = viewBox;
  const scaleX = viewW / svgRect.width;
  const scaleY = viewH / svgRect.height;
  const toX = x => (x - svgRect.left) * scaleX + viewX;
  const toY = y => (y - svgRect.top) * scaleY + viewY;

  // Endpoint is exactly on each badge's inner edge. The visible line starts there.
  const leftX = toX(leftRect.right);
  const leftY = toY(leftRect.top + leftRect.height / 2);
  const rightX = toX(rightRect.left);
  const rightY = toY(rightRect.top + rightRect.height / 2);

  // Mirrored: short horizontal run from the badge, then a restrained diagonal inward/down.
  const horizontal = Math.min(150, viewW * 0.105);
  const diagonalDrop = Math.min(140, viewH * 0.16);
  const leftInnerX = leftX + horizontal;
  const rightInnerX = rightX - horizontal;
  const leftPath = `M ${leftX} ${leftY} L ${leftInnerX} ${leftY} L ${leftInnerX + horizontal * 0.72} ${leftY + diagonalDrop}`;
  const rightPath = `M ${rightX} ${rightY} L ${rightInnerX} ${rightY} L ${rightInnerX - horizontal * 0.72} ${rightY + diagonalDrop}`;

  connectorLeft.setAttribute('d', leftPath);
  connectorRight.setAttribute('d', rightPath);
  endpointLeft.setAttribute('cx', leftX);
  endpointLeft.setAttribute('cy', leftY);
  endpointRight.setAttribute('cx', rightX);
  endpointRight.setAttribute('cy', rightY);
}

export function destroyConnectors() {
  if (resizeObserver) resizeObserver.disconnect();
  window.removeEventListener('resize', updateConnectorPaths);
  resizeObserver = null;
}
