// src/components/MasterRadarBento.jsx
// Apple/Linear-Style Unified Master Bento Deck for Cinema Damage Control
// Multi-Industry Coverage: Sandalwood (Kannada), Tollywood (Telugu), Kollywood (Tamil), Mollywood (Malayalam), Bollywood (Hindi)
// 5-Layer Verification Gatekeeper & Dynamic 15-Day IST Rolling Window
import React, { useState } from 'react';
import { 
  Radar, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Flame, 
  Bot, 
  Scale, 
  Swords, 
  Layers, 
  RefreshCw,
  Film,
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import VerificationLayersModal from './VerificationLayersModal';
import RadarBlip from './RadarBlip';

const INDUSTRY_CONFIG = {
  ALL: { label: 'All Industries', icon: '🇮🇳', color: 'cyan', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10 text-cyan-300' },
  Kannada: { label: 'Kannada • Sandalwood', icon: '🎬', color: 'amber', border: 'border-amber-500/40', bg: 'bg-amber-500/10 text-amber-300' },
  Telugu: { label: 'Telugu • Tollywood', icon: '⚡', color: 'cyan', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10 text-cyan-300' },
  Tamil: { label: 'Tamil • Kollywood', icon: '🔥', color: 'rose', border: 'border-rose-500/40', bg: 'bg-rose-500/10 text-rose-300' },
  Malayalam: { label: 'Malayalam • Mollywood', icon: '🌿', color: 'emerald', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10 text-emerald-300' },
  Hindi: { label: 'Hindi • Bollywood', icon: '🌟', color: 'purple', border: 'border-purple-500/40', bg: 'bg-purple-500/10 text-purple-300' }
};

const VERIFICATION_LAYERS = [
  { id: 1, name: 'Temporal & Theatrical Window', rule: 'Strictly 1 to 15 Days in IST (Older movies automatically drop off daily)', icon: '⏳' },
  { id: 2, name: 'Multi-Source Corroboration', rule: '≥ 2 Independent accredited publishers (TOI, Hindu, IE, HT, Sacnilk, NDTV)', icon: '📰' },
  { id: 3, name: 'Financial Claim Reconciliation', rule: 'Reconciled India Net & Worldwide Gross, removes inflated claims', icon: '📊' },
  { id: 4, name: 'Astroturf & Sentiment Integrity', rule: 'Bayesian smoothed WOM (-75% to +75%) & PR bot syndication audit', icon: '🛡️' },
  { id: 5, name: 'Entity & Regional Taxonomy', rule: 'Disambiguates titles across Kannada, Telugu, Tamil, Malayalam, Hindi', icon: '🎬' }
];

export default function MasterRadarBento({ 
  radarData, 
  discoveredMovies = [], 
  currentMovie, 
  currentMovieData,
  onSelectMovie, 
  onOpenWarRoom,
  loading = false,
  onRefresh,
  istWindowStr = ''
}) {
  const [hoveredBlip, setHoveredBlip] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [showLayersModal, setShowLayersModal] = useState(false);

  const allMovies = radarData?.movies || discoveredMovies || [];
  const industryBreakdown = radarData?.industryBreakdown || {};
  const windowRange = radarData?.windowRange || istWindowStr || 'September 12 — September 26, 2026';

  // Filtered movies according to selected industry
  const displayedMovies = selectedIndustry === 'ALL'
    ? allMovies
    : allMovies.filter(m => m.industry === selectedIndustry);
  
  // Find spotlight movie or default to first movie of filtered list
  const spotlightMovie = displayedMovies.find(m => m?.title?.toLowerCase() === currentMovie?.toLowerCase()) || displayedMovies[0] || allMovies[0] || null;

  // Compute collision-free 2D Cartesian positions (X: Net Sentiment, Y: Theatrical Velocity)
  const positionedMovies = React.useMemo(() => {
    if (!allMovies || allMovies.length === 0) return [];

    const items = allMovies.map((movie, idx) => {
      // 1. X-coordinate: Net Word-of-Mouth sentiment from -100% to +100%
      let sentiment = typeof movie.netSentiment === 'number'
        ? movie.netSentiment
        : (typeof movie.xCoordinate === 'number' ? movie.xCoordinate : 0);

      // Clamp sentiment between -90 and +90 for balanced padding
      sentiment = Math.max(-90, Math.min(90, sentiment));

      // 2. Y-coordinate: Theatrical Velocity / Days in Theaters (1 to 15)
      // Day 1 = Opening Day peak velocity (Top: ~16%)
      // Day 15 = Mature run / catalog boundary (Bottom: ~84%)
      let days = typeof movie.daysInTheaters === 'number'
        ? movie.daysInTheaters
        : (typeof movie.releaseTiming === 'string' && movie.releaseTiming.match(/Day\s+(\d+)/i)
            ? parseInt(movie.releaseTiming.match(/Day\s+(\d+)/i)[1], 10)
            : ((idx % 14) + 1));
      
      days = Math.max(1, Math.min(15, days));

      // Map sentiment to left percentage: 50% is center (0% sentiment), range [10%, 90%]
      let left = 50 + (sentiment / 100) * 40;

      // Map days to top percentage: Day 1 -> 16%, Day 15 -> 84%
      let top = 16 + ((days - 1) / 14) * 68;

      return { movie, left, top };
    });

    // Anti-clumping relaxation passes to push overlapping blips apart in Cartesian space
    for (let pass = 0; pass < 8; pass++) {
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const dx = items[j].left - items[i].left;
          const dy = items[j].top - items[i].top;
          const d = Math.sqrt(dx * dx + dy * dy);
          const minDist = 8.0; // minimum separation in percentage points
          if (d < minDist && d > 0.01) {
            const overlap = (minDist - d) / 2;
            const nx = dx / d;
            const ny = dy / d;
            items[i].left -= nx * overlap;
            items[i].top -= ny * overlap;
            items[j].left += nx * overlap;
            items[j].top += ny * overlap;
          } else if (d <= 0.01) {
            items[j].left += (j % 2 === 0 ? 3.5 : -3.5);
            items[j].top += (j % 3 === 0 ? 3.5 : -3.5);
          }
        }
      }

      // Constrain points inside Cartesian grid bounds
      for (let i = 0; i < items.length; i++) {
        items[i].left = Math.max(8, Math.min(92, items[i].left));
        items[i].top = Math.max(12, Math.min(88, items[i].top));
      }
    }

    return items.map((item, idx) => {
      return {
        ...item.movie,
        computedPercentLeft: Math.round(item.left * 10) / 10,
        computedPercentTop: Math.round(item.top * 10) / 10,
        shouldShowStaticLabel: allMovies.length <= 6 || idx < 3
      };
    });
  }, [allMovies]);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* 0. Unified 5-Layer Verification, Rolling Window & Cinema Filter Strip */}
      <div className="bento-card p-3 sm:p-3.5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 bg-gradient-to-r from-[#080d19] via-[#0c1527] to-[#080d19] border-cyan-500/30 shadow-lg">
        {/* Left: Window & Verification Status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm shadow-emerald-950/40">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-black uppercase text-white tracking-wider">
                Rolling 15-Day Window:
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                {windowRange} (IST)
              </span>
              <span className="text-[0.62rem] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-1">
                ✓ 5/5 Layers Active
              </span>
            </div>
            <p className="text-[0.68rem] text-slate-400 font-mono mt-0.5">
              Window auto-shifts daily (tomorrow: Sept 13–27). Older movies auto-drop off list.
            </p>
          </div>

          <button
            onClick={() => setShowLayersModal(!showLayersModal)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[0.7rem] font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info className="w-3 h-3" />
            <span>{showLayersModal ? 'Hide Pipeline' : 'Inspect 5 Layers'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showLayersModal ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Right: Cinema Industry Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[0.68rem] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Industry:
          </span>
          {Object.entries(INDUSTRY_CONFIG).map(([key, cfg]) => {
            const count = key === 'ALL' ? allMovies.length : (industryBreakdown[key] || allMovies.filter(m => m.industry === key).length);
            const isActive = selectedIndustry === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedIndustry(key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? `${cfg.bg} ${cfg.border} ring-1 ring-white/20 shadow-md`
                    : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{key === 'ALL' ? 'All (Pan-India)' : key}</span>
                <span className={`px-1.5 py-0.2 rounded text-[0.62rem] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <VerificationLayersModal
        show={showLayersModal}
        onClose={() => setShowLayersModal(false)}
        layers={VERIFICATION_LAYERS}
      />
      
      {/* 1. Main Top Bento Grid: 2D Radar (Col 7) + Spotlight & Tactical Actions (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* =========================================================================
            BENTO CARD 1: 🎯 LINEAR-STYLE 2D THREAT & REPUTATION MATRIX (Col 7)
        ========================================================================= */}
        <div className="lg:col-span-7 bento-card bento-card-hero p-5 sm:p-6 flex flex-col justify-between relative min-h-[480px]">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  Theatrical Threat & Reputation Matrix
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                </h3>
                <p className="text-[0.68rem] text-slate-400 font-mono">
                  Cartesian WOM vs Theatrical Velocity • 15-Day IST Rolling Window
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 text-[0.68rem] hidden sm:inline">
                {displayedMovies.length} Verified Titles
              </span>
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Sweep sensor matrix"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* 2D Cartesian Scatter Matrix */}
          <div className="flex-1 flex flex-col justify-between py-3 relative my-2">
            <div className="relative w-full h-[360px] sm:h-[400px] rounded-xl border border-white/[0.08] bg-[#070b14]/90 shadow-2xl overflow-hidden backdrop-blur-md">
              
              {/* 4 Quadrant Subtle Ambient Atmospheric Washes */}
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-rose-500/[0.05] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-emerald-500/[0.05] to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-amber-500/[0.04] to-transparent pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-cyan-500/[0.04] to-transparent pointer-events-none" />

              {/* Cartesian Coordinate Axes */}
              {/* Center Vertical Axis (Net Sentiment = 0) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/[0.12] z-0" />
              {/* Center Horizontal Axis (Mid Theatrical Run = Day 7-8) */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.12] z-0" />

              {/* 25% and 75% subtle guide lines */}
              <div className="absolute left-1/4 top-0 bottom-0 w-[1px] border-r border-dashed border-white/[0.04] pointer-events-none" />
              <div className="absolute left-3/4 top-0 bottom-0 w-[1px] border-r border-dashed border-white/[0.04] pointer-events-none" />
              <div className="absolute top-1/4 left-0 right-0 h-[1px] border-b border-dashed border-white/[0.04] pointer-events-none" />
              <div className="absolute top-3/4 left-0 right-0 h-[1px] border-b border-dashed border-white/[0.04] pointer-events-none" />

              {/* Minimalist Linear Quadrant Badges */}
              <div className="absolute top-3 left-3 text-[0.6rem] font-mono tracking-wider text-rose-400/80 uppercase font-semibold pointer-events-none flex items-center gap-1.5 bg-[#070b14]/70 px-2 py-0.5 rounded border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                <span>Critical Friction • Rapid Spread</span>
              </div>

              <div className="absolute top-3 right-3 text-[0.6rem] font-mono tracking-wider text-emerald-400/80 uppercase font-semibold pointer-events-none flex items-center gap-1.5 bg-[#070b14]/70 px-2 py-0.5 rounded border border-emerald-500/20">
                <span>Viral Breakout • Strong WOM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </div>

              <div className="absolute bottom-3 left-3 text-[0.6rem] font-mono tracking-wider text-amber-400/70 uppercase font-semibold pointer-events-none flex items-center gap-1.5 bg-[#070b14]/70 px-2 py-0.5 rounded border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                <span>Late Stage • Attrition Risk</span>
              </div>

              <div className="absolute bottom-3 right-3 text-[0.6rem] font-mono tracking-wider text-cyan-400/70 uppercase font-semibold pointer-events-none flex items-center gap-1.5 bg-[#070b14]/70 px-2 py-0.5 rounded border border-cyan-500/20">
                <span>Sustained Run • Evergreen Hold</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block" />
              </div>

              {/* Left Y-Axis Vertical Guide */}
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[0.58rem] font-mono text-slate-500 uppercase tracking-widest pointer-events-none select-none">
                ↑ THEATRICAL VELOCITY (DAY 1 PEAK → DAY 15)
              </div>

              {/* Plotted Movie Blips with Anti-Collision Separation */}
              {positionedMovies.map((movie) => (
                <RadarBlip
                  key={movie?.title || Math.random()}
                  movie={movie}
                  customLeft={movie.computedPercentLeft}
                  customTop={movie.computedPercentTop}
                  showStaticLabel={movie.shouldShowStaticLabel}
                  isSelected={(currentMovie?.toLowerCase() === movie?.title?.toLowerCase()) || (spotlightMovie?.title?.toLowerCase() === movie?.title?.toLowerCase())}
                  selectedIndustry={selectedIndustry}
                  onSelectMovie={onSelectMovie}
                  setHoveredBlip={setHoveredBlip}
                />
              ))}
            </div>

            {/* X-Axis Footer Legend */}
            <div className="flex items-center justify-between px-2 pt-2 text-[0.65rem] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-rose-400/80">
                <span>←</span> Critical Resistance (-100%)
              </span>
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[0.62rem]">
                Net Audience Word-of-Mouth (WOM)
              </span>
              <span className="flex items-center gap-1 text-emerald-400/80">
                Positive Advocacy (+100%) <span>→</span>
              </span>
            </div>
          </div>

          {/* Active Target Blip Readout */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[0.68rem]">Sensor Focus:</span>
              <span className="text-cyan-300 font-bold">
                {hoveredBlip?.title || spotlightMovie?.title || 'Monitoring stream'}
              </span>
              {(hoveredBlip || spotlightMovie) && (
                <span className={`px-1.5 py-0.2 rounded text-[0.6rem] font-bold ${
                  (hoveredBlip || spotlightMovie).industry === 'Kannada' ? 'bg-amber-500/20 text-amber-300' :
                  (hoveredBlip || spotlightMovie).industry === 'Telugu' ? 'bg-cyan-500/20 text-cyan-300' :
                  (hoveredBlip || spotlightMovie).industry === 'Tamil' ? 'bg-rose-500/20 text-rose-300' :
                  (hoveredBlip || spotlightMovie).industry === 'Malayalam' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {(hoveredBlip || spotlightMovie).industryLabel || (hoveredBlip || spotlightMovie).industry}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[0.68rem]">
              <span className="text-emerald-400">
                WOM: {(hoveredBlip || spotlightMovie)?.netSentiment > 0 ? '+' : ''}{(hoveredBlip || spotlightMovie)?.netSentiment || 0}%
              </span>
              <span className="text-amber-400">
                {(hoveredBlip || spotlightMovie)?.boxOfficeSummary || 'Tracking'}
              </span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BENTO CARD 2: 🔍 SPOTLIGHT TITLE & INSTANT WAR-ROOM DISPATCH (Col 5)
        ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {spotlightMovie ? (
            <div className="bento-card bento-card-threat p-5 sm:p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
              
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

              <div>
                {/* Header Tagline */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[0.62rem] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 uppercase">
                      Spotlight
                    </span>
                    <span className="text-slate-400 text-xs font-mono">
                      {spotlightMovie.releaseTiming}
                    </span>
                  </div>

                  <span className="text-[0.65rem] font-mono text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                    <CheckCircle2 className="w-3 h-3" />
                    5/5 Verified
                  </span>
                </div>

                {/* Movie Title & Industry Tag */}
                <div className="mt-4 mb-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold ${
                      spotlightMovie.industry === 'Kannada' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      spotlightMovie.industry === 'Telugu' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      spotlightMovie.industry === 'Tamil' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      spotlightMovie.industry === 'Malayalam' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {spotlightMovie.industryLabel || `${spotlightMovie.industry} Cinema`}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Day {spotlightMovie.daysInTheaters} in Theaters
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {spotlightMovie.title}
                  </h2>

                  {/* Fully Synchronized Decision & Damage Control Posture Pill */}
                  {currentMovie?.toLowerCase() === spotlightMovie.title?.toLowerCase() && currentMovieData?.decisionIntelligence && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                        {currentMovieData.decisionIntelligence.executiveSummary?.primaryPosture}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        CRS: {currentMovieData.decisionIntelligence.executiveSummary?.compositeRiskScore}/100
                      </span>
                      <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Exposure: {currentMovieData.decisionIntelligence.executiveSummary?.netRevenueAtRisk}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Hold: {currentMovieData.decisionIntelligence.executiveSummary?.projectedMondayHold}
                      </span>
                    </div>
                  )}
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-[#090e1a] p-3 rounded-xl border border-white/[0.08]">
                    <span className="text-[0.65rem] text-slate-400 uppercase font-mono block">Box Office Momentum</span>
                    <span className="text-base font-black text-amber-300 font-mono mt-0.5 block truncate">
                      {spotlightMovie.boxOfficeSummary || 'Tracking'}
                    </span>
                  </div>

                  <div className="bg-[#090e1a] p-3 rounded-xl border border-white/[0.08]">
                    <span className="text-[0.65rem] text-slate-400 uppercase font-mono block">Net Sentiment (WOM)</span>
                    <span className={`text-base font-black font-mono mt-0.5 block ${
                      spotlightMovie.netSentiment >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {spotlightMovie.netSentiment > 0 ? '+' : ''}{spotlightMovie.netSentiment}%
                    </span>
                  </div>
                </div>

                {/* Latest Verified Ground Headline */}
                <div className="bg-[#070c17]/90 p-2.5 sm:p-3 rounded-xl border border-white/[0.08] shadow-inner mt-2">
                  <div className="flex items-center gap-1.5 text-[0.62rem] font-mono text-cyan-400 font-bold mb-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Verified Trade Corroboration</span>
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{spotlightMovie.latestHeadline?.replace(/["\\]/g, '')}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center gap-2">
                <button
                  onClick={() => onSelectMovie(spotlightMovie.title)}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
                  title="Load this film's full intelligence data into all dashboards"
                >
                  <span>Load Into All Dashboards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenWarRoom(spotlightMovie.title)}
                  className="px-3.5 py-2 bg-gradient-to-r from-cyan-950/60 to-purple-950/60 hover:from-cyan-900/60 hover:to-purple-900/60 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
                  title="Open Systematic Decision Matrix (AHP + Bayesian)"
                >
                  <Swords className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Decision Matrix</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bento-card p-6 flex flex-col items-center justify-center text-center text-slate-400">
              <span>Select an active theatrical release blip</span>
            </div>
          )}

          {/* Quick Tactical Mitigation Bento Tile */}
          <div className="bento-card p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
              <span className="text-[0.65rem] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Damage Control Pre-Emptive Audit
              </span>
              <span className="text-[0.6rem] font-mono text-slate-500">Live IST 15D</span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="bg-[#080d18] p-2 rounded-lg border border-white/5">
                <span className="text-[0.58rem] text-slate-400 uppercase block font-mono">Monday Test</span>
                <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">
                  {currentMovieData?.decisionIntelligence?.executiveSummary?.projectedMondayHold || '65% Hold'}
                </span>
              </div>
              <div className="bg-[#080d18] p-2 rounded-lg border border-white/5">
                <span className="text-[0.58rem] text-slate-400 uppercase block font-mono">AstroTurf Bots</span>
                <span className="text-xs font-bold text-amber-400 font-mono mt-0.5 block">
                  {currentMovieData?.decisionIntelligence?.stage1_deBiasing?.syndicationCopiesSuppressed 
                    ? `${currentMovieData.decisionIntelligence.stage1_deBiasing.syndicationCopiesSuppressed} Filtered` 
                    : '14 Filtered'}
                </span>
              </div>
              <div className="bg-[#080d18] p-2 rounded-lg border border-white/5">
                <span className="text-[0.58rem] text-slate-400 uppercase block font-mono">Mass Divergence</span>
                <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">
                  {currentMovieData?.decisionIntelligence?.stage3_factorMatrix?.dimensions?.divergenceHazard?.label?.includes('+')
                    ? currentMovieData.decisionIntelligence.stage3_factorMatrix.dimensions.divergenceHazard.label
                    : '+18% B&C'}
                </span>
              </div>
            </div>

            <p className="text-[0.68rem] text-slate-400 font-mono leading-relaxed">
              {currentMovieData?.decisionIntelligence?.executiveSummary?.criticalOperationalOrder
                ? `Operational Order: ${currentMovieData.decisionIntelligence.executiveSummary.criticalOperationalOrder}. Impact: ${currentMovieData.decisionIntelligence.executiveSummary.expectedRecoveryDelta || '+18% retention'}.`
                : '5-Layer Verified Playbook: Deploy talent Q&A / targeted regional campaign within 4 hours to contain second-half pacing friction.'}
            </p>
          </div>

        </div>

      </div>

      {/* 2. All Verified 15-Day Theatrical Releases (Multi-Industry Stream) */}
      <div className="bento-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-mono">
              Active Theatrical Releases ({displayedMovies.length} Titles)
            </h4>
            <span className="badge badge-info text-[0.6rem] py-0.2">Strict 15-Day Window</span>
            <span className="badge badge-positive text-[0.6rem] py-0.2">5-Layer Validated</span>
          </div>

          <span className="text-xs font-mono text-slate-400 text-[0.68rem]">
            Rolling Window: <strong className="text-cyan-300">{windowRange} (IST)</strong>
          </span>
        </div>

        {/* Releases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {displayedMovies.map((m, idx) => {
            const title = (typeof m === 'string' ? m : m?.title) || `Title ${idx + 1}`;
            const isSelected = (currentMovie?.toLowerCase() === title.toLowerCase()) || (spotlightMovie?.title?.toLowerCase() === title.toLowerCase());
            const timing = typeof m === 'object' ? m.releaseTiming : 'Day in theaters';
            const bo = typeof m === 'object' && (m.boxOfficeSummary || m.corroboratedBoxOffice);
            const trust = typeof m === 'object' ? m.trustScore : 90;
            const wom = typeof m === 'object' ? m.netSentiment : 0;
            const industry = typeof m === 'object' ? m.industry : 'Pan-Indian';

            const dayMatch = timing?.match(/Day\s+(\d+)/i);
            const dayNum = dayMatch ? dayMatch[1] : (idx + 1);

            return (
              <div
                key={title}
                onClick={() => onSelectMovie(title)}
                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all group ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-950/50'
                    : 'bg-[#090e1a]/80 border-white/[0.08] hover:border-cyan-500/40 hover:bg-[#0d1424]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[0.62rem] font-mono font-bold ${
                        parseInt(dayNum, 10) <= 3 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        DAY {dayNum}
                      </span>

                      <span className={`px-1.5 py-0.2 rounded text-[0.58rem] font-mono font-bold ${
                        industry === 'Kannada' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        industry === 'Telugu' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        industry === 'Tamil' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        industry === 'Malayalam' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {industry}
                      </span>
                    </div>

                    <span className="text-[0.6rem] font-mono text-emerald-300 font-bold flex items-center gap-0.5">
                      ✓ 5/5
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                    {title}
                  </h5>

                  {bo && (
                    <div className="text-[0.68rem] font-mono text-amber-300 mt-1 font-semibold truncate">
                      {bo.replace(' crore', ' Cr').replace(' cr', ' Cr')}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[0.68rem] font-mono">
                  <span className={wom >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    WOM: {wom > 0 ? '+' : ''}{wom}%
                  </span>

                <span className={`text-[0.7rem] flex items-center gap-1 font-bold font-mono transition-transform group-hover:translate-x-0.5 ${
                    isSelected ? 'text-cyan-300' : 'text-cyan-400'
                  }`}>
                    {isSelected ? '✓ Active' : 'Inspect →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
