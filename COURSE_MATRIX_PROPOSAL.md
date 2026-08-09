# Course Matrix System - Complete Implementation Proposal

**Date**: 2026-08-09  
**Status**: Ready for Implementation  
**Estimated Time**: 7 hours  

---

## Executive Summary

Implement a **complete 2D course matrix** that tracks both:
- **Horizontal connections** (languages) - ✅ **DONE**
- **Vertical connections** (levels/progression) - ⚠️ **NEEDED**

This creates a true matrix where users can navigate:
- **Left/Right** → Switch languages (same level)
- **Up/Down** → Progress through levels (same language)

---

## Current Reality (From Database Analysis)

### Existing Courses

**CCS: AI_DUMMIES_1DAY_EN**
```
Level 1 (Beginner, 1-day):
  ├─ AI_DUMMIES_1DAY_EN    (English)  ✅
  └─ AI_DUMMIES_1DAY_EN_ES (Spanish)  ✅
```

**NO CCS (Orphaned):**
```
Level 2 (Intermediate, 3-day):
  └─ AI_ESSENTIALS_3DAY_EN (English)  ⚠️ No CCS!
     └─ has prerequisite pointing to AI_DUMMIES
```

### The Problem

1. ❌ **AI_ESSENTIALS is orphaned** - not linked to AI_DUMMIES CCS
2. ❌ **No explicit level tracking** in CCS
3. ❌ **Can't navigate vertically** (no "next level" function)
4. ❌ **Matrix is incomplete** - only horizontal (languages) works

### The Solution

Create **ONE unified CCS** for the entire AI learning path with **courseLevels** array:

```
CCS: AI_LEARNING_PATH_2026

courseLevels: [
  {
    level: 1,
    levelType: "1day_beginner",
    difficulty: "beginner",
    courseVariants: [
      { language: "en", courseId: "AI_DUMMIES_1DAY_EN" },
      { language: "es", courseId: "AI_DUMMIES_1DAY_EN_ES" }
    ]
  },
  {
    level: 2,
    levelType: "3day_essentials",
    difficulty: "intermediate",
    courseVariants: [
      { language: "en", courseId: "AI_ESSENTIALS_3DAY_EN" }
    ]
  }
]
```

---

## Proposed Enhanced CCS Structure

### New TypeScript Interfaces

```typescript
/**
 * Represents one level in a course family with all its language variants
 */
export interface ICourseLevel {
  level: number;                // Sequential: 1, 2, 3, 4, ...
  levelType: string;            // Descriptive: '1day_beginner', '3day_essentials', '30day_advanced'
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours?: number;
  description?: string;
  courseVariants: {
    language: string;           // ISO 639-1 code
    courseId: string;           // Course.courseId
    translationStatus: 'draft' | 'review' | 'published';
    translatedAt?: Date;
    translatedBy?: string;
    qualityScore?: number;
  }[];
}

/**
 * Enhanced CCS with matrix structure
 */
export interface ICCS extends Document {
  // Existing fields
  ccsId: string;
  name?: string;
  idea?: string;
  outline?: string;
  relatedDocuments?: IRelatedDocument[];
  
  // Language tracking (KEEP - still needed for backward compat)
  originalLanguage: string;
  originalCourseId: string;
  availableLanguages: string[];
  languageVariants: ILanguageVariantRef[];  // DEPRECATED but kept
  
  // NEW: Level progression tracking (THE MATRIX!)
  courseLevels: ICourseLevel[];
  totalLevels: number;                      // Computed: courseLevels.length
  
  createdAt: Date;
  updatedAt: Date;
  
  // Existing language methods (KEEP)
  addLanguageVariant(courseId: string, language: string, translatedBy?: string): Promise<void>;
  updateVariantStatus(language: string, status: string, qualityScore?: number): Promise<void>;
  removeLanguageVariant(language: string): Promise<void>;
  getVariantByLanguage(language: string): ILanguageVariantRef | undefined;
  hasLanguage(language: string): boolean;
  
  // NEW: Level navigation methods
  getLevelByNumber(level: number): ICourseLevel | undefined;
  getLevelByCourseId(courseId: string): { level: ICourseLevel; index: number } | undefined;
  getNextLevel(currentLevel: number): ICourseLevel | undefined;
  getPreviousLevel(currentLevel: number): ICourseLevel | undefined;
  getCourseAtLevel(level: number, language: string): string | undefined;
  hasLevel(level: number): boolean;
  addCourseToLevel(level: number, courseId: string, language: string): Promise<void>;
  createLevel(level: number, levelType: string, difficulty?: string): Promise<void>;
}
```

---

## The Complete Matrix

### Visual Representation

