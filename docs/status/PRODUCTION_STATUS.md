# Production Status

**Last Updated**: 2026-03-10  
**Status**: Informational snapshot (not incident-specific)

---

## Canonical Deployment Truth

- Production deployment is automated via GitHub integration.
- Shipping path is: commit -> push to `origin/main` -> automated Vercel production deploy.
- Manual Vercel CLI deploy is exception-only and should be used only when explicitly requested.

Reference:
- `docs/deployment/DEPLOYMENT.md`

---

## Current Verification Policy

After each production push:

1. Confirm latest commit SHA is deployed.
2. Verify baseline routes:
   - `/`
   - `/robots.txt`
   - `/sitemap.xml`
   - `/en/auth/signin`
3. Verify the feature area touched by the release.
4. Log completed changes in `docs/product/RELEASE_NOTES.md`.

---

## Historical Incident Reports

Detailed legacy incident writeups were intentionally removed from this active status doc to reduce confusion.

If historical debugging context is required, use:
- `docs/_archive/**`
- Git history for this file

---

## Audit Verification (2026-03-10)

Documentation/code audit verification commands and outcomes:

1. `npm run lint` — **PASS**
2. `npm test` — **FAIL** (`__tests__/smoke/courses.test.ts`: expected 200, received 500 for `/api/courses`)
3. `npm run type-check` — **PASS**
4. `npm run docs:check` — **FAIL** (generated docs files out of date: `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, `docs/core/DOCS_TRIAGE.md`)
5. `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` — **PASS** (177 files checked)
6. `npm run build` — **PASS**

Follow-up rerun (same day):
- `npm test` — **PASS** (smoke test mock chain updated)
- `npm run docs:refresh` — **PASS**
- `npm run docs:check` — **FAIL by policy** because generated docs files are modified in working tree (`DOCS_CANONICAL_MAP`, `DOCS_INVENTORY`, `DOCS_TRIAGE`) and checker requires zero diff unless those updates are committed.
