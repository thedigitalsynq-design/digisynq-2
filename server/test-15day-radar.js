const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser({ ignoreAttributes: false });
const { analyzeSentimentAndTopics } = require('./engine/nlpTaxonomy');

async function testComprehensive() {
  const queries = [
    'box office collection day 1 OR day 2 OR day 3 OR day 4 OR day 5 2026',
    'box office collection day 6 OR day 7 OR day 8 OR day 9 OR day 10 2026',
    'box office collection day 11 OR day 12 OR day 13 OR day 14 OR day 15 2026',
    'theatrical release September 2026 box office Bollywood Tollywood Kollywood'
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

  const blacklist = [
    'bollywood', 'box office', 'indian cinema', 'hollywood', 'south indian',
    'tollywood', 'kollywood', 'ndtv', 'times of india', 'hindustan times',
    'film', 'movie', 'cinema', 'theatrical', 'worldwide', 'closing collection',
    'top 10', 'highest grossing', 'avengers: endgame', 'resident evil', 'chiikawa',
    'friday ott', 'new ott', 'ott releases', 'transformers', 'marathi', 'punjabi',
    'weekend', 'heavy', 'ante sundaraniki', 'action thriller pushed to', 'japan'
  ];

  const movieMap = new Map();

  for (const item of allItems) {
    const headline = item.title?.split(' - ')[0] || '';
    const desc = item.description || '';

    // Must have a Day in theaters between 1 and 15
    const dayHeadlineMatch = headline.match(/\bday\s+([1-9]|1[0-5])\b/i);
    const dayDescMatch = desc.match(/\bday\s+([1-9]|1[0-5])\b/i);
    const oldDayMatch = headline.match(/\bday\s+([2-9][0-9]|1[6-9])\b/i);

    // If day is strictly > 15 (e.g. Day 48, Day 46), skip!
    if (oldDayMatch && !dayHeadlineMatch) continue;

    // Check movie title
    let candidate = null;
    const m1 = headline.match(/['"‘“]([^'"’“”]{2,28})['"’”]\s*(?:box office|day|collection|film|movie|earns|races|crosses|struggling|drops|rises|opens)/i);
    const m2 = headline.match(/^([A-Z0-9][A-Za-z0-9\s:]{2,25}?)\s*(?:worldwide box office|box office collection|box office day|box office:)/i);
    const m3 = headline.match(/([A-Z0-9][A-Za-z0-9\s:]{2,20}?)\s+vs\s+([A-Z0-9][A-Za-z0-9\s:]{2,20}?)\s+Box Office/i);
    const m4 = headline.match(/(?:Nani[’']s|Karthi starrer|Sidharth Malhotra[’']s|Vijay and Pooja Hegde starrer)\s+['"‘“]?([A-Z0-9][A-Za-z0-9\s:]{2,25})/i);

    if (m1) candidate = m1[1];
    else if (m2) candidate = m2[1];
    else if (m3) candidate = m3[1];
    else if (m4) candidate = m4[1];

    if (!candidate) continue;

    let clean = candidate.replace(/\s+(?:worldwide|day\s+\d+|closing collection|teaser|trailer|first look|poster)$/i, '').trim();
    clean = clean.replace(/[.,:;!?'"’“”]+$/, '').trim();
    const lower = clean.toLowerCase();

    if (clean.length < 3 || clean.length > 25) continue;
    if (blacklist.some(b => lower.includes(b))) continue;
    if (/^\d+$/.test(clean)) continue;

    // Normalizing
    let norm = clean
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    if (norm.toLowerCase().includes('mirzapur') || norm.toLowerCase().includes('mizrapur')) {
      norm = 'Mirzapur: The Movie';
    } else if (norm.toLowerCase() === 'the paradise' || norm.toLowerCase().includes('the paradise')) {
      norm = 'The Paradise';
    } else if (norm.toLowerCase().includes('sardar 2')) {
      norm = 'Sardar 2';
    } else if (norm.toLowerCase() === 'im game' || norm.toLowerCase() === "i'm game" || norm.toLowerCase() === 'm game') {
      norm = "I'm Game";
    }

    // Strict extraction: Check headline specifically for day count
    // Example: "'Toxic' box office collection day 15:" or "Mandaadi Box Office Collection Day 10"
    const dayInHeadline = headline.match(/\bday\s+([1-9]|1[0-5])\b/i);
    const dayVal = dayInHeadline ? parseInt(dayInHeadline[1], 10) : null;

    // Check if headline mentions older days (e.g. Day 48, Day 46, Day 35) -> EXCLUDE movie!
    const oldDayInHeadline = headline.match(/\bday\s+([2-9][0-9]|1[6-9])\b/i);
    if (oldDayInHeadline && !dayInHeadline) continue;

    // Box office MUST come from headline first
    const boHeadline = headline.match(/(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?\s*(?:cr(?:ore)?s?|lakhs?))/i);
    const boVal = boHeadline ? boHeadline[0] : null;

    if (!movieMap.has(norm)) {
      movieMap.set(norm, {
        title: norm,
        items: [],
        daysInTheaters: dayVal,
        boxOfficeSummary: boVal,
        latestHeadline: headline,
        latestUrl: item.link || '#',
        latestPublisher: item.source?.['#text'] || 'Indian Press'
      });
    }

    const entry = movieMap.get(norm);
    entry.items.push(item);

    // Current day in theaters is the highest verified day count up to 15 reported in headlines
    if (dayVal && (!entry.daysInTheaters || dayVal > entry.daysInTheaters)) {
      entry.daysInTheaters = dayVal;
    }
    if (boVal && !entry.boxOfficeSummary) {
      entry.boxOfficeSummary = boVal;
    }
  }

  // Filter for movies strictly in the last 15 days window (daysInTheaters <= 15)
  const results = [];
  for (const [title, entry] of movieMap.entries()) {
    if (!entry.daysInTheaters || entry.daysInTheaters > 15) {
      continue; // Strictly enforce <= 15 days
    }

    let pos = 0, neg = 0, con = 0;
    entry.items.forEach(i => {
      const nlp = analyzeSentimentAndTopics(`${i.title} ${i.description || ''}`);
      if (nlp.sentimentLabel === 'POSITIVE') pos++;
      if (nlp.sentimentLabel === 'NEGATIVE') neg++;
      if (nlp.isControversial) con++;
    });

    // Calculate sensible smoothed net sentiment (-75 to +75 range, no artificial +/-100%)
    const rawDiff = pos - neg;
    const denom = Math.max(3, pos + neg + 1);
    const netSentiment = Math.round((rawDiff / denom) * 75);

    // Y: Ingestion velocity (15 to 95)
    const yCoordinate = Math.min(95, Math.max(20, Math.round(entry.items.length * 12 + con * 15 + (16 - entry.daysInTheaters) * 2)));

    // Quadrant
    let quadrant = 'Stable';
    if (yCoordinate >= 50 && netSentiment > 10) quadrant = 'Positive Momentum';
    else if (yCoordinate >= 50 && netSentiment < -10) quadrant = 'Emerging Controversy';
    else if (yCoordinate >= 50) quadrant = 'High Emergence';
    else if (netSentiment > 10) quadrant = 'Favorable Reception';
    else if (netSentiment < -10) quadrant = 'Latent Risk';

    const approxDay = Math.max(1, 25 - entry.daysInTheaters + 1);
    const releaseTiming = `Sept ${approxDay}, 2026 (Day ${entry.daysInTheaters} in theaters)`;

    results.push({
      id: `radar-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title,
      daysInTheaters: entry.daysInTheaters,
      releaseTiming,
      boxOfficeSummary: entry.boxOfficeSummary || 'Tracking',
      signalCount: entry.items.length,
      xCoordinate: netSentiment,
      yCoordinate,
      quadrant,
      netSentiment,
      sentimentStatus: netSentiment > 10 ? 'FAVORABLE_WOM' : netSentiment < -10 ? 'CRITICAL_FRICTION' : 'MIXED_WOM',
      latestHeadline: entry.latestHeadline,
      latestUrl: entry.latestUrl,
      latestPublisher: entry.latestPublisher,
      status: con > 0 ? 'CONTROVERSY_ALERT' : netSentiment > 15 ? 'POSITIVE_MOMENTUM' : 'ACTIVE_RUN'
    });
  }

  // Sort by recency (Day 1, Day 2, etc.) and volume
  results.sort((a, b) => a.daysInTheaters - b.daysInTheaters || b.signalCount - a.signalCount);

  console.log('\n=== FILTERED MOVIES (STRICTLY LAST 15 DAYS) ===');
  console.log(`Found: ${results.length} movies in last 15 days:`);
  results.forEach(m => {
    console.log(`• ${m.title} | ${m.releaseTiming} | BO: ${m.boxOfficeSummary} | Sentiment: ${m.netSentiment}% | Velocity: ${m.yCoordinate} | Sigs: ${m.signalCount}`);
  });
}

testComprehensive();
