# Amanoba — Developer Handover

This document is the single-stop operational snapshot for Amanoba. Keep it current whenever the system behavior, process, or board status changes. Append entries instead of rewriting history.

**Last Updated**: 2026-05-22
**Current Product Version**: 2.9.49 (per `package.json` and `README.md`)
**Status**: Production stable, SSO-only auth, daily lessons + gamified learning live.

## SSOT (Work Tracking)
- **Board**: https://github.com/users/moldovancsaba/projects/12/views/1. This Amanoba GitHub Project board is the single source of truth; no local task files.
- **Issues repo**: `moldovancsaba/mvp-factory-control`. All Amanoba work (P1–P4) is tracked there. Issue titles follow `Amanoba: <short description>`.
- **Product repo ≠ project repo**: Do not raise issues in `moldovancsaba/amanoba`. Find or request the related card in the board before coding.
- **Workflow**:
  1. Start: `gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10`, pick the assigned card, move it to _In Progress_, note objective.
  2. During work: update card status for blockers/milestones, keep `docs/HANDOVER.md` + relevant docs updated.
  3. Finish: document validation evidence, move card to _Done_, and mention where the change is documented.

## Current Priorities (Board snapshot — verify live status on Project 12)
- **No active assigned Amanoba issue is currently in `Todo (NEXT)` or `In Progress (NOW)`** as of the 2026-05-20 board reconciliation.
- **Recently completed / closed**
  - `#371`, `#373`, `#374`: documentation audit lane.
  - `#750`, `#752`, `#770`, `#771`: learning streaks, friend streaks, saved lessons, and quiz answer explanations.
  - `#781`, `#782`, `#783`: Practice Hub contract, learner shell, telemetry/rewards.
- **Foundation follow-ups closed on 2026-05-20**
  - `#16`: `Email/scheduler: Respect multiple enrolments` — verified in code/tests and moved to Project 12 `Done`.
  - `#225`: `Lesson quiz governance #10` — learner runtime now consumes course-level `quizPolicy`; legacy fields remain compatibility fallbacks.
  - `#104`: `Cross-repo documentation federation (amanoba + amanoba_courses)` — portable `amanoba_courses:process_them/docs/...` convention is documented in `docs/core/CROSS_REPO_DOCS.md`.
- **Release-note publishing closed on 2026-05-21**
  - `#65`: `Move Amanoba release notes into Amanoba wiki by ISO UTC date` — wiki archive is published and the exporter workflow is documented.
- **Remaining Backlog**
  - `#749`: `Amanoba ideabank: targeted practice hub for mistakes, listening, speaking, and review modes` — Project 12 Backlog.

## Documentation index (update when behavior changes)
- `README.md` — quickstart + product overview (flexible courses, gamification, Stripe).
- `READMEDEV.md` — this repo’s Brain Boost ritual (start-of-session, SSOT rules, quality gates).
- `docs/product/TASKLIST.md` — prioritized actionable items (P1–P4). Completed tasks move to `docs/product/RELEASE_NOTES.md`.
- `docs/product/RELEASE_NOTES.md` — shipped work only (per release definition).
- `docs/features/RELEASE_NOTES_WIKI.md` — GitHub wiki release-note archive format and publish workflow.
- `docs/status/PRODUCTION_STATUS.md` — deployment cadence, verification steps, and baseline route checks.
- `docs/architecture/ARCHITECTURE.md` / `docs/product/ROADMAP.md` — reference high-level architecture and future vision.
- `docs/product/ROADMAP_TASKLIST_SYSTEM_COMPARISON.md` — ensures roadmap vs tasklist alignment.

## Key runtime areas
- `app/[locale]`: localized routes for the 17 primary UI locales, including admin, auth, dashboard, games, blog/news, and course experiences.
- `app/lib/`: business logic (models, gamification, course scheduling, email, analytics).
- `components/`: UI fragments (gamification, games, charts, UI primitives).
- `scripts/`: seeds, analytics audits, doc generators, and workflow helpers (seed courses, start workers, doc checks).
- `messages/`: translation units used by `next-intl`.
- `public/`: static assets (logos, icons).
- `middleware.ts` & `auth.*`: SSO/auth wiring, guard logic, and rate limiting.

## Production verification policy
- Automation path: git push → `origin/main` → Vercel (auto). Manual CLI deployments only with explicit request.
- Post-deploy checks (per `docs/status/PRODUCTION_STATUS.md`): `/`, `/robots.txt`, `/sitemap.xml`, `/en/auth/signin`, plus the feature area touched.
- Log each verification run in `docs/product/RELEASE_NOTES.md` when releasing for public consumption.
- Keep release numbering consistent: 2.9.49 is the current active release; bump patch/minor/major via `scripts/versioning`.

## Known issues / risks
- Legacy lesson quiz fields (`quizMaxWrongAllowed`, `defaultLessonQuizQuestionCount`, `lesson.quizConfig`) still exist for import/export and old payload compatibility; runtime authority is `course.lessonQuizPolicy`.
- Historical docs may still contain absolute `amanoba_courses` paths for auditability. Active docs should use `amanoba_courses:process_them/docs/...` per `docs/core/CROSS_REPO_DOCS.md`.
- Project 12 currently uses the standard Status field; richer Product/Agent/Type/Priority metadata remains on issue labels or older MVP Factory project views.

## Quick verification commands (run before marking work done)
- `npm run lint` (ESLint 9 + Next.js config).
- `npm test` (Vitest).
- `npm run type-check` (TypeScript no emit).
- `npm run docs:check` (inventory + link checks) when touching docs/architecture.
- `npm run build` (ensures Next.js build without warnings).

## Next steps
1. Scope `#749` into concrete Practice Hub mode slices before implementation; keep it Backlog until prioritized.
2. Keep wiki release notes grouped by ISO UTC date for public-facing releases.
3. Keep `docs/HANDOVER.md` appended whenever runtime behavior, process, production status, or board state changes.

---

## Dark-mode readability hardening (2026-05-22)

### What changed
- Added `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/COLOR_MODES_READABILITY.md` as the shared SSOT rule for dark/light mode ownership, contrast, mixed-mode exceptions, and human-first readability.
- Updated Amanoba's Mantine theme defaults so dark-mode `Text`, `Title`, `Card`, `Paper`, inputs, overlays, tabs, badges, and code surfaces render readable colors by default instead of relying on page-by-page overrides.
- Bridged the legacy global CSS token layer to the active Mantine dark-mode tokens so global selectors such as `h1`-`h4`, rich text, and legacy `.ds-*` helpers no longer default to black text on dark surfaces.
- Added dark-mode lesson prose styling for rich lesson content rendered through `TypographyStylesProvider`, including generated headings, paragraphs, lists, links, blockquotes, and inline code.
- Removed hard-coded Mantine light-mode props from active course detail, course discussion, study group, quiz, cookie-consent, and markdown-editor surfaces.
- Converted the public localized landing page from legacy Tailwind markup to Mantine primitives so homepage headings, hero copy, navigation, CTAs, and feature cards inherit dark-mode theme readability.
- Tightened `npm run ui:check:foundation` so hard-coded Mantine props like `bg="white"`, `bg="gray.0"`, `c="black"`, and `c="ink.9"` are blocker findings outside documented exception files.
- Removed accidental light-mode `gray.0` referral panels from the dark profile surface.
- Updated `docs/product/DESIGN_UPDATE.md` so Amanoba points at GDS `1.3.3` and treats color-mode readability as a hard migration rule.

### Verification
- `npx eslint app/lib/ui/mantine-theme.ts app/components/ReferralCard.tsx app/[locale]/profile/[playerId]/page.tsx app/[locale]/blog/page.tsx app/[locale]/courses/page.tsx app/[locale]/my-courses/page.tsx app/components/LearnerPageHeader.tsx` ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run docs:refresh` ✅ pass, generated inventory/map updated
- `npm run docs:links:check` ✅ pass
- `npm run build` ✅ pass
- `git diff --check` ✅ pass

---

## Release notes wiki migration (2026-05-21)

### What changed
- Added `scripts/docs/export-release-notes-wiki.ts` and `npm run release-notes:wiki:export` to generate GitHub wiki pages from the repo release-note mirror.
- Documented the canonical wiki page format and publish workflow in `docs/features/RELEASE_NOTES_WIKI.md`.
- Updated `docs/product/RELEASE_NOTES.md` to point to the Amanoba GitHub wiki as the canonical release-note archive while preserving the repo file as a local mirror and migration seed.

### Verification
- `npm run release-notes:wiki:export -- --out=tmp/release-notes-wiki` ✅ generated 24 dated wiki pages plus one undated legacy page.
- `npx eslint scripts/docs/export-release-notes-wiki.ts` ✅ pass
- `npm run type-check` ✅ pass
- Wiki publish ✅ pushed `6870c70` to `https://github.com/moldovancsaba/amanoba.wiki.git` on `master`.
- Public wiki checks ✅ `https://github.com/moldovancsaba/amanoba/wiki` and `https://github.com/moldovancsaba/amanoba/wiki/Release-Notes-2026-05-20T00-00-00.000Z` return 200.

## Course UX Mantine hardening pass (2026-05-21)

### Follow-up course detail refactor (2026-05-21)

#### What changed
- Converted the public course detail page wrapper from legacy Tailwind page markup to Mantine primitives for the sticky header, loading/not-found states, hero media, overview, learner value cards, leaderboard, curriculum list, desktop enrollment sidebar, prerequisite notices, premium state, progress indicator, certification callout placement, and mobile CTA.
- Preserved existing enrollment, purchase, entitlement, voting, discussion, study-group, lesson table-of-contents, and analytics behavior.
- Left nested discussion, study-group, vote, and logo components under their own component ownership; this pass removes page-level legacy layout from the course detail route.

#### Verification
- `npx eslint app/[locale]/courses/[courseId]/page.tsx` ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run build` ✅ pass
- `npm run docs:links:check` ✅ pass
- `git diff --check` ✅ pass
- Local browser smoke on `http://localhost:3000/en/courses/GENERATIVE_AI_APPS_AGENTS_2026_EN/day/1` ✅ anonymous recovery UI renders `Sign in required`, `Sign in`, and `Back to Course`.

### Follow-up course community component refactor (2026-05-21)

