/**
 * DIGISYNQ — Entertainment Ecosystem Orchestration OS
 * Master Client-Side Engine & Interactive Canvas Network
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initHeroNetworkCanvas();
  initLeakageSimulator();
  initLoopConsole();
  initEngineModules();
  initEcosystemTabs();
  initMissionControl();
  initModals();
  init3DEffects();
  init9870089044Controller();
  initAppleLiquidMotions();
  initSpecularCursorTracking();
  injectSvgGooeyFilter();
  checkUrlParams();
});

/* ==========================================================================
   01. NAVBAR SCROLL & MOBILE MENU
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   02. HERO PROPRIETARY REAL-WORLD ECOSYSTEM GRAPH (CANVAS)
   ========================================================================== */
let setGraphMode = null;
let currentGraphMode = 'synchronized';

function initHeroNetworkCanvas() {
  const canvas = document.getElementById('heroNetworkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let nodes = [];
  let packets = [];
  let mouse = { x: null, y: null, maxDistance: 160 };

  const assetNodes = [
    { label: 'Ideas & IP', category: 'Catalog & Scripts', color: '#FF5200', status: 'Dormant to Active' },
    { label: 'People & Talent', category: 'Cast & Guild Artisans', color: '#ec4899', status: 'Availability Synced' },
    { label: 'Places & Assets', category: 'Soundstages & Kits', color: '#10b981', status: 'Capacity Activated' },
    { label: 'Production', category: 'Cinema & Daily Shows', color: '#FF5200', status: 'In Execution' },
    { label: 'Post & Tech', category: 'VFX, Edit & Sound', color: '#8b5cf6', status: 'Workflow Synced' },
    { label: 'Distribution', category: 'Theatrical & OTT', color: '#6366f1', status: 'Audience Reach' },
    { label: 'Audience & Commerce', category: 'Brands & Community', color: '#f43f5e', status: 'Value Creation' },
    { label: 'Capital & Support', category: 'Escrow & Financing', color: '#f59e0b', status: 'Milestone Protected' }
  ];

  function resize() {
    if (!canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    createNodes();
  }

  function createNodes() {
    nodes = [];
    packets = [];
    
    // Create dedicated real-world asset nodes with elliptical orbit distribution
    const rx = Math.min(width * 0.38, 420);
    const ry = Math.min(height * 0.36, 175);

    assetNodes.forEach((asset, idx) => {
      const angle = (idx / assetNodes.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        x: width / 2 + Math.cos(angle) * rx,
        y: height / 2 + Math.sin(angle) * ry,
        origAngle: angle,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 5,
        color: asset.color,
        label: asset.label,
        category: asset.category,
        status: asset.status,
        pulse: Math.random() * Math.PI
      });
    });

    // Ambient background nodes
    const ambientCount = Math.min(Math.floor(width / 24), 28);
    for (let i = 0; i < ambientCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: 'rgba(255, 255, 255, 0.25)',
        label: null,
        pulse: Math.random() * Math.PI
      });
    }

    // Add Central DigiSynq Coordination Hub
    nodes.push({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: 9,
      color: '#FF5200',
      isCore: true,
      label: 'DigiSynq Coordination Hub',
      pulse: 0
    });
  }

  setGraphMode = function(mode) {
    currentGraphMode = mode;
    const buttons = document.querySelectorAll('.sim-mode-btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const statusBadge = document.getElementById('graphStatusBadge');
    if (statusBadge) {
      if (mode === 'fragmented') {
        statusBadge.innerHTML = '<span class="telemetry-status-dot red"></span><span>Fragmented state: Disconnected silos &amp; idle capacity</span>';
      } else if (mode === 'active-slate') {
        statusBadge.innerHTML = '<span class="telemetry-status-dot blue"></span><span>Live coordination: Real-time resource routing across 8 layers</span>';
      } else {
        statusBadge.innerHTML = '<span class="telemetry-status-dot green"></span><span>Synchronized state: Coordinated ecosystem &amp; transparent trust</span>';
      }
    }
  };

  function spawnPacket() {
    if (currentGraphMode !== 'active-slate') return;
    const realNodes = nodes.filter(n => n.label && !n.isCore);
    if (realNodes.length < 2) return;
    const n1 = realNodes[Math.floor(Math.random() * realNodes.length)];
    const coreNode = nodes.find(n => n.isCore);
    if (!coreNode) return;

    packets.push({
      startX: n1.x,
      startY: n1.y,
      endX: coreNode.x,
      endY: coreNode.y,
      x: n1.x,
      y: n1.y,
      progress: 0,
      speed: 0.035 + Math.random() * 0.02,
      color: n1.color
    });
  }

  setInterval(spawnPacket, 500);

  let angleOffset = 0;
  let radarRadius = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    angleOffset += (currentGraphMode === 'active-slate' ? 0.006 : 0.0025);
    radarRadius = (radarRadius + 1.2) % (Math.min(width, height) * 0.45);

    const coreNode = nodes.find(n => n.isCore);
    if (coreNode) {
      coreNode.x = width / 2;
      coreNode.y = height / 2;

      // Draw Radar Shockwave Rings around core
      if (currentGraphMode !== 'fragmented') {
        ctx.beginPath();
        ctx.arc(coreNode.x, coreNode.y, radarRadius, 0, Math.PI * 2);
        const ringAlpha = Math.max(0, 1 - radarRadius / (Math.min(width, height) * 0.45)) * 0.25;
        ctx.strokeStyle = `rgba(255, 82, 0, ${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(coreNode.x, coreNode.y, (radarRadius * 0.6) % (Math.min(width, height) * 0.45), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139, 92, 246, ${ringAlpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const isFragmented = currentGraphMode === 'fragmented';
    const rx = Math.min(width * 0.38, 420);
    const ry = Math.min(height * 0.36, 175);

    // Pass 1: Update positions & draw connection lines
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];

      if (!n1.isCore) {
        if (isFragmented) {
          // Chaotic drift
          n1.x += n1.vx * 1.5;
          n1.y += n1.vy * 1.5;
          if (n1.x < 30 || n1.x > width - 30) n1.vx *= -1;
          if (n1.y < 30 || n1.y > height - 30) n1.vy *= -1;
        } else if (n1.origAngle !== undefined) {
          // Harmonic orbit across wide ellipse
          const curAngle = n1.origAngle + angleOffset;
          const targetX = width / 2 + Math.cos(curAngle) * rx;
          const targetY = height / 2 + Math.sin(curAngle) * ry;
          n1.x += (targetX - n1.x) * 0.08;
          n1.y += (targetY - n1.y) * 0.08;
        } else {
          n1.x += n1.vx;
          n1.y += n1.vy;
          if (n1.x < 0 || n1.x > width) n1.vx *= -1;
          if (n1.y < 0 || n1.y > height) n1.vy *= -1;
        }
      }

      // Mouse repulsion & interactive beam
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = n1.x - mouse.x;
        const mdy = n1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 130) {
          const force = (1 - mdist / 130) * 6;
          n1.x += (mdx / mdist) * force;
          n1.y += (mdy / mdist) * force;

          if (n1.label) {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n1.x, n1.y);
            ctx.strokeStyle = `rgba(255, 82, 0, ${(1 - mdist / 130) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      n1.pulse += 0.035;

      // Draw connections
      if (!isFragmented) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = (n1.isCore || n2.isCore) ? 360 : 170;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.65;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = (n1.isCore || n2.isCore) ? `rgba(255, 82, 0, ${alpha * 1.8})` : `rgba(255, 255, 255, ${alpha * 0.35})`;
            ctx.lineWidth = (n1.isCore || n2.isCore) ? 1.8 : 0.75;
            ctx.stroke();
          }
        }
      }
    }

    // Pass 2: Draw Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      ctx.beginPath();
      const currentRadius = n1.isCore ? n1.radius + Math.sin(n1.pulse) * 2 : (n1.label ? n1.radius + Math.sin(n1.pulse) * 0.6 : n1.radius);
      ctx.arc(n1.x, n1.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = isFragmented && n1.label ? '#ef4444' : n1.color;
      ctx.fill();

      // Node Glow
      if (n1.isCore || n1.label) {
        ctx.shadowColor = isFragmented && n1.label ? '#ef4444' : n1.color;
        if (window.innerWidth >= 768) ctx.shadowBlur = n1.isCore ? 20 : 12; else ctx.shadowBlur = 0;
      } else {
        ctx.shadowBlur = 0;
      }
    }

    // Pass 3: Draw Clean Glass Badges (Layered on top of lines so they never collide!)
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      if (!n1.label) continue;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.font = n1.isCore ? 'bold 11px Denton, sans-serif' : '10px Denton, sans-serif';
      const text = n1.label;
      const textW = ctx.measureText(text).width;
      const padX = 8;
      const padY = 3.5;
      const badgeW = textW + padX * 2;
      const badgeH = 20;

      let badgeX, badgeY;

      if (n1.isCore) {
        badgeX = n1.x - badgeW / 2;
        badgeY = n1.y + 16;
      } else {
        // Place badge radially outward from center
        const angleFromCenter = Math.atan2(n1.y - height / 2, n1.x - width / 2);
        if (Math.cos(angleFromCenter) >= 0) {
          badgeX = n1.x + 10;
        } else {
          badgeX = n1.x - badgeW - 10;
        }
        badgeY = n1.y - badgeH / 2;
      }

      // Constrain inside canvas
      badgeX = Math.max(10, Math.min(width - badgeW - 10, badgeX));
      badgeY = Math.max(10, Math.min(height - badgeH - 10, badgeY));

      // Draw Glass Pill Background
      ctx.fillStyle = n1.isCore ? 'rgba(6, 24, 40, 0.92)' : 'rgba(10, 14, 22, 0.9)';
      ctx.strokeStyle = n1.isCore ? 'rgba(255, 82, 0, 0.8)' : (isFragmented ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.16)');
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.fillStyle = n1.isCore ? '#FF5200' : (isFragmented ? '#fca5a5' : '#f8fafc');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, badgeX + padX, badgeY + badgeH / 2);

      ctx.restore();
    }

    // Render Data Packets (Active Mode)
    for (let p = packets.length - 1; p >= 0; p--) {
      const pkt = packets[p];
      pkt.progress += pkt.speed;
      pkt.x = pkt.startX + (pkt.endX - pkt.startX) * pkt.progress;
      pkt.y = pkt.startY + (pkt.endY - pkt.startY) * pkt.progress;

      ctx.beginPath();
      ctx.arc(pkt.x, pkt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = pkt.color;
      if (window.innerWidth >= 768) ctx.shadowBlur = 14; else ctx.shadowBlur = 0;
      ctx.fill();

      if (pkt.progress >= 1) {
        packets.splice(p, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* ==========================================================================
   03. INTERACTIVE ECONOMIC LEAKAGE & YIELD SIMULATOR
   ========================================================================== */
function initLeakageSimulator() {
  const slider = document.getElementById('budgetSlider');
  const budgetDisplay = document.getElementById('simBudgetDisplay');
  const leakageVal = document.getElementById('simLeakageVal');
  const recoveredVal = document.getElementById('simRecoveredVal');
  const timeSavedVal = document.getElementById('simTimeSavedVal');
  const darkDaysVal = document.getElementById('simDarkDaysVal');

  if (!slider) return;

  function updateSimulation() {
    const budgetCr = parseFloat(slider.value);
    
    // Format Display
    if (budgetDisplay) {
      budgetDisplay.textContent = budgetCr >= 1 ? `₹${budgetCr.toFixed(1)} Cr ($${(budgetCr * 120).toFixed(0)}K)` : `₹${(budgetCr * 100).toFixed(0)} Lakh ($${(budgetCr * 120).toFixed(0)}K)`;
    }

    // Calculations based on empirical industry leakage rates (20% avg leakage, 85% recovered)
    const leakageAmt = budgetCr * 0.22;
    const recoveredAmt = leakageAmt * 0.88;
    const timeSavedWeeks = Math.max(2, Math.round(budgetCr * 1.5 + 2));
    const darkDaysActivated = Math.max(6, Math.round(budgetCr * 4.2 + 4));

    if (leakageVal) {
      leakageVal.textContent = leakageAmt >= 1 ? `₹${leakageAmt.toFixed(2)} Cr` : `₹${(leakageAmt * 100).toFixed(1)} L`;
    }
    if (recoveredVal) {
      recoveredVal.textContent = recoveredAmt >= 1 ? `₹${recoveredAmt.toFixed(2)} Cr` : `₹${(recoveredAmt * 100).toFixed(1)} L`;
    }
    if (timeSavedVal) {
      timeSavedVal.textContent = `${timeSavedWeeks} weeks`;
    }
    if (darkDaysVal) {
      darkDaysVal.textContent = `${darkDaysActivated} dark days`;
    }
  }

  slider.addEventListener('input', updateSimulation);
  updateSimulation();
}

/* ==========================================================================
   04. INTERACTIVE 12-STEP LOOP CONSOLE
   ========================================================================== */
const LOOP_STEPS_DATA = [
  { step: '01', name: 'Detect', title: 'Fragmentation & Bottleneck Detection', desc: 'Continuous intake scanner maps idle soundstages, unscheduled camera bodies, and stalled project slates.', input: 'Stage schedules, gear inventory feeds, permit logs', verification: 'Acoustic rating STC check, serial hash QC', output: 'Identified gap calendar & scope specification' },
  { step: '02', name: 'Map', title: 'Resource & Relational Graph Mapping', desc: 'Indexes certified craftspeople, equipment bench ratings, and facility acoustics into a queryable graph.', input: 'Past theatrical credits, rate benchmarks, telemetry', verification: 'Guild roster audit & technical competency score', output: 'Ranked candidate pods with compatibility score' },
  { step: '03', name: 'Qualify', title: 'Capability & Calibration Vetting', desc: 'Validates lens mount tolerances, camera firmware, and department head availability matrices.', input: 'Optical bench QC logs, technician schedule feeds', verification: 'Dual sign-off from DP and Master Rental House', output: 'Certified production-ready equipment package' },
  { step: '04', name: 'Connect', title: 'Neutral Packaging & Attachment', desc: 'Pairs verified director-cinematographer-soundstage pods with zero informal broker friction.', input: 'Creative brief, budget boundaries, schedule window', verification: 'Mutual confirmation protocol & schedule lock', output: 'Locked multi-department production package' },
  { step: '05', name: 'Secure', title: 'Milestone Escrow & Trust Lock', desc: 'Coordinates neutral milestone escrow vaults via third-party custodians before load-in to ensure disciplined milestone security.', input: 'Production budget schedule, milestone tranche matrix', verification: 'Independent custodian verification', output: 'Verified Milestone Escrow Authorization' },
  { step: '06', name: 'Activate', title: 'Dark Capacity Unlocking', desc: 'Converts unbooked soundstage gap windows into rapid-turnaround commercial and digital shoot dates.', input: 'Lot calendar vacancy window (3-10 days)', verification: 'Dynamic rate yield contract approval', output: 'Activated stage booking at optimized yield rate' },
  { step: '07', name: 'Coordinate', title: 'Synchronized Workflow Execution', desc: 'Harmonizes on-set daily call sheets, DIT raw checksum ingestion, and ACES proxy post delivery.', input: 'Digital call sheet, camera roll metadata, sound logs', verification: 'Automated checksum hash comparison', output: 'Same-day proxy delivery to editorial suites' },
  { step: '08', name: 'Monitor', title: 'Real-Time Telemetry & Burn Oversight', desc: 'Monitors milestone draw burn rates, overtime hours, and verified footage upload completion.', input: 'Daily wrap report, DIT cloud checksum match', verification: 'Department Head digital signature lock', output: 'Live milestone health index (LMHI) indicator' },
  { step: '09', name: 'Intervene', title: 'Anomaly & Threat Resolution', desc: 'Detects schedule slippage, missing optic mounts, or pre-release piracy leaks; deploys instant response pods.', input: 'Radar sentiment scan, link scraper, on-set alert', verification: 'DMCA verification & emergency swap router', output: 'Under 15-minute resolution or equipment swap' },
  { step: '10', name: 'Settle', title: 'Milestone Verification & Automated Disbursal', desc: 'Final post-wrap audit verifies delivered master proxies, wraps crew timecards, and triggers automated escrow payouts.', input: 'Post-production ingestion receipt, line item expense ledger', verification: 'Independent escrow audit certificate', output: 'Automated wire releases with zero invoice lag' },
  { step: '11', name: 'Learn', title: 'Predictive Graph Compounding', desc: 'Feeds project performance telemetry back into SYNQINTEL™ to refine future package recommendations.', input: 'Full project timeline & collaboration metrics', verification: 'Relational vector update in core OS', output: 'Enhanced predictive accuracy for next slate' },
  { step: '12', name: 'Scale', title: 'Multi-Vertical Ecosystem Replication', desc: 'Deploys verified playbooks across feature cinema, OTT series, commercial TVC, gaming, and virtual production.', input: 'Standardized operational template', verification: 'Cross-vertical adapter compliance', output: 'Autonomous multi-slate ecosystem throughput' }
];

function initLoopConsole() {
  const stepButtons = document.querySelectorAll('.loop-step-btn');
  if (!stepButtons.length) return;

  const phaseEl = document.getElementById('loopStepPhase');
  const titleEl = document.getElementById('loopStepTitle');
  const descEl = document.getElementById('loopStepDesc');
  const inputEl = document.getElementById('loopStepInput');
  const verifyEl = document.getElementById('loopStepVerify');
  const outputEl = document.getElementById('loopStepOutput');
  const displayCard = document.getElementById('loopDisplayCard');

  function renderStep(idx) {
    const data = LOOP_STEPS_DATA[idx];
    if (!data) return;

    if (displayCard) {
      displayCard.style.opacity = '0.7';
      displayCard.style.transform = 'translateY(4px)';
    }

    setTimeout(() => {
      if (phaseEl) phaseEl.textContent = `Phase ${data.step} • ${data.name}`;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (inputEl) inputEl.textContent = data.input;
      if (verifyEl) verifyEl.textContent = data.verification;
      if (outputEl) outputEl.textContent = data.output;

      if (displayCard) {
        displayCard.style.opacity = '1';
        displayCard.style.transform = 'translateY(0)';
      }
    }, 120);
  }

  stepButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      stepButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStep(idx);
    });
  });

  renderStep(0);
}

