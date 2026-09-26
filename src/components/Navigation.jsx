// src/components/Navigation.jsx
// Cinema Intelligence Process Workflow Navigator
// Formalizes the 7-Stage Entertainment Intelligence Process:
// DISCOVER → TRACK → COLLECT → ANALYSE → UNDERSTAND → COMPARE → ACT
// v2: Global Movie Selector added – selecting a movie syncs ALL dashboards instantly

import React, { useState, useRef, useEffect } from 'react';
import { 
  Radar, 
  Activity, 
  Radio, 
  BarChart2, 
  GitFork, 
  Scale, 
  Swords, 
  ChevronRight,
  ChevronDown,
  Film,
  Check,
  Loader2,
  Briefcase
} from 'lucide-react';

/**
 * Navigation component for the Cinema Intelligence workflow.
 *
 * @param {Object} props - Component props.
 * @param {string} props.activeTab - Currently active tab identifier.
 * @param {function} props.onSelectTab - Callback to change the active tab.
 * @param {string} [props.currentMovie] - Title of the selected movie.
 * @param {number} [props.releasesCount=0] - Number of releases for badge.
 * @param {string} [props.defconLevel='DEFCON 2'] - DEFCON level badge.
 * @param {string} [props.sensorsOnline='6/6'] - Sensors online status badge.
 * @param {function} [props.onTriggerCompare] - Callback for compare step.
 * @param {Array} [props.discoveredMovies=[]] - List of movies for selector.
 * @param {function} [props.onSelectMovie] - Callback when a movie is selected.
 * @param {boolean} [props.loading=false] - Loading state for movie selector.
 */
