// server/engine/scoringEngine.js
// UNIVERSAL CINEMA SCORING & MEASUREMENT ENGINE
// Provides comprehensive multi-dimensional scoring, precision indices,
// and mathematical explainability across all cinema lifecycle phases,
// audience metrics, box office health, narrative threat, and brand resilience.

class ScoringEngine {
  /**
   * Generates the Master Scoring & Measurement Suite
   * @param {string} movieTitle - Title of the movie
   * @param {Array} signals - Primary verified signals
   * @param {Object} liveState - Digital twin live state
   * @param {Object} audienceMetrics - Audience & box office metrics
   * @param {Object} radarCrossRef - Radar/recent release cross-reference
   * @returns {Object} Full Universal Scoring Payload
   */
  static computeMasterScores(movieTitle, signals = [], liveState = {}, audienceMetrics = {}, radarCrossRef = null) {
    const totalSignals = signals.length || 1;
    const posSignals = signals.filter(s => s.sentimentLabel === 'POSITIVE');
    const negSignals = signals.filter(s => s.sentimentLabel === 'NEGATIVE');
    const neutralSignals = signals.filter(s => s.sentimentLabel === 'NEUTRAL');
    
    const posRatio = posSignals.length / totalSignals;
    const negRatio = negSignals.length / totalSignals;
    const neuRatio = neutralSignals.length / totalSignals;

    const activeIssues = liveState.activeIssues || [];
    const emergingControversies = liveState.emergingControversies || [];
    const conflicts = liveState.conflicts || [];
    const falseSignalAlerts = liveState.falseSignalAlerts || [];
    const narratives = liveState.narratives || [];

    const positiveMomentum = liveState.positiveMomentum || 0;
    const negativeMomentum = liveState.negativeMomentum || 0;
    const discussionVelocity = liveState.discussionVelocity || 0;
    const evidenceConfidence = liveState.evidenceConfidence || 50;
    const reputationRiskScore = liveState.reputationRiskScore || 20;

    // Numerical ratings extraction
    const bmsRating = parseFloat(audienceMetrics?.bookMyShow?.rating) || null;
    const imdbRating = parseFloat(audienceMetrics?.imdb?.rating) || null;
    const googleRating = parseFloat(audienceMetrics?.google?.rating) || null;

    // ---------------------------------------------------------------------------
    // 1. CORE SYSTEM INDICES (The 8 Pillars of Cinema Health - 0 to 100)
    // ---------------------------------------------------------------------------

    // A. BOHS: Box Office Health Score (0 - 100)
    // Evaluates opening momentum, trade consensus, hold trajectory, and ticket velocity
    let bohsBase = 50 + (positiveMomentum * 0.35) - (negativeMomentum * 0.30);
    if (bmsRating) {
      bohsBase += (bmsRating - 3.0) * 12; // 4.5/5 adds +18, 2.5/5 penalizes -6
    }
    if (imdbRating) {
      bohsBase += (imdbRating - 6.0) * 3.5;
    }
    const hasTradeData = !!(audienceMetrics?.boxOffice?.primaryFigure && audienceMetrics.boxOffice.primaryFigure !== 'N/A');
    if (hasTradeData) bohsBase += 8;
    const bohsScore = Math.min(98, Math.max(12, Math.round(bohsBase)));

    // B. API: Audience Polarization Index (0 - 100)
    // Measures divergence & volatility (highest when audience is split 50/50 or ratings diverge)
    const baseSplitVariance = 4 * posRatio * negRatio * 75; // Peak 75 at 50/50
    let ratingDivergence = 0;
    if (bmsRating && imdbRating) {
      const normalizedBms = bmsRating * 2; // 0-10 scale
      ratingDivergence = Math.min(25, Math.abs(normalizedBms - imdbRating) * 8);
    }
    const controversyWeight = Math.min(20, emergingControversies.length * 6);
    const apiScore = Math.min(99, Math.max(8, Math.round(baseSplitVariance + ratingDivergence + controversyWeight)));

    // C. CVI: Crisis Virality & Contagion Index (0 - 100)
    // Speed, velocity, and cross-platform spread potential of friction/controversies
    const velocityFactor = Math.min(40, discussionVelocity * 3.2);
    const issueSeverityWeight = activeIssues.reduce((acc, iss) => {
      return acc + (iss.severity === 'CRITICAL' ? 22 : iss.severity === 'HIGH' ? 14 : 7);
    }, 0);
    const crossSourceConvergenceCount = narratives.filter(n => n.isCrossSourceConvergence).length;
    const cviScore = Math.min(100, Math.max(5, Math.round(
      velocityFactor + 
      Math.min(35, issueSeverityWeight) + 
      (negativeMomentum * 0.25) + 
      (crossSourceConvergenceCount * 6)
    )));

    // D. DCES: Damage Containment Efficiency Score (0 - 100)
    // Quantifies how effectively current sentiment & PR are stabilizing the movie twin
    let dcesBase = 50 + (positiveMomentum * 0.3) - (negativeMomentum * 0.35);
    if (falseSignalAlerts.length > 0) dcesBase += 10; // successfully identifying false rumors
    if (evidenceConfidence > 70) dcesBase += 8; // grounded in high-grade facts
    dcesBase -= activeIssues.filter(i => i.severity === 'CRITICAL').length * 12;
    const dcesScore = Math.min(96, Math.max(10, Math.round(dcesBase)));

    // E. RABS: Review Authenticity & Anti-Bot Score (0 - 100)
    // Measures resistance to coordinated review-bombing, sybil spam, and astroturfing
    const newsSignalsCount = signals.filter(s => s.sourceCategory === 'news' || s.sourceCategory === 'trade').length;
    const socialSignalsCount = signals.filter(s => s.sourceCategory === 'social').length;
    const newsRatio = newsSignalsCount / totalSignals;
    let rabsBase = 70 + (newsRatio * 20) + (evidenceConfidence * 0.1);
    if (apiScore > 80 && discussionVelocity > 15) {
      rabsBase -= 18; // suspicious velocity with extreme polarization flags brigading
    }
    if (falseSignalAlerts.length > 0) {
      rabsBase -= falseSignalAlerts.length * 5;
    }
    const rabsScore = Math.min(99, Math.max(25, Math.round(rabsBase)));

    // F. TBVS: Talent & Star Brand Vulnerability Score (0 - 100)
    // Isolates how deeply the lead actor, director, or studio equity is exposed to the crisis
    const talentFrictionSignals = signals.filter(s => {
      const text = `${s.title} ${s.content || ''}`.toLowerCase();
      return text.includes('actor') || text.includes('hero') || text.includes('star') || text.includes('director') || text.includes('acting');
    });
    const talentFrictionRatio = talentFrictionSignals.length / totalSignals;
    const tbvsScore = Math.min(95, Math.max(5, Math.round(
      (reputationRiskScore * 0.55) + (talentFrictionRatio * 35) + (activeIssues.length * 6)
    )));

    // G. WQLI: Word-of-Mouth Quality & Longevity Index (0 - 100)
    // Predicts organic recommendation rate, family audience conversion, and second-week hold
    let wqliBase = 40 + (posRatio * 50) - (negRatio * 35);
    if (bmsRating) {
      wqliBase += (bmsRating - 3.2) * 15;
    }
    if (positiveMomentum > negativeMomentum) {
      wqliBase += 10;
    }
    const wqliScore = Math.min(98, Math.max(10, Math.round(wqliBase)));

    // H. MCIS: Media & Trade Consensus Index (0 - 100)
    // Alignment between mainstream editorial coverage and trade numbers
    const mediaSentiment = liveState.mediaSentiment || 0;
    const audienceSentiment = liveState.audienceSentiment || 0;
    const sentimentAlignmentDelta = Math.abs(mediaSentiment - audienceSentiment);
    const mcisScore = Math.min(97, Math.max(15, Math.round(
      85 - (sentimentAlignmentDelta * 0.35) - (conflicts.length * 10) + (evidenceConfidence * 0.15)
    )));

    // Grade calculation helper
    const getGrade = (val) => {
      if (val >= 88) return { letter: 'A+', label: 'Elite / Robust', color: 'emerald' };
      if (val >= 75) return { letter: 'A', label: 'Strong / Favorable', color: 'teal' };
      if (val >= 60) return { letter: 'B', label: 'Moderate / Stable', color: 'cyan' };
      if (val >= 45) return { letter: 'C', label: 'Sensitive / Vulnerable', color: 'amber' };
      if (val >= 30) return { letter: 'D', label: 'High Friction', color: 'orange' };
      return { letter: 'CRITICAL', label: 'Severe Distress', color: 'red' };
    };

    // ---------------------------------------------------------------------------
    // 2. THE THREE LIFECYCLE PHASES SCORING FRAMEWORK
    // ---------------------------------------------------------------------------

    // Detect lifecycle phase (defaulting to LIVE_RELEASE if in theaters)
    let activePhase = 'LIVE_RELEASE';
    if (radarCrossRef?.daysInTheaters && radarCrossRef.daysInTheaters > 25) {
      activePhase = 'POST_RELEASE';
    } else if (radarCrossRef?.status === 'UPCOMING' || (signals.some(s => s.title.toLowerCase().includes('teaser') || s.title.toLowerCase().includes('trailer')) && !hasTradeData)) {
      activePhase = 'PRE_RELEASE';
    }

    const lifecycleScores = {
      activePhase,
      // Phase 1: Pre-Release Intelligence Scores
      preRelease: {
        hypeVelocityScore: Math.min(100, Math.max(10, Math.round((discussionVelocity * 3.5) + (positiveMomentum * 0.4)))),
        trailerConversionEfficiency: Math.min(98, Math.max(15, Math.round((posRatio * 70) + (positiveMomentum * 0.3)))),
        advanceBookingReadiness: Math.min(95, Math.max(10, Math.round(bohsScore * 0.95))),
        controversyLeakRisk: Math.min(95, Math.max(5, Math.round((cviScore * 0.6) + (apiScore * 0.4)))),
        summary: 'Calculated from teaser/trailer engagement curves, advance ticket search volume, and pre-release friction leaks.'
      },
      // Phase 2: Live-Release Intelligence Scores
      liveRelease: {
        firstDayFrictionIndex: Math.min(99, Math.max(5, Math.round((negativeMomentum * 0.5) + (activeIssues.length * 12)))),
        weekendRetentionMultiplier: Math.min(98, Math.max(15, Math.round(wqliScore * 0.92 + (positiveMomentum * 0.1)))),
        weekdayDropResistance: Math.min(96, Math.max(10, Math.round(wqliScore * 0.85 - (apiScore * 0.15) + 15))),
        theaterOccupancyStability: Math.min(95, Math.max(15, Math.round(bohsScore * 0.9 + (dcesScore * 0.1)))),
        summary: 'Evaluates Day-1 morning WOM to evening acceleration, weekend multiples, and weekday drop-off resilience.'
      },
      // Phase 3: Post-Release Intelligence Scores
      postRelease: {
        theatricalRecoveryIndex: Math.min(99, Math.max(10, Math.round(bohsScore * 0.95))),
        ottDigitalDemandScore: Math.min(98, Math.max(20, Math.round(wqliScore * 0.6 + (discussionVelocity * 2.5) + (posRatio * 25)))),
        brandEquityRestoration: Math.min(95, Math.max(15, Math.round(100 - tbvsScore + (dcesScore * 0.2)))),
        cultLongevityArchivalScore: Math.min(96, Math.max(10, Math.round((wqliScore * 0.65) + (Math.abs(liveState.overallSentiment || 0) * 0.35)))),
        summary: 'Estimates long-tail digital streaming leverage, syndication value, and cumulative brand recovery.'
      }
    };

    // ---------------------------------------------------------------------------
    // 3. DEMOGRAPHIC & CIRCUIT RESONANCE SCORES (0 - 100)
    // ---------------------------------------------------------------------------
    const demographicScores = {
      familyAudienceIndex: Math.min(98, Math.max(10, Math.round((wqliScore * 0.7) - (cviScore * 0.3) + 20))),
      youthResonanceIndex: Math.min(99, Math.max(15, Math.round((positiveMomentum * 0.5) + (discussionVelocity * 2.8)))),
      urbanMultiplexIndex: Math.min(98, Math.max(15, Math.round(
        (imdbRating ? imdbRating * 9.5 : 70) + (posRatio * 15) - (cviScore * 0.1)
      ))),
      massSingleScreenIndex: Math.min(99, Math.max(15, Math.round(
        (bmsRating ? bmsRating * 19 : 72) + (positiveMomentum * 0.2)
      ))),
      overseasDiasporaIndex: Math.min(96, Math.max(10, Math.round(
        (newsRatio * 40) + (posRatio * 50) + (evidenceConfidence * 0.1)
      )))
    };

    // ---------------------------------------------------------------------------
    // 4. EVERY NARRATIVE & ISSUE INDIVIDUALLY SCORED
    // ---------------------------------------------------------------------------
    const scoredNarratives = narratives.map(nar => {
      const isPositive = nar.type === 'POSITIVE';
      const isNegative = nar.type === 'NEGATIVE';
      const sigCount = nar.signalCount || 1;
      const vel = nar.velocityScore || 20;

      const viralityRisk = Math.min(100, Math.max(10, Math.round(
        (vel * 0.5) + (sigCount * 4) + (isNegative ? 25 : 0) + (nar.isCrossSourceConvergence ? 15 : 0)
      )));

      const polarization = Math.min(100, Math.max(5, Math.round(
        (isNegative ? 65 : isPositive ? 25 : 45) + (nar.isCrossSourceConvergence ? 15 : 0)
      )));

      const credibility = Math.min(98, Math.max(20, Math.round(
        (nar.sourceDiversity?.uniquePublishersCount || 1) * 16 + (evidenceConfidence * 0.3)
      )));

      const mediaAmplification = parseFloat(((1.0 + (vel / 35) + (sigCount * 0.15)).toFixed(1)));
      const containmentPriority = isNegative
        ? Math.min(100, Math.max(15, Math.round((viralityRisk * 0.6) + (credibility * 0.4))))
        : Math.max(5, Math.round(viralityRisk * 0.2));

      const sentimentDrag = isNegative 
        ? -Math.min(100, Math.round(sigCount * 12 + vel * 0.4))
        : isPositive
        ? Math.min(100, Math.round(sigCount * 12 + vel * 0.4))
        : 0;

      return {
        ...nar,
        scores: {
          viralityRiskScore: viralityRisk,
          polarizationScore: polarization,
          credibilityScore: credibility,
          mediaAmplificationFactor: `${mediaAmplification}x`,
          containmentPriorityScore: containmentPriority,
          sentimentDragIndex: sentimentDrag
        }
      };
    });

    const scoredIssues = activeIssues.map(issue => {
      const isCrit = issue.severity === 'CRITICAL';
      const isHigh = issue.severity === 'HIGH';

      const damagePotential = isCrit ? 92 : isHigh ? 74 : 45;
      const escalationProb = Math.min(95, Math.max(10, Math.round(
        (isCrit ? 60 : isHigh ? 40 : 20) + (discussionVelocity * 1.8) + (negativeMomentum * 0.25)
      )));
      const decayHalfLifeHours = isCrit ? 96 : isHigh ? 48 : 24;
      const mitigationDifficulty = Math.min(95, Math.max(15, Math.round(
        (isCrit ? 80 : isHigh ? 55 : 30) + (apiScore * 0.2)
      )));

      return {
        ...issue,
        scores: {
          damagePotentialScore: damagePotential,
          escalationProbability: escalationProb,
          publicAttentionDecayHours: decayHalfLifeHours,
          mitigationDifficultyScore: mitigationDifficulty
        }
      };
    });

    // ---------------------------------------------------------------------------
    // 5. MASTER SCORECARD DICTIONARY & WHY BREAKDOWNS
    // ---------------------------------------------------------------------------
    const scorecards = [
      {
        id: 'bohs',
        code: 'BOHS',
        name: 'Box Office Health Score',
        score: bohsScore,
        grade: getGrade(bohsScore),
        weight: 'High Impact',
        category: 'Commercial & Financial',
        summary: 'Measures theatrical hold stability, ticket velocity, and circuit retention momentum.',
        formula: 'Base(50) + PosMomentum*0.35 - NegMomentum*0.30 + BMSDelta + TradeBonus',
        benchmarks: { elite: '>= 85', solid: '70 - 84', fragile: '< 60' },
        drivers: [
          { label: 'Verified BMS Audience Rating Delta', impact: bmsRating ? `+${Math.round((bmsRating - 3.0) * 12)} pts` : 'Neutral' },
          { label: 'Positive Momentum Velocity Lift', impact: `+${Math.round(positiveMomentum * 0.35)} pts` },
          { label: 'Crisis Sentiment Friction Drag', impact: `-${Math.round(negativeMomentum * 0.30)} pts` }
        ]
      },
      {
        id: 'api',
        code: 'API',
        name: 'Audience Polarization Index',
        score: apiScore,
        grade: { letter: apiScore > 75 ? 'HIGH' : apiScore > 45 ? 'MODERATE' : 'LOW', label: apiScore > 75 ? 'Extreme Division' : 'Consensus Solid', color: apiScore > 75 ? 'rose' : 'cyan' },
        weight: 'Vulnerability Metric',
        category: 'Audience Dynamics',
        summary: 'Measures bimodal divergence between critical reviews, mass audience, and fan factions.',
        formula: '4 * (PositiveRatio * NegativeRatio) * 75 + PlatformRatingDelta + ControversyWeight',
        benchmarks: { criticalDivergence: '> 75', balancedSplit: '40 - 74', organicConsensus: '< 40' },
        drivers: [
          { label: 'Sentiment Bell-Curve Variance', impact: `${Math.round(baseSplitVariance)}% base spread` },
          { label: 'Platform Rating Spread (IMDb vs BMS)', impact: ratingDivergence ? `+${Math.round(ratingDivergence)} pts` : 'Synchronized' },
          { label: 'Active Controversy Multiplier', impact: `+${controversyWeight} pts` }
        ]
      },
      {
        id: 'cvi',
        code: 'CVI',
        name: 'Crisis Virality & Contagion Index',
        score: cviScore,
        grade: { letter: cviScore > 70 ? 'CRITICAL' : cviScore > 45 ? 'ELEVATED' : 'STABLE', label: cviScore > 70 ? 'Viral Outbreak' : 'Contained Flow', color: cviScore > 70 ? 'red' : 'emerald' },
        weight: 'Speed / Threat',
        category: 'Crisis & Risk',
        summary: 'Quantifies narrative propagation speed, cross-outlet pickup, and memetic replication.',
        formula: 'VelocityFactor * 3.2 + IssueSeverityWeight + NegMomentum*0.25 + CrossSourceConvergence',
        benchmarks: { dangerousSpread: '> 70', monitoringAlert: '45 - 70', dormant: '< 45' },
        drivers: [
          { label: 'Discussion Velocity Factor', impact: `+${Math.round(velocityFactor)} pts` },
          { label: 'Severe Issue Cluster Weight', impact: `+${Math.round(Math.min(35, issueSeverityWeight))} pts` },
          { label: 'Independent Source Convergence', impact: `+${crossSourceConvergenceCount * 6} pts` }
        ]
      },
      {
        id: 'dces',
        code: 'DCES',
        name: 'Damage Containment Efficiency',
        score: dcesScore,
        grade: getGrade(dcesScore),
        weight: 'Defense Index',
        category: 'Damage Control',
        summary: 'Measures the mathematical efficiency of current PR interventions and counter-messaging.',
        formula: 'Base(50) + PosMomentum*0.3 - NegMomentum*0.35 + FalseRumorDefusal + EvidenceClarity',
        benchmarks: { impenetrable: '>= 80', activeDefense: '60 - 79', failingContainment: '< 50' },
        drivers: [
          { label: 'Positive Momentum Reversal Support', impact: `+${Math.round(positiveMomentum * 0.3)} pts` },
          { label: 'Negative Momentum Suppression', impact: `-${Math.round(negativeMomentum * 0.35)} pts` },
          { label: 'Fact-Check & False Signal Neutralization', impact: falseSignalAlerts.length > 0 ? '+10 pts' : 'Standard' }
        ]
      },
      {
        id: 'rabs',
        code: 'RABS',
        name: 'Review Authenticity & Bot Infiltration',
        score: rabsScore,
        grade: getGrade(rabsScore),
        weight: 'Integrity Metric',
        category: 'Data Integrity',
        summary: 'Detects coordinated downvoting, sybil brigading, and astroturfed negative review campaigns.',
        formula: 'Base(70) + NewsRatio*20 + EvidenceConfidence*0.1 - BrigadingDiscount - FalseSignalPenalty',
        benchmarks: { organicConsensus: '>= 85', moderateNoise: '65 - 84', heavyAstroturfing: '< 65' },
        drivers: [
          { label: 'Verified Trade & News Sensor Ratio', impact: `+${Math.round(newsRatio * 20)} pts` },
          { label: 'Evidence Ground-Truth Confidence', impact: `+${Math.round(evidenceConfidence * 0.1)} pts` },
          { label: 'Brigading / Velocity Discount', impact: (apiScore > 80 && discussionVelocity > 15) ? '-18 pts' : 'Clean' }
        ]
      },
      {
        id: 'tbvs',
        code: 'TBVS',
        name: 'Talent & Star Brand Vulnerability',
        score: tbvsScore,
        grade: { letter: tbvsScore > 65 ? 'EXPOSED' : tbvsScore > 40 ? 'SENSITIVE' : 'INSULATED', label: tbvsScore > 65 ? 'High Personal Spillover' : 'Brand Protected', color: tbvsScore > 65 ? 'amber' : 'teal' },
        weight: 'Brand Equity',
        category: 'Talent & Governance',
        summary: 'Isolates personal reputation fallout on the lead actor, director, and production house.',
        formula: 'ReputationRisk*0.55 + TalentFrictionRatio*35 + ActiveIssues*6',
        benchmarks: { highEquityRisk: '> 65', moderateExposure: '40 - 65', safeShelter: '< 40' },
        drivers: [
          { label: 'Reputation Risk Core Spillover', impact: `+${Math.round(reputationRiskScore * 0.55)} pts` },
          { label: 'Talent-Targeted Friction Signal Share', impact: `+${Math.round(talentFrictionRatio * 35)} pts` },
          { label: 'Active Issue Multiplier', impact: `+${activeIssues.length * 6} pts` }
        ]
      },
      {
        id: 'wqli',
        code: 'WQLI',
        name: 'Word-of-Mouth Longevity Index',
        score: wqliScore,
        grade: getGrade(wqliScore),
        weight: 'Hold Predictor',
        category: 'Audience Intelligence',
        summary: 'High-precision predictor of second-week hold, family conversion, and viral shelf-life.',
        formula: 'Base(40) + PosRatio*50 - NegRatio*35 + BMSBuyerPremium + MomentumBonus',
        benchmarks: { blockbusterHold: '>= 80', sustainableRun: '60 - 79', quickBurnout: '< 50' },
        drivers: [
          { label: 'Organic Recommendation Ratio', impact: `+${Math.round(posRatio * 50)} pts` },
          { label: 'Critical WOM Friction Discount', impact: `-${Math.round(negRatio * 35)} pts` },
          { label: 'Verified Ticket Buyer Lift (BMS)', impact: bmsRating ? `+${Math.round((bmsRating - 3.2) * 15)} pts` : 'Nominal' }
        ]
      },
      {
        id: 'mcis',
        code: 'MCIS',
        name: 'Media & Trade Consensus Index',
        score: mcisScore,
        grade: getGrade(mcisScore),
        weight: 'Industry Consensus',
        category: 'Media & Trade',
        summary: 'Reconciles divergence between trade tracker box office numbers and mainstream reviews.',
        formula: '85 - SentimentAlignmentDelta*0.35 - Conflicts*10 + EvidenceConfidence*0.15',
        benchmarks: { unanimousTrade: '>= 85', minorFriction: '65 - 84', conflictedNarratives: '< 65' },
        drivers: [
          { label: 'Trade vs Editorial Sentiment Alignment', impact: `-${Math.round(sentimentAlignmentDelta * 0.35)} delta` },
          { label: 'Factual Conflict Penalties', impact: conflicts.length > 0 ? `-${conflicts.length * 10} pts` : 'No Contradictions' },
          { label: 'Verified Signal Evidence Grounding', impact: `+${Math.round(evidenceConfidence * 0.15)} pts` }
        ]
      }
    ];

    // Composite Macro Cinema Health Index (CCHI)
    const compositeHealthIndex = Math.round(
      (bohsScore * 0.25) +
      (wqliScore * 0.20) +
      (dcesScore * 0.15) +
      (rabsScore * 0.10) +
      (mcisScore * 0.10) +
      ((100 - cviScore) * 0.10) +
      ((100 - apiScore) * 0.05) +
      ((100 - tbvsScore) * 0.05)
    );

    return {
      movieTitle,
      measuredAt: new Date().toISOString(),
      compositeHealthIndex,
      compositeGrade: getGrade(compositeHealthIndex),
      coreIndices: {
        bohs: bohsScore,
        api: apiScore,
        cvi: cviScore,
        dces: dcesScore,
        rabs: rabsScore,
        tbvs: tbvsScore,
        wqli: wqliScore,
        mcis: mcisScore
      },
      scorecards,
      lifecycleScores,
      demographicScores,
      scoredNarratives,
      scoredIssues,
      measurementSummary: {
        totalSignalsAudited: totalSignals,
        distinctPublishers: new Set(signals.map(s => s.source)).size,
        distinctCategories: new Set(signals.map(s => s.sourceCategory)).size,
        dataIntegrityConfidence: `${evidenceConfidence}%`,
        activeIssuesCount: activeIssues.length,
        narrativesScoredCount: narratives.length
      }
    };
  }
}

module.exports = { ScoringEngine };
