/**
 * AegisAI — Unified Express Backend  (v3 — TEXT-ID schema)
 * Run:  npm run dev   (nodemon) | npm start (node)
 *
 * Schema decisions for hackathon reliability:
 *  - All primary keys are TEXT (we write UUIDs into them via crypto.randomUUID())
 *  - No strict UUID column type → eliminates "invalid input syntax for type uuid"
 *  - users.balance (NUMERIC) tracks real earned balance, seeded at ₹1250
 */

'use strict';

const express  = require('express');
const cors     = require('cors');
const { Pool } = require('pg');
const bcrypt   = require('bcrypt');
const { randomUUID } = require('crypto');
require('dotenv').config();

// ── Route modules ──────────────────────────────────────────────────────────────
const riskModule     = require('./routes/risk');
const policiesModule = require('./routes/policies');
const payoutsModule  = require('./routes/payouts');
const { router: riskRouter, state: riskState } = riskModule;

// ── Config ─────────────────────────────────────────────────────────────────────
const PORT           = parseInt(process.env.PORT  || '8000', 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const DATABASE_URL   = process.env.DATABASE_URL;

// ── Database pool ──────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Wire pool into feature routers before routes are registered
riskModule.setPool(pool);
policiesModule.setPool(pool);
payoutsModule.setPool(pool);

// ── Express app ────────────────────────────────────────────────────────────────
const app = express();
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// DB INIT — TEXT-based schema + smart migration + test-user seed
// ─────────────────────────────────────────────────────────────────────────────
async function initDB() {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    // Detect existing schema type for users.id
    const colCheck = await pool.query(`
      SELECT data_type FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'id'
    `);

    const existingType = colCheck.rows[0]?.data_type ?? null;

    if (existingType && existingType !== 'text') {
      // Old schema (integer SERIAL or UUID) — wipe and recreate with TEXT
      console.log(`⚠️  Detected incompatible schema (${existingType}). Migrating to TEXT IDs...`);
      await pool.query(`DROP TABLE IF EXISTS claims   CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS policies CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS users    CASCADE`);
      console.log('🗑️  Old tables dropped. Recreating...');
    }

    // ── users ──────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id               TEXT PRIMARY KEY,
        name             VARCHAR(100)  NOT NULL,
        phone            VARCHAR(20)   UNIQUE NOT NULL,
        password_hash    TEXT          NOT NULL,
        zone             VARCHAR(100)  DEFAULT 'Sector 62, Noida',
        upi_id           VARCHAR(100),
        aadhaar_number   VARCHAR(12),
        aadhaar_verified BOOLEAN       NOT NULL DEFAULT FALSE,
        balance          NUMERIC(12,2) NOT NULL DEFAULT 1250.00,
        created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      )
    `);

    // Add balance column if it was missing (safe no-op if it exists)
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2) NOT NULL DEFAULT 1250.00
    `).catch(() => {});

    // ── policies ───────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS policies (
        id                TEXT PRIMARY KEY,
        user_id           TEXT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tier_name         VARCHAR(20)   NOT NULL,
        policy_start_date TIMESTAMPTZ   NOT NULL,
        policy_end_date   TIMESTAMPTZ   NOT NULL,
        premium_amount    NUMERIC(10,2) NOT NULL,
        coverage_amount   NUMERIC(10,2) NOT NULL,
        risk_level        VARCHAR(10)   NOT NULL,
        status            VARCHAR(10)   NOT NULL DEFAULT 'active',
        created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      )
    `);

    // ── claims ─────────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS claims (
        id            TEXT PRIMARY KEY,
        user_id       TEXT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        policy_id     TEXT          NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
        event_type    VARCHAR(50)   NOT NULL,
        payout_amount NUMERIC(10,2) NOT NULL,
        status        VARCHAR(20)   NOT NULL,
        created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        UNIQUE (policy_id, event_type)
      )
    `);

    console.log('✅  Database tables ready (TEXT-ID schema)');

    // ── Seed default test user ─────────────────────────────────────────────────
    const existing = await pool.query(`SELECT id FROM users WHERE phone = $1`, ['1234567890']);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash('123456', 10);
      await pool.query(
        `INSERT INTO users (id, name, phone, password_hash, zone, balance)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [randomUUID(), 'Demo User', '1234567890', hash, 'Sector 62, Noida', 1250]
      );
      console.log('🌱  Test user seeded  →  phone: 1234567890 | password: 123456');
    }

  } catch (err) {
    console.error('❌  DB init error:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function safeUser(row) {
  if (!row) return null;
  const u = { ...row };
  delete u.password_hash;
  u.balance = parseFloat(u.balance ?? 1250);
  return u;
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/signup
app.post('/api/signup', async (req, res) => {
  const { name, phone, password, zone, upi } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Name, phone, and password are required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (id, name, phone, password_hash, zone, upi_id, balance)
       VALUES ($1,$2,$3,$4,$5,$6,1250) RETURNING *`,
      [randomUUID(), name, phone, hash, zone || 'Sector 62, Noida', upi || null]
    );
    return res.status(201).json({ message: 'Registration successful', user: safeUser(result.rows[0]) });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Phone number already registered' });
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/signin  (also aliased as /api/login)
async function handleSignIn(req, res) {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE phone=$1', [phone]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found. Please sign up first.' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    return res.json({ message: 'Logged in successfully', user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
app.post('/api/signin', handleSignIn);
app.post('/api/login',  handleSignIn);   // alias used by some components

// POST /api/update-settings
app.post('/api/update-settings', async (req, res) => {
  const { phone, name, zone, upi_id } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  try {
    await pool.query(
      `UPDATE users
          SET name   = COALESCE($1, name),
              zone   = COALESCE($2, zone),
              upi_id = COALESCE($3, upi_id)
        WHERE phone = $4`,
      [name || null, zone || null, upi_id || null, phone]
    );
    const result = await pool.query('SELECT * FROM users WHERE phone=$1', [phone]);
    return res.json({ message: 'Settings updated successfully', user: safeUser(result.rows[0]) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/user/:id  — re-fetch fresh user data (used after simulate to update balance)
app.get('/api/user/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: safeUser(result.rows[0]) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE ROUTERS
// ─────────────────────────────────────────────────────────────────────────────

// Risk / weather / simulate
app.use('/api/risk',  riskRouter);
app.use('/api/admin', riskRouter);          // /api/admin/trigger-event

// Legacy alias GET /api/risk-status
app.get('/api/risk-status', (_req, res) => res.json({
  zone: 'Sector 62, Noida',
  rainLevel:   riskState.rainLevel,
  isDisrupted: riskState.isDisrupted,
  payoutAmount: riskState.isDisrupted ? Math.round(riskState.hourlyRate * riskState.disruptionHours) : 0,
  status: riskState.isDisrupted ? 'CRITICAL' : 'STABLE',
}));

// /api/simulate → forward to trigger-event
app.post('/api/simulate', (req, res, next) => {
  const rain = typeof req.body.rain === 'number' ? req.body.rain : 12;
  req.body = { event_type: 'heavy_rain', rain, disruption_hours: rain > 8 ? 3 : 0, hourly_rate: 150 };
  req.url = '/trigger-event';
  riskRouter(req, res, next);
});

// Policies
app.use('/api/policy', policiesModule.router);
app.use('/api/user',   policiesModule.router);   // /api/user/verify-aadhaar

// Claims / payouts
app.use('/api/claim',  payoutsModule.router);
app.use('/api/claims', payoutsModule.router);

// ─────────────────────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  AegisAI Backend  →  http://localhost:${PORT}`);
    console.log(`    CORS: ${ALLOWED_ORIGIN}`);
    console.log('    ─────────────────────────────────────────');
    console.log('    GET  /api/health');
    console.log('    GET  /api/risk/status');
    console.log('    POST /api/simulate           ← Heavy Rain trigger');
    console.log('    POST /api/signup | signin | login | update-settings');
    console.log('    GET  /api/user/:id           ← refresh user (balance)');
    console.log('    POST /api/policy/purchase');
    console.log('    GET  /api/policy/active/:user_id');
    console.log('    POST /api/user/verify-aadhaar');
    console.log('    POST /api/claim/submit');
    console.log('    GET  /api/claims/:user_id');
    console.log('    ─────────────────────────────────────────\n');
  });
});
