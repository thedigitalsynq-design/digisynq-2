// src/components/WhatJustChanged.jsx
import React from 'react';
import { History, Zap, ArrowUpRight, ShieldAlert, GitFork, Radio } from 'lucide-react';

export default function WhatJustChanged({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="glass-panel p-5 border border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-cyan-400" /> What Just Changed?
        </h3>
        <p className="text-xs text-slate-500 italic">No state changes registered in the observation buffer.</p>
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'CROSS_SOURCE_CONVERGENCE':
        return <GitFork className="w-3.5 h-3.5 text-amber-400" />;
      case 'ISSUE_ESCALATION':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      case 'VELOCITY_ACCELERATION':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 border border-white/10">
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <span>What Just Changed?</span>
          <span className="badge badge-info text-[0.65rem] py-0.5">Live Event Stream</span>
        </h3>
        <span className="text-[0.68rem] font-mono text-slate-500">
          Chronological Audit
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex items-start gap-3"
          >
            <div className="w-6 h-6 rounded-md bg-[#131b2c] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              {getEventIcon(event.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {event.title || event.label}
                </span>
                <span className="text-[0.68rem] font-mono text-cyan-400/90 shrink-0 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  {event.timeAgo || event.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {event.detail || event.delta || (event.severity ? `Status: ${event.severity}` : '')}
              </p>
              {event.url && event.url !== '#' && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[0.68rem] text-cyan-400 hover:text-cyan-300 mt-1.5 font-mono"
                >
                  <span>Verify raw public record</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
