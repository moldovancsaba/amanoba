# CREATE_A_COURSE_HANDOVER — Amanoba (Idea → Outline → CCS → Course → Lessons → Quizzes → Publish)

This document is the **single handover entrypoint** for any agent asked to create (or continue creating) a course on the Amanoba platform.

If you follow this exactly, you will:
1) Resume the latest in-progress course run safely, **or**
2) Start a new course from an idea and ship it to “ready to enroll” with strict quality gates.

---

## 0) Non‑Negotiable Rules (read first)

### SSOT (Single Source of Truth) set
If anything conflicts with these, **these win**:
- `agent_working_loop_canonical_operating_document.md`
- `docs/layout_grammar.md`
- `docs/COURSE_BUILDING_RULES.md`
- `docs/COURSE_CREATION_QA_PLAYBOOK.md`
- `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md`
- `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`
- `2026_course_creator_prompts.md`
- `2026_course_quality_prompt.md`

### Process rules
- **No autonomous assumptions.** If scope is unclear (environment, courseId/ccsId, language(s), overwrite vs missing-only), stop and ask.
- **Documentation = code.** If you change any behavior or workflow, update the relevant docs immediately.
- **Dry-run first.** Summarize outputs, then stop and ask for confirmation before any DB write.
- **Rollback plan required.** Before any DB write, you must produce restore commands and ensure backups exist.
- **No quality exceptions.** Premium/free does not change quality standards.
- **EN-first default for multi-language families.** Author EN first, then localize. No English leakage in non-EN lessons/quizzes.
- **Stateful execution (mandatory).**
  - Maintain exactly one run log and one tasklist for the current run (and keep them updated after every step).
  - Always record the **exact next command** to run.
  - When working in phases: stop at the end of each phase, write the updated Process State, and require an explicit “continue” decision.
- **Platform defaults (required unless explicitly overridden).**
  - **Environment**: production via `.env.local`, writing to MongoDB Atlas database **`amanoba`**.
  - **Course structure**: always create a **30-day parent course** first (shorts/children come later).
  - **Commercial**: default is **free** (`requiresPremium=false`).
  - **Assessment**: quizzes are required and must pass SSOT gates (>=7 valid, >=5 application, 0 recall; language integrity).
  - **Certification (recommended default for Amanoba)**:
    - Enable course certification if the course is meant to generate shareable proof (certificate).
    - Entitlement policy:
      - **Free + unpriced** course with certification enabled → entitlement is **not required** for final exam access.
      - Otherwise (premium-gated or priced) → entitlement is required (points/money/premium-included).

---

## 1) First action: Resume latest progress OR start new

### 1.0 Why there are two artifacts (and why both are required)
To avoid unfinished work and to keep course creation “resume-safe”, this process uses **two** artifacts every time:

- **Run log** (`docs/course_runs/...`): narrative record + links + decisions + **Process State**.
- **Tasklist** (`docs/tasklists/...`): executable checklist + “what’s next” + the **exact next command**.

They serve different needs:
- The run log preserves *why* and *what changed* (so you can audit or hand over).
- The tasklist preserves *what to do next* (so you can resume in 30 seconds).

**Rule:** For every run, always maintain both, and they must link to each other.

### 1.1 Resume the latest in-progress run (required if anything is “RUNNING”)
Progress lives in:
- Run logs (narrative + Process State): `docs/course_runs/`
- Tasklists (checkboxes + exact next command): `docs/tasklists/`

How to find “not done”:
1) Open the newest run logs in `docs/course_runs/` and look for:
   - `## Process State`
   - `Status: **RUNNING**` (or anything not marked **COMPLETE**)
2) Open the linked tasklist from the Process State and run the exact `Next command`.

Recommended commands:
```bash
ls -1t docs/course_runs | head -20
rg -n "Status: \\*\\*RUNNING\\*\\*" docs/course_runs -S
```

If you resume a run:
- Do not create a new run log unless the existing one is clearly completed or superseded.
- Continue by updating the existing run log + tasklist (never lose state).
- First, re-read and follow the **Process State** block from that run log before doing anything else.

