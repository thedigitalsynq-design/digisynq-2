// server/adapters/reddit.js
const { BaseAdapter } = require('./base');
const { XMLParser } = require('fast-xml-parser');

class RedditDiscussionsAdapter extends BaseAdapter {
  constructor() {
    super('Reddit Indian Cinema Forums', 'social');
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async _executeFetch(query, options = {}) {
    const cleanQuery = encodeURIComponent(`"${query}" site:reddit.com (r/bollywood OR r/tollywood OR r/kollywood OR r/MalayalamMovies OR r/IndianCinema OR r/boxoffice)`);
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
        throw new Error(`Reddit RSS aggregator returned HTTP ${response.status}`);
      }

      const xmlText = await response.text();
      const jsonObj = this.parser.parse(xmlText);
      const items = jsonObj?.rss?.channel?.item;

      if (!items) return [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray.map((item, idx) => {
        let title = item.title || '';
        // Extract subreddit if present in title or description
        let subreddit = 'r/IndianCinema';
        const subMatch = (title + ' ' + (item.description || '')).match(/r\/(bollywood|tollywood|kollywood|malayalammovies|indiancinema|boxoffice)/i);
        if (subMatch) {
          subreddit = `r/${subMatch[1]}`;
        }

        // Clean out suffix " - Reddit" if present
        if (title.endsWith(' - Reddit')) {
          title = title.replace(/ - Reddit$/, '').trim();
        }

        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const link = item.link || '';
        const snippet = (item.description || '').replace(/<[^>]*>?/gm, '').trim();

        return {
          id: `rd-${idx}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
          source: subreddit,
          sourceCategory: 'social',
          platform: 'Reddit Community Discourse',
          title: title,
          snippet: snippet || title,
          url: link,
          publishedAt: pubDate,
          rawScore: 0.8
        };
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { RedditDiscussionsAdapter };