/* ==========================================================================
   05. THE DIGISYNQ ENGINE (13 INTERACTIVE MODULES)
   ========================================================================== */
const ENGINE_DATA = {
  scan: {
    code: 'SYNQSCAN™',
    name: 'Fragmentation & leakage detector',
    desc: 'Continuously monitors entertainment pipelines to detect unbooked facility dates, idle camera packages, dormant IP, delayed payments, and workflow gaps.',
    problem: 'Siloed information leads to substantial dark-day asset losses and project stalls (often 35–40%+ in uncoordinated cycles).',
    benefits: 'Studios, independent producers, guild technicians, asset owners.',
    inputs: 'Live stage schedules, gear inventories, production permits, guild rosters.',
    outcome: 'Real-time detection of operational bottlenecks before capital is burned.',
    defaultRole: 'studio',
    defaultMsg: 'I would like to run a SYNQSCAN™ audit to detect unused studio capacity / pipeline leakage.'
  },
  map: {
    code: 'SYNQMAP™',
    name: 'Dynamic resource & capability graph',
    desc: 'Maps and indexes verified capabilities, acoustic ratings, equipment benches, and talent relationships across global entertainment ecosystems.',
    problem: 'Informal broker networks obscure who and what is actually available.',
    benefits: 'Production heads, showrunners, studio operations, agency execs.',
    inputs: 'Verified credit ledgers, stage STC specs, optical bench QC records.',
    outcome: 'A searchable, relational intelligence graph of all entertainment assets.',
    defaultRole: 'producer',
    defaultMsg: 'I want to query the Resource Graph for verified crew pods and acoustic soundstage availability.'
  },
  link: {
    code: 'SYNQLINK™',
    name: 'Compatibility & attachment engine',
    desc: 'Identifies and matches complementary creative, technical, and logistical participants based on aesthetic calibration, format specs, and collaboration velocity.',
    problem: 'Mismatched director-crew-gear packages cause costly on-set delays.',
    benefits: 'Cinematographers, directors, producers, rental houses.',
    inputs: 'Collaboration graph vectors, format specifications, schedule matrices.',
    outcome: 'Precision packaging designed for minimal downtime and verified technical compatibility.',
    defaultRole: 'director',
    defaultMsg: 'I need to package a compatible DP, gaffer, and camera optics pod for an upcoming shoot.'
  },
  pool: {
    code: 'SYNQPOOL™',
    name: 'Dark capacity activation hub',
    desc: 'Aggregates unbooked soundstage dark days, idle grip trucks, and gap technician days into immediately bookable rapid-turnaround packages.',
    problem: 'Fixed real-estate and fleet overhead bleeds millions during slate gaps.',
    benefits: 'Studio lots, commercial directors, YouTube creators, brand units.',
    inputs: 'Dynamic calendar vacancy feeds, rate yield models, gap time windows.',
    outcome: 'Optimizes facility utilization and activates unbooked gap windows.',
    defaultRole: 'studio',
    defaultMsg: 'I have unbooked dark days on my soundstage/facility that I want to monetize via SYNQPOOL™.'
  },
  flow: {
    code: 'SYNQFLOW™',
    name: 'Synchronized workflow orchestrator',
    desc: 'Coordinates cross-department handoffs between production, on-set DIT raw ingestion, ACES color grading proxies, and post-production editorial.',
    problem: 'Slippage between shooting and post burns weeks in re-conforming.',
    benefits: 'Line producers, post supervisors, VFX houses, editors.',
    inputs: 'Camera metadata checksums, sound sync logs, daily wrap milestones.',
    outcome: 'Same-day proxy delivery and seamless post-production execution.',
    defaultRole: 'producer',
    defaultMsg: 'We need SYNQFLOW™ workflow coordination for daily DIT hash ingestion and ACES proxy handoffs.'
  },
  share: {
    code: 'SYNQSHARE™',
    name: 'Asset-light co-execution framework',
    desc: 'Enables specialized agencies, studios, and financiers to pool infrastructure, mitigate single-entity downside, and share aligned upside.',
    problem: 'High fixed CapEx traps agencies in margin erosion during slow slates.',
    benefits: 'Advertising agencies, co-financiers, creator collaboratives.',
    inputs: 'Milestone escrow contracts, revenue split waterfall models.',
    outcome: 'Flexible production throughput without redundant capital expenditure.',
    defaultRole: 'agency',
    defaultMsg: 'We are an agency looking to deploy an asset-light production backend through SYNQSHARE™.'
  },
  vault: {
    code: 'SYNQVAULT™',
    name: 'Ecosystem trust & verification ledger',
    desc: 'Creates immutable trust through verified delivery histories, credit validation, equipment QC benchmarking, and milestone escrow security.',
    problem: 'Payment defaults, fraudulent credits, and unverified rates paralyze transactions.',
    benefits: 'Technicians, talent, facility owners, financial underwriters.',
    inputs: 'Audited release credits, bench QC logs, milestone sign-offs.',
    outcome: 'Milestone-verified escrow workflows designed to significantly mitigate payment friction.',
    defaultRole: 'financier',
    defaultMsg: 'We want to utilize SYNQVAULT™ escrow and credit verification for our slate.'
  },
  track: {
    code: 'SYNQTRACK™',
    name: 'Live telemetry & milestone governance',
    desc: 'Continuously monitors active shoot milestones, raw footage hashes, budget burn velocity, and department head sign-offs in real time.',
    problem: 'Unreconciled voucher overages and scope creep create significant budget friction.',
    benefits: 'Film financiers, production insurers, line producers.',
    inputs: 'DIT raw hashes, digital call sheets, live budget draw ledgers.',
    outcome: 'Verified milestone compliance and transparent settlement workflows.',
    defaultRole: 'financier',
    defaultMsg: 'We want to deploy SYNQTRACK™ real-time telemetry monitoring for our active slate.'
  },
  exchange: {
    code: 'SYNQEXCHANGE™',
    name: 'Value & commercial exchange coordinator',
    desc: 'Standardizes rate benchmarks, settlement tranches, and cross-party workflow execution with transparent fee structures.',
    problem: 'Opaque markups and fragmented negotiation cycles slow down production assembly.',
    benefits: 'Producers, brand sponsors, distributors, craft guilds.',
    inputs: 'Market-clearing rate models, multi-party contract templates, escrow triggers.',
    outcome: 'Frictionless, transparent commercial transactions across the value chain.',
    defaultRole: 'producer',
    defaultMsg: 'I want to coordinate standardized contract packaging and rate clearing via SYNQEXCHANGE™.'
  },
  intel: {
    code: 'SYNQINTEL™',
    name: 'Predictive ecosystem learning OS',
    desc: 'Synthesizes multi-year production telemetry across slates, lots, and crew pods to predict optimal attachments and forecast execution risk.',
    problem: 'The industry continuously repeats logistical and budgeting mistakes.',
    benefits: 'Studios, platforms, financiers, showrunners.',
    inputs: 'Wrap variance data, equipment reliability logs, cost-to-complete models.',
    outcome: 'Continuous machine-learned intelligence that compounds with every mission.',
    defaultRole: 'producer',
    defaultMsg: 'I want to access SYNQINTEL™ predictive benchmarks for our upcoming development slate.'
  },
  lab: {
    code: 'SYNQLAB™',
    name: 'Next-generation format experimenter',
    desc: 'Incubates and stress-tests new operating models—bridging AI/GenAI pipelines, virtual production LED volumes, interactive gaming, and hybrid live formats.',
    problem: 'Traditional productions struggle to integrate emerging technologies efficiently.',
    benefits: 'Creator studios, VFX supervisors, game publishers, streaming labs.',
    inputs: 'Virtual production telemetry, AI workflow nodes, real-time render benchmarks.',
    outcome: 'De-risked, turnkey adoption of breakthrough entertainment workflows.',
    defaultRole: 'creator',
    defaultMsg: 'We want to test a virtual production / hybrid format workflow with SYNQLAB™.'
  },
  control: {
    code: 'SYNQCONTROL™',
    name: 'Master control & anomaly defense',
    desc: 'Provides automated exception-handling, hot-swap gear logistics, and Cinema Radar 72h pre-release narrative and anti-piracy defense.',
    problem: 'Last-minute equipment failures or piracy leaks destroy release value.',
    benefits: 'Theatrical distributors, studio lots, marketing agencies.',
    inputs: 'Social sentiment scrapers, pirate network crawlers, equipment hot-swap pods.',
    outcome: 'Under 15-minute DMCA removals and under 45-minute on-set gear replacements.',
    defaultRole: 'producer',
    defaultMsg: 'We require SYNQCONTROL™ Cinema Radar threat defense for our upcoming theatrical premiere.'
  },
  outcome: {
    code: 'SYNQOUTCOME™',
    name: 'Economic value & yield auditor',
    desc: 'Audits and certifies realized economic value—measuring dark days saved, capital leakage eliminated, speed gains, and stakeholder net margin lift.',
    problem: 'Post-production financial audits are opaque and delayed by months.',
    benefits: 'Financiers, lot owners, producers, investors.',
    inputs: 'Pre-production baseline vs. post-wrap actual expense logs, escrow disbursements.',
    outcome: 'Verified value creation certificate and transparent yield reconciliation.',
    defaultRole: 'financier',
    defaultMsg: 'We need an independent SYNQOUTCOME™ post-wrap economic yield audit for our production.'
  }
};

