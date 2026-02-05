# ARCHITECTURAL FIXES REQUIRED - STRONG, SIMPLE, ROCK-SOLID

**Date**: 2026-01-24  
**Philosophy**: Trust the architecture. Remove unnecessary complexity.  
**Principle**: Card links enforce URL locale = course language pairing

---

## ISSUES IDENTIFIED

### Issue 1: UNNECESSARY REDIRECTS (6 instances)
**Problem**: Redirect logic that assumes URL locale might differ from course language  
**Reality**: Card links guarantee locale WILL match course language  
**Risk**: Infinite loops, wasted computation, code complexity

#### Locations to Fix:
1. `app/[locale]/courses/[courseId]/page.tsx` - Line ~159
   - Redirect: `router.replace(`/${normalized}/courses/${cid}`)`
   - Status: ❌ REMOVE

2. `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx` - Line ~102
   - Redirect: `router.replace(`/${normalized}/courses/${cid}/day/${day}`)`
   - Status: ❌ REMOVE

3. `app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx` - Lines ~120, ~180, ~240
   - Redirect: `router.replace(`/${normalized}/courses/${cid}/day/${day}/quiz`)`
   - Redirect: `router.replace(`/${courseLocale}/courses/${courseId}/day/${dayNumber}?quiz=passed`)`
   - Redirect: `router.replace(`/${courseLocale}/courses/${courseId}/day/${dayNumber}?quizRetry=1`)`
   - Status: ❌ REMOVE (first one), ⚠️ REVIEW (others - might be valid for flow)

4. `app/[locale]/courses/[courseId]/final-exam/page.tsx` - Line ~110
   - Redirect: `router.replace(`/${normalized}/courses/${courseId}/final-exam`)`
   - Status: ❌ REMOVE

### Issue 2: UNNECESSARY COURSE LANGUAGE EXTRACTION (4 instances)
**Problem**: Extracting courseLanguage from API when we can trust URL locale  
**Reality**: URL locale IS the course language (by design)  
**Risk**: Extra state, extra complexity, potential mismatches

#### Locations to Fix:
1. `app/[locale]/courses/[courseId]/page.tsx`
   - Extract: `courseLanguage` from course data
   - Use: `useCourseTranslations(courseLanguage, locale)`
   - Status: ❌ SIMPLIFY to use `locale` directly

2. `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx`
   - Extract: `courseLanguage` from lesson data
   - Use: `useCourseTranslations(courseLanguage, locale)`
   - Status: ❌ SIMPLIFY to use `locale` directly

3. `app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx`
   - Extract: `courseLanguage` from lesson data
   - Use: `useCourseTranslations(courseLanguage, locale)`
   - Status: ❌ SIMPLIFY to use `locale` directly

4. `app/[locale]/courses/[courseId]/final-exam/page.tsx`
   - Extract: `courseLanguage` from data
   - Use: `useCourseTranslations(courseLanguage, locale)`
   - Status: ❌ SIMPLIFY to use `locale` directly

---

## FIX PLAN

### Phase 1: Remove Unnecessary Redirects (30 minutes)

For each location:

**Before:**
```typescript
if (courseData.language) {
  setCourseLanguage(courseData.language);
  const normalized = courseData.language.toLowerCase().split(/[-_]/)[0];
  if (normalized && normalized !== locale) {
    router.replace(`/${normalized}/courses/${cid}`);
  }
}
```

**After:**
```typescript
// Trust the architecture: card links guarantee locale = course language
// No redirect needed
```

### Phase 2: Simplify Translations (1 hour)

For each location:

**Before:**
```typescript
const [courseLanguage, setCourseLanguage] = useState<string | undefined>(undefined);
const { t, tCommon, courseLocale, loading: translationsLoading } = 
  useCourseTranslations(courseLanguage, locale);

// ... in fetch ...
if (data.courseLanguage) {
  setCourseLanguage(data.courseLanguage);
}
```

**After:**
```typescript
// Use URL locale directly (guaranteed to be course language by design)
const { t, tCommon, loading: translationsLoading } = useTranslations();
// courseLocale = locale (they're the same by architecture)
```

### Phase 3: Search for Other Issues (30 minutes)

Commands to run:
```bash
# Find all courseLanguage usage
grep -r "courseLanguage" app/[locale]/courses --include="*.tsx"

# Find all unnecessary redirects
grep -r "router.replace" app/[locale] --include="*.tsx"

# Find all useCourseTranslations usage
grep -r "useCourseTranslations" app/[locale] --include="*.tsx"
```

---

## FIXED PAGES CHECKLIST

- [ ] Phase 1, Step 1: Course discovery cards - COMPLETE ✅
- [ ] Phase 2, Step 1: Remove redirects from `[courseId]/page.tsx`
- [ ] Phase 2, Step 2: Remove redirects from `[dayNumber]/page.tsx`
- [ ] Phase 2, Step 3: Review redirects in `[dayNumber]/quiz/page.tsx`
- [ ] Phase 2, Step 4: Remove redirects from `final-exam/page.tsx`
- [ ] Phase 3, Step 1: Simplify translations in `[courseId]/page.tsx`
- [ ] Phase 3, Step 2: Simplify translations in `[dayNumber]/page.tsx`
- [ ] Phase 3, Step 3: Simplify translations in `[dayNumber]/quiz/page.tsx`
- [ ] Phase 3, Step 4: Simplify translations in `final-exam/page.tsx`
- [ ] Phase 4: Search for and fix similar issues elsewhere

---

## VERIFICATION AFTER FIXES

- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Test on all 11 locales:
  - [ ] /hu/courses - Hungarian
  - [ ] /en/courses - English
  - [ ] /ar/courses - Arabic (RTL)
  - [ ] /tr/courses - Turkish
  - [ ] /bg/courses - Bulgarian
  - [ ] /pl/courses - Polish
  - [ ] /vi/courses - Vietnamese
  - [ ] /id/courses - Indonesian
  - [ ] /pt/courses - Portuguese
  - [ ] /hi/courses - Hindi
  - [ ] /ru/courses - Russian

---

## PRINCIPLE TO REMEMBER

**Card Link Architecture**:
```
Discovery Page
  ↓
Course Card: <LocaleLink href={`/${course.language}/courses/${course.courseId}`}>
  ↓
URL: /{courseLanguage}/courses/{courseId}
  ↓
Page loads with:
  - URL locale: courseLanguage ✅
  - Assumption: locale === course.language
  - Action: Use locale directly, trust it
  ↓
Result: No redirects, no complexity, ROCK-SOLID
```

**Trust This**. Remove complexity that assumes it might be different.

---

**Status**: Ready for execution  
**Time Estimate**: 2 hours total  
**Risk Level**: LOW (we're removing code, not adding)
