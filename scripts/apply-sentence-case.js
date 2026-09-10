const fs = require('fs');
const path = require('path');

const CANONICAL_PAGES = [
  'index.html',
  'how-it-works.html',
  'solutions.html',
  'platform.html',
  'network.html',
  'intelligence.html',
  'economics.html',
  'trust.html',
  'about.html',
  'start-a-synq.html'
];

// Specific known strings to replace cleanly
const exactReplacements = [
  // Brand & Sub-brand
  [/<span class="nav-brand-name">DIGISYNQ<\/span>/g, '<span class="nav-brand-name">DigiSynq</span>'],
  [/<span class="nav-brand-sub">COORDINATION PROTOCOL<\/span>/g, '<span class="nav-brand-sub">Coordination protocol</span>'],
  [/<div class="footer-brand-title">DIGISYNQ<\/div>/g, '<div class="footer-brand-title">DigiSynq</div>'],
  [/<strong>REGULATORY DISCLOSURE:<\/strong>/g, '<strong>Regulatory disclosure:</strong>'],
  [/REGULATORY DISCLOSURE:\s*/g, 'Regulatory disclosure: '],
  [/SWISS EDITORIAL &bull; MONOCHROME INFRASTRUCTURE ARCHITECTURE/g, 'Swiss editorial &bull; Monochrome infrastructure architecture'],

  // Navbar Links & Buttons
  [/>How It Works<\/a>/g, '>How it works</a>'],
  [/>Trust Center<\/a>/g, '>Trust center</a>'],
  [/>Start a Synq &rarr;<\/a>/g, '>Start a synq &rarr;</a>'],
  [/>Start a Synq<\/a>/g, '>Start a synq</a>'],
  [/>MENU<\/button>/g, '>Menu</button>'],
  [/>I Have Something<\/a>/g, '>I have something</a>'],
  [/>I Need Something<\/a>/g, '>I need something</a>'],
  [/<span>Introducing DigiSynq Protocol &bull; The Coordination Layer<\/span>/g, '<span>Introducing DigiSynq protocol &bull; The coordination layer</span>'],
  [/>See How It Works<\/a>/g, '>See how it works</a>'],
  [/>Explore Solutions<\/a>/g, '>Explore solutions</a>'],
  [/>View Solutions by Situation<\/a>/g, '>View solutions by situation</a>'],
  [/>Review Trust Standards<\/a>/g, '>Review trust standards</a>'],
  [/>Return to Home<\/a>/g, '>Return to home</a>'],
  [/>Review 6-Step Operating Model &rarr;<\/a>/g, '>Review 6-step operating model &rarr;</a>'],
  [/>Deploy Your Capacity &rarr;<\/a>/g, '>Deploy your capacity &rarr;</a>'],
  [/>Source Verified Capacity &rarr;<\/a>/g, '>Source verified capacity &rarr;</a>'],
  [/>Resolve Bottlenecks &rarr;<\/a>/g, '>Resolve bottlenecks &rarr;</a>'],
  [/>Initiate Transfer &rarr;<\/a>/g, '>Initiate transfer &rarr;</a>'],
  [/>Explore Coordination &rarr;<\/a>/g, '>Explore coordination &rarr;</a>'],
  [/>Review Verification Standard &rarr;<\/a>/g, '>Review verification standard &rarr;</a>'],
  [/>Find \/ List Stages &rarr;<\/a>/g, '>Find / list stages &rarr;</a>'],
  [/>Architectural Layers<\/a>/g, '>Architectural layers</a>'],
  [/>Core Modules<\/a>/g, '>Core modules</a>'],
  [/>Intelligence Modules<\/a>/g, '>Intelligence modules</a>'],
  [/>Expansion Modules<\/a>/g, '>Expansion modules</a>'],
  [/>The Learning Loop<\/a>/g, '>The learning loop</a>'],
  [/>Seven Intelligence Domains<\/a>/g, '>Seven intelligence domains</a>'],
  [/>Data Provenance Standards<\/a>/g, '>Data provenance standards</a>'],
  [/>How We Make Money<\/a>/g, '>How we make money</a>'],
  [/>Canonical Fee Schedule<\/a>/g, '>Canonical fee schedule</a>'],
  [/>Regulatory Boundaries<\/a>/g, '>Regulatory boundaries</a>'],
  [/>10 Verification Pillars<\/a>/g, '>10 verification pillars</a>'],
  [/>Trust Score Framework<\/a>/g, '>Trust score framework</a>'],
  [/>Neutrality Governance<\/a>/g, '>Neutrality governance</a>'],

  // Footer Column Titles
  [/<div class="footer-col-title">NAVIGATION<\/div>/g, '<div class="footer-col-title">Navigation</div>'],
  [/<div class="footer-col-title">INFRASTRUCTURE<\/div>/g, '<div class="footer-col-title">Infrastructure</div>'],
  [/<div class="footer-col-title">SITUATIONS<\/div>/g, '<div class="footer-col-title">Situations</div>'],
  [/<div class="footer-col-title">GOVERNANCE<\/div>/g, '<div class="footer-col-title">Governance</div>'],

  // Section Labels & Eyebrows
  [/<div class="section-label">01 \/ STRUCTURAL REALITY<\/div>/g, '<div class="section-label">01 / Structural reality</div>'],
  [/<div class="section-label">02 \/ OPERATING MODEL<\/div>/g, '<div class="section-label">02 / Operating model</div>'],
  [/<div class="section-label">03 \/ WORKED EXAMPLE<\/div>/g, '<div class="section-label">03 / Worked example</div>'],
  [/<div class="section-label">04 \/ PRODUCTION PILLARS<\/div>/g, '<div class="section-label">04 / Production pillars</div>'],
  [/<div class="section-label">05 \/ COORDINATION INTAKE<\/div>/g, '<div class="section-label">05 / Coordination intake</div>'],
  [/<div class="section-label">OPERATING ARCHITECTURE<\/div>/g, '<div class="section-label">Operating architecture</div>'],
  [/<div class="section-label">OPERATING PIPELINE &bull; STAGES 01 TO 06<\/div>/g, '<div class="section-label">Operating pipeline &bull; Stages 01 to 06</div>'],
  [/<div class="section-label">WORKED PIPELINE 02 &bull; POST & FINISHING<\/div>/g, '<div class="section-label">Worked pipeline 02 &bull; Post & finishing</div>'],
  [/<div class="section-label">READY TO MOVE CAPACITY\?<\/div>/g, '<div class="section-label">Ready to move capacity?</div>'],
  [/<div class="section-label">REAL-WORLD SITUATIONS<\/div>/g, '<div class="section-label">Real-world situations</div>'],
  [/<div class="section-label">INFRASTRUCTURE ARCHITECTURE<\/div>/g, '<div class="section-label">Infrastructure architecture</div>'],
  [/<div class="section-label">SYSTEM LAYERS &bull; 01 TO 06<\/div>/g, '<div class="section-label">System layers &bull; 01 to 06</div>'],
  [/<div class="section-label">ECOSYSTEM TOPOLOGY<\/div>/g, '<div class="section-label">Ecosystem topology</div>'],
  [/<div class="section-label">LEVEL 01 &bull; CANONICAL DOMAINS<\/div>/g, '<div class="section-label">Level 01 &bull; Canonical domains</div>'],
  [/<div class="section-label">EMPIRICAL DATA ARCHITECTURE<\/div>/g, '<div class="section-label">Empirical data architecture</div>'],
  [/<div class="section-label">SYSTEM ARCHITECTURE<\/div>/g, '<div class="section-label">System architecture</div>'],
  [/<div class="section-label">ECONOMIC TRANSPARENCY<\/div>/g, '<div class="section-label">Economic transparency</div>'],
  [/<div class="section-label">REVENUE ARCHITECTURE<\/div>/g, '<div class="section-label">Revenue architecture</div>'],
  [/<div class="section-label">ENTERPRISE ASSURANCE<\/div>/g, '<div class="section-label">Enterprise assurance</div>'],
  [/<div class="section-label">STANDARDS MATRIX<\/div>/g, '<div class="section-label">Standards matrix</div>'],
  [/<div class="section-label">EXECUTIVE SUMMARY &bull; UNDERSTAND IN 60 SECONDS<\/div>/g, '<div class="section-label">Executive summary &bull; Understand in 60 seconds</div>'],
  [/<div class="label-mono">COORDINATION INTAKE PROTOCOL<\/div>/g, '<div class="label-mono">Coordination intake protocol</div>'],

  // Badges
  [/\[VERIFIED HOLD\]/g, '[Verified hold]'],
  [/\[PRE-FLIGHT QC\]/g, '[Pre-flight QC]'],
  [/\[IN CONFORM\]/g, '[In conform]'],
  [/\[MATCHED\]/g, '[Matched]'],
  [/\[ACTIVE PROTOCOL\]/g, '[Active protocol]'],
  [/\[SYSTEM PROTOCOL\]/g, '[System protocol]'],
  [/\[LIVE PROTOCOL\]/g, '[Live protocol]'],
  [/\[PILOT PROTOCOL\]/g, '[Pilot protocol]'],
  [/\[PARTNER PROTOCOL\]/g, '[Partner protocol]'],
  [/\[PRIORITY ROUTING\]/g, '[Priority routing]'],
  [/\[TRANSACTIONAL\]/g, '[Transactional]'],
  [/\[DISBURSEMENT\]/g, '[Disbursement]'],
  [/\[ENTERPRISE\]/g, '[Enterprise]'],
  [/\[VERIFIED STANDARD\]/g, '[Verified standard]'],
  [/\[PHYSICAL AUDIT\]/g, '[Physical audit]'],
  [/\[CALENDAR CONFIRMED\]/g, '[Calendar confirmed]'],
  [/\[STANDARDIZED TERMS\]/g, '[Standardized terms]'],
  [/\[FIDUCIARY PARTNERS\]/g, '[Fiduciary partners]'],
  [/\[CONFIDENTIAL PRIVACY\]/g, '[Confidential privacy]'],
  [/\[CRYPTOGRAPHIC AUDIT\]/g, '[Cryptographic audit]'],
  [/\[DYNAMIC WEIGHTING\]/g, '[Dynamic weighting]'],
  [/\[TWO-STAGE REVIEW\]/g, '[Two-stage review]'],
  [/\[ZERO CONFLICT\]/g, '[Zero conflict]'],
  [/\[CORE\]/g, '[Core]'],
  [/\[GOVERNANCE\]/g, '[Governance]'],
  [/\[NEUTRAL\]/g, '[Neutral]'],
  [/\[LIVE COORDINATION ENGINE\]/g, '[Live coordination engine]'],
  [/\[ILLUSTRATIVE MODEL &bull; POST COORDINATION\]/g, '[Illustrative model &bull; Post coordination]'],
  [/\[ILLUSTRATIVE MODEL &bull; SOUNDSTAGE LOCK\]/g, '[Illustrative model &bull; Soundstage lock]'],
  [/\[SYNQ TRANSMITTED\]/g, '[Synq transmitted]'],
  [/<span class="badge badge-live">CERTIFIED<\/span>/g, '<span class="badge badge-live">Certified</span>'],
  [/<span class="badge badge-live">100% AUDITED<\/span>/g, '<span class="badge badge-live">100% Audited</span>'],
  [/<span class="badge badge-pilot">PILOT<\/span>/g, '<span class="badge badge-pilot">Pilot</span>'],
  [/<span class="badge badge-partner">PARTNER<\/span>/g, '<span class="badge badge-partner">Partner</span>'],
  [/<span class="badge badge-live">LIVE<\/span>/g, '<span class="badge badge-live">Live</span>'],
  [/<span class="badge badge-illustrative">ILLUSTRATIVE<\/span>/g, '<span class="badge badge-illustrative">Illustrative</span>'],

  // App Frame Preview Labels
  [/COORDINATION WINDOW/g, 'Coordination window'],
  [/POWER \/ SPECIFICATION/g, 'Power / specification'],
  [/OPTICAL \/ TRACKING/g, 'Optical / tracking'],
  [/REGULATED SETTLEMENT/g, 'Regulated settlement'],
  [/MILESTONE PROGRESSION/g, 'Milestone progression'],
  [/PROGRESS: DETERMINISTIC INTAKE/g, 'Progress: Deterministic intake'],
  [/CORE THESIS:/g, 'Core thesis:'],
  [/POSITIONING:/g, 'Positioning:'],
  [/SCHEDULING BOTTLENECK/g, 'Scheduling bottleneck'],

  // Hero H1 across pages
  [/THE COORDINATION LAYER<br>FOR ENTERTAINMENT\./g, 'The coordination layer<br>for entertainment.'],
  [/The 6-Stage Coordination Lifecycle/g, 'The 6-stage coordination lifecycle'],
  [/Five Operational Entry Pathways/g, 'Five operational entry pathways'],
  [/The Technical Coordination Architecture/g, 'The technical coordination architecture'],
  [/The Coordinated Network/g, 'The coordinated network'],
  [/Production Intelligence Systems/g, 'Production intelligence systems'],
  [/Commercial Model & Fee Governance/g, 'Commercial model & fee governance'],
  [/Trust Center & Verification Architecture/g, 'Trust center & verification architecture'],
  [/We Don't Own the Assets\.<br>We Make Them Move\./g, "We don't own the assets.<br>We make them move."],
  [/>Start a Synq<\/h1>/g, '>Start a synq</h1>'],

  // Specific Headings
  [/>How DigiSynq Coordinates<\/h2>/g, '>How DigiSynq coordinates</h2>'],
  [/>Eight Pillars of Production<\/h2>/g, '>Eight pillars of production</h2>'],
  [/>The Six-Stage Coordination Engine<\/h2>/g, '>The six-stage coordination engine</h2>'],
  [/>Six Structural Protocol Layers<\/h2>/g, '>Six structural protocol layers</h2>'],
  [/>The Continuous Learning Loop<\/h2>/g, '>The continuous learning loop</h2>'],
  [/>How DigiSynq Generates Revenue<\/h2>/g, '>How DigiSynq generates revenue</h2>'],
  [/>Ten Pillars of Enterprise Assurance<\/h2>/g, '>Ten pillars of enterprise assurance</h2>'],
  [/>Stage Need to Lock in 8 Days<\/h2>/g, '>Stage need to lock in 8 days</h2>'],
  [/>Dolby Atmos Finishing in 14 Days<\/h2>/g, '>Dolby Atmos finishing in 14 days</h2>'],

  // Solutions page 5 paths
  [/>I HAVE SOMETHING<\/h2>/g, '>I have something</h2>'],
  [/>I NEED SOMETHING<\/h2>/g, '>I need something</h2>'],
  [/>SOMETHING IS UNDERUSED<\/h3>/g, '>Something is underused</h3>'],
  [/>SOMETHING IS BLOCKED<\/h3>/g, '>Something is blocked</h3>'],
  [/>SOMETHING NEEDS TO MOVE<\/h3>/g, '>Something needs to move</h3>'],

  // How it works 6 stages
  [/>01 VERIFY<\/h2>/g, '>01 Verify</h2>'],
  [/>02 MATCH<\/h2>/g, '>02 Match</h2>'],
  [/>03 COMMIT<\/h2>/g, '>03 Commit</h2>'],
  [/>04 EXECUTE<\/h2>/g, '>04 Execute</h2>'],
  [/>05 SETTLE<\/h2>/g, '>05 Settle</h2>'],
  [/>06 LEARN<\/h2>/g, '>06 Learn</h2>'],

  // Intelligence 7 steps
  [/>DATA<\/div>/g, '>Data</div>'],
  [/>SIGNAL<\/div>/g, '>Signal</div>'],
  [/>INSIGHT<\/div>/g, '>Insight</div>'],
  [/>DECISION<\/div>/g, '>Decision</div>'],
  [/>ACTION<\/div>/g, '>Action</div>'],
  [/>OUTCOME<\/div>/g, '>Outcome</div>'],
  [/>LEARN<\/div>/g, '>Learn</div>'],

  // Start a synq category strongs
  [/>A Production<\/strong>/g, '>A production</strong>'],
  [/>Crew Requirement<\/strong>/g, '>Crew requirement</strong>'],
  [/>Equipment<\/strong>/g, '>Equipment</strong>'],
  [/>A Stage \/ Venue<\/strong>/g, '>A stage / venue</strong>'],
  [/>Post-Production<\/strong>/g, '>Post-production</strong>'],
  [/>Capital \/ Finance<\/strong>/g, '>Capital / finance</strong>'],
  [/>Distribution<\/strong>/g, '>Distribution</strong>'],
  [/>IP \/ Content<\/strong>/g, '>IP / content</strong>'],
  [/>Something Else<\/strong>/g, '>Something else</strong>'],

  // Notice / metadata labels
  [/GOVERNANCE STANDARD:/g, 'Governance standard:'],
  [/TARGET AUDIENCE:/g, 'Target audience:'],
  [/OPERATIONAL BENEFIT:/g, 'Operational benefit:'],
  [/NEUTRALITY GUARANTEE:/g, 'Neutrality guarantee:'],
  [/ESCROW FACILITATION:/g, 'Escrow facilitation:'],
  [/CONTINGENCY RESOLUTION:/g, 'Contingency resolution:'],
  [/DATA PRIVACY:/g, 'Data privacy:'],
  [/FRAMEWORK:/g, 'Framework:'],
  [/MONITORING:/g, 'Monitoring:'],
  [/VALIDATION:/g, 'Validation:'],
  [/BENCHMARK:/g, 'Benchmark:'],
  [/WHAT WE VERIFY/g, 'What we verify'],
  [/MATCHING PARAMETERS/g, 'Matching parameters'],
  [/COMMITMENT PROTOCOLS/g, 'Commitment protocols'],
  [/EXECUTION TRACKING/g, 'Execution tracking'],
  [/SETTLEMENT WORKFLOW/g, 'Settlement workflow'],
  [/SYSTEM OUTCOMES/g, 'System outcomes'],
  [/MEASURABLE SPECIFICATIONS/g, 'Measurable specifications'],
  [/VALIDATION REQUIREMENTS/g, 'Validation requirements'],
  [/WHAT DIGISYNQ COORDINATES/g, 'What DigiSynq coordinates']
];

CANONICAL_PAGES.forEach(filename => {
  if (!fs.existsSync(filename)) return;
  let content = fs.readFileSync(filename, 'utf8');

  // 1. Remove inline text-transform: uppercase
  content = content.replace(/;\s*text-transform:\s*uppercase;/gi, ';');
  content = content.replace(/text-transform:\s*uppercase;\s*/gi, '');

  // 2. Apply all exact replacements
  exactReplacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });

  // 3. Convert label-mono and bento tags like "SILO 01 • PRODUCTION CAPACITY" or "DOMAIN 03 • PHYSICAL FACILITIES"
  content = content.replace(/(<span[^>]*class="[^"]*label-mono[^"]*"[^>]*>|<div[^>]*class="[^"]*label-mono[^"]*"[^>]*>)([\s\S]*?)(<\/(?:span|div)>)/gi, (m, open, inner, close) => {
    // If inner contains bullet &bull; or •
    if (inner.includes('&bull;') || inner.includes('•')) {
      const parts = inner.split(/(&bull;|•)/);
      const converted = parts.map((part, idx) => {
        if (part === '&bull;' || part === '•') return part;
        const trimmed = part.trim();
        if (!trimmed) return part;
        // Sentence case for each part
        const lower = trimmed.toLowerCase();
        // Capitalize first letter
        const sc = lower.charAt(0).toUpperCase() + lower.slice(1);
        // Preserve proper nouns/acronyms
        return part.replace(trimmed, sc)
          .replace(/\bdigisynq\b/gi, 'DigiSynq')
          .replace(/\bvfx\b/gi, 'VFX')
          .replace(/\bled\b/gi, 'LED')
          .replace(/\bip\b/gi, 'IP')
          .replace(/\bqc\b/gi, 'QC');
      }).join('');
      return open + converted + close;
    }
    return m;
  });

  // 4. Convert all headings (h1, h2, h3, h4) that are in Title Case or UPPERCASE to sentence case
  // Preserving HTML tags inside headings (like <br>, <span>, etc.)
  content = content.replace(/<(h[1-4])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    // If heading text has title case or uppercase
    const textOnly = inner.replace(/<[^>]+>/g, '').trim();
    if (textOnly.length <= 2) return match;

    // Preserve words map
    const preserveMap = {
      'digisynq': 'DigiSynq',
      'led': 'LED',
      'vfx': 'VFX',
      'ip': 'IP',
      'qc': 'QC',
      'dci': 'DCI',
      'atmos': 'Atmos',
      'dolby': 'Dolby',
      'dga': 'DGA',
      'iatse': 'IATSE',
      'bsc': 'BSC',
      'isc': 'ISC',
      'panavision': 'Panavision',
      'arri': 'Arri',
      'alexa': 'Alexa',
      'cannes': 'Cannes',
      'imdb': 'IMDb',
      'uk': 'UK',
      'us': 'US',
      'protools': 'ProTools',
      'brompton': 'Brompton',
      'aces': 'ACES'
    };

    // Split inner preserving HTML tags
    const tokens = inner.split(/(<[^>]+>|\s+|[-—–/&])/);
    let isFirstWord = true;
    const transformedTokens = tokens.map(tok => {
      if (!tok || tok.startsWith('<') || /^\s+$/.test(tok) || /^[-—–/&]$/.test(tok)) {
        return tok;
      }
      const lower = tok.toLowerCase();
      if (preserveMap[lower]) {
        isFirstWord = false;
        return preserveMap[lower];
      }
      if (/^\d+[a-z]*$/i.test(tok)) {
        // e.g. 01, 95ft
        isFirstWord = false;
        return tok.toLowerCase();
      }
      if (isFirstWord) {
        isFirstWord = false;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }
      // If word is 'I', keep uppercase
      if (tok === 'I' || lower === 'i') {
        return 'I';
      }
      return lower;
    });

    return `<${tag}${attrs}>${transformedTokens.join('')}</${tag}>`;
  });

  fs.writeFileSync(filename, content, 'utf8');
  console.log(`Successfully updated ${filename}`);
});
