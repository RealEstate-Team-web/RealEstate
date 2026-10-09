const subscriptionService = require("../services/subscription.service");
const chapaService = require("../services/chapa.service");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// POST /api/payments/chapa/webhook
// Public endpoint called by Chapa. Always acknowledge with 200 so Chapa stops
// retrying; return an error status only when processing failed transiently so
// Chapa retries.
const webhook = async (req, res) => {
  try {
    if (!chapaService.verifyWebhookSignature(req)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid webhook signature" });
    }

    const body = req.body || {};
    const merchantRef = body.merchant_reference;
    const chapaRef = body.chapa_reference;
    const status = String(body.status || "").toLowerCase();
    const event = String(body.event || "").toLowerCase();
    const mode = String(body.mode || "").toLowerCase();

    if (!merchantRef) {
      return res.status(200).json({ success: true, ignored: true });
    }

    // Only honor test-mode events; the callback/verify path re-checks anyway.
    if (mode === "test") {
      if (status === "success" || event === "payment.success") {
        const result = await subscriptionService.processVerifiedPayment(
          merchantRef,
          chapaRef
        );
        if (result.success) {
          console.log(
            `Chapa webhook activated subscription for tx_ref=${merchantRef}`
          );
        }
      } else if (
        ["failed", "cancelled", "incomplete", "blocked"].includes(status) ||
        event.startsWith("payment.")
      ) {
        await subscriptionService.markPaymentFailed(
          merchantRef,
          body.reason || status || event
        );
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Chapa webhook processing failed:", error.message);
    return res
      .status(502)
      .json({ success: false, message: "Webhook processing failed" });
  }
};

// GET /api/payments/chapa/callback
// Called by Chapa after a payment completes. Never trust the callback status
// directly; verify through the Chapa API, then redirect the agent to the
// frontend result page which reads the backend state.
const callback = async (req, res, next) => {
  try {
    const txRef =
      req.query.tx_ref || req.query.trx_ref || req.query.merchant_reference;
    const status = String(req.query.status || "").toLowerCase();

    let outcome = "failed";

    if (txRef && status === "success") {
      try {
        const result = await subscriptionService.processVerifiedPayment(txRef);
        outcome = result.success ? "success" : "pending";
      } catch (error) {
        console.error("Chapa callback verification failed:", error.message);
        outcome = "pending";
      }
    } else if (txRef) {
      outcome = "pending";
    }

    const params = new URLSearchParams({ status: outcome });
    if (txRef) params.set("tx_ref", txRef);

    return res.redirect(`${CLIENT_URL}/agent/subscription/result?${params.toString()}`);
  } catch (error) {
    return next(error);
  }
};

module.exports = { webhook, callback };