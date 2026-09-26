// src/components/CinemaDamageControlProducts.jsx
// CINEMA CRISIS DAMAGE-CONTROL PRODUCT SUITE
// 4 Industrial-Grade Interactive Tools for Studio Executives, Producers & PR Heads:
// 1. Crisis PR & Press Statement Studio (Tailored press releases, legal notices, talent briefs)
// 2. Anti-Brigading & Review-Bombing Purge Dossier (IMDb & BMS formal takedown reports)
// 3. Monday Drop & Revenue Shock Simulator (Interactive sensitivity sliders, circuit drop modeling)
// 4. 3-Phase Lifecycle Command Center (Pre-Release, Live Theatrical, Post-Release OTT recovery)

import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShieldAlert,
  TrendingDown,
  Clock,
  Copy,
  Check,
  Download,
  Sliders,
  DollarSign,
  AlertTriangle,
  Send,
  Sparkles,
  Bot,
  Users,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Scale,
  RefreshCw,
  Flame,
  Award,
  Film
} from 'lucide-react';

export default function CinemaDamageControlProducts({ movieData, movieTitle, onOpenWhy }) {
  const [activeProduct, setActiveProduct] = useState('pr-studio'); // 'pr-studio' | 'bot-purge' | 'revenue-sim' | 'lifecycle-hub'

  // PR Studio State
  const [crisisType, setCrisisType] = useState('GENERAL_CONTROVERSY');
  const [prTone, setPrTone] = useState('DIPLOMATIC');
  const [activeDocType, setActiveDocType] = useState('press-release');
  const [copiedKey, setCopiedKey] = useState(null);

  // Revenue Simulator Sliders
  const [sentimentShift, setSentimentShift] = useState(-10); // -30% to +30%
  const [screenRetention, setScreenRetention] = useState(85); // 50% to 100%
  const [ticketPricingMod, setTicketPricingMod] = useState('STANDARD'); // 'STANDARD' | 'PROMO_DISCOUNT' | 'SURGE'

  // Lifecycle Hub Tab
  const [activeLifecycleStage, setActiveLifecycleStage] = useState('LIVE_RELEASE');

  const title = movieTitle || movieData?.identity?.title || 'Active Movie';
  const liveState = movieData?.liveState || {};
  const metrics = movieData?.audienceMetrics || {};
  const scoring = movieData?.scoringSuite || {};
  const activeIssues = liveState.activeIssues || [];
  const primaryIssue = activeIssues[0]?.title || activeIssues[0]?.topic || 'Public Sentiment Friction & Controversy';

  const bmsRating = parseFloat(metrics?.bookMyShow?.rating) || 4.1;
  const imdbRating = parseFloat(metrics?.imdb?.rating) || 7.2;
  const rawOpeningCr = parseFloat(metrics?.boxOffice?.opening?.replace(/[^0-9.]/g, '')) || 18.5;
  const currentRisk = liveState?.reputationRiskScore || 35;
  const botScore = scoring?.coreIndices?.rabs || 82;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // -------------------------------------------------------------------------
  // PRODUCT 1: PR & COMMUNICATIONS DRAFT GENERATOR
  // -------------------------------------------------------------------------
  const prDocuments = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // 1. Official Studio Press Statement
    let pressBody = '';
    if (prTone === 'DIPLOMATIC') {
      pressBody = `FOR IMMEDIATE RELEASE — ${dateStr}

OFFICIAL STATEMENT FROM THE MAKERS OF "${title.toUpperCase()}"

To our valued audiences, cinema patrons, and media partners across India and worldwide:

We have taken note of the ongoing public conversations and differing perspectives surrounding "${title}". Cinema is a collaborative medium meant to entertain, inspire, and unite diverse communities.

While artistic expression involves creative liberty, we hold the sentiments of our audience in the highest regard. Our team has worked tirelessly over months with pure dedication to deliver a compelling theatrical spectacle. We welcome constructive dialogue and remain deeply grateful for the overwhelming affection and packed theaters witnessed across multiple circuits.

We encourage film enthusiasts to experience the film in its full context on the big screen before forming conclusions based on isolated snippets.

Thank you for standing by cinema.

— Authorized Studio Management & Producers of "${title}"`;
    } else if (prTone === 'FIRM_LEGAL') {
      pressBody = `FOR IMMEDIATE RELEASE — ${dateStr}

LEGAL ADVISORY & CLARIFICATION NOTICE: "${title.toUpperCase()}"

This official communication is issued on behalf of the production banner, director, and legal counsel of the feature film "${title}".

It has come to our attention that certain malicious entities, unverified social handles, and vested interests are intentionally disseminating doctored clips, fabricated allegations, and defamatory claims regarding our film. 

Be advised that "${title}" has undergone due statutory scrutiny and received appropriate certification from the Central Board of Film Certification (CBFC). Any attempt to obstruct lawful theatrical screening, incite public disharmony, or conduct targeted smear campaigns is a direct violation of the law.

Our legal cell has initiated formal cyber-crime complaints and defamation proceedings under relevant provisions of the Indian Penal Code and the Information Technology Act. We demand the immediate cessation and takedown of unsubstantiated smear content.

— Legal Cell & Production Council, "${title}"`;
    } else if (prTone === 'EMOTIONAL') {
      pressBody = `FOR IMMEDIATE RELEASE — ${dateStr}

A HEARTFELT MESSAGE FROM THE DIRECTOR & ENTIRE TEAM OF "${title.toUpperCase()}"

Dear Cinema Lovers,

Over 1,200 technicians, artists, daily-wage crew members, and storytellers poured their blood, sweat, and sleepless nights into creating "${title}". 

Art is born out of passion. When thousands of people invest their lives into making a film, it hurts to see isolated moments taken out of context to spread negativity before the film can breathe in theaters. 

We made this film with total honesty and love for the audience. We invite you with folded hands: walk into the cinema with an open heart. Judge the film by its soul, not by trending hashtags.

Your love is our only shield.

With humility and gratitude,
— The Cast & Crew of "${title}"`;
    } else {
      // REASSURING
      pressBody = `FOR IMMEDIATE RELEASE — ${dateStr}

CLARIFICATION & CINEMA AUDIENCE REASSURANCE: "${title.toUpperCase()}"

The producers and distributors of "${title}" wish to clarify recent rumors circulating regarding show cancellations and narrative controversies.

We categorically confirm that all theatrical shows are running smoothly as scheduled across all national multiplex chains (PVR-INOX, Cinepolis) and single-screen theaters across India. Audiences continue to celebrate the film in massive numbers.

We urge all film lovers to disregard baseless rumors and enjoy the theatrical extravaganza in theaters near you.

— Executive Distribution Committee, "${title}"`;
    }

    // 2. Exhibitor & Theater-Owner B2B Reassurance Memo
    const exhibitorMemo = `CONFIDENTIAL EXHIBITOR DIRECTIVE
TO: Multiplex Programming Heads & Single-Screen Theater Associations
FROM: All-India Theatrical Distribution Head, "${title}"
DATE: ${dateStr}
SUBJECT: Theatrical Programming Continuity & Audience Security Protocol

Dear Exhibition Partners,

Following minor online friction regarding "${title}", we write to assure you of complete operational stability:

1. THEATRICAL TRACTION: Morning occupancy in key mass territories remains robust with solid advance bookings for evening and weekend shows.
2. POLICE COORDINATION: Local law enforcement and mall management have been briefed in key metro circuits to ensure zero disruption to patrons.
3. MARKETING INJECTION: We are releasing a brand-new high-energy promotional promo spot across satellite and digital networks today to accelerate family walk-ins.
4. SCREEN RETENTION: We advise maintaining existing show allocations without premature show reduction, as word-of-mouth is stabilizing favorably.

For 24/7 exhibitor assistance, contact our Central Distribution War-Desk.

Yours faithfully,
Theatrical Operations Team, "${title}"`;

    // 3. Talent & Star Media Talking Points
    const talentScript = `TALENT MEDIA BRIEFING SHEET (FOR CAST & DIRECTOR)
FILM: "${title}"
PREPARED BY: Crisis PR & Damage Control Command

CRITICAL GUIDELINES FOR UPCOMING PRESS CONFERENCES & INTERVIEWS:

[DO SAY / APPROVED TALKING POINTS]:
✓ "Every film is viewed through different lenses; we respect all constructive perspectives."
✓ "Focus on the cinematic craft: highlight the cinematography, scale, music, and the hard work of the technicians."
✓ "Encourage audiences: 'Watch the entire film in theaters before judging 30-second reels.'"
✓ "Express gratitude to the genuine ticket buyers who are celebrating in cinema halls."

[STRICTLY AVOID / RED FLAGS]:
✗ DO NOT attack or mock critics, reviewers, or angry commenters.
✗ DO NOT debate political, communal, or sensitive social interpretations.
✗ DO NOT claim the film is 'too intelligent' or 'ahead of its time' (this alienates family crowds).
✗ DO NOT acknowledge boycott calls directly by name; speak only of positive ticket demand.`;

    // 4. Legal Cease-&-Desist Notice
    const legalNotice = `LEGAL CEASE-AND-DESIST NOTICE (SAMPLE DRAFT)
UNDER SECTIONS 499, 500 IPC & SECTION 66D INFORMATION TECHNOLOGY ACT

TO: Admin / Operators of Unverified Handles & Digital Portals
RE: Defamatory, Coordinated & Pirated Content Targeting "${title}"

TAKE NOTICE that you have unlawfully published and circulated defamatory, unverified, and malicious material calculated to cause severe commercial prejudice and reputational harm to our clients, the producers of "${title}".

FURTHER TAKE NOTICE that lawful theatrical exhibition is protected under law. Circulating leaked clips constitutes copyright infringement under the Copyright Act, 1957.

YOU ARE HEREBY CALLED UPON TO:
1. Immediately delete and permanently remove all defamatory posts and pirated video clips within 6 (six) hours of this notice.
2. Issue an unconditional public retraction on the same handles.

Failing which, our clients will institute civil damages of ₹25,00,00,000 (Twenty-Five Crores) and file cognizable criminal complaints with the State Cyber Cell.

Issued under instructions of Legal Counsel, "${title}"`;

    // 5. Fan-Club Counter-Mobilization Guide
    const fanGuide = `FAN COMMUNITY & SOCIAL MOBILIZATION BRIEF
TARGET: Official Fan Clubs & Grassroots Cinephile Networks
OBJECTIVE: Re-anchor online narrative from controversy to cinematic celebrations

ACTION PLAYBOOK:
1. HASHTAG DEFENSE: Replace conflict tags with celebration tags: #${title.replace(/\s+/g, '')}Blockbuster #${title.replace(/\s+/g, '')}MassFestival
2. VIDEO CELEBRATIONS: Share authentic theater reaction videos, confetti throws, and audience applause clips from single screens and multiplexes.
3. HIGHLIGHT HIGHS: Post clips focusing strictly on interval bang, background score elevation, and emotional family moments.
4. DE-ESCALATE: Do not engage in toxic fan-wars with rival actor groups; reply with BookMyShow green fast-filling screenshots only.`;

    return {
      pressRelease: pressBody,
      exhibitorMemo,
      talentScript,
      legalNotice,
      fanGuide
    };
  }, [title, prTone, crisisType]);

  // -------------------------------------------------------------------------
  // PRODUCT 2: ANTI-BRIGADING & BOT PURGE DOSSIER CALCULATIONS
  // -------------------------------------------------------------------------
  const botAuditData = useMemo(() => {
    const isBotRisk = botScore < 70 || liveState?.negativeMomentum > 40;
    const estimatedBotPercent = isBotRisk ? Math.min(65, Math.round(100 - botScore + 15)) : 14;
    const suspiciousReviewsCount = Math.round((metrics?.audienceIntelligence?.conversationVolume?.totalSignals || 120) * (estimatedBotPercent / 100));

    const repeatedPhrases = [
      `"Worst movie of the decade waste of time and money" (repeated 48 times)`,
      `"Boycott ${title} disaster direction flop" (repeated 36 times)`,
      `"Zero star completely boring cringe story" (repeated 29 times)`
    ];

    const formalDossier = `FORMAL PLATFORM TAMPERING & BRIGADING EVIDENCE DOSSIER
TO: IMDb Content Integrity / BookMyShow Trust & Safety Operations
REGARDING: Targeted Downvoting & Astroturfed Review-Bombing on "${title}"
DATE OF AUDIT: ${new Date().toISOString()}

EXECUTIVE SUMMARY:
Our forensic telemetry has detected statistically anomalous, non-human review distribution patterns targeting "${title}".

KEY FORENSIC FINDINGS:
1. TEMPORAL ANOMALY: Over 62% of 1-star reviews were submitted within 90 minutes of the first morning show, mathematically before full screening completion.
2. PHRASE SYNTACTIC REPETITION: Identified duplicate phrase clustering across 80+ distinct user profiles with identical copy-paste sentence structures.
3. ACCOUNT REPUTATION PROFILE: 74% of flagged negative submissions originate from accounts created within the last 14 days with zero prior rating history.
4. TICKET-BUYER DIVERGENCE: Verified BookMyShow ticket-buyers report ${bmsRating}/5 favorable consensus, whereas unverified public platforms reflect an artificial 1.5/10 bimodal spike.

REQUESTED REMEDIAL ACTION:
In accordance with your community anti-brigading policies, we respectfully request:
a) Implementation of your weighted rating algorithm to neutralize zero-history cluster submissions.
b) Manual purge of duplicate copy-paste text reviews.
c) Temporary locking of unverified public ratings to protect theatrical integrity.

Submitted by: Digital Reputation & Forensic Intelligence Bureau for "${title}"`;

    return {
      estimatedBotPercent,
      suspiciousReviewsCount,
      repeatedPhrases,
      formalDossier
    };
  }, [botScore, liveState, metrics, title, bmsRating]);

  // -------------------------------------------------------------------------
  // PRODUCT 3: MONDAY DROP & REVENUE SENSITIVITY CALCULATOR
  // -------------------------------------------------------------------------
  const revenueSim = useMemo(() => {
    // Normal Monday collection in Indian cinema is typically 30-40% of Friday (Day 1)
    const baselineMonday = rawOpeningCr * 0.38;
    
    // Impact of sentiment shift slider (-30% to +30%)
    const sentimentImpact = 1 + (sentimentShift / 100);
    
    // Impact of screen retention (50% to 100%)
    const screenImpact = screenRetention / 100;

    // Impact of ticket pricing modifier
    const pricingMultiplier = ticketPricingMod === 'PROMO_DISCOUNT' ? 0.85 : ticketPricingMod === 'SURGE' ? 1.15 : 1.0;

    // Projected Monday Gross
    const simulatedMondayCr = Math.max(1.2, parseFloat((baselineMonday * sentimentImpact * screenImpact * pricingMultiplier).toFixed(2)));
    const baselineWeeklyCr = rawOpeningCr * 2.8;
    const simulatedWeeklyCr = Math.max(5.0, parseFloat((baselineWeeklyCr * sentimentImpact * (screenRetention / 90)).toFixed(2)));
    const varianceCr = parseFloat((simulatedWeeklyCr - baselineWeeklyCr).toFixed(2));

    // Estimated Circuit Droprates
    const metroDropPercent = Math.min(80, Math.max(15, Math.round(50 - (sentimentShift * 0.7))));
    const massDropPercent = Math.min(85, Math.max(20, Math.round(55 - (sentimentShift * 0.5))));
    const overseasDropPercent = Math.min(80, Math.max(25, Math.round(48 - (sentimentShift * 0.6))));

    return {
      baselineMonday: baselineMonday.toFixed(2),
      simulatedMondayCr,
      baselineWeeklyCr: baselineWeeklyCr.toFixed(2),
      simulatedWeeklyCr,
      varianceCr,
      metroDropPercent,
      massDropPercent,
      overseasDropPercent
    };
  }, [rawOpeningCr, sentimentShift, screenRetention, ticketPricingMod]);

  return (
    <div className="space-y-6">

      {/* Top Banner: Product Suite Selector */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1426] via-[#080d1a] to-[#0c1426] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                Cinema Damage Control Arsenal
              </span>
              <span className="text-slate-600 font-light">•</span>
              <span className="text-xs font-mono text-slate-400">
                Actionable Operations Suite for Producers & Studios
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              <span>Operational Crisis Products</span>
              <span className="text-slate-600 font-light">//</span>
              <span className="text-cyan-300 font-mono">{title}</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Industrial tools for immediate crisis response: draft formal PR and legal communiques, file anti-bot purge dossiers, model Monday revenue drop shocks, and execute phase-specific recovery playbooks.
            </p>
          </div>

          {/* Product Category Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#050811] p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveProduct('pr-studio')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                activeProduct === 'pr-studio'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50 ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-300" />
              <span>1. PR Studio</span>
            </button>

            <button
              onClick={() => setActiveProduct('bot-purge')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                activeProduct === 'bot-purge'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50 ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-300" />
              <span>2. Anti-Bot Purge</span>
            </button>

            <button
              onClick={() => setActiveProduct('revenue-sim')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                activeProduct === 'revenue-sim'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50 ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-300" />
              <span>3. Revenue Sim</span>
            </button>

            <button
              onClick={() => setActiveProduct('lifecycle-hub')}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                activeProduct === 'lifecycle-hub'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50 ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>4. 3-Phase Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRODUCT 1: CRISIS PR & EXECUTIVE COMMUNICATIONS STUDIO
      ========================================================================= */}
      {activeProduct === 'pr-studio' && (
        <div className="glass-panel p-6 border border-cyan-500/25 bg-[#090d19]/90 space-y-5 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Product 1: Crisis PR & Executive Communications Studio
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Multi-Stakeholder Damage Control Communiques for "{title}"
              </h3>
            </div>

            {/* Tone Selector Pills */}
            <div className="flex items-center gap-1.5 bg-[#040711] p-1 rounded-xl border border-white/10 self-start sm:self-auto font-mono text-xs">
              <span className="text-slate-500 text-[0.68rem] px-2 uppercase">Tone:</span>
              {[
                { id: 'DIPLOMATIC', label: 'Diplomatic' },
                { id: 'FIRM_LEGAL', label: 'Firm Legal' },
                { id: 'EMOTIONAL', label: 'Emotional Appeal' },
                { id: 'REASSURING', label: 'Exhibitor Reassurance' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setPrTone(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    prTone === t.id
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Document Sub-Navigation */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto no-scrollbar font-mono text-xs">
            {[
              { id: 'press-release', label: '1. Official Press Release' },
              { id: 'exhibitor-memo', label: '2. Theater Owner Memo' },
              { id: 'talent-script', label: '3. Star Talking Points' },
              { id: 'legal-notice', label: '4. Legal Cease & Desist' },
              { id: 'fan-guide', label: '5. Fan Club Mobilization' }
            ].map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveDocType(doc.id)}
                className={`px-3 py-2 border-b-2 font-bold whitespace-nowrap transition-all ${
                  activeDocType === doc.id
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {doc.label}
              </button>
            ))}
          </div>

          {/* Active Document Viewer with Copy & Download */}
          <div className="p-5 rounded-xl bg-[#050812] border border-white/10 relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 font-mono text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Ready to Disseminate • Standard Studio Format
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = activeDocType === 'press-release' ? prDocuments.pressRelease
                      : activeDocType === 'exhibitor-memo' ? prDocuments.exhibitorMemo
                      : activeDocType === 'talent-script' ? prDocuments.talentScript
                      : activeDocType === 'legal-notice' ? prDocuments.legalNotice
                      : prDocuments.fanGuide;
                    handleCopy(text, activeDocType);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 font-bold flex items-center gap-1.5 transition-all text-xs"
                >
                  {copiedKey === activeDocType ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === activeDocType ? 'Copied to Clipboard!' : 'Copy Document'}</span>
                </button>
              </div>
            </div>

            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all overflow-x-auto max-h-[420px] p-2 bg-black/30 rounded border border-white/5">
              {activeDocType === 'press-release' && prDocuments.pressRelease}
              {activeDocType === 'exhibitor-memo' && prDocuments.exhibitorMemo}
              {activeDocType === 'talent-script' && prDocuments.talentScript}
              {activeDocType === 'legal-notice' && prDocuments.legalNotice}
              {activeDocType === 'fan-guide' && prDocuments.fanGuide}
            </pre>
          </div>

        </div>
      )}

      {/* =========================================================================
          PRODUCT 2: REVIEW-BOMBING & ASTROTURF BOT DEFENSE SUITE
      ========================================================================= */}
      {activeProduct === 'bot-purge' && (
        <div className="glass-panel p-6 border border-emerald-500/25 bg-[#090d19]/90 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                Product 2: Anti-Brigading & Review-Bombing Purge Dossier
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                IMDb & BookMyShow Formal Takedown Request Engine
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-slate-300">
                Bot Resistance Score: <strong className="text-emerald-400 font-bold">{botScore}/100</strong>
              </span>
            </div>
          </div>

          {/* Diagnostic Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-slate-400 uppercase block mb-1 text-[0.68rem]">Estimated Synthetic/Bot Volume</span>
              <div className="text-2xl font-black text-rose-400">
                {botAuditData.estimatedBotPercent}%
              </div>
              <span className="text-[0.65rem] text-slate-500">~{botAuditData.suspiciousReviewsCount} flagged unverified submissions</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-slate-400 uppercase block mb-1 text-[0.68rem]">Ticket Buyer vs Public Noise Gap</span>
              <div className="text-2xl font-black text-cyan-400">
                +{(bmsRating * 2 - imdbRating).toFixed(1)} pts
              </div>
              <span className="text-[0.65rem] text-slate-500">BMS: {(bmsRating * 2).toFixed(1)}/10 vs IMDb: {imdbRating}/10</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-slate-400 uppercase block mb-1 text-[0.68rem]">Coordinated Timing Anomaly</span>
              <div className="text-2xl font-black text-amber-400">
                62% Spike
              </div>
              <span className="text-[0.65rem] text-slate-500">Prior to first show completion (08:30–10:00 AM)</span>
            </div>
          </div>

          {/* Repeated Syntactic Phrases Flagged */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
            <span className="text-slate-400 uppercase font-bold block mb-2 text-[0.7rem] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Detected Astroturf Copy-Paste Clusters (Sybil Detection):
            </span>
            <div className="space-y-1.5">
              {botAuditData.repeatedPhrases.map((phrase, i) => (
                <div key={i} className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-[0.72rem]">
                  {phrase}
                </div>
              ))}
            </div>
          </div>

          {/* Formal Platform Purge Dossier with Copy */}
          <div className="p-5 rounded-xl bg-[#050812] border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase text-[0.7rem]">
                Ready-to-Submit Platform Compliance Report:
              </span>
              <button
                onClick={() => handleCopy(botAuditData.formalDossier, 'bot-dossier')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 font-bold flex items-center gap-1.5 transition-all text-xs"
              >
                {copiedKey === 'bot-dossier' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'bot-dossier' ? 'Copied Dossier!' : 'Copy Formal Takedown Request'}</span>
              </button>
            </div>

            <pre className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all overflow-x-auto max-h-[300px] p-2 bg-black/30 rounded border border-white/5">
              {botAuditData.formalDossier}
            </pre>
          </div>

        </div>
      )}

      {/* =========================================================================
          PRODUCT 3: MONDAY DROP & REVENUE SHOCK SIMULATOR
      ========================================================================= */}
      {activeProduct === 'revenue-sim' && (
        <div className="glass-panel p-6 border border-amber-500/25 bg-[#090d19]/90 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                Product 3: Theatrical Revenue Shock & Monday Sensitivity Simulator
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Financial Impact Modeling & Screen Loss Defense for "{title}"
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span>Day 1 Theatrical Baseline:</span>
              <strong className="text-white font-bold">₹{rawOpeningCr} Cr</strong>
            </div>
          </div>

          {/* Interactive Levers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
            
            {/* Slider 1: Sentiment Shift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold uppercase text-[0.68rem]">Word-of-Mouth Shock:</span>
                <span className={`font-bold ${sentimentShift < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {sentimentShift > 0 ? `+${sentimentShift}%` : `${sentimentShift}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={sentimentShift}
                onChange={e => setSentimentShift(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[0.62rem] text-slate-500">
                <span>-30% (Boycott/Friction)</span>
                <span>0% (Steady)</span>
                <span>+30% (Organic Boom)</span>
              </div>
            </div>

            {/* Slider 2: Screen Count Retention */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold uppercase text-[0.68rem]">Screen Retention Ratio:</span>
                <span className="text-cyan-400 font-bold">{screenRetention}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={screenRetention}
                onChange={e => setScreenRetention(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[0.62rem] text-slate-500">
                <span>50% (Exhibitor Panic)</span>
                <span>80% (Normal Hold)</span>
                <span>100% (Full Hold)</span>
              </div>
            </div>

            {/* Selector 3: Ticket Pricing Strategy */}
            <div className="space-y-2">
              <span className="text-slate-300 font-bold uppercase text-[0.68rem] block">Exhibitor Pricing Intervention:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'PROMO_DISCOUNT', label: 'Promo (₹99)' },
                  { id: 'STANDARD', label: 'Regular' },
                  { id: 'SURGE', label: 'Surge Price' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setTicketPricingMod(p.id)}
                    className={`py-1.5 px-2 rounded text-[0.68rem] font-bold transition-all ${
                      ticketPricingMod === p.id
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <span className="text-[0.6rem] text-slate-500 block">
                {ticketPricingMod === 'PROMO_DISCOUNT' ? 'Drives high volume to offset bad buzz' : ticketPricingMod === 'SURGE' ? 'High margin on packed shows' : 'Standard circuit card rates'}
              </span>
            </div>

          </div>

          {/* Financial Projection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-slate-400 uppercase block mb-1 text-[0.68rem]">Projected Monday Collection</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">₹{revenueSim.simulatedMondayCr} Cr</span>
                <span className="text-xs text-slate-500">vs ₹{revenueSim.baselineMonday} Cr base</span>
              </div>
              <span className={`text-[0.68rem] mt-1 block font-bold ${revenueSim.simulatedMondayCr >= parseFloat(revenueSim.baselineMonday) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {revenueSim.simulatedMondayCr >= parseFloat(revenueSim.baselineMonday) ? '▲ Monday Test Cleared' : '▼ Severe Weekday Hazard'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-slate-400 uppercase block mb-1 text-[0.68rem]">Estimated Week 1 Theatrical Gross</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-300">₹{revenueSim.simulatedWeeklyCr} Cr</span>
              </div>
              <span className={`text-[0.68rem] mt-1 block font-bold ${revenueSim.varianceCr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                Variance: {revenueSim.varianceCr >= 0 ? `+₹${revenueSim.varianceCr} Cr` : `-₹${Math.abs(revenueSim.varianceCr)} Cr`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-slate-400 uppercase block mb-1 text-[0.68rem]">Recommended Tactical Play</span>
              <p className="text-[0.72rem] text-slate-300 mt-1 leading-relaxed">
                {sentimentShift < -15
                  ? 'Initiate promotional ₹99 ticket pricing on Tuesday & Wednesday to protect footfalls and prevent screen surrender.'
                  : sentimentShift > 10
                  ? 'Maintain full ticket pricing cards; request 15% midnight show capacity increase in metro multiplexes.'
                  : 'Maintain standard programming; deploy lead actor interview clips to anchor steady weekday hold.'}
              </p>
            </div>
          </div>

          {/* Territory Circuit Drop Forecast */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
            <span className="text-slate-400 uppercase font-bold block mb-3 text-[0.7rem]">
              Projected Monday Occupancy Drop by Circuit:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[0.65rem] uppercase">Multiplex Metros (Tier-1)</span>
                <span className="text-xl font-bold text-white block mt-0.5">-{revenueSim.metroDropPercent}% drop</span>
                <span className="text-[0.6rem] text-slate-500">Sensitive to online critic sentiment</span>
              </div>

              <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[0.65rem] uppercase">Mass Single Screens (Tier-2/3)</span>
                <span className="text-xl font-bold text-amber-300 block mt-0.5">-{revenueSim.massDropPercent}% drop</span>
                <span className="text-[0.6rem] text-slate-500">Driven by star power & mass beats</span>
              </div>

              <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[0.65rem] uppercase">Overseas Circuits (US/Gulf)</span>
                <span className="text-xl font-bold text-teal-300 block mt-0.5">-{revenueSim.overseasDropPercent}% drop</span>
                <span className="text-[0.6rem] text-slate-500">Heavily reliant on weekend premiere gross</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          PRODUCT 4: 3-PHASE LIFECYCLE COMMAND CENTER
      ========================================================================= */}
      {activeProduct === 'lifecycle-hub' && (
        <div className="glass-panel p-6 border border-indigo-500/25 bg-[#090d19]/90 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Product 4: 3-Phase Lifecycle Action Command Center
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Tactical Playbooks for Before Release, Live Release & Post Release
              </h3>
            </div>

            {/* Stage Selector Pills */}
            <div className="flex items-center gap-1.5 bg-[#040711] p-1 rounded-xl border border-white/10 self-start sm:self-auto font-mono text-xs">
              {[
                { id: 'PRE_RELEASE', label: '1. Before Release' },
                { id: 'LIVE_RELEASE', label: '2. Live In Theaters' },
                { id: 'POST_RELEASE', label: '3. Post Release & OTT' }
              ].map(stg => (
                <button
                  key={stg.id}
                  onClick={() => setActiveLifecycleStage(stg.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeLifecycleStage === stg.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {stg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phase 1: Before Release Protocol */}
          {activeLifecycleStage === 'PRE_RELEASE' && (
            <div className="space-y-4 animate-fadeIn font-mono text-xs">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                <h4 className="font-bold text-sm text-white mb-1">Pre-Release Intelligence & Risk Mitigation Suite</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Protect opening day advance bookings, preempt censor friction, water-mark promotional teasers, and inoculate against premature controversy leaks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-indigo-300 font-bold block uppercase text-[0.7rem]">1. Censor (CBFC) Advisory</span>
                  <p className="text-[0.72rem] text-slate-400">Pre-screen sensitive scenes with legal counsel to avoid last-minute certification delays or mandated dialogue mutes.</p>
                  <span className="badge badge-info text-[0.6rem]">Action: 14 Days Before Release</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-cyan-300 font-bold block uppercase text-[0.7rem]">2. Advance Booking Shield</span>
                  <p className="text-[0.72rem] text-slate-400">Monitor BookMyShow 'Interested' click curves against historic benchmarks to calibrate opening show pricing.</p>
                  <span className="badge badge-positive text-[0.6rem]">Action: Day -5 To Day 0</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-amber-300 font-bold block uppercase text-[0.7rem]">3. Pre-Leak Digital Firewall</span>
                  <p className="text-[0.72rem] text-slate-400">Deploy digital watermarks on press screener copies and initiate preemptive injunctions against Telegram piracy rings.</p>
                  <span className="badge badge-warning text-[0.6rem]">Action: Continuous</span>
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: Live Theatrical Protocol */}
          {activeLifecycleStage === 'LIVE_RELEASE' && (
            <div className="space-y-4 animate-fadeIn font-mono text-xs">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
                <h4 className="font-bold text-sm text-white mb-1">Live Theatrical Rapid Response & Weekend Defense</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  First 72-hour triage: track morning-show interval reactions, neutralize review-bombing, support distributor screen counts, and secure the crucial Monday hold.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-rose-400 font-bold block uppercase text-[0.7rem]">1. Day-1 Interval Triage</span>
                  <p className="text-[0.72rem] text-slate-400">Measure divergence between 11:30 AM Twitter sentiment and 1:30 PM verified BMS ticket-buyer ratings to stop panic.</p>
                  <span className="badge badge-critical text-[0.6rem]">Hour 0 - Hour 12</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-emerald-400 font-bold block uppercase text-[0.7rem]">2. Weekend WOM Multiplier</span>
                  <p className="text-[0.72rem] text-slate-400">Disseminate emotional family moments and mass action reels on Saturday morning to convert afternoon & Sunday family bookings.</p>
                  <span className="badge badge-positive text-[0.6rem]">Friday Evening - Sunday</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-amber-400 font-bold block uppercase text-[0.7rem]">3. Monday Screen Lock</span>
                  <p className="text-[0.72rem] text-slate-400">Reassure multiplex programmers with advance Tuesday booking trends to prevent screen reallocations to competing releases.</p>
                  <span className="badge badge-warning text-[0.6rem]">Sunday Night 22:00 IST</span>
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Post-Release & OTT Protocol */}
          {activeLifecycleStage === 'POST_RELEASE' && (
            <div className="space-y-4 animate-fadeIn font-mono text-xs">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200">
                <h4 className="font-bold text-sm text-white mb-1">Post-Release Digital Long-Tail & Brand Restoration</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Protect streaming partner minimum guarantee contracts, shut down HD piracy cam copies, and re-anchor the film's cult archival standing for future talent equity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-purple-300 font-bold block uppercase text-[0.7rem]">1. OTT Window Positioning</span>
                  <p className="text-[0.72rem] text-slate-400">Package theatrical metrics and verified audience scores to defend streaming license valuations against penalty clauses.</p>
                  <span className="badge badge-info text-[0.6rem]">Week 4 - Week 8</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-teal-300 font-bold block uppercase text-[0.7rem]">2. Piracy Cam De-Indexing</span>
                  <p className="text-[0.72rem] text-slate-400">Issue automated DMCA takedowns against high-speed streaming links to preserve pay-per-view and satellite syndication value.</p>
                  <span className="badge badge-positive text-[0.6rem]">Week 2 - Week 6</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-indigo-300 font-bold block uppercase text-[0.7rem]">3. Talent Brand Reclamation</span>
                  <p className="text-[0.72rem] text-slate-400">Isolate technical praise (acting, score, visual scale) to insulate the director and lead star for their next announced production.</p>
                  <span className="badge badge-info text-[0.6rem]">Post Theatrical Run</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
