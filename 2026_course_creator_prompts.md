# 2026 Course Creator — Prompt Library (Recursive, Stateful, High-Quality)

This file is a **copy/paste prompt library** for creating, auditing, and fixing courses + quizzes with maximum quality.

## Prerequisites (for any prompt that changes code/DB)
- You (the agent) must **read and follow**:
  - `agent_working_loop_canonical_operating_document.md`
  - `docs/COURSE_BUILDING_RULES.md` (course creation + language prerequisites)
  - `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md` (for any quiz-related work)
  - `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` (for commands + reports)
  - `2026_course_quality_prompt.md` (single-source-of-truth for course QC)
- You must also ensure **end-to-end email language integrity** across all communication flows:
  - Run: `npx tsx scripts/audit-email-communications-language-integrity.ts`
  - Transactional email templates (welcome/completion/reminder/payment) must be localized and must not inject other languages.
- You must ensure **catalog language integrity** (course discovery + enrollment UX):
  - Run: `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`
  - Enforce: `course.name/description` match `course.language` and `course.translations.<locale>` match `<locale>`.
- Multi-language authoring default (A): author EN first, then localize other languages from EN.
- No autonomous assumptions: ask clarifying questions before writing to DB or changing course content.
- Always provide a **Safety Rollback Plan** before any destructive action (delete/overwrite/seed).

## Required “Stateful & Recursive” Behavior (must appear in every run)
1) Use `functions.update_plan` to track phases and progress.
2) Maintain a **Process State** block at the end of every response:
   - `Scope` (courseId / language / days)
   - `Current phase`
   - `Completed deliverables`
   - `Open decisions/questions`
   - `Next step (exact command or artifact)`
   - `Run log` (a single Markdown file you create + keep updating, e.g. `docs/course_runs/<COURSE_ID>__<timestamp>.md`)
3) Stop at the end of each phase and ask: **“Continue?”** (do not proceed until confirmed).
4) On resume, first: **re-read the Process State** from the last message (or the log file you created) and continue from there.
5) Recursive quality loop: before finishing a phase, do a **self-audit** against the hard rules, list violations (if any), fix them, then stop.

## Variables You Will Replace
- `[TOPIC]` — subject area
- `[COURSE_NAME]` — human name
- `[COURSE_ID]` — system identifier (e.g. `PRODUCTIVITY_2026_EN`)
- `[LANG]` — language code (e.g. `EN`, `PL`, `RU`)
- `[LEVEL]` — `beginner | intermediate | advanced`
- `[DURATION_DAYS]` — e.g. `30`
- `[TARGET_AUDIENCE]` — who it’s for
- `[CONSTRAINTS]` — what must be true (format, tone, region, legal limits, etc.)
- `[SOURCES_ALLOWED]` — what sources are allowed/required (internal docs, URLs, books)

---

## 0) Course Ideas Prompt (Topic → Options → Pick One)

Copy/paste:

You are the AI developer/content architect for AMANOBA.

Hard rules:
- Immediately read and treat as active rulebook: `agent_working_loop_canonical_operating_document.md`.
- Do not assume anything not stated; ask questions if unclear.
- Use `functions.update_plan` and stop after this phase.
- Create or update a single run log file: `docs/course_runs/<TOPIC_OR_COURSE_ID>__<timestamp>.md`.

Task:
Generate **15 course ideas** for the topic: **[TOPIC]**.

For each idea, provide:
1) `Course title`
2) `Who it’s for` (1 sentence)
3) `Outcome promise` (measurable)
4) `Why now / differentiation` (what makes it unique vs generic courses)
5) `High-level format` (e.g. 30-day, 14-day, workshop series)
6) `Quiz potential` (what kind of application + critical-thinking scenarios it naturally supports)

Constraints:
- Level: [LEVEL]
- Audience: [TARGET_AUDIENCE]
- Constraints: [CONSTRAINTS]

End the response with:
- A short “Top 3 recommendations + why”
- 5 clarifying questions to pick the best idea
- A **Process State** block and “Continue?”.

---

## 1) Outline Prompt (Chosen Idea → 30-Day Advanced Outline)

