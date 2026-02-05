# Quiz Fix Run: Newest to Oldest

Generated: 2026-01-29  
Reference: `2026_course_quality_prompt.md`, `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`  
Order: **newest course first**, then lesson-by-lesson, question-by-question where applicable.

## Gold-standard criteria (all required)
- Standalone — no "this course", "today", "the lesson"
- Grounded — tests what the lesson actually teaches
- Scenario-based — clear situation (who, context, stakes)
- Concrete deliverable/outcome — specific artifact, step, or decision
- Concrete distractors — plausible domain mistakes, not generic filler

## Courses with quiz errors (from latest audit 2026-01-29)

| Order | CourseId | lessonsWithErrors | Primary issue |
|-------|----------|-------------------|---------------|
| 1 | DONE_BETTER_2026_EN | 2 | Lesson quality / optional polish |
| 2 | SALES_PRODUCTIVITY_30_RU | 18 | |
| 3 | SALES_PRODUCTIVITY_30_HU | 30 | |
| 4 | SALES_PRODUCTIVITY_30_EN | 13 | |
| 5 | PLAYBOOK_2026_30_EN | 16 | |
| 6 | B2B_SALES_2026_30_EN | 1 | |
| 7 | GEO_SHOPIFY_30_EN | 3 | |
| 8 | GEO_SHOPIFY_30 | 30 | |
| 9 | PRODUCTIVITY_2026_VI | 19 | |
| 10 | PRODUCTIVITY_2026_PT | 19 | |
| 11 | PRODUCTIVITY_2026_PL | 18 | Lesson-referential ("in the lesson", "w lekcji") |

## Action plan

### Phase 1 — Pipeline fix (DB: delete invalid, generate valid)
Run quiz-quality-pipeline per course (newest to oldest). Pipeline uses **tiny loop**: replace invalid one-by-one, fill missing one-by-one.

- [x] DONE_BETTER_2026_EN — applied 2026-01-29 (3 deleted, 5 inserted)
- [x] PRODUCTIVITY_2026_PL — applied 2026-01-29 (1 inserted)
- [x] **Full pipeline run 2026-01-29**: all 25 courses, 720 lessons — 143 rewritten, 579 deleted, 1132 inserted. 296 lessons need refine first; 37 lessons failed rewrite (see rewrite-failures report).
- [ ] PRODUCTIVITY_2026_PT
- [ ] PRODUCTIVITY_2026_VI
- [ ] GEO_SHOPIFY_30_EN
- [ ] GEO_SHOPIFY_30
- [ ] B2B_SALES_2026_30_EN
- [ ] PLAYBOOK_2026_30_EN
- [ ] SALES_PRODUCTIVITY_30_EN
- [ ] SALES_PRODUCTIVITY_30_HU
- [ ] SALES_PRODUCTIVITY_30_RU

### Phase 2 — Seed/source fixes (where questions are in code)
- [x] DONE_BETTER_2026_EN: ensure all questions in `scripts/seed-done-better-2026-en.ts` meet gold standard (scenario-based, concrete deliverable, concrete distractors) — **done**: replaced generic distractors ("It has no effect...", "It is optional...") and rewrote bare "Why is X important?" into scenario-based questions.
- [ ] B2B_SALES: seed scripts if any

### Apply DONE_BETTER_2026_EN seed (after review)
```bash
npx tsx --env-file=.env.local scripts/seed-done-better-2026-en.ts --apply --include-quizzes
```

### Full pipeline run (2026-01-29) — done
- Report: `scripts/reports/quiz-quality-pipeline__2026-01-29T16-59-19-676Z.json`
- Rewrite failures (37 lessons): `scripts/reports/quiz-quality-pipeline__2026-01-29T16-59-19-676Z__rewrite-failures.md`
- Most failures: **PRODUCTIVITY_2026_EN** (fill phase could not reach 7 valid questions per lesson); **B2B_SALES_2026_30_EN** Day 1 (questionType undefined). Fix generator/validator for these.

### Re-run pipeline (single course or all)
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course COURSE_ID --min-lesson-score 70
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --min-lesson-score 70
```
