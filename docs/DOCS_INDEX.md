# Documentation index

**Last updated**: 2026-02-04  
**Purpose**: Single entry point for docs: core vs reference, deprecated, and mergeable.

---

## Core docs (source of truth)

| Doc | Purpose |
|-----|---------|
| **TASKLIST.md** | Open actionable tasks only. Completed → RELEASE_NOTES. |
| **ROADMAP.md** | Future vision only. No completed work. |
| **RELEASE_NOTES.md** | Completed work only. No placeholders. |
| **ARCHITECTURE.md** | System overview, stack, directory map, learning platform, APIs, deployment. |
| **CONTRIBUTING.md** | Workflow, coding standards, how to contribute. |
| **layout_grammar.md** | Layout rules: project structure, docs, course/lesson, API, locale. |
| **LEARNINGS.md** | Rationale, patterns, lessons learned. |

**Feature / reference**

| Doc | Purpose |
|-----|---------|
| **ENROLMENT_AND_PREREQUISITES.md** | Enrolment API, prerequisites (Course.prerequisiteCourseIds), list enrolments (GET /api/my-courses). |
| **VOTING_AND_REUSE_PATTERN.md** | Reuse via discriminator (one model/API/component). |
| **COURSE_BUILDING_RULES.md** | Course/lesson/quiz quality and structure. |
| **I18N_SETUP.md** | Locales, middleware, language switcher. |
| **LANGUAGE_DROPDOWN_PROBLEM_LOG.md** | i18n dropdown / URL fixes (reference). |
| **CERTIFICATE_AB_TEST_DESIGN.md** | Certificate template A/B at issue. |
| **CERTIFICATION_REFERENCE.md** | Index: current cert docs (CERTIFICATE_AB_TEST_DESIGN, CERTIFICATE_CREATION_GUIDE) + dated plans. |
| **QUIZ_SYSTEM_HISTORY.md** | Quiz fix releases; points to QUIZ_FIXING_DOCUMENTS_COMPLETE_LIST + pipeline handover/playbook. |
| **BUY_PREMIUM_FIX_DONE.md** | Buy premium fix (courseId normalization) — summary; detail in BUY_PREMIUM_FIX_*.md. |
| **DEPLOYMENT.md** / **VERCEL_DEPLOYMENT.md** | Deploy and env. |
| **ENVIRONMENT_SETUP.md** | Env vars, email provider, .npmrc. |
| **TECH_STACK.md** | Stack summary. |

---

## Deprecated / do not use

- **Script**: `scripts/fix-course-quizzes.ts` — **DEPRECATED**. Creates generic template questions. Use `scripts/process-course-questions-generic.ts` and quality pipeline instead. (See QUIZ_FIXING_DOCUMENTS_COMPLETE_LIST.md.)
- **Lesson model field**: `assessmentGameId` — deprecated; use `quizConfig`. (See ASSESSMENT_GAME_ID_MIGRATION.md.)
- **Auth**: Facebook / `facebookId` — obsolete; SSO only. (See SSO_MIGRATION_COMPLETE.md.)

---

## Dated delivery / audit docs (reference only)

These are point-in-time plans or audits. Use for context; for current state see TASKLIST, ROADMAP, RELEASE_NOTES.

- `2026-01_*.md`, `2026-01-23_*.md` … `2026-01-31_*.md` — January 2026 delivery plans, audits, layout audit, documentation audit, tech audit, certification plans, quiz plans.
- **ROADMAP_TASKLIST_SYSTEM_COMPARISON.md** — P2 #1 and P2 #2 are **done** (see RELEASE_NOTES and ENROLMENT_AND_PREREQUISITES.md). Doc remains useful for P2 #3–#4 and ROADMAP vs TASKLIST alignment.

---

## Consolidated (done)

- **ROADMAP_TASKLIST_SYSTEM_COMPARISON.md** — Kept as reference; status at top (P2 #1–#2 done). For "what to deliver next" see that doc or TASKLIST.
- **QUIZ_SYSTEM_HISTORY.md** — Created; summarises quiz releases and points to QUIZ_FIXING_DOCUMENTS_COMPLETE_LIST + pipeline handover/playbook.
- **BUY_PREMIUM_FIX_DONE.md** — Created; short summary of buy premium fix; detail remains in BUY_PREMIUM_FIX_PLAN/SUMMARY/STATUS/ROLLBACK.
- **CERTIFICATION_REFERENCE.md** — Created; index of current cert docs (CERTIFICATE_AB_TEST_DESIGN, CERTIFICATE_CREATION_GUIDE) and dated 2026-01-25 plans.

---

## Other locations

- **docs/canonical/** — Canonical course specs (CCS): JSON + _CCS.md per course family.
- **docs/course_ideas/** — Course idea and question notes.
- **docs/course_runs/** — Course run metadata.
- **docs/tasklists/** — Dated tasklist snapshots (reference).
- **Root**: CREATE_A_COURSE_HANDOVER.md, agent_working_loop_canonical_operating_document.md — course creation and agent loop.
