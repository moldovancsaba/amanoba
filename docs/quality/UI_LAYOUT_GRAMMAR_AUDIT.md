# UI Layout Grammar Audit

**Generated at**: 2026-05-21T10:44:40.217Z

This report scans tracked UI code (`app/**`, `components/**`) for **layout-grammar / design-token** drift. It is a *heuristic* scan: it finds likely violations, then humans decide which are intentional.

## How to run

- Regenerate this file: `node --import tsx scripts/audit-layout-grammar-ui.ts --write`
- Quick scan (stdout only): `node --import tsx scripts/audit-layout-grammar-ui.ts`

## Summary

- Files scanned: **219**

### Findings by area
| Group | Findings |
| --- | --- |
| admin | 615 |
| app | 438 |
| games | 199 |
| components | 11 |

### Findings by severity
| Severity | Findings |
| --- | --- |
| major | 763 |
| minor | 453 |
| info | 47 |

### Top patterns (most frequent)
| Pattern | Severity | Findings |
| --- | --- | --- |
| Default Tailwind gray scale in UI | major | 535 |
| Plain white/black classes (bg-white, text-white, bg-black, text-black) | minor | 453 |
| Default Tailwind indigo/blue palette in UI | major | 115 |
| CTA accent background on non-action elements (likely misuse) | major | 43 |
| Tailwind yellow palette usage (prefer brand accent token) | major | 37 |
| CTA accent text on non-link elements (review) | major | 33 |
| Inline style={{...}} in components/pages | info | 31 |
| Uses Tailwind dark: variants | info | 16 |

