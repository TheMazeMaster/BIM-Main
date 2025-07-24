// === MAIN.JS: BIM MASTERWHEEL RENDER ENGINE ===

import { wheelConfig } from './config.js';
import { wheelData } from './wheelData.js';

const svg = document.getElementById('dim-wheel');
// Rotation index for global divisions; modified via the UI
// Start a quarter-turn offset so that T4 centers align correctly on load
let currentRotation = wheelConfig.globalDivisionCount / 4;
// Currently selected overlay index for info panel
let selectedIndex = 0;
// Sequential ID generator for arc paths used by arc text
let arcPathCounter = 0;

const t3Labels = wheelData.T3;
const t4Labels = wheelData.T4;
const t3Boundaries = (() => {
  const weights = wheelConfig.tiers[3].divisionWeights;
  let sum = 0;
  return weights.map(w => (sum += w));
})();

// === VIEWPORT / ZOOM ===
let isZoomed = false;
const viewport = document.querySelector('.wheel-viewport');

// Fixed transform presets for each state
const TRANSFORM_ORIGIN = '50% 50%';
const NORMAL_SCALE = 1.4;
const NORMAL_OFFSET_X = -142;
const NORMAL_OFFSET_Y = -145;
const ZOOM_SCALE = 1.8;
const ZOOM_OFFSET_X = -275;
const ZOOM_OFFSET_Y = -210;

function updateViewport() {
  if (!viewport) return;
  viewport.classList.toggle('zoomed', isZoomed);

  const infoPanel = document.getElementById('info-panel');
  if (infoPanel) {
    infoPanel.style.display = isZoomed ? 'block' : 'none';
  }

  const scale = isZoomed ? ZOOM_SCALE : NORMAL_SCALE;
  const offsetX = isZoomed ? ZOOM_OFFSET_X : NORMAL_OFFSET_X;
  const offsetY = isZoomed ? ZOOM_OFFSET_Y : NORMAL_OFFSET_Y;

  // Apply scaling before translation so zoom occurs about the center
  svg.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
}

function updateInfoPanel(index) {
  const panel = document.getElementById('info-panel');
  const data = wheelData.overlayContent?.[index];
  if (!panel || !data) return;

  const t4Index = Math.floor(index / 4);
  const t3Index = t3Boundaries.findIndex(b => index < b);
  const locationLine =
    `<div class="info-location">Current = ${t3Labels[t3Index]} → ` +
    `${t4Labels[t4Index]}, ${data[15]} (ID: ${data[0]})</div>`;

  const sections = [
    {
      title: 'Grounding: Naming the Pattern',
      items: [
        ['Description', data[1]],
        ['Academic Framing', data[2]],
        ['Philosophical Angle', data[3]],
        ['Alternate Phrasings', data[5]]
      ]
    },
    {
      title: 'Trigger & Activation: What Sparks It',
      items: [
        ['Internal Trigger Phrase', data[4]],
        ['Behaviour Function', data[6]],
        ['Goal / Purpose', data[7]],
        ['Push Vector', data[8]],
        ['Motion Feel', data[9]]
      ]
    },
    {
      title: 'Embodied Impact: How It Moves Through',
      items: [
        ['Somatic Pattern', data[10]],
        ['Feltframe', data[11]],
        ['Narrative Rhythm', data[12]],
        ['Archetypes', data[13]],
        ['Simulation Tag', data[14]],
        ['Intensity Range', data[16]]
      ]
    },
    {
      title: 'Expression',
      items: [
        ['Behaviour', data[17]],
        ['Tone', data[18]],
        ['Expression Quote', data[19]],
        ['Emotion', data[20]]
      ]
    },
    {
      title: 'Alignment & Edge: How it lands, how it breaks, and how it grows',
      items: [
        ['Typical Reaction', data[21]],
        ['Behavioural Opposite', data[22]],
        ['Thrive Counter-Quote', data[23]],
        ['Wisdom', data[24]]
      ]
    }
  ];

  panel.innerHTML =
    locationLine +
    sections
      .map(sec =>
        `<div class="info-section"><h4>${sec.title}</h4>` +
        sec.items
          .map(([label, val]) => `<div><strong>${label}:</strong> ${val}</div>`)
          .join('') +
        '</div>'
      )
      .join('');
}

