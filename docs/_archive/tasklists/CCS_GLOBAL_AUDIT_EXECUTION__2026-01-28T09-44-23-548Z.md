/Users/moldovancsaba/Projects/amanoba/docs/_archive/tasklists/CCS_GLOBAL_AUDIT_EXECUTION__2026-01-28T09-44-23-548Z.md# CCS Global Audit Execution Tasklist

Generated: 2026-01-28T09:44:23.548Z  
Environment: **production** (via `.env.local`)  
Mode: **Apply allowed** (backups + rollback instructions recorded)

## Safety Rollback Plan (Mandatory)
- Code rollback: `git reset --hard b0ed350c6d496712caa773ec442fda815d89c499`
- Course backfill rollback:
  - `npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json --apply`
- Quiz rollback:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID>__<TIMESTAMP>.json`
- CCS rollback:
  - `npx tsx --env-file=.env.local scripts/restore-ccs-from-backup.ts --file scripts/ccs-backups/backfill-ccs-idea-outline__2026-01-28T15-56-21-797Z.json --apply`
- Verify:
  - `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`

## Baseline Audit (Before Changes)
- [x] Master audit report: `scripts/reports/ccs-global-audit__2026-01-28T09-39-35-973Z.json`
- [x] Master audit tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-39-35-973Z.md`

## Phase 0 — Communication + Catalog Integrity (Audit Enhancements)
- [x] Run code-level email communications audit (send-time HTML integrity):
  - Command: `npx tsx scripts/audit-email-communications-language-integrity.ts`
  - Report: `scripts/reports/email-communications-language-audit__2026-01-28T15-36-25-759Z.json`
  - Tasklist: `docs/_archive/tasklists/EMAIL_COMMUNICATIONS_LANGUAGE_AUDIT__2026-01-28T15-36-25-759Z.md`
- [x] Re-run master CCS audit to include course catalog language integrity (course.name/description + course.translations.*):
  - Command: `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T15-36-31-494Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T15-36-31-494Z.md`
- [x] Capture and track any failures as action items (no apply until reviewed)
  - Active tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T16-01-46-595Z.md`
  - High-level totals: lessonsFailingLanguageIntegrity=54, lessonsBelowQualityThreshold=143, lessonsWithQuizErrors=239, lessonsGeneratorInsufficient=62, missingLessonDayEntries=76, duplicateDayLessonGroups=0, coursesFailingCatalogLanguageIntegrity=0

## Phase 1 — Quiz Quality Pipeline (All Active Courses)
- [x] Dry-run complete (report paths recorded)
- [x] Apply complete (report paths + backup dirs recorded)
- [x] Post-apply master audit complete (report/tasklist paths recorded)

### Outputs (fill in as you go)
- Dry-run report (v1): `scripts/reports/quiz-quality-pipeline__2026-01-28T09-45-10-835Z.json`
- Dry-run lesson-refine tasks (v1): `scripts/reports/quiz-quality-pipeline__2026-01-28T09-45-10-835Z__lesson-refine-tasks.md`
- Dry-run rewrite-failures (v1): `scripts/reports/quiz-quality-pipeline__2026-01-28T09-45-10-835Z__rewrite-failures.md`
- Dry-run report (v2, higher generation target): `scripts/reports/quiz-quality-pipeline__2026-01-28T09-46-57-684Z.json`
- Dry-run lesson-refine tasks (v2): `scripts/reports/quiz-quality-pipeline__2026-01-28T09-46-57-684Z__lesson-refine-tasks.md`
- Dry-run rewrite-failures (v2): `scripts/reports/quiz-quality-pipeline__2026-01-28T09-46-57-684Z__rewrite-failures.md`
- Apply report:
- Apply lesson-refine tasks:
- Apply rewrite-failures:
- Post-apply master audit report:
- Post-apply master audit tasklist:

### Dry-run summary (2026-01-28T09:45:10Z)
- Courses: 20
- Lessons evaluated: 437
- Lessons needing refine: 209 (language integrity fail or lesson score < 70)
- Lessons eligible + validated (would enrich on apply): 123
- Lessons rewrite failed (generator insufficient under strict QC): 75

### Action (code improvement before apply)
- [x] Re-run dry-run with higher generator target (default raised to 40; override via `--generate-target-min <N>`)
  - New result: rewrite failures reduced from 75 → 15 (same refine-needed count: 209)

### Apply summary (2026-01-28T09:47:26Z)
- Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T09-47-26-867Z.json`
- Apply lesson-refine tasks: `scripts/reports/quiz-quality-pipeline__2026-01-28T09-47-26-867Z__lesson-refine-tasks.md`
- Apply rewrite-failures: `scripts/reports/quiz-quality-pipeline__2026-01-28T09-47-26-867Z__rewrite-failures.md`
- Backups: `scripts/quiz-backups/`
- Totals: deleted=927 inserted=1042 rewritten=183 refine-needed=209 rewrite-failed=15

