# Language Expansion Guide

This guide captures the lessons learned while introducing Russian to Amanoba and serves as the single source of truth for adding new locales.

## 1. Translation assets
1. Add `messages/{locale}.json` with the same key structure as existing files (`hu`, `en`).
2. Seed the file into MongoDB by running `npx tsx --env-file=.env.local scripts/seed-translations-direct.ts`. This script now honors `DB_NAME` and uses the unique `(locale, key)` index.
3. Keep the JSON file up to date with every UI change (buttons, labels, errors). When touching UI, reference this guide and remember to update both the JSON and MongoDB versions.

## 2. Locale configuration
1. Add the locale code to `i18n.ts` (`locales` array) and `supportedCourseLocales` if you create a helper.
2. Any middleware, helper, or guard that routes by locale must use `getLocaleForLanguage` (see `app/lib/locale-utils.ts`).
3. Update `LocaleLink` usage only when you need to override the locale; default links should flow through `LocaleLink` automatically.

## 3. Course data & seeds
1. Create or extend seed scripts (e.g., `scripts/seed-b2b-sales-ru.ts`) to populate courses/lessons/quiz questions for the new language.
2. Always load `DB_NAME` when connecting to MongoDB, otherwise you fall back to `test`. (Same bug we fixed earlier.)
3. If a course needs language-specific lessons, ensure `Lesson.language`, `QuizQuestion.lessonId`, and `Course.language` are set correctly.
4. Record the new curriculum in `docs/` for content writers and share with the learning squad.

## 4. UI & routing
1. When a user lands on a course page, run the helper to determine the locale from `course.language` (`getLocaleForLanguage`) and redirect if needed.
2. Render the flag, label, and CTA to match the course language so students feel they are on the correct locale.
3. Table of Contents, lessons, and quizzes should load via the `/api/courses/{courseId}/lessons` and `/api/games/quizzz/questions` endpoints irrespective of URL prefix; rely on `courseId` not locale.

## 5. Documentation & communication
1. Mention this guide in `docs/ENVIRONMENT_SETUP.md` and any task-specific docs so future work references it.
2. Use this guide when writing new content, editing seeds, or changing locale logic.
3. Treat this guide like part of the architecture — whenever you touch localization, cross-link back here.

> Remember: new language work is meaningful only when translations + seeds + UI + routing + docs stay in sync. Use this guide to avoid bilingual gaps.
