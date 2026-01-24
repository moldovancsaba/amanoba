# ⚡ ARCHITECTURE FIX - ACTION CHECKLIST & QUICK START

**Status**: 🔴 CRITICAL - PAUSED quiz work, starting architecture fix  
**Priority**: P0 - Must fix before quiz enhancement can continue

---

## 🚀 IMMEDIATE (Today)

```
[ ] Read: docs/HANDOFF_ARCHITECTURE_FIX_CRITICAL.md (FULL DOCUMENT)
    Time: 20-30 minutes
    Purpose: Understand the gap and fix plan

[ ] Run database audit:
    - Create: scripts/audit-course-structure.ts
    - Purpose: See current database state
    - Output: Report showing course/lesson/quiz structure
    Time: 2-3 hours

[ ] Review current code:
    - app/lib/models/course.ts (course structure)
    - app/[locale]/courses/page.tsx (discovery)
    - app/[locale]/courses/[courseId]/page.tsx (course page)
    Time: 2-3 hours

[ ] Document gap:
    - Create: docs/ARCHITECTURE_GAP_ANALYSIS.md
    - Show: current vs. required structure
    - Show: impact & complexity
    Time: 1-2 hours
```

---

## 📋 PHASE 1: ANALYSIS & PLANNING (Week 1)

**Deliverable**: Complete understanding of current state + detailed change list

```
Day 1-2:
[ ] Audit existing data
[ ] Review current code
[ ] Document gap

Result: Know exactly what needs to change
```

---

## 🛠️ PHASE 2: CODE CHANGES (Week 2-3)

**Deliverable**: Updated code to support language-specific courses

```
Day 3-4:
[ ] Update Course model
    - Add courseLanguage
    - Add baseCourseTopic
    - Add constraints

Day 5-6:
[ ] Update course discovery page
    - Multi-language filtering
    - Language-aware cards
    - User preference for languages

Day 7-8:
[ ] Update course landing page
    - Load correct language course
    - 100% course language
    - No fallbacks

Day 9:
[ ] Update admin management
    - Manage per language
    - Language-specific admin UI
```

---

## 🗄️ PHASE 3: DATABASE MIGRATION (Week 3-4)

**Deliverable**: Database reorganized into language-specific courses

```
Day 10-11:
[ ] Create migration script
    - Splits mixed courses
    - Creates language-specific courses
    - Assigns lessons/quizzes correctly

Day 12:
[ ] Test migration on staging
[ ] Verify language isolation
[ ] Check integrity

Day 13:
[ ] Deploy to production
[ ] Monitor
[ ] Verify
```

---

## ✅ PHASE 4: TESTING (Week 4)

**Deliverable**: Fully tested, working system

```
Day 14-15:
[ ] Functional testing
    - Discovery with filters
    - Course pages in correct language
    - Admin management

Day 16:
[ ] QA testing
    - Visual inspection
    - Content verification
    - Performance check

Day 17:
[ ] Final verification
[ ] Deploy to production if not done
[ ] Monitor
```

---

## 📚 PHASE 5: DOCUMENTATION (Week 4)

**Deliverable**: Updated documentation for new architecture

```
Day 18:
[ ] Update architecture docs
[ ] Update admin guide
[ ] Update developer guide
[ ] Create migration docs

[ ] Create final handoff document
```

---

## 📊 CURRENT STATE SUMMARY

**Database**:
- Mixed-language courses (WRONG)
- Lessons with language codes in ID (HU, EN, AR, etc.)
- Quizzes across all languages mixed

**Code**:
- Course discovery doesn't filter by language properly
- Course pages might show mixed content
- Admin management doesn't separate languages

**Result**: Users might see mixed languages (PROHIBITED)

---

## 🎯 END STATE (After Fix)

**Database**:
- Language-specific courses (CORRECT)
- Each course has only one language
- Clear separation: PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN, etc.

**Code**:
- Discovery page filters by user's selected languages
- Shows course cards in course's native language
- Course pages are 100% single language
- Admin manages each language separately

**Result**: Users get pure language experience (✅ REQUIRED)

---

## 🔗 KEY FILES TO CHANGE

1. `app/lib/models/course.ts` - Add language fields
2. `app/[locale]/courses/page.tsx` - Multi-language filtering
3. `app/[locale]/courses/[courseId]/page.tsx` - Language isolation
4. Admin course management UI - Manage per language
5. Create migration scripts for database

---

## 📝 TOTAL EFFORT

**56 hours spread over ~2 weeks**

- Analysis: 8 hours (Week 1)
- Code changes: 21 hours (Week 2-3)
- Migration: 10 hours (Week 3-4)
- Testing: 12 hours (Week 4)
- Docs: 5 hours (Week 4)

---

## 🚦 STATUS TRACKING

**Architecture Fix**: 🔴 NOT STARTED
**Quiz Enhancement**: 🟡 PAUSED (Resume after architecture fix)

**Milestone 1** (Analysis): ⏳ PENDING
**Milestone 2** (Code Changes): ⏳ PENDING
**Milestone 3** (Migration): ⏳ PENDING
**Milestone 4** (Testing): ⏳ PENDING
**Milestone 5** (Documentation): ⏳ PENDING

---

## ✨ WHAT'S NEXT

1. **TODAY**: Read HANDOFF_ARCHITECTURE_FIX_CRITICAL.md
2. **THIS WEEK**: Audit database + review code + document gap
3. **NEXT WEEK**: Start code changes (Phase 2)
4. **WEEK 3**: Complete code + start migration
5. **WEEK 4**: Finish migration + testing + docs

---

**After architecture fix is complete: Quiz enhancement resumes!**

---

**Document Created**: 2026-01-24  
**Purpose**: Quick reference for architecture fix work  
**Full Plan**: See HANDOFF_ARCHITECTURE_FIX_CRITICAL.md