#### What changed
- Converted the active course voting, discussion, and study-group components from legacy Tailwind markup and lucide icons to Mantine primitives and Tabler icons.
- Replaced browser alert/confirm feedback in those active components with Mantine notifications and confirm modals.
- Removed stale duplicate `app/components/CourseDiscussion.tsx` and `app/components/CourseStudyGroups.tsx` files; active routes use `components/CourseDiscussion.tsx` and `components/CourseStudyGroups.tsx`.
- Hardened UI audit scripts so they skip files staged for deletion but still present in `git ls-files` before commit.
- Updated `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/AMANOBA_MANTINE_REFACTOR.md` so the shared SSOT records Amanoba as in-progress, Phase 0/1 as complete, active guardrails, and the remaining high-priority migration gaps.

#### Verification
- `npx eslint components/ContentVoteWidget.tsx components/CourseDiscussion.tsx components/CourseStudyGroups.tsx scripts/check-mantine-boundaries.mjs scripts/audit-ui-foundation.ts scripts/audit-layout-grammar-ui.ts app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx` ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `git diff --check` ✅ pass

### Follow-up enrolled lesson runtime refactor (2026-05-21)

#### What changed
- Converted the enrolled lesson runtime page from legacy Tailwind page markup and lucide icons to Mantine primitives and Tabler icons.
- Replaced browser alert feedback for quiz gating, lesson completion failures, and assessment launch failures with Mantine notifications.
- Preserved lesson completion, required-quiz gating, save/remove saved lesson, previous/next navigation, assessment launch, progress display, voting, and locked-lesson recovery behavior.
- Kept rich lesson body rendering inside Mantine `TypographyStylesProvider`, which is the allowed exception for course/editorial HTML content during the Mantine-only migration.

#### Verification
- `npx eslint app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx` ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `git diff --check` ✅ pass

### What changed
- Rebuilt the public course catalog surface with Mantine primitives for search, language filtering, course cards, skeleton loading, empty/error states, enrol/continue actions, and course enrol telemetry.
- Added learner recovery states for protected lesson and quiz routes so anonymous learners see sign-in/back/retry actions instead of raw `Unauthorized` or generic not-found dead ends.
- Added Mantine course-builder guidance to new-course and course-editor admin surfaces covering basics, lessons, quiz policy, certification, publish readiness, short courses, and the open-ended 1-to-unlimited lesson model.
- Fixed a duplicated course-detail data load and converted the certification callout/actions to Mantine primitives while preserving existing course discussion and study-group behaviour.
- Added client telemetry calls for lesson completion and lesson quiz answer submission.
- Converted the cookie consent banner to compact Mantine controls and moved the course detail mobile CTA to Mantine `Affix`/`Card`/`Button`, keeping the consent-height offset so mobile CTAs no longer sit underneath the consent surface.
- Added active course-creation package/playbook docs and refreshed generated docs inventory/canonical map/triage so the docs checker has the current docs baseline.

### Verification
- `npx eslint app/[locale]/courses/page.tsx app/[locale]/courses/[courseId]/page.tsx app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx app/[locale]/admin/courses/new/page.tsx app/[locale]/admin/courses/[courseId]/page.tsx` ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run build` ✅ pass
- Local browser checks on `http://localhost:3000/en/courses`, `/en/courses/GENERATIVE_AI_APPS_AGENTS_2026_EN`, `/en/courses/GENERATIVE_AI_APPS_AGENTS_2026_EN/day/1`, and `/en/courses/GENERATIVE_AI_APPS_AGENTS_2026_EN/day/1/quiz` ✅ render without console errors; anonymous lesson/quiz routes show recovery CTAs.

### Rollback
- Baseline: `origin/main` before branch `sentinel-squad/course-ux-mantine-hardening`.
- Rollback before merge: discard this branch and return to `main`.
- Rollback after merge: revert the course UX hardening commit, then rerun `npm run type-check`, targeted ESLint, and the three UI checks above.

## Foundation hardening pass (2026-05-20)

### What changed
- Revalidated multi-enrolment daily lesson email behavior against the existing scheduler regression test: one learner enrolled in multiple active courses receives one email per course/day, and reruns dedupe by each progress row's `emailSentDays`.
- Updated the learner lesson page so quiz gating, button state, and required-quiz messaging read the resolved `quizPolicy` returned by the day API before falling back to the legacy `lesson.quizConfig` compatibility projection.
- Added a focused unit test for `resolveCourseQuizPolicy` proving that `course.lessonQuizPolicy` wins over legacy course-level fallbacks.
- Documented the cross-repo docs contract in `docs/core/CROSS_REPO_DOCS.md` and updated active docs to prefer `amanoba_courses:process_them/docs/...` over machine-local absolute paths.

### Verification
- `npm test -- __tests__/unit/email-scheduler.test.ts __tests__/unit/course-quiz-policy.test.ts` ✅ pass
- `npx eslint app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx app/lib/models/course.ts app/lib/course-quiz-policy.ts __tests__/unit/course-quiz-policy.test.ts __tests__/unit/email-scheduler.test.ts` ✅ pass
- `npm run type-check` ✅ pass
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `npm run build` ✅ pass
- Production route smoke via `curl -L`: `/`, `/robots.txt`, `/sitemap.xml`, `/en/auth/signin`, `/en/blog`, `/en/news`, `/en/courses`, `/en/practice`, `/en/saved`, `/en/editor/courses` ✅ reachable; editor route redirects anonymous users to sign-in.
- `npm run docs:check` ✅ pass after commit, when refreshed generated docs were part of the baseline.

### Board state
- `#16`, `#104`, and `#225` were commented, closed as completed, and moved to Project 12 `Done`.
- `#65` and `#749` remain Project 12 `Backlog (SOONER)`.

## Project 12 board reconciliation (2026-05-20)

### What changed
- Added the current repo-relevant Amanoba issues to Project 12, which was empty before this reconciliation.
- Moved shipped issues to `Done` and closed them with evidence comments:
  - `#371`, `#373`, `#374`
  - `#750`, `#752`, `#770`, `#771`
  - `#781`, `#782`, `#783`
- Added active follow-ups to Project 12 `Backlog (SOONER)`:
  - `#16`, `#65`, `#104`, `#225`, `#749`
- Confirmed Project 12 only exposes the standard Status field; Product/Agent/Type/Priority are not Project 12 fields and remain represented through labels or older project views.

### Verification run
- `gh project item-list 12 --owner moldovancsaba --format json --limit 50` ✅ returned 15 items with expected `Done` / `Backlog (SOONER)` statuses.
- `gh issue list --repo moldovancsaba/mvp-factory-control --state open --search "Amanoba" --limit 30` ✅ no longer returns the completed docs/streak/saved-lessons/Practice Hub issues.

---

## Code-comment consistency sweep (2026-05-20)

### What changed
- Removed remaining stale debug-style auth comments/log labels from live SSO and NextAuth code.
- Gated role/session callback console logging to non-production in `auth.config.ts`.
- Reworded the background worker comment so the missing challenge worker is described as planned work, not a stale phase TODO.

### Verification run
- Targeted stale-term scan for `DEBUG:`, stale locale counts, Facebook auth copy, Resend-only comments, and old architecture paths ✅ clean in live source scope.
- `git diff --check` ✅ pass.
- `npx eslint --no-warn-ignored auth.config.ts app/api/auth/sso/callback/route.ts scripts/start-workers.ts` ✅ pass.

---

## Documentation source-of-truth refresh (2026-05-20)

### What changed
- Refreshed active documentation around the current platform baseline: flexible course lengths, 17 primary UI locales, SSO-only auth, provider-selectable email transport, live production domains, and Blog/News publishing.
- Rewrote `docs/i18n/I18N_SETUP.md` as a current reference instead of an old migration checklist.
- Updated `docs/product/RELEASE_NOTES.md` so already-live Blog/News work is no longer listed as unreleased.

- Marked older handoff, certification, i18n, audit, and next-phase planning docs as historical where they still contain fixed 30-day or old locale assumptions.
- Rebuilt `docs/core/amanoba_codex_brain_dump.md`, `docs/core/DOCS_INDEX.md`, `docs/product/TASKLIST.md`, `docs/product/ROADMAP.md`, `docs/status/PRODUCTION_STATUS.md`, and `docs/handoff/AmanobaAuditDocMapping.md` around the current docs audit lane.

### Notes / risk
- Some historical logs still intentionally preserve old wording for auditability. Current implementation truth is the docs index, this handover, active architecture docs, and the code.
- Cross-repo course documentation paths remain a known portability issue under `#104`.

### Verification run
- `npm run docs:refresh` ✅ pass; regenerated docs inventory/canonical map/triage.
- `npm run docs:links:check` ✅ pass (95 active files checked).
- `git diff --check` ✅ pass after Markdown whitespace normalization.
- `npm run docs:check` ⚠️ expected pre-commit stop because regenerated docs files differ from `HEAD`; rerun after committing regenerated docs.

---

## Version, architecture, and design-system hygiene update (2026-05-12)

### What changed
- Bumped the active product version to `2.9.49` across `package.json`, `package-lock.json`, `README.md`, architecture, tech stack, roadmap, release notes, and this handover.
- Added `docs/core/CODING_STANDARDS.md` as the active coding standard for flexible course-length assumptions, comments, TypeScript boundaries, version alignment, and design-system usage.
- Updated `READMEDEV.md`, `docs/architecture/layout_grammar.md`, `docs/architecture/ARCHITECTURE.md`, `docs/product/DESIGN_UPDATE.md`, and `docs/product/RELEASE_NOTES.md` so contributors have one current rule set for token-driven UI work and release notes.
- Removed hard-coded design drift from shared learner/editor surfaces by moving success/warning/error states and editor portal chrome to design-system utilities and semantic tokens.
- Mapped Tailwind secondary colours to `app/design-system.css` variables and added reusable `.ds-status-*`, `.ds-button-*`, and `.ds-text-*` utilities in `app/globals.css`.

### Notes / risk
- The broader admin and game areas still contain legacy generic palette classes; they are documented as remaining migration targets rather than being refactored wholesale in this pass.
- Historical release notes, archive handoffs, and seed scripts still mention 30-day courses where they refer to old content or course titles. Active product docs now describe flexible course length.

### Verification run (2026-05-12)
- `npm run ui:check:foundation` ✅ pass.
- `npm run ui:check:layout` ✅ pass.
- `npm run type-check` ✅ pass.
- `npm run lint` ✅ pass.
- `npm test` ✅ pass.
- `npm run docs:refresh` ✅ pass.
- `npm run docs:links:check` ✅ pass.
- `npm run build` ✅ pass.
- `npm run docs:check` ✅ pass after committing regenerated docs inventory files.

---

## Audit update (2026-03-10)

