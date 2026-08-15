const { query } = require("../config/db.config");
const { ALLOWED_SCOPES, UploadValidationError } = require("./upload.service");

class UploadAccessError extends Error {
  constructor(message, status = 403) {
    super(message);
    this.name = "UploadAccessError";
    this.status = status;
  }
}

async function assertUploadAccess({ scope, entityId, user }) {
  if (!ALLOWED_SCOPES.includes(scope)) {
    throw new UploadValidationError(`Invalid upload scope: ${scope}`);
  }
  if (!user || !user.id) {
    throw new UploadAccessError("Authentication required", 401);
  }
  const id = String(entityId);

  if (scope === "profiles") {
    if (id !== String(user.id)) {
      throw new UploadAccessError("You can only upload to your own profile");
    }
    return;
  }

  if (scope === "agents") {
    if (user.role !== "agent" || id !== String(user.id)) {
      throw new UploadAccessError("Only the agent can upload to their own agent image");
    }
    return;
  }

  if (scope === "properties") {
    const rows = await query("SELECT agent_id FROM properties WHERE id = ?", [entityId]);
    if (rows.length === 0) {
      throw new UploadAccessError("Property not found", 404);
    }
    const isOwner = user.role === "agent" && String(rows[0].agent_id) === String(user.id);
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new UploadAccessError("You are not authorized to upload images for this property");
    }
    return;
  }
}

module.exports = { assertUploadAccess, UploadAccessError };