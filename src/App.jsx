// src/App.jsx
// CDC SIGNAL v2 — redesigned product experience.
// Same live data + sensor contracts as v1; entirely new IA, navigation,
// visual system and states. Auth is additive (see src/auth.jsx).

import React, { useEffect, useMemo, useState } from 'react';
import { fetchISTTime, fetchRadar, fetchMovieLive } from './api';
import { AuthProvider, useAuth } from './auth';
import Login from './components/Login';
import Shell from './components/Shell';
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
import CinemaSolutionsWarRoom from './components/CinemaSolutionsWarRoom';
import SensorTelemetryView from './components/SensorTelemetryView';
import MoviePerformanceMetrics from './components/MoviePerformanceMetrics';
import CinemaDamageControlProducts from './components/CinemaDamageControlProducts';
import {
  AlertTriangle, ArrowRight, Clapperboard, Film, Loader2,
  RefreshCw, SearchX, ShieldAlert, WifiOff,
} from 'lucide-react';

// ── IA: old deep-links keep working (radar/twin/war-room/forensics/…) ──
const TAB_ALIASES = {
  radar: 'overview', overview: 'overview',
  twin: 'film', film: 'film',
  'war-room': 'response', response: 'response', products: 'response',
  forensics: 'evidence', evidence: 'evidence',
  telemetry: 'system', system: 'system', sensors: 'system',
};
const VALID_TABS = ['overview', 'film', 'response', 'evidence', 'system'];

function getInitialMovie() {
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ['movie', 'title', 'query', 'q', 'film']) {
      const v = (params.get(key) || '').trim();
      if (v) return v;
    }
  } catch { /* default below */ }
  return '';
}

function getInitialTab() {
  try {
    const hash = window.location.hash.replace('#', '').split('?')[0].trim().toLowerCase();
    if (hash && TAB_ALIASES[hash]) return TAB_ALIASES[hash];
    const params = new URLSearchParams(window.location.search);
    for (const key of ['tab', 'view', 'page']) {
      const v = (params.get(key) || '').toLowerCase();
      if (TAB_ALIASES[v]) return TAB_ALIASES[v];
    }
  } catch { /* default below */ }
  return 'overview';
}

function riskOf(m) {
  const t = (typeof m === 'object' ? m.threatLevel : '') || '';
  if (t === 'HIGH') return { label: 'High', cls: 'is-bad' };
  if (t === 'ELEVATED') return { label: 'Elevated', cls: 'is-warn' };
  return { label: 'Stable', cls: 'is-good' };
}

function EmptyFilmPrompt({ target, discoveredMovies, onPick }) {
  return (
    <div className="card card-pad state-block">
      <span className="state-icon" aria-hidden="true"><Clapperboard /></span>
      <h3>Select a film to load {target}</h3>
      <p>Choose any release currently tracking in the 15-day window. Every section stays in sync with the active film.</p>
      {discoveredMovies?.length > 0 ? (
        <div className="filter-row" style={{ justifyContent: 'center' }}>
          {discoveredMovies.slice(0, 6).map((m) => {
            const title = typeof m === 'string' ? m : m.title;
            return <button key={title} type="button" className="mini-btn" onClick={() => onPick(title)}>{title}</button>;
          })}
        </div>
      ) : (
        <p className="num" style={{ color: 'var(--ink-3)', fontSize: 13 }}><Loader2 className="spin" size={14} style={{ verticalAlign: -2 }} /> Sweeping trade feeds…</p>
      )}
    </div>
  );
}

