// server/engine/stateCalculatorHelpers.js
// Extracted computation logic from StateCalculator.calculate for cleaner design.
// This module is imported by stateCalculator.js and provides a single function
// that returns the full digital‑twin payload.

const { NarrativeClusterer } = require('./narrativeClusterer');
const { IssueDetector } = require('./issueDetector');
const { FalseSignalDetector } = require('./falseSignalDetector');
const { ConflictEngine } = require('./conflictEngine');
const { CinemaSolutionsEngine } = require('./cinemaSolutions');

/**
 * Compute the full state payload for a set of signals.
 * Mirrors the original logic from StateCalculator.calculate (minus the empty‑data guard).
 * @param {Array} signals - Array of signal objects.
 * @param {string} label - Optional label for the payload.
 * @returns {Object} State payload.
 */
function computeState(signals, label = 'Live State') {
  // 1. Cluster narratives
  const narratives = NarrativeClusterer.cluster(signals);

  // 2. Detect issues & controversies
  const issueAnalysis = IssueDetector.detectIssues(narratives);

  // 3. Detect false/weak signals
  const falseSignalAlerts = FalseSignalDetector.audit(signals, narratives);

  // 4. Run factual conflict checks
  const conflicts = ConflictEngine.analyze(signals);

  // 5. Partition signals by source category
  const socialSignals = signals.filter(s => s.sourceCategory === 'social' || s.sourceCategory === 'critics');
  const newsSignals = signals.filter(s => s.sourceCategory === 'news' || s.sourceCategory === 'trade');

  // Audience sentiment calculation (-100 to +100)
  const audienceSentiment = socialSignals.length > 0
    ? Math.round((socialSignals.reduce((a, s) => a + s.sentimentScore, 0) / socialSignals.length) * 100)
    : 0;

  // Media sentiment calculation (-100 to +100)
  const mediaSentiment = newsSignals.length > 0
    ? Math.round((newsSignals.reduce((a, s) => a + s.sentimentScore, 0) / newsSignals.length) * 100)
    : 0;

  // Overall composite sentiment
  const posSignals = signals.filter(s => s.sentimentLabel === 'POSITIVE');
  const negSignals = signals.filter(s => s.sentimentLabel === 'NEGATIVE');
  const neutralSignals = signals.filter(s => s.sentimentLabel === 'NEUTRAL');
  const overallSentiment = Math.round(((posSignals.length - negSignals.length) / signals.length) * 100);

  // Discussion Velocity (Signals per hour in active window)
  const validTimestamps = signals
    .map(s => new Date(s.publishedAt).getTime())
    .filter(t => !isNaN(t) && t > (Date.now() - 30 * 24 * 3600 * 1000));
  const signalsLast24h = signals.filter(s => s.ageMinutes <= 1440).length;
  let discussionVelocity = 0;
  if (signalsLast24h > 0) {
    discussionVelocity = Math.round((signalsLast24h / 24) * 10) / 10;
  } else if (validTimestamps.length > 0) {
    const minT = Math.min(...validTimestamps);
    const spanHours = Math.max(1, Math.min(168, (Date.now() - minT) / (3600 * 1000)));
    discussionVelocity = Math.round((signals.length / spanHours) * 10) / 10;
  } else {
    discussionVelocity = Math.round((signals.length / 48) * 10) / 10;
  }

  // Momentum calculations
  const posRatio = posSignals.length / signals.length;
  const negRatio = negSignals.length / signals.length;
  const positiveMomentum = Math.min(100, Math.round(posRatio * 80 + (posSignals.length > 5 ? 20 : posSignals.length * 4)));
  const negativeMomentum = Math.min(100, Math.round(negRatio * 80 + (issueAnalysis.totalIssuesCount * 8) + (issueAnalysis.hasCriticalIssue ? 20 : 0)));

  // Reputation Risk Score (0 - 100)
  let calculatedRisk = Math.round(
    (negativeMomentum * 0.45) +
    (issueAnalysis.activeIssues.length * 10) +
    (issueAnalysis.emergingControversies.length * 8) +
    (issueAnalysis.hasCriticalIssue ? 15 : 0)
  );
  if (positiveMomentum > negativeMomentum * 2) {
    calculatedRisk = Math.max(10, calculatedRisk - 15);
  }
  const reputationRiskScore = Math.min(100, Math.max(5, calculatedRisk));

  // Evidence Confidence
  const distinctPublishers = new Set(signals.map(s => s.source)).size;
  const distinctCategories = new Set(signals.map(s => s.sourceCategory)).size;
  let confidenceScore = Math.min(95, Math.round(
    Math.min(50, signals.length * 1.5) +
    (distinctPublishers * 3) +
    (distinctCategories * 7)
  ));
  if (signals.length < 5) confidenceScore = Math.min(45, confidenceScore);
  const evidenceConfidence = confidenceScore;

  // Individual Narrative Scoring
  const scoredNarratives = narratives.map(nar => {
    const isPositive = nar.type === 'POSITIVE';
    const isNegative = nar.type === 'NEGATIVE';
    const sigCount = nar.signalCount || 1;
    const vel = nar.velocityScore || 20;

    const viralityRiskScore = Math.min(100, Math.max(10, Math.round(
      (vel * 0.5) + (sigCount * 4) + (isNegative ? 25 : 0) + (nar.isCrossSourceConvergence ? 15 : 0)
    )));
    const polarizationScore = Math.min(100, Math.max(5, Math.round(
      (isNegative ? 65 : isPositive ? 25 : 45) + (nar.isCrossSourceConvergence ? 15 : 0)
    )));
    const credibilityScore = Math.min(98, Math.max(20, Math.round(
      (nar.sourceDiversity?.uniquePublishersCount || 1) * 16 + (evidenceConfidence * 0.3)
    )));
    const mediaAmplificationFactor = `${(1.0 + (vel / 35) + (sigCount * 0.15)).toFixed(1)}x`;
    const containmentPriorityScore = isNegative
      ? Math.min(100, Math.max(15, Math.round((viralityRiskScore * 0.6) + (credibilityScore * 0.4))))
      : Math.max(5, Math.round(viralityRiskScore * 0.2));
    const sentimentDragIndex = isNegative
      ? -Math.min(100, Math.round(sigCount * 12 + vel * 0.4))
      : isPositive
      ? Math.min(100, Math.round(sigCount * 12 + vel * 0.4))
      : 0;

    return {
      ...nar,
      scores: {
        viralityRiskScore,
        polarizationScore,
        credibilityScore,
        mediaAmplificationFactor,
        containmentPriorityScore,
        sentimentDragIndex
      }
    };
  });

  // Individual Issue Scoring
  const scoredIssues = issueAnalysis.activeIssues.map(issue => {
    const isCrit = issue.severity === 'CRITICAL';
    const isHigh = issue.severity === 'HIGH';

    const damagePotentialScore = isCrit ? 92 : isHigh ? 74 : 45;
    const escalationProbability = Math.min(95, Math.max(10, Math.round(
      (isCrit ? 60 : isHigh ? 40 : 20) + (discussionVelocity * 1.8) + (negativeMomentum * 0.25)
    )));
    const publicAttentionDecayHours = isCrit ? 96 : isHigh ? 48 : 24;
    const mitigationDifficultyScore = Math.min(95, Math.max(15, Math.round(
      (isCrit ? 80 : isHigh ? 55 : 30) + (issueAnalysis.totalIssuesCount * 5)
    )));

    return {
      ...issue,
      scores: {
        damagePotentialScore,
        escalationProbability,
        publicAttentionDecayHours,
        mitigationDifficultyScore
      }
    };
  });

  // Competing Narratives Partition
  const competingNarratives = {
    positive: scoredNarratives.filter(n => n.type === 'POSITIVE'),
    negative: scoredNarratives.filter(n => n.type === 'NEGATIVE'),
    emerging: scoredNarratives.filter(n => n.lifecycle === 'FIRST_DETECTED' || n.lifecycle === 'EMERGING'),
    neutral: scoredNarratives.filter(n => n.type === 'NEUTRAL')
  };

  // What Just Changed? Audit Event Stream
  const whatJustChanged = buildWhatJustChanged(signals, narratives, issueAnalysis);

  // WHY? Mathematical Explainability Models
  const whyBreakdowns = {
    riskScore: {
      metric: 'Reputation Risk Score',
      value: `${reputationRiskScore}/100`,
      formula: 'NegativeMomentum * 0.45 + ActiveIssues * 10 + Controversies * 8 + CriticalIssuePenalty',
      components: [
        { label: 'Negative Momentum Factor', contribution: Math.round(negativeMomentum * 0.45) },
        { label: `Active Issues (${issueAnalysis.totalIssuesCount})`, contribution: issueAnalysis.totalIssuesCount * 10 },
        { label: `Emerging Controversies (${issueAnalysis.emergingControversies.length})`, contribution: issueAnalysis.emergingControversies.length * 8 },
        { label: 'Critical Severity Flag', contribution: issueAnalysis.hasCriticalIssue ? 15 : 0 }
      ],
      confidence: `${evidenceConfidence}%`,
      sampleSize: `${signals.length} verified public signals across ${distinctPublishers} distinct outlets`
    },
    sentiment: {
      metric: 'Overall Composite Sentiment',
      value: `${overallSentiment > 0 ? '+' : ''}${overallSentiment}%`,
      formula: '(PositiveSignals - NegativeSignals) / TotalSignals',
      components: [
        { label: 'Positive Signals', count: posSignals.length, percentage: `${Math.round(posRatio * 100)}%` },
        { label: 'Negative Signals', count: negSignals.length, percentage: `${Math.round(negRatio * 100)}%` },
        { label: 'Neutral Signals', count: neutralSignals.length, percentage: `${Math.round((neutralSignals.length / signals.length) * 100)}%` }
      ],
      socialAudienceScore: `${audienceSentiment}%`,
      mainstreamMediaScore: `${mediaSentiment}%`
    },
    positiveMomentum: {
      metric: 'Positive Momentum',
      value: `${positiveMomentum}/100`,
      formula: 'PositiveRatio * 80 + VolumeBonus',
      supportingNarrativesCount: competingNarratives.positive.length,
      leadPositiveNarrative: competingNarratives.positive[0]?.headline || 'None identified'
    },
    negativeMomentum: {
      metric: 'Negative Momentum',
      value: `${negativeMomentum}/100`,
      formula: 'NegativeRatio * 80 + (Issues * 8) + SeverityWeight',
      supportingNarrativesCount: competingNarratives.negative.length,
      leadNegativeNarrative: competingNarratives.negative[0]?.headline || 'None identified'
    }
  };

  // First‑of‑its‑Kind Cinema Intelligence & Damage‑Control Solutions
  const cinemaSolutions = CinemaSolutionsEngine.generateSolutions(label, signals, {
    overallSentiment,
    audienceSentiment,
    mediaSentiment,
    reputationRiskScore,
    activeIssues: issueAnalysis.activeIssues,
    emergingControversies: issueAnalysis.emergingControversies,
    falseSignalAlerts,
    discussionVelocity
  });

  // Final payload
  return {
    label,
    hasData: true,
    totalSignalsCount: signals.length,
    overallSentiment,
    audienceSentiment,
    mediaSentiment,
    sentimentBreakdown: {
      positive: Math.round(posRatio * 100),
      neutral: Math.round((neutralSignals.length / signals.length) * 100),
      negative: Math.round(negRatio * 100),
      counts: {
        positive: posSignals.length,
        neutral: neutralSignals.length,
        negative: negSignals.length,
        total: signals.length
      }
    },
    positiveMomentum,
    negativeMomentum,
    discussionVelocity,
    reputationRiskScore,
    evidenceConfidence,
    distinctPublishersCount: distinctPublishers,
    distinctCategoriesCount: distinctCategories,
    activeIssuesCount: issueAnalysis.totalIssuesCount,
    narratives: scoredNarratives,
    competingNarratives,
    activeIssues: scoredIssues,
    emergingControversies: issueAnalysis.emergingControversies,
    falseSignalAlerts,
    conflicts,
    whatJustChanged,
    whyBreakdowns,
    cinemaSolutions,
    lastCalculatedAt: new Date().toISOString()
  };
}

// Helper to generate "What Just Changed" audit events
function buildWhatJustChanged(signals, narratives, issueAnalysis) {
  const events = [];
  const recentSignals = [...signals]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);

  // Signal arrival events
  if (recentSignals.length > 0) {
    events.push({
      id: 'ev-signals-arrived',
      timeAgo:
        recentSignals[0].ageMinutes < 60
          ? `${recentSignals[0].ageMinutes}m ago`
          : `${Math.round(recentSignals[0].ageMinutes / 60)}h ago`,
      type: 'SIGNAL_INGESTION',
      title: `${recentSignals.length} new signals verified by source adapters`,
      detail: `Newest item from ${recentSignals[0].source}: "${recentSignals[0].title.slice(0, 60)}..."`,
      url: recentSignals[0].url
    });
  }

  // Top narrative updates
  narratives.slice(0, 3).forEach(nar => {
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

module.exports = { computeState };

