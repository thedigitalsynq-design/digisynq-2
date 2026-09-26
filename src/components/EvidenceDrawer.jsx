// src/components/EvidenceDrawer.jsx
import React, { useState } from 'react';
import { Database, Search, ExternalLink, Filter, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function EvidenceDrawer({ signals = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  if (!signals || signals.length === 0) return null;

  const categories = ['ALL', 'news', 'social', 'critics', 'trade', 'encyclopedic'];

  const filteredSignals = signals.filter((s) => {
    const matchesCategory = filterCategory === 'ALL' || s.sourceCategory === filterCategory;
    const matchesSearch = searchTerm === '' ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass-panel p-6 border border-white/10 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              Verified Public Evidence Vault
              <span className="badge badge-info text-[0.65rem] py-0.5">Data Lineage</span>
            </h3>
            <p className="text-xs text-slate-400">
              Audit every public signal with direct citations, publication timestamps, and source platforms
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredSignals.length} of {signals.length} verified signals
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search raw signals, keywords, or publishers..."
            className="w-full bg-[#0c1220] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded text-[0.7rem] uppercase font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Signals Table */}
      <div className="overflow-x-auto border border-white/5 rounded-xl max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#090d16] text-slate-400 font-mono text-[0.68rem] uppercase tracking-wider sticky top-0 border-b border-white/10">
            <tr>
              <th className="py-2.5 px-3">Source & Platform</th>
              <th className="py-2.5 px-3">Headline / Content Snippet</th>
              <th className="py-2.5 px-3">Sentiment</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3 text-right">Lineage Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {filteredSignals.map((signal) => (
              <tr key={signal.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                  <span className="font-bold block text-white">{signal.source}</span>
                  <span className="text-[0.65rem] text-slate-500 uppercase">{signal.sourceCategory}</span>
                </td>
                <td className="py-2.5 px-3 max-w-md">
                  <div className="font-medium text-slate-200 line-clamp-1">{signal.title}</div>
                  <div className="text-[0.72rem] text-slate-400 line-clamp-1 mt-0.5">{signal.snippet}</div>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                  <span className={`badge text-[0.62rem] ${
                    signal.sentimentLabel === 'POSITIVE' ? 'badge-positive' : signal.sentimentLabel === 'NEGATIVE' ? 'badge-negative' : 'badge-neutral'
                  }`}>
                    {signal.sentimentLabel}
                  </span>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[0.68rem] text-slate-400">
                  {new Date(signal.publishedAt).toLocaleDateString()}
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  {signal.url && signal.url !== '#' ? (
                    <a
                      href={signal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[0.7rem] bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40"
                    >
                      <span>Direct URL</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600 font-mono text-[0.68rem]">Unlinked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
