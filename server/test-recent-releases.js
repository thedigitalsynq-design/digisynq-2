// server/test-recent-releases.js
const { XMLParser } = require('fast-xml-parser');

async function testRecent() {
  const parser = new XMLParser();
  
  // 1. Google News search for recent releases in Indian cinema
  const queries = [
    'Indian movies released in theatres September 2026',
    'films released in September 2026 Bollywood Tollywood Kollywood',
    'movie releases September 2026 box office review',
    'released this Friday September 2026 Indian cinema'
  ];

  for (const q of queries) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const xml = await res.text();
        const data = parser.parse(xml);
        const items = data.rss?.channel?.item || [];
        const arr = Array.isArray(items) ? items : [items];
        console.log(`\n=== Query: "${q}" (${arr.length} items) ===`);
        arr.slice(0, 5).forEach(i => console.log('•', i.title, '| pubDate:', i.pubDate));
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  // 2. Also check Wikipedia monthly lists or Wikipedia recent releases
  const wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=List+of+Hindi+films+of+2026&limit=3&format=json';
  try {
    const res = await fetch(wikiUrl, { headers: { 'User-Agent': 'CinemaIntelligence/1.0' } });
    const data = await res.json();
    console.log('\n=== Wikipedia film list search ===', data);
  } catch (e) {
    console.error(e.message);
  }
}

testRecent();
