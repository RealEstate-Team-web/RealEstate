const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db.config");
const User = require("../models/user.model");

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function toSafeUser(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  };
}

async function register({ firstName, lastName, email, phone, password, role, agentProfile }) {
  const existing = await User.findUserByEmail(email);
  if (existing) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const result = await connection.execute(
      `INSERT INTO users (first_name, last_name, email, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, role],
    );
    const userId = result[0].insertId;

    await connection.execute(
      "INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)",
      [userId, passwordHash],
    );

    if (agentProfile) {
      await connection.execute(
        `INSERT INTO agent_profiles
           (user_id, agency_name, license_number, experience_years, verification_status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [
          userId,
          agentProfile.agencyName,
          agentProfile.licenseNumber,
          agentProfile.experienceYears,
        ],
      );
    }

    await connection.commit();
    const created = await User.findUserByEmail(email);
    return toSafeUser(created);
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      const dup = new Error("Email or phone already registered");
      dup.status = 409;
      throw dup;
    }
    throw error;
  } finally {
    connection.release();
  }
}

async function registerAgent({
  firstName,
  lastName,
  email,
  phone,
  password,
  agencyName,
  licenseNumber,
  experienceYears,
}) {
  return register({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: "agent",
    agentProfile: { agencyName, licenseNumber, experienceYears },
  });
}

async function login({ email, password }) {
  const user = await User.findUserWithCredentials(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  if (user.status === "suspended") {
    const error = new Error("Account is suspended");
    error.status = 403;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

  return { token, user: toSafeUser(user) };
}
module.exports = { register, registerAgent, login };