### Post-apply master audit (2026-01-28T09:47:55Z)
- Post-apply master audit report: `scripts/reports/ccs-global-audit__2026-01-28T09-47-55-748Z.json`
- Post-apply master audit tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-47-55-748Z.md`

#### Post-apply deltas (high level)
- lessonsWithQuizErrors: 398 → 215
- invalidQuestions: 2309 → 1382
- duplicateQuestionSets: 237 → 121
- lessonsGeneratorInsufficient: 52 → 15

## Phase 1b — Lesson Refinement + Re-run Pipeline (Productivity HU/BG)

### PRODUCTIVITY_2026_HU
- [x] Lesson refine dry-run: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_HU__2026-01-28T09-51-57-402Z.json`
- [x] Lesson refine apply: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_HU__2026-01-28T09-52-09-476Z.json` (backups: `scripts/lesson-backups/PRODUCTIVITY_2026_HU/`)
- [x] Quiz pipeline dry-run: `scripts/reports/quiz-quality-pipeline__2026-01-28T09-52-20-236Z.json`
- [x] Quiz pipeline apply: `scripts/reports/quiz-quality-pipeline__2026-01-28T09-52-29-650Z.json`

### PRODUCTIVITY_2026_BG
- [x] Lesson refine dry-run: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_BG__2026-01-28T09-57-42-802Z.json`
- [x] Lesson refine apply: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_BG__2026-01-28T09-57-55-255Z.json` (backups: `scripts/lesson-backups/PRODUCTIVITY_2026_BG/`)
- [x] Quiz pipeline dry-run: `scripts/reports/quiz-quality-pipeline__2026-01-28T09-58-03-710Z.json`
- [x] Quiz pipeline apply: `scripts/reports/quiz-quality-pipeline__2026-01-28T09-58-14-449Z.json`

### Master audit after HU/BG refinement (2026-01-28T09:58:24Z)
- Report: `scripts/reports/ccs-global-audit__2026-01-28T09-58-24-778Z.json`
- Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-58-24-778Z.md`

## Phase 1c — Global Pipeline Re-run + Latest Master Audit

- [x] Global quiz pipeline dry-run (post HU/BG): `scripts/reports/quiz-quality-pipeline__2026-01-28T10-00-57-760Z.json`
- [x] Global quiz pipeline apply (post HU/BG): `scripts/reports/quiz-quality-pipeline__2026-01-28T10-01-29-544Z.json`
- [x] Latest master audit report: `scripts/reports/ccs-global-audit__2026-01-28T10-01-53-519Z.json`
- [x] Latest master audit tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T10-01-53-519Z.md`

Remaining hard blocks (from master audit totals: 2026-01-28T16:01:46Z):
- coursesFailingCatalogLanguageIntegrity: 0
- lessonsFailingLanguageIntegrity: 54
- lessonsBelowQualityThreshold: 143
- lessonsWithQuizErrors: 239
- lessonsGeneratorInsufficient: 62
- missingLessonDayEntries: 76
- duplicateDayLessonGroups: 0

## Critical Audit Fix (2026-01-28)
- [x] Fixed Language Integrity detection to catch **Unicode Latin** leakage (e.g., Hungarian words like “Tanulási”, “Termelékenység”) inside AR/HI/BG/RU lessons/emails.
  - Implementation: `scripts/language-integrity.ts`
  - Quiz validator alignment: `scripts/question-quality-validator.ts`
- [x] English injection is now a **hard error** for all non‑EN languages (previously warning-only for some Latin-script languages).

## Phase 2 — Structural/Content Follow-ups (Not auto-fixed by pipeline)

### Phase 2a — Backfill missing lessons (safe seed mode; no quiz writes)
- [x] `AI_30_DAY_EN` — backfilled Day 12–30 (kept existing Day 1–11; quizzes unchanged)
  - Backup: `scripts/lesson-backups/AI_30_DAY_EN/`
  - Dry-run: `npx tsx --env-file=.env.local scripts/seed-ai-course-en.ts`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-ai-course-en.ts --apply`
