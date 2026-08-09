# Course Matrix Analysis & Design

**Date**: 2026-08-09  
**Purpose**: Establish complete matrix navigation for courses (vertical levels + horizontal languages)

---

## Current State Assessment

### ✅ What We Have (Horizontal - Languages)

**Language Variants (CCS-based):**
```
AI_DUMMIES_1DAY_EN ←→ AI_DUMMIES_1DAY_EN_ES
       (English)            (Spanish)
```

**Tracking:**
- ✅ CCS tracks `originalLanguage`, `originalCourseId`
- ✅ CCS tracks `languageVariants[]` array
- ✅ Helper functions for language navigation
- ✅ UI component (`LanguageSwitcher`)

### ⚠️ What We're Missing (Vertical - Levels)

**Level Progression (Partially exists):**
```
Course model has:
- prerequisiteCourseIds (can point to previous level)
- metadata.difficulty ('beginner' | 'intermediate' | 'advanced')
- courseVariant ('essentials' | 'beginner' | 'full_program')
```

**Problems:**
- ❌ No explicit "nextLevel" or "previousLevel" tracking
- ❌ No level sequence in CCS
- ❌ No helper functions for level navigation
- ❌ No UI component for level switcher
- ❌ Bidirectional navigation incomplete (can't easily find "what comes after this?")

---

## Desired Matrix Structure

```
COURSE MATRIX VISUALIZATION:

                    HORIZONTAL (Languages)
                    EN    ES    ZH    FR    ...
                    ↓     ↓     ↓     ↓
VERTICAL  Level 1   ●─────●─────●─────●     Beginner
(Levels)            │     │     │     │
          Level 2   ●─────●─────●─────●     Intermediate
                    │     │     │     │
          Level 3   ●─────●─────●─────●     Advanced
                    │     │     │     │
          Level 4   ●─────●─────●─────●     Expert

Legend:
● = Course instance
─ = Horizontal connection (language variant)
│ = Vertical connection (level progression)
```

**Example (AI Course Family):**
```
                EN                     ES                     ZH
Level 1   AI_BEGINNER_EN  ←→  AI_BEGINNER_ES  ←→  AI_BEGINNER_ZH
             ↓                      ↓                    ↓
Level 2   AI_INTER_EN     ←→  AI_INTER_ES     ←→  AI_INTER_ZH
             ↓                      ↓                    ↓
Level 3   AI_ADVANCED_EN  ←→  AI_ADVANCED_ES  ←→  AI_ADVANCED_ZH
             ↓                      ↓                    ↓
Level 4   AI_EXPERT_EN    ←→  AI_EXPERT_ES    ←→  AI_EXPERT_ZH
```

---

## Design: Course Matrix System

### Level Types

**Option 1: Sequential Numbering**
```typescript
level: 1, 2, 3, 4, ...
```

**Option 2: Named Levels**
```typescript
level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master'
```

**Option 3: Flexible Descriptors** ⭐ **RECOMMENDED**
```typescript
levelType: 'essentials' | '1day' | '7day' | '30day' | 'foundations' | 'mastery'
levelOrder: 1, 2, 3, 4, 5, ...
```

**Why Option 3?**
- Preserves existing `courseVariant` field
- Allows meaningful names (not just numbers)
- `levelOrder` provides clear sequencing
- Flexible for different course families

### Enhanced CCS Structure

```typescript
interface ICourseLevel {
  level: number;              // 1, 2, 3, 4, ...
  levelType: string;          // 'beginner', 'essentials', '1day', etc.
  courseVariants: {           // All language variants at this level
    language: string;
    courseId: string;
    translationStatus: 'draft' | 'review' | 'published';
    translatedAt?: Date;
    translatedBy?: string;
    qualityScore?: number;
  }[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours?: number;
  description?: string;
}

interface ICCS {
  // Existing fields...
  ccsId: string;
  name: string;
  originalLanguage: string;
  originalCourseId: string;
  
  // NEW: Level progression tracking
  courseLevels: ICourseLevel[];    // Ordered array of levels
  totalLevels: number;              // Computed: courseLevels.length
  
  // NEW: Helper methods for level navigation
  getLevelByNumber(level: number): ICourseLevel | undefined;
  getLevelByCourseId(courseId: string): ICourseLevel | undefined;
  getNextLevel(currentLevel: number): ICourseLevel | undefined;
  getPreviousLevel(currentLevel: number): ICourseLevel | undefined;
  getCourseAtLevel(level: number, language: string): string | undefined;
  hasLevel(level: number): boolean;
}
```

### Data Structure Example

```typescript
CCS {
  ccsId: "AI_COURSE_FAMILY_2026",
  name: "AI Learning Path",
  originalLanguage: "en",
  originalCourseId: "AI_BEGINNER_EN",
  
  courseLevels: [
    {
      level: 1,
      levelType: "beginner",
      difficulty: "beginner",
      estimatedHours: 8,
      description: "Introduction to AI concepts",
      courseVariants: [
        { language: "en", courseId: "AI_BEGINNER_EN", translationStatus: "published" },
        { language: "es", courseId: "AI_BEGINNER_ES", translationStatus: "published" },
        { language: "zh", courseId: "AI_BEGINNER_ZH", translationStatus: "draft" }
      ]
    },
    {
      level: 2,
      levelType: "intermediate",
      difficulty: "intermediate",
      estimatedHours: 20,
      description: "Practical AI applications",
      courseVariants: [
        { language: "en", courseId: "AI_INTER_EN", translationStatus: "published" },
        { language: "es", courseId: "AI_INTER_ES", translationStatus: "review" }
      ]
    },
    {
      level: 3,
      levelType: "advanced",
      difficulty: "advanced",
      estimatedHours: 30,
      description: "Advanced AI techniques",
      courseVariants: [
        { language: "en", courseId: "AI_ADVANCED_EN", translationStatus: "published" }
      ]
    }
  ],
  
  totalLevels: 3
}
```

---

## Matrix Navigation Patterns

### 1. Horizontal Navigation (Language Switching)
**Already Implemented ✅**

```typescript
// From any course, find Spanish variant
const spanishCourse = await getVariantCourse('AI_BEGINNER_EN', 'es');
// Returns: 'AI_BEGINNER_ES'
```

### 2. Vertical Navigation (Level Progression)
**Need to Implement ⚠️**

```typescript
// From any course, find next level in same language
const nextCourse = await getNextLevelCourse('AI_BEGINNER_EN');
// Should return: 'AI_INTER_EN'

// From any course, find previous level in same language
const prevCourse = await getPreviousLevelCourse('AI_INTER_EN');
// Should return: 'AI_BEGINNER_EN'

// Get all levels for current language
const allLevels = await getAllLevelsForLanguage('AI_BEGINNER_EN');
// Should return: ['AI_BEGINNER_EN', 'AI_INTER_EN', 'AI_ADVANCED_EN']
```

### 3. Diagonal Navigation (Level + Language)
**Need to Implement ⚠️**

```typescript
// From AI_BEGINNER_EN, go to Level 2 in Spanish
const course = await getCourseAtLevelAndLanguage('AI_BEGINNER_EN', 2, 'es');
// Should return: 'AI_INTER_ES'

// Get entire matrix
const matrix = await getCourseMatrix('AI_COURSE_FAMILY_2026');
// Returns: {
//   levels: 3,
//   languages: ['en', 'es', 'zh'],
//   matrix: [
//     [AI_BEGINNER_EN, AI_BEGINNER_ES, AI_BEGINNER_ZH],
//     [AI_INTER_EN, AI_INTER_ES, null],
//     [AI_ADVANCED_EN, null, null]
//   ]
// }
```

---

## Backward Compatibility Strategy

### Approach: Gradual Migration

**Phase 1: Extend CCS (Non-Breaking)**
- Add optional `courseLevels` field to CCS
- Existing CCS without `courseLevels` still work
- Helper functions return `null` if no levels defined

**Phase 2: Migrate Existing Courses**
- Script identifies course families by naming patterns
- Groups courses by level indicators in courseId
- Populates `courseLevels` array
- Validates with course metadata (difficulty, prerequisiteCourseIds)

**Phase 3: Enable Matrix Navigation**
- Helper functions work for migrated courses
- UI components render level switcher
- Catalog shows learning paths

---

## Migration Strategy

### Step 1: Identify Course Families

**Pattern Matching:**
```typescript
// Example patterns:
AI_DUMMIES_1DAY_EN     → Family: AI_DUMMIES, Level: 1day
AI_ESSENTIALS_3DAY_EN  → Family: AI_ESSENTIALS, Level: 3day (implied Level 2)
AI_ADVANCED_30DAY_EN   → Family: AI_ADVANCED, Level: 30day (implied Level 3)
```

**Course.prerequisiteCourseIds:**
```typescript
// If AI_INTER_EN has prerequisiteCourseIds: [AI_BEGINNER_EN._id]
// Then: AI_BEGINNER_EN is Level N, AI_INTER_EN is Level N+1
```

**Course.metadata.difficulty:**
```typescript
// beginner → Level 1
// intermediate → Level 2
// advanced → Level 3
// expert → Level 4
```

### Step 2: Group by Level

**Algorithm:**
```typescript
1. For each CCS:
   a. Find all courses with matching ccsId
   b. Sort by prerequisiteCourseIds (build dependency graph)
   c. Assign level numbers (topological sort)
   d. Group by level (same level = language variants)
   e. Create courseLevels array

2. Validate:
   a. Each level has at least one course
   b. All language variants at same level
   c. Level sequence is continuous (1, 2, 3, not 1, 3, 5)
   d. prerequisiteCourseIds point to previous level
```

### Step 3: Populate CCS

**Script Output:**
```
Processing CCS: AI_COURSE_FAMILY_2026

Found courses:
  AI_BEGINNER_EN (difficulty: beginner, prerequisites: none)
  AI_BEGINNER_ES (difficulty: beginner, prerequisites: none)
  AI_INTER_EN (difficulty: intermediate, prerequisites: [AI_BEGINNER_EN])
  AI_INTER_ES (difficulty: intermediate, prerequisites: [AI_BEGINNER_ES])
  AI_ADVANCED_EN (difficulty: advanced, prerequisites: [AI_INTER_EN])

Level Assignment:
  Level 1: AI_BEGINNER_EN, AI_BEGINNER_ES
  Level 2: AI_INTER_EN, AI_INTER_ES
  Level 3: AI_ADVANCED_EN

✓ Created courseLevels array
✓ Updated CCS AI_COURSE_FAMILY_2026
```

---

## Current Repository State

### Existing Courses (from earlier work)

**AI Course Family:**
```
AI_DUMMIES_1DAY_EN     (English, Level: 1day)
AI_DUMMIES_1DAY_EN_ES  (Spanish, Level: 1day)
AI_ESSENTIALS_3DAY_EN  (English, Level: 3day - implied higher)
```

**Missing:**
- No explicit level tracking in CCS
- No level progression helpers
- No level switcher UI

### Naming Conventions

**Pattern:** `{TOPIC}_{LEVEL}_{LANGUAGE}`

Examples:
- `AI_DUMMIES_1DAY_EN` → Topic: AI_DUMMIES, Level: 1DAY, Language: EN
- `AI_ESSENTIALS_3DAY_EN` → Topic: AI_ESSENTIALS, Level: 3DAY, Language: EN

**Problem:** Different course families (DUMMIES vs ESSENTIALS) - are these separate families or levels?

**Recommendation:** Need to define course family structure:

**Option A: Separate Families**
```
Family: AI_DUMMIES      → Levels: [1DAY]
Family: AI_ESSENTIALS   → Levels: [3DAY]
```

**Option B: Single Family with Levels** ⭐ **RECOMMENDED**
```
Family: AI_LEARNING_PATH → Levels: [DUMMIES (1day), ESSENTIALS (3day), ADVANCED (30day)]
```

---

## Recommended Implementation Plan

### Phase 1: Enhance CCS Model (2 hours)
1. Add `courseLevels` array to ICCS interface
2. Add level helper methods
3. Add indexes for level queries
4. Maintain backward compatibility

### Phase 2: Migration Script (2 hours)
1. Analyze existing courses
2. Identify course families
3. Build level structure
4. Populate CCS.courseLevels
5. Validate integrity

### Phase 3: Helper Functions (1 hour)
1. `getNextLevelCourse(courseId, language?)`
2. `getPreviousLevelCourse(courseId, language?)`
3. `getAllLevelsForLanguage(courseId, language)`
4. `getCourseAtLevelAndLanguage(courseId, level, language)`
5. `getCourseMatrix(ccsId)`

### Phase 4: UI Components (1 hour)
1. `LevelSwitcher` component
2. `CourseMatrix` visualization
3. Learning path display
4. Progress indicator

### Phase 5: Testing & Documentation (1 hour)
1. Test matrix navigation
2. Verify prerequisites align with levels
3. Document course family structure
4. Update HANDOVER.md

**Total Estimated Time: 7 hours**

---

## Questions to Resolve

### 1. Course Family Definition
**Question:** Are AI_DUMMIES and AI_ESSENTIALS separate families or different levels?

**Recommendation:** Single family with levels:
- Level 1: AI_DUMMIES_1DAY (Beginner - 1 day)
- Level 2: AI_ESSENTIALS_3DAY (Intermediate - 3 days)
- Level 3: AI_ADVANCED_30DAY (Advanced - 30 days) [if exists]

### 2. Level Naming
**Question:** Use numeric levels (1, 2, 3) or descriptive names (1day, 3day, 30day)?

**Recommendation:** Both!
```typescript
{
  level: 1,
  levelType: "1day",
  difficulty: "beginner"
}
```

### 3. CCS per Family or per Level?
**Question:** One CCS for entire family or one per level?

**Recommendation:** One CCS per family ⭐
- CCS represents the entire learning path
- Contains all levels and languages
- Enables complete matrix navigation

### 4. How to Handle Partial Matrices?
**Question:** What if Level 2 Spanish doesn't exist yet?

**Recommendation:** Matrix shows gaps:
```
Level 1: [EN, ES, ZH]
Level 2: [EN, null, null]  ← Shows Spanish/Chinese not yet available
```

---

## Success Criteria

### Matrix Navigation Works When:
1. ✅ User can switch languages at same level
2. ✅ User can go to next/previous level in same language
3. ✅ User can see entire learning path with available languages
4. ✅ System suggests next course after completion
5. ✅ Prerequisites automatically map to previous levels
6. ✅ UI shows gaps in matrix (missing translations or levels)
7. ✅ Backward compatible with existing courses

---

## Next Steps

1. **Decision Needed:** Confirm course family structure (AI_DUMMIES vs AI_ESSENTIALS)
2. **Design Approval:** Review enhanced CCS structure
3. **Begin Implementation:** Phase 1 (Enhance CCS Model)

---

**Status:** 📋 ANALYSIS COMPLETE - AWAITING APPROVAL TO IMPLEMENT
