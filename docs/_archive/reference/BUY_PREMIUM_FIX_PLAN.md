# Buy Premium Fix Plan

**Summary entry:** See **BUY_PREMIUM_FIX_DONE.md** for the short overview. This doc is kept for implementation detail.

**Date**: 2026-01-26  
**Status**: 🔍 ROOT CAUSE IDENTIFIED  
**Priority**: HIGH

---

## 🔴 Root Cause

The "Buy Premium" button is failing due to a **case-sensitivity mismatch** in the course lookup.

### The Problem:

1. **Course Schema** (`app/lib/models/course.ts` line 77):
   - `courseId` field has `uppercase: true` 
   - MongoDB stores all courseIds in **UPPERCASE** (e.g., `GEO_SHOPIFY_30`)

2. **Payment Checkout API** (`app/api/payments/create-checkout/route.ts` line 82):
   - Queries: `Course.findOne({ courseId })`
   - **Does NOT normalize** courseId to uppercase
   - If frontend sends lowercase/mixed case, query fails

3. **Frontend** (`app/[locale]/courses/[courseId]/page.tsx`):
   - Gets `courseId` from URL params (may be lowercase)
   - Sends it directly to API without normalization

### Evidence:

- Other API routes correctly normalize: `/api/certification/entitlement/route.ts` uses `courseIdParam.toUpperCase()`
- Course schema enforces uppercase: `uppercase: true` in schema definition
- Payment route missing normalization: Line 82 does not convert to uppercase

---

## ✅ Fix Plan

### Step 1: Fix Payment Checkout API (CRITICAL)

**File**: `app/api/payments/create-checkout/route.ts`

**Change**: Normalize courseId to uppercase before querying

```typescript
// Line 63: Normalize courseId
const { courseId, amount, currency, premiumDurationDays = 30 } = body;
const normalizedCourseId = courseId?.toUpperCase().trim();

// Line 66: Use normalized courseId in validation
if (!normalizedCourseId) {
  return NextResponse.json(
    { error: 'Course ID is required' },
    { status: 400 }
  );
}

// Line 82: Use normalized courseId in query
const course = await Course.findOne({ courseId: normalizedCourseId });
```

**Why**: Ensures course lookup works regardless of URL case

---

### Step 2: Verify Frontend (OPTIONAL - Defense in Depth)

**File**: `app/[locale]/courses/[courseId]/page.tsx`

**Change**: Normalize courseId before sending to API (optional but recommended)

```typescript
// Line 880: Normalize courseId before sending
body: JSON.stringify({
  courseId: courseId.toUpperCase(), // Normalize to uppercase
  premiumDurationDays,
}),
```

**Why**: Defense in depth - ensures consistent data format

---

### Step 3: Add Error Logging (IMPROVEMENT)

**File**: `app/api/payments/create-checkout/route.ts`

**Enhancement**: Add better error logging for course lookup failures

```typescript
// After line 84: Add detailed logging
if (!course) {
  logger.error(
    { 
      courseId: normalizedCourseId,
      originalCourseId: courseId,
      playerId: player?._id?.toString()
    },
    'Course not found in payment checkout'
  );
  return NextResponse.json({ error: 'Course not found' }, { status: 404 });
}
```

**Why**: Better debugging for future issues

---

### Step 4: Test the Fix

**Test Cases**:
1. ✅ Test with uppercase courseId: `GEO_SHOPIFY_30`
2. ✅ Test with lowercase courseId: `geo_shopify_30`
3. ✅ Test with mixed case: `Geo_Shopify_30`
4. ✅ Test with extra whitespace: ` geo_shopify_30 `
5. ✅ Verify Stripe checkout session is created successfully
6. ✅ Verify redirect to Stripe works

---

## 📋 Implementation Checklist

- [x] Fix `app/api/payments/create-checkout/route.ts` - normalize courseId ✅
- [x] Fix `app/api/payments/webhook/route.ts` - normalize courseId ✅
- [x] Add error logging for course lookup failures ✅
- [ ] Test with various case combinations
- [ ] Verify Stripe integration still works
- [ ] Check browser console for any frontend errors
- [ ] Test end-to-end purchase flow

---

## ✅ Changes Made

### 1. Fixed Payment Checkout API (`app/api/payments/create-checkout/route.ts`)

**Changes**:
- ✅ Added courseId normalization: `const normalizedCourseId = courseId.toUpperCase().trim();`
- ✅ Updated course lookup to use normalized courseId
- ✅ Updated cancel_url to use normalized courseId
- ✅ Added error logging with both original and normalized courseId
- ✅ Fixed error handler scope to access normalizedCourseId

**Lines Changed**: 63-85, 202, 236-245

### 2. Fixed Payment Webhook (`app/api/payments/webhook/route.ts`)

**Changes**:
- ✅ Added courseId normalization in webhook handler
- ✅ Updated course lookup to use normalized courseId

**Lines Changed**: 196-212

### 3. Error Logging Enhancement

**Added**:
- ✅ Detailed logging when course not found (includes original and normalized courseId)
- ✅ Better error context in catch blocks

---

## 🧪 Testing Required

1. **Test Case-Sensitivity**:
   - Test with uppercase: `GEO_SHOPIFY_30`
   - Test with lowercase: `geo_shopify_30`
   - Test with mixed case: `Geo_Shopify_30`

2. **Test Payment Flow**:
   - Click "Purchase Premium" button
   - Verify redirect to Stripe Checkout
   - Complete test payment
   - Verify premium activation

3. **Test Error Handling**:
   - Test with invalid courseId
   - Test with missing courseId
   - Verify error messages are user-friendly

---

## 🔍 Additional Potential Issues to Check

1. **Stripe Configuration**:
   - Verify `STRIPE_SECRET_KEY` is set in environment
   - Check if Stripe API version is compatible

2. **Authentication**:
   - Verify session is properly authenticated
   - Check if `playerId` is correctly extracted from session

3. **Course Price**:
   - Verify course has `price.amount` set
   - Check if price meets Stripe minimum requirements

4. **Course Status**:
   - Verify course `isActive: true`
   - Verify course `requiresPremium: true`

---

## 🚀 Quick Fix (Immediate)

The fastest fix is to normalize courseId in the payment API:

```typescript
// In app/api/payments/create-checkout/route.ts around line 63
const { courseId, amount, currency, premiumDurationDays = 30 } = body;
const normalizedCourseId = courseId?.toUpperCase().trim();

// Then use normalizedCourseId everywhere instead of courseId
```

This single change should fix the issue immediately.

---

## 📝 Notes

- This is a **data consistency issue** - the schema enforces uppercase but the API doesn't normalize input
- Other routes (certification, enrollment) may have the same issue - should audit all course lookups
- Consider adding a helper function: `normalizeCourseId(courseId: string): string` for consistency

---

## 🛡️ Rollback Plan

**CRITICAL**: A complete rollback plan is available in:
- `docs/BUY_PREMIUM_FIX_ROLLBACK_PLAN.md`

**Quick Rollback** (if changes NOT committed):
```bash
git restore app/api/payments/create-checkout/route.ts
git restore app/api/payments/webhook/route.ts
```

**See rollback plan document for complete instructions.**
