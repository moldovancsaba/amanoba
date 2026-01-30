# CCS Global Audit Execution Run Log

Generated: 2026-01-28T09:44:23.548Z  
Environment: **production** (via `.env.local`)  
Scope: **All active courses** (all CCS families)  

## Safety Rollback Plan (Mandatory)

### Baseline (code)
- Baseline commit: `b0ed350c6d496712caa773ec442fda815d89c499`
- Rollback code:
  - `git reset --hard b0ed350c6d496712caa773ec442fda815d89c499`

### Backfill rollback (Course.ccsId)
- Backup file:
  - `scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json`
- Rollback (dry-run):
  - `npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json`
- Rollback (apply):
  - `npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json --apply`

### Quiz rollback (per lesson)
- Restore a lesson’s quiz from a backup written by the pipeline:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID>__<TIMESTAMP>.json`

### Verification after rollback
- Re-run master audit:
  - `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`

## Inputs / References
- Latest master audit tasklist:
  - `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-39-35-973Z.md`
- Latest master audit report:
  - `scripts/reports/ccs-global-audit__2026-01-28T09-39-35-973Z.json`

## Process State
- Current phase: **Phase 2 — Structural/Content Follow-ups (review + plan; no DB writes without explicit approval)**
- Last completed step: **Phase 2a/2b — Backfilled missing lesson days for key EN courses + backfilled CCS idea/outline**
- Next step: **Continue Phase 2: resolve remaining missing days, duplicate day lessons, then re-run quiz pipeline and lesson refinements where needed**
- Next command:
  - Review: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T16-01-46-595Z.md`
- Blockers: none (apply steps require confirmation)

## Phase 0 — Email Communications Audit (2026-01-28)

Run:
- `npx tsx scripts/audit-email-communications-language-integrity.ts`

Outputs:
- Report: `scripts/reports/email-communications-language-audit__2026-01-28T15-36-25-759Z.json`
- Tasklist: `docs/tasklists/EMAIL_COMMUNICATIONS_LANGUAGE_AUDIT__2026-01-28T15-36-25-759Z.md`

## Phase 0 — Master CCS Audit Re-run (2026-01-28)

Run:
- `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`

Outputs:
- Report: `scripts/reports/ccs-global-audit__2026-01-28T15-36-31-494Z.json`
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T15-36-31-494Z.md`

High-level totals (from report):
- coursesFailingCatalogLanguageIntegrity: 0
- lessonsFailingLanguageIntegrity: 54
- lessonsBelowQualityThreshold: 107
- lessonsWithQuizErrors: 191
- lessonsGeneratorInsufficient: 62
- missingLessonDayEntries: 138
- duplicateDayLessonGroups: 4

## Phase 2a — Backfill missing lessons (2026-01-28)

Goal: Fix courses configured as 30-day but missing Day 12–30, without overwriting existing lessons and without touching quizzes.

Applied (safe seed mode):
- `AI_30_DAY_EN` — created Day 12–30 only
  - Backups: `scripts/lesson-backups/AI_30_DAY_EN/`
  - Dry-run: `npx tsx --env-file=.env.local scripts/seed-ai-course-en.ts`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-ai-course-en.ts --apply`
- `B2B_SALES_2026_30_EN` — created Day 12–30 only
  - Backups: `scripts/lesson-backups/B2B_SALES_2026_30_EN/`
  - Dry-run: `npx tsx --env-file=.env.local scripts/seed-b2b-sales-masterclass-en.ts`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-b2b-sales-masterclass-en.ts --apply`
- `PLAYBOOK_2026_30_EN` — created Day 12–30 only
  - Backups: `scripts/lesson-backups/PLAYBOOK_2026_30_EN/`
  - Dry-run: `npx tsx --env-file=.env.local scripts/seed-playbook-design-2026-en.ts`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-playbook-design-2026-en.ts --apply`

Verification:
- `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --course AI_30_DAY_EN --min-lesson-score 70`
- `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --course B2B_SALES_2026_30_EN --min-lesson-score 70`
- `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --course PLAYBOOK_2026_30_EN --min-lesson-score 70`

## Phase 2b — Backfill CCS idea + outline (2026-01-28)

