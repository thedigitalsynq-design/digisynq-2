// src/components/FalseSignalAlerts.jsx
import React from 'react';
import { AlertCircle, ShieldAlert, Copy, ExternalLink, Zap } from 'lucide-react';

export default function FalseSignalAlerts({ alerts = [] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="glass-panel p-6 border border-amber-500/20 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Signal Reliability & False-Positive Diagnostics ({alerts.length})
          </h3>
        </div>
        <span className="badge badge-warning text-[0.65rem]">
          Evidence Hygiene
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3.5 rounded-xl bg-[#141a28] border border-amber-500/30 flex flex-col justify-between gap-2.5 text-xs"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="badge badge-warning text-[0.62rem]">
                  {alert.type ? alert.type.replace(/_/g, ' ') : 'SIGNAL ALERT'}
                </span>
                <span className="font-mono text-red-400 text-[0.68rem] font-bold">
                  Reliability: {alert.reliability}
                </span>
              </div>

              <h4 className="font-bold text-white text-xs leading-snug">
                {alert.title}
              </h4>

              <p className="text-slate-300 text-[0.75rem] leading-relaxed">
                {alert.explanation}
              </p>
            </div>

            {/* Evidence Link */}
            {alert.evidence && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[0.7rem] font-mono text-slate-400">
                <span className="truncate max-w-[180px]">
                  Outlet: {Array.isArray(alert.evidence) ? `${alert.evidence.length} wire copies` : alert.evidence.source}
                </span>
                {(!Array.isArray(alert.evidence) && alert.evidence.url && alert.evidence.url !== '#') && (
                  <a
                    href={alert.evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
