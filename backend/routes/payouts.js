'use strict';

const { Router }     = require('express');
const { randomUUID } = require('crypto');

const router = Router();
let pool;
module.exports.setPool = (p) => { pool = p; };

// ── POST /api/claim/submit ────────────────────────────────────────────────────
router.post('/submit', async (req, res) => {
  const { user_id, policy_id, event_type, hourly_rate = 150, disruption_hours = 3 } = req.body;

  if (!user_id || !policy_id || !event_type) {
    return res.status(400).json({ error: 'user_id, policy_id, and event_type are required' });
  }

  try {
    // Verify Aadhaar
    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id=$1', [user_id]);
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = userRows[0];
    if (!user.aadhaar_verified) {
      return res.status(403).json({
        error: 'Verify Aadhaar before claiming a payout',
        color: 'amber',
      });
    }

    // Verify policy belongs to user
    const { rows: policyRows } = await pool.query(
      `SELECT * FROM policies WHERE id=$1 AND user_id=$2`,
      [policy_id, user_id]
    );
    if (policyRows.length === 0) return res.status(404).json({ error: 'Policy not found for user' });
    const policy = policyRows[0];
    if (policy.status !== 'active') return res.status(400).json({ error: 'Policy is no longer active' });

    // Prevent duplicate claim for same event
    const { rows: dupRows } = await pool.query(
      `SELECT id FROM claims WHERE policy_id=$1 AND event_type=$2`,
      [policy_id, event_type]
    );
    if (dupRows.length > 0) {
      return res.status(409).json({ error: 'Claim already processed for this event' });
    }

    const rawPayout = Number(hourly_rate) * Number(disruption_hours);
    const payout    = Math.min(rawPayout, parseFloat(policy.coverage_amount));

    // Insert claim
    const { rows: claimRows } = await pool.query(
      `INSERT INTO claims (id, user_id, policy_id, event_type, payout_amount, status)
       VALUES ($1,$2,$3,$4,$5,'auto_paid') RETURNING *`,
      [randomUUID(), user_id, policy_id, event_type, payout]
    );

    // Update user balance
    await pool.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2`,
      [payout, user_id]
    );

    return res.status(201).json({
      message: 'Claim processed successfully',
      claim:   _claimView(claimRows[0]),
    });
  } catch (err) {
    console.error('submit_claim error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── GET /api/claims/:user_id ──────────────────────────────────────────────────
router.get('/:user_id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM claims WHERE user_id=$1 ORDER BY created_at DESC`,
      [req.params.user_id]
    );
    return res.json({ claims: rows.map(_claimView) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Helper ────────────────────────────────────────────────────────────────────
function _claimView(row) {
  return {
    id:            row.id,
    policy_id:     row.policy_id,
    event_type:    row.event_type,
    payout_amount: parseFloat(row.payout_amount),
    status:        row.status,
    created_at:    row.created_at,
    statusColor:   'emerald',
    payoutColor:   'emerald',
    iconColor:     'rose',
  };
}

module.exports.router = router;