function Workspace() {
  const { user } = useAuth();
  const [currentQuery, setCurrentQuery] = useState(getInitialMovie);
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discoveredMovies, setDiscoveredMovies] = useState([]);
  const [systemStatus, setSystemStatus] = useState('LIVE');
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [whyData, setWhyData] = useState(null);
  const [freshnessOpen, setFreshnessOpen] = useState(false);
  const [customSnapshot, setCustomSnapshot] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCountdown, setSyncCountdown] = useState(30);
  const [autoSync, setAutoSync] = useState(true);
  const [toast, setToast] = useState(null);
  const [istInfo, setIstInfo] = useState(null);
  const [istClock, setIstClock] = useState('');
  const [industry, setIndustry] = useState('ALL');
  const [responseView, setResponseView] = useState('playbooks');
  const isInitialMount = React.useRef(true);

  // ── URL sync (new ids; old ids still resolve on load) ──
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '').split('?')[0].trim().toLowerCase();
      if (TAB_ALIASES[h]) setActiveTab(TAB_ALIASES[h]);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      const params = new URLSearchParams(window.location.search);
      if (currentQuery) params.set('movie', currentQuery); else params.delete('movie');
      params.set('tab', activeTab);
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}#${activeTab}`);
    } catch { /* non-blocking */ }
  }, [currentQuery, activeTab]);

  const changeTab = (id) => {
    const next = TAB_ALIASES[id] || 'overview';
    setActiveTab(next);
    try { window.location.hash = next; } catch { /* noop */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── IST clock & initial movie load ──
  useEffect(() => {
    fetchISTTime().then(setIstInfo).catch(() => {});
    const initialMovie = getInitialMovie();
    if (initialMovie) {
      fetchMovie(initialMovie);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = () => {
      try {
        setIstClock(new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        }).format(new Date()));
      } catch { /* noop */ }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // ── Data layer (unchanged contracts) ──
  const fetchMovie = async (title, force = false) => {
    if (!title?.trim()) return;
    setLoading(true); setError(null);
    setCurrentQuery(title); setCustomSnapshot(null);
    try {
      const data = await fetchMovieLive(title, { force });
      if (data._source) setSystemStatus(data._source);
      if (data.isOffline && !data.hasData) setError(data.message || 'Offline intelligence mode');
      setMovieData(data);
    } catch (err) {
      setError(err.message || 'Failed to communicate with Sensor Adapter Network');
      setMovieData(null); setSystemStatus('OFFLINE');
    } finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const triggerSync = async (manual = false) => {
    if (isSyncing || loading) return;
    setIsSyncing(true);
    try {
      await fetchRadar({ force: true }).then((data) => {
        if (data?.movies) setDiscoveredMovies(data.movies);
        if (data?._source) setSystemStatus(data._source);
        if (data?.windowRange) setIstInfo((p) => ({ ...p, windowRangeStr: data.windowRange, nowISTFormatted: data.nowIST }));
      }).catch(() => {});
      if (currentQuery) {
        await fetchMovieLive(currentQuery, { force: true }).then((next) => {
          if (next?.hasData) {
            setMovieData((prev) => {
              const a = prev?.stats?.primarySignalsCount || 0, b = next?.stats?.primarySignalsCount || 0;
              if (a > 0 && b !== a) showToast(`Live sync: ${Math.abs(b - a)} ${b > a ? 'new' : 'updated'} signals ingested.`);
              return next;
            });
          }
        }).catch(() => {});
      }
      if (manual) showToast('Sensor network synchronized.');
    } finally { setIsSyncing(false); setSyncCountdown(30); }
  };

  useEffect(() => {
    if (!autoSync) return;
    const timer = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) { triggerSync(); return 30; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSync, currentQuery, isSyncing, loading]);

  useEffect(() => {
    const onVis = () => { if (!document.hidden && autoSync) triggerSync(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSync, currentQuery]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const radar = await fetchRadar();
        if (radar._source) setSystemStatus(radar._source);
        setDiscoveredMovies(radar.movies || []);
        const initM = getInitialMovie();
        if (radar.movies?.length && !currentQuery && !initM) fetchMovie(radar.movies[0].title);
      } catch (e) { console.warn('Radar discovery error:', e); }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWhy = (keyOrObj) => {
    if (typeof keyOrObj === 'string') {
      const b = movieData?.liveState?.whyBreakdowns?.[keyOrObj];
      if (b) setWhyData(b);
    } else if (typeof keyOrObj === 'object') setWhyData(keyOrObj);
  };

  const effectiveState = customSnapshot?.state || movieData?.liveState;
  const industries = useMemo(() => {
    const set = new Set(discoveredMovies.map((m) => typeof m === 'object' && m.industry).filter(Boolean));
    return ['ALL', ...set];
  }, [discoveredMovies]);
  const visibleMovies = industry === 'ALL'
    ? discoveredMovies
    : discoveredMovies.filter((m) => typeof m === 'object' && m.industry === industry);

  const stats = useMemo(() => {
    const list = discoveredMovies.filter((m) => typeof m === 'object');
    return {
      tracked: discoveredMovies.length,
      crises: list.filter((m) => m.threatLevel === 'HIGH').length,
      favorable: list.filter((m) => (m.netSentiment ?? 0) > 20).length,
      signals: list.reduce((n, m) => n + (m.signalCount || 0), 0),
    };
  }, [discoveredMovies]);

  const ranked = useMemo(() => [...visibleMovies].sort((a, b) => {
    const order = { HIGH: 0, ELEVATED: 1 };
    const ra = order[a.threatLevel] ?? 2, rb = order[b.threatLevel] ?? 2;
    if (ra !== rb) return ra - rb;
    return (b.signalCount || 0) - (a.signalCount || 0);
  }), [visibleMovies]);

  const selectFilm = (title, tab = 'film') => { fetchMovie(title); if (activeTab === 'overview') changeTab(tab); };
  const istLabel = istClock ? `IST ${istClock}` : 'IST ···';

  return (
    <Shell
      activeTab={activeTab} onSelectTab={changeTab}
      currentQuery={currentQuery} discoveredMovies={discoveredMovies}
      onSearch={(t) => { fetchMovie(t); changeTab('film'); }}
      loading={loading} systemStatus={systemStatus}
      isSyncing={isSyncing} onManualSync={() => triggerSync(true)}
      istLabel={istLabel} toast={toast}
    >
      {systemStatus === 'OFFLINE' && (
        <div className="banner is-warn" role="alert">
          <WifiOff aria-hidden="true" />
          <p><strong>Standby telemetry.</strong> Live sensor stream unreachable — operating on cached intelligence.</p>
          <button type="button" className="mini-btn banner-act" onClick={() => triggerSync(true)}>Retry sync</button>
        </div>
      )}

      {error && !loading && (
        <div className="banner is-bad" role="alert">
          <ShieldAlert aria-hidden="true" />
          <p><strong>Sensor ingestion alert.</strong> {error}</p>
          <button type="button" className="mini-btn banner-act" onClick={() => fetchMovie(currentQuery)}>Retry</button>
        </div>
      )}

      {loading && !movieData && activeTab === 'overview' && (
        <div className="card card-pad" role="status" aria-label="Loading">
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="skeleton" style={{ height: 22, width: '40%' }} />
            <div className="skeleton" style={{ height: 14 }} />
            <div className="skeleton" style={{ height: 14, width: '75%' }} />
          </div>
        </div>
      )}

      {/* ═══ OVERVIEW ═══ */}
      {activeTab === 'overview' && (
        <>
          <section className="section" aria-label="Window summary">
            <div className="kpi-grid">
              <div className="kpi"><span className="k">Tracking</span><span className="v num">{stats.tracked}</span><span className="s">{istInfo?.windowRangeStr || istInfo?.displayLabel || '15-day IST window'}</span></div>
              <div className={`kpi ${stats.crises ? 'is-risk' : ''}`}><span className="k">Active crises</span><span className="v num">{stats.crises}</span><span className="s">High-threat releases</span></div>
              <div className="kpi is-good"><span className="k">Favorable WOM</span><span className="v num">{stats.favorable}</span><span className="s">Net sentiment above +20</span></div>
              <div className="kpi is-accent"><span className="k">Signals</span><span className="v num">{stats.signals}</span><span className="s">Verified across sensors</span></div>
            </div>
          </section>

          <section className="section" aria-label="Releases ranked by risk">
            <div className="section-head">
              <div><h2>Releases, ranked by risk</h2><p>High-threat films surface first. Select one to sync every section.</p></div>
              <div className="filter-row" role="group" aria-label="Filter by industry">
                {industries.map((ind) => (
                  <button key={ind} type="button" onClick={() => setIndustry(ind)}
                    className={`mini-btn ${industry === ind ? 'is-primary' : ''}`}
                    aria-pressed={industry === ind}>{ind === 'ALL' ? 'All industries' : ind}</button>
                ))}
              </div>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="film-table">
                  <thead><tr><th scope="col">Film</th><th scope="col">Risk</th><th scope="col">WOM</th><th scope="col">Box office</th><th scope="col">Day</th><th scope="col"><span className="num">Action</span></th></tr></thead>
                  <tbody>
                    {ranked.map((m) => {
                      const title = typeof m === 'string' ? m : m.title;
                      const wom = typeof m === 'object' ? (m.netSentiment ?? 0) : 0;
                      const risk = riskOf(m);
                      const selected = currentQuery?.toLowerCase() === title.toLowerCase();
                      return (
                        <tr key={title} onClick={() => selectFilm(title)} className={selected ? 'is-selected' : ''} tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectFilm(title); } }}
                          aria-label={`${title}, risk ${risk.label}`}>
                          <td><span className="film-title">{title}</span><br /><span className="film-sub">{m.industryLabel || m.industry || 'Indian cinema'} · {m.releaseTiming || ''}</span></td>
                          <td><span className={`pill ${risk.cls}`}>{risk.label}</span></td>
                          <td className={`num ${wom >= 0 ? 'pos' : 'neg'}`}>{wom > 0 ? '+' : ''}{wom}%</td>
                          <td className="num" style={{ fontSize: 12.5 }}>{m.boxOfficeSummary || 'Tracking'}</td>
                          <td className="num">{m.daysInTheaters ?? '–'}</td>
                          <td><span className="row-actions">
                            <button type="button" className="mini-btn" onClick={(e) => { e.stopPropagation(); selectFilm(title, 'film'); }}>Inspect <ArrowRight size={13} aria-hidden="true" /></button>
                            <button type="button" className="mini-btn" onClick={(e) => { e.stopPropagation(); fetchMovie(title); changeTab('response'); }}>War room</button>
                          </span></td>
                        </tr>
                      );
                    })}
                    {!ranked.length && (
                      <tr><td colSpan={6}><div className="state-block"><SearchX aria-hidden="true" /><p>No releases in this filter yet.</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="section" aria-label="Spatial radar">
            <div className="section-head">
              <div><h2>Spatial radar</h2><p>Sentiment vs. theatrical velocity for the full window.</p></div>
              <span className="meta">Same live engine · new frame</span>
            </div>
            <div className="legacy-wrap">
              <CinemaRadar
                currentMovie={currentQuery}
                onSelectMovie={(t) => fetchMovie(t)}
              />
            </div>
          </section>
        </>
      )}

      {/* ═══ FILM ═══ */}
      {activeTab === 'film' && (
        <>
          {loading && !movieData ? (
            <div className="card card-pad state-block">
              <Loader2 className="spin" size={24} style={{ color: 'var(--accent)' }} />
              <h3>Synthesizing Digital Twin for {currentQuery || 'film'}…</h3>
              <p>Reconciling Wikipedia canonical identities, multi-sensor sentiment vectors and trade velocity.</p>
            </div>
          ) : (!movieData?.hasData && !loading) ? (
            <EmptyFilmPrompt target="intelligence" discoveredMovies={discoveredMovies} onPick={(t) => fetchMovie(t)} />
          ) : movieData?.hasData && effectiveState ? (
            <>
              <MovieTwinSummary movieData={{ ...movieData, liveState: effectiveState }} onOpenWhy={handleWhy} />
              <div className="legacy-wrap">
                <MoviePerformanceMetrics movieData={movieData} movieTitle={currentQuery}
                  discoveredMovies={discoveredMovies} onSelectMovie={(t) => fetchMovie(t)} />
              </div>
              <div className="split">
                <WhatJustChanged events={effectiveState?.whatJustChanged || []} />
                <IssuesAndControversies activeIssues={effectiveState?.activeIssues || []} emergingControversies={effectiveState?.emergingControversies || []} />
              </div>
              <CompetingNarratives competingNarratives={effectiveState?.competingNarratives || { positive: [], negative: [], emerging: [], neutral: [] }} onOpenWhy={handleWhy} />
              <EvidenceDrawer signals={effectiveState?.narratives ? effectiveState.narratives.flatMap((n) => n.signals || []) : []} />
            </>
          ) : null}
        </>
      )}

      {/* ═══ RESPONSE ═══ */}
      {activeTab === 'response' && (
        <>
          {loading && !movieData ? (
            <div className="card card-pad state-block">
              <Loader2 className="spin" size={24} style={{ color: 'var(--accent)' }} />
              <h3>Assembling War Room for {currentQuery || 'film'}…</h3>
              <p>Synthesizing damage-control playbooks, box office hazard projections, and verified counter-measures.</p>
            </div>
          ) : (!movieData?.hasData && !loading) ? (
            <EmptyFilmPrompt target="response plan" discoveredMovies={discoveredMovies} onPick={(t) => fetchMovie(t)} />
          ) : movieData?.hasData && effectiveState ? (
            <>
              <section className="section" aria-label="Response views">
                <div className="filter-row" role="tablist" aria-label="Response views">
                  {[{ id: 'playbooks', label: 'Damage-control playbooks' }, { id: 'arsenal', label: 'Crisis arsenal' }].map((v) => (
                    <button key={v.id} type="button" role="tab" aria-selected={responseView === v.id}
                      className={`mini-btn ${responseView === v.id ? 'is-primary' : ''}`}
                      onClick={() => setResponseView(v.id)}>{v.label}</button>
                  ))}
                  <span className="meta" style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-4)' }}>
                    Subject: <strong style={{ color: 'var(--ink)' }}>{currentQuery}</strong>
                  </span>
                </div>
              </section>
              {responseView === 'playbooks' ? (
                <div className="legacy-wrap">
                  <CinemaSolutionsWarRoom solutions={effectiveState?.cinemaSolutions} movieTitle={currentQuery} decisionIntelligence={movieData?.decisionIntelligence} />
                </div>
              ) : (
                <div className="legacy-wrap">
                  <CinemaDamageControlProducts movieData={movieData} movieTitle={currentQuery} onOpenWhy={handleWhy} />
                </div>
              )}
            </>
          ) : null}
        </>
      )}

      {/* ═══ EVIDENCE ═══ */}
      {activeTab === 'evidence' && (
        <>
          {loading && !movieData ? (
            <div className="card card-pad state-block">
              <Loader2 className="spin" size={24} style={{ color: 'var(--accent)' }} />
              <h3>Ingesting Forensics & Causal Lineage for {currentQuery || 'film'}…</h3>
              <p>Replaying narrative timelines, conflict matrices, and sensor evidence.</p>
            </div>
          ) : (!movieData?.hasData && !loading) ? (
            <EmptyFilmPrompt target="forensics" discoveredMovies={discoveredMovies} onPick={(t) => fetchMovie(t)} />
          ) : movieData?.hasData && effectiveState ? (
            <>
              <section className="section" aria-label="Forensic subject">
                <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <Film aria-hidden="true" style={{ color: 'var(--accent)' }} />
                  <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>Root-cause lineage, conflicts and replay for <strong style={{ color: 'var(--ink)' }}>{currentQuery}</strong>.</p>
                  <span className="pill is-info" style={{ marginLeft: 'auto' }}>Diagnostics</span>
                </div>
              </section>
              <div className="legacy-wrap">
                <TemporalReplay temporalData={movieData.temporalReplay} onSelectSnapshot={(s) => setCustomSnapshot(s)} />
                <RootCauseGraph graphData={movieData?.rootCauseGraph || { nodes: [], edges: [] }} />
              </div>
              <div className="split">
                <ConflictEngineView conflicts={effectiveState?.conflicts || []} />
                <FalseSignalAlerts alerts={effectiveState?.falseSignalAlerts || []} />
              </div>
            </>
          ) : null}
        </>
      )}

      {/* ═══ SYSTEM ═══ */}
      {activeTab === 'system' && (
        <>
          <section className="section" aria-label="Sync controls">
            <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
                Auto-sync <strong style={{ color: 'var(--ink)' }}>{autoSync ? `on — next sweep in ${syncCountdown}s` : 'paused'}</strong> · Signed in as <strong style={{ color: 'var(--ink)' }}>{user?.email}</strong>
              </p>
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button type="button" className="mini-btn" onClick={() => setAutoSync((v) => !v)} aria-pressed={autoSync}>{autoSync ? 'Pause auto-sync' : 'Resume auto-sync'}</button>
                <button type="button" className="mini-btn is-primary" onClick={() => triggerSync(true)} disabled={isSyncing}>
                  <RefreshCw size={13} aria-hidden="true" /> Sync now
                </button>
                <button type="button" className="mini-btn" onClick={() => setFreshnessOpen(true)}>Freshness map</button>
              </span>
            </div>
          </section>
          <div className="legacy-wrap">
            <SensorTelemetryView freshnessMap={movieData?.freshnessMap || []} onRefreshSensors={() => triggerSync(true)} />
          </div>
          {loading && !movieData ? (
            <div className="card card-pad state-block" style={{ marginTop: '1rem' }}>
              <p className="num" style={{ color: 'var(--ink-3)', fontSize: 13 }}>
                <Loader2 className="spin" size={14} style={{ verticalAlign: -2 }} /> Syncing circuit telemetry for {currentQuery || 'film'}…
              </p>
            </div>
          ) : !movieData?.freshnessMap?.length ? (
            <div className="card card-pad state-block" style={{ marginTop: '1rem' }}>
              <p className="num" style={{ color: 'var(--ink-3)', fontSize: 13 }}>
                Active sensor stream connected · {currentQuery ? `Telemetry synchronized for ${currentQuery}` : 'Select a film on the Overview for granular per-circuit telemetry.'}
              </p>
            </div>
          ) : null}
        </>
      )}

      <WhyModal isOpen={Boolean(whyData)} onClose={() => setWhyData(null)} data={whyData} />
      <DataFreshnessMap isOpen={freshnessOpen} onClose={() => setFreshnessOpen(false)} freshnessMap={movieData?.freshnessMap || []} />
    </Shell>
  );
}

function Booting() {
  return (
    <div className="login-root">
      <main className="login-panel" style={{ gridColumn: '1 / -1' }}>
        <p className="num" style={{ color: 'var(--ink-3)', fontSize: 13 }} role="status">
          <Loader2 className="spin" size={15} style={{ verticalAlign: -2 }} /> Restoring session…
        </p>
      </main>
    </div>
  );
}

function GatedApp() {
  const { isAuthenticated, sessionChecked } = useAuth();
  if (!sessionChecked) return <Booting />;
  if (!isAuthenticated) return <Login />;
  return <Workspace />;
}

export default function App() {
  return (
    <AuthProvider>
      <GatedApp />
    </AuthProvider>
  );
}