// === RENDER ENTRY POINT ===
function renderWheel() {
  arcPathCounter = 0;
  svg.innerHTML = ''; // Clear canvas
  const centerX = wheelConfig.centerX;
  const centerY = wheelConfig.centerY;

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.appendChild(defs);

  for (let i = 0; i < wheelConfig.tiers.length; i++) {
    const tier = wheelConfig.tiers[i];
    if (tier.labelListSource) {
      tier.labelList = wheelData[tier.labelListSource];
    }
    drawTier(svg, tier, i, centerX, centerY, currentRotation, defs);
  }

  // Draw any global overlays after tiers
  if (Array.isArray(wheelConfig.overlays)) {
    drawOverlays(svg, wheelConfig.overlays, centerX, centerY, defs, currentRotation);
  }

  // Debug guides for radial divisions
  if (wheelConfig.renderOptions?.debugGuides) {
    drawDebugGuides(svg, centerX, centerY, currentRotation);
  }

  // Draw tier boundary outlines last so they appear on top if enabled
  if (wheelConfig.renderOptions?.debugRenderOutlines) {
    drawBoundaries(svg, wheelConfig.tiers, centerX, centerY);
  }

  updateViewport();
}

// === BUTTON SETUP FUNCTIONS ===
function setupRotationButtons() {
  document.querySelectorAll('[data-rotate]').forEach(btn => {
    const value = parseInt(btn.getAttribute('data-rotate'), 10);
    if (!isNaN(value)) {
      btn.addEventListener('click', () => {
        currentRotation = (currentRotation + value + wheelConfig.globalDivisionCount) % wheelConfig.globalDivisionCount;
        // Adjust the selected index opposite to the rotation direction
        selectedIndex =
          (selectedIndex - value + wheelConfig.globalDivisionCount) %
          wheelConfig.globalDivisionCount;
        renderWheel();
        updateInfoPanel(selectedIndex);
      });
    }
  });
}

// === T6 DATASET SWITCHING ===
function setupT6Buttons() {
  const buttons = document.querySelectorAll('[data-t6]');
  buttons.forEach(button => {
    const source = button.getAttribute('data-t6');
    if (source) {
      button.addEventListener('click', () => {
        wheelConfig.tiers[6].labelListSource = source;
        renderWheel();
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    }
  });

  const defaultBtn = document.querySelector('[data-t6="behavior"]');
  if (defaultBtn) {
    defaultBtn.classList.add('active');
  }
}

// === ZOOM CONTROL ===
function setupZoomButton() {
  const btn = document.getElementById('zoom-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    isZoomed = !isZoomed;
    updateViewport();
  });
}

// === DRAWING HELPERS ===
function drawTier(svg, tierConfig, tierIndex, cx, cy, rotationOffset, defs) {
  // 1) Respect the 'visible' flag (instead of the old 'show')
  if (!tierConfig.visible) return;

  // 2) Figure out which label style to use
  const styleType = tierConfig.labelStyle?.type || 'radial';

  // 3a) Centered text (T0)
  if (styleType === 'centered') {
    drawCircle(svg, tierConfig, cx, cy);
    drawCenteredText(svg, tierConfig, cx+5, cy); //cx+5 changes "flow" postion
  }
  // 3b) Arc text (T1 & T2)
  else if (styleType === 'arcText') {
    drawRing(svg, tierConfig, cx, cy);
    drawArcText(svg, tierConfig, cx+2, cy); // edit cx+# to edit T1 position
  }
  // 3c) Radial slices (T3–T6)
  else {
    drawRadialTier(svg, tierConfig, tierIndex, cx, cy, rotationOffset, defs);
  }
}


function drawCenteredText(svg, config, cx, cy) {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', cx);
  text.setAttribute('y', cy);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('alignment-baseline', 'middle');
  text.setAttribute('font-size', config.labelStyle.fontSize || 16);
  text.setAttribute('font-weight', config.labelStyle.fontWeight || 'normal');
  text.setAttribute('fill', config.labelStyle.color || '#000');
  text.setAttribute('transform', `rotate(-90, ${cx}, ${cy})`);
  text.textContent = config.label;
  svg.appendChild(text);
}

function drawArcText(svg, config, cx, cy) {
  const radius = (config.outerRadius + config.innerRadius) / 2 + (config.radiusOffset || 0);
  const pathId = `arcPath-${arcPathCounter++}`;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const startAngle = 0;
  // Use an end angle slightly less than 360° so the arc has a non-zero length
  // when start and end points coincide.
  const endAngle = startAngle + 359.9;
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArc, 0, end.x, end.y
  ].join(' ');

  path.setAttribute('id', pathId);
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');

  const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
  textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);
  textPath.setAttribute('startOffset', '50%');
  textPath.setAttribute('text-anchor', 'middle');
  textPath.setAttribute('font-size', config.labelStyle.fontSize || 16);
  textPath.setAttribute('font-weight', config.labelStyle.fontWeight || 'normal');
  textPath.setAttribute('fill', config.labelStyle.color || '#000');
  textPath.textContent = config.label;

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.appendChild(textPath);
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('transform', `rotate(-90, ${cx}, ${cy})`);
  group.appendChild(path);
  group.appendChild(text);
  svg.appendChild(group);
}

