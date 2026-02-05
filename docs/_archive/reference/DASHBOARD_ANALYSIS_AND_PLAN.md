# Dashboard Analysis & Improvement Plan

**Date:** January 2026  
**Status:** Analysis Complete - Ready for Implementation

---

## Current Dashboard Analysis

### What's Currently Displayed

The dashboard shows 4 main stat cards:

1. **Learning Level (Tanulási szint)**
   - **Shows:** Level, XP progress (currentXP / xpToNextLevel)
   - **Source:** `PlayerProgression.level`, `PlayerProgression.currentXP`, `PlayerProgression.xpToNextLevel`
   - **Status:** ✅ **CORRECT** - Shows actual learning progress

2. **Points (Pontok)**
   - **Shows:** Current balance, lifetime earned, lifetime spent
   - **Source:** `PointsWallet.currentBalance`, `PointsWallet.lifetimeEarned`, `PointsWallet.lifetimeSpent`
   - **Status:** ✅ **CORRECT** - Shows actual points from all sources

3. **Achievements (Eredmények)**
   - **Shows:** Unlocked achievements / Total achievements (percentage)
   - **Source:** `AchievementUnlock.countDocuments({ playerId })` / `Achievement.countDocuments({ isActive: true })`
   - **Status:** ✅ **CORRECT** - Shows actual achievement unlocks

4. **Assessments Completed (értékelés teljesítve)**
   - **Shows:** `progression.totalGamesPlayed` (currently 0)
   - **Source:** `PlayerProgression.statistics.totalGamesPlayed` (from game sessions, NOT course quizzes)
   - **Status:** ❌ **INCORRECT** - This shows game sessions, not course quiz completions

---

## The Problem

### Current Issue

The "Assessments Completed" card shows `totalGamesPlayed` which is:
- Counted from `PlayerSession` records (game sessions)
- **NOT** related to course quizzes/assessments
- Shows 0 for users who haven't played games but have completed course quizzes

### What Should Be Shown

The "Assessments Completed" should show:
- **Number of quizzes/assessments completed** in courses
- **Number of lessons completed** in courses
- **Course completion progress** (days completed, courses completed)

---

## Data Sources Available

### Course-Related Data Models

1. **CourseProgress** (`app/lib/models/course-progress.ts`)
   - `completedDays: number[]` - Array of completed day numbers
   - `assessmentResults: Map<string, ObjectId>` - Map of dayNumber → AssessmentResult ID
   - `status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'`
   - `totalPointsEarned: number`
   - `totalXPEarned: number`

2. **AssessmentResult** (if exists)
   - Stores quiz submission results
   - Links to CourseProgress via `assessmentResults` map

3. **Lesson** (`app/lib/models/lesson.ts`)
   - `quizConfig.enabled: boolean`
   - `quizConfig.required: boolean`
   - `quizConfig.successThreshold: number`

### Current API Endpoint

**`/api/players/[playerId]`** currently returns:
- `progression.totalGamesPlayed` - From game sessions (wrong for courses)
- No course-specific statistics

---

## Implementation Plan

### Phase 1: Add Course Statistics to API (Quick Win - 1-2 hours)

**File:** `app/api/players/[playerId]/route.ts`

**Changes:**
1. Query `CourseProgress` for the player
2. Calculate:
   - Total quizzes completed (count of `assessmentResults` entries)
   - Total lessons completed (sum of `completedDays.length` across all courses)
   - Total courses enrolled (count of `CourseProgress` documents)
   - Total courses completed (count where `status === 'COMPLETED'`)
   - Total course XP earned (sum of `totalXPEarned`)
   - Total course points earned (sum of `totalPointsEarned`)

3. Add to response:
```typescript
courseStats: {
  quizzesCompleted: number;
  lessonsCompleted: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  totalCourseXP: number;
  totalCoursePoints: number;
}
```

**Estimated Time:** 1-2 hours

---

### Phase 2: Update Dashboard Display (Quick Win - 1 hour)

**File:** `app/[locale]/dashboard/page.tsx`

**Changes:**
1. Update "Assessments Completed" card to show:
   - `courseStats.quizzesCompleted` instead of `totalGamesPlayed`
   - Add subtitle: "X lessons completed in Y courses"