### Top files (most findings)
| File | Group | Findings |
| --- | --- | --- |
| `app/[locale]/profile/[playerId]/page.tsx` | app | 132 |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx` | admin | 93 |
| `app/[locale]/games/quizzz/page.tsx` | games | 57 |
| `app/[locale]/admin/players/page.tsx` | admin | 53 |
| `app/[locale]/admin/achievements/page.tsx` | admin | 51 |
| `app/[locale]/admin/certificates/page.tsx` | admin | 50 |
| `app/[locale]/admin/surveys/page.tsx` | admin | 50 |
| `app/[locale]/games/sudoku/page.tsx` | games | 48 |
| `app/[locale]/games/whackpop/page.tsx` | games | 46 |
| `app/[locale]/admin/rewards/page.tsx` | admin | 44 |
| `app/[locale]/admin/games/page.tsx` | admin | 41 |
| `app/[locale]/data-deletion/page.tsx` | app | 41 |
| `app/[locale]/games/madoku/page.tsx` | games | 41 |
| `app/[locale]/certificate/[slug]/page.tsx` | app | 37 |
| `app/[locale]/admin/analytics/page.tsx` | admin | 36 |
| `app/[locale]/admin/challenges/page.tsx` | admin | 35 |
| `app/[locale]/certificate/verify/[playerId]/[courseId]/page.tsx` | app | 34 |
| `app/[locale]/admin/email-analytics/page.tsx` | admin | 29 |
| `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx` | app | 28 |
| `app/[locale]/admin/quests/page.tsx` | admin | 24 |
| `app/[locale]/admin/achievements/new/page.tsx` | admin | 23 |
| `app/[locale]/admin/questions/page.tsx` | admin | 23 |
| `app/[locale]/quests/page.tsx` | app | 17 |
| `app/[locale]/admin/feature-flags/page.tsx` | admin | 16 |
| `app/[locale]/admin/page.tsx` | admin | 16 |

## Rules checked (what counts as a “defect”)

These rules are derived from `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` plus the Amanoba adapter rules in `docs/architecture/layout_grammar.md` (§ UI layout). `app/design-system.css` and `tailwind.config.ts` are adapter sources, not design authority.

| Rule | Severity | Scope | Notes |
| --- | --- | --- | --- |
| Hardcoded hex Tailwind colors (e.g. bg-[#...] ) | blocker | `app/**` + `components/**` | Use approved shared-theme or adapter tokens. Exception: explicit external brand colors (e.g. social share) should be centralized. |
| Inline color literals in style={{...}} (hex/rgb/hsl) | blocker | `app/**` + `components/**` | Avoid hardcoded colors in inline styles; use shared-theme or adapter tokens. (Heuristic scan: may include some false positives.) |
| Default Tailwind indigo/blue palette in UI | major | `app/**` + `components/**` | Amanoba UI grammar expects brand tokens (CTA yellow + dark shell). Indigo/blue typically indicates template leftovers. |
| Default Tailwind gray scale in UI | major | `app/**` + `components/**` | Prefer shared-theme semantics; while migrating, use adapter tokens (brand-darkGrey, brand-white, brand-black) and approved CSS variables. |
| Tailwind yellow palette usage (prefer brand accent token) | major | `app/**` + `components/**` | CTA yellow should be applied via brand tokens (`brand-accent` / `primary-*`) and used only for primary actions. |
| CTA accent background on non-action elements (likely misuse) | major | `app/**` + `components/**` | Layout grammar: CTA yellow is exclusive to primary actions. If this is an intentional CTA-like element, change to button/link or adjust styling. |
| CTA accent text on non-link elements (review) | major | `app/**` + `components/**` | Accent text is usually for primary links or emphasis. Ensure it is not used as a generic label/badge. |
| Plain white/black classes (bg-white, text-white, bg-black, text-black) | minor | `app/**` + `components/**` | Prefer `brand-*` tokens (`bg-brand-white`, `text-brand-white`, etc.) for consistency. |
| Uses Tailwind dark: variants | info | `app/**` + `components/**` | Dark mode exists (`darkMode: class`), but the product grammar is “dark shell by default”. Review for consistency. |
| Inline style={{...}} in components/pages | info | `app/**` + `components/**` | Often needed for progress widths/aspect ratios. Prefer Tailwind utilities when possible; ensure tokens for colors. |

## Sample findings (first 120)

Use this section to spot-check; the totals above are the authoritative counts.

| Where | Pattern | Matches |
| --- | --- | --- |
| `app/[locale]/achievements/page.tsx:43` | Default Tailwind gray scale in UI | `from-stone-500` `to-stone-700` |
| `app/[locale]/achievements/page.tsx:44` | Default Tailwind gray scale in UI | `from-gray-400` `to-gray-600` |
| `app/[locale]/achievements/page.tsx:45` | Default Tailwind gray scale in UI | `from-slate-300` `to-slate-500` |
| `app/[locale]/achievements/page.tsx:229` | CTA accent background on non-action elements (likely misuse) | `<div className="absolute top-0 right-0 bg-brand-accent text-brand-black px-3 py-1 rounded-bl-lg font-bold text-sm"` |
| `app/[locale]/achievements/page.tsx:248` | CTA accent text on non-link elements (review) | `<span className="text-brand-accent font-bold flex items-center gap-1"` |
| `app/[locale]/achievements/page.tsx:315` | CTA accent text on non-link elements (review) | `<span className="text-brand-accent font-bold"` |
| `app/[locale]/achievements/page.tsx:236` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/achievements/page.tsx:288` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/achievements/page.tsx:308` | Inline style={{...}} in components/pages | `style={{` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:459` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:475` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:493` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:509` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:529` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:546` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` `bg-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:563` | Default Tailwind indigo/blue palette in UI | `text-indigo-600` `ring-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:586` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:606` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:625` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:659` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:681` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:695` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:710` | Default Tailwind indigo/blue palette in UI | `border-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:728` | Default Tailwind indigo/blue palette in UI | `text-indigo-600` `ring-indigo-500` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:782` | Default Tailwind indigo/blue palette in UI | `bg-indigo-600` `bg-indigo-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:122` | Default Tailwind gray scale in UI | `bg-gray-400` `text-gray-300` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:407` | Default Tailwind gray scale in UI | `bg-gray-800` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:415` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:459` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:464` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:475` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:481` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:493` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:509` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:529` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:534` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:547` | Default Tailwind gray scale in UI | `border-gray-700` `border-gray-600` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:563` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:581` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:586` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:606` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:625` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:629` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:659` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:681` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:695` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:710` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:728` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:739` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:751` | Default Tailwind gray scale in UI | `text-gray-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:752` | Default Tailwind gray scale in UI | `text-gray-300` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:775` | Default Tailwind gray scale in UI | `bg-gray-700` `bg-gray-600` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:794` | Default Tailwind gray scale in UI | `bg-gray-800` `border-gray-700` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:796` | Default Tailwind gray scale in UI | `text-gray-300` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:810` | Default Tailwind gray scale in UI | `bg-gray-700` `bg-gray-600` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:123` | Tailwind yellow palette usage (prefer brand accent token) | `bg-yellow-500/20` `text-yellow-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:432` | Tailwind yellow palette usage (prefer brand accent token) | `bg-yellow-900/20` `border-yellow-500/50` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:433` | Tailwind yellow palette usage (prefer brand accent token) | `text-yellow-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:434` | Tailwind yellow palette usage (prefer brand accent token) | `text-yellow-300` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:799` | Tailwind yellow palette usage (prefer brand accent token) | `text-yellow-400` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:394` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:409` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:412` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:444` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:452` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:459` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:469` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:475` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:487` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:493` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:503` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:509` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:521` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:529` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:565` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:574` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:579` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:586` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:600` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:606` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:618` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:625` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:652` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:659` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:669` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:674` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:681` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:688` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:695` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:703` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:710` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:720` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:730` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:738` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:744` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:767` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:775` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:782` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:793` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `bg-black` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:795` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:810` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/[achievementId]/page.tsx:818` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:80` | Tailwind yellow palette usage (prefer brand accent token) | `bg-yellow-500/20` `text-yellow-400` |
| `app/[locale]/admin/achievements/new/page.tsx:286` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:289` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:310` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:318` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:335` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:353` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:369` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:387` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:431` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:440` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:445` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:466` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:484` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:518` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:535` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:540` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |
| `app/[locale]/admin/achievements/new/page.tsx:554` | Plain white/black classes (bg-white, text-white, bg-black, text-black) | `text-white` |

## Actionable next steps (recommended)

1. **Admin UI first:** Replace `indigo-*` / `gray-*` button + panel styling in `app/[locale]/admin/**` with shared adapter primitives now, then map those surfaces to Mantine wrappers during the shared-SSOT migration.
2. **Shared components next:** Fix `components/LanguageSwitcher.tsx` and any other shared component that uses default Tailwind palettes (these leak inconsistent styling across the app).
3. **Decide policy for games:** Document any game-canvas exceptions against `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/GOVERNANCE.md`, then migrate reusable chrome to the shared adapter.
4. **Add guardrails:** Turn the “blocker/major” rules into a `--check` CI step once we’ve reduced the current findings to an acceptable baseline.