function drawCircle(svg, config, cx, cy) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', config.outerRadius);
  const fill = config.fill?.startColor || '#fff';
  circle.setAttribute('fill', fill);
  if (config.stroke?.show) {
    circle.setAttribute('stroke', config.stroke.color || '#000');
    circle.setAttribute('stroke-width', config.stroke.width || 0.25);
  } else {
    circle.setAttribute('stroke', 'none');
  }
  svg.appendChild(circle);
}

function drawRing(svg, config, cx, cy) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ringPath(cx, cy, config.innerRadius, config.outerRadius));
  const fill = config.fill?.startColor || '#fff';
  path.setAttribute('fill', fill);
  // Stroke lines are drawn separately by drawBoundaries; avoid radial seams here
  path.setAttribute('stroke', 'none');
  svg.appendChild(path);
}

function drawRadialTier(svg, config, tierIndex, cx, cy, rotationOffset, defs) {
  const count = config.divisionWeights.length;
  const full = wheelConfig.globalDivisionCount;
  const gradientRadius = wheelConfig.tiers.at(-1).outerRadius;
  let currentAngle = (rotationOffset * 360) / full;

  const labelNodes = [];

  for (let i = 0; i < count; i++) {
    const weight = config.divisionWeights[i];
    const angle = (weight / full) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const inner = config.innerRadius;
    const outer = config.outerRadius;

    const p1 = polarToCartesian(cx, cy, outer, startAngle);
    const p2 = polarToCartesian(cx, cy, outer, endAngle);
    const p3 = polarToCartesian(cx, cy, inner, endAngle);
    const p4 = polarToCartesian(cx, cy, inner, startAngle);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const d = [
      'M', p1.x, p1.y,
      'A', outer, outer, 0, largeArc, 1, p2.x, p2.y,
      'L', p3.x, p3.y,
      'A', inner, inner, 0, largeArc, 0, p4.x, p4.y,
      'L', p1.x, p1.y,
      'Z'
    ].join(' ');

    path.setAttribute('d', d);

    let segmentFill = '#ccc';
    if (config.fill?.mode === 'solid') {
      segmentFill = config.fill.startColor || '#fff';
    } else if (config.fill?.mode === 'manual') {
      segmentFill = config.fill.colorList?.[i] || segmentFill;
    } else if (config.fill?.mode === 'gradient-manual') {
      const pair = config.fill.gradientPairs?.[i];
      if (pair && defs) {
        const gradId = `grad-${tierIndex}-${i}`;
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', gradId);
        const startPt = polarToCartesian(cx, cy, gradientRadius, startAngle);
        const endPt = polarToCartesian(cx, cy, gradientRadius, endAngle);
        grad.setAttribute('gradientUnits', 'userSpaceOnUse');
        grad.setAttribute('x1', startPt.x);
        grad.setAttribute('y1', startPt.y);
        grad.setAttribute('x2', endPt.x);
        grad.setAttribute('y2', endPt.y);
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', pair[0]);
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', pair[1]);
        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);
        segmentFill = `url(#${gradId})`;
      }
    } else if (config.fill?.mode === 'inherit' && tierIndex > 0) {
      let srcIndex = tierIndex - 1;
      let srcTier = wheelConfig.tiers[srcIndex];
      while (srcTier && srcTier.fill?.mode === 'inherit' && srcIndex > 0) {
        srcIndex -= 1;
        srcTier = wheelConfig.tiers[srcIndex];
      }
      let srcPair;
      if (Array.isArray(srcTier.fill?.gradientPairs)) {
        const segsPerPair = wheelConfig.globalDivisionCount /
          srcTier.fill.gradientPairs.length;
        const pairIndex = Math.floor(i / segsPerPair);
        srcPair = srcTier.fill.gradientPairs[pairIndex];
      }
      if (srcPair && defs) {
        const gradId = `grad-${tierIndex}-${i}`;
        const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        grad.setAttribute('id', gradId);
        const startPt = polarToCartesian(cx, cy, gradientRadius, startAngle);
        const endPt = polarToCartesian(cx, cy, gradientRadius, endAngle);
        grad.setAttribute('gradientUnits', 'userSpaceOnUse');
        grad.setAttribute('x1', startPt.x);
        grad.setAttribute('y1', startPt.y);
        grad.setAttribute('x2', endPt.x);
        grad.setAttribute('y2', endPt.y);
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', srcPair[0]);
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', srcPair[1]);
        grad.appendChild(stop1);
        grad.appendChild(stop2);
        defs.appendChild(grad);
        segmentFill = `url(#${gradId})`;
      } else if (srcTier.fill?.colorList) {
        const segsPerColor = wheelConfig.globalDivisionCount /
          srcTier.fill.colorList.length;
        const colorIndex = Math.floor(i / segsPerColor);
        segmentFill = srcTier.fill.colorList[colorIndex] || segmentFill;
      }
    } else if (config.fill?.colors?.[i]) {
      segmentFill = config.fill.colors[i];
    }
    path.setAttribute('fill', segmentFill);
    // Cell boundaries are now drawn via overlays, not per-path strokes
    path.setAttribute('stroke', 'none');

    svg.appendChild(path);

    // Optional label (centered along arc)
    if (config.labelList) {
      const midAngle = (startAngle + endAngle) / 2;
      const offset = config.labelStyle.offset || 0;
      let r;
      if (config.labelStyle.anchor === 'start') {
        r = inner + 5;
      } else if (config.labelStyle.anchor === 'end') {
        r = outer - offset;
      } else {
        r = (inner + outer) / 2 + offset;
      }
      const labelPos = polarToCartesian(cx, cy, r, midAngle);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelPos.x);
      text.setAttribute('y', labelPos.y);
      text.setAttribute('font-size', config.labelStyle.fontSize || 12);
      text.setAttribute('font-weight', config.labelStyle.fontWeight || 'normal');
      text.setAttribute('fill', config.labelStyle.color || '#000');
      text.setAttribute('text-anchor', config.labelStyle.anchor || 'middle');
      text.setAttribute('dominant-baseline', config.labelStyle.verticalAlign || 'middle');
      text.setAttribute('transform', `rotate(${midAngle -90}, ${labelPos.x}, ${labelPos.y})`);
      text.textContent = config.labelList[i] || '';
      labelNodes.push(text);
    }
  }

  // Apply optional overlay effect across the entire tier
  let overlayPath;
  if (config.overlay && config.overlay.visible !== false) {
    overlayPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    overlayPath.setAttribute('d', ringPath(cx, cy, config.innerRadius, config.outerRadius));
    overlayPath.setAttribute('fill', config.overlay.color || (config.overlay.mode === 'shade' ? '#000' : '#fff'));
    overlayPath.setAttribute('fill-opacity', config.overlay.strength ?? 0.25);
    overlayPath.setAttribute('pointer-events', 'none');

    if (config.overlay.mode === 'shade') {
      overlayPath.style.mixBlendMode = 'multiply';
    } else if (config.overlay.mode === 'tint') {
      overlayPath.style.mixBlendMode = 'screen';
    }
  }

  if (overlayPath) {
    svg.appendChild(overlayPath);
  }

  labelNodes.forEach(node => svg.appendChild(node));
}

