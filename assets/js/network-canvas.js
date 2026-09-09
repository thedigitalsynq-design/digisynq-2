/**
 * DIGISYNQ - Organic Technology Dynamic Network Engine
 * 60fps interactive Canvas node & connection simulator
 * Metaphor: "The nervous system of Indian entertainment"
 */

(function () {
  'use strict';

  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isTabActive = true;

  // Node & Connection Configuration
  const CONFIG = {
    nodeCount: window.innerWidth < 768 ? 40 : 75,
    maxDistance: 150,
    mouseRadius: 180,
    nodeColorStart: '#FFFFFF', // Purple
    nodeColorEnd: '#353839',   // Sync Teal
    packetSpeed: 0.02,
    packetChance: 0.008
  };

  const mouse = {
    x: null,
    y: null,
    isActive: false
  };

  class Node {
    constructor(x, y) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.radius = Math.random() * 2.5 + 1.5;
      this.baseRadius = this.radius;
      this.color = Math.random() > 0.4 ? CONFIG.nodeColorStart : CONFIG.nodeColorEnd;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      // Movement
      this.x += this.vx;
      this.y += this.vy;

      // Bounce at boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Pulse breathing effect
      this.pulsePhase += 0.03;
      this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.8;

      // Mouse interactivity (subtle gravitational pull / repulsion)
      if (mouse.isActive && mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius && dist > 10) {
          const force = (1 - dist / CONFIG.mouseRadius) * 1.2;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Energy Packet traveling along connection lines
  class PulsePacket {
    constructor(fromNode, toNode) {
      this.from = fromNode;
      this.to = toNode;
      this.progress = 0;
      this.speed = CONFIG.packetSpeed + Math.random() * 0.015;
    }

    update() {
      this.progress += this.speed;
      return this.progress < 1;
    }

    draw() {
      const px = this.from.x + (this.to.x - this.from.x) * this.progress;
      const py = this.from.y + (this.to.y - this.from.y) * this.progress;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  let nodes = [];
  let packets = [];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }

  function init() {
    resize();
    nodes = [];
    packets = [];
    for (let i = 0; i < CONFIG.nodeCount; i++) {
      nodes.push(new Node());
    }
  }

  function render() {
    if (!isTabActive) return;

    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    // Connect nodes within proximity
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDistance) {
          const alpha = (1 - dist / CONFIG.maxDistance) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);

          // Dynamic line gradient
          const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          grad.addColorStop(0, `rgba(108, 59, 244, ${alpha})`);
          grad.addColorStop(1, `rgba(0, 212, 170, ${alpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Sporadically spawn sync packets
          if (Math.random() < CONFIG.packetChance && packets.length < 25) {
            packets.push(new PulsePacket(nodes[i], nodes[j]));
          }
        }
      }
    }

    // Update and draw packets
    for (let k = packets.length - 1; k >= 0; k--) {
      if (packets[k].update()) {
        packets[k].draw();
      } else {
        packets.splice(k, 1);
      }
    }

    // Central pulsing node anchor (representing Digisynq Nexus)
    const centerX = width / 2;
    const centerY = height * 0.42;
    const time = Date.now() * 0.002;
    const ringRadius = 48 + Math.sin(time) * 8;

    // Outer Harmonic Ripple
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius * 2.2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Intermediate Sync Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius * 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Primary Core Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    animationFrameId = requestAnimationFrame(render);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isActive = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.isActive = false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isTabActive = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isTabActive = true;
      render();
    }
  });

  init();
  render();
})();
