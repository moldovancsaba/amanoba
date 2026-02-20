# Vercel Environment Variables - CRITICAL CHECK

## ⚠️ MUST SET IN VERCEL DASHBOARD

Go to: https://vercel.com/your-team/amanoba/settings/environment-variables

**Add or verify this variable:**

```
Name: SSO_SCOPES
Value: openid profile email offline_access roles
Environment: Production, Preview, Development
```

## Why This Is Critical

The `SSO_SCOPES` variable controls what information is requested from SSO:

- `openid` - Required for OIDC
- `profile` - **REQUIRED FOR ROLE** - SSO includes `role` claim in profile
- `email` - User's email address
- `offline_access` - Refresh token
- `roles` - Future: Array of roles (currently unused, role is in profile)

**Without `profile` scope, the role is NOT in the ID token!**

## Current Status

- ✅ Local `.env.local` - `SSO_SCOPES` added
- ⏳ Vercel Production - **YOU NEED TO ADD THIS**

## Steps to Add in Vercel

1. Go to https://vercel.com
2. Select your project: **amanoba**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Name: `SSO_SCOPES`
6. Value: `openid profile email offline_access roles`
7. Check: **Production**, **Preview**, **Development**
8. Click **Save**
9. **Redeploy** the application (Settings → Deployments → Latest → Redeploy)

## Verification

After adding and redeploying:

1. Logout from Amanoba completely
2. Login via SSO
3. Check Vercel logs for:
   ```
   [JWT Callback] Adding role to token: { role: 'admin', ... }
   [Session Callback] Role in session: { sessionRole: 'admin', ... }
   ```
4. Access `/en/admin` - should work!

## If Still Not Working

Check Vercel Function Logs for these debug messages:
- `DEBUG: ID token claims received from SSO` - Should show `role: 'admin'`
- `DEBUG: Extracted user info from claims` - Should show `role: 'admin'`
- `DEBUG: About to call signIn with role` - Should show `roleBeforeSignIn: 'admin'`
- `[JWT Callback] Adding role to token` - Should show `role: 'admin'`
- `[Session Callback] Role in session` - Should show `sessionRole: 'admin'`

If any of these show `role: 'user'`, that's where the problem is.
