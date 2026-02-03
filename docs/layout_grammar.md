# Amanoba Layout Grammar

**Version**: 1.0  
**Last Updated**: 2026-01-30  
**Status**: ACTIVE — Single source of truth for structural and layout rules

---

This document defines the **layout grammar** of the Amanoba project: how content, courses, UI, and documentation are structured. It is derived from the designer courses (canonical course specs), course building rules, design system, and codebase conventions. **Agents and developers must follow this grammar** when creating or editing content, courses, pages, or docs.

---

## 1. Project layout (files and folders)

| Location | Purpose |
|----------|--------|
| `/docs` | All feature and reference documentation. Feature docs: `YYYY-MM-DD_FEATURE.md`. |
| `/docs/canonical/<COURSE_FAMILY>/` | Canonical course spec (CCS): `<NAME>.canonical.json` + `<NAME>_CCS.md`. |
| `/app` | Next.js App Router: `[locale]`, `api`, `lib`, `design-system.css`, `globals.css`. |
| `/app/[locale]` | Locale-scoped routes (e.g. `dashboard`, `courses`, `profile`, `admin`, `certificate`). |
| `/messages` | i18n: `en.json`, `hu.json`, etc. Keys by feature (e.g. `dashboard`, `common`). |
| `/scripts` | One-off and runbook scripts: audit, backfill, seed, fix, reports. |
| `/components` | Shared React components. |
| `/public` | Static assets. |

**Naming**: Files and directories use **kebab-case**. Code: **camelCase** (vars, functions), **PascalCase** (components, types, classes). See `docs/NAMING_GUIDE.md`.

---

## 2. Documentation layout

- **Feature documents**: `/docs/YYYY-MM-DD_FEATURE.md`. Referenced from TASKLIST, ROADMAP, RELEASE_NOTES, ARCHITECTURE, LEARNINGS as needed.
- **Core docs**: `TASKLIST.md`, `ROADMAP.md`, `RELEASE_NOTES.md`, `ARCHITECTURE.md`, `LEARNINGS.md` live in `/docs`. They are the source of truth for tasks, strategy, releases, architecture, and learnings.
- **Only related items**: Each document contains only content that belongs to it. ROADMAP = future vision only; TASKLIST = open tasks only; RELEASE_NOTES = completed work only. No unrelated items in any doc.
- **No placeholders**: Every document must reflect the current state. "TBD" and "coming soon" are not allowed in committed docs.
- **Documentation = code**: Logic and feature changes require an immediate documentation review and update.

---

## 3. Course and canonical course spec (CCS) layout

Designer courses in the system are expressed as **canonical course specs (CCS)**.

**Location**: `docs/canonical/<COURSE_FAMILY>/`  
**Files**:  
- `<NAME>.canonical.json` — machine-readable CCS (schema below).  
- `<NAME>_CCS.md` — narrative guide and usage.

**Canonical JSON structure (grammar)**:

- **Top level**: `schemaVersion`, `courseIdBase`, `courseName`, `version`, `intent` (oneSentence, outcomes, nonGoals), `qualityGates`, `concepts`, `procedures`, `assessmentBlueprint`, `lessons`.
- **concepts**: Map of concept key → `{ definition, notes[] }`.
- **procedures**: Array of `{ id, name, steps[], usedInDays[] }`.
- **lessons**: Array of lesson outlines, one per day, with:
  - `dayNumber`, `canonicalTitle`, `intent`, `goals[]`, `requiredConcepts[]`, `requiredProcedures[]` (optional), `canonicalExample` (optional), `commonMistakes[]`.
- **assessmentBlueprint**: `defaults` (minQuestions, minApplication, minCriticalThinking, forbiddenQuestionTypes), `questionArchetypes`, `distractorGuidelines`.

**Rule**: Localized lessons and quizzes must align with the CCS for that course family. Drift is either a localization defect or a CCS version change, never silent.

**Existing CCS families**:  
- `docs/canonical/PRODUCTIVITY_2026/`  
- `docs/canonical/DONE_BETTER_2026/`  
- `docs/canonical/SCRUMMASTER_LESZEK_2026/` (HU: seed via `scripts/seed-scrummaster-leszek-2026-hu.ts --apply --full-lessons`)

---

## 4. Lesson layout (data and content)

**Model**: `app/lib/models/lesson.ts` (Lesson schema).

**Required fields**:  
- `lessonId`, `courseId`, `dayNumber` (1–30 for 30-day courses), `language`, `title`, `content`, `emailSubject`, `emailBody`, `pointsReward`, `xpReward`, `isActive`, `displayOrder`.

**Content structure (grammar for lesson content)**:

- **Introduction** — context and why it matters.  
- **Main content** — concepts and procedures (aligned to CCS).  
- **Summary** — short recap.  
- **Action items** — concrete next steps.

**Quality**: 20–30 min reading time; clear structure; specific and actionable; no fluff; same language as course (language integrity). Email fields (`emailSubject`, `emailBody`) must be in-language and free of leakage from other languages.

**Quiz linkage**: `quizConfig`: `enabled`, `successThreshold` (e.g. 70), `questionCount`, `poolSize`, `required`. Quizzes are generated/aligned from CCS and lesson content.

---

## 5. Quiz layout (structure and quality)

- **Per lesson**: Minimum **7** valid questions (more allowed).  
- **Cognitive mix (hard rules)**:
  - **0 RECALL** questions.  
  - Minimum **5 APPLICATION** questions.  
  - Minimum **2 CRITICAL_THINKING** questions (recommended).  
