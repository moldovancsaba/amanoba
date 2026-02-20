# SSO Troubleshooting Guide

## Empty Page on SSO Provider

If you're redirected to the SSO provider but see an empty page, try these solutions:

### 1. Check SSO Provider Configuration

**Verify in SSO Provider Admin Panel:**
- [ ] Client ID is registered and active
- [ ] Redirect URI is whitelisted exactly: `https://amanoba.com/api/auth/sso/callback`
- [ ] Client secret is correct
- [ ] Application is enabled/active

### 2. Check Redirect URI Match

**Critical:** The redirect URI must match **exactly** in both places:

**In Vercel (`SSO_REDIRECT_URI`):**
```
https://amanoba.com/api/auth/sso/callback
```

**In SSO Provider:**
- Must be whitelisted in "Allowed Redirect URIs" or "Callback URLs"
- Must match exactly (no trailing slash, correct protocol)

### 3. Test SSO Provider Directly

Try accessing the SSO provider's authorization endpoint directly in your browser:

```
https://sso.doneisbetter.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https%3A%2F%2Famanoba.com%2Fapi%2Fauth%2Fsso%2Fcallback&response_type=code&scope=openid+profile+email+roles
```

**If this also shows empty page:**
- Issue is with SSO provider configuration
- Contact SSO provider support
- Verify client ID is correct

### 4. Check Browser Console

Open browser developer tools (F12) and check:
- **Console tab:** Look for JavaScript errors
- **Network tab:** Check if any requests are failing
- **Application tab:** Check cookies (SSO state/nonce should be set)

### 5. Verify Environment Variables

**Check in Vercel Dashboard:**
- All SSO variables are set correctly
- No typos in variable names
- Values match SSO provider configuration

**Quick test - add logging:**
The login route logs the redirect URL. Check Vercel function logs to verify:
- `SSO_AUTH_URL` is correct
- `SSO_CLIENT_ID` matches provider
- `SSO_REDIRECT_URI` matches whitelisted URI

### 6. Common Issues

#### Issue: Empty Page
**Possible Causes:**
- Client ID not registered in SSO provider
- Redirect URI not whitelisted
- SSO provider application disabled
- CORS/security restrictions

**Solutions:**
1. Verify client ID in SSO provider admin panel
2. Double-check redirect URI whitelist
3. Contact SSO provider support if issue persists

#### Issue: "Invalid Client" Error
**Cause:** Client ID doesn't exist or is incorrect
**Solution:** Verify `SSO_CLIENT_ID` in Vercel matches SSO provider

#### Issue: "Redirect URI Mismatch"
**Cause:** Redirect URI not whitelisted or doesn't match exactly
**Solution:** 
- Check exact URI in SSO provider settings
- Ensure no trailing slash
- Verify protocol (https)

### 7. Debug Steps

1. **Check Vercel Logs:**
   ```bash
   # In Vercel dashboard, check function logs for:
   # - "SSO login initiated" message
   # - Any error messages
   ```

2. **Test with curl:**
   ```bash
   curl -v "https://sso.doneisbetter.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https%3A%2F%2Famanoba.com%2Fapi%2Fauth%2Fsso%2Fcallback&response_type=code&scope=openid+profile+email+roles"
   ```

3. **Check SSO Provider Status:**
   - Verify SSO provider is operational
   - Check for maintenance/outage notices
   - Test with SSO provider's test tools (if available)

### 8. Contact SSO Provider Support

If all above checks pass but still seeing empty page:

**Provide to SSO Provider:**
- Client ID: `aa058ecb-3a2f-4e6d-8bae-414d4ebfb070`
- Redirect URI: `https://amanoba.com/api/auth/sso/callback`
- Authorization URL you're being redirected to
- Screenshot of empty page
- Browser console errors (if any)

### 9. Alternative: Test with Postman/Insomnia

Test the SSO provider's authorization endpoint directly:

**Request:**
```
GET https://sso.doneisbetter.com/authorize
Query Parameters:
  - client_id: YOUR_CLIENT_ID
  - redirect_uri: https://amanoba.com/api/auth/sso/callback
  - response_type: code
  - scope: openid profile email roles
  - state: test_state
  - nonce: test_nonce
```

**Expected Response:**
- Should redirect to login page (not empty page)
- Or show error message if misconfigured

### 10. Verify OIDC Discovery Document

Check if SSO provider has a discovery document:

```
https://sso.doneisbetter.com/.well-known/openid-configuration
```

This should return JSON with all endpoints. Verify:
- `authorization_endpoint` matches `SSO_AUTH_URL`
- `token_endpoint` matches `SSO_TOKEN_URL`
- `jwks_uri` matches `SSO_JWKS_URL`
- `issuer` matches `SSO_ISSUER`

## Next Steps

1. **Verify SSO Provider Configuration** - Most likely issue
2. **Check Redirect URI Whitelist** - Must match exactly
3. **Test Direct Access** - See if provider responds
4. **Contact SSO Provider** - If configuration looks correct

## Quick Checklist

- [ ] Client ID registered in SSO provider
- [ ] Redirect URI whitelisted in SSO provider
- [ ] SSO provider application is active/enabled
- [ ] Environment variables set correctly in Vercel
- [ ] No typos in client ID or redirect URI
- [ ] SSO provider is operational (no outages)
- [ ] Browser console shows no errors

---

**Most Common Issue:** Redirect URI not whitelisted or doesn't match exactly.
