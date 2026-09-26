const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser({ ignoreAttributes: false });

async function check() {
  const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent('"Gatta Kusthi"') + '&hl=en-IN&gl=IN&ceid=IN:en';
  const res = await fetch(url);
  const text = await res.text();
  const data = parser.parse(text);
  const items = data.rss?.channel?.item || [];
  const arr = Array.isArray(items) ? items : [items];
  console.log('Gatta Kusthi items found:', arr.length);
  arr.slice(0, 10).forEach(i => console.log('  -', i.title, '| pubDate:', i.pubDate));
}
check();
