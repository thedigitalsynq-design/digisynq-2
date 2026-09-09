const fs = require('fs');
const path = require('path');

const minimalFooter = `  <!-- Minimal Site Footer -->
  <footer class="site-footer-minimal" role="contentinfo">
    <div class="footer-minimal-inner">
      <div class="footer-minimal-top">
        <div class="footer-minimal-brand-wrap">
          <a href="index.html" class="site-brand-link" aria-label="DigiSynq Home">
            <div class="site-brand-glyph" aria-hidden="true">DS</div>
            <span class="site-brand-name">DigiSynq</span>
          </a>
          <p class="footer-minimal-tagline">The coordination layer for entertainment.</p>
        </div>
      </div>
      <nav class="footer-minimal-nav" aria-label="Footer Navigation">
        <a href="index.html">Overview</a>
        <a href="platform.html">Platform</a>
        <a href="solutions.html">Solutions</a>
        <a href="ecosystem.html">Ecosystem</a>
        <a href="guilds.html">Guilds</a>
        <a href="modules.html">Modules</a>
        <a href="intelligence.html">Intelligence</a>
        <a href="economics.html">Economics</a>
        <a href="company.html">Company</a>
        <a href="synq.html" class="footer-nav-highlight">Start a synq &rarr;</a>
      </nav>
      <div class="footer-minimal-bottom">
        <span>&copy; 2026 DigiSynq. All rights reserved.</span>
        <span>Press <kbd>[K]</kbd> for directory</span>
      </div>
    </div>
  </footer>`;

// Known acronyms and proper names to preserve case
const properCaseMap = {
  'digisynq': 'DigiSynq',
  'india': 'India',
  'indian': 'Indian',
  'mumbai': 'Mumbai',
  'chennai': 'Chennai',
  'hyderabad': 'Hyderabad',
  'bengaluru': 'Bengaluru',
  'kochi': 'Kochi',
  'ip': 'IP',
  'ad': 'AD',
  'hod': 'HOD',
  'ott': 'OTT',
  'erp': 'ERP',
  'sla': 'SLA',
  'slas': 'SLAs',
  'api': 'API',
  'apis': 'APIs',
  'rbi': 'RBI',
  'ucni': 'UCNI',
  'ai': 'AI',
  'roi': 'ROI',
  'os': 'OS',
  'vfx': 'VFX',
  'led': 'LED',
  'esc': 'ESC',
  'k': 'K',
  'ds': 'DS'
};

