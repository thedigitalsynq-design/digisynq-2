/**
 * DIGISYNQ — Client-side Interaction Controller (Apple Liquid Motion & Editorial UI)
 * Handles Apple Liquid Scroll Reveals, Coordination Ledger, Command Palette (⌘K), Accessible Nav, and Dynamic Intake.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageFade();
  initLiquidMotion();
  initMobileNavigation();
  initCommandPalette();
  initLinearHeroAppFrame();
  initTimelineScrubber();
  initDynamicIntakeForm();
  initAccordions();
});

/* ==========================================================================
   00. APPLE LIQUID SCROLL REVEAL & FLUID MOTION CONTROLLER
   ========================================================================== */
function initLiquidMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Auto-tag key structural sections for organic fluid scroll reveals
  const revealTargets = document.querySelectorAll('.section-block, .editorial-split, .bento-grid, .cta-banner, .table-container');
  revealTargets.forEach(el => {
    el.classList.add('liquid-reveal');
  });

  // Stagger reveal on grid children
  document.querySelectorAll('.bento-grid, .grid-2, .grid-3, .grid-4').forEach(grid => {
    Array.from(grid.children).forEach((child, index) => {
      child.classList.add('liquid-reveal', `liquid-stagger-${(index % 4) + 1}`);
    });
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.liquid-reveal, .bg-reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.04,
    rootMargin: '0px 0px -20px 0px'
  });

  document.querySelectorAll('.liquid-reveal, .bg-reveal').forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   01. ACCESSIBLE MOBILE NAVIGATION
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.nav-mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');

  if (!toggleBtn || !drawer) return;

  function toggleMenu(isOpen) {
    const active = isOpen !== undefined ? isOpen : !drawer.classList.contains('active');
    drawer.classList.toggle('active', active);
    toggleBtn.setAttribute('aria-expanded', active.toString());
    document.body.style.overflow = active ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => toggleMenu());

  document.querySelectorAll('.mobile-nav-drawer a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });
}

/* ==========================================================================
   02. LINEAR COMMAND PALETTE (⌘K / CTRL+K)
   ========================================================================== */
