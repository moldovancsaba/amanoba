# Build a Sport Sales Network in the USA 2026 — Canonical Course Spec

**Course ID**: SPORT_SALES_NETWORK_USA_2026  
**Language**: English (British default)  
**Version**: 2026-02-03  
**CCS path**: `/docs/canonical/SPORT_SALES_NETWORK_USA_2026/SPORT_SALES_NETWORK_USA_2026.canonical.json`

## Purpose
This CCS captures the 30-day blueprint for teaching sport and fitness teams how to architect, launch, and scale a multi‑motion sport sales network focused on the United States while staying procurement-ready for EU and MENA markets. It follows the **course building rules** (30-day parent course, structured lessons, single-language canonical spec) and hooks directly into the **quiz quality playbook** (questions grounded in lesson content, cognitive mix, no recall) plus the **course handover checklist** (smoke tests, translation readiness, QA). 

## Key sections
- **Intent & outcomes**: Summaries how students will build a blueprint, run three playbooks, launch partners, and deliver a 90-day rollout plan.  
- **Quality gates**: Lessons are 20–30 minutes; quizzes have ≥7 questions, ≥5 application, ≥2 critical; recall questions prohibited.  
- **Concepts**: Value chain mapping, segment motioning, partner ecosystems, procurement readiness, rollout cadence.  
- **Procedures**: Pipeline blueprinting, partner enablement, procurement handoff; each links to specific days (see JSON).  
- **Assessment blueprint**: Day 15 checkpoint (pipeline + qualification pack) and Day 30 final blueprint/90-day plan.  
- **Lessons**: 30 day entries covering buyer mapping, segmentation, ICPs, packaging, proof, direct/partner frameworks, channel stacks, territory models, economics, qualification, discovery, proposals, negotiation, partner models, procurement readiness, revenue ops, launch readiness, KPI tracking, risk playbooks, and final review.

## Delivery notes
1. **Translations & locales**: English is British (en / en-GB). Additional languages must follow language integrity rules (per `COURSE_BUILDING_RULES` §1 & layout grammar).  
2. **Sources**: All lesson sources are documented inside the JSON with URLs; reuse them to seed lesson reading lists and citations.  
3. **Assessments**: Mid-course and final submissions must be reviewed by an instructor or admin before moving to certification.  
4. **QA**: Tie into the quizzes outlined in the quality playbook (run `scripts/question-quality-validator` after the question list is ready) and perform the ready-to-enroll smoke test from `CREATE_A_COURSE_HANDOVER`.  
5. **Reuse**: This CCS is the single source of truth; any future variations (child courses, translations) must reference this file and copy the lesson metadata.

## Next steps
- Use this JSON spec to seed the course via scripts or the admin UI (see `scripts/seed-course-creation-course.ts`).  
- Draft supporting lesson content in the framework outlined (objective → key concepts → exercise → deliverable → sources).  
- Await the question list to craft 7+ validated quiz questions per lesson, applying the quiz-quality pipeline (bad-term checks, truncation, localized grammar).  
- When the course is ready, run the manual smoke test from `CREATE_A_COURSE_HANDOVER` (enroll → read lesson → quiz → progress) and record results in the QA log.
