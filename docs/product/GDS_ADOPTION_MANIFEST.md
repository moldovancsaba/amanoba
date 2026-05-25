# Amanoba GDS Adoption Manifest

**Last Updated**: 2026-05-25
**Status**: Active local enforcement contract
**Shared SSOT**: `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`
**Shared Upstream Repo**: [sovereignsquad/general-design-system](https://github.com/sovereignsquad/general-design-system)
**Aligned GDS Version**: `2.4.3`
**Aligned GDS Date**: `2026-05-25`
**Machine-readable source**: `gds-adoption.json`

This document defines Amanoba's local GDS adoption contract in a generally reusable form: one shared SSOT, one local adapter map, one exceptions register, one allowlist/banlist, and one validation entrypoint.

Use the local checkout path as the working copy and the GitHub repository as the portable upstream reference.

It does not redefine design behavior. The shared SSOT remains the authority for:

- component behavior
- interaction patterns
- token policy
- responsive strategy
- accessibility baseline
- UX meaning of canonical controls

## Scope

This manifest exists to make GDS-only enforcement operational inside the product repo while the shared GDS team continues shipping package, contract, and tooling upgrades.

Use it to answer:

- which local files own the root theme and provider
- which local files implement the required pattern contracts
- which files are already protected as Mantine-only surfaces
- which imports and helper stacks are banned for new product UI
- which exceptions are allowed, where they live, and how they must be removed later

## Local Adapter Roots

- Theme provider: `app/components/providers/MantineRuntimeProvider.tsx`
- Theme module: `app/lib/ui/mantine-theme.ts`
- Shared theme composition module: `app/lib/ui/amanoba-gds-theme.ts`
- Server-safe token sources:
  - `app/lib/constants/color-tokens.ts`
  - `app/lib/constants/certificate-colors.ts`
- Transitional CSS support files:
  - `app/design-system.css`
  - `app/globals.css`
  - `components/CookieConsentBanner.module.css`

## Required Pattern Contracts

These are the current local implementation paths for the required GDS pattern-service families:

- Learner shell / page header: `app/components/LearnerPageHeader.tsx`
- Article shell: `app/components/patterns/ArticleShell.tsx`
- Product course card: `app/components/patterns/CourseCard.tsx`
- Metric / progress card: `app/components/patterns/MetricCard.tsx`
- State block: `app/components/patterns/StateBlock.tsx`
- Course access recovery: `components/patterns/CourseAccessRecoveryActions.tsx`
- Admin shell: `app/[locale]/admin/layout.tsx`
- Auth shell: `app/components/patterns/AuthShell.tsx`, `app/[locale]/auth/signin/page.tsx`, `app/[locale]/auth/error/page.tsx`
- Public shell: `app/components/patterns/PublicAppShell.tsx`, `app/[locale]/page.tsx`, `app/[locale]/partners/page.tsx`
- Data toolbar: `app/components/patterns/DataToolbar.tsx`
- Responsive data view: `app/components/patterns/ResponsiveDataView.tsx`
- Editor shell: `app/[locale]/editor/layout.tsx`
- Game shell: `app/[locale]/games/memory/page.tsx`, `app/components/LessonQuiz.tsx`, `app/components/games/MemoryGame.tsx`
- Game board card: `app/components/patterns/GameBoardCard.tsx`, `app/components/patterns/gds/GameBoardCard.tsx`

The canonical inventory remains [PATTERN_CONTRACT_INVENTORY.md](/Users/Shared/Projects/amanoba/docs/product/PATTERN_CONTRACT_INVENTORY.md).

## Protected Mantine-Only Surfaces

The following files are currently treated as protected Mantine-only surfaces and are checked by `npm run ui:check:mantine`:

- `app/[locale]/page.tsx`
- `app/[locale]/auth/error/page.tsx`
- `app/[locale]/courses/page.tsx`
- `app/[locale]/dashboard/page.tsx`
- `app/[locale]/my-courses/page.tsx`
- `app/[locale]/blog/[slug]/page.tsx`
- `app/[locale]/news/[slug]/page.tsx`
- `app/components/LearnerPageHeader.tsx`
- `app/components/ThemeToggle.tsx`
- `app/components/patterns/ArticleShell.tsx`
- `app/components/patterns/CourseCard.tsx`
- `app/components/patterns/MetricCard.tsx`
- `app/components/patterns/StateBlock.tsx`
- `app/components/sign-out-button.tsx`
- `components/CookieConsentBanner.tsx`
- `components/LanguageSwitcher.tsx`
- `components/Logo.tsx`
- `app/[locale]/admin/layout.tsx`
- `app/[locale]/leaderboards/page.tsx`
- `app/[locale]/stats/page.tsx`
- `app/[locale]/onboarding/page.tsx`
- `app/components/patterns/AuthShell.tsx`
- `app/components/patterns/PublicAppShell.tsx`
- `app/components/patterns/DataToolbar.tsx`
- `app/components/patterns/ResponsiveDataView.tsx`
- `app/[locale]/editor/layout.tsx`
- `app/[locale]/editor/courses/page.tsx`
- `app/[locale]/editor/courses/[courseId]/page.tsx`
- `app/components/LessonQuiz.tsx`
- `app/[locale]/games/memory/page.tsx`

## Allowlist / Banlist

### Allowed for new or touched product UI

- Mantine primitives
- thin local wrappers aligned to the shared GDS
- approved theme tokens and documented non-CSS token files
- canonical pattern contract files listed above

### Banned for new or touched product UI

- `@radix-ui/*`
- `sonner`
- `vaul`
- `@/components/ui/card`
- `@/components/ui/button`
- `class-variance-authority`
- `tailwind-merge`
- page-local shell, header, toolbar, metric-card, or state-block reinventions
- raw color literals in feature UI
- new Tailwind utility styling in protected Mantine-only files

## Exceptions

All approved exceptions must be registered in [GDS_EXCEPTION_REGISTER.md](/Users/Shared/Projects/amanoba/docs/product/GDS_EXCEPTION_REGISTER.md).

Current exception ids:

- `rich-lesson-prose-html`
- `game-board-local-layout`
- `certificate-linkedin-brand-color`
- `transitional-global-css-support`

If a new exception is required, it is not valid until both of these are updated:

1. `gds-adoption.json`
2. `docs/product/GDS_EXCEPTION_REGISTER.md`

## Validation Commands

- `npm run ui:check:gds-adoption` — validates the local GDS manifest, required paths, and docs alignment
- `npm run ui:check:mantine` — enforces Mantine-only file boundaries on protected surfaces
- `npm run ui:check:foundation` — blocks raw color literals and known mode/readability violations
- `npm run ui:check:layout` — heuristic scan for layout-grammar and design-token drift
- `npm run ui:check:gds` — compatibility aggregate for adoption, Mantine boundaries, foundation, and layout
- `npm run ui:gds:check` — root GDS package/compliance aggregate

## Rollout Rule

When a surface is touched:

1. use an existing contract if one exists
2. do not add a new local variant for a repeated pattern family
3. remove drift instead of layering another exception on top of it
4. update this manifest and the exception register if the local enforcement boundary changes
