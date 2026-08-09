# Language Variant Tracking System - Implementation Plan

**Date**: 2026-08-09  
**Priority**: High  
**Estimated Effort**: 4-6 hours  
**Status**: Ready for Implementation  

---

## Executive Summary

Implement a reliable bidirectional connection between courses and their language variants through an enhanced CCS (Canonical Course Spec) model. This enables efficient language switching, translation tracking, and multi-language course management.

---

## Design Principles

### 1. **Backward Compatibility**
- Existing courses continue to work without changes
- Migration script handles backfilling
- No breaking changes to existing APIs

### 2. **Single Source of Truth**
- CCS is the authority for language variants
- No duplicate tracking in multiple places
- Consistent state across system

### 3. **Performance**
- Indexed lookups (no collection scans)
- Efficient queries for UI components
- Cached language lists

### 4. **Data Integrity**
- Validation on variant addition
- Unique language constraint per CCS
- Atomic updates with transactions

### 5. **Extensibility**
- Room for future metadata (quality scores, translator info)
- Support for translation workflows (draft → review → published)
- Audit trail of translations

---

## Architecture Design

### Data Model

```
┌─────────────────────────────────────────────────────────┐
│                    CCS (Enhanced)                       │
├─────────────────────────────────────────────────────────┤
│ ccsId: "AI_DUMMIES_1DAY_EN"                            │
│ name: "AI for Dummies"                                  │
│ originalLanguage: "en"              ← NEW              │
│ originalCourseId: "AI_DUMMIES_1DAY_EN"  ← NEW         │
│ availableLanguages: ["en", "es"]   ← NEW              │
│ languageVariants: [                ← NEW              │
│   {                                                     │
│     language: "es",                                     │
│     courseId: "AI_DUMMIES_1DAY_EN_ES",                │
│     translationStatus: "published",                     │
│     translatedAt: Date,                                 │
│     translatedBy: "agent",                              │
│     qualityScore: 75                                    │
│   }                                                     │
│ ]                                                       │
└─────────────────────────────────────────────────────────┘
         ↑                           ↑
         │                           │
         │ ccsId                     │ ccsId
         │                           │
┌────────┴────────┐          ┌──────┴──────────┐
│ Course (EN)     │          │ Course (ES)     │
├─────────────────┤          ├─────────────────┤
│ courseId: ...EN │          │ courseId: ...ES │
│ language: "en"  │          │ language: "es"  │
│ ccsId: "..."    │          │ ccsId: "..."    │
└─────────────────┘          └─────────────────┘
```

### Data Flow

**1. Course Creation (Original):**
```
User creates English course
  → Create Course document
  → Create CCS document
     - originalLanguage = "en"
     - originalCourseId = courseId
     - availableLanguages = ["en"]
     - languageVariants = []
```

**2. Translation:**
```
Translate English → Spanish
  → Create Spanish Course document
     - ccsId = original course's ccsId
  → Update CCS document
     - Add to availableLanguages: "es"
     - Add to languageVariants: { language: "es", courseId: "..." }
```

**3. Lookup:**
```
Get language variants for course
  → Find Course by courseId
  → Find CCS by course.ccsId
  → Return CCS.languageVariants
```

---

## Implementation Steps

### Phase 1: Core Model Enhancement (1-2 hours)

#### Step 1.1: Update CCS Model Schema
**File**: `app/lib/models/ccs.ts`

**Changes:**
1. Add `ILanguageVariantRef` interface
2. Add new fields to `ICCS` interface
3. Update Mongoose schema
4. Add indexes for performance
5. Add validation logic

**Code:**
```typescript
export interface ILanguageVariantRef {
  language: string;              // ISO 639-1 code (lowercase)
  courseId: string;              // Reference to Course.courseId
  translationStatus: 'draft' | 'review' | 'published';
  translatedAt?: Date;
  translatedBy?: string;         // Agent or user identifier
  qualityScore?: number;         // 0-100 from audit
  notes?: string;                // Optional translator notes
}

export interface ICCS extends Document {
  // Existing fields
  ccsId: string;
  name?: string;
  idea?: string;
  outline?: string;
  relatedDocuments?: IRelatedDocument[];
  
  // NEW: Language variant tracking
  originalLanguage: string;      // Required, default 'en'
  originalCourseId: string;      // Required, reference to original course
  availableLanguages: string[];  // Computed array of available languages
  languageVariants: ILanguageVariantRef[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // NEW: Helper methods
  addLanguageVariant(courseId: string, language: string, translatedBy?: string): Promise<void>;
  updateVariantStatus(language: string, status: string, qualityScore?: number): Promise<void>;
  removeLanguageVariant(language: string): Promise<void>;
  getVariantByLanguage(language: string): ILanguageVariantRef | undefined;
  hasLanguage(language: string): boolean;
}
```

