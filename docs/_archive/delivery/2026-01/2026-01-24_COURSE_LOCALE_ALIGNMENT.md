# Course Locale Alignment (URL = Course Language)

**Date**: 2026-01-24  
**Status**: 🟡 IN PROGRESS  
**Priority**: HIGH  
**Owner**: AI Developer  
**Related**: `docs/TASKLIST.md`

---

## Goal

Ensure every course page uses the course’s own language as the URL locale and UI language. No Arabic course should render under `/en` or `/hu`; the URL, layout direction, and UI strings must align to the course language.

---

## Requirements

1. **URL locale must match course.language**
   - If course.language is `ar`, routes must be under `/ar/...`.
2. **UI translations must use course.language**
   - All labels and UI text on course pages should render in that language.
3. **No mixed-language pages**
   - Course content + UI chrome must align to the same language.
4. **Safe redirects**
   - If a user visits `/hu/courses/PRODUCTIVITY_2026_AR`, redirect to `/ar/courses/PRODUCTIVITY_2026_AR`.

---

## Implementation Plan (High Level)

1. **Routing enforcement**
   - Detect course language on course routes.
   - Redirect mismatched locale to correct locale.
2. **UI translation source**
   - Use course.language for `next-intl` translations on course pages.
3. **Locale availability**
   - Ensure all supported course languages exist in routing and translation files.
4. **Testing**
   - Verify all course routes redirect correctly and UI text matches course language.

---

## Progress Update (2026-01-24)

### ✅ Implemented
- **Locale enforcement**: Course detail layout redirects mismatched locales to `course.language` URL.
- **Client safety net**: Course detail page redirects if the fetched course language differs from the current URL locale.
- **Link alignment**: Course list + my-courses links now point to the course’s language locale.
- **Course-localized translations**: Course pages use `useCourseTranslations(courseLanguage)` instead of URL locale.
- **No wrong-language fallbacks**: Removed automatic fallback to Hungarian/English for course locales to avoid mixed-language UI.
- **RTL direction**: Locale layout sets `dir=rtl` for Arabic to ensure right-to-left page flow.
- **Stability hardening**: Course layout now uses a local locale list to avoid server bundle import gaps.
- **Translation API**: Added `/api/translations` to merge DB translations with locale JSON per locale.
- **Locale list expanded**: Routing now accepts all active course locales.

### ✅ Completed
- **UI translation coverage**: Course-specific UI strings provided for all active locales (ar, ru, hi, id, pt, vi, tr, bg, pl) in JSON.

---

## Success Criteria

- Visiting any course with mismatched locale auto-redirects to the correct language URL.
- Course pages render UI labels in the same language as the course content.
- No regression in `/[locale]/courses/*` or `/[locale]/my-courses` flows.
