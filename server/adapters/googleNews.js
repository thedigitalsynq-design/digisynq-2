// server/adapters/googleNews.js
const { BaseAdapter } = require('./base');
const { XMLParser } = require('fast-xml-parser');

class GoogleNewsAdapter extends BaseAdapter {
  constructor() {
    super('Google News India', 'news');
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async _executeFetch(query, options = {}) {
    const cleanQuery = encodeURIComponent(`${query} (movie OR film OR cinema OR box office OR review)`);
    const url = `https://news.google.com/rss/search?q=${cleanQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      let response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });

      if (!response.ok) {
        // Fallback to simpler query without boolean operators
        const fallbackUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' cinema')}&hl=en-IN&gl=IN&ceid=IN:en`;
        response = await fetch(fallbackUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        });
      }

      if (!response.ok) {
        throw new Error(`Google News returned HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const jsonObj = this.parser.parse(xmlText);
      const items = jsonObj?.rss?.channel?.item;

      if (!items) return [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray.map((item, idx) => {
        // Clean headline and source name
        // Google news titles often end with " - PublisherName"
        let fullTitle = item.title || '';
        let publisher = item.source?.['#text'] || item.source || '';
        
        if (!publisher && fullTitle.includes(' - ')) {
          const parts = fullTitle.split(' - ');
          publisher = parts.pop().trim();
          fullTitle = parts.join(' - ').trim();
        }

        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const link = item.link || '';
        const description = (item.description || '').replace(/<[^>]*>?/gm, '').trim();

        return {
          id: `gn-${idx}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
          source: publisher || 'Indian Media Publication',
          sourceCategory: 'news',
          platform: 'Google News / Mainstream Press',
          title: fullTitle,
          snippet: description || fullTitle,
          url: link,
          publishedAt: pubDate,
          rawScore: 1.0
        };
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { GoogleNewsAdapter };
