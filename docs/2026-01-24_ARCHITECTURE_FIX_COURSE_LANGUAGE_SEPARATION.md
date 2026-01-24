# 2026-01-24_ARCHITECTURE_FIX_COURSE_LANGUAGE_SEPARATION.md

## Feature Document: Course Language Separation Architecture Fix

**Date**: 2026-01-24  
**Priority**: P0 (CRITICAL - blocks quiz enhancement)  
**Status**: 🔴 IN PROGRESS  
**Owner**: AI Developer  

---

## EXECUTIVE SUMMARY

**The Problem:**
Platform built with language VARIANTS (one course with multiple language options).
**The Solution:**
Restructure to language SEPARATION (each language = independent course).

**Impact:**
- Database: Restructure ~8 courses into ~80-90 language-specific courses
- Code: Update discovery, navigation, admin management
- Timeline: 2 weeks (56 hours)
- Safety: Full rollback plan for every step

## CRITICAL DISCOVERY - Architecture is Database-Ready!

**AUDIT FINDING**: The database is ALREADY properly structured with language-separated courses!

**What This Means:**
- ✅ Database: Already has 23 language-specific courses
- ✅ Example: PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN, PRODUCTIVITY_2026_AR, etc.
- ❌ CODE: Discovery and navigation code may NOT be respecting this structure
- 🔧 FIX SCOPE: Update code/UI, not database migration

**Revised Plan:**
Instead of splitting courses in database, we need to verify/fix:
1. Course discovery page filters correctly by language
2. Course cards display in course's native language
3. Course landing pages enforce 100% single language
4. Admin management works with language-specific courses

**Phase 2+ Changes Needed:**
- Verify code actually uses language-specific course IDs
- Update discovery to show all courses, user filters by language
- Update routing to enforce language isolation
- Audit UI for any language mixing issues

### PHASE 1: Analysis & Planning (Week 1)
**Duration**: 8 hours  
**Deliverable**: Full understanding of changes needed  

**Step 1.1: Audit Current Database** ✅ COMPLETE
- [x] Created: `scripts/audit-course-structure.ts`
- [x] Purpose: Understand current database state
- [x] Output: Report of course/lesson/quiz structure
- **Status**: ✅ COMPLETE

**AUDIT FINDINGS:**
- ✅ Database is ALREADY properly structured!
- 23 total courses found
- 0 mixed-language courses
- All courses are language-specific (PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN, etc.)
- 12 languages covered
- 443 total lessons, 2,136 quizzes
- **ACTION**: Database structure is CORRECT. Issue is in CODE/UI, not database!

**Step 1.2: Review Current Code** ⏳ PENDING  
- [ ] Review: `app/lib/models/course.ts`
- [ ] Review: `app/[locale]/courses/page.tsx`
- [ ] Review: `app/[locale]/courses/[courseId]/page.tsx`
- **Status**: NOT STARTED

**Step 1.3: Document Gap Analysis** ⏳ PENDING
- [ ] Create: `docs/ARCHITECTURE_GAP_ANALYSIS.md`
- [ ] Document: Current vs. Required structure
- [ ] Document: Impact & complexity
- **Status**: NOT STARTED

### PHASE 2: Code Changes (Week 2-3)
**Duration**: 21 hours  
**Deliverable**: Code ready for new architecture  

**Step 2.1: Update Course Model** ⏳ PENDING
- [ ] Add `courseLanguage` field
- [ ] Add `baseCourseTopic` field
- [ ] Add unique constraint: (baseCourseTopic, courseLanguage)
- **Status**: NOT STARTED

**Step 2.2: Update Course Discovery** ⏳ PENDING
- [ ] Multi-language filtering
- [ ] Language-aware course cards
- [ ] Filter by user-selected languages
- **Status**: NOT STARTED

**Step 2.3: Update Course Page** ⏳ PENDING
- [ ] 100% course language isolation
- [ ] No English fallbacks
- [ ] Strict language enforcement
- **Status**: NOT STARTED

**Step 2.4: Update Admin Management** ⏳ PENDING
- [ ] Manage courses per language
- [ ] Admin can't mix languages
- **Status**: NOT STARTED

