const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favorite.controller");
const { validateAddFavorite } = require("../middlewares/validation.middleware");

const router = express.Router();

router.use(authenticate, requireRole("buyer", "admin"));

router.get("/", getFavorites);
router.post("/", validateAddFavorite, addFavorite);
router.delete("/:propertyId", removeFavorite);

module.exports = router;