### 1.1.1 “No unfinished course left behind” rule (how to secure it)
To ensure no run is silently abandoned:
- A run may be left in **RUNNING** state only if there is an explicit “Next command” in the tasklist.
- When work finishes, the run log must be updated to `Status: **COMPLETE**`.
- If work must be stopped indefinitely, mark it explicitly as `Status: **BLOCKED**` with the blocker and the next decision needed.

Resume selection rule (deterministic):
1) Find all run logs containing `Status: **RUNNING**`.
2) If more than one exists, pick the one with the newest timestamp in the filename (preferred), otherwise use file modified time.

### 1.2 If there is no active run: start a new course run
Create two files immediately (even before any code/DB write):
- Run log: `docs/course_runs/<CCS_ID or COURSE_ID>__<timestamp>.md`
- Tasklist: `docs/tasklists/<CCS_ID or COURSE_ID>__<timestamp>.md`

The run log must end with a **Process State** block (template in §8).
The tasklist must end with **one exact Next command**.

---

## 2) Definitions (so “done” is unambiguous)

### CCS (Canonical Course Spec / Course Family)
Two representations exist and must stay aligned:
1) **DB CCS entity** (admin “course families”): `app/lib/models/ccs.ts`
   - Holds **idea** (markdown), **outline** (markdown), and related documents.
2) **Repo canonical CCS**: `docs/canonical/<CCS_ID>/`
   - `<CCS_ID>.canonical.json` (machine spec)
   - `<CCS_ID>_CCS.md` (narrative + gates + how to use)

### Language-variant course
One Course per language (e.g. `PRODUCTIVITY_2026_EN`, `PRODUCTIVITY_2026_HU`), referencing the family:
- `Course.ccsId = <CCS_ID>` (string)
- `Course.language = <locale>` (lowercase like `en`, `hu`)

### CourseId vs locale (important constraint)
`Course.courseId` must match `^[A-Z0-9_]+$` (no hyphens), so locale codes like `pt-br` **cannot** be used directly inside `courseId`.

Recommended convention:
- `courseId`: `<CCS_ID>_<LANG_TOKEN>` where `LANG_TOKEN` is uppercase and underscore-safe (e.g. `EN`, `HU`, `PT_BR`).
- `language` field: the real locale code used by the platform/i18n (e.g. `en`, `hu`, `pt-br`).

---

## 3) Core quality gates (strict)

### 3.1 Lesson quality gates (hard)
- **Language integrity**: `content`, `emailSubject`, `emailBody` must match `Course.language` (no leakage).
- **Quality threshold**: lesson must pass the audit threshold (current system: `min-score 70`).
- **Structure**: follow `docs/layout_grammar.md` lesson grammar (clear intro → main content → recap → action items).

Audits:
```bash
npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course <COURSE_ID> --min-score 70
npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course <COURSE_ID>
```

### 3.2 Quiz / question quality gates (hard)
Minimum per lesson (pool requirements; pool may be larger):
- **0 `questionType=recall`** questions (hard disallow).
- **>= 7 valid questions**.
- **>= 5 APPLICATION** questions.
- CRITICAL_THINKING is recommended (often targeted as “>= 2” by CCS/seed scripts).

Gold-standard question type (only acceptable form):
- **Standalone** (random-order safe; no “as described in the lesson / today / this course”).
- **Grounded** in the lesson/CCS (real terminology + concepts taught).
- **Scenario-based** with a concrete situation.
- Asks for a **concrete deliverable/outcome** (not vague theory).
- Has **concrete, educational distractors** (no throwaway options).

Validator-enforced minimums (no exceptions):
- Question length >= 40 characters
- Each option length >= 25 characters
- Exactly 4 unique options
- `correctIndex` is 0–3

Quiz SSOT: `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md` and `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`.

---

## 4) The end-to-end workflow (Idea → Outline → CCS → Build → QA → Publish)

This section is a condensed “how to do it”; the full checklist is in `docs/COURSE_CREATION_QA_PLAYBOOK.md`.

### Phase A — Prereqs & scope (no DB writes)
- Confirm **environment** and which `.env` file / DB you will touch.
  - Default: `.env.local` → production MongoDB Atlas, dbName=`amanoba`.