- [x] `B2B_SALES_2026_30_EN` — backfilled Day 12–30 (kept existing Day 1–11; quizzes unchanged)
  - Backup: `scripts/lesson-backups/B2B_SALES_2026_30_EN/`
  - Dry-run: `npx tsx --env-file=.env.local scripts/seed-b2b-sales-masterclass-en.ts`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-b2b-sales-masterclass-en.ts --apply`
- [x] `PLAYBOOK_2026_30_EN` — backfilled Day 12–30 (kept existing Day 1–11; quizzes unchanged)
  - Backup: `scripts/lesson-backups/PLAYBOOK_2026_30_EN/`
  - Dry-run: `npx tsx --env-file=.env.local scripts/seed-playbook-design-2026-en.ts`
  - Apply: `npx tsx --env-file=.env.local scripts/seed-playbook-design-2026-en.ts --apply`

### Strategy A (EN-first, then localize) — Remaining missing-day courses
- Next: finish `SALES_PRODUCTIVITY_30_EN` Day 12–30, then localize `SALES_PRODUCTIVITY_30_HU` and `SALES_PRODUCTIVITY_30_RU`.
- Next: localize `B2B_SALES_2026_30_RU` Day 12–30 from the completed `B2B_SALES_2026_30_EN`.

### Phase 2b — Backfill CCS idea + outline (canonical workflow prerequisites)
- [x] Backfilled `CCS.idea` and `CCS.outline` from canonical course + lessons (where available)
  - Dry-run: `npx tsx --env-file=.env.local scripts/backfill-ccs-idea-outline.ts`
  - Apply: `npx tsx --env-file=.env.local scripts/backfill-ccs-idea-outline.ts --apply`
  - Report: `scripts/reports/ccs-idea-outline-backfill__2026-01-28T15-56-21-797Z.json`
  - Backup: `scripts/ccs-backups/backfill-ccs-idea-outline__2026-01-28T15-56-21-797Z.json`

### Duplicate day lessons
- [x] `GEO_SHOPIFY_30_EN` — deactivated duplicate day lessons (kept canonical `*_DAY_XX` padded ids)
  - Backup: `scripts/lesson-backups/GEO_SHOPIFY_30_EN/`
  - Dry-run: `npx tsx --env-file=.env.local scripts/deactivate-duplicate-day-lessons.ts --course GEO_SHOPIFY_30_EN`
  - Apply: `npx tsx --env-file=.env.local scripts/deactivate-duplicate-day-lessons.ts --course GEO_SHOPIFY_30_EN --apply`

### Missing lesson days (courses are configured as 30-day but only have Day 1–11)
- [x] `AI_30_DAY_EN` — fixed (Day 12–30 created)
- [x] `B2B_SALES_2026_30_EN` — fixed (Day 12–30 created)
- [x] `B2B_SALES_2026_30_RU` — fixed (Day 12–30 created)
  - Backup: `scripts/lesson-backups/B2B_SALES_2026_30_RU/`
  - Seed (dry-run): `npx tsx --env-file=.env.local scripts/seed-b2b-sales-2026-30-ru.ts`
  - Seed (apply): `npx tsx --env-file=.env.local scripts/seed-b2b-sales-2026-30-ru.ts --apply`
- [x] `PLAYBOOK_2026_30_EN` — fixed (Day 12–30 created)
- [x] `SALES_PRODUCTIVITY_30_EN` — fixed (Day 12–30 created)
  - Backup: `scripts/lesson-backups/SALES_PRODUCTIVITY_30_EN/`
  - Seed (dry-run): `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-en.ts`
  - Seed (apply): `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-en.ts --apply`
- [x] `SALES_PRODUCTIVITY_30_HU` — fixed (Day 12–30 created)
  - Backup: `scripts/lesson-backups/SALES_PRODUCTIVITY_30_HU/`
  - Seed (dry-run): `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-hu.ts`
  - Seed (apply): `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-hu.ts --apply`
- [x] `SALES_PRODUCTIVITY_30_RU` — fixed (Day 12–30 created) + language integrity repaired for Day 1–30
  - Backup: `scripts/lesson-backups/SALES_PRODUCTIVITY_30_RU/`
  - Seed (apply): `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-ru.ts --apply`
  - RU Day 1–11 cleanup (apply): `npx tsx --env-file=.env.local scripts/fix-sales-productivity-30-ru-days-01-11-language.ts --apply`
  - RU Day 12–30 email subject/body localization (apply): `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30-ru.ts --update-existing-lessons --apply`
  - Verification (language integrity): `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SALES_PRODUCTIVITY_30_RU`

### Verification — latest audits (2026-01-28)
- [x] Master CCS audit (missingLessonDayEntries now 0):
  - Command: `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T19-40-47-589Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T19-40-47-589Z.md`
- [x] Email communications language audit (all transactional templates now pass):
  - Command: `npx tsx scripts/audit-email-communications-language-integrity.ts`
  - Report: `scripts/reports/email-communications-language-audit__2026-01-28T19-45-07-446Z.json`
  - Tasklist: `docs/_archive/tasklists/EMAIL_COMMUNICATIONS_LANGUAGE_AUDIT__2026-01-28T19-45-07-446Z.md`

## Phase 3 — Quality Improvement Start (Quizzes + Lesson Refinement)

Goal: Remove quiz errors + raise all lessons to minimum quality score.

### Phase 3a — Quiz Quality Pipeline (targeted courses first)

Applied:
- `SALES_PRODUCTIVITY_30_EN`
  - Dry-run report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-19-49-409Z.json`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-20-47-876Z.json`
  - Apply summary: insertedQuestions=49, rewrittenLessons=7, rewriteFailed=0
- `SALES_PRODUCTIVITY_30_HU`
  - Dry-run report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-19-58-158Z.json`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-20-57-003Z.json`
  - Apply summary: insertedQuestions=7, rewrittenLessons=1, rewriteFailed=0
- `SALES_PRODUCTIVITY_30_RU`
  - Dry-run report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-20-06-086Z.json`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-21-06-051Z.json`
  - Status: rewriteFailed=12 (generator produced <7 valid questions under strict QC; requires generator/prompt improvements)
- `B2B_SALES_2026_30_RU`
  - Dry-run report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-20-14-996Z.json`
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T20-21-14-280Z.json`
  - Status: rewriteFailed=2 (requires generator/prompt improvements + lesson cleanup for long Latin segments/URLs in Day 1–11)

Backups:
- Quizzes: `scripts/quiz-backups/` (per-lesson JSON backups written by the pipeline during apply)

### Phase 3c — RU generator fix + re-run (unblocked strict QC)

Problem:
- RU quiz rewrites were failing under strict QC due to template language leakage (long Latin segments like “throughput”) and low validity rate.

Fix:
- Updated RU templates in `scripts/content-based-question-generator.ts` to be fully Cyrillic (no long Latin segments) and more “standalone + specific” under the validator.

Re-run (applied):
- `SALES_PRODUCTIVITY_30_RU`
  - Dry-run report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-07-53-743Z.json` (rewriteFailed=0)
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-08-05-433Z.json` (deleted=77 inserted=84)
- `B2B_SALES_2026_30_RU`
  - Dry-run report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-08-17-468Z.json` (rewriteFailed=0)
  - Apply report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-08-26-184Z.json` (deleted=14 inserted=14)

### Phase 3d — RU lesson language integrity cleanup (B2B)

Applied:
- Backup: `scripts/lesson-backups/B2B_SALES_2026_30_RU/`
- Fix script (Day 1–11): `npx tsx --env-file=.env.local scripts/fix-b2b-sales-2026-30-ru-days-01-11-language.ts --apply`
- Verification: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course B2B_SALES_2026_30_RU`
  - Tasks output: `scripts/reports/lesson-language-integrity-tasks__2026-01-28T21-10-27-190Z.md`

