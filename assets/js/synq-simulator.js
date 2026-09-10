/**
 * DIGISYNQ — Interactive Coordination Engine Simulator ("SEE A SYNQ HAPPEN")
 *
 * Implements the tri-mode selection:
 * - [I HAVE SOMETHING] (Talent, IP, Stage, Equipment, Capital, Audience, Distribution, Technology, Project, Opportunity)
 * - [I NEED SOMETHING] (Talent, IP, Stage, Equipment, Capital, Audience, Distribution, Technology, Solution)
 * - [I AM BLOCKED]     (Stage Conflict, Missing Key HoD, Trapped IP, Post Bottleneck, Capital Latency)
 *
 * Demonstrates the 7-step coordination progression:
 * MEASURE → IDENTIFY NODES → FIND CONNECTIONS → COORDINATE → ACTIVATE → MONITOR → OUTCOME
 *
 * Generates an institutional Synq Manifest clearly stamped with [SIMULATED].
 */

(function () {
  'use strict';

  const SIMULATION_DATA = {
    // I HAVE
    'have_stage': {
      mode: 'I HAVE',
      node: '04 PLACES (Soundstage Facility)',
      inputLabel: 'Dark Soundstage (22,000 sq ft, 3-Week Window)',
      mission: 'Mission 02: Idle Capacity Activation',
      matchedNodes: ['03 PRODUCTION (Independent Drama Series)', '05 ASSETS (Optics Package)', '07 CAPITAL (Regional Incentive)'],
      steps: {
        measure: 'Telemetry detects 21 unbooked stage days between Tier-1 studio hires.',
        identify: 'Matched to scripted streaming unit facing 2-week regional venue displacement.',
        connect: 'Mapped acoustic specs, power load requirements, and rigging clearance.',
        coordinate: 'Standardized rate bridge, load-in dates, and milestone security terms.',
        activate: 'Dual-party mandate locked. Crew call sheet attachments verified.',
        monitor: 'Stage power draw, environmental compliance, and milestone check-ins monitored.',
        outcome: 'Stage utilized at full occupancy; production timeline saved from 18-day stall.'
      },
      frictionResolved: 'Eliminated facility dark days & prevented $180k delay overhead.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },
    'have_ip': {
      mode: 'I HAVE',
      node: '02 IDEAS & IP (Turnaround Rights)',
      inputLabel: 'Shelved Sci-Fi Thriller Script (Unencumbered Rights)',
      mission: 'Mission 03: IP Revival',
      matchedNodes: ['01 PEOPLE (Lead Director Attachment)', '07 CAPITAL (Co-Production Facility)', '08 DISTRIBUTION (Pre-Sales FAST/OTT)'],
      steps: {
        measure: 'Rights audited for chain of title, territory exclusions, and underlying credits.',
        identify: 'Matched to BAFTA-nominated genre director and European co-financing corridor.',
        connect: 'Synchronized development milestones, director schedule, and target market audience.',
        coordinate: 'Aligned non-dilutive co-production terms and transparent milestone waterfall.',
        activate: 'Development tranche funded; production package activated.',
        monitor: 'Script polish milestones and attachment confirmations tracked.',
        outcome: 'Dormant catalogue asset converted into active pre-production pipeline.'
      },
      frictionResolved: 'Compressed revival discovery from 14 months to 11 days.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },
    'have_equipment': {
      mode: 'I HAVE',
      node: '05 ASSETS (Camera & Optics)',
      inputLabel: 'Idle Anamorphic Lens Fleet & Mobile DIT Cart',
      mission: 'Mission 09: Asset Utilization',
      matchedNodes: ['03 PRODUCTION (Commercial Automotive Sprint)', '01 PEOPLE (IATSE DP Unit)', '06 TECHNOLOGY (Colour Pipeline)'],
      steps: {
        measure: 'Hardware diagnostics and maintenance certification verified.',
        identify: 'Commercial unit in adjacent metro requires 4-day high-end anamorphic package.',
        connect: 'Logistics corridor, optical calibration specs, and insurance certificates linked.',
        coordinate: 'Pre-cleared turnaround terms and equipment return escrow conditions set.',
        activate: 'Courier dispatch triggered; package received on set.',
        monitor: 'Equipment custody handoff logged with digital asset inspection.',
        outcome: 'Hardware generates productive yield during scheduled downtime.'
      },
      frictionResolved: 'Zero idle equipment depreciation; instant turnaround match.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },
    'have_talent': {
      mode: 'I HAVE',
      node: '01 PEOPLE (Guild HoD / Artisan)',
      inputLabel: 'Emmy-Nominated Production Designer (Available in 10 Days)',
      mission: 'Mission 04: Talent Synq',
      matchedNodes: ['03 PRODUCTION (Historical Drama Feature)', '04 PLACES (UK Studio Lot)', '07 CAPITAL (Tax Credit Unit)'],
      steps: {
        measure: 'Availability schedule, union jurisdiction, and design portfolio indexed.',
        identify: 'Historical feature in pre-production requiring rapid period world-building.',
        connect: 'Cross-referenced production calendar, prep requirements, and location logistics.',
        coordinate: 'Deal memo aligned with guild minimums and milestone approvals.',
        activate: 'Contractual attachment executed; remote art department onboarding initiated.',
        monitor: 'Art department delivery schedule tracked against shoot commencement.',
        outcome: 'Key HoD attached without agency latency; design prep commenced on schedule.'
      },
      frictionResolved: 'Saved 3 weeks of talent representation search friction.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },
    'have_capital': {
      mode: 'I HAVE',
      node: '07 CAPITAL (Financing & Incentives)',
      inputLabel: 'Structured Gap Financing & State Tax Credit Facility',
      mission: 'Mission 11: Capital Synq',
      matchedNodes: ['03 PRODUCTION (Indie Feature in Prep)', '08 DISTRIBUTION (Minimum Guarantee)', '02 IDEAS & IP (Clean Title)'],
      steps: {
        measure: 'Capital mandate verified against eligible jurisdiction criteria and drawdown schedule.',
        identify: 'Package-ready indie feature requiring final closing gap tranche.',
        connect: 'Collateralized against verified sales estimates and qualifying regional expenditures.',
        coordinate: 'Escrow milestone conditions, interest corridors, and completion guarantor linked.',
        activate: 'Drawdown milestones released upon verifiable third-party completions.',
        monitor: 'Daily expenditure tracking and production audit compliance verified.',
        outcome: 'Project closes financing gap and meets regional tax credit qualification window.'
      },
      frictionResolved: 'Overcame 8-week financing freeze in 72 hours.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },

    // I NEED
    'need_distribution': {
      mode: 'I NEED',
      node: '08 DISTRIBUTION (Market Clearing)',
      inputLabel: 'Completed Independent Festival Feature Seeking Territorial Windows',
      mission: 'Mission 07: Distribution Clearing',
      matchedNodes: ['08 DISTRIBUTION (AVOD/FAST Network)', '09 AUDIENCE (Genre Fandom)', '02 IDEAS & IP (Ancillary Rights)'],
      steps: {
        measure: 'Asset deliverables, technical QC specs, and worldwide rights availability checked.',
        identify: '3 regional boutique theatrical curators and North American FAST syndicators matched.',
        connect: 'Multi-window release strategy mapped preserving sovereign digital rights.',
        coordinate: 'Transparent royalty waterfalls and verifiable streaming reporting terms set.',
        activate: 'Digital deliverables ingested; licensing windows opened.',
        monitor: 'Impression velocity, audience completion rates, and platform disbursements tracked.',
        outcome: 'Completed film reaches active paying audiences across 4 unbundled windows.'
      },
      frictionResolved: 'Bypassed predatory single-buyer all-rights buyout traps.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },
    'need_post': {
      mode: 'I NEED',
      node: '06 TECHNOLOGY (Post-Production)',
      inputLabel: 'Dolby Atmos Sound Mixing & Remote Colour Grading Facility',
      mission: 'Mission 10: Post-Production Recovery',
      matchedNodes: ['06 TECHNOLOGY (Certified Mix Suite)', '01 PEOPLE (Supervising Sound Editor)', '03 PRODUCTION (Final Delivery Cut)'],
      steps: {
        measure: 'Timeline urgency, conform format, and delivery technical specifications indexed.',
        identify: 'Certified post facility in London with 10 open calendar days between studio bookings.',
        connect: 'High-speed encrypted proxy sync and remote review infrastructure configured.',
        coordinate: 'Milestone delivery schedule and mix approvals locked with escrow protection.',
        activate: 'Conformed master files ingested into secure pipeline; mix sessions commence.',
        monitor: 'Approval stems and stem delivery milestones logged in real time.',
        outcome: 'Picture and sound deliver on festival deadline without expedite penalty fees.'
      },
      frictionResolved: 'Resolved critical post-production delivery bottleneck in 48 hours.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },
    'need_stage': {
      mode: 'I NEED',
      node: '04 PLACES (Virtual Production Stage)',
      inputLabel: 'Virtual Production LED Volume (In-Camera VFX for 5-Day Shoot)',
      mission: 'Mission 01: Project Activation',
      matchedNodes: ['04 PLACES (Certified LED Volume)', '06 TECHNOLOGY (Unreal Engine Team)', '05 ASSETS (Tracking System)'],
      steps: {
        measure: 'Shooting dates, frustum tracking requirements, and LED pitch specifications analyzed.',
        identify: 'Regional studio volume with unexpected rescheduling gap matched.',
        connect: 'Digital asset pipeline pre-calibrated for real-time camera tracking.',
        coordinate: 'Volume technician rates, stage hours, and load-in milestones agreed.',
        activate: 'Digital environment loaded into engine; live test shoot passes QC.',
        monitor: 'Stage operations and telemetry monitored across the 5 shoot days.',
        outcome: 'Production executes complex VFX scenes in-camera without location travel costs.'
      },
      frictionResolved: 'Eliminated 6 weeks of location scouting and post-VFX turnaround latency.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },

    // I AM BLOCKED
    'blocked_schedule': {
      mode: 'I AM BLOCKED',
      node: '03 PRODUCTION (Disrupted Schedule)',
      inputLabel: 'Principal Photography Stalled: Location Permitting Revoked 48h Before Call',
      mission: 'Mission 05: Production Recovery',
      matchedNodes: ['04 PLACES (Permitted Standing Backlot)', '01 PEOPLE (Local Production Service)', '03 PRODUCTION (Active Crew)'],
      steps: {
        measure: 'Immediate requirements extracted: architectural style, power needs, crew headcount.',
        identify: 'Surfaced pre-cleared private studio backlot located 35 miles away.',
        connect: 'Re-routed logistics, local permits, and equipment transport manifests.',
        coordinate: 'Emergency location agreement signed under standardized DigiSynq terms.',
        activate: 'Crew notifications dispatched; basecamp relocated overnight.',
        monitor: 'Day-one shoot schedule monitored for continuity and crew safety.',
        outcome: 'Production resumes filming on schedule with zero lost shoot days.'
      },
      frictionResolved: 'Avoided an estimated $420k production shutdown insurance claim.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    },
    'blocked_capital': {
      mode: 'I AM BLOCKED',
      node: '07 CAPITAL (Incentive Bridging Delay)',
      inputLabel: 'State Rebate Processing Delayed 90 Days; Payroll Threatened',
      mission: 'Mission 13: Risk Intelligence',
      matchedNodes: ['07 CAPITAL (Incentive Bridging Lender)', '03 PRODUCTION (Payroll Accounts)', '01 PEOPLE (Cast & Crew)'],
      steps: {
        measure: 'Verified audit letters, approved spend ledgers, and state agency acknowledgment.',
        identify: 'Matched to institutional entertainment liquidity partner with pre-cleared rebate appetite.',
        connect: 'Collateralized bridge financing structure mapped with direct payroll disbursement.',
        coordinate: 'Tripartite agreement between producer, lender, and state tax authority established.',
        activate: 'Short-term bridge facility executed; payroll obligations met on Friday.',
        monitor: 'Disbursement reconciliation and state payment tracking maintained.',
        outcome: 'Production continues uninterrupted without guild action or crew walkouts.'
      },
      frictionResolved: 'Saved project from catastrophic insolvency and union stop-work order.',
      statusTaxonomy: '[SIMULATED BENCHMARK]'
    }
  };

  function initSimulator() {
    const root = document.getElementById('synq-simulator-root');
    if (!root) return;

    const modeTabs = root.querySelectorAll('[data-sim-mode]');
    const triggerSelect = root.getElementById ? root.getElementById('simConditionSelect') : document.getElementById('simConditionSelect');
    const runBtn = document.getElementById('runSimulatorBtn');
    const progressBox = document.getElementById('simProgressBox');
    const manifestBox = document.getElementById('simManifestResult');

    if (!runBtn || !triggerSelect || !progressBox || !manifestBox) return;

    let activeMode = 'have';

    // Populate dropdown based on mode
    function updateOptions(mode) {
      triggerSelect.innerHTML = '';
      activeMode = mode;

      const keys = Object.keys(SIMULATION_DATA).filter(k => k.startsWith(mode + '_'));
      keys.forEach(k => {
        const item = SIMULATION_DATA[k];
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = `${item.node} — ${item.inputLabel}`;
        triggerSelect.appendChild(opt);
      });
    }

    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.getAttribute('data-sim-mode');
        updateOptions(mode);
      });
    });

    // Initial populate
    updateOptions('have');

    runBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedKey = triggerSelect.value;
      const data = SIMULATION_DATA[selectedKey] || SIMULATION_DATA['have_stage'];

      runBtn.disabled = true;
      runBtn.innerHTML = '<span>COORDINATING SYSTEM...</span>';
      manifestBox.style.display = 'none';
      progressBox.style.display = 'block';

      const sequence = [
        { name: 'MEASURE', detail: data.steps.measure },
        { name: 'IDENTIFY NODES', detail: data.steps.identify },
        { name: 'FIND CONNECTIONS', detail: data.steps.connect },
        { name: 'COORDINATE', detail: data.steps.coordinate },
        { name: 'ACTIVATE', detail: data.steps.activate },
        { name: 'MONITOR', detail: data.steps.monitor },
        { name: 'OUTCOME', detail: data.steps.outcome }
      ];

      let step = 0;
      renderProgressStep(sequence[0], 0, sequence.length);

      const timer = setInterval(() => {
        step++;
        if (step < sequence.length) {
          renderProgressStep(sequence[step], step, sequence.length);
          if (window.DigiSynqSound) window.DigiSynqSound.playClick();
        } else {
          clearInterval(timer);
          renderManifest(data);
          runBtn.disabled = false;
          runBtn.innerHTML = '<span>RUN COORDINATION ENGINE &rarr;</span>';
          if (window.DigiSynqSound) window.DigiSynqSound.playSynqSuccess();
        }
      }, 420);
    });

    function renderProgressStep(item, idx, total) {
      progressBox.innerHTML = `
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:1rem 1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
            <span style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:var(--b-yellow);font-weight:700;letter-spacing:0.12em;">
              STEP 0${idx + 1} OF 0${total} &bull; ${item.name}
            </span>
            <span class="bg-chip bg-chip--dark" style="font-size:0.65rem;">[SIMULATED TELEMETRY]</span>
          </div>
          <p style="font-size:0.88rem;color:#FFFFFF;margin:0;line-height:1.5;">${item.detail}</p>
        </div>
      `;
    }

    function renderManifest(data) {
      progressBox.style.display = 'none';
      manifestBox.style.display = 'block';

      const nodesHtml = data.matchedNodes.map(n => `
        <span style="display:inline-block;padding:0.25rem 0.6rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#FFFFFF;margin:0.2rem 0.3rem 0.2rem 0;">
          ${n}
        </span>
      `).join('');

      manifestBox.innerHTML = `
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:1.5rem;margin-top:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:1.25rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <span style="width:8px;height:8px;border-radius:50%;background:#10B981;display:inline-block;"></span>
              <span style="font-family:'JetBrains Mono',monospace;font-size:0.8rem;font-weight:800;color:#FFFFFF;letter-spacing:0.12em;">
                SYNQ MANIFEST #${Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <span class="bg-chip bg-chip--dark" style="font-size:0.7rem;color:#FEF08A;border-color:rgba(254,240,138,0.3);">
                ${data.statusTaxonomy}
              </span>
              <span class="bg-chip bg-chip--outline-white" style="font-size:0.7rem;">COORDINATED</span>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;margin-bottom:1.25rem;">
            <div>
              <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:rgba(255,255,255,0.5);display:block;margin-bottom:0.25rem;">ORIGIN NODE</span>
              <div style="font-weight:700;color:#FFFFFF;font-size:0.9rem;">${data.node}</div>
              <div style="font-size:0.8rem;color:rgba(255,255,255,0.75);margin-top:0.2rem;">${data.inputLabel}</div>
            </div>
            <div>
              <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:rgba(255,255,255,0.5);display:block;margin-bottom:0.25rem;">COORDINATION PATTERN</span>
              <div style="font-weight:700;color:#FFFFFF;font-size:0.9rem;">${data.mission}</div>
              <div style="font-size:0.8rem;color:rgba(255,255,255,0.75);margin-top:0.2rem;">Deterministic Execution Path</div>
            </div>
          </div>

          <div style="margin-bottom:1.25rem;">
            <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:rgba(255,255,255,0.5);display:block;margin-bottom:0.4rem;">COORDINATED ECOSYSTEM NODES</span>
            <div>${nodesHtml}</div>
          </div>

          <div style="background:rgba(255,255,255,0.03);border-left:3px solid #FEF08A;padding:0.75rem 1rem;border-radius:0 6px 6px 0;margin-bottom:1.25rem;">
            <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:#FEF08A;font-weight:700;display:block;margin-bottom:0.2rem;">SYSTEMIC VALUE CREATED</span>
            <p style="font-size:0.85rem;color:#FFFFFF;margin:0;line-height:1.4;">${data.frictionResolved}</p>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.08);">
            <span style="font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:rgba(255,255,255,0.4);">
              Nothing is waste. Everything is potential.
            </span>
            <a href="start-a-synq.html" class="bg-btn bg-btn--primary" style="font-size:0.78rem;padding:0.45rem 0.9rem;">
              Activate This Synq &rarr;
            </a>
          </div>
        </div>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', initSimulator);
})();
