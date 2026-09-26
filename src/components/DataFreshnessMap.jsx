// src/components/DataFreshnessMap.jsx
import React from 'react';
import { X, Activity, Server, Clock, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DataFreshnessMap({ isOpen, onClose, freshnessMap = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0a0f1d] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Internet Sensor Freshness & Telemetry Map
              </h3>
              <p className="text-xs text-slate-400">Real-time health audit of all connected public adapters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Honest Architecture Policy Alert */}
        <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/30 text-xs text-cyan-200 flex items-center gap-2.5 font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>ZERO FABRICATION PRINCIPLE: Freshness timestamps represent actual internet sensor collection pings.</span>
        </div>

        {/* Sensor Table */}
        <div className="flex flex-col gap-2 font-mono text-xs">
          {freshnessMap.map((sensor, idx) => {
            const isHealthy = sensor.status === 'HEALTHY';
            const isEmpty = sensor.status === 'EMPTY';
            const statusColor = isHealthy 
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
              : isEmpty 
                ? 'text-slate-400 bg-white/5 border-white/10' 
                : 'text-red-400 bg-red-500/10 border-red-500/30';

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isHealthy ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'}`} />
                  <div>
                    <span className="font-bold text-white block">{sensor.name}</span>
                    <span className="text-[0.68rem] text-slate-500 uppercase">{sensor.category} Sensor</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-right">
                  <div>
                    <span className="text-[0.68rem] text-slate-500 block uppercase">LATENCY</span>
                    <span className="font-semibold text-slate-300">{sensor.latencyMs}ms</span>
                  </div>

                  <div>
                    <span className="text-[0.68rem] text-slate-500 block uppercase">HARVESTED</span>
                    <span className="font-semibold text-white">{sensor.itemCount} items</span>
                  </div>

                  <div>
                    <span className="text-[0.68rem] text-slate-500 block uppercase">LAST PING</span>
                    <span className="font-semibold text-cyan-400">{sensor.lastFetchedAgo}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold border ${statusColor}`}>
                    {sensor.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold font-mono"
          >
            Close Telemetry Map
          </button>
        </div>

      </div>
    </div>
  );
}
