# Amanoba Codex Brain Dump (Continuity Doc)

**Last Updated**: 2026-02-05  
**Audience**: Codex / assistants working inside this repo  
**Purpose**: A safe, repo-local “continuity snapshot” so work can resume after context/brain reset.

---

## 0) Safety rules (do not violate)

- Do **not** store secrets here (API keys, tokens, credentials, customer data, private URLs, personal notes).
- Keep this doc **project-only**: architecture, workflows, filenames, commands, conventions, “where the truth lives”.
- If something is sensitive, store it outside git (env vars, password managers), not in docs.

---

## 1) Quick restore checklist (after context loss)

Do these in order:

1. Read this file: `docs/amanoba_codex_brain_dump.md`
2. Read the agent rulebook: `agent_working_loop_canonical_operating_document.md`
3. Open the docs entrypoint: `docs/DOCS_INDEX.md`
4. Open the next-work list: `docs/TASKLIST.md`
5. See what changed recently: `docs/RELEASE_NOTES.md` (top entries)
6. Re-anchor local state: run `git status` and `git log -5 --oneline`

---

## 2) Where to start (docs entrypoint)

- Primary index: `docs/DOCS_INDEX.md`
- Generated docs helpers (regenerate any time):
  - `docs/DOCS_INVENTORY.md`
  - `docs/DOCS_CANONICAL_MAP.md`
  - `docs/DOCS_TRIAGE.md`
- Regenerate + verify generated docs:
  - `npm run docs:refresh`
  - `npm run docs:check`

---

## 3) “Canonical vs archive” policy (current)

We keep core/reference docs in `docs/` and move point-in-time or process-heavy docs into `docs/_archive/`:

- `docs/_archive/delivery/<YYYY-MM>/` — dated delivery/audit documents (historical)
- `docs/_archive/tasklists/` — generated tasklists/snapshots (historical)
- `docs/_archive/reference/` — process/runbooks/one-off plans kept for context (non-canonical)

Rule of thumb:
- If it’s “how the system works today” → keep it canonical and link from `docs/DOCS_INDEX.md`.
- If it’s “what we did then / plan we used then / evidence log” → archive it.

---

## 4) Current snapshot (what’s “recently stabilized”)

As of 2026-02-05:

- Docs inventory + canonicalization tooling lives in `scripts/docs/` (regenerate via `npm run docs:refresh`).
- Generated docs (`docs/DOCS_INVENTORY.md`, `docs/DOCS_CANONICAL_MAP.md`, `docs/DOCS_TRIAGE.md`) are enforced via `npm run docs:check` and CI.
- The docs archive policy is implemented under `docs/_archive/` (avoid mixing archive content into canonical docs).

---

## 5) Course families (CCS) + language variants

**CCS** (course family) lives in:
- `docs/canonical/<COURSE_FAMILY>/...`

**Language variants** are normal courses that share a `ccsId`:
- Example family: `PRODUCTIVITY_2026`
- Example variants: `PRODUCTIVITY_2026_HU`, `PRODUCTIVITY_2026_EN`, etc.

### UI: how to add a language variant (current)

Admin UI now supports linking courses to a course family (CCS):
- Admin → Courses → “By course family (CCS)” → open a family → **Create language variant**
- Or: Admin → Courses → Create Course → set **Course Family (CCS ID)** and **Language**
- Or: Admin → open a course → edit **Course Family (CCS ID)** in the course editor

Note: Import/export packages also support `course.ccsId` (see `docs/COURSE_PACKAGE_FORMAT.md`).

---

## 6) Generated docs guardrails (long-term)

We enforce that generated docs are committed and up to date:
- Local: `node scripts/docs/check-generated-docs.mjs`
- CI: `.github/workflows/docs-generated-check.yml`

Expected workflow:
1. Make doc structure changes.
2. Run `npm run docs:refresh`.
3. Run `npm run docs:check` (must pass).
4. Commit the generated outputs.

---

## 7) “Good way” working style (repo hygiene)

When changes span multiple concerns:
- Prefer **small, logically grouped commits** (docs hygiene vs feature changes).
- Always run:
  - `npm test`
  - `npm run type-check`
  - `npm run lint`
…before pushing.

---

## 8) When to update this brain dump

Update this file whenever any of these change:
- Canonical docs entrypoint changes (`docs/DOCS_INDEX.md`)
- Archive policy or folder names
- Core workflows/commands (`docs:refresh`, `docs:check`, release scripts)
- Course family (CCS) workflow in the UI or API
- “Source of truth” locations for specs / packages / runbooks

Minimal update protocol:
- Bump **Last Updated**
- Add/remove bullets in relevant sections