- Confirm target languages and ensure UI translations exist in `messages/` for each locale (if not, stop and deliver translations first).
- Confirm identifiers:
  - `CCS_ID` (family) — uppercase underscore format
  - `COURSE_ID` per language variant — `<CCS_ID>_<LANG_TOKEN>` (e.g. `..._EN`, `..._HU`, `..._PT_BR`)
- Check for duplicates/overlap in existing courses and CCS.
- Create/continue the run log + tasklist.

### Phase B — Course idea (artifact)
- Produce a clear course idea (audience, measurable promise, differentiation).
- Persist it:
  - DB: CCS `idea` field (preferred for “admin source”), and/or
  - Repo: `docs/course_ideas/<TOPIC>_Blueprint.md` (optional but useful)

### Phase C — 30-day outline (artifact)
- Create the Day 1–30 outline with enough detail to support quiz scenarios.
- Persist it:
  - DB: CCS `outline` field, and/or
  - Repo canonical: include in `<CCS_ID>_CCS.md` and/or canonical JSON lesson outlines.

### Phase D — CCS (SSOT for the family)
- Create/update repo canonical files under `docs/canonical/<CCS_ID>/`.
- Ensure the CCS encodes the quiz hard gates in `assessmentBlueprint`.
- Create/update the DB CCS entity (admin “Course families”) so editors can see the idea/outline at the family level.

Admin UI entrypoint (course families live inside Course Management):
- `/en/admin/courses` → CCS view (course families)

### Phase E — Create language-variant course(s)
Create the Course record (per language) and set `course.ccsId`.

Admin UI entrypoint:
- `/en/admin/courses/new`

Critical integrity rules:
- `course.name` + `course.description` must match `course.language`
- `course.translations.<locale>` (if used) must match `<locale>`
- Do not publish accidentally: new courses are typically created inactive/draft first.

### Phase F — Lessons (Day 1–30)
- Create 30 lessons per language variant course.
- Ensure lesson IDs, `dayNumber`, and email fields are correct and in-language.
- Do not “fix quizzes” to compensate for weak lessons; refine lesson content first until it passes audits.

### Phase G — Quizzes (pipeline)
Operate via the pipeline (dry-run → apply), not ad-hoc bulk edits:
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70 --dry-run
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70
```

If you must fix a single question carefully (manual QA path):
- Admin UI: `/<locale>/admin/questions`
- Or follow `docs/QUIZ_ITEM_QA_HANDOVER.md` (+ `.state/quiz_item_qa_state.json` if using the cursor-based loop).

### Phase H — System integrity checks (must pass)
Recommended checks:
```bash
npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70
npx tsx scripts/audit-email-communications-language-integrity.ts
```

### Phase I — Publish (“ready to enroll”)
“Ready to enroll” means:
- Course is visible as intended (active/published rules respected).
- Lessons and quizzes pass gates (quality + language integrity).
- Email flows are language-safe.
- A manual smoke test works end-to-end (enroll → read lesson → take quiz → progress updates).

---

## 5) Database safety + backups (mandatory before DB writes)

### 5.1 Critical: seed/scripts must write to the same DB as the app
The app connects using `dbName: process.env.DB_NAME || 'amanoba'` (see `docs/COURSE_BUILDING_RULES.md` and `app/lib/mongodb.ts`).

If a seed/fix script connects without setting `dbName`, it may write to the wrong DB (often `test`), and the admin UI will “not see” the data.

Backup-first patterns used in this repo:
- Quiz backups: `scripts/quiz-backups/<COURSE_ID>/...`
- Lesson backups: `scripts/lesson-backups/<COURSE_ID>/...`
- Reports: `scripts/reports/...`

Restore commands:
```bash
npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json
npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json
```

---

## 6) Data model constraints you must respect (quick reference)

### 6.1 CCS (DB)
- `ccsId`: uppercase underscore format (e.g. `PRODUCTIVITY_2026`)
- `idea`: markdown (optional but recommended)
- `outline`: markdown (optional but recommended)

### 6.2 Course (DB)
- `courseId`: uppercase underscore format (unique, required)
- `language`: lowercase locale (e.g. `en`, `hu`)
- `ccsId`: string linking to CCS family (required for proper grouping)
- `isActive`: course activation (often created inactive/draft first)
- `isDraft`: used especially for shorts; may also be used when CCS changes force republish

### 6.3 Lesson (DB)
- `lessonId`: unique
- `courseId`: ObjectId ref to Course
- `dayNumber`: 1–30 for standard courses
- `content`, `emailSubject`, `emailBody`: must match course language
- `quizConfig`: controls quiz behavior; pool size and quality gates still apply at the content layer

### 6.4 QuizQuestion (DB)
Key rules:
- Exactly 4 unique options
- `correctIndex` 0–3
- `questionType` values are lowercase strings:
  - `recall` (should be **0** in final course quizzes)
  - `application`
  - `critical-thinking`
- `difficulty` is one of: `EASY | MEDIUM | HARD | EXPERT`
- `uuid` should be v4; `hashtags` is a string array

---

## 7) “Stop and ask” checklist (things that must be clarified)

Stop and ask the owner before you write to DB if any of these are unclear:
- Are we writing to **production** or **staging**?
- Which languages must ship now vs later?
- Should we create missing-only, or overwrite existing content?
- Is the course a new family (new `CCS_ID`) or a new variant inside an existing family?
- Should the course be premium (`requiresPremium`) and what pricing/currency should be used?
- Are there existing similar courses to reuse/adapt?

---

## 8) Templates (copy/paste)

### 8.1 Run log template (`docs/course_runs/...`)
```md
# Run Log — <COURSE_ID or CCS_ID> — <short title>

