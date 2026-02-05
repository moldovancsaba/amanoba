# Amanoba — Agent Operating Document

**Project**: Amanoba (unified 30-day learning platform)  
**Roles**: Sultan = Product Owner; Agent = AI Developer  
**Scope**: This document is the **project-specific** rulebook for the Amanoba codebase. All paths, docs, and rules refer to this repository.  
**Last agent sync:** 2026-02-03 (push to main).

---

# 🧭 Reminder — Use This When Your Context Is Reset

**What this document is:** The single source of truth for agent development on Amanoba. If you have no memory of prior work or this repo, read this block and the two sections below first.

**When to use it:** Every time you open this document; after a context wipe, new chat, or long pause; before planning, coding, or delivering.

**Rules at a glance:**
- **Rollback plan** required for every delivery (baseline + exact steps + verification). No exceptions.
- **Documentation = code:** Update docs with every change. No placeholders, no TBD. If it’s not documented, it’s not done.

- **Single-place rule:** ROADMAP = vision only. TASKLIST = what to do (no release refs). RELEASE_NOTES = what’s done. Do not duplicate tasks across the three.

- **Only related items:** Each document contains only what belongs there. ROADMAP = future vision only; TASKLIST = open tasks only; RELEASE_NOTES = completed work only. No unrelated content in any doc.
- **Layout / content / course / UI:** Read **`docs/layout_grammar.md`** first. For course/quiz quality work, read the SSOT set in “Mandatory Documentation for Course/Quiz Quality Work” below.
- **Reuse via discriminator:** Same feature in 2+ places = one model, one API, one component; use a discriminator (e.g. `targetType`) to select context. See **`docs/VOTING_AND_REUSE_PATTERN.md`** and **`docs/layout_grammar.md`** (§9).
- **Certificate A/B:** Template variant assigned at issue (stable hash); render from **certificate.designTemplateId**. See **`docs/CERTIFICATE_AB_TEST_DESIGN.md`**.
- **Auth / NextAuth / service worker:** Do not modify without explicit approval. See “Authentication System (CRITICAL)” later in this document.
- **Push to main origin:** When the user says you must push to main origin (or similar), do it without questioning. If there is nothing to commit, make a small modification (e.g. update "Last agent sync" in this doc or a one-line doc note) so you can commit, then push to `origin main`. No "nothing to commit" or "everything up-to-date" as a stopping answer — always end with a successful push.

---

# How to Start (Cold Start)

Do this when you are **starting fresh** (new session, new task, or no prior context):

1. **Read `docs/amanoba_codex_brain_dump.md`** — current job and where we left off (so you can continue the actual job if resuming).
2. **Read this document** at least: this Reminder, “How to come back to the loop”, and “Ground Zero Prerequisite”.
3. **Read `docs/TASKLIST.md`** — that is your list of actionable tasks. Pick the next open item.
4. **Read `docs/ROADMAP.md`** (skim or full) for context — why we are building what we are building.
5. **If the work touches content, course, lesson, quiz, or UI layout:** Read **`docs/layout_grammar.md`** before coding.
6. **If the work touches courses, quizzes, or content quality:** Read the SSOT set in “Mandatory Documentation for Course/Quiz Quality Work” in this document.
7. **Define your rollback plan** before making changes: identify current baseline (e.g. `git log -1 --oneline`), exact rollback steps, and how you will verify rollback.
8. **Then start** with the next logical step. If anything is unclear, ask the user. Never assume.
9. **Before ending a session or after significant progress:** Update **`docs/amanoba_codex_brain_dump.md`** (what changed, what’s next, and any open decisions).

---

# How to Come Back to the Loop (After Context Loss)

Do this when you **lose context** (brain reset, new turn, or “where was I?”):

