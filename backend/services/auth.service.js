const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db.config");
const User = require("../models/user.model");

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function toSafeUser(user, agentProfileStatus = null) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImageUrl: user.profile_image_url || null,
    agentProfileStatus,
  };
}

async function getAgentProfileStatus(userId) {
  const rows = await pool.execute(
    "SELECT verification_status FROM agent_profiles WHERE user_id = ?",
    [userId],
  );
  return rows[0][0] ? rows[0][0].verification_status : "incomplete";
}

async function register({
  firstName,
  lastName,
  email,
  phone,
  password,
  role = "buyer",
  agentProfile,
}) {
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
    const agentProfileStatus = created.role === "agent" ? "incomplete" : null;

    let token = null;
    if (created.role === "agent") {
      token = jwt.sign(
        { sub: created.id, email: created.email, role: created.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
      );
    }

    return { token, user: toSafeUser(created, agentProfileStatus) };
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
  const result = await register({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: "agent",
    agentProfile: { agencyName, licenseNumber, experienceYears },
  });
  return result.user;
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

  const agentProfileStatus =
    user.role === "agent" ? await getAgentProfileStatus(user.id) : null;

  return { token, user: toSafeUser(user, agentProfileStatus) };
}

async function completeAgentProfile({
  userId,
  agencyName,
  licenseNumber,
  experience,
  officeAddress,
  bio,
  profileImageUrl,
}) {
  await pool.execute(
    `INSERT INTO agent_profiles
       (user_id, agency_name, license_number, experience_years, office_address, bio, verification_status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')
     ON DUPLICATE KEY UPDATE
       agency_name = VALUES(agency_name),
       license_number = VALUES(license_number),
       experience_years = VALUES(experience_years),
       office_address = VALUES(office_address),
       bio = VALUES(bio)`,
    [
      userId,
      agencyName,
      licenseNumber,
      experience,
      officeAddress,
      bio || "",
    ],
  );

  if (profileImageUrl) {
    await pool.execute(
      "UPDATE users SET profile_image_url = ? WHERE id = ?",
      [profileImageUrl, userId],
    );
  }

  const user = await User.findById(userId);
  const agentProfileStatus = await getAgentProfileStatus(userId);
  return toSafeUser(user, agentProfileStatus);
}

module.exports = { register, registerAgent, login, completeAgentProfile, hashPassword };
