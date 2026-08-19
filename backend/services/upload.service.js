const cloudinary = require("../config/cloudinary.config");

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

module.exports = { uploadToCloudinary };