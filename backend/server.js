'use strict';

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
require('dotenv').config();

const riskModule = require('./routes/risk');
const policiesModule = require('./routes/policies');
const payoutsModule = require('./routes/payouts');
const adminModule = require('./routes/admin');
const { SUPPORTED_CITIES, roundCurrency } = require('./lib/insuranceEngine');

const { router: riskRouter, state: riskState } = riskModule;

const PORT = parseInt(process.env.PORT || '8000', 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

riskModule.setPool(pool);
policiesModule.setPool(pool);
payoutsModule.setPool(pool);
adminModule.setPool(pool);

const app = express();
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

function safeUser(row) {
  if (!row) {
    return null;
  }

  const user = { ...row };
  delete user.password_hash;
  user.balance = roundCurrency(user.balance ?? 0);
  user.avg_daily_income = roundCurrency(user.avg_daily_income ?? 0);
  user.working_hours = Number(user.working_hours ?? 0);
  return user;
}

async function initDB() {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    const typeCheck = await pool.query(`
      SELECT data_type
        FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'users'
         AND column_name = 'id'
    `);

    const existingType = typeCheck.rows[0]?.data_type;

    if (existingType && existingType !== 'text') {
      await pool.query('DROP TABLE IF EXISTS claims CASCADE');
      await pool.query('DROP TABLE IF EXISTS policies CASCADE');
      await pool.query('DROP TABLE IF EXISTS users CASCADE');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        city VARCHAR(50) NOT NULL DEFAULT 'Noida',
        zone VARCHAR(50) NOT NULL DEFAULT 'Noida',
        pan_card VARCHAR(20) NOT NULL,
        phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
        aadhaar_number VARCHAR(12),
        aadhaar_verified BOOLEAN NOT NULL DEFAULT FALSE,
        avg_daily_income NUMERIC(10,2) NOT NULL DEFAULT 1200,
        working_hours NUMERIC(5,2) NOT NULL DEFAULT 10,
        balance NUMERIC(12,2) NOT NULL DEFAULT 0,
        vehicle_number VARCHAR(15),
        partner_platform VARCHAR(50),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(50) NOT NULL DEFAULT 'Noida'`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS zone VARCHAR(50) NOT NULL DEFAULT 'Noida'`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pan_card VARCHAR(20) NOT NULL DEFAULT 'TEMP0000A'`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT FALSE`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS aadhaar_number VARCHAR(12)`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS aadhaar_verified BOOLEAN NOT NULL DEFAULT FALSE`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avg_daily_income NUMERIC(10,2) NOT NULL DEFAULT 1200`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS working_hours NUMERIC(5,2) NOT NULL DEFAULT 10`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2) NOT NULL DEFAULT 0`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(15)`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS partner_platform VARCHAR(50)`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS policies (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tier_name VARCHAR(20) NOT NULL,
        policy_start_date TIMESTAMPTZ NOT NULL,
        policy_end_date TIMESTAMPTZ NOT NULL,
        premium_amount NUMERIC(10,2) NOT NULL,
        coverage_amount NUMERIC(10,2) NOT NULL,
        risk_level VARCHAR(10) NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'active',
        risk_score NUMERIC(6,2) NOT NULL DEFAULT 0,
        multiplier NUMERIC(4,2) NOT NULL DEFAULT 1,
        city VARCHAR(50) NOT NULL DEFAULT 'Noida',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`ALTER TABLE policies ADD COLUMN IF NOT EXISTS risk_score NUMERIC(6,2) NOT NULL DEFAULT 0`);
    await pool.query(`ALTER TABLE policies ADD COLUMN IF NOT EXISTS multiplier NUMERIC(4,2) NOT NULL DEFAULT 1`);
    await pool.query(`ALTER TABLE policies ADD COLUMN IF NOT EXISTS city VARCHAR(50) NOT NULL DEFAULT 'Noida'`);

    // Add fraud/location columns if not present
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN NOT NULL DEFAULT FALSE`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_location TEXT`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS claims (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        policy_id TEXT NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        payout_amount NUMERIC(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (policy_id, event_type)
      )
    `);

    const demoUser = await pool.query('SELECT id FROM users WHERE phone = $1', ['9876543210']);
    if (demoUser.rows.length === 0) {
      const hash = await bcrypt.hash('otp-simulated-auth', 10);
      await pool.query(
        `INSERT INTO users (
            id,
            name,
            phone,
            password_hash,
            city,
            zone,
            pan_card,
            phone_verified,
            aadhaar_verified,
            avg_daily_income,
            working_hours,
            balance
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE,FALSE,$8,$9,$10)`,
        [randomUUID(), 'Demo User', '9876543210', hash, 'Delhi', 'Delhi', 'ABCDE1234F', 1500, 10, 0]
      );
    }

    console.log('Database ready');
  } catch (error) {
    console.error('DB init error:', error.message);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', cities: SUPPORTED_CITIES });
});

