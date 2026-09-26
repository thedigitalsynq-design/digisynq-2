// src/components/ConflictEngineView.jsx
import React from 'react';
import { GitPullRequest, AlertCircle, ArrowUpRight, HelpCircle } from 'lucide-react';

export default function ConflictEngineView({ conflicts = [] }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="glass-panel p-6 border border-cyan-500/20 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Information Conflict Engine ({conflicts.length})
          </h3>
        </div>
        <span className="badge badge-info text-[0.65rem]">
          Cross-Source Discrepancies
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="p-4 rounded-xl bg-[#0f1524] border border-cyan-500/30 flex flex-col gap-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="badge badge-warning text-[0.65rem]">
                CONFLICT ON: {conflict.attribute}
              </span>
              <span className="font-mono text-cyan-400 text-[0.7rem]">
                Status: {conflict.status}
              </span>
            </div>

            <p className="text-slate-300 font-medium">
              {conflict.description}
            </p>

            {/* Competing Claims Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {conflict.competingClaims?.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between gap-2"
                >
                  <div>
                    <span className="text-[0.65rem] text-slate-400 uppercase font-mono block">
                      Claim Variant {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      "{comp.claimValue}"
                    </span>
                  </div>

                  <div className="text-[0.7rem] text-slate-400 font-mono pt-1.5 border-t border-white/5 flex flex-col gap-1">
                    <span className="text-slate-500">Supported by {comp.frequency} source(s):</span>
                    {comp.sources?.slice(0, 2).map((s, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between gap-1">
                        <span className="truncate text-slate-300">{s.source}</span>
                        {s.url && s.url !== '#' && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Damage Control Recommendation */}
            <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/30 text-[0.75rem] text-cyan-300">
              <span className="font-bold font-mono mr-1">PROTOCOL:</span>
              {conflict.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
