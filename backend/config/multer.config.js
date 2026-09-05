const multer = require("multer");

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const IMAGE_MAGIC = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

function matchesMagic(buffer, signature) {
  if (buffer.length < signature.length) return false;
  return signature.every((byte, i) => buffer[i] === byte);
}

function fileHasAllowedMagic(buffer) {
  for (const sig of IMAGE_MAGIC) {
    if (matchesMagic(buffer, sig.bytes)) return true;
  }
  return false;
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