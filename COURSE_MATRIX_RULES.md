# Course Matrix Rules - Rigid Rule System

**Date**: 2026-08-09  
**Status**: Canonical Rules for Course Matrix Construction  

---

## Core Principles

### Rule 1: Origin Rule
**"Always start with US English beginner"**

- Every course family (CCS) MUST start with Level 1 in English (`en`)
- The first course must be at difficulty level `beginner`
- This is the **anchor point** of the matrix
- No other courses can exist without this origin

### Rule 2: Level Prerequisite Rule
**"Next level requires previous level in US English"**

- Level N+1 can only be created if Level N exists in English
- Level 2 requires Level 1 English to be `published`
- Level 3 requires Level 2 English to be `published`
- Level 4 requires Level 3 English to be `published`
- etc.

### Rule 3: Language Variant Rule
**"Language variants require English at same level"**

- Spanish Level 1 requires English Level 1 to be `published`
- Chinese Level 2 requires English Level 2 to be `published`
- A language variant can only be created if the English version at that level exists and is `published`

### Rule 4: Vertical Language Progression Rule
**"Language variants can only progress if previous level in SAME language exists"**

- Spanish Level 2 requires Spanish Level 1 to be `published`
- Chinese Level 3 requires Chinese Level 2 to be `published`
- Cannot skip levels within a language
- Each language follows its own vertical progression

---

## The Building Sequence

### Valid Construction Order

```
Step 1: Create English Level 1 (REQUIRED - ORIGIN)
  ✓ AI_DUMMIES_1DAY_EN (beginner, en)

Step 2: Can now create (choose one or more):
  Option A: English Level 2 (vertical progression)
    ✓ AI_ESSENTIALS_3DAY_EN (intermediate, en)
  
  Option B: Spanish Level 1 (horizontal variant)
    ✓ AI_DUMMIES_1DAY_ES (beginner, es)
  
  Option C: Chinese Level 1 (horizontal variant)
    ✓ AI_DUMMIES_1DAY_ZH (beginner, zh)

Step 3: After English Level 2 exists, can create:
  Option A: English Level 3 (vertical progression)
    ✓ AI_INTERMEDIATE_7DAY_EN (intermediate, en)
  
  Option B: Spanish Level 2 (requires Spanish L1 published)
    ✓ AI_ESSENTIALS_3DAY_ES (intermediate, es)
  
  Option C: Chinese Level 2 (requires Chinese L1 published)
    ✓ AI_ESSENTIALS_3DAY_ZH (intermediate, zh)
```

### Invalid Construction Attempts

❌ **Spanish Level 1 without English Level 1**
```
Attempt: Create AI_DUMMIES_1DAY_ES first
Error: "English Level 1 must exist before creating language variants"
```

❌ **English Level 2 without English Level 1**
```
Attempt: Create AI_ESSENTIALS_3DAY_EN without AI_DUMMIES_1DAY_EN
Error: "Previous level (1) in English must exist and be published"
```

❌ **Spanish Level 2 without Spanish Level 1**
```
Attempt: Create AI_ESSENTIALS_3DAY_ES when Spanish L1 doesn't exist
Error: "Previous level (1) in Spanish must exist and be published"
```

❌ **Spanish Level 2 without English Level 2**
```
Attempt: Create AI_ESSENTIALS_3DAY_ES when English L2 doesn't exist
Error: "English version of this level must exist and be published"
```

---

## Matrix Construction Rules

### Visual Rules

```
VALID MATRIX CONSTRUCTION:

                EN          ES          ZH
Level 1         ●  ────────→ ●  ────────→ ●
                ↓           ↓           ↓
Level 2         ●  ────────→ ●  ────────→ ●
                ↓           ↓           ↓
Level 3         ●  ────────→ ●  ────────→ ●

Construction Order:
1. Start: EN L1 (required)
2. Then: EN L2 OR ES L1 OR ZH L1 (any)
3. Then: EN L3 OR ES L2 (if ES L1 exists) OR ZH L2 (if ZH L1 exists)
4. Continue building...

Rules:
→ Horizontal (language variant): Requires EN at same level to be published
↓ Vertical (next level): Requires previous level in SAME language to be published
```

```
INVALID MATRIX CONSTRUCTION:

                EN          ES          ZH
Level 1         ○           ●           ○
                            ↓
Level 2         ●           ●           ○

ERROR: Spanish L1 created before English L1 ❌
ERROR: Spanish L2 exists but English L2 doesn't ❌
```

---

## Validation Rules (Code Implementation)

### Rule 1: Origin Validation
```typescript
function validateOriginExists(ccsId: string): boolean {
  const ccs = await CCS.findOne({ ccsId });
  const level1 = ccs.getLevelByNumber(1);
  
  if (!level1) {
    throw new Error('Level 1 must exist before creating other levels');
  }
  
  const englishL1 = level1.courseVariants.find(v => 
    v.language === 'en' && v.translationStatus === 'published'
  );
  
  if (!englishL1) {
    throw new Error('English Level 1 must exist and be published');
  }
  
  return true;
}
```

