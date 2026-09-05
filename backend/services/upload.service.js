const cloudinary = require("../config/cloudinary.config");

const PLACEHOLDER_CLOUD_NAMES = new Set(["", "root", "your-cloud-name", "example"]);

function assertCloudinaryConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

  if (PLACEHOLDER_CLOUD_NAMES.has(cloudName.trim()) || !apiKey || !apiSecret) {
    const detail =
      "Cloudinary is not configured (CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in backend/.env).";
    console.error(`[upload] ${detail}`);

    const error = new Error(
      "Image upload is currently unavailable. Please try again later.",
    );
    error.status = 500;
    error.statusCode = 500;
    throw error;
  }
}

function uploadToCloudinary(buffer, { folder = "agent-profile" } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", overwrite: false },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

function uploadPropertyImage(buffer, { folder } = {}) {
  assertCloudinaryConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", overwrite: false },
      (error, result) => {
        if (error) return reject(error);
        resolve({ imageUrl: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

function destroyImage(publicId) {
  if (!publicId) return Promise.resolve();
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(publicId, { invalidate: true }, (error) => {
      if (error) {
        console.error(
          `[upload] Failed to destroy Cloudinary asset ${publicId}:`,
          error.message,
        );
      }
      resolve();
    });
  });
}

module.exports = { uploadToCloudinary, uploadPropertyImage, destroyImage };