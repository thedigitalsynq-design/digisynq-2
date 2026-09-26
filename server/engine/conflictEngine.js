// server/engine/conflictEngine.js
// Detects factual discrepancies across independent sources (release dates, budget estimates, box office claims, runtimes)

class ConflictEngine {
  static analyze(signals) {
    const conflicts = [];

    // 1. Release date discrepancy scanner
    const dateClaims = [];
    const dateRegex = /(?:releas(?:e|ing|ed)|premiere|hits screens)\s+(?:on|in|by)?\s*([A-Za-z]+\s+\d{1,2}(?:,\s*\d{4})?|\d{1,2}\s+[A-Za-z]+(?:\s+\d{4})?|Diwali|Pongal|Sankranti|Eid|Christmas|Summer\s+\d{4})/gi;

    for (const signal of signals) {
      const text = `${signal.title} ${signal.snippet}`;
      let match;
      while ((match = dateRegex.exec(text)) !== null) {
        const claim = match[1].trim();
        if (claim.length > 2 && !dateClaims.some(d => d.source === signal.source && d.claim.toLowerCase() === claim.toLowerCase())) {
          dateClaims.push({
            claim,
            source: signal.source,
            category: signal.sourceCategory,
            url: signal.url,
            publishedAt: signal.publishedAt
          });
        }
      }
    }

    // Check if we have multiple distinct date claims
    if (dateClaims.length >= 2) {
      const distinctClaims = Array.from(new Set(dateClaims.map(d => d.claim.toLowerCase())));
      if (distinctClaims.length >= 2) {
        conflicts.push({
          id: 'conflict-release-date',
          attribute: 'Theatrical Release Window',
          status: 'ACTIVE_DISCREPANCY',
          description: `Discrepancy detected across ${dateClaims.length} sources regarding theatrical release timing.`,
          competingClaims: distinctClaims.map(claim => {
            const supporting = dateClaims.filter(d => d.claim.toLowerCase() === claim);
            return {
              claimValue: supporting[0].claim,
              frequency: supporting.length,
              sources: supporting.map(s => ({
                source: s.source,
                publishedAt: s.publishedAt,
                url: s.url
              }))
            };
          }),
          recommendation: 'Verify official CBFC censor certificate or production house press statement before updating distribution schedules.'
        });
      }
    }

    // 2. Box office claims divergence
    const boClaims = [];
    const boRegex = /(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?\s*(?:cr(?:ore)?s?|lakhs?))/gi;
    for (const signal of signals) {
      if (signal.sourceCategory === 'trade' || signal.sourceCategory === 'news') {
        const text = `${signal.title} ${signal.snippet}`;
        let match;
        while ((match = boRegex.exec(text)) !== null) {
          boClaims.push({
            claim: match[0].trim(),
            source: signal.source,
            url: signal.url,
            publishedAt: signal.publishedAt
          });
        }
      }
    }

    if (boClaims.length >= 3) {
      const uniqueClaims = Array.from(new Set(boClaims.map(b => b.claim)));
      if (uniqueClaims.length >= 2) {
        conflicts.push({
          id: 'conflict-box-office-reports',
          attribute: 'Box Office Collection Figure',
          status: 'TRADE_TRACKER_VARIANCE',
          description: `Different trade trackers reported divergent collection estimates (${uniqueClaims.slice(0, 3).join(' vs ')}).`,
          competingClaims: uniqueClaims.slice(0, 4).map(claim => {
            const supporting = boClaims.filter(b => b.claim === claim);
            return {
              claimValue: claim,
              frequency: supporting.length,
              sources: supporting.map(s => ({ source: s.source, url: s.url, publishedAt: s.publishedAt }))
            };
          }),
          recommendation: 'Track producer posters vs Sacnilk/BOCI independent theater net collections to isolate potential PR inflation.'
        });
      }
    }

    return conflicts;
  }
}

module.exports = { ConflictEngine };
