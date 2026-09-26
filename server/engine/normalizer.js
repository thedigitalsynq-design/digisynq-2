// server/engine/normalizer.js
const { analyzeSentimentAndTopics } = require('./nlpTaxonomy');

class SignalNormalizer {
  static normalize(rawSignal) {
    const textToAnalyze = `${rawSignal.title || ''} ${rawSignal.snippet || ''}`;
    const nlp = analyzeSentimentAndTopics(textToAnalyze);

    const pubDate = new Date(rawSignal.publishedAt || Date.now());
    const validPubDate = isNaN(pubDate.getTime()) ? new Date() : pubDate;
    const ageMinutes = Math.max(0, Math.round((Date.now() - validPubDate.getTime()) / (1000 * 60)));

    return {
      id: rawSignal.id,
      source: rawSignal.source || 'Public Feed',
      sourceCategory: rawSignal.sourceCategory || 'news',
      platform: rawSignal.platform || 'Public Internet',
      title: (rawSignal.title || '').trim(),
      snippet: (rawSignal.snippet || '').trim(),
      url: rawSignal.url || '#',
      publishedAt: validPubDate.toISOString(),
      ageMinutes,
      sentimentScore: Math.round(nlp.rawScore * 100) / 100, // -1.0 to 1.0
      sentimentLabel: nlp.sentimentLabel,
      posHits: nlp.posHits,
      negHits: nlp.negHits,
      conHits: nlp.conHits,
      isControversial: nlp.isControversial,
      topics: nlp.topics,
      metadata: rawSignal.metadata || {},
      isSyndicated: false,
      syndicationCount: 1,
      fingerprint: SignalNormalizer.generateFingerprint(rawSignal.title)
    };
  }

  static generateFingerprint(title = '') {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 8)
      .sort()
      .join('-');
  }
}

module.exports = { SignalNormalizer };
