# SSO Nonce Error - Fix Instructions

**Error:** `https://www.amanoba.com/hu/auth/signin?error=invalid_nonce`

**Root Cause:** The nonce parameter is now correctly implemented in SSO (deployed 2026-01-20), but you may have cached data from the old flow.

---

## ✅ Quick Fix (Try This First)

### Option 1: Clear All Cookies & Cache
1. **Chrome/Edge:**
   - Press `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
   - Select "All time"
   - Check: ✅ Cookies, ✅ Cached images
   - Click "Clear data"

2. **Firefox:**
   - Press `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
   - Select "Everything"
   - Check: ✅ Cookies, ✅ Cache
   - Click "Clear Now"

3. **Safari:**
   - Safari menu → Preferences → Privacy
   - Click "Manage Website Data"
   - Click "Remove All"

### Option 2: Use Incognito/Private Window
1. Open new incognito window (`Cmd+Shift+N` or `Ctrl+Shift+N`)
2. Visit: https://www.amanoba.com/api/auth/sso/login?returnTo=/dashboard
3. Login with SSO

---

## 🔍 Diagnostic Steps

### Step 1: Verify SSO Server Has Nonce Support

```bash
# Check if SSO server has latest deployment
curl -s "https://sso.doneisbetter.com/.well-known/openid-configuration" | grep -q "authorization_endpoint" && echo "✅ SSO server is UP" || echo "❌ SSO server is DOWN"
```

**Expected:** ✅ SSO server is UP

### Step 2: Test SSO Authorization Flow

Visit this URL in browser (will redirect to SSO login):
```
https://www.amanoba.com/api/auth/sso/login?returnTo=/dashboard
```

### Step 3: Check Browser Console

1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. Clear console
4. Click "SSO Login" button
5. Look for errors

### Step 4: Check Server Logs

**Amanoba Server Logs:**
Look for these log messages:
- ✅ "SSO login initiated" - Login started correctly
- ✅ "SSO token validated successfully" - Token signature OK
- ❌ "SSO nonce mismatch" - This is the error

**SSO Server Logs (if you have access):**
- ✅ "Authorization code created" with nonce
- ✅ "ID token generated" with nonce

---

## 🛠️ Advanced Debugging

### Check Cookies

1. Open DevTools (F12)
2. Go to **Application** tab → **Cookies**
3. For `www.amanoba.com`, look for:
   - `sso_state` (should exist during login flow)
   - `sso_nonce` (should exist during login flow)
   - Delete these if they exist and try again

### Test Flow Manually

```bash
# 1. Generate test parameters
STATE=$(openssl rand -base64 24 | tr '+/' '-_' | tr -d '=')
NONCE=$(openssl rand -base64 24 | tr '+/' '-_' | tr -d '=')

echo "State: $STATE"
echo "Nonce: $NONCE"

# 2. Visit authorization URL (in browser):
# https://sso.doneisbetter.com/authorize?response_type=code&client_id=03e2626d-7639-45d7-88a6-ebf5697c58f7&redirect_uri=https://amanoba.com/api/auth/sso/callback&scope=openid+profile+email+offline_access+roles&state=$STATE&nonce=$NONCE

# 3. After login, check the callback URL parameters
# 4. The ID token should include the nonce claim
```

---

## 🐛 If Problem Persists

### Verify Environment Variables

Check that Amanoba has these set correctly:

```bash
# Required SSO Configuration
SSO_AUTH_URL=https://sso.doneisbetter.com/authorize
SSO_TOKEN_URL=https://sso.doneisbetter.com/token
SSO_JWKS_URL=https://sso.doneisbetter.com/.well-known/jwks.json
SSO_ISSUER=https://sso.doneisbetter.com
SSO_CLIENT_ID=03e2626d-7639-45d7-88a6-ebf5697c58f7
SSO_CLIENT_SECRET=[your-secret]
SSO_REDIRECT_URI=https://amanoba.com/api/auth/sso/callback
SSO_SCOPES=openid profile email offline_access roles
```

### Check Amanoba Callback Code

The callback validation at line 120 in `/app/api/auth/sso/callback/route.ts`:

```typescript
// Verify nonce
if (storedNonce && claims.nonce !== storedNonce) {
  logger.warn({ nonce: claims.nonce, storedNonce }, 'SSO nonce mismatch');
  return NextResponse.redirect(
    new URL('/auth/signin?error=invalid_nonce', request.url)
  );
}
```

**Debug this by adding:**

```typescript
// Add before the nonce check
logger.info({
  hasStoredNonce: !!storedNonce,
  storedNonce,
  hasClaimsNonce: !!claims.nonce,
  claimsNonce: claims.nonce,
  match: claims.nonce === storedNonce
}, 'Nonce validation debug');
```

### Verify ID Token Contains Nonce

Add this logging after token validation:

```typescript
const claims = await validateSSOToken(idToken);
logger.info({
  hasSub: !!claims?.sub,
  hasEmail: !!claims?.email,
  hasNonce: !!claims?.nonce,
  nonce: claims?.nonce
}, 'ID token claims');
```

---

## 📊 Expected Flow

### Correct SSO Login Flow:

```
1. User clicks "SSO Login"
   → Amanoba generates: state, nonce
   → Stores in cookies: sso_state, sso_nonce
   → Redirects to SSO with: ?state=xxx&nonce=yyy

2. SSO Authorization
   → Receives: state, nonce
   → User logs in (if not already)
   → Creates authorization code with nonce
   → Redirects back: ?code=zzz&state=xxx

3. Amanoba Callback
   → Validates state matches cookie
   → Exchanges code for tokens
   → Gets ID token with nonce claim
   → Validates nonce matches cookie
   → ✅ Success!
```

### What's Failing:

```
❌ Step 3: Nonce validation fails
   → claims.nonce !== storedNonce

Possible causes:
1. SSO not including nonce in ID token (FIXED in deployment 7418d137)
2. Browser cache has old ID token without nonce
3. Cookies expired/deleted between steps 1 and 3
4. Deployment not fully propagated (Vercel edge cache)
```

---

## 🚀 Solution Summary

**Most Likely Fix:**
1. Clear all browser cookies and cache
2. Wait 5 minutes for SSO deployment to fully propagate
3. Try SSO login in incognito window
4. Should work! ✅

**If Still Failing:**
- Check server logs for nonce values (both stored and received)
- Verify SSO deployment is live (git commit 7418d137)
- Confirm environment variables are correct
- Test with a different browser

---

## 📞 Support

If the issue persists after:
- Clearing cache
- Waiting 5 minutes
- Testing in incognito
- Checking logs

Then provide:
- Browser console errors
- Server log output (nonce values)
- Exact URL causing the error
- Time of the error (for log correlation)

---

**Last Updated:** 2026-01-20  
**SSO Deployment:** 7418d137 (nonce support added)  
**Status:** Fix deployed, may require cache clear
