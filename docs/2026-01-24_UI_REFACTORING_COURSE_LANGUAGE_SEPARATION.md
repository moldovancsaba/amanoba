# 2026-01-24_UI_REFACTORING_COURSE_LANGUAGE_SEPARATION.md

## UI REFACTORING: 100% COURSE LANGUAGE SEPARATION

**Date**: 2026-01-24  
**Status**: 🟢 ACTIVE - Ready to Deliver  
**Priority**: P0 (Critical for localization requirement)  
**Timeline**: 4-6 hours (4 core components)

---

## CRITICAL REQUIREMENT

**When a user is on a course page:**

```
URL: https://www.amanoba.com/hu/courses/PRODUCTIVITY_2026_HU

MUST SEE:
✅ Header: 100% Hungarian
✅ Course title: 100% Hungarian
✅ Course description: 100% Hungarian
✅ Buttons: 100% Hungarian
✅ Loading messages: 100% Hungarian
✅ All text: 100% Hungarian

MUST NOT SEE:
❌ English text
❌ Russian text
❌ Arabic text
❌ Any language other than Hungarian
❌ Fallback language text
```

---

## WHAT'S ALREADY DONE ✅

From Architecture Fix:
- ✅ Discovery page filters by language
- ✅ API supports language filtering
- ✅ Database structure is correct
- ✅ Course model supports language field
- ✅ 11/11 locales verified working

---

## WHAT NEEDS UI REFACTORING

| Component | Current | Target | Status |
|-----------|---------|--------|--------|
| **Course Cards** | Show URL locale language | Show course native language | 🔴 TODO |
| **Course Detail Page** | Already correct | Verify 100% language | 🟡 VERIFY |
| **Course Content Pages** | Mixed language possible | 100% course language enforced | 🔴 TODO |
| **Admin Course Management** | Not language-aware | Language-specific management | 🔴 TODO |
| **Discovery Header/UI** | Generic text | Language-aware UI | 🟡 PARTIAL |

---

## PHASE 1: Course Cards Refactoring (Discovery Page)

**File**: `app/[locale]/courses/page.tsx`  
**Time**: 1-1.5 hours  
**Status**: 🟢 READY TO START

### Current Issue

```javascript
// Currently shows courses but cards are in URL locale
// /hu/courses shows Hungarian UI
// But if user is on /en/courses with a Hungarian course
// The card shows English buttons + Hungarian title = MIXED

// Current card rendering:
<LocaleLink
  href={`/${course.language}/courses/${course.courseId}`}
  // ☝️ Correct (uses course language in URL)
>
  {/* Card content below uses t('viewCourse') which is URL locale! */}
  <div className="bg-brand-accent text-brand-black px-5 py-3 rounded-lg">
    {t('viewCourse')} →  {/* ❌ WRONG: Uses URL locale translator */}
  </div>
</LocaleLink>
```

### Solution

Use `course.language` for all card translations, NOT URL locale:

```javascript
// Get translations for COURSE language, not URL language
const getCourseTranslations = (courseLanguage: string) => {
  // Map course language to i18n locale
  const localeMap: Record<string, string> = {
    'hu': 'hu', 'en': 'en', 'tr': 'tr', 'bg': 'bg',
    'pl': 'pl', 'vi': 'vi', 'id': 'id', 'ar': 'ar',
    'pt': 'pt', 'hi': 'hi', 'ru': 'ru',
  };
  return localeMap[courseLanguage] || 'en';
};

// In card rendering:
const courseLocale = getCourseTranslations(course.language);

<LocaleLink
  href={`/${course.language}/courses/${course.courseId}`}
>
  {/* Now use courseLocale for ALL card translations */}
  <div className="bg-brand-accent text-brand-black px-5 py-3">
    {t('viewCourse', { locale: courseLocale })} →
  </div>
</LocaleLink>
```

### Changes Required

