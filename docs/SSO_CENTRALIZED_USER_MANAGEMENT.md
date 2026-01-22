# SSO-Centralized User Management Refactoring Plan

## Executive Summary

**Goal**: Eliminate all local user type management and rely entirely on SSO (`sso.doneisbetter.com`) as the single source of truth for user identity, roles, and permissions.

**Current Problem**: The system has a "cracked/hacked/duck taped" user rights management with:
- Multiple authentication providers (`facebook`, `sso`, `anonymous`)
- Roles stored in database (can get out of sync with SSO)
- Scattered role checks across codebase
- Legacy Facebook authentication still supported
- Anonymous users bypassing SSO

**Solution**: Complete migration to SSO-only authentication with real-time role checking from SSO UserInfo endpoint.

---

## Current State Analysis

### Current User Types
1. **SSO Users** (`authProvider: 'sso'`)
   - Authenticated via `sso.doneisbetter.com`
   - Role synced from SSO UserInfo endpoint
   - Stored in database: `role: 'user' | 'admin'`

2. **Facebook Users** (`authProvider: 'facebook'`) - **LEGACY**
   - Legacy authentication method
   - Still supported but deprecated
   - No SSO integration

3. **Anonymous Users** (`authProvider: 'anonymous'`)
   - Guest accounts with random usernames
   - No SSO authentication
   - Always `role: 'user'`

### Current Role Management
- **Storage**: Roles stored in `Player.role` field in MongoDB
- **Sync**: Roles synced from SSO UserInfo endpoint on login
- **Problem**: Database can become stale if SSO roles change
- **Problem**: Anonymous users don't have SSO roles

### Current Role Checks
- Scattered across: `middleware.ts`, `app/lib/auth/admin.ts`, API routes
- Checks: `session.user.role === 'admin'` or `player.role === 'admin'`
- Problem: Multiple sources of truth (session, database, SSO)

---

## Target Architecture

### Single Source of Truth: SSO UserInfo Endpoint

```
┌─────────────────────────────────────────────────────────────┐
│                    SSO Service                              │
│              (sso.doneisbetter.com)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UserInfo Endpoint                                   │   │
│  │  - sub (user identifier)                            │   │
│  │  - email                                             │   │
│  │  - name                                              │   │
│  │  - role (user | admin) ← SINGLE SOURCE OF TRUTH     │   │
│  │  - groups                                            │   │
│  │  - permissions                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ OAuth 2.0 / OIDC
                            │ (access_token)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Amanoba Application                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Role Check Utility                                  │   │
│  │  - Always fetches from SSO UserInfo                  │   │
│  │  - Caches for short duration (5 minutes)             │   │
│  │  - Falls back to database only if SSO unavailable     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Player Database                                      │   │
│  │  - ssoSub (links to SSO user)                        │   │
│  │  - displayName, email (cached from SSO)               │   │
│  │  - NO role field (removed)                           │   │
│  │  - NO authProvider field (removed)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **SSO is Authoritative**: All roles come from SSO UserInfo endpoint
2. **No Role Storage**: Remove `role` field from Player model
3. **Real-time Checks**: Always check SSO (with caching for performance)
4. **Single Auth Method**: Only SSO authentication (eliminate Facebook, anonymous)
5. **Centralized Utilities**: Single utility for all role checks

---

## Migration Plan

### Phase 1: Create SSO-Centralized Role Management ✅ COMPLETE

**Status**: ✅ Implemented and committed
**Date**: 2026-01-22

**What was done**:
1. ✅ Created `app/lib/auth/role-manager.ts` - Centralized role management utility
   - `getRoleFromSSO()` - Fetches role from SSO UserInfo endpoint with 5-minute cache
   - `checkAdminAccess()` - Verifies admin role from SSO
   - `getUserRole()` - Gets user role from SSO
   - Cache management utilities
2. ✅ Updated type definitions to include access tokens in JWT
3. ✅ Updated SSO callback to store access token in session
4. ✅ Updated auth callbacks to persist access tokens

**Next Steps**: Phase 2 - Integrate role-manager into existing role checks

### Phase 2: Integrate Role Manager (Week 1 - Continued)

#### 1.1 Create New Role Management Utility
**File**: `app/lib/auth/role-manager.ts`

```typescript
/**
 * SSO-Centralized Role Management
 * 
 * SINGLE SOURCE OF TRUTH: SSO UserInfo endpoint
 * - Always fetches role from SSO
 * - Caches for 5 minutes to reduce API calls
 * - Falls back to database only if SSO unavailable
 */

