const express = require("express");
const { webhook, callback } = require("../controllers/payment.controller");

const router = express.Router();

// Public Chapa endpoints (no JWT; authenticated via signature / verification).
router.post("/chapa/webhook", webhook);
router.get("/chapa/callback", callback);

module.exports = router;