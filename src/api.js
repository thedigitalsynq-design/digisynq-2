// src/api.js
// Enterprise-Grade Resilient Telemetry & Intelligence API Client
// Supports Cloudflare Pages Edge Functions, Same-Origin & Configured Backends

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Fetch with automatic AbortController timeout to prevent hanging requests.
 */
export async function fetchWithTimeout(endpoint, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${endpoint}`);
    }
    throw err;
  }
}

/**
 * Robust Client-Side Indian Standard Time (IST) Rolling Window.
 * Uses native Intl API for zero-drift timezone accuracy even if backend is offline.
 */
export function getClientSideISTWindow(days = 15) {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const parts = istFormatter.formatToParts(now);
  const partMap = {};
  parts.forEach(p => { partMap[p.type] = p.value; });

  const istIsoStr = `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}:${partMap.second}+05:30`;
  const endDate = new Date(now.getTime());
  const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

  const formatShort = (d) => {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric'
    }).format(d);
  };

  const startFormatted = formatShort(startDate);
  const endFormatted = formatShort(endDate);

  return {
    timezone: 'Asia/Kolkata (IST)',
    nowIST: istIsoStr,
    timestamp: now.toISOString(),
    windowDays: days,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    startFormatted,
    endFormatted,
    displayLabel: `${startFormatted} – ${endFormatted} (Today)`,
    isClientGenerated: true
  };
}

/**
 * Fetch IST Rolling Window with graceful client-side fallback.
 */
export async function fetchISTTime(days = 15) {
  try {
    const res = await fetchWithTimeout(`/api/time/ist?days=${days}`, {}, 3000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ...data, _source: 'LIVE' };
  } catch (err) {
    console.warn('[API:ISTTime] Network fallback triggered:', err.message);
    return { ...getClientSideISTWindow(days), _source: 'FALLBACK' };
  }
}

/**
 * LocalStorage caching wrapper for high availability.
 */
function getCached(key, maxAgeMs = 120000) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > maxAgeMs) return null;
    return data;
  } catch {
    return null;
  }
}

function setCached(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Fetch Live Radar with 3-tier resilience (Live -> Cache -> Fallback).
 */
export async function fetchRadar({ force = false } = {}) {
  const cacheKey = 'cdc_cache_radar_v2';
  
  if (!force) {
    const cached = getCached(cacheKey, 60000);
    if (cached) return { ...cached, _source: 'CACHE' };
  }

  try {
    const res = await fetchWithTimeout(`/api/radar${force ? '?refresh=true' : ''}`, {}, 5000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setCached(cacheKey, data);
    return { ...data, _source: 'LIVE' };
  } catch (err) {
    console.warn('[API:Radar] Network unavailable, checking cache:', err.message);
    const stale = getCached(cacheKey, 3600000); // Allow up to 1hr stale cache
    if (stale) return { ...stale, _source: 'STALE' };
    
    // Honest offline fallback state
    return {
      success: false,
      isOffline: true,
      _source: 'OFFLINE',
      totalMoviesTracked: 0,
      trendingCount: 0,
      activeCrisesCount: 0,
      movies: [],
      error: err.message
    };
  }
}

/**
 * Fetch Theatrical Releases (15-day verified window).
 */
export async function fetchRecentReleases({ days = 15, force = false } = {}) {
  const cacheKey = `cdc_cache_releases_${days}_v2`;
  
  if (!force) {
    const cached = getCached(cacheKey, 60000);
    if (cached) return { ...cached, _source: 'CACHE' };
  }

  try {
    const res = await fetchWithTimeout(`/api/recent-releases?days=${days}${force ? '&refresh=true' : ''}`, {}, 5000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setCached(cacheKey, data);
    return { ...data, _source: 'LIVE' };
  } catch (err) {
    console.warn('[API:RecentReleases] Network unavailable, checking cache:', err.message);
    const stale = getCached(cacheKey, 3600000);
    if (stale) return { ...stale, _source: 'STALE' };

    return {
      success: false,
      isOffline: true,
      _source: 'OFFLINE',
      windowDays: days,
      verifiedCount: 0,
      totalCount: 0,
      releases: [],
      error: err.message
    };
  }
}

/**
 * Fetch Live Movie Intelligence Twin.
 */
export async function fetchMovieLive(query, { force = false } = {}) {
  if (!query || !query.trim()) {
    throw new Error('Movie query is required');
  }
  const clean = query.trim();
  const cacheKey = `cdc_cache_movie_${clean.toLowerCase()}_v2`;

  if (!force) {
    const cached = getCached(cacheKey, 45000);
    if (cached) return { ...cached, _source: 'CACHE' };
  }

  try {
    const res = await fetchWithTimeout(
      `/api/movie/live?query=${encodeURIComponent(clean)}${force ? '&refresh=true' : ''}`,
      {},
      8000
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setCached(cacheKey, data);
    return { ...data, _source: 'LIVE' };
  } catch (err) {
    console.warn(`[API:MovieLive] Network error for "${clean}":`, err.message);
    const stale = getCached(cacheKey, 3600000);
    if (stale) return { ...stale, _source: 'STALE' };

    return {
      query: clean,
      hasData: false,
      isOffline: true,
      _source: 'OFFLINE',
      message: `Offline telemetry mode: Live intelligence service currently unreachable (${err.message}).`,
      liveState: null,
      error: err.message
    };
  }
}

/**
 * Health check endpoint.
 */
export async function fetchHealth() {
  try {
    const res = await fetchWithTimeout('/api/health', {}, 3000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ...data, isOnline: true, _source: 'LIVE' };
  } catch (err) {
    return { isOnline: false, status: 'OFFLINE', error: err.message, _source: 'OFFLINE' };
  }
}
