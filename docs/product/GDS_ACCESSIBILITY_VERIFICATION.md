# GDS Accessibility Verification

**Last Updated**: 2026-05-28
**Scope**: Current GDS-backed admin/editor/learner surfaces delivered in repo.
**Method**: Manual runtime verification plus code-level contract review.

## Verification Matrix

| Surface | Keyboard flow | Focus visibility | Contrast / readability | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Admin shell | Sidebar, page-header actions, and save controls are reachable in logical tab order. | Mantine/GDS focus rings remain visible against dark admin chrome. | Header, nav, cards, and action controls use governed GDS tokens. | Verified | Re-check after shell nav or header action changes. |
| Editor shell | Header actions, lesson editor controls, and scaffold action bars remain keyboard reachable. | Sticky action regions preserve visible focus when scrolled. | Editor shell chrome inherits the same dark-shell token baseline as admin. | Verified | Markdown editor island still needs focused smoke checks when its wrapper changes. |
| Learner header | Desktop nav, mobile menu trigger, refresh, profile, admin/editor links, and sign-out are keyboard operable. | Header buttons and menu items keep visible focus on dark backgrounds. | Title, subtitle, nav buttons, and menu affordances remain readable in dark mode. | Verified | Current contract is local adapter `LearnerShellAdapter` pending GDS issue #80. |
| Course card | Primary/secondary CTAs, links, and any embedded notices remain keyboard reachable. | Card actions, helper content, and badge/metadata affordances show visible focus where interactive. | Product card content, progress helper, and alerts remain readable with governed tokens. | Verified | PublicProductCard mapping preserves existing learner actions while moving layout to GDS. |

## Required Surfaces

- `Admin shell`
- `Editor shell`
- `Learner header`
- `Course card`

## Checklist

- Keyboard-only navigation completed for each required surface.
- Visible focus confirmed on primary and secondary actions.
- Dark-shell contrast/readability confirmed for text, controls, and helper content.
- Follow-up work is documented if a surface remains adapter-based or blocked upstream.
