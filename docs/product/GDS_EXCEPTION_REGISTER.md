# Amanoba GDS Exception Register

**Last Updated**: 2026-05-25
**Status**: Active
**Shared SSOT**: `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`

This register records the narrow UI exceptions that are currently allowed while Amanoba completes the Mantine-only migration. An exception is valid only when it has:

- a concrete scope
- a user-facing reason
- a removal condition
- a matching entry in `gds-adoption.json`

## Active Exceptions

| Exception ID | File Scope | Reason and user impact | Removal condition |
|---|---|---|---|
| `rich-lesson-prose-html` | `app/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page.tsx`, `app/[locale]/courses/[courseId]/day/[dayNumber]/view/page.tsx` | Rich lesson bodies are rendered from editorial HTML through `TypographyStylesProvider`. Scoped prose styling remains necessary so long-form lesson content stays readable and structurally correct in both learner and view-only flows. | Remove when lesson/article prose rendering is fully covered by a shared GDS content-shell or prose contract without local overrides. |
| `game-board-local-layout` | `app/components/games/MemoryGame.tsx` | Board-internal layout and flip animation logic remain local because the shared contract currently covers the game shell and chrome, not every board mechanic. This exception prevents shell-level consistency work from blocking game playability. | Remove when the reusable game chrome contract expands to cover board-internal layout rules or the local board styles are retired behind a shared pattern. |
| `certificate-linkedin-brand-color` | `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx` | The LinkedIn share action may use LinkedIn brand color as a third-party brand exception. This preserves a recognizable share affordance without redefining Amanoba's product palette. | Remove if the share action is redesigned to use a neutral secondary action treatment or a shared external-brand token contract replaces the local color use. |
| `transitional-global-css-support` | `app/design-system.css`, `app/globals.css`, `components/CookieConsentBanner.module.css` | Narrow CSS support layers still exist for document defaults, rich prose, Mantine token bridging, and a small number of frozen transitional surfaces. This keeps migrated and not-yet-migrated surfaces stable during the last cleanup passes. | Remove as remaining legacy surfaces move behind Mantine contracts and the temporary CSS bridge becomes unnecessary. |

## Usage Rule

Do not add a new exception because a surface is inconvenient to migrate. A new exception is allowed only when:

1. the shared GDS contract does not yet cover the use case cleanly, or
2. a third-party brand/accessibility/runtime requirement prevents immediate contract-only implementation

Every new exception must be reviewed against:

- `docs/product/DESIGN_UPDATE.md`
- `docs/product/GDS_ADOPTION_MANIFEST.md`
- `gds-adoption.json`
