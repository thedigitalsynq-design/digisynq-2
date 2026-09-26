// src/components/CommandPalette.jsx
// Linear / Raycast Style Universal Command Palette (⌘K / Ctrl+K)
// Ultra-fast keyboard-first navigation across all 19 active releases, tabs, and emergency actions.

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Layers, 
  ShieldAlert, 
  Swords, 
  Briefcase, 
  GitFork, 
  Radio, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  Film, 
  ArrowRight,
  Command,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  discoveredMovies = [],
  onSelectMovie,
  activeTab,
  onSelectTab,
  onTriggerSync,
  onOpenAuth,
  onOpenLayersModal
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Define Navigation Items
  const navActions = [
    { id: 'radar', title: 'Go to Theatrical Threat Matrix', subtitle: 'Cartesian WOM vs Theatrical Velocity scatter plot', icon: Layers, type: 'tab', tabId: 'radar' },
    { id: 'twin', title: 'Go to Digital Twin & Threat Intel', subtitle: 'Active movie executive overview & ratings', icon: ShieldAlert, type: 'tab', tabId: 'twin' },
    { id: 'war-room', title: 'Go to Decision Engine (AHP War Room)', subtitle: 'Systematic AHP matrix & 5 emergency playbooks', icon: Swords, type: 'tab', tabId: 'war-room' },
    { id: 'products', title: 'Go to Crisis Damage Control Arsenal', subtitle: '4 studio mitigation products & counter-campaigns', icon: Briefcase, type: 'tab', tabId: 'products' },
    { id: 'forensics', title: 'Go to Forensic Lab & Causal DAG', subtitle: 'Root-cause graph, conflict engine & temporal replay', icon: GitFork, type: 'tab', tabId: 'forensics' },
    { id: 'telemetry', title: 'Go to Sensor Telemetry Desk', subtitle: 'Live status of 6 public signal harvesters', icon: Radio, type: 'tab', tabId: 'telemetry' }
  ];

  // Quick System Actions
  const systemActions = [
    { id: 'act-sync', title: 'Trigger Instant Sensor Sync', subtitle: 'Force fresh sweep of live Indian theatrical data', icon: RefreshCw, type: 'action', run: () => onTriggerSync(true) },
    { id: 'act-layers', title: 'Inspect 5-Layer Verification Gatekeeper', subtitle: 'View strict temporal and multi-source rules', icon: ShieldCheck, type: 'action', run: onOpenLayersModal },
    { id: 'act-auth', title: 'Studio Identity & Access Control', subtitle: 'Switch clearance or sign in with credentials', icon: User, type: 'action', run: onOpenAuth }
  ];

  // Movie Actions
  const movieActions = (discoveredMovies || []).map(m => {
    const title = typeof m === 'string' ? m : m.title;
    const industry = typeof m === 'object' ? m.industry : 'Pan-Indian';
    const day = typeof m === 'object' ? m.daysInTheaters : 1;
    const wom = typeof m === 'object' ? m.netSentiment : 0;
    const bo = typeof m === 'object' ? m.boxOfficeSummary : null;

    return {
      id: `movie-${title}`,
      title: title,
      subtitle: `${industry} • Day ${day} in Theaters • WOM: ${wom >= 0 ? '+' : ''}${wom}% ${bo ? `• ${bo}` : ''}`,
      icon: Film,
      type: 'movie',
      movieTitle: title,
      industry,
      wom
    };
  });

  // Filter items
  const cleanQ = query.trim().toLowerCase();

  const filteredMovies = movieActions.filter(m => 
    !cleanQ || m.title.toLowerCase().includes(cleanQ) || m.subtitle.toLowerCase().includes(cleanQ)
  );

  const filteredNav = navActions.filter(n =>
    !cleanQ || n.title.toLowerCase().includes(cleanQ) || n.subtitle.toLowerCase().includes(cleanQ)
  );

  const filteredSystem = systemActions.filter(s =>
    !cleanQ || s.title.toLowerCase().includes(cleanQ) || s.subtitle.toLowerCase().includes(cleanQ)
  );

  const combinedList = [...filteredMovies, ...filteredNav, ...filteredSystem];

  const handleSelect = (item) => {
    if (!item) return;
    if (item.type === 'movie') {
      onSelectMovie(item.movieTitle);
      onSelectTab('twin');
    } else if (item.type === 'tab') {
      onSelectTab(item.tabId);
    } else if (item.type === 'action') {
      item.run();
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, combinedList.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedList.length) % Math.max(1, combinedList.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(combinedList[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#090e1b] border border-white/[0.12] shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="relative p-4 border-b border-white/[0.08] flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a film name (e.g. Mandaadi, Toxic), dashboard, or action..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <div className="flex items-center gap-1 text-[0.65rem] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 shrink-0">
            <kbd>ESC</kbd> to close
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4 divide-y divide-white/[0.04]">
          
          {/* Active Theatrical Films Group */}
          {filteredMovies.length > 0 && (
            <div className="pt-1">
              <span className="px-3 text-[0.62rem] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-bold">
                15-Day Active Theatrical Releases ({filteredMovies.length})
              </span>
              <div className="space-y-0.5">
                {filteredMovies.map((item, idx) => {
                  const isSelected = combinedList[selectedIndex]?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-cyan-950/60 border border-cyan-500/40 text-white' 
                          : 'text-slate-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'
                        }`}>
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{item.title}</span>
                            <span className="text-[0.62rem] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                              {item.industry}
                            </span>
                          </div>
                          <p className="text-[0.68rem] text-slate-400 font-mono mt-0.5 truncate max-w-md">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'} transition-all`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Tabs Group */}
          {filteredNav.length > 0 && (
            <div className="pt-2">
              <span className="px-3 text-[0.62rem] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-bold">
                Navigation & Dashboards
              </span>
              <div className="space-y-0.5">
                {filteredNav.map((item) => {
                  const itemIndex = combinedList.findIndex(i => i.id === item.id);
                  const isSelected = selectedIndex === itemIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-cyan-950/60 border border-cyan-500/40 text-white' 
                          : 'text-slate-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{item.title}</span>
                          <span className="text-[0.68rem] text-slate-400 font-mono">{item.subtitle}</span>
                        </div>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'} transition-all`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* System Actions Group */}
          {filteredSystem.length > 0 && (
            <div className="pt-2">
              <span className="px-3 text-[0.62rem] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-bold">
                System Commands & Clearance
              </span>
              <div className="space-y-0.5">
                {filteredSystem.map((item) => {
                  const itemIndex = combinedList.findIndex(i => i.id === item.id);
                  const isSelected = selectedIndex === itemIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-cyan-950/60 border border-cyan-500/40 text-white' 
                          : 'text-slate-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{item.title}</span>
                          <span className="text-[0.68rem] text-slate-400 font-mono">{item.subtitle}</span>
                        </div>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'} transition-all`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {combinedList.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs font-mono">
              No matching films or actions found for "{query}"
            </div>
          )}

        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-[#070b14] flex items-center justify-between text-[0.65rem] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400">⌘K Universal Command Palette</span>
        </div>
      </div>
    </div>
  );
}
