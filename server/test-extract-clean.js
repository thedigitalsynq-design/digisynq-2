const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser({ ignoreAttributes: false });
const { analyzeSentimentAndTopics } = require('./engine/nlpTaxonomy');

async function testExtraction() {
  const queries = [
    'box office collection day 1 OR day 2 OR day 3 OR day 4 OR day 5 OR day 6 OR day 7 OR day 8 OR day 9 OR day 10 2026',
    'theatrical release September 2026 box office Bollywood Tollywood Kollywood',
    'movie releases this week September 2026 in theatres',
    'Top South Films to Watch in Theaters September 2026'
  ];

  const allItems = [];
  for (const q of queries) {
    const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(q) + '&hl=en-IN&gl=IN&ceid=IN:en';
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const data = parser.parse(text);
    const items = data.rss?.channel?.item || [];
    const arr = Array.isArray(items) ? items : [items];
    allItems.push(...arr);
  }

  console.log('Total items fetched:', allItems.length);

  const movieMap = new Map();

  // Known blacklists
  const blacklist = [
    'bollywood', 'box office', 'indian cinema', 'hollywood', 'south indian',
    'tollywood', 'kollywood', 'ndtv', 'times of india', 'hindustan times',
    'film', 'movie', 'cinema', 'theatrical', 'worldwide', 'closing collection',
    'top 10', 'highest grossing', 'avengers: endgame', 'resident evil', 'chiikawa',
    'friday ott', 'new ott', 'ott releases', 'transformers'
  ];

  for (const item of allItems) {
    const headline = item.title?.split(' - ')[0] || '';
    const desc = item.description || '';

    // Regex candidates for movie titles
    const candidates = [];

    // Pattern 1: 'Movie Title' box office ...
    const p1 = headline.match(/['"‘“]([^'"’“”]{2,28})['"’”]\s*(?:box office|day|collection|film|movie|earns|races|crosses|struggling)/i);
    if (p1) candidates.push(p1[1]);

    // Pattern 2: Title box office collection day X
    const p2 = headline.match(/^([A-Z0-9][A-Za-z0-9\s:]{2,25}?)\s*(?:worldwide box office|box office collection|box office day|box office:)/i);
    if (p2) candidates.push(p2[1]);

    // Pattern 3: X vs Y Box Office
    const p3 = headline.match(/([A-Z0-9][A-Za-z0-9\s:]{2,20}?)\s+vs\s+([A-Z0-9][A-Za-z0-9\s:]{2,20}?)\s+Box Office/i);
    if (p3) {
      candidates.push(p3[1], p3[2]);
    }

    // Pattern 4: Nani's The Paradise, etc.
    const p4 = headline.match(/(?:Nani[’']s|Karthi starrer|Sidharth Malhotra[’']s)\s+['"‘“]?([A-Z0-9][A-Za-z0-9\s:]{2,25})/i);
    if (p4) candidates.push(p4[1]);

    for (let raw of candidates) {
      raw = raw.replace(/\s+(?:worldwide|day\s+\d+|closing collection|teaser|trailer|first look|poster)$/i, '').trim();
      raw = raw.replace(/[.,:;!?'"’“”]+$/, '').trim();
      const lower = raw.toLowerCase();

      if (raw.length < 3 || raw.length > 25) continue;
      if (blacklist.some(b => lower.includes(b))) continue;
      if (/^\d+$/.test(raw)) continue;

      // Normalize title
      let norm = raw
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      // Canonicalize common variations
      if (norm.toLowerCase().includes('mirzapur') || norm.toLowerCase().includes('mizrapur')) {
        norm = 'Mirzapur: The Movie';
      }
      if (norm.toLowerCase() === 'the paradise' || norm.toLowerCase().includes('the paradise')) {
        norm = 'The Paradise';
      }
      if (norm.toLowerCase() === 'vibe') norm = 'Vibe';
      if (norm.toLowerCase() === 'daayra') norm = 'Daayra';
      if (norm.toLowerCase() === 'haiwaan') norm = 'Haiwaan';
      if (norm.toLowerCase().includes('sardar 2')) norm = 'Sardar 2';
      if (norm.toLowerCase().includes('the vvaan') || norm.toLowerCase() === 'the vvaan') norm = 'The Vvaan';

      // Now check if this headline/item has day in theaters: MUST BE <= 15 days!
      // Strict check: day 1 to day 15
      const dayMatch = headline.match(/\bday\s+([1-9]|1[0-5])\b/i) || desc.match(/\bday\s+([1-9]|1[0-5])\b/i);
      
      // Also check if day > 15 (e.g. Day 48, Day 46) -> EXCLUDE!
      const oldDayMatch = headline.match(/\bday\s+([2-9][0-9]|1[6-9])\b/i);
      if (oldDayMatch) {
        // This is older than 15 days, do not consider as recent release!
        continue;
      }

      // Check box office collection strictly from headline or immediate text of THIS item
      const boMatch = headline.match(/(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?\s*(?:cr(?:ore)?s?|lakhs?))/i) ||
                      desc.match(/(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?\s*(?:cr(?:ore)?s?|lakhs?))/i);

      if (!movieMap.has(norm)) {
        movieMap.set(norm, {
          title: norm,
          items: [],
          days: null,
          boxOffice: null,
          latestHeadline: headline,
          publisher: item.source?.['#text'] || 'Indian Press',
          url: item.link || '#'
        });
      }

      const entry = movieMap.get(norm);
      entry.items.push(item);
      if (dayMatch && !entry.days) {
        entry.days = parseInt(dayMatch[1], 10);
      }
      if (boMatch && !entry.boxOffice) {
        entry.boxOffice = boMatch[0];
      }
    }
  }

  console.log('\n--- EXTRACTED CANDIDATES FOR LAST 15 DAYS ---');
  for (const [title, entry] of movieMap.entries()) {
    // Only accept if days <= 15 OR known to be running in last 15 days
    console.log({
      title,
      daysInTheaters: entry.days || 'Active (This Week)',
      boxOffice: entry.boxOffice || 'Tracking',
      signalCount: entry.items.length,
      latestHeadline: entry.latestHeadline
    });
  }
}

testExtraction();
