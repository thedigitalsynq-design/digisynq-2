/**
 * DIGISYNQ — Ambient Coordination Telemetry Mesh
 * GPU-accelerated interactive network constellation visualizing the hidden coordination layer.
 */
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'telemetryCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  canvas.style.opacity = '0.55';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  const nodeCount = Math.min(Math.floor(window.innerWidth / 30), 48);
  const mouse = { x: -1000, y: -1000, radius: 180 };

  const NODE_LABELS = [
    'TALENT.GUILD', 'STAGE.OCCUPANCY', 'OPTICAL.FLEET', 'IP.CATALOG',
    'CAPITAL.ESCROW', 'FAST.SYNDICATION', 'CINEMA.RADAR', 'AUDIENCE.CLUSTER',
    'TERRITORY.RIGHTS', 'POST.VFX.VELOCITY'
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('pointerleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Initialize nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1.2,
      baseAlpha: Math.random() * 0.35 + 0.25,
      label: Math.random() > 0.65 ? NODE_LABELS[Math.floor(Math.random() * NODE_LABELS.length)] : null,
      pulse: Math.random() * Math.PI * 2,
      active: false
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw connections
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.pulse += 0.03;
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      // Mouse magnetic interaction
      const dx = mouse.x - a.x;
      const dy = mouse.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      a.active = dist < mouse.radius;

      if (a.active) {
        const force = (mouse.radius - dist) / mouse.radius;
        a.x += (dx / dist) * force * 1.2;
        a.y += (dy / dist) * force * 1.2;
      }

      // Draw node circle
      const currentRadius = a.radius + (a.active ? Math.sin(a.pulse) * 1.5 + 1.5 : 0);
      ctx.beginPath();
      ctx.arc(a.x, a.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = a.active ? '#00FF66' : `rgba(148, 163, 184, ${a.baseAlpha})`;
      ctx.fill();

      // Draw node telemetry tag if active
      if (a.active && a.label) {
        ctx.font = '9px "Space Grotesk", monospace';
        ctx.fillStyle = 'rgba(0, 255, 102, 0.9)';
        ctx.fillText(`[ ${a.label} ]`, a.x + 8, a.y - 4);
      }

      // Connect to adjacent nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const distB = Math.hypot(a.x - b.x, a.y - b.y);
        const maxDist = a.active || b.active ? 150 : 100;

        if (distB < maxDist) {
          const alpha = (1 - distB / maxDist) * (a.active || b.active ? 0.45 : 0.12);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.active || b.active ? `rgba(0, 255, 102, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = a.active || b.active ? 1.2 : 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  // Only animate if reduced motion is not requested
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(render);
  }
})();