### Rule 2: Level Prerequisite Validation
```typescript
function validateLevelPrerequisite(
  ccsId: string, 
  level: number
): boolean {
  if (level === 1) return true; // Level 1 has no prerequisite
  
  const ccs = await CCS.findOne({ ccsId });
  const previousLevel = ccs.getLevelByNumber(level - 1);
  
  if (!previousLevel) {
    throw new Error(`Level ${level - 1} must exist before creating Level ${level}`);
  }
  
  const englishPrevious = previousLevel.courseVariants.find(v => 
    v.language === 'en' && v.translationStatus === 'published'
  );
  
  if (!englishPrevious) {
    throw new Error(`English Level ${level - 1} must be published before creating Level ${level}`);
  }
  
  return true;
}
```

### Rule 3: Language Variant Validation
```typescript
function validateLanguageVariant(
  ccsId: string,
  level: number,
  language: string
): boolean {
  if (language === 'en') return true; // English is always allowed
  
  const ccs = await CCS.findOne({ ccsId });
  const currentLevel = ccs.getLevelByNumber(level);
  
  if (!currentLevel) {
    throw new Error(`Level ${level} does not exist`);
  }
  
  const englishVersion = currentLevel.courseVariants.find(v => 
    v.language === 'en' && v.translationStatus === 'published'
  );
  
  if (!englishVersion) {
    throw new Error(`English version of Level ${level} must exist and be published before creating ${language} variant`);
  }
  
  return true;
}
```

### Rule 4: Vertical Language Progression Validation
```typescript
function validateVerticalProgression(
  ccsId: string,
  level: number,
  language: string
): boolean {
  if (level === 1) return true; // Level 1 has no prerequisite
  
  const ccs = await CCS.findOne({ ccsId });
  const previousLevel = ccs.getLevelByNumber(level - 1);
  
  if (!previousLevel) {
    throw new Error(`Level ${level - 1} must exist`);
  }
  
  const previousInSameLanguage = previousLevel.courseVariants.find(v => 
    v.language === language && v.translationStatus === 'published'
  );
  
  if (!previousInSameLanguage) {
    throw new Error(`${language} Level ${level - 1} must exist and be published before creating ${language} Level ${level}`);
  }
  
  return true;
}
```

### Combined Validation
```typescript
function validateCourseAddition(
  ccsId: string,
  level: number,
  language: string
): ValidationResult {
  const errors: string[] = [];
  
  try {
    // Rule 1: Origin must exist (except when creating origin)
    if (!(level === 1 && language === 'en')) {
      validateOriginExists(ccsId);
    }
  } catch (error) {
    errors.push(error.message);
  }
  
  try {
    // Rule 2: Previous level in English must exist
    validateLevelPrerequisite(ccsId, level);
  } catch (error) {
    errors.push(error.message);
  }
  
  try {
    // Rule 3: English version at same level must exist
    validateLanguageVariant(ccsId, level, language);
  } catch (error) {
    errors.push(error.message);
  }
  
  try {
    // Rule 4: Previous level in same language must exist
    validateVerticalProgression(ccsId, level, language);
  } catch (error) {
    errors.push(error.message);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    canProceed: errors.length === 0,
  };
}
```

---

## Status Requirements

### Published Status Requirement

All prerequisite checks require courses to be in `published` status:
- `draft` courses do NOT satisfy prerequisites
- `review` courses do NOT satisfy prerequisites
- Only `published` courses count as "existing" for prerequisites

**Example:**
```typescript
// Spanish L1 is in 'review' status
const spanishL1 = { language: 'es', translationStatus: 'review' };

// Attempt to create Spanish L2
validateVerticalProgression(ccsId, 2, 'es');
// ❌ Error: "Spanish Level 1 must exist and be published"
// Because 'review' ≠ 'published'
```

---

## Matrix Building Strategy

### Recommended Approach

**1. Foundation First (Vertical English Spine)**
```
Priority 1: Build all English levels first
  1. English Level 1 ✓
  2. English Level 2 ✓
  3. English Level 3
  4. English Level 4
```

**2. Then Horizontal Expansion (Level by Level)**
```
Priority 2: Translate Level 1 to all languages
  1. Spanish Level 1 ✓
  2. Chinese Level 1
  3. French Level 1
  4. etc.

Priority 3: Translate Level 2 to all languages (where L1 exists)
  1. Spanish Level 2 (requires Spanish L1 published)
  2. Chinese Level 2 (requires Chinese L1 published)
  3. etc.
```

**Alternative: Language-Focused Approach**
```
Priority 1: Complete one language path
  1. English Level 1 ✓
  2. English Level 2 ✓
  3. Spanish Level 1 ✓
  4. Spanish Level 2 (complete Spanish path)
  5. English Level 3
  6. Spanish Level 3
```

