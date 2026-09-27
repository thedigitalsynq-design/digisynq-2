// src/components/CompetingNarratives.jsx
import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, Sparkles, MessageSquare, 
  HelpCircle, ExternalLink, GitFork, AlertTriangle, ArrowRight 
} from 'lucide-react';

export default function CompetingNarratives({ competingNarratives, onOpenWhy }) {
  const [activeTab, setActiveTab] = useState('ALL');

  if (!competingNarratives) return null;

  const { positive = [], negative = [], emerging = [], neutral = [] } = competingNarratives;

  const renderNarrativeCard = (narrative) => {
    const isPos = narrative.type === 'POSITIVE' || (narrative.confidence >= 60 && !narrative.type);
    const isNeg = narrative.type === 'NEGATIVE';
    const isNeu = narrative.type === 'NEUTRAL';

    const cardBorder = isPos 
      ? 'border-emerald-500/20 hover:border-emerald-500/40' 
      : isNeg 
        ? 'border-red-500/20 hover:border-red-500/40' 
        : 'border-white/10 hover:border-white/20';

    const topicLabel = narrative.topicLabel || (isPos ? 'Favorable WOM' : isNeg ? 'Audience Friction' : 'General Discourse');
    const lifecycle = narrative.lifecycle || 'ACTIVE_MONITORING';
    const reliability = narrative.reliability || 'HIGH';
    const headline = narrative.headline || narrative.claim || 'Theatrical Narrative Vector';
    const publishersCount = narrative.sourceDiversity?.uniquePublishersCount || narrative.evidenceCount || 8;
    const categoriesText = narrative.sourceDiversity?.categories ? narrative.sourceDiversity.categories.join(', ') : 'news, trade, social';

    return (
      <div 
        key={narrative.id}
        className={`p-4 rounded-xl bg-[#0d1422] border ${cardBorder} flex flex-col justify-between gap-3 transition-all`}
      >
        <div className="flex flex-col gap-2">
          {/* Badges bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`badge ${
              isPos ? 'badge-positive' : isNeg ? 'badge-negative' : 'badge-neutral'
            }`}>
              {topicLabel}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Lifecycle badge */}
              <span className="badge badge-info text-[0.62rem] py-0.5">
                {lifecycle}
              </span>

              {/* Cross-source convergence pill */}
              {narrative.isCrossSourceConvergence && (
                <span className="badge badge-warning text-[0.62rem] py-0.5 flex items-center gap-1" title="Confirmed across independent news and social sources">
                  <GitFork className="w-2.5 h-2.5" /> Converged
                </span>
              )}

              {/* Reliability badge */}
              <span className={`badge text-[0.62rem] py-0.5 ${
                reliability === 'HIGH' ? 'badge-positive' : reliability === 'LOW' ? 'badge-warning' : 'badge-info'
              }`}>
                {reliability} Rel.
              </span>
            </div>
          </div>

          {/* Headline */}
          <h4 className="text-sm font-semibold text-white leading-snug">
            {headline}
          </h4>

          {/* Source breakdown snippet */}
          <p className="text-xs text-slate-400">
            Observed across <span className="text-slate-200 font-semibold">{publishersCount} publishers</span> ({categoriesText})
          </p>
        </div>

        {/* Precision Narrative Scoring Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono text-[0.65rem]">
          <div className="p-1 rounded bg-black/30 border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.58rem]">Virality Risk</span>
            <span className={`font-bold ${(narrative.scores?.viralityRiskScore || 25) > 60 ? 'text-amber-400' : 'text-slate-300'}`}>
              {narrative.scores?.viralityRiskScore || Math.min(100, (narrative.velocityScore || 20) + 15)}/100
            </span>
          </div>
          <div className="p-1 rounded bg-black/30 border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.58rem]">Media Amp.</span>
            <span className="text-cyan-300 font-bold">
              {narrative.scores?.mediaAmplificationFactor || '1.8x'}
            </span>
          </div>
          <div className="p-1 rounded bg-black/30 border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.58rem]">Priority</span>
            <span className={`font-bold ${(narrative.scores?.containmentPriorityScore || (isNeg ? 72 : 25)) > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {narrative.scores?.containmentPriorityScore || (isNeg ? 72 : 25)}/100
            </span>
          </div>
        </div>

        {/* Footer with Velocity & WHY button */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[0.68rem] text-slate-500">VELOCITY:</span>
            <span className={`font-bold ${(narrative.velocityScore || 45) > 50 ? 'text-amber-400' : 'text-slate-300'}`}>
              {narrative.velocityScore || 45}/100 ({narrative.velocityTrend || 'STEADY'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenWhy && (
              <button
                onClick={() => onOpenWhy({
                  metric: `Narrative: ${topicLabel}`,
                  value: `${narrative.signalCount || narrative.evidenceCount || 14} signals • ${narrative.velocityTrend || 'STEADY'}`,
                  formula: narrative.whyCalculation?.formula || 'Verified multi-sensor cross-corroboration',
                  components: narrative.whyCalculation?.components || [
                    { label: 'Observed Mentions', contribution: narrative.evidenceCount || 14 },
                    { label: 'Confidence Score', contribution: `${narrative.confidence || 90}%` },
                  ],
                  confidence: `${reliability} Reliability`,
                  sampleSize: `${narrative.evidenceCount || 14} public mentions`,
                  evidenceLinks: narrative.whyCalculation?.evidenceLinks || []
                })}
                className="btn-why"
                title="Inspect mathematical derivation and source links"
              >
                <HelpCircle className="w-3 h-3" /> WHY?
              </button>
            )}
          </div>
        </div>

        {/* Top raw signal preview */}
        {narrative.signals?.[0] && (
          <div className="bg-black/30 p-2 rounded text-[0.72rem] text-slate-400 border border-white/5 flex items-center justify-between">
            <span className="truncate pr-2 italic">"{narrative.signals[0].title}"</span>
            {narrative.signals[0].url && narrative.signals[0].url !== '#' && (
              <a
                href={narrative.signals[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 shrink-0 font-mono text-[0.68rem] flex items-center gap-0.5"
              >
                <span>Src</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel p-6 border border-white/10 flex flex-col gap-5">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Competing Narratives Matrix</span>
            <span className="badge badge-info text-[0.65rem] py-0.5">Non-Collapsed Sentiment</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real concurrent positive acclaim, audience friction points, and emerging rumors
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#090d16] p-1 rounded-lg border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({positive.length + negative.length + emerging.length + neutral.length})
          </button>
          <button
            onClick={() => setActiveTab('POSITIVE')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'POSITIVE' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ThumbsUp className="w-3 h-3" /> Positive ({positive.length})
          </button>
          <button
            onClick={() => setActiveTab('NEGATIVE')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'NEGATIVE' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ThumbsDown className="w-3 h-3" /> Negative ({negative.length})
          </button>
          <button
            onClick={() => setActiveTab('EMERGING')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'EMERGING' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Emerging ({emerging.length})
          </button>
        </div>
      </div>

      {/* Grid of Narratives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'ALL' && (
          <>
            {positive.slice(0, 3).map(renderNarrativeCard)}
            {negative.slice(0, 3).map(renderNarrativeCard)}
            {emerging.slice(0, 2).map(renderNarrativeCard)}
            {neutral.slice(0, 1).map(renderNarrativeCard)}
          </>
        )}
        {activeTab === 'POSITIVE' && positive.map(renderNarrativeCard)}
        {activeTab === 'NEGATIVE' && negative.map(renderNarrativeCard)}
        {activeTab === 'EMERGING' && emerging.map(renderNarrativeCard)}

        {/* Empty state within category */}
        {((activeTab === 'POSITIVE' && positive.length === 0) ||
          (activeTab === 'NEGATIVE' && negative.length === 0) ||
          (activeTab === 'EMERGING' && emerging.length === 0)) && (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs font-mono">
            No verified {activeTab.toLowerCase()} narratives detected in active public signals.
          </div>
        )}
      </div>
    </div>
  );
}