export default function Navigation({
  activeTab,
  onSelectTab,
  currentMovie,
  releasesCount = 0,
  defconLevel = 'DEFCON 2',
  sensorsOnline = '6/6',
  onTriggerCompare,
  discoveredMovies = [],
  onSelectMovie,
  loading = false,
}) {
  const [movieDropdownOpen, setMovieDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const workflowSteps = [
    {
      id: 'discover',
      stage: 'DISCOVER',
      subtitle: '15-Day Radar',
      targetTab: 'radar',
      icon: Radar,
      badge: `${releasesCount || 7}`,
      activeIf: ['radar']
    },
    {
      id: 'track',
      stage: 'TRACK',
      subtitle: 'Theatrical Velocity',
      targetTab: 'radar',
      icon: Activity,
      badge: 'Live IST',
      activeIf: ['radar']
    },
    {
      id: 'collect',
      stage: 'COLLECT',
      subtitle: 'Sensor Telemetry',
      targetTab: 'telemetry',
      icon: Radio,
      badge: sensorsOnline,
      activeIf: ['telemetry']
    },
    {
      id: 'analyse',
      stage: 'ANALYSE',
      subtitle: 'Performance & WOM',
      targetTab: 'twin',
      icon: BarChart2,
      badge: 'Metrics',
      activeIf: ['twin']
    },
    {
      id: 'understand',
      stage: 'UNDERSTAND',
      subtitle: 'Narratives & Roots',
      targetTab: 'forensics',
      icon: GitFork,
      badge: 'Roots',
      activeIf: ['forensics']
    },
    {
      id: 'compare',
      stage: 'COMPARE',
      subtitle: 'Theatrical Matrix',
      targetTab: 'twin',
      icon: Scale,
      badge: 'Matrix',
      activeIf: ['twin']
    },
    {
      id: 'act',
      stage: 'ACT',
      subtitle: 'War Room & AHP',
      targetTab: 'war-room',
      icon: Swords,
      badge: defconLevel,
      activeIf: ['war-room']
    },
    {
      id: 'products',
      stage: 'PRODUCTS',
      subtitle: 'Crisis Arsenal',
      targetTab: 'products',
      icon: Briefcase,
      badge: '4 Tools',
      activeIf: ['products']
    }
  ];

  const handleStepClick = (step) => {
    onSelectTab(step.targetTab);
    if (step.id === 'compare' && onTriggerCompare) {
      onTriggerCompare();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMovieDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMovieSelect = (title) => {
    setMovieDropdownOpen(false);
    if (onSelectMovie && title !== currentMovie) {
      onSelectMovie(title);
    }
  };

  // Build movie list from discoveredMovies
  const movieOptions = discoveredMovies.map(m => ({
    title: typeof m === 'string' ? m : m.title,
    bo: typeof m === 'object' && m.boxOfficeSummary && m.boxOfficeSummary !== 'Tracking' ? m.boxOfficeSummary : null,
    timing: typeof m === 'object' ? m.releaseTiming : null,
    industry: typeof m === 'object' ? m.industry : null
  })).filter(m => m.title);

  return (
    <nav className="bg-[#070b14]/95 border-b border-white/[0.08] px-3 lg:px-6 py-1.5 sticky top-14 z-40 backdrop-blur-xl shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* 1. Process Workflow Stepper (Flexible Width, Never Overlaps Dropdown) */}
        <div className="min-w-0 flex-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isTabActive = step.activeIf.includes(activeTab);

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(step)}
                  className={`group relative px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-mono text-xs whitespace-nowrap border shrink-0 ${
                    isTabActive
                      ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 text-white border-cyan-500/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                      : 'bg-white/[0.02] text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                  title={`${step.stage}: ${step.subtitle}`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isTabActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  
                  <span className={`font-bold tracking-wider text-[0.68rem] ${isTabActive ? 'text-white' : 'text-slate-300'}`}>
                    {step.stage}
                  </span>

                  {step.badge && (
                    <span className={`text-[0.58rem] px-1.5 py-0.2 rounded border font-semibold ${
                      isTabActive 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}>
                      {step.badge}
                    </span>
                  )}

                  {/* Active Step Indicator Underline */}
                  {isTabActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                  )}
                </button>

                {/* Subtle divider arrow between steps */}
                {idx < workflowSteps.length - 1 && (
                  <span className="text-slate-700 text-[0.65rem] shrink-0 select-none hidden lg:inline">›</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 2. Global Movie Selector (Cleanly Partitioned On Right) */}
        {movieOptions.length > 0 && (
          <div className="shrink-0 flex items-center gap-2 pl-3 border-l border-white/[0.08]" ref={dropdownRef}>
            <span className="text-[0.6rem] font-mono text-slate-400 uppercase tracking-wider font-semibold hidden 2xl:inline">
              Active Film:
            </span>
            <div className="relative">
              <button
                onClick={() => setMovieDropdownOpen(prev => !prev)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all whitespace-nowrap ${
                  currentMovie
                    ? 'bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border-cyan-500/50 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/20'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                title="Switch active film — syncs all dashboards instantly"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <Film className={`w-3.5 h-3.5 shrink-0 ${currentMovie ? 'text-cyan-400' : 'text-slate-500'}`} />
                )}
                <span className="max-w-[120px] sm:max-w-[145px] truncate font-bold text-[0.7rem] text-slate-200">
                  {currentMovie || 'Select Film'}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${movieDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

            {/* Dropdown */}
            {movieDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#0a1020] border border-cyan-500/30 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden animate-fade-in">
                <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-[0.62rem] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Active 15-Day Releases
                  </span>
                  <span className="text-[0.6rem] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                    {movieOptions.length} films
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {movieOptions.map(m => {
                    const isSelected = m.title === currentMovie;
                    return (
                      <button
                        key={m.title}
                        onClick={() => handleMovieSelect(m.title)}
                        className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 transition-all hover:bg-white/[0.05] border-b border-white/[0.04] last:border-0 ${
                          isSelected ? 'bg-cyan-500/10' : ''
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className={`text-xs font-bold truncate font-mono ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                            {m.title}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {m.industry && (
                              <span className="text-[0.58rem] font-mono text-slate-500 bg-white/5 px-1.5 py-0.1 rounded">
                                {m.industry}
                              </span>
                            )}
                            {m.bo && (
                              <span className="text-[0.58rem] font-mono text-amber-400 font-semibold">
                                {m.bo}
                              </span>
                            )}
                            {m.timing && !m.bo && (
                              <span className="text-[0.58rem] font-mono text-slate-500">
                                {m.timing.includes('(') ? m.timing.match(/\((.*?)\)/)?.[1] || m.timing : m.timing}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="px-3 py-1.5 border-t border-white/[0.06] bg-[#070b14]">
                  <p className="text-[0.58rem] font-mono text-slate-600 text-center">
                    Selecting a film syncs all dashboards instantly
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      </div>
    </nav>
  );
}
