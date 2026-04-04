'use strict';

const { Router } = require('express');
const { randomUUID } = require('crypto');
const {
  calculatePlanCatalogue,
  calculateRiskScoreForCity,
  normalizePlanKey,
  roundCurrency,
} = require('../lib/insuranceEngine');

const router = Router();
let pool;

module.exports.setPool = (dbPool) => {
  pool = dbPool;
};

router.post('/purchase', async (req, res) => {
  const { user_id, selected_tier } = req.body;

  if (!user_id || !selected_tier) {
    return res.status(400).json({ error: 'user_id and selected_tier are required' });
  }

  const planKey = normalizePlanKey(selected_tier);
  if (!planKey) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    if (!user.aadhaar_verified) {
      return res.status(403).json({ error: 'Verify Aadhaar before activating a weekly shield' });
    }

    await pool.query(
      `UPDATE policies
          SET status = 'expired'
        WHERE status = 'active' AND policy_end_date <= NOW()`
    );

    const existingPolicy = await pool.query(
      `SELECT id FROM policies WHERE user_id = $1 AND status = 'active'`,
      [user_id]
    );

    if (existingPolicy.rows.length > 0) {
      return res.status(409).json({ error: 'You already have an active policy' });
    }

    const planCatalogue = calculatePlanCatalogue(user.city || user.zone);
    if (!planCatalogue) {
      return res.status(422).json({ error: 'Unable to calculate plan for the selected city' });
    }

    const plan = planCatalogue.plans.find((item) => item.key === planKey);
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const insertResult = await pool.query(
      `INSERT INTO policies (
          id,
          user_id,
          tier_name,
          policy_start_date,
          policy_end_date,
          premium_amount,
          coverage_amount,
          risk_level,
          status,
          risk_score,
          multiplier,
          city
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active',$9,$10,$11)
        RETURNING *`,
      [
        randomUUID(),
        user_id,
        plan.name,
        now,
        endDate,
        plan.premium,
        plan.coverage,
        plan.risk_level.toLowerCase(),
        plan.risk_score,
        plan.multiplier,
        planCatalogue.city,
      ]
    );

    return res.status(201).json({
      message: `${plan.name} activated for 7 days`,
      policy: policyView(insertResult.rows[0]),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/active/:user_id', async (req, res) => {
  try {
    await pool.query(
      `UPDATE policies
          SET status = 'expired'
        WHERE status = 'active' AND policy_end_date <= NOW()`
    );

    const result = await pool.query(
      `SELECT * FROM policies
        WHERE user_id = $1 AND status = 'active'
        ORDER BY policy_end_date DESC
        LIMIT 1`,
      [req.params.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active policy' });
    }

    return res.json(policyView(result.rows[0]));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/verify-aadhaar', async (req, res) => {
  const { user_id, aadhaar_number, otp } = req.body;

  if (!user_id || !aadhaar_number || !otp) {
    return res.status(400).json({ error: 'user_id, aadhaar_number, and otp are required' });
  }

  if (!/^\d{12}$/.test(String(aadhaar_number))) {
    return res.status(422).json({ error: 'Aadhaar must be exactly 12 digits' });
  }

  if (String(otp) !== '123456') {
    return res.status(401).json({ error: 'Invalid Aadhaar OTP. Use 123456 for simulation.' });
  }

  try {
    const result = await pool.query(
      `UPDATE users
          SET aadhaar_number = $1,
              aadhaar_verified = TRUE
        WHERE id = $2
        RETURNING *`,
      [String(aadhaar_number), user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = sanitizeUser(result.rows[0]);
    return res.json({ message: 'Aadhaar verified successfully', user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/calculate-plan', async (req, res) => {
  const { city, selected_tier } = req.body;
  const planCatalogue = calculatePlanCatalogue(city);

  if (!planCatalogue) {
    return res.status(422).json({ error: 'Unsupported city selected' });
  }

  if (!selected_tier) {
    return res.json(planCatalogue);
  }

  const planKey = normalizePlanKey(selected_tier);
  const plan = planCatalogue.plans.find((item) => item.key === planKey);

  if (!plan) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  return res.json({
    city: planCatalogue.city,
    multiplier: planCatalogue.multiplier,
    risk_score: planCatalogue.risk_score,
    risk_level: planCatalogue.risk_level,
    environmentalData: planCatalogue.environmentalData,
    componentScores: planCatalogue.componentScores,
    plan,
  });
});

router.post('/risk-score', (req, res) => {
  const { city } = req.body;
  const riskMetrics = calculateRiskScoreForCity(city);

  if (!riskMetrics) {
    return res.status(422).json({ error: 'Unsupported city selected' });
  }

  return res.json(riskMetrics);
});

function sanitizeUser(row) {
  const user = { ...row };
  delete user.password_hash;
  user.balance = roundCurrency(user.balance ?? 0);
  user.avg_daily_income = roundCurrency(user.avg_daily_income ?? 0);
  user.working_hours = Number(user.working_hours ?? 0);
  return user;
}

function policyView(row) {
  const now = Date.now();
  const endMs = new Date(row.policy_end_date).getTime();
  const millisecondsLeft = Math.max(endMs - now, 0);
  const daysRemaining = millisecondsLeft > 0 ? Math.ceil(millisecondsLeft / 86400000) : 0;
  const riskScore = Number(row.risk_score ?? 0);

  return {
    id: row.id,
    tier_name: row.tier_name,
    premium: roundCurrency(row.premium_amount),
    coverage: roundCurrency(row.coverage_amount),
    risk_level: row.risk_level,
    risk_score: roundCurrency(riskScore),
    multiplier: roundCurrency(row.multiplier ?? 1),
    city: row.city,
    days_remaining: daysRemaining,
    status: row.status,
    policy_start_date: row.policy_start_date,
    policy_end_date: row.policy_end_date,
  };
}

module.exports.router = router;
