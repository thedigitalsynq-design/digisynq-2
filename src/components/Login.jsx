// src/components/Login.jsx
// Redesigned sign-in experience (visual only — same /api/auth/* mechanism).

import React, { useState } from 'react';
import { Activity, Clapperboard, Eye, EyeOff, Lock, Mail, Radio, ShieldCheck } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../api';
import { useAuth } from '../auth';

const ASSURANCES = [
  { icon: Radio, title: 'Live sensor network', text: 'Radar, trade feeds and WOM signals stream into one workspace.' },
  { icon: ShieldCheck, title: 'Verified before shown', text: '5-layer checks filter syndication, bots and stale claims.' },
  { icon: Activity, title: 'Decisions, not dashboards', text: 'Every film resolves to a posture, an owner and a next step.' },
];

export default function Login() {
  const { login, loginGuest } = useAuth();
  const [email, setEmail] = useState(DEMO_CREDENTIALS[0].email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ phase: 'idle', message: '' });

  const submit = async (e) => {
    e?.preventDefault();
    if (status.phase === 'working') return;
    if (!email.trim() || !password) {
      setStatus({ phase: 'error', message: 'Enter your work email and password to continue.' });
      return;
    }
    setStatus({ phase: 'working', message: 'Verifying credentials…' });
    try {
      const session = await login(email.trim(), password);
      setStatus({
        phase: 'success',
        message: session?._source === 'LOCAL'
          ? 'Signed in offline (demo session). API unreachable — data runs on cache.'
          : `Welcome back, ${session?.user?.name || 'operator'}. Loading workspace…`,
      });
    } catch (err) {
      setStatus({ phase: 'error', message: err.message || 'Sign-in failed. Please try again.' });
    }
  };

  const fillDemo = async (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setStatus({ phase: 'working', message: `Verifying ${cred.label}…` });
    try {
      const session = await login(cred.email, cred.password);
      setStatus({
        phase: 'success',
        message: `Welcome back, ${session?.user?.name || 'operator'}. Loading workspace…`,
      });
    } catch (err) {
      setStatus({ phase: 'error', message: err.message || 'Sign-in failed.' });
    }
  };

  return (
    <div className="login-root">
      <a className="skip-link" href="#login-form">Skip to sign-in form</a>

      <section className="login-brand" aria-label="About Cinema Damage Control">
        <div className="login-brand-inner">
          <p className="login-kicker"><Clapperboard aria-hidden="true" /> Cinema Damage Control</p>
          <h1>Know the story<br />before it costs you<br />the weekend.</h1>
          <p className="login-lede">
            Reputation intelligence for Indian theatrical releases — live telemetry,
            verified narratives, and a response plan for every film in the window.
          </p>
          <ul className="login-points">
            {ASSURANCES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="login-point-icon" aria-hidden="true"><Icon /></span>
                <span><strong>{title}</strong><span>{text}</span></span>
              </li>
            ))}
          </ul>
          <p className="login-window">Strict 15-day rolling window · Indian Standard Time (UTC+05:30)</p>
        </div>
      </section>

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card-head">
            <h2 id="login-heading">Sign in to the war room</h2>
            <p>Your existing account works here — same credentials, new workspace.</p>
          </div>

          <form id="login-form" onSubmit={submit} aria-labelledby="login-heading" noValidate={false}>
            <div className="field">
              <label htmlFor="login-email">Work email</label>
              <div className="field-control">
                <Mail aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="field-control">
                <Lock aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  className="field-affix"
                  onClick={() => setShowPassword(v => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="login-status" aria-live="polite">
              {status.phase === 'error' && <p role="alert" className="status-error">{status.message}</p>}
              {status.phase === 'working' && <p className="status-working">{status.message}</p>}
              {status.phase === 'success' && <p className="status-success">{status.message}</p>}
            </div>

            <button type="submit" className="btn-primary btn-block" disabled={status.phase === 'working'}>
              {status.phase === 'working' ? 'Signing in…' : 'Sign in'}
            </button>
            <button
              type="button"
              className="btn-secondary btn-block"
              style={{ marginTop: '0.625rem' }}
              onClick={() => loginGuest && loginGuest()}
              disabled={status.phase === 'working'}
            >
              Instant Guest Preview (No Password)
            </button>
          </form>

          <div className="login-demo">
            <p>Demo access — select to autofill:</p>
            <div className="login-demo-row">
              {DEMO_CREDENTIALS.map((c) => (
                <button key={c.email} type="button" className="chip-btn" onClick={() => fillDemo(c)} title={`${c.email} / ${c.password}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <p className="login-demo-hint">Admin: <code>admin@cinema.intel / ChangeMe123!</code> · Operator: <code>operator@cdc.local / operator123</code></p>
          </div>
        </div>
        <p className="login-foot">Protected workspace · Sessions expire after 12 hours · v1.0</p>
      </main>
    </div>
  );
}
