# Short Course Feature Plan

**Feature**: Create short courses (101 and Week) from existing 30-day courses  
**Last Updated**: 2025-01-20  
**Status**: Planning

---

## 1. Overview

Allow admins to create shorter course variants from existing 30-day courses:
- **101 Course**: 1-3 lessons (quick introduction)
- **Week Course**: 7-9 lessons (mid-length course)
- **30 Days**: Default existing course type

Short courses maintain a **100% connection** to parent course lessons - any changes to parent lessons automatically reflect in child courses.

---

## 2. Core Requirements

### 2.1 Course Types

```typescript
type CourseType = '30_DAYS' | '101' | 'WEEK';

interface CourseTypeConfig {
  '30_DAYS': {
    minLessons: 30;
    maxLessons: 30;
    defaultDuration: 30;
  };
  '101': {
    minLessons: 1;
    maxLessons: 3;
    defaultDuration: 1; // Can be completed in 1 day
  };
  'WEEK': {
    minLessons: 7;
    maxLessons: 9;
    defaultDuration: 7;
  };
}
```

### 2.2 Parent-Child Relationship

- **101 and Week courses** must select a parent 30-day course
- Selected lessons are **referenced, not copied**
- Changes to parent lesson content/quizzes automatically reflect in child courses
- Child courses cannot modify lesson content (read-only reference)

### 2.3 Lesson Selection

- Admin selects lessons from parent course (between min-max for course type)
- Lessons maintain their original `dayNumber` from parent (for context)
- Child course has its own `displayOrder` (1, 2, 3... for 101; 1-9 for Week)
- Lessons can be reordered in child course

### 2.4 Quiz Pool

- Child courses use the **same quiz pool** as parent course for certificates
- All quiz questions from selected parent lessons are available
- Certificate generation uses parent course's quiz pool

---

## 3. Database Schema Changes

### 3.1 Course Model Extensions

```typescript
// app/lib/models/course.ts

export interface ICourse extends Document {
  // ... existing fields ...
  
  // NEW: Course type
  courseType: '30_DAYS' | '101' | 'WEEK';
  
  // NEW: Parent course reference (only for 101 and WEEK)
  parentCourseId?: mongoose.Types.ObjectId;
  parentCourseId_ref?: string; // courseId string reference
  
  // NEW: Selected lesson references (only for 101 and WEEK)
  selectedLessonIds?: mongoose.Types.ObjectId[]; // References to parent course lessons
  selectedLessonIds_ref?: string[]; // lessonId string references
  
  // NEW: Lesson display order mapping
  // Maps parent lessonId to display order in child course
  lessonDisplayOrder?: Map<string, number>; // { lessonId: displayOrder }
  
  // Modified: durationDays now calculated for 101/WEEK
  // durationDays: calculated from selectedLessonIds.length or courseType defaults
}
```

### 3.2 Lesson Model (No Changes)

Lessons remain unchanged. Child courses reference existing lesson documents.

### 3.3 CourseProgress Model Extensions

```typescript
// app/lib/models/course-progress.ts

export interface ICourseProgress extends Document {
  // ... existing fields ...
  
  // NEW: Track progress through child course lessons
  // Uses displayOrder (1, 2, 3...) instead of dayNumber
  completedLessonIds: mongoose.Types.ObjectId[]; // Already exists, works for child courses
  
  // Modified: For child courses, track by lessonId instead of dayNumber
  // dayNumber field still used for 30-day courses
}
```

### 3.4 Certificate Model (No Changes)

Certificates already reference `courseId`. Quiz pool is determined by parent course.

---

## 4. API Endpoints

### 4.1 Create Short Course

**POST** `/api/admin/courses`

```typescript
// Request Body
{
  courseId: string; // e.g., "SALES_101", "SALES_WEEK"
  name: string;
  description: string;
  language: string;
  courseType: '101' | 'WEEK';
  parentCourseId: string; // courseId of parent 30-day course
  selectedLessonIds: string[]; // Array of lessonIds from parent course
  lessonDisplayOrder?: { [lessonId: string]: number }; // Optional custom ordering
  // ... other course fields (thumbnail, price, etc.)
}

// Response
{
  success: true;
  course: ICourse;
}
```

**Validation:**
- `parentCourseId` must exist and be a 30-day course
- `selectedLessonIds` must belong to parent course
- Lesson count must match course type constraints (1-3 for 101, 7-9 for Week)
- All selected lessons must be active

### 4.2 Get Parent Course Lessons