interface RoleCache {
  role: 'user' | 'admin';
  expiresAt: number;
}

const roleCache = new Map<string, RoleCache>();

export async function getRoleFromSSO(
  accessToken: string,
  ssoSub: string
): Promise<'user' | 'admin'> {
  // Check cache first
  const cached = roleCache.get(ssoSub);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.role;
  }

  // Fetch from SSO UserInfo endpoint
  const userInfo = await fetchUserInfo(accessToken);
  if (!userInfo) {
    throw new Error('Failed to fetch role from SSO');
  }

  // Cache for 5 minutes
  roleCache.set(ssoSub, {
    role: userInfo.role,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  return userInfo.role;
}

export async function checkAdminAccess(
  session: Session | null,
  accessToken?: string
): Promise<boolean> {
  if (!session?.user?.ssoSub) {
    return false;
  }

  if (!accessToken) {
    // Try to get from session or refresh
    // Implementation depends on token storage strategy
    return false;
  }

  const role = await getRoleFromSSO(accessToken, session.user.ssoSub);
  return role === 'admin';
}
```

#### 1.2 Update Player Model
**File**: `app/lib/models/Player.ts`

**Changes**:
- Remove `role` field (no longer stored)
- Remove `authProvider` field (all users are SSO)
- Remove `facebookId` field (legacy, no longer needed)
- Keep `ssoSub` as primary identifier
- Add `lastRoleCheckAt` for debugging

```typescript
export interface IPlayer extends Document {
  ssoSub: string; // REQUIRED - SSO subject identifier
  displayName: string;
  email?: string;
  // ... other fields ...
  // REMOVED: role, authProvider, facebookId
  lastRoleCheckAt?: Date; // For debugging
}
```

#### 1.3 Update Session Management
**File**: `auth.ts`

**Changes**:
- JWT callback: Fetch role from SSO on every request (with caching)
- Session callback: Include role from SSO
- Remove database role lookups

#### 1.4 Update All Role Checks
**Files**: `app/lib/auth/admin.ts`, `middleware.ts`, all admin API routes

**Changes**:
- Replace all `session.user.role === 'admin'` checks
- Use new `checkAdminAccess()` from role-manager
- Always fetch from SSO (cached)

### Phase 2: Migrate Existing Users (Week 2)

#### 2.1 Migration Script
**File**: `scripts/migrate-to-sso-only.ts`

**Tasks**:
1. Identify all Facebook users → Mark for SSO migration
2. Identify all anonymous users → Mark for SSO migration or deletion
3. Remove `role` field from all Player documents
4. Remove `authProvider` field from all Player documents
5. Remove `facebookId` field from all Player documents
6. Ensure all users have `ssoSub` (or mark for deletion)

#### 2.2 User Communication
- Notify Facebook users to migrate to SSO
- Provide migration guide
- Set deadline for legacy auth removal

### Phase 3: Remove Legacy Authentication (Week 3)

#### 3.1 Remove Facebook Authentication
**Files to modify**:
- `auth.config.ts` - Remove Facebook provider
- `app/[locale]/auth/signin/page.tsx` - Remove Facebook button
- All references to `authProvider: 'facebook'`

#### 3.2 Remove Anonymous Authentication
**Files to modify**:
- `app/api/auth/anonymous/route.ts` - Remove or redirect to SSO
- `app/lib/utils/anonymous-auth.ts` - Remove or mark deprecated
- `app/components/AnonymousLoginButton.tsx` - Remove or redirect to SSO

#### 3.3 Update Type Definitions
**File**: `types/next-auth.d.ts`

**Changes**:
- Remove `authProvider` from Session, User, JWT
- Remove `isAnonymous` (all users are authenticated via SSO)
- Keep `role` but note it comes from SSO

### Phase 4: Testing & Validation (Week 4)

#### 4.1 Test Cases
1. ✅ Admin user logs in → Role fetched from SSO → Admin access granted
2. ✅ Regular user logs in → Role fetched from SSO → User access only
3. ✅ SSO role changes → Next request fetches new role → Access updated
4. ✅ SSO unavailable → Falls back gracefully → Error logged
5. ✅ Role cache works → Reduces SSO API calls → Performance maintained

#### 4.2 Performance Testing
- Measure SSO UserInfo endpoint latency
- Verify caching reduces API calls
- Test under load

---

## Implementation Details

### Role Caching Strategy

```typescript
// Cache TTL: 5 minutes
// Cache Key: ssoSub
// Cache Invalidation: On SSO role change (manual trigger or webhook)

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const roleCache = new Map<string, RoleCache>();

// Optional: Webhook from SSO to invalidate cache
app.post('/api/webhooks/sso/role-changed', async (req) => {
  const { ssoSub } = req.body;
  roleCache.delete(ssoSub);
});
```

### Access Token Management

**Challenge**: Need access token to call UserInfo endpoint

**Solutions**:
1. **Store in session**: Store access token in encrypted session
2. **Refresh token**: Use refresh token to get new access token
3. **Token exchange**: Exchange ID token for access token if needed

**Recommended**: Store access token in session (encrypted) and refresh when expired.

### Fallback Strategy

If SSO UserInfo endpoint is unavailable:
1. Log error
2. Check if we have cached role (even if expired, use it)
3. If no cache, deny admin access (fail secure)
4. Alert monitoring system

---

## Benefits

1. **Single Source of Truth**: SSO is authoritative for all roles
2. **Real-time Updates**: Role changes in SSO immediately reflected
3. **Simplified Codebase**: Remove authProvider, role storage, legacy auth
4. **Better Security**: No stale roles in database
5. **Easier Maintenance**: One authentication method, one role source
6. **Scalability**: SSO handles user management, we just consume it

---

## Risks & Mitigation

### Risk 1: SSO Unavailability
**Mitigation**: 
- Caching (5 minutes)
- Fallback to last known role (with expiration)
- Monitoring and alerts

### Risk 2: Performance Impact
**Mitigation**:
- Aggressive caching (5 minutes)
- Background role refresh
- Rate limiting on SSO calls

### Risk 3: Migration Complexity
**Mitigation**:
- Phased rollout
- Feature flags
- Rollback plan

---

## Rollout Plan

1. **Week 1**: Implement new role management (alongside old system)
2. **Week 2**: Migrate users to SSO
3. **Week 3**: Remove legacy authentication
4. **Week 4**: Testing and validation
5. **Week 5**: Production deployment

---

## Success Criteria

- ✅ All users authenticate via SSO only
- ✅ All roles come from SSO UserInfo endpoint
- ✅ No role field in database
- ✅ No authProvider field in database
- ✅ No Facebook authentication
- ✅ No anonymous authentication
- ✅ All role checks use centralized utility
- ✅ Performance acceptable (< 100ms for role checks with cache)
- ✅ Zero security incidents related to role management

---

## Files to Modify

### Core Files
- `app/lib/models/Player.ts` - Remove role, authProvider, facebookId
- `app/lib/auth/role-manager.ts` - NEW: Centralized role management
- `app/lib/auth/admin.ts` - Use new role manager
- `auth.ts` - Fetch role from SSO in callbacks
- `types/next-auth.d.ts` - Update type definitions

### API Routes
- All `/api/admin/**` routes - Use new role checks
- `app/api/auth/sso/callback/route.ts` - Don't store role

### Middleware
- `middleware.ts` - Use new role checks

### UI Components
- `app/[locale]/auth/signin/page.tsx` - Remove Facebook/anonymous buttons
- `app/[locale]/dashboard/page.tsx` - Use new role checks

### Scripts
- `scripts/migrate-to-sso-only.ts` - NEW: Migration script

---

## Questions to Resolve

1. **Anonymous Users**: Eliminate completely or migrate to SSO?
   - **Recommendation**: Eliminate - require SSO for all users

2. **Facebook Users**: Migration deadline?
   - **Recommendation**: 30 days notice, then force migration

3. **Access Token Storage**: Where to store for UserInfo calls?
   - **Recommendation**: Encrypted in session, refresh when expired

4. **Cache Invalidation**: Webhook from SSO or TTL only?
   - **Recommendation**: TTL only initially, add webhook later if needed

5. **Performance**: Is 5-minute cache acceptable?
   - **Recommendation**: Yes, but monitor and adjust

---

## Next Steps

1. Review and approve this plan
2. Create feature branch: `feature/sso-centralized-roles`
3. Implement Phase 1 (new role management)
4. Test with staging environment
5. Deploy to production

---

**Status**: 📋 Planning
**Priority**: 🔴 P0 - Critical
**Estimated Effort**: 4 weeks
**Owner**: AI Developer