### Phase 3e — Catalog language integrity (AR) fix

Applied:
- `PRODUCTIVITY_2026_AR` description: removed Latin terms (“GTD”, “Kanban”) by Arabic transliteration.
  - Apply: `npx tsx --env-file=.env.local scripts/fix-productivity-2026-ar-course-description.ts --apply`
  - Backup: `scripts/course-backups/course-catalog__PRODUCTIVITY_2026_AR__2026-01-28T21-14-03-978Z.json`
  - Rollback: `npx tsx --env-file=.env.local scripts/restore-course-catalog-from-backup.ts --file scripts/course-backups/course-catalog__PRODUCTIVITY_2026_AR__2026-01-28T21-14-03-978Z.json --apply`

### Phase 3b — Re-audit (targeted courses)
- `SALES_PRODUCTIVITY_30_EN` audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T20-21-24-574Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-24-574Z.md`
- `SALES_PRODUCTIVITY_30_HU` audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T20-21-29-467Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-29-467Z.md`
- `SALES_PRODUCTIVITY_30_RU` audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T20-21-34-611Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-34-611Z.md`
- `B2B_SALES_2026_30_RU` audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T20-21-40-097Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T20-21-40-097Z.md`

Re-audit after RU fixes:
- `SALES_PRODUCTIVITY_30_RU` audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T21-11-52-688Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-11-52-688Z.md`
- `B2B_SALES_2026_30_RU` audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T21-11-57-529Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-11-57-529Z.md`
- Latest master audit (catalog language integrity now 0):
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T21-14-18-091Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-14-18-091Z.md`

### Phase 3f — Global quiz pipeline re-run (after AR/HI template fix)

Change:
- Added localized templates for `ar` + improved `hi` templates to eliminate long Latin leakage and disallowed lesson-referential phrasing under strict QC.
  - File: `scripts/content-based-question-generator.ts`

Dry-run:
- Command: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70 --dry-run`
- Report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-14-841Z.json`
- Lesson refine tasks: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-14-841Z__lesson-refine-tasks.md`
- Rewrite failures: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-14-841Z__rewrite-failures.md` (rewriteFailed=0)

Apply:
- Command: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70`
- Report: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-43-689Z.json`
- Lesson refine tasks: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-43-689Z__lesson-refine-tasks.md`
- Rewrite failures: `scripts/reports/quiz-quality-pipeline__2026-01-28T21-28-43-689Z__rewrite-failures.md` (rewriteFailed=0)
- Backups: `scripts/quiz-backups/`
- Apply summary: deletedQuestions=411, insertedQuestions=558, rewrittenLessons=80