// === OVERLAY LOGIC ===
function drawOverlays(svg, overlays, cx, cy, defs, rotationOffset = 0) {
  overlays.forEach((ov, idx) => {
    if (ov.visible === false) return;
    if (ov.type === 'radialGradient') {
      const gradId = `ov-grad-${idx}`;
      const grad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      grad.setAttribute('id', gradId);
      grad.setAttribute('cx', cx);
      grad.setAttribute('cy', cy);
      grad.setAttribute('r', ov.radiusRange[1]);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');

      const startOffset = (ov.radiusRange[0] / ov.radiusRange[1]) * 100;

      const stop0 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop0.setAttribute('offset', '0%');
      stop0.setAttribute('stop-color', ov.from);

      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', `${startOffset}%`);
      stop1.setAttribute('stop-color', ov.from);

      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', ov.to);

      grad.appendChild(stop0);
      grad.appendChild(stop1);
      grad.appendChild(stop2);
      defs.appendChild(grad);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', ringPath(cx, cy, ov.radiusRange[0], ov.radiusRange[1]));
      path.setAttribute('fill', `url(#${gradId})`);
      path.setAttribute('pointer-events', 'none');
      svg.appendChild(path);
    }
    else if (ov.type === 'ringOutline') {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', ov.radius);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('pointer-events', 'none');

      const strokeWidth = ov.width ?? (wheelConfig.renderOptions?.strokeDefaults?.wide || 1);

      circle.setAttribute('stroke', ov.color || '#000');
      circle.setAttribute('stroke-width', strokeWidth);

      svg.appendChild(circle);
    }
    else if (ov.type === 'radialLines') {
      const outer = ov.radius ?? Math.max(...wheelConfig.tiers.map(t => t.outerRadius));
      const inner = ov.innerRadius || 0;
      const strokeWidth = ov.width ?? (wheelConfig.renderOptions?.strokeDefaults?.wide || 1);
      const rotationAngle = (rotationOffset * 360) / wheelConfig.globalDivisionCount;

      (ov.angles || []).forEach(angle => {
        const rotated = angle + rotationAngle;
        const start = polarToCartesian(cx, cy, inner, rotated);
        const end = polarToCartesian(cx, cy, outer, rotated);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', start.x);
        line.setAttribute('y1', start.y);
        line.setAttribute('x2', end.x);
        line.setAttribute('y2', end.y);
        line.setAttribute('stroke', ov.color || '#000');
        line.setAttribute('stroke-width', strokeWidth);
        line.setAttribute('pointer-events', 'none');
        svg.appendChild(line);
      });
    }
  });
}

