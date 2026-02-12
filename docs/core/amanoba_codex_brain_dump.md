# Amanoba Codex Brain Dump (Continuity Doc)

**Last Updated**: 2026-02-12  
**Audience**: Codex / assistants working inside this repo  
**Purpose**: Fast continuity transfer after context loss.

---

## 0) Safety rules (do not violate)

- Do **not** store secrets in docs.
- Keep this document project-focused and operational.
- When uncertain, verify from files and run checks before claiming status.

---

## 1) Quick restore checklist (after context loss)

Run in this order:

1. Read `docs/core/amanoba_codex_brain_dump.md` (this file)
2. Read `docs/core/agent_working_loop_canonical_operating_document.md`
3. Read `docs/handoff/HANDOFF_CONTEXT_WINDOW_2026-02-12.md`
4. Read `docs/handoff/NEXT_WINDOW_PROMPT.md`
5. Open `docs/core/DOCS_INDEX.md`
6. Open `docs/product/TASKLIST.md`
7. Open top of `docs/product/RELEASE_NOTES.md`
8. Re-anchor local git state with `git status` and `git log -5 --oneline`

---

## 2) Documentation topology (current)

- **Active platform docs**: `amanoba/docs` (normalized into domain folders)
- **Historical docs**: `docs/_archive/**`
- **Course authoring docs moved out**: `/Users/moldovancsaba/Projects/amanoba_courses/process_them`

Normalized active folders:
- `docs/core`, `docs/product`, `docs/architecture`, `docs/features`, `docs/i18n`, `docs/sso`, `docs/certification`, `docs/deployment`, `docs/quality`, `docs/status`, `docs/handoff`, `docs/seo`

Entrypoints:
- `docs/README.md`
- `docs/core/DOCS_INDEX.md`

---

## 3) What was completed in this window (2026-02-12)

### A) Course-document separation
- Course creation/maintenance/canonical/quiz/lesson content docs were relocated to:
  - `/Users/moldovancsaba/Projects/amanoba_courses/process_them`

### B) Docs normalization
- Flat `docs/` root was reorganized into domain folders.
- New root entrypoint created: `docs/README.md`.
- Canonical index rewritten for the new structure: `docs/core/DOCS_INDEX.md`.

### C) Link integrity repair (active docs)
- Broken references in active docs were fixed.
- Active docs now validate with **zero broken markdown links**.

### D) Automation for docs integrity
- Added `scripts/docs/check-doc-links.mjs`.
- Added npm script: `docs:links:check`.
- `docs:check` now runs generation checks **and** link checks.
- CI workflow now covers generated docs + links via `docs:check`.

### E) Archive-reference stabilization continuation
- High-value historical docs under `docs/_archive/**` were normalized to current locations (including moved course docs under `/Users/moldovancsaba/Projects/amanoba_courses/process_them/...`).
- Archive-inclusive link validation now passes:
  - `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check`

### F) Course import question-mode delivery + build pass
- Course import now supports question handling mode on update:
  - `add` (add missing only),
  - `overwrite` (replace questions for imported lessons),
  - `merge` (backward-compatible API default).
- Admin course import UI now exposes `Questions: Add Only` and `Questions: Overwrite` selectors.
- Build blockers found during delivery were fixed (`CookieConsentBanner` hooks order, achievement criteria typing, email locale map typing).
- Verification pass completed:
  - `npm run build`
  - `npm run docs:check`

---

## 4) Current known state / caveats

- The working tree is intentionally large due doc migration and normalization.
- Many deleted paths in `docs/` are expected because files were moved/re-homed.
- Some active docs intentionally reference external local course docs under `/Users/moldovancsaba/Projects/amanoba_courses/process_them/...`.
- Link checker behavior:
  - Validates in-repo links strictly.
  - Can include archive docs with `DOCS_CHECK_INCLUDE_ARCHIVE=1`.
  - External filesystem links are non-fatal unless `DOCS_CHECK_EXTERNAL=1`.

---

## 5) Immediate next actions (recommended)

1. Decide long-term external-link strategy:
- keep local absolute paths,
- or publish shared docs in a dedicated repo and replace with web links.

2. Optionally tighten link policy in CI:
- set `DOCS_CHECK_EXTERNAL=1` only after external path strategy is stable.

3. Decide whether to enforce archive link validation in CI (current CI scope is active docs only).

4. If making a clean handover commit sequence, split into:
- course-doc relocation,
- docs structure normalization,
- archive-reference normalization,
- course import question-mode delivery + build stabilization,
- link checker + CI,
- handover docs updates.

---

## 6) Operational command set

- Regenerate docs metadata: `npm run docs:refresh`
- Validate docs metadata + links: `npm run docs:check`
- Links only: `npm run docs:links:check`
- Links including archive: `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check`
- Strict external filesystem link check: `DOCS_CHECK_EXTERNAL=1 npm run docs:links:check`

---

## 7) Handover package files

- `docs/handoff/HANDOFF_CONTEXT_WINDOW_2026-02-12.md`
- `docs/handoff/NEXT_WINDOW_PROMPT.md`
- `docs/product/ROADMAP.md`
- `docs/product/TASKLIST.md`
- `docs/product/RELEASE_NOTES.md`
