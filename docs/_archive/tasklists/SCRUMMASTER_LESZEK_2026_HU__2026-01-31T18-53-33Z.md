# Tasklist — SCRUMMASTER_LESZEK_2026_HU — 2026-01-31T18:53:33Z

## Environment (defaults — still must be stated explicitly in the run log before DB writes)
- [x] Production DB (`.env.local`) — MongoDB Atlas, dbName=`amanoba`
- [x] 30-day parent course (default)
- [x] Free course (default) + quizzes required (default)

## Phase A — Prereqs & scope (no DB writes)
- [x] Confirm final IDs:
  - [x] `CCS_ID = SCRUMMASTER_LESZEK_2026`
  - [x] `COURSE_ID = SCRUMMASTER_LESZEK_2026_HU`
- [ ] Confirm there is no overlap/duplicate course family already in DB/repo
- [x] Confirm target is complete beginner in Hungarian

## Phase B — Course idea (artifact)
- [x] Write 1-page HU course idea (draft v1 in run log)
- [x] Decide direction: “kóstoló az agilis óceánból” + Amanoba certificate focus
- [x] Decide certification entitlement policy: **Free certificate access**
- [x] Implemented product support: final exam start works without entitlement for free/unpriced courses

## Next command
`Draft Phase C 30-day outline (Day 1–30) with enough detail for scenario-based quizzes.`

## Phase C — 30-day outline (artifact)
- [x] Draft outline v1 written in run log (Day 1–30)
- [ ] Review outline for coverage + progression (beginner-safe) and adjust

## Next command
`Review Phase C outline and confirm it, then proceed to Phase D (CCS draft: canonical JSON + CCS narrative).`

## Phase D — CCS (repo canonical)
- [x] Create `docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026.canonical.json`
- [x] Create `/Users/moldovancsaba/Projects/amanoba_courses/process_them/docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026_CCS.md`

## Next command
`Proceed to Phase E: implement a seed script for SCRUMMASTER_LESZEK_2026_HU (dry-run first), creating CCS DB record + course + 30 lessons in production dbName=amanoba.`

## Phase E — Seed script (no DB writes until `--apply`)
- [x] Added seed script: `scripts/seed-scrummaster-leszek-2026-hu.ts`
- [x] Added npm script: `npm run seed:scrummaster-leszek-2026-hu`
- [x] Dry-run completed (no DB writes): `npm run seed:scrummaster-leszek-2026-hu`
- [x] Apply completed (DB writes): `npm run seed:scrummaster-leszek-2026-hu -- --apply`
- [x] Lesson stubs created (DB writes): `npm run seed:scrummaster-leszek-2026-hu -- --apply --include-lessons`

## Next command
`Open /hu/admin/courses/SCRUMMASTER_LESZEK_2026_HU and start filling Day 1 (then run lesson quality + language audits).`