```
AI LEARNING PATH MATRIX (CCS: AI_LEARNING_PATH_2026)

                HORIZONTAL (Languages)
                EN            ES            ZH            FR
                ↓             ↓             ↓             ↓
VERTICAL  L1    ●─────────────●─────────────○─────────────○    1-Day Beginner
(Levels)        │             │             │             │
          L2    ●─────────────○─────────────○─────────────○    3-Day Essentials
                │             │             │             │
          L3    ○─────────────○─────────────○─────────────○    7-Day Intermediate
                │             │             │             │
          L4    ○─────────────○─────────────○─────────────○    30-Day Advanced

Legend:
● = Published course
○ = Slot available (not yet created)
─ = Horizontal connection (language variant)
│ = Vertical connection (level progression)
```

### Data Representation

```typescript
CCS {
  ccsId: "AI_LEARNING_PATH_2026",
  name: "AI Learning Path - From Beginner to Expert",
  
  originalLanguage: "en",
  originalCourseId: "AI_DUMMIES_1DAY_EN",
  
  courseLevels: [
    {
      level: 1,
      levelType: "1day_beginner",
      difficulty: "beginner",
      estimatedHours: 8,
      description: "Introduction to AI in one day",
      courseVariants: [
        { language: "en", courseId: "AI_DUMMIES_1DAY_EN", translationStatus: "published" },
        { language: "es", courseId: "AI_DUMMIES_1DAY_EN_ES", translationStatus: "published" }
      ]
    },
    {
      level: 2,
      levelType: "3day_essentials",
      difficulty: "intermediate",
      estimatedHours: 24,
      description: "Essential AI skills in 3 days",
      courseVariants: [
        { language: "en", courseId: "AI_ESSENTIALS_3DAY_EN", translationStatus: "published" }
      ]
    },
    {
      level: 3,
      levelType: "7day_intermediate",
      difficulty: "intermediate",
      estimatedHours: 56,
      description: "Intermediate AI applications",
      courseVariants: []  // Not created yet
    },
    {
      level: 4,
      levelType: "30day_advanced",
      difficulty: "advanced",
      estimatedHours: 240,
      description: "Advanced AI mastery",
      courseVariants: []  // Not created yet
    }
  ],
  
  totalLevels: 4,
  
  // Legacy fields (kept for backward compat during migration)
  availableLanguages: ["en", "es"],
  languageVariants: [
    { language: "es", courseId: "AI_DUMMIES_1DAY_EN_ES", ...}
  ]
}
```

---

## Navigation Examples

### 1. User Completes Level 1 English

**Scenario:** User finishes AI_DUMMIES_1DAY_EN

**System Actions:**
```typescript
// Find what comes next
const currentCourse = 'AI_DUMMIES_1DAY_EN';
const currentLanguage = 'en';

// Get next level in same language
const nextCourse = await getNextLevelCourse(currentCourse, currentLanguage);
// Returns: 'AI_ESSENTIALS_3DAY_EN'

// Suggest to user:
"Congratulations! Ready for the next level?
 → AI Essentials - 3 Days to Practical Skills"
```

### 2. User Switches to Spanish at Level 1

**Scenario:** User viewing AI_DUMMIES_1DAY_EN, wants Spanish

**System Actions:**
```typescript
const currentCourse = 'AI_DUMMIES_1DAY_EN';
const targetLanguage = 'es';

// Find Spanish variant at same level
const spanishCourse = await getVariantCourse(currentCourse, targetLanguage);
// Returns: 'AI_DUMMIES_1DAY_EN_ES'

// Navigate to Spanish version
```

### 3. User at Level 2, Wants to Switch to Spanish

**Scenario:** User viewing AI_ESSENTIALS_3DAY_EN, wants Spanish

**System Actions:**
```typescript
const currentCourse = 'AI_ESSENTIALS_3DAY_EN';
const targetLanguage = 'es';

// Try to find Spanish variant at same level
const spanishCourse = await getVariantCourse(currentCourse, targetLanguage);
// Returns: null (doesn't exist yet)

// Show message:
"Spanish version of this level is not available yet.
 Available languages: English
 Would you like to continue in English?"
```

### 4. Show Complete Learning Path

**Scenario:** User wants to see entire AI learning path

