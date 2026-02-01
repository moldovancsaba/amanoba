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
- [x] Create `docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026_CCS.md`

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
`Draft Day 11 (HU) in the run log, then apply it to SCRUMMASTER_LESZEK_2026_HU_DAY_11 via a backup-first script (keep isActive=false until lesson + quiz is ready).`

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
