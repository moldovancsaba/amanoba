# Progressive Course Generation - Phase 1 Implementation Plan

**Status**: Ready to Implement  
**Start Date**: 2026-08-06  
**Target Completion**: 2-3 weeks  
**Owner**: Development Team

---

## Overview

This document outlines **Phase 1: Foundation** for the Progressive Course Generation system. We'll build the core infrastructure needed to track course progression, metrics, and triggers.

---

## What We're Building (Phase 1)

### Core Components

1. **Database Models** - Track course progression and metrics
2. **Metrics Collection** - Gather completion and engagement data
3. **Trigger Evaluation** - Determine when to generate next stage
4. **Admin Interface** - View progression status and metrics
5. **API Endpoints** - Query and manage progression

### What We're NOT Building (Yet)

- Content generation (Phase 2)
- Automated triggers (Phase 2)
- Pricing/premium (Phase 3)
- Full admin UI (Phase 3)

---

## Current State Analysis

### ✅ Already Implemented

1. **Course Model** (`app/lib/models/course.ts`):
   - `parentCourseId` field exists
   - `selectedLessonIds` for child courses
   - `courseVariant` field
   - `prerequisiteCourseIds` and enforcement

2. **CourseProgress Model** (`app/lib/models/course-progress.ts`):
   - Completion tracking (`completedDays`, `isCompleted`)
   - Status tracking (`IN_PROGRESS`, `COMPLETED`)
   - Points and XP tracking

3. **Content Quality System**:
   - Quality validation (5W1H structure)
   - Quiz question standards
   - Enforcement levels

4. **Course Creation**:
   - Manual course creation works
   - Reset script (`reset-courses-now.ts`)
   - Quality standards enforced

### ❌ Missing (Need to Build)

1. **CourseGenerationTracker Model** - Track progression metrics
2. **Trigger evaluation logic** - When to generate next stage
3. **Metrics aggregation** - Collect and analyze engagement data
4. **Stage relationship tracking** - Link courses in progression
5. **Admin endpoints** - View and manage progressions
6. **Documentation** - How to use the system

---

## Phase 1 Tasks

### Task 1: Database Schema Extensions

**Goal**: Add models to track course progression and metrics

#### 1.1 Create CourseGenerationTracker Model

**File**: `app/lib/models/course-generation-tracker.ts`

**Schema**:
```typescript
interface ICourseGenerationTracker {
  topicName: string;                    // e.g., "JavaScript"
  topicCategory: string;                // e.g., "Programming"
  
  // Stage tracking
  currentStage: 1 | 2 | 3 | 4;
  stage1CourseId?: string;              // Course ID for 1-day course
  stage2CourseId?: string;              // Course ID for 3-day course
  stage3CourseId?: string;              // Course ID for 7-day course
  stage4CourseId?: string;              // Course ID for 30-day course
  
  // Metrics for Stage 1 (1-day)
  stage1Metrics?: {
    enrollments: number;
    completions: number;
    averageScore: number;
    averageTimeMinutes: number;
    completionRate: number;              // completions / enrollments
    triggerThreshold: number;            // Default: 50 completions
    triggerMet: boolean;
    triggeredAt?: Date;
  };
  
  // Metrics for Stage 2 (3-day)
  stage2Metrics?: {
    enrollments: number;
    completions: number;
    averageScore: number;
    averageTimeMinutes: number;
    completionRate: number;
    triggerThreshold: number;            // Default: 30 completions
    triggerMet: boolean;
    triggeredAt?: Date;
  };
  
  // Metrics for Stage 3 (7-day)
  stage3Metrics?: {
    enrollments: number;
    completions: number;
    averageScore: number;
    averageTimeMinutes: number;
    completionRate: number;
    triggerThreshold: number;            // Default: 20 completions
    triggerMet: boolean;
    triggeredAt?: Date;
  };
  
  // Metrics for Stage 4 (30-day)
  stage4Metrics?: {
    enrollments: number;
    completions: number;
    averageScore: number;
    certificationRate: number;
  };
  
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  lastMetricsUpdate: Date;
}
```

**Indexes**:
- `topicName` (unique)
- `currentStage`
- `status`
- `stage1Metrics.triggerMet`

**Estimate**: 3 hours

---

#### 1.2 Extend Course Model

**File**: `app/lib/models/course.ts`

