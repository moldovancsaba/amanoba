# SSO Scope Error Fix

## Error: `invalid_scope`

The error `invalid_scope` indicates that the SSO provider doesn't support one or more of the requested scopes.

## Problem

We were requesting: `openid profile email roles`

The `roles` scope is **not a standard OIDC scope** and many providers don't support it.

## Solution

### Option 1: Remove `roles` from scopes (Recommended)

**Update `SSO_SCOPES` in Vercel:**

```
SSO_SCOPES=openid profile email
```

**Why this works:**
- `openid` - Required for OIDC
- `profile` - Standard scope for user profile (name)
- `email` - Standard scope for email address
- Roles may be included in the token by default, or accessible via a different method

### Option 2: Check SSO Provider Documentation

Check your SSO provider's documentation for:
- Supported scopes list
- How roles are provided (might be in token claims by default)
- Alternative scope names (e.g., `groups`, `permissions`)

## Updated Code

The code has been updated to default to standard OIDC scopes:
- Default: `openid profile email` (if `SSO_SCOPES` not set)
- Custom: Use `SSO_SCOPES` environment variable if set

## Steps to Fix

1. **Update Vercel Environment Variable:**
   ```
   SSO_SCOPES=openid profile email
   ```

2. **Redeploy:**
   - Vercel should auto-redeploy, or trigger manually

3. **Test:**
   - Visit: `https://www.amanoba.com/auth/signin`
   - Click "Sign in with SSO"
   - Should no longer show `invalid_scope` error

## Role Information

Even without the `roles` scope, roles might still be available:
- In the ID token claims (check token after login)
- Via a different scope name (check provider docs)
- Via userinfo endpoint (if configured)

## Verify Token Claims

After successful login, check the ID token to see what claims are included:
- `sub` - Subject (user identifier)
- `email` - Email address
- `name` - Display name
- `roles` or `groups` - May be included by default

If roles are in the token but not accessible, we may need to:
1. Update the token validation to extract roles from different claim names
2. Use userinfo endpoint to fetch roles
3. Map roles differently based on provider

## Testing

After updating `SSO_SCOPES`:

1. **Test Login:**
   - Should redirect to SSO provider without `invalid_scope` error
   - Should complete login successfully

2. **Check Token:**
   - After login, check logs for token claims
   - Verify if roles are present in token

3. **Verify Role Assignment:**
   - Check if user role is assigned correctly
   - Test admin access if applicable

---

**Status:** Code updated to use standard OIDC scopes
**Action Required:** Update `SSO_SCOPES` in Vercel to `openid profile email`
