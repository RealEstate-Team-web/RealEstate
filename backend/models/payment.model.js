const { pool } = require("../config/db.config");

async function exec(conn, sql, params = []) {
  if (conn) return conn.execute(sql, params);
  return pool.execute(sql, params);
}

const COLUMNS =
  "id, subscription_id, user_id, tx_ref, provider, status, chapa_reference, amount, currency, mode, failure_reason, created_at, updated_at";

const Payment = {
  async create(conn, { subscriptionId, userId, txRef, amount, currency, mode }) {
    const result = await exec(
      conn,
      `INSERT INTO payments
        (subscription_id, user_id, tx_ref, provider, status, amount, currency, mode)
       VALUES (?, ?, ?, 'chapa', 'pending', ?, ?, ?)`,
      [subscriptionId, userId, txRef, amount, currency, mode]
    );
    return result[0].insertId;
  },

  async findByTxRef(txRef) {
    const rows = await exec(
      null,
      `SELECT ${COLUMNS} FROM payments WHERE tx_ref = ? LIMIT 1`,
      [txRef]
    );
    return rows[0][0] || null;
  },

  // Stores the Chapa session reference returned right after initialization,
  // so the callback/verify flow can verify without waiting for the webhook.
  async setChapaReference(id, reference) {
    const result = await exec(
      null,
      `UPDATE payments
       SET chapa_reference = ?
       WHERE id = ? AND status = 'pending'`,
      [reference || null, id]
    );
    return result[0].affectedRows;
  },

  async findLatestBySubscriptionId(subscriptionId) {
    const rows = await exec(
      null,
      `SELECT status, tx_ref, chapa_reference, mode FROM payments
       WHERE subscription_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1`,
      [subscriptionId]
    );
    return rows[0][0] || null;
  },

  // Guarded on 'pending' so a payment is only marked successful once.
  async markSuccess(conn, id, { chapaReference }) {
    const result = await exec(
      conn,
      `UPDATE payments
       SET status = 'success', chapa_reference = ?
       WHERE id = ? AND status = 'pending'`,
      [chapaReference || null, id]
    );
    return result[0].affectedRows;
  },

  async markFailed(id, reason) {
    const result = await exec(
      null,
      `UPDATE payments
       SET status = 'failed', failure_reason = ?
       WHERE id = ? AND status = 'pending'`,
      [reason ? String(reason).slice(0, 255) : null, id]
    );
    return result[0].affectedRows;
  },
};

module.exports = Payment;