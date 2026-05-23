# Design System Adapter Status

**Last Updated**: 2026-05-23
**Status**: Shared SSOT adopted; Mantine-only runtime active; pattern-service adapter in progress

---

## Current Truth

`/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` is the single source of truth for Amanoba design, UI, UX, component contracts, and design-system governance.

Amanoba's in-repo files describe the current implementation adapter only. They do not override the shared SSOT.

## Shared SSOT

Read in this order:

1. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/README.md`
2. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/FOUNDATION.md`
3. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/COMPONENTS_AND_PATTERNS.md`
4. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PATTERN_SERVICE_MODEL.md`
5. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/SERVICE_BACKBONE_IMPLEMENTATION_PLAN.md`
6. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/GOVERNANCE_AND_ADOPTION.md`
7. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/PORTFOLIO_ADOPTION_MATRIX.md`

The shared SSOT is managed as its own Git repository. Amanoba should reference its version/date when major UI migration work is done.

## Project Migration Plan

The Amanoba-specific Mantine-only migration plan lives at:

- `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/AMANOBA_MANTINE_REFACTOR.md`

Use that plan for migration sequencing, legacy inventory, enforcement rules, first implementation PR shape, and done criteria.

## Local Adapter

**Aligned SSOT version/date**: `2.2.0`, 2026-05-23
**Status**: Mantine-only runtime active; reusable pattern-service contracts being consolidated; Tailwind/Radix UI dependency baseline removed
**Current UI foundation**: Mantine root runtime plus a narrowed global CSS support layer for document defaults, prose, assets, and documented exception surfaces
**Target UI foundation**: Mantine-only contract from the shared SSOT

Local adapter files:

- `app/components/providers/MantineRuntimeProvider.tsx` — current Mantine root runtime provider.
- `app/lib/ui/mantine-theme.ts` — current Amanoba Mantine theme and first component-default layer.
- `docs/product/PATTERN_CONTRACT_INVENTORY.md` — local GDS pattern-service adapter and implementation inventory.
- `app/components/LearnerPageHeader.tsx` — canonical learner page-header/navigation contract.
- `app/components/patterns/ArticleShell.tsx` — canonical article/news detail shell.
- `app/components/patterns/CourseCard.tsx` — canonical course-card/product-card contract.
- `app/components/patterns/MetricCard.tsx` — canonical metric/progress card contract.
- `app/components/patterns/StateBlock.tsx` — canonical loading/empty/error/permission/success state contract.
- `app/components/patterns/CourseAccessRecoveryActions.tsx` — canonical sign-in / course / retry recovery actions for protected lesson and quiz routes.
- `app/components/patterns/AuthShell.tsx` — canonical centered auth/onboarding page shell.
- `app/components/patterns/PublicAppShell.tsx` — canonical public/marketing page shell.
- `app/components/patterns/DataToolbar.tsx` — pilot admin list filter toolbar.
- `app/components/LessonQuiz.tsx` — Mantine lesson quiz surface (`StateBlock`, notifications).
- `app/[locale]/games/memory/page.tsx` — Mantine memory game page shell.
- `app/[locale]/admin/layout.tsx` — Mantine `AppShell` admin navigation shell.
- `app/globals.css` — narrow global reset, Mantine token bridge, transitional class contracts, and rich-content prose defaults. It is not product component authority.
- `app/lib/constants/color-tokens.ts` and `app/lib/constants/certificate-colors.ts` — non-CSS token sources for emails, OG/certificate image rendering, charts, and similar server-rendered contexts.

## Runtime And Pattern Status

Implemented:

- Mantine package baseline: `@mantine/core`, `@mantine/hooks`, `@mantine/form`, `@mantine/notifications`, `@mantine/modals`, and `@tabler/icons-react`.
- Root runtime wiring in `app/[locale]/layout.tsx`.
- Central `MantineProvider`, `ModalsProvider`, and `Notifications` setup.
- Amanoba theme in `app/lib/ui/mantine-theme.ts`, including dark-mode component defaults for readable text, cards, papers, inputs, overlays, tabs, badges, and code surfaces.
- Guardrail command: `npm run ui:check:mantine`.
- Pattern-service contracts for learner headers, article shell, course cards, metric cards, and state blocks.

Still pending:

- extraction of `AuthShell`, `PublicAppShell`, `DataToolbar`, and `ResponsiveDataView`
- migration of legacy admin shell, leaderboards, stats, onboarding, auth error, admin votes, and game chrome
- continued reduction of transitional class contracts as remaining legacy surfaces move behind Mantine pattern contracts
- stronger pattern-drift checks that reject page-local shells/cards/states once each area is migrated

## Hard Rules During Migration

- Do not add new design rules to Amanoba docs when they belong in `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`.
- Do not add new raw color literals in tracked UI code outside approved token sources.
- Do not add new generic template palettes in touched UI code.
- Do not mix dark and light surfaces inside learner/product flows unless the exception is documented against the GDS color-mode contract in `FOUNDATION.md`.
- Do not add Tailwind/Radix-specific abstractions or dependencies.
- New repeated shells, cards, metrics, article layouts, state blocks, data toolbars, and auth panels must be implemented through the pattern-service inventory.

## Known Pattern-Service Debt

- Game chrome (`MemoryGame`, `LessonQuiz`) now uses Mantine cards, metrics, and Tabler icons.
- Some older route surfaces still contain legacy local markup in non-game admin pages.
- `ResponsiveDataView` remains a backlog contract; extend `DataToolbar` across admin lists.
- Some historical release notes and archive documents still describe older local design-system states for audit history.
- Package dependencies still include legacy UI libraries until the final dependency deletion pass proves they are unused in product UI.

## Validation Commands

- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run lint`
- `npm run build`

Use `npm run ui:audit:foundation` and `npm run ui:audit:layout` to refresh generated quality docs after UI refactors.

## Next Migration Targets

1. Extract `DataToolbar` and `ResponsiveDataView` for admin list pages.
4. Migrate leaderboards, stats, onboarding, and game chrome to shell/card/state contracts.
5. Tighten `npm run ui:check:mantine` after each surface group so old variants cannot return.