1. **Import translations utility** ✅
2. **Create getTranslationLocale function** ✅
3. **Update course card button text** ✅
4. **Update course card labels (Premium/Free/Certification)** ✅
5. **Update search placeholder** ✅
6. **Verify no URL locale text on cards** ✅

### Testing

- [ ] Visit `/hu/courses` → all cards in Hungarian
- [ ] Visit `/en/courses` → all cards in English
- [ ] Visit `/ar/courses` → all cards in Arabic + RTL
- [ ] Click card → goes to correct course language URL

---

## PHASE 2: Course Detail Page Verification (Already Done?)

**File**: `app/[locale]/courses/[courseId]/page.tsx`  
**Time**: 30 minutes (verification only)  
**Status**: 🟡 VERIFY IF WORKING

### Current Code Review

The file already has:
```javascript
// Line 105: Uses course language for translations
const { t, tCommon, courseLocale, loading: translationsLoading } = 
  useCourseTranslations(courseLanguage, locale);

// Line 425: RTL support for Arabic
<div className="min-h-screen bg-brand-black" dir={courseLocale === 'ar' ? 'rtl' : 'ltr'}>

// Line 159: Redirects to course language if URL is wrong
if (normalized && normalized !== locale) {
  router.replace(`/${normalized}/courses/${cid}`);
}
```

### Verification Checklist

- [ ] Load course in Hungarian → 100% Hungarian UI
- [ ] Load course in English → 100% English UI
- [ ] Load course in Arabic → 100% Arabic UI + RTL
- [ ] Try accessing with wrong locale → redirects correctly
- [ ] All buttons in correct language
- [ ] All loading messages in correct language
- [ ] No English fallback text

### If Issues Found

Create separate document: `2026-01-24_COURSE_DETAIL_PAGE_FIXES.md`

---

## PHASE 3: Course Content Pages (Day Pages)

**Files**: `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx`  
**Time**: 1.5-2 hours  
**Status**: 🔴 TODO

### Requirements

User views `/hu/courses/PRODUCTIVITY_2026_HU/day/1`

**MUST BE 100% HUNGARIAN:**
- ✅ Lesson title: Hungarian
- ✅ Lesson content: Hungarian
- ✅ Quiz questions: Hungarian
- ✅ Answer options: Hungarian
- ✅ Navigation buttons: Hungarian
- ✅ Loading messages: Hungarian
- ✅ Error messages: Hungarian
- ✅ Progress indicators: Hungarian

**MUST NOT:**
- ❌ Show English text
- ❌ Show Russian text
- ❌ Fall back to other language
- ❌ Mix languages

### Implementation Strategy

1. **Get course language early**
   - Load course data in component
   - Extract `course.language`
   - Pass to all sub-components

2. **Use course language for all translations**
   - Not URL locale
   - Not user preference
   - Course language ONLY

3. **No fallbacks allowed**
   - If translation missing → show key (not English)
   - Never fall back to English
   - Strictly enforce course language

4. **Lessons must be in course language**
   - Query lessons with: `language: course.language`
   - Lesson content already in database with language
   - Just use it correctly

### Code Example

```javascript
export default function CourseDayPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch course FIRST
      const course = await fetchCourse(courseId);
      setCourse(course);

      // 2. Use course.language for lesson query
      if (course) {
        const lesson = await fetchLesson(courseId, dayNumber, course.language);
        setLesson(lesson);
      }

      // 3. Use course.language for ALL translations
      const courseLocale = mapLanguageToLocale(course.language);
      // Pass courseLocale to useCourseTranslations or similar
    };
  }, [courseId, dayNumber]);

  // Render with course language enforced throughout
  return (
    <div dir={course?.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* All content in course language */}
    </div>
  );
}
```

### Testing

- [ ] Hungarian course day page: 100% Hungarian
- [ ] English course day page: 100% English
- [ ] Arabic course day page: 100% Arabic + RTL
- [ ] Quiz in Hungarian: all questions Hungarian
- [ ] Quiz in English: all questions English
- [ ] No language mixing on page

