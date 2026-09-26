// server/engine/nlpTaxonomy.js
// Specialized Indian Cinema Lexicon and Multi-category Topic Tagger

const POSITIVE_LEXICON = [
  'blockbuster', 'masterpiece', 'goosebumps', 'terrific', 'superb', 'phenomenal',
  'stellar', 'brilliant', 'record-breaking', 'roaring', 'fire', 'chartbuster',
  'sensational', 'gripping', 'compelling', 'powerhouse', 'unmatched', 'peak',
  'clean hit', 'industry hit', 'entertainer', 'must watch', 'praised', 'applauded',
  'lauded', 'loved', 'high energy', 'mindblowing', 'whistle-worthy', 'ovation',
  'racy', 'tight screenplay', 'solid', 'organic word of mouth', 'winner', 'triumph'
];

const NEGATIVE_LEXICON = [
  'disaster', 'flop', 'disappointment', 'disappointing', 'drag', 'lag', 'tedious',
  'bore', 'boring', 'headache', 'cringe', 'wasted', 'letdown', 'overhyped',
  'unbearable', 'cliché', 'predictable', 'mess', 'cluttered', 'poorly executed',
  'half-baked', 'loud', 'senseless', 'horrendous', 'flat', 'mediocre', 'dull',
  'underwhelming', 'fall flat', 'pathetic', 'skip', 'painful', 'botched',
  'poor vfx', 'bad cgi', 'jarring', 'unconvincing', 'plodding'
];

const CONTROVERSY_LEXICON = [
  'boycott', 'ban', 'protest', 'censor cuts', 'cbfc', 'objection', 'fir', 'police complaint',
  'pil', 'court', 'legal notice', 'scam', 'corporate booking', 'fake collections',
  'producer clash', 'dispute', 'plagiarism', 'copied', 'stolen', 'backlash',
  'outrage', 'furious', 'ticket price hike', 'exorbitant rates', 'fan war', 'abuse',
  'caste slur', 'religious sentiment', 'hurt sentiments', 'offensive'
];

const TOPIC_TAXONOMY = {
  PACING_SCREENPLAY: {
    label: 'Screenplay & Pacing',
    keywords: ['second half', 'first half', 'pacing', 'lag', 'drag', 'length', 'runtime', 'editing', 'screenplay', 'climax', 'interval bang', 'storyline', 'plot']
  },
  PERFORMANCE: {
    label: 'Lead Performance & Acting',
    keywords: ['acting', 'performance', 'screen presence', 'swag', 'delivery', 'avatar', 'charismatic', 'actor', 'actress', 'star', 'dialogue', 'character']
  },
  TECHNICAL_CRAFT: {
    label: 'Cinematography & VFX',
    keywords: ['vfx', 'cgi', 'visuals', 'cinematography', 'camera', 'stunts', 'action choreography', 'fight scenes', 'grading', 'frames']
  },
  MUSIC_BGM: {
    label: 'Music & Background Score',
    keywords: ['bgm', 'background score', 'soundtrack', 'songs', 'album', 'thaman', 'anirudh', 'devi sri prasad', 'dsp', 'ar rahman', 'music director']
  },
  BOX_OFFICE: {
    label: 'Theatrical Box Office & Occupancy',
    keywords: ['box office', 'collection', 'opening day', 'day 1', 'advance booking', 'occupancy', 'crores', 'gross', 'worldwide', 'theatrical', 'screens']
  },
  TICKET_PRICING: {
    label: 'Ticket Pricing & Distribution',
    keywords: ['ticket price', 'rates', 'ticket hike', 'expensive', 'multiplex', 'single screen', 'distributor loss', 'recovery', 'budget']
  },
  CONTROVERSY: {
    label: 'Regulatory, Legal & Social Controversy',
    keywords: ['boycott', 'ban', 'censor', 'cbfc', 'fir', 'complaint', 'controversy', 'protest', 'legal', 'backlash', 'outrage', 'clash']
  },
  RELEASE_PROMOTION: {
    label: 'Release Schedule & Promotion',
    keywords: ['release date', 'postponed', 'teaser', 'trailer', 'promotions', 'press meet', 'interview', 'ott', 'streaming partner']
  }
};

function analyzeSentimentAndTopics(text) {
  const lower = (text || '').toLowerCase();
  
  // Calculate positive hits
  let posHits = 0;
  for (const word of POSITIVE_LEXICON) {
    if (lower.includes(word)) posHits++;
  }

  // Calculate negative hits
  let negHits = 0;
  for (const word of NEGATIVE_LEXICON) {
    if (lower.includes(word)) negHits++;
  }

  // Calculate controversy hits
  let conHits = 0;
  for (const word of CONTROVERSY_LEXICON) {
    if (lower.includes(word)) conHits++;
  }

  // Sentiment score in range [-1.0, 1.0]
  const total = posHits + negHits;
  let rawScore = 0;
  if (total > 0) {
    rawScore = (posHits - negHits) / total;
  }

  // Detect topics
  const detectedTopics = [];
  for (const [key, config] of Object.entries(TOPIC_TAXONOMY)) {
    const matchedWords = config.keywords.filter(k => lower.includes(k));
    if (matchedWords.length > 0) {
      detectedTopics.push({
        key,
        label: config.label,
        matches: matchedWords
      });
    }
  }

  return {
    rawScore,
    sentimentLabel: rawScore > 0.15 ? 'POSITIVE' : rawScore < -0.15 ? 'NEGATIVE' : 'NEUTRAL',
    posHits,
    negHits,
    conHits,
    isControversial: conHits >= 1,
    topics: detectedTopics
  };
}

module.exports = {
  POSITIVE_LEXICON,
  NEGATIVE_LEXICON,
  CONTROVERSY_LEXICON,
  TOPIC_TAXONOMY,
  analyzeSentimentAndTopics
};