## Phase F — Lessons (Day 1…30)
- [x] Day 1 draft written in run log
- [x] Apply Day 1 content into `SCRUMMASTER_LESZEK_2026_HU_DAY_01` (backup-first script)
- [x] Run lesson audits (after Day 1 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Publish Day 1 lesson for student-facing visibility (set `isActive=true`):
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-01.ts --apply`
- [x] Generate Day 1 quiz questions (7) via quality pipeline:
  - [x] Dry-run: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course SCRUMMASTER_LESZEK_2026_HU --lesson-id SCRUMMASTER_LESZEK_2026_HU_DAY_01 --dry-run`
  - [x] Apply: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course SCRUMMASTER_LESZEK_2026_HU --lesson-id SCRUMMASTER_LESZEK_2026_HU_DAY_01`
- [x] Apply Day 2 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_02` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02.ts --apply`
- [x] Apply Day 2 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_02`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02-quiz.ts --apply`
- [x] Publish Day 2 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-02.ts --apply`
- [x] Apply Day 3 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_03` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03.ts --apply`
- [x] Apply Day 3 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_03`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03-quiz.ts --apply`
- [x] Publish Day 3 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-03.ts --apply`
- [x] Apply Day 4 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_04` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04.ts --apply`
- [x] Apply Day 4 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_04`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04-quiz.ts --apply`
- [x] Publish Day 4 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-04.ts --apply`
- [x] Apply Day 5 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_05` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05.ts --apply`
- [x] Apply Day 5 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_05`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05-quiz.ts --apply`
- [x] Publish Day 5 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-05.ts --apply`
- [x] Apply Day 6 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_06` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06.ts --apply`
- [x] Apply Day 6 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_06`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06-quiz.ts --apply`
- [x] Publish Day 6 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-06.ts --apply`
- [x] Apply Day 7 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_07` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07.ts --apply`
- [x] Apply Day 7 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_07`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07-quiz.ts --apply`
- [x] Publish Day 7 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-07.ts --apply`
- [x] Apply Day 8 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_08` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08.ts --apply`
- [x] Apply Day 8 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_08`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08-quiz.ts --apply`
- [x] Publish Day 8 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-08.ts --apply`
- [x] Apply Day 9 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_09` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09.ts --apply`
- [x] Apply Day 9 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_09`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09-quiz.ts --apply`
- [x] Publish Day 9 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-09.ts --apply`

## Next command
`Run a full verification pass: list lessons (Days 1–30 active), then (optional) start final exam as a free user to confirm entitlement is not required.`

## Phase F — Lessons (continued)
- [x] Apply Day 10 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_10` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10.ts --apply`
- [x] Apply Day 10 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_10`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10-quiz.ts --apply`
  - [x] Re-applied after fixing correct answer position imbalance (same script + new backup)
- [x] Publish Day 10 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-10.ts --apply`

- [x] Apply Day 11 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_11` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11.ts --apply`
- [x] Run lesson audits (after Day 11 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 11 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_11`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11-quiz.ts --apply`
- [x] Publish Day 11 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-11.ts --apply`

- [x] Apply Day 12 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_12` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12.ts --apply`
- [x] Run lesson audits (after Day 12 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 12 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_12`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12-quiz.ts --apply`
- [x] Publish Day 12 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-12.ts --apply`

- [x] Apply Day 13 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_13` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-13.ts --apply`
- [x] Run lesson audits (after Day 13 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 13 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_13`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-13-quiz.ts --apply`
  - [x] Re-applied after fixing correct answer position imbalance (same script + new backup)
- [x] Publish Day 13 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-13.ts --apply`

- [x] Apply Day 14 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_14` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-14.ts --apply`
- [x] Run lesson audits (after Day 14 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 14 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_14`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-14-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 14 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-14.ts --apply`

- [x] Apply Day 15 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_15` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-15.ts --apply`
- [x] Run lesson audits (after Day 15 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 15 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_15`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-15-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 15 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-15.ts --apply`

- [x] Apply Day 16 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_16` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-16.ts --apply`
- [x] Run lesson audits (after Day 16 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 16 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_16`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-16-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 16 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-16.ts --apply`

- [x] Apply Day 17 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_17` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-17.ts --apply`
- [x] Run lesson audits (after Day 17 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 17 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_17`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-17-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 17 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-17.ts --apply`

- [x] Apply Day 18 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_18` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-18.ts --apply`
- [x] Run lesson audits (after Day 18 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 18 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_18`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-18-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 18 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-18.ts --apply`

- [x] Apply Day 19 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_19` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-19.ts --apply`
- [x] Run lesson audits (after Day 19 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 19 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_19`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-19-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 19 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-19.ts --apply`

- [x] Apply Day 20 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_20` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-20.ts --apply`
- [x] Run lesson audits (after Day 20 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 20 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_20`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-20-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 20 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-20.ts --apply`

- [x] Apply Day 21 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_21` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-21.ts --apply`
- [x] Run lesson audits (after Day 21 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 21 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_21`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-21-quiz.ts --apply`
  - [x] Re-applied after balancing correct answer positions (same script + new backup)
- [x] Publish Day 21 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-21.ts --apply`

- [x] Apply Day 22 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_22` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-22.ts --apply`
- [x] Run lesson audits (after Day 22 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 22 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_22`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-22-quiz.ts --apply`
- [x] Publish Day 22 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-22.ts --apply`

- [x] Apply Day 23 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_23` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-23.ts --apply`
- [x] Run lesson audits (after Day 23 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 23 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_23`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-23-quiz.ts --apply`
- [x] Publish Day 23 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-23.ts --apply`

- [x] Apply Day 24 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_24` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-24.ts --apply`
- [x] Run lesson audits (after Day 24 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 24 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_24`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-24-quiz.ts --apply`
- [x] Publish Day 24 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-24.ts --apply`

- [x] Apply Day 25 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_25` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-25.ts --apply`
- [x] Run lesson audits (after Day 25 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 25 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_25`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-25-quiz.ts --apply`
- [x] Publish Day 25 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-25.ts --apply`

- [x] Apply Day 26 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_26` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-26.ts --apply`
- [x] Run lesson audits (after Day 26 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 26 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_26`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-26-quiz.ts --apply`
- [x] Publish Day 26 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-26.ts --apply`

- [x] Apply Day 27 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_27` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-27.ts --apply`
- [x] Run lesson audits (after Day 27 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 27 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_27`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-27-quiz.ts --apply`
- [x] Publish Day 27 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-27.ts --apply`

- [x] Apply Day 28 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_28` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-28.ts --apply`
- [x] Run lesson audits (after Day 28 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 28 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_28`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-28-quiz.ts --apply`
- [x] Publish Day 28 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-28.ts --apply`

- [x] Apply Day 29 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_29` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-29.ts --apply`
- [x] Run lesson audits (after Day 29 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 29 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_29`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-29-quiz.ts --apply`
- [x] Publish Day 29 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-29.ts --apply`

- [x] Apply Day 30 lesson content into `SCRUMMASTER_LESZEK_2026_HU_DAY_30` (backup-first script):
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-30.ts --apply`
- [x] Run lesson audits (after Day 30 is applied):
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - [x] `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
- [x] Apply Day 30 quiz questions (7, standalone, 0 recall) into `SCRUMMASTER_LESZEK_2026_HU_DAY_30`:
  - [x] `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-30-quiz.ts --apply`
- [x] Publish Day 30 lesson for student-facing visibility:
  - [x] `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-30.ts --apply`