---

## Error Messages

### User-Friendly Error Messages

```typescript
const ERROR_MESSAGES = {
  MISSING_ORIGIN: 'Cannot create this course. You must first create the English Beginner course (Level 1).',
  
  MISSING_ENGLISH_LEVEL: (level: number) => 
    `Cannot create this course. English Level ${level} must be created and published first.`,
  
  MISSING_PREVIOUS_LEVEL_ENGLISH: (level: number) => 
    `Cannot create Level ${level}. You must first create and publish English Level ${level - 1}.`,
  
  MISSING_PREVIOUS_LEVEL_LANGUAGE: (level: number, language: string) => 
    `Cannot create ${language} Level ${level}. You must first create and publish ${language} Level ${level - 1}.`,
  
  NOT_PUBLISHED: (courseId: string) => 
    `Course ${courseId} exists but is not published. Publish it before creating dependent courses.`,
  
  INVALID_FIRST_COURSE: 
    'The first course in a family must be English Level 1 (Beginner).',
};
```

---

## Enforcement Points

### Where Rules Are Enforced

1. **CCS.addCourseToLevel()** - Validate before adding
2. **CCS.createLevel()** - Validate level prerequisites
3. **Translation import script** - Validate before import
4. **Admin UI** - Show/hide create buttons based on rules
5. **API endpoints** - Validate in course creation API

---

## Migration Script Considerations

### Backfilling Existing Courses

When migrating existing courses that don't follow these rules:
1. Identify violations
2. Mark courses as `draft` if prerequisites missing
3. Log warnings for manual review
4. DO NOT auto-publish rule-violating courses

---

## Benefits of This Rule System

### For Content Team
✅ Clear, predictable structure  
✅ No confusion about build order  
✅ Prevents incomplete learning paths  
✅ Ensures quality progression  

### For Developers
✅ Simple validation logic  
✅ Clear error messages  
✅ Prevents data inconsistencies  
✅ Easy to test  

### For Users
✅ Complete learning paths  
✅ No dead-end translations  
✅ Consistent progression  
✅ Reliable language switching  

---

## Examples

### Example 1: Building AI Learning Path (Correct)

```typescript
// Step 1: Create origin (English L1)
await ccs.createLevel(1, '1day_beginner', 'beginner', 8);
await ccs.addCourseToLevel(1, 'AI_DUMMIES_1DAY_EN', 'en');
await publishCourse('AI_DUMMIES_1DAY_EN');
// ✅ SUCCESS

// Step 2: Create Spanish L1 (horizontal)
await ccs.addCourseToLevel(1, 'AI_DUMMIES_1DAY_ES', 'es');
// ✅ SUCCESS - English L1 published

// Step 3: Create English L2 (vertical)
await ccs.createLevel(2, '3day_essentials', 'intermediate', 24);
await ccs.addCourseToLevel(2, 'AI_ESSENTIALS_3DAY_EN', 'en');
await publishCourse('AI_ESSENTIALS_3DAY_EN');
// ✅ SUCCESS - English L1 published

// Step 4: Create Spanish L2 (requires Spanish L1 + English L2)
await publishCourse('AI_DUMMIES_1DAY_ES'); // Publish Spanish L1 first
await ccs.addCourseToLevel(2, 'AI_ESSENTIALS_3DAY_ES', 'es');
// ✅ SUCCESS - Both prerequisites met
```

### Example 2: Building AI Learning Path (Incorrect)

```typescript
// Attempt: Create Spanish L1 first (no English L1)
await ccs.createLevel(1, '1day_beginner', 'beginner', 8);
await ccs.addCourseToLevel(1, 'AI_DUMMIES_1DAY_ES', 'es');
// ❌ ERROR: "English Level 1 must exist and be published"

// Attempt: Create English L2 before L1 is published
await ccs.createLevel(1, '1day_beginner', 'beginner', 8);
await ccs.addCourseToLevel(1, 'AI_DUMMIES_1DAY_EN', 'en');
// Course is still in 'draft' status
await ccs.createLevel(2, '3day_essentials', 'intermediate', 24);
// ❌ ERROR: "English Level 1 must be published before creating Level 2"

// Attempt: Create Spanish L2 without Spanish L1
await ccs.addCourseToLevel(2, 'AI_ESSENTIALS_3DAY_ES', 'es');
// ❌ ERROR: "Spanish Level 1 must exist and be published"
```

---

## Summary

**The Four Immutable Rules:**

1. **Origin Rule**: Start with English Level 1 (beginner)
2. **Level Prerequisite**: Level N requires English Level N-1 published
3. **Language Variant**: Language L at level N requires English at level N published
4. **Vertical Progression**: Language L at level N requires Language L at level N-1 published

**Status Requirement:** All prerequisites must be `published` (not `draft` or `review`)

**Result:** A clean, predictable matrix that builds logically from origin → completion

---

**Status:** ✅ Rules Defined - Ready for Implementation
