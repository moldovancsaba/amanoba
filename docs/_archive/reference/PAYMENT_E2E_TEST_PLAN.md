# Payment E2E Test Plan

**Date**: 2026-01-25  
**Status**: Active  
**Scope**: Checkout → Payment → Webhook → Premium activation, edge cases, admin payments

---

## 1. Flow Overview

```
[Course detail page]  →  POST /api/payments/create-checkout  →  [Stripe Checkout]
       ↑                                                                   │
       │                                                                   │ payment
       │                                                                   ▼
       │  GET /api/payments/success?session_id=...  ←  [Stripe redirect]   │
       │         │                                                         │
       │         │ (optional: transaction may not exist yet)               │
       │         ▼                                                         │
       │  [Redirect to course or dashboard]                                │
       │                                                                   │
       └──────────────────────────────────────────────────────────────────┘
                         Stripe sends checkout.session.completed
                                        │
                                        ▼
                    POST /api/payments/webhook (Stripe → our server)
                                        │
                                        ▼
                    handleCheckoutSessionCompleted()
                      → PaymentTransaction created
                      → player.isPremium = true, player.premiumExpiresAt set
                      → player.paymentHistory updated
                      → (optional) sendPaymentConfirmationEmail
```

**Key files**:
- Checkout: `app/api/payments/create-checkout/route.ts`
- Success redirect: `app/api/payments/success/route.ts`
- Webhook: `app/api/payments/webhook/route.ts` → `handleCheckoutSessionCompleted`
- Admin list: `app/api/admin/payments/route.ts`

---

## 2. Prerequisites

- Stripe **test mode** keys in env: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- For local webhook testing: [Stripe CLI](https://stripe.com/docs/stripe-cli)  
  `stripe listen --forward-to localhost:3000/api/payments/webhook`
- Signed-in user (session) for checkout; admin session for `/api/admin/payments`

---

## 3. Test Scenarios

### 3.1 Happy path (full E2E)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open course detail for a **premium** course, signed in | "Buy Premium" (or similar) visible |
| 2 | Click purchase, call `POST /api/payments/create-checkout` with `{ courseId, premiumDurationDays }` | 200, `{ success: true, url }` |
| 3 | Redirect to `url` (Stripe Checkout) | Stripe hosted checkout page |
| 4 | Pay with test card `4242 4242 4242 4242` | Stripe shows success, redirects to `success_url` |
| 5 | Land on `GET /api/payments/success?session_id=cs_xxx` | Redirect to `/courses/{courseId}?payment_success=true` (or dashboard if no courseId in metadata) |
| 6 | Webhook receives `checkout.session.completed` | 200, transaction created, player `isPremium` true, `premiumExpiresAt` set |
| 7 | Load course again or profile | Premium content accessible; profile shows premium status/expiry |

**Verification**:
- DB: `PaymentTransaction` has one new record with `status: succeeded`, `premiumGranted: true`
- DB: `Player` for that user has `isPremium: true`, `premiumExpiresAt` in the future
- Admin: `GET /api/admin/payments` (as admin) shows the new transaction

### 3.2 Checkout API contract (no Stripe needed)

| Request | Expected |
|---------|----------|
| `POST /api/payments/create-checkout` with **no** session | 401 Unauthorized |
| `POST /api/payments/create-checkout` with session but body `{}` (no courseId) | 400, `course ID is required` |
| `POST /api/payments/create-checkout` with session and invalid/missing courseId | 404 or 400 per implementation |

Run: `npx tsx scripts/payment-e2e-contract-test.ts` (see Section 5).

### 3.3 Success page edge cases

| Case | Request | Expected |
|------|---------|----------|
| No `session_id` | `GET /api/payments/success` | Redirect to `/dashboard` |
| Not signed in | `GET /api/payments/success?session_id=cs_xxx` | Redirect to sign-in with callbackUrl back to success |
| Invalid or expired `session_id` | `GET /api/payments/success?session_id=cs_invalid` | Stripe API error → redirect to dashboard with error (or 500 handled gracefully) |
| Paid but webhook not processed yet | `GET /api/payments/success?session_id=cs_xxx` | Redirect to course/dashboard with `?payment_success=true&processing=true`; after webhook, premium is active |

### 3.4 Webhook edge cases

| Case | Expected |
|------|----------|
| `checkout.session.completed` with `payment_status !== 'paid'` | Handled, no premium granted, no crash |
| `checkout.session.completed` with missing `metadata.playerId` | Handled, logged, no crash |
| Replay same event (idempotency) | No duplicate transaction; existing transaction/person updated if needed |
| Invalid signature | 400 Invalid signature |
| Missing `stripe-signature` | 400 Missing signature |

### 3.5 Cancel path

| Step | Action | Expected |
|------|--------|----------|
| 1 | Start checkout, go to Stripe Checkout | — |
| 2 | Click “Back” or cancel | Redirect to `cancel_url`: `/courses/{courseId}?canceled=true` |
| 3 | No webhook sent | No transaction; player not upgraded |

### 3.6 Admin payments

| Request | Expected |
|---------|----------|
| `GET /api/admin/payments` without admin session | 401 or 403 |
| `GET /api/admin/payments` as admin | 200, `transactions[]`, `pagination` |
| `GET /api/admin/payments?status=succeeded` | Only succeeded transactions |
| `GET /api/admin/payments?courseId=XXX` | Only transactions for that course |
| `GET /api/admin/payments?analytics=true` | 200, includes `analytics` (revenue, status breakdown, etc.) |

---

## 4. Stripe test data

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3DS**: `4000 0025 0000 3155`
- Use any future expiry, any 3-digit CVC, any postal code.

---

## 5. Executable contract test

The script `scripts/payment-e2e-contract-test.ts` checks:

- Unauthenticated `POST /api/payments/create-checkout` → **401**
- (Optional) Missing or invalid body → **400** when invoked with a session

Run against a running app (e.g. `npm run dev` on port 3000):

```bash
npx tsx scripts/payment-e2e-contract-test.ts
```

Base URL can be overridden with `BASE_URL=http://localhost:3000`. If all checks return 404 or connection errors, ensure the app is running (`npm run dev`).

**Full E2E** (real payment + webhook) must be run manually or with Stripe CLI:

1. Start app: `npm run dev`
2. Start webhook forwarding: `stripe listen --forward-to localhost:3000/api/payments/webhook`
3. Use the webhook signing secret from the CLI in `STRIPE_WEBHOOK_SECRET` for that run (or use .env.local and the CLI secret only when testing)
4. Follow Section 3.1 in the browser with a signed-in user and a premium course.

---

## 6. Sign-off checklist

- [ ] Happy path (3.1) run at least once in test mode
- [ ] Contract test (3.2) run and green
- [ ] Success page with and without `session_id` checked (3.3)
- [ ] Webhook idempotency and invalid/missing metadata checked (3.4)
- [ ] Cancel path verified (3.5)
- [ ] Admin payments list and filters verified (3.6)

When all are done, update ROADMAP and TASKLIST to mark “End-to-end payment flow testing” as completed.