- Started (UTC): <timestamp>
- Environment: <production|staging> (env file: <.env.local|...>)
- Scope: <CCS_ID / COURSE_ID(s) / languages>

## Safety Rollback Plan
- Lesson restore: `npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`
- Quiz restore: `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`

## Outputs
- Reports: <paths>
- Backups: <paths>

## Process State
- Status: **RUNNING**
- Tasklist: `docs/tasklists/<MATCHING_TASKLIST>.md`
- Current phase: <A/B/C/...>
- Last completed step: <what>
- Next step: <what>
- Next command: `<exact command>`
- Blockers: <none|...>
```

### 8.2 Tasklist template (`docs/tasklists/...`)
```md
# Tasklist — <COURSE_ID or CCS_ID> — <timestamp>

## Environment
- [ ] Confirm env + DB target

## Idea → Outline → CCS
- [ ] Idea finalized and stored (CCS.idea)
- [ ] 30-day outline finalized and stored (CCS.outline)
- [ ] Repo CCS updated (`docs/canonical/<CCS_ID>/...`)

## Course variants
- [ ] Course(s) created and linked to CCS (`Course.ccsId`)

## Lessons
- [ ] Lessons created Day 1–30
- [ ] Lesson quality audit passes (>=70)
- [ ] Lesson language integrity passes

## Quizzes
- [ ] Pipeline dry-run reviewed
- [ ] Pipeline apply completed (backups created)
- [ ] Post-apply verification passes

## Final checks
- [ ] CCS global audit passes (scope-appropriate)
- [ ] Email communications language audit passes
- [ ] Manual smoke test passes

## Next command
`<exact command to run next>`
```

---

## 9) Additional references (helpful context; SSOT still wins)

Use these when you need extra context or examples; if they conflict with the SSOT set in §0, treat them as historical/supporting only:
- `docs/ADMIN_LANGUAGE_SETUP.md` (admin entrypoints + language setup notes)
- `docs/RELEASE_NOTES.md` (course builder UI notes, including the course creation form)
- `docs/QUIZ_PIPELINE_UPDATED_SAMPLE__2026-01-29.md` (pipeline behavior sample)
- `docs/QUIZ_FIXING_DOCUMENTS_LIST.md` and `docs/QUIZ_FIXING_DOCUMENTS_COMPLETE_LIST.md` (historical quiz-fix document maps)
- `docs/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md` (course hierarchy: CCS → language variants → shorts; draft/publish implications)