**Add Fields**:
```typescript
interface ICourse {
  // ... existing fields ...
  
  // Progressive generation metadata
  progressionMetadata?: {
    generationType: 'manual' | 'progressive';
    generationStage: 1 | 2 | 3 | 4;
    topicName: string;                   // Links to CourseGenerationTracker
    isProgressionRoot: boolean;          // True for Stage 1 courses
    nextStageCourseId?: string;          // Link to next stage
    previousStageCourseId?: string;      // Link to previous stage
  };
}
```

**Migration Note**: Existing courses will have `progressionMetadata: null` (manual courses)

**Estimate**: 2 hours

---

### Task 2: Metrics Collection System

**Goal**: Aggregate engagement metrics from CourseProgress

#### 2.1 Create Metrics Aggregator

**File**: `app/lib/progressive-generation/metrics-aggregator.ts`

**Functions**:
```typescript
/**
 * Calculate metrics for a specific course
 */
export async function calculateCourseMetrics(courseId: string): Promise<CourseMetrics> {
  // Count enrollments (CourseProgress documents)
  // Count completions (isCompleted: true)
  // Calculate average quiz scores
  // Calculate average completion time
  // Return aggregated metrics
}

/**
 * Update tracker metrics for a topic
 */
export async function updateTrackerMetrics(topicName: string, stage: number): Promise<void> {
  // Find tracker by topicName
  // Get courseId for specified stage
  // Calculate metrics for that course
  // Update tracker's stageNMetrics
  // Check if trigger threshold met
  // Save tracker
}

/**
 * Batch update all active trackers
 */
export async function refreshAllMetrics(): Promise<number> {
  // Find all active trackers
  // Update metrics for each stage
  // Return count of updated trackers
}
```

**Estimate**: 4 hours

---

#### 2.2 Create Background Job for Metrics Update

**File**: `app/lib/progressive-generation/metrics-job.ts`

**Functionality**:
- Runs every hour (configurable)
- Updates metrics for all active trackers
- Identifies courses that met trigger thresholds
- Logs results

**Integration**: Add to existing background workers

**Estimate**: 2 hours

---

### Task 3: Trigger Evaluation Logic

**Goal**: Determine when to generate the next stage

#### 3.1 Create Trigger Evaluator

**File**: `app/lib/progressive-generation/trigger-evaluator.ts`

**Functions**:
```typescript
/**
 * Evaluate if a course progression should trigger next stage
 */
export async function evaluateTriggers(topicName: string): Promise<TriggerEvaluation> {
  // Get tracker
  // Check current stage metrics
  // Compare against trigger threshold
  // Return evaluation result
}

/**
 * Get default trigger thresholds
 */
export function getDefaultTriggerThresholds(): TriggerThresholds {
  return {
    stage1to2: 50,  // 50 completions
    stage2to3: 30,  // 30 completions
    stage3to4: 20,  // 20 completions
  };
}

/**
 * Mark trigger as met (for manual generation in Phase 1)
 */
export async function markTriggerMet(topicName: string, stage: number): Promise<void> {
  // Find tracker
  // Set stageNMetrics.triggerMet = true
  // Set triggeredAt timestamp
  // Save
}
```

**Estimate**: 3 hours

---

### Task 4: API Endpoints

**Goal**: Provide API access to progression data

#### 4.1 Admin Progression Endpoints

**File**: `app/api/admin/progressive-generation/route.ts`

**Endpoints**:

**GET /api/admin/progressive-generation**
- List all course progressions
- Filter by status, stage, triggerMet
- Pagination support

**GET /api/admin/progressive-generation/[topicName]**
- Get specific progression by topic
- Include all metrics and course links

**POST /api/admin/progressive-generation**
- Create new progression tracker
- Initialize Stage 1 course

**PATCH /api/admin/progressive-generation/[topicName]**
- Update tracker (thresholds, status)
- Manual trigger marking

**POST /api/admin/progressive-generation/[topicName]/refresh-metrics**
- Force metrics refresh for specific topic

**Estimate**: 5 hours

---

#### 4.2 Public Progression Endpoints

**File**: `app/api/courses/[courseId]/progression/route.ts`

**Endpoints**:

**GET /api/courses/[courseId]/progression**
- Get progression info for a course
- Show next/previous stage courses
- Show current stage metrics (enrollment count, etc.)
- Public-facing (for learners to see progression path)

**Estimate**: 2 hours

---

### Task 5: Admin Interface (Basic)

**Goal**: View progression status in admin panel

#### 5.1 Progression List Page

**File**: `app/[locale]/admin/progressive-generation/page.tsx`

