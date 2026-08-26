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

  await PasswordReset.invalidateForUser(user.id);
  await PasswordReset.create(user.id, tokenHash, RESET_TOKEN_TTL_MINUTES);

  const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetLink);
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
  const record = await PasswordReset.findValid(tokenHash);
  if (!record)
    throw Object.assign(new Error("This reset link is invalid or has expired"), {
      status: 400,
    });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const passwordHash = await hashPassword(password);
    await connection.query(
      "UPDATE user_credentials SET password_hash = ?, password_changed_at = NOW() WHERE user_id = ?",
      [passwordHash, record.user_id]
    );
    await connection.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?",
      [record.id]
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