- **Format**: 4 options per question (1 correct + 3 plausible distractors).  
- **Metadata**: UUID v4, hashtags, `questionType` (APPLICATION | CRITICAL_THINKING), `difficulty`, `category`.  
- **Content**: Standalone, scenario-based, grounded in the lesson and CCS; no lesson-referential wording; no throwaway options; distractors must be educational.

See `docs/COURSE_BUILDING_RULES.md` and `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` for full quiz quality rules.

---

## 6. UI and design layout

**Design system**: `app/design-system.css`, `app/globals.css`, `tailwind.config.ts`.

**Color tokens**:

- **Backgrounds**: Black (`#000000`), Dark grey (`#2D2D2D`), White (`#FFFFFF`).  
- **Accent / CTA**: Yellow/Gold `#FAB908` (Tailwind: `brand-accent`, `primary`, CSS: `--cta-bg`, `--color-primary-500`).

**CTA yellow exclusivity**:

- **Primary actions only**: Buttons and links that are the main action (e.g. "Start", "Submit", "Save") use CTA yellow.  
- **Non-CTA elements** (badges, labels, table of contents numbers, secondary text) must **not** use CTA yellow; use neutral/secondary palette (e.g. `brand-darkGrey`, grey scale).

**Page layout pattern**:

- **Shell**: Dark background (black/dark grey).  
- **Content**: White or dark cards (`page-card-dark`, white cards with borders).  
- **Primary actions**: Accent yellow; hover per design tokens.  
- **Links**: Accent for primary links; grey for secondary.

**Components**: Prefer Tailwind and design-system tokens. Avoid inline hex for brand/CTA colors; use `brand-accent`, `brand-black`, `brand-darkGrey`, `brand-white`, or CSS variables.

---

## 7. API and route layout

- **App Router**: `app/[locale]/<segment>/...`, `app/api/<segment>/...`.  
- **Locale**: First segment after app (e.g. `en`, `hu`). Use `LocaleLink` for in-app navigation to preserve locale.  
- **Admin**: `app/[locale]/admin/...`, `app/api/admin/...`. Access controlled by RBAC (admin/editor).  
- **Ids in paths**: Use stable IDs (e.g. `courseId`, `playerId`, `slug`); avoid optional query params for primary resources where a path is clearer.

---

## 8. Language and localization layout

- **Supported locales (UI)**: `hu`, `en`, `ar`, `hi`, `id`, `pt`, `vi`, `tr`, `bg`, `pl`, `ru`. Single source of truth: **`app/lib/i18n/locales.ts`**. Translation files: **`messages/<locale>.json`**.
- **Default locale**: Configurable in **`i18n.ts`** (e.g. `hu`). Used as fallback when browser language is not in the supported list. **Locale detection**: Middleware uses browser `Accept-Language` and locale cookie (`localeDetection: true`).
- **User locale preference**: Stored on the player (`player.locale`). Users set it in **Profile → Profile settings → Language**; used for session, emails, and course recommendations.
- **Course language**: Each course has a single `language` (e.g. `hu`, `en`). All lesson content and email fields for that course must be in that language (language integrity).
- **Multi-language courses**: One course document per language (e.g. `PRODUCTIVITY_2026_EN`, `PRODUCTIVITY_2026_HU`). CCS is language-neutral; implementations are per-language.

### English variant policy

The **British English variant** is the canonical “English” experience for admins, docs, and the default UI. Treat `messages/en.json` as **British English (en-GB)**, and duplicate it to `messages/en-GB.json` so the `/en-GB` path is explicitly supported. This file uses British spellings (`enrol`, `favour`, etc.).

The **American variant** lives in `messages/en-US.json` and is only served when the locale is explicitly `en-US` (next-intl handles this via `locales/en-US`). Keep the keys identical between `en`, `en-GB`, and `en-US`; only adjust the spelled terms. When you edit a British string, update `messages/en.json`/`en-GB.json` first and then duplicate the updated key/value into `messages/en-US.json` with the American spelling.

All other locale files remain in their native language (no British/US split). Native locales should never borrow British or American spellings—to highlight this, the policy keeps every other translation unchanged.

---

## 9. Reuse and coding patterns

- **Reuse via discriminator**: When the same feature is needed in 2+ places (e.g. up/down vote on courses, lessons, discussion posts), implement **one model**, **one API**, and **one UI component**; use a discriminator field (e.g. `targetType`, `targetId`) to select context. Do not duplicate schemas, routes, or components. See **docs/VOTING_AND_REUSE_PATTERN.md** and **docs/ARCHITECTURE.md** (Core Principles).  
- **Extending a reused feature**: Add a new discriminator value (e.g. new `targetType`), allow-list it in the API, and render the same component with the new type; do not add new collections or routes for the same behaviour.

---

## 10. When to use this grammar

- **Creating or editing courses/lessons/quizzes**: Follow CCS layout (§3), lesson layout (§4), quiz layout (§5), and language rules (§8).  
- **Creating or editing UI/pages**: Follow project layout (§1), UI layout (§6), and naming.  
- **Creating or editing docs**: Follow documentation layout (§2) and project layout (§1).  
- **Writing scripts** (seed, audit, backfill): Use same DB name as app (`process.env.DB_NAME || 'amanoba'`), follow naming and doc output paths under `/docs` and `/scripts/reports` as established.  
- **Implementing the same behaviour in 2+ places**: Follow reuse via discriminator (§9); read **docs/VOTING_AND_REUSE_PATTERN.md**.

---

**Maintained by**: Amanoba team  
**Cross-references**: `COURSE_BUILDING_RULES.md`, `DESIGN_UPDATE.md`, `NAMING_GUIDE.md`, `QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`, `VOTING_AND_REUSE_PATTERN.md`, `ARCHITECTURE.md`, `2026_course_quality_prompt.md`, canonical CCS under `docs/canonical/`.
