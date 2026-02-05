# Rate Limiting Implementation - Rollback Plan

**Date**: 2026-01-26  
**Status**: ✅ ROLLBACK PLAN READY  
**Priority**: CRITICAL - Safety Requirement

---

## 🛡️ Rollback Plan (MANDATORY)

### Current Stable Baseline

**Baseline Commit**: `eb87542` - "docs: Update roadmap and tasklist with latest payment fixes and next 3 actionable items"  
**Baseline State**: Last committed state before rate limiting implementation  
**Baseline Date**: Before 2026-01-26  
**Files Modified**: 
- `app/api/auth/anonymous/route.ts`
- `app/api/auth/sso/login/route.ts`
- `app/api/auth/sso/callback/route.ts`
- `app/api/auth/sso/logout/route.ts`
- `app/api/profile/route.ts`
- `app/api/profile/[playerId]/route.ts`
- `app/api/courses/[courseId]/enroll/route.ts`
- `app/api/courses/[courseId]/day/[dayNumber]/route.ts`
- `app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts`
- `app/api/admin/payments/route.ts`
- `app/api/admin/players/route.ts`
- `app/api/admin/courses/route.ts`
- `app/api/admin/stats/route.ts`

---

## ⚠️ When to Rollback

Rollback immediately if:
1. ❌ Legitimate users are getting rate limited (429 errors)
2. ❌ Rate limits are too strict and blocking normal usage
3. ❌ API endpoints are returning 429 errors unexpectedly
4. ❌ Rate limiting is causing authentication failures
5. ❌ Any production errors related to rate limiting

---

## 🔄 Rollback Steps

### Option 1: Discard Changes (If NOT Committed)

**Use this if changes are NOT committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Discard changes to all modified files
git restore app/api/auth/anonymous/route.ts
git restore app/api/auth/sso/login/route.ts
git restore app/api/auth/sso/callback/route.ts
git restore app/api/auth/sso/logout/route.ts
git restore app/api/profile/route.ts
git restore app/api/profile/[playerId]/route.ts
git restore app/api/courses/[courseId]/enroll/route.ts
git restore app/api/courses/[courseId]/day/[dayNumber]/route.ts
git restore app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts
git restore app/api/admin/payments/route.ts
git restore app/api/admin/players/route.ts
git restore app/api/admin/courses/route.ts
git restore app/api/admin/stats/route.ts

# 3. Verify changes are reverted
git status
```

**Expected Result**: Files should show "no changes" or return to previous state.

---

### Option 2: Revert Commit (If Changes ARE Committed)

**Use this if changes have been committed to git**

```bash
# 1. Navigate to project root
cd /Users/moldovancsaba/Projects/amanoba

# 2. Find the commit hash of the rate limiting implementation
git log --oneline --grep="rate limit\|Rate limit" -10

# 3. Revert the commit (replace COMMIT_HASH with actual hash)
git revert COMMIT_HASH --no-edit

# 4. Push the revert
git push origin main
```

**Alternative**: If you need to completely remove the commit:

```bash
# 1. Reset to commit before the rate limiting (DANGEROUS - only if not pushed)
git reset --hard HEAD~1

# 2. Force push (ONLY if working alone, NEVER in team environment)
# git push origin main --force
```

---

### Option 3: Manual Code Revert

**Use this if you need to manually remove rate limiting from specific endpoints**

For each endpoint file, remove these lines:

1. **Remove import** (if not used elsewhere):
```typescript
// FROM:
import { checkRateLimit, apiRateLimiter } from '@/lib/security';
// or
import { checkRateLimit, authRateLimiter } from '@/lib/security';
// or
import { checkRateLimit, adminRateLimiter } from '@/lib/security';

// TO:
// (Remove the import line)
```

2. **Remove rate limiting check** (at start of handler):
```typescript
// FROM:
export async function GET(request: NextRequest) {
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // ... handler code
  }
}

// TO:
export async function GET(request: NextRequest) {
  try {
    // ... handler code
  }
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
git diff app/api/auth/anonymous/route.ts
git diff app/api/profile/route.ts

# Expected: Should show no changes (or only expected changes)
```

### 3. Functionality Verification

**Test in browser/API client**:
1. ✅ Test authentication endpoints (anonymous, SSO login)
2. ✅ Test profile endpoints (GET, PATCH)
3. ✅ Test course endpoints (enroll, day, quiz submit)
4. ✅ Test admin endpoints (payments, players, courses, stats)
5. ✅ Verify no 429 errors for normal usage
6. ✅ Check server logs for errors

**Expected**: System should return to previous state (no rate limiting, all endpoints work normally).

---

## 🔍 Post-Rollback Analysis

After rolling back:

1. **Investigate Root Cause**:
   - Why did rate limiting cause issues?
   - Were the limits too strict?
   - Was there a bug in the rate limiting logic?
   - Check server logs for specific errors

2. **Alternative Solutions**:
   - Adjust rate limiter configuration (increase limits)
   - Use different rate limiters for different endpoints
   - Implement per-user rate limiting instead of per-IP
   - Add whitelist for trusted IPs

3. **Document Learnings**:
   - Update LEARNINGS.md with findings
   - Document what didn't work and why
   - Note any edge cases discovered

---

## 📝 Notes

- **Never force push** to main if others are working on the branch
- **Always test** rollback in a safe environment first if possible
- **Document** any issues found during rollback
- **Keep** the rate limiting code in a separate branch for future reference
- **Rate limiting is important** - if rolled back, plan to re-implement with adjusted limits

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
