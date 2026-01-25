# Critical Failures and Learnings - 2026-01-25

**Date**: 2026-01-25  
**Status**: ✅ RESOLVED - System Stable  
**Safety Checkpoint**: `a2a8785` - "fix: Fix hoisting issue - move isOwnProfile before useEffect"

---

## Executive Summary

This document catalogs all critical failures encountered during the certification implementation attempt and profile page restoration, along with root causes, fixes, and permanent learnings to prevent recurrence.

**Key Failures:**
1. Certification implementation broke entire site (rollback required)
2. Profile page hoisting violations (React Hook errors)
3. Middleware route protection blocking public profile pages
4. Field name mismatches in API responses

**Outcome**: All issues resolved. System is now stable at commit `a2a8785`.

---

## Failure 1: Certification Implementation Broke Entire Site

### What Happened
- Implemented certification Phase 1 & 2 (API routes + verification page)
- Added certificate translations to all 11 languages
- Site became completely broken - dashboard, admin, and all pages showed sign-in page

### Root Cause
**CRITICAL**: The certificate verification page (`app/[locale]/certificate/[slug]/page.tsx`) used `useTranslations('certificates')` but the translations were added AFTER the page was created. This caused a runtime error that broke the entire i18n system, causing all pages to fail.

### Technical Details
- **File**: `app/[locale]/certificate/[slug]/page.tsx`
- **Error**: Missing translation namespace `certificates` at runtime
- **Impact**: Entire Next.js app failed to render any page
- **User Impact**: Complete site outage

### Fix Applied
- **Rollback**: User manually rolled back all certification work
- **Deleted Files**:
  - `app/[locale]/certificate/[slug]/page.tsx`
  - `app/api/certificates/[slug]/route.ts`
  - `app/api/certificates/[certificateId]/render/route.tsx`
  - `app/api/profile/[playerId]/certificates/route.ts`
- **Reverted**: All certificate translations from 11 language files
- **Commit**: `a325cdf` - "docs: Document certification rollback"

### Learning
**RULE**: Never create pages/components that depend on translations before the translations exist. Always:
1. Add translations FIRST
2. Verify translations are valid JSON
3. Test that translations load correctly
4. THEN create pages that use them

**RULE**: When adding new translation namespaces:
1. Add to ALL languages simultaneously
2. Verify JSON syntax is valid in ALL files
3. Test with `npm run build` before creating dependent components
4. Create a test page to verify translations work

---

## Failure 2: Profile Page Hoisting Violation

### What Happened
- Profile page was stuck showing "Loading profile..." indefinitely
- Page never rendered content, even when API returned data

### Root Cause
**CRITICAL**: React Hook dependency violation - `isOwnProfile` was used in a `useEffect` dependency array BEFORE it was defined.

```typescript
// WRONG ORDER (caused error):
useEffect(() => {
  if (!isOwnProfile || !session) return;
  // ...
}, [isOwnProfile, session]); // ❌ isOwnProfile used here

const isOwnProfile = currentUserId === playerId; // ❌ Defined AFTER use
```

### Technical Details
- **File**: `app/[locale]/profile/[playerId]/page.tsx`
- **Line**: 85-109 (before fix)
- **Error**: React Hook dependency violation
- **Impact**: Component failed silently, stuck in loading state
- **User Impact**: Profile pages completely broken

### Fix Applied
- **Moved** `isOwnProfile` calculation BEFORE the `useEffect` that uses it
- **Commit**: `a2a8785` - "fix: Fix hoisting issue - move isOwnProfile before useEffect"

```typescript
// CORRECT ORDER:
const isOwnProfile = currentUserId === playerId; // ✅ Defined FIRST

useEffect(() => {
  if (!isOwnProfile || !session) return;
  // ...
}, [isOwnProfile, session]); // ✅ Now properly defined
```

### Learning
**RULE**: Always define variables BEFORE using them in React Hook dependencies:
1. Calculate all derived values FIRST
2. Define all constants/variables used in dependencies
3. THEN create `useEffect` hooks that use them
4. Never use a variable in a dependency array if it's defined later in the component

**RULE**: Follow this order in React components:
1. State declarations (`useState`)
2. Session/data hooks (`useSession`, `useQuery`)
3. Derived values (calculations from state/props)
4. Effects (`useEffect`) - use derived values in dependencies
5. Render logic

---

## Failure 3: Middleware Blocking Public Profile Pages

### What Happened
- Profile pages redirected to sign-in page
- Users couldn't view any profiles, even public ones
- URL: `https://www.amanoba.com/hu/profile/[playerId]` showed sign-in page

### Root Cause
**CRITICAL**: Middleware was protecting ALL `/profile` routes, including `/profile/[playerId]` which should be public.

```typescript
// WRONG (protected all profile routes):
const isProtectedRoute =
  actualPathname.startsWith('/profile') || // ❌ Blocks /profile/[playerId]
  // ...
```

### Technical Details
- **File**: `middleware.ts`
- **Line**: 100 (before fix)
- **Error**: Overly broad route protection
- **Impact**: All profile pages required authentication
- **User Impact**: Profile pages completely inaccessible

