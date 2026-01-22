# Language Expansion Guide

**Purpose**

Document the precise checklist for introducing a new locale (language) to Amanoba. This guide keeps the system consistent, prevents missing translations, and ensures every launch is traceable.

## 1. Declare the locale

1. Add the language code to `locales` in `i18n.ts` and to `supportedCourseLocales` in `app/lib/locale-utils.ts`.
2. Create a translation file under `messages/{locale}.json` and populate the `common`, `courses`, and `auth` buckets at a minimum. Keep keys in sync with the default `hu` set.
3. Update `localeFlags`, `localeLabels`, and the language switcher (`components/LanguageSwitcher.tsx`) so the new locale appears in the dropdown and the flag renders consistently.
4. Document the new locale in this guide and link to it from `docs/I18N_SETUP.md` and `docs/ARCHITECTURE.md`.

## 2. Seed language-specific data

1. Seed course metadata: create or update the `Course` record with `courseId`, `language`, `metadata.locale`, and `points/xp` configs. Attach `parentCourseId` if the course is a fork.
2. Seed lessons: ensure each `Lesson` uses a unique `lessonId` (`{courseId}_DAY_{day}`), the right `language`, `duration`, `quizConfig`, and metadata tags (e.g. `['b2b', 'sales', 'ru']`).
3. Seed quizzes: `QuizQuestion.lessonId` must match the lesson’s `lessonId`. Use `isCourseSpecific: true` so the question pool is isolated.
4. Keep the seed script in `scripts/` and re-run it whenever content is updated (use `npx tsx --env-file=.env.local scripts/your-script.ts`).


## 3. Update UI and routes

1. Ensure the catalog/landing pages link to `/{locale}/courses/{courseId}` for the new locale. The existing catalog uses `localeFromLanguage()`—extend its map if needed.
2. Confirm `CourseDetailPage` (`app/[locale]/courses/[courseId]/page.tsx`) still redirects users whose chosen locale does not match `course.language` via `getLocaleForLanguage`.
3. Verify the table of contents and UI lumps (day counts, quiz statuses, badges) use translation keys such as `courses.dayOf`, `courses.daysCompleted`, `courses.goToDay`, and `courses.tableOfContents`. Missing keys will show the raw identifier.
4. Double-check the `LocaleLink` wrapper so new locale routes stay grounded (e.g. the Russian course card already sets `/ru/courses/...`).

## 4. Validation checklist

- [ ] Route `/api/courses?status=active` returns the new `courseId`.
- [ ] `/api/courses/{courseId}` returns `language` and `price`/`points` data.
- [ ] `/api/courses/{courseId}/lessons` returns active lessons (table of contents no longer shows the spinner).
- [ ] Lesson quiz pool triggers the `successThreshold` and `questionCount` set for the locale.
- [ ] The landing page or catalog is accessible at `/en`, `/ru`, etc, and translations show for both `common` and `courses` namespaces.
- [ ] Lesson emails (if you seed them) include the locale-specific subject/body.

## 5. Communication

- Log the completed steps in `TASKLIST.md` under a language-launch section.
- Reference this guide anytime you add a locale so every engineer knows where to start.
- When writing release notes, mention the new locale and highlight any outstanding content gaps (lessons, certs, etc.).

Happy multilingual building! 🚀
