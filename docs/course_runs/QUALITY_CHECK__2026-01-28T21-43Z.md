# Quality Check Run Log

**Generated:** 2026-01-28  
**Process:** Audit per `2026_course_quality_prompt.md` (read-only step A + B.1)

---

## Environment

- **Source:** `.env.local` (production MongoDB)
- **Mode:** READ-ONLY (no DB writes)
- **Scope:** All CCS families and courses (full system audit)

---

## Safety Rollback Plan (for future apply steps)

- **Lesson restore:** `npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`
- **Quiz restore:** `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`

---

## Outputs

| Artifact | Path |
|----------|------|
| CCS global audit report | `scripts/reports/ccs-global-audit__2026-01-28T21-42-37-764Z.json` |
| CCS global audit tasklist | `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-42-37-764Z.md` |
| Email communications audit report | `scripts/reports/email-communications-language-audit__2026-01-28T21-43-11-304Z.json` |
| Email communications tasklist | `docs/_archive/tasklists/EMAIL_COMMUNICATIONS_LANGUAGE_AUDIT__2026-01-28T21-43-11-304Z.md` |

---

## CCS Global Audit Summary

| Metric | Value |
|--------|-------|
| CCS families | 7 |
| Courses | 21 |
| Lessons audited | 600 |
| Lessons failing **language integrity** | 15 |
| Lessons below **quality threshold** (score < 70) | 236 |
| Lessons with **quiz errors** | 243 |
| Duplicate question sets | 68 |
| Duplicate questions to delete | 116 |
| Invalid questions | 961 |
| Courses failing catalog language integrity | 0 |
| Structural errors | 0 |

### Per–CCS highlights

- **PRODUCTIVITY_2026** (10 variants): AR has quiz + lesson issues; HU has 2 lessons with EN injection; ID has lesson quality + quiz + language issues; others (BG, EN, HI) pass.
- **DONE_BETTER_2026** (1 variant, EN): Present in audit when scoped; see course-specific report for lesson/quiz counts.
- **Other CCS:** GEO_SHOPIFY_30, AI_30_DAY, B2B_SALES_2026_30, PLAYBOOK_2026_30, SALES_PRODUCTIVITY_30 — see tasklist for any action items.

---

## Email Communications Audit

- **Unsubscribe footer:** 0 locales failing
- **Transactional templates:** 0 locales failing
- **Result:** Pass

---

## Quality Gates (from playbook)

- **Standalone questions:** No “today’s lesson” / “as described in the lesson” / title crutches.
- **Quiz minimums:** ≥7 valid questions, ≥5 APPLICATION, 0 RECALL.
- **Language integrity:** Lessons and quizzes must match course language; no EN leakage in non-EN.
- **Options:** Detailed and educational; no throwaway options; min length enforced by validator.

---

## Process State

| Field | Value |
|-------|--------|
| **Environment** | production (`.env.local`) |
| **Current courseId** | — (full system audit) |
| **Last completed step** | CCS global audit + email communications audit |
| **Next step** | Per-course: lesson refinement and/or quiz pipeline (dry-run then apply) for courses with action items |
| **Next command** | See `docs/_archive/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T21-42-37-764Z.md` for per-course next commands |
| **Blockers** | None |

---

## Next Command (example for one course)

To run quiz pipeline dry-run for a course with quiz errors:

```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70 --dry-run
```

To run lesson language integrity audit for a course with language failures:

```bash
npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course <COURSE_ID>
```

Full action items and per-lesson details are in the tasklist linked above.