### Fix Applied
- **Updated** middleware to exclude `/profile/[playerId]` from protected routes
- **Only** `/profile` (exact match, redirects to own profile) requires auth
- **Commits**: 
  - `c27c5e4` - "fix: Make profile pages public"
  - `44e01b1` - "fix: Correct profile route protection logic"

```typescript
// CORRECT (only protects /profile, not /profile/[playerId]):
const isProfileWithPlayerId = actualPathname.startsWith('/profile/') && actualPathname !== '/profile';
const isProtectedRoute =
  (actualPathname.startsWith('/profile') && !isProfileWithPlayerId) || // ✅ Only /profile protected
  // ...
```

### Learning
**RULE**: When protecting routes, be specific about what needs protection:
1. Public routes: `/profile/[playerId]` - anyone can view
2. Protected routes: `/profile` (exact) - requires auth (redirects to own profile)
3. Always test with unauthenticated users
4. Use exact matches or negative conditions, not broad `startsWith()` patterns

**RULE**: Test route protection with:
1. Unauthenticated user accessing public routes (should work)
2. Unauthenticated user accessing protected routes (should redirect)
3. Authenticated user accessing both (should work)

---

## Failure 4: Field Name Mismatch in API

### What Happened
- Certificate API route used `certificate.playerName` but model has `recipientName`
- Would have caused runtime errors when fetching certificates

### Root Cause
**CRITICAL**: Field name mismatch between API response and Certificate model.

```typescript
// WRONG:
playerName: certificate.playerName, // ❌ Field doesn't exist

// CORRECT:
playerName: certificate.recipientName, // ✅ Correct field
```

### Technical Details
- **File**: `app/api/certificates/[slug]/route.ts` (deleted during rollback)
- **Model Field**: `recipientName` (from Certificate model)
- **API Used**: `playerName` (non-existent field)
- **Impact**: Would cause runtime error when API called
- **Status**: Fixed but file deleted during rollback

### Learning
**RULE**: Always verify field names match the model:
1. Read the model schema FIRST
2. Use exact field names from the model
3. Never assume field names - check the actual model definition
4. Use TypeScript types to catch mismatches at compile time

**RULE**: When creating API routes:
1. Read the model file first
2. Copy field names exactly
3. Use TypeScript interfaces to ensure type safety
4. Test API response structure matches frontend expectations

---

## Additional Learnings

### 1. Build Success ≠ Runtime Success
- Build passed with 0 errors, 0 warnings
- But runtime errors still occurred
- **Learning**: Always test in browser, not just build

### 2. Incremental Testing Required
- Should have tested each step individually
- Should have verified translations before creating pages
- **Learning**: Test after EVERY change, not just at the end

### 3. Hoisting Violations Are Silent
- React doesn't always show clear errors for hoisting issues
- Component just fails silently
- **Learning**: Always follow React Hook rules strictly

### 4. Route Protection Needs Careful Testing
- Middleware changes affect all routes
- Need to test with authenticated AND unauthenticated users
- **Learning**: Test route protection thoroughly before deploying

### 5. Translation Namespaces Must Exist
- Missing translation namespace breaks entire i18n system
- All pages fail, not just the one using the namespace
- **Learning**: Verify translations exist before using them

---

## Prevention Checklist

Before implementing any feature:

- [ ] **Translations**: If using new translation namespace, add to ALL languages FIRST
- [ ] **JSON Validation**: Verify all translation files are valid JSON
- [ ] **Model Fields**: Read model schema and use exact field names
- [ ] **React Hooks**: Define all variables BEFORE using in dependencies
- [ ] **Route Protection**: Test with authenticated AND unauthenticated users
- [ ] **Incremental Testing**: Test after EVERY single change
- [ ] **Browser Testing**: Don't rely on build success alone
- [ ] **Type Safety**: Use TypeScript types to catch errors early

---

## Current Stable State

**Commit**: `a2a8785`  
**Status**: ✅ WORKING  
**Verified**: Profile pages load correctly, middleware allows public access

**What Works:**
- ✅ Profile pages load for all users (public)
- ✅ Dashboard works
- ✅ Admin pages work
- ✅ All core functionality intact

**What Was Removed:**
- ❌ Certification implementation (rolled back)
- ❌ Certificate API routes
- ❌ Certificate verification page
- ❌ Certificate translations

---

## Rollback Commands

If issues occur, rollback to this stable checkpoint:

```bash
git reset --hard a2a8785
git push --force
```

**Tag for Safety**:
```bash
git tag -a v2.9.3-stable-profile-fix -m "Stable checkpoint: Profile pages working, all critical fixes applied"
git push origin v2.9.3-stable-profile-fix
```

---

## Next Steps (When Ready)

1. **Profile Page**: Fully functional ✅
2. **Certification**: Start fresh with lessons learned
   - Add translations FIRST
   - Test incrementally
   - Verify each step before proceeding
3. **Testing**: Implement comprehensive testing before any feature work

---

**Document Created**: 2026-01-25  
**Last Updated**: 2026-01-25  
**Status**: Complete - All failures documented and resolved