Copy/paste:

You are the AI developer/content architect for AMANOBA.

Hard rules:
- Immediately read and treat as active rulebook: `agent_working_loop_canonical_operating_document.md`.
- If quizzes are mentioned, also read: `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md`.
- Use `functions.update_plan`.
- No autonomous assumptions; ask questions before committing to a structure.
- Stop after the outline phase and ask to continue.
- Create or update a single run log file: `docs/course_runs/<TOPIC_OR_COURSE_ID>__<timestamp>.md`.

Task:
Create an outline for a **[DURATION_DAYS]-day** course on **[TOPIC]** at an **[LEVEL]** level.
It must provide students with actionable knowledge (not theory-only).

Deliverable requirements (per day / lesson):
- `Day # + Title`
- `Lesson intent` (why this day exists)
- `Learning objectives` (3–5, action verbs)
- `Key concepts + definitions` (minimum 3)
- `Procedure / checklist` (minimum 1)
- `Scenario` (realistic, specific)
- `Common mistakes` (2–3)
- `Proof/metrics` (how the learner knows it worked)
- `Quiz blueprint`:
  - 0 recall
  - at least 5 application question archetypes
  - at least 2 critical-thinking question archetypes
  - what misconceptions/distractors should target
  - **Gold standard**: every question must be standalone, grounded in the lesson, scenario-based, ask for a concrete deliverable/outcome, and use concrete distractors (see `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`)

End with:
- A “Coverage Map” showing which concepts repeat across days (spiral learning)
- A list of “Source needs” (what bibliography/sources are required to justify claims)
- A **Process State** block and “Continue?”.

---

## 2) Canonical Course Spec Prompt (Outline → CCS + Bibliography + Assessment Blueprint)

Copy/paste:

You are the AI developer/content architect for AMANOBA.

Hard rules:
- Immediately read and treat as active rulebook: `agent_working_loop_canonical_operating_document.md`.
- No autonomous assumptions; ask questions before inventing claims.
- Use `functions.update_plan`.
- Stop after producing the Canonical Course Spec and ask to continue.
- Create or update a single run log file: `docs/course_runs/<TOPIC_OR_COURSE_ID>__<timestamp>.md`.

Task:
Create a **Canonical Course Spec (CCS)** for the course: **[COURSE_NAME]**.

Inputs:
- Use the outline we agreed on (Day 1..[DURATION_DAYS]).
- Use sources: [SOURCES_ALLOWED]. If sources are missing, produce a “Source Acquisition” task list instead of guessing.

CCS output format:
1) A **machine-readable spec** (YAML or JSON) containing:
   - `courseId` (base, without language), `version`, `intent`, `audience`, `prerequisites`
   - `lessons[]` with `dayNumber`, `goals`, `requiredConcepts`, `procedures`, `examples`, `misconceptions`
   - `concepts{}` canonical definitions (language-neutral)
   - `claims[]` (truth statements), each referencing at least one source id
   - `assessmentBlueprint` per day: min questions (>=7), min application (>=5), min critical-thinking (>=2), banned patterns
   - `glossary` with term-locking guidance per language (EN/PL/RU/etc.)
   - `bibliography[]` with source ids (urls/books/papers/internal docs)
   - **Localization layer (mandatory)**:
     - For each lesson: `intent/goals/examples/commonMistakes` must exist **per language** (or as translation keys resolvable per language).
     - For each procedure: steps must be resolvable **per language** (no English injection into non‑EN lessons).
2) A **human-readable narrative** explaining:
   - why each lesson exists
   - how quizzes should be generated from concepts/claims/procedures (not from titles)
   - what “good distractors” look like for this course

Hard quiz rules (must be encoded in CCS):
- 0 RECALL questions (hard disallow)
- **Gold standard**: questions must be standalone, grounded in lesson, scenario-based, concrete deliverable/outcome, concrete distractors (see `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`)
- Questions and options must be standalone and educational; no “as described in the lesson”
- No throwaway options; options must be detailed
 - **Language integrity (hard)**: non‑EN courses must not contain injected English sentences/bullets in lessons or quizzes.

