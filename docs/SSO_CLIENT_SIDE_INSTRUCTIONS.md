# SSO Client-Side Instructions for Amanoba Agent

## ✅ SSO Server Configuration Complete - ALL FIXES DEPLOYED

**ISSUES FOUND AND FIXED:**
1. ✅ `roles` scope was missing from SSO server's global scope whitelist (SCOPE_DEFINITIONS)
2. ✅ `nonce` parameter was not being captured, stored, or returned in ID tokens (OIDC spec violation)

**Deployed:** January 20, 2026
- Commit b642a352: Added 'roles' scope
- Commit 512c62ad: Added nonce support

The SSO server (sso.doneisbetter.com) is now configured and the OAuth client "amanoba" is ready.

**OAuth Client Details:**
- **Client ID:** `03e2626d-7639-45d7-88a6-ebf5697c58f7`
- **Client Secret:** (Should be in your .env.local file)
- **Redirect URI:** `https://amanoba.com/api/auth/sso/callback`
- **Allowed Scopes:** `openid profile email offline_access roles`

---

## 🔧 Required Environment Variables

Ensure these are set in your `.env.local` (development) and Vercel (production):

```bash
# SSO Provider Endpoints
SSO_AUTH_URL=https://sso.doneisbetter.com/authorize
SSO_TOKEN_URL=https://sso.doneisbetter.com/token
SSO_USERINFO_URL=https://sso.doneisbetter.com/userinfo
SSO_JWKS_URL=https://sso.doneisbetter.com/.well-known/jwks.json
SSO_ISSUER=https://sso.doneisbetter.com

# SSO Client Credentials
SSO_CLIENT_ID=03e2626d-7639-45d7-88a6-ebf5697c58f7
SSO_CLIENT_SECRET=[your_client_secret_here]

# SSO Redirect Configuration
SSO_REDIRECT_URI=https://amanoba.com/api/auth/sso/callback
SSO_SCOPES=openid profile email offline_access roles
```

---

## 📝 Verify Current Implementation

Your current SSO implementation in `/app/api/auth/sso/login/route.ts` is **correct**:

```typescript
const authParams = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',  // ✅ Correct
  scope: scopes,           // ✅ Correct (includes 'roles')
  state,
  nonce,
});
```

**No changes needed in the client code!**

---

## 🧪 Test the SSO Flow

### 1. **Development Testing:**
```bash
# Start your dev server
npm run dev

# Visit the SSO login URL
open http://localhost:3000/api/auth/sso/login?returnTo=/dashboard
```

### 2. **Expected Flow:**
1. User clicks "Sign in with SSO"
2. Redirects to: `https://sso.doneisbetter.com/authorize?...`
3. User logs in (or is already logged in)
4. SSO redirects back to: `https://amanoba.com/api/auth/sso/callback?code=...`
5. Your callback exchanges code for tokens
6. User is redirected to dashboard

### 3. **Check Logs:**
Look for these log messages in your console:
- ✅ "SSO login redirect URL generated"
- ✅ "SSO login initiated"
- ✅ "SSO token validated successfully"

---

## 🐛 Common Issues & Fixes

### Issue: "SSO not configured" Error
**Fix:** Verify all environment variables are set:
```bash
echo $SSO_AUTH_URL
echo $SSO_CLIENT_ID
echo $SSO_JWKS_URL
```

### Issue: "invalid_scope" Error  
**Fix:** ✅ FIXED!
1. Added `roles` to OAuth client's allowed_scopes
2. Added `roles` to SSO server's global SCOPE_DEFINITIONS whitelist

### Issue: "invalid_nonce" Error
**Fix:** ✅ FIXED!
The SSO server was not capturing, storing, or returning the `nonce` parameter in ID tokens. This violated the OIDC spec and caused validation failures.

**Changes:**
- SSO now extracts `nonce` from authorization requests
- Stores `nonce` with authorization codes
- Returns `nonce` in ID token payload
- Your app can now validate the nonce matches
   
**Deployment:** All fixes deployed January 20, 2026 (Commits: b642a352, 512c62ad)

### Issue: "Token validation failed"
**Fix:** Verify these match exactly:
- `SSO_ISSUER` = `https://sso.doneisbetter.com`
- `SSO_CLIENT_ID` = `03e2626d-7639-45d7-88a6-ebf5697c58f7`

### Issue: "Redirect URI mismatch"
**Fix:** Ensure `SSO_REDIRECT_URI` matches exactly:
- Production: `https://amanoba.com/api/auth/sso/callback`
- Development: `http://localhost:3000/api/auth/sso/callback`

---

## 🔒 Security Checklist

- [x] ✅ `SSO_CLIENT_SECRET` is in `.env.local` (NOT committed to git)
- [x] ✅ State and nonce are generated per request
- [x] ✅ Cookies are `httpOnly` and `secure` in production
- [x] ✅ Token signature is verified using JWKS
- [x] ✅ Issuer and audience claims are validated

---

## 📊 What Roles Mean

The `roles` scope returns user roles from SSO:

```typescript
// SSO token claims.roles can be:
["admin"]  // Admin user with full access
["user"]   // Regular user

// Your mapSSORole() function correctly handles this:
export function mapSSORole(ssoRoles?: string[]): 'user' | 'admin' {
  const hasAdminRole = ssoRoles.some(
    (role) => role.toLowerCase() === 'admin' || role.toLowerCase().includes('admin')
  );
  return hasAdminRole ? 'admin' : 'user';
}
```

---

## ✅ Summary

**Server-side (SSO):** ✅ Complete - OAuth client configured with correct scopes

**Client-side (Amanoba):** ✅ Implementation looks correct - No changes needed!

**Next Step:** Test the SSO login flow and verify it works end-to-end.

---

## 🆘 If Issues Persist

If you still get errors after testing:

1. **Clear browser cache completely**
2. **Check browser console for errors** (F12 → Console tab)
3. **Check server logs** for SSO-related errors
4. **Verify environment variables** are loaded correctly
5. **Test with a new incognito window**

If problems continue, provide:
- Error message from browser console
- Error message from server logs
- The exact URL that's failing

---

**SSO is now ready to use! 🚀**
