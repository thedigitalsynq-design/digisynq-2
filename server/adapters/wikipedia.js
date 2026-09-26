// server/adapters/wikipedia.js
const { BaseAdapter } = require('./base');

class WikipediaAdapter extends BaseAdapter {
  constructor() {
    super('Wikipedia Knowledge Graph', 'encyclopedic');
    this.userAgent = 'CinemaDamageControlPlatform/1.0 (https://github.com/example/cinema; research@cinemaintel.org)';
  }

  async _executeFetch(query, options = {}) {
    // 1. Search for best matching page title via opensearch
    let pageTitle = null;
    let pageUrl = null;

    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&namespace=0&format=json`;
      const searchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': this.userAgent }
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const titles = searchData[1] || [];
        const urls = searchData[3] || [];
        if (titles.length > 0) {
          pageTitle = titles[0];
          pageUrl = urls[0];
        }
      }
    } catch (e) {
      // ignore
    }

    if (!pageTitle) {
      pageTitle = query;
    }

    // 2. Fetch rich summary from Wikipedia REST API
    const slug = encodeURIComponent(pageTitle.replace(/\s+/g, '_'));
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(summaryUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': this.userAgent }
      });

      if (!res.ok) return [];
      const data = await res.json();

      if (!data.extract || data.type === 'disambiguation') return [];

      const signals = [
        {
          id: `wiki-core-${data.pageid || data.title}`,
          source: 'Wikipedia Official Encyclopedic Record',
          sourceCategory: 'encyclopedic',
          platform: 'Wikipedia Verified Knowledge Graph',
          title: `${data.title} — Verified Cinematic Record`,
          snippet: data.extract,
          url: data.content_urls?.desktop?.page || pageUrl || `https://en.wikipedia.org/wiki/${slug}`,
          publishedAt: data.timestamp || new Date().toISOString(),
          metadata: {
            pageId: data.pageid,
            displayTitle: data.title,
            description: data.description,
            thumbnail: data.thumbnail?.source || null,
            revision: data.revision
          },
          rawScore: 1.0
        }
      ];

      return signals;
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { WikipediaAdapter };
