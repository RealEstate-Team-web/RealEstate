const express = require("express");
const { getPublicAgents } = require("../controllers/agents.controller");

const router = express.Router();

// GET /api/agents - List approved agents for the public site
router.get("/", getPublicAgents);

module.exports = router;