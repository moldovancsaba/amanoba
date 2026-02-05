# Rephrase rules — Hungarian (HU)

**Purpose**: Per-locale rules for rephrasing quiz questions and options to native Hungarian (grammar, understandability). See `docs/_archive/delivery/2026-01/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md` § 7.

## Bad terms (non-native / typo)

| Bad | Use |
|-----|-----|
| visszacsatolás / visszacsatolást | visszajelzés / visszajelzést |
| bevezetési táv | bevezetési terv |
| tartalo | tartalmat |

## Stem rephrase patterns (practice-intro questions)

- **Before**: "Egy új gyakorlatot vezetsz be: „…". Melyik bevezetési terv biztosít mérhető kimenetet és gyors visszacsatolást?"
- **After**: "Bevezetsz egy új gyakorlatot: „…". Melyik bevezetési terv biztosít mérhető kimenetelt és gyors visszajelzést?"

- **Before**: "A „…” témában új gyakorlatot próbálsz ki: „…". Melyik bevezetési terv teszi a hatást ellenőrizhetővé (előtte/utána)?"
- **After**: "A „…” témában bevezetsz egy új gyakorlatot: „…". Melyik bevezetési terv teszi a hatást ellenőrizhetővé (előtte/utána)?"

## Recurring option rephrases

- **Scope distractor**: "Túl nagy scope-pal indulok (minden csapat/folyamat), így nincs gyors visszacsatolás és nem látszik, mi okozza az eredményt." → "Túl nagy teret adok a gyakorlatnak egyszerre (minden csapat részt vesz), ezért nincs gyors visszajelzés, és nem derül ki, mi okozza az eredményt."

## Script

- **Fix script**: `scripts/fix-hu-practice-questions-rephrase.ts` (dry-run then `--apply`).
- **Audit**: `LANGUAGE=hu npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts`.