**Validation Rules:**
- `originalLanguage`: Must be valid ISO 639-1 code
- `originalCourseId`: Must reference an existing course
- `languageVariants[].language`: Must be unique within array
- `languageVariants[].courseId`: Must reference an existing course
- `availableLanguages`: Automatically computed from variants + original

**Indexes:**
```typescript
CCSSchema.index({ originalCourseId: 1 });
CCSSchema.index({ 'languageVariants.courseId': 1 });
CCSSchema.index({ 'languageVariants.language': 1 });
CCSSchema.index({ availableLanguages: 1 });
```

#### Step 1.2: Implement Helper Methods
**File**: `app/lib/models/ccs.ts`

**Methods to Add:**

1. **addLanguageVariant()**
   - Validates language not already present
   - Validates courseId exists
   - Adds to languageVariants array
   - Updates availableLanguages array
   - Saves document

2. **updateVariantStatus()**
   - Finds variant by language
   - Updates status and optional qualityScore
   - Saves document

3. **removeLanguageVariant()**
   - Removes variant from array
   - Updates availableLanguages
   - Saves document

4. **getVariantByLanguage()**
   - Returns variant object or undefined

5. **hasLanguage()**
   - Checks if language exists in availableLanguages

**Error Handling:**
- Throw descriptive errors
- Validate before database operations
- Use transactions for multi-step operations

---

### Phase 2: Migration & Backfill (1 hour)

#### Step 2.1: Create Migration Script
**File**: `scripts/migrate-ccs-language-variants.ts`

**Logic:**
```typescript
1. Find all CCS documents
2. For each CCS:
   a. Find all courses with matching ccsId
   b. If no courses found, skip (orphaned CCS)
   c. Identify original course:
      - Prefer course with language='en'
      - Fallback to oldest course (createdAt)
   d. Set originalLanguage and originalCourseId
   e. Build languageVariants array from other courses
   f. Build availableLanguages array
   g. Save CCS document
3. Verify: Count updated vs skipped
4. Report results
```

**Safety Features:**
- Dry-run mode (preview changes without saving)
- Backup prompt before execution
- Detailed logging of each change
- Rollback capability

**Example Output:**
```
🔄 CCS Language Variant Migration
==================================

Dry Run: YES (use --execute to apply changes)

Found 12 CCS documents

✓ AI_DUMMIES_1DAY_EN
  Original: AI_DUMMIES_1DAY_EN (en)
  Variants: AI_DUMMIES_1DAY_EN_ES (es)
  Available: en, es

⚠ PRODUCTIVITY_2026
  No linked courses - skipped

... (continue for all CCS)

Summary:
  Total CCS: 12
  Updated: 1
  Skipped: 11 (no courses)
  
To apply changes, run:
  npm run migrate:ccs-language-variants --execute
```

#### Step 2.2: Add Migration Command
**File**: `package.json`

```json
"scripts": {
  "migrate:ccs-language-variants": "tsx --env-file=.env.local scripts/migrate-ccs-language-variants.ts",
  "migrate:ccs-language-variants:dry-run": "tsx --env-file=.env.local scripts/migrate-ccs-language-variants.ts --dry-run"
}
```

---

### Phase 3: Workflow Integration (1-2 hours)

#### Step 3.1: Update Course Creation
**File**: `scripts/create-ccs-for-course.ts`

**Changes:**
```typescript
async function createCCSForCourse(courseId: string) {
  const course = await Course.findOne({ courseId });
  
  const ccs = await CCS.create({
    ccsId: generateCCSId(course),
    name: course.name,
    originalLanguage: course.language || 'en',  // NEW
    originalCourseId: course.courseId,          // NEW
    availableLanguages: [course.language || 'en'], // NEW
    languageVariants: [],                       // NEW
  });
  
  // Link course to CCS
  course.ccsId = ccs.ccsId;
  await course.save();
  
  return ccs;
}
```

