# Tech Audit Remediation Program

**Last updated:** 2026-05-29  
**Register:** [TECH_AUDIT_REGISTER.md](./TECH_AUDIT_REGISTER.md)  
**Board:** Create/fix issues on [Project 12](https://github.com/users/moldovancsaba/projects/12/views/1) using [GDS #81](https://github.com/sovereignsquad/general-design-system/issues/81) format.

---

## Wave W0 — Security + ops (immediate)

| ID | Work | Owner lane | Exit criteria |
| --- | --- | --- | --- |
| AUDIT-001 | ✅ Feature flags PATCH `requireAdmin` | API | Guard script pass; PATCH 403 for non-admin |
| AUDIT-002 | ✅ Leaderboard GET `requireAdmin` | API | Same |
| AUDIT-005 | ✅ CI quality-gates workflow | Infra | PR runs build/test/lint/gds |
| AUDIT-003 | ✅ Game sessions session-bound | API + games | POST start/complete rejects foreign `playerId` |
| AUDIT-004 | ✅ Referrals session-bound | API | GET/POST tied to authed player |
| AUDIT-012 | Log production deploy SHA | Ops | `PRODUCTION_STATUS.md` updated after deploy |

**Commands after W0:**

```sh
node scripts/audit/check-admin-api-guards.mjs
npm run audit:production-smoke
npm test && npm run build
```

---

## Wave W1 — Functional confidence (1–2 weeks)

| ID | Work | Exit criteria |
| --- | --- | --- |
| AUDIT-006 | Playwright setup + 8 golden paths | CI job `e2e-smoke` on PR |
| AUDIT-008 | Authenticated admin smoke (test user) | Payments + course editor save green |
| AUDIT-007 | axe checks on 4 GDS surfaces | Fail CI on critical a11y violations |
| AUDIT-009 | Cron fail-closed in production | Missing secret → 503, not open POST |

**Golden paths:**

1. Sign-in redirect + callback URL preserved  
2. `/en/courses` renders ≥1 course card (CTA clickable)  
3. `/api/practice-hub` 200 for authed user  
4. Admin `/en/admin/payments` table renders rows  
5. Admin course editor save (ContentOpsActionBar)  
6. Editor lesson save  
7. POST checkout → 401 when anonymous (already covered)  
8. `/api/payments/create-checkout` 401 anonymous (already covered)

---

## Wave W2 — Hardening + hygiene

| ID | Work |
| --- | --- |
| AUDIT-010 | Decide public vs admin-only `/api/games` |
| AUDIT-011 | Keep `audit:routes` in release checklist |
| Data integrity | Spot-check progress/payment/entitlement mismatches (Mongo read-only scripts) |

---

## Ongoing ritual

**Weekly:**

```sh
npm run audit:production-smoke
npm run ui:check:gds
```

**Each release:**

```sh
npm run audit:run
# Update TECH_AUDIT_JOURNEY_MATRIX manual rows
# Append PRODUCTION_STATUS with SHA + routes
```

**When user reports breakage:**

1. Add row to register (severity + repro)  
2. Map to journey matrix cell  
3. One GitHub issue per root cause — no umbrella tickets  

---

## Issue template reminder (GDS #81)

Each remediation issue must include: architecture, runtime flow, contracts, acceptance criteria, rollback, tests, docs, dependencies.

UI fixes: `@doneisbetter/*` only.