Post-apply master audit:
- Report: `scripts/reports/ccs-global-audit__2026-01-28T21-29-19-790Z.json`
- Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-29-19-790Z.md`
- High-level totals (post-apply):
  - lessonsWithQuizErrors: 243
  - invalidQuestions: 961
  - lessonsGeneratorInsufficient: 0

## Next Command
`npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`

---

## Phase 4 — Lesson language integrity hard blocks (all languages)

Goal: eliminate mixed-language lesson/email leaks (e.g. HU/AR/TR/PL/PT/ID/VI) so send-time email gates and quiz generation can run safely.

### Phase 4a — Language integrity heuristic fixes (to avoid false positives)

Change:
- Updated tokenizer + stopword heuristics so Latin-script locales with diacritics (PL/HU/etc) don’t get mis-tokenized and falsely flagged.
  - File: `app/lib/quality/language-integrity.ts`
  - Changes:
    - Tokenization now keeps Unicode letters (`\p{L}`) instead of ASCII-only.
    - Removed English stopword `"a"` (high-collision across locales).
    - HU path: exclude overlaps (`a`, `be`, `is`) from stopword matching to reduce false positives.

### Phase 4b — Fix remaining lesson language integrity failures (apply + backups)

Applied (with backups):
- `PRODUCTIVITY_2026_TR` (TR) — refined days 4–30 (language integrity + localized procedure steps)
  - Apply: `npx tsx --env-file=.env.local scripts/refine-productivity-2026-tr-lessons.ts --from-day 4 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_TR__2026-01-28T21-39-53-522Z.json`
  - Backups: `scripts/lesson-backups/PRODUCTIVITY_2026_TR/` (applied=21)
  - Verification: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course PRODUCTIVITY_2026_TR` (failed=0)

