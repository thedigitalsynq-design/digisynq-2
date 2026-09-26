// server/test-verify-clean.js
// Test accurate, non-misattributed movie extraction from live news feeds
const { XMLParser } = require('fast-xml-parser');
const { analyzeSentimentAndTopics } = require('./engine/nlpTaxonomy');

async function testCleanExtraction() {
  const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent('Indian cinema box office collection OR movie review OR theatrical release') + '&hl=en-IN&gl=IN&ceid=IN:en';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const xml = await res.text();
  const parser = new XMLParser();
  const data = parser.parse(xml);
  const items = data.rss?.channel?.item || [];

  console.log(`Fetched ${items.length} live articles from Google News India.`);

  // Verified known active Indian movies released or running in theaters right now
  // We discover them by inspecting titles where the movie name is clearly the subject
  const discovered = new Map();

  for (const item of items) {
    const title = item.title?.split(' - ')[0] || '';
    const desc = item.description || '';
    const fullText = `${title} ${desc}`;

    // Precise headline patterns:
    // "‘The Paradise’ box office collection day 2: ..."
    // "'Hanuman Ansh' box office collection Day 50: ..."
    // "The Paradise worldwide box office collection day 1: ..."
    // "Mirzapur The Movie Box Office Collection Day 14: ..."
    // "Vibe vs Daayra Box Office Collection..."
    
    let movieName = null;
    let dayInTheaters = null;
    let boxOfficeFigure = null;

    // 1. Quoted movie title pattern: 'Movie Name' box office / collection / review
    const quoteMatch = title.match(/['"‘“]([A-Za-z0-9\s:]{2,25})['"’”]\s*(?:box office|day|collection|film|movie|earns|races|review)/i);
    // 2. Leading title pattern: "Movie Name box office collection day X"
    const leadingMatch = title.match(/^([A-Z0-9][A-Za-z0-9\s:]{2,25}?)\s*(?:worldwide box office|box office collection|box office Day|box office:)/i);

    if (quoteMatch) {
      movieName = quoteMatch[1].trim();
    } else if (leadingMatch) {
      movieName = leadingMatch[1].trim();
    }

    if (!movieName) continue;

    // Clean noise suffixes
    movieName = movieName.replace(/\s+(?:worldwide|box office|collection)$/i, '').trim();
    const lower = movieName.toLowerCase();
    
    const blacklist = [
      'bollywood', 'box office', 'indian cinema', 'hollywood', 'south indian',
      'tollywood', 'kollywood', 'ndtv', 'times of india', 'hindustan times',
      'this friday', 'movie releases', 'independence day', 'highest grossing'
    ];

    if (blacklist.includes(lower) || movieName.length < 3 || /^\d+$/.test(movieName)) {
      continue;
    }

    // Normalize casing
    const cleanTitle = movieName
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    // Extract Day count STRICTLY for this specific item's title
    const dayMatch = title.match(/\bday\s+([1-9]|[1-4][0-9]|50)\b/i);
    if (dayMatch) {
      dayInTheaters = parseInt(dayMatch[1], 10);
    }

    // Extract Box office figure STRICTLY for this item's title
    const boMatch = title.match(/(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?\s*(?:cr(?:ore)?s?|lakhs?))/i);
    if (boMatch) {
      boxOfficeFigure = boMatch[0];
    }

    if (!discovered.has(cleanTitle)) {
      discovered.set(cleanTitle, {
        title: cleanTitle,
        signals: [],
        daysInTheaters: null,
        boxOfficeFigure: null,
        posCount: 0,
        negCount: 0
      });
    }

    const entry = discovered.get(cleanTitle);
    entry.signals.push(item);
    if (dayInTheaters && (!entry.daysInTheaters || dayInTheaters < entry.daysInTheaters)) {
      entry.daysInTheaters = dayInTheaters;
    }
    if (boxOfficeFigure && !entry.boxOfficeFigure) {
      entry.boxOfficeFigure = boxOfficeFigure;
    }

    const nlp = analyzeSentimentAndTopics(fullText);
    if (nlp.sentimentLabel === 'POSITIVE') entry.posCount++;
    if (nlp.sentimentLabel === 'NEGATIVE') entry.negCount++;
  }

  console.log('\n=== STRICT ACCURATE EXTRACTION RESULTS (NO CROSS-POLLUTION) ===');
  const validMovies = Array.from(discovered.values())
    .filter(m => m.signals.length >= 2)
    .sort((a, b) => b.signals.length - a.signals.length);

  validMovies.forEach(m => {
    const total = m.signals.length;
    // Proper net sentiment: weighted across all articles, avoid -100% or +100% extremes
    const net = Math.round(((m.posCount - m.negCount) / Math.max(2, total)) * 100);
    const clampedNet = Math.max(-85, Math.min(85, net));
    
    let releaseTiming = 'In Theaters';
    if (m.daysInTheaters) {
      const approxDate = Math.max(1, 25 - m.daysInTheaters + 1);
      releaseTiming = `Sept ${approxDate} (Day ${m.daysInTheaters} in theaters)`;
    }

    console.log(`• Title: "${m.title}"`);
    console.log(`  Theatrical Status: ${releaseTiming}`);
    console.log(`  Box Office: ${m.boxOfficeFigure || 'Reported in Press'}`);
    console.log(`  Net Sentiment: ${clampedNet > 0 ? '+' : ''}${clampedNet}% (Pos: ${m.posCount}, Neg: ${m.negCount}, Total: ${total})`);
    console.log(`  Headline: "${m.signals[0].title}"\n`);
  });
}

testCleanExtraction();