Applied:
- Dry-run: `npx tsx --env-file=.env.local scripts/backfill-ccs-idea-outline.ts`
- Apply: `npx tsx --env-file=.env.local scripts/backfill-ccs-idea-outline.ts --apply`
- Report: `scripts/reports/ccs-idea-outline-backfill__2026-01-28T15-56-21-797Z.json`
- Backup: `scripts/ccs-backups/backfill-ccs-idea-outline__2026-01-28T15-56-21-797Z.json`

Rollback:
- `npx tsx --env-file=.env.local scripts/restore-ccs-from-backup.ts --file scripts/ccs-backups/backfill-ccs-idea-outline__2026-01-28T15-56-21-797Z.json --apply`

## Phase 2 — Post-backfill master audit (2026-01-28)

Run:
- `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`

Outputs:
- Report: `scripts/reports/ccs-global-audit__2026-01-28T15-56-34-622Z.json`
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T15-56-34-622Z.md`

High-level totals (from report):
- coursesFailingCatalogLanguageIntegrity: 0
- lessonsFailingLanguageIntegrity: 54
- lessonsBelowQualityThreshold: 143
- lessonsWithQuizErrors: 248
- lessonsGeneratorInsufficient: 62
- missingLessonDayEntries: 81
- duplicateDayLessonGroups: 4

## Phase 2c — Deactivate duplicate day lessons (2026-01-28)

Applied:
- Dry-run: `npx tsx --env-file=.env.local scripts/deactivate-duplicate-day-lessons.ts --course GEO_SHOPIFY_30_EN`
- Apply: `npx tsx --env-file=.env.local scripts/deactivate-duplicate-day-lessons.ts --course GEO_SHOPIFY_30_EN --apply`
- Backups: `scripts/lesson-backups/GEO_SHOPIFY_30_EN/`

Verification (master audit):
- Report: `scripts/reports/ccs-global-audit__2026-01-28T16-01-46-595Z.json`
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T16-01-46-595Z.md`

High-level totals (from report):
- coursesFailingCatalogLanguageIntegrity: 0
- lessonsFailingLanguageIntegrity: 54
- lessonsBelowQualityThreshold: 143
- lessonsWithQuizErrors: 239
- lessonsGeneratorInsufficient: 62
- missingLessonDayEntries: 76
- duplicateDayLessonGroups: 0

## Phase 2d — Strategy A: close remaining missing-day courses (2026-01-28)

Applied (backups taken first; safe seed mode; no quiz writes):
- `SALES_PRODUCTIVITY_30_EN` Day 12–30
  - Backup: `scripts/lesson-backups/SALES_PRODUCTIVITY_30_EN/`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-en.ts --apply`
- `SALES_PRODUCTIVITY_30_HU` Day 12–30
  - Backup: `scripts/lesson-backups/SALES_PRODUCTIVITY_30_HU/`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-hu.ts --apply`
- `SALES_PRODUCTIVITY_30_RU` Day 12–30 + language integrity repair
  - Backup: `scripts/lesson-backups/SALES_PRODUCTIVITY_30_RU/`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-ru.ts --apply`
  - RU Day 1–11 cleanup: `npx tsx --env-file=.env.local scripts/fix-sales-productivity-30-ru-days-01-11-language.ts --apply`
  - RU Day 12–30 email subject/body localization: `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-ru.ts --update-existing-lessons --apply`
  - Verification: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SALES_PRODUCTIVITY_30_RU`
- `B2B_SALES_2026_30_RU` Day 12–30
  - Backup: `scripts/lesson-backups/B2B_SALES_2026_30_RU/`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-b2b-sales-2026-30-ru.ts --apply`

Verification (master audit):
- Report: `scripts/reports/ccs-global-audit__2026-01-28T19-40-47-589Z.json`
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T19-40-47-589Z.md`
- Note: `missingLessonDayEntries` is now **0**

Verification (email communications audit):
- Report: `scripts/reports/email-communications-language-audit__2026-01-28T19-45-07-446Z.json`
- Tasklist: `docs/tasklists/EMAIL_COMMUNICATIONS_LANGUAGE_AUDIT__2026-01-28T19-45-07-446Z.md`

