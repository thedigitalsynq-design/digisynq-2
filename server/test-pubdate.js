const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser({ ignoreAttributes: false });

async function testPubDateFilter() {
  const queries = [
    'box office collection day 1 OR day 2 OR day 3 OR day 4 OR day 5 2026',
    'box office collection day 6 OR day 7 OR day 8 OR day 9 OR day 10 2026',
    'box office collection day 11 OR day 12 OR day 13 OR day 14 OR day 15 2026',
    'theatrical release September 2026 box office Bollywood Tollywood Kollywood'
  ];

  const now = new Date('2026-09-26T12:00:00Z').getTime();
  const fifteenDaysMs = 16 * 24 * 3600 * 1000; // 16 days buffer
  const minAllowedDate = now - fifteenDaysMs;

  console.log('Window: from', new Date(minAllowedDate).toISOString(), 'to', new Date(now).toISOString());

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

  console.log('Total items fetched:', allItems.length);

  let filteredByDate = 0;
  let passedDate = 0;

  allItems.forEach(item => {
    const pDate = item.pubDate ? new Date(item.pubDate).getTime() : 0;
    if (pDate < minAllowedDate) {
      filteredByDate++;
      if (item.title.toLowerCase().includes('gatta kusthi')) {
        console.log('Filtered out old Gatta Kusthi item with date:', item.pubDate, '| Title:', item.title);
      }
    } else {
      passedDate++;
      if (item.title.toLowerCase().includes('gatta kusthi')) {
        console.log('Passed Gatta Kusthi item with date:', item.pubDate, '| Title:', item.title);
      }
    }
  });

  console.log(`Passed items (published in last 15 days): ${passedDate}, Filtered out older items: ${filteredByDate}`);
}

testPubDateFilter();
