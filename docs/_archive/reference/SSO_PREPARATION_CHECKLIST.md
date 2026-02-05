# SSO Implementation Preparation Checklist

## 🎯 Goal
Build a rock-solid foundation before implementing SSO to ensure security, maintainability, and smooth migration.

---

## 1. Database Schema Foundation

### ✅ Current State
- Player model uses `facebookId` as unique identifier
- No role field exists
- No SSO identifier field

### 🔧 Required Changes

#### 1.1 Player Model Updates
- [ ] **Add `role` field** to Player schema:
  ```typescript
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    index: true,
  }
  ```

- [ ] **Add `ssoSub` field** (SSO subject identifier):
  ```typescript
  ssoSub: {
    type: String,
    unique: true,
    sparse: true, // Allow null for existing Facebook users
    trim: true,
    index: true,
  }
  ```

- [ ] **Make `facebookId` optional** (for migration period):
  ```typescript
  facebookId: {
    type: String,
    required: false, // Change from required
    unique: true,
    sparse: true, // Allow null for SSO users
    trim: true,
    index: true,
  }
  ```

- [ ] **Add `authProvider` field** to track auth method:
  ```typescript
  authProvider: {
    type: String,
    enum: ['facebook', 'sso', 'anonymous'],
    default: 'facebook',
    index: true,
  }
  ```

- [ ] **Add compound index** for efficient lookups:
  ```typescript
  PlayerSchema.index({ ssoSub: 1 }, { sparse: true });
  PlayerSchema.index({ authProvider: 1, role: 1 });
  ```

#### 1.2 Migration Script
- [ ] Create migration script to:
  - Add new fields to existing players
  - Set default `role: 'user'` for all existing players
  - Set `authProvider: 'facebook'` for existing players
  - Handle players with missing `facebookId` (anonymous users)

---

## 2. Role-Based Access Control (RBAC) System

### ✅ Current State
- No RBAC system exists
- Admin routes have TODO comments: `// TODO: Add admin role check`
- All authenticated users can access admin endpoints

### 🔧 Required Implementation

#### 2.1 Create RBAC Utility Module
- [ ] Create `app/lib/rbac.ts` with:
  ```typescript
  // Role types
  type UserRole = 'user' | 'admin';
  
  // Check if user has admin role
  export function isAdmin(session: Session | null): boolean;
  
  // Check if user has required role
  export function hasRole(session: Session | null, requiredRole: UserRole): boolean;
  
  // Require role middleware for API routes
  export function requireRole(role: UserRole): Middleware;
  
  // Require admin middleware
  export function requireAdmin(): Middleware;
  ```

#### 2.2 Update Session Type
- [ ] Extend NextAuth session type in `types/next-auth.d.ts`:
  ```typescript
  declare module 'next-auth' {
    interface Session {
      user: {
        id: string;
        email?: string;
        name?: string;
        role: 'user' | 'admin';
        authProvider: 'facebook' | 'sso' | 'anonymous';
        // ... existing fields
      };
    }
  }
  ```

#### 2.3 Update Auth Callbacks
- [ ] Modify `auth.ts` JWT callback to include role:
  ```typescript
  async jwt({ token, user }) {
    if (user) {
      // Fetch player from DB to get role
      const player = await Player.findById(user.id);
      token.role = player?.role || 'user';
      token.authProvider = player?.authProvider || 'facebook';
    }
    return token;
  }
  ```

- [ ] Modify session callback to include role:
  ```typescript
  async session({ session, token }) {
    if (token && session.user) {
      session.user.role = token.role as 'user' | 'admin';
      session.user.authProvider = token.authProvider as string;
    }
    return session;
  }
  ```

#### 2.4 Protect All Admin Routes
- [ ] Update ALL admin API routes to use `requireAdmin()`:
  - `/api/admin/courses/*`
  - `/api/admin/players/*`
  - `/api/admin/payments/*`
  - `/api/admin/stats/*`
  - `/api/admin/feature-flags/*`
  - `/api/admin/upload-image/*`
  - `/api/admin/surveys/*`
  - `/api/admin/analytics/*`
  - `/api/admin/challenges/*`
  - All other admin routes

- [ ] Update middleware to check admin role for `/admin/*` routes

---

## 3. Security Hardening

### ✅ Current State
- Good security utilities exist (`app/lib/security.ts`)
- Rate limiting implemented
- Security headers configured
- Input sanitization available

### 🔧 Required Enhancements

#### 3.1 Session Security
- [ ] **Shorten session duration** for SSO (currently 30 days):
  - Admin sessions: 8 hours
  - User sessions: 7 days
  - Anonymous sessions: 24 hours

