# Design System Status

**Last Updated**: 2026-05-10  
**Status**: Active foundation, incremental migration still required

---

## Current truth

The Amanoba design system is **not fully migrated** across the app. The central foundation exists, but UI drift accumulated in shared primitives and page-level Tailwind classes.

As of this update, the active source of truth is:

1. `app/design-system.css`  
   CSS variables for brand, semantic, surface, border, text, motion, and external-brand colors.
2. `tailwind.config.ts`  
   Tailwind aliases that expose the CSS-token system to components via `brand.*`, `primary.*`, `semantic.*`, and `social.*`.
3. `app/globals.css`  
   Shared shell/panel/page utility classes such as `.page-shell`, `.page-card`, `.ds-panel`, `.ds-panel-dark`, and `.ds-copy-muted`.
4. `app/components/ui/button.tsx` and `app/components/ui/card.tsx`  
   Shared UI primitives that must stay aligned with the token system.
5. `app/lib/constants/color-tokens.ts` and `app/lib/constants/certificate-colors.ts`  
   Non-CSS token sources for emails, OG/certificate image rendering, charts, and similar server-rendered contexts.

---

## What was broken

- Shared UI primitives still used generic template colors (`indigo-*`, `gray-*`) instead of Amanoba brand tokens.
- Some app pages used raw hard-coded UI colors directly in JSX.
- Audit scripts wrote to obsolete doc paths (`docs/UI_*`) while the real quality docs live in `docs/quality/`.
- Older docs claimed the design system was "complete", which no longer matched the codebase.

---

## What is now fixed

### Shared foundations

- `Button` now defaults to Amanoba brand styling instead of generic template colors.
- `Card` now supports brand-aligned variants (`default`, `dark`, `subtle`) instead of a generic white/gray shell.
- New shared surface/text utility classes were added in `app/globals.css` for dark-shell layouts and token-driven panels.

### Token coverage

- Google sign-in brand colors are now centralized as CSS variables instead of raw hex values in the sign-in page.
- Surface, text, and border aliases were added to `app/design-system.css` so shared UI primitives reference the same semantic layer.
- Tailwind now exposes those token groups under `brand.surface`, `brand.text`, `brand.border`, `semantic`, and `social.google`.

### Validation pipeline

- `ui:check:foundation` now points to the canonical quality-doc path under `docs/quality/`.
- The hard-rule audit is clean for the current codebase after the sign-in raw-color fix.

---

## Migration policy

### Hard rules

- No raw color literals in tracked UI code outside approved token sources.
- CTA yellow is reserved for primary actions only.
- Shared primitives must use the design-system token layer, not ad-hoc Tailwind palettes.
- Non-CSS rendering contexts must pull colors from `app/lib/constants/color-tokens.ts` or related token files.

### Soft rules

- Existing page-level Tailwind drift can be migrated incrementally.
- When touching a page, prefer replacing repeated visual patterns with token-driven primitives instead of rewriting entire screens.
- Games may keep distinct visual personality, but their reusable chrome should still sit on the shared token foundation.

---

## Validation commands

- `npm run ui:check:foundation`
- `npm run ui:check:layout`
- `npm run lint`
- `npm run build`

Use `npm run ui:audit:foundation` and `npm run ui:audit:layout` to refresh the quality docs after UI refactors.

---

## Next migration targets

1. Admin pages with heavy `indigo-*` / `gray-*` drift, especially achievements and players.
2. Profile and certificate pages with large counts of token-drift findings.
3. Shared components that still rely on generic Tailwind palette classes.
4. Any documentation that still describes the design system as fully migrated.