## Phase 3 — Quality Improvement Start (2026-01-28)

### Quiz pipeline (targeted courses)

Run (per course):
- `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70 --dry-run`
- `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70`

Outputs:
- `SALES_PRODUCTIVITY_30_EN`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-20-47-876Z.json`
- `SALES_PRODUCTIVITY_30_HU`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-20-57-003Z.json`
- `SALES_PRODUCTIVITY_30_RU`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-21-06-051Z.json` (rewrite failures initially)
- `SALES_PRODUCTIVITY_30_RU` (re-run after RU template fix)
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-08-05-433Z.json` (rewrite failures cleared; deleted=77 inserted=84)
- `B2B_SALES_2026_30_RU`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-21-14-280Z.json` (rewrite failures initially)
- `B2B_SALES_2026_30_RU` (re-run after RU template fix)
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-08-26-184Z.json` (rewrite failures cleared; deleted=14 inserted=14)

Backups:
- Quizzes: `scripts/quiz-backups/`

Verification (per-course audits):
- `SALES_PRODUCTIVITY_30_EN`: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-24-574Z.md`
- `SALES_PRODUCTIVITY_30_HU`: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-29-467Z.md`
- `SALES_PRODUCTIVITY_30_RU`: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-34-611Z.md`
- `B2B_SALES_2026_30_RU`: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-40-097Z.md`

Additional verification after fixes:
- `SALES_PRODUCTIVITY_30_RU`: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-11-52-688Z.md`
- `B2B_SALES_2026_30_RU`: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-11-57-529Z.md`

### RU lesson language integrity cleanup (B2B)

Applied:
- Backup: `scripts/lesson-backups/B2B_SALES_2026_30_RU/`
- Fix: `npx tsx --env-file=.env.local scripts/fix-b2b-sales-2026-30-ru-days-01-11-language.ts --apply`
- Verification: `scripts/reports/lesson-language-integrity-tasks__2026-01-28T21-10-27-190Z.md`

### Catalog language integrity fix (AR)

Applied:
- `npx tsx --env-file=.env.local scripts/fix-productivity-2026-ar-course-description.ts --apply`
- Backup: `scripts/course-backups/course-catalog__PRODUCTIVITY_2026_AR__2026-01-28T21-14-03-978Z.json`
- Rollback: `npx tsx --env-file=.env.local scripts/restore-course-catalog-from-backup.ts --file scripts/course-backups/course-catalog__PRODUCTIVITY_2026_AR__2026-01-28T21-14-03-978Z.json --apply`

Verification (master audit):
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-14-18-091Z.md`

## Phase 3b — Global quiz pipeline re-run (2026-01-28)

Dry-run:
- `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-14-841Z.json`

Apply:
- `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-43-689Z.json`
- Backups: `scripts/quiz-backups/`
- Totals: deletedQuestions=411 insertedQuestions=558 rewrittenLessons=80 rewriteFailed=0

Post-apply master audit:
- Report: `scripts/reports/ccs-global-audit__2026-01-28T21-29-19-790Z.json`
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-29-19-790Z.md`

## Phase 4 — Lesson language integrity hard blocks cleared (2026-01-28)

Changes:
- Language integrity heuristics hardened + de-falsed (Unicode tokenization, stopword collision fixes).
  - File: `app/lib/quality/language-integrity.ts`
- Applied targeted lesson refinements/fixes across locales (TR/AR/HU/PL/PT/ID/VI + GEO Shopify HU).
  - Backups: `scripts/lesson-backups/`

Verification (master audit):
- Report: `scripts/reports/ccs-global-audit__2026-01-28T22-06-16-728Z.json`
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-06-16-728Z.md` (lessonsFailingLanguageIntegrity=0)

## Phase 5 — Quiz integrity refresh (2026-01-28)

Applied:
- Quiz pipeline apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T22-09-28-385Z.json` (deleted=53 inserted=63 rewrittenLessons=10 rewriteFailed=0)
- Backups: `scripts/quiz-backups/`

