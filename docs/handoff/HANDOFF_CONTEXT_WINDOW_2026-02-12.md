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

---

## 7) Delta update (same day, later window)

**Context-window status**: this handoff update was written when the active context window reached approximately **82%** usage.

### A) Lesson-quiz bug triage completed

Observed user issue:
- lesson page said `5/5` required,
- course settings were `Max wrong answers allowed = 2`, `Number of questions per lesson quiz (default) = 3`,
- quiz run still showed 5 questions and passed with 2 wrong / failed with 3 wrong.

Root cause found:
1. Seeded lesson-level `quizConfig.questionCount` values (commonly 5) still existed in DB.
2. Runtime had mixed authority (lesson-level + course-level fallback).
3. Pass/fail already used course-level `quizMaxWrongAllowed` override.

Relevant files:
- `scripts/seed-ai-30-nap-course.ts`
- `app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx`
- `app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts`
- `app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx`

### B) Hotfixes applied

1. Learner quiz runtime now prefers course default question count before lesson-level fallback.
2. Required-quiz message on day page now supports max-wrong mode wording (instead of implying fixed `count/count` pass logic).
3. Translation JSONs were normalized to use `{{count}}/{{count}}` placeholders instead of hardcoded `5/5`.
4. Course admin helper text was updated to reduce misunderstanding.

Build verification:
- `npm run build` passed after these edits.

### C) System inventory + migration-plan prep completed

User requirement:
- quiz behavior must be controlled only at **course level**:
  - number of questions per lesson quiz,
  - number of shown answers per question,
  - accepted wrong answers / pass rules,
  - no lesson-level or seed-JSON ownership of runtime behavior.

Inventory findings captured:
1. Course model already stores partial policy (`quizMaxWrongAllowed`, `defaultLessonQuizQuestionCount`).
2. Lesson model still stores authoritative behavior fields (`quizConfig.enabled/successThreshold/questionCount/poolSize/required`).
3. Runtime answer display count is hardwired to 3 via `buildThreeOptions()` pipeline.
4. Admin lesson modal still exposes lesson-level behavior controls.
5. Import/export and package docs still include lesson-level `quizConfig`.
6. Seed scripts widely set lesson-level `quizConfig`.
7. Question validators and admin APIs still enforce legacy "at least 4 options" authoring constraints in multiple places.

### D) Tasklist + next-window coordination updated

1. `docs/product/TASKLIST.md` now includes:
- **P2 — Lesson quiz governance centralization (course-level only)** with **10 actionable items** and explicit statuses.
2. `docs/handoff/NEXT_WINDOW_PROMPT.md` now prioritizes this P2 track.

### E) Next-window execution focus

1. Implement course-level canonical quiz policy object and resolver.
2. Remove lesson-level behavior authority in runtime/admin while keeping lesson question-content management.
3. Align import/export/package format and seed scripts to stop behavior ownership in `lessons[].quizConfig`.
4. Update docs (architecture/package/quality/release notes) in lockstep.

### F) Delivery package for next window handoff

1. `docs/product/TASKLIST.md`
- Added/confirmed the new P2 section: **Lesson quiz governance centralization (course-level only)** with 10 actionable items and statuses.
2. `docs/handoff/NEXT_WINDOW_PROMPT.md`
- Updated prompt priorities to continue this exact migration track, includes the ~82% context note, plus concrete next tasks mapped to TASKLIST P2 items.
3. `docs/handoff/HANDOFF_CONTEXT_WINDOW_2026-02-12.md`
- Updated with explicit delivery confirmation and package summary.