function initEngineModules() {
  const buttons = document.querySelectorAll('.engine-module-btn');
  if (!buttons.length) return;

  const panelCode = document.getElementById('moduleCode');
  const panelName = document.getElementById('moduleName');
  const panelDesc = document.getElementById('moduleDesc');
  const panelProblem = document.getElementById('moduleProblem');
  const panelBenefits = document.getElementById('moduleBenefits');
  const panelInputs = document.getElementById('moduleInputs');
  const panelOutcome = document.getElementById('moduleOutcome');
  const deployBtn = document.getElementById('deployModuleBtn');

  function renderModule(key) {
    const data = ENGINE_DATA[key];
    if (!data) return;

    if (panelCode) panelCode.textContent = data.code;
    if (panelName) panelName.textContent = data.name;
    if (panelDesc) panelDesc.textContent = data.desc;
    if (panelProblem) panelProblem.textContent = data.problem;
    if (panelBenefits) panelBenefits.textContent = data.benefits;
    if (panelInputs) panelInputs.textContent = data.inputs;
    if (panelOutcome) panelOutcome.textContent = data.outcome;

    if (deployBtn) {
      deployBtn.setAttribute('data-role', data.defaultRole);
      deployBtn.setAttribute('data-msg', data.defaultMsg);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-module');
      renderModule(key);
    });
  });

  renderModule('scan');
}

