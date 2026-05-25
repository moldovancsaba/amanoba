# Amanoba Audit: SSOT Inventory

**Last Updated**: 2026-05-25
**Board SSOT**: https://github.com/users/moldovancsaba/projects/12/views/1
**Issues Repo**: `moldovancsaba/mvp-factory-control`
**Recent Audit Issues**: `#371`, `#373`, `#374` (Done / closed on 2026-05-20)

---

## Purpose

This document maps active Amanoba documentation to the code, scripts, and production workflows it claims to describe. It is the discrepancy register for documentation audits; resolved discrepancies should be removed or rewritten instead of left as contradictory notes.

## Board Workflow SSOT

- **Live board**: Project 12, Amanoba board.
- **Status model**: `IDEABANK (SOMEDAY)` -> `Roadmap (LATER)` -> `Backlog (SOONER)` -> `Todo (NEXT)` -> `In Progress (NOW)` -> `Review (ALMOST)` -> `Done` / `Declined (NEVER)`.
- **Execution rule**: contributors should treat Project 12 as authoritative over local task files.
- **Field model**: Project 12 currently exposes the standard Status field only; Product/Agent/Type/Priority remain issue-label or older-project metadata, not Project 12 fields.
- **Issue history**: active work and audit evidence live in `moldovancsaba/mvp-factory-control`.

## Active Source-Of-Truth Documents

| Document | Purpose / Focus | Primary code or workflow references | Current drift status |
|----------|-----------------|--------------------------------------|----------------------|
| `README.md` | Product and developer quickstart. | `app/[locale]`, `app/lib`, `package.json`, `docs/architecture/ARCHITECTURE.md`. | Updated for flexible courses, provider-selectable email, and correct architecture path. |
| `READMEDEV.md` | Brain-boost ritual, SSOT rules, quality gates, doc obligations. | `package.json` scripts, Project 12 workflow docs, `docs/HANDOVER.md`. | Updated to `app/lib`, real architecture path, and email transport layer. |
| `docs/HANDOVER.md` | Current operational snapshot and recent delivery notes. | Project 12 issues, `app/lib/*`, deployment verification. | Keep current; append entries instead of rewriting historical delivery notes. |
| `docs/status/PRODUCTION_STATUS.md` | Production deployment truth and latest recorded smoke checks. | Vercel deployment, `/`, `/robots.txt`, `/sitemap.xml`, `/en/auth/signin`, feature routes. | Updated to May 2026 verification; March failed checks removed from active status. |
| `docs/architecture/ARCHITECTURE.md` | System overview, stack, routes, models, security. | Entire `app/`, `app/api`, `app/lib`, `middleware.ts`, `auth.*`. | Mostly current; continue updating when routes/models change. |
| `docs/architecture/layout_grammar.md` | Layout, course, quiz, i18n, UI adapter, and doc grammar. | `app/lib/i18n/locales.ts`, `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`, local adapter files, course/quiz models. | Updated to reference shared design/UI/UX SSOT. |
| `docs/core/TECH_STACK.md` | Current framework, provider, infra, and dependency baseline. | `package.json`, `app/lib/email/transports`, auth files, Vercel. | Updated for SSO-only auth, email providers, production domains. |
| `docs/core/DOCS_INDEX.md` | Canonical docs entrypoint. | Active docs under `docs/`. | Updated so old February context docs are historical, not current. |
| `docs/product/TASKLIST.md` | Reference mirror of current work shape. | Project 12 issues. | Rewritten as a compact mirror; live tasks remain on Project 12. |
| `docs/product/ROADMAP.md` | Future vision only. | Project 12 roadmap items. | Updated review date and current documentation-quality vision. |
| `docs/product/RELEASE_NOTES.md` | Shipped changes. | Git history, deployed releases. | Keep for shipped work only; do not store open tasks here. |
| `docs/product/DESIGN_UPDATE.md` | Amanoba adapter status, shared-SSOT alignment, exceptions, and migration backlog. | `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`, `https://github.com/sovereignsquad/general-design-system`, `app/design-system.css`, `app/globals.css`, UI checks. | Current as of May 25; shared SSOT aligned to GDS 2.3.2 with both local working-copy and portable upstream references documented. |
| `docs/product/GDS_ADOPTION_MANIFEST.md` | Local GDS enforcement contract: allowlist/banlist, protected surfaces, required contract paths, and validation commands. | `config/gds-adoption.json`, `scripts/check-gds-adoption.ts`, `scripts/check-mantine-boundaries.mjs`, UI checks. | Current as of May 25; validates that docs, contract paths, and protected-surface scope remain aligned. |
| `docs/product/GDS_EXCEPTION_REGISTER.md` | Approved local GDS exception scope, user impact, and removal conditions. | `config/gds-adoption.json`, documented exception file paths, `docs/product/DESIGN_UPDATE.md`. | Current as of May 25; exceptions are explicit and machine-checked. |

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
| Cross-repo path portability | Active docs now have a portable `amanoba_courses:process_them/docs/...` convention in `docs/core/CROSS_REPO_DOCS.md`; historical docs may keep original machine-local paths for auditability. | Keep new active docs on the canonical notation and migrate older active references opportunistically. |
| Historical docs in active folders | Some phase-complete and older handoff documents remain outside `_archive` for link stability. | Do not use them as current implementation guidance; promote/archive in a future docs hygiene pass. |
| Certification planning docs | Several certification plan variants mention master 30-day pools because they are historical design notes. | Prefer `docs/certification/CERTIFICATION_REFERENCE.md` and runtime code for current truth; archive old variants when certification docs are next in scope. |
| UI design drift | Hard-rule checks pass, but heuristic drift remains in older admin/game/profile/certificate surfaces and the app still carries transitional CSS support layers while the migration finishes. | Continue migration toward `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`; keep `docs/product/DESIGN_UPDATE.md` updated. |

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
