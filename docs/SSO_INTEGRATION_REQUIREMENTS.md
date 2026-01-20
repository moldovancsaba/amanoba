# SSO Integration Requirements & Learnings

**Document Version:** 1.0  
**Date:** January 2026  
**Integration Partner:** Amanoba Platform  
**SSO Provider:** sso.doneisbetter.com

---

## Overview

This document outlines the requirements, learnings, and recommendations for integrating with the Amanoba platform via OpenID Connect (OIDC) SSO. These requirements are based on our production implementation experience.

---

## 1. Required Configuration

### 1.1 Environment Variables

The following environment variables must be configured in the SSO provider:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SSO_ISSUER` | OIDC Issuer URL | `https://sso.doneisbetter.com` | ✅ |
| `SSO_CLIENT_ID` | OAuth Client ID | `03e2626d-7639-45d7-88a6-ebf5697c58f7` | ✅ |
| `SSO_CLIENT_SECRET` | OAuth Client Secret | `[secret]` | ✅ |
| `SSO_AUTH_URL` | Authorization endpoint | `https://sso.doneisbetter.com/authorize` | ✅ |
| `SSO_TOKEN_URL` | Token exchange endpoint | `https://sso.doneisbetter.com/token` | ✅ |
| `SSO_USERINFO_URL` | UserInfo endpoint | `https://sso.doneisbetter.com/userinfo` | ✅ |
| `SSO_JWKS_URL` | JWKS endpoint for token verification | `https://sso.doneisbetter.com/.well-known/jwks.json` | ✅ |
| `SSO_REDIRECT_URI` | Callback URL | `https://www.amanoba.com/api/auth/sso/callback` | ✅ |
| `SSO_SCOPES` | Requested scopes | `openid profile email` | ✅ |

### 1.2 Redirect URIs

**CRITICAL:** The following redirect URIs must be **exactly** whitelisted in the SSO provider:

```
https://www.amanoba.com/api/auth/sso/callback
https://amanoba.com/api/auth/sso/callback
```

**Requirements:**
- ✅ Exact match required (including protocol, domain, path)
- ✅ No trailing slashes
- ✅ Case-sensitive
- ✅ Both `www` and non-`www` variants must be supported

---

## 2. Scopes

### 2.1 Supported Scopes

**Required:**
- `openid` - Core OIDC scope
- `profile` - User profile information (name, display name)
- `email` - User email address

**Recommended Configuration:**
```
SSO_SCOPES=openid profile email
```

### 2.2 Unsupported Scopes

**DO NOT REQUEST:**
- ❌ `roles` - This is **not** a standard OIDC scope and will cause `invalid_scope` errors
- ❌ Custom scopes that are not standard OIDC scopes

**Note:** If role information is needed, it should be included in the ID token claims (see Section 3.2).

---

## 3. Token Claims Structure

### 3.1 Required Claims

The ID token **MUST** include the following claims:

| Claim | Type | Required | Description |
|-------|------|----------|-------------|
| `sub` | string | ✅ | Unique subject identifier (used as `ssoSub` in our system) |
| `email` | string | ⚠️ | User email address (highly recommended) |
| `name` | string | ⚠️ | User's display name (highly recommended) |

### 3.2 Role Claims (Recommended)

**IMPORTANT:** Role information should be included in the ID token claims for proper access control.

**Supported Claim Names:**
- `role` (single string) - Preferred
- `roles` (array of strings) - Alternative
- `user_role` - Alternative
- `groups` - Alternative (if roles are in groups)
- `permissions` - Alternative

**Role Values:**
- `admin` or any string containing "admin" (case-insensitive) → Maps to `admin` role
- Any other value → Maps to `user` role
- If no role claim is present → Defaults to `user` role

**Example ID Token Claims:**
```json
{
  "sub": "5143beb1-9bb6-47e7-a099-e9eeb2d89e93",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234571490,
  "iss": "https://sso.doneisbetter.com",
  "aud": "03e2626d-7639-45d7-88a6-ebf5697c58f7"
}
```

**Alternative (Array Format):**
```json
{
  "sub": "5143beb1-9bb6-47e7-a099-e9eeb2d89e93",
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["admin", "user"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

### 3.3 Token Validation

Our system validates:
- ✅ Token signature (using JWKS)
- ✅ Token issuer (`iss` claim)
- ✅ Token audience (`aud` claim)
- ✅ Token expiration (`exp` claim)
- ⚠️ Nonce (if provided - see Section 4)

---

## 4. Nonce Handling

### 4.1 Current Implementation

**Status:** Nonce validation is **lenient** to support providers that don't return nonce in ID token.

**Behavior:**
- ✅ Nonce is **sent** in the authorization request
- ✅ Nonce is **stored** in HTTP-only cookie
- ⚠️ Nonce is **validated** only if **both** are present:
  - Nonce in cookie (from our system)
  - Nonce in ID token claims (from SSO provider)

**If nonce is missing from ID token:**
- ⚠️ Warning is logged
- ✅ Login is **allowed** (nonce validation is skipped)
- ✅ This is intentional to support providers that don't return nonce

### 4.2 Recommendation

**For SSO Provider:**
- ✅ **Include nonce in ID token claims** if nonce was sent in authorization request
- ✅ This improves security and prevents replay attacks
- ✅ Standard OIDC behavior

**Current Workaround:**
- Our system allows login even if nonce is missing from token
- This is a temporary measure for compatibility

---

## 5. Authorization Request Parameters

### 5.1 Required Parameters

```
GET /authorize?
  client_id={SSO_CLIENT_ID}
  redirect_uri={SSO_REDIRECT_URI}
  response_type=code
  scope=openid profile email
  state={random_state}
  nonce={random_nonce}
