const User = require("../models/user.model");

function toSafeProfile(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImageUrl: user.profile_image_url || null,
    createdAt: user.created_at || null,
  };
}

async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return toSafeProfile(user);
}

async function updateProfile(userId, fields) {
  const existing = await User.findById(userId);
  if (!existing) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const phone = fields.phone ? String(fields.phone).trim() : fields.phone;

  if (phone && phone !== existing.phone) {
    const duplicate = await User.findUserByPhone(phone);
    if (duplicate && String(duplicate.id) !== String(userId)) {
      const error = new Error("Phone number already in use");
      error.status = 409;
      throw error;
    }
  }

  await User.updateProfile(userId, { ...fields, phone });

  const updated = await User.findById(userId);
  return toSafeProfile(updated);
}

async function uploadProfileImage(userId, profileImageUrl) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  await User.updateProfileImage(userId, profileImageUrl);

  const updated = await User.findById(userId);
  return toSafeProfile(updated);
}

module.exports = { getProfile, updateProfile, uploadProfileImage };