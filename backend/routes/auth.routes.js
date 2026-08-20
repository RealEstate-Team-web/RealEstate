const express = require("express");
const { register, registerAgent, login, logout, completeAgentProfile, me } = require("../controllers/auth.controller");
const {
  validateRegister,
  validateRegisterAgent,
  validateCompleteAgentProfile,
  validateLogin,
} = require("../middlewares/validation.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { loginLimiter, registerLimiter } = require("../middlewares/security.middleware");
const upload = require("../config/multer.config");
const { verifyImageMagic } = upload;
const router = express.Router();

router.post("/register", registerLimiter, validateRegister, register);
router.post("/register-agent", registerLimiter, validateRegisterAgent, registerAgent);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
router.post(
  "/complete-agent-profile",
  authenticate,
  upload.single("profilePhoto"),
  verifyImageMagic,
  validateCompleteAgentProfile,
  completeAgentProfile,
);

module.exports = router;