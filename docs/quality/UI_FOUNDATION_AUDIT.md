# UI Foundation Audit (Hard Rules)

**Generated at**: 2026-06-25T14:34:05.713Z

This report enforces **hard UI foundation rules** derived from `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` and the Amanoba adapter rules in `docs/architecture/layout_grammar.md`.
Goal: a rock-solid, maintainable UI foundation by preventing **raw color literals** (hex/rgb/hsl) from leaking into UI/output code, except in explicit token, adapter, or asset sources.

This is intentionally stricter than `docs/quality/UI_LAYOUT_GRAMMAR_AUDIT.md` (which is heuristic and counts “likely drift”).

## How to run

- Regenerate this file: `npm run ui:audit:foundation`
- Check (CI gate): `npm run ui:check:foundation`

## Summary

- Files scanned: **385**
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
| Raw color literals outside token sources (hex/rgb/hsl) | blocker | `app/**`, `components/**`, `public/**` (tracked) | Move colors to approved token sources (`app/design-system.css`, Mantine theme tokens, or a dedicated constants file) and reference those tokens. |
| Non-approved hex colors in restricted public assets | blocker | `app/**`, `components/**`, `public/**` (tracked) | Public assets may use hex, but only from the approved brand + semantic palette. |
| Hard-coded Mantine light/dark color props in product UI | blocker | `app/**`, `components/**`, `public/**` (tracked) | Use theme defaults or semantic Mantine tokens. Do not hard-code known unreadable mode props such as `bg="white"`, `bg="gray.0"`, `c="black"`, or `c="ink.9"` in product UI. |

## Findings (first 200)

| Where | Rule | Match |
| --- | --- | --- |
