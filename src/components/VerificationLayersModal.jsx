import React from 'react';
import { Info, ChevronDown, ShieldCheck } from 'lucide-react';

/**
 * VerificationLayersModal - displays the 5‑layer verification details.
 * Props:
 *   show (boolean) – controls visibility.
 *   onClose (function) – toggles the modal.
 *   layers (array) – list of layer objects {id, name, rule, icon}.
 */
export default function VerificationLayersModal({ show, onClose, layers }) {
  if (!show) return null;
  return (
    <div className="bento-card p-4 bg-[#060a14] border-cyan-500/40 animate-fade-in">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          5-Layer Data Integrity & Accuracy Architecture
        </span>
        <span className="text-[0.65rem] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          100% Enforced Gatekeeper
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="p-3 rounded-lg bg-[#0a101f] border border-white/5 flex flex-col justify-between gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{layer.icon}</span>
              <span className="text-[0.6rem] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                Layer {layer.id} Passed
              </span>
            </div>
            <h5 className="text-xs font-bold text-white font-mono">{layer.name}</h5>
            <p className="text-[0.65rem] text-slate-400 leading-relaxed font-mono">
              {layer.rule}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
