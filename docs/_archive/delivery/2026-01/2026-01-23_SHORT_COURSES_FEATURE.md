# Short Children Courses Feature

**Date**: 2026-01-23  
**Status**: ⏳ PENDING (Partially implemented - poolCourseId exists)  
**Priority**: LOW  
**Estimated**: 7-10 days  
**Related Documents**: `docs/FEATURES_SINCE_F20C34A_COMPLETE_DOCUMENTATION copy.md` (Section 2), `docs/ROADMAP.md`  
**Detailed action plan & handover (2026-01-27)**: `docs/_archive/delivery/2026-01/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md` — Admin grouping (Course Idea → Outline → CCS → Language variants → Course); Short types by lesson count (1–3 Essentials, 4–7 Beginner, 8–12 Foundations, 13–20 Core Skills, 21+ Full Program); Shorts section like Certification Settings; checkbox selection; read-only child editor; certificate with limited questions; timeline (goLiveAt); rollback plan; **Section 10** = clarification questions (storage, CCS entity, naming, timeline).

---

## Overview

System to fork 30-day courses into shorter formats (7-day, weekend, 1-day, 1-hour) with different quiz strategies and schedules. Currently only `poolCourseId` exists - full implementation needed.

---

## Current State

**What Exists**:
- `Course.certification.poolCourseId` field
- `resolvePoolCourse()` function
- Certification system can use parent course's question pool

**What's Missing**:
- Course forking UI
- Parent-child relationship management
- Lesson selection/mapping system
- Variant-specific scheduling
- Different quiz strategies

---

## Feature Breakdown

### Phase 1: Database Schema (Day 1)

**Tasks**:
1. Add `parentCourseId` to Course model (optional ObjectId reference)
2. Add `courseVariant` field: `'standard' | '7day' | 'weekend' | '1day' | '1hour'`
3. Add `selectedLessonIds` array to Course model
4. Add `quizStrategy` field: `'inherit' | 'mega-quiz' | 'diagnostic'`

**Deliverable**: Database schema supports parent-child relationships and variants.

---

### Phase 2: Course Forking UI (Day 2-4)

**Tasks**:
1. Add "Fork Course" button in admin course editor
2. Create fork wizard component:
   - Select parent course
   - Select variant type (7-day, weekend, 1-day, 1-hour)
   - Select lessons to include (with reordering)
   - Configure quiz strategy
   - Set schedule (for weekend variant: Fri/Sat/Sun mapping)
3. Create child course with:
   - `parentCourseId` set to parent
   - `courseVariant` set
   - `selectedLessonIds` populated
   - `certification.poolCourseId` set to parent's courseId
   - `durationDays` set based on variant

**Deliverable**: Admins can fork courses through UI.

---

### Phase 3: Lesson Delivery (Day 4-6)

**Tasks**:
1. Modify lesson delivery to respect `selectedLessonIds`
   - Only show selected lessons in child courses
2. Implement variant-specific scheduling:
   - **7-day**: One lesson per day (linear)
   - **Weekend**: Calendar-based (Fri/Sat/Sun slots)
   - **1-day**: All lessons available immediately
   - **1-hour**: All lessons available immediately
3. Update email delivery to respect variant schedule

**Deliverable**: Child courses deliver lessons according to variant schedule.

---

### Phase 4: Quiz Strategies (Day 6-8)

**Tasks**:
1. **Inherit strategy**: Use parent's lesson quizzes as-is
2. **Mega-quiz strategy**: Single 50-question quiz at end of course
3. **Diagnostic strategy**: Random 50-question pool (for 1-hour variant)
4. Update quiz UI to respect strategy

**Deliverable**: Different quiz strategies work per variant.

---

### Phase 5: Auto-Sync (Day 8-10) - OPTIONAL

**Tasks**:
1. Track parent course changes
2. Alert child courses of updates
3. Preview changes before syncing
4. Sync UI for admins

**Deliverable**: Child courses can sync with parent updates.

---

## Business Rules

### Variant Types
- **7-day**: 7 lessons, daily cadence, inherited quizzes
- **Weekend**: 4 lessons (1 Fri + 2 Sat + 1 Sun), calendar-fixed
- **1-day**: 10 lessons, no per-lesson quizzes, 50-question final quiz
- **1-hour**: 2 lessons, 50-question diagnostic random pool

### Quiz Strategies
- **inherit**: Use parent's daily quizzes
- **mega-quiz**: Single 50-question quiz at end
- **diagnostic**: Random 50-question pool with score-based recommendations

### Certification
- Child courses use parent's question pool via `poolCourseId`
- Certification enabled/disabled per course (can override parent)

---

## Implementation Checklist

- [ ] Add database fields to Course model
- [ ] Create fork wizard UI
- [ ] Implement lesson selection/mapping
- [ ] Implement variant-specific scheduling
- [ ] Implement quiz strategies
- [ ] Update lesson delivery logic
- [ ] Update email delivery logic
- [ ] Test all variants work correctly
- [ ] (Optional) Implement auto-sync

---

## Priority

**LOW** - This is a nice-to-have feature. Focus on certification system first, then short courses if needed.
