// server/adapters/index.js
const { GoogleNewsAdapter } = require('./googleNews');
const { RedditDiscussionsAdapter } = require('./reddit');
const { YouTubeReviewsAdapter } = require('./youtube');
const { TradeNewsAdapter } = require('./tradeNews');
const { WikipediaAdapter } = require('./wikipedia');
const { WikidataAdapter } = require('./wikidata');
const { TwitterDiscourseAdapter } = require('./twitter');
const { InstagramReelsAdapter } = require('./instagram');
const { PiracyLeakAdapter } = require('./piracyTelegram');

class SourceAdapterNetwork {
  constructor() {
    this.adapters = [
      new WikipediaAdapter(),
      new WikidataAdapter(),
      new GoogleNewsAdapter(),
      new TwitterDiscourseAdapter(),
      new InstagramReelsAdapter(),
      new YouTubeReviewsAdapter(),
      new RedditDiscussionsAdapter(),
      new TradeNewsAdapter(),
      new PiracyLeakAdapter()
    ];
  }

  async harvestAll(query) {
    const startTime = Date.now();
    
    // Run all adapters concurrently with isolated failure tolerance
    const results = await Promise.allSettled(
      this.adapters.map(adapter => adapter.fetch(query))
    );

    let rawSignals = [];
    results.forEach((res, idx) => {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        rawSignals.push(...res.value);
      } else {
        console.warn(`Adapter ${this.adapters[idx].name} failed:`, res.reason);
      }
    });

    const totalDurationMs = Date.now() - startTime;
    const telemetry = this.adapters.map(a => a.getTelemetry());

    return {
      rawSignals,
      telemetry,
      totalDurationMs,
      harvestedAt: new Date().toISOString()
    };
  }

  getTelemetry() {
    return this.adapters.map(a => a.getTelemetry());
  }
}

module.exports = { SourceAdapterNetwork };
