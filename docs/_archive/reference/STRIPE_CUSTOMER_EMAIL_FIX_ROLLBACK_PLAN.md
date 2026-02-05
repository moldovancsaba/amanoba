# Stripe Customer Email Fix - Rollback Plan

**Date**: 2026-01-26  
**Status**: ✅ ROLLBACK PLAN READY  
**Priority**: CRITICAL - Safety Requirement

---

## 🛡️ Rollback Plan (MANDATORY)

### Current Stable Baseline

**Baseline Commit**: `9ca0dd0` - "fix: Admin payments page - add missing requireAdmin import and fix courseId normalization"  
**Baseline State**: Last committed state before Stripe customer_email fix  
**Baseline Date**: Before 2026-01-26  
**Files Modified**: 
- `app/api/payments/create-checkout/route.ts`

---

## ⚠️ When to Rollback

Rollback immediately if:
1. ❌ Payment checkout still fails with Stripe errors
2. ❌ Checkout sessions are not created
3. ❌ New customers cannot complete payments
4. ❌ Existing customers cannot complete payments
5. ❌ Any production errors related to payment checkout

---

## 🔄 Rollback Steps

### Option 1: Discard Changes (If NOT Committed)

**Use this if changes are NOT committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Discard changes to checkout file
git restore app/api/payments/create-checkout/route.ts

# 3. Verify changes are reverted
git status

# 4. Verify file is restored
git diff app/api/payments/create-checkout/route.ts
```

**Expected Result**: File should show "no changes" or return to previous state.

---

### Option 2: Revert Commit (If Changes ARE Committed)

**Use this if changes have been committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Find the commit hash of the fix
git log --oneline --grep="customer_email\|Stripe customer" -10

# 3. Revert the commit (replace COMMIT_HASH with actual hash)
git revert COMMIT_HASH --no-edit

# 4. Push the revert
git push origin main
```

**Alternative**: If you need to completely remove the commit:

```bash
# 1. Reset to commit before the fix (DANGEROUS - only if not pushed)
git reset --hard HEAD~1

# 2. Force push (ONLY if working alone, NEVER in team environment)
# git push origin main --force
```

---

### Option 3: Manual Code Revert

**Use this if you need to manually restore specific lines**

#### File: `app/api/payments/create-checkout/route.ts`

**Add back this line** (around line 212):
```typescript
// FROM:
      metadata: {
        playerId: player._id.toString(),
        courseId: course.courseId,
        courseName: course.name,
        brandId: course.brandId.toString(),
        brandName: brandName,
        premiumDurationDays: premiumDurationDays.toString(),
        premiumExpiresAt: premiumExpiresAt.toISOString(),
      },
      // Note: customer_email is not set because we always use customer (stripeCustomerId)
      // Stripe only allows one of: customer OR customer_email, not both
      allow_promotion_codes: true,

// TO:
      metadata: {
        playerId: player._id.toString(),
        courseId: course.courseId,
        courseName: course.name,
        brandId: course.brandId.toString(),
        brandName: brandName,
        premiumDurationDays: premiumDurationDays.toString(),
        premiumExpiresAt: premiumExpiresAt.toISOString(),
      },
      customer_email: player.email || undefined,
      allow_promotion_codes: true,
```

**Note**: This will restore the broken state. The original error will return. Only use this if you need to investigate the issue further or if there's a different root cause.

---

## ✅ Verification Steps

After rollback, verify the system works:

### 1. Build Verification
```bash
# Run build to ensure no errors
npm run build

# Expected: Build should complete without errors
```

### 2. Code Verification
```bash
# Check that file is reverted
git diff app/api/payments/create-checkout/route.ts

# Expected: Should show no changes (or only expected changes)
```

### 3. Functionality Verification

**Test in browser**:
1. ✅ Navigate to premium course
2. ✅ Click "Buy Premium" button
3. ✅ Verify behavior (may still have original error, but should not have new errors)
4. ✅ Check browser console for errors
5. ✅ Check server logs for errors

**Expected**: System should return to previous state (may have original error, but no new errors from the fix).

---

## 🔍 Post-Rollback Analysis

After rolling back:

1. **Investigate Root Cause**:
   - Why did the fix not work?
   - Was the root cause analysis correct?
   - Are there other factors at play?
   - Check Stripe API documentation for latest requirements

2. **Alternative Solutions**:
   - Consider using `customer_email` instead of `customer` if customer creation is failing
   - Check if customer creation is working correctly
   - Verify Stripe API version compatibility

3. **Document Learnings**:
   - Update LEARNINGS.md with findings
   - Document what didn't work and why

---

## 📝 Notes

- **Never force push** to main if others are working on the branch
- **Always test** rollback in a safe environment first if possible
- **Document** any issues found during rollback
- **Keep** the fix code in a separate branch for future reference
- **Stripe API**: The error message is clear - only one of `customer` or `customer_email` is allowed

---

## 🚨 Emergency Contact

If rollback fails or causes additional issues:
1. Check git log: `git log --oneline -20`
2. Check current branch: `git branch`
3. Check for uncommitted changes: `git status`
4. Review server logs for specific errors
5. Check Stripe dashboard for checkout session errors
6. Consider restoring from backup if available

---

**Last Updated**: 2026-01-26  
**Rollback Plan Status**: ✅ READY
