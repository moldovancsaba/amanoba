# Quiz Quality Pipeline Playbook (Audit → QC → Refine Lesson → Rewrite Quiz)

This is the repeatable, high-quality workflow to keep quizzes aligned with lesson content across **any course** and **any language**.

## Core principles (non‑negotiable)

- **NO QUALITY EXCEPTION ACCEPTED**: No course, lesson, or quiz may bypass or receive exceptions from these quality gates. Every piece of content must meet the requirements.

## Gold-standard question type (only acceptable form)

**Only questions that match this form are acceptable.** All others fail quality or pedagogy.

### Canonical example (gold standard)

*"Mi az a konkrét dokumentum vagy lista, ami ahhoz kell, hogy meg tudd határozni az ICP-t a különböző probléma csoportok szerint?"*  
(What is the concrete document or list you need in order to define the ICP by different problem groups?)

In English equivalent: *"What is the concrete document or list needed to define the ICP according to different problem groups?"*

### Five rules (all required)

1. **Standalone** — No "this course", "today", "the lesson", "the playbook". The question is self-contained; a learner can understand and answer without that lesson in recent context.
2. **Grounded** — The question tests what the lesson actually teaches (concepts, deliverables, procedures). It uses the lesson’s domain and terminology (e.g. ICP, problem groups, concrete deliverable).
3. **Scenario-based** — A clear situation is implied or stated: someone is defining ICP by problem groups and needs a specific deliverable. Not a bare "What is X?" without context.
4. **Concrete deliverable/outcome** — The question asks for a specific artifact, step, or decision (e.g. "which document/list"), not a vague "how" or "why" that could be answered in many ways.
5. **Concrete distractors** — Wrong answers are plausible, domain-specific mistakes (e.g. wrong document type, wrong tool), not generic filler ("no significant impact", "only theoretical").

### Why only this type works

- **Tests application**: The learner must apply the lesson (e.g. know which deliverable supports ICP-by-problem-groups), not just recall a phrase.
- **Random-order safe**: Shown in any order or standalone, the question still makes sense and has one defensible correct answer.
- **No course dependency**: No reference to "the course" or "the lesson", so it works in recap, assessment, or mixed-lesson quizzes.
- **Clear right/wrong**: The correct answer is the concrete deliverable taught in the lesson; distractors are concrete wrong choices, so scoring is unambiguous.

### Why other types fail

| Type | Why it fails |
|------|----------------|
| **Lesson/course-referential** ("What did the lesson say about X?", "In this course we…") | Not standalone; assumes recent context; breaks when used out of order or in mixed quizzes. |
| **Generic / disconnected** ("Someone finished a program. How should they sustain progress?") | Not grounded; could apply to any course; doesn’t test this lesson’s content. |
| **Self-answering** (stem includes the answer, e.g. "The three-part loop is think–decide–deliver. Which option matches that loop?") | Doesn’t test understanding; just pattern match. |
| **Vague or generic distractors** ("No significant downside", "Only theoretical", "Not mentioned") | Not educational; don’t represent real mistakes; make the question easy to guess. |
| **Padding / filler** (adding words only to meet length: "What should you commit to from Day 1 to build a sustainable system?") | Same question as before; no extra context or scenario; not gold standard. |

**Bottom line:** Accept only questions that are standalone, grounded in the lesson, scenario-based, ask for a concrete deliverable/outcome, and have concrete educational distractors. Reject or rewrite everything else.

## Root cause (why quiz fixes often fail)

**The root cause:** When fixing quiz questions (e.g. making them "standalone"), the work often optimizes for **one rule** (e.g. "no course reference") and breaks **two others**: (1) **Groundedness** — questions must be based on what the lesson actually teaches; (2) **Concrete distractors** — wrong answers must never be generic ("No significant downside", "Faster execution", "No meaningful effect", etc.); every distractor must be a concrete, plausible mistake in the domain. A question can give away the answer in the stem if that serves the scenario; what is never acceptable is a generic question that doesn't test the lesson, or generic bad answers.

