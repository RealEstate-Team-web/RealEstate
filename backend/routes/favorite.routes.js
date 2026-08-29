const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favorite.controller");
const {
  validateAddFavorite,
  validatePropertyIdParam,
} = require("../middlewares/validation.middleware");

const router = express.Router();

router.use(authenticate, requireRole("buyer"));

router.get("/", getFavorites);
router.post("/", validateAddFavorite, addFavorite);
router.delete("/:propertyId", validatePropertyIdParam, removeFavorite);

module.exports = router;