```

### 5.2 Optional Parameters

**DO NOT INCLUDE:**
- ❌ `prompt=login` - Some providers don't support this and it can cause empty authorization pages

**Note:** We removed `prompt=login` from our implementation due to compatibility issues.

---

## 6. Common Issues & Solutions

### 6.1 `invalid_scope` Error

**Problem:** Requesting non-standard scopes like `roles`

**Solution:**
- ✅ Use only standard OIDC scopes: `openid profile email`
- ✅ Include role information in ID token claims instead

### 6.2 Empty Authorization Page

**Problem:** Authorization page is blank/empty

**Possible Causes:**
- ❌ `prompt=login` parameter not supported
- ❌ Redirect URI not whitelisted
- ❌ Client ID incorrect
- ❌ Application not active/enabled

**Solution:**
- ✅ Remove `prompt=login` parameter
- ✅ Verify redirect URI is exactly whitelisted
- ✅ Verify client ID and application status

### 6.3 `invalid_nonce` Error

**Problem:** Nonce validation fails

**Current Status:**
- ✅ Our system now handles missing nonce gracefully
- ⚠️ If nonce is present in both cookie and token, they must match

**Recommendation:**
- ✅ SSO provider should return nonce in ID token if it was sent in request

### 6.4 Role Not Working

**Problem:** Admin users are logged in as normal users

**Causes:**
- ❌ Role not included in ID token claims
- ❌ Role claim name not recognized
- ❌ Role value doesn't match expected format

**Solution:**
- ✅ Include role in ID token claims (see Section 3.2)
- ✅ Use standard claim names: `role` or `roles`
- ✅ Use `admin` value for admin users

---

## 7. Token Exchange

### 7.1 Token Request

```
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
code={authorization_code}
redirect_uri={SSO_REDIRECT_URI}
client_id={SSO_CLIENT_ID}
client_secret={SSO_CLIENT_SECRET}
```

### 7.2 Expected Response

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "...",
  "refresh_token": "..." // Optional
}
```

**Required:**
- ✅ `id_token` - Must be present and valid JWT

---

## 8. Best Practices & Recommendations

### 8.1 For SSO Provider Documentation

1. **Clear Scope Documentation**
   - ✅ List supported scopes
   - ❌ Don't list non-standard scopes like `roles`
   - ✅ Explain what each scope provides

2. **Role Information**
   - ✅ Document how to include role information in ID token
   - ✅ Provide examples of role claim formats
   - ✅ Explain role mapping if applicable

3. **Nonce Support**
   - ✅ Document whether nonce is returned in ID token
   - ✅ Provide examples if supported
   - ⚠️ Note if nonce is not supported

4. **Redirect URI Requirements**
   - ✅ Emphasize exact match requirement
   - ✅ Provide examples of correct/incorrect formats
   - ✅ Note case-sensitivity

5. **Error Handling**
   - ✅ Document all possible error codes
   - ✅ Provide troubleshooting steps
   - ✅ Include common integration issues

### 8.2 Testing Checklist

Before going to production, verify:

- [ ] Redirect URI is exactly whitelisted (no trailing slash, correct protocol)
- [ ] Only standard OIDC scopes are requested
- [ ] ID token includes required claims (`sub`, `email`, `name`)
- [ ] Role information is included in ID token (if applicable)
- [ ] Nonce is returned in ID token (if sent in request)
- [ ] Token validation works (signature, issuer, audience, expiration)
- [ ] Error handling works correctly

---

## 9. Support & Contact

**Integration Issues:**
- Check Vercel function logs for detailed error messages
- All errors are logged with context for debugging

**Role Assignment:**
- Admin roles can be set manually via database scripts
- Contact Amanoba team for role assignment if SSO doesn't provide roles

---

## 10. Summary of Key Learnings

1. **Scopes:** Only use standard OIDC scopes (`openid profile email`). Don't request `roles` scope.

2. **Roles:** Include role information in ID token claims, not as a scope. Use `role` or `roles` claim names.

3. **Nonce:** Return nonce in ID token if it was sent in authorization request (standard OIDC behavior).

4. **Redirect URIs:** Must match exactly (case-sensitive, no trailing slashes, correct protocol).

5. **Token Claims:** Include `sub`, `email`, and `name` at minimum. Include `role`/`roles` for access control.

6. **Error Messages:** Provide clear error messages with actionable solutions.

---

**Document Prepared By:** Amanoba Development Team  
**Last Updated:** January 20, 2026  
**Status:** Production Tested ✅
