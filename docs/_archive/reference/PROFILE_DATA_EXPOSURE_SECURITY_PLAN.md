# Profile Data Exposure Security Fix Plan

**Date**: 2026-01-26  
**Status**: ✅ FIX APPLIED  
**Priority**: P0 (Security & Privacy)

---

## 🔴 Root Cause

**Problem**: `/api/players/[playerId]` endpoint was exposing sensitive data (wallet balances, email, lastLoginAt) to **anyone** without authorization checks.

**Security Risk**:
- Wallet balances exposed publicly (privacy and security risk)
- Email addresses exposed publicly (privacy risk, potential spam/phishing)
- lastLoginAt exposed publicly (privacy risk, can reveal user activity patterns)

**Why it happened**:
- Endpoint was created without proper authorization checks
- No distinction between public and private data
- Different from `/api/profile/[playerId]` which had proper security

---

## ✅ Fix Applied

**File**: `app/api/players/[playerId]/route.ts`

### Changes Made:

1. **Added Authorization Checks**:
   - Check if user is viewing own profile (`isViewingOwnProfile`)
   - Check if user is admin (`isAdminUser`)
   - Calculate `canViewPrivateData` flag

2. **Restricted Sensitive Data**:
   - **Email**: Only included if `canViewPrivateData` is true
   - **lastLoginAt**: Only included if `canViewPrivateData` is true
   - **Wallet**: Only included if `canViewPrivateData` is true

3. **Added Rate Limiting**:
   - Added rate limiting (100 requests per 15 minutes per IP)

4. **Added Security Documentation**:
   - Updated JSDoc comments to document security model
   - Clarified which data is public vs private

### Code Changes:

**Before**:
```typescript
const response = {
  player: {
    id: player._id,
    displayName: player.displayName,
    email: player.email,  // ❌ Exposed to everyone
    // ...
    lastLoginAt: player.lastLoginAt,  // ❌ Exposed to everyone
  },
  wallet: wallet ? {
    currentBalance: wallet.currentBalance,  // ❌ Exposed to everyone
    // ...
  } : null,
};
```

**After**:
```typescript
// Check authorization
const session = await auth();
const currentUserId = session?.user?.id;
const isViewingOwnProfile = currentUserId === playerId;
const isAdminUser = session ? isAdmin(session) : false;
const canViewPrivateData = isViewingOwnProfile || isAdminUser;

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
      // ...
    } : null,
  }),
};
```

---

## 🔒 Security Model

### Public Data (Always Included):
- Basic player info: `id`, `displayName`, `profilePicture`, `isPremium`, `createdAt`
- Progression stats: `level`, `currentXP`, `totalXP`, `title`
- Game statistics: `totalGamesPlayed`, `winRate`, `totalPlayTime`
- Achievement showcase: `total`, `unlocked`, `progress`, `featured`
- Streaks: `current`, `longest`, `lastActivity`
- Recent activity: Last 10 game sessions

### Private Data (Self/Admin Only):
- **Email**: `player.email`
- **lastLoginAt**: `player.lastLoginAt`
- **Wallet**: `wallet.currentBalance`, `wallet.lifetimeEarned`, `wallet.lifetimeSpent`

### Authorization Rules:
1. **Self**: User viewing their own profile → Can see all data (public + private)
2. **Admin**: Admin user viewing any profile → Can see all data (public + private)
3. **Other Users**: User viewing another user's profile → Can only see public data
4. **Unauthenticated**: No access (should return 401, but endpoint may allow public viewing of basic info)

---

## 📋 Endpoints Reviewed

### ✅ `/api/profile/[playerId]` - SECURE
- **Status**: ✅ Already has proper authorization
- **Security**: Uses `canViewPrivateData` check
- **Private Data**: Wallet and `lastSeenAt` properly restricted

### ✅ `/api/players/[playerId]` - FIXED
- **Status**: ✅ Fixed with authorization checks
- **Security**: Now uses `canViewPrivateData` check
- **Private Data**: Email, `lastLoginAt`, and wallet properly restricted

### ⚠️ `/api/debug/player/[playerId]` - DEBUG ENDPOINT
- **Status**: ⚠️ Debug endpoint - exposes all data
- **Security**: No authorization checks (debug endpoint)
- **Recommendation**: 
  - Restrict to admins only in production
  - Or remove in production builds
  - Or add admin-only check

### ✅ `/api/profile` - SECURE
- **Status**: ✅ Secure (only returns current user's own profile)
- **Security**: Uses session authentication, only returns own data

---

## 🧪 Testing Required

### Test Cases:

1. **Test Self Access**:
   - Login as user A
   - Request `/api/players/[userA_id]`
   - ✅ Should return email, lastLoginAt, wallet

2. **Test Admin Access**:
   - Login as admin
   - Request `/api/players/[userA_id]`
   - ✅ Should return email, lastLoginAt, wallet

3. **Test Other User Access**:
   - Login as user A
   - Request `/api/players/[userB_id]`
   - ✅ Should NOT return email, lastLoginAt, wallet
   - ✅ Should return public data only

4. **Test Unauthenticated Access**:
   - No session
   - Request `/api/players/[userA_id]`
   - ✅ Should return public data only (or 401 if endpoint requires auth)

---

## 📋 Implementation Checklist

- [x] Add authorization checks to `/api/players/[playerId]` ✅
- [x] Restrict email to self/admin only ✅
- [x] Restrict lastLoginAt to self/admin only ✅
- [x] Restrict wallet to self/admin only ✅
- [x] Add rate limiting ✅
- [x] Update JSDoc comments ✅
- [x] Verify build passes ✅
- [ ] Test with different user roles
- [ ] Document security model
- [ ] Create rollback plan
- [ ] Commit and push

---

## 🔍 Additional Notes

- **Consistency**: Both `/api/profile/[playerId]` and `/api/players/[playerId]` now follow the same security model
- **Debug Endpoint**: `/api/debug/player/[playerId]` should be restricted or removed in production
- **Future**: Consider creating a shared authorization utility for profile endpoints

---

## 🚀 Quick Fix Summary

**Files Modified**:
- `app/api/players/[playerId]/route.ts` - Added authorization checks, restricted sensitive data

**Changes**:
1. Added: Authorization checks (isViewingOwnProfile, isAdminUser, canViewPrivateData)
2. Restricted: Email, lastLoginAt, wallet to self/admin only
3. Added: Rate limiting
4. Updated: JSDoc comments with security documentation

**Build Status**: ✅ SUCCESS  
**Status**: ✅ FIX APPLIED - Profile data exposure properly restricted

---

## 🔄 Rollback Plan

**See**: `docs/PROFILE_DATA_EXPOSURE_ROLLBACK_PLAN.md` for complete rollback instructions.

**Quick Rollback**:
```bash
# If not committed:
git restore app/api/players/[playerId]/route.ts

# If committed:
git revert <COMMIT_HASH>
```
