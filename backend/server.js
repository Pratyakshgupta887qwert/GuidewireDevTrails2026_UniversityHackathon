const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const POLICY_TIERS = {
  low: { tierName: 'Basic', premiumAmount: 15, coverageAmount: 1000 },
  medium: { tierName: 'Standard', premiumAmount: 25, coverageAmount: 2000 },
  high: { tierName: 'Extended', premiumAmount: 35, coverageAmount: 3000 }
};

let currentRainLevel = 0;
let isDisrupted = false;

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      phone VARCHAR(20) UNIQUE,
      password_hash TEXT,
      aadhaar VARCHAR(50),
      dl VARCHAR(50),
      rc VARCHAR(50),
      zone VARCHAR(100),
      upi_id VARCHAR(100)
    )
  `);

  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS aadhaar_number VARCHAR(12),
    ADD COLUMN IF NOT EXISTS aadhaar_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS policies (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tier_name VARCHAR(20) NOT NULL,
      policy_start_date TIMESTAMPTZ NOT NULL,
      policy_end_date TIMESTAMPTZ NOT NULL,
      premium_amount NUMERIC(10, 2) NOT NULL,
      coverage_amount NUMERIC(10, 2) NOT NULL,
      risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
      status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS ux_policies_one_active_per_user
    ON policies (user_id)
    WHERE status = 'active'
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS claims (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      policy_id INTEGER NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
      event_type VARCHAR(50) NOT NULL,
      payout_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (policy_id, event_type)
    )
  `);

  console.log('Postgres DB initialized');
}

async function expirePolicies() {
  await pool.query(`
    UPDATE policies
    SET status = 'expired'
    WHERE status = 'active' AND policy_end_date <= NOW()
  `);
}

async function getActivePolicy(userId) {
  await expirePolicies();
  const result = await pool.query(
    `SELECT *
     FROM policies
     WHERE user_id = $1 AND status = 'active'
     ORDER BY policy_end_date DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
}

function formatPolicy(policy) {
  const endDate = new Date(policy.policy_end_date);
  const now = new Date();
  const msLeft = Math.max(endDate.getTime() - now.getTime(), 0);
  const daysRemaining = msLeft === 0 ? 0 : Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  return {
    id: policy.id,
    tier_name: policy.tier_name,
    premium: Number(policy.premium_amount),
    coverage: Number(policy.coverage_amount),
    risk_level: policy.risk_level,
    days_remaining: daysRemaining,
    status: policy.status,
    policy_start_date: policy.policy_start_date,
    policy_end_date: policy.policy_end_date
  };
}

async function createClaim({ user, policy, eventType, hourlyRate, disruptionHours }) {
  if (!user.aadhaar_verified) {
    const error = new Error('Verify Aadhaar before claiming a payout');
    error.status = 403;
    throw error;
  }

  await expirePolicies();
  const latestPolicy = await getActivePolicy(user.id);
  if (!latestPolicy || latestPolicy.id !== policy.id) {
    const error = new Error('Policy is no longer active');
    error.status = 400;
    throw error;
  }

  const duplicateClaim = await pool.query(
    'SELECT id FROM claims WHERE policy_id = $1 AND event_type = $2',
    [policy.id, eventType]
  );

  if (duplicateClaim.rows.length > 0) {
    const error = new Error('Claim already processed for this event');
    error.status = 409;
    throw error;
  }

  const payoutAmount = Math.min(Number(hourlyRate) * Number(disruptionHours), Number(policy.coverage_amount));

  const claimResult = await pool.query(
    `INSERT INTO claims (user_id, policy_id, event_type, payout_amount, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user.id, policy.id, eventType, payoutAmount, 'auto_paid']
  );

  return claimResult.rows[0];
}

app.get('/api/risk-status', (req, res) => {
  res.json({
    zone: 'Sector 62, Noida',
    rainLevel: currentRainLevel,
    isDisrupted,
    payoutAmount: isDisrupted ? 450 : 0,
    status: isDisrupted ? 'CRITICAL' : 'STABLE'
  });
});

