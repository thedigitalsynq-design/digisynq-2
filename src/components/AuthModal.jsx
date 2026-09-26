// src/components/AuthModal.jsx
// Enterprise Studio Authentication & Access Management Modal
// Apple / Linear Minimalist Luxury Dark design with credential sign-in & instant role switching.

import React, { useState } from 'react';
import { useAuth, AVAILABLE_ROLES } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Key, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Building2, 
  LogOut, 
  Sparkles,
  Layers,
  Crown
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { user, isAuthenticated, login, logout, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState(isAuthenticated ? 'profile' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Studio Executive');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email || 'executive@cinema-damage-control.com', password, selectedRole);
      setLoading(false);
      setStatusMsg('Session authenticated successfully.');
      setTimeout(() => {
        onClose();
        setStatusMsg(null);
      }, 500);
    }, 400);
  };

  const handleDemoSignIn = (role) => {
    setLoading(true);
    setTimeout(() => {
      login(role.email, 'demo-token', role.role);
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#0a0f1d] border border-white/[0.12] shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Subtle Ambient Header Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Studio Identity & Access Control
                {isAuthenticated && (
                  <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                    ✓ Verified Session
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Indian Theatrical Crisis Intelligence • Enterprise Clearance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-white/[0.06] bg-[#080d19]/80 text-xs font-mono">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-1 border-b-2 font-bold transition-colors ${
              activeTab === 'profile'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Active Session & Roles
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`pb-2.5 px-1 border-b-2 font-bold transition-colors ${
              activeTab === 'signin'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {isAuthenticated ? 'Switch Account' : 'Studio Sign In'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto max-h-[65vh] space-y-5">
          
          {/* TAB 1: ACTIVE PROFILE & INSTANT ROLE SWITCH */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {isAuthenticated ? (
                <>
                  {/* Current Account Card */}
                  <div className="p-4 rounded-xl bg-[#0d1424] border border-cyan-500/30 flex items-center justify-between gap-4 shadow-inner">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md font-mono">
                        {user.avatar || 'VR'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white tracking-tight">{user.name}</h3>
                          <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1 text-[0.65rem] text-slate-500 font-mono">
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          <span>{user.studio}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={logout}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="End session"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>

                  {/* Role Switcher Grid */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block mb-2.5">
                      Switch Active Operational Clearance:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {AVAILABLE_ROLES.map((r) => {
                        const isCurrent = user.role === r.role;
                        return (
                          <button
                            key={r.role}
                            onClick={() => switchRole(r.role)}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                              isCurrent
                                ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/40 shadow-md'
                                : 'bg-[#090e1a] border-white/[0.08] hover:border-white/20 hover:bg-[#0c1322]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white tracking-tight">{r.role}</span>
                              {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                            </div>
                            <span className="text-[0.65rem] text-slate-400 leading-snug">
                              {r.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Permissions & Security Badge */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono text-slate-400 space-y-1">
                    <div className="flex items-center justify-between text-[0.68rem]">
                      <span>Security Clearance:</span>
                      <strong className="text-emerald-400">RESTRICTED_ACCESS_TIER_1</strong>
                    </div>
                    <div className="flex items-center justify-between text-[0.68rem]">
                      <span>Audit Trail Lineage:</span>
                      <span className="text-slate-300">HMAC-SHA256 Encrypted IST</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">No Active Studio Session</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                      You are currently accessing CDC in guest observation mode. Sign in to activate studio dispatch and crisis tools.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('signin')}
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-lg shadow-cyan-500/20"
                  >
                    Authenticate Studio Credentials →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREDENTIAL SIGN IN / DEMO ACCESS */}
          {activeTab === 'signin' && (
            <div className="space-y-5">
              {/* 1-Click Studio Fast Pass */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#0c1527] to-cyan-950/40 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Instant Studio Fast Pass (Demo Mode)
                  </span>
                </div>
                <p className="text-[0.68rem] text-slate-400 mb-3">
                  Click any role below to instantly authenticate and evaluate the system with full executive privileges:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ROLES.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleDemoSignIn(r)}
                      disabled={loading}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-mono text-cyan-200 hover:text-white transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{r.role}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Credentials Form */}
              <form onSubmit={handleSignIn} className="space-y-3.5 pt-2 border-t border-white/[0.08]">
                <span className="text-[0.68rem] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                  Or Authenticate With Studio Credentials:
                </span>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Corporate / Studio Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="executive@mythri-studios.in"
                      className="w-full bg-[#080d19] border border-white/10 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 font-mono transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Access Token / Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#080d19] border border-white/10 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 font-mono transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Assigned Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-[#080d19] border border-white/10 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  >
                    {AVAILABLE_ROLES.map(r => (
                      <option key={r.role} value={r.role} className="bg-[#0c1220] text-white">
                        {r.role} — {r.roleBadge}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{loading ? 'Authenticating Session...' : 'Authenticate & Enter CDC Studio'}</span>
                </button>
              </form>

              {statusMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{statusMsg}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#070b14] flex items-center justify-between text-[0.68rem] font-mono text-slate-500">
          <span>Cinema Damage Control Engine v2.4</span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>256-bit Theatrical Identity Protocol</span>
          </span>
        </div>
      </div>
    </div>
  );
}
