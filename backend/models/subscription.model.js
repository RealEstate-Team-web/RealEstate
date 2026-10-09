const { pool } = require("../config/db.config");

async function exec(conn, sql, params = []) {
  if (conn) return conn.execute(sql, params);
  return pool.execute(sql, params);
}

const COLUMNS =
  "id, user_id, plan_id, status, amount, currency, duration_days, starts_at, expires_at, created_at, updated_at";

const Subscription = {
  async createForUser(conn, { userId, planId, amount, currency, durationDays }) {
    const result = await exec(
      conn,
      `INSERT INTO subscriptions
        (user_id, plan_id, status, amount, currency, duration_days)
       VALUES (?, ?, 'pending', ?, ?, ?)`,
      [userId, planId, amount, currency, durationDays]
    );
    return result[0].insertId;
  },

  // Closes a user's stale pending subscriptions and their pending payments
  // as cancelled so only the latest checkout can become active.
  async closePendingByUser(conn, userId) {
    const result = await exec(
      conn,
      `UPDATE payments p
       JOIN subscriptions s ON p.subscription_id = s.id
       SET p.status = 'cancelled', s.status = 'cancelled'
       WHERE s.user_id = ? AND s.status = 'pending'`,
      [userId]
    );
    return result[0].affectedRows;
  },

  async findById(id) {
    const rows = await exec(
      null,
      `SELECT ${COLUMNS} FROM subscriptions WHERE id = ?`,
      [id]
    );
    return rows[0][0] || null;
  },

  async findActiveByUser(userId) {
    const rows = await exec(
      null,
      `SELECT ${COLUMNS} FROM subscriptions
       WHERE user_id = ? AND status = 'active' AND expires_at > NOW()
       ORDER BY expires_at DESC
       LIMIT 1`,
      [userId]
    );
    return rows[0][0] || null;
  },

  async findPendingByUser(userId) {
    const rows = await exec(
      null,
      `SELECT ${COLUMNS} FROM subscriptions
       WHERE user_id = ? AND status = 'pending'
       ORDER BY created_at ASC`,
      [userId]
    );
    return rows[0] || [];
  },

  // Lazily marks active subscriptions whose period has elapsed as expired.
  async expireOverdueByUser(userId) {
    const result = await exec(
      null,
      `UPDATE subscriptions
       SET status = 'expired'
       WHERE user_id = ? AND status = 'active' AND expires_at <= NOW()`,
      [userId]
    );
    return result[0].affectedRows;
  },

  // Activates a subscription only if it is still pending. The status guard
  // keeps activation idempotent across duplicate callbacks/webhooks and
  // prevents a cancelled subscription from being activated.
  async activateIfPending(conn, subscriptionId) {
    const result = await exec(
      conn,
      `UPDATE subscriptions
       SET
         status = 'active',
         starts_at = NOW(),
         expires_at = DATE_ADD(NOW(), INTERVAL duration_days DAY)
       WHERE id = ? AND status = 'pending'`,
      [subscriptionId]
    );
    return result[0].affectedRows;
  },

  // Latest subscription for a user together with its plan details.
  async latestByUser(userId) {
    const rows = await exec(
      null,
      `SELECT
         s.id, s.user_id, s.plan_id, s.status, s.amount, s.currency,
         s.duration_days, s.starts_at, s.expires_at, s.created_at,
         p.name, p.slug, p.property_limit, p.images_per_property
       FROM subscriptions s
       JOIN subscription_plans p ON p.id = s.plan_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC, s.id DESC
       LIMIT 1`,
      [userId]
    );
    return rows[0][0] || null;
  },
};

module.exports = Subscription;