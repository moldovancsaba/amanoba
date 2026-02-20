# SSO Redirect URIs Configuration

This document lists the exact Redirect URIs that need to be configured in your SSO provider (sso.doneisbetter.com).

## Required Redirect URIs

### Production
```
https://www.amanoba.com/api/auth/sso/callback
https://amanoba.com/api/auth/sso/callback
```

### Development (Local)
```
http://localhost:3000/api/auth/sso/callback
```

### Staging (if applicable)
```
https://staging.amanoba.com/api/auth/sso/callback
```

## Configuration Instructions

### For SSO Provider (sso.doneisbetter.com)

1. Log in to your SSO provider admin panel
2. Navigate to your OAuth application settings
3. Find "Redirect URIs" or "Allowed Callback URLs" section
4. Add all the URIs listed above
5. Save the configuration

### Important Notes

- **Exact Match Required**: The redirect URI must match **exactly** (including protocol, domain, and path)
- **No Trailing Slash**: Do not include a trailing slash (`/`) at the end
- **Case Sensitive**: Some providers are case-sensitive, ensure exact casing
- **Protocol Matters**: `http://` vs `https://` must match your environment

## Environment Variable

The redirect URI is configured via:

```bash
SSO_REDIRECT_URI=https://www.amanoba.com/api/auth/sso/callback
```

**For Development:**
```bash
SSO_REDIRECT_URI=http://localhost:3000/api/auth/sso/callback
```

## Verification

After configuring the redirect URIs in your SSO provider:

1. Test the login flow:
   - Visit `/auth/signin`
   - Click "Sign in with SSO"
   - Complete authentication
   - Should redirect back to `/api/auth/sso/callback`

2. Check for errors:
   - "redirect_uri_mismatch" error means URI not whitelisted
   - Verify exact match in provider settings

## Common Issues

### "redirect_uri_mismatch" Error
- **Cause**: Redirect URI not whitelisted in SSO provider
- **Fix**: Add the exact URI to provider's allowed list

### "Invalid redirect_uri" Error
- **Cause**: URI format incorrect or missing
- **Fix**: Ensure no trailing slash, correct protocol, exact path match

### Redirect Works But Shows Error
- **Cause**: Callback endpoint issue (not redirect URI problem)
- **Fix**: Check callback route logs and token validation

## Quick Reference

**Production Redirect URI:**
```
https://www.amanoba.com/api/auth/sso/callback
```

**Development Redirect URI:**
```
http://localhost:3000/api/auth/sso/callback
```

Copy these exact URIs into your SSO provider configuration.
