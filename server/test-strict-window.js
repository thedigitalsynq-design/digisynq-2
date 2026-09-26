const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser({ ignoreAttributes: false });

async function checkStrictWindow() {
  const queries = [
    'box office collection day 1 OR day 2 OR day 3 OR day 4 OR day 5 2026',
    'box office collection day 6 OR day 7 OR day 8 OR day 9 OR day 10 2026',
    'box office collection day 11 OR day 12 OR day 13 OR day 14 OR day 15 2026',
    'theatrical release September 2026 box office Bollywood Tollywood Kollywood'
  ];

  const now = new Date('2026-09-26T12:00:00Z').getTime();
  const fifteenDaysMs = 15 * 24 * 3600 * 1000;
  const minAllowedDate = now - fifteenDaysMs;

  const allItems = [];
  for (const q of queries) {
    const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(q) + '&hl=en-IN&gl=IN&ceid=IN:en';
    const res = await fetch(url);
    const text = await res.text();
    const data = parser.parse(text);
    const items = data.rss?.channel?.item || [];
    const arr = Array.isArray(items) ? items : [items];
    allItems.push(...arr);
  }

  // Filter ONLY items published in the last 15 days!
  const validItems = allItems.filter(item => {
    if (!item.pubDate) return false;
    const t = new Date(item.pubDate).getTime();
    return !isNaN(t) && t >= minAllowedDate && t <= (now + 86400000);
  });

  console.log(`Total: ${allItems.length}, Published strictly in last 15 days (Sept 11 - Sept 26): ${validItems.length}`);

  const movieMap = new Map();
  const blacklist = [
    'bollywood', 'box office', 'indian cinema', 'hollywood', 'south indian',
    'tollywood', 'kollywood', 'ndtv', 'times of india', 'hindustan times',
    'film', 'movie', 'cinema', 'theatrical', 'worldwide', 'closing collection',
    'top 10', 'highest grossing', 'avengers', 'resident evil', 'chiikawa',
    'friday ott', 'new ott', 'ott releases', 'transformers', 'marathi', 'punjabi',
    'weekend', 'heavy', 'ante sundaraniki', 'action thriller pushed to', 'japan',
    'disney', 'netflix', 'amazon prime', 'hotstar', 'youtube',
    'hanuman ansh', 'neem karoli baba', 'day wise', 'the odyssey'
  ];

  for (const item of validItems) {
    const headline = item.title?.split(' - ')[0] || '';
    const desc = item.description || '';

    // Check for day in headline
    const dayInHeadline = headline.match(/\bday\s+([1-9]|1[0-5])\b/i);
    const dayVal = dayInHeadline ? parseInt(dayInHeadline[1], 10) : null;

    // Check for older day in headline (>15)
    const oldDayInHeadline = headline.match(/\bday\s+([2-9][0-9]|1[6-9])\b/i);
    if (oldDayInHeadline && !dayInHeadline) continue;

    let candidate = null;
    const m1 = headline.match(/['"‘“]([^'"’“”]{2,28})['"’”]\s*(?:box office|day|collection|film|movie|earns|races|crosses|struggling|drops|rises|opens|starrer)/i);
    const m2 = headline.match(/^([A-Z0-9][A-Za-z0-9\s:]{2,25}?)\s*(?:worldwide box office|box office collection|box office day|box office:)/i);
    const m3 = headline.match(/([A-Z0-9][A-Za-z0-9\s:]{2,20}?)\s+vs\s+([A-Z0-9][A-Za-z0-9\s:]{2,20}?)\s+Box Office/i);
    const m4 = headline.match(/(?:Nani[’']s|Karthi starrer|Sidharth Malhotra[’']s|Alia Bhatt starrer)\s+['"‘“]?([A-Z0-9][A-Za-z0-9\s:]{2,25})/i);

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

    const boHeadline = headline.match(/(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?\s*(?:cr(?:ore)?s?|lakhs?))/i);
    const boVal = boHeadline ? boHeadline[0] : null;

    if (!movieMap.has(norm)) {
      movieMap.set(norm, {
        title: norm,
        items: [],
        daysInTheaters: dayVal,
        boxOfficeSummary: boVal,
        latestPubDate: item.pubDate,
        latestHeadline: headline
      });
    }

    const entry = movieMap.get(norm);
    entry.items.push(item);

    if (dayVal && (!entry.daysInTheaters || dayVal > entry.daysInTheaters)) {
      entry.daysInTheaters = dayVal;
    }
    if (boVal && !entry.boxOfficeSummary) {
      entry.boxOfficeSummary = boVal;
    }
  }

  console.log('\n--- VERIFIED MOVIES RELEASED IN LAST 15 DAYS (SEPT 11 - SEPT 26) ---');
  for (const [title, entry] of movieMap.entries()) {
    if (!entry.daysInTheaters || entry.daysInTheaters > 15 || entry.daysInTheaters < 1) continue;
    console.log({
      title,
      daysInTheaters: entry.daysInTheaters,
      boxOffice: entry.boxOfficeSummary || 'Tracking',
      latestPubDate: entry.latestPubDate,
      headline: entry.latestHeadline
    });
  }
}

checkStrictWindow();
