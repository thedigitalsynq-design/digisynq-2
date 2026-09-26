import React, { useState, useEffect } from 'react';
import { fetchRadar as getRadar } from '../api';
import { Radar, RefreshCw, ExternalLink, ArrowRight, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function CinemaRadar({ onSelectMovie, currentMovie }) {
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const fetchRadar = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRadar({ force });
      if (data.isOffline && (!data.movies || data.movies.length === 0)) {
        setError(data.error || 'Radar telemetry stream offline');
      }
      setRadarData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, []);

  return (
    <div className="glass-panel p-5 border border-cyan-500/20 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radar className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2">
              CDC Threat & Reputation Radar
              <span className="badge badge-critical text-[0.65rem] py-0.5 animate-pulse">Defense Sensor</span>
              <span className="badge badge-info text-[0.65rem] py-0.5">Last 15 Days</span>
              <span className="badge badge-warning text-[0.62rem] py-0.5 font-mono">IST (UTC+05:30)</span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
              <span>Live Indian Theatrical Threat Tracking: Velocity (Y) vs Reputation Risk / Favorable Momentum (X)</span>
              {radarData?.windowRange && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-300 font-mono text-[0.72rem]">IST Window: {radarData.windowRange}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-500 text-[0.7rem]">
            Audited {radarData?.movies?.length || 0} active titles
          </span>
          <button
            onClick={() => fetchRadar(true)}
            disabled={loading}
            className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-50 transition-colors"
            title="Refresh radar from live pulse"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !radarData ? (
        <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
          <span className="text-xs font-mono">Sweeping Indian cinema sensor feeds & calculating radar coordinates...</span>
        </div>
      ) : error ? (
        <div className="p-4 my-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-xs">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
          
          {/* Radar Visual Canvas / SVG Plot */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-full border border-cyan-500/30 bg-[#070b13] p-4 flex items-center justify-center shadow-inner shadow-cyan-950/40">
              
              {/* Radar circular grid lines */}
              <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-28 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-40 rounded-full border border-cyan-500/20" />
              
              {/* Radar Axis lines */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-500/25" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-500/25" />

              {/* Sweeping Radar Scanner Line */}
              <div className="radar-sweep" />

              {/* Quadrant Axis Labels */}
              <div className="absolute top-2 text-[0.65rem] font-mono tracking-widest text-cyan-400/90 uppercase font-semibold bg-[#070b13]/85 px-2 py-0.5 rounded border border-cyan-500/20">
                ↑ Rapid Threat Emergence
              </div>
              <div className="absolute bottom-2 text-[0.65rem] font-mono tracking-widest text-slate-400 uppercase font-semibold bg-[#070b13]/85 px-2 py-0.5 rounded border border-white/5">
                ↓ Stable / Contained
              </div>
              <div className="absolute left-2 text-[0.65rem] font-mono tracking-widest text-red-400/90 uppercase font-semibold bg-[#070b13]/85 px-2 py-0.5 rounded border border-red-500/20">
                ← Critical Damage Risk
              </div>
              <div className="absolute right-2 text-[0.65rem] font-mono tracking-widest text-emerald-400/90 uppercase font-semibold bg-[#070b13]/85 px-2 py-0.5 rounded border border-emerald-500/20">
                Favorable Momentum →
              </div>

              {/* Plotted Movie Blips */}
              {radarData?.movies?.map((movie) => {
                // Map xCoordinate (-100 to +100) -> percentage (10% to 90%)
                const leftPercent = 50 + (movie.xCoordinate / 220) * 100;
                // Map yCoordinate (0 to 100) -> inverted percentage (90% at 0, 10% at 100)
                const topPercent = 90 - (movie.yCoordinate / 115) * 80;

                const isCurrent = currentMovie?.toLowerCase() === movie.title.toLowerCase();
                const isHovered = hoveredMovie?.title === movie.title;
                const isControversy = movie.controversySignals > 0 || movie.xCoordinate < -15;
                const isPositive = movie.xCoordinate > 15;

                const blipColor = isControversy 
                  ? 'bg-red-500 shadow-red-500/50' 
                  : isPositive 
                    ? 'bg-emerald-400 shadow-emerald-400/50' 
                    : 'bg-cyan-400 shadow-cyan-400/50';

                return (
                  <div
                    key={movie.id}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                    onMouseEnter={() => setHoveredMovie(movie)}
                    onClick={() => onSelectMovie(movie.title)}
                  >
                    {/* Pulsing ring */}
                    <div className={`absolute -inset-2 rounded-full opacity-70 group-hover:opacity-100 animate-ping ${isControversy ? 'bg-red-500/30' : 'bg-cyan-500/30'}`} />
                    
                    {/* Blip node */}
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${isCurrent ? 'border-white scale-125' : 'border-[#0a0e17]'} ${blipColor} shadow-lg transition-transform group-hover:scale-150`} />

                    {/* Movie title label */}
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[0.65rem] font-bold font-mono transition-all ${
                      isCurrent || isHovered
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'bg-[#0f172a]/90 text-slate-200 border border-white/10 group-hover:border-cyan-400'
                    }`}>
                      {movie.title}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radar Formula footnote */}
            <div className="mt-3 text-[0.68rem] text-slate-500 font-mono text-center">
              Coordinates: X = Net Sentiment (-100 to +100) • Y = Ingestion Velocity & Emergence (0 to 100)
            </div>
          </div>

          {/* Radar Details & Hover Insight Panel */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-[#0e1524] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Inspected Blip
                </span>
                <span className="badge badge-info text-[0.65rem]">
                  {hoveredMovie ? hoveredMovie.quadrant : 'Hover Over A Node'}
                </span>
              </div>

              {hoveredMovie ? (
                <div className="flex flex-col gap-2.5 animate-fade-in">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-bold text-white">{hoveredMovie.title}</h3>
                    <span className="text-xs font-mono text-cyan-400">
                      {hoveredMovie.signalCount} verified signals
                    </span>
                  </div>

                  {/* Release timing & box office tag */}
                  <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-mono">
                    {hoveredMovie.releaseTiming && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
                        {hoveredMovie.releaseTiming}
                      </span>
                    )}
                    {hoveredMovie.boxOfficeSummary && (
                      <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 font-bold">
                        {hoveredMovie.boxOfficeSummary}
                      </span>
                    )}
                  </div>

                  {/* Multi-Source Corroboration Badge */}
                  {hoveredMovie.verificationBadge && (
                    <div className="flex items-center justify-between text-[0.68rem] font-mono py-1 px-2 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                        {hoveredMovie.verificationBadge}
                      </span>
                      <span className="font-bold text-white bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        {hoveredMovie.trustScore || 90}% Trust
                      </span>
                    </div>
                  )}

                  {hoveredMovie.verifiedSources && hoveredMovie.verifiedSources.length > 0 && (
                    <div className="text-[0.65rem] font-mono text-slate-400">
                      Cross-checked across: <span className="text-slate-200 font-semibold">{hoveredMovie.verifiedSources.join(', ')}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    "{hoveredMovie.latestHeadline}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/5">
                    <div>
                      <span className="text-slate-500 block text-[0.65rem]">MOMENTUM (X)</span>
                      <span className={hoveredMovie.xCoordinate >= 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {hoveredMovie.xCoordinate > 0 ? '+' : ''}{hoveredMovie.xCoordinate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[0.65rem]">VELOCITY (Y)</span>
                      <span className="text-cyan-400 font-semibold">
                        {hoveredMovie.yCoordinate}/100
                      </span>
                    </div>
                  </div>

                  <div className="text-[0.7rem] text-slate-400">
                    Source: <span className="text-slate-200">{hoveredMovie.latestPublisher}</span>
                  </div>

                  <button
                    onClick={() => onSelectMovie(hoveredMovie.title)}
                    className="w-full mt-2 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20"
                  >
                    <span>Launch Digital Twin for {hoveredMovie.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-500/50" />
                  <span>Hover over any movie blip on the radar or pick from the active titles below to inspect its live digital twin state.</span>
                </div>
              )}
            </div>

            {/* Quick Cinema Radar Title List */}
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
              <span className="text-[0.68rem] uppercase font-mono tracking-wider text-slate-400 px-1">
                Theatrical Releases — Last 15 Days ({radarData?.movies?.length || 0})
              </span>
              {radarData?.movies?.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMovie(m.title)}
                  onMouseEnter={() => setHoveredMovie(m)}
                  className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 cursor-pointer transition-all ${
                    currentMovie?.toLowerCase() === m.title.toLowerCase()
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${m.controversySignals > 0 ? 'bg-red-400' : m.xCoordinate > 15 ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                      <span className="font-bold truncate text-white">{m.title}</span>
                    </div>
                    <span className="font-mono text-[0.68rem] text-slate-400 shrink-0">
                      {m.signalCount} sigs
                    </span>
                  </div>

                  {/* Secondary info strip: release date, box office & sentiment */}
                  <div className="flex items-center justify-between text-[0.65rem] font-mono text-slate-400 pl-4">
                    <span className="truncate text-cyan-300/90 flex items-center gap-1.5">
                      <span>{m.releaseTiming ? (m.releaseTiming.includes('(') ? m.releaseTiming.match(/\((.*?)\)/)?.[1] || m.releaseTiming : m.releaseTiming) : 'Theatrical'}</span>
                      {m.boxOfficeSummary && m.boxOfficeSummary !== 'Tracking' && (
                        <span className="text-amber-300 font-semibold bg-amber-500/15 px-1 rounded">{m.boxOfficeSummary}</span>
                      )}
                    </span>
                    <span className={`font-semibold ${m.xCoordinate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {m.xCoordinate > 0 ? '+' : ''}{m.xCoordinate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
