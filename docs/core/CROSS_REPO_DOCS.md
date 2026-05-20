# Cross-Repo Documentation References

**Last updated**: 2026-05-20

This document defines the portable reference contract for Amanoba docs that depend on course-authoring assets from the separate `amanoba_courses` workspace.

## Canonical notation

Use repo-relative notation in active Amanoba docs:

```text
amanoba_courses:process_them/docs/<path-from-docs-root>
```

Examples:

- `amanoba_courses:process_them/docs/COURSE_BUILDING_RULES.md`
- `amanoba_courses:process_them/docs/2026_course_quality_prompt.md`
- `amanoba_courses:process_them/docs/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`

## Local checkout

On the primary development machine, those references currently resolve to:

```text
/Users/moldovancsaba/Projects/amanoba_courses/process_them/docs/<path-from-docs-root>
```

Do not add new machine-local absolute paths to active docs. If a local path is useful during an investigation, include the canonical `amanoba_courses:` reference first and treat the local path as an optional note.

## Authority split

- `amanoba/docs` is the source of truth for platform, app runtime, architecture, deployment, and product release documentation.
- `amanoba_courses:process_them/docs` is the source of truth for course-content authoring, course-quality prompts, quiz-quality pipeline rules, and course package references.
- If the same rule exists in both repos, prefer the repo that owns the rule above and update the other reference to point there.

## Migration policy

- New active docs must use canonical notation.
- Existing active docs should be updated opportunistically when touched.
- Historical docs under `docs/_archive` may keep original absolute paths for auditability.
