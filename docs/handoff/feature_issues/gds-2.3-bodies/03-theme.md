## Objective

Make **`@gds/theme`** the token authority base and express Amanoba brand only through **`extendGdsTheme()`**, per `THEME_GOVERNANCE.md`—preserving dark-shell readability, yellow CTA semantics, and `ink.*` surfaces.

## Unified Context

- Today: `app/lib/ui/mantine-theme.ts` is standalone `createTheme({ primaryColor: 'amanoba', colors: { amanoba, amanobaYellow, ink... } })`.
- GDS: `gdsTheme` defaults `primaryColor: 'violet'`, `GdsProvider` defaults `defaultColorScheme: 'light'`.
- Amanoba: `MantineRuntimeProvider` forces dark product mode—must remain after migration.

## Problem

Two theme authorities (GDS violet baseline vs Amanoba yellow/dark) violate FOUNDATION §2 unless extension is explicit.

## Goal

\[
T_{\text{Amanoba}} = \text{extendGdsTheme}(\Delta_{\text{brand}})
\]

where \(\Delta_{\text{brand}}\) only overrides colors, fonts, component defaults, and `theme.other` non-Mantine tokens (email/certs).

## Scope

### In scope

- Create `app/lib/ui/amanoba-gds-theme.ts` (or refactor `mantine-theme.ts`):

```ts
import { extendGdsTheme } from '@gds/theme/server';
import type { MantineThemeOverride } from '@mantine/core';

export const amanobaMantineTheme = extendGdsTheme({
  primaryColor: 'amanoba',
  primaryShade: 5,
  defaultRadius: 'md',
  colors: { amanoba: [...], amanobaYellow: [...], ink: [...] },
  components: { /* preserve existing Card, Paper, Text, Table defaults */ },
  other: {
    certificate: { /* from color-tokens if needed */ },
    email: { /* from color-tokens */ },
  },
});
```

- Wire `MantineRuntimeProvider` to use extended theme (keep `ModalsProvider` / `Notifications` if not switching to `GdsProvider` yet).
- **UX policy:** keep `defaultColorScheme="dark"` and document why `ThemeToggle` is omitted on learner surfaces (`EXCEPTION_SURFACES` + product policy).
- Map `app/lib/constants/color-tokens.ts` to `theme.other` where SSOT requires single export.

### Out of scope

- Migrating individual pages
- Deleting `mantine-theme.ts` until parity proven—may re-export from new module

## Technical Notes

### Color-mode constraint (mathematical readability)

For text on surface \(s\), contrast ratio \(CR(T, s) \geq 4.5\) for body text (WCAG AA). After extension:

```
∀ semantic text role r ∈ {body, title, label}:
  CR(theme.colors[r], theme.colors[shell_bg]) ≥ 4.5
```

Verify with spot check on `Card`, `Paper`, `Text` default props—not page-local overrides.

### Pseudocode: provider wiring

```tsx
// app/components/providers/MantineRuntimeProvider.tsx
import { MantineProvider } from '@mantine/core';
import { amanobaMantineTheme } from '@/app/lib/ui/amanoba-gds-theme';

<MantineProvider theme={amanobaMantineTheme} defaultColorScheme="dark" forceColorScheme="dark">
```

Do **not** nest second `MantineProvider` from `GdsProvider` until modals/notifications migration is explicit (optional follow-up).

## UX Instructions

- Learner/admin surfaces remain **dark shell**; no light cards on dark background.
- Primary CTA: `color="amanoba"` or `amanobaYellow` only on **primary actions** (layout grammar § CTA).
- Regression check: sign-in, dashboard, course catalog screenshots (desktop + 390px).

## Execution Prompt

Implement theme extension + provider wire. No visual redesign beyond token parity.

## Acceptance Checks

- [ ] Theme derives from `extendGdsTheme`, not standalone duplicate `createTheme` without GDS base
- [ ] `ink.*`, `amanoba`, `amanobaYellow` palettes preserved
- [ ] Dark mode forced for product UI
- [ ] `theme.other` documents email/certificate token bridge
- [ ] `ui:check:foundation` passes (no illegal `bg="white"` regressions)

## Verification

- `npm run type-check`
- `npm run ui:check:foundation`
- `npm run ui:check:mantine`
- `npm run build`
- Manual: `/en/dashboard`, `/en/auth/signin` screenshots

## Dependencies

- Depends on: child 2/9 (packages)
- Blocks: children 4/9–8/9 (visual consistency)

## Risks

- GDS base component hover styles (Card lift) may conflict with Amanoba—override in `components.Card.styles` if needed.

## Delivery Artifact

`amanoba-gds-theme.ts` + updated provider + HANDOVER note.
