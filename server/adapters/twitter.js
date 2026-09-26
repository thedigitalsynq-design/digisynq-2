// server/adapters/twitter.js
// X (Twitter) Real-Time Discourse & Viral Sentiment Sensor
const { BaseAdapter } = require('./base');
const { XMLParser } = require('fast-xml-parser');

class TwitterDiscourseAdapter extends BaseAdapter {
  constructor() {
    super('X (Twitter) Live Pulse', 'social');
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async _executeFetch(query, options = {}) {
    const compactTitle = query.replace(/[^a-zA-Z0-9]/g, '');
    const cleanQuery = encodeURIComponent(`"${query}" (site:twitter.com OR site:x.com OR "#${compactTitle}" OR "Twitter review" OR "on X" OR "boycott" OR "blockbuster" OR "disaster")`);
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
        throw new Error(`X/Twitter aggregator returned HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const jsonObj = this.parser.parse(xmlText);
      const items = jsonObj?.rss?.channel?.item;

      if (!items) return [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray.map((item, idx) => {
        let title = item.title || '';
        let author = 'X / Twitter Public Stream';

        if (title.includes(' - ')) {
          const parts = title.split(' - ');
          author = parts.pop().trim();
          title = parts.join(' - ').trim();
        }

        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const link = item.link || '';
        const snippet = (item.description || '').replace(/<[^>]*>?/gm, '').trim();

        return {
          id: `tw-${idx}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
          source: author || 'X / Twitter Discourse',
          sourceCategory: 'social',
          platform: 'X (Twitter)',
          title: title,
          snippet: snippet || title,
          url: link,
          publishedAt: pubDate,
          rawScore: 0.88
        };
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { TwitterDiscourseAdapter };
