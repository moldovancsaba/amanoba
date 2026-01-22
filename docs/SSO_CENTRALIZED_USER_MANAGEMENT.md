# SSO Login-Only Policy & Local Role Management

## Executive Summary

Policy (effective January 2026):
- SSO is used for login only.
- User roles are managed locally in MongoDB (`Player.role`).
- Admin access checks use the session role (synced from DB), not SSO claims.

This document replaces the older SSO-centralized role plan to match the current implementation.

---

## What This Means

### 1) Authentication Sources
- SSO (`sso.doneisbetter.com`) is used to authenticate users and create/identify players.
- Facebook and anonymous login remain supported where implemented.

### 2) Role Source of Truth
- `Player.role` in MongoDB is the only source of truth.
- Roles are not synced from SSO.
- Role updates happen via Admin UI or admin scripts.

### 3) Admin Access
Admin access is determined by:
```
session.user.role === 'admin'
```
The session role is refreshed from the database on each JWT callback.

---

## Implementation Overview

### SSO Callback Behavior
File: `app/api/auth/sso/callback/route.ts`
- Creates/updates player from SSO profile data (sub, email, name).
- Does not modify `Player.role` (local-only).
- New SSO users default to `role: 'user'`.

### Auth Session Sync
File: `auth.ts`
- JWT callback fetches Player and always uses database role.
- No token-expiry based logout tied to SSO role checks.

### Admin Checks
File: `app/lib/auth/admin.ts`
- `isAdmin`, `getRole`, `checkAdminAccess` read from session only.

### Middleware
File: `middleware.ts`
- Admin route protection uses `req.auth.user.role`.
- No SSO token expiry forced logout.

---

## Admin Role Management

### Admin UI
File: `app/[locale]/admin/players/page.tsx`
- Admins can set User or Admin role via dropdown.
- Uses API: `PATCH /api/admin/players/:playerId/role`.

### Admin API
File: `app/api/admin/players/[playerId]/role/route.ts`
- Validates role (`user` / `admin`)
- Writes to `Player.role`
- Logs the change with `updatedBy`

---

## Operational Notes

1. SSO role claims are ignored.
2. A user’s role is persistent across logins until changed by admin.
3. If admin access is missing, fix role in DB (Admin UI or script).

---

## Related Documents

- `docs/SSO_ADMIN_ROLE_FIX.md`
- `docs/SSO_INTEGRATION_REQUIREMENTS.md`
- `TASKLIST.md`