#### Step 3.2: Update Translation Import
**File**: `scripts/translate/import-translated-course.ts`

**Add after course creation:**
```typescript
// After successfully creating translated course
const ccs = await CCS.findOne({ ccsId: translatedJSON.ccsId });

if (ccs) {
  await ccs.addLanguageVariant(
    newCourse.courseId,
    translatedJSON.target_language,
    'translation-agent'
  );
  
  console.log(`✓ Added ${translatedJSON.target_language} variant to CCS`);
} else {
  console.warn(`⚠ CCS ${translatedJSON.ccsId} not found - variant not tracked`);
}
```

#### Step 3.3: Update Translation Validation
**File**: `scripts/translate/validate-translation.ts`

**Add quality score to CCS:**
```typescript
// After validation completes
if (validationPassed) {
  const ccs = await CCS.findOne({ ccsId });
  await ccs.updateVariantStatus(
    language,
    'review',  // or 'published' if auto-publish
    validationScore
  );
}
```

---

### Phase 4: API & Helper Functions (1 hour)

#### Step 4.1: Core Helper Functions
**File**: `app/lib/course-helpers.ts` (new or extend existing)

**Functions to Create:**

1. **getCourseLanguageVariants(courseId: string)**
   ```typescript
   // Returns all language variants for a course
   // Used by: UI language switcher, course page
   ```

2. **hasLanguageVariants(courseId: string)**
   ```typescript
   // Quick check if course has translations
   // Used by: Course cards, course list
   ```

3. **getOriginalCourse(courseId: string)**
   ```typescript
   // Returns the original (source) course
   // Used by: Translation workflow, admin tools
   ```

4. **getVariantCourse(courseId: string, targetLanguage: string)**
   ```typescript
   // Get specific language variant
   // Used by: Language switcher
   ```

5. **getAvailableLanguagesForCourse(courseId: string)**
   ```typescript
   // Returns array of language codes
   // Used by: UI dropdowns, API responses
   ```

**Implementation:**
```typescript
export async function getCourseLanguageVariants(courseId: string) {
  const course = await Course.findOne({ courseId }).lean();
  if (!course?.ccsId) {
    return { original: null, variants: [], available: [] };
  }
  
  const ccs = await CCS.findOne({ ccsId: course.ccsId }).lean();
  if (!ccs) {
    return { original: null, variants: [], available: [] };
  }
  
  return {
    original: {
      language: ccs.originalLanguage,
      courseId: ccs.originalCourseId,
    },
    variants: ccs.languageVariants || [],
    available: ccs.availableLanguages || [ccs.originalLanguage],
  };
}

export async function hasLanguageVariants(courseId: string): Promise<boolean> {
  const course = await Course.findOne({ courseId }).lean();
  if (!course?.ccsId) return false;
  
  const ccs = await CCS.findOne({ ccsId: course.ccsId }).lean();
  return (ccs?.availableLanguages?.length || 0) > 1;
}
```

#### Step 4.2: React Hook (Optional)
**File**: `app/hooks/useCourseLanguageVariants.ts`

```typescript
export function useCourseLanguageVariants(courseId: string) {
  const [variants, setVariants] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/courses/${courseId}/variants`)
      .then(res => res.json())
      .then(data => {
        setVariants(data);
        setLoading(false);
      });
  }, [courseId]);
  
  return { variants, loading };
}
```

---

### Phase 5: UI Components (1 hour)

#### Step 5.1: Language Switcher Component
**File**: `app/components/LanguageSwitcher.tsx`

**Features:**
- Show current language
- List available languages with flags
- Link to variant course pages
- Highlight current language
- Show "Original" badge for source language

**Code Structure:**
```typescript
interface LanguageSwitcherProps {
  courseId: string;
  currentLanguage: string;
}

