const dotenv = require("dotenv");

const CHAPA_API_URL =
  process.env.CHAPA_API_URL || "https://api.chapa.global/v2";
const CHAPA_MODE = (process.env.CHAPA_MODE || "test").toLowerCase();

// Chapa secret-key formats: current dashboard keys are CHAPA_TEST_PRIV_...
// in test mode; the legacy prefix CHASECK_TEST- is still accepted.
const TEST_SECRET_PREFIXES = ["CHASECK_TEST-", "CHAPA_TEST_PRIV_"];

function isTestSecretKey(key) {
  return TEST_SECRET_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function getChapaConfig() {
  const secretKey = (process.env.CHAPA_SECRET_KEY || "").trim();

  if (CHAPA_MODE !== "test") {
    const error = new Error(
      `Chapa is TEST MODE only. Set CHAPA_MODE=test (found "${CHAPA_MODE}").`
    );
    error.status = 503;
    error.code = "CHAPA_MODE_NOT_TEST";
    throw error;
  }

  if (!secretKey || !isTestSecretKey(secretKey)) {
    const error = new Error(
      "CHAPA_SECRET_KEY must be a Chapa test secret key (CHAPA_TEST_PRIV_... or CHASECK_TEST-...)."
    );
    error.status = 503;
    error.code = "CHAPA_SECRET_KEY_INVALID";
    throw error;
  }

  const returnUrl = (process.env.CHAPA_RETURN_URL || "").trim();
  if (returnUrl && !/^https:\/\//.test(returnUrl)) {
    const error = new Error(
      "CHAPA_RETURN_URL must be an https:// URL (Chapa only allows https return URLs)."
    );
    error.status = 503;
    error.code = "CHAPA_RETURN_URL_INVALID";
    throw error;
  }

  return {
    apiUrl: CHAPA_API_URL,
    mode: CHAPA_MODE,
    secretKey,
    publicKey: (process.env.CHAPA_PUBLIC_KEY || "").trim(),
    webhookSecret: (process.env.CHAPA_WEBHOOK_SECRET || "").trim(),
    returnUrl,
  };
}

module.exports = { getChapaConfig, CHAPA_API_URL, CHAPA_MODE };