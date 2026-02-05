# Quiz QA TODO (Golden Standard) — 2026-01-31

This is the execution tasklist to reach the **minimum quiz pool** requirements across the system and to enforce the **gold-standard question type**.

SSOT (rules):
- `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` (gold-standard canonical example + rule breakdown)
- `docs/COURSE_BUILDING_RULES.md` (“Gold standard (only acceptable form)” + hard gates)

Operating docs (workflow + logging):
- `docs/QUIZ_ITEM_QA_HANDOVER.md`
- Run log (newest-first): `docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md`
- Cursor/state SSOT: `.state/quiz_item_qa_state.json`

---

## Definitions (so counts are unambiguous)

- **Lesson quiz pool** = active course-specific questions for `(courseId, lessonId)` where `isActive: true` and `isCourseSpecific: true`.
- **Minimum required per lesson** = **7** questions (no carry-over credit from lessons that have >7).
- **Checked (QA)** = a question ID whose **latest** entry in `docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md` exists.
- **Passed (QA)** = latest entry shows `Violations: 0`.
- **Failing (QA)** = latest entry shows `Violations > 0` (manual rewrite may be required).

---

## Target

- Ensure every **active lesson** has at least **7** active course-specific questions.
- Ensure every **checked** question passes golden checks (`Violations: 0`).
- Ensure every active course-specific question is **checked** (has a latest entry in NEW2OLD).

---

## Current snapshot (latest audit — 2026-01-31T16:06:43Z)

- Active courses: **25**
- Active lessons: **720**
- **Minimum required (at least)**: 720 × 7 = **5040**
- Missing-to-minimum:
  - Lessons below 7: **0**
  - Questions missing (Σ max(0, 7 - poolSize)): **0**
- QA status (from NEW2OLD, latest entry per questionId):
  - Checked total: **6845**
  - Checked and passed: **6845**
  - Checked but failing (latest): **0**
  - Questions left to check: **0**

Recompute at any time using:
```bash
npx tsx --env-file=.env.local scripts/quiz-item-qa/audit-quiz-coverage.ts
```

---

## ✅ DONE — Eliminate missing questions (0 lessons, 0 questions)

Goal achieved: `questionsMissing = 0` and `lessonsBelowMin = 0` (see snapshot above).

1) Generate a fresh missing-lessons list (don’t rely on stale counts).
2) For each affected lesson (course-by-course):
   - **Do not invent content**: if lesson content is too weak, refine the lesson first (pipeline gate).
   - Ensure created questions satisfy:
     - standalone, grounded, scenario-based
     - concrete deliverable/outcome
     - concrete distractors (no generic filler)
     - minimum lengths (question ≥ 40 chars; options ≥ 25 chars)
     - quiz mix: **0 recall**, **≥5 application**, **≥2 critical-thinking recommended**

Recommended workflow (safer, course-by-course):
```bash
# Dry-run first to see refine tasks + failures
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70 --dry-run

# Apply to that course (writes to DB, creates backups under scripts/quiz-backups/)
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70
```

Acceptance criteria met:
- Every active lesson has `>= 7` active course-specific questions.
- Re-run `audit-quiz-coverage.ts` and confirm `questionsMissing = 0`.

---

## TODO 2 — Fix checked-but-failing (0)

Goal: `checkedButFailingLatest = 0`.

1) Run the auto-repair helper against “failing latest” IDs (dry-run first):
```bash
npx tsx --env-file=.env.local scripts/quiz-item-qa/repair-failing-latest.ts --limit 250 --dry-run true --attempts 3
```

2) Apply live (writes NEW2OLD, and may patch DB when safe):
```bash
npx tsx --env-file=.env.local scripts/quiz-item-qa/repair-failing-latest.ts --limit 250 --dry-run false --attempts 3
```

3) For any remaining failures (no autopatch / still failing), do manual per-item repair:
```bash
# Inspect full question + all 4 options
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts evaluate:item --id <ID> --json true

# If safe, apply evaluator autopatch
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts apply:update --id <ID> --from-last-eval true

# Always record the latest status to NEW2OLD (use cursor-stable fields when DB write changed updatedAt)
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts handover:record --id <ID> --agent codex-qa \
  --cursor-updated-at <CURSOR_UPDATED_AT> --cursor-item-id <CURSOR_ITEM_ID>
```

Acceptance criteria:
- Latest NEW2OLD entry for every previously failing ID is `Violations: 0`.
- Re-run `audit-quiz-coverage.ts` and confirm `checkedButFailingLatest = 0`.

---

## TODO 3 — Check remaining questions (0)

Goal: `toCheck = 0`.

Batch mode (fast, logs to NEW2OLD; applies safe autopatches; default is **skip ids already logged in NEW2OLD**):
```bash
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts loop:run --items 200
```

Manual review mode (1 item at a time, human check opportunity):
Follow `docs/QUIZ_ITEM_QA_HANDOVER.md#human-check-loop-1-item-at-a-time`.

Acceptance criteria:
- Re-run `audit-quiz-coverage.ts` and confirm `toCheck = 0`.

---

## Safety Rollback Plan (Mandatory)

Git rollback:
- Baseline commit: `b74d2db`
- Roll back: `git stash push -u -m "wip"` then `git reset --hard b74d2db`
- Verify: `npm run type-check` and rerun one QA command:
  - `npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts pick:next`

DB rollback (per-lesson quiz restore):
- Every pipeline apply writes backups under `scripts/quiz-backups/<COURSE_ID>/`.
- Restore a specific lesson quiz:
```bash
npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json
```
