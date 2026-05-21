# Documentation index

**Last updated**: 2026-05-20
**Purpose**: Canonical entrypoint for active Amanoba documentation. Historical phase reports and old handoff snapshots may remain in `docs/`, but the tables below identify current guidance.

**Generated helpers**

- `docs/core/DOCS_INVENTORY.md` - full inventory of `docs/**/*.md` (except archive)
- `docs/core/DOCS_CANONICAL_MAP.md` - proposed KEEP/MERGE/ARCHIVE/DELETE map
- `docs/core/DOCS_TRIAGE.md` - triage view derived from canonical map
- `npm run docs:links:check` - active-doc link validation (non-archive)

---

## Core docs (source of truth)

| Doc | Path | Purpose |
|-----|------|---------|
| **ROADMAP.md** | `docs/product/ROADMAP.md` | Product vision and long-term direction. |
| **TASKLIST.md** | `docs/product/TASKLIST.md` | Current actionable work only. |
| **RELEASE_NOTES.md** | `docs/product/RELEASE_NOTES.md` | Completed and shipped changes. |
| **ARCHITECTURE.md** | `docs/architecture/ARCHITECTURE.md` | System architecture and platform overview. |
| **layout_grammar.md** | `docs/architecture/layout_grammar.md` | Layout, structure, and documentation conventions. |
| **CODING_STANDARDS.md** | `docs/core/CODING_STANDARDS.md` | Coding standards, design-token rules, and version/doc alignment rules. |
| **CROSS_REPO_DOCS.md** | `docs/core/CROSS_REPO_DOCS.md` | Portable reference contract for `amanoba` to `amanoba_courses` documentation links. |
| **TECH_STACK.md** | `docs/core/TECH_STACK.md` | Current framework, infrastructure, provider, and dependency baseline. |
| **CONTRIBUTING.md** | `docs/core/CONTRIBUTING.md` | Workflow and contributor standards. |
| **LEARNINGS.md** | `docs/core/LEARNINGS.md` | Persistent implementation learnings and patterns. |
| **agent_working_loop_canonical_operating_document.md** | `docs/core/agent_working_loop_canonical_operating_document.md` | Project operating rules for agents and contributors. |
| **amanoba_codex_brain_dump.md** | `docs/core/amanoba_codex_brain_dump.md` | Continuity snapshot for fast recovery after context loss. |
| **PRODUCTION_STATUS.md** | `docs/status/PRODUCTION_STATUS.md` | Current deployment truth, smoke-check policy, and latest recorded production verification. |

**Feature / reference**

| Doc | Path | Purpose |
|-----|------|---------|
| **ENROLMENT_AND_PREREQUISITES.md** | `docs/features/ENROLMENT_AND_PREREQUISITES.md` | Multi-course enrolment model, API and UI behavior. |
| **FRIEND_STREAKS_MVP.md** | `docs/features/FRIEND_STREAKS_MVP.md` | Invite-based pair accountability loop built on real learning actions. |
| **LEARNING_STREAK_MVP.md** | `docs/features/LEARNING_STREAK_MVP.md` | Daily learning streak behavior tied to meaningful learning actions. |
| **NEWS_POSTS_MVP.md** | `docs/features/NEWS_POSTS_MVP.md` | Blog/news publishing contract and automation handoff. |
| **PRACTICE_HUB_MVP_CONTRACT.md** | `docs/features/PRACTICE_HUB_MVP_CONTRACT.md` | Practice Hub MVP review modes, prioritization rules, and current data limits. |
| **QUIZ_ANSWER_EXPLANATION_PILOT.md** | `docs/features/QUIZ_ANSWER_EXPLANATION_PILOT.md` | Optional quiz answer explanation behavior. |
| **RELEASE_NOTES_WIKI.md** | `docs/features/RELEASE_NOTES_WIKI.md` | GitHub wiki release-note archive format and publish workflow. |
| **SAVED_LESSONS_MVP.md** | `docs/features/SAVED_LESSONS_MVP.md` | Saved Lessons library scope and data contract. |
| **I18N_SETUP.md** | `docs/i18n/I18N_SETUP.md` | Locale setup and language integrity requirements. |
| **SSO_IMPLEMENTATION_DETAILS.md** | `docs/sso/SSO_IMPLEMENTATION_DETAILS.md` | SSO architecture and implementation details. |
| **CERTIFICATION_REFERENCE.md** | `docs/certification/CERTIFICATION_REFERENCE.md` | Certification-related reference index. |
| **DEPLOYMENT.md** | `docs/deployment/DEPLOYMENT.md` | Deployment and runtime operations baseline. |
| **DESIGN_UPDATE.md** | `docs/product/DESIGN_UPDATE.md` | Current design-system status, rules, and migration backlog. |
| **HANDOFF_MVP_FACTORY_CONTROL.md** | `docs/handoff/HANDOFF_MVP_FACTORY_CONTROL.md` | Board handoff and issue workflow model. |
| **MVP_FACTORY_PROJECT_SETUP.md** | `docs/handoff/MVP_FACTORY_PROJECT_SETUP.md` | One-time project scope setup for board automation. |
| **AmanobaAuditDocMapping.md** | `docs/handoff/AmanobaAuditDocMapping.md` | Audit SSOT inventory: board workflow, doc-to-code mapping, and quality gates. |
| **HANDOVER.md** | `docs/HANDOVER.md` | Current operational handover and recent delivery notes. |
| **HANDOFF_CONTEXT_WINDOW_2026-02-12.md** | `docs/handoff/HANDOFF_CONTEXT_WINDOW_2026-02-12.md` | Historical context-transfer snapshot; use only for February 2026 background. |
| **NEXT_WINDOW_PROMPT.md** | `docs/handoff/NEXT_WINDOW_PROMPT.md` | Historical prompt snapshot; use `docs/HANDOVER.md` for current continuation state. |
| **QUALITY_VALIDATION_SYSTEM.md** | `docs/quality/QUALITY_VALIDATION_SYSTEM.md` | Quiz/content quality validation model. |
| **SEO_IMPROVEMENT_PLAN.md** | `docs/seo/SEO_IMPROVEMENT_PLAN.md` | Search and discoverability improvement plan. |

---

## Folder map

- `docs/core` - conventions, operating docs, environment, generated doc metadata
- `docs/product` - roadmap, tasklist, release notes, planning and product decisions
- `docs/architecture` - system architecture and layout grammar
- `docs/features` - feature-specific specs and migration notes
- `docs/i18n` - localization setup and language-related audits
- `docs/sso` - SSO requirements, implementation and troubleshooting
- `docs/certification` - certification and certificate system docs
- `docs/deployment` - deployment instructions and environment checks
- `docs/quality` - audits, code-review findings, quality frameworks
- `docs/status` - phase completion and production status snapshots
- `docs/handoff` - handoff workflow and feature issue templates
- `docs/seo` - SEO planning and sitemap notes
- `docs/_archive` - historical, non-canonical documents

---

## Course content docs

Course creation and maintenance documentation was separated to:

- `amanoba_courses:process_them/docs` (see `docs/core/CROSS_REPO_DOCS.md`)

Use this repo's `docs/` for platform/system docs, not course-content authoring assets.
