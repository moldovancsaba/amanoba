# Debug Player Endpoint Security Plan

**Date**: 2026-01-25  
**Status**: ✅ APPLIED  
**Priority**: Security – prevent exposure of raw player data

---

## 🔴 Root Cause

**Endpoint**: `GET /api/debug/player/[playerId]`

**Problem**: Returned raw database documents (Player, PlayerProgression, PointsWallet, PlayerSession) to **any caller** with no authentication or authorization. Any user could request any player’s data by ID.

**Why it mattered**:
- Full PII and internal state exposed (email, wallet, progression, sessions)
- No audit trail of who accessed debug data
- Unsuitable for production or any environment where non-admins can call the API

---

## ✅ Fix Applied

**File**: `app/api/debug/player/[playerId]/route.ts`

**Changes**:
1. **Disable in production**: If `NODE_ENV === 'production'`, respond with `404` and no body. The route is effectively off in prod.
2. **Admin-only elsewhere**: In dev/staging, require an admin session via `requireAdmin(request, session)`. Unauthenticated or non-admin callers receive the same response as other admin routes (401/403).

**Behavior**:
- **Production**: `404 Not found` – route disabled.
- **Dev/staging**: Only callers with a valid admin session can access the endpoint; others get 401/403 from `requireAdmin`.

---

## 🧪 Verification

- In production build (`NODE_ENV=production`): `GET /api/debug/player/<id>` → 404.
- In dev, without session or as non-admin: → 401/403.
- In dev, as admin: → 200 and debug payload (unchanged).

---

## 📋 Rollback

See `docs/DEBUG_PLAYER_ENDPOINT_ROLLBACK_PLAN.md`.
