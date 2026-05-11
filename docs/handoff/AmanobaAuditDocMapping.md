# Amanoba Audit: SSOT Inventory

**Last Updated**: 2026-05-10  
**Board SSOT**: https://github.com/users/moldovancsaba/projects/12/views/1  
**Issues Repo**: `moldovancsaba/mvp-factory-control`

## Audit plan

1. Confirm the live work-tracking SSOT on Project 12 and identify the Amanoba execution lane that currently matters.
2. Map each active governance document to the code, scripts, or workflows it claims to describe.
3. Run the scoped quality gates for the area being audited and record whether failures are content failures or policy-enforcement failures.
4. Record findings in `docs/HANDOVER.md` and the corresponding `mvp-factory-control` issue comment so board history and repo history stay aligned.

## Current audit execution lane

| Issue | Purpose | Current role in audit lane |
| --- | --- | --- |
| `#371` | Establish audit plan and SSOT inventory | This document and the active SSOT reference cleanup |
| `#373` | Document-to-code inventory | Follow-on detailed discrepancy pass after SSOT references are current |
| `#374` | Audit readiness and handover prep | Final packaging of findings, evidence, and next-step checklist |

## Board workflow SSOT

- **Live board**: Project 12, Amanoba board.
- **Status model**: `IDEABANK (SOMEDAY)` -> `Roadmap (LATER)` -> `Backlog (SOONER)` -> `Todo (NEXT)` -> `In Progress (NOW)` -> `Review (ALMOST)` -> `Done` / `Declined (NEVER)`.
- **Execution rule**: contributors should treat Project 12 as authoritative over local task files; `docs/product/TASKLIST.md` and `docs/product/ROADMAP.md` are reference mirrors only.
- **Issue quality bar**: active work lives in `moldovancsaba/mvp-factory-control` using the structured issue template sections already normalized on 2026-05-10.

## Document to implementation inventory

This table summarises the focal documents from the audit plan and ties them to the code areas they describe; drift notes flag any stale references so the audit report can call them out.

