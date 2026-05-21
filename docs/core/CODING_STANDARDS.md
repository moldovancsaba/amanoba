# Amanoba Coding Standards

**Version**: 1.0
**Last Updated**: 2026-05-21
**Status**: ACTIVE

---

This document defines the coding rules that apply when changing Amanoba application code, docs, scripts, or UI. It complements `READMEDEV.md`, `docs/architecture/layout_grammar.md`, and `docs/architecture/ARCHITECTURE.md`.

## 1. Product assumptions

- Courses are flexible length. A course can contain 1 lesson or any number of lessons; do not reintroduce fixed 30-day limits in runtime code, validation, docs, or UI labels.
- `dayNumber` remains the route-compatible lesson position. Treat it as a positive lesson index, not proof that every course has 30 lessons.
- Learner-facing copy should describe lessons, progress, and course completion in product language. Avoid implementation language such as database fields, seed IDs, or migration names.

## 2. TypeScript and architecture

- Keep TypeScript strict and explicit at public boundaries: API handlers, models, server actions, and shared utilities.
- Prefer existing models, helpers, and shared primitives over new one-off abstractions.
- Reuse shared behaviour through discriminator fields when the same capability appears in multiple contexts.
- Keep server-side state transitions in server code. Client components should handle presentation and interaction, not persistence rules.
- Comments should explain intent, invariants, or non-obvious tradeoffs. Remove comments that restate code or contradict current behaviour.

## 3. UI and design system

- `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` is the design, UI, UX, component contract, and governance SSOT. If local Amanoba docs or code comments conflict with that folder, update the local material; do not fork the design rules.
- Amanoba's current implementation adapter is legacy Tailwind/Radix: `app/design-system.css`, `tailwind.config.ts`, `app/globals.css`, shared primitives, and non-CSS token files for server-rendered outputs. These files are implementation details, not the authority.
- Target UI foundation is the shared Mantine contract defined in `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`. New UI planning should move toward Mantine-only primitives and thin project wrappers instead of expanding Tailwind/Radix-specific patterns.
- The Amanoba migration plan is `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/AMANOBA_MANTINE_REFACTOR.md`; use it for sequencing, legacy freeze rules, allowed exceptions, and done criteria.
- While the legacy adapter remains, use Amanoba tokens and utilities: `brand.*`, `primary.*`, `semantic.*`, `social.*`, `.page-shell`, `.page-card`, `.ds-panel`, `.ds-status-*`, `.ds-button-*`, and `.ds-text-*`.
- Do not add raw hex colours or generic template palettes in touched UI code. Approved non-CSS token files are limited to server-rendered contexts such as emails, charts, certificates, and OG images.
- CTA yellow remains reserved for primary actions only until the Mantine theme migration replaces the local adapter with shared-theme semantics.
- If a visual pattern appears in more than one place, route it through the current adapter or the planned Mantine wrapper layer before duplicating it again.

## 4. Documentation and versioning

- When behaviour, architecture, or process changes, update `docs/HANDOVER.md` in the same change.
- Release-facing version numbers must stay aligned across `package.json`, `package-lock.json`, `README.md`, `docs/core/TECH_STACK.md`, `docs/architecture/ARCHITECTURE.md`, and `docs/product/RELEASE_NOTES.md`.
- Use `npm run release:patch`, `npm run release:minor`, or `npm run release:major` for formal release bumps when the release script is appropriate. Manual `npm version --no-git-tag-version` is acceptable for controlled documentation/version alignment work.
- `docs/product/RELEASE_NOTES.md` should describe shipped behaviour in user-facing language. Internal churn belongs in handover notes unless it changes behaviour or operations.
- Treat `docs/core/DOCS_INDEX.md` and `docs/HANDOVER.md` as the current doc entrypoints. Old handoff snapshots, migration reports, and planning variants are historical unless a current doc explicitly promotes them.
- Do not add hard-coded local machine paths to new canonical docs unless the workflow still depends on that path and the portability risk is recorded.

## 5. Validation

Run the smallest meaningful gate set for the change, then broaden it when shared behaviour or docs are touched.

- UI foundation: `npm run ui:check:foundation`
- UI layout drift: `npm run ui:check:layout`
- TypeScript: `npm run type-check`
- Lint: `npm run lint`
- Tests: `npm test`
- Docs: `npm run docs:refresh`, `npm run docs:links:check`, and `npm run docs:check` when generated docs are expected to be clean

If a command is skipped or blocked, record why in the final handoff.
