# Course Package Format

The active Amanoba course package, import, seed, quiz, short-course, and certificate rules are maintained in:

- `docs/product/COURSE_CREATION_PLAYBOOK.md`

This file exists because the admin import API references `docs/COURSE_PACKAGE_FORMAT.md` as the package-format entrypoint.

## Quiz governance (package v2)

- **Authority**: `course.lessonQuizPolicy` is the canonical quiz-behavior block for import and export.
- **Compatibility**: `course.quizMaxWrongAllowed`, `course.defaultLessonQuizQuestionCount`, and `lessons[].quizConfig` may appear in older packages but are not authoritative for runtime behavior.
- **Export marker**: exports may include top-level `quizGovernance.authority = "course.lessonQuizPolicy"` and `quizGovernance.lessonQuizConfigRole = "compatibility-only"`.

Update the playbook when the course package contract changes.