app.post('/api/signup', async (req, res) => {
  const { name, phone, password, zone, upi } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, phone, password_hash, zone, upi_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, phone, zone, upi_id, aadhaar_number, aadhaar_verified`,
      [name, phone, hash, zone, upi]
    );

    res.status(201).json({ message: 'Registration successful', user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Phone number already registered' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/signin', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    delete user.password_hash;
    res.json({ message: 'Logged in successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update-settings', async (req, res) => {
  const { phone, name, zone, upi_id } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number required to identify user' });
  }

  try {
    await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           zone = COALESCE($2, zone),
           upi_id = COALESCE($3, upi_id)
       WHERE phone = $4`,
      [name, zone, upi_id, phone]
    );

    const result = await pool.query(
      `SELECT id, name, phone, zone, upi_id, aadhaar_number, aadhaar_verified
       FROM users
       WHERE phone = $1`,
      [phone]
    );

    res.json({ message: 'Settings updated successfully', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/verify-aadhaar', async (req, res) => {
  const { user_id, aadhaar_number } = req.body;

  if (!/^\d{12}$/.test(String(aadhaar_number || ''))) {
    return res.status(400).json({ error: 'Aadhaar number must be exactly 12 digits' });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET aadhaar_number = $1, aadhaar_verified = TRUE
       WHERE id = $2
       RETURNING id, name, phone, zone, upi_id, aadhaar_number, aadhaar_verified`,
      [aadhaar_number, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Aadhaar verified successfully', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/policy/purchase', async (req, res) => {
  const { user_id, selected_tier } = req.body;
  const normalizedTier = String(selected_tier || '').toLowerCase();
  const tier = POLICY_TIERS[normalizedTier];

  if (!tier) {
    return res.status(400).json({ error: 'selected_tier must be low, medium, or high' });
  }

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingPolicy = await getActivePolicy(user_id);
    if (existingPolicy) {
      return res.status(409).json({ error: 'You already have an active policy' });
    }

    const result = await pool.query(
      `INSERT INTO policies (
        user_id, tier_name, policy_start_date, policy_end_date,
        premium_amount, coverage_amount, risk_level, status
      )
      VALUES ($1, $2, NOW(), NOW() + INTERVAL '7 days', $3, $4, $5, 'active')
      RETURNING *`,
      [user_id, tier.tierName, tier.premiumAmount, tier.coverageAmount, normalizedTier]
    );

    res.status(201).json({
      message: 'Policy Activated for 7 Days',
      policy: formatPolicy(result.rows[0])
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'You already have an active policy' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/policy/active/:userId', async (req, res) => {
  try {
    const policy = await getActivePolicy(req.params.userId);
    if (!policy) {
      return res.status(404).json({ error: 'No active policy' });
    }

    res.json(formatPolicy(policy));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/claims/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, policy_id, event_type, payout_amount, status, created_at
       FROM claims
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.params.userId]
    );

    res.json({
      claims: result.rows.map((claim) => ({
        ...claim,
        payout_amount: Number(claim.payout_amount)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/claim/submit', async (req, res) => {
  const { user_id, policy_id, event_type, hourly_rate, disruption_hours } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const policyResult = await pool.query('SELECT * FROM policies WHERE id = $1 AND user_id = $2', [policy_id, user_id]);
    if (policyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Policy not found for user' });
    }

    const claim = await createClaim({
      user: userResult.rows[0],
      policy: policyResult.rows[0],
      eventType: event_type,
      hourlyRate: hourly_rate,
      disruptionHours: disruption_hours
    });

    res.json({
      message: 'Claim processed successfully',
      claim: {
        ...claim,
        payout_amount: Number(claim.payout_amount)
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.post('/api/admin/trigger-event', async (req, res) => {
  const {
    event_type = 'heavy_rain',
    rain = 12,
    disruption_hours = 3,
    hourly_rate = 150
  } = req.body;

  currentRainLevel = Number(rain) || 0;
  isDisrupted = currentRainLevel > 8 && Number(disruption_hours) > 0;

  try {
    await expirePolicies();
    const generatedClaims = [];

    if (isDisrupted) {
      const activePolicies = await pool.query(
        `SELECT p.*, u.aadhaar_verified, u.aadhaar_number, u.name, u.phone, u.zone, u.upi_id, u.id AS user_id_ref
         FROM policies p
         JOIN users u ON u.id = p.user_id
         WHERE p.status = 'active'`
      );

      for (const policy of activePolicies.rows) {
        const user = {
          id: policy.user_id_ref,
          aadhaar_verified: policy.aadhaar_verified
        };

        try {
          const claim = await createClaim({
            user,
            policy,
            eventType: event_type,
            hourlyRate: hourly_rate,
            disruptionHours: disruption_hours
          });

          generatedClaims.push({
            claim_id: claim.id,
            user_id: claim.user_id,
            policy_id: claim.policy_id,
            payout_amount: Number(claim.payout_amount)
          });
        } catch (error) {
          if (![403, 409].includes(error.status)) {
            throw error;
          }
        }
      }
    }

    res.json({
      message: 'System state updated',
      isDisrupted,
      rainLevel: currentRainLevel,
      claimsGenerated: generatedClaims
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.post('/api/simulate-disruption', async (req, res) => {
  const rain = Number(req.body.rain) || 0;
  currentRainLevel = rain;
  isDisrupted = rain > 8;
  res.json({ message: 'System state updated', isDisrupted });
});

initializeDatabase()
  .catch((error) => {
    console.error('DB Init Error:', error.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`AegisAI Backend running on http://localhost:${PORT}`);
    });
  });