export async function LanguageSwitcher({ courseId, currentLanguage }: LanguageSwitcherProps) {
  const variants = await getCourseLanguageVariants(courseId);
  
  if (variants.available.length <= 1) {
    return null; // No translations available
  }
  
  return (
    <div className="language-switcher">
      <h4>Available Languages:</h4>
      <div className="language-options">
        {variants.available.map(lang => {
          const isOriginal = lang === variants.original.language;
          const isCurrent = lang === currentLanguage;
          const variantCourseId = lang === variants.original.language
            ? variants.original.courseId
            : variants.variants.find(v => v.language === lang)?.courseId;
          
          return (
            <Link 
              key={lang}
              href={`/courses/${variantCourseId}`}
              className={isCurrent ? 'active' : ''}
            >
              <LanguageBadge language={lang} mode="native" />
              {isOriginal && <Badge>Original</Badge>}
              {isCurrent && <Badge>Current</Badge>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

#### Step 5.2: Course Card Enhancement
**File**: `app/components/CourseCard.tsx`

**Add language indicator:**
```typescript
{course.language && course.language !== 'en' && (
  <LanguageBadge language={course.language} mode="flag-only" />
)}
{hasVariants && (
  <Badge variant="outline">
    Available in {variantCount} languages
  </Badge>
)}
```

#### Step 5.3: Course Page Integration
**File**: `app/[locale]/courses/[courseId]/page.tsx`

**Add near course title:**
```typescript
<div className="course-header">
  <h1>{course.name}</h1>
  <LanguageSwitcher 
    courseId={course.courseId} 
    currentLanguage={course.language || 'en'} 
  />
</div>
```

---

### Phase 6: Testing & Validation (30 minutes)

#### Step 6.1: Unit Tests
**File**: `tests/lib/models/ccs.test.ts`

**Test Cases:**
1. Add language variant successfully
2. Prevent duplicate language variants
3. Update variant status
4. Remove language variant
5. Get variant by language
6. Check if language exists

#### Step 6.2: Integration Tests
**File**: `tests/integration/language-variants.test.ts`

**Test Scenarios:**
1. Create original course with CCS
2. Add Spanish translation
3. Verify CCS updated correctly
4. Query variants from UI helpers
5. Switch languages in UI
6. Remove translation
7. Verify CCS cleaned up

#### Step 6.3: Manual Testing Checklist

```
□ Run migration script (dry-run)
□ Verify AI_DUMMIES_1DAY_EN CCS updated
□ Check Spanish variant tracked
□ Test getCourseLanguageVariants()
□ Test hasLanguageVariants()
□ View course page with language switcher
□ Click language switcher links
□ Verify navigation works
□ Check course card shows language badge
□ Add new translation (Chinese)
□ Verify CCS updates automatically
□ Run enhanced audit on all courses
□ Verify no regressions
```

---

### Phase 7: Documentation (30 minutes)

#### Step 7.1: Update Technical Documentation

**Files to Update:**
1. `docs/ARCHITECTURE.md` - Add language variant system
2. `docs/HANDOVER.md` - Document new system
3. `docs/courses/COURSE_CREATION_REQUIREMENTS.md` - Add CCS requirements
4. `LANGUAGE_VARIANT_CONNECTOR_PROPOSAL.md` - Mark as implemented

**New Documentation:**
1. `docs/language-variants/USAGE_GUIDE.md` - How to use system
2. `docs/language-variants/API_REFERENCE.md` - Helper functions
3. `docs/language-variants/MIGRATION_GUIDE.md` - For existing courses

#### Step 7.2: Code Comments

Add JSDoc comments to:
- CCS model fields
- Helper methods
- UI components
- Migration script

---

## Implementation Checklist

### Prerequisites
- [x] Design approved
- [ ] Database backup taken
- [ ] Development environment ready
- [ ] Tests infrastructure ready

### Phase 1: Core Model (1-2 hours)
- [ ] Update CCS interface with new fields
- [ ] Add LanguageVariantRef schema
- [ ] Update Mongoose schema
- [ ] Add indexes
- [ ] Implement addLanguageVariant()
- [ ] Implement updateVariantStatus()
- [ ] Implement removeLanguageVariant()
- [ ] Implement helper methods
- [ ] Test model changes locally

### Phase 2: Migration (1 hour)
- [ ] Create migration script
- [ ] Add dry-run mode
- [ ] Test on local database
- [ ] Add npm script
- [ ] Run dry-run on production data (read-only)
- [ ] Review and approve changes
- [ ] Execute migration
- [ ] Verify results

### Phase 3: Workflow Integration (1-2 hours)
- [ ] Update course creation script
- [ ] Update translation import script
- [ ] Update validation script
- [ ] Test end-to-end translation workflow
- [ ] Verify CCS updates automatically

### Phase 4: API & Helpers (1 hour)
- [ ] Create course-helpers.ts
- [ ] Implement getCourseLanguageVariants()
- [ ] Implement hasLanguageVariants()
- [ ] Implement getOriginalCourse()
- [ ] Implement getVariantCourse()
- [ ] Implement getAvailableLanguagesForCourse()
- [ ] Test all helper functions

### Phase 5: UI Components (1 hour)
- [ ] Create LanguageSwitcher component
- [ ] Update CourseCard component
- [ ] Update course page
- [ ] Test UI locally
- [ ] Verify responsive design
- [ ] Test with English and Spanish courses

### Phase 6: Testing (30 minutes)
- [ ] Write unit tests for CCS model
- [ ] Write integration tests
- [ ] Run manual testing checklist
- [ ] Fix any bugs found
- [ ] Run enhanced audit
- [ ] Verify no regressions

### Phase 7: Documentation (30 minutes)
- [ ] Update ARCHITECTURE.md
- [ ] Update HANDOVER.md
- [ ] Update COURSE_CREATION_REQUIREMENTS.md
- [ ] Create USAGE_GUIDE.md
- [ ] Create API_REFERENCE.md
- [ ] Create MIGRATION_GUIDE.md
- [ ] Add JSDoc comments
- [ ] Update README if needed

### Deployment
- [ ] Commit all changes
- [ ] Push to branch
- [ ] Create pull request
- [ ] Code review
- [ ] Merge to main
- [ ] Deploy to production
- [ ] Run migration on production
- [ ] Verify production works
- [ ] Monitor for issues

---

## Risk Mitigation

### Risk 1: Data Loss During Migration
**Mitigation:**
- Full database backup before migration
- Dry-run mode to preview changes
- Rollback script prepared
- Test on staging environment first

### Risk 2: Performance Impact
**Mitigation:**
- Indexed queries (no collection scans)
- Lean queries where possible
- Cache available languages
- Monitor query performance

### Risk 3: Breaking Existing Features
**Mitigation:**
- Backward compatible design
- Comprehensive testing
- Gradual rollout
- Feature flag for new UI components

### Risk 4: Inconsistent State
**Mitigation:**
- Atomic operations
- Validation before saving
- Regular consistency checks
- Audit script to detect issues

---

## Success Criteria

### Functional
- ✅ CCS tracks all language variants
- ✅ Migration completes without errors
- ✅ Translation workflow updates CCS automatically
- ✅ UI shows language switcher
- ✅ Language switching works correctly

### Performance
- ✅ Variant lookup < 50ms
- ✅ No N+1 queries
- ✅ Course page load time unchanged
- ✅ Database queries optimized

### Quality
- ✅ All tests pass
- ✅ Code review approved
- ✅ Documentation complete
- ✅ No regressions detected

### User Experience
- ✅ Language switcher intuitive
- ✅ Current language clearly marked
- ✅ All variants accessible
- ✅ No broken links

---

## Timeline

**Total Estimated Time: 6-7 hours**

- Phase 1 (Core Model): 1.5 hours
- Phase 2 (Migration): 1 hour
- Phase 3 (Workflow): 1.5 hours
- Phase 4 (API/Helpers): 1 hour
- Phase 5 (UI): 1 hour
- Phase 6 (Testing): 30 minutes
- Phase 7 (Documentation): 30 minutes

**Recommended Schedule:**
- Day 1: Phases 1-2 (Core Model + Migration)
- Day 2: Phases 3-4 (Workflow + API)
- Day 3: Phases 5-7 (UI + Testing + Docs)

---

## Next Steps

1. **Review & Approve** this plan
2. **Take database backup**
3. **Start with Phase 1** (Core Model)
4. **Proceed sequentially** through phases
5. **Test thoroughly** at each phase
6. **Deploy to production** when complete

---

**Status**: ✅ Ready for Implementation  
**Approval Required**: Yes  
**Blocked By**: None  
**Estimated Completion**: 3 days (6-7 hours of work)
