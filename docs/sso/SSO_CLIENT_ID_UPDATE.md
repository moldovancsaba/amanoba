# SSO Client ID Update

## New Client ID

**Client ID:** `03e2626d-7639-45d7-88a6-ebf5697c58f7`

## Vercel Environment Variables to Update

Make sure these are set correctly in Vercel:

```bash
SSO_CLIENT_ID=03e2626d-7639-45d7-88a6-ebf5697c58f7
SSO_CLIENT_SECRET=<your_new_client_secret>
```

## SSO Provider Configuration

In your SSO provider (sso.doneisbetter.com), ensure:

### 1. Redirect URIs Whitelisted

Add these exact URIs to "Allowed Redirect URIs" or "Callback URLs":

```
https://www.amanoba.com/api/auth/sso/callback
https://amanoba.com/api/auth/sso/callback
```

### 2. Client Configuration

- [ ] Client ID: `03e2626d-7639-45d7-88a6-ebf5697c58f7`
- [ ] Client Secret: (matches `SSO_CLIENT_SECRET` in Vercel)
- [ ] Application Status: **Active/Enabled**
- [ ] Redirect URIs: Whitelisted (see above)

## Verification Steps

### 1. Check Vercel Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Verify:
- [ ] `SSO_CLIENT_ID` = `03e2626d-7639-45d7-88a6-ebf5697c58f7`
- [ ] `SSO_CLIENT_SECRET` = (your new secret)
- [ ] All other SSO variables are still set

### 2. Redeploy

After updating variables, redeploy:

```bash
# Or trigger redeploy in Vercel dashboard
git push origin main
```

### 3. Test SSO Login

1. Visit: `https://www.amanoba.com/auth/signin`
2. Click "Sign in with SSO"
3. Should redirect to SSO provider login page (not empty)
4. After login, should redirect back to dashboard

## Expected Authorization URL

After clicking "Sign in with SSO", you should be redirected to:

```
https://sso.doneisbetter.com/authorize?client_id=03e2626d-7639-45d7-88a6-ebf5697c58f7&redirect_uri=https%3A%2F%2Famanoba.com%2Fapi%2Fauth%2Fsso%2Fcallback&response_type=code&scope=openid+profile+email+roles&state=...&nonce=...
```

## Troubleshooting

### If Still Seeing Empty Page

1. **Verify Redirect URI in SSO Provider:**
   - Must be exactly: `https://amanoba.com/api/auth/sso/callback`
   - No trailing slash
   - Must be in whitelist

2. **Check Client Status:**
   - Ensure client is active/enabled
   - Verify client ID matches exactly

3. **Check Vercel Variables:**
   - Ensure `SSO_CLIENT_ID` updated
   - Redeploy after updating variables

4. **Test Direct Access:**
   - Try: `https://sso.doneisbetter.com/.well-known/openid-configuration`
   - Should return JSON with endpoints

## Quick Checklist

- [x] New client created in SSO provider
- [ ] `SSO_CLIENT_ID` updated in Vercel
- [ ] `SSO_CLIENT_SECRET` updated in Vercel
- [ ] Redirect URI whitelisted in SSO provider
- [ ] Application enabled in SSO provider
- [ ] Redeployed to Vercel
- [ ] Tested SSO login flow

---

**Status:** Client recreated, updating Vercel variables
**Next:** Redeploy and test
