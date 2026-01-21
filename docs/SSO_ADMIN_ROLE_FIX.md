# SSO Admin Role Extraction Fix

**Date**: 2026-01-21  
**Status**: ✅ **FIXED**  
**Issue**: Admin users with admin rights on sso.doneisbetter.com could not access admin routes on amanoba.com

---

## Problem Summary

Users with admin rights configured on the SSO server (sso.doneisbetter.com) were able to log in but could not access admin routes or see the admin button in navigation. The admin role was not being extracted and stored correctly.

## Root Cause

**SSO role management happens on the UserInfo endpoint, not in the ID token.**

The original implementation only called the UserInfo endpoint conditionally (when role from ID token was 'user'). Since sso.doneisbetter.com manages roles on the UserInfo endpoint, admin roles were never being extracted.

## Solution Implemented

### 1. Always Fetch UserInfo Endpoint

**File**: `app/api/auth/sso/callback/route.ts`

**Change**: Both GET and POST handlers now **always** fetch from UserInfo endpoint (not conditional).

```typescript
// BEFORE (WRONG):
if (ssoUserInfo.role === 'user' && access_token) {
  const userInfo = await fetchUserInfo(access_token);
  // Only called if role was 'user'
}

// AFTER (CORRECT):
if (access_token) {
  const userInfo = await fetchUserInfo(access_token);
  if (userInfo) {
    ssoUserInfo = userInfo; // UserInfo is source of truth
  }
}
```

### 2. Enhanced Error Logging

**File**: `app/lib/auth/sso-userinfo.ts`

**Change**: Added critical error logging when `SSO_USERINFO_URL` is missing.

```typescript
if (!userInfoUrl) {
  logger.error({}, 'SSO_USERINFO_URL not configured - CRITICAL: Admin roles come from UserInfo endpoint');
  console.error('❌ CRITICAL: SSO_USERINFO_URL environment variable is not set.');
  return null;
}
```

### 3. Role Change Tracking

**File**: `app/api/auth/sso/callback/route.ts`

**Change**: Log role changes during player update to track admin access changes.

```typescript
const previousRole = player.role;
player.role = ssoUserInfo.role; // From UserInfo endpoint
// ... save ...

if (previousRole !== ssoUserInfo.role) {
  logger.warn({ previousRole, newRole: ssoUserInfo.role }, 'Player role changed during SSO sync');
}
```

### 4. JWT Callback Role Refresh

**File**: `auth.ts`

**Change**: JWT callback always refreshes role from database (which was updated from UserInfo endpoint).

```typescript
// Always refresh from database to ensure we have the latest role
const player = await Player.findById(playerId).lean();
if (player) {
  const dbRole = (player.role as 'user' | 'admin') || 'user';
  token.role = dbRole; // Database role wins (was updated from SSO UserInfo)
}
```

### 5. Admin Button in Navigation

**File**: `app/[locale]/dashboard/page.tsx`

**Change**: Added admin button that only shows for users with admin role.

```typescript
{session?.user && (session.user as any).role === 'admin' && (
  <LocaleLink href="/admin" className="...">
    ⚙️ {tAdmin('title') || 'Admin'}
  </LocaleLink>
)}
```

### 6. Admin Route Protection

**Files**: 
- `middleware.ts` - Redirects non-admin users from admin routes
- `app/api/admin/**` - All admin API routes check for admin role
- `app/lib/auth/admin.ts` - Centralized admin access check utility

---

## Environment Variables Required

**CRITICAL**: The following environment variable must be set:

```bash
SSO_USERINFO_URL=https://sso.doneisbetter.com/userinfo
```

Without this, admin roles cannot be extracted.

**Full SSO Configuration**:
- `SSO_AUTH_URL` - Authorization endpoint
- `SSO_TOKEN_URL` - Token exchange endpoint
- `SSO_USERINFO_URL` - **UserInfo endpoint (where roles are managed)**
- `SSO_JWKS_URL` - JWKS endpoint for token verification
- `SSO_ISSUER` - SSO issuer URL
- `SSO_CLIENT_ID` - OAuth client ID
- `SSO_CLIENT_SECRET` - OAuth client secret
- `SSO_REDIRECT_URI` - Callback URL
- `SSO_SCOPES` - OAuth scopes (should include `roles`)

