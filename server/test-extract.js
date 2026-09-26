// server/test-extract.js
const { XMLParser } = require('fast-xml-parser');

async function testExtract() {
  const url = 'https://news.google.com/rss/search?q=Indian+cinema+box+office+OR+film+OR+movie+review&hl=en-IN&gl=IN&ceid=IN:en';
  const res = await fetch(url);
  const xml = await res.text();
  const parser = new XMLParser();
  const data = parser.parse(xml);
  const items = data.rss?.channel?.item || [];

  const movieMap = new Map();

  const regexes = [
    /['"]([^'"]{2,30})['"]\s*(?:box office|film|movie|collection|review|beats|crosses|starrer|director)/i,
    /^([A-Z0-9][A-Za-z0-9\s:]{2,28}?)\s*(?:worldwide box office|box office collection|box office:|collection day|film review|movie review)/i,
    /^([A-Z0-9][A-Za-z0-9\s:]{2,28}?)\s+Box Office\b/i,
    /(?:film|movie)\s+['"]([^'"]{2,30})['"]/i,
    /watch\s+['"]?([A-Z0-9][A-Za-z0-9\s:]{2,25})['"]?\s+in theatres/i,
    /(?:review|preview):\s*['"]?([A-Z0-9][A-Za-z0-9\s:]{2,25})/i
  ];

  const blacklist = [
    'bollywood', 'box office', 'indian cinema', 'hollywood', 'south indian', 
    'tollywood', 'kollywood', 'ndtv', 'hindustan times', 'times of india',
    'the indian express', 'film', 'movie', 'cinema', 'ott', 'netflix', 'disney',
    'amazon prime', 'hotstar', 'youtube', 'friday', 'saturday', 'sunday'
  ];

  for (const item of items) {
    const rawTitle = item.title?.split(' - ')[0] || '';
    for (const r of regexes) {
      const match = rawTitle.match(r);
      if (match && match[1]) {
        let name = match[1].trim();
        // Clean out trailing punctuation
        name = name.replace(/[.,:;!?'"’]+$/, '').trim();
        const lower = name.toLowerCase();
        
        if (
          name.length >= 3 && 
          name.length <= 30 && 
          !blacklist.includes(lower) &&
          !blacklist.some(b => lower === b || lower === `the ${b}`) &&
          !/^\d+$/.test(name)
        ) {
          // Normalize capitalization
          const norm = name
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
          
          if (!movieMap.has(norm)) {
            movieMap.set(norm, { title: norm, count: 0, items: [] });
          }
          const entry = movieMap.get(norm);
          entry.count++;
          entry.items.push(item);
        }
      }
    }
  }

  const sorted = Array.from(movieMap.values()).sort((a, b) => b.count - a.count);
  console.log('Successfully discovered real-time movies without any hardcoding:');
  sorted.forEach(m => {
    console.log(`- ${m.title} (${m.count} live articles) | e.g. "${m.items[0]?.title}"`);
  });
}

testExtract();