- `PRODUCTIVITY_2026_AR` (AR) — refined days 1–7 (removes Latin leakage + fixes email localization)
  - Apply: `npx tsx --env-file=.env.local scripts/refine-productivity-2026-ar-lessons.ts --from-day 1 --to-day 7 --apply`
  - Report: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_AR__2026-01-28T21-40-24-733Z.json`
  - Backups: `scripts/lesson-backups/PRODUCTIVITY_2026_AR/` (applied=5)
  - Verification: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course PRODUCTIVITY_2026_AR` (failed=0)

- `PRODUCTIVITY_2026_HU` (HU) — refined days 4, 7, 29, 30 (removes mixed EN fragments inside HU sentences)
  - Apply (day 4–7): `npx tsx --env-file=.env.local scripts/refine-productivity-2026-hu-lessons.ts --from-day 4 --to-day 7 --apply`
  - Report (day 4–7): `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_HU__2026-01-28T21-43-21-012Z.json`
  - Apply (day 29–30): `npx tsx --env-file=.env.local scripts/refine-productivity-2026-hu-lessons.ts --from-day 29 --to-day 30 --apply`
  - Report (day 29–30): `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_HU__2026-01-28T22-05-59-429Z.json`
  - Backups: `scripts/lesson-backups/PRODUCTIVITY_2026_HU/` (applied=4 total in this phase)
  - Verification: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course PRODUCTIVITY_2026_HU` (failed=0)

- `GEO_SHOPIFY_30` (HU) — replaced “Review/review” starters that trip HU gate (“Értékelés”)
  - Apply: `npx tsx --env-file=.env.local scripts/fix-geo-shopify-30-hu-review-terms.ts --apply`
  - Backups: `scripts/lesson-backups/GEO_SHOPIFY_30/` (applied=2)
  - Verification: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course GEO_SHOPIFY_30` (failed=0)

- `PRODUCTIVITY_2026_PL`, `PRODUCTIVITY_2026_PT`, `PRODUCTIVITY_2026_ID`, `PRODUCTIVITY_2026_VI` — spot fixes for remaining integrity failures
  - Apply: `npx tsx --env-file=.env.local scripts/fix-productivity-2026-language-integrity-spot-fixes.ts --apply`
  - Backups: `scripts/lesson-backups/<COURSE_ID>/` (applied=7)
  - Verification: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course <COURSE_ID>` (failed=0 for each)

### Phase 4c — Master re-audit (verification)

Latest master audit:
- Report: `scripts/reports/ccs-global-audit__2026-01-28T22-06-16-728Z.json`
- Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-06-16-728Z.md`
- Result: `lessonsFailingLanguageIntegrity: 0`

---

## Phase 5 — Quiz integrity refresh (post language-fix)

Rationale: after lesson/email language-integrity fixes, regenerate/clean quizzes where strict QC previously rejected questions.

### Phase 5a — Global quiz quality pipeline re-run

Dry-run:
- Report: `scripts/reports/quiz-quality-pipeline__2026-01-28T22-08-00-333Z.json`

Apply:
- Command: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70`
- Report: `scripts/reports/quiz-quality-pipeline__2026-01-28T22-09-28-385Z.json`
- Backups: `scripts/quiz-backups/`
- Totals: questionsDeleted=53, questionsInserted=63, lessonsRewritten=10, rewriteFailed=0

### Phase 5b — Master re-audit (post-quiz refresh)

Latest master audit:
- Report: `scripts/reports/ccs-global-audit__2026-01-28T22-09-49-438Z.json`
- Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-09-49-438Z.md`
- High-level totals:
  - lessonsFailingLanguageIntegrity: 0
  - lessonsWithQuizErrors: 235
  - invalidQuestions: 870

