'use strict';

const { Router }     = require('express');
const { randomUUID } = require('crypto');

const router = Router();
let pool;
module.exports.setPool = (p) => { pool = p; };

// ── Policy tier catalogue ─────────────────────────────────────────────────────
const POLICY_TIERS = {
  low:    { tierName: 'Basic',    premium: 15,  coverage: 1000 },
  medium: { tierName: 'Standard', premium: 25,  coverage: 2000 },
  high:   { tierName: 'Extended', premium: 35,  coverage: 3000 },
};
const ALIAS = { basic: 'low', standard: 'medium', extended: 'high' };

function normalizeTier(raw = '') {
  const lower = raw.trim().toLowerCase();
  return ALIAS[lower] || lower;
}

// ── POST /api/policy/purchase ─────────────────────────────────────────────────
router.post('/purchase', async (req, res) => {
  const { user_id, selected_tier } = req.body;

  if (!user_id || !selected_tier) {
    return res.status(400).json({ error: 'user_id and selected_tier are required' });
  }

  const tierKey = normalizeTier(selected_tier);
  const tier    = POLICY_TIERS[tierKey];
  if (!tier) {
    return res.status(400).json({
      error: `Invalid tier "${selected_tier}". Use: Basic, Standard, or Extended`,
    });
  }

  try {
    // Verify the user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id=$1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found. Please sign out and sign back in.',
      });
    }

    // Expire stale policies first
    await pool.query(
      `UPDATE policies SET status='expired' WHERE status='active' AND policy_end_date <= NOW()`
    );

    // Check for existing active policy
    const existing = await pool.query(
      `SELECT id FROM policies WHERE user_id=$1 AND status='active'`,
      [user_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'You already have an active policy' });
    }

    const now     = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO policies
         (id, user_id, tier_name, policy_start_date, policy_end_date,
          premium_amount, coverage_amount, risk_level, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active') RETURNING *`,
      [randomUUID(), user_id, tier.tierName, now, endDate, tier.premium, tier.coverage, tierKey]
    );

    return res.status(201).json({
      message: `${tier.tierName} Shield activated for 7 days`,
      policy:  _policyView(result.rows[0]),
    });
  } catch (err) {
    console.error('purchase_policy error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── GET /api/policy/active/:user_id ──────────────────────────────────────────
router.get('/active/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    await pool.query(
      `UPDATE policies SET status='expired' WHERE status='active' AND policy_end_date <= NOW()`
    );

    const result = await pool.query(
      `SELECT * FROM policies
       WHERE user_id=$1 AND status='active'
       ORDER BY policy_end_date DESC LIMIT 1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active policy' });
    }

    return res.json(_policyView(result.rows[0]));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── POST /api/user/verify-aadhaar ─────────────────────────────────────────────
router.post('/verify-aadhaar', async (req, res) => {
  const { user_id, aadhaar_number } = req.body;

  if (!user_id || !aadhaar_number) {
    return res.status(400).json({ error: 'user_id and aadhaar_number are required' });
  }
  if (!/^\d{12}$/.test(aadhaar_number)) {
    return res.status(422).json({ error: 'Aadhaar must be exactly 12 digits' });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET aadhaar_number=$1, aadhaar_verified=TRUE WHERE id=$2 RETURNING *`,
      [aadhaar_number, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = { ...result.rows[0] };
    delete user.password_hash;
    user.balance = parseFloat(user.balance ?? 1250);
    return res.json({ message: 'Aadhaar verified successfully', user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Helper ────────────────────────────────────────────────────────────────────
function _policyView(row) {
  const now        = Date.now();
  const endMs      = new Date(row.policy_end_date).getTime();
  const secsLeft   = Math.max((endMs - now) / 1000, 0);
  const daysRemaining = secsLeft > 0 ? Math.ceil(secsLeft / 86400) : 0;

  return {
    id:               row.id,
    tier_name:        row.tier_name,
    premium:          parseFloat(row.premium_amount),
    coverage:         parseFloat(row.coverage_amount),
    risk_level:       row.risk_level,
    days_remaining:   daysRemaining,
    status:           row.status,
    policy_start_date: row.policy_start_date,
    policy_end_date:  row.policy_end_date,
    statusColor:      row.status === 'active' ? 'emerald' : 'slate',
    coverageColor:    'blue',
    premiumColor:     'rose',
  };
}

module.exports.router = router;
