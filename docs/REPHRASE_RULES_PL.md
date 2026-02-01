# Rephrase rules — Polish (PL)

**Purpose**: Per-locale rules for rephrasing quiz questions and options to native Polish. See `docs/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md` § 7.

## Bad terms (non-native / typo)

| Bad | Use |
|-----|-----|
| feedback loop | pętla informacji zwrotnej / szybką pętlę informacji zwrotnej |
| output (in PL sentence) | wynik (where measurable result is meant) |

## Generator (already applied)

- Practice stem: use `truncateAtWord(practice, 60)`; "szybki feedback loop" → "szybką pętlę informacji zwrotnej"; "mierzalny output" → "mierzalny wynik".

## Script

- **Audit**: `LANGUAGE=pl npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts`.
- **Fix script**: Use parameterised `scripts/fix-rephrase-questions-by-locale.ts` with `LANGUAGE=pl` when PL DB rephrase rules are added (e.g. replace "feedback loop" in existing questions).
