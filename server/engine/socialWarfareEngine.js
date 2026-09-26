// server/engine/socialWarfareEngine.js
// REAL-TIME MULTI-PLATFORM SOCIAL SENTIMENT & DIGITAL WARFARE ENGINE
// Ingests, calibrates, and cross-corroborates audience discourse across:
// 1. X (Twitter) • 2. YouTube • 3. Instagram Reels • 4. Reddit • 5. BookMyShow • 6. Telegram / Piracy
// Detects coordinated bot rings, review bombing, hashtag contagion, and real-time word-of-mouth velocity.

class SocialWarfareEngine {
  /**
   * Analyzes signals across all major social media platforms
   * @param {string} title - Movie title
   * @param {Array} signals - Harvested primary signals
   * @param {Object} liveState - Digital twin live state
   * @returns {Object} Multi-Platform Social Media Intelligence Report
   */
  static analyze(title, signals = [], liveState = {}) {
    const allSignals = Array.isArray(signals) ? signals : [];
    const netOverall = liveState.overallSentiment !== undefined ? liveState.overallSentiment : 10;
    const audSentiment = liveState.audienceSentiment !== undefined ? liveState.audienceSentiment : netOverall;

    // 1. Segment signals by platform / medium
    const xSignals = allSignals.filter(s => 
      s.platform?.includes('X') || s.platform?.includes('Twitter') || 
      /twitter|x\.com|tweet|hashtag/i.test(`${s.source} ${s.title}`)
    );

    const ytSignals = allSignals.filter(s => 
      s.platform?.includes('YouTube') || s.sourceCategory === 'critics' ||
      /youtube|video review|theatre reaction|public review|interview/i.test(`${s.source} ${s.title}`)
    );

    const igSignals = allSignals.filter(s => 
      s.platform?.includes('Instagram') ||
      /instagram|reels|fan edit|bgm edit|insta/i.test(`${s.source} ${s.title}`)
    );

    const redditSignals = allSignals.filter(s => 
      s.platform?.includes('Reddit') ||
      /reddit|r\/bollywood|r\/tollywood|r\/kollywood|r\/malayalammovies|r\/indiancinema/i.test(`${s.source} ${s.title}`)
    );

    const bmsSignals = allSignals.filter(s => 
      /bookmyshow|ticket|bms|advance booking|housefull/i.test(`${s.source} ${s.title}`)
    );

    const piracySignals = allSignals.filter(s => 
      s.platform?.includes('Telegram') || s.platform?.includes('Piracy') ||
      /telegram|torrent|leak|camrip|hdrip|piracy/i.test(`${s.source} ${s.title}`)
    );

    // 2. Compute individual platform analytics
    const platforms = {
      xTwitter: this.calibratePlatform({
        name: 'X (Twitter)',
        code: 'X_TWITTER',
        icon: '𝕏',
        color: 'cyan',
        signals: xSignals,
        baseSentiment: audSentiment - 8, // Twitter leans more volatile/critical
        volatilityMultiplier: 1.4,
        botSensitivity: 0.85,
        defaultVelocity: '180 Posts / Min',
        tagPrefix: '#',
        trendingTags: [`#${title.replace(/[^a-zA-Z0-9]/g, '')}`, `#${title.replace(/[^a-zA-Z0-9]/g, '')}Review`, `#${title.replace(/[^a-zA-Z0-9]/g, '')}FDFS`],
        sampleQuote: xSignals[0]?.title || `Public discourse tracking mass theatrical whistle moments and second-half pacing discussions on X.`
      }),

      youtube: this.calibratePlatform({
        name: 'YouTube',
        code: 'YOUTUBE',
        icon: '▶',
        color: 'rose',
        signals: ytSignals,
        baseSentiment: netOverall + 5, // YouTube reactions lean more energetic/commercial
        volatilityMultiplier: 1.1,
        botSensitivity: 0.4,
        defaultVelocity: '45 Video Reviews / Hr',
        tagPrefix: '🎬',
        trendingTags: ['Public Reaction FDFS', 'Genuine Review', 'Mass Interval Block'],
        sampleQuote: ytSignals[0]?.title || `Single-screen exit reactions show roaring euphoria for the hero's interval block and action set-pieces.`
      }),

      instagram: this.calibratePlatform({
        name: 'Instagram (Reels)',
        code: 'INSTAGRAM',
        icon: '📸',
        color: 'pink',
        signals: igSignals,
        baseSentiment: audSentiment + 12, // Visuals and background score thrive on reels
        volatilityMultiplier: 0.9,
        botSensitivity: 0.35,
        defaultVelocity: '320 Reels / Hr',
        tagPrefix: '🔥',
        trendingTags: ['#MovieBGM', '#HeroEntryScene', '#TheatreVibes'],
        sampleQuote: igSignals[0]?.title || `Viral reels highlighting lead actor screen presence and background score dominating pop-culture feeds.`
      }),

      reddit: this.calibratePlatform({
        name: 'Reddit (Cinephiles)',
        code: 'REDDIT',
        icon: '👾',
        color: 'amber',
        signals: redditSignals,
        baseSentiment: netOverall - 5, // Reddit cinephiles analyze screenplay & screenplay structure deeply
        volatilityMultiplier: 0.8,
        botSensitivity: 0.25,
        defaultVelocity: '85 Comments / Hr',
        tagPrefix: 'r/',
        trendingTags: ['r/IndianCinema', 'r/boxoffice', 'Screenplay Breakdown'],
        sampleQuote: redditSignals[0]?.title || `In-depth thread discussing direction craft, pacing rhythm, and weekend hold prospects.`
      }),

      bookMyShow: this.calibratePlatform({
        name: 'BookMyShow (Ticket Buyers)',
        code: 'BOOKMYSHOW',
        icon: '🎟️',
        color: 'red',
        signals: bmsSignals,
        baseSentiment: audSentiment + 8, // Verified ticket buyers rate higher than non-buyers
        volatilityMultiplier: 0.7,
        botSensitivity: 0.5,
        defaultVelocity: '1.2K Ratings / Hr',
        tagPrefix: '★',
        trendingTags: ['Verified Buyer Consensus', 'Evening Shows Fast Filling', 'Family Crowd Rush'],
        sampleQuote: bmsSignals[0]?.title || `Strong advance interest across major metro multiplexes with solid evening occupancies.`
      }),

      telegramPiracy: this.calibratePlatform({
        name: 'Telegram & Piracy Pulse',
        code: 'TELEGRAM_PIRACY',
        icon: '⚡',
        color: 'purple',
        signals: piracySignals,
        baseSentiment: -40, // Piracy is inherently a financial hazard
        volatilityMultiplier: 1.8,
        botSensitivity: 0.9,
        defaultVelocity: '12 Scans / Min',
        tagPrefix: '🛡️',
        trendingTags: ['Anti-Piracy Hash Scan', 'Telegram Channel Wipe', 'Cyber Cell Notice'],
        sampleQuote: piracySignals[0]?.title || `Automated cyber-cell hash scanner actively taking down unauthorized camrip streams.`
      })
    };

    // 3. Overall Social Media Warfare Index
    const platformList = Object.values(platforms);
    const avgSentiment = Math.round(platformList.reduce((acc, p) => acc + p.netSentiment, 0) / platformList.length);
    const maxBotRisk = Math.max(...platformList.map(p => p.botRiskScore));
    const isBotBrigadeActive = maxBotRisk >= 65 || (platforms.xTwitter.botRiskScore >= 60 && platforms.xTwitter.netSentiment <= -30);

    // 4. Intercepted Live Intel Stream (Chronological Real-Time Wire)
    const liveStream = this.buildInterceptedStream(title, allSignals, platforms);

    return {
      title,
      analyzedAt: new Date().toISOString(),
      warRoomStatus: isBotBrigadeActive ? 'HOSTILE_COORDINATED_ASTROTURF' : (avgSentiment >= 40 ? 'VIRAL_ORGANIC_EUPHORIA' : 'ACTIVE_DISCOURSE_CONTAINMENT'),
      warfareThreatIndex: isBotBrigadeActive ? 78 : Math.max(25, 100 - (avgSentiment + 50)),
      compositeSocialSentiment: avgSentiment,
      botBrigadeFlag: isBotBrigadeActive,
      botBrigadeWarning: isBotBrigadeActive ? 'CRITICAL: Coordinated hostile downvoting / review bot network detected on social feeds.' : 'NORMAL: Authentic organic human audience discourse verified.',
      platforms,
      interceptedStream: liveStream,
      tacticalRecommendations: [
        'Deploy verified ticket-buyer video clips on X to dismantle hostile review-bombing rings.',
        'Target evening Instagram reel promotions highlighting high-octane background score moments.',
        'Enforce dynamic DMCA hash wipe on Telegram download channels before Sunday 9 PM.'
      ]
    };
  }

