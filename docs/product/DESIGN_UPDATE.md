# Design System Adapter Status

**Last Updated**: 2026-05-24
**Status**: GDS 2.3.0 adopted; Mantine-only runtime active; `@gds/*` packages wired

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
8. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/COMPATIBILITY_AND_RELEASES.md`
9. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/THEME_GOVERNANCE.md`
10. `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/EXCEPTION_SURFACES.md`

The shared SSOT is managed as its own Git repository. Amanoba references version **2.3.0** (2026-05-24).

## Project Migration Plan

- `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/AMANOBA_MANTINE_REFACTOR.md`
- Delivery program: `docs/handoff/feature_issues/GDS_2_3_ADOPTION_PROGRAM.md` (mvp-factory-control **#868**–**#877**)

## Local Adapter

**Aligned SSOT version/date**: `2.3.0`, 2026-05-24
**Status**: Mantine-only product UI; GDS packages installed; pattern implementations consolidated under `app/components/patterns/gds/`
**Current UI foundation**: `@gds/theme` via `extendGdsTheme` in `app/lib/ui/amanoba-gds-theme.ts`, root `MantineRuntimeProvider`, narrowed `globals.css` + token-only `design-system.css`
**Target UI foundation**: Mantine-only contract from the shared SSOT (achieved for product primitives; documented exceptions remain)

### Package install (local development)

| Package | Version | Path |
| --- | --- | --- |
| `@gds/theme` | 2.3.0 | `file:../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages/gds-theme` |
| `@gds/core` | 2.3.0 | `file:../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages/gds-core` |
| `@gds/admin` | 2.3.0 | `file:../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages/gds-admin` |

Production CI must use the same version pin (npm publish or vendored packages)—document any change in this file before deploy.

**Note:** Amanoba runs **Mantine 8.x**; GDS packages declare Mantine 7 peers. `extendGdsTheme` is validated in `npm run gds:import-smoke`; the Next.js client bundle uses an equivalent `createTheme` in `amanoba-gds-theme.ts` until `@gds/theme` is consumed from a published path Next can resolve (local `file:` links work for Node scripts only). Pattern components live in `patterns/gds/` aligned to GDS contracts.

### Pattern implementation paths

| Contract | Canonical path |
| --- | --- |
| GDS pattern barrel | `app/components/patterns/gds/index.ts` |
| Stable imports | `app/components/patterns/*.tsx` (re-export from `gds/`) |
| Theme | `app/lib/ui/amanoba-gds-theme.ts` → `mantine-theme.ts` |
| Learner header | `app/components/LearnerPageHeader.tsx` (local until GDS LearnerAppShell) |
| Course card | `app/components/patterns/CourseCard.tsx` |
| Course access recovery | `app/components/patterns/CourseAccessRecoveryActions.tsx` |
| Admin shell | `app/[locale]/admin/layout.tsx` |
| Editor shell | `app/[locale]/editor/layout.tsx` |

## Exception Surfaces (Amanoba)

Per GDS `EXCEPTION_SURFACES.md` and local needs:

| Surface | Scope | Shared rules still apply |
| --- | --- | --- |
| `lesson-prose` / `TypographyStylesProvider` | Rich lesson HTML | Dark shell, readable links |
| Next/Image `className` | `object-cover`, aspect ratio | No color authority |
| Game canvas / engine | Non-product primitives | Mantine chrome only |
| Email / certificate / OG render | `color-tokens.ts`, `certificate-colors.ts` | Tokens via `theme.other` + constants |
| Charts (Recharts) | `CHART_THEME` in color-tokens | Surrounding layout uses Mantine |
| OAuth provider buttons | Branded controls on sign-in | Auth shell layout governed |
| Profile stat card (current/best) | `profile/[playerId]/page.tsx` local helper | Migrate when GDS contract exists |

## Runtime And Pattern Status

Implemented:

- `@gds/theme` + `extendGdsTheme` for Amanoba brand (dark shell, `amanoba` / `ink` palettes).
- Pattern barrel under `app/components/patterns/gds/` for Auth, Public, Article, Metric, Progress, State, DataToolbar, ResponsiveDataView, GameBoardCard.
- Admin list contracts across admin reporting surfaces.
- StateBlock on learner routes including quests, rewards, saved lessons, email settings.
- Guardrails: `npm run ui:check:mantine`, `ui:gds:verify`, `gds:import-smoke`.

Remaining (tracked upstream or local):

- **LearnerAppShell** — GDS [general-design-system#80](https://github.com/sovereignsquad/general-design-system/issues/80); keep `LearnerPageHeader`.
- **Course card variants** — local `CourseCard` until GDS promotes catalog/enrolled/progress/admin variants.
- **Direct `@gds/admin/ResponsiveDataView` API** — Amanoba keeps column/row adapter in `gds/ResponsiveDataView.tsx` (md breakpoint, `getRowStyle`).
- Residual `className` on layout/fonts/prose (documented above, not design authority).

## Hard Rules

- Do not add new design rules to Amanoba docs when they belong in GDS.
- Do not add Tailwind/Radix/sonner/vaul as product UI authority.
- New repeated shells/cards/states must use `patterns/gds` or documented local contracts in `PATTERN_CONTRACT_INVENTORY.md`.

## Validation Commands

- `npm run gds:import-smoke`
- `npm run ui:gds:verify`
- `npm run ui:check:mantine`
- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npm run docs:check` (when docs change)