Verification (master audit):
- Report: `scripts/reports/ccs-global-audit__2026-01-28T22-09-49-438Z.json`
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-09-49-438Z.md`

## Phase 6a — DONE_BETTER_2026_EN quality lift (2026-01-28)

Applied:
- Lessons refined (CCS-driven structure + localized emails):
  - `npx tsx --env-file=.env.local scripts/refine-done-better-2026-en-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__DONE_BETTER_2026_EN__2026-01-28T22-37-34-200Z.json`
  - Backups: `scripts/lesson-backups/DONE_BETTER_2026_EN/` (applied=27)
- Quizzes regenerated for the course:
  - `scripts/reports/quiz-quality-pipeline__2026-01-28T22-37-44-719Z.json` (deleted=126 inserted=127 rewriteFailed=0)

Verification:
- Course audit: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-37-50-598Z.md`
- Master audit: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-38-04-458Z.md`

## Phase 6b — PRODUCTIVITY_2026_ID quality lift (2026-01-28)

Applied:
- Lessons refined:
  - `npx tsx --env-file=.env.local scripts/refine-productivity-2026-id-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_ID__2026-01-28T22-41-58-077Z.json`
  - Backups: `scripts/lesson-backups/PRODUCTIVITY_2026_ID/` (applied=29)
- Quizzes regenerated for the course:
  - `scripts/reports/quiz-quality-pipeline__2026-01-28T22-42-09-382Z.json` (deleted=202 inserted=202 rewriteFailed=0)

Verification:
- Lesson quality audit: `scripts/reports/lesson-quality-audit__2026-01-28T22-42-07-659Z.json`
- Lesson language audit: `scripts/reports/lesson-language-integrity-audit__2026-01-28T22-42-16-338Z.json`
- Master audit: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-42-27-438Z.md`

## Phase 6c — AI_30_DAY_EN quality lift (2026-01-28)

Applied:
- Lessons refined:
  - `npx tsx --env-file=.env.local scripts/refine-ai-30-day-en-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__AI_30_DAY_EN__2026-01-28T22-55-26-613Z.json`
  - Backups: `scripts/lesson-backups/AI_30_DAY_EN/` (applied=28)
- Quizzes regenerated for the course:
  - `scripts/reports/quiz-quality-pipeline__2026-01-28T22-55-43-641Z.json` (deleted=63 inserted=196 rewriteFailed=0)

Verification:
- Lesson quality audit: `scripts/reports/lesson-quality-audit__2026-01-28T22-55-41-946Z.json`
- Lesson language audit: `scripts/reports/lesson-language-integrity-audit__2026-01-28T22-55-49-755Z.json`

## Phase 6d — DONE_BETTER_2026_EN re-apply (quality drift fix) (2026-01-28)

Applied:
- Lessons refined (re-apply):
  - `npx tsx --env-file=.env.local scripts/refine-done-better-2026-en-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__DONE_BETTER_2026_EN__2026-01-28T22-58-00-227Z.json`
  - Backups: `scripts/lesson-backups/DONE_BETTER_2026_EN/` (applied=27)
- Quizzes refreshed for the course:
  - `scripts/reports/quiz-quality-pipeline__2026-01-28T22-58-12-182Z.json` (deleted=54 inserted=55 rewriteFailed=0)

Verification:
- Master audit: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-58-28-374Z.md`

## Phase 6e — B2B_SALES_2026_30_RU quality lift (2026-01-29)

Applied:
- Lessons refined:
  - `npx tsx --env-file=.env.local scripts/refine-b2b-sales-2026-30-ru-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__B2B_SALES_2026_30_RU__2026-01-29T06-08-19-592Z.json`
  - Backups: `scripts/lesson-backups/B2B_SALES_2026_30_RU/` (applied=27)
- Quizzes regenerated for the course:
  - `scripts/reports/quiz-quality-pipeline__2026-01-29T06-08-40-406Z.json` (deleted=56 inserted=189 rewriteFailed=0)

Verification:
- Lesson quality audit: `scripts/reports/lesson-quality-audit__2026-01-29T06-08-36-359Z.json`
- Lesson language audit: `scripts/reports/lesson-language-integrity-audit__2026-01-29T06-08-38-511Z.json`
- Master audit: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-29T06-08-58-055Z.md`
