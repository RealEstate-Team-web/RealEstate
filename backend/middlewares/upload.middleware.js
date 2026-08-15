const multer = require("multer");

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("Only JPG, PNG, and WebP images are allowed"));
  },
});

const uploadSingleImage = upload.single("image");

const uploadImages = upload.array("images", 10);

module.exports = { uploadSingleImage, uploadImages };