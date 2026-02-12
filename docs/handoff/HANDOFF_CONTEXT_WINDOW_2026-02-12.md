# Handover Snapshot — 2026-02-12

**Scope**: Documentation normalization, cross-repo doc relocation, link integrity hardening, archive reference cleanup, course-import enhancement, build stabilization, context transfer.
**Source repo**: `amanoba`
**Related repo**: `/Users/moldovancsaba/Projects/amanoba_courses`

---

## 1) What was completed in this window

### 1. Course docs relocation
- Course creation/maintenance docs were moved out of `amanoba/docs` to:
  - `/Users/moldovancsaba/Projects/amanoba_courses/process_them`

### 2. Docs structure normalization in `amanoba`
- Active docs were reorganized into domain folders:
  - `docs/core`, `docs/product`, `docs/architecture`, `docs/features`, `docs/i18n`, `docs/sso`, `docs/certification`, `docs/deployment`, `docs/quality`, `docs/status`, `docs/handoff`, `docs/seo`
- Entrypoint added: `docs/README.md`
- Canonical index updated: `docs/core/DOCS_INDEX.md`

### 3. Link repair in active docs
- Broken active-doc links were repaired.
- References to moved course docs now point to `/Users/moldovancsaba/Projects/amanoba_courses/process_them/...` where needed.

### 4. Docs link-check automation
- Added checker: `scripts/docs/check-doc-links.mjs`
- Added npm script: `docs:links:check`
- Updated `docs:check` to include links:
  - `npm run docs:refresh && node scripts/docs/check-generated-docs.mjs && npm run docs:links:check`
- Updated CI workflow name and behavior via existing `docs:check`:
  - `.github/workflows/docs-generated-check.yml` (now “Docs (generated + links)”)

### 5. Archive reference cleanup continuation
- Normalized stale references in high-value historical docs under `docs/_archive/**` to current locations.
- `docs/product/TASKLIST.md` documentation operations item #2 progressed to done based on this cleanup.
- Product-doc alignment pass completed across:
  - `docs/product/ROADMAP.md`
  - `docs/product/TASKLIST.md`
  - `docs/product/RELEASE_NOTES.md`

### 6. Course import question-mode + build stabilization
- `POST /api/admin/courses/import` now supports `questionImportMode`:
  - `add` (add missing questions only),
  - `overwrite` (replace lesson questions from package),
  - `merge` (backward-compatible default).
- Admin import UI selectors added on course editor and course list pages.
- Build-blocking issues fixed:
  - hook ordering in `components/CookieConsentBanner.tsx`,
  - achievement criteria union typing in admin achievements pages,
  - email localization locale-map typing with safe fallback handling.

---

## 2) Validation status

Executed and passing:
- `npm run docs:links:check`
- `npm run docs:check`
- `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check`
- `npm run build`

Active-doc link status:
- Broken markdown links: **0** (non-archive docs)

Archive-doc link status:
- Broken markdown links: **0** with `DOCS_CHECK_INCLUDE_ARCHIVE=1` (strict external disabled)

---

## 3) Key files changed this window

### Tooling
- `scripts/docs/check-doc-links.mjs` (new)
- `scripts/docs/_shared.ts`
- `scripts/docs/check-generated-docs.mjs`
- `scripts/docs/generate-docs-inventory.ts`
- `scripts/docs/generate-docs-canonical-map.ts`
- `scripts/docs/generate-docs-triage.ts`
- `package.json`
- `.github/workflows/docs-generated-check.yml`

### Core docs
- `docs/README.md` (new)
- `docs/core/DOCS_INDEX.md`
- `docs/core/amanoba_codex_brain_dump.md`
- `docs/core/agent_working_loop_canonical_operating_document.md`

### Product docs
- `docs/product/ROADMAP.md`
- `docs/product/TASKLIST.md`
- `docs/product/RELEASE_NOTES.md`

### Feature / build files
- `app/api/admin/courses/import/route.ts`
- `app/[locale]/admin/courses/[courseId]/page.tsx`
- `app/[locale]/admin/courses/page.tsx`
- `components/CookieConsentBanner.tsx`
- `app/[locale]/admin/achievements/[achievementId]/page.tsx`
- `app/[locale]/admin/achievements/new/page.tsx`
- `app/lib/email/email-localization.ts`

### Archive docs (normalized references)
- `docs/_archive/delivery/2026-01/2026-01-23_PRIORITY_DELIVERY_LIST.md`
- `docs/_archive/delivery/2026-01/2026-01-24_PHASE_2_COMPLETION_SUMMARY.md`
- `docs/_archive/delivery/2026-01/2026-01-28_P2_ONBOARDING_AND_EMAIL_STATUS.md`
- `docs/_archive/delivery/2026-01/2026-01-28_P2_STATUS.md`
- `docs/_archive/delivery/2026-01/2026-01_LAYOUT_AUDIT.md`
- `docs/_archive/reference/ARCHITECTURE_FIX_DELIVERY_SUMMARY.md`
- `docs/_archive/reference/FINAL_PROJECT_DELIVERY_SUMMARY.md`
- `docs/_archive/reference/QUICK_REFERENCE_CHECKLIST.md`
- `docs/_archive/reference/STATUS__2026-02-06.md`
- `docs/_archive/tasklists/DOCUMENTATION_AUDIT_JANUARY__2026-01-28.md`
- `docs/_archive/tasklists/LAYOUT_AUDIT_JANUARY__2026-01-28.md`
- `docs/_archive/tasklists/SCRUMMASTER_LESZEK_2026_HU__2026-01-31T18-53-33Z.md`
- `docs/_archive/tasklists/SPORT_SALES_NETWORK_USA_2026_EN__2026-02-03T16-00-00Z.md`

### Handover docs
- `docs/handoff/HANDOFF_CONTEXT_WINDOW_2026-02-12.md` (new)
- `docs/handoff/NEXT_WINDOW_PROMPT.md` (new)

---

## 4) Current risks / caveats

1. Many external-local path references intentionally point to `/Users/moldovancsaba/Projects/amanoba_courses/process_them/...`.
2. `docs:links:check` validates repo-local links strictly; external filesystem links are non-fatal unless strict mode is enabled.
3. Archive link integrity now passes in non-strict mode, but external filesystem portability remains unresolved until cross-repo link strategy is standardized.

---

## 5) Immediate next actions for next window

1. Decide permanent external-link strategy:
- keep local absolute links, or
- replace with a shared published source.

2. Optional hardening:
- enable strict external checks when link strategy is finalized:
  - `DOCS_CHECK_EXTERNAL=1 npm run docs:links:check`

3. Decide and standardize a portable cross-repo link strategy (machine-neutral).

4. If preparing PRs, split commits by concern:
- relocation,
- normalization,
- archive-reference cleanup,
- course import question-mode + build stabilization,
- link-check tooling,
- handover docs.

---

## 6) Command runbook

- Refresh generated docs files:
  - `npm run docs:refresh`
- Full docs verification:
  - `npm run docs:check`
- Production build verification:
  - `npm run build`
- Link-only check:
  - `npm run docs:links:check`
- Link-only check including archive:
  - `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check`
- Strict external FS links:
  - `DOCS_CHECK_EXTERNAL=1 npm run docs:links:check`
