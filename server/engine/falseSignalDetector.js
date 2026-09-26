// server/engine/falseSignalDetector.js
// Identifies suspicious spikes, syndicated wire replication, single-source narratives, and unverified rumors

class FalseSignalDetector {
  static audit(signals, narratives) {
    const alerts = [];

    // 1. Check for single-source narratives with extreme negative sentiment
    for (const narrative of narratives) {
      if (narrative.signalCount === 1) {
        alerts.push({
          id: `fs-single-${narrative.id}`,
          type: 'ISOLATED_SINGLE_SOURCE',
          title: `Single-Source Claim: "${narrative.headline.slice(0, 70)}..."`,
          severity: 'CAUTION',
          reliability: 'LOW',
          narrativeId: narrative.id,
          explanation: 'This narrative originates from only 1 retrieved publication. Without cross-corroboration, treating this as an established issue poses reputation misdiagnosis risk.',
          evidence: narrative.signals[0]
        });
      }

      // 2. High syndication / wire copy-paste replication
      const syndicated = narrative.signals.filter(s => s.isSyndicated);
      if (syndicated.length >= 2 && narrative.sourceDiversity.uniquePublishersCount <= 2) {
        alerts.push({
          id: `fs-syndicated-${narrative.id}`,
          type: 'WIRE_REPLICATION_CASCADE',
          title: `Wire/Syndication Duplication in "${narrative.topicLabel}"`,
          severity: 'INFO',
          reliability: 'MEDIUM',
          narrativeId: narrative.id,
          explanation: `${syndicated.length} items share near-identical copy from a single press release or wire feed (ANI/PTI), artificially inflating volume without independent editorial verification.`,
          evidence: narrative.signals.slice(0, 3)
        });
      }
    }

    // 3. Temporal burst anomaly detection (e.g. 5+ signals within 15 minutes from unverified sources)
    const recentSignals = signals.filter(s => s.ageMinutes <= 30);
    if (recentSignals.length >= 8) {
      const distinctSources = new Set(recentSignals.map(s => s.source)).size;
      if (distinctSources <= 2) {
        alerts.push({
          id: 'fs-burst-anomaly',
          type: 'CONCENTRATED_VELOCITY_SPIKE',
          title: 'Abnormal Signal Concentration Detected',
          severity: 'CAUTION',
          reliability: 'LOW',
          explanation: `${recentSignals.length} signals detected in the last 30 minutes coming from only ${distinctSources} publishers. Potential PR blitz or localized discussion spike.`,
          evidence: recentSignals.slice(0, 4)
        });
      }
    }

    return alerts;
  }
}

module.exports = { FalseSignalDetector };
