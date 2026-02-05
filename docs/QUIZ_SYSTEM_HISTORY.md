# Quiz system — history and reference

**Last updated**: 2026-02-04  
**Purpose**: Single entry for quiz fix releases and where to find current process/docs.

---

## Current process (use these)

- **Script**: `scripts/process-course-questions-generic.ts` — main processor. Do **not** use `scripts/fix-course-quizzes.ts` (deprecated; creates generic templates).
- **Quality rules**: `docs/_archive/reference/QUIZ_QUALITY_PIPELINE_HANDOVER.md` (handover + rollback), `docs/_archive/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` (gold-standard question form).
- **Full list of docs and scripts**: `docs/QUIZ_FIXING_DOCUMENTS_COMPLETE_LIST.md`.

---

## Past releases (summary)

| When   | What |
|--------|------|
| 2026-01-25 | System-wide quiz fix delivered: 18 courses, 388 lessons, minimum 7 questions per quiz, metadata and language consistency. See `QUIZ_SYSTEM_FIX_RELEASE_NOTE.md`, `QUIZ_SYSTEM_FIX_COMPLETE.md`, `QUIZ_SYSTEM_FIX_SUMMARY.md`, `QUIZ_FIX_DELIVERY_SUMMARY.md`, `FINAL_QUIZ_SYSTEM_DELIVERY.md`. |
| Ongoing | Quality pipeline: audit → refine → rewrite; see handover and playbook above. |

---

## Deprecated

- **`scripts/fix-course-quizzes.ts`** — **DO NOT USE**. Creates generic template questions. Use `process-course-questions-generic.ts` and the quality pipeline instead.