**System Actions:**
```typescript
const matrix = await getCourseMatrix('AI_LEARNING_PATH_2026', 'en');

// Returns:
{
  family: "AI Learning Path - From Beginner to Expert",
  currentLevel: 1,
  totalLevels: 4,
  currentLanguage: "en",
  levels: [
    {
      level: 1,
      type: "1day_beginner",
      available: true,
      courseId: "AI_DUMMIES_1DAY_EN",
      languages: ["en", "es"],
      status: "completed"  // If user finished it
    },
    {
      level: 2,
      type: "3day_essentials",
      available: true,
      courseId: "AI_ESSENTIALS_3DAY_EN",
      languages: ["en"],
      status: "current"  // User's next course
    },
    {
      level: 3,
      type: "7day_intermediate",
      available: false,
      courseId: null,
      languages: [],
      status: "locked"  // Not created yet
    },
    {
      level: 4,
      type: "30day_advanced",
      available: false,
      courseId: null,
      languages: [],
      status: "locked"
    }
  ]
}

// UI renders:
✓ Level 1: AI for Dummies (1 day) - COMPLETED
→ Level 2: AI Essentials (3 days) - CURRENT
  Level 3: Coming Soon
  Level 4: Coming Soon
```

---

## Implementation Plan

### Phase 1: Enhance CCS Model (2 hours)

**1.1 Update CCS Interface**
- Add `ICourseLevel` interface
- Add `courseLevels` field to ICCS
- Add level navigation methods
- Keep existing language methods (backward compat)

**1.2 Update Schema**
- Add `courseLevels` field (optional for migration)
- Add indexes for level queries
- Implement helper methods

**1.3 Validation**
- Validate level sequence (1, 2, 3, not 1, 3, 5)
- Validate unique language per level
- Validate courseId references exist

### Phase 2: Migration Script (2 hours)

**2.1 Identify Course Families**
```typescript
// Group courses by CCS
// For NO_CCS courses, infer family from prerequisites
```

**2.2 Build Level Structure**
```typescript
// Use prerequisiteCourseIds to build dependency graph
// Topological sort to assign level numbers
// Group by level to find language variants
```

**2.3 Create Unified CCS**
```typescript
// For AI courses:
// 1. Create AI_LEARNING_PATH_2026 CCS
// 2. Populate courseLevels array
// 3. Update all courses with new ccsId
// 4. Validate matrix integrity
```

**2.4 Migrate Existing CCS**
```typescript
// For AI_DUMMIES_1DAY_EN CCS:
// 1. Transform to new structure
// 2. Add AI_ESSENTIALS to Level 2
// 3. Keep old fields for backward compat
```

### Phase 3: Helper Functions (1 hour)

**3.1 Level Navigation**
```typescript
// app/lib/course-helpers.ts

export async function getNextLevelCourse(
  courseId: string,
  language?: string
): Promise<string | null>;

export async function getPreviousLevelCourse(
  courseId: string,
  language?: string
): Promise<string | null>;

export async function getAllLevelsForLanguage(
  courseId: string,
  language: string
): Promise<string[]>;

export async function getCourseLevel(
  courseId: string
): Promise<number | null>;

export async function getCourseAtLevelAndLanguage(
  ccsId: string,
  level: number,
  language: string
): Promise<string | null>;
```

**3.2 Matrix Queries**
```typescript
export async function getCourseMatrix(
  ccsId: string,
  currentCourseId?: string
): Promise<CourseMatrix>;

export async function getLevelInfo(
  courseId: string
): Promise<LevelInfo | null>;
```

### Phase 4: UI Components (1 hour)

**4.1 LevelSwitcher Component**
```tsx
// app/components/LevelSwitcher.tsx

interface LevelSwitcherProps {
  courseId: string;
  currentLevel: number;
  showLabels?: boolean;
}

// Shows:
// ← Previous Level  |  Next Level →
```

**4.2 CourseMatrix Component**
```tsx
// app/components/CourseMatrix.tsx

interface CourseMatrixProps {
  ccsId: string;
  currentCourseId?: string;
  highlightLanguage?: string;
}

// Shows full matrix grid with:
// - Levels (vertical)
// - Languages (horizontal)
// - Current position highlighted
// - Available courses clickable
// - Missing courses grayed out
```

**4.3 LearningPath Component**
```tsx
// app/components/LearningPath.tsx

// Shows vertical progression:
// ✓ Level 1 (Completed)
// → Level 2 (Current)
//   Level 3 (Locked)
//   Level 4 (Locked)
```

### Phase 5: Testing & Documentation (1 hour)

**5.1 Test Matrix Navigation**
- Horizontal (language) switching ✅ (already works)
- Vertical (level) progression ⚠️ (new)
- Diagonal (level + language) ⚠️ (new)
- Matrix visualization ⚠️ (new)

**5.2 Validate Prerequisites**
- Ensure prerequisiteCourseIds align with level structure
- Verify level N+1 requires level N

**5.3 Update Documentation**
- Add to HANDOVER.md
- Create COURSE_MATRIX_GUIDE.md
- Update course creation requirements

---

## Success Criteria

### ✅ Matrix Navigation Works When:

