# QUALITY_REFRESH — ALL COURSES (Oldest → Newest)

Run started: 2026-01-29

## Scope
- All active courses (course `createdAt` ascending)
- Strict quality gates from:
  - `docs/_archive/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`
  - `2026_course_quality_prompt.md`

## Safety (rollback)
- Lesson restore:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`
- Quiz restore:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`

## Progress log
- 2026-01-29: Start. Course order captured (createdAt ascending).
- 2026-01-29: GEO_SHOPIFY_30_EN Day 7 lesson: fixed duplicate lessonId + upgraded content (definitions + metrics). Backups: `scripts/lesson-backups/GEO_SHOPIFY_30_EN/`.
- 2026-01-29: GEO_SHOPIFY_30_EN quizzes refreshed (strict): Day 2, Day 3, Day 4, Day 5, Day 6, Day 7, Day 8 (each: 7 questions, 5 APPLICATION, 2 CRITICAL, 0 RECALL). Backups: `scripts/quiz-backups/GEO_SHOPIFY_30_EN/`.
- 2026-01-29: GEO_SHOPIFY_30_EN Day 8 lesson upgraded (offer truth + mismatch metrics). Backups: `scripts/lesson-backups/GEO_SHOPIFY_30_EN/`.
- 2026-01-29: GEO_SHOPIFY_30_EN Day 9 lesson upgraded (identifiers: definitions + measurable metrics). Backups: `scripts/lesson-backups/GEO_SHOPIFY_30_EN/`.
- 2026-01-29: GEO_SHOPIFY_30_EN Day 9 quiz regenerated (strict). Backups: `scripts/quiz-backups/GEO_SHOPIFY_30_EN/`.
- 2026-01-29: Next surfaced item: GEO_SHOPIFY_30_EN Day 10 lesson quality < 70 (needs definitions + metrics).
