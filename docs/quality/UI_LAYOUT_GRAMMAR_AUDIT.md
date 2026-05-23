# UI Layout Grammar Audit

**Generated at**: 2026-05-23T07:45:44.088Z

This report scans tracked UI code (`app/**`, `components/**`) for **layout-grammar / design-token** drift. It is a *heuristic* scan: it finds likely violations, then humans decide which are intentional.

## How to run

- Regenerate this file: `node --import tsx scripts/audit-layout-grammar-ui.ts --write`
- Quick scan (stdout only): `node --import tsx scripts/audit-layout-grammar-ui.ts`

## Summary

- Files scanned: **219**

### Findings by area
| Group | Findings |
| --- | --- |

### Findings by severity
| Severity | Findings |
| --- | --- |

### Top patterns (most frequent)
| Pattern | Severity | Findings |
| --- | --- | --- |

### Top files (most findings)
| File | Group | Findings |
| --- | --- | --- |

## Rules checked (what counts as a “defect”)

These rules are derived from `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` plus the Amanoba adapter rules in `docs/architecture/layout_grammar.md` (§ UI layout). `app/design-system.css` and the Mantine theme are local adapter sources, not design authority.

| Rule | Severity | Scope | Notes |
| --- | --- | --- | --- |
| Hardcoded utility hex colors (e.g. bg-[#...] ) | blocker | `app/**` + `components/**` | Use approved shared-theme or adapter tokens. Exception: explicit external brand colors (e.g. social share) should be centralized. |
| Inline color literals in style={{...}} (hex/rgb/hsl) | blocker | `app/**` + `components/**` | Avoid hardcoded colors in inline styles; use shared-theme or adapter tokens. (Heuristic scan: may include some false positives.) |
| Default template indigo/blue palette in UI | major | `app/**` + `components/**` | Amanoba UI grammar expects brand tokens (CTA yellow + dark shell). Indigo/blue typically indicates template leftovers. |
| Default template gray scale in UI | major | `app/**` + `components/**` | Prefer shared-theme semantics; while migrating, use adapter tokens (brand-darkGrey, brand-white, brand-black) and approved CSS variables. |
| Template yellow palette usage (prefer brand accent token) | major | `app/**` + `components/**` | CTA yellow should be applied via brand tokens (`brand-accent` / `primary-*`) and used only for primary actions. |
| CTA accent background on non-action elements (likely misuse) | major | `app/**` + `components/**` | Layout grammar: CTA yellow is exclusive to primary actions. If this is an intentional CTA-like element, change to button/link or adjust styling. |
| CTA accent text on non-link elements (review) | major | `app/**` + `components/**` | Accent text is usually for primary links or emphasis. Ensure it is not used as a generic label/badge. |
| Plain white/black classes (bg-white, text-white, bg-black, text-black) | minor | `app/**` + `components/**` | Prefer `brand-*` tokens (`bg-brand-white`, `text-brand-white`, etc.) for consistency. |
| Uses utility dark: variants | info | `app/**` + `components/**` | The product grammar is “dark shell by default”. Review utility dark-mode variants for consistency. |
| Inline style={{...}} in components/pages | info | `app/**` + `components/**` | Often needed for progress widths/aspect ratios. Prefer Mantine props or pattern contracts when possible; ensure tokens for colors. |

## Sample findings (first 120)

Use this section to spot-check; the totals above are the authoritative counts.

| Where | Pattern | Matches |
| --- | --- | --- |

## Actionable next steps (recommended)

1. **Admin UI first:** Replace `indigo-*` / `gray-*` button + panel styling in `app/[locale]/admin/**` with shared adapter primitives now, then map those surfaces to Mantine wrappers during the shared-SSOT migration.
2. **Shared components next:** Fix shared components that use template palette classes or page-local styling (these leak inconsistent styling across the app).
3. **Decide policy for games:** Document any game-canvas exceptions against `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM/GOVERNANCE.md`, then migrate reusable chrome to the shared adapter.
4. **Add guardrails:** Turn the “blocker/major” rules into a `--check` CI step once we’ve reduced the current findings to an acceptable baseline.