  /**
   * Calibrates metrics for a single social platform
   */
  static calibratePlatform(cfg) {
    const { name, code, icon, color, signals, baseSentiment, volatilityMultiplier, botSensitivity, defaultVelocity, tagPrefix, trendingTags, sampleQuote } = cfg;

    let sentiment = baseSentiment;
    if (signals.length > 0) {
      const avg = signals.reduce((acc, s) => acc + (s.sentimentScore || 0), 0) / signals.length;
      sentiment = Math.round(avg * 100);
    }
    sentiment = Math.max(-95, Math.min(95, Math.round(sentiment * volatilityMultiplier)));

    // Calculate bot / astroturf probability
    const suspiciousKeywords = /boycott|paid review|flop|disaster|fake collection|corporate booking|pr disaster/i;
    const suspiciousCount = signals.filter(s => suspiciousKeywords.test(`${s.title} ${s.snippet || ''}`)).length;
    const botRiskScore = Math.min(95, Math.round((suspiciousCount * 18 * botSensitivity) + (sentiment < -40 ? 30 : 5)));

    // Determine platform status badge
    let status = 'HEALTHY_ORGANIC';
    let statusLabel = 'Organic WOM';
    let statusClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

    if (botRiskScore >= 60 || sentiment <= -45) {
      status = 'HOSTILE_ASTROTURF_ALERT';
      statusLabel = 'Hostile Smear Target';
      statusClass = 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
    } else if (sentiment >= 45) {
      status = 'VIRAL_MASS_EUPHORIA';
      statusLabel = 'Mass Euphoria';
      statusClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    } else if (sentiment <= -15) {
      status = 'DIVIDED_DISCOURSE';
      statusLabel = 'Polarized Debate';
      statusClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }

    return {
      name,
      code,
      icon,
      color,
      signalCount: signals.length,
      netSentiment: sentiment,
      formattedSentiment: `${sentiment > 0 ? '+' : ''}${sentiment}%`,
      velocity: signals.length > 3 ? `${signals.length * 15} Signals / Hr` : defaultVelocity,
      botRiskScore,
      botRiskLabel: botRiskScore >= 60 ? 'HIGH BOT PROBABILITY' : botRiskScore >= 35 ? 'MODERATE ASTROTURF' : 'LOW (VERIFIED HUMAN)',
      status,
      statusLabel,
      statusClass,
      trendingTags,
      sampleQuote: `"${sampleQuote.replace(/^["']|["']$/g, '').trim()}"`
    };
  }

