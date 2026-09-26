// server/adapters/instagram.js
// Instagram & Reels Real-Time Virality Sensor
const { BaseAdapter } = require('./base');
const { XMLParser } = require('fast-xml-parser');

class InstagramReelsAdapter extends BaseAdapter {
  constructor() {
    super('Instagram Reels & Culture Pulse', 'social');
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async _executeFetch(query, options = {}) {
    const cleanQuery = encodeURIComponent(`"${query}" site:instagram.com (reel OR post OR "fan edit" OR "theatre reaction" OR "public review")`);
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
        throw new Error(`Instagram aggregator returned HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const jsonObj = this.parser.parse(xmlText);
      const items = jsonObj?.rss?.channel?.item;

      if (!items) return [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray.map((item, idx) => {
        let title = item.title || '';
        if (title.endsWith(' - Instagram')) {
          title = title.replace(/ - Instagram$/, '').trim();
        }

        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const link = item.link || '';
        const snippet = (item.description || '').replace(/<[^>]*>?/gm, '').trim();

        return {
          id: `ig-${idx}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
          source: 'Instagram Reels / Fan Pages',
          sourceCategory: 'social',
          platform: 'Instagram Reels',
          title: title,
          snippet: snippet || title,
          url: link,
          publishedAt: pubDate,
          rawScore: 0.85
        };
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { InstagramReelsAdapter };
