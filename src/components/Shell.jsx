// src/components/Shell.jsx
// Application frame for the redesigned IA: sidebar, topbar, mobile nav.
// Pure layout — all data behaviour lives in App.jsx.

import React, { useState } from 'react';
import {
  Activity, FileSearch, Film, LayoutDashboard, LifeBuoy,
  LogOut, RefreshCw, Search, ShieldCheck, Swords,
} from 'lucide-react';
import { useAuth } from '../auth';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', hint: 'Radar & window', icon: LayoutDashboard },
  { id: 'film', label: 'Film', hint: 'Digital twin', icon: Film },
  { id: 'response', label: 'Response', hint: 'War room & arsenal', icon: Swords },
  { id: 'evidence', label: 'Evidence', hint: 'Forensics & roots', icon: FileSearch },
  { id: 'system', label: 'System', hint: 'Sensors & trust', icon: Activity },
];

export function pageMeta(activeTab) {
  switch (activeTab) {
    case 'film': return { title: 'Film intelligence', sub: 'Live digital twin, sentiment and verified evidence.' };
    case 'response': return { title: 'Response command', sub: 'Playbooks, decision posture and crisis arsenal.' };
    case 'evidence': return { title: 'Evidence & forensics', sub: 'Causal lineage, conflicts and temporal replay.' };
    case 'system': return { title: 'System & sensors', sub: 'Telemetry health, freshness and trust audit.' };
    default: return { title: 'Overview', sub: 'Every active release in the 15-day window, ranked by risk.' };
  }
}

function StatusDot({ status }) {
  const live = status === 'LIVE';
  const stale = status === 'CACHE' || status === 'STALE';
  return (
    <span className={`status-dot ${live ? 'is-live' : stale ? 'is-stale' : 'is-off'}`} role="status" aria-label={`Telemetry status: ${status}`}>
      <span aria-hidden="true" />
      {status}
    </span>
  );
}

export default function Shell({
  activeTab, onSelectTab, currentQuery, discoveredMovies = [],
  onSearch, loading, systemStatus = 'LIVE', isSyncing,
  onManualSync, istLabel, children, toast,
}) {
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  const [filmOpen, setFilmOpen] = useState(false);
  const meta = pageMeta(activeTab);
  const initials = (user?.name || user?.email || 'OP').split(/[\s@]+/).map(s => s[0]).join('').slice(0, 2).toUpperCase();

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) { onSearch(q.trim()); setQ(''); }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside className="sidebar" aria-label="Primary">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><ShieldCheck /></span>
          <span className="brand-text"><strong>CDC</strong><span>Cinema Damage Control</span></span>
        </div>

        <p className="side-label">Workspace</p>
        <nav aria-label="Sections">
          <ul className="side-nav">
            {NAV_ITEMS.map(({ id, label, hint, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onSelectTab(id)}
                    aria-current={active ? 'page' : undefined}
                    className={`side-link ${active ? 'is-active' : ''}`}
                  >
                    <Icon aria-hidden="true" />
                    <span><strong>{label}</strong><span>{hint}</span></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="side-label">Active film</p>
        <div className="film-switch">
          <button
            type="button"
            className="film-current"
            onClick={() => setFilmOpen(v => !v)}
            aria-expanded={filmOpen}
            aria-haspopup="listbox"
            title="Switch the film synced across all sections"
          >
            <Film aria-hidden="true" />
            <span>{currentQuery || 'Select a film'}</span>
          </button>
          {filmOpen && (
            <ul className="film-list" role="listbox" aria-label="Active releases">
              {discoveredMovies.slice(0, 12).map((m) => {
                const title = typeof m === 'string' ? m : m.title;
                const selected = (currentQuery || '').toLowerCase() === title.toLowerCase();
                return (
                  <li key={title} role="option" aria-selected={selected}>
                    <button type="button" onClick={() => { onSearch(title); setFilmOpen(false); }} className={selected ? 'is-selected' : ''}>
                      {title}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="side-foot">
          <div className="session-card">
            <span className="avatar" aria-hidden="true">{initials}</span>
            <span className="session-meta">
              <strong>{user?.name || 'Operator'}</strong>
              <span>{user?.role || 'operator'} · {user?.email}</span>
            </span>
            <button type="button" className="icon-btn" onClick={logout} title="Sign out" aria-label="Sign out">
              <LogOut aria-hidden="true" />
            </button>
          </div>
          <p className="side-version">CDC v1.0 · 15-day IST window</p>
        </div>
      </aside>

      {/* ── Main column ───────────────────────────────────── */}
      <div className="main-col">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{meta.title}</h1>
            <p>{meta.sub}</p>
          </div>
          <div className="topbar-tools">
            <form className="topbar-search" onSubmit={submitSearch} role="search" aria-label="Search films">
              <Search aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a film…"
                aria-label="Search a film"
              />
              <button type="submit" disabled={loading}>Go</button>
            </form>
            <span className="ist-pill" title="Indian Standard Time">{istLabel || 'IST ···'}</span>
            <StatusDot status={systemStatus} />
            <button type="button" className="icon-btn" onClick={onManualSync} disabled={isSyncing} title="Sync sensor network now" aria-label="Sync sensor network now">
              <RefreshCw aria-hidden="true" className={isSyncing ? 'spin' : ''} />
            </button>
          </div>
        </header>

        <div className="mobile-bar" aria-label="Account and sync">
          <span className="brand-mini"><ShieldCheck aria-hidden="true" /> CDC</span>
          <span className="mobile-film">{currentQuery || 'No film selected'}</span>
          <button type="button" className="icon-btn" onClick={onManualSync} disabled={isSyncing} aria-label="Sync sensor network now">
            <RefreshCw aria-hidden="true" className={isSyncing ? 'spin' : ''} />
          </button>
        </div>

        <main id="main-content" className="page" tabIndex={-1}>
          {children}
        </main>

        <footer className="page-foot">
          <span><LifeBuoy aria-hidden="true" /> Cinema Damage-Control Platform · Indian cinema intelligence</span>
          <span>Strict 15-day sliding window · IST (UTC+05:30)</span>
        </footer>

        {/* ── Mobile bottom nav ───────────────────────────── */}
        <nav className="bottom-nav" aria-label="Sections">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
              className={activeTab === id ? 'is-active' : ''}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {toast && (
        <div className="toast" role="status">
          <span className="toast-dot" aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