---

## PHASE 4: Admin Course Management

**Files**: `app/[locale]/admin/courses/[courseId]/page.tsx`  
**Time**: 1-1.5 hours  
**Status**: 🔴 TODO

### Requirements

Admin editing a course must:
- ✅ See course language clearly
- ✅ Not be able to mix languages
- ✅ Not accidentally edit wrong language version
- ✅ Manage each language course independently
- ✅ See which language variant they're editing

### Implementation

1. **Display course language prominently**
   - Show language badge/flag
   - Show in page title: "Edit Course - Hungarian (HU)"
   - Show in form labels

2. **Prevent language mixing**
   - Lock language field (read-only)
   - Can't change course language
   - Must create separate course for other language

3. **Language-specific field editing**
   - When editing PRODUCTIVITY_2026_HU
   - Only fields for Hungarian content
   - Can't access English content from here

4. **Clear warnings**
   - "You are editing the Hungarian version"
   - "To edit English version, go to PRODUCTIVITY_2026_EN"
   - Show language in breadcrumb

### Code Example

```javascript
// Admin course edit page
<div className="bg-blue-100 border border-blue-400 p-4 rounded mb-6">
  <div className="flex items-center gap-3">
    <span className="text-3xl">{getLanguageFlag(course.language)}</span>
    <div>
      <h3 className="font-bold text-lg">
        Editing: {course.name}
      </h3>
      <p className="text-sm text-gray-700">
        Language: {getLanguageName(course.language)} ({course.language.toUpperCase()})
      </p>
      <p className="text-xs text-gray-600">
        Course ID: {course.courseId} 
      </p>
    </div>
  </div>
</div>

{/* Form fields */}
<div>
  <label>Course Language</label>
  <input 
    value={course.language} 
    disabled={true}
    className="bg-gray-100 cursor-not-allowed"
  />
  <p className="text-sm text-gray-600">
    Language cannot be changed. To edit another language, 
    select it from the course list.
  </p>
</div>

{/* All other fields in course language */}
```

### Testing

- [ ] Admin sees course language clearly
- [ ] Can't change language
- [ ] Form fields for correct language only
- [ ] Warnings visible
- [ ] Each language version managed separately

---

## PHASE 5: Cross-Language Navigation & Consistency

**Files**: Multiple page transitions  
**Time**: 30-45 minutes  
**Status**: 🟡 PARTIAL

### Current Issues

1. **No way to see related courses in other languages**
   - User on Hungarian course can't switch to English version
   - No "Available in other languages" section

2. **No multi-language filter on discovery**
   - Can only see one language at a time
   - "Show Hungarian + English courses" not possible

### Solutions (Priority: Medium)

**Optional Enhancement 1: Language Switcher on Course Page**
```javascript
// On course detail page, show:
// "This course available in: 🇭🇺 🇬🇧 🇷🇺"
// Click to switch between language versions

const relatedCourses = await Course.find({
  baseCourseTopic: course.baseCourseTopic,
  language: { $ne: course.language }
});
```

**Optional Enhancement 2: Multi-Language Filter**
```javascript
// On discovery page: "Show courses in: Hungarian, English, Russian"
// API call: ?languages=hu,en,ru
```

---

## VERIFICATION & TESTING CHECKLIST

### Per Component

**Discovery Page:**
- [ ] `/hu/courses` shows only Hungarian courses
- [ ] `/en/courses` shows only English courses
- [ ] Course cards show in course language
- [ ] Buttons in course language
- [ ] Search placeholder in page locale (URL locale)
- [ ] No mixing of languages

**Course Detail Page:**
- [ ] Course title in course language
- [ ] Description in course language
- [ ] All buttons in course language
- [ ] Redirects to course language if wrong locale
- [ ] RTL for Arabic

**Course Day Page:**
- [ ] Lesson title in course language
- [ ] Lesson content in course language
- [ ] Quiz questions in course language
- [ ] Answers in course language
- [ ] All UI elements in course language
- [ ] No fallback to English

