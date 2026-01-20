# SSO Implementation Details — Amanoba Platform

**Version:** 2.0  
**Last Updated:** January 20, 2026  
**SSO Provider:** sso.doneisbetter.com  
**Status:** Production Ready ✅

---

## Overview

This document provides comprehensive technical details about Amanoba's SSO integration implementation, including recent improvements for role preservation, locale handling, and error recovery.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Role Management](#role-management)
3. [Locale Detection](#locale-detection)
4. [Error Handling](#error-handling)
5. [Session Management](#session-management)
6. [Security Features](#security-features)
7. [Debugging & Monitoring](#debugging--monitoring)

---

## 1. Authentication Flow

### 1.1 Login Initiation

**Endpoint:** `GET /api/auth/sso/login`

```typescript
// User clicks "Sign in with SSO"
// System generates:
const state = randomBytes(32).toString('base64url');  // CSRF protection
const nonce = randomBytes(32).toString('base64url');  // Replay attack prevention

// Redirects to:
https://sso.doneisbetter.com/authorize?
  client_id={SSO_CLIENT_ID}
  redirect_uri={SSO_REDIRECT_URI}
  response_type=code
  scope=openid profile email offline_access
  state={state}
  nonce={nonce}
```

**State Management:**
- `sso_state` cookie (HttpOnly, 10-minute expiry)
- `sso_nonce` cookie (HttpOnly, 10-minute expiry)
- `sso_return_to` cookie (stores destination after login)

### 1.2 SSO Callback

**Endpoint:** `GET /api/auth/sso/callback`

**Process:**

```typescript
1. Extract locale from returnTo cookie or referer header
   → Ensures error redirects use correct language

2. Validate authorization code and state
   → CSRF protection

3. Exchange code for tokens
   POST https://sso.doneisbetter.com/token
   → Receives: { id_token, access_token, refresh_token }

4. Validate ID token
   - Verify signature using JWKS
   - Verify issuer (iss claim)
   - Verify audience (aud claim)
   - Verify expiration (exp claim)
   - Verify nonce (if present in both cookie and token)

5. Extract user information from claims
   → See Section 2.2 for role extraction

6. Find or create player in database
   → See Section 2.3 for role preservation logic

7. Create NextAuth session
   → Pass role to session (from database, not SSO)

8. Redirect to returnTo with locale prefix
   → E.g., /hu/dashboard or /en/admin
```

---

## 2. Role Management

### 2.1 Role Flow Overview

```
SSO ID Token Claims
  ↓
Extract role from claims (role, roles, user_role, groups, permissions)
  ↓
Map SSO role to Amanoba role ('admin' or 'user')
  ↓
Save to Player database
  ↓ (Role Preservation Logic)
Pass to NextAuth session
  ↓
Available in middleware for authorization
```

### 2.2 Role Extraction from ID Token

**File:** `app/lib/auth/sso.ts` → `extractSSOUserInfo()`

```typescript
// SSO includes role in ID token when 'profile' scope is requested
const roleValue = 
  claims.role ||        // Standard: single role string
  claims.roles ||       // Alternative: array of roles
  claims.user_role ||   // Alternative claim name
  claims.groups ||      // Groups-based roles
  claims.permissions;   // Permissions-based roles

const role = mapSSORole(roleValue);
// Returns: 'admin' or 'user'
```

**Role Mapping Logic:**

```typescript
function mapSSORole(ssoRole: string | string[] | undefined): 'admin' | 'user' {
  if (!ssoRole) return 'user';  // Default to user
  
  // Handle array (take first role)
  const role = Array.isArray(ssoRole) ? ssoRole[0] : ssoRole;
  
  // Check if role contains 'admin' (case-insensitive)
  if (role.toLowerCase().includes('admin')) {
    return 'admin';
  }
  
  return 'user';
}
```

### 2.3 Role Preservation Logic

**File:** `app/api/auth/sso/callback/route.ts`

**Problem:** SSO might return default 'user' role even for manually set admin users.

**Solution:** Preserve database role if SSO provides default role.

```typescript
// For existing players:
if (userInfo.role !== 'user' || !player.role) {
  // SSO provided non-default role OR player has no role
  player.role = userInfo.role;  // Update from SSO
} else {
  // SSO defaulted to 'user' but player might have 'admin'
  // Keep existing role from database
  logger.info({
    ssoRole: userInfo.role,
    dbRole: player.role,
    action: 'keeping_existing_role'
  }, 'Preserving existing role from database');
}
```

**Why This Matters:**
- Admins can be set manually via database scripts
- SSO might not always provide role information
- Prevents accidental demotion of admin users

### 2.4 Role in NextAuth Session

**File:** `auth.config.ts`

```typescript
// JWT Callback - Add role to token
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.role = (user as any).role || 'user';
    
    console.log('[JWT Callback] Adding role to token:', {
      userId: user.id,
      role: token.role
    });
  }
  return token;
}

// Session Callback - Add role to session
async session({ session, token }) {
  if (token && session.user) {
    (session.user as any).role = token.role || 'user';
    
    console.log('[Session Callback] Role in session:', {
      sessionRole: (session.user as any).role
    });
  }
  return session;
}
```

**⚠️ CRITICAL:** Always pass `player.role` (from database) to `signIn()`, not `userInfo.role` (from SSO).

```typescript
// CORRECT:
await signIn('credentials', {
  role: player.role  // From database
});

// WRONG:
await signIn('credentials', {
  role: userInfo.role  // From SSO (might be default 'user')
});
```

---

## 3. Locale Detection

**File:** `app/api/auth/sso/callback/route.ts`

**Problem:** Error redirects need correct locale prefix (`/hu/auth/signin` vs `/en/auth/signin`)

**Solution:** Multi-source locale detection

```typescript
function extractLocaleFromPath(path: string): string {
  const pathParts = path.split('/').filter(Boolean);
  if (pathParts.length > 0 && (pathParts[0] === 'hu' || pathParts[0] === 'en')) {
    return pathParts[0];
  }
  return 'hu';  // Default to Hungarian
}

// 1. Try returnTo cookie
const returnToCookie = request.cookies.get('sso_return_to')?.value || '/dashboard';
let locale = extractLocaleFromPath(returnToCookie);

// 2. Try referer header (fallback)
const referer = request.headers.get('referer');
if (referer) {
  const refererUrl = new URL(referer);
  const refererLocale = extractLocaleFromPath(refererUrl.pathname);
  if (refererLocale !== 'hu' || locale === 'hu') {
    locale = refererLocale;
  }
}

// 3. Use in all redirects
return NextResponse.redirect(
  new URL(`/${locale}/auth/signin?error=invalid_request`, request.url)
);
```

**Benefits:**
- Users see error messages in their language
- Consistent UX across error states
- Works even if initial login was in a different language

---

## 4. Error Handling

### 4.1 Error Categories

| Error Code | Cause | User-Facing Message |
|------------|-------|---------------------|
| `invalid_request` | Missing code or state parameter | "Invalid SSO request" |
| `invalid_state` | CSRF protection triggered | "Security verification failed" |
| `configuration_error` | Missing SSO environment variables | "SSO not configured" |
| `token_exchange_failed` | Token endpoint returned error | "Failed to authenticate with SSO" |
| `missing_token` | No id_token in response | "Missing authentication token" |
| `token_validation_failed` | Invalid signature, expired, or wrong issuer | "Token validation failed" |
| `invalid_nonce` | Nonce mismatch (if both present) | "Security validation failed" |
| `user_info_extraction_failed` | Failed to extract user info from claims | "Failed to get user information" |
| `database_error` | MongoDB connection failed | "Database error" |
| `brand_not_found` | Default brand missing in database | "System configuration error" |
| `session_creation_failed` | NextAuth signIn failed | "Failed to create session" |
| `callback_error` | Unexpected error during callback | "Authentication error" |

### 4.2 Error Handling Pattern

```typescript
try {
  const result = await riskyOperation();
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  logger.error({
    error: errorMessage,
    errorStack: error instanceof Error ? error.stack : undefined,
    context: 'additional context'
  }, 'Operation failed');
  
  return NextResponse.redirect(
    new URL(`/${locale}/auth/signin?error=specific_error_code`, request.url)
  );
}
```

**All errors:**
- Include detailed context in logs
- Return user-friendly error codes
- Redirect to correct locale
- Maintain security (no sensitive info in URLs)

### 4.3 Nonce Validation

**Lenient Validation:** Allows SSO providers that don't return nonce

```typescript
if (storedNonce && claims.nonce) {
  // Both present - must match
  if (claims.nonce !== storedNonce) {
    return error('invalid_nonce');
  }
} else if (storedNonce && !claims.nonce) {
  // Sent but not returned - log warning, allow login
  logger.warn({}, 'Nonce not returned by provider - allowing login');
} else {
  // No nonce validation needed
  logger.info({}, 'Nonce validation skipped');
}
```

**Why:** Some SSO providers don't return nonce in ID token claims. This is a compatibility measure.

---

## 5. Session Management

### 5.1 NextAuth Configuration

**File:** `auth.config.ts`

```typescript
providers: [
  CredentialsProvider({
    credentials: {
      playerId: { type: 'text' },
      displayName: { type: 'text' },
      isAnonymous: { type: 'text' },
      role: { type: 'text' }  // ← Critical for admin access
    },
    async authorize(credentials) {
      // Return user object with role
      return {
        id: credentials.playerId,
        name: credentials.displayName,
        role: credentials.role || 'user'
      };
    }
  })
]
```

### 5.2 Session Access

**In Server Components:**

```typescript
import { auth } from '@/auth';

const session = await auth();
const userRole = (session?.user as any)?.role;  // 'admin' or 'user'
```

**In API Routes:**

```typescript
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 403 });
  }
  // Admin-only logic
}
```

**In Middleware:**

```typescript
// middleware.ts
const session = req.auth;
const userRole = session?.user?.role;

if (pathname.startsWith('/admin') && userRole !== 'admin') {
  return NextResponse.redirect(
    new URL(`/${locale}/dashboard?error=admin_access_required`, req.url)
  );
}
```

---

## 6. Security Features

### 6.1 State Parameter (CSRF Protection)

- Generated: 32 random bytes (base64url)
- Stored: HttpOnly cookie, 10-minute expiry
- Validated: Must match exactly on callback
- Prevents: Cross-site request forgery attacks

### 6.2 Nonce Parameter (Replay Attack Prevention)

- Generated: 32 random bytes (base64url)
- Stored: HttpOnly cookie, 10-minute expiry
- Validated: If present in both cookie and token, must match
- Prevents: Token replay attacks

### 6.3 Token Validation

```typescript
// app/lib/auth/sso.ts → validateSSOToken()
- Fetch JWKS from SSO provider
- Verify token signature (RS256)
- Verify issuer matches SSO_ISSUER
- Verify audience matches SSO_CLIENT_ID
- Verify token not expired
- Verify nonce (if present)
```

### 6.4 Cookie Security

All SSO cookies are:
- `HttpOnly`: JavaScript cannot access
- `Secure`: HTTPS only (production)
- `SameSite: 'lax'`: CSRF protection
- Short-lived: 10 minutes max

---

## 7. Debugging & Monitoring

### 7.1 Debug Logging

**Enable in production:** Check Vercel Function Logs

**Key log points:**

```typescript
1. Locale detection
   → "SSO callback started - locale detection"
   
2. ID token claims received
   → "DEBUG: ID token claims received from SSO"
   → Check: role, sub, email, nonce
   
3. User info extraction
   → "SSO role extraction"
   → Check: roleValue, extractedRole, allClaimKeys
   
4. Role preservation
   → "DEBUG: Updating existing player role"
   → Check: oldRole, newRole, finalRole, roleChanged
   
5. Player save verification
   → "SSO player logged in and saved - verifying role"
   → Check: savedRole, expectedRole, roleMatch
   
6. signIn preparation
   → "DEBUG: About to call signIn with role from database"
   → Check: roleFromDB, roleFromSSO, finalRole
   
7. signIn result
   → "DEBUG: signIn completed"
   → Check: signInSuccess, rolePassed
   
8. JWT callback
   → "[JWT Callback] Adding role to token"
   → Check: role being added
   
9. Session callback
   → "[Session Callback] Role in session"
   → Check: final session role
```

### 7.2 Common Issues

**Issue: User logged in but not admin**

Check logs in order:
1. ID token has `role: 'admin'`? → If no, SSO not providing role
2. Extracted role is 'admin'? → If no, mapSSORole logic issue
3. Player saved with 'admin'? → If no, role preservation issue
4. signIn called with 'admin'? → If no, wrong role passed
5. JWT has 'admin'? → If no, JWT callback issue
6. Session has 'admin'? → If no, session callback issue

**Issue: invalid_scope error**

- Cause: Requesting `roles` scope
- Fix: Use only standard OIDC scopes: `openid profile email offline_access`
- Note: Role comes in `profile` scope as a claim, not from `roles` scope

**Issue: invalid_nonce error**

- Cause: Nonce mismatch or SSO not returning nonce
- Fix: Check if SSO provider returns nonce in ID token
- Note: Our system allows missing nonce for compatibility

**Issue: Locale wrong on errors**

- Cause: Locale detection failed
- Fix: Check returnTo cookie and referer header
- Note: Defaults to 'hu' if detection fails

---

## 8. Production Checklist

Before deploying:

- [ ] `SSO_SCOPES=openid profile email offline_access` (no 'roles')
- [ ] `SSO_REDIRECT_URI` matches exactly in SSO provider
- [ ] Both `amanoba.com` and `www.amanoba.com` redirect URIs whitelisted
- [ ] `SSO_CLIENT_SECRET` set in Vercel (never in git)
- [ ] `SSO_ISSUER` matches SSO provider
- [ ] Test login flow in production
- [ ] Test admin access with admin user
- [ ] Test role preservation (logout/login doesn't demote admin)
- [ ] Test error redirects have correct locale
- [ ] Check Vercel logs for role tracking
- [ ] Monitor for `invalid_scope` or `invalid_nonce` errors

---

## 9. Environment Variables Summary

**Required in Vercel:**

```bash
SSO_AUTH_URL=https://sso.doneisbetter.com/authorize
SSO_TOKEN_URL=https://sso.doneisbetter.com/token
SSO_USERINFO_URL=https://sso.doneisbetter.com/userinfo
SSO_JWKS_URL=https://sso.doneisbetter.com/.well-known/jwks.json
SSO_ISSUER=https://sso.doneisbetter.com
SSO_CLIENT_ID=03e2626d-7639-45d7-88a6-ebf5697c58f7
SSO_CLIENT_SECRET=[ask admin]
SSO_REDIRECT_URI=https://www.amanoba.com/api/auth/sso/callback
SSO_SCOPES=openid profile email offline_access
```

**⚠️ CRITICAL:**
- `profile` scope is REQUIRED for role information
- DO NOT use `roles` scope (causes invalid_scope error)
- Redirect URI must be exact match (case-sensitive, no trailing slash)

---

**Document Status:** Production Ready ✅  
**Last Verified:** January 20, 2026  
**Maintained By:** Amanoba Development Team