### Consolidated doc/code discrepancies
- **Version drift resolved later**: active docs now align on 2.9.49 and Next.js 15.5.18; this March audit note is retained as historical context.
- **Lesson quiz governance still in transition**: runtime authority is course-level (`lessonQuizPolicy` resolver), but compatibility surfaces remain in APIs/UI as `lesson.quizConfig` fields and import/export payload compatibility (`app/api/admin/courses/import/route.ts`, `app/api/admin/courses/[courseId]/export/route.ts`, learner day/quiz routes).
- **Cross-repo portability risk**: active docs should use `amanoba_courses:process_them/docs/...` per `docs/core/CROSS_REPO_DOCS.md`; historical docs may still preserve old machine-local paths for auditability.
- **Scheduler reality vs risk note**: `app/lib/courses/email-scheduler.ts` already iterates per active enrolment and deduplicates by `emailSentDays`, so the risk text should be interpreted as broader multi-enrolment behavior validation, not absence of dedupe logic.

### Verification run (2026-03-10)
- `npm run lint` ✅ pass.
- `npm test` ❌ fail (`__tests__/smoke/courses.test.ts`: expected 200, received 500 from `/api/courses` route).
- `npm run type-check` ✅ pass.
- `npm run docs:check` ❌ fail (generated docs files out of date: `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, `docs/core/DOCS_TRIAGE.md`).
- `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` ✅ pass (`177 files checked`).
- `npm run build` ✅ pass (Next.js production build completed; routes generated successfully).

### Verification delta (2026-03-10, follow-up run)
- `npm test` ✅ pass after updating smoke mock chain in `__tests__/smoke/courses.test.ts` (added `populate` and `ContentVote` aggregate mock).
- `npm run docs:refresh` ✅ pass.
- `npm run docs:check` ❌ still fails by policy because `scripts/docs/check-generated-docs.mjs` enforces zero git diff for generated docs files and this working tree intentionally contains changes in:
  - `docs/core/DOCS_CANONICAL_MAP.md`
  - `docs/core/DOCS_INVENTORY.md`
  - `docs/core/DOCS_TRIAGE.md`

## Dependency sweep update (2026-04-26)

### Applied minimal upgrade set
- Upgraded the Next/Auth alignment set in [`/Users/moldovancsaba/Projects/amanoba/package.json`](/Users/moldovancsaba/Projects/amanoba/package.json):
  - `next` `^15.5.11` -> `^15.5.15`
  - `@next/env` `^15.5.0` -> `^15.5.15`
  - `eslint-config-next` `15.5.11` -> `^15.5.15`
  - `next-auth` `^5.0.0-beta.29` -> `^5.0.0-beta.31`
  - `@auth/mongodb-adapter` `^3.11.0` -> `^3.11.2`
- Updated lockfile to keep the framework/auth stack aligned on the same patch line.
- Refreshed [`/Users/moldovancsaba/Projects/amanoba/docs/core/TECH_STACK.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/TECH_STACK.md) so documented versions match the repo again.

### Verification run (2026-04-26)
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run type-check` ✅ pass
- `npm run build` ✅ pass
- `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` ✅ pass
- `npm run docs:check` ❌ fail because `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, and `docs/core/DOCS_TRIAGE.md` are regenerated and changed in the working tree; the checker requires those generated docs to be committed with the rest of the doc changes

### Notes / risk
- Install emitted an engine warning because this shell used Node `25.8.2`, while the repo declares `>=20.0.0 <25.0.0`. The app still installed and verified successfully, but future dependency work should use a supported Node 20-24 runtime to avoid misleading engine noise.

## Dependency sweep update (2026-05-10)

### Applied minimal upgrade set
- Upgraded the Next patch-alignment trio in [`/Users/moldovancsaba/Projects/amanoba/package.json`](/Users/moldovancsaba/Projects/amanoba/package.json):
  - `next` `^15.5.15` -> `^15.5.18`
  - `@next/env` `^15.5.15` -> `^15.5.18`
  - `eslint-config-next` `^15.5.15` -> `^15.5.18`
- Applied two low-risk support updates:
  - `@types/node` `^20` -> `^20.19.40`
  - `postcss` `^8.4.47` -> `^8.5.14`
