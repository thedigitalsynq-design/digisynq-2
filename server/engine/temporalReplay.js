// server/engine/temporalReplay.js
// Slices evidence by historical time-windows to reconstruct the movie's digital state at past intervals

class TemporalReplayEngine {
  static generateHistorySlices(signals, stateCalculatorFn) {
    if (!signals || signals.length === 0) {
      return { snapshots: [], intervals: [] };
    }

    const now = Date.now();
    // Sort all signals chronologically
    const sorted = [...signals].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());

    // Define 5 temporal snapshots based on available age
    const intervals = [
      { id: 'T_MINUS_7D', label: '7 Days Ago', maxAgeHours: 168 },
      { id: 'T_MINUS_48H', label: '48 Hours Ago', maxAgeHours: 48 },
      { id: 'T_MINUS_24H', label: '24 Hours Ago', maxAgeHours: 24 },
      { id: 'T_MINUS_6H', label: '6 Hours Ago', maxAgeHours: 6 },
      { id: 'LIVE_NOW', label: 'Current State (Live)', maxAgeHours: 0 }
    ];

    const snapshots = intervals.map(interval => {
      let filtered;
      if (interval.maxAgeHours === 0) {
        filtered = sorted;
      } else {
        const cutoffTime = now - (interval.maxAgeHours * 3600 * 1000);
        filtered = sorted.filter(s => new Date(s.publishedAt).getTime() <= cutoffTime);
      }

      // Reconstruct state for this slice
      const state = stateCalculatorFn(filtered, interval.label);

      return {
        intervalId: interval.id,
        label: interval.label,
        signalCount: filtered.length,
        timestamp: interval.maxAgeHours === 0 ? new Date().toISOString() : new Date(now - interval.maxAgeHours * 3600 * 1000).toISOString(),
        state
      };
    });

    // Compute Before vs Now comparison between earliest meaningful snapshot and LIVE_NOW
    const earliestWithData = snapshots.find(s => s.signalCount >= 2) || snapshots[0];
    const latestSnapshot = snapshots[snapshots.length - 1];

    const beforeVsNow = {
      baselineLabel: earliestWithData.label,
      currentLabel: latestSnapshot.label,
      signalGrowth: latestSnapshot.signalCount - earliestWithData.signalCount,
      sentimentShift: (latestSnapshot.state?.overallSentiment || 0) - (earliestWithData.state?.overallSentiment || 0),
      velocityShift: (latestSnapshot.state?.discussionVelocity || 0) - (earliestWithData.state?.discussionVelocity || 0),
      riskShift: (latestSnapshot.state?.reputationRiskScore || 0) - (earliestWithData.state?.reputationRiskScore || 0),
      newIssuesDetected: (latestSnapshot.state?.activeIssuesCount || 0) - (earliestWithData.state?.activeIssuesCount || 0)
    };

    return { snapshots, intervals, beforeVsNow };
  }
}

module.exports = { TemporalReplayEngine };
