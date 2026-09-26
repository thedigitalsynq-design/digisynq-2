// server/engine/narrativeClusterer.js
// Clusters signals into cohesive narratives, tracks lifecycle, velocity, and cross-source convergence

class NarrativeClusterer {
  static cluster(signals) {
    if (!signals || signals.length === 0) return [];

    // Group signals by shared dominant topic and sentiment alignment
    const topicGroups = new Map();

    for (const signal of signals) {
      if (!signal.topics || signal.topics.length === 0) {
        // General buzz bucket
        const key = `GENERAL_${signal.sentimentLabel}`;
        if (!topicGroups.has(key)) {
          topicGroups.set(key, {
            topicKey: 'GENERAL',
            topicLabel: 'General Public Buzz & Awareness',
            sentiment: signal.sentimentLabel,
            signals: []
          });
        }
        topicGroups.get(key).signals.push(signal);
      } else {
        for (const topic of signal.topics) {
          const key = `${topic.key}_${signal.sentimentLabel}`;
          if (!topicGroups.has(key)) {
            topicGroups.set(key, {
              topicKey: topic.key,
              topicLabel: topic.label,
              sentiment: signal.sentimentLabel,
              signals: []
            });
          }
          topicGroups.get(key).signals.push(signal);
        }
      }
    }

    const narratives = [];
    let clusterIdx = 1;

    for (const [key, group] of topicGroups.entries()) {
      if (group.signals.length === 0) continue;

      // Deduplicate signals within the narrative
      const uniqueSignalMap = new Map();
      group.signals.forEach(s => uniqueSignalMap.set(s.id, s));
      const narrativeSignals = Array.from(uniqueSignalMap.values());

      // Calculate timestamps and span
      const timestamps = narrativeSignals
        .map(s => new Date(s.publishedAt).getTime())
        .filter(t => !isNaN(t))
        .sort((a, b) => a - b);

      const firstTime = timestamps[0] || Date.now();
      const lastTime = timestamps[timestamps.length - 1] || Date.now();
      const spanHours = Math.max(0.5, (lastTime - firstTime) / (1000 * 3600));

      // Calculate distinct platforms and source domains
      const distinctSources = new Set(narrativeSignals.map(s => s.source));
      const distinctCategories = new Set(narrativeSignals.map(s => s.sourceCategory));

      // Cross-source convergence: observed independently across >= 2 different categories (e.g. news + social)
      const isCrossSourceConvergence = distinctCategories.size >= 2 && distinctSources.size >= 3;

      // Calculate Narrative Velocity: (mentions / spanHours) weighted by source diversity
      const rawMentionsPerHour = narrativeSignals.length / spanHours;
      const velocityIndex = Math.min(100, Math.round(rawMentionsPerHour * (1 + distinctCategories.size * 0.25) * 10));

      // Calculate Lifecycle based on acceleration and time
      const lifecycle = NarrativeClusterer.calculateLifecycle(narrativeSignals, spanHours, velocityIndex);

      // Determine Reliability
      const reliability = NarrativeClusterer.calculateReliability(narrativeSignals, distinctSources.size, distinctCategories.size);

      // Generate a descriptive, real-data-backed headline
      const headline = NarrativeClusterer.generateHeadline(group.topicLabel, group.sentiment, narrativeSignals);

      narratives.push({
        id: `nar-${clusterIdx++}`,
        topicKey: group.topicKey,
        topicLabel: group.topicLabel,
        type: group.sentiment === 'POSITIVE' ? 'POSITIVE' : group.sentiment === 'NEGATIVE' ? 'NEGATIVE' : 'NEUTRAL',
        headline,
        signalCount: narrativeSignals.length,
        signals: narrativeSignals,
        sourceDiversity: {
          categoriesCount: distinctCategories.size,
          categories: Array.from(distinctCategories),
          uniquePublishersCount: distinctSources.size,
          publishers: Array.from(distinctSources).slice(0, 8)
        },
        firstDetectedAt: new Date(firstTime).toISOString(),
        lastDetectedAt: new Date(lastTime).toISOString(),
        velocityScore: velocityIndex, // 0 - 100
        velocityTrend: velocityIndex > 60 ? 'ACCELERATING' : velocityIndex > 30 ? 'STEADY' : 'DECELERATING',
        lifecycle,
        isCrossSourceConvergence,
        reliability: reliability.level, // 'HIGH' | 'MEDIUM' | 'LOW'
        reliabilityReason: reliability.reason,
        whyCalculation: {
          formula: 'Mentions / SpanHours * (1 + CategoryDiversity * 0.25)',
          spanHours: Math.round(spanHours * 10) / 10,
          rawMentions: narrativeSignals.length,
          categoriesDetected: Array.from(distinctCategories),
          uniqueOutlets: distinctSources.size,
          evidenceLinks: narrativeSignals.map(s => ({
            title: s.title,
            source: s.source,
            url: s.url,
            publishedAt: s.publishedAt
          }))
        }
      });
    }

    // Sort by signalCount and velocity
    return narratives.sort((a, b) => (b.signalCount * 2 + b.velocityScore) - (a.signalCount * 2 + a.velocityScore));
  }

  static calculateLifecycle(signals, spanHours, velocity) {
    if (signals.length <= 1) return 'FIRST_DETECTED';
    if (spanHours < 4 && velocity > 50) return 'EMERGING';
    if (velocity > 60 && signals.length >= 4) return 'GROWING';
    if (velocity > 75) return 'PEAK';
    if (spanHours > 48 && velocity < 20) return 'DECLINING';
    if (spanHours > 96 && velocity < 10) return 'DORMANT';
    return 'STABLE';
  }

  static calculateReliability(signals, uniqueSources, categoryCount) {
    if (signals.length === 1) {
      return {
        level: 'LOW',
        reason: 'Single-source observation only; pending independent corroboration across other sensor feeds.'
      };
    }

    const syndicatedSignals = signals.filter(s => s.isSyndicated);
    if (syndicatedSignals.length > signals.length * 0.6 && uniqueSources <= 2) {
      return {
        level: 'LOW',
        reason: 'High syndication detected; near-identical wire copy distributed across limited independent channels.'
      };
    }

    if (categoryCount >= 2 && uniqueSources >= 3) {
      return {
        level: 'HIGH',
        reason: `Corroborated across ${uniqueSources} distinct outlets spanning ${categoryCount} independent sensor categories.`
      };
    }

    return {
      level: 'MEDIUM',
      reason: `Reported by ${uniqueSources} sources, but concentrated in a single channel category.`
    };
  }

  static generateHeadline(topicLabel, sentiment, signals) {
    // Pick the most representative headline or summarize with evidence
    const longestTitleSignal = [...signals].sort((a, b) => b.title.length - a.title.length)[0];
    const prefix = sentiment === 'POSITIVE' ? 'Positive Reception' : sentiment === 'NEGATIVE' ? 'Criticism & Concerns' : 'Discourse & Updates';
    
    if (longestTitleSignal && longestTitleSignal.title.length > 20 && longestTitleSignal.title.length < 90) {
      return `${topicLabel}: "${longestTitleSignal.title}"`;
    }

    return `${prefix} regarding ${topicLabel} (${signals.length} verified signals)`;
  }
}

module.exports = { NarrativeClusterer };
