# P0: Course catalog language integrity — implementation

**Date**: 2026-01-28  
**Scope**: ROADMAP § Global audit — communication + catalog language integrity

---

## Done

### 1. Course name/description by locale (catalog)

- **Helper** `app/lib/utils/course-i18n.ts`:
  - `resolveCourseNameForLocale(course, locale)` — uses `course.translations[locale]?.name ?? course.name`
  - `resolveCourseDescriptionForLocale(course, locale)` — uses `course.translations[locale]?.description ?? course.description`
  - Supports `translations` as `Map` (Mongoose) or plain `Record` (JSON/lean).

- **APIs** now accept optional `locale` (query or player.locale) and return resolved name/description:
  - **GET /api/courses** — `?locale=hu` (or en, ar, …); when set, selects `translations` and returns resolved name/description; `translations` omitted from response.
  - **GET /api/courses/[courseId]** — `?locale=hu`; same behaviour.
  - **GET /api/courses/recommendations** — `?locale=...` or player.locale; resolves name/description for each recommended course.
  - **GET /api/my-courses** — `?locale=...` or player.locale; populates course with `translations` when locale set and returns resolved name/description for each course.

- **Frontend** passes current locale when fetching courses:
  - Dashboard: recommendations `?limit=3&locale=${locale}`.
  - Courses catalog: `?status=active&locale=${locale}`.
  - Course detail: `?locale=${locale}`.
  - My courses: `?locale=${locale}`.

Result: Catalog (dashboard, courses list, course detail, my-courses) shows course name and description in the user’s locale when `course.translations[locale]` exists; otherwise fallback to `course.name` / `course.description`.

---

## Email audit and transactional emails (P0) — done

- **Code-level email audit**: Done. All send paths use `emailLocale`; lesson and payment had localized unsubscribe footers; **reminder email** now appends the same localized lesson unsubscribe footer. See `docs/_archive/delivery/2026-01/2026-01-28_P0_EMAIL_AUDIT.md`.
- **Transactional emails**: Welcome, completion, reminder, payment use `email-localization.ts` (getLocaleStrings, render* by locale) and `ensureEmailLanguageIntegrity`; exempt strings and locales audited — no gaps.
- **Gate on language integrity**: All five send paths (lesson, welcome, completion, reminder, payment) call `ensureEmailLanguageIntegrity` before send; failures block and are logged.

---

## Files touched

- `app/lib/utils/course-i18n.ts` (new)
- `app/api/courses/route.ts`
- `app/api/courses/[courseId]/route.ts`
- `app/api/courses/recommendations/route.ts`
- `app/api/my-courses/route.ts`
- `app/[locale]/dashboard/page.tsx`
- `app/[locale]/courses/page.tsx`
- `app/[locale]/courses/[courseId]/page.tsx`
- `app/[locale]/my-courses/page.tsx`