function toSentenceCase(str) {
  // If the text contains HTML tags, we should only transform text outside tags
  return str.replace(/(^|[.?!]\s+|<[^>]+>\s*)([A-Z\s0-9&,/:—–-]+)/g, (match, prefix, text) => {
    // If text is purely uppercase and length > 2
    const trimmed = text.trim();
    if (trimmed.length > 2 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
      const words = trimmed.toLowerCase().split(/(\s+|[-/—–:,])/);
      let isFirstWord = true;
      const convertedWords = words.map(word => {
        if (/^\s+$/.test(word) || /^[-/—–:,]$/.test(word)) return word;
        const cleanWord = word.toLowerCase();
        if (properCaseMap[cleanWord]) {
          isFirstWord = false;
          return properCaseMap[cleanWord];
        }
        if (isFirstWord) {
          isFirstWord = false;
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word.toLowerCase();
      });
      return prefix + convertedWords.join('');
    }
    return match;
  });
}

const files = [
  'index.html',
  'platform.html',
  'solutions.html',
  'ecosystem.html',
  'guilds.html',
  'modules.html',
  'intelligence.html',
  'economics.html',
  'company.html',
  'synq.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove ref-bottom-nav if present
  content = content.replace(/<div class="ref-bottom-nav">[\s\S]*?<\/div>\s*(?=<\/main>|<footer)/g, '');

  // 2. Replace footer with minimalFooter
  content = content.replace(/<footer[\s\S]*?<\/footer>/g, minimalFooter);

  // 3. Common uppercase UI patterns across all pages
  content = content.replace(/AUDIO:\s*ON/gi, 'Audio: on');
  content = content.replace(/AUDIO:\s*OFF/gi, 'Audio: off');
  content = content.replace(/10\s*NODES\s*\[K\]/gi, '10 nodes [K]');
  content = content.replace(/START\s+A\s+SYNQ\s*(&rarr;|->|→)/gi, 'Start a synq &rarr;');
  content = content.replace(/START\s+A\s+SYNQ/gi, 'Start a synq');
  content = content.replace(/CLOSE\s+DIRECTORY\s*\[ESC\]/gi, 'Close directory [ESC]');
  content = content.replace(/10-NODE\s+DIRECTORY/gi, '10-node directory');
  content = content.replace(/DIGISYNQ\s+CORE\s+ECOSYSTEM/gi, 'DigiSynq core ecosystem');
  content = content.replace(/DIGISYNQ\s+KNOWLEDGE\s+NODES/gi, 'DigiSynq knowledge nodes');
  content = content.replace(/READ\s+ABOUT\s+DIGISYNQ/gi, 'Read about DigiSynq');
  content = content.replace(/EXPLORE\s+(THE\s+)?ECOSYSTEM/gi, 'Explore ecosystem');
  content = content.replace(/EXPLORE\s+MODULES/gi, 'Explore modules');
  content = content.replace(/EXPLORE\s+PLATFORM/gi, 'Explore platform');
  content = content.replace(/EXPLORE\s+SOLUTIONS/gi, 'Explore solutions');
  content = content.replace(/VIEW\s+INTELLIGENCE/gi, 'View intelligence');
  content = content.replace(/VIEW\s+PRICING/gi, 'View pricing');
  content = content.replace(/PROCEED\s+TO\s+SYNQ/gi, 'Proceed to synq');
  content = content.replace(/LAUNCH\s+SYNQ/gi, 'Launch synq');

  // 4. Dialpad node labels to sentence case
  content = content.replace(/<span class="node-key-label">\s*OVERVIEW\s*<\/span>/gi, '<span class="node-key-label">Overview</span>');
  content = content.replace(/<span class="node-key-label">\s*PLATFORM\s*<\/span>/gi, '<span class="node-key-label">Platform</span>');
  content = content.replace(/<span class="node-key-label">\s*SOLUTIONS\s*<\/span>/gi, '<span class="node-key-label">Solutions</span>');
  content = content.replace(/<span class="node-key-label">\s*ECOSYSTEM\s*<\/span>/gi, '<span class="node-key-label">Ecosystem</span>');
  content = content.replace(/<span class="node-key-label">\s*GUILDS\s*<\/span>/gi, '<span class="node-key-label">Guilds</span>');
  content = content.replace(/<span class="node-key-label">\s*MODULES\s*<\/span>/gi, '<span class="node-key-label">Modules</span>');
  content = content.replace(/<span class="node-key-label">\s*INTELLIGENCE\s*<\/span>/gi, '<span class="node-key-label">Intelligence</span>');
  content = content.replace(/<span class="node-key-label">\s*ECONOMICS\s*<\/span>/gi, '<span class="node-key-label">Economics</span>');
  content = content.replace(/<span class="node-key-label">\s*COMPANY\s*<\/span>/gi, '<span class="node-key-label">Company</span>');
  content = content.replace(/<span class="node-key-label"[^>]*>\s*START A SYNQ\s*<\/span>/gi, '<span class="node-key-label" style="color:#FFFFFF;font-weight:700;">Start a synq</span>');

  // 5. Section headings in sentence case
  // Matches tags like <h1>...</h1>, <h2>...</h2>, <h3>...</h3>, <h4>...</h4>
  content = content.replace(/<(h[1-6]|div class="mono"[^>]*|span class="mono"[^>]*)([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    // If inner text is uppercase and not just symbols
    const cleanText = inner.replace(/<[^>]+>/g, '').trim();
    if (cleanText.length > 3 && cleanText === cleanText.toUpperCase() && /[A-Z]/.test(cleanText)) {
      const converted = toSentenceCase(inner);
      return `<${tag}${attrs}>${converted}</${tag}>`;
    }
    return full;
  });

  // 6. Ensure design-system.css is linked
  if (!content.includes('assets/css/design-system.css')) {
    content = content.replace(/<\/head>/i, '  <link rel="stylesheet" href="assets/css/design-system.css">\n</head>');
  }

  // 7. Remove any residual atmospheric glow orbs
  content = content.replace(/<div class="ambient-glow-orb[^"]*"><\/div>\s*/gi, '');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
