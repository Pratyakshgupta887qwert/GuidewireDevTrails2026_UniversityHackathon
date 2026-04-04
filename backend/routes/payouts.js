'use strict';

const { Router } = require('express');
const { randomUUID } = require('crypto');
const { calculatePayout, roundCurrency } = require('../lib/insuranceEngine');

const router = Router();
let pool;

module.exports.setPool = (dbPool) => {
  pool = dbPool;
};

router.post('/submit', async (req, res) => {
  const { user_id, policy_id, event_type, disruption_hours } = req.body;

  if (!user_id || !policy_id || !event_type) {
    return res.status(400).json({ error: 'user_id, policy_id, and event_type are required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    if (!user.aadhaar_verified) {
      return res.status(403).json({ error: 'Verify Aadhaar before claiming a payout' });
    }

    const policyResult = await pool.query(
      `SELECT * FROM policies WHERE id = $1 AND user_id = $2`,
      [policy_id, user_id]
    );

    if (policyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Policy not found for user' });
    }

    const policy = policyResult.rows[0];
    if (policy.status !== 'active') {
      return res.status(400).json({ error: 'Policy is no longer active' });
    }

    const duplicateClaim = await pool.query(
      `SELECT id FROM claims WHERE policy_id = $1 AND event_type = $2`,
      [policy_id, event_type]
    );

    if (duplicateClaim.rows.length > 0) {
      return res.status(409).json({ error: 'Claim already processed for this event' });
    }

    const payoutMetrics = calculatePayout({
      avgDailyIncome: user.avg_daily_income,
      workingHours: user.working_hours,
      disruptionHours: disruption_hours || 4,
      coverageAmount: policy.coverage_amount,
    });

    const claimResult = await pool.query(
      `INSERT INTO claims (
          id,
          user_id,
          policy_id,
          event_type,
          payout_amount,
          status
        )
        VALUES ($1,$2,$3,$4,$5,'auto_paid')
        RETURNING *`,
      [randomUUID(), user_id, policy_id, event_type, payoutMetrics.payout]
    );

    await pool.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2`,
      [payoutMetrics.payout, user_id]
    );

    return res.status(201).json({
      message: 'Claim processed successfully',
      claim: claimView(claimResult.rows[0]),
      payout: payoutMetrics.payout,
      hourly_income: payoutMetrics.hourly_income,
      disruption_hours: payoutMetrics.disruption_hours,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:user_id', async (req, res) => {
  try {
    const claimsResult = await pool.query(
      `SELECT * FROM claims WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.params.user_id]
    );

    const summaryResult = await pool.query(
      `SELECT
          COALESCE((SELECT SUM(premium_amount) FROM policies WHERE user_id = $1), 0) AS total_premium_paid,
          COALESCE((SELECT SUM(payout_amount) FROM claims WHERE user_id = $1), 0) AS total_payout_received`,
      [req.params.user_id]
    );

    const summaryRow = summaryResult.rows[0];
    const totalPremiumPaid = roundCurrency(summaryRow.total_premium_paid);
    const totalPayoutReceived = roundCurrency(summaryRow.total_payout_received);

    return res.json({
      claims: claimsResult.rows.map(claimView),
      summary: {
        total_premium_paid: totalPremiumPaid,
        total_payout_received: totalPayoutReceived,
        profit: roundCurrency(totalPayoutReceived - totalPremiumPaid),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

function claimView(row) {
  return {
    id: row.id,
    policy_id: row.policy_id,
    event_type: row.event_type,
    payout_amount: roundCurrency(row.payout_amount),
    status: row.status,
    created_at: row.created_at,
  };
}

module.exports.router = router;
