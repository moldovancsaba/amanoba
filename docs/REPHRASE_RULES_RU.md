# Rephrase rules — Russian (RU)

**Purpose**: Per-locale rules for rephrasing quiz questions and options to native Russian. See `docs/_archive/delivery/2026-01/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md` § 7.

## Bad terms (non-native / typo)

*(Add when found via audit.)*

| Bad | Use |
|-----|-----|
| *(none documented yet)* | — |

## Stem rephrase patterns

*(Add when recurring patterns are identified.)*

## Script

- **Audit**: `LANGUAGE=ru npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts`.
- **Fix script**: Use parameterised `scripts/fix-rephrase-questions-by-locale.ts` with `LANGUAGE=ru` when RU rephrase rules are added.
