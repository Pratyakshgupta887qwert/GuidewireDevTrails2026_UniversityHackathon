'use strict';

const { Router } = require('express');
const { randomUUID } = require('crypto');
const {
  calculatePayout,
  calculateRiskScoreForCity,
  randomDisruptionHours,
  roundCurrency,
} = require('../lib/insuranceEngine');

const router = Router();

const state = {
  city: 'Noida',
  isDisrupted: false,
  eventType: null,
  rainLevel: 0,
  disruptionHours: 0,
  lastPayout: 0,
  lastSimulationAt: null,
};

let pool = null;

module.exports.setPool = (dbPool) => {
  pool = dbPool;
};

module.exports.state = state;

router.get('/status', (req, res) => {
  const city = req.query.city || state.city;
  const riskMetrics = calculateRiskScoreForCity(city);

  return res.json({
    city: riskMetrics?.city || city,
    rainLevel: riskMetrics?.environmentalData?.rain ?? state.rainLevel,
    isDisrupted: state.isDisrupted,
    payoutAmount: state.lastPayout,
    status: state.isDisrupted ? 'CRITICAL' : 'STABLE',
    risk_score: riskMetrics?.risk_score ?? 0,
    multiplier: riskMetrics?.multiplier ?? 1,
    risk_level: riskMetrics?.risk_level ?? 'Low',
    lastSimulationAt: state.lastSimulationAt,
  });
});

async function simulateEvent(req, res) {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const activePolicyResult = await pool.query(
      `SELECT * FROM policies
        WHERE user_id = $1 AND status = 'active' AND policy_end_date > NOW()
        ORDER BY policy_end_date DESC
        LIMIT 1`,
      [user_id]
    );

    if (activePolicyResult.rows.length === 0) {
      return res.status(409).json({ error: 'Activate a weekly shield before simulating an event' });
    }

    if (!user.aadhaar_verified) {
      return res.status(403).json({ error: 'Verify Aadhaar before claiming a payout' });
    }

    const activePolicy = activePolicyResult.rows[0];
    const existingClaim = await pool.query(
      `SELECT id FROM claims WHERE policy_id = $1 AND event_type = $2`,
      [activePolicy.id, 'heavy_rain']
    );

    if (existingClaim.rows.length > 0) {
      return res.status(409).json({ error: 'Heavy rain payout already simulated for this policy' });
    }

    const disruptionHours = randomDisruptionHours();
    const riskMetrics = calculateRiskScoreForCity(user.city || user.zone);
    const payoutMetrics = calculatePayout({
      avgDailyIncome: user.avg_daily_income,
      workingHours: user.working_hours,
      disruptionHours,
      coverageAmount: activePolicy.coverage_amount,
    });

    const claimInsert = await pool.query(
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
      [
        randomUUID(),
        user_id,
        activePolicy.id,
        'heavy_rain',
        payoutMetrics.payout,
      ]
    );

    const userUpdate = await pool.query(
      `UPDATE users
          SET balance = balance + $1
        WHERE id = $2
        RETURNING *`,
      [payoutMetrics.payout, user_id]
    );

    state.city = riskMetrics?.city || user.city || 'Noida';
    state.isDisrupted = true;
    state.eventType = 'heavy_rain';
    state.rainLevel = riskMetrics?.environmentalData?.rain ?? 0;
    state.disruptionHours = disruptionHours;
    state.lastPayout = payoutMetrics.payout;
    state.lastSimulationAt = new Date().toISOString();

    return res.json({
      message: 'Heavy rain simulation processed',
      event_type: 'heavy_rain',
      city: state.city,
      environmentalData: riskMetrics?.environmentalData || null,
      risk_score: riskMetrics?.risk_score ?? 0,
      multiplier: riskMetrics?.multiplier ?? 1,
      risk_level: riskMetrics?.risk_level ?? 'Low',
      hourly_income: payoutMetrics.hourly_income,
      disruption_hours: payoutMetrics.disruption_hours,
      payout: payoutMetrics.payout,
      claim: claimView(claimInsert.rows[0]),
      user: sanitizeUser(userUpdate.rows[0]),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

router.post('/simulate-event', simulateEvent);

router.post('/trigger-event', async (req, res) => {
  return simulateEvent(req, res);
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

function sanitizeUser(row) {
  const user = { ...row };
  delete user.password_hash;
  user.balance = roundCurrency(user.balance ?? 0);
  user.avg_daily_income = roundCurrency(user.avg_daily_income ?? 0);
  user.working_hours = Number(user.working_hours ?? 0);
  return user;
}

module.exports.router = router;