- [ ] **Add session refresh mechanism**:
  - Implement refresh token rotation
  - Add session activity tracking
  - Auto-logout inactive sessions

#### 3.2 CSRF Protection
- [ ] **Add CSRF tokens** for state-changing operations:
  - Generate CSRF token on login
  - Validate CSRF token on POST/PUT/DELETE requests
  - Store in HTTP-only cookie

#### 3.3 Audit Logging
- [ ] **Enhance security event logging**:
  - Log all authentication attempts (success/failure)
  - Log role changes
  - Log admin actions
  - Log SSO token validation failures
  - Store in separate `SecurityAuditLog` collection

#### 3.4 Input Validation
- [ ] **Validate SSO token claims**:
  - Verify `iss` (issuer)
  - Verify `aud` (audience)
  - Verify `exp` (expiration)
  - Verify `nonce` (replay attack prevention)
  - Verify signature via JWKS

---

## 4. Error Handling & User Experience

### ✅ Current State
- Basic error handling exists
- Some error messages are generic

### 🔧 Required Improvements

#### 4.1 SSO-Specific Error Handling
- [ ] **Create error types**:
  ```typescript
  enum SSOError {
    INVALID_TOKEN = 'INVALID_TOKEN',
    EXPIRED_TOKEN = 'EXPIRED_TOKEN',
    MISSING_ROLE = 'MISSING_ROLE',
    PROVIDER_ERROR = 'PROVIDER_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
  }
  ```

- [ ] **User-friendly error messages**:
  - "Login canceled" → friendly message with retry
  - "Session expired" → redirect to login with message
  - "Access denied" → clear explanation (not admin)
  - "Provider error" → technical details for admins only

#### 4.2 Error Pages
- [ ] Create error pages:
  - `/auth/sso/error` - SSO-specific errors
  - `/auth/unauthorized` - Role-based access denied
  - `/auth/session-expired` - Session timeout

#### 4.3 Loading States
- [ ] Add loading indicators for:
  - SSO redirect
  - Token validation
  - User upsert
  - Role assignment

---

## 5. Testing Infrastructure

### ✅ Current State
- No dedicated auth testing framework
- Manual testing only

### 🔧 Required Setup

#### 5.1 Unit Tests
- [ ] **RBAC utility tests**:
  - Test `isAdmin()` with various session states
  - Test `hasRole()` with different roles
  - Test `requireAdmin()` middleware

- [ ] **Token validation tests**:
  - Valid token
  - Expired token
  - Invalid signature
  - Wrong issuer
  - Missing claims

- [ ] **Role mapping tests**:
  - Admin role assignment
  - User role assignment
  - Default role fallback

#### 5.2 Integration Tests
- [ ] **SSO flow tests**:
  - Login redirect
  - Callback handling
  - Token exchange
  - User upsert
  - Session creation

- [ ] **API protection tests**:
  - Admin routes reject non-admin users
  - User routes allow authenticated users
  - Public routes allow anonymous

#### 5.3 E2E Tests
- [ ] **Full SSO flow**:
  - Login → Dashboard
  - Admin login → Admin panel
  - Logout → Home
  - Session expiration → Redirect to login

- [ ] **Role-based access**:
  - User tries to access admin → Denied
  - Admin accesses admin → Allowed
  - Anonymous browses public → Allowed

---

## 6. Migration Strategy

### 🔧 Required Preparation

#### 6.1 Data Migration Plan
- [ ] **Identify existing users**:
  - Count Facebook-authenticated users
  - Count anonymous users
  - Identify any admin users (if manually set)

- [ ] **Migration script**:
  ```typescript
  // Set default role for all existing players
  await Player.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'user', authProvider: 'facebook' } }
  );
  ```

#### 6.2 Backward Compatibility
- [ ] **Support both auth methods** during transition:
  - Facebook login continues to work
  - SSO login works in parallel
  - Users can migrate accounts (link SSO to existing account)

- [ ] **Account linking**:
  - Allow users to link SSO to existing Facebook account
  - Prevent duplicate accounts (same email)
  - Handle account merge conflicts

#### 6.3 Rollout Plan
- [ ] **Phased rollout**:
  - Phase 1: Add SSO alongside Facebook (feature flag)
  - Phase 2: Migrate admin users to SSO
  - Phase 3: Migrate all users (optional)
  - Phase 4: Deprecate Facebook (if desired)

---

## 7. Documentation & Configuration

### 🔧 Required Documentation

