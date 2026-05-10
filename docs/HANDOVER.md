# Amanoba — Developer Handover

This document is the single-stop operational snapshot for Amanoba. Keep it current whenever the system behavior, process, or board status changes. Append entries instead of rewriting history.

**Last Updated**: 2026-03-10  
**Current Product Version**: 2.9.33 (per `README.md`)  
**Status**: Production stable, SSO-only auth, daily lessons + gamified learning live.

## SSOT (Work Tracking)
- **Board**: https://github.com/users/moldovancsaba/projects/1 (Product column filters to “Amanoba”). The board is the single source of truth; no local task files.
- **Issues repo**: `moldovancsaba/mvp-factory-control`. All Amanoba work (P1–P4) is tracked there. Issue titles follow `Amanoba: <short description>`.
- **Product repo ≠ project repo**: Do not raise issues in `moldovancsaba/amanoba`. Find or request the related card in the board before coding.
- **Workflow**:  
  1. Start: `gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10`, pick the assigned card, move it to _In Progress_, note objective.  
  2. During work: update card status for blockers/milestones, keep `docs/HANDOVER.md` + relevant docs updated.  
  3. Finish: document validation evidence, move card to _Done_, and mention where the change is documented.

## Current Priorities (Board snapshot — from `docs/product/TASKLIST.md` + GitHub issues)
- **P2 (Multiple courses + course governance)**  
  - `#16`: `Email/scheduler: Respect multiple enrolments` — needs the scheduler to treat each course separately and avoid duplicate email sends.  
  - `#225`: `Lesson quiz governance #10` — finish doc alignment and migrations so quiz behavior is governed at the course level only; remaining checklist includes doc sync, seed cleanup, validator alignment, and backfills.
- **Documentation ops / federation**  
  - `#104`: `Cross-repo documentation federation (amanoba + amanoba_courses)` — finalize shared reference strategy between the two repos.  
  - `#65`: `Move Amanoba release notes into Amanoba wiki by ISO UTC date` — reorganize release tracking per ISO date architecture.  
- **P3 / P4 exploratory work (waiting for capacity)**  
  - AI-powered personalization (#26, #27), live sessions (#22–#25), video lessons (#33–#35), community incubations (#28–#31), instructor dashboard (#6, #32), and mobile/offline (#20–#21, #7) remain backlog items awaiting decomposition.

## Documentation index (update when behavior changes)
- `README.md` — quickstart + product overview (30-day courses, gamification, Stripe).  
- `READMEDEV.md` — this repo’s Brain Boost ritual (start-of-session, SSOT rules, quality gates).  
- `docs/product/TASKLIST.md` — prioritized actionable items (P1–P4). Completed tasks move to `docs/product/RELEASE_NOTES.md`.  
- `docs/product/RELEASE_NOTES.md` — shipped work only (per release definition).  
- `docs/status/PRODUCTION_STATUS.md` — deployment cadence, verification steps, and baseline route checks.  
- `docs/ARCHITECTURE.md` / `docs/product/ROADMAP.md` — reference high-level architecture and future vision.  
- `docs/product/ROADMAP_TASKLIST_SYSTEM_COMPARISON.md` — ensures roadmap vs tasklist alignment.

## Key runtime areas
- `app/[locale]`: localized routes for hu/en, including admin, auth, dashboard, games, and course experiences.  
- `lib/`: business logic (models, gamification, course scheduling, email, analytics).  
- `components/`: UI fragments (gamification, games, charts, UI primitives).  
- `scripts/`: seeds, analytics audits, doc generators, and workflow helpers (seed courses, start workers, doc checks).  
- `messages/`: translation units used by `next-intl`.  
- `public/`: static assets (logos, icons).  
- `middleware.ts` & `auth.*`: SSO/auth wiring, guard logic, and rate limiting.

## Production verification policy
- Automation path: git push → `origin/main` → Vercel (auto). Manual CLI deployments only with explicit request.  
- Post-deploy checks (per `docs/status/PRODUCTION_STATUS.md`): `/`, `/robots.txt`, `/sitemap.xml`, `/en/auth/signin`, plus the feature area touched.  
- Log each verification run in `docs/product/RELEASE_NOTES.md` when releasing for public consumption.  
- Keep release numbering consistent: 2.9.33 currently live; bump patch/minor/major via `scripts/versioning`.

## Known issues / risks
- Scheduler does not yet honor multiple active enrolments (issue #16). Emails can still duplicate when a learner is in >1 course.  
- Lesson-level quiz governance leftovers still exist in seeds, docs, and validators (#225).  
- Cross-repo documentation references are fragile — ensure `docs/product/TASKLIST.md` links to canonical assets under `amanoba_courses` before releasing.  
- Board fields for some linked issues may need manual verification (Product/Type/Priority/Status) via the GitHub Projects UI.

## Quick verification commands (run before marking work done)
- `npm run lint` (ESLint 9 + Next.js config).  
- `npm test` (Vitest).  
- `npm run type-check` (TypeScript no emit).  
- `npm run docs:check` (inventory + link checks) when touching docs/architecture.  
- `npm run build` (ensures Next.js build without warnings).

## Next steps
1. Finish the scheduler + multiple enrolment email logic (`#16`).  
2. Drive lesson-quiz governance documentation + validators (#225).  
3. Sync documentation federation issue (#104) with the `amanoba_courses` repo and keep release notes grouped by ISO UTC date (#65).  
4. Keep `docs/HANDOVER.md` appended whenever these areas move.

---

## Audit update (2026-03-10)

### Consolidated doc/code discrepancies
- **Version drift**: `README.md` reports **2.9.33** and `docs/architecture/ARCHITECTURE.md` reports **2.9.40**, while `docs/product/RELEASE_NOTES.md` reports **2.9.48** and runtime build uses Next.js 15.5.12.
- **Lesson quiz governance still in transition**: runtime authority is course-level (`lessonQuizPolicy` resolver), but compatibility surfaces remain in APIs/UI as `lesson.quizConfig` fields and import/export payload compatibility (`app/api/admin/courses/import/route.ts`, `app/api/admin/courses/[courseId]/export/route.ts`, learner day/quiz routes).
- **Cross-repo portability risk**: active docs still include many machine-local references to `/Users/moldovancsaba/Projects/amanoba_courses/process_them/...` across `docs/core`, `docs/product`, `docs/handoff`, and archive docs.
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
- Repaired the shared UI foundation so the centralized design system is the active authority again:
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
