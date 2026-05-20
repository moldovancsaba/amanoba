# Amanoba Codex Brain Dump

**Last Updated**: 2026-05-20
**Audience**: Codex / assistants working inside this repo
**Purpose**: Fast continuity transfer after context loss.

---

## Safety Rules

- Do not store secrets in docs.
- Verify from files and commands before claiming production, deploy, or quality status.
- Deployment path is GitHub-automated: commit and push to `origin/main`; do not run manual Vercel CLI deployment unless explicitly requested.
- The work-tracking source of truth is the MVP Factory board in `moldovancsaba/mvp-factory-control`.

## Restore Checklist

Run in this order after context loss:

1. `git fetch origin && git status -sb`
2. Read `READMEDEV.md`
3. Read `docs/HANDOVER.md`
4. Read `docs/core/agent_working_loop_canonical_operating_document.md`
5. Read `docs/status/PRODUCTION_STATUS.md`
6. Open `docs/core/DOCS_INDEX.md`
7. Open `docs/product/TASKLIST.md`
8. Open the top of `docs/product/RELEASE_NOTES.md`
9. If docs, architecture, lessons, quizzes, or layout are in scope, read `docs/architecture/layout_grammar.md`

Historical handoff snapshots in `docs/handoff/` are useful background only. Do not use them as current truth without checking the current handover, docs index, and code.

## Current Documentation Topology

- `docs/README.md`: documentation entrypoint and caveats.
- `docs/core/DOCS_INDEX.md`: canonical active-doc index.
- `docs/HANDOVER.md`: current operational handover and recent delivery notes.
- `docs/status/PRODUCTION_STATUS.md`: production health and latest route verification.
- `docs/product/TASKLIST.md`: active tracker mirror for GitHub Project 12 work.
- `docs/product/ROADMAP.md`: product direction, not execution tracking.
- `docs/product/RELEASE_NOTES.md`: user-facing shipped behavior.
- `docs/architecture/ARCHITECTURE.md` and `docs/architecture/layout_grammar.md`: architecture and UI/course grammar.

Course authoring docs live outside this repo under `amanoba_courses:process_them/docs`. The portable cross-repo reference convention is defined in `docs/core/CROSS_REPO_DOCS.md`.

## Current Product Baseline

- Current release line: `2.9.49`.
- Courses are flexible length. A course can contain one lesson or any number of lessons; `dayNumber` is a positive lesson position.
- Supported primary UI locales: `hu`, `en`, `ar`, `hi`, `id`, `pt`, `vi`, `tr`, `bg`, `pl`, `ru`, `sw`, `zh`, `es`, `fr`, `bn`, `ur`.
- Auth is SSO-only for registered users through `sso.doneisbetter.com`, with anonymous access still supported.
- Email delivery uses the shared `app/lib/email` transport layer and `EMAIL_PROVIDER` (`resend`, `smtp`, or `mailgun`).
- Weekly learner-facing updates publish to `/[locale]/blog`; `/[locale]/news` remains a compatibility alias.

## Active Work Tracking

Current documentation audit lane:

- `#371` Amanoba: Establish audit plan & SSOT inventory
- `#373` Amanoba: Document-to-code inventory for audit
- `#374` Amanoba: Audit readiness checklist & handover prep

Known follow-ups stay on the board, not buried in docs:

- `#16` Multi-enrolment email scheduler.
- `#225` Lesson quiz governance cleanup.
- `#104` Cross-repo documentation federation.
- `#65` Documentation refresh/audit backlog.

## Operational Commands

```sh
npm run docs:refresh
npm run docs:links:check
npm run docs:check
DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check
npm run type-check
npm run ui:check:foundation
npm run ui:check:layout
```

Use the smallest meaningful gate set for the change and record skipped or blocked checks in the final handoff.
