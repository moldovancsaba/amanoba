# Buy Premium Fix - Rollback Plan

**Date**: 2026-01-26  
**Status**: ✅ ROLLBACK PLAN READY  
**Priority**: CRITICAL - Safety Requirement

---

## 🛡️ Rollback Plan (MANDATORY)

### Current Stable Baseline

**Baseline Commit**: `29f0288` - "feat: Enhance admin questions page with UUID display and multiple course selection"  
**Baseline State**: Last committed state before buy premium fix  
**Baseline Date**: Before 2026-01-26  
**Files Modified**: 
- `app/api/payments/create-checkout/route.ts`
- `app/api/payments/webhook/route.ts`

---

## ⚠️ When to Rollback

Rollback immediately if:
1. ❌ Buy premium button still doesn't work after fix
2. ❌ Payment checkout fails with errors
3. ❌ Stripe integration breaks
4. ❌ Course lookup fails for any course
5. ❌ Webhook processing fails
6. ❌ Any production errors related to payments

---

## 🔄 Rollback Steps

### Option 1: Discard Changes (If NOT Committed)

**Use this if changes are NOT committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Discard changes to payment files
git restore app/api/payments/create-checkout/route.ts
git restore app/api/payments/webhook/route.ts

# 3. Verify changes are reverted
git status

# 4. Verify files are restored
git diff app/api/payments/create-checkout/route.ts
git diff app/api/payments/webhook/route.ts
```

**Expected Result**: Both files should show "no changes" or return to previous state.

---

### Option 2: Revert Commit (If Changes ARE Committed)

**Use this if changes have been committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Find the commit hash of the fix
git log --oneline --grep="buy premium\|payment\|checkout" -10

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

#### File 1: `app/api/payments/create-checkout/route.ts`

**Remove these lines** (around line 73-74):
```typescript
// Normalize courseId to uppercase (Course schema stores courseId in uppercase)
const normalizedCourseId = courseId.toUpperCase().trim();
```

**Change this line** (around line 85):
```typescript
// FROM:
const course = await Course.findOne({ courseId: normalizedCourseId });

// TO:
const course = await Course.findOne({ courseId });
```

**Change this line** (around line 202):
```typescript
// FROM:
cancel_url: `${APP_URL}/courses/${normalizedCourseId}?canceled=true`,

// TO:
cancel_url: `${APP_URL}/courses/${courseId}?canceled=true`,
```

**Remove error logging** (around line 87-94):
```typescript
// REMOVE:
logger.error(
  {
    courseId: normalizedCourseId,
    originalCourseId: courseId,
    playerId: player._id.toString(),
  },
  'Course not found in payment checkout'
);
```

**Update error handler** (around line 240):
```typescript
// FROM:
courseId: normalizedCourseId || originalCourseId,
originalCourseId: originalCourseId,

// TO:
courseId: courseId,
```

**Remove variable declarations** (around line 43):
```typescript
// REMOVE:
let normalizedCourseId: string | undefined;
let originalCourseId: string | undefined;
```

**Update variable assignment** (around line 63):
```typescript
// FROM:
const { courseId, amount, currency, premiumDurationDays = 30 } = body;
originalCourseId = courseId;

// TO:
const { courseId, amount, currency, premiumDurationDays = 30 } = body;
```

#### File 2: `app/api/payments/webhook/route.ts`

**Change these lines** (around line 196-212):
```typescript
// FROM:
const courseId = metadata.courseId;
// Normalize courseId to uppercase (Course schema stores courseId in uppercase)
const normalizedCourseId = courseId ? courseId.toUpperCase().trim() : null;
...
if (normalizedCourseId) {
  course = await Course.findOne({ courseId: normalizedCourseId });
}

// TO:
const courseId = metadata.courseId;
...
if (courseId) {
  course = await Course.findOne({ courseId });
}
```

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
# Check that files are reverted
git diff app/api/payments/create-checkout/route.ts
git diff app/api/payments/webhook/route.ts

# Expected: Should show no changes (or only expected changes)
```

### 3. Functionality Verification

**Test in browser/Postman**:
1. ✅ Navigate to a premium course page
2. ✅ Click "Purchase Premium" button
3. ✅ Verify behavior (may still have original bug, but should not have new errors)
4. ✅ Check browser console for errors
5. ✅ Check server logs for errors

**Expected**: System should return to previous state (may have original bug, but no new errors from the fix).

---

## 📋 Rollback Checklist

- [ ] Identify which rollback method to use (Option 1, 2, or 3)
- [ ] Execute rollback steps
- [ ] Verify build passes (`npm run build`)
- [ ] Verify no TypeScript errors
- [ ] Test payment flow (may still have original bug)
- [ ] Check server logs for errors
- [ ] Document rollback in release notes if needed
- [ ] Notify team if in production

---

## 🔍 Post-Rollback Analysis

After rolling back:

1. **Investigate Root Cause**:
   - Why did the fix not work?
   - Was the root cause analysis correct?
   - Are there other factors at play?

2. **Alternative Solutions**:
   - Consider frontend normalization instead
   - Check if courseId is being modified elsewhere
   - Verify database actually stores uppercase

3. **Document Learnings**:
   - Update LEARNINGS.md with findings
   - Document what didn't work and why

---

## 📝 Notes

- **Never force push** to main if others are working on the branch
- **Always test** rollback in a safe environment first if possible
- **Document** any issues found during rollback
- **Keep** the fix code in a separate branch for future reference

---

## 🚨 Emergency Contact

If rollback fails or causes additional issues:
1. Check git log: `git log --oneline -20`
2. Check current branch: `git branch`
3. Check for uncommitted changes: `git status`
4. Review server logs for specific errors
5. Consider restoring from backup if available

---

**Last Updated**: 2026-01-26  
**Rollback Plan Status**: ✅ READY
