# QUALITY_REFRESH — ALL COURSES (Oldest → Newest)

Run started: 2026-01-29

## Environment
- [ ] Confirm `.env.local` points to intended DB (prod/staging)

## Commands (read-first order)
- Read: `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`
- Read: `2026_course_quality_prompt.md`

## Execution
- [ ] List courses by `createdAt` (oldest → newest)
- [ ] Find first failing lesson/quiz: `npx tsx --env-file=.env.local scripts/preview-first-quiz-fix.ts --min-lesson-score 70`
- [ ] Apply first required fix (after confirmation)
- [ ] Re-run `scripts/preview-first-quiz-fix.ts` and continue until no fixes remain

## Notes
- Stop after the first fix and capture a short “before/after” summary for review.

## Status
- [x] List courses by `createdAt` (oldest → newest)
- [x] GEO_SHOPIFY_30_EN Day 7 lesson fixed (canonical lessonId `GEO_SHOPIFY_30_EN_DAY_07`, duplicates deactivated; content upgraded)
- [x] GEO_SHOPIFY_30_EN quizzes regenerated: Day 2–6 + Day 7–8 (each: 7 questions; 5 APPLICATION, 2 CRITICAL, 0 RECALL)
- [x] GEO_SHOPIFY_30_EN Day 8 lesson fixed (offer truth + mismatch metrics)
- [x] GEO_SHOPIFY_30_EN Day 9 lesson fixed (identifiers: definitions + metrics)
- [x] GEO_SHOPIFY_30_EN Day 9 quiz regenerated (7 questions; 5 APPLICATION, 2 CRITICAL, 0 RECALL)
- [ ] Next surfaced item: GEO_SHOPIFY_30_EN Day 10 lesson quality < 70
  - Next command: `npx tsx --env-file=.env.local scripts/preview-first-quiz-fix.ts --min-lesson-score 70`