**GET** `/api/admin/courses/[parentCourseId]/lessons/selectable`

```typescript
// Response
{
  success: true;
  lessons: Array<{
    lessonId: string;
    dayNumber: number;
    title: string;
    language: string;
    isActive: boolean;
    quizConfig?: {
      enabled: boolean;
      poolSize: number;
    };
  }>;
}
```

### 4.3 Update Short Course Lessons

**PUT** `/api/admin/courses/[courseId]/lessons`

```typescript
// Request Body
{
  selectedLessonIds: string[]; // Updated selection
  lessonDisplayOrder?: { [lessonId: string]: number };
}

// Response
{
  success: true;
  course: ICourse;
}
```

**Validation:**
- Cannot change `parentCourseId` after creation
- Lesson count must still match course type constraints

### 4.4 Get Course with Lessons

**GET** `/api/courses/[courseId]`

Modified to include:
- `courseType`
- `parentCourseId` (if applicable)
- `lessons`: Array of referenced lessons with display order

---

## 5. Lesson Resolution Logic

### 5.1 Fetching Lessons for Child Course

When fetching lessons for a child course:

```typescript
// Pseudo-code
async function getCourseLessons(courseId: string) {
  const course = await Course.findOne({ courseId });
  
  if (course.courseType === '30_DAYS') {
    // Existing logic: fetch by courseId and dayNumber
    return Lesson.find({ courseId: course._id }).sort({ dayNumber: 1 });
  }
  
  // For 101 and WEEK courses
  if (course.parentCourseId && course.selectedLessonIds) {
    // Fetch lessons from parent course
    const lessons = await Lesson.find({
      lessonId: { $in: course.selectedLessonIds },
      courseId: course.parentCourseId
    });
    
    // Sort by displayOrder from child course
    return lessons.sort((a, b) => {
      const orderA = course.lessonDisplayOrder?.get(a.lessonId) || 0;
      const orderB = course.lessonDisplayOrder?.get(b.lessonId) || 0;
      return orderA - orderB;
    });
  }
}
```

### 5.2 Lesson Content Access

Child courses always fetch content from parent lesson:

```typescript
// When displaying lesson content
async function getLessonContent(lessonId: string, courseId: string) {
  const course = await Course.findOne({ courseId });
  
  if (course.courseType === '30_DAYS') {
    // Direct access
    return Lesson.findOne({ lessonId, courseId: course._id });
  }
  
  // For child courses, fetch from parent
  const parentCourse = await Course.findById(course.parentCourseId);
  return Lesson.findOne({
    lessonId,
    courseId: parentCourse._id
  });
}
```

### 5.3 Quiz Access

Quizzes are always fetched from parent lesson:

```typescript
// Quiz questions come from parent course lessons
async function getQuizQuestions(lessonId: string, courseId: string) {
  const course = await Course.findOne({ courseId });
  
  if (course.courseType === '30_DAYS') {
    return QuizQuestion.find({ lessonId, courseId: course._id });
  }
  
  // For child courses, fetch from parent
  const parentCourse = await Course.findById(course.parentCourseId);
  return QuizQuestion.find({
    lessonId,
    courseId: parentCourse._id
  });
}
```

---

## 6. UI/UX Implementation

### 6.1 Course Creation Flow

**Step 1: Course Type Selection**

```
┌─────────────────────────────────────┐
│ Create New Course                   │
├─────────────────────────────────────┤
│                                     │
│ Course Type:                        │
│ ○ 30 Days (default)                 │
│ ○ 101 (1-3 lessons)                 │
│ ○ Week (7-9 lessons)                │
│                                     │
│ [Continue]                          │
└─────────────────────────────────────┘
```

**Step 2: Parent Course Selection (for 101/Week)**

```
┌─────────────────────────────────────┐
│ Select Parent Course                │
├─────────────────────────────────────┤
│                                     │
│ Parent Course: [Dropdown ▼]        │
│   - Sales Productivity 30 Days      │
│   - AI 30 Days                      │
│   - ...                             │
│                                     │
│ [Continue]                          │
└─────────────────────────────────────┘
```

**Step 3: Lesson Selection**

```
┌─────────────────────────────────────┐
│ Select Lessons                      │
├─────────────────────────────────────┤
│                                     │
│ Select 1-3 lessons:                 │
│                                     │
│ ☑ Day 1: Sales Funnel Basics       │
│ ☐ Day 2: Lead Qualification        │
│ ☑ Day 5: Pricing Strategies         │
│ ☐ Day 7: Objection Handling         │
│ ...                                 │
│                                     │
│ Selected: 2/3                       │
│                                     │
│ [Reorder] [Continue]                │
└─────────────────────────────────────┘
```

