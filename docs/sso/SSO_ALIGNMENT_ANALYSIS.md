# SSO Alignment Analysis & Refactoring Plan

## ✅ Current State: SSO Role Mapping

### Confirmation: SSO Users & Admins Work Correctly

**YES** - SSO users can use the app as users and SSO admins can use it as admins.

#### How It Works:

1. **SSO Role Extraction** (`app/lib/auth/sso.ts`):
   - `extractSSOUserInfo()` checks multiple claim names: `role`, `roles`, `user_role`, `groups`, `permissions`, `authorities`, `realm_access.roles`, `resource_access`
   - `mapSSORole()` converts SSO roles to `'user' | 'admin'`:
     - If SSO provides `'admin'` (case-insensitive) → `'admin'`
     - Otherwise → `'user'`

2. **SSO Callback** (`app/api/auth/sso/callback/route.ts`):
   - **New Players**: Sets `role` from SSO token (`userInfo.role`)
   - **Existing Players**: Smart role management:
     - If SSO provides `'admin'` → Always trust it, set to `'admin'`
     - If SSO provides `'user'` but player is already `'admin'` → Preserve `'admin'` (SSO might not have role info)
     - Otherwise → Use SSO role

3. **RBAC System** (`app/lib/rbac.ts`):
   - Only two roles: `'user' | 'admin'`
   - `isAdmin()` checks if `session.user.role === 'admin'`
   - All 29 admin API routes protected with `requireAdmin()`
   - Middleware protects `/admin/*` UI routes

4. **NextAuth Integration** (`auth.ts`):
   - JWT callback **always** fetches role from database (ensures up-to-date)
   - Session includes `role: 'user' | 'admin'`

**Conclusion**: The role system is **100% aligned with SSO**. SSO users with `'user'` role can use the platform, and SSO users with `'admin'` role can admin the platform.

---

## 🔍 Analysis: Obsolete vs. Required Fields

### Fields That Are **NOT** Role-Related (Keep These)

These fields serve different purposes and should **NOT** be removed:

#### 1. `isPremium` / `premiumExpiresAt` ✅ **KEEP**
- **Purpose**: Feature gating (premium courses, games, features)
- **Usage**: 
  - Games: `app/[locale]/games/page.tsx` - checks `isPremium` to unlock premium games
  - Progressive disclosure: `app/lib/gamification/progressive-disclosure.ts` - unlocks premium features
  - Courses: Premium course enrollment checks
- **SSO Alignment**: **NOT related to roles** - this is a **subscription/feature flag**, not a role
- **Recommendation**: **Keep** - This is business logic, not access control

#### 2. `isAnonymous` ✅ **KEEP**
- **Purpose**: Identify guest accounts for analytics and conversion tracking
- **Usage**: Anonymous login flow, analytics
- **SSO Alignment**: **NOT related to roles** - this is an **account type**, not a role
- **Recommendation**: **Keep** - Needed for guest user tracking

#### 3. `isActive` ✅ **KEEP**
- **Purpose**: Soft delete - deactivate accounts without losing data
- **Usage**: Account management, analytics
- **SSO Alignment**: **NOT related to roles** - this is an **account status**, not a role
- **Recommendation**: **Keep** - Standard practice for account management

#### 4. `isBanned` / `banReason` / `bannedAt` ✅ **KEEP**
- **Purpose**: Prevent abusive users from accessing the system
- **Usage**: Moderation, security
- **SSO Alignment**: **NOT related to roles** - this is a **security measure**, not a role
- **Recommendation**: **Keep** - Critical for platform security

#### 5. `authProvider` ✅ **KEEP**
- **Purpose**: Track authentication method (`'facebook' | 'sso' | 'anonymous'`)
- **Usage**: Analytics, migration tracking
- **SSO Alignment**: **NOT related to roles** - this is an **auth method**, not a role
- **Recommendation**: **Keep** - Useful for analytics and debugging

---

### Fields That Are **OBSOLETE** (Can Be Removed/Refactored)

#### 1. `facebookId` ⚠️ **OBSOLETE** (But Keep for Migration)
- **Purpose**: Legacy Facebook authentication identifier
- **Current State**: Made optional, sparse index (allows null for SSO users)
- **SSO Alignment**: **OBSOLETE** - SSO uses `ssoSub` instead
- **Recommendation**: 
  - **Keep for now** (migration period)
  - **Future**: Remove after all Facebook users migrate to SSO
  - **Action**: Can be removed once migration is complete

#### 2. `authProvider: 'facebook'` ⚠️ **OBSOLETE** (But Keep for Migration)
- **Purpose**: Track Facebook authentication
- **Current State**: Enum includes `'facebook'`, `'sso'`, `'anonymous'`
- **SSO Alignment**: **OBSOLETE** - If 100% SSO, only need `'sso'` and `'anonymous'`
- **Recommendation**:
  - **Keep for now** (migration period)
  - **Future**: Remove `'facebook'` option after migration
  - **Action**: Can be removed once migration is complete

---

## 🎯 Refactoring Plan: 100% SSO Alignment

### Phase 1: Remove Facebook Authentication (After Migration) ⚠️ **BREAKING**

**Prerequisites**:
- All existing Facebook users have migrated to SSO
- No active Facebook login flows

