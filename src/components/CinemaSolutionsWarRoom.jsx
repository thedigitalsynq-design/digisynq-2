// src/components/CinemaSolutionsWarRoom.jsx
// FIRST-OF-ITS-KIND CINEMA DAMAGE-CONTROL & STRATEGIC WAR-ROOM SUITE
// Realtime tactical intelligence for Indian Cinema theatrical runs

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingDown, 
  Bot, 
  Scale, 
  MapPin, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ArrowUpRight, 
  DollarSign, 
  Zap, 
  ShieldCheck,
  Cpu,
  Briefcase
} from 'lucide-react';
import DecisionMatrixView from './DecisionMatrixView';
import CinemaDamageControlProducts from './CinemaDamageControlProducts';

export default function CinemaSolutionsWarRoom({ solutions, movieTitle, decisionIntelligence }) {
  const [activeTab, setActiveTab] = useState('decisionMatrix');
  const [copiedKey, setCopiedKey] = useState(null);

  if (!solutions && !decisionIntelligence) return null;

  const { playbook, boxOfficeForecaster, smearForensics, divergenceMatrix, territoryPulse } = solutions || {};

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getUrgencyBadge = (level) => {
    switch (level) {
      case 'CRITICAL_INTERVENTION_REQUIRED':
        return <span className="badge badge-critical animate-pulse">Critical Intervention Required</span>;
      case 'ELEVATED_PREVENTATIVE_ACTION':
        return <span className="badge badge-warning">Elevated Preventative Action</span>;
      default:
        return <span className="badge badge-info">Routine Tactical Monitoring</span>;
    }
  };

  return (
    <div className="glass-panel p-6 border border-cyan-500/30 relative overflow-hidden my-6 bg-gradient-to-b from-[#0c1322] to-[#070b13]">
      {/* Background glow effect */}
      <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
            <Zap className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-black tracking-wider uppercase text-white flex items-center gap-2">
                <span className="text-red-400 font-mono">CDC</span>
                <span className="text-slate-500 font-light">/</span>
                <span>Tactical Damage-Control War-Room</span>
              </h2>
              <span className="badge badge-critical text-[0.65rem] py-0.5 animate-pulse">Incident Mitigation</span>
              {playbook && getUrgencyBadge(playbook.urgencyLevel)}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live Crisis Containment Protocols, Box Office Loss Prevention & Anti-Smear Forensics for "{movieTitle}"
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-[#080d18] p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
          
          {/* Flagship Decision Matrix Engine Tab */}
          <button
            onClick={() => setActiveTab('decisionMatrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'decisionMatrix'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/40 ring-1 ring-cyan-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-300" />
            <span>Decision Matrix (AHP)</span>
            <span className="px-1 py-0.2 rounded text-[0.6rem] font-mono bg-cyan-400/20 text-cyan-200">v2.5</span>
          </button>

          {/* Operational Crisis Arsenal Tab */}
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-rose-300" />
            <span>Crisis Arsenal</span>
            <span className="px-1 py-0.2 rounded text-[0.6rem] font-mono bg-rose-400/20 text-rose-200">4 Tools</span>
          </button>

          <button
            onClick={() => setActiveTab('playbook')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'playbook'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Damage-Control Playbook</span>
          </button>

          <button
            onClick={() => setActiveTab('boxoffice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'boxoffice'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Monday Test & Hazard</span>
          </button>

          <button
            onClick={() => setActiveTab('forensics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'forensics'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AstroTurf & Bot Forensics</span>
          </button>

          <button
            onClick={() => setActiveTab('divergence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'divergence'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Mass vs Class Index</span>
          </button>

          <button
            onClick={() => setActiveTab('territory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'territory'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Pan-India Territories</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">

        {/* 0. STATE-OF-THE-ART DECISION MATRIX ENGINE */}
        {activeTab === 'decisionMatrix' && (
          <DecisionMatrixView
            decisionData={decisionIntelligence}
            movieTitle={movieTitle}
          />
        )}

        {/* 0.5 OPERATIONAL CRISIS PRODUCTS & ARSENAL */}
        {activeTab === 'products' && (
          <CinemaDamageControlProducts
            movieTitle={movieTitle}
            movieData={{
              identity: { title: movieTitle },
              liveState: {
                reputationRiskScore: decisionIntelligence?.stage3_factorMatrix?.compositeRiskScore || 45,
                positiveMomentum: 55,
                negativeMomentum: 30,
                activeIssues: solutions?.playbook?.primaryCrisisFocus ? [{ title: solutions.playbook.primaryCrisisFocus, severity: 'HIGH' }] : []
              },
              scoringSuite: {
                coreIndices: {
                  rabs: 82
                }
              }
            }}
          />
        )}

        {/* 1. TACTICAL DAMAGE-CONTROL PLAYBOOK */}
        {activeTab === 'playbook' && playbook && (
          <div className="space-y-6 animate-fade-in">
            {/* Actionable Interventions Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Prescriptive Tactical Interventions ({playbook.actionableProtocols.length})
                </h3>
                <span className="text-[0.7rem] text-slate-400 font-mono">
                  Targeted for Next 12–48 Hours
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playbook.actionableProtocols.map((proto) => (
                  <div key={proto.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 uppercase font-semibold">
                          {proto.category}
                        </span>
                        <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded font-bold ${
                          proto.priority === 'IMMEDIATE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {proto.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{proto.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {proto.prescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[0.7rem] font-mono text-slate-400">
                      <span>Window: <strong className="text-slate-200">{proto.targetWindow}</strong></span>
                      <span className="text-emerald-400 font-semibold">{proto.projectedSentimentRecovery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Talent & Press Speaking Points */}
            <div className="p-4 rounded-xl bg-[#090e1a] border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Talent & Executive Press Briefing Points
                </h4>
                <span className="text-[0.68rem] text-slate-500 font-mono">City Press Meets & Interviews</span>
              </div>
              <div className="space-y-2.5">
                {playbook.talentTalkingPoints.map((point, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 text-xs text-slate-300">
                    <p className="italic font-serif leading-relaxed">"{point}"</p>
                    <button
                      onClick={() => handleCopy(point, `point-${idx}`)}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white shrink-0 transition-colors"
                      title="Copy talking point"
                    >
                      {copiedKey === `point-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Studio Counter-Narrative Draft */}
            {playbook.counterNarrativeBrief && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.68rem] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Official Studio Counter-Narrative Draft
                  </span>
                  <button
                    onClick={() => handleCopy(playbook.counterNarrativeBrief.draftStatement, 'statement')}
                    className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors border border-cyan-500/30"
                  >
                    {copiedKey === 'statement' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Press Draft</span>
                      </>
                    )}
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{playbook.counterNarrativeBrief.headline}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-black/30 p-3 rounded-lg border border-white/5">
                  {playbook.counterNarrativeBrief.draftStatement}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 2. BOX OFFICE MONDAY TEST & DROP HAZARD */}
        {activeTab === 'boxoffice' && boxOfficeForecaster && (
          <div className="space-y-6 animate-fade-in">
            {/* Synchronized CDCE v3.0 Monday Hold & Exposure Banner */}
            {decisionIntelligence?.stage3_factorMatrix?.dimensions?.financialHazard && (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                  <span className="text-slate-300">Synchronized Theatrical Hold:</span>
                  <strong className="text-cyan-300 font-bold">
                    {decisionIntelligence.stage3_factorMatrix.dimensions.financialHazard.projectedMondayHold}
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Total Capital Exposure:</span>
                  <strong className="text-amber-400 font-bold">
                    {decisionIntelligence.stage3_factorMatrix.dimensions.financialHazard.capitalAtRisk}
                  </strong>
                </div>
              </div>
            )}

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Monday Test Survival Probability
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-cyan-300">
                    {boxOfficeForecaster.mondaySurvivalProbability}%
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {boxOfficeForecaster.mondaySurvivalVerdict}
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${boxOfficeForecaster.mondaySurvivalProbability}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Weekend 2 Retention Factor
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-400">
                    {boxOfficeForecaster.weekend2RetentionFactor}
                  </span>
                  <span className="text-xs text-slate-400">of Week 1 Gross</span>
                </div>
                <p className="text-[0.7rem] text-slate-400 font-mono mt-2">
                  Derived from WOM velocity & repeat-audience sentiment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Screen-Drop Hazard Index
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-extrabold font-mono ${
                    boxOfficeForecaster.screenDropHazardIndex >= 60 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {boxOfficeForecaster.screenDropHazardIndex}/100
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {boxOfficeForecaster.screenDropStatus}
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${boxOfficeForecaster.screenDropHazardIndex >= 60 ? 'bg-red-500' : 'bg-amber-400'}`}
                    style={{ width: `${boxOfficeForecaster.screenDropHazardIndex}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Ticket Pricing Recalibration Strategy */}
            <div className="p-4 rounded-xl bg-[#090e1a] border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Recommended Ticket Pricing & Screen Programming Strategy
                </h4>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 mt-2">
                <div className="text-sm font-bold text-amber-300 mb-1">
                  {boxOfficeForecaster.pricingStrategy}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {boxOfficeForecaster.pricingRationale}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. ASTROTURF & BOT FORENSICS */}
        {activeTab === 'forensics' && smearForensics && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Score & Certificate Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 lg:col-span-1 flex flex-col justify-between">
                <div>
                  <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Bot Attack / Smear Probability
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-cyan-300 my-1">
                    {smearForensics.botAttackProbability}%
                  </div>
                  <span className={`badge ${
                    smearForensics.astroturfLevel === 'ORGANIC_DISCOURSE' ? 'badge-success' : 'badge-warning'
                  } text-[0.68rem]`}>
                    {smearForensics.astroturfLevel}
                  </span>
                </div>
                <p className="text-[0.7rem] text-slate-400 font-mono mt-3 pt-3 border-t border-white/5">
                  Calculated using lexical repetition, velocity spikes & source integrity.
                </p>
              </div>

              {/* Verified Authenticity Certificate */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/20 to-cyan-950/30 border border-emerald-500/30 lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      Public Discourse Authenticity Certificate
                    </span>
                  </div>
                  <span className="font-mono text-[0.68rem] text-slate-400">
                    ID: {smearForensics.authenticityAudit.certificateId}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed mb-3">
                  {smearForensics.authenticityAudit.shareableBadgeSummary}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-emerald-500/20 text-slate-300">
                  <span>Organic Public Ratio: <strong className="text-emerald-400">{smearForensics.authenticityAudit.organicDiscourseScore}</strong></span>
                  <span>Flagged Anomaly: <strong className="text-cyan-300">{smearForensics.authenticityAudit.botAttackProbability}</strong></span>
                </div>
              </div>
            </div>

            {/* Forensic Checks Breakdown */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                Automated Forensic Checks ({smearForensics.forensicFindings.length})
              </h4>
              <div className="space-y-2">
                {smearForensics.forensicFindings.map((f, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white mb-0.5">{f.check}</div>
                      <p className="text-slate-300 text-[0.72rem]">{f.detail}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[0.65rem] font-mono shrink-0 ${
                      f.status === 'CLEAN' || f.status === 'ORGANIC_SPREAD' || f.status === 'HIGH_INTEGRITY'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MASS VS CLASS DIVERGENCE */}
        {activeTab === 'divergence' && divergenceMatrix && (
          <div className="space-y-6 animate-fade-in">
            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Grassroots Audience Word-of-Mouth
                  </span>
                  <div className={`text-4xl font-extrabold font-mono ${
                    divergenceMatrix.audienceScore >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {divergenceMatrix.audienceScore > 0 ? '+' : ''}{divergenceMatrix.audienceScore}%
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 font-mono">
                  Synthesized from verified theater reactions, audience discussions & social chatter.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Mainstream Trade & Critic Reception
                  </span>
                  <div className={`text-4xl font-extrabold font-mono ${
                    divergenceMatrix.mediaScore >= 0 ? 'text-cyan-400' : 'text-red-400'
                  }`}>
                    {divergenceMatrix.mediaScore > 0 ? '+' : ''}{divergenceMatrix.mediaScore}%
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 font-mono">
                  Synthesized from trade outlets, major publication reviews & film critics.
                </p>
              </div>
            </div>

            {/* Polarization Diagnosis & Marketing Pivot */}
            <div className="p-4 rounded-xl bg-[#090e1a] border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.68rem] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Polarization Diagnosis: {divergenceMatrix.divergenceLabel}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Divergence Gap: <strong className="text-white">{divergenceMatrix.divergenceGap}%</strong>
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 mt-2">
                <div className="text-xs font-bold text-amber-300 font-mono mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Strategic Marketing Asset Pivot Advisory:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {divergenceMatrix.marketingPivot}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. PAN-INDIA TERRITORIES */}
        {activeTab === 'territory' && territoryPulse && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Territory-by-Territory Indian Theatrical Pulse ({territoryPulse.length})
              </h4>
              <span className="text-[0.7rem] text-slate-500 font-mono">Pan-India Circuit Analysis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {territoryPulse.map((t) => (
                <div key={t.code} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-white">{t.territory}</span>
                      <span className={`px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold ${
                        t.pulse >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {t.pulse > 0 ? '+' : ''}{t.pulse}%
                      </span>
                    </div>
                    <span className="text-[0.65rem] font-mono text-cyan-300/80 block mb-2 font-semibold">
                      {t.status}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t.keyLever}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
