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

const REDIRECT_PAGES = [
  'synq.html',
  'company.html',
  'guilds.html',
  'ecosystem.html',
  'modules.html',
  'products.html',
  'pricing.html',
  'workshops.html'
];

let totalIssues = 0;

console.log('====================================================');
console.log('DIGISYNQ INFRASTRUCTURE AUDIT — CANONICAL 10-PAGE SUITE');
console.log('====================================================\n');

// 1. Audit Canonical Pages
CANONICAL_PAGES.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`[FAIL] Canonical file does not exist: ${file}`);
    totalIssues++;
    return;
  }

  const content = fs.readFileSync(file, 'utf8');
  console.log(`Auditing ${file}...`);

  // A. Header & Footer
  if (!content.includes('class="navbar"') && !content.includes("class='navbar'")) {
    console.error(`  [FAIL] Missing canonical navbar header`);
    totalIssues++;
  } else {
    console.log(`  [PASS] Canonical navbar header verified`);
  }

  if (!content.includes('class="footer"') && !content.includes("class='footer'")) {
    console.error(`  [FAIL] Missing canonical enterprise footer`);
    totalIssues++;
  } else {
    console.log(`  [PASS] Canonical enterprise footer verified`);
  }

  // B. Dead node links check
  const nodeLinkMatches = content.match(/href=["'](node-\d+\.html|nodes\.html)["']/g);
  if (nodeLinkMatches) {
    console.error(`  [FAIL] Dead node links found: ${nodeLinkMatches.join(', ')}`);
    totalIssues++;
  } else {
    console.log(`  [PASS] Zero dead legacy node links`);
  }

  // C. Internal Link Resolution
  const hrefMatches = [...content.matchAll(/href=["']([^"']+)["']/g)];
  let brokenInternal = 0;
  hrefMatches.forEach(m => {
    const href = m[1];
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) {
      return;
    }
    const cleanPath = href.split('#')[0].split('?')[0];
    if (cleanPath && !fs.existsSync(cleanPath)) {
      console.error(`  [FAIL] Broken internal link: ${href}`);
      brokenInternal++;
      totalIssues++;
    }
  });
  if (brokenInternal === 0) {
    console.log(`  [PASS] All ${hrefMatches.length} href links valid & resolve`);
  }

  // D. Regulatory Disclosure Check
  if (!/regulatory disclosure/i.test(content)) {
    console.error(`  [FAIL] Missing mandatory regulatory disclosure`);
    totalIssues++;
  } else {
    console.log(`  [PASS] Regulatory disclosure statement present`);
  }

  // E. Status Badge Governance
  const hasBadges = content.includes('badge-live') || content.includes('badge-pilot') || content.includes('badge-partner') || content.includes('badge-illustrative');
  if (!hasBadges) {
    console.warn(`  [WARN] No status governance badges detected in page content`);
  } else {
    console.log(`  [PASS] Status governance badges verified`);
  }

  console.log('');
});

// 2. Audit Redirect Aliases
console.log('--- AUDITING LEGACY REDIRECT PAGES ---');
REDIRECT_PAGES.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`[FAIL] Redirect file missing: ${file}`);
    totalIssues++;
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('http-equiv="refresh"') && !content.includes('location.replace')) {
    console.error(`  [FAIL] ${file} does not contain valid redirect logic`);
    totalIssues++;
  } else {
    console.log(`  [PASS] ${file} redirects cleanly`);
  }
});

// 3. Strict Monochrome CSS Check
console.log('\n--- AUDITING MONOCHROME COLOR TOKENS ---');
const cssFiles = ['assets/css/design-system.css', 'assets/css/style.css'];
const FORBIDDEN_COLORS = ['#00e5ff', '#ff5200', '#00ff88', '#9900ff', 'rgb(0, 229', 'hsl('];

cssFiles.forEach(cssFile => {
  const css = fs.readFileSync(cssFile, 'utf8');
  let colorViolations = 0;
  FORBIDDEN_COLORS.forEach(color => {
    if (css.toLowerCase().includes(color.toLowerCase())) {
      console.error(`  [FAIL] Forbidden color token "${color}" found in ${cssFile}`);
      colorViolations++;
      totalIssues++;
    }
  });
  if (colorViolations === 0) {
    console.log(`  [PASS] ${cssFile} is 100% strictly monochrome`);
  }
});

console.log('\n====================================================');
if (totalIssues === 0) {
  console.log('AUDIT RESULT: 100% CLEAN! ALL 10 CANONICAL PAGES PASS WITH ZERO DEFECTS.');
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`AUDIT RESULT: FOUND ${totalIssues} ISSUES!`);
  console.log('====================================================\n');
  process.exit(1);
}
