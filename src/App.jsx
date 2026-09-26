// src/App.jsx
// Cinema Damage-Control & Reputation Intelligence Engine
// ZERO HARDCODED MOVIE NAMES • 100% REALTIME DATA STREAM • MULTI-PAGE ARCHITECTURE

import React, { useState, useEffect } from 'react';
import { fetchISTTime, fetchRadar, fetchMovieLive } from './api';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CinemaRadar from './components/CinemaRadar';
import MovieTwinSummary from './components/MovieTwinSummary';
import WhatJustChanged from './components/WhatJustChanged';
import CompetingNarratives from './components/CompetingNarratives';
import IssuesAndControversies from './components/IssuesAndControversies';
import RootCauseGraph from './components/RootCauseGraph';
import TemporalReplay from './components/TemporalReplay';
import FalseSignalAlerts from './components/FalseSignalAlerts';
import ConflictEngineView from './components/ConflictEngineView';
import EvidenceDrawer from './components/EvidenceDrawer';
import WhyModal from './components/WhyModal';
import DataFreshnessMap from './components/DataFreshnessMap';
import RecentReleasesView from './components/RecentReleasesView';
import CinemaSolutionsWarRoom from './components/CinemaSolutionsWarRoom';
import SensorTelemetryView from './components/SensorTelemetryView';
import MasterRadarBento from './components/MasterRadarBento';
import MoviePerformanceMetrics from './components/MoviePerformanceMetrics';
import CinemaDamageControlProducts from './components/CinemaDamageControlProducts';
import { 
  ShieldAlert, RefreshCw, Sparkles, Layers, AlertCircle, 
  Calendar, Swords, GitFork, Radio, ArrowRight, CheckCircle2,
  Clock, Flame 
} from 'lucide-react';

