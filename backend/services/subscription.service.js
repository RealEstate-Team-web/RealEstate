const Subscription = require("../models/subscription.model");
const Payment = require("../models/payment.model");
const SubscriptionPlan = require("../models/subscriptionPlan.model");
const chapaService = require("./chapa.service");
const { getChapaConfig } = require("../config/chapa.config");
const { withTransaction } = require("../config/db.config");

function httpError(message, status, code) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

// Chapa v2 merchant_reference must be <= 20 chars. Fixed length is always 20:
// SUB + base36(userId, 4 chars) + base36(ms timestamp, ~9) + base36(4 random).
function generateTxRef(userId) {
  const id = Number(userId).toString(36).padStart(4, "0");
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 6);
  return `SUB${id}${timestamp}${random}`;
}

// Compares the user's latest pending checkout with Chapa and activates it when
// the payment was actually collected and verified. This heals the gap when a
// webhook/callback is missed (test mode has no publicly reachable URL), so
// starts_at/expires_at are written even without a server-to-server notification.
// Returns { success } or null when there is nothing to reconcile.
async function reconcileLatestPending(userId) {
  const subscription = await Subscription.latestByUser(userId);
  if (!subscription || subscription.status !== "pending") return null;

  const payment = await Payment.findLatestBySubscriptionId(subscription.id);
  if (!payment || payment.status !== "pending") return null;

  const chapaPayment = await chapaService.findPaymentByMerchantReference(
    payment.tx_ref
  );
  if (!chapaPayment || chapaPayment.status !== "success" || !chapaPayment.chapaReference) {
    return null;
  }

  return processVerifiedPayment(payment.tx_ref, chapaPayment.chapaReference);
}

// Reconciles ALL pending subscriptions for a user. Any pending payment that
// Chapa already collected gets activated, ensuring paid checkouts are never
// lost when a newer checkout starts.
async function reconcileAllPending(userId) {
  const pendingSubscriptions = await Subscription.findPendingByUser(userId);
  if (!pendingSubscriptions) return;

  for (const subscription of pendingSubscriptions) {
    // Skip if already active (safety check)
    const alreadyActive = await Subscription.findActiveByUser(userId);
    if (alreadyActive) break;

    const payment = await Payment.findLatestBySubscriptionId(subscription.id);
    if (!payment || payment.status !== "pending") continue;

    const chapaPayment = await chapaService.findPaymentByMerchantReference(
      payment.tx_ref
    );
    if (!chapaPayment || chapaPayment.status !== "success" || !chapaPayment.chapaReference) {
      continue;
    }

    await processVerifiedPayment(payment.tx_ref, chapaPayment.chapaReference);
  }
}

// Initializes a pending subscription + payment and starts the Chapa checkout.
async function checkout(user, { planId }) {
  const plan = await SubscriptionPlan.getById(planId);
  if (!plan || Number(plan.is_active) !== 1) {
    throw httpError("Subscription plan not found", 404, "PLAN_NOT_FOUND");
  }

  // Reconcile ALL pending subscriptions first so any payment Chapa already
  // collected is activated instead of being cancelled by closePendingByUser
  // below. Then check if the user has an active subscription to prevent
  // re-paying for a subscription they already own.
  await reconcileAllPending(user.id);

  const activeSubscription = await Subscription.findActiveByUser(user.id);
  if (activeSubscription) {
    throw httpError(
      "You already have an active subscription",
      409,
      "ACTIVE_SUBSCRIPTION_EXISTS"
    );
  }

  const txRef = generateTxRef(user.id);
  const amount = Number(plan.price);
  const currency = String(plan.currency || "ETB").toUpperCase();

  const { subscriptionId, paymentId } = await withTransaction(async (conn) => {
    await Subscription.closePendingByUser(conn, user.id);
    const newSubscriptionId = await Subscription.createForUser(conn, {
      userId: user.id,
      planId: plan.id,
      amount,
      currency,
      durationDays: plan.duration_days,
    });
    const newPaymentId = await Payment.create(conn, {
      subscriptionId: newSubscriptionId,
      userId: user.id,
      txRef,
      amount,
      currency,
      mode: "test",
    });
    return { subscriptionId: newSubscriptionId, paymentId: newPaymentId };
  });

  let initialization;
  try {
    initialization = await chapaService.initializePayment({
      amount,
      currency,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phone,
      txRef,
      description: plan.description || "Subscription plan payment",
      returnUrl: getChapaConfig().returnUrl || undefined,
    });
  } catch (error) {
    await Payment.markFailed(paymentId, error.message);
    throw error;
  }

  // Store the payment-session reference so the callback can verify it without
  // waiting for a webhook. Webhook STILL runs verification before activating.
  if (initialization.reference) {
    await Payment.setChapaReference(paymentId, initialization.reference);
  }

  return {
    checkoutUrl: initialization.checkoutUrl,
    txRef,
    subscriptionId,
  };
}

