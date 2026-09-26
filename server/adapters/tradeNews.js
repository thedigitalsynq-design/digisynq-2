// server/adapters/tradeNews.js
const { BaseAdapter } = require('./base');
const { XMLParser } = require('fast-xml-parser');

class TradeNewsAdapter extends BaseAdapter {
  constructor() {
    super('Trade & Box Office Tracking', 'trade');
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async _executeFetch(query, options = {}) {
    const cleanQuery = encodeURIComponent(`"${query}" (box office collection OR occupancy OR advance booking OR trade report OR screen count OR distributor)`);
    const url = `https://news.google.com/rss/search?q=${cleanQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });

      if (!response.ok) {
        throw new Error(`Trade news aggregator returned HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const jsonObj = this.parser.parse(xmlText);
      const items = jsonObj?.rss?.channel?.item;

      if (!items) return [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray.map((item, idx) => {
        let fullTitle = item.title || '';
        let publisher = item.source?.['#text'] || item.source || 'Trade Publication';

        if (fullTitle.includes(' - ')) {
          const parts = fullTitle.split(' - ');
          publisher = parts.pop().trim();
          fullTitle = parts.join(' - ').trim();
        }

        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const link = item.link || '';
        const description = (item.description || '').replace(/<[^>]*>?/gm, '').trim();

        return {
          id: `tr-${idx}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
          source: publisher,
          sourceCategory: 'trade',
          platform: 'Trade & Box Office Forensics',
          title: fullTitle,
          snippet: description || fullTitle,
          url: link,
          publishedAt: pubDate,
          rawScore: 0.95
        };
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { TradeNewsAdapter };
