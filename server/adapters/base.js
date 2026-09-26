// server/adapters/base.js
// Base Adapter for Internet Sensor Network

class BaseAdapter {
  constructor(name, category) {
    this.name = name;
    this.category = category; // 'encyclopedic' | 'news' | 'social' | 'critics' | 'trade'
    this.lastFetched = null;
    this.lastLatencyMs = 0;
    this.status = 'READY'; // 'READY' | 'HEALTHY' | 'DEGRADED' | 'EMPTY' | 'ERROR'
    this.lastError = null;
    this.lastItemCount = 0;
  }

  async fetch(query, options = {}) {
    const start = Date.now();
    try {
      const items = await this._executeFetch(query, options);
      this.lastLatencyMs = Date.now() - start;
      this.lastFetched = new Date().toISOString();
      this.lastItemCount = items ? items.length : 0;
      this.status = this.lastItemCount > 0 ? 'HEALTHY' : 'EMPTY';
      this.lastError = null;
      return items || [];
    } catch (err) {
      this.lastLatencyMs = Date.now() - start;
      this.lastFetched = new Date().toISOString();
      this.status = 'ERROR';
      this.lastError = err.message || 'Unknown network error';
      this.lastItemCount = 0;
      console.warn(`[Adapter:${this.name}] Fetch failed for "${query}":`, err.message);
      return [];
    }
  }

  // To be implemented by child classes
  async _executeFetch(query, options) {
    throw new Error('_executeFetch must be implemented by subclass');
  }

  getTelemetry() {
    return {
      name: this.name,
      category: this.category,
      status: this.status,
      lastFetched: this.lastFetched,
      latencyMs: this.lastLatencyMs,
      itemCount: this.lastItemCount,
      error: this.lastError
    };
  }
}

module.exports = { BaseAdapter };
