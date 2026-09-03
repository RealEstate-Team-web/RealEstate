const express = require("express");

const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/property.controller.js");

const router = express.Router();


router.get(
  "/",
  getProperties
);


router.get(
  "/featured",
  getFeaturedProperties
);


router.get(
  "/search",
  getProperties
);


router.get(
  "/:id",
  getPropertyById
);


router.post(
  "/",
  authenticate,
  requireRole("agent"),
  createProperty
);


router.patch(
  "/:id",
  authenticate,
  requireRole("agent"),
  updateProperty
);


router.delete(
  "/:id",
  authenticate,
  requireRole("agent"),
  deleteProperty
);


module.exports = router;