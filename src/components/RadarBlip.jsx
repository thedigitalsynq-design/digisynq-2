import React from 'react';

/**
 * RadarBlip - renders a single movie blip on the radar canvas.
 * Props:
 *   movie: object containing movie data.
 *   isSelected: boolean indicating if this movie is the currently selected spotlight.
 *   selectedIndustry: currently filtered industry string.
 *   onSelectMovie: function to select a movie (title).
 *   setHoveredBlip: function to set hovered movie for readout.
 */
export default function RadarBlip({
  movie,
  isSelected,
  selectedIndustry,
  onSelectMovie,
  setHoveredBlip,
}) {
  const isMatchingIndustry = selectedIndustry === 'ALL' || movie.industry === selectedIndustry;
  const isCritical = movie.sentimentStatus === 'CRITICAL_FRICTION' || movie.status === 'CONTROVERSY_ALERT';
  const isFavorable = movie.sentimentStatus === 'FAVORABLE_WOM';

  // Safely map coordinates
  const x = typeof movie.xCoordinate === 'number' ? movie.xCoordinate : 0;
  const y = typeof movie.yCoordinate === 'number' ? movie.yCoordinate : 50;

  // Scale to radar percent
  const leftPercent = 50 + x * 0.44;
  const topPercent = 90 - y * 0.8;

  return (
    <div
      key={movie.title}
      onMouseEnter={() => setHoveredBlip(movie)}
      onMouseLeave={() => setHoveredBlip(null)}
      onClick={() => onSelectMovie(movie.title)}
      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 group ${
        !isMatchingIndustry ? 'opacity-20 scale-75 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Pulsing ring for selected or critical */}
      {(isSelected || isCritical) && isMatchingIndustry && (
        <span
          className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
            isCritical ? 'bg-red-500' : 'bg-cyan-400'
          }`}
        />
      )}

      {/* Blip dot */}
      <div
        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-transform ${
          isSelected
            ? 'bg-cyan-400 border-white scale-125 shadow-lg shadow-cyan-400/80 ring-2 ring-cyan-400'
            : isCritical
            ? 'bg-red-500 border-red-300 shadow-md shadow-red-500/60'
            : isFavorable
            ? 'bg-emerald-400 border-emerald-200'
            : 'bg-cyan-500 border-cyan-300'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>

      {/* Micro title label below blip */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.62rem] font-mono px-1.5 py-0.2 rounded pointer-events-none font-bold shadow-md transition-all ${
          isSelected
            ? 'bg-cyan-950/95 text-cyan-300 border border-cyan-500/50 scale-105 z-30'
            : 'bg-black/85 text-slate-300 border border-white/10 group-hover:text-white'
        }`}
      >
        {movie.title}
      </div>
    </div>
  );
}