1. **Horizontal (Language)**
   - [x] User can switch from English to Spanish at Level 1
   - [ ] User sees "not available" message for missing Spanish at Level 2
   - [x] LanguageSwitcher shows all available languages

2. **Vertical (Level)**
   - [ ] User can go from Level 1 to Level 2 in English
   - [ ] System suggests next level after course completion
   - [ ] LevelSwitcher shows previous/next levels

3. **Diagonal (Both)**
   - [ ] User can jump from Level 1 English to Level 2 Spanish (if exists)
   - [ ] Matrix shows gaps clearly

4. **System Intelligence**
   - [ ] Recommends next course based on user's language + progress
   - [ ] Shows learning path with user's current position
   - [ ] Handles incomplete matrix gracefully

5. **Backward Compatibility**
   - [ ] Existing language navigation still works
   - [ ] Old courses without levels still render
   - [ ] Migration is non-breaking

---

## Migration Strategy for Existing Courses

### Step 1: Create Unified CCS

```typescript
// Create AI_LEARNING_PATH_2026
const newCCS = await CCS.create({
  ccsId: 'AI_LEARNING_PATH_2026',
  name: 'AI Learning Path - From Beginner to Expert',
  originalLanguage: 'en',
  originalCourseId: 'AI_DUMMIES_1DAY_EN',
  courseLevels: [
    {
      level: 1,
      levelType: '1day_beginner',
      difficulty: 'beginner',
      estimatedHours: 8,
      courseVariants: [
        { language: 'en', courseId: 'AI_DUMMIES_1DAY_EN', translationStatus: 'published' },
        { language: 'es', courseId: 'AI_DUMMIES_1DAY_EN_ES', translationStatus: 'published' }
      ]
    },
    {
      level: 2,
      levelType: '3day_essentials',
      difficulty: 'intermediate',
      estimatedHours: 24,
      courseVariants: [
        { language: 'en', courseId: 'AI_ESSENTIALS_3DAY_EN', translationStatus: 'published' }
      ]
    }
  ],
  totalLevels: 2
});
```

### Step 2: Update Course Documents

```typescript
// Update all 3 courses to point to new CCS
await Course.updateOne(
  { courseId: 'AI_DUMMIES_1DAY_EN' },
  { $set: { ccsId: 'AI_LEARNING_PATH_2026' } }
);

await Course.updateOne(
  { courseId: 'AI_DUMMIES_1DAY_EN_ES' },
  { $set: { ccsId: 'AI_LEARNING_PATH_2026' } }
);

await Course.updateOne(
  { courseId: 'AI_ESSENTIALS_3DAY_EN' },
  { $set: { ccsId: 'AI_LEARNING_PATH_2026' } }
);
```

### Step 3: Delete Old CCS

```typescript
// Remove old CCS (or keep for archival)
await CCS.deleteOne({ ccsId: 'AI_DUMMIES_1DAY_EN' });
```

### Step 4: Verify

```typescript
// Test navigation
const next = await getNextLevelCourse('AI_DUMMIES_1DAY_EN', 'en');
// Should return: 'AI_ESSENTIALS_3DAY_EN'

const prev = await getPreviousLevelCourse('AI_ESSENTIALS_3DAY_EN', 'en');
// Should return: 'AI_DUMMIES_1DAY_EN'

const matrix = await getCourseMatrix('AI_LEARNING_PATH_2026');
// Should show 2x2 matrix (2 levels x 2 languages)
```

---

## Commands

```bash
# Analyze current courses
npx tsx --env-file=.env.local scripts/analyze-course-families.ts

# Migrate to matrix structure
npm run migrate:course-matrix

# Verify matrix
npx tsx --env-file=.env.local scripts/verify-course-matrix.ts

# Test navigation
npx tsx --env-file=.env.local scripts/test-matrix-navigation.ts
```

---

## Risk Mitigation

### Risk 1: Breaking Existing Language Navigation
**Mitigation:** Keep `languageVariants` field (deprecated but functional)

### Risk 2: Data Loss During Migration
**Mitigation:** Dry-run mode, database backup, rollback script

### Risk 3: Incomplete Matrix
**Mitigation:** UI gracefully shows gaps, helper functions return `null`

### Risk 4: Complex Migration
**Mitigation:** Start with AI courses only, expand to others later

---

## Next Steps

1. **Approve Design** - Confirm this structure meets requirements
2. **Begin Phase 1** - Enhance CCS model
3. **Run Migration** - Convert existing AI courses
4. **Build UI** - Create matrix visualization
5. **Test End-to-End** - Verify all navigation patterns work

---

**Status:** 📋 **READY FOR IMPLEMENTATION**  
**Estimated Time:** 7 hours  
**Priority:** High (completes the course matrix)