2. Optionally add new card or enhance existing:
   - Show course completion progress
   - Show enrolled courses count

**Estimated Time:** 1 hour

---

### Phase 3: Enhanced Learning Statistics (Optional - 2-3 hours)

**Additional Improvements:**

1. **Learning Level Card Enhancement:**
   - Show course XP + game XP separately
   - Show progress toward next level from courses

2. **New "Course Progress" Card:**
   - Active courses count
   - Courses completed count
   - Days completed this week/month
   - Current course streak

3. **Points Card Enhancement:**
   - Show course points vs game points separately
   - Show points earned this week/month

**Estimated Time:** 2-3 hours

---

## Recommended Quick Implementation

### Step 1: Update API (30 minutes)

Add course statistics calculation to `/api/players/[playerId]/route.ts`:

```typescript
// After fetching player data, add:
const [courseProgresses] = await Promise.all([
  CourseProgress.find({ playerId }).lean(),
  // ... existing queries
]);

// Calculate course stats
const courseStats = {
  quizzesCompleted: courseProgresses.reduce((sum, cp) => 
    sum + (cp.assessmentResults?.size || 0), 0
  ),
  lessonsCompleted: courseProgresses.reduce((sum, cp) => 
    sum + (cp.completedDays?.length || 0), 0
  ),
  coursesEnrolled: courseProgresses.length,
  coursesCompleted: courseProgresses.filter(cp => cp.status === 'COMPLETED').length,
  totalCourseXP: courseProgresses.reduce((sum, cp) => 
    sum + (cp.totalXPEarned || 0), 0
  ),
  totalCoursePoints: courseProgresses.reduce((sum, cp) => 
    sum + (cp.totalPointsEarned || 0), 0
  ),
};

// Add to response
response.courseStats = courseStats;
```

### Step 2: Update Dashboard (30 minutes)

Update the "Assessments Completed" card in `app/[locale]/dashboard/page.tsx`:

```typescript
// Change from:
<div className="text-3xl font-bold text-brand-black">
  {progression?.totalGamesPlayed || 0}
</div>
<div className="text-brand-darkGrey">{t('assessmentsCompleted')}</div>

// To:
<div className="text-3xl font-bold text-brand-black">
  {playerData?.courseStats?.quizzesCompleted || 0}
</div>
<div className="text-brand-darkGrey">{t('assessmentsCompleted')}</div>
{playerData?.courseStats && (
  <div className="text-xs text-brand-darkGrey mt-4">
    {playerData.courseStats.lessonsCompleted} {t('lessonsCompleted')} • 
    {playerData.courseStats.coursesEnrolled} {t('coursesEnrolled')}
  </div>
)}
```

### Step 3: Add Translations (10 minutes)

Add to `messages/hu.json` and `messages/en.json`:
- `lessonsCompleted`: "lecke teljesítve" / "lessons completed"
- `coursesEnrolled`: "kurzus" / "courses"

---

## Total Estimated Time

- **Quick Implementation (Steps 1-3):** ~1.5 hours
- **Full Enhancement (Phase 3):** ~4-5 hours total

---

## Success Criteria

✅ Dashboard shows actual quiz completions from courses  
✅ Dashboard shows actual lessons completed  
✅ Dashboard shows course enrollment and completion stats  
✅ All data is accurate and reflects real learning progress  

---

## Files to Modify

1. `app/api/players/[playerId]/route.ts` - Add course statistics
2. `app/[locale]/dashboard/page.tsx` - Update display
3. `messages/hu.json` - Add translations
4. `messages/en.json` - Add translations

---

## Testing Checklist

- [ ] New user with no courses - shows 0 for all course stats
- [ ] User with enrolled courses - shows correct enrollment count
- [ ] User with completed quizzes - shows correct quiz count
- [ ] User with completed lessons - shows correct lesson count
- [ ] User with completed courses - shows correct completion count
- [ ] XP and points from courses are calculated correctly
- [ ] Dashboard refreshes correctly after completing a quiz/lesson

---

**Ready for Implementation:** ✅  
**Priority:** High (fixes misleading data display)  
**Complexity:** Low (straightforward data aggregation)