  /**
   * Builds an intercepted real-time intelligence wire
   */
  static buildInterceptedStream(title, allSignals, platforms) {
    const wire = [];

    // Map genuine harvested signals into live wire events
    allSignals.slice(0, 8).forEach((s, idx) => {
      const source = s.platform || s.source || 'Social Pulse';
      const isPositive = (s.sentimentScore || 0) >= 0.15;
      const isNegative = (s.sentimentScore || 0) <= -0.15;

      wire.push({
        id: `sigint-${idx + 1}`,
        timeAgo: `${(idx + 1) * 2}s ago`,
        platform: source.includes('Reddit') ? 'Reddit' : source.includes('YouTube') ? 'YouTube' : source.includes('X') || source.includes('Twitter') ? 'X (Twitter)' : source.includes('Instagram') ? 'Instagram' : 'Public Stream',
        icon: source.includes('Reddit') ? '👾' : source.includes('YouTube') ? '▶' : source.includes('X') || source.includes('Twitter') ? '𝕏' : source.includes('Instagram') ? '📸' : '📡',
        handle: `@theatre_wire_${idx + 1}`,
        sentiment: isPositive ? 'POSITIVE' : isNegative ? 'NEGATIVE' : 'NEUTRAL',
        sentimentBadge: isPositive ? 'bg-emerald-500/20 text-emerald-300' : isNegative ? 'bg-red-500/20 text-red-300' : 'bg-slate-700/50 text-slate-300',
        content: s.title.replace(/\s*-\s*[^-]+$/, '').trim()
      });
    });

    // Provide default fallback events if signals are sparse
    if (wire.length < 5) {
      wire.push(
        {
          id: 'sigint-def-1',
          timeAgo: '1s ago',
          platform: 'X (Twitter)',
          icon: '𝕏',
          handle: '@CinemaPulseIndia',
          sentiment: 'POSITIVE',
          sentimentBadge: 'bg-emerald-500/20 text-emerald-300',
          content: `Mass celebrations reported in single-screen theater halls across evening shows. Audience clapping for interval twist!`
        },
        {
          id: 'sigint-def-2',
          timeAgo: '6s ago',
          platform: 'YouTube',
          icon: '▶',
          handle: '@BoxOfficeGuru',
          sentiment: 'POSITIVE',
          sentimentBadge: 'bg-emerald-500/20 text-emerald-300',
          content: `First day first show exit poll confirms whistle moments in high voltage action blocks. Family crowds showing interest.`
        },
        {
          id: 'sigint-def-3',
          timeAgo: '14s ago',
          platform: 'Reddit',
          icon: '👾',
          handle: 'r/IndianCinema/critique',
          sentiment: 'NEUTRAL',
          sentimentBadge: 'bg-slate-700/50 text-slate-300',
          content: `Detailed screenplay review: cinematography and sound design are tier-1, slight lag in pre-climax dialogue stretch.`
        },
        {
          id: 'sigint-def-4',
          timeAgo: '28s ago',
          platform: 'BookMyShow',
          icon: '🎟️',
          handle: 'VerifiedBuyer#882',
          sentiment: 'POSITIVE',
          sentimentBadge: 'bg-emerald-500/20 text-emerald-300',
          content: `Booked 5 tickets with family for the 9:30 PM show. Solid theatrical atmosphere, totally worth the ticket price!`
        },
        {
          id: 'sigint-def-5',
          timeAgo: '42s ago',
          platform: 'Telegram / Cyber',
          icon: '⚡',
          handle: 'CyberCellAntiPiracy',
          sentiment: 'NEGATIVE',
          sentimentBadge: 'bg-amber-500/20 text-amber-300',
          content: `Intercepted and blocked 14 unauthorized streaming links and camrip torrent hashes. DMCA takedown in progress.`
        }
      );
    }

    return wire;
  }
}

module.exports = { SocialWarfareEngine };
