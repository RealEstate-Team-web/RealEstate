const multer = require("multer");

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const IMAGE_MAGIC = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
];

function matchesMagic(buffer, signature) {
  if (buffer.length < signature.length) return false;
  return signature.every((byte, i) => buffer[i] === byte);
}

// Full WebP signature: "RIFF" at bytes 0-3 followed by the "WEBP" fourcc at
// bytes 8-11. Checking only the RIFF header would accept WAV/AVI files.
function matchesWebp(buffer) {
  if (buffer.length < 12) return false;
  return (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  );
}

function fileHasAllowedMagic(buffer) {
  if (matchesMagic(buffer, IMAGE_MAGIC[0].bytes)) return true;
  if (matchesMagic(buffer, IMAGE_MAGIC[1].bytes)) return true;
  return matchesWebp(buffer);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      const error = new Error("Only JPEG, PNG, or WebP images are allowed");
      error.status = 400;
      return cb(error, false);
    }
    cb(null, true);
  },
});

const verifyImageMagic = (req, res, next) => {
  if (req.file && !fileHasAllowedMagic(req.file.buffer)) {
    const error = new Error("Uploaded file is not a valid image");
    error.status = 400;
    return next(error);
  }
  next();
};

const verifyImagesMagic = (req, res, next) => {
  const files = req.files || [];
  for (const file of files) {
    if (!fileHasAllowedMagic(file.buffer)) {
      const error = new Error("Uploaded file is not a valid image");
      error.status = 400;
      return next(error);
    }
  }
  next();
};

module.exports = upload;
module.exports.verifyImageMagic = verifyImageMagic;
module.exports.verifyImagesMagic = verifyImagesMagic;