| Document | Purpose / Focus | Primary code references | Notes / drift to capture |
| --- | --- | --- | --- |
| `README.md` | Product overview (30-day courses, gamification, admin, SSO). | `app/[locale]` pages (`dashboard`, `courses`, `auth`, `admin`), `lib/gamification`, `libs` like `lib/email`, `scripts/seed-*`, `components/gamification`. | Version line (2.9.33) is two patches behind current `docs/product/RELEASE_NOTES` (2.9.48); update in final report.
| `READMEDEV.md` | Brain-boost ritual, SSOT rules, quality gates, doc obligations. | `package.json` scripts (`lint`, `test`, `type-check`, `docs:check`, `docs:links:check`), `scripts/docs/check-doc-links.mjs`, `docs/HANDOVER.md`, board operations in `mvp-factory-control`. | Must point to Project 12, not the retired Project 1 flow.
| `docs/HANDOVER.md` | Operational snapshot, current priorities (multiple enrolments, lesson quiz governance, doc federation). | `app/lib/courses/email-scheduler.ts`, `app/api/courses`, `app/api/admin/courses/*`, `scripts/seed-*`, `docs/product/TASKLIST.md`. | Keep the “Current Priorities” section aligned with the actual next execution lane from Project 12.
| `docs/product/TASKLIST.md` | Reference mirror of historical actionable backlog. | Multi-course UI: `app/[locale]/dashboard`, `app/[locale]/courses`, `app/api/my-courses`, `app/api/courses/[courseId]/enroll`; lesson quiz governance: `app/[locale]/courses/[courseId]/day`, `app/api/courses/*/quiz`, `scripts/seed-*`; AI/mobile/live/video: corresponding `app/` subdirectories and `lib` utilities. | Should explicitly describe itself as a reference mirror and point contributors to Project 12.
| `docs/product/ROADMAP.md` | Reference mirror of vision-level features not yet broken down. | General modules such as `app/[locale]/*` for mobile/live/video and `lib/analytics`. | Should explicitly map roadmap items to `Roadmap (LATER)` on Project 12.
| `docs/product/ROADMAP_TASKLIST_SYSTEM_COMPARISON.md` | Ensures roadmap vs tasklist alignment. | Same code references as `TASKLIST.md`. | Check whether the comparison still holds, especially now that multiple audit issues (#371–#374) exist.
| `docs/product/RELEASE_NOTES.md` | Changelog (up to v2.9.48) documenting deployment, i18n, import/export, quiz governance fixes. | `app/api/admin/courses/import/route.ts`, `components/CookieConsentBanner.tsx`, `app/lib/email/email-localization.ts`, `app/lib/i18n/*`, `messages/*.json`. | Confirm the described fixes (Swahili locale, import mode, doc link checks) match the current code snapshot; note when release notes need a follow-up entry for this audit.
| `docs/status/PRODUCTION_STATUS.md` | Post-deploy verification policy and baseline route checks. | Routes `/`, `/robots.txt`, `/sitemap.xml`, `/en/auth/signin` exist in `app/page.tsx`, `app/sitemap.ts`, `app/[locale]/auth/signin`, `public/robots.txt`. | Will log the gate results in this doc once the audit completes.
| `docs/architecture/ARCHITECTURE.md` | System overview covering stack, directories, data models, security. | Entire repo (`app/`, `lib/`, `scripts/`, `public/`); models in `lib/models`, analytics in `lib/analytics`, gamification in `lib/gamification`, service worker in `public/sw.js`. | Large doc is mostly accurate; ensure the sections about `/Users/.../amanoba_courses` (course docs relocation) mention the actual `amanoba-courses` path.
| `docs/features/ENROLMENT_AND_PREREQUISITES.md` | Multiple course enrollment/prerequisite rules. | `app/api/courses/[courseId]/enroll/route.ts`, `app/[locale]/courses/[courseId]/day/[dayNumber]`, `lib/models/Course`, `app/[locale]/dashboard`. | Verify the doc matches the actual API response (`GET /api/my-courses`, `POST /api/courses/[courseId]/enroll`) and the UI messages shown in `messages/*.json`.
| `docs/features/GEO_IMPROVEMENT_PLAN.md` | Public lesson view policy (SEO). | `app/[locale]/courses/[courseId]/day/[dayNumber]/view/page.tsx`, `app/api/courses/[courseId]/day/[dayNumber]/public/route.ts`, `app/(enrolled)` layout/metadata. | Reaffirm that the doc’s “no in-app links to /view” policy holds and that the sitemap (`app/sitemap.ts`) indexes the correct URLs.
| `docs/certification/*` | Certificate system details (creation, A/B, entitlements). | `lib/models/Certificate.ts`, `app/api/certificates`, `app/[locale]/admin/courses/[courseId]/page.tsx`, `app/[locale]/certificate/[slug]/page.tsx`. | Ensure docs describing `certificate.designTemplateId` (A/B testing) and `CertificateEntitlement` map to actual schema fields and UI flows.
| `docs/quality/*` | Audit worksheets and validation system. | `scripts/docs/*` (link checkers), QA process files under `docs/quality`, `package.json` scripts. | Highlight where the audit artifacts (this document, final notes) will live to satisfy the worksheets’ requirements.
| `docs/deployment/DEPLOYMENT.md` | Deployment runbook (push `main` -> Vercel). | `scripts/versioning/bump-version.mjs`, `next.config.ts`, `.github/workflows/*` (watch for docs checks). | Note the manual steps (if any) required to re-run `npm run release:*` once audit changes are ready.
| `docs/handoff/*` | Handoff snapshots and prompts (context transfer). | `docs/HANDOVER.md`, `docs/product/TASKLIST.md`, plus audit issues `#371`–`#374`. | `HANDOFF_MVP_FACTORY_CONTROL.md` and `MVP_FACTORY_PROJECT_SETUP.md` must reflect Project 12 and the current status lane names.
| `docs/core/DOCS_INDEX.md` (and related core doc inventory) | Doc structure and canonical indexes (environment, LEARNINGS, naming). | The actual docs under `docs/core/` and `READMEDEV.md` referencing them. | Keep generated inventory docs committed whenever docs move, or `npm run docs:check` will fail by policy.
| `docs/i18n/I18N_SETUP.md` | Locale configuration and middleware summary. | `app/lib/i18n/` (`routing.ts`, `navigation.ts`), `middleware.ts`, `messages/*.json`, `app/[locale]` pages. | Confirm that the stated locales and NextIntl setup match the current code (13 locales, `middleware.ts` vs `createMiddleware`).
| `docs/sso/*` | SSO requirements and troubleshooting. | `auth.ts`, `auth.edge.ts`, `auth.config.ts`, `middleware.ts` (guards). | Match each doc to the actual auth flow; note that SSO is described as the primary auth method across docs.
| `docs/seo/SEO_IMPROVEMENT_PLAN.md` | SEO goals (sitemap, public lesson views). | `app/sitemap.ts`, `app/[locale]/courses/[courseId]/day/[dayNumber]/view`, `docs/features/GEO_IMPROVEMENT_PLAN.md`. | Highlight any SEO action items that still need execution (e.g., verifying sitemap entries). |

## Known discrepancies and follow-on audit targets

| Area | Current discrepancy | Source(s) | Suggested follow-up |
| --- | --- | --- | --- |
| Versioning | `README.md` still reports `2.9.33`, `docs/HANDOVER.md` mirrors that, `package.json` is `2.9.2`, while `docs/product/RELEASE_NOTES.md` and `docs/architecture/ARCHITECTURE.md` track the newer `2.9.48` line. | `README.md`, `docs/HANDOVER.md`, `package.json`, `docs/product/RELEASE_NOTES.md`, `docs/architecture/ARCHITECTURE.md` | Decide the canonical product-version source and normalize the mirrors in one pass. |
| Locale count | Some audit notes still mention `13 locales`, but `app/lib/i18n/locales.ts` currently exports `17` locale codes. | `docs/handoff/AmanobaAuditDocMapping.md`, `docs/i18n/LANGUAGE_DROPDOWN_PROBLEM_LOG.md`, `app/lib/i18n/locales.ts` | Refresh i18n docs and audit notes to the real locale list. |
| Cross-repo path portability | Several active docs still point at machine-local `/Users/moldovancsaba/Projects/amanoba_courses/process_them/...` paths. | `docs/product/TASKLIST.md`, `docs/core/agent_working_loop_canonical_operating_document.md`, other active docs with cross-repo references | Decide whether to keep absolute local paths, replace them with repo-relative cross-repo references, or duplicate the required content locally. |
| Generated docs gate | `npm run docs:check` frequently stops on refreshed generated-doc files rather than content validity. | `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, `docs/core/DOCS_TRIAGE.md` | Commit regenerated doc metadata with every doc wave or split content validation from commit-enforcement in the checker. |

## Quality gates used during the audit lane

| Command | Purpose | Notes |
| --- | --- | --- |
| `npm run lint` | Repo-wide static linting | Use when code changes are involved. |
| `npm test` | Vitest regression coverage | Use for runtime behavior changes and route regressions. |
| `npm run type-check` | TypeScript contract validation | Required for code or API surface changes. |
| `npm run docs:check` | Generated docs refresh + generated-doc policy + active-doc link check | Can fail by policy if refreshed generated docs are not committed with the change. |
| `npm run docs:links:check` | Active-doc link validation only | Useful for docs-only passes when `docs:check` is blocked by the generated-doc diff rule. |
| `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` | Archive-inclusive link validation | Use when an audit intentionally touches `docs/_archive/**`. |

## Audit artifact locations

- **Repo handover**: `docs/HANDOVER.md`
- **Issue-side evidence**: comment on the active `mvp-factory-control` issue (`#371`, `#373`, `#374`)
- **Reference mirrors**: `docs/product/TASKLIST.md`, `docs/product/ROADMAP.md`
- **Generated doc metadata**: `docs/core/DOCS_CANONICAL_MAP.md`, `docs/core/DOCS_INVENTORY.md`, `docs/core/DOCS_TRIAGE.md`

## Audit readiness checklist

### Environment prerequisites

- Use a supported runtime from `package.json`: Node `>=20.0.0 <25.0.0`, npm `>=10.0.0`.
- Ensure `.env.local` exists before running app paths or worker-backed checks; use `.env.local.example` as the source template.
- Start from the latest baseline with `git fetch origin && git status -sb`.
- Treat Project 12 as the work-tracking SSOT and `moldovancsaba/mvp-factory-control` as the issue/history SSOT.

### Execution checklist

1. Read `READMEDEV.md`, `docs/HANDOVER.md`, `docs/core/agent_working_loop_canonical_operating_document.md`, and `docs/status/PRODUCTION_STATUS.md`.
2. Review the current discrepancy register in this file before running commands so repeated audit findings are not rediscovered as if they were new.
3. Run the scoped quality gates that match the audit surface:
   - `npm run lint`
   - `npm test`
   - `npm run type-check`
   - `npm run docs:check`
   - `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` when archive docs are in scope
   - `npm run build` when route/runtime claims are part of the audit slice
4. Classify each failing gate as either:
   - content/runtime failure
   - generated-doc policy failure
   - environment/setup failure
5. Append outcomes to `docs/HANDOVER.md` and mirror the same evidence in the active `mvp-factory-control` issue comment.

### Board and issue logging workflow

- Keep the live execution note on the relevant `mvp-factory-control` issue (`#371`, `#373`, or `#374`).
- Use Project 12 statuses:
  - `Todo (NEXT)` when the audit slice is queued
  - `In Progress (NOW)` while actively running the slice
  - `Review (ALMOST)` when evidence is written and only review/field updates remain
  - `Done` once repo docs, issue evidence, and required gate evidence are aligned
- If Project field mutation is blocked, record the intended status/field change in the issue comment and in `docs/HANDOVER.md`.

### Final deliverables for audit closure

- Updated `docs/HANDOVER.md` entry with:
  - what changed
  - commands run
  - pass/fail results
  - remaining risks or blockers
- Matching `mvp-factory-control` issue comment with the same evidence.
- Updated discrepancy register when new active drift is discovered.
- If a discrepancy is resolved, remove or rewrite the stale note instead of leaving contradictory guidance behind.
- If a discrepancy remains intentionally unresolved, record the suggested follow-up owner/path in the discrepancy register.

### Current blocker summary

- The recurring blocker in this audit lane is `npm run docs:check`, which stops when refreshed generated docs files are not yet committed.
- Current unresolved content-level follow-up items remain:
  - version-number normalization
  - locale-count normalization
  - cross-repo path portability policy
  - any future decision on whether to split generated-doc policy from content validation
