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

**NO QUALITY EXCEPTION ACCEPTED** for any content. No course, lesson, or quiz may bypass or receive exceptions from the requirements below.

### Gold-standard question type (only acceptable form)

**Only questions that match this form are acceptable.** Full section: `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`.

**Canonical example:** *"What is the concrete document or list needed to define the ICP according to different problem groups?"* — Standalone, grounded (ICP, problem groups), scenario-based, asks for a concrete deliverable, concrete distractors.

**Five rules (all required):** Standalone | Grounded in lesson | Scenario-based | Concrete deliverable/outcome | Concrete distractors (plausible domain mistakes, no generic filler).

**Why other types fail:** Lesson/course-referential → not standalone. Generic/disconnected → not grounded. Self-answering → doesn’t test. Vague distractors → not educational. Padding → no real scenario. **Accept only gold-standard form.**

## CRITICAL: What Quality Improvement Means (Anti-Patterns)

**FORBIDDEN LAZY APPROACHES:**
- ❌ **DO NOT** just add words to meet length requirements (e.g., "What should you commit to?" → "What should you commit to from Day 1 to build a sustainable system?"). This is padding, not quality.
- ❌ **DO NOT** repeat the same schema/pattern across questions (e.g., "In this framework, how is X defined?" repeated 10 times).
- ❌ **DO NOT** extend questions with generic phrases like "in this framework", "in practice", "to build X" just to hit character counts.
- ❌ **DO NOT** lengthen options by adding filler words without adding educational value.

**REQUIRED QUALITY APPROACHES:**
- ✅ **REWRITE** questions as concrete, scenario-based situations students might actually face.
- ✅ **CREATE** educational distractors that teach common mistakes or misconceptions.
- ✅ **VARY** question structures: use scenarios, case studies, "what would you do if...", "a team is facing...", "you observe...".
- ✅ **ENSURE** each question tests real understanding and application, not just pattern matching.
- ✅ **MAKE** wrong answers plausible and educational - they should represent real mistakes people make.

**Example of BAD (lazy padding):**
- Q: "What should you commit to?" → "What should you commit to from Day 1 to build a sustainable system?"
- This is the SAME question with filler words.

**Example of GOOD (real quality):**
- Q: "A leader says: 'We did 50 meetings this month.' What is missing for effectiveness?"
- This is a concrete scenario that tests understanding through application.

### Question requirements
- **Standalone & random-order safe**: Questions are shown in **random order** and may be used **standalone**. Each question must be **self-contained**: no "this course", "this kind of course", "from the lesson", "the playbook" (unless the question defines it), "from this course", or any wording that assumes the learner just read a specific lesson. Answerable without opening the lesson or relying on lesson order.
- **Minimum lengths (validator-enforced)**: Question ≥ 40 characters; each option ≥ 25 characters. No exceptions.
- **No generic template patterns**: e.g. questions starting with “What does \”…” are rejected; use scenario-based or “In this framework, how is X used?” style instead.
- No lesson references: no “as described in the lesson”, no “follow the method in the lesson”, no title-based crutches.
- No checklist-snippet crutches: reject questions that quote truncated checklist snippets (e.g. `✅ ...` or quoted `...`) instead of giving a clear scenario.
- No throwaway options: no “no impact / only theoretical / not mentioned…”.
- Options must be detailed and educational (minimum length enforced by validator).
- 0 RECALL questions (`questionType: recall` is forbidden).
- Minimum pool size: **at least 7** valid questions per lesson (can be more).
- Application minimum: **at least 5 APPLICATION** questions per lesson.
- Must be grounded in lesson content (no invented facts).
- Correct metadata: uuid, hashtags, questionType, difficulty.

### Lesson language integrity (Hard Requirement)

Lessons (and emails) must match the course language:
- `lesson.content`, `lesson.emailSubject`, `lesson.emailBody` must be in-language.
- No English sentence/bullet injection into non‑EN lessons (e.g., “Scale capability…”, “Create a …”).
- **End-to-end email integrity**: the *final* HTML received by the user must be in-language.
  - If send-time code appends content (e.g., unsubscribe footers), that appended content must be localized too.
  - Run the code-level audit: `npx tsx scripts/audit-email-communications-language-integrity.ts`.
  - This audit also validates **transactional email templates** (welcome/completion/reminder/payment), not only lesson-email footers.
  - Delivery system enforcement: email sends are blocked if the final subject/body fails language integrity at send-time.

If language integrity fails:
- Block apply-mode lesson changes for that lesson.
- Block quiz rewrite for that lesson.
- Create a clear action item describing the offending snippet(s) and how to fix.

### CCS alignment (Hard Requirement)

CCS is canonical for meaning, but is currently **English-first** unless localized fields exist.
- Never inject CCS English `intent/goals/examples/commonMistakes` verbatim into non‑EN lessons.
- For non‑EN refinement, render only in-language content (either from localized CCS fields or from language-local templates derived from CCS procedure IDs/concept IDs).

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
- `scripts/audit-lesson-language-integrity.ts` — lesson language integrity audit (hard gate; blocks quiz work if lesson text is mixed-language).
- `scripts/lesson-quality.ts` — scoring heuristics (definitions, steps, examples, criteria, etc.).

### Generators + validators (quality control)
- `scripts/content-based-question-generator.ts` — question generator (must read lesson content).
- `scripts/question-quality-validator.ts` — strict validator (rejects lesson-references, throwaway options, recall, etc.).

### Outputs
- `scripts/reports/` — JSON reports and Markdown task lists produced by audits/pipeline.
- `scripts/quiz-backups/<COURSE_ID>/` — backups of pre-change quizzes per lesson.

### Global inventory + CCS-wide audit (system-level)
- `scripts/audit-ccs-global-quality.ts` — CCS-family audit across all linked courses (and will also *infer* CCS for courses missing `ccsId` and emit action items to link them).
  - Includes: **course catalog language integrity** checks for `course.name` + `course.description` + `course.translations.<locale>` (catalog display).
  - Note: **short courses** (with `parentCourseId` + `selectedLessonIds`) do not require per-day Lesson docs; missing-day checks apply only to non-short courses.

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

### Step 0 — CCS-wide audit tasklist (recommended for “audit everything”)
Generates a single master tasklist covering **all CCS families and all courses**, including:
- Lessons below quality threshold
- Lessons failing language integrity (including email fields)
- Courses failing catalog language integrity (course name/description)
- Per-question quiz validation failures
- Duplicate quiz question text (normalized; keep first by `_id`)
- Minimum quiz pool not met (>=7 valid, >=5 application, 0 recall)
- Duplicate day lessons (multiple lessons for the same dayNumber in a course)
- Courses missing `Course.ccsId` (emits “link CCS” action items)

```bash
npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70
```

Also run the code-level email audit (send-time HTML integrity):
```bash
npx tsx scripts/audit-email-communications-language-integrity.ts
```

Include inactive content (for a true “everything in DB” audit):
```bash
npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70 --include-inactive
```

### Step 1 — Lesson quality audit (creates refinement tasks)
```bash
npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --min-score 70
```

### Step 1b — Lesson language integrity audit (hard gate)
```bash
npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts
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
