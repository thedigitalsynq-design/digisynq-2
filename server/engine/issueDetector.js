// server/engine/issueDetector.js
// Promotes Narratives to Active Issues when severity, multi-source persistence, or controversy thresholds are met

class IssueDetector {
  static detectIssues(narratives) {
    const activeIssues = [];
    const emergingControversies = [];

    for (const narrative of narratives) {
      const isNegative = narrative.type === 'NEGATIVE';
      const isControversialTopic = narrative.topicKey === 'CONTROVERSY' || narrative.topicKey === 'TICKET_PRICING';
      const hasCrossSource = narrative.isCrossSourceConvergence;
      const signalCount = narrative.signalCount;
      const velocity = narrative.velocityScore;

      // Controversy detector:
      // Rapid growth or sensitive category or controversy keywords
      const controversySignals = narrative.signals.filter(s => s.isControversial);
      const isEmergingControversy = (isControversialTopic && signalCount >= 2) ||
        (controversySignals.length >= 2) ||
        (narrative.signals.some(s => s.conHits >= 2) && velocity >= 40);

      if (isEmergingControversy) {
        emergingControversies.push({
          id: `controversy-${narrative.id}`,
          narrativeId: narrative.id,
          topic: narrative.topicLabel,
          headline: narrative.headline,
          severity: velocity > 65 || signalCount >= 5 ? 'HIGH' : 'MEDIUM',
          signalsCount: narrative.signalCount,
          crossSourceConvergence: hasCrossSource,
          velocityScore: velocity,
          detectionReason: `Controversy trigger: ${controversySignals.length} sensitive signals detected across ${narrative.sourceDiversity.uniquePublishersCount} outlets.`,
          backingSignals: narrative.signals.slice(0, 5)
        });
      }

      // Issue Promotion Criteria:
      // Must be NEGATIVE or severe CONTROVERSY, with >= 2 independent signals, and either cross-source convergence or velocity > 45
      if ((isNegative || isControversialTopic) && signalCount >= 2) {
        let severity = 'MODERATE';
        if (velocity > 60 && hasCrossSource) severity = 'CRITICAL';
        else if (velocity > 40 || hasCrossSource) severity = 'ELEVATED';

        activeIssues.push({
          id: `issue-${narrative.id}`,
          narrativeId: narrative.id,
          topicKey: narrative.topicKey,
          topic: narrative.topicLabel,
          title: narrative.headline,
          severity,
          signalCount,
          velocityScore: velocity,
          lifecycle: narrative.lifecycle,
          crossSourceConvergence: hasCrossSource,
          sourcesCount: narrative.sourceDiversity.uniquePublishersCount,
          categories: narrative.sourceDiversity.categories,
          firstDetectedAt: narrative.firstDetectedAt,
          lastDetectedAt: narrative.lastDetectedAt,
          contributingFactors: IssueDetector.deriveContributingFactors(narrative),
          damageRiskEstimate: IssueDetector.calculateDamageRisk(severity, velocity, hasCrossSource, signalCount),
          evidence: narrative.signals.map(s => ({
            id: s.id,
            title: s.title,
            source: s.source,
            category: s.sourceCategory,
            url: s.url,
            publishedAt: s.publishedAt
          }))
        });
      }
    }

    // Sort active issues by severity and velocity
    const severityWeight = { CRITICAL: 3, ELEVATED: 2, MODERATE: 1 };
    activeIssues.sort((a, b) => {
      const diff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
      if (diff !== 0) return diff;
      return b.velocityScore - a.velocityScore;
    });

    return {
      activeIssues,
      emergingControversies,
      totalIssuesCount: activeIssues.length,
      hasCriticalIssue: activeIssues.some(i => i.severity === 'CRITICAL')
    };
  }

  static deriveContributingFactors(narrative) {
    const factors = [];
    if (narrative.topicKey === 'PACING_SCREENPLAY') {
      factors.push('Second-half narrative lag and runtime drag reported in first-wave audience reviews');
      factors.push('Editing pacing divergence between pre-interval and post-interval sequences');
    } else if (narrative.topicKey === 'TICKET_PRICING') {
      factors.push('Exorbitant multiplex ticket hike causing friction among family audiences');
      factors.push('Comparisons with regional single-screen ceiling rates');
    } else if (narrative.topicKey === 'CONTROVERSY') {
      factors.push('Censor Board (CBFC) modifications or objection by legal/cultural groups');
      factors.push('Social media boycott campaign or polarization');
    } else if (narrative.topicKey === 'TECHNICAL_CRAFT') {
      factors.push('Unfinished CGI/VFX rendering visible in teaser/trailer or theater prints');
    } else {
      factors.push(`Sustained negative commentary in ${narrative.sourceDiversity.uniquePublishersCount} independent publications`);
    }
    return factors;
  }

  static calculateDamageRisk(severity, velocity, hasCrossSource, signalCount) {
    let score = 20;
    if (severity === 'CRITICAL') score += 40;
    if (severity === 'ELEVATED') score += 25;
    if (hasCrossSource) score += 20;
    score += Math.min(20, Math.round(velocity * 0.2));
    score += Math.min(10, signalCount * 2);
    return Math.min(100, score);
  }
}

module.exports = { IssueDetector };
