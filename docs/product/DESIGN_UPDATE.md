# Design System Adapter Status

**Last Updated**: 2026-05-25
**Status**: GDS 2.4.3 enforced; Mantine-only runtime; product primitives are `@gds/*`-backed

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

The shared SSOT is managed as its own Git repository: https://github.com/sovereignsquad/general-design-system. Amanoba references version **2.4.3** (2026-05-25).

## Project Migration Plan

- `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/PROJECTS/AMANOBA_MANTINE_REFACTOR.md`
- Delivery program: `docs/handoff/feature_issues/GDS_2_3_ADOPTION_PROGRAM.md` (mvp-factory-control **#868**–**#877**)

## Local Adapter

**Aligned SSOT version/date**: `2.4.3`, 2026-05-25
**Status**: Mantine-only product UI; GDS packages installed; pattern implementations consolidated under `app/components/patterns/gds/`
**Current UI foundation**: `@gds/theme` via `extendGdsTheme` in `app/lib/ui/amanoba-gds-theme.ts`, root `MantineRuntimeProvider`, narrowed `globals.css` + token-only `design-system.css`
**Target UI foundation**: Mantine-only contract from the shared SSOT (achieved for product primitives; documented exceptions remain)

### Package install (local development)

| Package | Version | Path |
| --- | --- | --- |
| `@gds/theme` | 2.4.3 | `file:../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages/gds-theme` |
| `@gds/core` | 2.4.3 | `file:../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages/gds-core` |
| `@gds/admin` | 2.4.3 | `file:../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages/gds-admin` |

Production CI must use the same version pin (npm publish or vendored packages)—document any change in this file before deploy.

**Note:** Amanoba runs **Mantine 8.x**; GDS packages declare Mantine 7 peers. Runtime theme uses `extendGdsTheme` from `@gds/theme`; `gds:import-smoke` uses `@gds/theme/client`. Local `file:` SSOT requires `next build --webpack` and `next.config.ts` `resolveAlias` (Turbopack does not resolve `@gds/*` in the client graph yet). Pattern components live in `patterns/gds/`.

### Pattern implementation paths

| Contract | Canonical path |
| --- | --- |
| GDS pattern barrel | `app/components/patterns/gds/index.ts` |
| Stable imports | `app/components/patterns/*.tsx` (re-export from `gds/`) |
| Theme | `app/lib/ui/amanoba-gds-theme.ts` → `mantine-theme.ts` |
| Learner header | `app/components/LearnerPageHeader.tsx` (local until GDS LearnerAppShell) |
| Course card | `app/components/patterns/CourseCard.tsx` |
| Course access recovery | `app/components/patterns/gds/CourseAccessRecoveryActions.tsx` → `@gds/core` `AccessRecoveryPanel` |
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
- Pattern barrel under `app/components/patterns/gds/`: **StateBlock**, **MetricCard**, **ProgressCard**, **GameBoardCard**, **CourseAccessRecovery** delegate to `@gds/core`; brand-composition shells documented in `gds-adoption.json`.
- Admin list contracts across admin reporting surfaces.
- StateBlock on learner routes including quests, rewards, saved lessons, email settings.
- Guardrails: `npm run ui:check:mantine`, `ui:gds:verify`, `gds:import-smoke`.

Remaining (documented in `gds-adoption.json`, not duplicate GDS primitives):

- **Learner shell** — `LearnerPageHeader` until second product proves shared LMS chrome ([#99](https://github.com/sovereignsquad/general-design-system/issues/99)).
- **Course card variants** — `CourseCard` until GDS ships catalog/enrolled/progress/admin variants.
- **Brand-composition shells** — `AuthShell`, `PublicAppShell`, `ArticleShell`, `DataToolbar`, `ResponsiveDataView` (Amanoba dark marketing / admin row API).
- Residual `className` on layout/fonts/prose (documented exceptions only).

## GDS-only enforcement

- Machine-readable adoption contract: `gds-adoption.json` (version **2.4.3**).
- `app/components/patterns/gds/*` must import `@gds/*` except registered `brand-composition` adapters.
- No Tailwind/Radix/sonner/vaul/`@/components/ui/*` as product UI authority.
- Theme palettes live in `app/lib/constants/color-tokens.ts`; runtime uses `extendGdsTheme` only.

## Hard Rules

- Do not add new design rules to Amanoba docs when they belong in GDS.
- Do not reimplement GDS primitives (MetricCard, StateBlock, etc.) with raw Mantine in product code.
- New repeated shells/cards/states must use `@gds/*` via `patterns/gds` or be registered in `gds-adoption.json`.

## Validation Commands

- `npm run ui:gds:check` (verify + smoke + pattern layer + compliance manifest)
- `npm run gds:import-smoke`
- `npm run ui:gds:verify`
- `npm run ui:check:gds-patterns`
- `npm run ui:gds:compliance`
- `npm run ui:check:mantine`
- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npm run docs:check` (when docs change)
