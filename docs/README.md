# Amanoba Docs

This documentation is organized into domain folders. Treat this file and `docs/core/DOCS_INDEX.md` as the current entry points; older phase-complete and context-window documents are retained for history only.

## Start Here

- `docs/core/DOCS_INDEX.md` - high-level index and reading order
- `docs/architecture/layout_grammar.md` - structural and UI grammar source of truth
- `docs/core/ENVIRONMENT_SETUP.md` - canonical environment variable and setup guide
- `docs/deployment/DEPLOYMENT.md` - canonical deployment runbook (push to `origin/main` -> auto deploy)
- `docs/product/ROADMAP.md` - long-term vision
- `docs/product/TASKLIST.md` - actionable work
- `docs/product/RELEASE_NOTES.md` - shipped changes
- `docs/product/DESIGN_UPDATE.md` - current design-system status and migration policy
- `docs/HANDOVER.md` - current operational snapshot and recent verification history
- `docs/status/PRODUCTION_STATUS.md` - current deployment truth and latest recorded production verification
- `docs/features/NEWS_POSTS_MVP.md` - blog/news publishing contract for weekly updates
- `docs/core/CODING_STANDARDS.md` - coding and design-token standards
- `docs/core/CROSS_REPO_DOCS.md` - portable references to `amanoba_courses` documentation

## Structure

- `docs/core` - contribution, conventions, environment, operating docs
- `docs/product` - roadmap, tasklist, release notes, planning
- `docs/architecture` - system architecture and layout rules
- `docs/features` - feature-specific specs and notes
- `docs/i18n` - localization setup and language integrity
- `docs/sso` - SSO requirements, implementation, troubleshooting, and the Google-first sign-in flow used by Amanoba
- `docs/certification` - certificate/certification plans and analysis
- `docs/deployment` - deployment and platform setup
- `docs/quality` - audits, validation, and quality control docs
- `docs/status` - current production status plus historical phase/migration completion snapshots
- `docs/handoff` - board workflow docs and historical context-transfer snapshots
- `docs/seo` - SEO plans and submission
- `docs/_archive` - historical records and old delivery/reference/tasklist docs

## Course Content Docs

Course creation and maintenance documents were moved to:

- `amanoba_courses:process_them/docs`

See `docs/core/CROSS_REPO_DOCS.md` for the portable reference convention and the optional local checkout path.

## Validation

- `npm run docs:check` - generated docs + active link validation
- `npm run docs:links:check` - active link validation only
- `npm run ui:check:layout` - heuristic UI token/layout drift check
- `npm run ui:check:foundation` - hard-rule raw-color/token check

## Current Caveat

Not every Markdown file under `docs/` is canonical guidance. The current source-of-truth set is listed in `docs/core/DOCS_INDEX.md`; historical phase reports and older handoff snapshots should be used for context, not as implementation instructions.
