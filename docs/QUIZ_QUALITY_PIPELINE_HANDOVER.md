# Quiz Quality Pipeline — Handover (Audit → QC → Refine Lesson → Rewrite Quiz)

This document is the **single source of truth** for running the quiz/lesson quality process at the highest standard, anytime.

It is designed to be used as a **handover prompt + operating manual**, similar in spirit to `agent_working_loop_canonical_operating_document.md`.

---

## Ground Rules (Non‑Negotiable)

1) **Documentation = Code**
   - If we change the pipeline, we update this document and `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` immediately.

2) **No autonomous assumptions**
   - If the requested scope is unclear (course/day/language/threshold), ask before writing to DB.

3) **Safety rollback plan required**
   - Before any delete/insert in the DB, we must generate backups and provide rollback steps.

---

## Quality Standard (Hard Requirements)

### Question requirements
- Standalone: answerable without opening the lesson.
- No lesson references: no “as described in the lesson”, no “follow the method in the lesson”, no title-based crutches.
- No checklist-snippet crutches: reject questions that quote truncated checklist snippets (e.g. `✅ ...` or quoted `...`) instead of giving a clear scenario.
- No throwaway options: no “no impact / only theoretical / not mentioned…”.
- Options must be detailed and educational (minimum length enforced by validator).
- 0 RECALL questions (`questionType: recall` is forbidden).
- Minimum pool size: **at least 7** valid questions per lesson (can be more).
- Application minimum: **at least 5 APPLICATION** questions per lesson.
- Must be grounded in lesson content (no invented facts).
- Correct metadata: uuid, hashtags, questionType, difficulty.

### Lesson requirements (to support great quizzes)
If a lesson is too weak (missing definitions/steps/examples/criteria), we do **not** invent quiz content to fill requirements.
Instead: the pipeline creates **lesson refinement tasks** and skips quiz rewrite for that lesson.

---

## Prerequisites (Before Running Anything)

### Environment
- Node + npm installed (repo expects modern Node; verify with `node -v`).
- `.env.local` exists and contains valid MongoDB connection config used by `app/lib/mongodb`.

### Permissions
- You have DB access for reading/writing `courses`, `lessons`, and `quiz_questions`.

---

## Source of Truth Files (What to refer to)

### Documentation
- `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` — the lightweight playbook of rules and commands.
- `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md` — this handover document (prompt + prerequisites + rollback).

### Core scripts (pipeline)
- `scripts/quiz-quality-pipeline.ts` — end-to-end pipeline runner.
- `scripts/audit-lesson-quality.ts` — lesson quality audit and refinement task generator.
- `scripts/lesson-quality.ts` — scoring heuristics (definitions, steps, examples, criteria, etc.).

### Generators + validators (quality control)
- `scripts/content-based-question-generator.ts` — question generator (must read lesson content).
- `scripts/question-quality-validator.ts` — strict validator (rejects lesson-references, throwaway options, recall, etc.).

### Outputs
- `scripts/reports/` — JSON reports and Markdown task lists produced by audits/pipeline.
- `scripts/quiz-backups/<COURSE_ID>/` — backups of pre-change quizzes per lesson.

### Rollback tooling
- `scripts/restore-lesson-quiz-from-backup.ts` — restores a lesson quiz from a backup file.

---

## Safety Rollback Plan (Mandatory)

### Before applying changes
1) Run **dry-run** pipeline first and review reports.
2) Ensure backups will be written to `scripts/quiz-backups/<COURSE_ID>/`.

### If something goes wrong
Restore a lesson quiz from a specific backup file:
```bash
npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/COURSE_ID/LESSON_ID__TIMESTAMP.json
```

Verify after restore:
- `scripts/review-questions-by-lesson.ts` (manual inspection)
- or query via admin UI / admin questions API.

---

## Repeatable Operating Procedure

### Step 1 — Lesson quality audit (creates refinement tasks)
```bash
npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --min-score 70
```

### Step 2 — Pipeline dry run (no DB writes)
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70 --dry-run
```

### Step 3 — Apply pipeline (writes to DB)
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70
```

### Step 4 — Review outputs
- `scripts/reports/quiz-quality-pipeline__<timestamp>.json`
- `scripts/reports/quiz-quality-pipeline__<timestamp>__lesson-refine-tasks.md`
- `scripts/reports/quiz-quality-pipeline__<timestamp>__rewrite-failures.md`

Interpretation:
- `lesson-refine-tasks.md`: lesson content is too weak → refine lesson text first.
- `rewrite-failures.md`: lesson is OK, but generator needs a better lesson-type strategy → improve generator (do not lower QC).

---

## The Prompt to Ask the AI (Copy/Paste)

Use this exact prompt when you want the agent to run the process at maximum quality:

> Run the **Quiz Quality Pipeline** end-to-end for **[COURSE_ID or ALL COURSES]** with strict quality rules.
>
> Hard requirements:
> - Standalone questions and answers (no “as described in the lesson”, no title-based crutches).
> - **0 RECALL** questions.
> - At least **7** valid questions per lesson (pool may be larger; do not delete just because there are >7).
> - At least **5 APPLICATION** questions per lesson.
> - Options must be **detailed and educational** (no throwaway options like “no impact/only theoretical/not mentioned”; reject short options).
> - Must be grounded in lesson content (no invented facts).
>
> Process:
> 1) Run lesson quality audit and generate lesson refinement tasks.
> 2) Run the pipeline in **dry-run** first and summarize results (passed, refine-needed, rewrite-failures).
> 3) After I confirm, run the pipeline in apply mode (write to DB), ensuring backups are saved and rollback steps are provided.
>
> Parameters:
> - Course filter: **[COURSE_ID]** (or ALL)
> - Lesson score threshold: **[e.g., 70]**
> - Output dir: `scripts/reports/`
> - Backups dir: `scripts/quiz-backups/`

---

## What “Done” Means

For the requested scope (course/day/all):
- Reports generated in `scripts/reports/`
- Backups created in `scripts/quiz-backups/`
- Lessons below threshold are listed in `lesson-refine-tasks.md`
- Generator gaps are listed in `rewrite-failures.md`
- If apply mode was requested: DB updated without deleting valid >7 pools (only invalid removed; new valid questions added until minimums met)
