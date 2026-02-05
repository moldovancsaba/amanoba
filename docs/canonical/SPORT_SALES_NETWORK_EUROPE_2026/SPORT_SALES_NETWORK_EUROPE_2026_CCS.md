# Build a Sport Sales Network in Europe 2026 — Canonical Course Spec

**Course ID (base)**: SPORT_SALES_NETWORK_EUROPE_2026  
**Language**: English  
**Version**: 2026-02-04  
**Canonical JSON**: `docs/canonical/SPORT_SALES_NETWORK_EUROPE_2026/SPORT_SALES_NETWORK_EUROPE_2026.canonical.json`

## Purpose
Equip operators to design, launch, and scale a **three-motion** sport sales network across Europe, with partner governance, and EU/UK procurement readiness.

## Key sections (in JSON)
- **Intent**: outcomes + explicit non-goals.
- **Quality gates**: 20–30 min lessons; quizzes: ≥7 questions, ≥5 application, ≥2 critical, **0 recall**.
- **Concepts**: Europe realities (multi-country, legal/VAT/GDPR), value chain mapping, segment motioning, evidence discipline, procurement readiness, rollout cadence.
- **Procedures**:
  - Pipeline blueprint per motion
  - Partner enablement system
  - Procurement readiness handoff
- **Assessment blueprint**:
  - Day 15: Pipeline model + qualification/negotiation pack
  - Day 30: Complete blueprint + 90-day operating plan
- **Lessons**: 30-day program (see `lessons[]` in canonical JSON).

## Delivery notes
1. **Reuse**: The canonical JSON is the machine-readable source of truth; treat this file as the narrative index/guide.
2. **Assessments**: Mid-course and final deliverables should be reviewed by an instructor/admin before certification.
3. **QA**: Use the quiz-quality pipeline (validate question quality before publish) and run the ready-to-enrol smoke test from `CREATE_A_COURSE_HANDOVER.md`.

## Next steps
- Seed/build from the canonical JSON (admin UI or scripts).
- Draft lesson content following your course building rules (objective → key concepts → exercise → deliverable → sources).
- Build quizzes per lesson and validate with `scripts/question-quality-validator.ts`.
