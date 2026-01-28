# Quiz Quality Pipeline Playbook (Audit → QC → Refine Lesson → Rewrite Quiz)

This is the repeatable, high-quality workflow to keep quizzes aligned with lesson content across **any course** and **any language**.

## Core principles (non‑negotiable)

- **Standalone questions**: A student must understand and answer without opening the lesson.
- **No lesson references**: No “as described in the lesson”, “follow the method in the lesson”, or title‑based shortcuts.
- **No checklist-snippet crutches**: Reject questions that quote truncated checklist snippets (e.g. `✅ ...` or quoted `...`) instead of presenting a clear scenario.
- **No recall**: `questionType: recall` is disallowed.
- **Minimum size**: at least **7** questions per lesson (pool may be larger).
- **Application minimum**: at least **5 APPLICATION** questions per lesson.
- **Educational answers**: Options must be full, concrete, and plausible; wrong answers teach common pitfalls.
- **Groundedness**: Questions must be based on what the lesson actually says; no invented facts.
- **No throwaway options**: Options like “no impact / only theoretical / not mentioned” are disallowed. Each option must be detailed (min length enforced).
- **Language integrity (hard)**:
  - Quizzes must match course language (no English leakage tokens like `goals` in non‑EN).
  - Lessons must also match course language (no English sentences/bullets inside non‑EN lessons), otherwise quiz work is blocked for that lesson.

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
    - Always **backup existing questions** before changes.
    - **Do not delete** questions just to cap at 7; only delete invalid questions, and add new ones until minimum is reached.
   - If quiz rewrite fails under strict QC, fix the generator patterns for that lesson type (do not lower standards).

5) **Re‑audit**
   - Verify count/mix/metadata and spot‑check questions for clarity.

## Commands

### CCS-wide master audit (all CCS families + all courses)
Use this when you need the **full system audit** and a single tasklist.
```bash
npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70
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