**Changes**:

1. **Remove `facebookId` field**:
   ```typescript
   // REMOVE from IPlayer interface
   facebookId?: string;
   
   // REMOVE from PlayerSchema
   facebookId: { ... }
   ```

2. **Remove `authProvider: 'facebook'` option**:
   ```typescript
   // UPDATE enum
   authProvider: {
     type: String,
     enum: ['sso', 'anonymous'], // Remove 'facebook'
     default: 'sso',
     index: true,
   }
   ```

3. **Update NextAuth types**:
   ```typescript
   // REMOVE from types/next-auth.d.ts
   facebookId?: string | null;
   ```

4. **Remove Facebook provider from `auth.config.ts`**:
   - Remove Facebook OAuth provider configuration
   - Remove Facebook login button from sign-in page

5. **Update validation**:
   ```typescript
   // UPDATE PlayerSchema validation
   // Change from: if (!this.isAnonymous && !this.facebookId && !this.ssoSub)
   // To: if (!this.isAnonymous && !this.ssoSub)
   ```

**Impact**:
- ⚠️ **BREAKING**: Existing Facebook users will need to migrate
- ⚠️ **BREAKING**: Database migration required (remove `facebookId` field)
- ⚠️ **BREAKING**: API responses will no longer include `facebookId`

---

### Phase 2: Clean Up References (Non-Breaking) ✅ **SAFE**

**Changes**:

1. **Update comments and documentation**:
   - Remove references to "Facebook authentication"
   - Update to "SSO authentication" only

2. **Update error messages**:
   - Change "Facebook ID required" → "SSO identifier required"

3. **Update migration scripts**:
   - Remove Facebook-specific migration logic

**Impact**:
- ✅ **NON-BREAKING**: Only documentation/comments
- ✅ **SAFE**: No functional changes

---

## ⚠️ Concerns & Recommendations

### 1. **DO NOT Remove `isPremium`, `isBanned`, `isActive`, `isAnonymous`**

**Why**: These are **NOT role-related**. They serve different purposes:
- `isPremium`: Subscription/feature gating (business logic)
- `isBanned`: Security/moderation (access restriction)
- `isActive`: Account management (soft delete)
- `isAnonymous`: Analytics/tracking (account type)

**SSO Alignment**: These fields are **complementary** to roles, not replacements. SSO manages **who you are** (user/admin), while these fields manage **what you can do** (premium features) and **account status** (banned/active).

### 2. **Keep `authProvider` for Analytics**

**Why**: Useful for tracking:
- How many users use SSO vs. anonymous
- Migration progress
- Authentication method distribution

**SSO Alignment**: This is **metadata**, not a role. It helps understand your user base.

### 3. **Remove `facebookId` Only After Migration**

**Why**: 
- Existing users may still have `facebookId`
- Removing it prematurely will break existing accounts
- Need migration plan to move all users to SSO

**Recommendation**: 
- Keep `facebookId` until 100% of users are on SSO
- Then remove in a single breaking change with migration script

---

## ✅ Final Recommendation

### Current State: **95% Aligned with SSO**

**What's Already Perfect**:
- ✅ Role system: Only `'user' | 'admin'` (100% SSO-aligned)
- ✅ SSO role mapping works correctly
- ✅ RBAC system uses only roles
- ✅ Admin access controlled by roles only

**What Can Be Cleaned Up** (After Migration):
- ⚠️ Remove `facebookId` field (breaking change)
- ⚠️ Remove `authProvider: 'facebook'` option (breaking change)
- ✅ Update comments/documentation (non-breaking)

**What Should NOT Be Removed**:
- ✅ `isPremium` - Feature gating (not a role)
- ✅ `isBanned` - Security (not a role)
- ✅ `isActive` - Account management (not a role)
- ✅ `isAnonymous` - Analytics (not a role)
- ✅ `authProvider: 'sso' | 'anonymous'` - Analytics (not a role)

---

## 🚀 Action Plan

### Immediate (Safe, Non-Breaking):
1. ✅ Update comments/documentation to remove Facebook references
2. ✅ Verify SSO role mapping works correctly (already done)

### Future (After Migration, Breaking):
1. ⚠️ Remove `facebookId` field (requires migration)
2. ⚠️ Remove `authProvider: 'facebook'` option (requires migration)
3. ⚠️ Remove Facebook OAuth provider (requires migration)

### Never:
- ❌ Remove `isPremium` (business logic)
- ❌ Remove `isBanned` (security)
- ❌ Remove `isActive` (account management)
- ❌ Remove `isAnonymous` (analytics)

---

## 📊 Summary

**Question**: Can SSO users use the app as users and SSO admins as admins?
**Answer**: ✅ **YES** - Already working correctly.

**Question**: Should we remove obsolete non-user/non-admin variables?
**Answer**: 
- ✅ **YES** - Remove `facebookId` and `authProvider: 'facebook'` (after migration)
- ❌ **NO** - Keep `isPremium`, `isBanned`, `isActive`, `isAnonymous` (they're not role-related)

**Question**: Can we clean/refactor to 100% align with SSO?
**Answer**: ✅ **YES** - But only remove Facebook-specific fields. Keep business logic fields (`isPremium`, etc.) as they serve different purposes than roles.
