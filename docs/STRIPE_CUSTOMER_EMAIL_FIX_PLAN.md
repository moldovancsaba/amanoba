# Stripe Customer Email Fix Plan

**Date**: 2026-01-26  
**Status**: ✅ FIX APPLIED  
**Priority**: CRITICAL - Payment System Bug

---

## 🔴 Root Cause

**Error**: `Invalid payment request: You may only specify one of these parameters: customer, customer_email.`

**The Problem**:
- In `app/api/payments/create-checkout/route.ts`, we were setting both `customer` (line 184) and `customer_email` (line 212) in the Stripe checkout session creation
- Stripe API only allows **one** of these parameters, not both
- This caused payment checkout to fail with the above error

**Why it happened**:
- We always create/get a Stripe customer ID before creating the checkout session (lines 153-176)
- The `customer_email` parameter was redundant and conflicting
- The code was likely copied from an example that used `customer_email` for new customers, but we always have a customer ID

---

## ✅ Fix Applied

**File**: `app/api/payments/create-checkout/route.ts`

**Change**: Removed the `customer_email` parameter from checkout session creation

**Before**:
```typescript
const checkoutSession = await stripe.checkout.sessions.create({
  customer: stripeCustomerId,
  // ... other params
  customer_email: player.email || undefined,  // ❌ CONFLICTS with customer
  allow_promotion_codes: true,
});
```

**After**:
```typescript
const checkoutSession = await stripe.checkout.sessions.create({
  customer: stripeCustomerId,
  // ... other params
  // Note: customer_email is not set because we always use customer (stripeCustomerId)
  // Stripe only allows one of: customer OR customer_email, not both
  allow_promotion_codes: true,
});
```

**Why this works**:
- We always have a `stripeCustomerId` (either existing or newly created)
- Stripe will use the customer's email from the customer record
- No need to specify `customer_email` separately

---

## 🧪 Testing Required

1. **Test Payment Flow**:
   - Navigate to a premium course
   - Click "Buy Premium" button
   - Verify checkout session is created successfully
   - Complete test payment (use Stripe test card: `4242 4242 4242 4242`)
   - Verify payment succeeds and premium status is activated

2. **Test New Customer**:
   - Use a new account (no existing Stripe customer)
   - Verify customer is created correctly
   - Verify checkout session uses the customer ID (not customer_email)

3. **Test Existing Customer**:
   - Use an account with existing Stripe customer ID
   - Verify checkout session uses existing customer ID
   - Verify payment flow works

---

## 📋 Implementation Checklist

- [x] Remove `customer_email` parameter ✅
- [x] Add comment explaining why it's not needed ✅
- [x] Verify build passes ✅
- [ ] Test payment flow in development
- [ ] Test payment flow in staging (if available)
- [ ] Update release notes
- [ ] Create rollback plan
- [ ] Commit and push

---

## 🔍 Additional Notes

- **Stripe API Rule**: You can use either `customer` (customer ID) OR `customer_email` (email string), but NOT both
- **Our Implementation**: We always use `customer` because we create/get a customer ID before checkout
- **Email Handling**: Stripe automatically uses the email from the customer record when `customer` is specified
- **No Breaking Changes**: This fix only removes a conflicting parameter, no API changes

---

## 🚀 Quick Fix Summary

**Files Modified**:
- `app/api/payments/create-checkout/route.ts` - Removed `customer_email` parameter

**Changes**:
1. Removed: `customer_email: player.email || undefined,`
2. Added: Comment explaining why `customer_email` is not needed

**Build Status**: ✅ SUCCESS  
**Status**: ✅ FIX APPLIED - Ready for testing

---

## 🔄 Rollback Plan

**See**: `docs/STRIPE_CUSTOMER_EMAIL_FIX_ROLLBACK_PLAN.md` for complete rollback instructions.

**Quick Rollback**:
```bash
# If not committed:
git restore app/api/payments/create-checkout/route.ts

# If committed:
git revert <COMMIT_HASH>
```

---

## 📝 Related Issues

- This is a Stripe API constraint issue
- Similar pattern to the `courseId` normalization fixes (both require understanding API constraints)
- Payment system is critical - test thoroughly before production deployment
