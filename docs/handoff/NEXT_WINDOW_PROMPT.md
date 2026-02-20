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
- Lesson quiz UI/runtime hotfix landed: course default question count is now preferred at runtime; required-quiz message no longer hardcodes 5/5; messages/*.json were updated to use {{count}} placeholders.
- Context window was ~82% consumed at handover; continue immediately with the new P2 tasklist track: "Lesson quiz governance centralization (course-level only)".

Your tasks:
1) verify build + docs integrity still pass,
2) implement P2 quiz-governance centralization from TASKLIST (course-level single source of truth),
3) remove lesson-level behavior authority in admin/editor/runtime (keep lesson question-content management),
4) align import/export/package+docs with the new governance model,
5) keep ROADMAP/TASKLIST/RELEASE_NOTES aligned,
6) update handover docs again before ending.

Priority execution order for this migration track (concrete next tasks):
1) TASKLIST P2 #2: add canonical course-level quiz policy fields + validation bounds and wire resolver fallback.
2) TASKLIST P2 #3: switch learner runtime to course-policy-only authority.
3) TASKLIST P2 #4 + #5: remove lesson-level behavior controls and retire apply-quiz-defaults dependency path.
4) TASKLIST P2 #6: update import/export/package behavior ownership rules (`lessons[].quizConfig` no longer authoritative).
5) TASKLIST P2 #7 + #8: align seed scripts and question validators with course policy.
6) TASKLIST P2 #9: add migration/backfill with conflict reporting.
7) TASKLIST P2 #10: update architecture/package/quality docs and release notes in same PR.

Rules:
- no placeholders,
- documentation = code,
- if uncertain, ask before assuming.
```
