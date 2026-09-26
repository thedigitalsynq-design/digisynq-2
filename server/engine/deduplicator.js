// server/engine/deduplicator.js
// Detects exact duplicates, syndicated wire copies, and calculates true source diversity

class SignalDeduplicator {
  static process(signals) {
    const clusterMap = new Map();
    const uniqueSignals = [];
    const syndicatedClusters = [];

    // Group by similarity fingerprint
    for (const signal of signals) {
      const fp = signal.fingerprint;
      if (!fp || fp.length < 5) {
        uniqueSignals.push(signal);
        continue;
      }

      if (clusterMap.has(fp)) {
        const primary = clusterMap.get(fp);
        primary.syndicationCount = (primary.syndicationCount || 1) + 1;
        primary.syndicatedSources = primary.syndicatedSources || [primary.source];
        if (!primary.syndicatedSources.includes(signal.source)) {
          primary.syndicatedSources.push(signal.source);
        }
        primary.isSyndicated = true;

        signal.isSyndicated = true;
        signal.syndicatedTo = primary.id;
        syndicatedClusters.push({
          primaryId: primary.id,
          duplicateId: signal.id,
          source: signal.source,
          url: signal.url
        });
      } else {
        clusterMap.set(fp, signal);
        uniqueSignals.push(signal);
      }
    }

    return {
      allSignals: signals,
      primarySignals: uniqueSignals,
      syndicatedCount: signals.length - uniqueSignals.length,
      syndicatedClusters
    };
  }
}

module.exports = { SignalDeduplicator };
