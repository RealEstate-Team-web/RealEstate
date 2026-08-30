const express = require( "express");

const {
  getProperties,
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
  "/:id",
  getPropertyById
);


router.post(
  "/",
  createProperty
);


router.patch(
  "/:id",
  updateProperty
);


router.delete(
  "/:id",
  deleteProperty
);


module.exports=router;