**Step 4: Course Details**

```
┌─────────────────────────────────────┐
│ Course Details                      │
├─────────────────────────────────────┤
│                                     │
│ Course ID: [SALES_101]              │
│ Name: [Sales Fundamentals 101]      │
│ Description: [Text area]            │
│ Language: [en ▼]                    │
│ Thumbnail: [Upload]                 │
│ Price: [Optional]                   │
│                                     │
│ [Create Course]                     │
└─────────────────────────────────────┘
```

### 6.2 Course Edit Page

For existing short courses, show:
- Parent course (read-only, cannot change)
- Selected lessons with reorder capability
- Add/remove lessons (within constraints)
- Standard course metadata editing

### 6.3 Course Display

**Course Listing:**
- Show course type badge (101, Week, 30 Days)
- Show parent course name for 101/Week courses
- Show lesson count

**Course Detail Page:**
- Display lessons in display order (1, 2, 3... not day numbers)
- Show "Based on [Parent Course Name]" badge
- Lesson content fetched from parent (transparent to user)

---

## 7. Progress Tracking

### 7.1 CourseProgress for Child Courses

```typescript
// When user completes a lesson in child course
async function completeLesson(
  playerId: string,
  courseId: string,
  lessonId: string
) {
  const course = await Course.findOne({ courseId });
  const progress = await CourseProgress.findOne({ playerId, courseId });
  
  if (course.courseType === '30_DAYS') {
    // Existing logic
    progress.completedLessons.push(lessonId);
    progress.currentDay = nextDay;
  } else {
    // For child courses
    progress.completedLessonIds.push(lessonId);
    
    // Calculate completion percentage
    const totalLessons = course.selectedLessonIds.length;
    const completedCount = progress.completedLessonIds.length;
    progress.completionPercentage = (completedCount / totalLessons) * 100;
    
    // Mark as completed if all lessons done
    if (completedCount === totalLessons) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }
  }
  
  await progress.save();
}
```

### 7.2 Completion Detection

```typescript
function isCourseCompleted(progress: ICourseProgress, course: ICourse): boolean {
  if (course.courseType === '30_DAYS') {
    return progress.isCompleted; // Existing logic
  }
  
  // For child courses
  const requiredLessons = course.selectedLessonIds || [];
  const completedLessons = progress.completedLessonIds || [];
  
  return requiredLessons.every(lessonId => 
    completedLessons.includes(lessonId)
  );
}
```

---

## 8. Certificate Integration

### 8.1 Quiz Pool for Certificates

Certificates use parent course's quiz pool:

```typescript
async function getCertificateQuizPool(courseId: string) {
  const course = await Course.findOne({ courseId });
  
  if (course.courseType === '30_DAYS') {
    // Use course's own quiz pool
    return QuizQuestion.find({ courseId: course._id });
  }
  
  // For child courses, use parent's quiz pool
  const parentCourse = await Course.findById(course.parentCourseId);
  return QuizQuestion.find({ courseId: parentCourse._id });
}
```

### 8.2 Certificate Generation

When issuing certificate for child course:
- Use parent course's quiz pool
- Certificate shows child course name
- Certificate metadata includes parent course reference

---

## 9. Migration Strategy

### 9.1 Database Migration

```typescript
// Migration script: add courseType to existing courses
async function migrateExistingCourses() {
  const courses = await Course.find({});
  
  for (const course of courses) {
    if (!course.courseType) {
      course.courseType = '30_DAYS';
      await course.save();
    }
  }
}
```

### 9.2 Backward Compatibility

- Existing 30-day courses continue to work without changes
- API endpoints handle both old and new course types
- UI gracefully handles missing `courseType` field

---

## 10. Implementation Phases

### Phase 1: Database & Models
- [ ] Extend Course model with `courseType`, `parentCourseId`, `selectedLessonIds`
- [ ] Add validation for course type constraints
- [ ] Create migration script
- [ ] Update TypeScript interfaces

### Phase 2: API Endpoints
- [ ] Create course with type selection
- [ ] Get selectable lessons from parent course
- [ ] Update short course lessons
- [ ] Modify lesson fetching logic for child courses
- [ ] Update quiz fetching logic

