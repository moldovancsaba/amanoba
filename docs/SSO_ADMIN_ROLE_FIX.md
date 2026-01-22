# Admin Role Management (SSO Login-Only)

**Date**: 2026-01-22  
**Status**: ✅ Active Policy  
**Scope**: Admin roles are managed locally; SSO is login-only.

---

## Summary

SSO (`sso.doneisbetter.com`) is used only to authenticate users.  
Admin privileges are not taken from SSO claims.  
Roles live in MongoDB on `Player.role`.

---

## Current Behavior

### SSO Callback
File: `app/api/auth/sso/callback/route.ts`
- Creates/updates player profile fields (name, email, ssoSub).
- Does not modify role.
- New SSO users default to `role: 'user'`.

### Admin Access Checks
File: `app/lib/auth/admin.ts`
- Uses `session.user.role` only.

### Middleware
File: `middleware.ts`
- Uses `req.auth.user.role` only.

---

## Admin Role Assignment

### Admin UI (Preferred)
File: `app/[locale]/admin/players/page.tsx`
- Dropdown for User/Admin role.
- API: `PATCH /api/admin/players/:playerId/role`.

### Admin Script (Emergency)
File: `scripts/force-admin-role.ts`
```
npx tsx scripts/force-admin-role.ts <playerId|email|ssoSub>
```

---

## Why This Policy

- Avoids SSO role claim inconsistencies.
- Prevents admin access loss due to token expiry.
- Keeps role changes auditable and explicit.

---

## Required Environment Variables

Role management does not require any SSO role scopes or role claims.  
Only standard SSO login configuration is required.

