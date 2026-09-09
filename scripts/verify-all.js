const fs = require('fs');
const path = require('path');

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

let totalIssues = 0;

console.log('--- AUDITING 10 CANONICAL PAGES ---');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\nAuditing ${file}...`);

  // 1. Check footer
  const hasMinimalFooter = content.includes('site-footer-minimal');
  const hasOldFooter = content.includes('WEBSITE KNOWLEDGE NODES:');
  const hasOldRefBottom = content.includes('ref-bottom-nav');
  if (!hasMinimalFooter) {
    console.error(`  [FAIL] Missing site-footer-minimal`);
    totalIssues++;
  } else {
    console.log(`  [PASS] Minimal footer present`);
  }
  if (hasOldFooter) {
    console.error(`  [FAIL] Old footer nodes still present!`);
    totalIssues++;
  }
  if (hasOldRefBottom) {
    console.error(`  [FAIL] Old ref-bottom-nav still present!`);
    totalIssues++;
  }

  // 2. Check for node-XX.html links
  const nodeLinkMatches = content.match(/href=["'](node-\d+\.html|nodes\.html)["']/g);
  if (nodeLinkMatches) {
    console.error(`  [FAIL] Dead node links found: ${nodeLinkMatches.join(', ')}`);
    totalIssues++;
  } else {
    console.log(`  [PASS] Zero dead node links`);
  }

  // 3. Check for external / internal links
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
    console.log(`  [PASS] All ${hrefMatches.length} href links valid`);
  }

  // 4. Check for ambient orbs
  if (content.includes('ambient-glow-orb')) {
    console.error(`  [FAIL] Has legacy ambient-glow-orb`);
    totalIssues++;
  }
});

console.log(`\n========================================`);
if (totalIssues === 0) {
  console.log(`ALL 10 PAGES 100% CLEAN, MINIMAL FOOTER VERIFIED, ZERO BROKEN LINKS!`);
} else {
  console.error(`FOUND ${totalIssues} ISSUES TO FIX!`);
}
