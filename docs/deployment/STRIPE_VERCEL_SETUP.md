# Stripe Setup Guide for Vercel

**Last Updated**: 2025-01-20  
**Status**: Setup Instructions

---

## 🎯 Quick Setup Checklist

### Step 1: Get Stripe API Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Sign in** or create an account
3. **Toggle to Test Mode** (for development) or **Live Mode** (for production)

### Step 2: Get API Keys

1. Navigate to: **Developers** → **API keys**
2. Copy the following keys:

   - **Secret Key** (starts with `sk_test_...` or `sk_live_...`)
   - **Publishable Key** (starts with `pk_test_...` or `pk_live_...`)

### Step 3: Set Up Webhook (Required for Payment Processing)

1. Navigate to: **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://www.amanoba.com/api/payments/webhook`
   - For local testing: Use Stripe CLI (see below)
4. **Events to send**: Select these events:
   - `checkout.session.completed` (payment successful)
   - `payment_intent.succeeded` (payment succeeded)
   - `payment_intent.payment_failed` (payment failed)
   - `charge.refunded` (refund processed)
5. Click **"Add endpoint"**
6. **Copy the Signing Secret** (starts with `whsec_...`)

---

## 📋 Environment Variables to Add in Vercel

### Go to Vercel Dashboard

1. Navigate to: **https://vercel.com/[your-username]/amanoba/settings/environment-variables**
2. Click **"Add New"** for each variable below

### Required Variables

| Variable Name | Value | Environment | Encrypted |
|---------------|-------|-------------|-----------|
| `STRIPE_SECRET_KEY` | `[YOUR_STRIPE_SECRET_KEY]` | Production | ✅ Yes |
| `STRIPE_SECRET_KEY` | `[YOUR_STRIPE_SECRET_KEY]` | Preview, Development | ✅ Yes |
| `STRIPE_PUBLISHABLE_KEY` | `[YOUR_STRIPE_PUBLISHABLE_KEY]` | Production | ❌ No |
| `STRIPE_PUBLISHABLE_KEY` | `[YOUR_STRIPE_PUBLISHABLE_KEY]` | Preview, Development | ❌ No |
| `STRIPE_WEBHOOK_SECRET` | `[YOUR_STRIPE_WEBHOOK_SECRET]` | Production | ✅ Yes |
| `STRIPE_WEBHOOK_SECRET` | `[YOUR_STRIPE_WEBHOOK_SECRET]` | Preview, Development | ✅ Yes |

**Note**: Replace `[YOUR_STRIPE_SECRET_KEY]` with your actual key from Stripe Dashboard (starts with `sk_live_...` or `sk_test_...`)

**Note**: 
- Use **Test keys** (`sk_test_...`, `pk_test_...`) for Preview and Development environments
- Use **Live keys** (`sk_live_...`, `pk_live_...`) for Production environment
- Always encrypt secret keys (✅ Yes)
- Publishable keys can be public (❌ No encryption needed)

---

## 🔧 Local Development Setup

### Option 1: Use Stripe Test Keys (Recommended)

Add to your `.env.local` file:

```env
# Stripe Test Keys (for development)
# Replace [YOUR_KEY] with actual keys from Stripe Dashboard
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET_KEY]
STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_PUBLISHABLE_KEY]
STRIPE_WEBHOOK_SECRET=[YOUR_STRIPE_WEBHOOK_SECRET]
```

### Option 2: Use Stripe CLI for Webhooks (Advanced)

For local webhook testing, use Stripe CLI:

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli
2. **Login**: `stripe login`
3. **Forward webhooks**: `stripe listen --forward-to localhost:3000/api/payments/webhook`
4. **Copy the webhook secret** from the CLI output (starts with `whsec_...`)
5. Use this secret in your `.env.local` as `STRIPE_WEBHOOK_SECRET`

---

## ✅ Verification Steps

### 1. Verify Keys in Vercel

1. Go to: **Project Settings** → **Environment Variables**
2. Verify all 3 Stripe variables are present:
   - ✅ `STRIPE_SECRET_KEY` (encrypted)
   - ✅ `STRIPE_PUBLISHABLE_KEY` (not encrypted)
   - ✅ `STRIPE_WEBHOOK_SECRET` (encrypted)
3. Verify they're set for the correct environments (Production/Preview/Development)

### 2. Verify Webhook Endpoint

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Verify your endpoint is listed: `https://www.amanoba.com/api/payments/webhook`
3. Verify events are selected:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`

### 3. Test Payment Flow

1. Deploy to Vercel (or run locally)
2. Navigate to a premium course page
3. Click "Purchase" button
4. Complete test payment with Stripe test card: `4242 4242 4242 4242`
5. Verify webhook receives events in Stripe Dashboard → **Webhooks** → **Recent events**

---

## 🚨 Common Issues

### Issue 1: "Invalid API Key"

**Symptoms**: Payment button doesn't work, API errors  
**Cause**: Wrong API key or key not set  
**Solution**: 
- Verify key starts with `sk_test_...` (test) or `sk_live_...` (production)
- Check key is set in correct Vercel environment
- Redeploy after adding variables

### Issue 2: "Webhook signature verification failed"

**Symptoms**: Webhook events not processed  
**Cause**: Wrong webhook secret or webhook not configured  
**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe Dashboard
- Verify webhook endpoint URL is correct in Stripe Dashboard
- Check webhook events are selected correctly

### Issue 3: "Payment succeeded but premium not activated"

**Symptoms**: Payment completes but user doesn't get premium access  
**Cause**: Webhook handler not processing events correctly  
**Solution**:
- Check webhook logs in Stripe Dashboard → **Webhooks** → **Recent events**
- Verify webhook handler code is deployed
- Check server logs for webhook processing errors

---

## 📚 Additional Resources

- **Stripe Dashboard**: https://dashboard.stripe.com/
- **Stripe API Docs**: https://stripe.com/docs/api
- **Stripe Webhooks Guide**: https://stripe.com/docs/webhooks
- **Stripe Test Cards**: https://stripe.com/docs/testing

---

## 🔐 Security Notes

1. **Never commit** Stripe keys to version control
2. **Always encrypt** secret keys in Vercel (✅ Yes)
3. **Use test keys** for development and preview environments
4. **Rotate keys** if compromised (Stripe Dashboard → **API keys** → **Reveal test key** → **Roll key**)
5. **Monitor webhook events** for suspicious activity

---

**Maintained By**: Narimato  
**Last Updated**: 2025-01-20