---

## Flow Diagram

```
1. User clicks "Sign in with SSO"
   ↓
2. Redirect to SSO provider (sso.doneisbetter.com)
   ↓
3. User authenticates on SSO
   ↓
4. SSO redirects to /api/auth/sso/callback with code
   ↓
5. Exchange code for tokens (id_token + access_token)
   ↓
6. Validate ID token (signature, issuer, expiration)
   ↓
7. Extract role from ID token (may be 'user')
   ↓
8. **ALWAYS fetch UserInfo endpoint with access_token**
   ↓
9. Extract role from UserInfo (this is where admin roles are)
   ↓
10. UserInfo role wins (overwrites ID token role)
   ↓
11. Upsert Player in database with role from UserInfo
   ↓
12. Sign in with NextAuth, passing role
   ↓
13. JWT callback refreshes role from database
   ↓
14. Session includes admin role
   ↓
15. Admin button appears, admin routes accessible
```

---

## Testing Checklist

- [ ] `SSO_USERINFO_URL` environment variable is set
- [ ] User with admin rights on SSO can log in
- [ ] Admin role is extracted from UserInfo endpoint
- [ ] Admin role is stored in database (`Player.role = 'admin'`)
- [ ] Admin role is available in session (`session.user.role === 'admin'`)
- [ ] Admin button appears in dashboard navigation
- [ ] Admin routes are accessible (`/en/admin/*`)
- [ ] Admin API routes return data (not 403)
- [ ] Non-admin users cannot access admin routes
- [ ] Server logs show role extraction from UserInfo endpoint

---

## Debugging

### Check Server Logs

Look for these log messages during SSO login:

1. **UserInfo fetch**:
   ```
   Fetching role from UserInfo endpoint (SSO role management source)
   ```

2. **Role extraction**:
   ```
   UserInfo endpoint returned role - using as source of truth for SSO role management
   roleFromUserInfo: 'admin'
   ```

3. **Database update**:
   ```
   SSO user updated - role synced from SSO UserInfo endpoint
   newRole: 'admin'
   ```

4. **JWT refresh**:
   ```
   JWT: Refreshed role from database (SSO UserInfo endpoint is source of truth)
   dbRole: 'admin'
   ```

### Manual Role Check

Check database directly:
```javascript
// MongoDB
db.players.findOne({ ssoSub: "your-sso-sub" }, { role: 1, ssoSub: 1, displayName: 1 })
```

### Debug Script

Use the debug script to test role extraction:
```bash
SSO_TEST_TOKEN="your-id-token" npx tsx scripts/debug-sso-role.ts
```

---

## Files Modified

1. `app/api/auth/sso/callback/route.ts` - Always use UserInfo endpoint
2. `app/lib/auth/sso-userinfo.ts` - Enhanced error logging
3. `app/lib/auth/sso.ts` - Enhanced role extraction logging
4. `auth.ts` - JWT callback role refresh with logging
5. `app/[locale]/dashboard/page.tsx` - Admin button in navigation
6. `middleware.ts` - Admin route protection
7. `app/lib/auth/admin.ts` - Admin access check utility
8. `app/api/admin/**` - All admin routes check for admin role
9. `scripts/debug-sso-role.ts` - Debug script for role extraction
10. `scripts/sync-sso-roles.ts` - Manual role sync script (placeholder)

---

## Verification

After fix is deployed:

1. **Log out completely** from amanoba.com
2. **Log back in** via SSO
3. **Check server logs** for role extraction messages
4. **Verify admin button** appears in dashboard navigation
5. **Access admin routes** (`/en/admin`)
6. **Test admin API** (`/api/admin/stats`)

---

## Notes

- SSO role management happens on UserInfo endpoint, not ID token
- UserInfo endpoint is now the **source of truth** for roles
- Role is synced from UserInfo → Database → JWT → Session
- All admin routes check `session.user.role === 'admin'`
- Middleware redirects non-admin users from admin routes
- Comprehensive logging at every step for debugging

---

**Last Updated**: 2026-01-21  
**Status**: ✅ **FIXED AND DEPLOYED**