/* ==========================================================================
   06. ECOSYSTEM CATEGORY TABS & MATRIX
   ========================================================================== */
const ECOSYSTEM_DATA = {
  content: [
    { title: 'Feature Film Spec Slates', tag: 'Cinema & OTT', region: 'Mumbai / London / LA', spec: '120-min locked scripts with attached director & budget breakdown.', avail: 'Packaging Window Active', score: '99/100' },
    { title: 'OTT Crime Drama & Thriller IPs', tag: 'Streaming Series', region: 'Pan-Regional Hubs', spec: 'Multi-season episodic bibles with verified character rights.', avail: 'Reviewing Acquisition', score: '98/100' },
    { title: 'YouTube & Social Creator Slates', tag: 'Creator Economy', region: 'Bangalore / Los Angeles', spec: 'High-frequency weekly 4K content slates for corporate brand sponsors.', avail: 'Active Syndication', score: '99/100' },
    { title: 'Linear TV Tape & Daily Serials', tag: 'Broadcast TV Archive', region: 'Chennai / New Delhi', spec: '2,500+ broadcast hours prepared for FAST channel conversion.', avail: 'Instant FAST Ingest', score: '95/100' },
    { title: 'Transmedia Novels & Audio Drama', tag: 'Transmedia IP', region: 'Global Rights Desk', spec: 'Podcasts & published fiction adapted into game & animation formats.', avail: 'Format Conversion', score: '97/100' },
    { title: 'Regional Independent Cinema', tag: 'Indie Feature', region: 'South Asia / Europe', spec: 'Festival-awarded features looking for global streaming delivery.', avail: 'Direct OTT Bridge', score: '96/100' }
  ],
  talent: [
    { title: 'Guild Cinematographers & DPs', tag: 'Camera Department', region: 'Pan-India / UK / US', spec: 'ISC / BSC / ASC accredited, Alexa 35 & Master Anamorphic calibration.', avail: 'Available Oct 12–28', score: '100/100' },
    { title: 'Feature Film Directors Unit', tag: 'Directorial Pod', region: 'Mumbai / London', spec: 'Proven commercial & theatrical wrap track record with zero overrun log.', avail: 'Packaging Active', score: '98/100' },
    { title: 'Sync Sound Recordist Teams', tag: 'Audio Capture', region: 'Hyderabad / Prague', spec: 'Sound Devices 32-track mobile rigs + RF spectrum scanning.', avail: 'Immediate Call', score: '96/100' },
    { title: 'ACES Master Colorists & DITs', tag: 'Post / Finishing', region: 'Bangalore / Berlin', spec: 'DaVinci Resolve Advanced, Dolby Vision & on-set cloud checksum sync.', avail: 'Cloud Remote Sync', score: '99/100' },
    { title: 'Stunt & Rigging Coordination Pod', tag: 'Physical Action', region: 'Chennai / Sydney', spec: 'Certified wire rigging engineers & pyrotechnic safety coordinators.', avail: 'Available 30-Day Slate', score: '97/100' },
    { title: 'Multilingual Voice Talent Pool', tag: 'Localization AI', region: 'Global 12 Languages', spec: 'SAG-AFTRA & guild verified voice actors with AI lip-sync clearance.', avail: 'Simultaneous Release', score: '98/100' }
  ],
  production: [
    { title: 'Acoustic Soundstage 04 (18,000 sq ft)', tag: 'Soundstage Lot', region: 'Studio Central Hub', spec: 'NC-20 / STC 62 acoustic rating, 35ft silent grid, 1200A silent power.', avail: '3 Dark Days Active', score: '100/100' },
    { title: 'Virtual Production LED Volume', tag: 'In-Camera VFX', region: 'Tech City Lot', spec: '2.3mm pixel pitch, Brompton SX40, real-time Unreal 5.4 tracking.', avail: 'Dark Window (Oct 24–30)', score: '99/100' },
    { title: 'ARRI Alexa 35 Optical Package', tag: 'Cinema Optics', region: 'Master Rental Hub', spec: 'Alexa 35 + ARRI Master Primes (18-100mm) collimated & bench QC pass.', avail: 'Immediate Dispatch', score: '100/100' },
    { title: 'RED V-Raptor XL 8K VV Unit', tag: 'High-Speed Gear', region: 'Downtown Vault', spec: 'Cooke Anamorphic /i Full Frame Plus Set with wireless focus pods.', avail: '14-Day Slate Ready', score: '97/100' },
    { title: 'Heavy Grip & Electric Rig Truck (10-Ton)', tag: 'Lighting & Power', region: 'Regional Hub', spec: 'Arri Skypanel X21/S360 + 120kW whisper generator fleet.', avail: 'On-Call Deployment', score: '96/100' },
    { title: 'Technocrane 45 Telescopic Crane', tag: 'Camera Movement', region: 'Studio Central', spec: 'Gyro-stabilized Scorpio Head with computerized precision track.', avail: 'Booked per Day', score: '98/100' }
  ],
  commercial: [
    { title: 'SYNQVAULT™ Multi-Sig Escrow', tag: 'Milestone Banking', region: 'Global Core', spec: 'Multi-signature neutral milestone escrow with automated DIT wire release.', avail: 'Instant Vault Lock', score: '100/100' },
    { title: 'Institutional Film Co-Finance Desk', tag: 'Senior Debt & Equity', region: 'London / NYC / Mumbai', spec: 'Gap financing, senior loans & equity matching ($500K–$25M).', avail: 'Reviewing Slates', score: '99/100' },
    { title: 'Tax Credit & Rebate Bridge Vault', tag: 'Rebate Lending', region: 'UK / Georgia / Eastern Europe', spec: '72h capital deployment against verified state film commission rebates.', avail: 'Active Deployment', score: '98/100' },
    { title: 'Brand Direct Commercialization Desk', tag: 'Brand Integration', region: 'Global FMCG & Tech', spec: 'Turnkey $100K–$500K corporate briefs paired with creators & directors.', avail: '15 Active Briefs', score: '97/100' },
    { title: 'Minimum Guarantee (MG) Financing Desk', tag: 'Pre-Sales Capital', region: 'Los Angeles / Mumbai', spec: 'Immediate advances against verified international distributor contracts.', avail: 'Open Pipeline', score: '96/100' },
    { title: 'Creator Slate Co-Investment Fund', tag: 'Digital IP Capital', region: 'Bangalore / Singapore', spec: 'Shared-revenue backing for high-frequency YouTube & FAST series.', avail: 'Deploying Capital', score: '95/100' }
  ],
  distribution: [
    { title: 'National Theatrical Multiplex Chain', tag: 'Cinema Exhibition', region: '350+ Screens Regional', spec: 'DCI 4K laser projection, Dolby Atmos audio, weekend slot allocations.', avail: 'Slot Routing Active', score: '99/100' },
    { title: 'Global OTT Streaming Acquisition Desk', tag: 'Digital Streaming', region: 'Worldwide Multi-Territory', spec: 'Originals & direct-to-digital film acquisitions with verified credit ledgers.', avail: 'Active Acquisition', score: '98/100' },
    { title: 'FAST Channel Syndication Network', tag: 'Ad-Supported TV', region: 'US / Europe / India', spec: '24/7 automated linear EPG broadcast feeds with ad revenue sharing.', avail: 'Catalog Ingest Open', score: '96/100' },
    { title: 'International Theatrical Sales Agency', tag: 'Global Sales', region: 'Cannes / AFM / EFM', spec: 'Worldwide territory licensing and multi-language minimum guarantees.', avail: 'Acquiring Spec Titles', score: '97/100' },
    { title: 'Regional Theatrical Guild Desk', tag: 'Non-Metro Theatres', region: 'South Asia / Middle East', spec: 'Day-and-date theatrical distribution across tier-2 and tier-3 circuits.', avail: 'Open Slate Booking', score: '95/100' },
    { title: 'Direct-to-Consumer Creator Paywall', tag: 'Monetization Hub', region: 'Global Edge CDN', spec: 'Zero-middleman PPV live stream & direct fan ticketing portal.', avail: 'Instant Setup', score: '98/100' }
  ],
  live: [
    { title: 'Stadium & Arena Entertainment Lot', tag: 'Stadium Venue', region: 'Metropolitan Hub', spec: '45,000 capacity, integrated 10Gbps low-latency dark fiber broadcast ring.', avail: 'Dark Dates Available', score: '99/100' },
    { title: '4K Multi-Cam Broadcast OB Fleet', tag: 'Live Broadcast Truck', region: 'Regional Hub', spec: '16x Sony HDC-4300, Grass Valley switcher, Dante spatial audio mixer.', avail: 'Weekend Deployment', score: '98/100' },
    { title: 'Low-Latency Global PPV Gateway', tag: 'Edge Live Streaming', region: 'Global CDN', spec: '< 800ms latency, scalable to 2,000,000 concurrent video viewers.', avail: 'Instant Gateway Setup', score: '100/100' },
    { title: 'Revived Theatrical Heritage Lot', tag: 'Boutique Cinema', region: 'Arts District', spec: '4K Barco DP4K-32B laser projector, restored acoustic auditorium.', avail: 'Available Mon–Thu', score: '95/100' },
    { title: 'Touring Logistics & Stage Pod', tag: 'Live Touring', region: '12-City Circuit', spec: 'Turnkey trussing, Meyer Sound arrays, stage tech & crew accommodation.', avail: 'Winter Circuit Ready', score: '97/100' },
    { title: 'Micro-Audience Demand Aggregator', tag: 'Fandom Demand', region: 'Global Digital', spec: 'Crowd-clustered theatrical screening triggers with zero ticket risk.', avail: 'Demand Active', score: '98/100' }
  ],
  technology: [
    { title: 'Cinema Radar Anti-Piracy Threat Shield', tag: 'Security & Rights', region: 'Cloud Scraper Swarm', spec: '72h pre-release threat scanning, automated DMCA link desync < 15 mins.', avail: 'Active Threat Scanners', score: '100/100' },
    { title: 'ACES Color Cloud Conform & DIT Sync', tag: 'Post Technology', region: 'Global Cloud Node', spec: 'On-set xxHash checksum match & instant ACEScc LUT proxy conforming.', avail: 'Live Feed Connected', score: '99/100' },
    { title: 'AI Multilingual Dubbing & Lip-Sync', tag: 'Localization AI', region: 'Global Neural Engine', spec: 'Guild-approved voice replica & automated lip-sync alignment across 12 languages.', avail: '12-Language Pipeline', score: '98/100' },
    { title: 'Digital Call Sheet & Wrap Hash Ledger', tag: 'Production SaaS', region: 'Secure Cloud Platform', spec: 'Real-time timesheet logging, overtime calculation & milestone escrow triggers.', avail: 'Instant Pod Ingest', score: '98/100' },
    { title: 'Unreal Engine 5.4 In-Camera VFX Hub', tag: 'Real-Time Graphics', region: 'Virtual Stage Cloud', spec: 'Pre-baked photoreal stage asset repository & real-time camera tracking.', avail: 'Instant Mocap Ingest', score: '99/100' },
    { title: 'Dynamic Dark-Day Yield Engine', tag: 'Algorithmic Pricing', region: 'Core DigiSynq Engine', spec: 'Continuous soundstage & camera package vacancy matching algorithms.', avail: '24/7 Yield Optimization', score: '100/100' }
  ]
};

