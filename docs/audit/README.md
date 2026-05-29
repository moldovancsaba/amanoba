# Tech Audit

**Program:** Deep technical audit (2026-05-29)  
**Baseline SHA:** `9163aaa` (production smoke + static gates)  
**Canonical repo:** `/Users/Shared/Projects/amanoba`

## Artifacts

| Document | Purpose |
| --- | --- |
| [TECH_AUDIT_REGISTER.md](./TECH_AUDIT_REGISTER.md) | All findings with severity, evidence, repro |
| [TECH_AUDIT_JOURNEY_MATRIX.md](./TECH_AUDIT_JOURNEY_MATRIX.md) | Journey × role pass/fail matrix |
| [TECH_AUDIT_REMEDIATION_PROGRAM.md](./TECH_AUDIT_REMEDIATION_PROGRAM.md) | Sequenced fix waves |
| [generated/ROUTE_INVENTORY.md](./generated/ROUTE_INVENTORY.md) | Auto-generated API/page list |
| [generated/PRODUCTION_SMOKE.md](./generated/PRODUCTION_SMOKE.md) | Latest production smoke output |

## Commands

```sh
npm run audit:routes              # regenerate route inventory
npm run audit:production-smoke    # production HTML + API auth smoke
npm run audit:run                 # inventory + production smoke bundle
node scripts/audit/check-admin-api-guards.mjs
```

## Scope completed (Phase 0–4 partial)

- Static gates: type-check, test, lint, ui:gds:check, build — **pass**
- Production reachability: 14 HTML routes — **pass**
- API auth smoke: 9 endpoints — **pass**
- Route inventory: **123 API**, **63 pages**
- Code review: admin API guards, cron secrets, game-session trust model
- CI: added `.github/workflows/quality-gates.yml`

## Not yet automated (Phase 2 backlog)

- Authenticated browser E2E (Playwright)
- Admin list functional tests (ResponsiveDataView filters/actions)
- Course editor save/dirty-state verification with real session
- Payment webhook + entitlement integration tests
- Multi-locale RTL functional pass (`ar`)

## Re-run after fixes

```sh
npm run audit:run
npm run audit:production-smoke
npm test
npm run build
```
