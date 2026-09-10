/**
 * DIGISYNQ — Canonical Node Network Coordination Canvas
 * Visualizes the 10 core entertainment ecosystem nodes:
 * 01 PEOPLE, 02 IDEAS & IP, 03 PRODUCTION, 04 PLACES, 05 ASSETS,
 * 06 TECHNOLOGY, 07 CAPITAL, 08 DISTRIBUTION, 09 AUDIENCE, 10 SIGNALS.
 *
 * Simulates dynamic pathway formation, active coordination bursts,
 * packet transmission, and real-time ecosystem synchronization.
 * Pure monochrome & hairline styling with subtle institutional accents.
 * Respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isTabActive = true;
  let mouse = { x: -1000, y: -1000, activeNode: null };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Canonical 10 DigiSynq Nodes
  const CANONICAL_NODES = [
    { id: '01', label: '01 PEOPLE', desc: 'Talent, Guilds, HoDs, Artisans', type: 'human' },
    { id: '02', label: '02 IDEAS & IP', desc: 'Rights, Formats, Catalogues', type: 'ip' },
    { id: '03', label: '03 PRODUCTION', desc: 'Active Slates, Workflows', type: 'execution' },
    { id: '04', label: '04 PLACES', desc: 'Soundstages, Studios, Locations', type: 'facility' },
    { id: '05', label: '05 ASSETS', desc: 'Optics, Cameras, Gear Packages', type: 'hardware' },
    { id: '06', label: '06 TECHNOLOGY', desc: 'Virtual Prod, Post, AI, Tools', type: 'tech' },
    { id: '07', label: '07 CAPITAL', desc: 'Incentives, Escrow, Liquidity', type: 'capital' },
    { id: '08', label: '08 DISTRIBUTION', desc: 'Theatrical, FAST, OTT, Global', type: 'market' },
    { id: '09', label: '09 AUDIENCE', desc: 'Demand, Behaviour, Communities', type: 'audience' },
    { id: '10', label: '10 SIGNALS', desc: 'Latency, Availability, Telemetry', type: 'telemetry' }
  ];

  let nodes = [];
  let routes = [];
  let packets = [];
  let synqClusters = [];
  let clusterTimer = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.parentElement.offsetHeight || 520;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
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
    const count = isMobile ? 8 : 10;

    // Structured elliptical/grid layout with organic organic drift
    for (let i = 0; i < count; i++) {
      const data = CANONICAL_NODES[i];
      let x, y;

      if (isMobile) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const marginX = width * 0.12;
        const marginY = height * 0.15;
        const spanX = (width - marginX * 2);
        const spanY = (height - marginY * 2) / 3;
        x = marginX + col * spanX + (Math.sin(i * 1.5) * 15);
        y = marginY + row * spanY + (Math.cos(i * 2.1) * 12);
      } else {
        // Broad dual-tier orchestration field
        const angle = (i / count) * Math.PI * 2;
        const radiusX = width * 0.38;
        const radiusY = height * 0.32;
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        // Structured node positions with purposeful hierarchy
        x = centerX + Math.cos(angle) * radiusX + (Math.sin(i * 3.3) * (width * 0.04));
        y = centerY + Math.sin(angle) * radiusY + (Math.cos(i * 2.5) * (height * 0.05));
      }

      nodes.push({
        id: data.id,
        label: data.label,
        desc: data.desc,
        type: data.type,
        baseX: x,
        baseY: y,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        pulse: Math.random() * Math.PI * 2,
        isCoordinated: false,
        highlightTime: 0
      });
    }

    // Generate base routes
    buildRoutes();
  }

  function buildRoutes() {
    routes = [];
    packets = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = width < 768 ? 260 : 390;

        if (dist < maxDist) {
          const route = {
            from: nodes[i],
            to: nodes[j],
            dist: dist,
            active: Math.random() > 0.35,
            strength: 0.15 + Math.random() * 0.35,
            flowRate: 0.002 + Math.random() * 0.003
          };
          routes.push(route);

          if (route.active) {
            packets.push({
              route: route,
              progress: Math.random(),
              speed: route.flowRate,
              size: 2.5 + Math.random() * 1.5,
              forward: Math.random() > 0.5
            });
          }
        }
      }
    }
  }

  function triggerCoordinatedCluster() {
    // Pick 3-4 connected nodes representing an active Synq Mission
    const count = 3 + Math.floor(Math.random() * 2);
    const startIdx = Math.floor(Math.random() * nodes.length);
    const cluster = [nodes[startIdx]];

    // Find nearest neighbor nodes to form an active pathway
    for (let k = 0; k < nodes.length && cluster.length < count; k++) {
      if (!cluster.includes(nodes[k])) {
        cluster.push(nodes[k]);
      }
    }

    cluster.forEach(n => {
      n.isCoordinated = true;
      n.highlightTime = 180; // frames
    });

    // Spawn high-priority transmission packets along this active cluster
    for (let a = 0; a < cluster.length - 1; a++) {
      packets.push({
        route: { from: cluster[a], to: cluster[a + 1] },
        progress: 0,
        speed: 0.012,
        size: 4,
        forward: true,
        priority: true
      });
    }
  }

  function update() {
    if (prefersReducedMotion) return;

    clusterTimer++;
    if (clusterTimer > 240) { // Every ~4 seconds
      triggerCoordinatedCluster();
      clusterTimer = 0;
    }

    // Subtle drift within boundaries
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.pulse += 0.03;

      n.x += n.vx;
      n.y += n.vy;

      if (Math.abs(n.x - n.baseX) > 24) n.vx *= -1;
      if (Math.abs(n.y - n.baseY) > 20) n.vy *= -1;

      if (n.highlightTime > 0) {
        n.highlightTime--;
        if (n.highlightTime <= 0) n.isCoordinated = false;
      }
    }

    // Update packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;
      if (p.progress > 1) {
        if (p.priority) {
          packets.splice(i, 1);
        } else {
          p.progress = 0;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Subtle technical background grid
    const gridSize = 40;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
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

    // Draw Routes
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      const isHovered = mouse.activeNode && (r.from === mouse.activeNode || r.to === mouse.activeNode);
      const isClustered = r.from.isCoordinated && r.to.isCoordinated;

      if (isHovered) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.75;
      } else if (isClustered) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.25;
      } else {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * r.strength})`;
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(r.from.x, r.from.y);
      ctx.lineTo(r.to.x, r.to.y);
      ctx.stroke();
    }

    // Draw Packets (Moving coordination data)
    for (let i = 0; i < packets.length; i++) {
      const p = packets[i];
      const from = p.forward ? p.route.from : p.route.to;
      const to = p.forward ? p.route.to : p.route.from;

      const px = from.x + (to.x - from.x) * p.progress;
      const py = from.y + (to.y - from.y) * p.progress;

      if (p.priority) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
      }
    }

    // Draw Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const isHovered = (mouse.activeNode === n);
      const isClustered = n.isCoordinated;

      // Outer ripple / coordination indicator
      if (isClustered || isHovered) {
        ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const pulseR = 12 + Math.sin(n.pulse) * 4;
        ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Outer ring
      ctx.strokeStyle = isHovered ? '#FFFFFF' : (isClustered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)');
      ctx.lineWidth = isHovered ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Core point
      ctx.fillStyle = isHovered || isClustered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Technical Label & Sublabel
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillStyle = isHovered ? '#FFFFFF' : (isClustered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.65)');
      ctx.fillText(n.label, n.x + 12, n.y + 3);

      if (isHovered || isClustered) {
        ctx.font = '500 8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(n.desc, n.x + 12, n.y + 14);
      }
    }
  }

  function loop() {
    update();
    draw();
    if (!prefersReducedMotion && isTabActive) {
      animationFrameId = requestAnimationFrame(loop);
    }
  }

  // Mouse interactivity
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    mouse.activeNode = null;
    for (let i = 0; i < nodes.length; i++) {
      const dx = mouse.x - nodes[i].x;
      const dy = mouse.y - nodes[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < 26) {
        mouse.activeNode = nodes[i];
        break;
      }
    }
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.activeNode = null;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', () => {
    resize();
    if (prefersReducedMotion) draw();
  });

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive && !prefersReducedMotion) {
      cancelAnimationFrame(animationFrameId);
      loop();
    }
  });

  resize();
  loop();
})();
