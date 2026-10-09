# Chapa Payments Integration

Chapa is the payment provider for agent subscription checkout. Integration is **test mode only** for now. Live production mode is out of scope until the team approves it.

Related docs:

- Table structures: `Documentation/database_redesigned.md` (§27–29)
- Endpoint contracts: `Documentation/API Design.md` → "Subscription & Payment APIs"

---

## 1. Environment variables (backend/.env)

| Variable | Required | Value |
|---|---|---|
| `CHAPA_MODE` | yes | `test` (hard rejected otherwise — fail closed) |
| `CHAPA_SECRET_KEY` | yes | test secret key — prefix `CHAPA_TEST_PRIV_` (current dashboard) or `CHASECK_TEST-` (legacy); anything else is rejected (fail closed) |
| `CHAPA_PUBLIC_KEY` | yes | public key (used client-side / reference) |
| `CHAPA_WEBHOOK_SECRET` | yes | secret hash configured in the Chapa dashboard |
| `CHAPA_API_URL` | optional | defaults to `https://api.chapa.global/v2` (Chapa **V2** API) |

Secrets live only in `.env` (git-ignored). `.env.example` carries empty placeholders. Never commit real keys.

`backend/config/chapa.config.js` exports `getChapaConfig()` which validates mode + secret-key prefix **lazily**. The server boots even without Chapa keys; the first checkout call returns a configuration error (503) until they are set.

## 2. Endpoints (all relative to `/api`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/subscription-plans` | public | List plans |
| POST | `/subscriptions/checkout` | agent JWT | Initialize checkout, returns `checkoutUrl` |
| GET | `/subscriptions/current` | agent JWT | Current subscription + latest payment |
| POST | `/payments/chapa/webhook` | public, signed | Chapa event webhook |
| GET | `/payments/chapa/callback` | public | Browser redirect target after Chapa |

## 3. Checkout flow

1. Agent clicks the plan CTA on `/agent/subscription`.
2. Frontend calls `POST /api/subscriptions/checkout` with `{ planId }`.
3. Backend validates the plan (404 if missing/inactive), rejects with **409** if the agent already has an active subscription, and inside a single transaction:
   - closes any stale pending subscriptions/payments → `cancelled`,
   - inserts a `subscriptions` row (`pending`, price/currency/duration snapshotted from the plan),
   - inserts a `payments` row (`pending`, `tx_ref = SUB…{base36}` ≤ 20 chars, `mode = test`).
4. Backend calls Chapa **V2** `POST /payments/hosted` (Bearer secret key) with `amount` in **cents** (`toMinorUnits`), `currency`, `customer{first_name,last_name,email,phone_number}` (phone normalized to international), `merchant_reference = tx_ref`, and `meta{order_id}`. Chapa V2 **does** accept a `return_url` (must be `https://`, from `CHAPA_RETURN_URL`; when unset no redirect is sent). The returned `checkout_url` is the redirect target, and the Chapa reference is the last path segment (`…/hosted/<REF>`), which the backend stores on the pending payment.
5. Backend returns `{ checkoutUrl, txRef, subscriptionId }`; the browser redirects to Chapa's hosted checkout page.

## 4. Callback / return flow

When `CHAPA_RETURN_URL` is set, the hosted checkout hands the browser back to that URL (the agent's `/agent/subscription/result` page) after the payment, regardless of outcome. The backend **never trusts a query string** — the result page calls `GET /subscriptions/current`, which reconciles the pending payment against Chapa (`GET /v2/payments?reference={tx_ref}`, then re-verifies via `GET /payments/{reference}/verify`) and activates the subscription on `status=success` when `amount` (cents) and `currency` match. This makes activation effectively immediate after paying, without waiting for a webhook.

## 5. Webhook flow

Chapa posts `payment.success` (`payment.failed`/`cancelled`/`incomplete`/`blocked` for failures) events to `/api/payments/chapa/webhook`. Verification rules:

- Signature: HMAC-SHA256 over the **raw request body** keyed with the webhook secret, sent in the `chapa-signature` header (backed up by `x-chapa-signature`). The backend compares with a timing-safe compare and falls back to `JSON.stringify(req.body)` when `req.rawBody` is unavailable.
- A missing/invalid signature returns `401` and performs no side effects.
- The payload carries `merchant_reference` (= our `tx_ref`) and `chapa_reference`. The backend **re-verifies through `GET /payments/{reference}/verify` before activating**, so neither an event nor the callback query string can be forged. Only test-mode events (`mode=test`, matched server-side against `CHAPA_MODE`) are honored.
- A produced `payment.failed|cancelled|incomplete|blocked` event marks a still-pending payment failed (reason recorded).
- Returns `200` on success (incl. ignored events), `502` on processing failure (Chapa keeps retrying), `401` on bad signature.

Idempotency:

- Activation runs as `UPDATE subscriptions SET status='active' WHERE id=? AND status='pending'`.
- A successful payment is recorded as `UPDATE payments SET status='success' WHERE id=? AND status='pending'`.
- Because webhook retries hit these guards, replaying the same event does not double-activate or double-charge.

## 6. Activation & expiration semantics

- `active` is the only effective subscription state.
- `starts_at` set at activation; `expires_at = starts_at + duration_days`.
- Expiration is **lazy**: `current` reads expire overdue active rows first, so no cron is needed.
- `GET /subscriptions/current` computes `isActive` from DB state + `expiresAt`.
- One active subscription per agent at a time (409 on checkout while active). Expired subscriptions are automatically superseded by the next checkout.

## 6.1 Self-healing reconciliation

If a webhook/callback is missed (e.g. local test mode without a public URL), `GET /subscriptions/current` and `POST /subscriptions/checkout` first reconcile the user's latest pending checkout against Chapa:

- `chapa.service.findPaymentByMerchantReference(txRef)` resolves Chapa's record via `GET /v2/payments?reference={tx_ref}` (returns `null` while unpaid).
- If Chapa records the payment as `success`, the existing verify-then-activate path runs, so `starts_at`/`expires_at` are written even without a server-to-server notification.
- A reconciled (now active) user then gets `409 ACTIVE_SUBSCRIPTION_EXISTS` instead of paying twice.

## 7. Local testing (tunnel required)

Webhooks need a public URL while running locally:

```bash
ngrok http 5000
```

Then set the webhook endpoint in the Chapa dashboard to `https://<ngrok-subdomain>.ngrok.io/api/payments/chapa/webhook` and copy the generated webhook secret into `CHAPA_WEBHOOK_SECRET`.

Test card (test mode):

- Card: `4200 0000 0000 0000`
- Expiry: `12/34`
- CVV: `123`
- Phone must be 09/07 … and must not be `0911111111` unless that number is registered in the dashboard.

Confirm a webhook replay is harmless by re-sending the same `payment.success` payload (the `status='pending'` guards absorb it).

## 8. Moving to live mode (future work)

Not implemented. When pursued it requires, at minimum:

- `CHAPA_MODE=live`, live secret/webhook keys;
- decision on `tx_ref` collision handling and rate limits;
- recurring billing / renewal decision;
- refunds/invoices remain out of scope.

## 9. Security notes

- Secrets are never logged; error bodies hide raw provider messages.
- Amount/currency/tx_ref re-verified via Chapa API before any activation.
- `mode` is pinned to `test` server-side; a live init request in test mode fails closed.
- All SQL is parameterized; state transitions are guarded with `WHERE status='pending'`.