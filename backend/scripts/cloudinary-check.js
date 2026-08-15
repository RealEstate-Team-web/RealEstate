require("dotenv").config();

const { validateEnv } = require("../config/env");

validateEnv();

const cloudinary = require("../config/cloudinary.config");

const TEST_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

async function run() {
  try {
    const ping = await cloudinary.api.ping();
    console.log("Cloudinary connection OK:", ping.status);

    const uploaded = await cloudinary.uploader.upload(TEST_PNG, {
      folder: process.env.CLOUDINARY_FOLDER || "real-estate",
      public_id: "cloudinary-check",
    });
    console.log("Test upload OK:");
    console.log("  folder/public_id:", uploaded.public_id);
    console.log("  url:", uploaded.secure_url);

    const deleted = await cloudinary.uploader.destroy(uploaded.public_id);
    console.log("Test cleanup OK:", JSON.stringify(deleted));
  } catch (error) {
    console.error("Cloudinary check failed:", error.message);
    process.exit(1);
  }
}

run();