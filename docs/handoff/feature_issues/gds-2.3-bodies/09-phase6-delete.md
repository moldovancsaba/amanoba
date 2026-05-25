## Objective

Execute **Phase 6** of `PROJECTS/AMANOBA_MANTINE_REFACTOR.md`: remove Tailwind/Radix/legacy CSS as **design authority**, leaving only documented exceptions per `EXCEPTION_SURFACES.md`.

## Unified Context

Remaining signals (audit 2026-05-24):

- Residual `className=` on Next/Image, aspect-ratio, `lesson-prose`, font variables in `layout.tsx`
- `app/design-system.css` — token-only (~130 lines) — keep or merge into theme
- `app/globals.css` — prose + Mantine bridge
- `tailwind.config.ts` / PostCSS — verify still required for fonts only
- `UI_LAYOUT_GRAMMAR_AUDIT.md`: 3 info inline-style findings on course pages

## Problem

Hybrid authority blocks GDS compliance claim on portfolio matrix.

## Goal

\[
\text{ProductUI} \not\models \text{TailwindUtilities} \land \text{design authority} = T_{\text{Amanoba}}
\]

except documented exception set \(E\).

## Scope

### In scope

1. **Inventory** all `className` in `app/**` — classify: delete | replace Mantine prop | exception
2. **Dependency audit:** `npm ls tailwindcss @radix-ui/* sonner vaul` — remove if zero imports
3. **Shrink** `globals.css` to reset + prose + documented variables only
4. **Delete or empty** `design-system.css` if tokens live in `extendGdsTheme`
5. **Tighten** `ui:check:layout` / foundation checks if needed
6. Update `DESIGN_UPDATE.md` status: Mantine-only **current truth** not "in progress"
7. Request GDS maintainers refresh `AMANOBA_MANTINE_REFACTOR.md` snapshot (comment on GDS repo)

### Exception registry (must list in DESIGN_UPDATE)

| Surface | Reason | Removal condition |
| --- | --- | --- |
| `lesson-prose` | Rich HTML lesson body | Mantine Typography contract |
| Next/Image `object-cover` | Image fill | Never — layout exception |
| Game canvas | Engine | N/A |
| Email/certificate render | Non-Mantine | N/A |

### Out of scope

- New GDS LearnerAppShell (coordination)
- Full course page rewrite (#826)

## Technical Notes

### Deletion order (prevent build break)

```
1. Remove unused deps from package.json
2. Remove tailwind @tailwind directives if unused
3. Fix broken styles with Mantine
4. Run build
```

### Pseudocode: className policy check

```js
// extend scripts/check-mantine-boundaries.mjs
const allowedClassNameFiles = new Set([
  'app/[locale]/layout.tsx', // font variables only
  'app/[locale]/courses/.../page.tsx', // lesson-prose, aspect-video — document
]);
```

## UX Instructions

- No visual regression on course catalog, lesson view, dashboard
- Prose readability unchanged (line-height, link contrast)

## Acceptance Checks

- [ ] No Radix/sonner/vaul in `package.json` unless used (zero)
- [ ] Tailwind not used for product layout (utilities grep below threshold documented)
- [ ] `ui:check:mantine`, `foundation`, `layout`, `build` pass
- [ ] Exception table in DESIGN_UPDATE complete
- [ ] HANDOVER records Phase 6 completion

## Verification

- Full quality gates
- `npm run ui:audit:layout -- --write` if script exists; commit if policy
- Before/after screenshots: courses catalog, lesson day view

## Dependencies

- Depends on: 8/9 (pattern retirement)
- Last in epic sequence

## Risks

- Next.js font `className` on `<html>` — keep as documented exception

## Delivery Artifact

Dependency cleanup + CSS shrink + exception registry + portfolio doc comment.
