# Tasklist — SPORT_SALES_NETWORK_USA_2026_EN — 2026-02-03T16:00:00Z

## Environment (defaults — still must be stated explicitly before DB writes)
- [x] Production DB (`.env.local`) — MongoDB Atlas, dbName=`amanoba`
- [x] 30-day parent course (default)
- [x] Free course (default) + quizzes required (default)

## Phase A — Prereqs & scope (no DB writes)
- [x] Confirm final IDs:
  - [x] `CCS_ID = SPORT_SALES_NETWORK_USA_2026`
  - [x] `COURSE_ID = SPORT_SALES_NETWORK_USA_2026_EN`
- [x] Confirm there is no overlapping course family already in DB/repo (checked canonical directories + repo references)
- [x] Confirm target is English-speaking, US-focused multi-motion sales leaders/teams

## Phase B — Course idea (artifact)
- [x] Course positioning + outcomes captured in `/Users/moldovancsaba/Projects/amanoba_courses/process_them/docs/course_ideas/amanoba_course_sport_sales_network_usa_2026.md`
- [x] 30-day high-level syllabus in same doc (objectives, exercises, deliverables, sources)
- [x] Reviewed differentiation; the “US multi-motion + procurement-ready + partner enablement” framing is complete for seeding

## Phase C — 30-day outline (artifact)
- [x] Draft outline v1 exists in idea doc (Day 1–30; key concepts + deliverables)
- [x] Validate outline supports scenario-based quiz generation for each day (question bank for Days 1–30 already authored)

## Phase D — CCS (repo canonical)
- [x] Canonical JSON + CCS narrative exist under `docs/canonical/SPORT_SALES_NETWORK_USA_2026/`
- [x] Confirm `assessmentBlueprint` + `qualityGates` capture quiz/lesson constraints (≥7 questions, ≥5 application, ≥2 critical, 0 recall)
- [x] No further spec updates required before seeding (procedures/gates already cover requirements)

## Phase E — Seed script & course creation (dry-run before apply)
- [x] Draft/apply seed script to create CCS + EN course (dry-run first)
- [x] Once dry-run succeeds, run with `--apply` and include lesson stubs (Day 1–30)

## Phase F — Lessons / quizzes / audits
- [ ] Draft Day 1–30 lesson content + emails following canonical outline (EN, production-ready copy).
- [ ] Generate/validate 7+ quiz questions per lesson (≥5 application, 0 recall) using `/Users/moldovancsaba/Projects/amanoba_courses/process_them/docs/course_ideas/amanoba_course_sport_sales_network_usa_2026_questions.md` as seed.
- [ ] Run lesson quality + language integrity audits (`audit-lesson-quality`, `audit-lesson-language-integrity`) after each batch of lessons.
- [ ] Publish lessons (set `isActive=true`) and ensure quizzes tied via admin API/script once validated.
- [ ] Conduct final course smoke test (enroll → lessons → quizzes → certificate workflow) before takeover.

## Next command
`Run npm run seed:sport-sales-network-usa-2026-en (dry-run) and, if the plan looks good, re-run with --apply --include-lessons to seed the CCS, course, and lesson stubs.`
