# PRODUCTIVITY_2026 — Canonical Course Spec (CCS)

This CCS is the **language-neutral source of truth** for the course family `PRODUCTIVITY_2026_<LANG>`.

Goal: make every language variant consistent on **what is taught**, **why it matters**, **how to apply it**, and **how to assess it**—without relying on any single language’s phrasing.

## Files
- Machine-readable CCS: `docs/canonical/PRODUCTIVITY_2026/PRODUCTIVITY_2026.canonical.json`
- This narrative guide: `docs/canonical/PRODUCTIVITY_2026/PRODUCTIVITY_2026_CCS.md`

## What “Canonical” Means Here
- Canonical is **concepts + procedures + examples + assessment blueprint + bibliography**.
- Any specific language version (EN/PL/RU/…) is an **implementation** of this CCS.
- If a localized lesson deviates from CCS, we treat it as either:
  1) a **translation/localization defect**, or
  2) a **CCS evolution request** (new version), never “silently drift”.

## Non‑Negotiable Quiz Standard (Hard Gates)
These are enforced by our quiz quality pipeline and are encoded in the CCS:
- **0 RECALL** questions (hard disallow).
- Per lesson pool: **minimum 7** valid questions (can be more).
- Per lesson: **minimum 5 APPLICATION** and **minimum 2 CRITICAL_THINKING**.
- Questions and options must be **standalone** and educational (answerable without opening the lesson).
- No lesson-referential wording (e.g. “as described in the lesson…”).
- No throwaway distractors (e.g. “no impact / only theoretical / not mentioned”).
- Wrong answers must be plausible and teach why they’re wrong.

## How Quizzes Must Be Generated From CCS
For each lesson (day), generation must draw from:
1) **Concepts** (definitions + boundaries),
2) **Procedures** (checklists / rules / decision points),
3) **Canonical examples** (scenario → diagnosis → better approach),
4) **Common mistakes** (these become distractors and failure modes),
5) **Evidence** (bibliography; numeric claims must be sourced or softened).

What we do **not** generate from:
- Lesson titles
- Generic templates
- “Recall” prompts

## Localization Rules (All Languages)
Language variants must:
- Preserve the **meaning** of concepts/procedures/examples (not literal translation).
- Use consistent terminology via a glossary/term-lock strategy (e.g., Output vs Outcome vs Constraints).
- Avoid unnatural phrasing; the quiz must read as written by a native instructor.
- Never import English-only idioms if they don’t work in the local language.

## Bibliography & Evidence Policy
The CCS includes a course bibliography. If a lesson includes **numeric claims** (e.g., “10–25 minutes to refocus”), we must either:
- add a credible source for that claim, or
- remove the exact number and present it as a practical heuristic.

Evidence gaps are tracked explicitly in `PRODUCTIVITY_2026.canonical.json` under `evidenceGaps`.

## How We Use This CCS In The Audit/Fix Pipeline
When we “Audit and fix” a `PRODUCTIVITY_2026_<LANG>` course:
1) **Lesson alignment check**:
   - If lesson content is too weak to support high-quality questions, we create lesson refinement tasks and **do not invent quiz content**.
2) **Quiz QC**:
   - Remove invalid questions (recall / generic / throwaway).
   - Keep valid questions even if pool is >7.
   - Generate new questions (grounded in lesson + CCS) until minimums are met.
3) **Cross-language equivalence**:
   - Each language variant must cover the same goals/procedures and misconceptions, but not as word-for-word translations.

## Change Management (Versioning)
- Any time we change core meaning (concepts/procedures/lesson map), bump `version` in the JSON and note it in the run log.
- Any time we only improve wording in one language without changing meaning, do **not** bump CCS.

## Safety Rollback Plan (Docs)
If anything in this CCS needs to be rolled back:
- If changes are uncommitted: `git checkout -- docs/canonical/PRODUCTIVITY_2026`
- If changes are committed: `git revert <commit_sha>`