**Correct approach:** Keep questions **scenario-based** and **grounded in the lesson**. When removing "this course" / "the lesson", replace with a **concrete situation** (who, context, stakes) that still tests the same concept. Replace any generic wrong answer with a **concrete, plausible mistake** someone might make.

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

- **Standalone & random-order safe**: Questions are shown in **random order** and may be used **standalone**. Each question must be **self-contained**: no "this course", "this kind of course", "from the lesson", "the playbook" (unless the question defines it), or any wording that assumes the learner just read a specific lesson. A student must understand and answer without opening the lesson or relying on lesson order.
- **Root cause — why "standalone" fixes often fail**: When removing course/lesson references, do **not** make questions generic or disconnect them from the lesson. Standalone = no "this course" / "the lesson"; the question must **still** be grounded in what the lesson actually teaches and **scenario-based**. Bad: "Someone finished a structured learning program. How should they sustain progress?" (generic; doesn't test the lesson). Good: concrete scenario that tests the same concept (e.g. system vs motivation, think-decide-deliver) without naming the course.
- **Scenario-based questions**: Questions must present concrete situations, not abstract definitions or templates.
- **No lesson references**: No “as described in the lesson”, “follow the method in the lesson”, or title‑based shortcuts.
- **No checklist-snippet crutches**: Reject questions that quote truncated checklist snippets (e.g. `✅ ...` or quoted `...`) instead of presenting a clear scenario.
- **No recall**: `questionType: recall` is disallowed.
- **Minimum size**: at least **7** questions per lesson (pool may be larger).
- **Application minimum**: at least **5 APPLICATION** questions per lesson.
- **Educational answers**: Options must be full, concrete, and plausible; wrong answers teach common pitfalls.
- **NEVER general bad answers**: Wrong answers (distractors) must **never** be generic or throwaway. Forbidden: "No significant downside", "Faster execution", "No meaningful effect", "Consistency", "Higher morale", "It has no effect", "No significant risk", etc. Every distractor must be a **concrete, plausible mistake** someone might make in the domain — educational and realistic.
- **Professional distractors (no “meta” options)**: Avoid options like “I’ll just read it”, “I’ll wait for someone else”, or other non-domain behavior. Wrong answers must be realistic mistakes within the domain.
- **Option order not fixed**: The correct answer must not always be option A. Shuffle option order so the correct position varies across questions.
- **Groundedness**: Questions must be based on what the lesson actually says; no invented facts.
- **No throwaway options**: Options like “no impact / only theoretical / not mentioned” are disallowed. Each option must be detailed.
- **Validator minimum lengths**: Question ≥ 40 characters; each option ≥ 25 characters. No generic template patterns (e.g. “What does \”…”); use scenario-based or “In this framework, how is X used?” style.
- **Language integrity (hard)**:
  - Quizzes must match course language (no English leakage tokens like `goals` in non‑EN).
  - Lessons must also match course language (no English sentences/bullets inside non‑EN lessons), otherwise quiz work is blocked for that lesson.
  - **Email end-to-end integrity**: if send-time code appends email content (e.g., unsubscribe footers), that appended content must be localized too.
  - The email audit covers both: daily-lesson email assembly and transactional templates (welcome/completion/reminder/payment).

## The pipeline (repeatable)

1) **Lesson Audit**
   - Score lesson content for “question‑worthiness” (definitions, steps, examples, good/bad contrast, metrics/criteria).
   - Output: JSON report + a Markdown task list of lessons to refine.

2) **Quality Gate**
   - If the lesson quality score is below the threshold, **skip quiz rewrite** and create a lesson refinement task.
   - This prevents generating fuzzy questions or “inventing” content to fill 7 slots.
   - If the lesson fails **Language Integrity**, **skip quiz rewrite** and create a lesson language-fix task.