function initEcosystemTabs() {
  const tabs = document.querySelectorAll('.eco-tab-btn');
  const container = document.getElementById('ecosystemGrid');
  if (!tabs.length || !container) return;

  function renderCategory(cat) {
    const items = ECOSYSTEM_DATA[cat] || [];
    container.innerHTML = items.map(item => `
      <div class="eco-node-card">
        <div>
          <div class="eco-node-header">
            <span class="eco-node-tag">${item.tag}</span>
            <span class="eco-node-score">Score: ${item.score}</span>
          </div>
          <h4 class="eco-node-title">${item.title}</h4>
          <div class="eco-node-region">📍 ${item.region}</div>
          <div class="eco-node-spec">${item.spec}</div>
        </div>
        <div class="eco-node-footer">
          <span class="eco-node-avail">● ${item.avail}</span>
          <button class="btn btn-cyan btn-sm" data-open-synq-modal data-role="producer" data-msg="I want to connect with verified node: ${item.title} (${item.tag})">Connect node &rarr;</button>
        </div>
      </div>
    `).join('');

    // Re-bind modal triggers for newly rendered dynamic buttons
    const newButtons = container.querySelectorAll('[data-open-synq-modal]');
    const modal = document.getElementById('synqModal');
    if (modal) {
      newButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const role = btn.getAttribute('data-role');
          const msg = btn.getAttribute('data-msg');
          const roleSelect = modal.querySelector('select');
          const msgTextarea = modal.querySelector('textarea');
          if (roleSelect && role) roleSelect.value = role;
          if (msgTextarea && msg) msgTextarea.value = msg;
          modal.classList.add('active');
        });
      });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-eco');
      renderCategory(cat);
    });
  });

  renderCategory('content');
}