### PHASE 3: Database Migration (Week 3-4)
**Duration**: 10 hours  
**Deliverable**: Database restructured  

**Step 3.1: Create Migration Script** ⏳ PENDING
- [ ] Script: `scripts/migrate-courses-to-language-separation.ts`
- [ ] Splits mixed courses into language-specific courses
- **Status**: NOT STARTED

**Step 3.2: Test Migration** ⏳ PENDING
- [ ] Test on staging database
- [ ] Verify language isolation
- [ ] Check referential integrity
- **Status**: NOT STARTED

**Step 3.3: Deploy Migration** ⏳ PENDING
- [ ] Backup production
- [ ] Run migration
- [ ] Verify result
- **Status**: NOT STARTED

### PHASE 4: Testing (Week 4)
**Duration**: 12 hours  
**Deliverable**: Verified working system  

**Step 4.1: Functional Testing** ⏳ PENDING
- [ ] Discovery filtering works
- [ ] Course pages in correct language
- [ ] No mixed languages
- **Status**: NOT STARTED

**Step 4.2: QA Testing** ⏳ PENDING
- [ ] Visual inspection
- [ ] Content verification
- [ ] Performance check
- **Status**: NOT STARTED

**Step 4.3: Verification** ⏳ PENDING
- [ ] Deploy to production (if not done)
- [ ] Monitor system
- [ ] Verify stability
- **Status**: NOT STARTED

### PHASE 5: Documentation (Week 4)
**Duration**: 5 hours  
**Deliverable**: Updated documentation  

**Step 5.1: Update Docs** ⏳ PENDING
- [ ] Update architecture documentation
- [ ] Update admin guide
- [ ] Create migration documentation
- **Status**: NOT STARTED

---

## SAFETY ROLLBACK PLAN

### Pre-Migration Baseline
**Commit**: Current HEAD (before any changes)
**Stable State**: Application running with language variants (current working state)

### Rollback Procedure (If Phase Fails)

#### After Phase 1 (Analysis):
No code changes, no rollback needed. Can restart from analysis.

#### After Phase 2 (Code Changes):
```bash
# Rollback command
git reset --hard HEAD~[number_of_commits]

# Verification
npm run build  # Must succeed with no errors/warnings
npm run dev   # Must start successfully
```

#### After Phase 3 (Database Migration):
```bash
# If migration not deployed yet
git reset --hard HEAD~[number_of_commits]

# If migration already deployed
mongorestore --uri="$MONGODB_URI" ./backup-pre-migration
```

#### After Phase 4 (Testing):
Rollback testing doesn't affect code. If issues found, document and return to Phase 3.

### Verification After Rollback
- [ ] `npm run build` - No errors, no warnings
- [ ] `npm run dev` - Starts successfully
- [ ] `/hu/courses` - Page loads in Hungarian
- [ ] Course discovery works
- [ ] Database integrity check passes

---

## DOCUMENTATION RULES FOR THIS FEATURE

1. ✅ This file (2026-01-24_ARCHITECTURE_FIX_...) tracks all progress
2. ✅ Updated immediately after every completed step
3. ✅ No placeholders or TBD
4. ✅ All code changes documented here
5. ✅ All rollback points documented here
6. ✅ Referenced in TASKLIST.md after each phase

---

## CURRENT STATUS

**Overall Progress**: 10% (Phase 1 Step 1 complete, discovering actual scope)

**What's Done**: 
- ✅ Audit script created & executed
- ✅ Database structure verified (CORRECT!)
- ✅ No mixed-language courses found
- ✅ 23 language-specific courses exist

**What's Next**:
- 🟡 Phase 1, Step 1.2: Review current code (discover actual UI/code issues)
- 🟡 Reassess Phase 2 scope (code changes needed, not database changes)

**Discovery**: Database is CORRECT. Problem is CODE doesn't fully respect this structure yet.

**Estimated Revised Completion**: 1-2 weeks (less than original estimate due to no DB migration)

---

**Last Updated**: 2026-01-24 (Audit complete, Database verified CORRECT, code review next)

