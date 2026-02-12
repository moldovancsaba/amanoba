# Prompt for Next Context Window

Use this exact prompt in the next window:

```
Continue Amanoba development from the latest handover.

Mandatory read order:
1) docs/core/amanoba_codex_brain_dump.md
2) docs/core/agent_working_loop_canonical_operating_document.md
3) docs/handoff/HANDOFF_CONTEXT_WINDOW_2026-02-12.md
4) docs/core/DOCS_INDEX.md
5) docs/product/TASKLIST.md
6) docs/product/RELEASE_NOTES.md (top sections)

Then execute:
- git status
- npm run build
- npm run docs:check

Current context:
- docs were normalized into domain folders.
- course-content docs were moved to /Users/moldovancsaba/Projects/amanoba_courses/process_them.
- active docs currently have zero broken markdown links.
- archive docs currently have zero broken markdown links with DOCS_CHECK_INCLUDE_ARCHIVE=1 (strict external disabled).
- docs link checker exists at scripts/docs/check-doc-links.mjs and is wired into docs:check + CI.
- ROADMAP/TASKLIST/RELEASE_NOTES were realigned in v2.9.48.
- Course import supports question mode on update: add missing-only vs overwrite.
- Build currently passes after stabilizing CookieConsentBanner hook order, achievement criteria typing, and email localization locale-map typing.

Your tasks:
1) verify build + docs integrity still pass,
2) continue pending product/documentation cleanup from TASKLIST,
3) keep ROADMAP/TASKLIST/RELEASE_NOTES aligned,
4) update handover docs again before ending.

Rules:
- no placeholders,
- documentation = code,
- if uncertain, ask before assuming.
```