#### 7.1 Environment Variables
- [ ] **Document all SSO env vars** in `.env.example`:
  ```
  # SSO Configuration
  SSO_AUTH_URL=https://sso.doneisbetter.com/authorize
  SSO_TOKEN_URL=https://sso.doneisbetter.com/token
  SSO_USERINFO_URL=https://sso.doneisbetter.com/userinfo
  SSO_JWKS_URL=https://sso.doneisbetter.com/.well-known/jwks.json
  SSO_ISSUER=https://sso.doneisbetter.com
  SSO_CLIENT_ID=your_client_id
  SSO_CLIENT_SECRET=your_client_secret
  SSO_REDIRECT_URI=https://amanoba.com/auth/sso/callback
  SSO_SCOPES=openid profile email roles
  ```

- [ ] **Update `ENVIRONMENT_SETUP.md`** with SSO configuration

#### 7.2 API Documentation
- [ ] **Document SSO endpoints**:
  - `GET /auth/sso/login` - Initiate SSO login
  - `GET /auth/sso/callback` - Handle SSO callback
  - `POST /auth/sso/logout` - SSO logout

#### 7.3 Architecture Documentation
- [ ] **Update `ARCHITECTURE.md`** with:
  - SSO flow diagram
  - Role-based access control architecture
  - Session management strategy
  - Security considerations

---

## 8. Monitoring & Observability

### 🔧 Required Setup

#### 8.1 Metrics
- [ ] **Track SSO metrics**:
  - Login success/failure rate
  - Token validation failures
  - Role assignment statistics
  - Session duration
  - Admin action frequency

#### 8.2 Alerts
- [ ] **Set up alerts for**:
  - High SSO failure rate (>5%)
  - Token validation errors
  - Unauthorized admin access attempts
  - Session anomalies

#### 8.3 Logging
- [ ] **Enhanced logging**:
  - All SSO events (structured logs)
  - Role changes (audit trail)
  - Security violations
  - Performance metrics

---

## 9. Code Quality & Standards

### 🔧 Required Improvements

#### 9.1 Type Safety
- [ ] **Add TypeScript types** for:
  - SSO token structure
  - Role types
  - Session structure
  - Error types

#### 9.2 Code Organization
- [ ] **Create dedicated modules**:
  - `app/lib/auth/sso.ts` - SSO utilities
  - `app/lib/auth/rbac.ts` - RBAC utilities
  - `app/lib/auth/session.ts` - Session management
  - `app/lib/auth/validation.ts` - Token validation

#### 9.3 Remove TODOs
- [ ] **Replace all TODO comments** with actual implementations:
  - `// TODO: Add admin role check` → Implement `requireAdmin()`
  - All other auth-related TODOs

---

## 10. Provider Information Gathering

### 🔧 Required Before Implementation

#### 10.1 Provider Documentation
- [ ] **Collect from provider**:
  - OIDC discovery document URL
  - Authorization endpoint
  - Token endpoint
  - UserInfo endpoint (if available)
  - JWKS endpoint
  - Logout endpoint (if available)
  - Supported scopes
  - PKCE requirements

#### 10.2 Role Claim Details
- [ ] **Confirm with provider**:
  - Role claim name (e.g., `roles`, `groups`, `permissions`)
  - Role values (`admin`, `user`, etc.)
  - Any superadmin role?
  - How roles are assigned

#### 10.3 Security Requirements
- [ ] **Verify with provider**:
  - Token expiration times
  - Refresh token availability
  - Logout flow (front-channel vs back-channel)
  - Required security headers
  - CORS requirements

---

## ✅ Priority Order

### Phase 1: Foundation (Critical)
1. Database schema updates (Player model)
2. RBAC system implementation
3. Session type updates
4. Admin route protection

### Phase 2: Security (High Priority)
5. Security hardening
6. Error handling
7. Audit logging

### Phase 3: Quality (Medium Priority)
8. Testing infrastructure
9. Documentation
10. Code organization

### Phase 4: Migration (Before Go-Live)
11. Migration scripts
12. Backward compatibility
13. Rollout plan

---

## 🚨 Critical Warnings

1. **DO NOT** implement SSO without RBAC system first
2. **DO NOT** deploy without admin route protection
3. **DO NOT** skip migration scripts for existing users
4. **DO NOT** forget to update all TODO comments
5. **DO NOT** skip security audit before production

---

## 📝 Notes

- This checklist should be completed **before** starting SSO implementation
- Each item should be tested and verified
- Code reviews required for security-critical changes
- All changes should be backward compatible during transition period