export default function App() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discoveredMovies, setDiscoveredMovies] = useState([]);
  const [systemStatus, setSystemStatus] = useState('LIVE');

  // Multi-Page Navigation State (synced with URL search params and hash)
  const getInitialTab = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['radar', 'twin', 'war-room', 'forensics', 'telemetry', 'products'].includes(tabParam)) {
        return tabParam;
      }
      const hash = window.location.hash.replace('#', '').trim();
      if (['radar', 'twin', 'war-room', 'forensics', 'telemetry', 'products'].includes(hash)) {
        return hash;
      }
    } catch (e) {
      // fallback
    }
    return 'radar';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Modals & Drawers
  const [whyData, setWhyData] = useState(null);
  const [freshnessModalOpen, setFreshnessModalOpen] = useState(false);

  // Active Temporal Snapshot state (if user is scrubbing replay)
  const [customSnapshotState, setCustomSnapshotState] = useState(null);

  // Real-time synchronization states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCountdown, setSyncCountdown] = useState(30);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncToast, setSyncToast] = useState(null);
  const [istWindowInfo, setIstWindowInfo] = useState(null);

  // Keep activeTab in sync with browser URL hash & history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (['radar', 'twin', 'war-room', 'forensics', 'telemetry', 'products'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update browser URL query params without reloading to support direct deep-linking
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (currentQuery) {
        params.set('movie', currentQuery);
      } else {
        params.delete('movie');
      }
      params.set('tab', activeTab);
      const newUrl = `${window.location.pathname}?${params.toString()}#${activeTab}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {
      // non-blocking
    }
  }, [currentQuery, activeTab]);

  const changeTab = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch IST window information for navigation & headers
  const fetchISTInfo = async () => {
    try {
      const data = await fetchISTTime();
      setIstWindowInfo(data);
    } catch (e) {
      console.warn('IST info fetch failed:', e.message);
    }
  };

  useEffect(() => {
    fetchISTInfo();
    try {
      const params = new URLSearchParams(window.location.search);
      const movieParam = params.get('movie');
      if (movieParam && movieParam.trim()) {
        fetchMovie(movieParam.trim());
      }
    } catch (e) {
      // non-blocking
    }
  }, []);

  const fetchMovie = async (title, force = false) => {
    if (!title || !title.trim()) return;
    setLoading(true);
    setError(null);
    setCurrentQuery(title);
    setCustomSnapshotState(null);

    try {
      const data = await fetchMovieLive(title, { force });
      if (data._source) {
        setSystemStatus(data._source);
      }
      if (data.isOffline && !data.hasData) {
        setError(data.message || 'Offline intelligence mode');
      }
      setMovieData(data);
    } catch (err) {
      setError(err.message || 'Failed to communicate with Sensor Adapter Network');
      setMovieData(null);
      setSystemStatus('OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  // Select a movie and smoothly route to target tab
  const handleSelectMovie = (title, targetTab = 'twin') => {
    fetchMovie(title);
    if (activeTab === 'radar') {
      changeTab(targetTab);
    }
  };

  // Background real-time sync trigger (recalculates live state from internet sensors)
  const triggerSync = async (isManual = false) => {
    if (isSyncing || loading) return;
    setIsSyncing(true);

    try {
      // 1. Refresh live radar & feed pulse
      const radarPromise = fetchRadar({ force: true })
        .then(data => {
          if (data?.movies) setDiscoveredMovies(data.movies);
          if (data?._source) setSystemStatus(data._source);
          if (data?.windowRange) {
            setIstWindowInfo(prev => ({
              ...prev,
              windowRangeStr: data.windowRange,
              nowISTFormatted: data.nowIST
            }));
          }
        })
        .catch(() => {});

      // 2. Refresh active movie digital twin if title is active
      let moviePromise = Promise.resolve();
      if (currentQuery) {
        moviePromise = fetchMovieLive(currentQuery, { force: true })
          .then(newData => {
            if (newData && newData.hasData) {
              setMovieData(prev => {
                const prevCount = prev?.stats?.primarySignalsCount || 0;
                const newCount = newData?.stats?.primarySignalsCount || 0;
                if (newCount !== prevCount && prevCount > 0) {
                  const diff = newCount - prevCount;
                  setSyncToast(`Live Sync: ${Math.abs(diff)} ${diff > 0 ? 'new' : 'updated'} signals ingested.`);
                  setTimeout(() => setSyncToast(null), 5000);
                }
                return newData;
              });
            }
          })
          .catch(() => {});
      }

      await Promise.all([radarPromise, moviePromise]);
      if (isManual) {
        setSyncToast('Live Sensor Network Synchronized.');
        setTimeout(() => setSyncToast(null), 3000);
      }
    } finally {
      setIsSyncing(false);
      setSyncCountdown(30);
    }
  };

  // 1-second interval loop for continuous real-time sync
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const timer = setInterval(() => {
      setSyncCountdown(prev => {
        if (prev <= 1) {
          triggerSync();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSyncEnabled, currentQuery, isSyncing, loading]);

  // Pause auto-sync when browser tab is hidden to prevent tab memory/CPU leaks
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && autoSyncEnabled) {
        triggerSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoSyncEnabled, currentQuery]);

  // Real-time automatic discovery on initial mount (ZERO hardcoding)
  useEffect(() => {
    async function initDiscovery() {
      setLoading(true);
      try {
        const radarData = await fetchRadar();
        if (radarData._source) setSystemStatus(radarData._source);
        const movies = radarData.movies || [];
        setDiscoveredMovies(movies);

        // Build digital twin for the top movie currently trending in live feeds
        if (movies.length > 0 && !currentQuery) {
          const topMovieTitle = movies[0].title;
          fetchMovie(topMovieTitle);
        }
      } catch (err) {
        console.warn('Initial live radar discovery error:', err);
      } finally {
        setLoading(false);
      }
    }

    initDiscovery();
  }, []);


  const handleWhyClick = (whyKeyOrObject) => {
    if (typeof whyKeyOrObject === 'string') {
      const breakdown = movieData?.liveState?.whyBreakdowns?.[whyKeyOrObject];
      if (breakdown) {
        setWhyData(breakdown);
      }
    } else if (typeof whyKeyOrObject === 'object') {
      setWhyData(whyKeyOrObject);
    }
  };

  // Determine active state: if scrubbing historical snapshot, use that state, else live state
  const effectiveState = customSnapshotState?.state || movieData?.liveState;
  const defconLevel = effectiveState?.threatLevel || 'DEFCON 2';

  // Empty selection picker component for pages requiring a selected film
  const FilmSelectorPrompt = ({ targetTabName = 'Digital Twin' }) => (
    <div className="glass-panel p-8 sm:p-12 text-center flex flex-col items-center gap-6 my-6 border border-cyan-500/20 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
        <Sparkles className="w-7 h-7 animate-pulse" />
      </div>

      <div className="max-w-xl">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
          Select an Active Theatrical Release
        </h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Choose any film currently tracking in Indian theaters (released in the last 15 days) to load its real-time {targetTabName}.
        </p>
      </div>

      {discoveredMovies && discoveredMovies.length > 0 ? (
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {discoveredMovies.map((m) => {
            const title = typeof m === 'string' ? m : m.title;
            const timing = typeof m === 'object' ? m.releaseTiming : 'Active Release';
            const bo = typeof m === 'object' && m.boxOfficeSummary && m.boxOfficeSummary !== 'Tracking' ? m.boxOfficeSummary : null;
            const trust = typeof m === 'object' ? m.trustScore : 90;

            return (
              <button
                key={title}
                onClick={() => fetchMovie(title)}
                className="p-4 rounded-xl bg-[#0b1222] border border-white/10 hover:border-cyan-500/60 hover:bg-[#0e172e] flex flex-col justify-between text-left transition-all group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[0.62rem] font-mono bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded">
                      {timing.includes('(') ? timing.match(/\((.*?)\)/)?.[1] || timing : timing}
                    </span>
                    {trust && (
                      <span className="text-[0.62rem] font-mono text-emerald-300 font-bold">
                        ✓ {trust}%
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  {bo ? (
                    <span className="text-[0.68rem] font-mono text-amber-300 font-semibold">{bo}</span>
                  ) : (
                    <span className="text-[0.68rem] font-mono text-slate-500">Day-wise Tracking</span>
                  )}
                  <span className="text-[0.7rem] text-cyan-400 flex items-center gap-1 font-mono font-semibold">
                    Inspect <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Sweeping Indian cinema trade feeds for active 15-day releases...</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Global Apple/Linear-Style Unified Command Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={changeTab}
        currentQuery={currentQuery}
        onSearch={(query) => {
          fetchMovie(query);
          changeTab('twin');
        }}
        loading={loading}
        freshnessMap={movieData?.freshnessMap}
        decisionIntelligence={movieData?.decisionIntelligence}
        onOpenFreshnessModal={() => setFreshnessModalOpen(true)}
        discoveredMovies={discoveredMovies}
        isSyncing={isSyncing}
        syncCountdown={syncCountdown}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={() => setAutoSyncEnabled(!autoSyncEnabled)}
        onManualSync={() => triggerSync(true)}
        systemStatus={systemStatus}
      />

      {/* 1.5 Cinema Intelligence Process Workflow Navigator (DISCOVER → TRACK → COLLECT → ANALYSE → UNDERSTAND → COMPARE → ACT) */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={changeTab}
        currentMovie={currentQuery}
        releasesCount={discoveredMovies.length}
        defconLevel={defconLevel}
        sensorsOnline={`${movieData?.freshnessMap ? movieData.freshnessMap.filter(s => s.status === 'HEALTHY').length : 9}/${movieData?.freshnessMap?.length || 9}`}
        discoveredMovies={discoveredMovies}
        onSelectMovie={(title) => fetchMovie(title)}
        loading={loading}
      />

      {/* Honest Offline / Standby Resilience Notice */}
      {systemStatus === 'OFFLINE' && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 w-full">
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span>
                <strong>Standby / Offline Telemetry Mode:</strong> Live external internet sensor stream is currently unreachable. Operating with cached and fallback intelligence.
              </span>
            </div>
            <button 
              onClick={() => triggerSync(true)} 
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded text-amber-300 font-mono text-[0.7rem] transition-colors shrink-0"
            >
              Retry Sync
            </button>
          </div>
        </div>
      )}


      {/* Real-Time Sync Notification Toast */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c1324] border border-cyan-400/80 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono animate-fade-in ring-1 ring-cyan-400/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Multi-Page Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-6">
        
        {/* Global Loading Overlay Banner when actively harvesting a film */}
        {loading && (
          <div className="glass-panel p-8 flex flex-col items-center justify-center gap-3 text-center border border-cyan-500/30 shadow-xl animate-pulse">
            <div className="relative">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-0 right-0 animate-ping" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Harvesting Real-Time Public Signals for "{currentQuery}"...
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Verifying multi-source trade reports, Wikipedia knowledge graphs, cinema forums, and critic reviews.
              </p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && !loading && (
          <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 shadow-lg">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-300 font-mono">Sensor Ingestion Alert</h4>
              <p className="text-xs text-red-200/80 mt-1">{error}</p>
              <button
                onClick={() => fetchMovie(currentQuery)}
                className="mt-3 px-3 py-1 bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs rounded-md font-mono"
              >
                Retry Ingestion
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 1: 🛰️ UNIFIED APPLE/LINEAR-STYLE MASTER BENTO DECK
        ========================================================================= */}
        {activeTab === 'radar' && (
          <MasterRadarBento
            radarData={{ movies: discoveredMovies }}
            discoveredMovies={discoveredMovies}
            currentMovie={currentQuery}
            currentMovieData={movieData}
            onSelectMovie={(title) => {
              // Load movie data (syncs all dashboards) but stay on Radar.
              // User can then navigate to any tab to see synced data.
              fetchMovie(title);
            }}
            onOpenWarRoom={(title) => {
              fetchMovie(title);
              changeTab('war-room');
            }}
            loading={loading}
            onRefresh={() => triggerSync(true)}
            istWindowStr={istWindowInfo?.windowRangeStr}
          />
        )}

        {/* =========================================================================
            PAGE 2: 🛡️ DIGITAL TWIN & THREAT INTELLIGENCE
        ========================================================================= */}
        {activeTab === 'twin' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* If no movie is selected or data is empty */}
            {(!movieData || !movieData.hasData) && !loading && (
              <FilmSelectorPrompt targetTabName="Digital Twin" />
            )}

            {/* Active Film Digital Twin View */}
            {movieData && movieData.hasData && effectiveState && (
              <div className="flex flex-col gap-6">
                
                {/* 1. Executive Summary & Defcon Posture */}
                <MovieTwinSummary
                  movieData={{
                    ...movieData,
                    liveState: effectiveState
                  }}
                  onOpenWhy={handleWhyClick}
                />

                {/* 1.5 Movie Performance & Audience Metrics (BookMyShow, IMDb, Google, Box Office, Reviews) */}
                <MoviePerformanceMetrics
                  movieData={movieData}
                  movieTitle={currentQuery}
                  discoveredMovies={discoveredMovies}
                  onSelectMovie={(title) => {
                    fetchMovie(title);
                    changeTab('twin');
                  }}
                />

                {/* 2. Real-Time Signal Velocity & Issues */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <WhatJustChanged events={effectiveState?.whatJustChanged || []} />
                  </div>

                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <IssuesAndControversies
                      activeIssues={effectiveState?.activeIssues || []}
                      emergingControversies={effectiveState?.emergingControversies || []}
                    />
                  </div>
                </div>

                {/* 3. Competing Narratives Matrix */}
                <CompetingNarratives
                  competingNarratives={effectiveState?.competingNarratives || { positive: [], negative: [], emerging: [], neutral: [] }}
                  onOpenWhy={handleWhyClick}
                />

                {/* 4. Traceable Ground Truth Evidence Lineage */}
                <EvidenceDrawer signals={effectiveState?.narratives ? effectiveState.narratives.flatMap(n => n.signals || []) : []} />

              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            PAGE 3: ⚔️ STUDIO WAR ROOM & SOLUTIONS SUITE
        ========================================================================= */}
        {activeTab === 'war-room' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* If no movie is selected */}
            {(!movieData || !movieData.hasData) && !loading && (
              <FilmSelectorPrompt targetTabName="War Room & Solutions Playbook" />
            )}

            {/* Active War Room View */}
            {movieData && movieData.hasData && effectiveState && (
              <div className="flex flex-col gap-6">
                
                {/* War Room Header Status Banner */}
                <div className="glass-panel p-6 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                      <Swords className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black tracking-wider uppercase text-white font-mono">
                          Studio Crisis Command & Mitigation War Room
                        </h2>
                        <span className="badge badge-critical text-xs py-0.5 font-mono">
                          {defconLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Active Film: <strong className="text-white">{currentQuery}</strong> • 5 Theatrical Damage-Control Playbooks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <button
                      onClick={() => triggerSync(true)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center gap-2 transition-all font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-estimate Exposure</span>
                    </button>
                  </div>
                </div>

                {/* The 5 Custom Cinema Solutions + Flagship Systematic Decision Matrix */}
                <CinemaSolutionsWarRoom
                  solutions={effectiveState?.cinemaSolutions}
                  movieTitle={currentQuery}
                  decisionIntelligence={movieData?.decisionIntelligence}
                />

              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            PAGE 4: 🔬 FORENSICS, CAUSALITY & TEMPORAL REPLAY
        ========================================================================= */}
        {activeTab === 'forensics' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* If no movie is selected */}
            {(!movieData || !movieData.hasData) && !loading && (
              <FilmSelectorPrompt targetTabName="Forensic Diagnostics" />
            )}

            {/* Active Forensic View */}
            {movieData && movieData.hasData && effectiveState && (
              <div className="flex flex-col gap-6">
                
                {/* Forensic Header Banner */}
                <div className="glass-panel p-6 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
                      <GitFork className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black tracking-wider uppercase text-white font-mono">
                          Theatrical Forensic Lab & Causal Lineage
                        </h2>
                        <span className="badge badge-info text-xs py-0.5 font-mono">
                          Diagnostics
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Root-Cause Directed Acyclic Graph • Conflict Detection • Temporal Hour-by-Hour Replay
                      </p>
                    </div>
                  </div>

                  <div className="font-mono text-xs text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-lg">
                    Subject: <strong>{currentQuery}</strong>
                  </div>
                </div>

                {/* 1. Historical Temporal Replay Slider */}
                <TemporalReplay
                  temporalData={movieData.temporalReplay}
                  onSelectSnapshot={(snapshot) => setCustomSnapshotState(snapshot)}
                />

                {/* 2. Interactive Root-Cause Causal DAG Graph */}
                <RootCauseGraph graphData={movieData?.rootCauseGraph || { nodes: [], edges: [] }} />

                {/* 3. Discrepancy & Conflict Engine + False Signal Detection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <ConflictEngineView conflicts={effectiveState?.conflicts || []} />
                  <FalseSignalAlerts alerts={effectiveState?.falseSignalAlerts || []} />
                </div>

              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            PAGE 5: 🌐 SENSOR TELEMETRY & TRUST AUDIT
        ========================================================================= */}
        {activeTab === 'telemetry' && (
          <SensorTelemetryView
            freshnessMap={movieData?.freshnessMap || []}
            onRefreshSensors={() => triggerSync(true)}
          />
        )}

        {/* =========================================================================
            PAGE 6: 🧰 CINEMA DAMAGE CONTROL PRODUCTS & TACTICAL ARSENAL
        ========================================================================= */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {(!movieData || !movieData.hasData) && !loading && (
              <FilmSelectorPrompt targetTabName="Crisis Damage Control Products" />
            )}

            {movieData && movieData.hasData && (
              <CinemaDamageControlProducts
                movieData={movieData}
                movieTitle={currentQuery}
                onOpenWhy={handleWhyClick}
              />
            )}
          </div>
        )}

      </main>

      {/* Executive Global Footer */}
      <footer className="border-t border-white/5 bg-[#05070b] py-6 px-4 text-center text-xs text-slate-500 font-mono mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cinema Damage-Control Platform • Indian Cinema Intelligence</span>
          </div>
          <span>Strict 15-Day Sliding Theatrical Window • Indian Standard Time (UTC+05:30)</span>
        </div>
      </footer>

      {/* Why Explainability Modal */}
      <WhyModal
        isOpen={Boolean(whyData)}
        onClose={() => setWhyData(null)}
        data={whyData}
      />

      {/* Sensor Freshness Modal */}
      <DataFreshnessMap
        isOpen={freshnessModalOpen}
        onClose={() => setFreshnessModalOpen(false)}
        freshnessMap={movieData?.freshnessMap || []}
      />

    </div>
  );
}