---

## Phase 6 — Next hard block: lesson quality (min score 70)

Current blocker:
- `lessonsBelowQualityThreshold: 152` (these lessons cannot reliably support strict quiz generation: 0 recall, >=7 valid, >=5 application).

### Phase 6a — DONE_BETTER_2026_EN quality lift (apply + quizzes)

Applied:
- Lesson refiner (CCS-driven structure: definitions + procedure + example + checklist + metrics):
  - Apply: `npx tsx --env-file=.env.local scripts/refine-done-better-2026-en-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__DONE_BETTER_2026_EN__2026-01-28T22-37-34-200Z.json`
  - Backups: `scripts/lesson-backups/DONE_BETTER_2026_EN/` (applied=27)
- Course verification:
  - Lesson quality audit: `scripts/reports/lesson-quality-audit__2026-01-28T22-37-42-403Z.json` (belowThreshold=0)
  - Course audit: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-37-50-598Z.md` (all zeros)
- Quiz regeneration for the course:
  - Apply: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course DONE_BETTER_2026_EN --min-lesson-score 70`
  - Report: `scripts/reports/quiz-quality-pipeline__2026-01-28T22-37-44-719Z.json` (deleted=126 inserted=127 rewriteFailed=0)

Global impact (post Phase 6a):
- Latest master audit: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-38-04-458Z.md`
  - `lessonsBelowQualityThreshold`: 209
  - `lessonsWithQuizErrors`: 209
  - `invalidQuestions`: 744

### Phase 6b — PRODUCTIVITY_2026_ID quality lift (apply + quizzes)

Applied:
- Lesson refiner (ID templates + CCS procedure alignment; definitions + steps + examples + metrics; localized lesson emails):
  - Apply: `npx tsx --env-file=.env.local scripts/refine-productivity-2026-id-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__PRODUCTIVITY_2026_ID__2026-01-28T22-41-58-077Z.json`
  - Backups: `scripts/lesson-backups/PRODUCTIVITY_2026_ID/` (applied=29)
- Verification:
  - Lesson quality audit: `scripts/reports/lesson-quality-audit__2026-01-28T22-42-07-659Z.json` (belowThreshold=0)
  - Lesson language audit: `scripts/reports/lesson-language-integrity-audit__2026-01-28T22-42-16-338Z.json` (failed=0)
- Quiz regeneration for the course:
  - Apply: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course PRODUCTIVITY_2026_ID --min-lesson-score 70`
  - Report: `scripts/reports/quiz-quality-pipeline__2026-01-28T22-42-09-382Z.json` (deleted=202 inserted=202 rewriteFailed=0)

Global impact (post Phase 6b):
- Latest master audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T22-42-27-438Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-42-27-438Z.md`
  - Totals:
    - `lessonsBelowQualityThreshold`: 180
    - `lessonsWithQuizErrors`: 180
    - `invalidQuestions`: 542

### Phase 6c — AI_30_DAY_EN quality lift (apply + quizzes)

Applied:
- Lesson refiner (EN day plans: definitions + workflow + good/bad + checklist + metrics; lesson emails updated):
  - Apply: `npx tsx --env-file=.env.local scripts/refine-ai-30-day-en-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__AI_30_DAY_EN__2026-01-28T22-55-26-613Z.json`
  - Backups: `scripts/lesson-backups/AI_30_DAY_EN/` (applied=28)
- Verification:
  - Lesson quality audit: `scripts/reports/lesson-quality-audit__2026-01-28T22-55-41-946Z.json` (belowThreshold=0)
  - Lesson language audit: `scripts/reports/lesson-language-integrity-audit__2026-01-28T22-55-49-755Z.json` (failed=0)
- Quiz regeneration for the course:
  - Apply: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course AI_30_DAY_EN --min-lesson-score 70`
  - Report: `scripts/reports/quiz-quality-pipeline__2026-01-28T22-55-43-641Z.json` (deleted=63 inserted=196 rewriteFailed=0)

### Phase 6d — DONE_BETTER_2026_EN re-apply (quality drift fix)

Observation:
- DONE_BETTER lesson content drifted back below threshold (detected in master audit), so we re-applied the refiner.

