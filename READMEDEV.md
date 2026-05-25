# Amanoba dev kit README

This is the **Brain Boost** every developer must read before touching Amanoba code. It collects the repeatable rituals, SSOT rules, and quality gates that keep this repo aligned with the project board (`mvp-factory-control`) and the production reality documented under `docs/status/PRODUCTION_STATUS.md`.

## 1. Brain Boost ritual (start every work session)
1. `git fetch origin && git status -sb` to ensure you are working on the latest baseline.
2. Confirm the active SSOT card:
   - Issues live only in `moldovancsaba/mvp-factory-control`.
   - Search for your assignment with `gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10`.
   - If nothing is assigned, ask the PO before proceeding.
3. Scan `docs/HANDOVER.md` and the active issue’s latest comments before writing code or docs.
4. Update your local branch name with the `sentinel-squad/` prefix before making changes.

## 2. SSOT discipline and governance
- **Board**: https://github.com/users/moldovancsaba/projects/12/views/1 (Amanoba board; this is the live project SSOT).
- **Naming**: Issues that belong to this product are titled `Amanoba: <short description>`.
- **Product repo ≠ project repo**: Always execute work through the project repo (`mvp-factory-control`). Do not create issues in `moldovancsaba/amanoba`.
- **Cadence**:
  - Start: move the SSOT card to `In Progress (NOW)` and add a start note (objective + quick approach).
  - Milestones/blocks: update the card status and comment with next steps or blockers.
  - Finish: move status to _Done_, note validation evidence, and mention the docs touched.

## 3. Quality gates (apply to every commit)
- Local verification: `npm run lint`, `npm test`, `npm run type-check`, `npm run docs:check` (as needed by the work).
- Production verification: follow `docs/status/PRODUCTION_STATUS.md` after deploying (baseline routes, feature area touched, release note entry).
- Release automation: `docs/product/RELEASE_NOTES.md` only when work is officially shipped (per the PO’s definition of “shipped”).
- No placeholder text, no “TBD”. Docs must match actual code state before closing an issue.
- Coding/design standards: follow `docs/core/CODING_STANDARDS.md` before adding UI classes, comments, course-length assumptions, or release/version edits. For design, UI, and UX decisions, `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` is the SSOT; Amanoba docs only describe the local adapter and migration state.

## 4. Key workflows
- **Development**: `npm install`, `npm run dev` (Next.js App Router + TypeScript 5).
- **Build/release**: `npm run build`, optional release scripts `npm run release:patch|minor|major`.
- **Seed/rebuild data**: plenty of helpers under `scripts/` (`seed:*`, `repair:stats`, worker launchers, etc.). Always supply `.env.local` where required.
- **Docs health**: run `npm run docs:check` when touching architecture, flows, or product behavior. These scripts generate the docs inventory (needed for the `docs/product/TASKLIST` discipline).
- **GDS enforcement**: run `npm run ui:check:gds` when touching shared UI, adapters, pattern contracts, or exceptions.

## 5. Documentation obligations
- `docs/HANDOVER.md`: update after every change that affects runtime, process, or status. Append entries (don’t rewrite history).
- `docs/product/TASKLIST.md`: reflects prioritized todo items (P1–P4). Move completed tasks to `docs/product/RELEASE_NOTES.md`.
- `docs/status/PRODUCTION_STATUS.md`: records deployment process, verification policy, and baseline expectations.
- Whenever you touch behavior/architecture:
  - Update `docs/architecture/ARCHITECTURE.md` (core systems).
  - Update `docs/PROJECT_MANAGEMENT.md` if you change board rules or cadence (create this doc if it does not exist yet).
  - Update `docs/HANDOVER.md` (required digest of what changed + verification).

## 6. Ops & environment reminders
- `.env.local` secrets: always copy from `.env.local.example`; never check actual secrets into Git.
- Primary auth: SSO-only via `sso.doneisbetter.com` (exposed in `auth.ts`, `auth.edge.ts`, `auth.config.ts`).
- Email channel: daily lessons use the shared email transport layer in `app/lib/email`; the active provider is selected with `EMAIL_PROVIDER` (`resend`, `gmail`, or `mailgun`). Treat provider keys and scheduling logic with care.
- Payments: Stripe checkout is wired under `app/api/payments/*` and helper code in `app/lib/utils/stripe-minimums.ts`, tied to course pricing. Validate currencies (USD, EUR, HUF, GBP) before touching pricing logic.

## 7. Where to look fast
- UI routes: `app/[locale]` (17 primary UI locales from `app/lib/i18n/locales.ts`).
- Business logic: `app/lib/` (models, courses, gamification, analytics).
- Components: `components/` with gamification, games, charts, UI primitives.
- Translations: `messages/*.json`.
- Docs + metadata: `docs/product/*`.
- Coding standards: `docs/core/CODING_STANDARDS.md`.

## 8. Handoff checklist (end-of-session)
1. Document: append `docs/HANDOVER.md` entries and mention files changed.
2. SSOT: update the Project 12 card (status + validation + blockers).
3. Tests: rerun relevant suites; capture commands and outcomes.
4. Communicate: share completion message + next steps referencing the board card.

Refer back to this file whenever you feel lost. If something is missing (SSOT card, instructions, docs), stop and ask the PO before continuing.