**Features**:
- List all progressions
- Show current stage, metrics, trigger status
- Filter and search
- Link to create new progression

**Estimate**: 4 hours

---

#### 5.2 Progression Detail Page

**File**: `app/[locale]/admin/progressive-generation/[topicName]/page.tsx`

**Features**:
- Show all 4 stages
- Display metrics for each stage
- Show trigger status
- Manual refresh button
- Link to courses
- Manual trigger override

**Estimate**: 4 hours

---

### Task 6: Utilities & Helpers

**Goal**: Support functions for progression system

#### 6.1 Create Progression Helper

**File**: `app/lib/progressive-generation/helpers.ts`

**Functions**:
```typescript
/**
 * Link courses in a progression
 */
export async function linkCoursesInProgression(
  topicName: string,
  stage: number,
  courseId: string
): Promise<void> {
  // Update tracker with new courseId
  // Update course with progressionMetadata
  // Link to previous/next stage courses
}

/**
 * Get progression path for a course
 */
export async function getProgressionPath(courseId: string): Promise<ProgressionPath | null> {
  // Find course
  // Get progressionMetadata
  // Return all courses in progression
}

/**
 * Check if course is part of a progression
 */
export async function isProgressionCourse(courseId: string): Promise<boolean> {
  // Check for progressionMetadata
}
```

**Estimate**: 3 hours

---

### Task 7: Testing & Documentation

#### 7.1 Unit Tests

**Files**: Test files for each module

**Coverage**:
- Model validation
- Metrics aggregation
- Trigger evaluation
- Helper functions

**Estimate**: 6 hours

---

#### 7.2 Integration Tests

**Test Scenarios**:
- Create progression → Add Stage 1 course → Complete course → Metrics update → Trigger met
- Multi-stage progression flow
- Edge cases (no completions, manual courses, etc.)

**Estimate**: 4 hours

---

#### 7.3 Documentation

**Files**:
- `docs/features/PROGRESSIVE_GENERATION_USER_GUIDE.md` - How to use
- `docs/features/PROGRESSIVE_GENERATION_API.md` - API reference
- Update `docs/HANDOVER.md` with implementation details

**Estimate**: 4 hours

---

## Timeline

### Week 1: Database & Core Logic
- **Day 1-2**: Database schemas (Tasks 1.1, 1.2)
- **Day 3-4**: Metrics collection (Task 2)
- **Day 5**: Trigger evaluation (Task 3)

### Week 2: APIs & Integration
- **Day 6-7**: API endpoints (Task 4)
- **Day 8-9**: Admin interface (Task 5)
- **Day 10**: Utilities & helpers (Task 6)

### Week 3: Testing & Polish
- **Day 11-12**: Unit tests (Task 7.1)
- **Day 13**: Integration tests (Task 7.2)
- **Day 14**: Documentation (Task 7.3)
- **Day 15**: Final review and deployment

**Total Estimate**: ~55 hours (2-3 weeks for single developer)

---

## Success Criteria

Phase 1 is complete when:

- [x] CourseGenerationTracker model created and tested
- [x] Course model extended with progressionMetadata
- [x] Metrics aggregator calculates enrollment, completion, scores
- [x] Trigger evaluator determines when thresholds are met
- [x] Admin API endpoints functional
- [x] Public progression API returns course paths
- [x] Admin UI shows progression list and details
- [x] Helper functions link courses in progressions
- [x] Unit and integration tests pass
- [x] Documentation complete

---

## What Happens After Phase 1

**Phase 2: Content Generation** (Future):
- Integrate AI content generation
- Automated course creation when triggers met
- Quality validation pipeline
- Admin approval workflow

**Phase 3: Automation & Monetization** (Future):
- Fully automated triggers
- Pricing integration
- Analytics dashboard
- A/B testing

---

## Risk Mitigation

### Risk: Metrics aggregation too slow
**Mitigation**: Add database indexes, use background jobs, cache results

### Risk: Trigger thresholds unclear
**Mitigation**: Start with manual triggers, gather data, adjust thresholds based on real usage

### Risk: Scope creep (trying to build content generation now)
**Mitigation**: Strict focus on Phase 1 goals only. No content generation yet.

---

## Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Start with Task 1.1** - Create CourseGenerationTracker model
3. **Iterate rapidly** - Build, test, integrate, repeat
4. **Track progress** - Update this doc with completed tasks

---

**Ready to begin implementation!**
