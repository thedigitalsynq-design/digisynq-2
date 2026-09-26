// src/components/Header.jsx
// World-Class Executive Studio Command Bar
// Linear / Apple Minimalist Luxury Dark design with integrated Studio Auth, Active Film Switcher & Command Palette.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchISTTime } from '../api';
import { 
  Layers, 
  ShieldAlert, 
  Swords, 
  GitFork, 
  Radio, 
  Search, 
  RefreshCw, 
  Clock, 
  Briefcase,
  ChevronDown,
  Film,
  User,
  ShieldCheck,
  Command,
  Flame,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  onSelectTab, 
  currentQuery, 
  onSearch, 
  loading, 
  freshnessMap, 
  discoveredMovies = [], 
  isSyncing = false, 
  onManualSync, 
  systemStatus = 'LIVE',
  onOpenCommandPalette
}) {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [istTimeStr, setIstTimeStr] = useState('');
  const [lastDateIST, setLastDateIST] = useState('');
  const [filmSearchQuery, setFilmSearchQuery] = useState('');

  // Sync with server IST time & window definition
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat('en-IN', options).format(now);
      setIstTimeStr(formatted);

      // Detect midnight rollover in IST
      const dateOnly = new Intl.DateTimeFormat('en-IN', { 
        timeZone: 'Asia/Kolkata', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).format(now);

      if (lastDateIST && lastDateIST !== dateOnly) {
        if (onManualSync) onManualSync();
      }
      setLastDateIST(dateOnly);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastDateIST, onManualSync]);

  const healthySensors = freshnessMap ? freshnessMap.filter(s => s.status === 'HEALTHY').length : 6;
  const totalSensors = freshnessMap ? freshnessMap.length : 6;

  const tabs = [
    { id: 'radar', name: 'Threat Matrix', icon: Layers, badge: `${discoveredMovies.length || 19}` },
    { id: 'twin', name: 'Digital Twin', icon: ShieldAlert },
    { id: 'war-room', name: 'Decision Engine', icon: Swords, badge: 'AHP' },
    { id: 'products', name: 'Crisis Arsenal', icon: Briefcase, badge: '4 Tools' },
    { id: 'forensics', name: 'Forensics', icon: GitFork },
    { id: 'telemetry', name: 'Sensors', icon: Radio, badge: `${healthySensors}/${totalSensors}` }
  ];

  // Active movie details
  const activeMovieObj = discoveredMovies.find(m => 
    (typeof m === 'string' ? m : m?.title)?.toLowerCase() === (currentQuery || '').toLowerCase()
  ) || discoveredMovies[0] || null;

  const activeTitle = (typeof activeMovieObj === 'string' ? activeMovieObj : activeMovieObj?.title) || currentQuery || 'Active Release';
  const activeIndustry = typeof activeMovieObj === 'object' ? activeMovieObj?.industry : 'All';
  const activeDay = typeof activeMovieObj === 'object' ? activeMovieObj?.daysInTheaters : 1;
  const activeWOM = typeof activeMovieObj === 'object' ? activeMovieObj?.netSentiment : 68;

  // Filter films for dropdown
  const filteredDropdownFilms = (discoveredMovies || []).filter(m => {
    const title = typeof m === 'string' ? m : m?.title;
    return !filmSearchQuery || title?.toLowerCase().includes(filmSearchQuery.toLowerCase());
  });

  return (
    <header className="border-b border-white/[0.08] bg-[#070b14]/95 backdrop-blur-xl sticky top-0 z-40 shadow-xl shadow-black/50">
      
      {/* Top Command Ribbon */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* 1. Left Branding & Active Film Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Logo Mark */}
          <div 
            onClick={() => onSelectTab('radar')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-cyan-400/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-950/40 group-hover:border-cyan-400 transition-colors">
              <ShieldAlert className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-sm tracking-wider text-white">CDC</span>
              <span className="text-slate-600 font-light text-xs">//</span>
              <span className="text-[0.68rem] font-mono tracking-widest text-slate-400 uppercase hidden xl:inline font-semibold">
                CINEMA DAMAGE CONTROL
              </span>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center gap-1.5 ml-1">
            <span 
              className={`w-2 h-2 rounded-full inline-block ${
                systemStatus === 'LIVE' ? 'bg-emerald-400 animate-ping' :
                systemStatus === 'CACHE' || systemStatus === 'STALE' ? 'bg-amber-400' :
                'bg-red-400'
              }`} 
              title={`Telemetry status: ${systemStatus}`} 
            />
            <span className={`text-[0.62rem] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider font-bold ${
              systemStatus === 'LIVE' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
              systemStatus === 'CACHE' || systemStatus === 'STALE' ? 'border-amber-500/40 text-amber-300 bg-amber-500/10' :
              'border-red-500/40 text-red-400 bg-red-500/10'
            }`}>
              {systemStatus}
            </span>
          </div>

          {/* Active Film Fast-Switch Dropdown */}
          <div className="relative ml-2">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0b1222] hover:bg-[#111a30] border border-white/[0.08] hover:border-cyan-500/40 text-xs transition-all shadow-sm group cursor-pointer"
              title="Select active film for twin diagnosis"
            >
              <Film className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-105 transition-transform shrink-0" />
              
              <div className="flex items-center gap-1.5 truncate text-left">
                <span className="font-bold text-white max-w-[110px] sm:max-w-[150px] truncate tracking-tight">
                  {activeTitle}
                </span>
                <span className="text-[0.6rem] font-mono px-1.5 py-0.2 rounded bg-white/5 text-cyan-300 border border-white/5 shrink-0 hidden sm:inline">
                  D{activeDay}
                </span>
                <span className={`text-[0.6rem] font-mono font-bold shrink-0 hidden md:inline ${
                  activeWOM >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {activeWOM >= 0 ? '+' : ''}{activeWOM}%
                </span>
              </div>

              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 max-h-96 overflow-hidden rounded-xl bg-[#090e1b] border border-white/[0.12] shadow-2xl shadow-cyan-950/80 p-2 z-50 animate-fade-in backdrop-blur-2xl flex flex-col">
                
                {/* Search Filter Inside Dropdown */}
                <div className="relative mb-2">
                  <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={filmSearchQuery}
                    onChange={(e) => setFilmSearchQuery(e.target.value)}
                    placeholder="Search 19 active titles..."
                    className="w-full bg-[#0d1424] border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                    autoFocus
                  />
                </div>

                <div className="px-2 py-1 text-[0.62rem] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-white/[0.06] pb-1.5 mb-1">
                  <span>15-Day Theatrical Releases</span>
                  <span className="text-cyan-400 font-bold">{filteredDropdownFilms.length} Titles</span>
                </div>

                <div className="overflow-y-auto max-h-64 space-y-1 pr-1">
                  {filteredDropdownFilms.map((m) => {
                    const title = typeof m === 'string' ? m : m.title;
                    const isSelected = activeTitle.toLowerCase() === title.toLowerCase();
                    const industry = typeof m === 'object' ? m.industry : null;
                    const day = typeof m === 'object' ? m.daysInTheaters : 1;
                    const wom = typeof m === 'object' ? m.netSentiment : 0;

                    return (
                      <button
                        key={title}
                        type="button"
                        onClick={() => {
                          onSearch(title);
                          setDropdownOpen(false);
                          setFilmSearchQuery('');
                        }}
                        className={`w-full px-2.5 py-1.5 text-left rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected 
                            ? 'bg-cyan-950/80 text-cyan-200 font-bold border border-cyan-500/40 shadow-sm' 
                            : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate pr-2">
                          {isSelected ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                          ) : (
                            <span className="text-[0.6rem] font-mono text-slate-500 shrink-0">D{day}</span>
                          )}
                          <span className="truncate">{title}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          {industry && (
                            <span className="text-[0.58rem] font-mono text-slate-400 bg-white/5 px-1.5 py-0.2 rounded">
                              {industry}
                            </span>
                          )}
                          <span className={`text-[0.62rem] font-mono font-bold ${
                            wom >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {wom >= 0 ? '+' : ''}{wom}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            )}
          </div>

        </div>

        {/* 2. Center Segmented Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#090d18] p-1 rounded-xl border border-white/[0.08] shadow-inner shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-900/70 to-blue-900/70 text-white border border-cyan-500/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className={`text-[0.6rem] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/5 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Right Command Tools: ⌘K Palette + IST Clock + Sync + Studio Auth */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Universal Command Palette Trigger (⌘K) */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0b101e] hover:bg-[#11192e] border border-white/[0.08] hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all shadow-sm group cursor-pointer"
            title="Open Universal Command Palette (⌘K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[0.68rem] text-slate-400 font-sans hidden sm:inline">Search...</span>
            <span className="text-[0.6rem] font-mono text-slate-500 bg-white/5 px-1.5 py-0.2 rounded border border-white/5 flex items-center gap-0.5">
              <span>⌘</span>K
            </span>
          </button>

          {/* IST Live Clock Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0a0f1d] border border-amber-500/25 px-2.5 py-1.5 rounded-lg text-xs font-mono shadow-sm shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[0.6rem] text-slate-400 uppercase font-semibold">IST</span>
            <span className="text-amber-300 font-bold text-xs tracking-wide">
              {istTimeStr ? (istTimeStr.includes(',') ? istTimeStr.split(', ')[1] : istTimeStr) : 'Syncing...'}
            </span>
          </div>

          {/* Force Telemetry Sync Trigger */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-300 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
            title="Sweep Indian trade feeds & sensors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Studio User & Authentication Clearance Button */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-[#0b1325] hover:bg-[#101b33] border border-cyan-500/30 hover:border-cyan-400 text-xs transition-all shadow-sm cursor-pointer group"
            title="Studio Identity & Security Clearance"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[0.65rem] font-bold font-mono shadow-sm">
              {user ? (user.avatar || 'VR') : <User className="w-3 h-3" />}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-[0.68rem] font-bold text-white block leading-tight truncate max-w-[90px]">
                {user ? user.role : 'Guest Mode'}
              </span>
              <span className="text-[0.58rem] font-mono text-cyan-400 block leading-none">
                {isAuthenticated ? 'Tier 1' : 'Sign In'}
              </span>
            </div>
          </button>

        </div>

      </div>

      {/* Mobile Secondary Tab Ribbon */}
      <div className="lg:hidden border-t border-white/[0.05] bg-[#070b14] px-2 py-1 flex items-center justify-between overflow-x-auto no-scrollbar gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[0.7rem] font-mono whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                isActive ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

    </header>
  );
}
