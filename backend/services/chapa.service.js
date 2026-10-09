const crypto = require("crypto");
const { getChapaConfig } = require("../config/chapa.config");

function providerError(message, status = 502, code = "CHAPA_ERROR") {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return { message: "Invalid response from Chapa" };
  }
}

// Chapa v2 expects a phone number in international format (+251...).
function normalizePhone(phone) {
  const digits = String(phone || "").replace(/[^0-9]/g, "");
  if (digits.startsWith("251") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+251${digits.slice(1)}`;
  if (digits.startsWith("9") && digits.length === 9) return `+251${digits}`;
  return undefined;
}

// Chapa v2 amounts are whole numbers in the currency's minor unit (cents).
function toMinorUnits(amount) {
  return Math.round(Number(amount) * 100);
}

// The reference Chapa uses for verification is the last path segment of the
// hosted checkout URL (https://checkout.chapa.global/test/payment/hosted/<REF>).
function referenceFromCheckoutUrl(checkoutUrl) {
  if (!checkoutUrl || typeof checkoutUrl !== "string") return null;
  const match = checkoutUrl.match(/\/hosted\/([^/?]+)$/);
  return match ? match[1] : null;
}

// POST https://api.chapa.global/v2/payments/hosted
async function initializePayment({
  amount,
  currency,
  email,
  firstName,
  lastName,
  phoneNumber,
  txRef,
  title,
  description,
  returnUrl,
}) {
  const config = getChapaConfig();

  const payload = {
    amount: toMinorUnits(amount),
    currency,
    customer: {
      first_name: firstName || "",
      last_name: lastName || "",
      email,
      ...(normalizePhone(phoneNumber)
        ? { phone_number: normalizePhone(phoneNumber) }
        : {}),
    },
    merchant_reference: txRef,
    ...(returnUrl ? { return_url: returnUrl } : {}),
    meta: {
      order_id: txRef,
      ...(description ? { notes: description } : {}),
    },
  };

  let response;
  try {
    response = await fetch(`${config.apiUrl}/payments/hosted`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw providerError(
      "Unable to reach the payment provider. Please try again.",
      502,
      "CHAPA_NETWORK_ERROR"
    );
  }

  const data = await readJson(response);

  if (
    !response.ok ||
    String(data.status).toLowerCase() !== "success" ||
    !data.data?.checkout_url
  ) {
    throw providerError(
      data.message || "Unable to start the payment. Please try again.",
      502,
      "CHAPA_INITIALIZE_FAILED"
    );
  }

  return {
    checkoutUrl: data.data.checkout_url,
    reference: referenceFromCheckoutUrl(data.data.checkout_url),
    txRef,
  };
}

// GET https://api.chapa.global/v2/payments/{reference}/verify
async function verifyPayment(reference) {
  const config = getChapaConfig();

  let response;
  try {
    response = await fetch(
      `${config.apiUrl}/payments/${encodeURIComponent(reference)}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw providerError(
      "Unable to reach the payment provider to verify the payment.",
      502,
      "CHAPA_NETWORK_ERROR"
    );
  }

  const data = await readJson(response);

  if (!response.ok) {
    throw providerError(
      data.message || "Unable to verify the payment.",
      502,
      "CHAPA_VERIFY_FAILED"
    );
  }

  const transaction = data.data || {};

  return {
    status: String(transaction.status || data.status || "").toLowerCase(),
    amount: transaction.amount != null ? Number(transaction.amount) : null,
    currency: transaction.currency
      ? String(transaction.currency).toUpperCase()
      : null,
    chapaReference: transaction.chapa_reference || null,
    merchantReference: transaction.merchant_reference || null,
  };
}

// GET https://api.chapa.global/v2/payments?reference={merchantReference}
// Resolves Chapa's record for a merchant reference (our tx_ref). Unpaid hosted
// sessions are not listed yet, so this returns null until Chapa records the
// payment. Used to reconcile payments whose webhook/callback never reached us.
async function findPaymentByMerchantReference(txRef) {
  const config = getChapaConfig();

  let response;
  try {
    response = await fetch(
      `${config.apiUrl}/payments?reference=${encodeURIComponent(txRef)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return null;
  }

  const data = await readJson(response);
  if (!response.ok) return null;

  const match = ((data.data || {}).items || []).find(
    (item) => item.merchant_reference === txRef
  );
  if (!match) return null;

  return {
    chapaReference: match.chapa_reference || null,
    status: String(match.status || "").toLowerCase(),
  };
}

function hmacSha256Hex(secret, payload) {
  if (typeof payload === "string") payload = Buffer.from(payload);
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function sameHash(expected, actual) {
  if (typeof expected !== "string" || typeof actual !== "string") return false;
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

// Verifies the Chapa webhook signature. Chapa signs the exact raw JSON body
// with HMAC-SHA256 (keyed with the webhook secret) and sends it in the
// `x-chapa-signature` header (`chapa-signature` is accepted as an alias).
// The raw body must be verified before it is parsed or reserialized.
function verifyWebhookSignature(req) {
  const secret = (process.env.CHAPA_WEBHOOK_SECRET || "").trim();
  if (!secret) return false;

  const header =
    req.headers["chapa-signature"] || req.headers["x-chapa-signature"];
  if (!header) return false;

  const raw = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
  if (sameHash(header, hmacSha256Hex(secret, raw))) return true;

  // Fallback: some proxies reserialize the body with a different byte order.
  if (req.rawBody) {
    const body = Buffer.from(JSON.stringify(req.body || {}));
    if (sameHash(header, hmacSha256Hex(secret, body))) return true;
  }

  return false;
}

module.exports = {
  initializePayment,
  verifyPayment,
  findPaymentByMerchantReference,
  verifyWebhookSignature,
  normalizePhone,
  toMinorUnits,
};