**Admin Pages:**
- [ ] Course language visible
- [ ] Language field locked
- [ ] Form in course language
- [ ] No cross-language mixing
- [ ] Clear warnings displayed

### Cross-Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Language Testing

- [ ] Hungarian (HU)
- [ ] English (EN)
- [ ] Turkish (TR)
- [ ] Bulgarian (BG)
- [ ] Polish (PL)
- [ ] Vietnamese (VI)
- [ ] Indonesian (ID)
- [ ] Arabic (AR) - with RTL
- [ ] Portuguese (PT)
- [ ] Hindi (HI)
- [ ] Russian (RU)

---

## DEPLOYMENT SAFETY

### Pre-Deployment Checklist

- [ ] All code changes complete
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No warnings
- [ ] All tests passing
- [ ] Manual testing complete on all 11 locales
- [ ] No language mixing confirmed
- [ ] Rollback plan documented

### Rollback Plan

**Baseline**: Commit before UI refactoring  
**Revert**: `git revert [commit]`  
**Verification**: Build succeeds, tests pass  
**Time to rollback**: <5 minutes

### Deployment Process

1. **Staging Deployment**
   - Deploy to staging
   - Manual testing all 11 locales
   - Verify no language mixing
   - Check performance
   - Get sign-off

2. **Production Deployment**
   - Deploy during low-traffic period
   - Monitor logs for errors
   - Monitor user reports
   - Verify functionality

---

## PROGRESS TRACKING

| Phase | Component | Status | Time | Commits |
|-------|-----------|--------|------|---------|
| 1 | Course Cards | ⏳ TODO | 1h | 0 |
| 2 | Course Detail | 🟡 VERIFY | 0.5h | 0 |
| 3 | Day Pages | ⏳ TODO | 2h | 0 |
| 4 | Admin UI | ⏳ TODO | 1.5h | 0 |
| 5 | Navigation | 🟡 OPTIONAL | 0.5h | 0 |
| **TOTAL** | **All Components** | **🟢 READY** | **5-6h** | **0** |

---

## NEXT STEPS

### Immediately (Now)

- [ ] Review this document
- [ ] Read ARCHITECTURE_GAP_ANALYSIS.md for context
- [ ] Check current code in app/[locale]/courses/page.tsx
- [ ] Identify exact translation issues

### Phase 1 (1-1.5 hours)

- [ ] Fix course cards to use course language
- [ ] Test on all 11 locales
- [ ] Commit changes

### Phase 2 (30 min)

- [ ] Verify course detail page working correctly
- [ ] Fix if needed
- [ ] Commit changes

### Phase 3 (1.5-2 hours)

- [ ] Fix course day pages for 100% language
- [ ] Verify all content in course language
- [ ] Test quizzes in all languages
- [ ] Commit changes

### Phase 4 (1-1.5 hours)

- [ ] Update admin pages for language awareness
- [ ] Add language badges/warnings
- [ ] Lock language field
- [ ] Test all admin functions
- [ ] Commit changes

### Phase 5 (30 min)

- [ ] Cross-language testing
- [ ] All 11 locales verification
- [ ] Performance check

### Final (1 hour)

- [ ] Manual browser testing
- [ ] Deploy to staging
- [ ] Get approval
- [ ] Deploy to production

---

## RULES FOR THIS WORK

✅ **From Agent Operating Document:**
- Safety rollback plan for every delivery
- Error-free, warning-free code
- Documentation = Code
- No placeholders
- Production-grade quality
- Complete ownership

✅ **For UI Refactoring:**
- 100% course language enforcement
- NO language mixing
- NO English fallbacks
- ALL content in course language
- Daily commits
- Clear commit messages

---

**Status**: 🟢 READY TO START  
**Last Updated**: 2026-01-24  
**Next Action**: Begin Phase 1 - Course Cards Refactoring
