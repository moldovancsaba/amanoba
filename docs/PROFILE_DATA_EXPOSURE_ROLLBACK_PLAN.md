# Profile Data Exposure Security Fix - Rollback Plan

**Date**: 2026-01-26  
**Status**: ✅ ROLLBACK PLAN READY  
**Priority**: CRITICAL - Safety Requirement

---

## 🛡️ Rollback Plan (MANDATORY)

### Current Stable Baseline

**Baseline Commit**: `9d9510e` - "docs: Update roadmap and tasklist - rate limiting complete (v2.9.8)"  
**Baseline State**: Last committed state before profile data exposure fix  
**Baseline Date**: Before 2026-01-26  
**Files Modified**: 
- `app/api/players/[playerId]/route.ts`

---

## ⚠️ When to Rollback

Rollback immediately if:
1. ❌ Users cannot view their own profile data
2. ❌ Admins cannot view user profiles
3. ❌ Frontend breaks due to missing wallet/email data
4. ❌ Profile pages show errors
5. ❌ Any production errors related to profile data access

---

## 🔄 Rollback Steps

### Option 1: Discard Changes (If NOT Committed)

**Use this if changes are NOT committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Discard changes to players endpoint
git restore app/api/players/[playerId]/route.ts

# 3. Verify changes are reverted
git status

# 4. Verify file is restored
git diff app/api/players/[playerId]/route.ts
```

**Expected Result**: File should show "no changes" or return to previous state.

---

### Option 2: Revert Commit (If Changes ARE Committed)

**Use this if changes have been committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Find the commit hash of the fix
git log --oneline --grep="profile\|Profile data" -10

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

#### File: `app/api/players/[playerId]/route.ts`

**Remove authorization checks** (around line 35-50):
```typescript
// FROM:
// Check authentication and authorization
const session = await auth();
const currentUserId = session?.user?.id;
const isViewingOwnProfile = currentUserId === playerId;
const isAdminUser = session ? isAdmin(session) : false;
const canViewPrivateData = isViewingOwnProfile || isAdminUser;

// TO:
// (Remove authorization checks - restore to public access)
```

**Restore public data exposure** (around line 167-204):
```typescript
// FROM:
const response: any = {
  player: {
    id: player._id,
    displayName: player.displayName,
    // email is private - only include if viewing own profile or admin
    ...(canViewPrivateData && { email: player.email }),
    // ...
    // lastLoginAt is private - only include if viewing own profile or admin
    ...(canViewPrivateData && { lastLoginAt: player.lastLoginAt }),
  },
  // Wallet data is private - only include if viewing own profile or admin
  ...(canViewPrivateData && {
    wallet: wallet ? {
      currentBalance: wallet.currentBalance,
      lifetimeEarned: wallet.lifetimeEarned,
      lifetimeSpent: wallet.lifetimeSpent,
    } : null,
  }),

// TO:
const response = {
  player: {
    id: player._id,
    displayName: player.displayName,
    email: player.email,
    // ...
    lastLoginAt: player.lastLoginAt,
  },
  wallet: wallet ? {
    currentBalance: wallet.currentBalance,
    lifetimeEarned: wallet.lifetimeEarned,
    lifetimeSpent: wallet.lifetimeSpent,
  } : null,
```

**Note**: This will restore the broken state (public exposure of sensitive data). Only use this if you need to investigate the issue further or if there's a different root cause.

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
git diff app/api/players/[playerId]/route.ts

# Expected: Should show no changes (or only expected changes)
```

### 3. Functionality Verification

**Test in browser/API client**:
1. ✅ Test viewing own profile (should show all data)
2. ✅ Test viewing other user's profile (should show all data - this is the broken state)
3. ✅ Test admin viewing profiles (should show all data)
4. ✅ Check server logs for errors

**Expected**: System should return to previous state (public exposure of sensitive data, but no new errors from the fix).

---

## 🔍 Post-Rollback Analysis

After rolling back:

1. **Investigate Root Cause**:
   - Why did the fix not work?
   - Was the authorization logic correct?
   - Are there other factors at play?
   - Check if `isAdmin` function works correctly
   - Verify session authentication is working

2. **Alternative Solutions**:
   - Check if session.user.id matches playerId correctly
   - Verify isAdmin function implementation
   - Consider different authorization approach
   - Check if there are type mismatches (string vs ObjectId)

3. **Document Learnings**:
   - Update LEARNINGS.md with findings
   - Document what didn't work and why

---

## 📝 Notes

- **Never force push** to main if others are working on the branch
- **Always test** rollback in a safe environment first if possible
- **Document** any issues found during rollback
- **Keep** the fix code in a separate branch for future reference
- **Security is important** - if rolled back, plan to re-implement with corrected logic

---

## 🚨 Emergency Contact

If rollback fails or causes additional issues:
1. Check git log: `git log --oneline -20`
2. Check current branch: `git branch`
3. Check for uncommitted changes: `git status`
4. Review server logs for specific errors
5. Check if authorization functions (`isAdmin`, `auth`) are working
6. Consider restoring from backup if available

---

**Last Updated**: 2026-01-26  
**Rollback Plan Status**: ✅ READY
