# Simple Certification System - V1.0 Plan

**Date**: 2026-01-25  
**Status**: 📋 PLAN READY  
**Approach**: Use existing data, no complex generation, minimal code

---

## What We Already Have ✅

1. ✅ **Course tracking**: `Course` model
2. ✅ **User tracking**: `Player` model
3. ✅ **Enrollment tracking**: `CourseProgress` model (`startedAt`, `status`)
4. ✅ **Lesson progress**: `CourseProgress.completedDays` array
5. ✅ **Course completion**: `CourseProgress.status === 'COMPLETED'` when `completedDays.length >= course.durationDays`
6. ✅ **Quiz results**: Quiz submission tracked in `CourseProgress.assessmentResults`
7. ✅ **Final exam**: `FinalExamAttempt` model with 50 questions, `passed`, `scorePercentInteger`
8. ✅ **Certificate model**: `Certificate` model exists

---

## What We Need to Build (SIMPLE)

### Step 1: API Endpoint - Get Certificate Status
**File**: `app/api/profile/[playerId]/certificate-status/route.ts` (NEW FILE)

**What it does**:
- Takes `playerId` and `courseId` (query param)
- Returns simple JSON:
  ```json
  {
    "enrolled": true,
    "allLessonsCompleted": true,
    "allQuizzesPassed": true,
    "finalExamPassed": true,
    "finalExamScore": 75,
    "certificateEligible": true
  }
  ```

**Logic**:
1. Check `CourseProgress` exists → `enrolled = true`
2. Check `completedDays.length >= course.durationDays` → `allLessonsCompleted = true`
3. Check `assessmentResults` has entries for all days → `allQuizzesPassed = true`
4. Check `FinalExamAttempt` with `status='GRADED'` and `passed=true` → `finalExamPassed = true`, `finalExamScore = scorePercentInteger`
5. If all true → `certificateEligible = true`

**NO COMPLEX LOGIC** - just read existing data!

---

### Step 2: Simple Certificate Display Page
**File**: `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx` (NEW FILE)

**What it shows**:
```
Certificate of Completion

User: [Player Name]
Course: [Course Title]

✅ User enrolled in the course
✅ User learned all lessons
✅ User passed all quizzes
✅ User passed the final quiz (Score: 75%)

Issued: [Date]
```

**How it works**:
- Calls the API endpoint from Step 1
- Displays simple text/HTML
- NO IMAGE GENERATION
- NO COMPLEX UI
- Just a simple page showing the facts

---

### Step 3: Link from Profile Page
**File**: `app/[locale]/profile/[playerId]/page.tsx` (MODIFY EXISTING)

**What to add**:
- In the "Overview" tab, add a section:
  ```
  Certificates
  [Course Name] - View Certificate
  ```

**How**:
- Call API to get all courses user enrolled in
- For each course, check certificate status
- Show link if `certificateEligible = true`

**MINIMAL CHANGE** - just add a section, don't touch existing code!

---

## Implementation Steps

### Phase 1: API Endpoint (ISOLATED)
1. Create `app/api/profile/[playerId]/certificate-status/route.ts`
2. Implement simple logic (read CourseProgress, FinalExamAttempt)
3. Test with `curl` or Postman
4. ✅ Build, commit, push

### Phase 2: Display Page (ISOLATED)
1. Create `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx`
2. Call API, display simple HTML
3. Test manually
4. ✅ Build, commit, push

### Phase 3: Profile Link (MINIMAL MODIFICATION)
1. Add certificate section to profile page
2. Add API call to get certificate status
3. Display links
4. Test manually
5. ✅ Build, commit, push

---

## Success Criteria

✅ User can see certificate status for a course  
✅ User can view a simple certificate page  
✅ Profile page shows certificate links  
✅ NO BREAKING CHANGES to existing code  
✅ Build passes  
✅ Site works  

---

## What We're NOT Doing (V1.0)

❌ Image generation (PNG/PDF)  
❌ Complex certificate design  
❌ Public verification pages  
❌ Certificate sharing  
❌ Revocation logic  

**V1.0 = Simple display of facts using existing data**

---

## Why This Will Work

1. **Uses existing data** - no new models needed
2. **Isolated files** - won't break existing code
3. **Simple logic** - just reading and displaying
4. **Incremental** - test after each step
5. **No complex dependencies** - no ImageResponse, no OG image generation

---

**Ready to implement?** Let's start with Phase 1 - the API endpoint.
