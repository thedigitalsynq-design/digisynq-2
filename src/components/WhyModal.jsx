// src/components/WhyModal.jsx
import React from 'react';
import { X, HelpCircle, Calculator, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function WhyModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b101d] border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Calculation Breakdown (WHY?)
              </h3>
              <p className="text-xs text-slate-400">Mathematical derivation & source lineage</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric and Value */}
        <div className="p-4 rounded-xl bg-[#12192c] border border-white/10 flex items-baseline justify-between font-mono">
          <div>
            <span className="text-xs text-slate-400 uppercase block">{data.metric}</span>
            <span className="text-2xl font-black text-cyan-300">{data.value}</span>
          </div>
          {data.confidence && (
            <div className="text-right">
              <span className="text-[0.65rem] text-slate-500 block uppercase">Confidence</span>
              <span className="text-xs font-bold text-emerald-400">{data.confidence}</span>
            </div>
          )}
        </div>

        {/* Applied Mathematical Formula */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
          <span className="text-slate-500 block text-[0.65rem] uppercase mb-1">Applied Algorithm / Formula:</span>
          <code className="text-cyan-400 font-semibold">{data.formula}</code>
        </div>

        {/* Component breakdown */}
        {data.components && data.components.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Factor Contributions:
            </span>
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              {data.components.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between"
                >
                  <span className="text-slate-300">{comp.label}</span>
                  <span className="font-bold text-white">
                    {comp.contribution !== undefined ? comp.contribution : comp.count !== undefined ? `${comp.count} (${comp.percentage})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Size & Lineage */}
        {data.sampleSize && (
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Based on {data.sampleSize}</span>
          </div>
        )}

        {/* Direct Supporting Evidence Links */}
        {data.evidenceLinks && data.evidenceLinks.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Verified Public Source Items ({data.evidenceLinks.length}):
            </span>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {data.evidenceLinks.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="truncate max-w-[340px]">
                    <span className="font-bold text-slate-200 block truncate">{ev.title}</span>
                    <span className="text-[0.68rem] text-slate-500 font-mono">{ev.source}</span>
                  </div>
                  {ev.url && ev.url !== '#' && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold font-mono"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
