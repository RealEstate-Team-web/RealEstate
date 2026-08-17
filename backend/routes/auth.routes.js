const express = require("express");
const { register, registerAgent, login, logout, me } = require("../controllers/auth.controller");
const {
  validateRegister,
  validateRegisterAgent,
  validateLogin,
} = require("../middlewares/validation.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/register-agent", validateRegisterAgent, registerAgent);
router.post("/login", validateLogin, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

module.exports = router;