3) **Refine Lesson**
   - Improve the lesson (do not invent new claims):
     - Add explicit definitions/comparisons
     - Add checklists / steps
     - Add examples (good vs poor)
     - Add pitfalls & failure modes
     - Add metrics/criteria (how to judge outcomes)
   - Never inject CCS English text into non‑EN lessons unless localized fields exist.

4) **Rewrite Quiz**
   - Regenerate 7 questions with strict validation:
     - 0 recall, at least 5 application
     - No “refer back to the lesson” phrasing
     - Correct metadata + hashtags
    - **Tiny loop (mandatory)** — one question at a time: generate → validate question+options → accept/reject → repeat until requirements are met.
      - Replace invalid one-by-one: for each invalid question, generate → validate → replace that single question in DB, then next.
      - Fill missing one-by-one: for each missing slot (7 total, 5 application, 2 critical), generate one → validate → insert that one, then next.
      - If rejected, regenerate with a different seed/source; never “let it pass” to hit 7.
    - Always **backup existing questions** before changes.
    - **Do not delete** questions just to cap at 7; only delete invalid questions, and add new ones until minimum is reached.
   - If quiz rewrite fails under strict QC, fix the generator patterns for that lesson type (do not lower standards).

5) **Re‑audit**
   - Verify count/mix/metadata and spot‑check questions for clarity.

## Manual per-question edits (Admin Questions API)

When you need to fix **one specific question** (or write one new question carefully), use the admin UI at `/<locale>/admin/questions` or the API directly:
- `GET /api/admin/questions` (filter by `courseId`, `lessonId`, `language`, etc.)
- `PATCH /api/admin/questions/[questionId]` (edit question/options/correctIndex)
- `POST /api/admin/questions` (create a single question)
- `DELETE /api/admin/questions/[questionId]` (permanent delete)

For script/bot workflows (no browser session), set `ADMIN_API_TOKEN` / `ADMIN_API_TOKENS` and call with:
- `Authorization: Bearer <token>` (or `X-Admin-Api-Key: <token>`)
- Optional: `X-Admin-Actor: <name>`
- Recommended on content edits: `audit: true` in PATCH body (stamps `metadata.auditedAt`/`metadata.auditedBy`)

## Commands

### CCS-wide master audit (all CCS families + all courses)
Use this when you need the **full system audit** and a single tasklist.
```bash
npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70
```

### Email communications audit (code-level, send-time HTML)
Use this to catch language leakage introduced by send-time email assembly (e.g., lesson unsubscribe footer, payment email footer).
```bash
npx tsx scripts/audit-email-communications-language-integrity.ts
```

Include inactive content too:
```bash
npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70 --include-inactive
```

### Lesson quality audit
```bash
npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --min-score 70
```

### Lesson language integrity audit (hard gate)
```bash
npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts
```

### Strategy A (EN-first, then localize) — missing day lessons
Use this when courses are configured as 30-day but are missing Day 12–30:
1) Fill EN first, then localize HU/RU/etc.
2) Backup before any apply:
```bash
npx tsx --env-file=.env.local scripts/backup-course-lessons.ts --course <COURSE_ID>
```

### Full pipeline (audit + refine task list + rewrite where possible)
Dry run:
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70 --dry-run
```

Apply changes:
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70
```

Single course:
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course GEO_SHOPIFY_30_EN --min-lesson-score 70
```

## Outputs

- Reports: `scripts/reports/`
  - `quiz-quality-pipeline__<timestamp>.json`
  - `quiz-quality-pipeline__<timestamp>__lesson-refine-tasks.md`
  - `quiz-quality-pipeline__<timestamp>__rewrite-failures.md`
  - `lesson-quality-audit__<timestamp>.json`
  - `lesson-refine-tasks__<timestamp>.md`
- Backups: `scripts/quiz-backups/<COURSE_ID>/`

## Lesson refinement backups (when editing lessons)

If you refine lesson content via a script (lesson text updates are DB writes), use a backup-first workflow:
- Backups: `scripts/lesson-backups/<COURSE_ID>/`
- Restore:
```bash
npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/COURSE_ID/LESSON_ID__TIMESTAMP.json
```