// Verifies a payment against the Chapa v2 API and activates the subscription
// when the payment is confirmed. Shared by the webhook and the callback so the
// outcome never depends on which notification arrived first.
//
// reference: optional Chapa reference override (webhook provides
// `chapa_reference`); when omitted the reference stored at checkout is used.
async function processVerifiedPayment(txRef, reference) {
  const payment = await Payment.findByTxRef(txRef);
  if (!payment) return { ignored: true, reason: "unknown_tx_ref" };
  if (payment.status === "success") return { ignored: true, reason: "already_processed" };
  if (payment.status !== "pending") return { ignored: true, reason: "not_pending" };

  const verifyReference = reference || payment.chapa_reference;
  if (!verifyReference) {
    return { ignored: true, reason: "no_chapa_reference" };
  }

  const verified = await chapaService.verifyPayment(verifyReference);

  if (verified.status !== "success") {
    // Only terminal failure states should burn the pending payment; transient
    // states (pending/auth_needed) are left alone so the webhook can still
    // succeed later.
    if (["failed", "cancelled", "blocked", "incomplete"].includes(verified.status)) {
      await Payment.markFailed(
        payment.id,
        `Chapa verification status="${verified.status}"`
      );
    }
    return {
      ignored: true,
      reason: `verification_${verified.status || "unknown"}`,
    };
  }

  const amountMatches =
    verified.amount != null &&
    Number(verified.amount) === chapaService.toMinorUnits(payment.amount);
  const currencyMatches =
    verified.currency != null &&
    verified.currency.toUpperCase() === String(payment.currency).toUpperCase();
  const referenceMatches =
    !verified.merchantReference ||
    verified.merchantReference === payment.tx_ref;

  if (!amountMatches || !currencyMatches || !referenceMatches) {
    await Payment.markFailed(
      payment.id,
      `Mismatch (amount=${verified.amount} ${verified.currency} ref=${verified.merchantReference})`
    );
    return { ignored: true, reason: "verification_mismatch" };
  }

  await withTransaction(async (conn) => {
    await Payment.markSuccess(conn, payment.id, {
      chapaReference: verified.chapaReference || payment.chapa_reference,
    });
    await Subscription.activateIfPending(conn, payment.subscription_id);
  });

  return { success: true };
}

// Marks the pending payment failed (webhook-reported failure/cancel/incomplete).
async function markPaymentFailed(txRef, reason) {
  const payment = await Payment.findByTxRef(txRef);
  if (payment && payment.status === "pending") {
    await Payment.markFailed(payment.id, reason);
  }
}

// Returns the agent's current subscription state; the backend is the source of
// truth for what the frontend result page displays.
async function getCurrent(userId) {
  await Subscription.expireOverdueByUser(userId);

  let subscription = await Subscription.latestByUser(userId);
  if (!subscription) return { subscription: null };

  // Self-heal a missed notification: if the latest checkout is still pending
  // but Chapa already collected the payment, activate it so start/expiry dates
  // are stored before the result page renders.
  if (subscription.status === "pending") {
    await reconcileLatestPending(userId);
    subscription = await Subscription.latestByUser(userId);
  }

  const payment = await Payment.findLatestBySubscriptionId(subscription.id);

  const isActive =
    subscription.status === "active" &&
    subscription.expires_at &&
    new Date(subscription.expires_at).getTime() > Date.now();

  return {
    subscription: {
      id: subscription.id,
      status: subscription.status,
      isActive,
      amount: subscription.amount,
      currency: subscription.currency,
      durationDays: subscription.duration_days,
      startsAt: subscription.starts_at,
      expiresAt: subscription.expires_at,
      paymentStatus: payment ? payment.status : null,
      paymentTxRef: payment ? payment.tx_ref : null,
      paymentMode: payment ? payment.mode : null,
      plan: {
        id: subscription.plan_id,
        name: subscription.name,
        slug: subscription.slug,
        propertyLimit: subscription.property_limit,
        imagesPerProperty: subscription.images_per_property,
      },
    },
  };
}

module.exports = { checkout, reconcileAllPending, processVerifiedPayment, markPaymentFailed, getCurrent };