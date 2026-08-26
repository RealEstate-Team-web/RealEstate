const crypto = require("crypto");
const { query, pool } = require("../config/db.config");
const PasswordReset = require("../models/passwordReset.model");
const { sendPasswordResetEmail } = require("./email.service");
const { hashPassword, toSafeUser } = require("./auth.service");

const RESET_TOKEN_TTL_MINUTES = 60;

async function requestReset(email) {
  const trimmed = String(email || "").trim().toLowerCase();
  const users = await query("SELECT id, email FROM users WHERE email = ?", [
    trimmed,
  ]);
  const user = users[0];

  // Always behave the same to avoid account enumeration.
  if (!user) return { sent: true };

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = PasswordReset.hashToken(token);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Invalidate any outstanding tokens for this user, then issue a new one
    // atomically on a single connection.
    await connection.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL",
      [user.id]
    );
    await connection.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))",
      [user.id, tokenHash, RESET_TOKEN_TTL_MINUTES]
    );
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;
  // Send in the background — never block the response on SMTP delivery.
  sendPasswordResetEmail(user.email, resetLink).catch((err) =>
    console.error("[passwordReset.service] reset email failed:", err.message)
  );
  return { sent: true };
}

async function resetPassword(token, password) {
  if (!token || typeof token !== "string")
    throw Object.assign(new Error("Invalid or missing token"), { status: 400 });
  if (!password || password.length < 8)
    throw Object.assign(new Error("Password must be at least 8 characters"), {
      status: 400,
    });

  const tokenHash = PasswordReset.hashToken(token);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Atomically claim the token; only one concurrent request can succeed
    // (affectedRows === 1). This enforces single-use under concurrency.
    const [claim] = await connection.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()",
      [tokenHash]
    );
    if (claim.affectedRows !== 1) {
      await connection.rollback();
      throw Object.assign(new Error("This reset link is invalid or has expired"), {
        status: 400,
      });
    }

    const [rows] = await connection.query(
      "SELECT user_id FROM password_reset_tokens WHERE token_hash = ?",
      [tokenHash]
    );
    const userId = rows[0].user_id;

    const passwordHash = await hashPassword(password);
    await connection.query(
      "UPDATE user_credentials SET password_hash = ?, password_changed_at = NOW() WHERE user_id = ?",
      [passwordHash, userId]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  return { reset: true };
}

module.exports = { requestReset, resetPassword };