function initCommandPalette() {
  // Inject Command Menu Modal if not already present
  if (!document.getElementById('command-palette-backdrop')) {
    const modalHTML = `
      <div id="command-palette-backdrop" class="command-palette-backdrop" role="dialog" aria-modal="true" aria-label="Command Palette">
        <div class="command-palette-modal">
          <div class="cmd-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-tertiary);">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="cmd-search-input" class="cmd-input" placeholder="Search pages, network domains, or coordination actions..." autocomplete="off">
            <kbd>ESC</kbd>
          </div>
          <ul id="cmd-results-list" class="cmd-list">
            <li><a href="index.html" class="cmd-item"><span>Home overview</span><span class="label-mono">Page</span></a></li>
            <li><a href="how-it-works.html" class="cmd-item"><span>How it works (6-step model)</span><span class="label-mono">Guide</span></a></li>
            <li><a href="solutions.html" class="cmd-item"><span>Solutions by situation</span><span class="label-mono">Page</span></a></li>
            <li><a href="platform.html" class="cmd-item"><span>Platform architecture & modules</span><span class="label-mono">Page</span></a></li>
            <li><a href="network.html" class="cmd-item"><span>Network ecosystem (8 pillars)</span><span class="label-mono">Page</span></a></li>
            <li><a href="intelligence.html" class="cmd-item"><span>Production intelligence telemetry</span><span class="label-mono">Page</span></a></li>
            <li><a href="economics.html" class="cmd-item"><span>Economics & fee schedule</span><span class="label-mono">Page</span></a></li>
            <li><a href="trust.html" class="cmd-item"><span>Trust center & verification</span><span class="label-mono">Page</span></a></li>
            <li><a href="about.html" class="cmd-item"><span>About DigiSynq (60s summary)</span><span class="label-mono">Page</span></a></li>
            <li><a href="start-a-synq.html" class="cmd-item"><span>Start a synq (intake)</span><span class="badge badge-live">Action</span></a></li>
            <li><a href="network.html#stages" class="cmd-item"><span>Search soundstages & LED volumes</span><span class="label-mono">Domain</span></a></li>
            <li><a href="network.html#gear" class="cmd-item"><span>Search cinema equipment packages</span><span class="label-mono">Domain</span></a></li>
            <li><a href="network.html#people" class="cmd-item"><span>Search verified crew & heads of dept</span><span class="label-mono">Domain</span></a></li>
          </ul>
          <div class="cmd-footer">
            <span>Navigation: <kbd>&uarr;</kbd> <kbd>&darr;</kbd> to navigate</span>
            <span>Selection: <kbd>&crarr;</kbd> to select</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const backdrop = document.getElementById('command-palette-backdrop');
  const searchInput = document.getElementById('cmd-search-input');
  const resultsList = document.getElementById('cmd-results-list');
  const cmdTriggers = document.querySelectorAll('[data-open-cmd]');

  function openPalette() {
    backdrop.classList.add('active');
    searchInput.value = '';
    filterResults('');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closePalette() {
    backdrop.classList.remove('active');
  }

  cmdTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    }
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closePalette();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePalette();
  });

  searchInput.addEventListener('input', (e) => {
    filterResults(e.target.value.toLowerCase());
  });

  function filterResults(query) {
    const items = resultsList.querySelectorAll('li');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'block' : 'none';
    });
  }
}

/* ==========================================================================
   03. LINEAR HERO APPLICATION FRAME INTERACTIVITY
   ========================================================================== */
function initLinearHeroAppFrame() {
  const issueRows = document.querySelectorAll('.linear-issue-row');
  if (!issueRows.length) return;

  const DATA_STORE = {
    'DS-108': {
      id: 'DS-108',
      title: 'Virtual Stage 95ft LED Volume Hold',
      status: 'Verified hold',
      badgeClass: 'badge-live',
      facility: 'Stage A &bull; London Heathrow Hub',
      window: 'Oct 14 – Oct 22 (8 Days)',
      power: '250kW Clean Regulated Feed',
      tracking: 'Mo-Sys StarTracker & Brompton SX40',
      escrow: 'Deposit Locked ($42,000) &bull; Chartered Bank',
      progress: '75%'
    },
    'DS-109': {
      id: 'DS-109',
      title: 'Arri Alexa 35 Anamorphic Cine Package',
      status: 'Pre-flight QC',
      badgeClass: 'badge-pilot',
      facility: 'Panavision Certified Partner &bull; Munich',
      window: 'Nov 02 – Nov 28 (26 Days)',
      power: 'B-Mount Dual Hot-Swap System',
      tracking: 'Cooke /i Anamorphic Prime Set (32, 50, 75, 100mm)',
      escrow: 'Standard Equipment Floater Verified',
      progress: '50%'
    },
    'DS-110': {
      id: 'DS-110',
      title: 'Dolby Atmos Finishing & Theatrical Conform',
      status: 'In conform',
      badgeClass: 'badge-partner',
      facility: 'Eclair Post Theatrical Suite &bull; Paris',
      window: 'Oct 01 – Oct 14 (14 Days)',
      power: '7.1.4 Dolby Atmos Calibration Matrix',
      tracking: 'ACES 1.3 / DCI-P3 Color Space Profile',
      escrow: 'Milestone 2/3 Cleared &bull; Net 24h Payout',
      progress: '66%'
    },
    'DS-111': {
      id: 'DS-111',
      title: 'Head of Department Lead Cinematographer',
      status: 'Matched',
      badgeClass: 'badge-live',
      facility: 'Guild Verified &bull; BSC / ISC Credited',
      window: 'Dec 05 – Jan 18 (Principal Photography)',
      power: 'Verified Union Minimum Compliant',
      tracking: '100% IMDb Pro Verified Credits Logged',
      escrow: 'Bilateral Deal Memo Executed',
      progress: '90%'
    }
  };

  issueRows.forEach(row => {
    row.addEventListener('click', () => {
      issueRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const issueId = row.getAttribute('data-issue-id');
      const data = DATA_STORE[issueId];
      if (!data) return;

      const detailPane = document.getElementById('linear-detail-pane');
      if (detailPane) {
        detailPane.classList.remove('linear-detail-fade');
        void detailPane.offsetWidth; // Trigger reflow for liquid cross-fade animation
        detailPane.classList.add('linear-detail-fade');
        detailPane.innerHTML = `
          <div>
            <div class="linear-detail-header">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="mono" style="font-size: 0.8rem; color: var(--accent-indigo); font-weight: 600;">${data.id}</span>
                <span class="badge ${data.badgeClass}">[${data.status}]</span>
              </div>
              <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">${data.title}</h3>
              <div class="mono" style="font-size: 0.78rem; color: var(--text-secondary);">${data.facility}</div>
            </div>

            <div class="linear-detail-prop-grid">
              <div>
                <div class="linear-prop-label">Coordination window</div>
                <div class="linear-prop-val">${data.window}</div>
              </div>
              <div>
                <div class="linear-prop-label">Power / specification</div>
                <div class="linear-prop-val">${data.power}</div>
              </div>
              <div>
                <div class="linear-prop-label">Optical / tracking</div>
                <div class="linear-prop-val">${data.tracking}</div>
              </div>
              <div>
                <div class="linear-prop-label">Regulated settlement</div>
                <div class="linear-prop-val">${data.escrow}</div>
              </div>
            </div>
          </div>

          <div style="padding-top: 1rem; border-top: 1px solid var(--border-hairline);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
              <span class="label-mono">Milestone progression</span>
              <span class="mono" style="font-size: 0.75rem; color: var(--text-primary); font-weight: 600;">${data.progress}</span>
            </div>
            <div class="linear-progress-bar">
              <div class="linear-progress-fill" style="width: ${data.progress};"></div>
            </div>
          </div>
        `;
      }
    });
  });
}

/* ==========================================================================
   04. WORKED EXAMPLE TIMELINE SCRUBBER
   ========================================================================== */
function initTimelineScrubber() {
  const tabs = document.querySelectorAll('.timeline-tab');
  const panes = document.querySelectorAll('.timeline-content-pane');

  if (!tabs.length || !panes.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* ==========================================================================
   05. DYNAMIC INTAKE ENGINE (START A SYNQ)
   ========================================================================== */
function initDynamicIntakeForm() {
  const intakeForm = document.getElementById('synq-intake-form');
  if (!intakeForm) return;

  const categoryCards = document.querySelectorAll('.intake-category-card');
  const dynamicStepContainer = document.getElementById('dynamic-questions-step');
  const stepCategoryHidden = document.getElementById('selected-category-input');
  const progressFill = document.getElementById('intake-progress-bar');

  const QUESTION_SCHEMAS = {
    'production': {
      title: 'Production Scope & Timeline',
      fields: [
        { id: 'proj_type', label: 'Production Format', type: 'select', options: ['Feature Film', 'Series / Episodic', 'Commercial / Brand', 'Documentary', 'Virtual Production'] },
        { id: 'proj_timeline', label: 'Required Coordination Window', type: 'select', options: ['Immediate (under 14 days)', '1–3 Months', '3–6 Months', 'Development / Scouting'] },
        { id: 'proj_desc', label: 'Core Requirements & Constraints', type: 'textarea', placeholder: 'Detail primary bottlenecks: shooting location, stage specs, principal crew, or completion bonds.' }
      ]
    },
    'crew': {
      title: 'Crew Requirements & Department',
      fields: [
        { id: 'crew_dept', label: 'Department Required', type: 'select', options: ['Direction & AD', 'Cinematography / Camera', 'Production Design & Art', 'Sound & Audio', 'Grip & Electric', 'VFX & Virtual Production', 'Line Production / UPM'] },
        { id: 'crew_dates', label: 'Production Dates & Location', type: 'text', placeholder: 'e.g., Nov 12 – Dec 04 | Mumbai / Hyderabad' },
        { id: 'crew_specs', label: 'Specific Seniority / Verification Level', type: 'textarea', placeholder: 'List specific credit verifications, union/guild requirements, or gear familiarity.' }
      ]
    },
    'equipment': {
      title: 'Equipment & Technical Specifications',
      fields: [
        { id: 'gear_type', label: 'Equipment Category', type: 'select', options: ['Camera Packages (Arri, Red, Sony)', 'Anamorphic / Cine Lenses', 'Lighting & Grip Trucks', 'Motion Control / Cranes', 'Sound Packages', 'LED Volume / Tracking'] },
        { id: 'gear_intent', label: 'Coordination Intent', type: 'select', options: ['I need to source equipment', 'I have underused equipment to deploy'] },
        { id: 'gear_specs', label: 'Inventory / Requirements List', type: 'textarea', placeholder: 'List package items, serial requirements, backup bodies, and prep schedule.' }
      ]
    },
    'stage': {
      title: 'Stage & Venue Capacity',
      fields: [
        { id: 'stage_type', label: 'Stage Requirement', type: 'select', options: ['Soundstage (20,000+ sq ft)', 'Virtual Production / LED Stage', 'Water Tank / Marine Stage', 'Modular Studio Space', 'Backlot Facility'] },
        { id: 'stage_intent', label: 'Coordination Intent', type: 'select', options: ['I need an available stage', 'I have available stage capacity'] },
        { id: 'stage_specs', label: 'Stage Dimensions, Power, Grid Height', type: 'textarea', placeholder: 'Include grid height, soundproofing ratings, power amp capacity, support offices.' }
      ]
    },
    'post': {
      title: 'Post-Production & VFX Coordination',
      fields: [
        { id: 'post_service', label: 'Service Pathway', type: 'select', options: ['Color Grading & DI', 'Visual Effects (VFX)', 'Sound Design & Atmos Mix', 'Editorial & Offline', 'Finishing & QC'] },
        { id: 'post_delivery', label: 'Target Master Delivery Date', type: 'text', placeholder: 'e.g., October 15' },
        { id: 'post_specs', label: 'Pipeline Requirements & Turnaround', type: 'textarea', placeholder: 'Resolution (4K/8K, ACES, HDR), shot count, deliverables specs.' }
      ]
    },
    'capital': {
      title: 'Capital & Financing Pathway Coordination',
      fields: [
        { id: 'cap_type', label: 'Financing Structure', type: 'select', options: ['Gap / Mezzanine Financing', 'Tax Incentive / Rebate Monetization', 'Pre-Sales / Minimum Guarantee', 'Completion Bond Facilitation', 'Co-Production Structuring'] },
        { id: 'cap_budget', label: 'Production Budget Range', type: 'select', options: ['Under $1M / ₹8 Cr', '$1M–$5M / ₹8–40 Cr', '$5M–$20M / ₹40–160 Cr', 'Above $20M / ₹160+ Cr'] },
        { id: 'cap_specs', label: 'Attached Elements & Security', type: 'textarea', placeholder: 'Detail attached director/cast, distributor LOIs, audited budget status.' }
      ]
    },
    'distribution': {
      title: 'Distribution & Rights Pathway',
      fields: [
        { id: 'dist_format', label: 'Distribution Requirement', type: 'select', options: ['Theatrical Release Coordination', 'Streaming / OTT Platform Licensing', 'International Territory Sales', 'Festival Strategy & Market Representation'] },
        { id: 'dist_stage', label: 'Content Stage', type: 'select', options: ['Completed Master Ready for Delivery', 'Rough Cut / Post-Production', 'Script / Packaged Project'] },
        { id: 'dist_specs', label: 'Territories & Rights Available', type: 'textarea', placeholder: 'List available territories, windows, and existing commitments.' }
      ]
    },
    'other': {
      title: 'Custom Entertainment Coordination Requirement',
      fields: [
        { id: 'custom_type', label: 'Requirement Summary', type: 'text', placeholder: 'e.g., Cross-border IP adaptation' },
        { id: 'custom_desc', label: 'Detailed Operational Constraints', type: 'textarea', placeholder: 'Explain what needs to move, relevant parties, and timelines.' }
      ]
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const preselectedCategory = urlParams.get('category');
  if (preselectedCategory && QUESTION_SCHEMAS[preselectedCategory]) {
    selectCategory(preselectedCategory);
  }

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      selectCategory(category);
    });
  });

  function selectCategory(category) {
    categoryCards.forEach(c => c.classList.remove('selected'));
    const activeCard = document.querySelector(`.intake-category-card[data-category="${category}"]`);
    if (activeCard) activeCard.classList.add('selected');

    if (stepCategoryHidden) stepCategoryHidden.value = category;

    const schema = QUESTION_SCHEMAS[category] || QUESTION_SCHEMAS['other'];
    renderDynamicQuestions(schema);

    if (progressFill) progressFill.style.width = '66%';

    if (dynamicStepContainer) {
      dynamicStepContainer.style.display = 'block';
      dynamicStepContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderDynamicQuestions(schema) {
    if (!dynamicStepContainer) return;

    let html = `
      <div class="card card-solid" style="margin-top: 2rem; padding: 2.25rem;">
        <div class="label-mono" style="margin-bottom: 0.5rem;">Step 02 of 03 &bull; Requirement specifications</div>
        <h3 style="margin-bottom: 1.5rem;">${schema.title}</h3>
    `;

    schema.fields.forEach(field => {
      html += `<div class="form-group">`;
      html += `<label class="form-label" for="${field.id}">${field.label}</label>`;

      if (field.type === 'select') {
        html += `<select class="form-select" id="${field.id}" name="${field.id}" required>`;
        html += `<option value="">Select option...</option>`;
        field.options.forEach(opt => {
          html += `<option value="${opt}">${opt}</option>`;
        });
        html += `</select>`;
      } else if (field.type === 'textarea') {
        html += `<textarea class="form-textarea" id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" required></textarea>`;
      } else {
        html += `<input type="text" class="form-input" id="${field.id}" name="${field.id}" placeholder="${field.placeholder || ''}" required>`;
      }

      html += `</div>`;
    });

    html += `
        <div class="label-mono" style="margin: 2.5rem 0 0.5rem;">Step 03 of 03 &bull; Verified contact credentials</div>
        <div class="grid-2" style="margin-bottom: 1.5rem;">
          <div class="form-group">
            <label class="form-label" for="contact_name">Full Legal Name / Entity</label>
            <input type="text" class="form-input" id="contact_name" name="contact_name" placeholder="Name or Production Company" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="contact_email">Corporate / Production Email</label>
            <input type="email" class="form-input" id="contact_email" name="contact_email" placeholder="name@production.com" required>
          </div>
        </div>
        <div class="grid-2" style="margin-bottom: 1.5rem;">
          <div class="form-group">
            <label class="form-label" for="contact_phone">Secure Direct Mobile</label>
            <input type="tel" class="form-input" id="contact_phone" name="contact_phone" placeholder="+91 / +1" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="contact_org_type">Participant Profile</label>
            <select class="form-select" id="contact_org_type" name="contact_org_type" required>
              <option value="">Select profile...</option>
              <option value="Studio / Production Company">Studio / Major Production Co.</option>
              <option value="Independent Producer / Line Producer">Independent Producer / Line Producer</option>
              <option value="Equipment / Stage Facility Operator">Stage / Rental House Operator</option>
              <option value="Post House / VFX Studio">Post House / VFX Studio</option>
              <option value="Distributor / Sales Agent">Distributor / Sales Agent</option>
              <option value="Financier / Institutional Capital">Financier / Capital Partner</option>
            </select>
          </div>
        </div>

        <div style="background-color: var(--bg-surface); padding: 1.25rem; border: 1px solid var(--border-hairline); border-radius: var(--radius-sm); margin-bottom: 2rem;">
          <div class="label-mono" style="margin-bottom: 0.35rem; color: var(--text-primary);">Data privacy & neutrality guarantee</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
            DigiSynq does not publicly broadcast requirement data. Details are matched confidentially only with verified counter-parties meeting your security and credit thresholds.
          </p>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
          Submit Synq Request &rarr;
        </button>
      </div>
    `;

    dynamicStepContainer.innerHTML = html;
  }

  intakeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (progressFill) progressFill.style.width = '100%';

    dynamicStepContainer.innerHTML = `
      <div class="card card-solid" style="margin-top: 2rem; padding: 3rem; text-align: center;">
        <span class="badge badge-live" style="margin-bottom: 1.5rem;">[Synq transmitted]</span>
        <h2 style="margin-bottom: 1rem;">Requirement recorded</h2>
        <p style="max-width: 620px; margin: 0 auto 2rem; color: var(--text-secondary);">
          Your coordination brief has entered the verification pipeline. A DigiSynq production coordinator will confirm counter-party capacity availability within operational business hours.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="index.html" class="btn btn-secondary">Return to home</a>
          <a href="how-it-works.html" class="btn btn-primary">Review 6-step operating model &rarr;</a>
        </div>
      </div>
    `;
    dynamicStepContainer.scrollIntoView({ behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   PAGE FADE-IN (SUBTLE ENTRY TRANSITION)
   -------------------------------------------------------------------------- */
function initPageFade() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.body.classList.add('page-fade-ready');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('page-fade-in');
    });
  });
}

/* --------------------------------------------------------------------------
   ACCESSIBLE ACCORDION CONTROLLER
   -------------------------------------------------------------------------- */
function initAccordions() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.setAttribute('aria-expanded', 'false');
    const contentId = `acc-content-${Math.random().toString(36).slice(2, 7)}`;
    const content = item.querySelector('.accordion-content');
    if (content) {
      content.id = contentId;
      trigger.setAttribute('aria-controls', contentId);
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.accordion-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });
}
