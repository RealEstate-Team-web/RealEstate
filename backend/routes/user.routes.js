const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/user.controller");
const { validateUpdateProfile } = require("../middlewares/validation.middleware");
const upload = require("../config/multer.config");
const { verifyImageMagic } = upload;

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, validateUpdateProfile, updateProfile);
router.post(
  "/profile/image",
  authenticate,
  upload.single("image"),
  verifyImageMagic,
  uploadProfileImage,
);

module.exports = router;