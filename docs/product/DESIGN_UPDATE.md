# Design System Adapter Status

**Last Updated**: 2026-05-26
**Status**: GDS 2.6.1 enforced via `@doneisbetter/*` release assets; thin local adapters only

---

## Current Truth

The public GDS repository is the single source of truth for Amanoba design, UI, UX, component contracts, and design-system governance.

Amanoba's in-repo files describe the current implementation adapter only. They do not override the shared SSOT.

## Shared SSOT

Read in this order:

1. `README.md`
2. `COMPATIBILITY_AND_RELEASES.md`
3. `ADOPTION_AND_MIGRATION_PLAYBOOK.md`
4. `COMPLIANCE_TOOLKIT.md`
5. `VERIFIED_CONSUMER_INSTALL_PROOF.md`
6. `FOUNDATION.md`
7. `COMPONENTS_AND_PATTERNS.md`
8. `PATTERN_SERVICE_MODEL.md`
9. `THEME_GOVERNANCE.md`
10. `EXCEPTION_SURFACES.md`

The shared SSOT is managed as its own Git repository: https://github.com/sovereignsquad/general-design-system. Amanoba consumes the **`@doneisbetter/*`** package line at version **2.6.1** (2026-05-26) through the approved GitHub release assets until npm publication is live.

## Project Migration Plan

- `PROJECTS/AMANOBA_MANTINE_REFACTOR.md` in the shared GDS repo
- Delivery program: `docs/handoff/feature_issues/GDS_2_3_ADOPTION_PROGRAM.md` (mvp-factory-control **#868**–**#877**)

## Local Adapter

**Aligned SSOT version/date**: `2.6.1`, 2026-05-26
**Status**: Mantine-only product UI; `@doneisbetter/*` from GitHub release assets; pattern implementations under `app/components/patterns/gds/`
**Current UI foundation**: `extendGdsTheme` from `@doneisbetter/gds-theme/server` in `app/lib/ui/amanoba-gds-theme.ts`; root `GdsProvider` via `MantineRuntimeProvider`; token-only `design-system.css` + `globals.css`
**Target UI foundation**: direct package consumption per [ADOPTION_AND_MIGRATION_PLAYBOOK](https://github.com/sovereignsquad/general-design-system/blob/main/ADOPTION_AND_MIGRATION_PLAYBOOK.md) (achieved for primitives; documented exceptions remain)

### Package install

**Canonical future registry target:**

```sh
npm install @doneisbetter/gds-theme @doneisbetter/gds-core @doneisbetter/gds-admin
npm install -D @doneisbetter/gds-eslint-config @doneisbetter/gds-compliance
```

**Current supported install path (until npm publication is live):**

```sh
npm install \
  https://github.com/sovereignsquad/general-design-system/releases/download/gds-v2.6.1/doneisbetter-gds-theme-2.6.1.tgz \
  https://github.com/sovereignsquad/general-design-system/releases/download/gds-v2.6.1/doneisbetter-gds-core-2.6.1.tgz \
  https://github.com/sovereignsquad/general-design-system/releases/download/gds-v2.6.1/doneisbetter-gds-admin-2.6.1.tgz

npm install -D \
  https://github.com/sovereignsquad/general-design-system/releases/download/gds-v2.6.1/doneisbetter-gds-eslint-config-2.6.1.tgz \
  https://github.com/sovereignsquad/general-design-system/releases/download/gds-v2.6.1/doneisbetter-gds-compliance-2.6.1.tgz
```

| Package | Role |
| --- | --- |
| `@doneisbetter/gds-theme` | `GdsProvider`, `extendGdsTheme` (`/client`, `/server`) |
| `@doneisbetter/gds-core` | StateBlock, MetricCard, ProgressCard, GameBoardTile, AccessRecoveryPanel (`/client`, `/server`) |
| `@doneisbetter/gds-admin` | Admin/operational surfaces (`/client`, `/server`) |
| `@doneisbetter/gds-compliance` | Manifest validation and drift checks (dev) |
| `@doneisbetter/gds-eslint-config` | Shared lint rules (dev) |

Do **not** use legacy `@gds/*` names or sibling `file:` links in CI/production paths.

**Note:** The upstream verified consumer baseline for GDS 2.6.1 is Next `15.5.18`, React `19.2.0`, and Mantine `8.3.6`. Amanoba currently runs Next `16.2.6`, React `19.2.6`, and Mantine `8.3.18`, so local build verification is required on every upgrade. Use documented `/client` and `/server` entrypoints only.

### Pattern implementation paths

| Contract | Canonical path |
| --- | --- |
| GDS pattern barrel | `app/components/patterns/gds/index.ts` |
| Stable imports | `app/components/patterns/*.tsx` (re-export from `gds/`) |
| Theme | `app/lib/ui/amanoba-gds-theme.ts` → `mantine-theme.ts` |
| Learner header | `app/components/LearnerPageHeader.tsx` (local until GDS LearnerAppShell) |
| Course card | `app/components/patterns/CourseCard.tsx` |
| Course access recovery | `app/components/patterns/gds/CourseAccessRecoveryActions.tsx` → `@doneisbetter/gds-core/client` `AccessRecoveryPanel` |
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

- `@doneisbetter/gds-theme/server` + `extendGdsTheme` for Amanoba brand (dark shell, `amanoba` / `ink` palettes).
- Pattern barrel under `app/components/patterns/gds/`: **StateBlock**, **MetricCard**, **ProgressCard**, **GameBoardCard**, **CourseAccessRecovery** delegate to `@doneisbetter/gds-core/client`; brand-composition shells documented in `gds-adoption.json`.
- Admin list contracts across admin reporting surfaces.
- StateBlock on learner routes including quests, rewards, saved lessons, email settings.
- Guardrails: `npm run ui:check:mantine`, `ui:gds:verify`, `gds:import-smoke`.

Remaining (documented in `gds-adoption.json`, not duplicate GDS primitives):

- **Learner shell** — `LearnerPageHeader` until second product proves shared LMS chrome ([#99](https://github.com/sovereignsquad/general-design-system/issues/99)).
- **Course card variants** — `CourseCard` until GDS ships catalog/enrolled/progress/admin variants.
- **Brand-composition shells** — `AuthShell`, `PublicAppShell`, `ArticleShell`, `DataToolbar`, `ResponsiveDataView` (Amanoba dark marketing / admin row API).
- Residual `className` on layout/fonts/prose (documented exceptions only).

## GDS-only enforcement

- Machine-readable adoption contract: `gds-adoption.json` (version **2.6.1**).
- `app/components/patterns/gds/*` must import `@doneisbetter/*` except registered `brand-composition` adapters.
- No Tailwind/Radix/sonner/vaul/`@/components/ui/*` as product UI authority.
- Theme palettes live in `app/lib/constants/color-tokens.ts`; runtime uses `extendGdsTheme` only.

## Hard Rules

- Do not add new design rules to Amanoba docs when they belong in GDS.
- Do not reimplement GDS primitives (MetricCard, StateBlock, etc.) with raw Mantine in product code.
- New repeated shells/cards/states must use `@doneisbetter/*` via `patterns/gds` or be registered in `gds-adoption.json`.

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
