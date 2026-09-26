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
      aria-label={`Select ${movie.title} on radar`}
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
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 group focus:outline-none rounded-full ${
        !isMatchingIndustry ? 'opacity-15 scale-75 pointer-events-none' : 'opacity-100'
      } ${isSelected || isHovered ? 'z-30' : 'z-20'}`}
    >
      {/* Pulsing radar alert ring for selected or critical threats */}
      {(isSelected || isCritical) && isMatchingIndustry && (
        <span
          className={`absolute -inset-2.5 rounded-full animate-ping pointer-events-none ${
            isCritical ? 'bg-red-500/40' : 'bg-cyan-400/40'
          }`}
        />
      )}

      {/* Target Crosshair Ring for Selected Item */}
      {isSelected && isMatchingIndustry && (
        <span className="absolute -inset-2 rounded-full border border-cyan-400/80 animate-pulse pointer-events-none" />
      )}

      {/* Blip Target Dot */}
      <div
        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-150 ${
          isSelected
            ? 'bg-cyan-400 border-white scale-125 shadow-lg shadow-cyan-400/90 ring-2 ring-cyan-400'
            : isCritical
            ? 'bg-red-500 border-red-200 shadow-md shadow-red-500/80'
            : isFavorable
            ? 'bg-emerald-400 border-emerald-200 shadow-md shadow-emerald-500/40'
            : 'bg-cyan-500 border-cyan-200'
        } ${isHovered ? 'scale-125 ring-2 ring-white/60' : ''}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>

      {/* Tactical Label: Clean, collision-free, expands on hover or selection */}
      <div
        className={`absolute ${isNearBottom ? 'bottom-5' : 'top-4'} left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.62rem] font-mono px-2 py-0.5 rounded pointer-events-none font-bold shadow-xl transition-all duration-150 ${
          isSelected
            ? 'bg-cyan-950/95 text-cyan-200 border border-cyan-400 ring-1 ring-cyan-400/40 scale-105 z-30 opacity-100'
            : isHovered
            ? 'bg-[#060a12]/95 text-white border border-cyan-500/60 scale-110 z-40 opacity-100 shadow-cyan-950/80 ring-1 ring-white/20'
            : showStaticLabel
            ? 'bg-black/80 text-slate-300 border border-white/10 opacity-80 group-hover:opacity-100'
            : 'opacity-0 group-hover:opacity-100 bg-[#060a12]/95 text-cyan-200 border border-cyan-500/50 scale-105 z-30'
        }`}
      >
        <span className="flex items-center gap-1.5">
          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
          <span>{movie.title}</span>
          {(isSelected || isHovered) && (
            <span className={`text-[0.55rem] font-semibold ${womVal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ({womVal >= 0 ? '+' : ''}{womVal}%)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

