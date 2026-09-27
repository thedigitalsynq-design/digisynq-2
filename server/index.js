// server/index.js
// Cinema Damage-Control & Reputation Intelligence Engine API Server

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { SourceAdapterNetwork } = require('./adapters');
const { SignalNormalizer } = require('./engine/normalizer');
const { SignalDeduplicator } = require('./engine/deduplicator');
const { StateCalculator } = require('./engine/stateCalculator');
const { RootCauseGraphBuilder } = require('./engine/rootCauseGraph');
const { TemporalReplayEngine } = require('./engine/temporalReplay');
const { CinemaRadarEngine } = require('./engine/cinemaRadar');
const { RecentReleasesEngine } = require('./engine/recentReleases');
const { ISTTimeEngine } = require('./engine/istTime');
const { CinemaDecisionMatrixEngine } = require('./engine/decisionEngine');
const { AudienceMetricsEngine } = require('./engine/audienceMetrics');
const { ScoringEngine } = require('./engine/scoringEngine');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const adapterNetwork = new SourceAdapterNetwork();
const radarEngine = new CinemaRadarEngine();
const recentReleasesEngine = new RecentReleasesEngine();

// In-memory cache for recent movie states to prevent duplicate rapid requests (TTL: 60s)
const movieStateCache = new Map();

// ---------------------------------------------------------------------------
// Authentication layer (additive — data endpoints below remain open & unchanged)
// Stateless HMAC-signed tokens. Users seeded from env, else safe demo defaults.
// Env overrides:
//   CDC_AUTH_SECRET  - HMAC secret (default: dev secret, set in production)
//   CDC_USERS_JSON   - JSON array: [{email, password, name, role}]
// ---------------------------------------------------------------------------
const AUTH_SECRET = process.env.CDC_AUTH_SECRET || 'cdc-dev-secret-change-in-production';
const AUTH_TTL_MS = 12 * 60 * 60 * 1000; // 12h sessions

function sha256(s) { return crypto.createHash('sha256').update(String(s)).digest('hex'); }

function defaultUsers() {
  return [
    { email: 'admin@cinema.intel', passwordHash: sha256('ChangeMe123!'), name: 'Studio Admin', role: 'admin' },
    { email: 'operator@cdc.local', passwordHash: sha256('operator123'), name: 'Operator', role: 'operator' },
  ];
}

function loadUsers() {
  try {
    if (process.env.CDC_USERS_JSON) {
      const arr = JSON.parse(process.env.CDC_USERS_JSON);
      if (Array.isArray(arr) && arr.length) {
        return arr.map(u => ({
          email: String(u.email || '').toLowerCase().trim(),
          passwordHash: u.passwordHash || (u.password ? sha256(u.password) : ''),
          name: u.name || String(u.email || '').split('@')[0],
          role: u.role || 'operator',
        })).filter(u => u.email && u.passwordHash);
      }
    }
  } catch (e) { console.warn('[Auth] CDC_USERS_JSON parse failed, using defaults.'); }
  return defaultUsers();
}

