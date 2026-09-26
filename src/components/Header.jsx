import React, { useState, useEffect } from 'react';
import { fetchISTTime } from '../api';
import { 
  Radar, 
  ShieldAlert, 
  Swords, 
  GitFork, 
  Radio, 
  Search, 
  RefreshCw, 
  Clock, 
  Activity, 
  Sparkles,
  ChevronDown,
  Film,
  Briefcase
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  onSelectTab, 
  currentQuery, 
  onSearch, 
  loading, 
  freshnessMap, 
  decisionIntelligence,
  onOpenFreshnessModal,
  discoveredMovies = [],
  isSyncing = false,
  syncCountdown = 30,
  autoSyncEnabled = true,
  onToggleAutoSync,
  onManualSync,
  systemStatus = 'LIVE'
}) {
  const [inputVal, setInputVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [istTimeStr, setIstTimeStr] = useState('');
  const [lastDateIST, setLastDateIST] = useState('');
  const [istWindowInfo, setIstWindowInfo] = useState(null);

  // Sync with server IST time & window definition
  const fetchServerIST = async () => {
    try {
      const data = await fetchISTTime();
      setIstWindowInfo(data);
    } catch (e) {
      // non-blocking
    }
  };

  useEffect(() => {
    fetchServerIST();
  }, []);

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

      // Detect midnight date rollover in Indian Standard Time (IST)
      const dateOnly = new Intl.DateTimeFormat('en-IN', { 
        timeZone: 'Asia/Kolkata', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).format(now);

      if (lastDateIST && lastDateIST !== dateOnly) {
        console.log(`[CDC IST Engine] Date rollover in IST from ${lastDateIST} to ${dateOnly}. Recalculating rolling 15-day theatrical window...`);
        fetchServerIST();
        if (onManualSync) onManualSync();
      }
      setLastDateIST(dateOnly);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastDateIST, onManualSync]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

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

  return (
    <header className="border-b border-white/[0.08] bg-[#070b14]/95 backdrop-blur-xl sticky top-0 z-50 shadow-xl shadow-black/50">
      
      {/* Unified Executive Command Bar */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* 1. Left Branding */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 via-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/50">
            <ShieldAlert className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm tracking-wider text-white flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">CDC</span>
              <span className="text-slate-600 font-light">//</span>
            </span>
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
          </div>

          {/* Active Film Quick Switcher */}
          {discoveredMovies && discoveredMovies.length > 0 && (
            <div className="relative ml-1 sm:ml-3">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-lg bg-[#0b1222] hover:bg-[#111a30] border border-white/[0.08] hover:border-cyan-500/40 text-xs transition-all shadow-sm group"
                title="Select active film"
              >
                <Film className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-[0.65rem] font-mono uppercase hidden lg:inline">Film:</span>
                <span className="font-bold text-white max-w-[100px] sm:max-w-[140px] truncate">
                  {currentQuery || (discoveredMovies[0]?.title || discoveredMovies[0])}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-64 max-h-80 overflow-y-auto bg-[#0a0f1d] border border-white/10 rounded-xl shadow-2xl p-1 z-50 animate-fade-in backdrop-blur-2xl divide-y divide-white/[0.04]">
                  <div className="px-2.5 py-1.5 text-[0.62rem] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>15-Day Active Theaters</span>
                    <span className="text-cyan-400 font-bold">{discoveredMovies.length} Titles</span>
                  </div>
                  <div className="py-1">
                    {discoveredMovies.map((m) => {
                      const title = typeof m === 'string' ? m : m.title;
                      const isSelected = (currentQuery || '').toLowerCase() === title.toLowerCase();
                      const industry = typeof m === 'object' ? m.industry : null;

                      return (
                        <button
                          key={title}
                          type="button"
                          onClick={() => {
                            onSearch(title);
                            setDropdownOpen(false);
                          }}
                          className={`w-full px-2.5 py-1.5 text-left rounded-lg text-xs flex items-center justify-between transition-colors ${
                            isSelected 
                              ? 'bg-cyan-950/70 text-cyan-200 font-bold border border-cyan-500/30' 
                              : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate pr-2">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse" />}
                            <span className="truncate">{title}</span>
                          </div>
                          {industry && (
                            <span className="text-[0.6rem] font-mono text-slate-500 shrink-0">
                              {industry}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Center Segmented Navigation Tabs (Single-Line, Whitespace-Nowrap) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0b101d] p-1 rounded-xl border border-white/[0.08] shadow-inner shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-900/70 to-blue-900/70 text-white border border-cyan-500/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{tab.name}</span>
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

        {/* 3. Right Command Tools: Search + IST Clock & Sync */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Quick Search Input */}
          <form onSubmit={handleSubmit} className="relative hidden xl:flex items-center">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search active film..."
              className="w-44 bg-[#0c1220] border border-white/10 focus:border-cyan-500 rounded-lg pl-7 pr-8 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1 px-1.5 py-0.5 bg-white/10 hover:bg-cyan-600 text-white text-[0.62rem] font-bold rounded font-mono transition-colors"
            >
              ↵
            </button>
          </form>

          {/* Clean Horizontal IST Telemetry Pill */}
          <div className="flex items-center gap-2 bg-[#0a101d] border border-amber-500/25 px-2.5 py-1.5 rounded-lg text-xs font-mono shadow-sm shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="text-[0.6rem] text-slate-400 uppercase font-semibold">IST</span>
              <span className="text-amber-300 font-bold text-xs tracking-wide">
                {istTimeStr ? (istTimeStr.includes(',') ? istTimeStr.split(', ')[1] : istTimeStr) : 'Syncing...'}
              </span>
            </div>
          </div>

          {/* Sync Trigger */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-300 transition-colors disabled:opacity-50 shrink-0"
            title="Trigger instant sensor sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

        </div>

      </div>

      {/* Mobile Tab Bar (visible only on small screens) */}
      <div className="md:hidden border-t border-white/[0.05] bg-[#070b14] px-2 py-1 flex items-center justify-between overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[0.7rem] font-mono whitespace-nowrap flex items-center gap-1 ${
                isActive ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
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
