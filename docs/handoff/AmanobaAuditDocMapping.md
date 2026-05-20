# Amanoba Audit: SSOT Inventory

**Last Updated**: 2026-05-20
**Board SSOT**: https://github.com/users/moldovancsaba/projects/12/views/1
**Issues Repo**: `moldovancsaba/mvp-factory-control`
**Current Audit Issues**: `#371`, `#373`, `#374`

---

## Purpose

This document maps active Amanoba documentation to the code, scripts, and production workflows it claims to describe. It is the discrepancy register for documentation audits; resolved discrepancies should be removed or rewritten instead of left as contradictory notes.

## Board Workflow SSOT

- **Live board**: Project 12, Amanoba board.
- **Status model**: `IDEABANK (SOMEDAY)` -> `Roadmap (LATER)` -> `Backlog (SOONER)` -> `Todo (NEXT)` -> `In Progress (NOW)` -> `Review (ALMOST)` -> `Done` / `Declined (NEVER)`.
- **Execution rule**: contributors should treat Project 12 as authoritative over local task files.
- **Issue history**: active work and audit evidence live in `moldovancsaba/mvp-factory-control`.

## Active Source-Of-Truth Documents

| Document | Purpose / Focus | Primary code or workflow references | Current drift status |
|----------|-----------------|--------------------------------------|----------------------|
| `README.md` | Product and developer quickstart. | `app/[locale]`, `app/lib`, `package.json`, `docs/architecture/ARCHITECTURE.md`. | Updated for flexible courses, provider-selectable email, and correct architecture path. |
| `READMEDEV.md` | Brain-boost ritual, SSOT rules, quality gates, doc obligations. | `package.json` scripts, Project 12 workflow docs, `docs/HANDOVER.md`. | Updated to `app/lib`, real architecture path, and email transport layer. |
| `docs/HANDOVER.md` | Current operational snapshot and recent delivery notes. | Project 12 issues, `app/lib/*`, deployment verification. | Keep current; append entries instead of rewriting historical delivery notes. |
| `docs/status/PRODUCTION_STATUS.md` | Production deployment truth and latest recorded smoke checks. | Vercel deployment, `/`, `/robots.txt`, `/sitemap.xml`, `/en/auth/signin`, feature routes. | Updated to May 2026 verification; March failed checks removed from active status. |
| `docs/architecture/ARCHITECTURE.md` | System overview, stack, routes, models, security. | Entire `app/`, `app/api`, `app/lib`, `middleware.ts`, `auth.*`. | Mostly current; continue updating when routes/models change. |
| `docs/architecture/layout_grammar.md` | Layout, course, quiz, i18n, UI, and doc grammar. | `app/lib/i18n/locales.ts`, design-system files, course/quiz models. | Updated to 17 locales. |
| `docs/core/TECH_STACK.md` | Current framework, provider, infra, and dependency baseline. | `package.json`, `app/lib/email/transports`, auth files, Vercel. | Updated for SSO-only auth, email providers, production domains. |
| `docs/core/DOCS_INDEX.md` | Canonical docs entrypoint. | Active docs under `docs/`. | Updated so old February context docs are historical, not current. |
| `docs/product/TASKLIST.md` | Reference mirror of current work shape. | Project 12 issues. | Rewritten as a compact mirror; live tasks remain on Project 12. |
| `docs/product/ROADMAP.md` | Future vision only. | Project 12 roadmap items. | Updated review date and current documentation-quality vision. |
| `docs/product/RELEASE_NOTES.md` | Shipped changes. | Git history, deployed releases. | Keep for shipped work only; do not store open tasks here. |
| `docs/product/DESIGN_UPDATE.md` | Design-system status and migration backlog. | `app/design-system.css`, `tailwind.config.ts`, `app/globals.css`, UI checks. | Current as of May 12; remaining drift is admin/game/profile/certificate migration. |

## Feature Docs To Keep Current

| Feature doc | Runtime surface |
|-------------|-----------------|
| `docs/features/NEWS_POSTS_MVP.md` | `content/news-posts.json`, `app/lib/news.ts`, `/[locale]/blog`, `/[locale]/news`, `scripts/publish-amanoba-news.ts`. |
| `docs/features/PRACTICE_HUB_MVP_CONTRACT.md` | `app/[locale]/practice`, `app/api/practice-hub/*`, `app/lib/practice-hub*`. |
| `docs/features/SAVED_LESSONS_MVP.md` | `app/[locale]/saved`, `app/api/saved-lessons`, `app/lib/models/saved-lesson.ts`. |
| `docs/features/LEARNING_STREAK_MVP.md` | `app/lib/gamification/streak-manager.ts`, course/quiz completion routes. |
| `docs/features/FRIEND_STREAKS_MVP.md` | `app/api/friend-streaks`, `app/lib/friend-streaks.ts`, `app/lib/models/friend-streak.ts`. |
| `docs/features/QUIZ_ANSWER_EXPLANATION_PILOT.md` | `app/lib/quiz-answer-feedback.ts`, quiz submission routes, quiz question admin APIs. |
| `docs/features/ENROLMENT_AND_PREREQUISITES.md` | `app/api/courses/[courseId]/enroll`, `app/api/my-courses`, `CourseProgress`. |

## Current Known Discrepancies

| Area | Current discrepancy | Follow-up |
|------|---------------------|-----------|
| Cross-repo path portability | Some active course/quiz docs intentionally point at local `amanoba_courses/process_them` paths because the course-authoring repo is separate. | Project 12 issue `#104`: define published-link-first references with optional local paths. |
| Historical docs in active folders | Some phase-complete and older handoff documents remain outside `_archive` for link stability. | Do not use them as current implementation guidance; promote/archive in a future docs hygiene pass. |
| Certification planning docs | Several certification plan variants mention master 30-day pools because they are historical design notes. | Prefer `docs/certification/CERTIFICATION_REFERENCE.md` and runtime code for current truth; archive old variants when certification docs are next in scope. |
| UI design drift | Hard-rule checks pass, but heuristic drift remains in older admin/game/profile/certificate surfaces. | Continue incremental design-token migration and keep `docs/product/DESIGN_UPDATE.md` updated. |

## Quality Gates For Audit Work

| Command | Purpose |
|---------|---------|
| `npm run docs:check` | Regenerate doc metadata and validate active links. |
| `npm run docs:links:check` | Active-doc link validation only. |
| `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` | Archive-inclusive link validation when archive docs are touched. |
| `npm run lint` | Repo-wide static linting when code changes are involved. |
| `npm run type-check` | TypeScript contract validation when code/API surfaces change. |
| `npm test` | Vitest regression checks when runtime behavior changes. |
| `npm run build` | Route/build verification when runtime, routing, or deployment claims change. |

## Audit Closure Rules

- Update `docs/HANDOVER.md` with what changed, commands run, pass/fail results, and remaining risks.
- Mirror the same evidence in the relevant `mvp-factory-control` issue comment when board access is available.
- Commit regenerated docs metadata (`docs/core/DOCS_*`) with any docs wave.
- Remove resolved discrepancies from this file instead of preserving stale warnings.
