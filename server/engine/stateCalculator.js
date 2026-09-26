// server/engine/stateCalculator.js
// Constructs the Movie Digital Twin state from live evidence with full mathematical explainability

const { NarrativeClusterer } = require('./narrativeClusterer');
const { IssueDetector } = require('./issueDetector');
const { FalseSignalDetector } = require('./falseSignalDetector');
const { ConflictEngine } = require('./conflictEngine');
const { CinemaSolutionsEngine } = require('./cinemaSolutions');
const { computeState } = require('./stateCalculatorHelpers');

class StateCalculator {
  static calculate(signals, label = 'Live State') {
    if (!signals || signals.length === 0) {
      return {
        label,
        hasData: false,
        message: 'Insufficient public data detected. 0 signals retrieved from public internet sensors.',
        overallSentiment: 0,
        audienceSentiment: 0,
        mediaSentiment: 0,
        positiveMomentum: 0,
        negativeMomentum: 0,
        discussionVelocity: 0,
        reputationRiskScore: 0,
        evidenceConfidence: 0,
        narratives: [],
        competingNarratives: { positive: [], negative: [], emerging: [], neutral: [] },
        activeIssues: [],
        emergingControversies: [],
        falseSignalAlerts: [],
        conflicts: [],
        whatJustChanged: [],
        freshnessMap: {}
      };
    }

    //     // Delegated heavy computation to helper for cleaner design
    
    return computeState(signals, label);
  }

  static buildWhatJustChanged(signals, narratives, issueAnalysis) {
    const events = [];
    const recentSignals = [...signals].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 10);

    // Signal arrival events
    if (recentSignals.length > 0) {
      events.push({
        id: 'ev-signals-arrived',
        timeAgo: recentSignals[0].ageMinutes < 60 ? `${recentSignals[0].ageMinutes}m ago` : `${Math.round(recentSignals[0].ageMinutes / 60)}h ago`,
        type: 'SIGNAL_INGESTION',
        title: `${recentSignals.length} new signals verified by source adapters`,
        detail: `Newest item from ${recentSignals[0].source}: "${recentSignals[0].title.slice(0, 60)}..."`,
        url: recentSignals[0].url
      });
    }

    // Top narrative updates
    narratives.slice(0, 3).forEach((nar, idx) => {
      if (nar.isCrossSourceConvergence) {
        events.push({
          id: `ev-cross-source-${nar.id}`,
          timeAgo: 'Recent',
          type: 'CROSS_SOURCE_CONVERGENCE',
          title: `Independent-Source Convergence Confirmed on "${nar.topicLabel}"`,
          detail: `Observed independently across ${nar.sourceDiversity.uniquePublishersCount} outlets in ${nar.sourceDiversity.categories.join(' & ')}.`,
          url: nar.signals[0]?.url
        });
      }
      if (nar.velocityScore > 50) {
        events.push({
          id: `ev-velocity-${nar.id}`,
          timeAgo: 'Recent',
          type: 'VELOCITY_ACCELERATION',
          title: `Narrative Velocity Acceleration: "${nar.headline.slice(0, 50)}..."`,
          detail: `Velocity index peaked at ${nar.velocityScore}/100 with ${nar.signalCount} backing signals.`,
          url: nar.signals[0]?.url
        });
      }
    });

    // Active issue escalations
    issueAnalysis.activeIssues.forEach(iss => {
      events.push({
        id: `ev-issue-${iss.id}`,
        timeAgo: 'Active',
        type: 'ISSUE_ESCALATION',
        title: `Damage-Control Alert: Issue Escalated to ${iss.severity}`,
        detail: `${iss.topic} — Damage risk index calculated at ${iss.damageRiskEstimate}%.`,
        url: iss.evidence[0]?.url
      });
    });

    return events.slice(0, 8);
  }
}

module.exports = { StateCalculator };
