// src/components/RootCauseGraph.jsx
import React, { useState } from 'react';
import { GitBranch, Info, ExternalLink, ArrowRight, Layers } from 'lucide-react';

export default function RootCauseGraph({ graphData }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return null;
  }

  const { nodes = [], edges = [] } = graphData;

  // Group nodes into topological columns:
  // Layer 0: Raw Signals
  // Layer 1: Clustered Narratives
  // Layer 2: Escalated Issues
  // Layer 3: Root Factors & Potential Impact
  const signalsNodes = nodes.filter(n => n.type === 'SIGNAL');
  const narrativesNodes = nodes.filter(n => n.type === 'NARRATIVE');
  const issuesNodes = nodes.filter(n => n.type === 'ISSUE');
  const factorAndImpactNodes = nodes.filter(n => n.type === 'ROOT_FACTOR' || n.type === 'BUSINESS_IMPACT');

  const getNodeColor = (node) => {
    if (node.type === 'BUSINESS_IMPACT') return 'border-red-500 bg-red-950/40 text-red-300';
    if (node.type === 'ISSUE') return 'border-amber-500 bg-amber-950/30 text-amber-300';
    if (node.type === 'ROOT_FACTOR') return 'border-indigo-500 bg-indigo-950/30 text-indigo-300';
    if (node.type === 'NARRATIVE') {
      return node.sentiment === 'POSITIVE' 
        ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
        : node.sentiment === 'NEGATIVE'
          ? 'border-red-500/50 bg-red-950/30 text-red-300'
          : 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300';
    }
    return 'border-white/10 bg-[#101624] text-slate-300';
  };

  return (
    <div className="glass-panel p-6 border border-white/10 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              Live Root-Cause Graph
              <span className="badge badge-info text-[0.65rem] py-0.5">Dynamic DAG</span>
            </h3>
            <p className="text-xs text-slate-400">
              Evidence traces from Raw Sensors → Clustered Narratives → Active Issues → Root Causes → Box Office Impact
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Generated from {nodes.length} nodes & {edges.length} causal links
        </span>
      </div>

      {/* DAG Flow Visual Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 overflow-x-auto min-w-[700px]">
        
        {/* Layer 1: Raw Signals */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 px-1 border-b border-white/5 pb-1">
            <span>1. SENSORS</span>
            <span className="text-[0.65rem] text-slate-500">{signalsNodes.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {signalsNodes.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNode(n)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${getNodeColor(n)} ${
                  selectedNode?.id === n.id ? 'ring-2 ring-cyan-400 shadow-md' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="font-bold text-[0.7rem] uppercase font-mono text-slate-400 mb-0.5">
                  {n.label}
                </div>
                <div className="text-white text-xs line-clamp-2">
                  {n.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 2: Narratives */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 px-1 border-b border-white/5 pb-1">
            <span>2. NARRATIVES</span>
            <span className="text-[0.65rem] text-slate-500">{narrativesNodes.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {narrativesNodes.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNode(n)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${getNodeColor(n)} ${
                  selectedNode?.id === n.id ? 'ring-2 ring-cyan-400 shadow-md' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="font-bold text-[0.7rem] uppercase font-mono text-cyan-300 mb-0.5">
                  {n.label}
                </div>
                <div className="text-white text-xs line-clamp-2">
                  {n.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: Issues */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 px-1 border-b border-white/5 pb-1">
            <span>3. ACTIVE ISSUES</span>
            <span className="text-[0.65rem] text-slate-500">{issuesNodes.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {issuesNodes.length === 0 ? (
              <div className="p-4 rounded bg-white/[0.02] border border-white/5 text-slate-500 text-xs italic">
                No active issues escalated
              </div>
            ) : (
              issuesNodes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${getNodeColor(n)} ${
                    selectedNode?.id === n.id ? 'ring-2 ring-amber-400 shadow-md' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="font-bold text-[0.7rem] uppercase font-mono text-amber-300 mb-0.5">
                    {n.label}
                  </div>
                  <div className="text-white text-xs line-clamp-2">
                    {n.subtitle}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Layer 4: Root Factors & Impact */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400 px-1 border-b border-white/5 pb-1">
            <span>4. ROOT CAUSES & IMPACT</span>
            <span className="text-[0.65rem] text-slate-500">{factorAndImpactNodes.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {factorAndImpactNodes.length === 0 ? (
              <div className="p-4 rounded bg-white/[0.02] border border-white/5 text-slate-500 text-xs italic">
                No root causes or negative business impacts identified
              </div>
            ) : (
              factorAndImpactNodes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${getNodeColor(n)} ${
                    selectedNode?.id === n.id ? 'ring-2 ring-red-400 shadow-md' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="font-bold text-[0.7rem] uppercase font-mono text-red-300 mb-0.5">
                    {n.label}
                  </div>
                  <div className="text-white text-xs line-clamp-2">
                    {n.subtitle}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-3.5 rounded-xl bg-[#0b101c] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-info text-[0.65rem]">Node Inspector</span>
              <span className="font-mono text-slate-400 uppercase font-bold">{selectedNode.label}</span>
            </div>
            <p className="text-white mt-1 font-medium">{selectedNode.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedNode.url && (
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action text-xs"
              >
                <span>View Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setSelectedNode(null)}
              className="px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