/* ==========================================================================
   07. SYNQTRACK™ CONTROL CENTER SIMULATOR
   ========================================================================== */
function initMissionControl() {
  const timeDisplay = document.getElementById('telemetryClock');
  if (timeDisplay) {
    setInterval(() => {
      const now = new Date();
      timeDisplay.textContent = now.toTimeString().split(' ')[0] + ' UTC';
    }, 1000);
  }
}

/* ==========================================================================
   08. MODALS & INTAKE FORMS WITH CONTEXT PRE-POPULATION
   ========================================================================== */
function initModals() {
  const openButtons = document.querySelectorAll('[data-open-synq-modal]');
  const modal = document.getElementById('synqModal');
  const closeBtn = document.getElementById('closeSynqModal');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const role = btn.getAttribute('data-role');
      const msg = btn.getAttribute('data-msg');
      const mission = btn.getAttribute('data-mission');

      const roleSelect = modal.querySelector('select');
      const msgTextarea = modal.querySelector('textarea');

      if (roleSelect && role) {
        roleSelect.value = role;
      }
      if (msgTextarea && (msg || mission)) {
        msgTextarea.value = msg || `I want to initialize ${mission} under DigiSynq orchestration.`;
      }

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Esc key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const modalOpen = params.get('modal');

  if (type || modalOpen === 'synq') {
    const modal = document.getElementById('synqModal');
    if (modal) {
      if (type) {
        const roleSelect = modal.querySelector('select');
        if (roleSelect) roleSelect.value = type;
      }
      modal.classList.add('active');
    }
  }
}

/* ==========================================================================
   09. COMPLETE 3D DEPTH & TILT SYSTEM
   ========================================================================== */
function init3DEffects() {
  // Inject depth orbs once
  if (!document.querySelector('.bg-orb')) {
    ['bg-orb--cyan','bg-orb--violet','bg-orb--yellow'].forEach(cls => {
      const d = document.createElement('div');
      d.className = 'bg-orb ' + cls;
      document.body.appendChild(d);
    });
  }

  // Scroll 3D reveal
  const revealEls = document.querySelectorAll('.ins-section, .about-section');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) ent.target.classList.add('in-view');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
  // first hero visible immediately
  document.querySelectorAll('.ins-hero, .about-hero').forEach(h => {
    const sec = h.nextElementSibling;
    if (sec && sec.classList.contains('ins-section')) sec.classList.add('in-view');
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth <= 768) return;

  const cards = document.querySelectorAll('.ins-card, .subpage-card, .stage-detail-card, .founder-card, .mission-card-expanded, .eco-node-card, .bento-card, .waste-card, .unlock-card, .scenario-card, .eco-tier-card, .leakage-card');
  cards.forEach(card => {
    card.classList.add('tilt-3d');
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const mx = (x / r.width - 0.5) * 2;
      const my = (y / r.height - 0.5) * -2;
      card.style.setProperty('--mx', mx.toFixed(3));
      card.style.setProperty('--my', my.toFixed(3));
      card.style.setProperty('--glow-x', `${(x / r.width * 100).toFixed(1)}%`);
      card.style.setProperty('--glow-y', `${(y / r.height * 100).toFixed(1)}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '0');
      card.style.setProperty('--my', '0');
    });
  });

  // Hero parallax on mouse — stronger depth
  const hero = document.querySelector('.ins-hero, .about-hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      const title = hero.querySelector('.ins-hero-title, .hero-headline');
      const desc = hero.querySelector('.ins-hero-desc');
      if (title) title.style.transform = `translateZ(36px) translate(${mx*16}px, ${my*10}px)`;
      if (desc) desc.style.transform = `translateZ(14px) translate(${mx*10}px, ${my*8}px)`;
      // move orbs slightly
      document.querySelectorAll('.bg-orb').forEach((orb,i) => {
        orb.style.transform = `translate3d(${mx*(8+i*4)}px, ${my*(6+i*3)}px, -${80+i*20}px)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      const title = hero.querySelector('.ins-hero-title, .hero-headline');
      const desc = hero.querySelector('.ins-hero-desc');
      if (title) title.style.transform = 'translateZ(28px)';
      if (desc) desc.style.transform = 'translateZ(14px)';
    });
  }
}

/* ==========================================================================
   9870089044 CONTROLLER: KEYPAD DIAL PAD, HOTKEYS & DYNAMIC LOGO
   ========================================================================== */
