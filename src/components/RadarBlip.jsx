import React, { useState } from 'react';

/**
 * RadarBlip - renders a single movie blip on the radar canvas with smart collision avoidance
 * and non-overlapping tactical radar styling.
 */
export default function RadarBlip({
  movie,
  isSelected,
  selectedIndustry,
  onSelectMovie,
  setHoveredBlip,
  customLeft,
  customTop,
  showStaticLabel = false
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMatchingIndustry = selectedIndustry === 'ALL' || movie.industry === selectedIndustry;
  const isCritical = movie.sentimentStatus === 'CRITICAL_FRICTION' || movie.status === 'CONTROVERSY_ALERT' || movie.threatLevel === 'HIGH';
  const isFavorable = movie.sentimentStatus === 'FAVORABLE_WOM' || movie.netSentiment >= 50;

  // Use pre-computed collision-avoidance coordinates if available, otherwise safely map
  const leftPercent = typeof customLeft === 'number' 
    ? customLeft 
    : (50 + (typeof movie.xCoordinate === 'number' ? movie.xCoordinate : 0) * 0.44);
  const topPercent = typeof customTop === 'number'
    ? customTop
    : (90 - (typeof movie.yCoordinate === 'number' ? movie.yCoordinate : 50) * 0.8);

  const womVal = typeof movie.netSentiment === 'number' ? movie.netSentiment : (movie.sentimentScore || 0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoveredBlip(movie);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredBlip(null);
  };

  const isNearBottom = topPercent > 75;

  return (
    <div
      key={movie.title}
      role="button"
      tabIndex={isMatchingIndustry ? 0 : -1}
      aria-label={`Select ${movie.title} on matrix`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectMovie(movie.title)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectMovie(movie.title);
        }
      }}
      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group focus:outline-none rounded-full ${
        !isMatchingIndustry ? 'opacity-15 scale-75 pointer-events-none' : 'opacity-100'
      } ${isSelected || isHovered ? 'z-30' : 'z-20'}`}
    >
      {/* Subtle ping ring for selected target */}
      {isSelected && isMatchingIndustry && (
        <span className="absolute -inset-3 rounded-full bg-cyan-400/25 animate-ping pointer-events-none" />
      )}

      {/* Target Focus Ring for Selected Item */}
      {isSelected && isMatchingIndustry && (
        <span className="absolute -inset-2 rounded-full border border-cyan-400/80 ring-1 ring-cyan-400/30 animate-pulse pointer-events-none" />
      )}

      {/* Minimalist Bead Dot */}
      <div
        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 ${
          isSelected
            ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_14px_rgba(34,211,238,0.8)] ring-2 ring-cyan-400/60'
            : isCritical
            ? 'bg-rose-500 border-rose-200/90 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
            : isFavorable
            ? 'bg-emerald-400 border-emerald-200/90 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
            : 'bg-slate-300 border-white/60 shadow-sm'
        } ${isHovered ? 'scale-125 ring-2 ring-white/70 shadow-lg' : ''}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-white'}`} />
      </div>

      {/* Linear-Style Tooltip Pill: Frosted dark capsule, zero clipping, typography aligned */}
      <div
        className={`absolute ${isNearBottom ? 'bottom-5' : 'top-5'} left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md pointer-events-none font-sans shadow-2xl transition-all duration-150 backdrop-blur-md ${
          isSelected
            ? 'bg-[#09111e]/95 text-white border border-cyan-400/80 ring-1 ring-cyan-400/30 scale-105 z-30 opacity-100'
            : isHovered
            ? 'bg-[#090e18]/95 text-white border border-white/20 scale-110 z-40 opacity-100 shadow-cyan-950/80'
            : showStaticLabel
            ? 'bg-black/80 text-slate-300 border border-white/10 opacity-70 group-hover:opacity-100'
            : 'opacity-0 group-hover:opacity-100 bg-[#090e18]/95 text-white border border-white/15 scale-105 z-30'
        }`}
      >
        <span className="flex items-center gap-1.5 text-xs font-medium">
          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />}
          <span className="tracking-tight">{movie.title}</span>
          <span className={`text-[0.65rem] font-mono font-bold ${womVal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {womVal >= 0 ? '+' : ''}{womVal}%
          </span>
        </span>
      </div>
    </div>
  );
}

