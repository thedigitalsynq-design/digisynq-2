// src/components/TemporalReplay.jsx
import React, { useState } from 'react';
import { PlayCircle, FastForward, RotateCcw, Clock, TrendingUp, TrendingDown, Layers, ShieldAlert } from 'lucide-react';

export default function TemporalReplay({ temporalData, onSelectSnapshot }) {
  if (!temporalData || !temporalData.snapshots || temporalData.snapshots.length === 0) {
    return null;
  }

  const { snapshots = [], intervals = [], beforeVsNow } = temporalData;
  const [selectedIndex, setSelectedIndex] = useState(snapshots.length - 1);

  const activeSnapshot = snapshots[selectedIndex] || snapshots[snapshots.length - 1];
  const activeState = activeSnapshot.state || {};

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedIndex(idx);
    if (onSelectSnapshot) {
      onSelectSnapshot(snapshots[idx]);
    }
  };

  return (
    <div className="glass-panel p-6 border border-white/10 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              Temporal Replay & Evolution Engine
              <span className="badge badge-info text-[0.65rem] py-0.5">Time Scrub</span>
            </h3>
            <p className="text-xs text-slate-400">
              Scrub backwards in time to reconstruct the movie's intelligence state at historical intervals
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40">
          Showing: {activeSnapshot.label}
        </span>
      </div>

      {/* Timeline Slider Control */}
      <div className="flex flex-col gap-2 py-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{snapshots[0]?.label}</span>
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Reconstructing State
          </span>
          <span className="text-emerald-400 font-bold">{snapshots[snapshots.length - 1]?.label}</span>
        </div>

        <input
          type="range"
          min="0"
          max={snapshots.length - 1}
          value={selectedIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        {/* Milestone Tick Marks */}
        <div className="flex justify-between text-[0.68rem] font-mono text-slate-500 px-1">
          {snapshots.map((snap, idx) => (
            <button
              key={snap.intervalId}
              onClick={() => {
                setSelectedIndex(idx);
                if (onSelectSnapshot) onSelectSnapshot(snap);
              }}
              className={`hover:text-cyan-300 transition-colors ${
                selectedIndex === idx ? 'text-cyan-400 font-bold underline underline-offset-4' : ''
              }`}
            >
              {snap.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snapshot Digital Twin State Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-[#0d1320] border border-white/5 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[0.65rem] uppercase">Public Signals Ingested</span>
          <span className="text-lg font-bold text-white">{activeSnapshot.signalCount}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[0.65rem] uppercase">Net Sentiment</span>
          <span className={`text-lg font-bold ${(activeState.overallSentiment || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {(activeState.overallSentiment || 0) > 0 ? '+' : ''}{activeState.overallSentiment || 0}%
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[0.65rem] uppercase">Discussion Velocity</span>
          <span className="text-lg font-bold text-cyan-400">{activeState.discussionVelocity || 0} sig/hr</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[0.65rem] uppercase">Reputation Risk</span>
          <span className={`text-lg font-bold ${(activeState.reputationRiskScore || 0) >= 50 ? 'text-red-400' : 'text-emerald-400'}`}>
            {activeState.reputationRiskScore || 0}/100
          </span>
        </div>
      </div>

      {/* Before vs Now Comparison Panel */}
      {beforeVsNow && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/20 to-indigo-950/20 border border-cyan-500/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <FastForward className="w-3.5 h-3.5" />
              Before vs Now Comparative Shift ({beforeVsNow.baselineLabel} → {beforeVsNow.currentLabel})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[0.65rem] uppercase">Signal Volume Expansion</span>
              <span className="text-base font-bold text-cyan-400">
                +{beforeVsNow.signalGrowth} signals
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[0.65rem] uppercase">Sentiment Swing</span>
              <span className={`text-base font-bold ${beforeVsNow.sentimentShift >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {beforeVsNow.sentimentShift > 0 ? '+' : ''}{beforeVsNow.sentimentShift}%
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[0.65rem] uppercase">Velocity Shift</span>
              <span className={`text-base font-bold ${beforeVsNow.velocityShift >= 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                {beforeVsNow.velocityShift > 0 ? '+' : ''}{beforeVsNow.velocityShift.toFixed(1)}/hr
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[0.65rem] uppercase">Damage Risk Delta</span>
              <span className={`text-base font-bold ${beforeVsNow.riskShift > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {beforeVsNow.riskShift > 0 ? '+' : ''}{beforeVsNow.riskShift} pts
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
