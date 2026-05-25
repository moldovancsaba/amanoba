# UI Foundation Audit (Hard Rules)

**Generated at**: 2026-05-25T13:39:44.983Z

This report enforces **hard UI foundation rules** derived from `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` and the Amanoba adapter rules in `docs/architecture/layout_grammar.md`.
Goal: a rock-solid, maintainable UI foundation by preventing **raw color literals** (hex/rgb/hsl) from leaking into UI/output code, except in explicit token, adapter, or asset sources.

This is intentionally stricter than `docs/quality/UI_LAYOUT_GRAMMAR_AUDIT.md` (which is heuristic and counts “likely drift”).

## How to run

- Regenerate this file: `npm run ui:audit:foundation`
- Check (CI gate): `npm run ui:check:foundation`

## Summary

- Files scanned: **375**
- Findings (blockers): **32**

### Findings by rule
| Rule | Severity | Findings |
| --- | --- | --- |
| Raw color literals outside token sources (hex/rgb/hsl) | blocker | 32 |

### Top files
| File | Findings |
| --- | --- |
| `app/lib/ui/amanoba-gds-theme.ts` | 32 |

## Rules checked

| Rule | Severity | Scope | Notes |
| --- | --- | --- | --- |
| Raw color literals outside token sources (hex/rgb/hsl) | blocker | `app/**`, `components/**`, `public/**` (tracked) | Move colors to approved token sources (`app/design-system.css`, Mantine theme tokens, or a dedicated constants file) and reference those tokens. |
| Non-approved hex colors in restricted public assets | blocker | `app/**`, `components/**`, `public/**` (tracked) | Public assets may use hex, but only from the approved brand + semantic palette. |
| Hard-coded Mantine light/dark color props in product UI | blocker | `app/**`, `components/**`, `public/**` (tracked) | Use theme defaults or semantic Mantine tokens. Do not hard-code known unreadable mode props such as `bg="white"`, `bg="gray.0"`, `c="black"`, or `c="ink.9"` in product UI. |

## Findings (first 200)

| Where | Rule | Match |
| --- | --- | --- |
| `app/lib/ui/amanoba-gds-theme.ts:14` | Raw color literals outside token sources (hex/rgb/hsl) | `#111111` |
| `app/lib/ui/amanoba-gds-theme.ts:15` | Raw color literals outside token sources (hex/rgb/hsl) | `#f7f7f7` |
| `app/lib/ui/amanoba-gds-theme.ts:25` | Raw color literals outside token sources (hex/rgb/hsl) | `#fff9e6` |
| `app/lib/ui/amanoba-gds-theme.ts:26` | Raw color literals outside token sources (hex/rgb/hsl) | `#fff0bf` |
| `app/lib/ui/amanoba-gds-theme.ts:27` | Raw color literals outside token sources (hex/rgb/hsl) | `#ffe38a` |
| `app/lib/ui/amanoba-gds-theme.ts:28` | Raw color literals outside token sources (hex/rgb/hsl) | `#ffd452` |
| `app/lib/ui/amanoba-gds-theme.ts:29` | Raw color literals outside token sources (hex/rgb/hsl) | `#ffc421` |
| `app/lib/ui/amanoba-gds-theme.ts:30` | Raw color literals outside token sources (hex/rgb/hsl) | `#fab908` |
| `app/lib/ui/amanoba-gds-theme.ts:31` | Raw color literals outside token sources (hex/rgb/hsl) | `#c89100` |
| `app/lib/ui/amanoba-gds-theme.ts:32` | Raw color literals outside token sources (hex/rgb/hsl) | `#966c00` |
| `app/lib/ui/amanoba-gds-theme.ts:33` | Raw color literals outside token sources (hex/rgb/hsl) | `#654800` |
| `app/lib/ui/amanoba-gds-theme.ts:34` | Raw color literals outside token sources (hex/rgb/hsl) | `#332400` |
| `app/lib/ui/amanoba-gds-theme.ts:37` | Raw color literals outside token sources (hex/rgb/hsl) | `#fff9e6` |
| `app/lib/ui/amanoba-gds-theme.ts:38` | Raw color literals outside token sources (hex/rgb/hsl) | `#fff0bf` |
| `app/lib/ui/amanoba-gds-theme.ts:39` | Raw color literals outside token sources (hex/rgb/hsl) | `#ffe38a` |
| `app/lib/ui/amanoba-gds-theme.ts:40` | Raw color literals outside token sources (hex/rgb/hsl) | `#ffd452` |
| `app/lib/ui/amanoba-gds-theme.ts:41` | Raw color literals outside token sources (hex/rgb/hsl) | `#ffc421` |
| `app/lib/ui/amanoba-gds-theme.ts:42` | Raw color literals outside token sources (hex/rgb/hsl) | `#fab908` |
| `app/lib/ui/amanoba-gds-theme.ts:43` | Raw color literals outside token sources (hex/rgb/hsl) | `#c89100` |
| `app/lib/ui/amanoba-gds-theme.ts:44` | Raw color literals outside token sources (hex/rgb/hsl) | `#966c00` |
| `app/lib/ui/amanoba-gds-theme.ts:45` | Raw color literals outside token sources (hex/rgb/hsl) | `#654800` |
| `app/lib/ui/amanoba-gds-theme.ts:46` | Raw color literals outside token sources (hex/rgb/hsl) | `#332400` |
| `app/lib/ui/amanoba-gds-theme.ts:49` | Raw color literals outside token sources (hex/rgb/hsl) | `#f7f7f7` |
| `app/lib/ui/amanoba-gds-theme.ts:50` | Raw color literals outside token sources (hex/rgb/hsl) | `#e6e6e6` |
| `app/lib/ui/amanoba-gds-theme.ts:51` | Raw color literals outside token sources (hex/rgb/hsl) | `#c9c9c9` |
| `app/lib/ui/amanoba-gds-theme.ts:52` | Raw color literals outside token sources (hex/rgb/hsl) | `#a8a8a8` |
| `app/lib/ui/amanoba-gds-theme.ts:53` | Raw color literals outside token sources (hex/rgb/hsl) | `#878787` |
| `app/lib/ui/amanoba-gds-theme.ts:54` | Raw color literals outside token sources (hex/rgb/hsl) | `#686868` |
| `app/lib/ui/amanoba-gds-theme.ts:55` | Raw color literals outside token sources (hex/rgb/hsl) | `#4f4f4f` |
| `app/lib/ui/amanoba-gds-theme.ts:56` | Raw color literals outside token sources (hex/rgb/hsl) | `#3a3a3a` |
| `app/lib/ui/amanoba-gds-theme.ts:57` | Raw color literals outside token sources (hex/rgb/hsl) | `#2d2d2d` |
| `app/lib/ui/amanoba-gds-theme.ts:58` | Raw color literals outside token sources (hex/rgb/hsl) | `#111111` |
