# UI Foundation Audit (Hard Rules)

**Generated at**: 2026-02-05T20:31:31.416Z

This report enforces **hard UI foundation rules** derived from `docs/layout_grammar.md` (UI layout).
Goal: a rock-solid, maintainable UI foundation by preventing **raw color literals** (hex/rgb/hsl) from leaking into UI/output code, except in explicit token or asset sources.

This is intentionally stricter than `docs/UI_LAYOUT_GRAMMAR_AUDIT.md` (which is heuristic and counts “likely drift”).

## How to run

- Regenerate this file: `npm run ui:audit:foundation`
- Check (CI gate): `npm run ui:check:foundation`

## Summary

- Files scanned: **317**
- Findings (blockers): **0**

### Findings by rule
| Rule | Severity | Findings |
| --- | --- | --- |

### Top files
| File | Findings |
| --- | --- |

## Rules checked

| Rule | Severity | Scope | Notes |
| --- | --- | --- | --- |
| Raw color literals outside token sources (hex/rgb/hsl) | blocker | `app/**`, `components/**`, `public/**` (tracked) | Move colors to token sources (`app/design-system.css`, Tailwind brand palette, or a dedicated constants file) and reference those tokens. |
| Non-approved hex colors in restricted public assets | blocker | `app/**`, `components/**`, `public/**` (tracked) | Public assets may use hex, but only from the approved brand + semantic palette. |

## Findings (first 200)

| Where | Rule | Match |
| --- | --- | --- |
