# Design System Adapter Status

**Last Updated**: 2026-05-21
**Status**: Shared SSOT adopted; Mantine root runtime installed; legacy adapter still migrating

---

## Current Truth

`/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` is the single source of truth for Amanoba design, UI, UX, component contracts, and design-system governance.

Amanoba's in-repo files describe the current implementation adapter only. They do not override the shared SSOT.

## Shared SSOT

Read in this order:

1. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/README.md`
2. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/FOUNDATION.md`
3. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/MANTINE_PLATFORM.md`
4. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/MANTINE_RUNTIME.md`
5. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/COMPONENT_CONTRACTS.md`
6. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/NAVIGATION_RESPONSIVE.md`
7. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/UX_PATTERNS.md`
8. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/GOVERNANCE.md`
9. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECT_ADOPTION.md`
10. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/IMPLEMENTATION_READINESS.md`

The shared SSOT is managed as its own Git repository. Amanoba should reference its version/date when major UI migration work is done.

## Project Migration Plan

The Amanoba-specific Mantine-only migration plan lives at:

- `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/AMANOBA_MANTINE_REFACTOR.md`

Use that plan for migration sequencing, legacy inventory, enforcement rules, first implementation PR shape, and done criteria.

## Local Adapter

**Aligned SSOT version/date**: `1.2.3`, 2026-05-21
**Status**: Migrating
**Current UI foundation**: Mantine root runtime plus legacy Tailwind CSS + Radix primitives + local CSS/token utilities
**Target UI foundation**: Mantine-only contract from the shared SSOT

Local adapter files:

- `app/components/providers/MantineRuntimeProvider.tsx` — current Mantine root runtime provider.
- `app/lib/ui/mantine-theme.ts` — current Amanoba Mantine theme and first component-default layer.
- `app/design-system.css` — legacy CSS-variable adapter for brand, semantic, surface, border, text, motion, and external-brand colors.
- `tailwind.config.ts` — legacy Tailwind aliases exposing local tokens to components through `brand.*`, `primary.*`, `semantic.*`, and `social.*`.
- `app/globals.css` — shared shell/panel/page utility classes such as `.page-shell`, `.page-card`, `.ds-panel`, `.ds-panel-dark`, and `.ds-copy-muted`.
- `app/components/ui/button.tsx` and `app/components/ui/card.tsx` — current shared primitives that must follow the shared component contracts until replaced by Mantine wrappers.
- `app/lib/constants/color-tokens.ts` and `app/lib/constants/certificate-colors.ts` — non-CSS token sources for emails, OG/certificate image rendering, charts, and similar server-rendered contexts.

## Phase 1 Runtime Status

Implemented:

- Mantine package baseline: `@mantine/core`, `@mantine/hooks`, `@mantine/form`, `@mantine/notifications`, `@mantine/modals`, and `@tabler/icons-react`.
- Root runtime wiring in `app/[locale]/layout.tsx`.
- Central `MantineProvider`, `ModalsProvider`, and `Notifications` setup.
- Initial Amanoba theme in `app/lib/ui/mantine-theme.ts`.
- Initial guardrail command: `npm run ui:check:mantine`.

Still pending:

- migration of existing Tailwind/Radix surfaces to Mantine primitives
- replacement of current shared `Button` and `Card` primitives
- deletion of Radix/Tailwind/sonner/vaul dependencies after product UI no longer uses them
- updated hard checks that reject all non-Mantine product primitives after the migration baseline is low enough

## Hard Rules During Migration

- Do not add new design rules to Amanoba docs when they belong in `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`.
- Do not add new raw color literals in tracked UI code outside approved token sources.
- Do not add new generic template palettes in touched UI code.
- Do not expand Tailwind/Radix-specific abstractions as if they are the long-term system.
- Keep CTA yellow reserved for primary actions until the Mantine theme migration replaces the local adapter with shared-theme semantics.
- New or refactored reusable primitives must be planned against `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/COMPONENT_CONTRACTS.md`.

## Known Migration Debt

- The app is not Mantine-only yet.
- The app now has a Mantine root runtime, but most product UI still renders through the legacy adapter.
- Radix primitives and Tailwind utility classes remain the active runtime implementation.
- Heuristic UI drift remains in older admin, game, profile, and certificate surfaces.
- Some historical release notes and archive documents still describe older local design-system states for audit history.

## Validation Commands

- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run lint`
- `npm run build`

Use `npm run ui:audit:foundation` and `npm run ui:audit:layout` to refresh generated quality docs after UI refactors.

## Next Migration Targets

1. Complete the Phase 1 proof surface: migrate one small shared primitive or learner-facing surface to Mantine.
2. Replace core primitives first: buttons, action icons, text inputs, selects, alerts, modals, cards, and tables.
3. Migrate learner-critical flows before secondary surfaces.
4. Tighten `npm run ui:check:mantine` as legacy imports disappear.
5. Retire local Tailwind/Radix design authority after parity is reached.
