# Tech Audit Register

**Last updated:** 2026-05-29  
**Baseline:** `9163aaa` @ `https://www.amanoba.com`  
**Method:** Static gates + production smoke + targeted code review ([GDS #81](https://github.com/sovereignsquad/general-design-system/issues/81) evidence style)

## Summary

| Severity | Open | Fixed this audit |
| --- | ---: | ---: |
| S0 | 0 | 0 |
| S1 | 0 | 4 |
| S2 | 4 | 1 |
| S3 | 3 | 0 |

---

## S1 — High (security / privilege)

### AUDIT-001 — Admin feature flags PATCH missing admin guard

| Field | Value |
| --- | --- |
| **Status** | **Fixed** (2026-05-29) |
| **Domain** | Admin / API |
| **Evidence** | `app/api/admin/feature-flags/route.ts` — GET used `requireAdmin`; PATCH only checked `session?.user` |
| **Impact** | Any authenticated learner could PATCH platform feature flags |
| **Fix** | Added `requireAdmin(request, session)` to PATCH |
| **Verify** | `node scripts/audit/check-admin-api-guards.mjs`; unauthenticated PATCH → 401; non-admin → 403 |

### AUDIT-002 — Leaderboard staleness GET missing admin guard

| Field | Value |
| --- | --- |
| **Status** | **Fixed** (2026-05-29) |
| **Domain** | Admin / API |
| **Evidence** | `app/api/admin/leaderboards/recalculate/route.ts` — POST had `requireAdmin`; GET only required session |
| **Impact** | Any logged-in user could read internal leaderboard staleness aggregates |
| **Fix** | Added `requireAdmin` to GET |
| **Verify** | Same as AUDIT-001 |

### AUDIT-003 — Game session APIs trust body `playerId` without session binding

| Field | Value |
| --- | --- |
| **Status** | **Fixed** (2026-05-29) |
| **Domain** | Games / API |
| **Evidence** | `app/api/game-sessions/start/route.ts`, `complete/route.ts` — no `auth()` |
| **Impact** | Caller who knows/guesses a `playerId` may start/complete sessions on behalf of others |
| **Fix** | `requireAuth` + session player binding; complete rejects foreign `sessionId` |
| **Verify** | Unauthenticated POST → 401; foreign `playerId` → 403 |

### AUDIT-004 — Referral API accepts arbitrary `playerId` query/body

| Field | Value |
| --- | --- |
| **Status** | **Fixed** (2026-05-29) |
| **Domain** | Growth / API |
| **Evidence** | `app/api/referrals/route.ts` — GET by `?playerId=` without session check |
| **Impact** | Referral stats leakage / forged referral events |
| **Fix** | GET/POST session-bound; signup flows call `processReferralSignup` directly; PUT admin-only |
| **Verify** | GET without cookie → 401; foreign `playerId` query → 403 |

---

## S2 — Medium (quality / operational)

### AUDIT-005 — CI did not run build, test, lint, or GDS gates

| Field | Value |
| --- | --- |
| **Status** | **Fixed** (2026-05-29) |
| **Evidence** | Only `ui-foundation-check.yml` + `docs-generated-check.yml` on `main` |
| **Impact** | Regressions ship while CI is green |
| **Fix** | Added `.github/workflows/quality-gates.yml` |
| **Verify** | Push/PR runs type-check, test, lint, ui:gds:check, build |

### AUDIT-006 — No browser E2E for critical journeys

| Field | Value |
| --- | --- |
| **Status** | **Open** |
| **Evidence** | No Playwright/Cypress; 32 unit tests vs 123 API routes |
| **Impact** | "Build passes" does not catch broken admin save, quiz gate, checkout |
| **Remediation** | Playwright golden paths (auth, course, admin list, editor save) |
| **Wave** | W1 |

### AUDIT-007 — GDS accessibility marked "Verified" without automated proof

| Field | Value |
| --- | --- |
| **Status** | **Open** |
| **Evidence** | `docs/product/GDS_ACCESSIBILITY_VERIFICATION.md` — manual only; `ui:check:gds-a11y` checks doc exists |
| **Impact** | Regressions in keyboard/focus after GDS migration undetected |
| **Remediation** | Playwright a11y spot checks + axe on 4 required surfaces |
| **Wave** | W1 |

### AUDIT-008 — Functional admin/editor journeys not in audit automation

| Field | Value |
| --- | --- |
| **Status** | **Open** |
| **Evidence** | Production smoke is HTTP 200 + unauthenticated API checks only |
| **Impact** | User feedback ("admin X broken") not captured by current gates |
| **Remediation** | Authenticated smoke script + manual journey matrix sign-off |
| **Wave** | W1 |

### AUDIT-009 — Cron routes use optional secrets

| Field | Value |
| --- | --- |
| **Status** | **Open** |
| **Evidence** | `app/api/cron/*` — `CRON_SECRET` optional in some routes |
| **Impact** | Misconfigured prod env allows unauthenticated cron triggers |
| **Remediation** | Fail closed if secret missing in production; document Vercel cron headers |
| **Wave** | W1 |

---

## S3 — Lower (docs / hygiene)

### AUDIT-010 — `GET /api/games` is public

| Field | Value |
| --- | --- |
| **Status** | **Open (review)** |
| **Evidence** | Production smoke: 200 with game list JSON |
| **Impact** | May be intentional (game catalog); exposes internal game metadata |
| **Remediation** | Confirm product intent; if admin-only, add `requireAdminOrEditor` |
| **Wave** | W2 |

### AUDIT-011 — System outline stale vs filesystem

| Field | Value |
| --- | --- |
| **Status** | **Mitigated** |
| **Evidence** | `docs/core/amanoba_system_outline.md` Jan 2026 vs 123 routes today |
| **Fix** | `npm run audit:routes` → `docs/audit/generated/ROUTE_INVENTORY.md` |
| **Wave** | Done |

### AUDIT-012 — Production SHA not logged post-deploy for latest release

| Field | Value |
| --- | --- |
| **Status** | **Open** |
| **Evidence** | `PRODUCTION_STATUS.md` notes pending SHA for post-GDS deploy |
| **Remediation** | After deploy, log Vercel SHA + rerun `npm run audit:production-smoke` |
| **Wave** | W0 ops |

---

## Static gate evidence (2026-05-29)

| Gate | Result |
| --- | --- |
| `type-check` | Pass |
| `npm test` | Pass (32 tests) |
| `lint` | Pass |
| `ui:gds:check` | Pass |
| `build` | Pass |
| Production HTML smoke | 14/14 pass |
| Production API smoke | 9/9 pass |

See [generated/PRODUCTION_SMOKE.md](./generated/PRODUCTION_SMOKE.md).
