# Debug Player Endpoint — Rollback Plan

**Date**: 2026-01-25  
**Related**: `docs/DEBUG_PLAYER_ENDPOINT_SECURITY_PLAN.md`

---

## When to Roll Back

Roll back only if:

- Legitimate admin tooling in production must call this endpoint (not recommended; use admin-only APIs or separate tooling instead), or
- A misconfiguration causes admins to lose access in dev/staging and you need to restore previous behavior quickly.

---

## Rollback Steps

1. **Restore previous route behavior**
   - In `app/api/debug/player/[playerId]/route.ts`:
     - Remove the `NODE_ENV === 'production'` check and the `requireAdmin` + `auth()` gating.
     - Restore the previous implementation that performed no auth and returned raw documents.
   - Or revert the file via git:  
     `git show <commit-before-fix>:app/api/debug/player/[playerId]/route.ts > app/api/debug/player/[playerId]/route.ts`

2. **Redeploy** the app so the reverted route is live.

3. **Re-evaluate** production use of this endpoint. Prefer:
   - Admin-only, non-debug APIs for operational data, or
   - Separate internal tools with their own auth, instead of re-opening the public debug route.

---

## Security Note

Rolling back reintroduces the risk that any caller can read any player’s raw data. Use only in controlled environments and plan a proper replacement (e.g. admin-only debug view or internal service) before relying on the open endpoint again.
