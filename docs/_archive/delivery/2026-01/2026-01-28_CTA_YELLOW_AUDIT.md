# CTA Yellow (#FAB908) Usage Audit

**Purpose**: P3.3 — Ensure only primary actions use brand yellow (#FAB908); badges/TOC use neutral.  
**Source**: `docs/_archive/delivery/2026-01/2026-01-30_TECH_AUDIT_JANUARY.md` §4.3; design-system.css.

---

## Guideline

- **Primary CTAs**: Buttons and links that are the main action (e.g. "Start", "Save", "Submit") → use `THEME_COLOR` / `#FAB908` / `--cta-bg` / Tailwind `bg-primary-500` or design tokens.
- **Badges, TOC, secondary chrome**: Status labels, difficulty, "premium only", tier labels (when not semantic) → use neutral (gray/slate) or semantic (e.g. success/warning) where appropriate.

---

## Current usage (summary)

| Location | Usage | Classification | Action |
|----------|--------|----------------|--------|
| design-system.css, globals.css, app-url.ts, layout.tsx | Theme/primary token definition | Correct | — |
| email-service, unsubscribe route, rich-text-editor, anonymous-auth, admin/courses route | CTA/accents in email or server config | Correct | — |
| admin/courses/[courseId] | Button "Save" / action | CTA | — |
| admin/rewards | "Premium only" badge | Badge | Use neutral |
| admin/games | Status/style badge | Badge | Use neutral |
| admin/achievements, admin/questions, admin/challenges | "Gold" / "Medium" difficulty badges | Semantic (tier/difficulty) | Optional: neutral for generic badges |
| profile, certificate pages | Medal/achievement icon background | Semantic (achievement) | Leave |
| games (quizzz timer, madoku, MemoryGame) | Timer state (yellow = warning) or accent | Semantic / CTA | Leave |
| challenges page | "Medium" gradient | Difficulty | Optional |
| admin/page (dashboard) | Stats icon, activity type badge, "Normal" label | Mixed | Leave or neutral for labels |

---

## Changes made (P3.3)

- **Admin rewards**: "Premium only" badge → neutral (e.g. `bg-neutral-600 text-neutral-200` or `bg-slate-600 text-slate-200`) so primary yellow is reserved for CTAs.
- **Admin games**: Status badge (e.g. featured/visibility) → neutral where it is not a primary action.
- **Tailwind → design-system (2026-01-28)**: `tailwind.config.ts` now uses CSS variables for CTA/primary: `brand.accent` = `var(--cta-bg)`, `brand.primary.400` = `var(--cta-bg-hover)`, `primary.*` = `var(--color-primary-*)` / `var(--cta-bg)`. Single source of truth: `app/design-system.css`.
- **Admin quests**: "Premium Only" label → neutral badge (`bg-neutral-600/80 text-neutral-200 rounded`).
- **Admin rewards**: Total redemptions stat number → `text-neutral-200` (was `text-yellow-400`) so yellow is reserved for CTAs.

---

## Backlog (optional)

- Replace remaining Tailwind `yellow-500` on non-CTA badges (e.g. difficulty "medium", generic "gold" tier) with neutral or semantic tokens.
- Prefer design-system CSS variables (e.g. `var(--color-neutral-600)`) in new components instead of raw Tailwind for badges.

---

**Updated**: 2026-01-28 (design-system wiring, admin quests/rewards neutral)
