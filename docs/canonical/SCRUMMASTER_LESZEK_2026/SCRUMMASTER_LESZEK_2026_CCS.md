# SCRUMMASTER_LESZEK_2026 — Canonical Course Spec (CCS)

This CCS is the **language-neutral source of truth** for the course family `SCRUMMASTER_LESZEK_2026_<LANG>`.

Positioning: a practical, beginner-safe **“taste of the Agile ocean”**—enough breadth to understand the landscape, and enough depth to start operating as a Scrum Master in real situations.

## Files
- Machine-readable CCS: `docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026.canonical.json`
- This narrative guide: `docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026_CCS.md`

## What “Canonical” Means Here
- Canonical = **concepts + procedures + assessment blueprint + lesson map**.
- Language variants are implementations (HU/EN/…).
- If a localized lesson drifts from CCS, treat it as:
  1) localization defect, or
  2) CCS evolution request (new version), never silent drift.

## Non‑Negotiable Quiz Standard (Hard Gates)
Enforced by SSOT docs and encoded in the CCS:
- **0 RECALL** (`questionType=recall` is forbidden).
- Per lesson pool: **>= 7** valid questions (pool may be larger; do not delete valid questions just to cap at 7).
- Per lesson: **>= 5 APPLICATION** and **>= 2 CRITICAL_THINKING** (target).
- Questions/options must be **standalone** (random-order safe) and scenario-based.
- No lesson-referential wording (“as described in the lesson…”).
- No throwaway distractors (“no impact / only theoretical / not mentioned”).
- Distractors must be plausible mistakes a beginner Scrum team actually makes.

## Certification Goal (Amanoba)
This course is built to produce a **shareable Amanoba certificate** as proven track record.

Policy chosen for this course family:
- **Free certificate access**: for free + unpriced courses with `course.certification.enabled=true`, entitlement is **not required** to start the final exam.

Operational requirement:
- Certification availability still requires a sufficient pool (final exam uses up to 50 randomized questions from the course pool).

## Localization Rules
- Follow `docs/layout_grammar.md` and `docs/COURSE_BUILDING_RULES.md`.
- Maintain strict language integrity: no English leakage in HU course content or quizzes.
- Keep concepts/procedures aligned across languages if/when EN variant is created.

## How This CCS Feeds Lessons + Quizzes
For each day (1–30), quiz generation must draw from:
1) required concepts (definitions and boundaries),
2) procedures (step-by-step actions and decision rules),
3) common mistakes (these become distractors),
4) the day’s practical deliverable (what the learner must produce).

Avoid:
- title-based questions,
- generic templates,
- recall prompts (“What is Scrum?”).

## Versioning / Change Management
- Any change to meaning (lesson map, concepts, procedures, assessment blueprint) → bump `version` in JSON.
- Wording improvements in a single language variant (no meaning change) → do not bump CCS version.

## Safety Rollback Plan (Docs)
- Uncommitted changes: `git checkout -- docs/canonical/SCRUMMASTER_LESZEK_2026`
- Committed changes: `git revert <commit_sha>`

