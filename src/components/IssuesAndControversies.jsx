// src/components/IssuesAndControversies.jsx
import React from 'react';
import { ShieldAlert, AlertTriangle, GitFork, ArrowUpRight, Flame, CheckCircle } from 'lucide-react';

export default function IssuesAndControversies({ activeIssues = [], emergingControversies = [] }) {
  if (activeIssues.length === 0 && emergingControversies.length === 0) {
    return (
      <div className="glass-panel p-6 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Damage-Control Clear
            </h3>
            <p className="text-xs text-slate-400">
              No persistent multi-source reputation crises or escalated controversy triggers currently detected.
            </p>
          </div>
        </div>
        <span className="badge badge-positive text-xs">Healthy Digital State</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Column 1: Active Damage-Control Issues */}
      <div className="glass-panel p-6 border border-red-500/20 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Active Issues ({activeIssues.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Requires PR/Distribution Action
          </span>
        </div>

        {activeIssues.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No escalated issues meeting promotion criteria.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 rounded-xl bg-[#121622] border border-red-500/30 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`badge text-[0.65rem] ${
                      issue.severity === 'CRITICAL' ? 'badge-critical' : issue.severity === 'ELEVATED' ? 'badge-negative' : 'badge-warning'
                    }`}>
                      {issue.severity} ESCALATION
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {issue.title}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-red-400 block">
                      {issue.damageRiskEstimate}%
                    </span>
                    <span className="text-[0.62rem] text-slate-500 font-mono uppercase">
                      Risk Impact
                    </span>
                  </div>
                </div>

                {/* Root Causes / Contributing Factors */}
                {issue.contributingFactors && issue.contributingFactors.length > 0 && (
                  <div className="p-2.5 rounded bg-black/30 border border-white/5 text-xs text-slate-300">
                    <span className="text-[0.68rem] text-slate-500 font-mono block uppercase mb-1">
                      Identified Root Factors:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[0.75rem]">
                      {issue.contributingFactors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Precision Issue Measurement Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 font-mono text-[0.68rem]">
                  <div className="p-1.5 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-500 block uppercase text-[0.6rem]">Damage Potential</span>
                    <span className="text-rose-400 font-bold">{issue.scores?.damagePotentialScore || (issue.severity === 'CRITICAL' ? 92 : 70)}/100</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-500 block uppercase text-[0.6rem]">Escalation Prob.</span>
                    <span className="text-amber-400 font-bold">{issue.scores?.escalationProbability || 45}%</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-500 block uppercase text-[0.6rem]">Decay Half-Life</span>
                    <span className="text-cyan-300 font-bold">{issue.scores?.publicAttentionDecayHours || 48}h</span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-500 block uppercase text-[0.6rem]">Mitigation Diff.</span>
                    <span className="text-teal-300 font-bold">{issue.scores?.mitigationDifficultyScore || 50}/100</span>
                  </div>
                </div>

                {/* Corroboration & Lineage */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{issue.sourcesCount} Outlets</span>
                    <span>•</span>
                    <span>Velocity: {issue.velocityScore}/100</span>
                  </div>
                  {issue.evidence?.[0] && (
                    <a
                      href={issue.evidence[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[0.7rem]"
                    >
                      <span>Evidence Link</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Column 2: Emerging Controversies */}
      <div className="glass-panel p-6 border border-amber-500/20 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Emerging Controversies ({emergingControversies.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Social & Media Flashpoints
          </span>
        </div>

        {emergingControversies.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No emerging controversy spikes registered.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {emergingControversies.map((controversy) => (
              <div
                key={controversy.id}
                className="p-4 rounded-xl bg-[#141824] border border-amber-500/30 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="badge badge-warning text-[0.65rem]">
                    {controversy.severity} SENSITIVITY SPIKE
                  </span>
                  <span className="text-xs font-mono text-amber-400">
                    Velocity: {controversy.velocityScore}/100
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">
                  {controversy.headline}
                </h4>

                <p className="text-xs text-slate-300">
                  {controversy.detectionReason}
                </p>

                {controversy.backingSignals?.[0] && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 truncate max-w-[200px]">
                      Source: {controversy.backingSignals[0].source}
                    </span>
                    <a
                      href={controversy.backingSignals[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[0.7rem]"
                    >
                      <span>Direct Citation</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
