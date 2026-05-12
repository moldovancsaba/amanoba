# Amanoba Coding Standards

**Version**: 1.0
**Last Updated**: 2026-05-12
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

- The visual source of truth is `app/design-system.css`, exposed through `tailwind.config.ts`, `app/globals.css`, and shared primitives.
- Use Amanoba tokens and utilities: `brand.*`, `primary.*`, `semantic.*`, `social.*`, `.page-shell`, `.page-card`, `.ds-panel`, `.ds-status-*`, `.ds-button-*`, and `.ds-text-*`.
- Do not add raw hex colours or generic template palettes in touched UI code. Approved non-CSS token files are limited to server-rendered contexts such as emails, charts, certificates, and OG images.
- CTA yellow is reserved for primary actions only. Use semantic status utilities for success, warning, and error states.
- If a visual pattern appears in more than one place, move it into a shared primitive or shared utility class before duplicating it again.

## 4. Documentation and versioning

- When behaviour, architecture, or process changes, update `docs/HANDOVER.md` in the same change.
- Release-facing version numbers must stay aligned across `package.json`, `package-lock.json`, `README.md`, `docs/core/TECH_STACK.md`, `docs/architecture/ARCHITECTURE.md`, and `docs/product/RELEASE_NOTES.md`.
- Use `npm run release:patch`, `npm run release:minor`, or `npm run release:major` for formal release bumps when the release script is appropriate. Manual `npm version --no-git-tag-version` is acceptable for controlled documentation/version alignment work.
- `docs/product/RELEASE_NOTES.md` should describe shipped behaviour in user-facing language. Internal churn belongs in handover notes unless it changes behaviour or operations.

## 5. Validation

Run the smallest meaningful gate set for the change, then broaden it when shared behaviour or docs are touched.

- UI foundation: `npm run ui:check:foundation`
- UI layout drift: `npm run ui:check:layout`
- TypeScript: `npm run type-check`
- Lint: `npm run lint`
- Tests: `npm test`
- Docs: `npm run docs:refresh`, `npm run docs:links:check`, and `npm run docs:check` when generated docs are expected to be clean

If a command is skipped or blocked, record why in the final handoff.