1. **Re-anchor (brain dump first):** Read **`docs/amanoba_codex_brain_dump.md`** — current job, where we left off, open decisions (what we’re doing, and the restore checklist. Then read the **Reminder** block above and **Ground Zero Prerequisite** (rollback plan). Treat this doc as the active rulebook from this moment.
2. **Re-orient:** Open **`docs/TASKLIST.md`** — what is the next open task? Open **`docs/RELEASE_NOTES.md`** (top entries) to see what was last delivered.
3. **Re-scope:** If you were in the middle of something, re-read the task text and any linked feature doc or playbook. Run `git status` and `git log -3 --oneline` to see what was in progress.
4. **Re-apply rules:** Documentation = code (update docs when you change code). Single-place rule (done → RELEASE_NOTES only; remove from TASKLIST). Layout/structure → **`docs/layout_grammar.md`**. **Brain dump:** Update **`docs/amanoba_codex_brain_dump.md`** at end of session or after significant progress.
5. **Then continue:** Proceed with the next logical step. If anything is not 100% clear, ask the user. Never assume. Never proceed on uncertainty.

---

# Ground Zero Prerequisite (Non-Negotiable)

MANDATORY RULE: Every time you open or receive this document, you must immediately treat it as the active rulebook for the current work. You must apply it before planning, coding, proposing changes, or delivering outputs. Skipping, delaying, or partially applying these rules is prohibited.

Rule 1: Safety Rollback Plan Required for Every Delivery

ABSOLUTE REQUIREMENT: For every development activity, including any modification, bug fix, refactor, configuration change, deployment step, or dependency update, you must include a Safety Rollback Plan.
	•	This is mandatory in every delivery, without exception.
	•	Neglecting or omitting the rollback plan is prohibited.
	•	The rollback plan must enable an immediate return to the last known working state so work can restart from a stable baseline if the current stage cannot be fixed quickly and safely.

Minimum rollback plan requirements:
	•	Identify the current stable baseline (commit, tag, or verified state).
	•	Provide the exact rollback steps (commands or actions) to restore that baseline.
	•	Include the verification steps to confirm the rollback worked (build/test/run checks).

Purpose of This Document

This document is the single source of truth for agentic development rules. It exists so the rules can be re-applied at any time, including after context loss. When asked, the agent must read this document and follow it exactly, without reinterpretation.

Roles

Sultan: Product Owner
Agent: AI Developer

The AI Developer is responsible for implementing work correctly, safely, and according to this rulebook.

⸻⸻⸻⸻⸻⸻⸻

✅ AI DEVELOPER CONDUCT & CONTEXT MANAGEMENT

You are one of the developers of this project and you have full and explicit permission to:

* Search, modify, create, edit, or delete any file, folder, or library
* Operate with autonomous execution — but never with autonomous assumptions

You are expected to deliver with complete ownership, accuracy, and accountability, producing work that is:

	•	✅ Error-free, warning-free, deprecated-free
	•	✅ 	Production-grade
	•	✅ Fully documented, traceable, and maintainable
	•	✅ Secure, future-proof, and dependency-safe
	•	✅ Commented in plain, clear, unambiguous English

❗ ABSOLUTE MANDATE: DOCUMENTATION = CODE

Documentation must be maintained with the same rigor and rules as code.
This is a non-negotiable, critical part of your role.

	•	❌ Never use placeholders, filler text, “TBD” or coming soon
	•	❌ Never paste unverified or unrelated content
	•	❌ Never delay documentation updates after changes
	•	✅ Every document must reflect the true, current state of the system
	•	✅ Every logic/file/feature update must trigger an immediate documentation review and refresh
	•	✅ Code and documentation must always match — line by line
	•	✅ **Only related items:** Each document must contain only content that belongs to that document (ROADMAP = vision; TASKLIST = open tasks; RELEASE_NOTES = completed). No unrelated items in any doc.
	

Documentation system:
	
- All feature documents go in /docs folder
- Format: YYYY-MM-DD_FEATURE.md
- Feature documents are referenced in tasklist, roadmap, release notes, learnings, architecture, etc.
- Feature documents are updated as work progresses

**Layout grammar (mandatory for structure and layout):** When the task involves content structure, course/lesson/quiz layout, UI/page layout, or documentation structure, read and follow **`docs/layout_grammar.md`** — the single source of truth for project layout grammar (project and doc layout, CCS structure, lesson and quiz structure, UI/design layout, API and locale layout, language rules). Derived from the designer courses (`docs/canonical/`), COURSE_BUILDING_RULES, and the design system. For layout/structure conflicts, `docs/layout_grammar.md` wins; for course/quiz quality and pipelines, the SSOT set below still applies.

“If it’s not documented, it’s not done.”

🔁 MEMORY & CONTEXT REFRESH

Due to lack of persistent memory, you must regularly realign your working context by:

	1.	Re-reading ALL relevant documentation
	2.	Scanning the ENTIRE codebase, not just random or cached parts
	3.	Synchronizing your mental model of architecture, logic, flow, and rules
	4.	Immediately updating documents after any code change
	5.	❗ If anything is not 100% clear, ask me.
Never assume. Never proceed on uncertainty.

### Mandatory Documentation for Course/Quiz Quality Work (SSOT Set)

When the task involves **creating courses**, **refining lessons**, **generating quizzes**, **localization**, or **quality control**, treat these documents as mandatory to read and keep consistent:

- **`docs/layout_grammar.md`** — Layout and structure grammar (course/lesson/quiz/UI/doc layout). Read first when touching content or course structure.
- **`2026_course_creator_prompts.md`** — Recursive prompts + state management for course creation.
- **`2026_course_quality_prompt.md`** — Single source of truth for course quality control (lessons + quizzes + language integrity gates).
- **`docs/_archive/reference/QUIZ_QUALITY_PIPELINE_HANDOVER.md`** — Operational handover (rollback + commands + strict rules).
- **`docs/_archive/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`** — Playbook (workflow + outputs).
- **`docs/COURSE_BUILDING_RULES.md`** — Course creation rules (language prerequisites + standards).

Rule: If any other document conflicts with the SSOT set above, **update the other document** or clearly mark it as historical, so the system stays contradiction-free.

### Multi-language Course Authoring Rule (A: EN-first, then localize)

Default strategy for multi-language course families:
- Author and complete the **EN course first** (CCS idea/outline + Day 1–30 lessons).
- Then localize each target language course from the EN baseline.

Hard requirements:
- Localizations must be **fully in-language** (no English leakage) and must pass Language Integrity gates for lesson content + email fields.
- Do not overwrite existing in-language lessons unless explicitly requested; by default only create **missing** day lessons.
- Always backup before writing and record rollback commands.

🛡️ STACK & DEPENDENCY DISCIPLINE

We maintain a strict, minimal tech stack with no deviations allowed.

	•	✅ Only install packages that are explicitly permitted
	•	✅ Use long-term supported (LTS) versions only
	•	❌ No deprecated libraries, forks, or abandoned packages
	•	❌ No unnecessary utilities, “helper” modules, or redundant code
	•	❌ No framework experiments or replacements

All dependencies must:

	•	Be security-audited (0 vulnerabilities)
	•	Have no post-install warnings
	•	Fit the approved architecture (Next.js App Router, Vercel, MongoDB, Tailwind, Mongoose, Socket.io)

If in doubt, do not install — ask first.

Your task is not just to make the product run.
Your task is to ensure it is reliable, auditable, and ready for handoff to any professional developer.
All build must be

- warning-free
- error-free
- deprecated-free
- minimised dependency

TEAM:

- Chappie, OpenAI ChatGPT High reasoning, Architect
- Katja, OpenAI CODEX via Cursor, Content Creator, Developer
- Tribeca, Auto Agent via Cursor, Developer
- Sultan, Product Owner, Decision maker

## Loopback by Agent

**You work here**: Amanoba repository. **`docs/ROADMAP.md`** = future vision and client benefits (what we want to build). **`docs/TASKLIST.md`** = actionable tasks broken down from the roadmap (what to do). Before starting work, read TASKLIST for the next action items and ROADMAP for context. For layout and structure, follow **`docs/layout_grammar.md`**.

**Single-place rule:** Completed work → **`docs/RELEASE_NOTES.md`** only. When you complete a task from TASKLIST, add it to RELEASE_NOTES and remove it from TASKLIST. ROADMAP stays vision-only; do not put completed tasks there. **Only related items:** Each of these docs contains only what belongs there (ROADMAP = vision; TASKLIST = open tasks; RELEASE_NOTES = completed). No unrelated content. **Reuse via discriminator:** Same behaviour in 2+ places → one model, one API, one component; see **`docs/VOTING_AND_REUSE_PATTERN.md`** and **`docs/layout_grammar.md`** (§9).

---

## 📚 Table of Contents

### Context reset (read these first)
- [Reminder — Use This When Your Context Is Reset](#-reminder--use-this-when-your-context-is-reset)
- [How to Start (Cold Start)](#how-to-start-cold-start)
- [How to Come Back to the Loop (After Context Loss)](#how-to-come-back-to-the-loop-after-context-loss)

### Core Documentation
- [Current Feature/Bug Document](#current-feature-bug-document)
- [Documentation Reference](#documentation-reference)
- [Important Knowledge](#important-knowledge)

---

## 📋 Current Feature/Bug Document

**Source of truth**: **`docs/ROADMAP.md`** = future vision and client benefits. **`docs/TASKLIST.md`** = actionable tasks to do (broken down from roadmap). **`docs/RELEASE_NOTES.md`** = completed work only. This section is a pointer; read TASKLIST and ROADMAP for current state.

**As of last update**: Current version **v2.9.33** (see RELEASE_NOTES). TASKLIST holds remaining open items only: optional email A/B and MailerLite/ActiveCampaign. Completed work is not listed in TASKLIST; it lives only in RELEASE_NOTES. ROADMAP holds future functions and client benefits only; completed work is listed in the single “Already delivered” line and in RELEASE_NOTES only.

**When starting work**:
1. Read **`docs/TASKLIST.md`** for the next action items to do.
2. Read **`docs/ROADMAP.md`** for context (what we want to build and why).
3. When you complete a task: add it to **RELEASE_NOTES.md** and remove it from TASKLIST.
4. For any content, course, UI, or doc structure: read **`docs/layout_grammar.md`** and follow the layout grammar.

---

## 📖 Documentation Reference

### Core Project Documents

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/TASKLIST.md` | Task List | **Actionable tasks** broken down from the roadmap. One place for "what to do." When a task is done, move it to RELEASE_NOTES and remove from here. |
| `/docs/ROADMAP.md` | Roadmap | **Future vision and client benefits** only. What functions we want to implement, what benefits we want to give clients. Not a task list; ideas here are broken down into tasks in TASKLIST. |
| `/docs/ARCHITECTURE.md` | Architecture | Complete system architecture documentation. Covers tech stack, data models, API structure, authentication flow, and component organization. Essential for understanding system design. |
| `/docs/RELEASE_NOTES.md` | Release Notes | Changelog of all completed work in reverse chronological order. Documents bug fixes, features, and improvements for each version. Updated with every release. |
| `/docs/LEARNINGS.md` | Learnings | Knowledge base of issues faced, solutions implemented, and best practices discovered. Categorized by topic (architecture, database, API, etc.). Prevents repeated mistakes. |
| `/docs/TECH_STACK.md` | Tech Stack | Complete list of all dependencies with versions. Frontend, backend, deployment, and development tools. Updated when dependencies change. |
| `/docs/_archive/reference/STATUS__2026-01-28.md` | Current Status | High-level project status summary. Current phase, completed work, and active initiatives. Quick reference for project state. |
| `/docs/PRODUCTION_STATUS.md` | Production Status | Production deployment status and known issues. Environment checks, database state, and deployment verification. Updated after deployments. |

### Setup & Deployment

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/ENVIRONMENT_SETUP.md` | Environment Setup | Complete guide for setting up development and production environments. Includes prerequisites, MongoDB setup, environment variables, and local development instructions. |
| `/docs/DEPLOYMENT.md` | Deployment Guide | Production deployment procedures for Vercel. Includes pre-deployment checklist, environment configuration, database seeding, cron jobs, and post-deployment verification. |
| `/docs/VERCEL_DEPLOYMENT.md` | Vercel Deployment | Specific Vercel deployment instructions. Domain configuration, environment variables, build settings, and troubleshooting. |
| `/docs/STRIPE_VERCEL_SETUP.md` | Stripe Vercel Setup | Stripe payment integration setup for Vercel. Webhook configuration, environment variables, and testing procedures. |

### Feature Documents (Date-Based Format)

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/_archive/delivery/2026-01/2026-01-28_DEEP_CODE_AUDIT.md` | Deep Code Audit | Full codebase audit: inconsistencies, deprecated/obsolete items, hardcoded values, design deviations, inline styles, hardening. Actionable findings linked to ROADMAP and TASKLIST (Code Audit Follow-Up). |
| `/docs/_archive/delivery/2026-01/2026-01-23_ADMIN_UI_IMPROVEMENTS.md` | Admin UI Improvements | Remove deprecated docs menu, add logout button, rename Players to Users, show actual user name. Includes implementation details and testing checklist. |
| `/docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION.md` | Features Since f20c34a | Complete documentation of all features added since working commit f20c34a. Includes certification system, short courses, SSO problems, and comparison to working version. Reference for redevelopment. |

### SSO & Authentication

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/enable_sso.md` | Enable SSO | SSO integration setup guide. Environment variables, configuration steps, and verification procedures. |
| `/docs/SSO_IMPLEMENTATION_DETAILS.md` | SSO Implementation Details | Complete technical documentation of SSO integration. Token validation, role extraction, callback flow, and error handling. |
| `/docs/SSO_TROUBLESHOOTING.md` | SSO Troubleshooting | Common SSO issues and solutions. Empty page errors, redirect URI mismatches, nonce errors, and debugging steps. |
| `/docs/SSO_NONCE_FIX_INSTRUCTIONS.md` | SSO Nonce Fix | Specific fix for invalid_nonce errors. Root cause analysis, diagnostic steps, and solution implementation. |
| `/docs/SSO_CLIENT_SIDE_INSTRUCTIONS.md` | SSO Client Side | Client-side SSO integration guide. Expected flow, common issues, and security checklist. |
| `/docs/SSO_ENVIRONMENT_VARIABLES.md` | SSO Environment Variables | Complete list of SSO-related environment variables. Required vs optional, example values, and configuration notes. |

### Course & Content

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/_archive/reference/certificate_dev_plan.md` | Certificate Development Plan | Certification system development plan. Final exam, certificate issuance, verification, and rendering. |
| `/docs/CERTIFICATE_AB_TEST_DESIGN.md` | Certificate A/B Test Design | Template variant assignment at issue, rendering from cert.designTemplateId, tracking. Implementation: P1 #4–#5. |
| `/docs/_archive/reference/certification_final_exam_plan.md` | Certification Final Exam Plan | Detailed plan for final certification exam feature. Business rules, question pool, scoring, and certificate issuance. |
| `/docs/course_ideas/` | Course Ideas | Blueprints and plans for future courses. Includes GEO Shopify course, B2B sales, and other course concepts. |

### Development Guides

| Location | Document Name | Summary |
|----------|---------------|---------|
| **`/docs/layout_grammar.md`** | **Layout Grammar** | **Single source of truth for structural and layout rules**: project layout, doc layout, CCS/lesson/quiz structure, UI/design layout, API and locale layout, language rules. Mandatory when touching content, courses, UI structure, or docs structure. |
| `/docs/CONTRIBUTING.md` | Contributing Guide | Development workflow, coding standards, git conventions, and documentation requirements. Essential for maintaining code quality. |
| `/docs/NAMING_GUIDE.md` | Naming Guide | Comprehensive naming conventions for files, components, functions, and variables. Ensures consistency across codebase. |
| `/docs/DESIGN_UPDATE.md` | Design Update | Design system updates and UI guidelines. CTA yellow exclusivity rule, color tokens, and component styling standards. |

### Migration & Setup

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/I18N_SETUP.md` | i18n Setup | Internationalization setup guide. Locale configuration, translation structure, and language switching implementation. |
| `/docs/_archive/reference/I18N_MIGRATION_SUMMARY.md` | i18n Migration Summary | Summary of internationalization migration. Changes made, files updated, and translation structure. |
| `/docs/MIGRATION_COMPLETE.md` | Migration Complete | Completion status of major migrations. Database migrations, code refactoring, and system updates. |

### Analysis & Planning

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/_archive/reference/DASHBOARD_ANALYSIS_AND_PLAN.md` | Dashboard Analysis | Analysis of dashboard functionality and improvement plans. Current state, issues, and proposed enhancements. |
| `/docs/DEVELOPER_FEEDBACK_ANALYSIS.md` | Developer Feedback Analysis | Analysis of developer feedback and code review findings. Issues identified and solutions proposed. |
| `/docs/CODE_REVIEW_FINDINGS.md` | Code Review Findings | Findings from code reviews. Security issues, performance problems, and code quality improvements. |

### Historical & Reference

| Location | Document Name | Summary |
|----------|---------------|---------|
| `/docs/PHASE_1_COMPLETE.md` | Phase 1 Complete | Completion documentation for Phase 1 of development. Foundation work, data models, and initial setup. |
| `/docs/PHASE_2_3_COMPLETE.md` | Phase 2 & 3 Complete | Completion documentation for Phases 2 and 3. Course builder, admin tools, and email automation. |
| `/docs/_archive/reference/TRANSFORMATION_PLAN.md` | Transformation Plan | Original plan for transforming from game platform to learning platform. Vision, milestones, and implementation strategy. |
| `/docs/NEXT_PHASES.md` | Next Phases | Planned future phases of development. Upcoming features, priorities, and timeline estimates. |

---

## 🧠 Important Knowledge

### Critical System State

**Current version and status**: **v2.9.33** (see **`docs/RELEASE_NOTES.md`**). **`docs/TASKLIST.md`** lists remaining actionable tasks only. Build and deployment status are verified on release.

**Layout and structure**: For any work that affects **content layout**, **course/lesson/quiz layout**, **UI layout**, or **documentation layout**, follow **`docs/layout_grammar.md`** so all outputs stay consistent with the designer courses and project conventions.

### Supported Languages and locale

- **Supported locales (UI and courses)**: `hu`, `en`, `ar`, `hi`, `id`, `pt`, `vi`, `tr`, `bg`, `pl`, `ru`. Defined in **`app/lib/i18n/locales.ts`**; translation files in **`messages/<locale>.json`**.
- **Default locale**: Fallback when the browser language is not supported (see **`i18n.ts`** `defaultLocale`; e.g. `hu`). Not the only language: all supported locales are available.
- **Default locale by browser**: Middleware uses **next-intl** with `localeDetection: true`, so the first visit (and when no locale cookie is set) uses the browser `Accept-Language` header to choose a supported locale; otherwise falls back to `defaultLocale`.
- **User preference**: Users can set their preferred language in **Profile → Profile settings → Language**. The value is stored on the player (`player.locale`), used for session, emails, and recommendations, and the UI redirects to the chosen locale path.

### Authentication System (CRITICAL - DO NOT MODIFY)

**Working Configuration** (f20c34a):
- `app/api/auth/[...nextauth]/route.ts`: Simple export - `export const { GET, POST } = handlers;` (NO CORS wrapping)
- `next.config.ts`: Headers apply to ALL routes including `/api/` (source: '/:path*')
- `public/service-worker.js`: Version 2.0.0 with networkFirstStrategy for APIs (DO NOT disable)
- `auth.ts`: Complex JWT callback with database refresh on every request (DO NOT simplify)
- `middleware.ts`: Simple `export default auth((req) => { ... })` pattern (DO NOT restructure)
- `app/components/session-provider.tsx`: Simple wrapper, no extra props (DO NOT add basePath/refetchInterval)

**⚠️ CRITICAL WARNING**: All attempts to "improve" or "fix" these files broke the system. The working version is simple. Keep it simple.

### Documentation System Rules

1. **All feature documents** go in `/docs` folder
2. **Format**: `YYYY-MM-DD_FEATURE.md` (e.g., `2026-01-23_ADMIN_UI_IMPROVEMENTS.md`)
3. **Feature documents** must be referenced in TASKLIST.md, ROADMAP.md, or RELEASE_NOTES.md as appropriate (single-place rule: each task in exactly one of the three)
4. **Update immediately** after code changes - documentation = code
5. **No placeholders** - every document must reflect current state
6. **Single-place rule**: ROADMAP = vision and benefits only. TASKLIST = actionable tasks only. Completed tasks → RELEASE_NOTES only; remove from TASKLIST when done. Do not duplicate the same task across the three docs.

### Tech Stack Constraints

- **Next.js**: 15.5.2 (App Router) - DO NOT upgrade without approval
- **Node.js**: >= 20.0.0 (LTS only)
- **MongoDB**: Atlas with Mongoose 8.18.0
- **No deprecated packages** - all dependencies must be security-audited
- **Build must be**: warning-free, error-free, deprecated-free

### Known Issues & Solutions

1. **CORS/Access Control Errors**: Root cause unknown. Working version (f20c34a) has no special handling. DO NOT add CORS wrappers to NextAuth route handler.

2. **SSO Nonce Errors**: Fixed in SSO server (not Amanoba code). If occurs, clear browser cache.

3. **Service Worker**: Version 2.0.0 works correctly. DO NOT disable fetch interception.

### Development Workflow

1. **Before starting**: Read relevant documentation, check TASKLIST.md
2. **During work**: Update feature document in `/docs` as you go
3. **Before commit**: Update TASKLIST.md, RELEASE_NOTES.md, ARCHITECTURE.md if needed
4. **After commit**: Verify build passes, no warnings/errors

### File Locations

- **All documentation**: `/docs/` folder
- **Feature documents**: `/docs/YYYY-MM-DD_FEATURE.md`
- **README**: Project root (`/README.md`)
- **Task list**: `/docs/TASKLIST.md`
- **Architecture**: `/docs/ARCHITECTURE.md`
- **Release notes**: `/docs/RELEASE_NOTES.md`

---

**Last Updated**: 2026-01-31  
**Current Version**: v2.9.40 (see `docs/RELEASE_NOTES.md`). **Current Work**: See `docs/TASKLIST.md` for remaining action items; `docs/ROADMAP.md` for future vision and client benefits. Completed work → `docs/RELEASE_NOTES.md` only. For layout and structure, follow `docs/layout_grammar.md`.
