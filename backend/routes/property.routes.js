const express = require("express");
const upload = require("../config/multer.config");
const { verifyImagesMagic } = upload;

const { authenticate, authenticateOptional } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const {
  validateCreateProperty,
  validateUpdateProperty,
  validateIdParam,
} = require("../middlewares/validation.middleware");

const {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  duplicateProperty,
  uploadPropertyImages,
} = require("../controllers/property.controller.js");

const router = express.Router();

const handleMulterErrors = (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (!err) return next();

    if (err && err.name === "MulterError") {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Each image must be 5MB or smaller"
          : err.code === "LIMIT_FILE_COUNT" ||
            err.code === "LIMIT_UNEXPECTED_FILE"
            ? "A maximum of 10 images per property is allowed"
            : "Image upload failed";
      const error = new Error(message);
      error.status = 400;
      return next(error);
    }

    next(err);
  });
};


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
  "/my-properties",
  authenticate,
  requireRole("agent"),
  getMyProperties
);


router.get(
  "/:id",
  authenticateOptional,
  validateIdParam,
  getPropertyById
);


router.post(
  "/",
  authenticate,
  requireRole("agent"),
  validateCreateProperty,
  createProperty
);


router.patch(
  "/:id",
  authenticate,
  requireRole("agent"),
  validateIdParam,
  validateUpdateProperty,
  updateProperty
);


router.delete(
  "/:id",
  authenticate,
  requireRole("agent"),
  validateIdParam,
  deleteProperty
);


router.post(
  "/:id/duplicate",
  authenticate,
  requireRole("agent"),
  validateIdParam,
  duplicateProperty
);


router.post(
  "/:id/images",
  authenticate,
  requireRole("agent"),
  validateIdParam,
  handleMulterErrors,
  verifyImagesMagic,
  uploadPropertyImages
);


module.exports = router;