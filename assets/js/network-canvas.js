/**
 * DIGISYNQ — Abstract Monochrome Coordination Engine
 * Visualizes verified entertainment production routes, dependencies, and capacity pathways.
 * Respects prefers-reduced-motion. Pure monochrome (#000000, #FFFFFF, hairline grays).
 */

(function () {
  'use strict';

  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isTabActive = true;

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Coordination Nodes
  const NODE_LABELS = ['CREW', 'STAGES', 'GEAR', 'POST', 'CAPITAL', 'DISTRIBUTION', 'IP', 'AUDIENCE'];
  let nodes = [];
  let routes = [];
  let packets = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.parentElement.offsetHeight || 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    initNetwork();
  }

  function initNetwork() {
    nodes = [];
    routes = [];
    packets = [];

    const isMobile = width < 768;
    const count = isMobile ? 6 : 8;

    // Distribute nodes across structured production zones
    for (let i = 0; i < count; i++) {
      const col = i % (isMobile ? 2 : 4);
      const row = Math.floor(i / (isMobile ? 2 : 4));

      const marginX = width * 0.1;
      const marginY = height * 0.18;
      const spanX = (width - marginX * 2) / (isMobile ? 1 : 3);
      const spanY = (height - marginY * 2) / (isMobile ? 2 : 1);

      const x = marginX + col * spanX + (Math.random() - 0.5) * (spanX * 0.35);
      const y = marginY + row * spanY + (Math.random() - 0.5) * (spanY * 0.3);

      nodes.push({
        id: i,
        x: x,
        y: y,
        label: NODE_LABELS[i % NODE_LABELS.length],
        status: i % 2 === 0 ? 'VERIFIED' : 'ACTIVE',
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Connect nodes into dependency pathways
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < (isMobile ? 240 : 380)) {
          routes.push({
            from: nodes[i],
            to: nodes[j],
            dist: dist
          });

          // Spawn coordination packets along route
          packets.push({
            from: nodes[i],
            to: nodes[j],
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.003
          });
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Subtle technical grid
    const gridSize = 48;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw dependency routes (hairline)
    ctx.lineWidth = 1;
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(r.from.x, r.from.y);
      ctx.lineTo(r.to.x, r.to.y);
      ctx.stroke();
    }

    // Draw moving coordination packets
    if (!prefersReducedMotion) {
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
        }

        const currX = p.from.x + (p.to.x - p.from.x) * p.progress;
        const currY = p.from.y + (p.to.y - p.from.y) * p.progress;

        // Draw small monochrome packet square (tactile data block)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(currX - 2, currY - 2, 4, 4);
      }
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.pulse += 0.02;

      // Outer ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Core point
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Technical label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(n.label, n.x + 10, n.y + 3);
    }

    if (!prefersReducedMotion && isTabActive) {
      animationFrameId = requestAnimationFrame(draw);
    }
  }

  window.addEventListener('resize', () => {
    resize();
    if (prefersReducedMotion) draw();
  });

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive && !prefersReducedMotion) {
      cancelAnimationFrame(animationFrameId);
      draw();
    }
  });

  resize();
  draw();
})();
