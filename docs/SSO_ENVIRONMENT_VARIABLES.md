# SSO Environment Variables

This document describes all environment variables required for SSO (Single Sign-On) integration with `sso.doneisbetter.com`.

## Required Variables

### SSO Provider Configuration

```bash
# SSO Provider Endpoints
SSO_AUTH_URL=https://sso.doneisbetter.com/authorize
SSO_TOKEN_URL=https://sso.doneisbetter.com/token
SSO_USERINFO_URL=https://sso.doneisbetter.com/userinfo  # Optional
SSO_JWKS_URL=https://sso.doneisbetter.com/.well-known/jwks.json
SSO_ISSUER=https://sso.doneisbetter.com

# SSO Client Credentials
SSO_CLIENT_ID=your_client_id_here
SSO_CLIENT_SECRET=your_client_secret_here

# SSO Redirect Configuration
SSO_REDIRECT_URI=https://amanoba.com/api/auth/sso/callback
SSO_SCOPES=openid profile email roles

# Optional: SSO Logout
SSO_LOGOUT_URL=https://sso.doneisbetter.com/logout  # Optional
SSO_POST_LOGOUT_REDIRECT_URI=https://amanoba.com  # Optional
```

## Variable Descriptions

### `SSO_AUTH_URL`
- **What**: Authorization endpoint URL from SSO provider
- **Why**: Used to redirect users to SSO login page
- **Example**: `https://sso.doneisbetter.com/authorize`

### `SSO_TOKEN_URL`
- **What**: Token exchange endpoint URL
- **Why**: Used to exchange authorization code for ID token
- **Example**: `https://sso.doneisbetter.com/token`

### `SSO_USERINFO_URL` (Optional)
- **What**: UserInfo endpoint URL
- **Why**: Can be used to fetch additional user information
- **Note**: Currently not used, as all info is in ID token
- **Example**: `https://sso.doneisbetter.com/userinfo`

### `SSO_JWKS_URL`
- **What**: JSON Web Key Set endpoint URL
- **Why**: Used to validate ID token signatures
- **Example**: `https://sso.doneisbetter.com/.well-known/jwks.json`

### `SSO_ISSUER`
- **What**: SSO provider issuer identifier
- **Why**: Used to validate ID token `iss` claim
- **Example**: `https://sso.doneisbetter.com`

### `SSO_CLIENT_ID`
- **What**: OAuth client ID from SSO provider
- **Why**: Identifies your application to the SSO provider
- **Security**: Can be public (included in redirects)

### `SSO_CLIENT_SECRET`
- **What**: OAuth client secret from SSO provider
- **Why**: Used to authenticate token exchange requests
- **Security**: ⚠️ **MUST BE KEPT SECRET** - Never commit to git

### `SSO_REDIRECT_URI`
- **What**: Callback URL after SSO authentication
- **Why**: SSO provider redirects here after user authentication
- **Example**: `https://amanoba.com/api/auth/sso/callback` or `https://www.amanoba.com/api/auth/sso/callback`
- **⚠️ CRITICAL**: Must match **exactly** what's configured in SSO provider (case-sensitive, no trailing slashes)
- **Production Note**: Both `amanoba.com` and `www.amanoba.com` redirect URIs should be whitelisted in SSO provider

### `SSO_SCOPES`
- **What**: OAuth scopes to request
- **Why**: Determines what user information is included in token
- **Recommended**: `openid profile email offline_access`
- **⚠️ CRITICAL**: Must include `profile` scope for role information
- **Standard OIDC Scopes**:
  - `openid` - **Required** for OIDC
  - `profile` - **Required** for role claim (includes name, user_type, role)
  - `email` - **Required** for email address
  - `offline_access` - **Recommended** for refresh tokens
- **Non-Standard Scopes**:
  - ❌ `roles` - **DO NOT USE** - Not a standard OIDC scope, causes `invalid_scope` errors
  
**Note:** Role information is included in the ID token's `role` claim when `profile` scope is requested. The `roles` scope is NOT standard OIDC and should not be used.

### `SSO_LOGOUT_URL` (Optional)
- **What**: SSO provider logout endpoint
- **Why**: Used for front-channel logout (redirects user to logout)
- **Note**: If not provided, only local session is cleared

### `SSO_POST_LOGOUT_REDIRECT_URI` (Optional)
- **What**: URL to redirect to after SSO logout
- **Why**: Where user lands after provider logout
- **Example**: `https://amanoba.com`

## Environment Setup

### Development (.env.local)

```bash
# Copy from .env.example and fill in values
SSO_AUTH_URL=https://sso.doneisbetter.com/authorize
SSO_TOKEN_URL=https://sso.doneisbetter.com/token
SSO_JWKS_URL=https://sso.doneisbetter.com/.well-known/jwks.json
SSO_ISSUER=https://sso.doneisbetter.com
SSO_CLIENT_ID=dev_client_id
SSO_CLIENT_SECRET=dev_client_secret
SSO_REDIRECT_URI=http://localhost:3000/api/auth/sso/callback
# Use standard OIDC scopes only - 'profile' includes role information
SSO_SCOPES=openid profile email offline_access
```

### Production (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all required variables
3. Ensure `SSO_REDIRECT_URI` uses production domain
4. ⚠️ Never commit `SSO_CLIENT_SECRET` to git

## Verification

To verify SSO is configured correctly:

1. Check that all required variables are set:
   ```bash
   # In your terminal
   echo $SSO_CLIENT_ID
   echo $SSO_ISSUER
   ```

2. Test SSO login flow:
   - Visit `/auth/signin`
   - Click "Sign in with SSO"
   - Should redirect to SSO provider
   - After login, should redirect back to dashboard

3. Check logs for SSO errors:
   - Look for "SSO configuration missing" warnings
   - Check for token validation errors

## Troubleshooting

### "SSO not configured" Error
- **Cause**: Missing required environment variables
- **Fix**: Ensure `SSO_AUTH_URL`, `SSO_CLIENT_ID`, and `SSO_JWKS_URL` are set

### "Token validation failed" Error
- **Cause**: Invalid token signature or claims
- **Fix**: 
  - Verify `SSO_ISSUER` matches token `iss` claim
  - Verify `SSO_CLIENT_ID` matches token `aud` claim
  - Check `SSO_JWKS_URL` is accessible

### "State mismatch" Error
- **Cause**: CSRF protection - state cookie doesn't match
- **Fix**: Usually indicates cookie issues or expired state (10 min timeout)

### Redirect URI Mismatch
- **Cause**: `SSO_REDIRECT_URI` doesn't match provider configuration
- **Fix**: Ensure exact match (including protocol, domain, path)

## Security Notes

1. **Never commit secrets**: Use `.env.local` for development, Vercel env vars for production
2. **Use HTTPS in production**: Required for secure cookie transmission
3. **Rotate secrets**: Change `SSO_CLIENT_SECRET` if compromised
4. **Monitor logs**: Watch for authentication failures and suspicious activity

## Related Documentation

- [SSO Implementation Guide](./SSO_IMPLEMENTATION.md)
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [SSO Foundation Complete](./SSO_FOUNDATION_COMPLETE.md)
