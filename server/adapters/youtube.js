// server/adapters/youtube.js
const { BaseAdapter } = require('./base');
const { XMLParser } = require('fast-xml-parser');

class YouTubeReviewsAdapter extends BaseAdapter {
  constructor() {
    super('YouTube Video Critics & Discourse', 'critics');
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async _executeFetch(query, options = {}) {
    const cleanQuery = encodeURIComponent(`"${query}" site:youtube.com (review OR reaction OR public response OR genuine review OR movie talk)`);
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
        throw new Error(`YouTube RSS aggregator returned HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const jsonObj = this.parser.parse(xmlText);
      const items = jsonObj?.rss?.channel?.item;

      if (!items) return [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray.map((item, idx) => {
        let title = item.title || '';
        let channel = 'YouTube Cinema Critic';
        
        if (title.endsWith(' - YouTube')) {
          title = title.replace(/ - YouTube$/, '').trim();
        }

        // Check if publisher is specified
        if (item.source?.['#text']) {
          channel = item.source['#text'];
        }

        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const link = item.link || '';
        const snippet = (item.description || '').replace(/<[^>]*>?/gm, '').trim();

        return {
          id: `yt-${idx}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
          source: channel,
          sourceCategory: 'critics',
          platform: 'YouTube Reviewers & Reaction Media',
          title: title,
          snippet: snippet || title,
          url: link,
          publishedAt: pubDate,
          rawScore: 0.9
        };
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { YouTubeReviewsAdapter };
