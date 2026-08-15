const cloudinary = require("../config/cloudinary.config");

const BASE_FOLDER = process.env.CLOUDINARY_FOLDER || "real-estate";

const ALLOWED_SCOPES = ["properties", "agents", "profiles"];

const ENTITY_ID_PATTERN = /^[A-Za-z0-9-]+$/;

class UploadValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "UploadValidationError";
    this.status = status;
  }
}

function buildFolder(scope, entityId) {
  if (!ALLOWED_SCOPES.includes(scope)) {
    throw new UploadValidationError(`Invalid upload scope: ${scope}`);
  }
  if (entityId === undefined || entityId === null || entityId === "") {
    throw new UploadValidationError("entityId is required");
  }
  const id = String(entityId);
  if (!ENTITY_ID_PATTERN.test(id)) {
    throw new UploadValidationError("Invalid entityId format");
  }
  return `${BASE_FOLDER}/${scope}/${id}`;
}

function uploadImage(buffer, { scope, entityId, publicId, resourceType = "image" } = {}) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    return Promise.reject(new UploadValidationError("Image buffer is required"));
  }
  const folder = buildFolder(scope, entityId);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ secureUrl: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

module.exports = {
  uploadImage,
  deleteImage,
  buildFolder,
  UploadValidationError,
  ALLOWED_SCOPES,
  BASE_FOLDER,
};