function signToken(email) {
  const exp = Date.now() + AUTH_TTL_MS;
  const payload = `${email}:${exp}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

function verifyToken(token) {
  try {
    const decoded = Buffer.from(String(token), 'base64url').toString('utf8');
    const [email, expStr, sig] = decoded.split(':');
    if (!email || !expStr || !sig) return null;
    if (Number(expStr) < Date.now()) return null;
    const expected = crypto.createHmac('sha256', AUTH_SECRET).update(`${email}:${expStr}`).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const user = loadUsers().find(u => u.email === email.toLowerCase());
    if (!user) return null;
    return { email: user.email, name: user.name, role: user.role, exp: Number(expStr) };
  } catch { return null; }
}

function authFromReq(req) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? verifyToken(m[1].trim()) : null;
}

// Public: login — validates credentials, returns signed token + profile
// (Data endpoints are intentionally NOT gated so existing integrations keep working.)
app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  const user = loadUsers().find(u => u.email === email);
  if (!user || user.passwordHash !== sha256(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = signToken(user.email);
  res.json({ token, expiresInMs: AUTH_TTL_MS, user: { email: user.email, name: user.name, role: user.role } });
});

// Public: verify session
app.get('/api/auth/me', (req, res) => {
  const user = authFromReq(req);
  if (!user) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  res.json({ user });
});

// Public: logout (stateless — client discards token; endpoint exists for symmetry/audit)
app.post('/api/auth/logout', (req, res) => {
  res.json({ ok: true });
});

// 1. Health & Sensor Telemetry
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    version: '1.0.0-PROD',
    timestamp: new Date().toISOString(),
    istTime: ISTTimeEngine.formatIST(),
    sensors: adapterNetwork.getTelemetry(),
    cacheSize: movieStateCache.size
  });
});

// 1.5 Indian Standard Time (IST) Clock & Dynamic Rolling Window API
app.get('/api/time/ist', (req, res) => {
  const windowDays = parseInt(req.query.days || '15', 10);
  res.json(ISTTimeEngine.get15DayWindowIST(windowDays));
});

// 2. Live Cinema Radar - Discovers what's happening right now in Indian Cinema
app.get('/api/radar', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const radarData = await radarEngine.getRadarData(forceRefresh);
    res.json(radarData);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'ERROR' });
  }
});

// 3. Theatrical Releases in the Last 15 Days (Real-Time Ingestion + 5-Layer Verification)
app.get('/api/recent-releases', async (req, res) => {
  try {
    const windowDays = parseInt(req.query.days || '15', 10);
    const forceRefresh = req.query.refresh === 'true';
    const releaseData = await recentReleasesEngine.getRecentReleases(windowDays, forceRefresh);
    res.json(releaseData);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'ERROR' });
  }
});

// 4. Dedicated Decision Matrix Engine API (AHP Multi-Criteria Decision Framework)
app.get('/api/movie/decision', async (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Movie title query is required.' });
  }

  try {
    const harvestResult = await adapterNetwork.harvestAll(query);
    const { rawSignals } = harvestResult;
    const normalizedSignals = rawSignals.map(SignalNormalizer.normalize);
    const { primarySignals } = SignalDeduplicator.process(normalizedSignals);
    const liveState = StateCalculator.calculate(primarySignals, 'Live State');
    const rootCauseGraph = RootCauseGraphBuilder.build(primarySignals, liveState.narratives, {
      activeIssues: liveState.activeIssues,
      hasCriticalIssue: liveState.activeIssues.some(i => i.severity === 'CRITICAL'),
      emergingControversies: liveState.emergingControversies
    });

    const decision = CinemaDecisionMatrixEngine.evaluate(query, primarySignals, liveState, rootCauseGraph);
    res.json(decision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to find cross-referenced radar / release data
function findRadarCrossReference(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  if (radarEngine.cachedRadar?.movies) {
    const found = radarEngine.cachedRadar.movies.find(m => {
      const mt = (m.title || '').toLowerCase().trim();
      return mt === q || mt.includes(q) || q.includes(mt);
    });
    if (found) return found;
  }
  if (recentReleasesEngine.cachedReleases?.releases) {
    const found = recentReleasesEngine.cachedReleases.releases.find(m => {
      const mt = (m.title || '').toLowerCase().trim();
      return mt === q || mt.includes(q) || q.includes(mt);
    });
    if (found) return found;
  }
  return null;
}

// 4.5 Dedicated Movie Performance & Audience Metrics API
app.get('/api/movie/metrics', async (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Movie title query is required.' });
  }

  try {
    const harvestResult = await adapterNetwork.harvestAll(query);
    const { rawSignals } = harvestResult;
    const normalizedSignals = rawSignals.map(SignalNormalizer.normalize);
    const { primarySignals } = SignalDeduplicator.process(normalizedSignals);
    const liveState = StateCalculator.calculate(primarySignals, 'Live State');
    const radarCrossRef = findRadarCrossReference(query);
    const metrics = AudienceMetricsEngine.extractMetrics(query, primarySignals, liveState, radarCrossRef);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4.8 Dedicated Universal Precision Scoring & Measurement API
app.get('/api/movie/scores', async (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Movie title query is required.' });
  }

  try {
    const harvestResult = await adapterNetwork.harvestAll(query);
    const { rawSignals } = harvestResult;
    const normalizedSignals = rawSignals.map(SignalNormalizer.normalize);
    const { primarySignals } = SignalDeduplicator.process(normalizedSignals);
    const liveState = StateCalculator.calculate(primarySignals, 'Live State');
    const radarCrossRef = findRadarCrossReference(query);
    const audienceMetrics = AudienceMetricsEngine.extractMetrics(query, primarySignals, liveState, radarCrossRef);
    const scores = ScoringEngine.computeMasterScores(query, primarySignals, liveState, audienceMetrics, radarCrossRef);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Live Movie Digital Twin Intelligence Engine
app.get('/api/movie/live', async (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) {
    return res.status(400).json({
      error: 'Query parameter is required. Enter an Indian cinema title (e.g., "The Paradise", "Sardar 2", "Toxic", "Daayra").'
    });
  }

  const cacheKey = query.toLowerCase();
  const cached = movieStateCache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.cachedAt < 45000) && req.query.refresh !== 'true') {
    return res.json({ ...cached.data, isFromCache: true, cachedSecondsAgo: Math.round((now - cached.cachedAt) / 1000) });
  }

  try {
    console.log(`[SensorNetwork] Harvesting live public signals for: "${query}"...`);
    const harvestResult = await adapterNetwork.harvestAll(query);
    const { rawSignals, telemetry, totalDurationMs, harvestedAt } = harvestResult;

    // Zero Mock Data Rule: If no signals found, return honest empty state
    if (rawSignals.length === 0) {
      return res.json({
        query,
        hasData: false,
        message: `Insufficient public data detected for "${query}". 0 signals retrieved from Wikipedia, Google News, and public Indian cinema forums.`,
        telemetry,
        harvestedAt,
        totalDurationMs
      });
    }

    // 1. Normalize signals
    const normalizedSignals = rawSignals.map(SignalNormalizer.normalize);

    // 2. Deduplicate wire copies & syndication
    const dedupResult = SignalDeduplicator.process(normalizedSignals);
    const primarySignals = dedupResult.primarySignals;

    // 3. Calculate Live Movie Digital Twin State
    const liveState = StateCalculator.calculate(primarySignals, 'Live State');

    // 4. Build Root-Cause Graph
    const rootCauseGraph = RootCauseGraphBuilder.build(primarySignals, liveState.narratives, {
      activeIssues: liveState.activeIssues,
      hasCriticalIssue: liveState.activeIssues.some(i => i.severity === 'CRITICAL'),
      emergingControversies: liveState.emergingControversies
    });

    // 5. Build Temporal Replay slices & Before vs Now comparison
    const temporalReplay = TemporalReplayEngine.generateHistorySlices(primarySignals, (slicedSignals, label) => {
      return StateCalculator.calculate(slicedSignals, label);
    });

    // 6. Execute State-of-the-Art Decision Matrix Engine (5-Stage AHP + Bayesian De-Biasing)
    const decisionIntelligence = CinemaDecisionMatrixEngine.evaluate(
      query,
      primarySignals,
      liveState,
      rootCauseGraph
    );

    // 6.5 Extract Movie Performance & Audience Metrics (BookMyShow, IMDb, Google, Box Office)
    const radarCrossRef = findRadarCrossReference(query);
    const audienceMetrics = AudienceMetricsEngine.extractMetrics(
      query,
      primarySignals,
      liveState,
      radarCrossRef
    );

    // 7. Sensor Freshness Map
    const freshnessMap = telemetry.map(t => ({
      name: t.name,
      category: t.category,
      status: t.status,
      latencyMs: t.latencyMs,
      itemCount: t.itemCount,
      lastFetchedAgo: t.lastFetched ? `${Math.max(0, Math.round((Date.now() - new Date(t.lastFetched).getTime()) / 1000))}s ago` : 'Never'
    }));

    // 6.7 Compute Master Universal Scoring & Measurement Suite
    const scoringSuite = ScoringEngine.computeMasterScores(
      query,
      primarySignals,
      liveState,
      audienceMetrics,
      radarCrossRef
    );

    const responsePayload = {
      query,
      hasData: true,
      identity: {
        title: query,
        verifiedInWikipedia: primarySignals.some(s => s.sourceCategory === 'encyclopedic'),
        wikiEntity: primarySignals.find(s => s.sourceCategory === 'encyclopedic') || null,
        firstObservedDate: primarySignals.length > 0 ? primarySignals[primarySignals.length - 1].publishedAt : null
      },
      stats: {
        rawHarvestedCount: rawSignals.length,
        primarySignalsCount: primarySignals.length,
        syndicatedCount: dedupResult.syndicatedCount,
        harvestDurationMs: totalDurationMs
      },
      liveState,
      rootCauseGraph,
      temporalReplay,
      decisionIntelligence,
      audienceMetrics,
      scoringSuite,
      articles: primarySignals,
      signals: primarySignals,
      freshnessMap,
      telemetry,
      harvestedAt
    };

    // Cache result
    movieStateCache.set(cacheKey, { cachedAt: now, data: responsePayload });

    res.json(responsePayload);
  } catch (err) {
    console.error(`[Engine] Error analyzing movie "${query}":`, err);
    res.status(500).json({
      error: 'Intelligence engine computation error',
      details: err.message,
      hasData: false
    });
  }
});

// Serve frontend static build
const path = require('path');
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('{*path}', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[CinemaIntelligenceServer] Online on port ${PORT}`);
  // Asynchronously pre-warm 15-day radar and releases cache
  radarEngine.getRadarData().catch(err => console.warn('[RadarEngine] Initial warm warning:', err.message));
});
