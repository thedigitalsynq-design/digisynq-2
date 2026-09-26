const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser();

async function run() {
  const queries = [
    'box office collection day 1 OR day 2 OR day 3 OR day 4 OR day 5 OR day 6 OR day 7 2026',
    'theatrical release September 2026 box office',
    'Indian movies in theatres September 2026',
    'releases this week September 2026'
  ];

  for (const q of queries) {
    const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(q) + '&hl=en-IN&gl=IN&ceid=IN:en';
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const data = parser.parse(text);
    const items = data.rss?.channel?.item || [];
    const arr = Array.isArray(items) ? items : [items];
    console.log(`=== Query: "${q}" (Found: ${arr.length}) ===`);
    for (let i = 0; i < Math.min(8, arr.length); i++) {
      console.log('  -', arr[i].title);
    }
  }
}
run();
