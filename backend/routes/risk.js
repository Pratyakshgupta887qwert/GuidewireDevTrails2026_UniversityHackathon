'use strict';

const { Router }     = require('express');
const { randomUUID } = require('crypto');

const router = Router();

// ── In-memory weather state ───────────────────────────────────────────────────
const state = {
  rainLevel:       0,
  isDisrupted:     false,
  lastEvent:       null,
  disruptionHours: 0,
  hourlyRate:      150,
  eventType:       'heavy_rain',
};

let pool = null;
module.exports.setPool = (p) => { pool = p; };
module.exports.state   = state;

// ── GET /api/risk/status ──────────────────────────────────────────────────────
router.get('/status', (_req, res) => {
  res.json({
    zone:        'Sector 62, Noida',
    rainLevel:   state.rainLevel,
    isDisrupted: state.isDisrupted,
    payoutAmount: state.isDisrupted
      ? Math.round(state.hourlyRate * state.disruptionHours)
      : 0,
    status:      state.isDisrupted ? 'CRITICAL' : 'STABLE',
    statusColor: state.isDisrupted ? 'rose'   : 'emerald',
    payoutColor: 'emerald',
    riskColor:   state.isDisrupted ? 'rose'   : 'blue',
    lastEvent:   state.lastEvent,
  });
});

// ── POST /api/admin/trigger-event  (also reached via /api/simulate) ───────────
router.post('/trigger-event', async (req, res) => {
  const {
    event_type       = 'heavy_rain',
    rain             = 12,
    disruption_hours = 3,
    hourly_rate      = 150,
  } = req.body;

  // 1. Update in-memory state
  state.rainLevel       = Number(rain);
  state.disruptionHours = Number(disruption_hours);
  state.hourlyRate      = Number(hourly_rate);
  state.eventType       = event_type;
  state.isDisrupted     = state.rainLevel > 8 && state.disruptionHours > 0;
  state.lastEvent       = state.isDisrupted
    ? { type: event_type, triggeredAt: new Date().toISOString() }
    : null;

  // 2. Auto-generate claims + update user balance for each eligible policy
  const generatedClaims = [];

  if (state.isDisrupted && pool) {
    try {
      // Expire stale policies
      await pool.query(
        `UPDATE policies SET status='expired'
         WHERE status='active' AND policy_end_date <= NOW()`
      );

      // Fetch all active policies for Aadhaar-verified users
      const { rows: activePolicies } = await pool.query(`
        SELECT p.*, u.aadhaar_verified, u.balance AS user_balance
        FROM policies p
        JOIN users u ON u.id = p.user_id
        WHERE p.status = 'active' AND u.aadhaar_verified = TRUE
      `);

      for (const policy of activePolicies) {
        // Skip if claim already exists for this event
        const { rows: dupRows } = await pool.query(
          `SELECT id FROM claims WHERE policy_id=$1 AND event_type=$2`,
          [policy.id, event_type]
        );
        if (dupRows.length > 0) {
          generatedClaims.push({
            policy_id:     policy.id,
            user_id:       policy.user_id,
            payout_amount: 0,
            note:          'already_processed',
          });
          continue;
        }

        // Calculate payout (capped at policy coverage)
        const rawPayout = state.hourlyRate * state.disruptionHours;
        const payout    = Math.min(rawPayout, parseFloat(policy.coverage_amount));

        // Insert claim record
        await pool.query(
          `INSERT INTO claims (id, user_id, policy_id, event_type, payout_amount, status)
           VALUES ($1,$2,$3,$4,$5,'auto_paid')`,
          [randomUUID(), policy.user_id, policy.id, event_type, payout]
        );

        // ─── CRITICAL: Update user balance ───────────────────────────────────
        await pool.query(
          `UPDATE users SET balance = balance + $1 WHERE id = $2`,
          [payout, policy.user_id]
        );

        generatedClaims.push({
          policy_id:     policy.id,
          user_id:       policy.user_id,
          payout_amount: payout,
        });

        console.log(`✅  Claim auto_paid: policy=${policy.id} user=${policy.user_id} ₹${payout}`);
      }
    } catch (err) {
      console.error('⚠️  Auto-claim error:', err.message);
    }
  }

  return res.json({
    message:         'System state updated',
    isDisrupted:     state.isDisrupted,
    rainLevel:       state.rainLevel,
    statusColor:     state.isDisrupted ? 'rose' : 'emerald',
    payoutColor:     'emerald',
    claimsGenerated: generatedClaims,
  });
});

module.exports.router = router;
