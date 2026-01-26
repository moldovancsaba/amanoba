# Admin Payments Fix - Rollback Plan

**Date**: 2026-01-26  
**Status**: ✅ ROLLBACK PLAN READY  
**Priority**: CRITICAL - Safety Requirement

---

## 🛡️ Rollback Plan (MANDATORY)

### Current Stable Baseline

**Baseline Commit**: `a5bc7f1` - "fix: Normalize courseId in payment checkout to fix buy premium button"  
**Baseline State**: Last committed state before admin payments fix  
**Baseline Date**: Before 2026-01-26  
**Files Modified**: 
- `app/api/admin/payments/route.ts`

---

## ⚠️ When to Rollback

Rollback immediately if:
1. ❌ Admin payments page still shows "No transactions found"
2. ❌ Admin cannot access payments page (403/401 errors)
3. ❌ Transactions API returns errors
4. ❌ Course filter breaks payment queries
5. ❌ Any production errors related to admin payments

---

## 🔄 Rollback Steps

### Option 1: Discard Changes (If NOT Committed)

**Use this if changes are NOT committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Discard changes to admin payments file
git restore app/api/admin/payments/route.ts

# 3. Verify changes are reverted
git status

# 4. Verify file is restored
git diff app/api/admin/payments/route.ts
```

**Expected Result**: File should show "no changes" or return to previous state.

---

### Option 2: Revert Commit (If Changes ARE Committed)

**Use this if changes have been committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Find the commit hash of the fix
git log --oneline --grep="admin payments\|payments fix" -10

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

#### File: `app/api/admin/payments/route.ts`

**Remove this line** (around line 13):
```typescript
import { requireAdmin } from '@/lib/rbac';
```

**Change this block** (around line 60-64):
```typescript
// FROM:
if (courseId) {
  // Normalize courseId to uppercase (Course schema stores courseId in uppercase)
  const normalizedCourseId = courseId.toUpperCase().trim();
  // Find course by courseId string
  const course = await Course.findOne({ courseId: normalizedCourseId }).lean();

// TO:
if (courseId) {
  // Find course by courseId string
  const course = await Course.findOne({ courseId }).lean();
```

**Change this line** (around line 35):
```typescript
// FROM:
const adminCheck = requireAdmin(request, session);

// TO:
// Note: requireAdmin was missing - this will cause a ReferenceError
// This is the broken state that needs to be fixed
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
# Check that file is reverted
git diff app/api/admin/payments/route.ts

# Expected: Should show no changes (or only expected changes)
```

### 3. Functionality Verification

**Test in browser**:
1. ✅ Navigate to admin payments page
2. ✅ Verify behavior (may still have original bug, but should not have new errors)
3. ✅ Check browser console for errors
4. ✅ Check server logs for errors

**Expected**: System should return to previous state (may have original bug, but no new errors from the fix).

---

## 📋 Rollback Checklist

- [ ] Identify which rollback method to use (Option 1, 2, or 3)
- [ ] Execute rollback steps
- [ ] Verify build passes (`npm run build`)
- [ ] Verify no TypeScript errors
- [ ] Test admin payments page (may still have original bug)
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
   - Check if requireAdmin function exists and works
   - Verify admin role is properly set in database
   - Check if there are authentication issues

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