function init9870089044Controller() {
  const dynamicLogo = document.getElementById('dynamicLogo');
  const dialpadDrawer = document.getElementById('dialpadDrawer');
  const openDrawerBtns = document.querySelectorAll('[data-open-dialpad]');
  const closeDrawerBtn = document.getElementById('closeDialpadDrawer');

  // Drawer Toggle
  if (dialpadDrawer) {
    openDrawerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        dialpadDrawer.classList.toggle('is-open');
      });
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', () => {
        dialpadDrawer.classList.remove('is-open');
      });
    }

    dialpadDrawer.addEventListener('click', (e) => {
      if (e.target === dialpadDrawer) {
        dialpadDrawer.classList.remove('is-open');
      }
    });
  }

  // Keyboard Hotkeys: press 0-9 to dial or jump to node!
  document.addEventListener('keydown', (e) => {
    // If typing in input or textarea, ignore
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      if (dialpadDrawer) dialpadDrawer.classList.toggle('is-open');
      return;
    }

    if (e.key === 'Escape') {
      if (dialpadDrawer && dialpadDrawer.classList.contains('is-open')) {
        dialpadDrawer.classList.remove('is-open');
      }
      return;
    }

    // Number keys 0 to 9 navigate to dedicated node pages
    const pageMap = {
      '1': 'node-01.html',
      '2': 'node-02.html',
      '3': 'node-03.html',
      '4': 'node-04.html',
      '5': 'node-05.html',
      '6': 'node-06.html',
      '7': 'node-07.html',
      '8': 'node-08.html',
      '9': 'node-09.html',
      '0': 'node-10.html'
    };

    if (pageMap[e.key]) {
      document.body.classList.add('page-exit');
      setTimeout(() => {
        window.location.href = pageMap[e.key];
      }, 190);
    }
  });

  // Dynamic Logo & Node tracking via IntersectionObserver
  const sections = document.querySelectorAll('[data-node-id]');
  if (sections.length > 0 && dynamicLogo) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nodeId = entry.target.getAttribute('data-node-id');
          const nodeName = entry.target.getAttribute('data-node-name') || 'SYNQ';
          const logoText = dynamicLogo.querySelector('.logo-text') || dynamicLogo;
          logoText.innerHTML = `${nodeId}<span class="dynamic-logo-node-badge">.${nodeName}</span>`;
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(sec => observer.observe(sec));
  }
}

/* ==========================================================================
   APPLE LIQUID MOTION: FLUID PAGE TRANSITIONS & TACTILE MAGNETIC DIALS
   ========================================================================== */
function initAppleLiquidMotions() {
  // 1. Remove exit class on page load to bloom into view
  document.body.classList.remove('page-exit');

  // 2. Intercept local navigation links for seamless fluid cross-dissolve
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore anchors, external links, mailto, tel, javascript
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    // Ignore if modified click (ctrl/meta/shift/alt or target="_blank")
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') {
      return;
    }

    e.preventDefault();
    document.body.classList.add('page-exit');

    setTimeout(() => {
      window.location.href = href;
    }, 190);
  });

  // 3. Tactile Magnetic / Parallax liquid physics for dialpad circles
  const dialItems = document.querySelectorAll('.node-key-item');
  dialItems.forEach(item => {
    const circle = item.querySelector('.node-key-circle');
    const digit = item.querySelector('.node-key-digit');
    if (!circle) return;

    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      circle.style.transform = `scale(1.12) translate(${x * 0.12}px, ${y * 0.12 - 4}px)`;
      if (digit) {
        digit.style.transform = `scale(1.05) translate(${x * 0.08}px, ${y * 0.08}px)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      circle.style.transform = '';
      if (digit) {
        digit.style.transform = '';
      }
    });
  });
}

/* ==========================================================================
   DESIGN EXPERIMENTATION — CURSOR SPECULAR & SVG GOOEY FILTERS
   ========================================================================== */
function initSpecularCursorTracking() {
  document.addEventListener('pointermove', (e) => {
    document.querySelectorAll('.pastel-card, .schematic-frame-box').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }, { passive: true });
}

function injectSvgGooeyFilter() {
  if (document.getElementById('gooeySvgFilter')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'gooeySvgFilter';
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  svg.style.pointerEvents = 'none';
  svg.innerHTML = `
    <defs>
      <filter id="gooeyFilter">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);
}

/* 3D Tactile Card Tilt & Perspective Physics */
function init3DEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const cards = document.querySelectorAll('.pastel-card, .schematic-frame-box');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (y / (rect.height / 2)) * -3.5;
      const rotY = (x / (rect.width / 2)) * 3.5;
      
      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });

  initFilmGrain();
}

