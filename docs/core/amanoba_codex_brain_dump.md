# Amanoba Codex Brain Dump

**Last Updated**: 2026-05-21
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

Current in-flight branch:

- `sentinel-squad/course-ux-mantine-hardening` is continuing the Course UX commercial hardening lane from Project 12 issue `#822`.
- Latest continuation converted the public course detail page wrapper to Mantine primitives while preserving course enrollment, purchase, voting, discussion, study groups, certification, and TOC behavior.
- Current continuation converted the active course vote, discussion, and study-group components to Mantine primitives and removed stale duplicate app-level course community components.
- Current continuation also converted the enrolled lesson runtime page wrapper/actions to Mantine primitives, including lesson completion, quiz gating, saved lessons, assessment launch feedback, voting, and locked-lesson recovery.
- UI audit scripts now ignore tracked files that are staged for deletion so Mantine/foundation/layout checks stay usable during cleanup commits.
- The shared design-system repo was updated in `PROJECTS/AMANOBA_MANTINE_REFACTOR.md` to record Amanoba as in-progress, Phase 0/1 complete, current course-surface progress, and remaining high-priority gaps.
- `content/news-posts.json` may be dirty from the release/news automation lane; do not include or overwrite it unless the current task explicitly concerns news publishing.

Recently closed foundation/docs lane:

- `#371` Amanoba: Establish audit plan & SSOT inventory
- `#373` Amanoba: Document-to-code inventory for audit
- `#374` Amanoba: Audit readiness checklist & handover prep
- `#16` Multi-enrolment email scheduler.
- `#225` Lesson quiz governance cleanup.
- `#104` Cross-repo documentation federation.

Known follow-ups stay on the board, not buried in docs:

- `#65` Documentation refresh/audit backlog.
- `#749` Broader Practice Hub ideabank.

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