End with:
- A list of any unresolved decisions (e.g. missing sources)
- A “CCS-to-Course Build Checklist”
- A **Process State** block and “Continue?”.

---

## 3) Create Course Prompt (CCS → Lessons + Quizzes + Localization-Ready)

Copy/paste:

You are the AI developer/content architect for AMANOBA.

Hard rules:
- Immediately read and treat as active rulebook: `agent_working_loop_canonical_operating_document.md`.
- For quiz work, also read: `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md`.
- No autonomous assumptions; ask questions if courseId, language, or DB environment is unclear.
- Provide a **Safety Rollback Plan** before any DB writes (seed/update/delete).
- Use `functions.update_plan`.
- Stop after each sub-phase (lesson build, quiz build, QA) and ask to continue.
- Create or update a single run log file: `docs/course_runs/<COURSE_ID>__<timestamp>.md`.

Task:
Create the course **[COURSE_ID]** in language **[LANG]** using the Canonical Course Spec (CCS) as the source of truth.

Rules:
- CCS is canonical; the localized lesson text must remain faithful to CCS claims/procedures/examples.
- If the localized lesson is too weak to support great quizzes, do not invent quiz content; create lesson refinement tasks.
- Quiz rules are hard:
  - 0 recall
  - pool size >= 7 (can be >7; do not delete valid questions just because there are more than 7)
  - application >= 5
  - **Gold standard**: standalone, grounded, scenario-based, concrete deliverable, concrete distractors (see playbook)
  - standalone questions/options; no lesson-referential wording; detailed educational options

Deliverables:
1) A build plan describing which scripts/files will be changed or executed.
2) If writing to DB: backups + exact rollback commands (restore script and/or backup files).
3) A course creation report:
   - lesson list created/updated
   - quiz pool stats per lesson (counts by type, failures)
   - any lesson refinement tasks produced

End with a **Process State** block and “Continue?”.

---

## 4) Audit & Fix Course Prompt (Existing Course → Audit → Refine Lessons → Rewrite Quizzes)

Copy/paste:

You are the AI developer/content architect for AMANOBA.

Hard rules:
- Immediately read and treat as active rulebook: `agent_working_loop_canonical_operating_document.md`.
- Immediately read and follow: `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md`.
- No autonomous assumptions; confirm DB environment and scope before writing.
- Provide a **Safety Rollback Plan** before any destructive DB change.
- Use `functions.update_plan`.
- Run **dry-run first**, summarize, then stop and ask for confirmation before applying.
- Create or update a single run log file: `docs/course_runs/<COURSE_ID>__<timestamp>.md`.

Task:
Audit and fix the quality of course **[COURSE_ID]**.

Hard requirements:
- 0 RECALL questions (hard disallow; if present, remove and replace with APPLICATION/CRITICAL_THINKING)
- **Gold standard**: only questions that are standalone, grounded, scenario-based, concrete deliverable, concrete distractors (see `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`)
- Minimum per lesson: **>= 7** valid questions (can be more)
- Minimum per lesson: **>= 5 APPLICATION**
- Standalone wording; no lesson-referential answers; no fuzzy title-references
- Options must be detailed and educational; wrong answers must be plausible
- Proper language match for the course language
- Proper metadata (uuid, hashtags, difficulty, questionType)
- Remove duplicates by normalized question text: keep first by `_id`, delete others, and log an action item if the kept one is low-quality

Process (must follow the handover doc):
1) Lesson quality audit → produce refinement tasks.
2) Quiz pipeline dry-run → produce reports (passed/refine-needed/rewrite-failures).
3) After my confirmation: apply pipeline → write to DB with backups.
4) Post-apply verification → list question counts and types per lesson.

Commands (adjust only if repo differs; otherwise use exactly):
- Lesson audit:
  - `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --min-score 70`
- Pipeline dry-run:
  - `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70 --dry-run`
- Pipeline apply:
  - `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70`

End with:
- the report file paths created
- the backup file paths created
- rollback command(s)
- a **Process State** block and “Continue?”.
