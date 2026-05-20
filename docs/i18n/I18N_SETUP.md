# Amanoba i18n Reference

**Last Updated**: 2026-05-20
**Status**: Active

This document is the current reference for Amanoba locale routing, translation files, and language expansion. Historical migration notes are no longer authoritative; the app already runs through the locale-prefixed App Router structure.

---

## Current Locale Set

The supported UI locale source of truth is [`app/lib/i18n/locales.ts`](../../app/lib/i18n/locales.ts).

Active UI locales:

- `hu` Hungarian
- `en` English
- `ar` Arabic
- `hi` Hindi
- `id` Indonesian
- `pt` Portuguese
- `vi` Vietnamese
- `tr` Turkish
- `bg` Bulgarian
- `pl` Polish
- `ru` Russian
- `sw` Swahili
- `zh` Chinese
- `es` Spanish
- `fr` French
- `bn` Bengali
- `ur` Urdu

The repo also contains regional English message files (`messages/en-GB.json`, `messages/en-US.json`) for compatibility. They are translation resources, not currently listed as primary routable locales in `app/lib/i18n/locales.ts`.

## Routing

- `i18n.ts` configures next-intl and the default fallback locale.
- `app/lib/i18n/routing.ts` defines shared routing with `localePrefix: 'always'`.
- `app/lib/i18n/navigation.ts` exports locale-aware `Link`, `usePathname`, `useRouter`, and `redirect`.
- `middleware.ts` uses the shared next-intl routing config and keeps auth handling in the same request path.
- Public routes are locale-prefixed, for example `/en/courses`, `/hu/dashboard`, and `/es/blog`.

Use the shared navigation helpers when building locale-prefixed app links. They prevent double-locale paths such as `/id/en` and preserve the current path when switching languages.

## Translation Files

Primary translation files live in `messages/<locale>.json`. Every primary locale in `app/lib/i18n/locales.ts` should have a matching JSON file with the same namespace shape.

User-facing namespaces include:

- `common`
- `auth`
- `landing`
- `dashboard`
- `courses`
- `games`
- `challenges`
- `quests`
- `achievements`
- `leaderboard`
- `rewards`
- `referral`
- `profile`
- `settings`
- `admin`
- `errors`
- `email`
- `onboarding`
- `consent`

Rule: when a locale is live, UI strings for that locale should be translated rather than left as English placeholders.

## Data And Email Locales

- Course and lesson data support language fields and translation maps in `app/lib/models/course.ts` and `app/lib/models/lesson.ts`.
- Player preference is stored as `player.locale`.
- Course listing and recommendation APIs validate user locale against the supported locale list before resolving localized course text.
- Email templates resolve localized strings through `app/lib/email/email-localization.ts` and fall back safely to English when a locale-specific string is missing.
- Course-language options are maintained in `app/lib/constants/course-languages.ts`.
- Certificate strings are maintained in `app/lib/constants/certificate-strings.ts`.

## Adding A Locale

1. Add the locale code to `app/lib/i18n/locales.ts`.
2. Add `messages/<locale>.json` with the full namespace shape and translated strings.
3. Add the language label in `components/LanguageSwitcher.tsx` and profile language display maps.
4. Add the locale to `app/lib/constants/course-languages.ts` if courses can be authored in that language.
5. Add email and certificate strings where user-facing output exists.
6. Update API locale validation arrays that intentionally mirror the locale list.
7. Run:

```sh
npm run type-check
npm run docs:links:check
```

Use `npm run docs:refresh` and `npm run docs:check` when documentation indexes or generated docs are touched.

## Validation Checklist

- The locale appears in the language switcher.
- `/[locale]` routes render without double-locale redirects.
- `messages/<locale>.json` is valid JSON and has the expected namespaces.
- Course list, course detail, dashboard, profile, admin, email, and certificate strings resolve without missing-key output.
- Public blog/news and sitemap routes include the locale through the shared locale list.
