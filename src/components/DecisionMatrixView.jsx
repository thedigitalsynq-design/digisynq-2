// src/components/DecisionMatrixView.jsx
// STATE-OF-THE-ART CINEMA DAMAGE CONTROL DECISION MATRIX ENGINE (CDCE v3.0)
// Highly structured, process-driven, systematic, and mathematically rigorous decision-making algorithm
// Built specifically for PAN-INDIA THEATRICAL CRISES, REPUTATION LOSS PREVENTION, AND BOX OFFICE RECOVERY.
// Evaluates all 7 Cinema Damage Vectors, enforces a 5-tier containment hierarchy,
// and issues actionable theatrical damage-control operational orders.

import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingDown,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  BarChart3,
  Bot,
  RefreshCw,
  FileCheck2,
  Check,
  Copy,
  Lock,
  MessageSquare,
  Scissors,
  Film,
  Ticket,
  ShieldCheck,
  Radio,
  FileText
} from 'lucide-react';

export default function DecisionMatrixView({ decisionData, movieTitle }) {
  const [activeTab, setActiveTab] = useState('vectors'); // 'vectors', 'matrix', 'hierarchy', 'orders', 'playbook'
  const [copiedKey, setCopiedKey] = useState(null);
  const [showSimLab, setShowSimLab] = useState(false);

  // Cinema Damage Control Simulation Lab States
  const [simKdmTrimApplied, setSimKdmTrimApplied] = useState(false);
  const [simBoycottDefused, setSimBoycottDefused] = useState(false);
  const [simSubventionActive, setSimSubventionActive] = useState(false);
  const [simPiracyBlocked, setSimPiracyBlocked] = useState(false);
  const [simExhibitorProtected, setSimExhibitorProtected] = useState(false);

  if (!decisionData) {
    return (
      <div className="glass-panel p-8 text-center border border-white/10 rounded-2xl">
        <Cpu className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-spin" />
        <h3 className="text-base font-bold text-white font-mono uppercase">Auditing Cinema Damage Vectors</h3>
        <p className="text-xs text-slate-400 mt-1">Calibrating CDCE v3.0 Theatrical Damage Control protocols for "{movieTitle}"...</p>
      </div>
    );
  }

  const {
    stage1_deBiasing,
    stage2_damageVectors,
    stage3_factorMatrix,
    stage4_hierarchyGate,
    stage5_counterMeasures,
    stage6_prescription,
    executiveSummary,
    algorithmVersion,
    istTimestamp
  } = decisionData;

  const prescription = stage6_prescription || decisionData.stage5_prescription || {};
  const damageVectors = stage2_damageVectors?.vectors || [];
  const topVulnerability = stage2_damageVectors?.topVulnerability;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Dynamic simulation recalculation for Cinema Damage Control
  const computeSimulatedCRS = () => {
    let baseCRS = stage3_factorMatrix?.compositeRiskScore || 50;
    if (simKdmTrimApplied) baseCRS -= 14;
    if (simBoycottDefused) baseCRS -= 22;
    if (simSubventionActive) baseCRS -= 10;
    if (simPiracyBlocked) baseCRS -= 8;
    if (simExhibitorProtected) baseCRS -= 12;
    return Math.max(12, Math.min(95, baseCRS));
  };

  const simCRS = computeSimulatedCRS();
  const getSimTier = (score) => {
    if (score >= 68) return { tier: 1, name: 'Tier 1: Existential Damage Containment', color: 'text-red-400', badge: 'bg-red-500/20 text-red-300 border-red-500/40' };
    if (score >= 50) return { tier: 2, name: 'Tier 2: Structural Theatrical Modification', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (score >= 38) return { tier: 3, name: 'Tier 3: Narrative Re-Anchoring', color: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' };
    if (score >= 25) return { tier: 4, name: 'Tier 4: Tactical Grassroots Defense', color: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    return { tier: 5, name: 'Tier 5: Expansion & Screen Maximization', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };
  const simTier = getSimTier(simCRS);

  const getTierBadge = (tierCode) => {
    switch (tierCode) {
      case 'TIER_1_EMERGENCY_TRIAGE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">Tier 1: Existential Triage</span>;
      case 'TIER_2_STRUCTURAL_MODIFICATION':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">Tier 2: Structural Adjustment</span>;
      case 'TIER_3_NARRATIVE_REANCHORING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">Tier 3: Narrative Re-Anchoring</span>;
      case 'TIER_4_TACTICAL_DEFENSE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">Tier 4: Tactical Defense</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Tier 5: Expansion Maximization</span>;
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 50) return 'text-amber-400';
    if (score >= 35) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getProgressBarColor = (score) => {
    if (score >= 70) return 'bg-gradient-to-r from-amber-500 to-red-500';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    if (score >= 35) return 'bg-gradient-to-r from-blue-500 to-yellow-500';
    return 'bg-gradient-to-r from-teal-500 to-emerald-500';
  };

  const getVectorIcon = (code) => {
    switch (code) {
      case 'RUNTIME_PACING_DRAG': return <Scissors className="w-4 h-4 text-amber-400" />;
      case 'MONDAY_BOF_CLIFF': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'BOYCOTT_CENSOR_FRICTION': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'REVIEW_SMEAR_ASTROTURF': return <Bot className="w-4 h-4 text-cyan-400" />;
      case 'EXHIBITOR_SCREEN_CANNIBALIZATION': return <Film className="w-4 h-4 text-purple-400" />;
      case 'PIRACY_CAMRIP_LEAKS': return <Radio className="w-4 h-4 text-emerald-400" />;
      default: return <Ticket className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* =========================================================================
          1. TOP EXECUTIVE COCKPIT: CINEMA DAMAGE CONTROL POSTURE & EXPOSURE
      ========================================================================= */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#091120] via-[#070c18] to-[#040810] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 via-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/60 shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                  {algorithmVersion || 'CDCE v3.0 Cinema Damage Control'}
                </span>
                <span className="text-slate-600 font-light">•</span>
                <span className="text-xs text-slate-400 font-mono">IST Evaluated: {istTimestamp}</span>
              </div>
              <h2 className="text-lg md:text-xl font-black tracking-wide text-white uppercase flex items-center gap-2 mt-0.5">
                <span>Theatrical Damage Control Command Center</span>
                <span className="text-slate-600 font-light">//</span>
                <span className="text-cyan-300 font-mono">{movieTitle}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSimLab(!showSimLab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                showSimLab
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/50'
                  : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:border-purple-500/40'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-purple-300" />
              <span>{showSimLab ? 'Hide Damage Simulator' : 'Simulate Damage Control (What-If)'}</span>
            </button>
          </div>
        </div>

        {/* Executive Damage Control KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-5">
          
          {/* Card 1: Active Posture */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[0.68rem] font-mono uppercase tracking-wider">
              <span>Containment Posture</span>
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-white leading-tight">
                {stage4_hierarchyGate?.postureName || 'Existential Triage'}
              </div>
              <div className="mt-1.5">
                {getTierBadge(stage4_hierarchyGate?.tierCode)}
              </div>
            </div>
          </div>

          {/* Card 2: Composite Risk Score (CRS) */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[0.68rem] font-mono uppercase tracking-wider">
              <span>Composite Threat (CRS)</span>
              <Scale className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black font-mono ${getRiskColor(stage3_factorMatrix?.compositeRiskScore || 0)}`}>
                  {stage3_factorMatrix?.compositeRiskScore || 0}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getProgressBarColor(stage3_factorMatrix?.compositeRiskScore || 0)}`}
                  style={{ width: `${stage3_factorMatrix?.compositeRiskScore || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Top Threat Channel */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[0.68rem] font-mono uppercase tracking-wider">
              <span>#1 Damage Channel</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-red-300 truncate">
                {topVulnerability?.vectorName || 'Monday Box Office Cliff'}
              </div>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-[0.68rem]">
                <span className="text-red-400 font-bold">{topVulnerability?.threatScore || 80}/100</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{topVulnerability?.status || 'CRITICAL'}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Monday Hold Projection */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[0.68rem] font-mono uppercase tracking-wider">
              <span>Monday Retention</span>
              <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold font-mono text-cyan-300">
                {stage3_factorMatrix?.dimensions?.financialHazard?.projectedMondayHold || '55%–62%'}
              </div>
              <p className="text-[0.65rem] text-slate-400 font-mono mt-1">
                At Risk: {stage3_factorMatrix?.dimensions?.financialHazard?.capitalAtRisk || '₹15 Cr'}
              </p>
            </div>
          </div>

          {/* Card 5: Critical Operational Order */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-[0.68rem] font-mono uppercase tracking-wider">
              <span>Immediate Order</span>
              <Clock className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold font-mono text-purple-300 truncate">
                {prescription?.operationalOrders?.[0]?.title || 'Digital KDM Surgery'}
              </div>
              <p className="text-[0.65rem] text-slate-400 font-mono mt-1">
                Horizon: {stage4_hierarchyGate?.timeToIntervention || 'Within 4 Hours'}
              </p>
            </div>
          </div>

        </div>

        {/* Top Operational Order Alert */}
        <div className="mt-4 p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
            <div>
              <span className="text-[0.7rem] uppercase font-mono tracking-wider font-bold text-red-400">
                Executive Action Directive ({prescription?.primaryAction?.title}):
              </span>
              <div className="text-xs font-bold text-white mt-0.5">
                {prescription?.primaryAction?.rationale}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {prescription?.primaryAction?.expectedImpact}
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          CINEMA DAMAGE CONTROL SIMULATION LAB (What-If Interactive Stress-Tester)
      ========================================================================= */}
      {showSimLab && (
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#120a1f] to-[#090510] shadow-xl animate-scale-up">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                Cinema Damage Control Simulator (Interactive What-If Testbed)
              </h3>
            </div>
            <span className="text-[0.65rem] font-mono text-slate-400">
              Simulate studio damage-control interventions on live theatrical metrics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 mb-4">
            
            {/* Toggle 1: KDM Cut */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Digital KDM Cut (-10m)</span>
                <span className="text-[0.68rem] text-slate-400">Removes 2nd half drag</span>
              </div>
              <button
                onClick={() => setSimKdmTrimApplied(!simKdmTrimApplied)}
                className={`mt-2.5 py-1 px-2.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  simKdmTrimApplied ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {simKdmTrimApplied ? '✓ Cut Active (-14)' : '+ Issue KDM Cut'}
              </button>
            </div>

            {/* Toggle 2: Boycott Clarification */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Diplomatic PR Reel</span>
                <span className="text-[0.68rem] text-slate-400">Arrests boycott friction</span>
              </div>
              <button
                onClick={() => setSimBoycottDefused(!simBoycottDefused)}
                className={`mt-2.5 py-1 px-2.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  simBoycottDefused ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {simBoycottDefused ? '✓ Defused (-22)' : '+ Deploy PR Reel'}
              </button>
            </div>

            {/* Toggle 3: Subvention Pricing */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Weekday ₹99 Pass</span>
                <span className="text-[0.68rem] text-slate-400">Boosts Tue-Thu footfalls</span>
              </div>
              <button
                onClick={() => setSimSubventionActive(!simSubventionActive)}
                className={`mt-2.5 py-1 px-2.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  simSubventionActive ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {simSubventionActive ? '✓ ₹99 Active (-10)' : '+ Enable ₹99'}
              </button>
            </div>

            {/* Toggle 4: Anti-Piracy Injunction */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Telegram Hash Wipe</span>
                <span className="text-[0.68rem] text-slate-400">Blocks 85% camrip links</span>
              </div>
              <button
                onClick={() => setSimPiracyBlocked(!simPiracyBlocked)}
                className={`mt-2.5 py-1 px-2.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  simPiracyBlocked ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {simPiracyBlocked ? '✓ Links Wiped (-8)' : '+ File Injunction'}
              </button>
            </div>

            {/* Toggle 5: Exhibitor Prime Defense */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Exhibitor Prime Slot Deal</span>
                <span className="text-[0.68rem] text-slate-400">Locks 6PM & 9:30PM shows</span>
              </div>
              <button
                onClick={() => setSimExhibitorProtected(!simExhibitorProtected)}
                className={`mt-2.5 py-1 px-2.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  simExhibitorProtected ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {simExhibitorProtected ? '✓ Slots Locked (-12)' : '+ Lock Shows'}
              </button>
            </div>

          </div>

          {/* Simulation Outcome Banner */}
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300">Simulated Composite Risk Score:</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-mono font-black ${simTier.color}`}>{simCRS}</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
                <span className="text-xs text-slate-400 font-mono">
                  (Baseline: {stage3_factorMatrix?.compositeRiskScore || 0})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Simulated Containment Posture:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${simTier.badge}`}>
                {simTier.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. NAVIGATION TABS FOR CINEMA DAMAGE CONTROL DOMAINS
      ========================================================================= */}
      <div className="flex items-center gap-1.5 bg-[#080d18] p-1.5 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
        {[
          { id: 'vectors', label: '1. The 7 Damage Vectors Diagnostic', icon: AlertTriangle },
          { id: 'orders', label: '2. Studio Operational Orders', icon: FileText },
          { id: 'matrix', label: '3. AHP Multi-Factor Matrix', icon: Scale },
          { id: 'hierarchy', label: '4. Containment Hierarchy Ladder', icon: Layers },
          { id: 'countermeasures', label: '5. Optimized Interventions', icon: Sparkles },
          { id: 'playbook', label: '6. 24h Playbook & Media Guardrails', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40 ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          DOMAIN 1: THE 7 CRITICAL CINEMA DAMAGE VECTORS (CDV DIAGNOSTIC)
      ========================================================================= */}
      {activeTab === 'vectors' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                The 7 Existential Cinema Damage Vectors (Theatrical Threat Audit)
              </h3>
              <p className="text-[0.7rem] text-slate-400 font-mono">
                Systematic surveillance of all 7 theatrical damage channels active in Indian film distribution
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                {stage2_damageVectors?.criticalVectorsCount || 0} Critical
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {stage2_damageVectors?.elevatedVectorsCount || 0} Elevated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {damageVectors.map((v) => {
              const isTop = topVulnerability?.id === v.id;
              return (
                <div
                  key={v.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isTop
                      ? 'bg-gradient-to-b from-red-950/40 to-[#0a0f18] border-red-500/60 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40'
                      : v.status === 'CRITICAL'
                      ? 'bg-red-950/15 border-red-500/30'
                      : v.status === 'ELEVATED'
                      ? 'bg-amber-950/15 border-amber-500/30'
                      : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getVectorIcon(v.code)}
                        <span className="text-xs font-bold text-white leading-tight">
                          {v.vectorName}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[0.62rem] font-mono font-bold ${
                        v.status === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' : v.status === 'ELEVATED' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[0.68rem] text-slate-400 font-mono">Threat Exposure:</span>
                      <span className="text-sm font-mono font-black text-white">{v.threatScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full ${getProgressBarColor(v.threatScore)}`}
                        style={{ width: `${v.threatScore}%` }}
                      />
                    </div>

                    <p className="text-[0.72rem] text-slate-300 leading-relaxed mb-3">
                      {v.damageMechanism}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-[0.68rem] font-mono">
                      <span className="text-slate-400">Financial Exposure:</span>
                      <span className="text-amber-400 font-bold">{v.financialExposure}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[0.68rem] font-mono text-cyan-300">
                      <span className="text-slate-400 block text-[0.62rem] uppercase">Specific Damage Control:</span>
                      {v.specificIntervention}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 2: STUDIO OPERATIONAL ORDERS (Actionable Theatrical Directives)
      ========================================================================= */}
      {activeTab === 'orders' && prescription?.operationalOrders && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Actionable Studio Damage-Control Operational Directives ({prescription.operationalOrders.length})
              </h3>
              <p className="text-[0.7rem] text-slate-400 font-mono">
                Official operational orders dispatched to digital lab, theater chains, ticketing apps, and legal teams
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[0.68rem] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Real-World Execution Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescription.operationalOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      {ord.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[0.62rem] font-mono font-bold ${
                      ord.priority.includes('CRITICAL') ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-300'
                    }`}>
                      {ord.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">
                    {ord.title}
                  </h4>
                  <div className="text-[0.68rem] font-mono text-purple-300 mb-2">
                    Recipient: <strong>{ord.recipient}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-200 font-sans leading-relaxed mb-3">
                    {ord.instruction}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[0.68rem] text-slate-400 font-mono">
                    Impact: <strong className="text-emerald-400">{ord.impact}</strong>
                  </span>
                  <button
                    onClick={() => handleCopy(ord.instruction, ord.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-[0.65rem] font-mono flex items-center gap-1"
                    title="Copy Directive Instruction"
                  >
                    {copiedKey === ord.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === ord.id ? 'Copied' : 'Copy Order'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 3: AHP MULTI-FACTOR DAMAGE MATRIX
      ========================================================================= */}
      {activeTab === 'matrix' && stage3_factorMatrix && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-[#0a0f18]/80 animate-fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                Multi-Criteria Factor Matrix (Analytic Hierarchy Process)
              </h3>
              <p className="text-[0.7rem] text-slate-400 font-mono">
                Normalized weighted evaluation across 5 deterministic cinema damage dimensions (Sum of Weights = 1.00)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Composite Threat Score:</span>
              <span className={`text-base font-black font-mono ${getRiskColor(stage3_factorMatrix.compositeRiskScore)}`}>
                {stage3_factorMatrix.compositeRiskScore}/100
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Dimension 1: Financial & Box Office Hazard */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">1. Financial Hazard & Box Office Erosion</span>
                  <span className="text-[0.68rem] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                    Weight: 30%
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {stage3_factorMatrix.dimensions.financialHazard.score}/100
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${getProgressBarColor(stage3_factorMatrix.dimensions.financialHazard.score)}`}
                  style={{ width: `${stage3_factorMatrix.dimensions.financialHazard.score}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between text-[0.7rem] text-slate-400 font-mono gap-2">
                <span>Projected Monday Retention: <strong className="text-white">{stage3_factorMatrix.dimensions.financialHazard.projectedMondayHold}</strong></span>
                <span>Revenue at Risk: <strong className="text-amber-400">{stage3_factorMatrix.dimensions.financialHazard.capitalAtRisk}</strong></span>
              </div>
            </div>

            {/* Dimension 2: Narrative Friction & Structural Drag */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">2. Narrative Friction & Controversy Drag</span>
                  <span className="text-[0.68rem] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                    Weight: 25%
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {stage3_factorMatrix.dimensions.narrativeFriction.score}/100
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${getProgressBarColor(stage3_factorMatrix.dimensions.narrativeFriction.score)}`}
                  style={{ width: `${stage3_factorMatrix.dimensions.narrativeFriction.score}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between text-[0.7rem] text-slate-400 font-mono gap-2">
                <span>Pacing Drag: <strong className={stage3_factorMatrix.dimensions.narrativeFriction.hasPacingIssue ? 'text-amber-400' : 'text-emerald-400'}>{stage3_factorMatrix.dimensions.narrativeFriction.hasPacingIssue ? 'DETECTED (KDM TRIM CANDIDATE)' : 'OPTIMAL'}</strong></span>
                <span>Boycott Hazard: <strong className={stage3_factorMatrix.dimensions.narrativeFriction.hasBoycottIssue ? 'text-red-400' : 'text-emerald-400'}>{stage3_factorMatrix.dimensions.narrativeFriction.hasBoycottIssue ? 'ACTIVE CONTROVERSY' : 'NONE'}</strong></span>
              </div>
            </div>

            {/* Dimension 3: Audience vs Critic Divergence */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">3. Audience vs Critic Divergence (Mass vs Class Split)</span>
                  <span className="text-[0.68rem] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                    Weight: 15%
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-purple-400">
                  {stage3_factorMatrix.dimensions.divergenceRisk.score}/100
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${getProgressBarColor(stage3_factorMatrix.dimensions.divergenceRisk.score)}`}
                  style={{ width: `${stage3_factorMatrix.dimensions.divergenceRisk.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[0.7rem] text-slate-400 font-mono">
                <span>Critic vs Viewer Split: <strong className="text-white">{stage3_factorMatrix.dimensions.divergenceRisk.criticAudienceGap}</strong></span>
                <span>Variance: Controlled</span>
              </div>
            </div>

            {/* Dimension 4: Temporal Urgency */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">4. Temporal Urgency (15-Day Theatrical Lifecycle)</span>
                  <span className="text-[0.68rem] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">
                    Weight: 20%
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-blue-400">
                  {stage3_factorMatrix.dimensions.temporalUrgency.score}/100
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${getProgressBarColor(stage3_factorMatrix.dimensions.temporalUrgency.score)}`}
                  style={{ width: `${stage3_factorMatrix.dimensions.temporalUrgency.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[0.7rem] text-slate-400 font-mono">
                <span>Theatrical Lifecycle: <strong className="text-white">{stage3_factorMatrix.dimensions.temporalUrgency.windowPhase}</strong></span>
                <span>Monday Clock: <strong className="text-cyan-400">Urgent Theatrical Window</strong></span>
              </div>
            </div>

            {/* Dimension 5: Intervention Feasibility & Safety */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">5. Intervention Feasibility & Operational Safety</span>
                  <span className="text-[0.68rem] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Weight: 10%
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {stage3_factorMatrix.dimensions.feasibilitySafety.score}/100
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: `${stage3_factorMatrix.dimensions.feasibilitySafety.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[0.7rem] text-slate-400 font-mono">
                <span>Operational Risk: <strong className={stage3_factorMatrix.dimensions.feasibilitySafety.sideEffectRisk === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'}>{stage3_factorMatrix.dimensions.feasibilitySafety.sideEffectRisk}</strong></span>
                <span>Execution Path: Feasible</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 4: 5-TIER DAMAGE CONTAINMENT HIERARCHY LADDER
      ========================================================================= */}
      {activeTab === 'hierarchy' && stage4_hierarchyGate && (
        <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-[#0d0a14]/80 animate-fade-in space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-400" />
                5-Tier Theatrical Damage Containment Hierarchy
              </h3>
              <p className="text-[0.7rem] text-slate-400 font-mono">
                Deterministic threshold gating into prioritized damage containment operational states
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Active Tier:</span>
              {getTierBadge(stage4_hierarchyGate.tierCode)}
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              {
                tier: 1,
                name: 'Tier 1: Existential Damage Containment',
                criteria: 'CRS ≥ 68 or Threat Vector ≥ 82',
                timeframe: 'Under 2 to 4 Hours',
                code: 'TIER_1_EMERGENCY_TRIAGE',
                action: 'Emergency producer statement, anti-piracy court injunction, rapid distributor KDM sync'
              },
              {
                tier: 2,
                name: 'Tier 2: Structural Theatrical Modification',
                criteria: 'CRS ≥ 50 or Pacing Drag Detected',
                timeframe: 'Within 6 to 12 Hours',
                code: 'TIER_2_STRUCTURAL_MODIFICATION',
                action: 'Digital KDM runtime trim (8-12 min), ticket subvention pricing, prime multiplex slot renegotiation'
              },
              {
                tier: 3,
                name: 'Tier 3: Narrative Re-Anchoring',
                criteria: 'CRS ≥ 38 or High Audience/Critic Split',
                timeframe: 'Within 12 to 24 Hours',
                code: 'TIER_3_NARRATIVE_REANCHORING',
                action: 'Star unannounced theater drops in mass centers, emotional climax footage push, 8-week window affirmation'
              },
              {
                tier: 4,
                name: 'Tier 4: Tactical Grassroots Defense',
                criteria: 'CRS ≥ 25',
                timeframe: 'Next 24 to 48 Hours',
                code: 'TIER_4_TACTICAL_DEFENSE',
                action: 'Amplify organic family reviews, squelch coordinated bot review bombing, sustain weekday single-screens'
              },
              {
                tier: 5,
                name: 'Tier 5: Expansion & Screen Maximization',
                criteria: 'CRS < 25 (Clean Theatrical Hold)',
                timeframe: 'Ongoing Daily Operations',
                code: 'TIER_5_EXPANSION_MAXIMIZATION',
                action: 'Add screens in B&C centers, capture spillover demand, and prepare franchise expansion'
              }
            ].map((t) => {
              const isTriggered = stage4_hierarchyGate.tierCode === t.code;
              return (
                <div
                  key={t.tier}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isTriggered
                      ? 'bg-gradient-to-r from-red-950/40 via-amber-950/20 to-transparent border-red-500/60 shadow-lg shadow-red-950/40 ring-1 ring-red-500/30'
                      : 'bg-white/[0.01] border-white/[0.06] opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                        isTriggered ? 'bg-red-500 text-white font-black' : 'bg-white/5 text-slate-400'
                      }`}>
                        T{t.tier}
                      </div>
                      <div>
                        <span className={`text-xs font-bold ${isTriggered ? 'text-white' : 'text-slate-300'}`}>
                          {t.name}
                        </span>
                        <span className="text-[0.68rem] text-slate-400 font-mono ml-2">
                          [Threshold: {t.criteria}]
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.68rem] text-slate-400 font-mono">Horizon: {t.timeframe}</span>
                      {isTriggered && (
                        <span className="px-2 py-0.5 rounded text-[0.62rem] font-mono font-black bg-red-500 text-white animate-pulse">
                          ACTIVE TRIGGER
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[0.72rem] text-slate-400 font-sans mt-1.5 pl-8">
                    {t.action}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 5: OPTIMIZED THEATRICAL COUNTER-MEASURES
      ========================================================================= */}
      {activeTab === 'countermeasures' && stage5_counterMeasures && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Optimized Cinema Damage-Control Interventions
              </h3>
              <p className="text-[0.7rem] text-slate-400 font-mono">
                Utility function: U = Applicability(0.4) + ROI(0.3) + Speed(0.2) - CostFriction(0.1)
              </p>
            </div>
            <span className="text-xs text-purple-300 font-mono">
              Scored {stage5_counterMeasures.candidateOptionsEvaluated || 6} candidate mitigations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stage5_counterMeasures.topRecommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      RANK #{index + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Utility: {rec.utilityScore}/100
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 leading-tight">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.08] space-y-1.5 text-[0.7rem] font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Expected Lift:</span>
                    <span className="text-emerald-400 font-bold">{rec.expectedRoi}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cost Friction:</span>
                    <span className="text-slate-300">{rec.costFriction}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Execution Speed:</span>
                    <span className="text-cyan-400 font-bold">{rec.executionHorizon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          DOMAIN 6: 24-HOUR PLAYBOOK, MEDIA GUARDRAILS & AUDIT LOG
      ========================================================================= */}
      {activeTab === 'playbook' && prescription && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Chronological 24H Timeline */}
          {prescription.operationalTimeline && (
            <div>
              <h4 className="text-xs font-mono uppercase font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                24-Hour Chronological Damage Control Timetable
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {prescription.operationalTimeline.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                          {item.timeframe}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <h5 className="text-xs font-bold text-white mb-1.5">{item.phase}</h5>
                      <p className="text-[0.72rem] text-slate-400 leading-relaxed mb-3">
                        {item.action}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[0.68rem] font-mono text-slate-400">
                      Owner: <strong className="text-white">{item.owner}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Communication Guardrails */}
          {prescription.mediaGuardrails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* What to Say */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Approved Public Messaging ("What to Say")
                  </span>
                  <span className="text-[0.65rem] font-mono text-emerald-300/80">Affinity Anchors</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {prescription.mediaGuardrails.whatToSay.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span className="italic">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What NEVER to Say */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Strict Prohibitions ("What NEVER to Say")
                  </span>
                  <span className="text-[0.65rem] font-mono text-red-300/80">Zero Tolerance</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {prescription.mediaGuardrails.whatNeverToSay.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="text-red-400 font-bold shrink-0">✗</span>
                      <span className="text-red-200/90">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* Mathematical Audit Trail */}
          {prescription.mathematicalAuditLog && (
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-400">
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-400 font-bold text-[0.7rem] uppercase tracking-wider">
                  Full Mathematical Audit Trail (Verifiable Algorithmic Steps):
                </span>
                <button
                  onClick={() => handleCopy(prescription.mathematicalAuditLog.join('\n'), 'audit-log')}
                  className="text-[0.65rem] text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded transition-all"
                >
                  {copiedKey === 'audit-log' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'audit-log' ? 'Copied Log' : 'Copy Log'}</span>
                </button>
              </div>
              <div className="space-y-1 text-[0.7rem]">
                {prescription.mathematicalAuditLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">[{idx + 1}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