### Phase 3: Admin UI
- [ ] Course type selector in creation flow
- [ ] Parent course selection (for 101/Week)
- [ ] Lesson selection interface with constraints
- [ ] Lesson reordering
- [ ] Course edit page for short courses

### Phase 4: Student UI
- [ ] Display course type badge
- [ ] Show parent course reference
- [ ] Lesson navigation (display order instead of day numbers)
- [ ] Progress tracking for child courses

### Phase 5: Certificate Integration
- [ ] Use parent course quiz pool for certificates
- [ ] Update certificate generation logic
- [ ] Test certificate issuance for child courses

### Phase 6: Testing & Documentation
- [ ] Unit tests for lesson resolution
- [ ] Integration tests for course creation
- [ ] E2E tests for student flow
- [ ] Update admin documentation
- [ ] Update API documentation

---

## 11. Edge Cases & Considerations

### 11.1 Parent Course Deletion

**Scenario**: Parent 30-day course is deleted or deactivated

**Solution**: 
- Prevent deletion if child courses exist
- Or mark child courses as inactive
- Show warning in admin UI

### 11.2 Parent Lesson Deletion

**Scenario**: A lesson selected in child course is deleted from parent

**Solution**:
- Remove lesson from child course's `selectedLessonIds`
- Or prevent deletion if lesson is used in child courses
- Show warning in admin UI

### 11.3 Parent Lesson Deactivation

**Scenario**: A lesson selected in child course is deactivated in parent

**Solution**:
- Child course lesson also becomes unavailable
- Show message to students: "This lesson is temporarily unavailable"
- Admin can see which lessons are inactive

### 11.4 Language Mismatch

**Scenario**: Child course language differs from parent course

**Solution**:
- Allow different languages (use translations)
- Or enforce same language
- Document behavior clearly

### 11.5 Quiz Configuration Changes

**Scenario**: Parent lesson's quiz config changes

**Solution**:
- Changes automatically reflect in child courses (by design)
- No action needed (read-only reference)

---

## 12. Testing Checklist

### 12.1 Course Creation
- [ ] Create 101 course with 1 lesson
- [ ] Create 101 course with 3 lessons
- [ ] Create Week course with 7 lessons
- [ ] Create Week course with 9 lessons
- [ ] Validate lesson count constraints
- [ ] Validate parent course selection

### 12.2 Lesson Resolution
- [ ] Fetch lessons for child course
- [ ] Verify lessons come from parent
- [ ] Verify display order works
- [ ] Verify lesson content is from parent

### 12.3 Progress Tracking
- [ ] Complete lesson in child course
- [ ] Verify progress updates correctly
- [ ] Verify completion detection works
- [ ] Verify completion percentage calculation

### 12.4 Quiz Access
- [ ] Take quiz in child course
- [ ] Verify questions come from parent lesson
- [ ] Verify quiz results are saved correctly

### 12.5 Certificate Generation
- [ ] Issue certificate for 101 course
- [ ] Issue certificate for Week course
- [ ] Verify quiz pool uses parent course
- [ ] Verify certificate shows correct course name

### 12.6 Edge Cases
- [ ] Try to delete parent course with child courses
- [ ] Try to delete lesson used in child course
- [ ] Deactivate lesson in parent, verify child course
- [ ] Change parent lesson content, verify child course updates

---

## 13. Definition of Done

- [ ] Admins can create 101 and Week courses from 30-day courses
- [ ] Lesson selection enforces min/max constraints
- [ ] Child courses reference parent lessons (not copies)
- [ ] Changes to parent lessons reflect in child courses
- [ ] Progress tracking works for child courses
- [ ] Certificates use parent course quiz pool
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Admin UI is intuitive and user-friendly
- [ ] Student experience is seamless

---

## 14. Future Enhancements

- **Custom lesson ordering**: Allow admins to reorder lessons in child courses
- **Lesson filtering**: Filter parent lessons by tags/categories
- **Bulk creation**: Create multiple 101/Week courses from one parent
- **Analytics**: Track which parent lessons are most selected
- **Templates**: Pre-defined 101/Week course templates
- **A/B testing**: Test different lesson combinations

---

## 15. Questions & Decisions Needed

1. **Language handling**: Should child courses be same language as parent, or allow different languages with translations?

2. **Pricing**: Should child courses have independent pricing or inherit from parent?

3. **Completion requirements**: Should child courses require all lessons or allow partial completion?

4. **Email notifications**: Should child courses send daily emails or only on completion?

5. **Analytics**: How should we track completion rates for child vs parent courses?

---

**End of Plan**