app.post('/api/signup', async (req, res) => {
  const {
    name,
    phone,
    pan_card,
    city,
    avg_daily_income = 1200,
    working_hours = 10,
    vehicle_number,
    partner_platform,
    otp_verified = false,
  } = req.body;

  if (!name || !phone || !pan_card || !city) {
    return res.status(400).json({ error: 'name, phone, pan_card, and city are required' });
  }

  if (!SUPPORTED_CITIES.includes(city)) {
    return res.status(422).json({ error: 'Please select a supported city' });
  }

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(pan_card)) {
    return res.status(422).json({ error: 'PAN card format should look like ABCDE1234F' });
  }

  try {
    const passwordHash = await bcrypt.hash('otp-simulated-auth', 10);
    const result = await pool.query(
      `INSERT INTO users (
          id,
          name,
          phone,
          password_hash,
          city,
          zone,
          pan_card,
          phone_verified,
          avg_daily_income,
          working_hours,
          vehicle_number,
          partner_platform,
          balance
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,0)
        RETURNING *`,
      [
        randomUUID(),
        name,
        phone,
        passwordHash,
        city,
        city,
        pan_card.toUpperCase(),
        Boolean(otp_verified),
        avg_daily_income,
        working_hours,
        vehicle_number ? vehicle_number.toUpperCase() : null,
        partner_platform,
      ]
    );

    return res.status(201).json({
      message: 'Signup successful',
      user: safeUser(result.rows[0]),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    return res.status(500).json({ error: error.message });
  }
});

async function handleSignIn(req, res) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'phone is required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }

    return res.json({
      message: 'Login successful',
      user: safeUser(result.rows[0]),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

app.post('/api/signin', handleSignIn);
app.post('/api/login', handleSignIn);

app.post('/api/update-settings', async (req, res) => {
  const {
    phone,
    name,
    city,
    pan_card,
    avg_daily_income,
    working_hours,
    vehicle_number,
    partner_platform,
  } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'phone is required' });
  }

  try {
    await pool.query(
      `UPDATE users
          SET name = COALESCE($1, name),
              city = COALESCE($2, city),
              zone = COALESCE($2, zone),
              pan_card = COALESCE($3, pan_card),
              avg_daily_income = COALESCE($4, avg_daily_income),
              working_hours = COALESCE($5, working_hours),
              vehicle_number = COALESCE($6, vehicle_number),
              partner_platform = COALESCE($7, partner_platform)
        WHERE phone = $8`,
      [
        name || null,
        city || null,
        pan_card || null,
        avg_daily_income || null,
        working_hours || null,
        vehicle_number ? vehicle_number.toUpperCase() : null,
        partner_platform || null,
        phone
      ]
    );

    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      message: 'Settings updated successfully',
      user: safeUser(result.rows[0]),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/user/update', async (req, res) => {
  const {
    id,
    phone,
    vehicle_number,
    partner_platform,
  } = req.body;

  if (!id && !phone) {
    return res.status(400).json({ error: 'id or phone is required' });
  }

  try {
    const query = id 
      ? 'UPDATE users SET vehicle_number = COALESCE($1, vehicle_number), partner_platform = COALESCE($2, partner_platform) WHERE id = $3 RETURNING *'
      : 'UPDATE users SET vehicle_number = COALESCE($1, vehicle_number), partner_platform = COALESCE($2, partner_platform) WHERE phone = $3 RETURNING *';
    
    const result = await pool.query(query, [
      vehicle_number ? vehicle_number.toUpperCase() : null,
      partner_platform || null,
      id || phone
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user: safeUser(result.rows[0]),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: safeUser(userResult.rows[0]) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use('/api/risk', riskRouter);
app.use('/api/admin', adminModule.router);
app.use('/api/policy', policiesModule.router);
app.use('/api/user', policiesModule.router);
app.use('/api/claim', payoutsModule.router);
app.use('/api/claims', payoutsModule.router);
app.use('/api', policiesModule.router);
app.use('/api', riskRouter);

app.get('/api/risk-status', async (req, res) => {
  const city = req.query.city || riskState.city || 'Noida';
  req.query.city = city;
  req.url = '/status';
  riskRouter(req, res, () => {});
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`AegisAI backend running on http://localhost:${PORT}`);
  });
});