# CCS Global Audit Execution Tasklist

Generated: 2026-01-28T09:44:23.548Z  
Environment: **production** (via `.env.local`)  
Mode: **Apply allowed** (backups + rollback instructions recorded)

## Safety Rollback Plan (Mandatory)
- Code rollback: `git reset --hard b0ed350c6d496712caa773ec442fda815d89c499`
- Course backfill rollback:
  - `npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json --apply`
- Quiz rollback:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID>__<TIMESTAMP>.json`
- Verify:
  - `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`

## Baseline Audit (Before Changes)
- [x] Master audit report: `scripts/reports/ccs-global-audit__2026-01-28T09-39-35-973Z.json`
- [x] Master audit tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-39-35-973Z.md`

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
- Post-apply master audit tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-47-55-748Z.md`

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
- Tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-58-24-778Z.md`

## Phase 1c — Global Pipeline Re-run + Latest Master Audit

- [x] Global quiz pipeline dry-run (post HU/BG): `scripts/reports/quiz-quality-pipeline__2026-01-28T10-00-57-760Z.json`
- [x] Global quiz pipeline apply (post HU/BG): `scripts/reports/quiz-quality-pipeline__2026-01-28T10-01-29-544Z.json`
- [x] Latest master audit report: `scripts/reports/ccs-global-audit__2026-01-28T10-01-53-519Z.json`
- [x] Latest master audit tasklist: `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T10-01-53-519Z.md`

Remaining hard blocks (from latest master audit totals):
- lessonsFailingLanguageIntegrity: 60
- lessonsBelowQualityThreshold: 150
- lessonsGeneratorInsufficient: 15 (AR/HI/RU)
- missingLessonDayEntries: 138 (30-day courses with only Day 1–11 + one short course flagged by audit)

## Phase 2 — Structural/Content Follow-ups (Not auto-fixed by pipeline)

### Duplicate day lessons
- [ ] `GEO_SHOPIFY_30_EN` — resolve 4 duplicate day groups (decide keep/merge; deactivate extras; migrate quizzes if needed)

### Missing lesson days (courses are configured as 30-day but only have Day 1–11)
- [ ] `AI_30_DAY_EN` — create lessons Day 12–30 **or** correct `durationDays` if the course is intentionally shorter
- [ ] `B2B_SALES_2026_30_EN` — create lessons Day 12–30 **or** correct `durationDays`
- [ ] `B2B_SALES_2026_30_RU` — create lessons Day 12–30 **or** correct `durationDays`
- [ ] `PLAYBOOK_2026_30_EN` — create lessons Day 12–30 **or** correct `durationDays`
- [ ] `SALES_PRODUCTIVITY_30_EN` — create lessons Day 12–30 **or** correct `durationDays`
- [ ] `SALES_PRODUCTIVITY_30_HU` — create lessons Day 12–30 **or** correct `durationDays`
- [ ] `SALES_PRODUCTIVITY_30_RU` — create lessons Day 12–30 **or** correct `durationDays`
- [ ] `AI_30_DAY_EN_BEGINNER` (short) — confirm this short course is intended to be **selectedLessonIds-only** (no Lesson docs). If yes, adjust audits to not flag missing days for shorts.

## Next Command
`npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`
