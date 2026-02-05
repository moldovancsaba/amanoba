# Rephrase rules — Vietnamese (VI)

**Purpose**: Per-locale rules for rephrasing quiz questions and options to native Vietnamese. See `docs/_archive/delivery/2026-01/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md` § 7.

## Bad terms (non-native / typo)

| Bad | Use |
|-----|-----|
| feedback loop | vòng phản hồi |

## Script

- **Audit**: `LANGUAGE=vi npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts`.
- **Fix**: `LANGUAGE=vi npx tsx --env-file=.env.local scripts/fix-rephrase-questions-by-locale.ts [--apply]`.