function drawBoundaries(svg, tiers, cx, cy) {
  tiers.forEach(tier => {
    if (!tier.visible || !tier.stroke?.show) return;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', tier.outerRadius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('pointer-events', 'none');

    const strokeColor = tier.stroke.color || '#000';
    const strokeWidth = tier.stroke.width ?? tier.stroke.normal ??
      (wheelConfig.renderOptions?.strokeDefaults?.normal || 0.25);

    circle.setAttribute('stroke', strokeColor);
    circle.setAttribute('stroke-width', strokeWidth);

    svg.appendChild(circle);
  });
}

function drawDebugGuides(svg, cx, cy, rotationOffset = 0) {
  const outer = Math.max(...wheelConfig.tiers.map(t => t.outerRadius));
  const rotationAngle = (rotationOffset * 360) / wheelConfig.globalDivisionCount;

  for (let i = 0; i < wheelConfig.globalDivisionCount; i++) {
    const angle = (i / wheelConfig.globalDivisionCount) * 360 + rotationAngle;
    const start = polarToCartesian(cx, cy, 0, angle);
    const end = polarToCartesian(cx, cy, outer, angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', start.x);
    line.setAttribute('y1', start.y);
    line.setAttribute('x2', end.x);
    line.setAttribute('y2', end.y);
    line.setAttribute('stroke', '#888');
    line.setAttribute('stroke-width', wheelConfig.renderOptions?.strokeDefaults?.normal || 0.25);
    line.setAttribute('pointer-events', 'none');
    svg.appendChild(line);
  }
}

function ringPath(cx, cy, inner, outer) {
  const startAngle = 0;
  const endAngle = 359.9;
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const p1 = polarToCartesian(cx, cy, outer, startAngle);
  const p2 = polarToCartesian(cx, cy, outer, endAngle);
  const p3 = polarToCartesian(cx, cy, inner, endAngle);
  const p4 = polarToCartesian(cx, cy, inner, startAngle);
  return [
    'M', p1.x, p1.y,
    'A', outer, outer, 0, largeArc, 1, p2.x, p2.y,
    'L', p3.x, p3.y,
    'A', inner, inner, 0, largeArc, 0, p4.x, p4.y,
    'Z'
  ].join(' ');
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

// === INIT ===
setupRotationButtons();
setupT6Buttons();
setupZoomButton();
renderWheel();
updateInfoPanel(selectedIndex);