- Updated [`/Users/moldovancsaba/Projects/amanoba/package-lock.json`](/Users/moldovancsaba/Projects/amanoba/package-lock.json) and refreshed [`/Users/moldovancsaba/Projects/amanoba/docs/core/TECH_STACK.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/TECH_STACK.md) to match the installed versions.

### Verification run (2026-05-10)
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run type-check` ✅ pass
- `npm run build` ✅ pass

### Notes / risk
- This sweep intentionally avoided higher-risk migrations such as Next 16, React 19, Tailwind 4, TypeScript 6, MongoDB 7, Mongoose 9, and Stripe 22.
- `npm install` completed on supported Node `24.15.0` / npm `11.12.1`, but the repo still reports `18 vulnerabilities` in transitive dependencies. That is pre-existing dependency debt, not introduced by this patch-only update.

## Design system + docs refactor update (2026-05-10)

### What changed
- Repaired what was then the local UI foundation; current design/UI/UX authority is now `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`, and the files below are legacy adapter surfaces:
  - Added surface/text/border and Google-brand token aliases in [`/Users/moldovancsaba/Projects/amanoba/app/design-system.css`](/Users/moldovancsaba/Projects/amanoba/app/design-system.css)
  - Added shared shell/panel/text utility classes in [`/Users/moldovancsaba/Projects/amanoba/app/globals.css`](/Users/moldovancsaba/Projects/amanoba/app/globals.css)
  - Reworked [`/Users/moldovancsaba/Projects/amanoba/app/components/ui/button.tsx`](/Users/moldovancsaba/Projects/amanoba/app/components/ui/button.tsx) and [`/Users/moldovancsaba/Projects/amanoba/app/components/ui/card.tsx`](/Users/moldovancsaba/Projects/amanoba/app/components/ui/card.tsx) to use brand-aligned variants instead of generic template colors
- Removed UI-foundation blocker literals from [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/auth/signin/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/auth/signin/page.tsx) by moving Google colors behind token variables and reusing shared button variants.
- Refactored the memory game chrome in [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/games/memory/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/games/memory/page.tsx) and [`/Users/moldovancsaba/Projects/amanoba/app/components/games/MemoryGame.tsx`](/Users/moldovancsaba/Projects/amanoba/app/components/games/MemoryGame.tsx) away from hard-coded indigo/gray UI toward centralized design tokens.
- Updated stale documentation and audit plumbing:
  - [`/Users/moldovancsaba/Projects/amanoba/docs/product/DESIGN_UPDATE.md`](/Users/moldovancsaba/Projects/amanoba/docs/product/DESIGN_UPDATE.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/architecture/layout_grammar.md`](/Users/moldovancsaba/Projects/amanoba/docs/architecture/layout_grammar.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/architecture/ARCHITECTURE.md`](/Users/moldovancsaba/Projects/amanoba/docs/architecture/ARCHITECTURE.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/README.md`](/Users/moldovancsaba/Projects/amanoba/docs/README.md)
  - Audit scripts now write to `docs/quality/*` instead of obsolete `docs/UI_*` paths.
- Regenerated [`/Users/moldovancsaba/Projects/amanoba/docs/quality/UI_FOUNDATION_AUDIT.md`](/Users/moldovancsaba/Projects/amanoba/docs/quality/UI_FOUNDATION_AUDIT.md) and [`/Users/moldovancsaba/Projects/amanoba/docs/quality/UI_LAYOUT_GRAMMAR_AUDIT.md`](/Users/moldovancsaba/Projects/amanoba/docs/quality/UI_LAYOUT_GRAMMAR_AUDIT.md).

### Verification run (2026-05-10)
- `npm run lint` ✅ pass
- `npm run type-check` ✅ pass
- `npm run build` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `npm run ui:audit:foundation` ✅ pass
- `npm run ui:audit:layout` ✅ pass

### Notes / remaining work
- The hard-rule foundation audit is now clean, but the heuristic layout audit still reports large migration backlog across admin, profile, certificate, and several game pages. Those are next-step refactors, not resolved by this foundation pass.
- Standalone `npm run type-check` initially failed because `.next/types` was stale in the working tree; rerunning it after `npm run build` regenerated the route types and cleared the issue.

## Board execution ordering update (2026-05-10)

### What changed
- Reviewed the live MVP Factory Board state for Amanoba against the repo handover snapshot and current open issues.
- Confirmed the immediate execution sequence remains:
  - `#2` multi-course dashboard/course-page work first because it is already in `Review`
  - `#16` multi-enrolment scheduler/email next
  - audit prep issues `#371`, `#373`, `#374` next for board/doc SSOT hygiene
  - `#225` after that for lesson-quiz governance doc alignment
  - `#65` stays behind the above until the release-notes wiki direction is explicitly reconfirmed
- Wrote GitHub issue comments in `moldovancsaba/mvp-factory-control` on `#16`, `#225`, `#371`, `#373`, `#374`, and `#65` so the recommended execution order and intended board field targets are recorded in the issue history even though direct project-field mutation was unavailable.

### Blocker / risk
- Direct Project field updates were blocked in that session by GitHub GraphQL rate limiting on the authenticated account even though REST quota remains available.
- `gh api rate_limit` reported `graphql.remaining = 0` with reset at `2026-05-10 15:07:02 CEST`.
- Because project item creation and field mutation for GitHub Projects V2 use GraphQL, the board itself could not be updated in this session.

### Follow-up
- After the GraphQL quota resets, rerun:
  - `./scripts/mvp-factory-set-project-fields.sh 16 --status "Todo (NEXT)"`
  - `./scripts/mvp-factory-set-project-fields.sh 225 --status "Todo (NEXT)" --agent "Tribeca" --product "amanoba" --type "Docs" --priority "P1"`
  - `./scripts/mvp-factory-set-project-fields.sh 371 --status "Todo (NEXT)" --agent "Tribeca" --product "amanoba" --type "Docs" --priority "P1"`
  - `./scripts/mvp-factory-set-project-fields.sh 373 --status "Todo (NEXT)" --agent "Tribeca" --product "amanoba" --type "Docs" --priority "P1"`
  - `./scripts/mvp-factory-set-project-fields.sh 374 --status "Todo (NEXT)" --agent "Tribeca" --product "amanoba" --type "Docs" --priority "P1"`

## Project 12 issue migration update (2026-05-10)

### What changed
- Collected Amanoba-related issues from `moldovancsaba/mvp-factory-control` using GitHub REST search with query scope `repo:moldovancsaba/mvp-factory-control amanoba in:title,body`.
- Excluded `amanoba_courses:` Idea Bank issues from this migration pass so Project 12 stays focused on Amanoba rather than cross-repo course-pipeline backlog.
- Added the resulting **47** issues to GitHub Project 12 (`https://github.com/users/moldovancsaba/projects/12/views/1`) with batched `addProjectV2ItemById` mutations.

### Verification
- Queried Project 12 items after insertion and matched project contents against the expected issue-number set.
- Expected Amanoba issues migrated: `47`
- Matching Amanoba issues now present in Project 12: `47`
- Missing after verification: `0`

### Notes
- This migration step added/ensured issue membership in Project 12. It did not remove cards from any other GitHub project.

## News posts MVP update (2026-05-11)

### What changed
- Added a public localized news surface:
  - `/[locale]/news`
  - `/[locale]/news/[slug]`
- Published the first weekly `What's new` post from the `amanoba-news` automation output in [`/Users/moldovancsaba/Projects/amanoba/content/news-posts.json`](/Users/moldovancsaba/Projects/amanoba/content/news-posts.json).
- Added [`/Users/moldovancsaba/Projects/amanoba/app/lib/news.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/news.ts) as the static content reader with English fallback for enabled locales.
- Added automation publishing support through [`/Users/moldovancsaba/Projects/amanoba/scripts/publish-amanoba-news.ts`](/Users/moldovancsaba/Projects/amanoba/scripts/publish-amanoba-news.ts) and `npm run news:publish`.
- Added a public `What's new` menu link to the landing page and a `What's New` dashboard shortcut.
- Added news index and post URLs to the sitemap.
- Documented the contract in [`/Users/moldovancsaba/Projects/amanoba/docs/features/NEWS_POSTS_MVP.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/NEWS_POSTS_MVP.md).

### Verification run
- `node -e "JSON.parse(require('fs').readFileSync('content/news-posts.json','utf8')); console.log('news json ok')"` ✅
- `npx eslint --no-warn-ignored app/lib/news.ts app/[locale]/news/page.tsx app/[locale]/news/[slug]/page.tsx app/[locale]/page.tsx app/[locale]/dashboard/page.tsx app/sitemap.ts scripts/publish-amanoba-news.ts` ✅
- `npm run type-check` ✅
- `npm run news:publish -- --file content/news-posts.json --dry-run` ✅
- `npm run news:publish -- --file content/news-posts.json` ✅
- `npm run docs:refresh` ✅
- `npm run docs:links:check` ✅
- `npm run build` ✅

## Blog publishing correction (2026-05-12)

### What changed
- Added canonical public blog routes for automation-published weekly updates:
  - `/[locale]/blog`
  - `/[locale]/blog/[slug]`
- Kept the existing `/[locale]/news` and `/[locale]/news/[slug]` routes as compatibility aliases backed by the same content source.
- Pointed the public landing navigation and learner dashboard shortcut to `Blog` instead of the news-only surface.
- Added `npm run blog:publish -- --file <post.json>` as the canonical automation publisher command while preserving `npm run news:publish`.
- Updated the `amanoba-news` local automation prompt so future runs must publish through the repo publisher and report the resulting `/en/blog/<slug>` URL instead of stopping at a draft.
- Backfilled the existing May 11 weekly update so it renders as a blog post at `/en/blog/2026-05-11-smarter-review-saved-lessons-streaks` after deployment.

### Verification run
- `npm run blog:publish -- --file content/news-posts.json --dry-run` ✅
- `npx eslint --no-warn-ignored app/lib/news.ts app/[locale]/blog/page.tsx app/[locale]/blog/[slug]/page.tsx app/[locale]/page.tsx app/[locale]/dashboard/page.tsx app/sitemap.ts scripts/publish-amanoba-news.ts` ✅
- `node -e "const posts=require('./content/news-posts.json'); console.log(posts[0].slug); console.log(posts[0].translations.en.headline)"` ✅
- `npm run build` ✅
- `npm run type-check` ✅ after `npm run build` regenerated `.next/types`
- `npm run docs:refresh` ✅
- `npm run docs:links:check` ✅
- Local dev server (`npm run dev`, port 3001) route checks:
  - `curl -I http://localhost:3001/en/blog` ✅ 200
  - `curl -I http://localhost:3001/en/blog/2026-05-11-smarter-review-saved-lessons-streaks` ✅ 200
  - `curl -s http://localhost:3001/sitemap.xml | rg -n "/en/blog|/en/news"` ✅ includes blog and news URLs

## Research ideabank + board normalization update (2026-05-10)

### What changed
- Researched feature patterns from major learning-platform leaders using official product and help sources across:
  - Coursera
  - LinkedIn Learning
  - Udemy Business
  - Duolingo
  - Khan Academy
  - Moodle
  - Codecademy
- Reorganized GitHub Project 12 (`amanoba`) so the board status workflow now mirrors the example structure from `sovereignsquad/projects/3`:
  - `IDEABANK (SOMEDAY)`
  - `Roadmap (LATER)`
  - `Backlog (SOONER)`
  - `Todo (NEXT)`
  - `In Progress (NOW)`
  - `Review (ALMOST)`
  - `Done`
  - `Declined (NEVER)`
- Rewrote the existing Amanoba issue bodies in `moldovancsaba/mvp-factory-control` into a consistent structured format aligned to the example quality bar from `sovereignsquad/train#17`:
  - `Objective`
  - `Unified Context`
  - `Problem`
  - `Goal`
  - `Scope`
  - `Execution Prompt`
  - `Constraints`
  - `Acceptance Checks`
  - `Dependencies`
  - `Risks`
  - `Delivery Artifact`
  - `Developer Notes`
- Created **25 active Amanoba ideabank issues** from the research and set them to `IDEABANK (SOMEDAY)` on Project 12.
- Created an initial overflow of 33 ideabank issues by mistake, then corrected the set by closing issues `#773`–`#780` and marking them `Declined (NEVER)` so the live ideabank matches the requested top-25 count.

### Verification
- Existing Amanoba issues rewritten in place: `47`
- Active research ideabank issues added to Project 12: `25`
- Overflow ideabank issues closed/declined: `8`
- Final Project 12 status counts after verification:
  - `Backlog (SOONER)`: `32`
  - `Todo (NEXT)`: `6`
  - `Review (ALMOST)`: `1`
  - `Roadmap (LATER)`: `6`
  - `Done`: `2`
  - `IDEABANK (SOMEDAY)`: `25`
  - `Declined (NEVER)`: `8`

## Practice Hub MVP contract update (2026-05-10)

### What changed
- Added [`/Users/moldovancsaba/Projects/amanoba/docs/features/PRACTICE_HUB_MVP_CONTRACT.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/PRACTICE_HUB_MVP_CONTRACT.md) as the implementation contract for issue `#781`.
- Defined the first three real Practice Hub review modes against current Amanoba data:
  - `Continue Next`
  - `Quiz Recovery`
  - `Stale Refresh`
- Explicitly documented that a true `Mistakes` mode is not an MVP capability yet because learner-specific wrong-answer history is not currently persisted in the lesson-quiz submit path.
- Added a shared recommendation shape and cross-mode ordering so `#782` and `#783` can implement UI and telemetry without reopening product definition.

### Verification run (2026-05-10)
- `npm run docs:refresh` ✅ pass
- `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` ✅ pass
- `npm run docs:check` ❌ fail by generated-doc policy after refresh because the working tree contains updated generated docs:
  - `docs/core/DOCS_CANONICAL_MAP.md`
  - `docs/core/DOCS_INVENTORY.md`
  - `docs/core/DOCS_TRIAGE.md`

### Rollback
- Delete [`/Users/moldovancsaba/Projects/amanoba/docs/features/PRACTICE_HUB_MVP_CONTRACT.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/PRACTICE_HUB_MVP_CONTRACT.md)
- Remove this `Practice Hub MVP contract update (2026-05-10)` section from [`/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md`](/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md)
- Re-run `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check`

## Practice Hub learner shell update (2026-05-10)

### What changed
- Added [`/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/route.ts) to compute real learner-facing Practice Hub modes from course progress, lesson availability, and quiz completion markers.
- Added [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/practice/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/practice/page.tsx) as the first learner-facing Practice Hub shell.
- Added a dashboard entry point in [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx) so learners can discover the hub from the main learning actions area.
- Fixed [`/Users/moldovancsaba/Projects/amanoba/tailwind.config.ts`](/Users/moldovancsaba/Projects/amanoba/tailwind.config.ts) to use an ESM plugin import for `tailwindcss-animate`, which was required for the new page to compile under `next dev`.
- The shell now renders:
  - `Continue Next` launch cards into real lesson-day routes
  - `Quiz Recovery` launch cards into real lesson-quiz routes
  - `Stale Refresh` launch cards into real lesson revisit routes
  - an explicit unavailable state for mistake-history review, grounded in the current telemetry gap from `#781`

### Verification run (2026-05-10)
- `npm run type-check` ✅ pass
- `npx eslint --no-warn-ignored app/api/practice-hub/route.ts app/[locale]/practice/page.tsx app/[locale]/dashboard/page.tsx` ✅ pass
- local runtime verification:
  - `curl -sS --max-time 15 -D - http://127.0.0.1:3000/en/practice` ✅ returned `200 OK`
  - rendered HTML includes the unauthenticated Practice Hub sign-in shell text (`Practice Hub`, `Sign in to continue lessons...`)
  - `curl -sS --max-time 15 -D - http://127.0.0.1:3000/api/practice-hub` ✅ returned `401 Unauthorized` when called without a learner session

### Notes / limitation
- Browser-level verification for the authenticated learner states was not completed in this session because the local runtime check did not have a signed-in learner cookie. The route and API compiled successfully, and the anonymous shell/auth gate behaved correctly.
- `next dev` still logs the pre-existing `i18n.ts` fallback warning about `@/app/lib/i18n/translation-service` not resolving from the server bundle. The Practice Hub work did not introduce that warning; the new route now renders correctly despite it.

### Rollback
- Delete [`/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/route.ts)
- Delete [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/practice/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/practice/page.tsx)
- Remove the dashboard Practice Hub entry from [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx)
- Remove this `Practice Hub learner shell update (2026-05-10)` section from [`/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md`](/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md)
- Final active ideabank count confirmed: `25`

### Notes
- This pass standardized issue structure and board workflow; it did not de-duplicate historical issue concepts beyond closing the eight overflow ideabank issues.
- Some of the rewritten legacy issues still rely on generic structured framing built from their prior title/body context and may benefit from deeper manual refinement if they rise in priority.

## Multi-course routing fix update (2026-05-10)

### What changed
- Patched the learner course-routing surfaces that still leaked single-course or wrong-locale assumptions while `moldovancsaba/mvp-factory-control#2` is in progress.
- Updated [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx) so:
  - recommended course cards link to the course's own language route instead of always using the current UI locale
  - active-course "Next Lesson" links clamp to a valid day path and use the enrolled course language
- Updated [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/my-courses/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/my-courses/page.tsx) so course action links clamp to a valid lesson day; completed courses now open the last real lesson instead of a non-existent `day/31`-style path.
- Updated [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/courses/[courseId]/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/courses/[courseId]/page.tsx) so the sidebar and mobile "Continue Learning" CTAs route to the correct locale-scoped lesson URL for the enrolled course.

### Verification
- `npx tsc --noEmit --pretty false --incremental false` ✅ pass

### Notes
- This is a partial delivery against issue `#2`, focused on fixing course/day routing and multi-course navigation consistency. The broader issue still needs final review against all acceptance checks before it should be closed.

## Multi-enrolment scheduler verification update (2026-05-10)

### What changed
- Hardened the daily lesson scheduler in [`/Users/moldovancsaba/Projects/amanoba/app/lib/courses/email-scheduler.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/courses/email-scheduler.ts) so active progress lookup is based on the real `CourseProgress.status` enum rather than a non-schema `isCompleted` field.
- Added defensive runtime guards so the scheduler skips completed or abandoned progress rows, and skips malformed progress rows with invalid `currentDay` values instead of attempting an email send.
- Added a focused regression test in [`/Users/moldovancsaba/Projects/amanoba/__tests__/unit/email-scheduler.test.ts`](/Users/moldovancsaba/Projects/amanoba/__tests__/unit/email-scheduler.test.ts) that proves:
  - one learner with two active course enrolments gets one daily lesson send per enrolled course
  - a second scheduler run on the same day is deduplicated per course/day using `emailSentDays`
  - stale completed progress rows are ignored even if they slip through the query result

### Verification
- `npm test -- __tests__/unit/email-scheduler.test.ts` ✅ pass
- `npm run type-check` ✅ pass
- `npx eslint app/lib/courses/email-scheduler.ts __tests__/unit/email-scheduler.test.ts app/[locale]/dashboard/page.tsx app/[locale]/my-courses/page.tsx app/[locale]/courses/[courseId]/page.tsx` ✅ pass

### Notes
- This closes the main trust gap behind issue `#16`: the scheduler now has direct regression evidence for multi-enrolment per-course delivery and per-course/day deduplication, without changing the broader email architecture.

## Lesson quiz governance docs alignment update (2026-05-10)

### What changed
- Clarified the lesson model contract in [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/lesson.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/lesson.ts): `lesson.quizConfig` is now explicitly documented as a compatibility-only payload, while learner quiz behavior authority lives at `course.lessonQuizPolicy`.
- Updated learner and admin quiz-facing routes so their remaining `quizConfig` fields are explicitly framed as compatibility projections instead of active governance:
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/day/[dayNumber]/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/day/[dayNumber]/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/import/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/import/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/export/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/export/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/route.ts)
- Added `courseQuizPolicy` to the admin lesson-quiz questions response so admin consumers can read the authoritative course-level policy directly without inferring behavior from `lesson.quizConfig`.
- Updated repo docs so architecture and quality guidance now consistently describe course-level-only governance:
  - [`/Users/moldovancsaba/Projects/amanoba/docs/architecture/ARCHITECTURE.md`](/Users/moldovancsaba/Projects/amanoba/docs/architecture/ARCHITECTURE.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/architecture/layout_grammar.md`](/Users/moldovancsaba/Projects/amanoba/docs/architecture/layout_grammar.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/features/ASSESSMENT_GAME_ID_MIGRATION.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/ASSESSMENT_GAME_ID_MIGRATION.md)
- Refreshed generated docs inventory outputs:
  - [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_CANONICAL_MAP.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_CANONICAL_MAP.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INVENTORY.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INVENTORY.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_TRIAGE.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_TRIAGE.md)

### Verification
- `npm run type-check` ✅ pass
- `npm run docs:links:check` ✅ pass
- `npm run docs:check` ❌ fails by generated-doc policy until the refreshed docs inventory files are committed with the rest of the change; no broken-link or schema-validation error was reported before that policy stop.

### Notes
- This delivery closes the documentation and API-contract ambiguity behind issue `#225` without changing the broader seed/backfill work still tracked elsewhere in the lesson-quiz governance series.

## Audit SSOT inventory update (2026-05-10)

### What changed
- Corrected the active board SSOT references from retired Project 1 language to the live Amanoba board at Project 12 in:
  - [`/Users/moldovancsaba/Projects/amanoba/READMEDEV.md`](/Users/moldovancsaba/Projects/amanoba/READMEDEV.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md`](/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/product/TASKLIST.md`](/Users/moldovancsaba/Projects/amanoba/docs/product/TASKLIST.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/product/ROADMAP.md`](/Users/moldovancsaba/Projects/amanoba/docs/product/ROADMAP.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/handoff/MVP_FACTORY_PROJECT_SETUP.md`](/Users/moldovancsaba/Projects/amanoba/docs/handoff/MVP_FACTORY_PROJECT_SETUP.md)
- Updated the board workflow handoff doc [`/Users/moldovancsaba/Projects/amanoba/docs/handoff/HANDOFF_MVP_FACTORY_CONTROL.md`](/Users/moldovancsaba/Projects/amanoba/docs/handoff/HANDOFF_MVP_FACTORY_CONTROL.md) so it reflects the Project 12 status model (`Todo (NEXT)`, `In Progress (NOW)`, `Review (ALMOST)`, etc.) instead of the old `Ready` / Project 1 framing.
- Promoted [`/Users/moldovancsaba/Projects/amanoba/docs/handoff/AmanobaAuditDocMapping.md`](/Users/moldovancsaba/Projects/amanoba/docs/handoff/AmanobaAuditDocMapping.md) into the live audit SSOT inventory for issue `#371`, including:
  - current audit execution lane (`#371`, `#373`, `#374`)
  - board workflow SSOT
  - document-to-implementation mapping
  - quality gates used during the audit lane
  - artifact locations for repo and issue-side evidence
- Added the audit inventory doc to [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INDEX.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INDEX.md) so it is discoverable from the canonical docs index.

### Verification
- `npm run docs:links:check` ✅ pass
- `npm run docs:check` ❌ fails by generated-doc policy because `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, and `docs/core/DOCS_TRIAGE.md` changed after the docs refresh; the checker requires those refreshed generated docs to be committed with the same docs change

### Notes
- This delivers the concrete SSOT inventory slice for issue `#371`: the board reference is current, the audit plan has a stable in-repo inventory doc, and the follow-on audit issues now have a clear artifact path.

## Document-to-code discrepancy inventory update (2026-05-10)

### What changed
- Extended [`/Users/moldovancsaba/Projects/amanoba/docs/handoff/AmanobaAuditDocMapping.md`](/Users/moldovancsaba/Projects/amanoba/docs/handoff/AmanobaAuditDocMapping.md) with a dedicated `Known discrepancies and follow-on audit targets` section that now records the main active doc-to-code drift:
  - version-number disagreement across `README.md`, `docs/HANDOVER.md`, `package.json`, `docs/product/RELEASE_NOTES.md`, and `docs/architecture/ARCHITECTURE.md`
  - locale-count drift between some audit docs and the real `app/lib/i18n/locales.ts`
  - machine-local cross-repo path portability debt
  - the generated-doc commit-enforcement behavior in `npm run docs:check`
- Corrected additional active handoff/governance docs that still described the old Project 1 / `Ready` workflow:
  - [`/Users/moldovancsaba/Projects/amanoba/docs/core/agent_working_loop_canonical_operating_document.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/agent_working_loop_canonical_operating_document.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/handoff/feature_issues/FEATURE_DASHBOARD_MULTI_COURSE_ENROL_P2_3.md`](/Users/moldovancsaba/Projects/amanoba/docs/handoff/feature_issues/FEATURE_DASHBOARD_MULTI_COURSE_ENROL_P2_3.md)
- Normalized the remaining Project-field follow-up commands in [`/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md`](/Users/moldovancsaba/Projects/amanoba/docs/HANDOVER.md) from the obsolete `Ready` wording to the current `Todo (NEXT)` status target so the repo no longer instructs contributors to use the wrong board state.

### Verification
- `npm run docs:links:check` ✅ pass
- `npm run docs:check` ❌ fails by generated-doc policy because `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, and `docs/core/DOCS_TRIAGE.md` changed after refresh; the checker requires those refreshed generated docs to be committed with the same docs change

### Notes
- This delivery gives the audit lane an explicit discrepancy register instead of leaving drift implicit in scattered comments. The remaining step for `#374` is packaging these known discrepancies into a final audit-readiness summary and execution checklist.

## Audit readiness checklist update (2026-05-10)

### What changed
- Completed the audit-lane packaging step in [`/Users/moldovancsaba/Projects/amanoba/docs/handoff/AmanobaAuditDocMapping.md`](/Users/moldovancsaba/Projects/amanoba/docs/handoff/AmanobaAuditDocMapping.md) by adding:
  - environment prerequisites
  - execution checklist
  - board and issue logging workflow
  - final deliverables for audit closure
  - current blocker summary
- This turns the audit inventory into a usable runbook for the next contributor instead of just a mapping/discrepancy reference.
- The runbook now explicitly tells the next person:
  - which commands to run
  - how to classify failures
  - where to record evidence
  - which board statuses to use in Project 12
  - which unresolved follow-on items are still open after the current audit lane

### Verification
- `npm run docs:links:check` ✅ pass
- `npm run docs:check` ❌ fails by generated-doc policy because `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, and `docs/core/DOCS_TRIAGE.md` changed after refresh; the checker requires those refreshed generated docs to be committed with the same docs change

### Notes
- This completes the bounded `#374` delivery: the audit lane now has a current SSOT baseline, discrepancy register, and execution runbook. The remaining blocker is operational policy on generated docs, not missing audit-prep documentation.

## Practice Hub telemetry and reward integration update (2026-05-11)

### What changed
- Delivered the `#783` integration slice for the Practice Hub so the learner shell from [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/practice/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/practice/page.tsx) now records bounded usage telemetry and can trigger verified completion logging from live learner flows.
- Added shared Practice Hub context and reward helpers in:
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/practice-hub.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/practice-hub.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/practice-hub-rewards.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/practice-hub-rewards.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/practice-hub-reward-grant.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/practice-hub-reward-grant.ts)
- Added auth-gated Practice Hub telemetry and completion APIs:
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/track/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/track/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/complete/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/practice-hub/complete/route.ts)
- Wired the learner entry and completion paths so Practice Hub context now follows the recommendation into the actual learning flow:
  - the Practice Hub page logs `viewed` and `recommendation_opened`
  - enrolled lesson completion posts a verified `lesson_completed` callback when launched from Practice Hub
  - the lesson quiz page posts a verified `quiz_passed` callback when launched from Practice Hub
- Extended analytics and economy models for the new bounded events and reward source:
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/analytics/event-logger.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/analytics/event-logger.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/event-log.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/event-log.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/points-transaction.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/points-transaction.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/index.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/index.ts)
- The MVP reward rule is intentionally narrow:
  - `continue-next`: telemetry only
  - `stale-refresh`: telemetry only
  - `quiz-recovery`: one-time `3 points` + `3 XP` only after backend verification that the target quiz day is actually passed in `CourseProgress.assessmentResults`
- Added anti-farming persistence by keying reward grants on `{ playerId, mode, courseId, lessonDay }`, so the same recommendation cannot be rewarded twice.
- Updated [`/Users/moldovancsaba/Projects/amanoba/docs/features/PRACTICE_HUB_MVP_CONTRACT.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/PRACTICE_HUB_MVP_CONTRACT.md) so the docs now match the telemetry and reward implementation.

### Verification
- `npm run type-check` ✅ pass
- `npx eslint --no-warn-ignored app/lib/practice-hub.ts app/lib/practice-hub-rewards.ts app/lib/analytics/event-logger.ts app/lib/models/practice-hub-reward-grant.ts app/lib/models/event-log.ts app/lib/models/points-transaction.ts app/api/practice-hub/route.ts app/api/practice-hub/track/route.ts app/api/practice-hub/complete/route.ts app/[locale]/practice/page.tsx "app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx" app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx` ✅ pass

### Notes
- This delivery intentionally avoids rewarding page views or recommendation opens. The only rewardable Practice Hub path in MVP is verified `quiz-recovery` completion, which keeps the system auditable and resistant to reward farming.

## Lesson quiz answer explanation pilot update (2026-05-11)

### What changed
- Delivered a bounded `#771` pilot for mistake-aware lesson quiz feedback.
- Added optional authored explanation support to quiz-question content in [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/quiz-question.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/quiz-question.ts).
- Added the shared explanation helper in [`/Users/moldovancsaba/Projects/amanoba/app/lib/quiz-answer-feedback.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/quiz-answer-feedback.ts), which prefers author-written explanations and falls back only to short question-type hints.
- Extended lesson-quiz content operations so explanations can be authored and preserved through the existing content pipeline:
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/import/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/import/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/export/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/admin/courses/[courseId]/export/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/components/QuizManagerModal.tsx`](/Users/moldovancsaba/Projects/amanoba/components/QuizManagerModal.tsx)
- Extended quiz submission feedback so incorrect answers can now return both the correct answer and a bounded explanation in [`/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts).
- Updated the learner lesson quiz UI in [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx) so wrong answers now show:
  - the existing supportive retry message
  - the correct answer
  - the authored explanation when available
- Added the pilot contract doc [`/Users/moldovancsaba/Projects/amanoba/docs/features/QUIZ_ANSWER_EXPLANATION_PILOT.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/QUIZ_ANSWER_EXPLANATION_PILOT.md).

### Verification
- `npm run type-check` ✅ pass
- `npm test -- __tests__/unit/quiz-answer-feedback.test.ts` ✅ pass
- `npx eslint --no-warn-ignored app/lib/models/quiz-question.ts app/lib/quiz-answer-feedback.ts app/api/admin/courses/import/route.ts app/api/admin/courses/[courseId]/export/route.ts app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/utils.ts app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/route.ts app/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/route.ts app/api/admin/questions/route.ts app/api/admin/questions/[questionId]/route.ts app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts components/QuizManagerModal.tsx "app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx" __tests__/unit/quiz-answer-feedback.test.ts` ✅ pass

### Notes
- This pilot is intentionally not a broad AI-tutoring launch. The first rollout is content-grounded lesson-quiz feedback: show richer explanation only where the question content provides one or where a safe question-type hint exists.

## Saved lessons continuity MVP update (2026-05-11)

### What changed
- Delivered a bounded `#770` continuity slice built around saved lesson days instead of a generic bookmark dump.
- Added learner save persistence in [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/saved-lesson.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/saved-lesson.ts) and exported it through [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/index.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/index.ts).
- Added the authenticated saved-lessons API in [`/Users/moldovancsaba/Projects/amanoba/app/api/saved-lessons/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/saved-lessons/route.ts), including:
  - a quick `isSaved` lookup for the lesson page
  - create/delete for saved lesson days
  - list output that joins saved items with live `Course`, `Lesson`, and `CourseProgress` resume context
- Updated the enrolled lesson view [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx) so authenticated learners can save or remove the current lesson day directly from the lesson header.
- Added the learner library page [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/saved/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/saved/page.tsx), where each saved item now offers:
  - `Open saved lesson`
  - `Resume course`
- Added a dashboard entry point in [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx).
- Added the MVP contract doc [`/Users/moldovancsaba/Projects/amanoba/docs/features/SAVED_LESSONS_MVP.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/SAVED_LESSONS_MVP.md).

### Verification
- `npm run type-check` ✅ pass
- `npx eslint --no-warn-ignored app/lib/models/saved-lesson.ts app/api/saved-lessons/route.ts "app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx" app/[locale]/saved/page.tsx app/[locale]/dashboard/page.tsx` ✅ pass

### Notes
- This MVP intentionally saves only lesson days. That keeps the saved library tied to real learner intent and makes the resume surface explainable from existing `CourseProgress` rather than inventing a separate history system.

## Learning streak MVP update (2026-05-11)

### What changed
- Delivered a bounded `#750` streak slice centered on real course-learning behavior rather than logins or cosmetic counters.
- Extended the streak model in [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/streak.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/streak.ts) with a new `daily_learning` type.
- Added `updateDailyLearningStreak` in [`/Users/moldovancsaba/Projects/amanoba/app/lib/gamification/streak-manager.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/gamification/streak-manager.ts) and exported it through [`/Users/moldovancsaba/Projects/amanoba/app/lib/gamification/index.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/gamification/index.ts).
- Wired the streak to qualifying learning actions:
  - lesson completion in [`/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/day/[dayNumber]/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/day/[dayNumber]/route.ts)
  - passed lesson quiz submission in [`/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts)
- Adjusted active-streak reading and expiry behavior so expired daily learning streaks do not remain visible until the next action:
  - [`/Users/moldovancsaba/Projects/amanoba/app/api/players/[playerId]/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/players/[playerId]/route.ts)
  - [`/Users/moldovancsaba/Projects/amanoba/app/lib/gamification/streak-manager.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/gamification/streak-manager.ts)
- Updated the dashboard streak label map in [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx) so the new streak is learner-visible.
- Added focused regression coverage in [`/Users/moldovancsaba/Projects/amanoba/__tests__/unit/daily-learning-streak.test.ts`](/Users/moldovancsaba/Projects/amanoba/__tests__/unit/daily-learning-streak.test.ts).
- Added the product contract doc [`/Users/moldovancsaba/Projects/amanoba/docs/features/LEARNING_STREAK_MVP.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/LEARNING_STREAK_MVP.md).

### Verification
- `npm run type-check` ✅ pass
- `npm test -- __tests__/unit/daily-learning-streak.test.ts` ✅ pass
- `npx eslint --no-warn-ignored app/lib/models/streak.ts app/lib/gamification/streak-manager.ts app/lib/gamification/index.ts app/lib/analytics/event-logger.ts app/api/courses/[courseId]/day/[dayNumber]/route.ts app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts app/api/players/[playerId]/route.ts app/[locale]/dashboard/page.tsx __tests__/unit/daily-learning-streak.test.ts` ✅ pass

### Notes
- The MVP counting rule is strict and simple: one qualifying learning action per calendar day preserves the streak, and same-day repeats do not increment it. Qualifying actions are lesson completion or a passed lesson quiz.

## Friend streaks MVP update (2026-05-11)

### What changed
- Delivered a bounded `#752` peer-accountability slice on top of the new solo learning streak foundation.
- Added the new pair model [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/friend-streak.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/friend-streak.ts) and exported it through [`/Users/moldovancsaba/Projects/amanoba/app/lib/models/index.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/models/index.ts).
- Added the shared-streak rules helper [`/Users/moldovancsaba/Projects/amanoba/app/lib/friend-streaks.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/friend-streaks.ts), including:
  - pair-day reconciliation
  - shared streak increment / restart logic
  - display-state normalization (`Shared today`, `At risk today`, `Needs restart`)
- Added the authenticated learner API [`/Users/moldovancsaba/Projects/amanoba/app/api/friend-streaks/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/friend-streaks/route.ts) with:
  - `GET` current pending + active friend streaks
  - `POST { action: "create" }` invite creation
  - `POST { action: "join" }` invite acceptance
  - `DELETE` connection removal
- Wired real learning actions into the pair logic so the friend streak updates on:
  - lesson completion in [`/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/day/[dayNumber]/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/day/[dayNumber]/route.ts)
  - passed lesson quiz submission in [`/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts`](/Users/moldovancsaba/Projects/amanoba/app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts)
- Added the learner dashboard card in [`/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx`](/Users/moldovancsaba/Projects/amanoba/app/[locale]/dashboard/page.tsx) so users can:
  - create an invite code
  - join an invite code
  - view active partner streaks
  - remove a pending or active connection
- Added focused regression coverage in [`/Users/moldovancsaba/Projects/amanoba/__tests__/unit/friend-streaks.test.ts`](/Users/moldovancsaba/Projects/amanoba/__tests__/unit/friend-streaks.test.ts).
- Added the product contract doc [`/Users/moldovancsaba/Projects/amanoba/docs/features/FRIEND_STREAKS_MVP.md`](/Users/moldovancsaba/Projects/amanoba/docs/features/FRIEND_STREAKS_MVP.md) and indexed it in [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INDEX.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INDEX.md).

### Verification
- `npm run type-check` ✅ pass
- `npm test -- __tests__/unit/daily-learning-streak.test.ts __tests__/unit/friend-streaks.test.ts` ✅ pass
- `npx eslint --no-warn-ignored app/lib/models/friend-streak.ts app/lib/friend-streaks.ts app/lib/models/index.ts app/api/friend-streaks/route.ts app/api/courses/[courseId]/day/[dayNumber]/route.ts app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts app/[locale]/dashboard/page.tsx __tests__/unit/friend-streaks.test.ts` ✅ pass
- `npm run docs:refresh` ✅ pass
- `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` ✅ pass
- `curl -I http://127.0.0.1:3002/en/dashboard` ✅ returned `307` redirect to sign-in when unauthenticated
- `curl --max-time 10 -i http://127.0.0.1:3002/api/friend-streaks` ✅ returned `401 Unauthorized` when unauthenticated
- `npm run docs:check` ⚠️ fails only on the repo’s generated-doc commit guard because refreshed generated docs changed:
  - [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_CANONICAL_MAP.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_CANONICAL_MAP.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INVENTORY.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_INVENTORY.md)
  - [`/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_TRIAGE.md`](/Users/moldovancsaba/Projects/amanoba/docs/core/DOCS_TRIAGE.md)

### Notes
- This MVP is intentionally invite-only and pair-only. It avoids a public social graph, discovery feed, or notifications until the accountability mechanic proves useful.

## Flexible course length update (2026-05-12)

### What changed
- Removed the remaining hard course-length assumptions that blocked lessons beyond fixed 30/365-day ranges.
- Added shared course-length resolution in [`/Users/moldovancsaba/Projects/amanoba/app/lib/course-helpers.ts`](/Users/moldovancsaba/Projects/amanoba/app/lib/course-helpers.ts):
  - child courses use `selectedLessonIds.length`
  - normal courses use the highest active lesson day
  - canonical courses fall back to the CCS lesson list
  - empty/draft courses use `durationDays` as a positive fallback only
- Updated learner-facing progress APIs so completion, next-day navigation, public lesson views, My Courses, and Practice Hub use the effective lesson count instead of assuming 30 days.
- Updated sitemap lesson URLs and email duration fallbacks so generated public URLs and welcome/completion copy follow flexible course length.
- Updated admin course and lesson APIs so courses can be created with any positive planned length, lessons can use any positive `dayNumber`, and course `durationDays` is synced to active lessons after lesson edits.
- Updated admin course creation/editing UI copy and controls from fixed 30-day courses to flexible lesson sequences.
- Updated course metadata/JSON-LD and primary English/Hungarian marketing strings so public surfaces no longer promise a fixed 30-day course length.

### Verification
- `npm test -- __tests__/unit/course-helpers.test.ts` ✅ pass
- `npx eslint --no-warn-ignored app/lib/course-helpers.ts app/lib/models/course.ts app/lib/models/lesson.ts app/lib/models/course-progress.ts app/lib/models/assessment-result.ts app/api/courses/[courseId]/day/[dayNumber]/route.ts app/api/admin/courses/route.ts app/api/admin/courses/[courseId]/route.ts app/api/admin/courses/[courseId]/lessons/route.ts app/api/admin/courses/[courseId]/lessons/[lessonId]/route.ts app/api/my-courses/route.ts app/api/practice-hub/route.ts app/lib/public-lesson.ts app/[locale]/admin/courses/[courseId]/page.tsx app/[locale]/admin/courses/new/page.tsx app/[locale]/admin/courses/page.tsx app/[locale]/courses/[courseId]/layout.tsx app/[locale]/layout.tsx app/components/CourseJsonLd.tsx app/components/OrganizationWebSiteJsonLd.tsx __tests__/unit/course-helpers.test.ts` ✅ pass
- `npx eslint --no-warn-ignored app/sitemap.ts app/lib/email/email-service.ts app/lib/course-helpers.ts app/lib/public-lesson.ts` ✅ pass
- `npm run type-check` ✅ pass

## Shared design-system SSOT refactor (2026-05-21)

### What changed
- Established `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` version `1.2.3` as its own Git-managed shared design-system repository for cross-project design, UI, UX, Mantine-only runtime contracts, component contracts, governance, and adoption rules.
- Added the Amanoba-specific Mantine-only migration plan at `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/AMANOBA_MANTINE_REFACTOR.md`.
- Added strict shared contracts for foundations, components, UX patterns, governance, contribution rules, changelog, versioning, and project adoption.
- Updated Amanoba documentation so local Tailwind/Radix/CSS files are described as the current implementation adapter, not the design authority.
- Updated UI audit scripts so generated quality reports reference the shared SSOT plus Amanoba adapter rules.

### Verification
- Pending in this session: shared repo commit, Amanoba docs refresh, docs link checks, and git commit/push.

### Notes
- Amanoba is not Mantine-only yet. The active runtime still uses the legacy Tailwind/Radix adapter while the migration plan now points to the shared Mantine contract.

## Mantine root runtime implementation (2026-05-21)

### What changed
- Installed the Mantine Phase 1 package baseline: `@mantine/core`, `@mantine/hooks`, `@mantine/form`, `@mantine/notifications`, `@mantine/modals`, and `@tabler/icons-react`.
- Added the initial Amanoba Mantine theme in `app/lib/ui/mantine-theme.ts`.
- Added the root Mantine runtime provider in `app/components/providers/MantineRuntimeProvider.tsx`, including `MantineProvider`, `ModalsProvider`, and `Notifications`.
- Wired the Mantine runtime into `app/[locale]/layout.tsx` under the existing theme/session/consent providers.
- Added `npm run ui:check:mantine` via `scripts/check-mantine-boundaries.mjs` to block new Radix, `sonner`, and `vaul` product UI imports and contain legacy Tailwind helper imports.
- Fixed malformed ICU interpolation in `messages/*` `common.byContinuing` strings (`{{appName}}` -> `{appName}`) after the local sign-in smoke check exposed a runtime translation error.

### Verification
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `curl -L --max-time 20 -s http://localhost:3000/en/auth/signin` ✅ returned HTML after the ICU fix

### Notes
- This is the root-runtime slice, not the full UI conversion. Existing screens still need migration from Tailwind/Radix/local CSS to Mantine primitives or thin Mantine wrappers.

## Memory Match Mantine proof surface (2026-05-21)

### What changed
- Migrated the Memory Match game surface from the legacy shared `Button` and `Card` primitives to Mantine `Button` and `Card`.
- Updated the Memory game page shell card to use Mantine `Card`.
- Tightened `npm run ui:check:mantine` so new product UI cannot import the legacy shared `Card`, and only the current sign-in page can temporarily import the legacy button helper.

### Verification
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass

### Notes
- The only remaining direct import from `@/components/ui/button` is `app/[locale]/auth/signin/page.tsx` for `buttonVariants`; that is now the next obvious primitive cleanup.

## Course creation playbook refresh (2026-05-21)

### What changed
- Added `docs/product/COURSE_CREATION_PLAYBOOK.md` as the active course-creator reference for flexible lesson counts, short courses, lesson quiz policy, certificate setup, JSON upload/import, script seeding, and publishing checks.
- Added `docs/COURSE_PACKAGE_FORMAT.md` as a compatibility entrypoint because the admin import API references that path.

### Notes
- Current course length is flexible: minimum 1 active lesson; no hard model maximum. `durationDays` remains a planned/fallback length while learner-facing length resolves from active lessons or child-course selections.

## Course UX Mantine hardening continuation (2026-05-21)

### What changed
- Continued Project 12 issue `#822` on `sentinel-squad/course-ux-mantine-hardening` with Mantine-only conversions for learner-critical course flows:
  - enrolled lesson runtime
  - lesson quiz runtime
  - final exam runtime
  - saved lessons
  - Practice Hub
  - dashboard and referral card
  - sign-in and anonymous login
  - public certificate verification pages
- Converted high-impact admin/editor authoring surfaces:
  - new course admin form
  - quiz manager modal
  - editor lesson page
  - Markdown lesson editor
- Replaced native browser alerts/confirmations in the migrated surfaces with Mantine notifications and modals.
- Retired obsolete local legacy UI adapters:
  - `app/components/ui/button.tsx`
  - `app/components/ui/card.tsx`
  - `app/components/ui/rich-text-editor.tsx`
  - `app/lib/utils/cn.ts`
- Removed unused Tailwind adapter dependencies `class-variance-authority`, `clsx`, and `tailwind-merge`.
- Tightened `npm run ui:check:mantine` so no files remain allowlisted for the deleted legacy button/card/cn helpers.

### Verification
- Slice checks already passed while committing:
  - `npm run type-check`
  - `npm run ui:check:mantine`
  - `npm run ui:check:foundation`
  - `npm run ui:check:layout`
  - focused `npx eslint` on migrated files
- Full final validation:
  - `npm run lint` ✅ pass
  - `npm test` ✅ pass
  - `npm run type-check` ✅ pass after `npm run build` regenerated `.next/types`
  - `npm run build` ✅ pass
  - `npm run docs:check` ✅ pass
  - `npm run ui:check:mantine` ✅ pass
  - `npm run ui:check:foundation` ✅ pass
  - `npm run ui:check:layout` ✅ pass
  - Browser smoke ✅ no Next.js runtime error detected on `/en/auth/signin`, lesson quiz, final exam, saved lessons, Practice Hub, and public certificate verification routes.

### Notes
- The full admin course editor page still has legacy Tailwind/lucide/native form markup and should be handled as a dedicated large conversion slice. Its shared quiz manager modal and Markdown editor dependency are now Mantine-only.

## Admin course editor Mantine conversion (2026-05-21)

### What changed
- Converted `app/[locale]/admin/courses/[courseId]/page.tsx` to Mantine and Tabler primitives.
- Replaced the remaining legacy Tailwind/native controls in that editor for course metadata, editor assignment, premium pricing, lesson quiz policy, certification, feature toggles, short-course creation, parent sync controls, lesson cards, import/export, thumbnail upload, and the lesson form modal.
- Replaced browser `alert`/`confirm` usage in the editor with Mantine notifications and confirmation modals.

### Verification
- focused `npx eslint app/[locale]/admin/courses/[courseId]/page.tsx` ✅ pass
- `npm run type-check` ✅ pass
- `npm run lint` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `git diff --check` ✅ pass

### Notes
- The admin course editor is no longer the largest known Mantine-only gap.
- Remaining broad legacy UI is now concentrated in secondary profile/account/admin-list/game/challenge/reward surfaces and should be handled as surface-specific migration work.

## Admin/profile Mantine conversion continuation (2026-05-22)

### What changed
- Converted `app/[locale]/profile/[playerId]/page.tsx` and `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx` to Mantine primitives and Tabler icons.
- Converted `app/[locale]/admin/courses/page.tsx`, `app/[locale]/admin/page.tsx`, `app/[locale]/admin/payments/page.tsx`, `app/[locale]/admin/settings/page.tsx`, and `app/[locale]/admin/certificates/page.tsx` to Mantine primitives.
- Replaced remaining browser alerts in the converted settings/certificate/payment/profile slices with Mantine notifications or Mantine-controlled feedback.
- Removed stale dashboard placeholder health meters and replaced them with operational values already returned by the admin stats/system-info APIs.

### Verification
- Focused `npx eslint` passed on each migrated page.
- Repeated slice checks passed after each conversion:
  - `npm run type-check`
  - `npm run ui:check:mantine`
  - `npm run ui:check:foundation`
  - `npm run ui:check:layout`
  - `git diff --check`

### Notes
- Amanoba is still not fully Mantine-only. Remaining high-priority product UI backlog includes `app/[locale]/courses/[courseId]/page.tsx`, `app/[locale]/admin/questions/page.tsx`, achievement editor pages, analytics/surveys/players/games/rewards admin lists, and game/challenge/reward surfaces.

## Learner navigation consolidation (2026-05-22)

### What changed
- Added `app/components/LearnerPageHeader.tsx` as the shared Mantine header/navigation surface for learner pages.
- Replaced the duplicate dashboard menu pattern by removing the separate `Start learning` quick-action panel and moving learner navigation into the shared header.
- Applied the shared learner header to dashboard, my courses, Practice Hub, and saved lessons so those user pages no longer use different page-local navigation styles.
- Locked the Mantine runtime and app color-scheme bootstrap to Amanoba dark mode so Mantine cards/buttons do not flip to a light visual style based on OS/browser preference.

### Verification
- focused `npx eslint` on the changed learner/header/runtime files ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass

## Learner navigation SSOT correction (2026-05-22)

### What changed
- Confirmed the screenshot-reported state was not acceptable against `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`: multiple page-local learner headers, duplicate dashboard navigation, Tailwind-styled blog/news chrome, a native language selector, and explicit light card backgrounds were design-system drift.
- Extended `app/components/LearnerPageHeader.tsx` as the canonical learner header/navigation implementation and applied it to the course catalog, blog, and news index pages in addition to dashboard, my courses, Practice Hub, and saved lessons.
- Converted `components/LanguageSwitcher.tsx` from a native select plus Tailwind classes to Mantine `Select`.
- Removed explicit light `bg="gray.0"` course/dashboard card overrides from learner navigation-adjacent surfaces so card styling resolves through the Mantine dark runtime and theme instead of per-page hardcoded visual choices.
- Converted blog/news index pages from Tailwind/lucide/raw layout markup to Mantine cards, stacks, badges, containers, and Tabler icons.

### Verification
- focused `npx eslint` on the changed learner/header/blog/news/course/language files ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass

## Practice Hub placeholder removal (2026-05-22)

### What changed
- Removed the learner-facing `Unavailable for this MVP` panel and the related `Unavailable by design` metric card from `app/[locale]/practice/page.tsx`.
- Practice Hub now only renders actionable review modes and the explanation card, instead of surfacing a dead-end `Mistake Review` placeholder to learners.
- Kept the backend Practice Hub contract unchanged so operator-facing future-mode metadata can still exist without leaking into the learner UI.

### Verification
- `npx eslint app/[locale]/practice/page.tsx` ✅ pass
- `npm run type-check` ✅ pass

## Placeholder surface removal sweep (2026-05-22)

### What changed
- Removed the fake placeholder/coming-soon quest copy from `app/[locale]/admin/quests/page.tsx` and wired the page to the real `/api/admin/quests` filters.
- Replaced the admin quests dead-end empty state with normal no-results messaging and added an explicit runtime error banner for failed loads.
- Removed the `In-App Request (Coming Soon)` section from `app/[locale]/data-deletion/page.tsx` so the policy only documents currently real deletion paths.
- Removed the `Pay (disabled in MVP)` CTA from `app/[locale]/courses/[courseId]/final-exam/page.tsx`.
- Removed the hidden `Mistake Review` placeholder metadata from `app/api/practice-hub/route.ts` so the API no longer advertises a non-existent mode.

### Verification
- focused `npx eslint` on changed placeholder sweep files ✅ pass
- `npm run type-check` ✅ pass

## Mantine-only gap hardening sweep (2026-05-22)

### What changed
- Converted the blog/news detail pages from legacy Tailwind/lucide markup to Mantine `Paper`, `Container`, `Stack`, `Group`, `Button`, `Badge`, `Title`, and `Text` surfaces so detail pages no longer fall back to hard-coded dark/light styling.
- Removed the legacy Tailwind body/root-wrapper classes from the localized app shell and replaced the content wrapper with a Mantine `Stack`, leaving Mantine runtime color-scheme variables responsible for app background and text defaults.
- Refactored the shared `Logo`, `ThemeToggle`, and `SignOutButton` controls to Mantine primitives and removed their Tailwind `className` styling hooks.
- Replaced `Logo className="flex-shrink-0"` call sites with an explicit `preventShrink` prop so shared branding layout remains controlled by the component contract instead of per-page utility classes.
- Tightened `npm run ui:check:mantine` with a scoped Mantine-only file contract that blocks `className`, native button/form controls, and `lucide-react` imports from already-converted shared/product surfaces.
- Confirmed the remaining legacy UI debt is still substantial: the generated layout audit currently reports 886 non-blocking legacy findings, mostly in admin and game surfaces. Those areas are not fixed by this sweep and must be converted in dedicated slices.

### Verification
- focused `npx eslint` on the changed shared/blog/news/boundary files ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run build` ✅ pass
- `npm run docs:links:check` ✅ pass

## Mantine-only admin/game/legal sweep (2026-05-22)

### What changed
- Converted high-drift admin surfaces to Mantine-only presentation: achievements list/detail/create, players, games, rewards, surveys, challenges, quests, feature flags, email analytics, and analytics.
- Converted the highest-drift game pages (`QUIZZZ`, `Sudoku`, `WHACKPOP`, `Madoku`) from Tailwind/raw buttons/lucide markup to Mantine cards, buttons, progress, modals, grids, and Tabler icons while keeping the existing game engines and session/reward APIs intact.
- Converted legal/data-deletion pages and the shared `PlayerAvatar` component to Mantine primitives.
- Regenerated `docs/quality/UI_LAYOUT_GRAMMAR_AUDIT.md`; legacy findings dropped from 886 to 121. Remaining largest tracked gaps are `app/[locale]/admin/questions/page.tsx`, `app/[locale]/quests/page.tsx`, and older public gamification pages.

### Verification
- focused `npx eslint` on converted admin/game/legal/shared files ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:audit:layout` ✅ regenerated

## Mantine-only completion sweep (2026-05-22)

### What changed
- Converted the remaining high-drift learner/public gamification pages to Mantine surfaces: achievements, challenges, rewards, quests, games launcher, email settings, and partners.
- Removed stale partner-page content that still described Amanoba as an old unified game-platform landing page with hardcoded 2025/version copy.
- Converted the admin questions manager from legacy Tailwind/lucide/raw controls to Mantine tables, form controls, modal, badges, actions, and Tabler icons.
- Replaced remaining scanned inline style findings with Mantine props, Mantine components, or scoped CSS modules where browser/runtime geometry was required.
- Regenerated `docs/quality/UI_LAYOUT_GRAMMAR_AUDIT.md`; the UI layout grammar audit now reports zero findings across scanned `app/**` and `components/**` UI files.

### Verification
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run type-check` ✅ pass after build regenerated `.next/types`
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:audit:layout` ✅ regenerated clean report
- `npm run ui:check:layout` ✅ pass
- `npm run docs:links:check` ✅ pass
- `npm run build` ✅ pass
- `npm run docs:check` ⚠️ refreshes generated docs and reports them changed until those generated files are committed

## Dark-mode readability visual sweep (2026-05-23)

### What changed
- Ran desktop and mobile visual checks for home, partners, news, courses, sign-in, and the authenticated dashboard after the Mantine-only sweep.
- Fixed the remaining dark-mode readability root cause: global CSS still forced old body typography and negative letter spacing, while Mantine `dimmed` text resolved too low-contrast on dark cards.
- Added a Mantine `cssVariablesResolver` override for dark-mode text and dimmed tokens so Mantine components remain readable when using shared `c="dimmed"` semantics.
- Fixed the anonymous sign-in button mobile wrapping so the full label remains visible on narrow screens.

### Verification
- Visual screenshots: home, news, partners, courses, sign-in, and authenticated dashboard ✅ checked
- Authenticated dashboard DOM check after anonymous login ✅ no duplicate navigation structure found
- `npm run lint` ✅ pass
- `npm run type-check` ✅ pass
- `npm run ui:audit:layout` ✅ regenerated
- `npm run ui:check:layout` ✅ pass
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm test` ✅ pass
- `npm run docs:check` ✅ pass before this handover append; rerun required before commit
- `npm run build` ✅ pass

## GDS 2.1 pattern-service alignment slice (2026-05-23)

### What changed
- Added Amanoba's local GDS pattern inventory at `docs/product/PATTERN_CONTRACT_INVENTORY.md`, aligned to `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` version `2.1.0`.
- Updated `docs/product/DESIGN_UPDATE.md` and `docs/architecture/layout_grammar.md` so active docs now point to the consolidated GDS files and the new pattern-service model instead of obsolete pre-2.0 GDS documents.
- Added canonical Mantine-only pattern contracts: `CourseCard`, `MetricCard`, `StateBlock`, and `ArticleShell`.
- Routed the course catalog, My Courses, dashboard course/progress/metric surfaces, blog/news detail pages, and auth error recovery page through those shared pattern contracts.
- Tightened `npm run ui:check:mantine` so the newly canonical learner/course/dashboard/auth/article/pattern files are covered by the Mantine-only boundary rules.
- Removed obsolete unused Radix, Sonner, and Vaul product-UI dependencies from `package.json`/`package-lock.json`.
- Ran `npm audit fix` non-breaking updates; remaining audit findings require breaking upgrades (`nodemailer`, Next transitive `postcss`, and `uuid`) and were not forced in this slice.

### Verification
- `npm run ui:check:mantine` ✅ pass
- `npm run ui:check:foundation` ✅ pass
- `npm run ui:check:layout` ✅ pass
- `npm run type-check` ✅ pass
- `npm run lint` ✅ pass
- `npm test` ✅ pass
- `npm run build` ✅ pass
- `npm audit --omit=dev --audit-level=high` ⚠️ remaining high issue is `nodemailer`; available fix requires breaking upgrade path
