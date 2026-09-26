// server/adapters/wikidata.js
const { BaseAdapter } = require('./base');

class WikidataAdapter extends BaseAdapter {
  constructor() {
    super('Wikidata Entity Disambiguation', 'encyclopedic');
  }

  async _executeFetch(query, options = {}) {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&limit=5`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(searchUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'CinemaDamageControl/1.0 (academic; research@example.com)' }
      });

      if (!res.ok) return [];
      const data = await res.json();
      const results = data.search || [];

      // Filter for items likely to be films/movies
      const filmEntity = results.find(r => 
        (r.description && /film|movie|upcoming/i.test(r.description)) ||
        (r.label && new RegExp(query, 'i').test(r.label))
      ) || results[0];

      if (!filmEntity) return [];

      return [{
        id: `wd-${filmEntity.id}`,
        source: 'Wikidata Semantic Graph',
        sourceCategory: 'encyclopedic',
        platform: 'Wikidata Open Entity Graph',
        title: `${filmEntity.label} (${filmEntity.id})`,
        snippet: filmEntity.description || `Wikidata verified entity: ${filmEntity.label}`,
        url: filmEntity.url ? (filmEntity.url.startsWith('//') ? 'https:' + filmEntity.url : filmEntity.url) : `https://www.wikidata.org/wiki/${filmEntity.id}`,
        publishedAt: new Date().toISOString(),
        metadata: {
          entityId: filmEntity.id,
          label: filmEntity.label,
          description: filmEntity.description
        },
        rawScore: 1.0
      }];
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { WikidataAdapter };