/* 35mm Celluloid Cinematic Film Grain Texture */
function initFilmGrain() {
  if (document.getElementById('filmGrainCanvas')) return;
  const grain = document.createElement('canvas');
  grain.id = 'filmGrainCanvas';
  grain.style.position = 'fixed';
  grain.style.top = '0';
  grain.style.left = '0';
  grain.style.width = '100vw';
  grain.style.height = '100vh';
  grain.style.pointerEvents = 'none';
  grain.style.zIndex = '99999';
  grain.style.opacity = '0.032';
  grain.style.mixBlendMode = 'overlay';
  document.body.appendChild(grain);

  const ctx = grain.getContext('2d');
  function resizeGrain() {
    grain.width = window.innerWidth / 2;
    grain.height = window.innerHeight / 2;
  }
  resizeGrain();
  window.addEventListener('resize', resizeGrain);

  function generateNoise() {
    const w = grain.width;
    const h = grain.height;
    if (w <= 0 || h <= 0) return;
    const imgData = ctx.createImageData(w, h);
    const buffer = new Uint32Array(imgData.data.buffer);
    const len = buffer.length;
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.12) {
        buffer[i] = (Math.random() * 255) | 0xff000000;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  let noiseTimer = null;
  function loopNoise() {
    generateNoise();
    noiseTimer = setTimeout(() => requestAnimationFrame(loopNoise), 70);
  }
  loopNoise();
}


/* ==========================================================================
   DIGISYNQ MASTER MERGED CONCEPT — PIPELINE & INTAKE WIDGETS
   ========================================================================== */

const PIPELINE_DATA = {
  'A': {
    code: 'NODE A',
    title: 'TALENT & ARTISAN GUILDS',
    subtitle: 'Verified Cast, Crew & Craft Pods',
    desc: 'Bypasses informal gatekeepers and unauthenticated hearsay. Digisynq verifies technicians, cinematographers, light masters, and stunt teams by verified credits and insurance standing, synchronizing their confirmed availability.',
    input: 'Guild membership ID, verified camera roll credits, real-time booking availability window',
    verification: 'Mutual identity hashing, FWICE/Union parity check, verified call-sheet history',
    output: 'Locked crew attachment agreement with pre-cleared escrow milestone pay scale'
  },
  'B': {
    code: 'NODE B',
    title: 'PLACES & SOUNDSTAGES',
    subtitle: 'Acoustic Lots, LED Volumes & Dark-Day Slots',
    desc: 'Soundstages carry massive overhead during dark calendar days between major shoots. DigiSynq indexes physical lot dimensions, NC acoustic ratings, and silent power capacity to route rapid-turnaround commercial and indie shoots into open calendar gaps.',
    input: 'Lot dimensions (sq ft), acoustic NC rating, silent grid height, calendar gap dates',
    verification: 'Physical telemetry verification, fire safety permits, acoustic STC-62 certificate',
    output: 'Confirmed stage rental yield agreement at dynamic gap-occupancy rates'
  },
  'C': {
    code: 'NODE C',
    title: 'OPTICS & HARDWARE FLEETS',
    subtitle: 'ARRI 35, RED V-Raptor, Anamorphics & Grip Trucks',
    desc: 'Cinema camera packages and prime lenses spend up to 35% of their lifecycle sitting in rental house vaults. DigiSynq turns idle equipment fleets into real-time deployable packages with escrow replacement guarantees.',
    input: 'Sensor packages, serial registry, lens MTF chart diagnostics, grip truck payload specs',
    verification: 'Optical collimation check, rental house insurance endorsement, clean serial check',
    output: 'Mobilized cinema package with pre-funded security deposit and rapid courier delivery'
  },
  'D': {
    code: 'NODE D',
    title: 'CAPITAL & ESCROW CLEARING',
    subtitle: 'Milestone-Based Liquidity & Waterfall Transparency',
    desc: 'Capital sits on the sidelines when milestone risk is opaque. DigiSynq structures milestone-governed escrow smart contracts. Funds release automatically upon verified daily wrap logs and checksummed raw footage delivery.',
    input: 'Production budget waterfall, approved milestone schedule, completion guarantor terms',
    verification: 'Dual-signoff multi-sig release, ACES hash verification, union payroll clearance',
    output: 'Zero-delay liquidity disbursements without predatory bridge broker discounts'
  },
  'E': {
    code: 'NODE E',
    title: 'POST, VFX & SOUND CONFORM',
    subtitle: 'ACES Color Grading, Dolby Atmos & Distributed Render',
    desc: 'Eliminates workflow gridlock where raw dailies sit stranded. Coordinates same-day checksummed proxy delivery directly to editorial suites, scheduling calibrated color suites and Dolby Atmos mix stages at off-peak efficiency.',
    input: 'Camera raw MD5 checksums, XML/EDL conforms, sound sync logs, ACES 2.0 color pipelines',
    verification: 'Automated frame-drop and Bit-Depth verification, calibrated monitor profile QC',
    output: 'Broadcast-grade theatrical DCP and HDR streaming master ready for QC signoff'
  },
  'F': {
    code: 'NODE F',
    title: 'DISTRIBUTION & MICRO-CIRCUITS',
    subtitle: 'Theatrical Networks, Single Screens & Global OTT',
    desc: 'Connects sovereign finished films directly to audience clusters. Schedules targeted theatrical micro-circuits across Tier-1/Tier-2 screens, multi-territory FAST syndication, and unbundled regional streaming windows.',
    input: 'Theatrical DCP, censor certifications, territory rights boundary matrix, localized subs/dubs',
    verification: 'Box-office ticketing API synchronization, digital rights management token validation',
    output: 'Multi-window monetization pathway with 100% retained creator sovereignty'
  }
};

function initPipelineTabs() {
  const tabs = document.querySelectorAll('.pipeline-tab-btn');
  const display = document.getElementById('pipelineDisplay');
  if (!tabs.length || !display) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-pipeline-key');
      const data = PIPELINE_DATA[key];
      if (!data) return;

      if (window.DigiSynqSound) window.DigiSynqSound.playClick();

      display.innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <div class="mono" style="font-size:0.75rem;font-weight:800;color:#FF5200;letter-spacing:0.18em;margin-bottom:0.35rem;">
            ${data.code} &bull; ${data.subtitle}
          </div>
          <h3 style="font-size:clamp(1.5rem, 3vw, 2.2rem);font-weight:800;color:#ffffff;margin:0 0 0.75rem;text-transform:uppercase;">
            ${data.title}
          </h3>
          <p style="font-size:1.05rem;line-height:1.75;color:#cbd5e1;max-width:880px;margin:0;">
            ${data.desc}
          </p>
        </div>
        <div class="pipeline-spec-grid">
          <div class="pipeline-spec-box">
            <div class="pipeline-spec-box-title">INPUT TELEMETRY FEED:</div>
            <p style="color:#ffffff;font-size:0.92rem;line-height:1.6;margin:0;">${data.input}</p>
          </div>
          <div class="pipeline-spec-box">
            <div class="pipeline-spec-box-title">VERIFICATION STANDARD:</div>
            <p style="color:#FF5200;font-size:0.92rem;line-height:1.6;margin:0;">${data.verification}</p>
          </div>
          <div class="pipeline-spec-box">
            <div class="pipeline-spec-box-title">DEPLOYED SYSTEM OUTPUT:</div>
            <p style="color:#ffffff;font-size:0.92rem;line-height:1.6;margin:0;">${data.output}</p>
          </div>
        </div>
      `;
    });
  });
}

const INTAKE_PERSONAS = {
  'stage': {
    title: 'Soundstage / Studio Lot Operator',
    badge: 'ECOSYSTEM CATEGORY 03 INTAKE',
    checklist: [
      'Acoustic rating (NC-20 / NC-25) & STC documentation',
      'Silent grid height & hoist weight certifications',
      'Upcoming unbooked calendar gaps (3 to 21 day windows)',
      'Power distribution specs (1200A-2400A silent generator capacity)'
    ],
    outcome: 'Immediate monetization of dark stage days with verified commercial & streaming productions.',
    nodeTarget: 'node-10.html'
  },
  'producer': {
    title: 'Film & Series Producer / Director',
    badge: 'ECOSYSTEM CATEGORY 02 INTAKE',
    checklist: [
      'Project scope, target shooting dates, and territory footprint',
      'Specific missing node bottlenecks (e.g. stage, optical kit, DP, post)',
      'Pre-cleared escrow milestone budget authorization',
      'Target distribution windows (Theatrical, OTT, Festival)'
    ],
    outcome: 'Direct, broker-free attachment of synchronized stages, crew pods, and gear fleets.',
    nodeTarget: 'node-10.html'
  },
  'gear': {
    title: 'Equipment House / Fleet Owner',
    badge: 'ECOSYSTEM CATEGORY 04 INTAKE',
    checklist: [
      'Camera packages (ARRI, RED, Sony Venice) serial register',
      'Optical prime & anamorphic fleets with service calibration logs',
      'Grip, electric, dolly & technocrane transport units',
      'Available downtime gaps between scheduled main-unit rentals'
    ],
    outcome: 'Continuous hardware fleet yield with full insurance indemnity and replacement escrow.',
    nodeTarget: 'node-10.html'
  },
  'talent': {
    title: 'Talent Guild / Key Department Head',
    badge: 'ECOSYSTEM CATEGORY 02 INTAKE',
    checklist: [
      'Verified IMDb / call-sheet primary credits and craft discipline',
      'Guild affiliation (WGA, DGA, ISC, SICA, FWICE, or independent standing)',
      'Verified open booking windows across regional hubs',
      'Transparent milestone compensation preferences'
    ],
    outcome: 'Guaranteed milestone payment security and priority pairing with funded production pods.',
    nodeTarget: 'node-10.html'
  },
  'capital': {
    title: 'Financier / Institutional Escrow Partner',
    badge: 'ECOSYSTEM CATEGORY 08 INTAKE',
    checklist: [
      'Target deployment ticket size ($100K to $15M+)',
      'Preferred risk-adjusted yield & milestone repayment waterfalls',
      'Co-production attachment and regional tax-credit incentives',
      'Completion bond escrow parameters'
    ],
    outcome: 'Real-time telemetry visibility on production milestones and automated escrow release.',
    nodeTarget: 'node-10.html'
  }
};

function initIntakeWizard() {
  const cards = document.querySelectorAll('.intake-persona-card');
  const detailsBox = document.getElementById('intakeDetailsBox');
  if (!cards.length || !detailsBox) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const personaKey = card.getAttribute('data-persona');
      const p = INTAKE_PERSONAS[personaKey];
      if (!p) return;

      if (window.DigiSynqSound) window.DigiSynqSound.playClick();

      let listHtml = p.checklist.map(item => `
        <li style="display:flex;align-items:baseline;gap:0.6rem;margin-bottom:0.4rem;">
          <span style="color:#FF5200;font-weight:900;">&bull;</span>
          <span>${item}</span>
        </li>
      `).join('');

      detailsBox.innerHTML = `
        <div style="border:1px solid rgba(255, 82, 0,0.3);background:rgba(255, 82, 0,0.03);padding:1.5rem;border-radius:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
            <div class="mono" style="font-size:0.75rem;color:#FF5200;font-weight:800;letter-spacing:0.15em;">
              ${p.badge} &bull; ${p.title}
            </div>
            <span class="mono" style="font-size:0.7rem;color:#94a3b8;background:rgba(255,255,255,0.06);padding:0.25rem 0.6rem;border-radius:4px;">
              INTAKE AUDIT: PRE-CLEARED
            </span>
          </div>
          <h4 style="font-size:1.25rem;color:#ffffff;font-weight:700;margin:0 0 0.75rem;">
            Prerequisites for Synchronized Intake:
          </h4>
          <ul style="list-style:none;padding:0;margin:0 0 1.25rem;font-size:0.95rem;line-height:1.7;color:#cbd5e1;">
            ${listHtml}
          </ul>
          <div style="padding-top:1rem;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
            <div style="font-size:0.9rem;color:#94a3b8;max-width:550px;">
              <strong style="color:#FF5200;">System Outcome:</strong> ${p.outcome}
            </div>
            <a href="node-10.html" class="btn btn-primary" style="font-size:0.88rem;padding:0.65rem 1.4rem;">
              SUBMIT INTAKE IN NODE 10 &rarr;
            </a>
          </div>
        </div>
      `;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPipelineTabs();
  initIntakeWizard();
});


