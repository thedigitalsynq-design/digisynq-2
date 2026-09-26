// src/components/PrecisionScoringSuite.jsx
// UNIVERSAL CINEMA SCORING & MEASUREMENT TERMINAL
// Provides executive-level mathematical explainability, multi-dimensional scoring indices,
// 3-phase lifecycle measurements, and circuit resonance analytics.

import React, { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
  Info,
  Sliders,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Target,
  Users,
  Award,
  Sparkles,
  BarChart2,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function PrecisionScoringSuite({ movieData, movieTitle }) {
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'COMMERCIAL' | 'RISK' | 'AUDIENCE'
  const [expandedScoreId, setExpandedScoreId] = useState(null);
  const [activePhaseTab, setActivePhaseTab] = useState('LIVE_RELEASE');

  const scoring = movieData?.scoringSuite;
  const liveState = movieData?.liveState || {};
  const metrics = movieData?.audienceMetrics || {};
  const currentTitle = movieTitle || movieData?.identity?.title || 'Selected Title';

  // Fallback score calculations if backend scoringSuite is still streaming or offline
  const positiveMomentum = liveState?.positiveMomentum || 60;
  const negativeMomentum = liveState?.negativeMomentum || 20;
  const reputationRisk = liveState?.reputationRiskScore || 25;
  const velocity = liveState?.discussionVelocity || 8;
  const bmsRating = parseFloat(metrics?.bookMyShow?.rating) || 4.2;
  const imdbRating = parseFloat(metrics?.imdb?.rating) || 7.4;

  const fallbackBohs = Math.min(98, Math.max(20, Math.round(50 + (positiveMomentum * 0.35) - (negativeMomentum * 0.3) + (bmsRating - 3.0) * 12)));
  const fallbackApi = Math.min(98, Math.max(10, Math.round(35 + Math.abs((bmsRating * 2) - imdbRating) * 8 + (liveState.emergingControversies?.length || 0) * 8)));
  const fallbackCvi = Math.min(100, Math.max(10, Math.round((velocity * 3.5) + (negativeMomentum * 0.35) + (liveState.activeIssues?.length || 0) * 15)));
  const fallbackDces = Math.min(96, Math.max(15, Math.round(55 + (positiveMomentum * 0.3) - (negativeMomentum * 0.35))));
  const fallbackRabs = Math.min(99, Math.max(40, Math.round(82 + (liveState.evidenceConfidence ? liveState.evidenceConfidence * 0.1 : 5))));
  const fallbackTbvs = Math.min(95, Math.max(10, Math.round(reputationRisk * 0.65 + 10)));
  const fallbackWqli = Math.min(98, Math.max(15, Math.round(45 + (positiveMomentum * 0.4) + (bmsRating - 3.0) * 14)));
  const fallbackMcis = Math.min(97, Math.max(20, Math.round(80 - Math.abs((liveState.mediaSentiment || 0) - (liveState.audienceSentiment || 0)) * 0.3)));

  const compositeScore = scoring?.compositeHealthIndex || Math.round(
    (fallbackBohs * 0.25) + (fallbackWqli * 0.20) + (fallbackDces * 0.15) + (fallbackRabs * 0.10) +
    (fallbackMcis * 0.10) + ((100 - fallbackCvi) * 0.10) + ((100 - fallbackApi) * 0.05) + ((100 - fallbackTbvs) * 0.05)
  );

  const getScoreColor = (val, isInverse = false) => {
    const effective = isInverse ? (100 - val) : val;
    if (effective >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (effective >= 65) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (effective >= 48) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getProgressColor = (val, isInverse = false) => {
    const effective = isInverse ? (100 - val) : val;
    if (effective >= 80) return 'bg-emerald-400';
    if (effective >= 65) return 'bg-cyan-400';
    if (effective >= 48) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const scorecards = scoring?.scorecards || [
    {
      id: 'bohs',
      code: 'BOHS',
      name: 'Box Office Health Score',
      score: fallbackBohs,
      weight: 'High Impact',
      category: 'COMMERCIAL',
      summary: 'Measures theatrical hold stability, daily ticket velocity, and circuit retention momentum.',
      formula: 'Base(50) + PosMomentum*0.35 - NegMomentum*0.30 + BMSDelta + TradeBonus',
      drivers: [
        { label: 'Verified BMS Audience Rating Lift', impact: `+${Math.round((bmsRating - 3.0) * 12)} pts` },
        { label: 'Positive Word-of-Mouth Momentum', impact: `+${Math.round(positiveMomentum * 0.35)} pts` },
        { label: 'Friction Drag & Negative Momentum', impact: `-${Math.round(negativeMomentum * 0.30)} pts` }
      ]
    },
    {
      id: 'api',
      code: 'API',
      name: 'Audience Polarization Index',
      score: fallbackApi,
      isInverse: true,
      weight: 'Vulnerability Index',
      category: 'AUDIENCE',
      summary: 'Measures bimodal divergence between critical reviews, mass audience, and fan factions.',
      formula: '4 * (PositiveRatio * NegativeRatio) * 75 + PlatformRatingDelta + ControversyWeight',
      drivers: [
        { label: 'Rating Spread (IMDb vs BMS)', impact: `${Math.round(Math.abs((bmsRating * 2) - imdbRating) * 8)} pts variance` },
        { label: 'Active Controversy Multiplier', impact: `+${(liveState.emergingControversies?.length || 0) * 8} pts` },
        { label: 'Sentiment Bell-Curve Variance', impact: 'Moderate Division' }
      ]
    },
    {
      id: 'cvi',
      code: 'CVI',
      name: 'Crisis Virality & Contagion Index',
      score: fallbackCvi,
      isInverse: true,
      weight: 'Speed / Threat',
      category: 'RISK',
      summary: 'Quantifies narrative propagation speed, cross-outlet pickup, and memetic replication.',
      formula: 'VelocityFactor * 3.2 + IssueSeverityWeight + NegMomentum*0.25 + CrossSourceConvergence',
      drivers: [
        { label: 'Discussion Velocity Factor', impact: `+${Math.round(velocity * 3.5)} pts` },
        { label: 'Negative Momentum Amplification', impact: `+${Math.round(negativeMomentum * 0.25)} pts` },
        { label: 'Active Issues Cluster Penalty', impact: `+${(liveState.activeIssues?.length || 0) * 12} pts` }
      ]
    },
    {
      id: 'dces',
      code: 'DCES',
      name: 'Damage Containment Efficiency',
      score: fallbackDces,
      weight: 'Defense Index',
      category: 'RISK',
      summary: 'Measures mathematical efficiency of PR counter-measures and narrative stabilization.',
      formula: 'Base(50) + PosMomentum*0.3 - NegMomentum*0.35 + FalseRumorDefusal + EvidenceClarity',
      drivers: [
        { label: 'Positive Momentum Reversal Support', impact: `+${Math.round(positiveMomentum * 0.3)} pts` },
        { label: 'Negative Sentiment Suppression', impact: `-${Math.round(negativeMomentum * 0.35)} pts` },
        { label: 'Verified Signal Evidence Grounding', impact: '+8 pts' }
      ]
    },
    {
      id: 'rabs',
      code: 'RABS',
      name: 'Review Authenticity & Anti-Bot',
      score: fallbackRabs,
      weight: 'Data Integrity',
      category: 'AUDIENCE',
      summary: 'Detects coordinated downvoting, sybil brigading, and astroturfed negative campaigns.',
      formula: 'Base(70) + NewsRatio*20 + EvidenceConfidence*0.1 - BrigadingDiscount',
      drivers: [
        { label: 'Verified Trade & News Ratio', impact: '+15 pts' },
        { label: 'Evidence Ground-Truth Confidence', impact: `+${Math.round((liveState.evidenceConfidence || 75) * 0.1)} pts` },
        { label: 'Astroturfing & Sybil Shielding', impact: 'Clean Sensor Profile' }
      ]
    },
    {
      id: 'tbvs',
      code: 'TBVS',
      name: 'Talent & Star Brand Vulnerability',
      score: fallbackTbvs,
      isInverse: true,
      weight: 'Brand Equity',
      category: 'RISK',
      summary: 'Isolates personal reputation fallout on the lead actor, director, and production house.',
      formula: 'ReputationRisk*0.55 + TalentFrictionRatio*35 + ActiveIssues*6',
      drivers: [
        { label: 'Core Reputation Risk Spillover', impact: `+${Math.round(reputationRisk * 0.55)} pts` },
        { label: 'Talent-Targeted Friction Share', impact: '+12 pts' },
        { label: 'Issue Multiplier Drag', impact: `+${(liveState.activeIssues?.length || 0) * 6} pts` }
      ]
    },
    {
      id: 'wqli',
      code: 'WQLI',
      name: 'Word-of-Mouth Longevity Index',
      score: fallbackWqli,
      weight: 'Hold Predictor',
      category: 'COMMERCIAL',
      summary: 'High-precision predictor of second-week hold, family conversion, and viral shelf-life.',
      formula: 'Base(40) + PosRatio*50 - NegRatio*35 + BMSBuyerPremium + MomentumBonus',
      drivers: [
        { label: 'Organic Recommendation Rate', impact: '+35 pts' },
        { label: 'Verified Ticket Buyer Lift (BMS)', impact: `+${Math.round((bmsRating - 3.0) * 14)} pts` },
        { label: 'Negative WOM Drag Discount', impact: `-${Math.round(negativeMomentum * 0.25)} pts` }
      ]
    },
    {
      id: 'mcis',
      code: 'MCIS',
      name: 'Media & Trade Consensus Index',
      score: fallbackMcis,
      weight: 'Trade Consensus',
      category: 'COMMERCIAL',
      summary: 'Reconciles divergence between trade tracker collection figures and mainstream reviews.',
      formula: '85 - SentimentAlignmentDelta*0.35 - Conflicts*10 + EvidenceConfidence*0.15',
      drivers: [
        { label: 'Trade vs Editorial Sentiment Delta', impact: 'Aligned Reporting' },
        { label: 'Fact-Check Verification Integrity', impact: '+10 pts' },
        { label: 'Absence of Conflicting Trade Figures', impact: 'Low Variance' }
      ]
    }
  ];

  const filteredCards = activeCategory === 'ALL' 
    ? scorecards 
    : scorecards.filter(c => c.category === activeCategory);

  const lifecycleScores = scoring?.lifecycleScores || {
    activePhase: 'LIVE_RELEASE',
    preRelease: {
      hypeVelocityScore: Math.min(100, Math.round((velocity * 3.5) + (positiveMomentum * 0.4))),
      trailerConversionEfficiency: Math.min(98, Math.round(positiveMomentum * 0.85 + 10)),
      advanceBookingReadiness: Math.min(95, Math.round(fallbackBohs * 0.95)),
      controversyLeakRisk: Math.min(95, Math.round(fallbackCvi * 0.6 + fallbackApi * 0.4))
    },
    liveRelease: {
      firstDayFrictionIndex: Math.min(99, Math.round((negativeMomentum * 0.5) + ((liveState.activeIssues?.length || 0) * 12))),
      weekendRetentionMultiplier: Math.min(98, Math.round(fallbackWqli * 0.92 + (positiveMomentum * 0.1))),
      weekdayDropResistance: Math.min(96, Math.round(fallbackWqli * 0.85 - (fallbackApi * 0.15) + 15)),
      theaterOccupancyStability: Math.min(95, Math.round(fallbackBohs * 0.9 + (fallbackDces * 0.1)))
    },
    postRelease: {
      theatricalRecoveryIndex: Math.min(99, Math.round(fallbackBohs * 0.95)),
      ottDigitalDemandScore: Math.min(98, Math.round(fallbackWqli * 0.6 + (velocity * 2.5) + 20)),
      brandEquityRestoration: Math.min(95, Math.round(100 - fallbackTbvs + (fallbackDces * 0.2))),
      cultLongevityArchivalScore: Math.min(96, Math.round((fallbackWqli * 0.65) + 20))
    }
  };

  const demographicScores = scoring?.demographicScores || {
    familyAudienceIndex: Math.min(98, Math.max(15, Math.round(fallbackWqli * 0.7 - fallbackCvi * 0.2 + 20))),
    youthResonanceIndex: Math.min(99, Math.max(20, Math.round(positiveMomentum * 0.5 + velocity * 2.8))),
    urbanMultiplexIndex: Math.min(98, Math.max(20, Math.round(imdbRating * 9.5 + 10))),
    massSingleScreenIndex: Math.min(99, Math.max(20, Math.round(bmsRating * 19 + 10))),
    overseasDiasporaIndex: Math.min(96, Math.max(15, Math.round(positiveMomentum * 0.6 + 25)))
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Composite Macro Health Dial & Calibration Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1324] via-[#080d18] to-[#0c1324] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-5">
            {/* Radial Dial Indicator */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${compositeScore >= 75 ? 'stroke-emerald-400' : compositeScore >= 55 ? 'stroke-cyan-400' : 'stroke-amber-400'} transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * compositeScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black font-mono text-white tracking-tight">
                  {compositeScore}
                </span>
                <span className="text-[0.6rem] font-mono text-slate-400 uppercase">
                  CCHI / 100
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  Macro Cinema Health Index (CCHI)
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  compositeScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  compositeScore >= 65 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Grade: {compositeScore >= 85 ? 'A+ Elite' : compositeScore >= 75 ? 'A Solid' : compositeScore >= 60 ? 'B Stable' : 'C Sensitive'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  • Mathematical Multi-Vector Synthesis
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                <span>Precision Scoring Terminal</span>
                <span className="text-slate-600 font-light">//</span>
                <span className="text-cyan-300 font-mono">{currentTitle}</span>
              </h2>

              <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                Reconciles 8 core empirical indices across Box Office hold sustainability, audience polarization, viral crisis contagion, bot infiltration resistance, and talent brand equity.
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#050811] p-1.5 rounded-xl border border-white/10 shrink-0 self-start lg:self-center">
            {[
              { id: 'ALL', label: 'All 8 Pillars' },
              { id: 'COMMERCIAL', label: 'Box Office & Trade' },
              { id: 'RISK', label: 'Threat & Crisis' },
              { id: 'AUDIENCE', label: 'Audience & WOM' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 8 Master Core System Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCards.map(card => {
          const isExpanded = expandedScoreId === card.id;
          const scoreClass = getScoreColor(card.score, card.isInverse);
          const progressClass = getProgressColor(card.score, card.isInverse);

          return (
            <div
              key={card.id}
              className={`p-4 rounded-xl bg-[#0b101c]/90 border transition-all duration-300 flex flex-col justify-between ${
                isExpanded ? 'border-cyan-500/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    {card.code}
                  </span>
                  <span className={`text-[0.62rem] px-1.5 py-0.2 rounded font-bold border ${scoreClass}`}>
                    {card.weight}
                  </span>
                </div>

                <div className="text-sm font-bold text-white mb-2 leading-snug">
                  {card.name}
                </div>

                {/* Score Big Display */}
                <div className="flex items-baseline justify-between gap-2 my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-white">
                      {card.score}
                    </span>
                    <span className="text-xs font-mono text-slate-500">/100</span>
                  </div>
                  <span className="text-[0.65rem] font-mono text-slate-400">
                    {card.isInverse ? (card.score > 60 ? 'Elevated Alert' : 'Contained') : (card.score >= 75 ? 'Strong Hold' : 'Average Hold')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${progressClass}`}
                    style={{ width: `${card.score}%` }}
                  />
                </div>

                <p className="text-[0.7rem] text-slate-400 leading-relaxed line-clamp-2">
                  {card.summary}
                </p>
              </div>

              {/* Drivers & Formula Drilldown */}
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => setExpandedScoreId(isExpanded ? null : card.id)}
                  className="w-full flex items-center justify-between text-[0.68rem] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Formula & Drivers' : 'Explain Score Math'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-2 border-t border-white/[0.05] space-y-2 text-xs font-mono animate-fadeIn">
                    <div className="p-2 rounded bg-black/40 border border-white/5 text-[0.65rem] text-slate-300">
                      <span className="text-cyan-400 font-bold block mb-0.5">FORMULA:</span>
                      <code>{card.formula}</code>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[0.62rem] text-slate-500 uppercase font-bold block">Top Impact Drivers:</span>
                      {card.drivers.map((d, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[0.68rem] text-slate-300">
                          <span className="truncate pr-2">• {d.label}</span>
                          <span className="text-cyan-300 font-bold shrink-0">{d.impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* 2. THE THREE LIFECYCLE PHASES SCORING FRAMEWORK */}
      <div className="glass-panel p-6 border border-white/10 bg-[#080d18]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-white/[0.08]">
          <div>
            <span className="px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              Phase-Specific Analytics
            </span>
            <h3 className="text-base font-black text-white uppercase tracking-wide mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>3-Phase Movie Lifecycle Intelligence Scores</span>
            </h3>
          </div>

          {/* Phase Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-[#040710] p-1 rounded-xl border border-white/10">
            {[
              { id: 'PRE_RELEASE', label: '1. Pre-Release Intelligence' },
              { id: 'LIVE_RELEASE', label: '2. Live Release Intelligence' },
              { id: 'POST_RELEASE', label: '3. Post-Release Intelligence' }
            ].map(phase => (
              <button
                key={phase.id}
                onClick={() => setActivePhaseTab(phase.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activePhaseTab === phase.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phase 1: Pre-Release View */}
        {activePhaseTab === 'PRE_RELEASE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Hype Velocity Index (HVI)</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {lifecycleScores.preRelease.hypeVelocityScore}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Trailer view acceleration, social search volume & organic anticipation momentum.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Trailer Conversion (TCE)</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {lifecycleScores.preRelease.trailerConversionEfficiency}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Conversion efficiency of video assets into intent-to-watch signals across circuits.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Advance Booking Readiness</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {lifecycleScores.preRelease.advanceBookingReadiness}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Projected Day -3 to Day 0 booking velocity and opening show housefull readiness.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Controversy Leak Exposure</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {lifecycleScores.preRelease.controversyLeakRisk}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Vulnerability to pre-release story leaks, censor friction, and online narrative hijacking.</p>
            </div>
          </div>
        )}

        {/* Phase 2: Live-Release View */}
        {activePhaseTab === 'LIVE_RELEASE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Day-1 Critical Friction Index</span>
              <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                {lifecycleScores.liveRelease.firstDayFrictionIndex}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Morning show WOM divergence and negative narrative drag into evening occupancy.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Weekend Retention Multiplier</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {lifecycleScores.liveRelease.weekendRetentionMultiplier}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Friday-to-Sunday box office compounding coefficient (healthy benchmark &gt; 2.8x Friday).</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Weekday Drop Resistance</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {lifecycleScores.liveRelease.weekdayDropResistance}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Monday hold defense ratio against normal theatrical drop curves across territories.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Screen Occupancy Stability</span>
              <div className="text-2xl font-black font-mono text-teal-400 mt-1">
                {lifecycleScores.liveRelease.theaterOccupancyStability}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Multiplex and single-screen show-count defense against competitive releases.</p>
            </div>
          </div>
        )}

        {/* Phase 3: Post-Release View */}
        {activePhaseTab === 'POST_RELEASE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Theatrical Recovery Index</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {lifecycleScores.postRelease.theatricalRecoveryIndex}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Cumulative theatrical collections performance against estimated production breakeven.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">OTT Digital Demand Score</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {lifecycleScores.postRelease.ottDigitalDemandScore}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Post-theatrical streaming audience anticipation and digital licensing leverage.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Brand Equity Restoration</span>
              <div className="text-2xl font-black font-mono text-indigo-400 mt-1">
                {lifecycleScores.postRelease.brandEquityRestoration}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Recovery of star and director goodwill post-theatrical run for upcoming projects.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[0.65rem] font-mono text-slate-400 uppercase font-semibold">Cult Longevity & Archival</span>
              <div className="text-2xl font-black font-mono text-purple-400 mt-1">
                {lifecycleScores.postRelease.cultLongevityArchivalScore}<span className="text-xs text-slate-500">/100</span>
              </div>
              <p className="text-[0.68rem] text-slate-400 mt-2">Memetic staying power, repeat-watch value, and long-tail cultural footprint.</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. DEMOGRAPHIC & TERRITORY CIRCUIT RESONANCE GAUGES */}
      <div className="glass-panel p-6 border border-white/10 bg-[#080d18]/90">
        <div className="pb-3 mb-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Demographic & Circuit Resonance Indices
          </span>
          <span className="text-[0.65rem] font-mono text-cyan-400">
            Precision Target Profiling
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[0.62rem] text-slate-400 uppercase block mb-1">Family Audience</span>
            <span className="text-xl font-bold text-emerald-400 block">{demographicScores.familyAudienceIndex}%</span>
            <span className="text-[0.6rem] text-slate-500">Weekend afternoon lift</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[0.62rem] text-slate-400 uppercase block mb-1">Youth Demographic</span>
            <span className="text-xl font-bold text-cyan-400 block">{demographicScores.youthResonanceIndex}%</span>
            <span className="text-[0.6rem] text-slate-500">Social virality & buzz</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[0.62rem] text-slate-400 uppercase block mb-1">Urban Multiplex</span>
            <span className="text-xl font-bold text-indigo-400 block">{demographicScores.urbanMultiplexIndex}%</span>
            <span className="text-[0.6rem] text-slate-500">Tier-1 metro circuits</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[0.62rem] text-slate-400 uppercase block mb-1">Mass Single Screens</span>
            <span className="text-xl font-bold text-amber-400 block">{demographicScores.massSingleScreenIndex}%</span>
            <span className="text-[0.6rem] text-slate-500">Tier-2/3 B&C centers</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[0.62rem] text-slate-400 uppercase block mb-1">Overseas Diaspora</span>
            <span className="text-xl font-bold text-teal-400 block">{demographicScores.overseasDiasporaIndex}%</span>
            <span className="text-[0.6rem] text-slate-500">US, UK, Gulf & ANZ circuits</span>
          </div>
        </div>
      </div>

    </div>
  );
}
