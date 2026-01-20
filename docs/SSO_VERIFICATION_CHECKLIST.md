# SSO Configuration Verification Checklist

## ✅ Environment Variables Setup

You've configured the following variables on Vercel:

- [x] `SSO_AUTH_URL` - Authorization endpoint
- [x] `SSO_TOKEN_URL` - Token exchange endpoint
- [x] `SSO_USERINFO_URL` - UserInfo endpoint (optional)
- [x] `SSO_JWKS_URL` - JWKS endpoint for token validation
- [x] `SSO_ISSUER` - SSO provider issuer
- [x] `SSO_CLIENT_ID` - OAuth client ID
- [x] `SSO_CLIENT_SECRET` - OAuth client secret
- [x] `SSO_REDIRECT_URI` - Callback URL
- [x] `SSO_SCOPES` - OAuth scopes

## 🔍 Verification Steps

### 1. Verify Redirect URI Match

**In Vercel:**
- Check that `SSO_REDIRECT_URI` is set to:
  ```
  https://www.amanoba.com/api/auth/sso/callback
  ```
  OR
  ```
  https://amanoba.com/api/auth/sso/callback
  ```
  (Must match your actual domain)

**In SSO Provider:**
- Ensure the same URI is whitelisted in your SSO provider's "Redirect URIs" or "Allowed Callback URLs"

### 2. Verify Scopes

**Expected value for `SSO_SCOPES`:**
```
openid profile email roles
```

**Required scopes:**
- `openid` - Required for OIDC
- `profile` - User name
- `email` - User email
- `roles` - User roles (admin/user)

### 3. Verify Endpoints

**Check that all endpoints use HTTPS:**
- `SSO_AUTH_URL` - Should start with `https://`
- `SSO_TOKEN_URL` - Should start with `https://`
- `SSO_JWKS_URL` - Should start with `https://`
- `SSO_ISSUER` - Should start with `https://`

### 4. Test SSO Login Flow

1. **Deploy to Vercel** (if not already deployed)
   ```bash
   git push origin main
   ```

2. **Visit Sign-In Page**
   - Go to: `https://www.amanoba.com/auth/signin`
   - You should see "Sign in with SSO" button (if `SSO_CLIENT_ID` is set)

3. **Test Login**
   - Click "Sign in with SSO"
   - Should redirect to SSO provider login page
   - After login, should redirect back to dashboard

4. **Check for Errors**
   - If you see "SSO not configured" → Check environment variables
   - If you see "redirect_uri_mismatch" → Check redirect URI in provider
   - If you see "token validation failed" → Check JWKS URL and issuer

## 🐛 Common Issues & Solutions

### Issue: "SSO not configured" Error
**Symptoms:** Button doesn't appear or shows error
**Solution:**
- Verify `SSO_CLIENT_ID` is set in Vercel
- Check that variables are deployed (may need to redeploy)

### Issue: "redirect_uri_mismatch"
**Symptoms:** SSO provider rejects the request
**Solution:**
- Verify `SSO_REDIRECT_URI` in Vercel matches exactly what's in SSO provider
- Check for trailing slashes, protocol (https), and exact path

### Issue: "Token validation failed"
**Symptoms:** Login redirects but shows error
**Solution:**
- Verify `SSO_JWKS_URL` is accessible
- Verify `SSO_ISSUER` matches token `iss` claim
- Check that `SSO_CLIENT_ID` matches token `aud` claim

### Issue: "State mismatch"
**Symptoms:** CSRF error after redirect
**Solution:**
- Usually indicates cookie issues
- Check that cookies are being set (browser dev tools)
- Verify domain matches (www vs non-www)

## 📋 Pre-Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Redirect URI whitelisted in SSO provider
- [ ] Tested login flow end-to-end
- [ ] Verified role assignment (admin/user)
- [ ] Tested logout flow
- [ ] Checked error handling
- [ ] Verified account linking (if email matches existing account)
- [ ] Tested with both admin and user roles

## 🔐 Security Checklist

- [ ] `SSO_CLIENT_SECRET` is marked as "Sensitive" in Vercel
- [ ] All endpoints use HTTPS
- [ ] Redirect URI uses production domain
- [ ] No secrets committed to git
- [ ] SSO provider has proper security settings

## 📊 Monitoring

After deployment, monitor:

1. **Login Success Rate**
   - Check Vercel logs for SSO-related errors
   - Monitor authentication failures

2. **Token Validation**
   - Watch for "token validation failed" errors
   - Check JWKS endpoint accessibility

3. **User Creation**
   - Verify new users are created correctly
   - Check role assignment

## 🚀 Next Steps

1. **Deploy to Production**
   ```bash
   git push origin main
   ```

2. **Test the Flow**
   - Visit production sign-in page
   - Test SSO login
   - Verify redirect and session creation

3. **Monitor Logs**
   - Check Vercel function logs
   - Watch for any errors

4. **Verify Role Assignment**
   - Test with admin role from SSO
   - Test with user role from SSO
   - Verify admin access works

## 📝 Notes

- SSO button only appears if `SSO_CLIENT_ID` is set
- Facebook login remains available alongside SSO
- Anonymous login still works
- Account linking: If SSO email matches existing account, accounts are linked

---

**Status:** ✅ Environment variables configured on Vercel
**Next:** Deploy and test the SSO flow
