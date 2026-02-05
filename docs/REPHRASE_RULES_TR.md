# Rephrase rules — Turkish (TR)

**Purpose**: Per-locale rules for rephrasing quiz questions and options to native Turkish. See `docs/_archive/delivery/2026-01/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md` § 7.

## Bad terms (non-native / typo)

*(Add when found via audit.)*

| Bad | Use |
|-----|-----|
| *(none documented yet)* | — |

## Script

- **Audit**: `LANGUAGE=tr npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts`.
- **Fix**: `LANGUAGE=tr npx tsx --env-file=.env.local scripts/fix-rephrase-questions-by-locale.ts [--apply]`.
