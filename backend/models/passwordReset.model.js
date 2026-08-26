const { query } = require("../config/db.config");
const crypto = require("crypto");

async function create(userId, tokenHash, ttlMinutes) {
  const result = await query(
    "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))",
    [userId, tokenHash, ttlMinutes]
  );
  return result.insertId;
}

async function findValid(tokenHash) {
  const rows = await query(
    "SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()",
    [tokenHash]
  );
  return rows[0];
}

async function invalidateForUser(userId) {
  await query(
    "UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL",
    [userId]
  );
}

async function markUsed(id) {
  await query(
    "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?",
    [id]
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  create,
  findValid,
  invalidateForUser,
  markUsed,
  hashToken,
};
