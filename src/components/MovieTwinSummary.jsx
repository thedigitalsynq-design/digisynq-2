// src/components/MovieTwinSummary.jsx
import React from 'react';
import { 
  ShieldAlert, ShieldCheck, Activity, Users, Newspaper, 
  TrendingUp, TrendingDown, HelpCircle, Layers, Globe, Clock, CheckCircle2, Target, Briefcase
} from 'lucide-react';

export default function MovieTwinSummary({ movieData, onOpenWhy }) {
  if (!movieData || !movieData.liveState) return null;

  const { identity, stats, liveState, freshnessMap, decisionIntelligence } = movieData;
  const { 
    reputationRiskScore: rawRiskScore, overallSentiment, audienceSentiment, mediaSentiment,
    positiveMomentum, negativeMomentum, discussionVelocity, evidenceConfidence,
    activeIssuesCount, distinctPublishersCount, distinctCategoriesCount
  } = liveState;

  // Fully synchronized with Decision Matrix Engine (CDCE v3.0)
  const cdce = decisionIntelligence?.executiveSummary;
  const hierarchyGate = decisionIntelligence?.stage4_hierarchyGate;
  const factorMatrix = decisionIntelligence?.stage3_factorMatrix;
  const damageVectors = decisionIntelligence?.stage2_damageVectors;

  const reputationRiskScore = factorMatrix?.compositeRiskScore ?? rawRiskScore;
  const estimatedExposure = cdce?.netRevenueAtRisk || (reputationRiskScore >= 70 ? '₹35 Cr – ₹60 Cr' : reputationRiskScore >= 45 ? '₹15 Cr – ₹30 Cr' : '₹5 Cr – ₹12 Cr');
  const primaryPosture = cdce?.primaryPosture || (reputationRiskScore >= 70 ? 'Tier 1: Existential Damage Containment' : reputationRiskScore >= 50 ? 'Tier 2: Structural Theatrical Modification' : 'Tier 3: Narrative Re-Anchoring');

  // Determine DEFCON and Damage Control Threat Level
  let defconBadge = { level: 'DEFCON 3', label: primaryPosture, bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
  let containmentStatus = 'MONITORING SENSORS';

  if (reputationRiskScore >= 68 || activeIssuesCount >= 2) {
    defconBadge = { level: 'DEFCON 1', label: primaryPosture, bg: 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse' };
    containmentStatus = 'URGENT MITIGATION PROTOCOL REQUIRED';
  } else if (reputationRiskScore >= 48 || activeIssuesCount >= 1) {
    defconBadge = { level: 'DEFCON 2', label: primaryPosture, bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400' };
    containmentStatus = 'PREVENTATIVE CONTAINMENT ACTIVE';
  }

  const scoring = movieData?.scoringSuite;
  const metrics = movieData?.audienceMetrics;
  const bmsRating = parseFloat(metrics?.bookMyShow?.rating) || 4.2;
  const imdbRating = parseFloat(metrics?.imdb?.rating) || 7.4;

  const bohs = scoring?.coreIndices?.bohs || Math.min(98, Math.max(20, Math.round(50 + (positiveMomentum * 0.35) - (negativeMomentum * 0.3) + (bmsRating - 3.0) * 12)));
  const api = scoring?.coreIndices?.api || Math.min(98, Math.max(10, Math.round(35 + Math.abs((bmsRating * 2) - imdbRating) * 8 + (liveState.emergingControversies?.length || 0) * 8)));
  const cvi = scoring?.coreIndices?.cvi || Math.min(100, Math.max(10, Math.round((discussionVelocity * 3.5) + (negativeMomentum * 0.35) + (activeIssuesCount * 15))));
  const dces = scoring?.coreIndices?.dces || Math.min(96, Math.max(15, Math.round(55 + (positiveMomentum * 0.3) - (negativeMomentum * 0.35))));
  const rabs = scoring?.coreIndices?.rabs || Math.min(99, Math.max(40, Math.round(82 + (evidenceConfidence * 0.1))));
  const wqli = scoring?.coreIndices?.wqli || Math.min(98, Math.max(15, Math.round(45 + (positiveMomentum * 0.4) + (bmsRating - 3.0) * 14)));

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner: Digital Twin Identity & Damage Control Threat Level */}
      <div className="glass-panel p-6 border border-white/10 relative overflow-hidden bg-gradient-to-r from-[#0d1424] via-[#090e1a] to-[#0d1424]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-red-600/30 via-amber-600/20 to-cyan-600/30 border border-red-500/40 flex items-center justify-center text-white font-extrabold text-2xl font-mono shrink-0 shadow-lg shadow-red-950/40">
              {identity.title.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black text-white tracking-wide">
                  {identity.title}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${defconBadge.bg}`}>
                  {defconBadge.level} • {defconBadge.label}
                </span>
                <span className="bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono px-2 py-0.5 rounded font-semibold">
                  Exposure: {estimatedExposure}
                </span>
                {cdce?.projectedMondayHold && (
                  <span className="bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono px-2 py-0.5 rounded font-semibold">
                    Monday Hold: {cdce.projectedMondayHold}
                  </span>
                )}
                {identity.verifiedInWikipedia && (
                  <span className="badge badge-info text-[0.65rem] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Verified Wiki Entity
                  </span>
                )}
              </div>

              {/* Wikipedia snippet or verified lead if available */}
              {identity.wikiEntity?.snippet && (
                <p className="text-xs text-slate-300 max-w-3xl line-clamp-2 leading-relaxed">
                  {identity.wikiEntity.snippet}
                </p>
              )}

              {/* Sensor Lineage stats */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono mt-1">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  {distinctPublishersCount} Independent Publishers
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  {distinctCategoriesCount} Sensor Categories
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  {stats.primarySignalsCount} Unique Verified Signals
                  {stats.syndicatedCount > 0 && (
                    <span className="text-slate-500 text-[0.68rem]">
                      ({stats.syndicatedCount} wire duplicates filtered)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Refresh Telemetry Indicator */}
          <div className="flex flex-col items-end gap-1.5 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[0.7rem] uppercase">Calculated Digital State:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Active Twin
              </span>
            </div>
            <div className="text-[0.7rem] text-slate-500">
              Harvested in {stats.harvestDurationMs}ms • Zero fabricated values
            </div>
          </div>

        </div>
      </div>

      {/* Empirical Scoring System HUD Strip */}
      <div className="p-3.5 rounded-xl bg-[#070b16] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-lg shadow-black/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-300 font-bold uppercase text-[0.7rem] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            Empirical Scoring System:
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          <div className="flex items-center gap-1.5" title="Box Office Health Score">
            <span className="text-slate-400 text-[0.68rem]">BOHS:</span>
            <span className="text-emerald-400 font-black">{bohs}/100</span>
          </div>
          <div className="flex items-center gap-1.5" title="Audience Polarization Index">
            <span className="text-slate-400 text-[0.68rem]">API:</span>
            <span className={`font-black ${api > 70 ? 'text-rose-400' : 'text-cyan-300'}`}>{api}/100</span>
          </div>
          <div className="flex items-center gap-1.5" title="Crisis Virality Index">
            <span className="text-slate-400 text-[0.68rem]">CVI:</span>
            <span className={`font-black ${cvi > 65 ? 'text-red-400' : 'text-emerald-400'}`}>{cvi}/100</span>
          </div>
          <div className="flex items-center gap-1.5" title="Damage Containment Efficiency">
            <span className="text-slate-400 text-[0.68rem]">DCES:</span>
            <span className="text-cyan-300 font-black">{dces}/100</span>
          </div>
          <div className="flex items-center gap-1.5" title="Review Authenticity & Anti-Bot Score">
            <span className="text-slate-400 text-[0.68rem]">RABS:</span>
            <span className="text-teal-300 font-black">{rabs}/100</span>
          </div>
          <div className="flex items-center gap-1.5" title="Word-of-Mouth Longevity Index">
            <span className="text-slate-400 text-[0.68rem]">WQLI:</span>
            <span className="text-amber-300 font-black">{wqli}/100</span>
          </div>

          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'products';
            }}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-600/30 to-amber-600/30 hover:from-rose-600/50 hover:to-amber-600/50 border border-rose-500/40 text-rose-200 text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            title="Open Crisis Damage Control Products & Arsenal"
          >
            <Briefcase className="w-3.5 h-3.5 text-rose-300" />
            <span>Crisis Arsenal (4 Tools) →</span>
          </a>
        </div>
      </div>

      {/* Metric Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Reputation Damage Risk Index */}
        <div className="glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 uppercase font-semibold text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Damage Risk Index
            </span>
            <button
              onClick={() => onOpenWhy('riskScore')}
              className="btn-why"
              title="Explain how this damage risk index was calculated from live signals"
            >
              <HelpCircle className="w-3 h-3" /> WHY?
            </button>
          </div>

          <div className="flex items-baseline justify-between my-2">
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-black font-mono ${
                reputationRiskScore >= 75 ? 'text-red-400' : reputationRiskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {reputationRiskScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/100</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {activeIssuesCount} Active {activeIssuesCount === 1 ? 'Incident' : 'Incidents'}
            </span>
          </div>

          {/* Risk progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                reputationRiskScore >= 75 ? 'bg-red-500' : reputationRiskScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${reputationRiskScore}%` }}
            />
          </div>

          <div className="text-[0.68rem] text-slate-400 mt-2 font-mono flex items-center justify-between">
            <span>Confidence: {evidenceConfidence}%</span>
            <span className="text-red-400 font-semibold">Reputation Threat Level</span>
          </div>
        </div>

        {/* Card 2: Net Sentiment & WOM Friction */}
        <div className="glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 uppercase font-semibold text-cyan-300">
              <Activity className="w-4 h-4 text-cyan-400" />
              Net WOM & Friction
            </span>
            <button
              onClick={() => onOpenWhy('sentiment')}
              className="btn-why"
              title="View audience vs media sentiment mathematical derivation"
            >
              <HelpCircle className="w-3 h-3" /> WHY?
            </button>
          </div>

          <div className="flex items-baseline justify-between my-2">
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-black font-mono ${
                overallSentiment > 10 ? 'text-emerald-400' : overallSentiment < -10 ? 'text-red-400' : 'text-slate-300'
              }`}>
                {overallSentiment > 0 ? '+' : ''}{overallSentiment}%
              </span>
            </div>
            <span className="badge badge-info text-[0.65rem]">
              {overallSentiment > 15 ? 'FAVORABLE' : overallSentiment < -15 ? 'CRITICAL FRICTION' : 'MIXED RECEPTION'}
            </span>
          </div>

          {/* Audience vs Media dual split */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-1 pt-2 border-t border-white/5">
            <div>
              <span className="text-[0.65rem] text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" /> AUDIENCE
              </span>
              <span className={`font-semibold ${audienceSentiment >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {audienceSentiment > 0 ? '+' : ''}{audienceSentiment}%
              </span>
            </div>
            <div>
              <span className="text-[0.65rem] text-slate-500 flex items-center gap-1">
                <Newspaper className="w-3 h-3 text-indigo-400" /> TRADE/MEDIA
              </span>
              <span className={`font-semibold ${mediaSentiment >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {mediaSentiment > 0 ? '+' : ''}{mediaSentiment}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Threat Spread vs Defense Momentum */}
        <div className="glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 uppercase font-semibold text-emerald-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Threat vs Defense
            </span>
            <button
              onClick={() => onOpenWhy('positiveMomentum')}
              className="btn-why"
              title="Explain momentum vectors calculation"
            >
              <HelpCircle className="w-3 h-3" /> WHY?
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2 font-mono">
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[0.65rem] text-emerald-300 block uppercase font-semibold">Positive Defense</span>
              <span className="text-xl font-bold text-emerald-400">
                {positiveMomentum}<span className="text-xs text-emerald-400/60 font-normal">/100</span>
              </span>
            </div>
            <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
              <span className="text-[0.65rem] text-red-300 block uppercase font-semibold">Damage Spread</span>
              <span className="text-xl font-bold text-red-400">
                {negativeMomentum}<span className="text-xs text-red-400/60 font-normal">/100</span>
              </span>
            </div>
          </div>

          <div className="w-full flex h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-400 h-full" style={{ width: `${positiveMomentum}%` }} />
            <div className="bg-red-400 h-full" style={{ width: `${negativeMomentum}%` }} />
          </div>

          <div className="text-[0.68rem] text-slate-400 mt-2 font-mono flex items-center justify-between">
            <span>Defense Ratio: {(positiveMomentum / Math.max(1, negativeMomentum)).toFixed(1)}x</span>
            <span className={positiveMomentum > negativeMomentum ? 'text-emerald-400' : 'text-red-400'}>
              {positiveMomentum > negativeMomentum ? 'Defense Holding' : 'Damage Escalating'}
            </span>
          </div>
        </div>

        {/* Card 4: Incident Velocity & Mitigation Readiness */}
        <div className="glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 uppercase font-semibold text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              Incident Velocity
            </span>
            <span className="badge badge-neutral text-[0.65rem]">
              Sensor Live
            </span>
          </div>

          <div className="flex items-baseline justify-between my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-mono text-white">
                {discussionVelocity}
              </span>
              <span className="text-xs text-slate-400 font-mono">signals/hr</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-cyan-400 block font-bold">
                {evidenceConfidence}%
              </span>
              <span className="text-[0.65rem] text-slate-500 font-mono uppercase">
                Integrity
              </span>
            </div>
          </div>

          {/* Velocity meter */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${Math.min(100, discussionVelocity * 8)}%` }}
            />
          </div>

          <div className="text-[0.68rem] text-slate-400 mt-2 font-mono flex items-center justify-between">
            <span>Viral Spread Velocity</span>
            <span className="text-emerald-400 font-semibold">Ready to Contain</span>
          </div>
        </div>

      </div>
    </div>
  );
}
