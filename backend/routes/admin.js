'use strict';

const { Router } = require('express');
const { randomUUID } = require('crypto');
const {
  calculatePayout,
  randomDisruptionHours,
  roundCurrency,
} = require('../lib/insuranceEngine');

const router = Router();
let pool = null;

// In-memory admin state (logs, notifications, settings) — resets on restart
const adminState = {
  logs: [],
  notifications: [],
  settings: {
    base_premium: 15,
    max_payout: 3000,
    rain_threshold: 20,
    fraud_velocity_kmh: 120,
    auto_payout_enabled: true,
    fraud_detection_enabled: true,
  },
  weatherState: { isDisrupted: false },
};

function addLog(action, actor = 'admin') {
  adminState.logs.unshift({ id: randomUUID(), action, actor, timestamp: new Date().toISOString() });
  if (adminState.logs.length > 200) adminState.logs.pop();
}

module.exports.setPool = (dbPool) => { pool = dbPool; };
module.exports.router = router;
module.exports.adminState = adminState;

// ─── GET /api/admin/stats ────────────────────────────────────────────────────
// Real SQL: total revenue, claims pool, active workers, payout totals
router.get('/stats', async (_req, res) => {
  try {
    const [revenue, payouts, workers, policies, todayPaid] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(premium_amount), 0) AS total FROM policies`),
      pool.query(`SELECT COALESCE(SUM(payout_amount), 0) AS total FROM claims`),
      pool.query(`SELECT COUNT(*) AS total FROM users`),
      pool.query(`SELECT COUNT(*) FILTER (WHERE status = 'active') AS active, COUNT(*) AS total FROM policies`),
      pool.query(`
        SELECT COALESCE(SUM(payout_amount), 0) AS total
          FROM claims
         WHERE created_at >= NOW() - INTERVAL '1 day'`),
    ]);

    const totalPremiums   = roundCurrency(revenue.rows[0].total);
    const totalPaid       = roundCurrency(payouts.rows[0].total);
    const claimsReserve   = roundCurrency(totalPremiums * 0.75);
    const operatingProfit = roundCurrency(totalPremiums * 0.25);
    const liquidityPct    = claimsReserve > 0
      ? roundCurrency((totalPaid / claimsReserve) * 100)
      : 0;

    return res.json({
      treasury: {
        totalPremiums,
        totalPaid,
        claimsReserve,
        operatingProfit,
        liquidityPct,
        todayPaid: roundCurrency(todayPaid.rows[0].total),
      },
      users: {
        total: Number(workers.rows[0].total),
      },
      policies: {
        active: Number(policies.rows[0].active),
        total:  Number(policies.rows[0].total),
      },
      weatherState: adminState.weatherState,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/admin/users ────────────────────────────────────────────────────
// All workers from DB with policy/claim counts
router.get('/users', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.phone,
        u.city,
        u.zone,
        u.aadhaar_verified,
        u.balance,
        u.avg_daily_income,
        u.working_hours,
        u.is_flagged,
        u.last_location,
        u.vehicle_number,
        u.partner_platform,
        u.created_at,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active') AS active_policies,
        COUNT(DISTINCT c.id)                                    AS total_claims
      FROM users u
      LEFT JOIN policies p ON p.user_id = u.id
      LEFT JOIN claims   c ON c.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    return res.json({
      users: result.rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        city: r.city,
        zone: r.zone || r.city,
        aadhaar_verified: r.aadhaar_verified,
        balance: roundCurrency(r.balance),
        avg_daily_income: roundCurrency(r.avg_daily_income),
        working_hours: Number(r.working_hours),
        is_flagged: Boolean(r.is_flagged),
        last_location: r.last_location || null,
        vehicle_number: r.vehicle_number || null,
        partner_platform: r.partner_platform || null,
        active_policies: Number(r.active_policies),
        total_claims: Number(r.total_claims),
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/admin/policies ─────────────────────────────────────────────────
router.get('/policies', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        u.name  AS user_name,
        u.phone AS phone,
        u.zone  AS zone
      FROM policies p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
      LIMIT 200
    `);

    return res.json({
      policies: result.rows.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        user_name: r.user_name,
        phone: r.phone,
        zone: r.zone,
        tier_name: r.tier_name,
        premium_amount: roundCurrency(r.premium_amount),
        coverage_amount: roundCurrency(r.coverage_amount),
        risk_level: r.risk_level,
        status: r.status,
        policy_start_date: r.policy_start_date,
        policy_end_date: r.policy_end_date,
        city: r.city,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/admin/payouts ──────────────────────────────────────────────────
// Real payouts from claims table joined with user + policy info
router.get('/payouts', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.user_id,
        c.policy_id,
        c.event_type,
        c.payout_amount,
        c.status,
        c.created_at,
        u.name     AS user_name,
        u.phone,
        u.zone,
        u.is_flagged,
        p.tier_name
      FROM claims c
      JOIN users    u ON u.id = c.user_id
      JOIN policies p ON p.id = c.policy_id
      ORDER BY c.created_at DESC
      LIMIT 300
    `);

    return res.json({
      payouts: result.rows.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        user_name: r.user_name,
        phone: r.phone,
        zone: r.zone || 'Unknown',
        is_flagged: Boolean(r.is_flagged),
        tier_name: r.tier_name,
        event_type: r.event_type,
        payout_amount: roundCurrency(r.payout_amount),
        status: r.status,
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/admin/worker/:id/flag ────────────────────────────────────────
router.patch('/worker/:id/flag', async (req, res) => {
  const { flagged } = req.body;
  try {
    await pool.query(
      `UPDATE users SET is_flagged = $1 WHERE id = $2`,
      [Boolean(flagged), req.params.id]
    );
    addLog(`Worker ${req.params.id} ${flagged ? 'flagged' : 'cleared'}`);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/admin/claim/:id/action ───────────────────────────────────────
router.patch('/claim/:id/action', async (req, res) => {
  const { action } = req.body;
  const validActions = { approve: 'approved', flag: 'flagged', payout: 'auto_paid' };
  const newStatus = validActions[action];
  if (!newStatus) return res.status(400).json({ error: 'Invalid action' });

  try {
    await pool.query(`UPDATE claims SET status = $1 WHERE id = $2`, [newStatus, req.params.id]);
    addLog(`Claim ${req.params.id} → ${newStatus}`);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/admin/simulate-global ─────────────────────────────────────────
// Trigger a disruption event for all eligible workers in a zone.
// Also saves each payout to the claims table (real DB write).
router.post('/simulate-global', async (req, res) => {
  const { event_type = 'heavy_rain', zone } = req.body;

  if (event_type === 'reset') {
    adminState.weatherState.isDisrupted = false;
    addLog('System reset — disruption cleared', 'admin');
    return res.json({ ok: true, claimsGenerated: [] });
  }

  try {
    // Find eligible users: have active policy + aadhaar verified + in zone (optional)
    const eligibleQuery = `
      SELECT
        u.id AS user_id,
        u.avg_daily_income,
        u.working_hours,
        u.aadhaar_verified,
        p.id   AS policy_id,
        p.coverage_amount,
        p.tier_name,
        u.zone
      FROM users u
      JOIN policies p ON p.user_id = u.id
                      AND p.status = 'active'
                      AND p.policy_end_date > NOW()
      WHERE u.aadhaar_verified = TRUE
        ${zone ? `AND (u.zone ILIKE $1 OR u.city ILIKE $1)` : ''}
    `;

    const eligibleResult = zone
      ? await pool.query(eligibleQuery, [`%${zone}%`])
      : await pool.query(eligibleQuery);

    const claimsGenerated = [];

    for (const row of eligibleResult.rows) {
      // Skip if claim already exists for this policy+event
      const dup = await pool.query(
        `SELECT id FROM claims WHERE policy_id = $1 AND event_type = $2`,
        [row.policy_id, event_type]
      );
      if (dup.rows.length > 0) continue;

      const disruptionHours = randomDisruptionHours();
      const payoutMetrics = calculatePayout({
        avgDailyIncome: row.avg_daily_income,
        workingHours: row.working_hours,
        disruptionHours,
        coverageAmount: row.coverage_amount,
      });

      const claimId = randomUUID();
      await pool.query(
        `INSERT INTO claims (id, user_id, policy_id, event_type, payout_amount, status)
         VALUES ($1, $2, $3, $4, $5, 'auto_paid')`,
        [claimId, row.user_id, row.policy_id, event_type, payoutMetrics.payout]
      );

      await pool.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [payoutMetrics.payout, row.user_id]
      );

      claimsGenerated.push({ user_id: row.user_id, claim_id: claimId, payout: payoutMetrics.payout });
    }

    adminState.weatherState.isDisrupted = true;
    addLog(`Global ${event_type} triggered${zone ? ` in ${zone}` : ''} — ${claimsGenerated.length} claims`, 'admin');

    return res.json({ ok: true, claimsGenerated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/admin/logs ──────────────────────────────────────────────────────
router.get('/logs', (_req, res) => {
  return res.json({ logs: adminState.logs });
});

// ─── GET /api/admin/notifications ────────────────────────────────────────────
router.get('/notifications', (_req, res) => {
  return res.json({ notifications: adminState.notifications });
});

// ─── POST /api/admin/notify ───────────────────────────────────────────────────
router.post('/notify', (req, res) => {
  const { type = 'system', title, message, zone } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'title and message are required' });

  const notif = {
    id: randomUUID(),
    type,
    title,
    message,
    zone: zone || 'All Zones',
    sent_at: new Date().toISOString(),
  };
  adminState.notifications.unshift(notif);
  if (adminState.notifications.length > 100) adminState.notifications.pop();
  addLog(`Notification sent: "${title}"`);
  return res.json({ ok: true, notification: notif });
});

// ─── GET /api/admin/settings ─────────────────────────────────────────────────
router.get('/settings', (_req, res) => {
  return res.json({ settings: adminState.settings });
});

// ─── POST /api/admin/settings ────────────────────────────────────────────────
router.post('/settings', (req, res) => {
  adminState.settings = { ...adminState.settings, ...req.body };
  addLog('Platform settings updated');
  return res.json({ ok: true, settings: adminState.settings });
});