Applied:
- Re-apply: `npx tsx --env-file=.env.local scripts/refine-done-better-2026-en-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__DONE_BETTER_2026_EN__2026-01-28T22-58-00-227Z.json`
  - Backups: `scripts/lesson-backups/DONE_BETTER_2026_EN/` (applied=27)
- Quiz refresh:
  - `scripts/reports/quiz-quality-pipeline__2026-01-28T22-58-12-182Z.json` (deleted=54 inserted=55)

Global impact (post Phase 6d):
- Latest master audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-28T22-58-28-374Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T22-58-28-374Z.md`
  - Totals:
    - `lessonsBelowQualityThreshold`: 152
    - `lessonsWithQuizErrors`: 152
    - `invalidQuestions`: 479

Top offender courses (count of lessons below threshold; from `scripts/reports/ccs-global-audit__2026-01-28T22-58-28-374Z.json`):
- `B2B_SALES_2026_30_RU`: 27
- `PRODUCTIVITY_2026_PT`: 19
- `PRODUCTIVITY_2026_VI`: 19
- `PRODUCTIVITY_2026_PL`: 18
- `SALES_PRODUCTIVITY_30_HU`: 18
- `SALES_PRODUCTIVITY_30_RU`: 18
- `PLAYBOOK_2026_30_EN`: 16
- `SALES_PRODUCTIVITY_30_EN`: 13
- `GEO_SHOPIFY_30_EN`: 3
- `B2B_SALES_2026_30_EN`: 1

### Phase 6e — B2B_SALES_2026_30_RU quality lift (apply + quizzes)

Applied:
- Lesson refiner (RU templates: definitions + steps + good/bad + checklist + metrics; lesson emails updated):
  - Apply: `npx tsx --env-file=.env.local scripts/refine-b2b-sales-2026-30-ru-lessons.ts --from-day 1 --to-day 30 --apply`
  - Report: `scripts/reports/lesson-refine-preview__B2B_SALES_2026_30_RU__2026-01-29T06-08-19-592Z.json`
  - Backups: `scripts/lesson-backups/B2B_SALES_2026_30_RU/` (applied=27)
- Verification:
  - Lesson quality audit: `scripts/reports/lesson-quality-audit__2026-01-29T06-08-36-359Z.json` (belowThreshold=0)
  - Lesson language audit: `scripts/reports/lesson-language-integrity-audit__2026-01-29T06-08-38-511Z.json` (failed=0)
- Quiz regeneration for the course:
  - Apply: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course B2B_SALES_2026_30_RU --min-lesson-score 70`
  - Report: `scripts/reports/quiz-quality-pipeline__2026-01-29T06-08-40-406Z.json` (deleted=56 inserted=189 rewriteFailed=0)

Global impact (post Phase 6e):
- Latest master audit:
  - Report: `scripts/reports/ccs-global-audit__2026-01-29T06-08-58-055Z.json`
  - Tasklist: `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-29T06-08-58-055Z.md`
  - Totals:
    - `lessonsFailingLanguageIntegrity`: 0
    - `lessonsBelowQualityThreshold`: 125
    - `lessonsWithQuizErrors`: 125
    - `invalidQuestions`: 423

Next top targets (by low-quality count):
- `PRODUCTIVITY_2026_PT`: 19
- `PRODUCTIVITY_2026_VI`: 19
- `PRODUCTIVITY_2026_PL`: 18
- `SALES_PRODUCTIVITY_30_HU`: 18
- `SALES_PRODUCTIVITY_30_RU`: 18

Recommended approach (next execution batch):
- Add/refine per-locale “lesson refiner” scripts for `PRODUCTIVITY_2026_PT`, `PRODUCTIVITY_2026_VI`, `PRODUCTIVITY_2026_PL` (CCS-driven; enforce definitions/examples/metrics; regenerate localized emails).
- For EN courses with many weak lessons (`PLAYBOOK_2026_30_EN`, `SALES_PRODUCTIVITY_30_EN`): implement dedicated refiners or seed “update existing lessons” mode to expand content.
- For RU sales courses: continue RU lesson quality enhancement + rerun quiz pipeline afterward.
