# Language Variant Connector Proposal

**Date**: 2026-08-09  
**Issue**: No efficient way to find all language variants of a course  
**Priority**: High (needed for multi-language adoption)

---

## Current System

### What We Have ✅

**Course Model:**
```typescript
interface ICourse {
  courseId: string;           // e.g. "AI_DUMMIES_1DAY_EN", "AI_DUMMIES_1DAY_EN_ES"
  language: string;           // e.g. "en", "es", "zh"
  ccsId?: string;             // e.g. "AI_DUMMIES_1DAY"
  // ... other fields
}
```

**CCS Model:**
```typescript
interface ICCS {
  ccsId: string;              // e.g. "AI_DUMMIES_1DAY"
  name?: string;
  idea?: string;
  outline?: string;
  // ... other fields
}
```

### What's Missing ❌

1. **No reverse lookup**: CCS doesn't track which courses belong to it
2. **No original marker**: Can't identify the source language course
3. **No language tracking**: CCS doesn't know which languages are available
4. **Inefficient queries**: Must scan all courses to find variants

### Current Workaround

```typescript
// To find all language variants:
const variants = await Course.find({ ccsId: ccs.ccsId });

// To find if a course has translations:
const otherLanguages = await Course.find({ 
  ccsId: course.ccsId, 
  courseId: { $ne: course.courseId } 
});
```

**Problems:**
- ❌ Requires full collection scan
- ❌ No way to mark "original" language
- ❌ No tracking of available languages
- ❌ No metadata about translation status

---

## Proposed Solution

### Option 1: Enhanced CCS with Variant Tracking (Recommended)

**Add to CCS Model:**
```typescript
interface ICCS {
  ccsId: string;
  name?: string;
  idea?: string;
  outline?: string;
  
  // NEW: Language variant tracking
  originalLanguage: string;         // e.g. "en" - source language
  originalCourseId: string;         // e.g. "AI_DUMMIES_1DAY_EN" - reference to original
  availableLanguages: string[];     // e.g. ["en", "es", "zh"] - all available
  
  // NEW: Variant course references
  languageVariants: Array<{
    language: string;               // e.g. "es"
    courseId: string;               // e.g. "AI_DUMMIES_1DAY_EN_ES"
    translatedAt?: Date;            // when translation completed
    translationStatus: 'draft' | 'review' | 'published';
    translatedBy?: string;          // translator/agent identifier
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Benefits:**
- ✅ Fast lookup: CCS knows all its variants
- ✅ Clear original: `originalCourseId` marks the source
- ✅ Language tracking: `availableLanguages` array
- ✅ Translation metadata: status, date, translator
- ✅ Efficient queries: No collection scans needed

**Example Usage:**
```typescript
// Find all language variants
const ccs = await CCS.findOne({ ccsId: 'AI_DUMMIES_1DAY' });
const variants = ccs.languageVariants;
console.log(`Available in: ${ccs.availableLanguages.join(', ')}`);

// Get Spanish variant
const spanishVariant = variants.find(v => v.language === 'es');
const spanishCourse = await Course.findOne({ courseId: spanishVariant.courseId });

// Check if course has translations
const hasTranslations = ccs.availableLanguages.length > 1;
```

### Option 2: Separate LanguageVariant Collection

**New Model:**
```typescript
interface ILanguageVariant {
  ccsId: string;                    // Links to CCS
  originalCourseId: string;         // Original course reference
  variantCourseId: string;          // Translated course reference
  sourceLanguage: string;           // e.g. "en"
  targetLanguage: string;           // e.g. "es"
  translationStatus: 'draft' | 'review' | 'published';
  translatedAt: Date;
  translatedBy?: string;
  qualityScore?: number;            // 0-100
}
```

**Benefits:**
- ✅ Separate concern
- ✅ More flexible schema
- ✅ Can track translation-specific metadata
- ✅ Historical tracking of translations

**Drawbacks:**
- ❌ Additional collection to maintain
- ❌ Extra query needed
- ❌ More complex data model

---

## Recommendation: Option 1 (Enhanced CCS)

**Why:**
1. **Simpler**: Single source of truth in CCS
2. **Faster**: No additional queries needed
3. **Cleaner**: Keeps variant tracking with the family
4. **Efficient**: Indexed lookups on ccsId

**Migration Path:**
1. Add new fields to CCS schema
2. Backfill existing CCS entries with current course data
3. Update course creation/translation workflows to maintain CCS
4. Add helper methods to CCS model

---

## Implementation Plan

### 1. Update CCS Model

```typescript
// app/lib/models/ccs.ts

export interface ILanguageVariantRef {
  language: string;
  courseId: string;
  translatedAt?: Date;
  translationStatus: 'draft' | 'review' | 'published';
  translatedBy?: string;
  qualityScore?: number;
}

export interface ICCS extends Document {
  ccsId: string;
  name?: string;
  idea?: string;
  outline?: string;
  
  // Language variant tracking
  originalLanguage: string;
  originalCourseId: string;
  availableLanguages: string[];
  languageVariants: ILanguageVariantRef[];
  
  relatedDocuments?: IRelatedDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const LanguageVariantRefSchema = new Schema<ILanguageVariantRef>({
  language: { type: String, required: true, lowercase: true },
  courseId: { type: String, required: true },
  translatedAt: { type: Date },
  translationStatus: { 
    type: String, 
    enum: ['draft', 'review', 'published'], 
    default: 'draft' 
  },
  translatedBy: { type: String },
  qualityScore: { type: Number, min: 0, max: 100 },
}, { _id: false });

const CCSSchema = new Schema<ICCS>({
  // ... existing fields ...
  originalLanguage: { 
    type: String, 
    required: true, 
    lowercase: true,
    default: 'en' 
  },
  originalCourseId: { type: String, required: true },
  availableLanguages: { 
    type: [String], 
    default: function() { return [this.originalLanguage]; }
  },
  languageVariants: { 
    type: [LanguageVariantRefSchema], 
    default: [] 
  },
}, { timestamps: true });

// Indexes
CCSSchema.index({ originalCourseId: 1 });
CCSSchema.index({ 'languageVariants.courseId': 1 });
CCSSchema.index({ 'languageVariants.language': 1 });
```

### 2. Add Helper Methods

```typescript
// app/lib/models/ccs.ts

CCSSchema.methods.addLanguageVariant = async function(
  courseId: string,
  language: string,
  translatedBy?: string
) {
  // Check if variant already exists
  const exists = this.languageVariants.find(v => v.language === language);
  if (exists) {
    throw new Error(`Language variant ${language} already exists`);
  }
  
  // Add variant
  this.languageVariants.push({
    language,
    courseId,
    translatedAt: new Date(),
    translationStatus: 'draft',
    translatedBy,
  });
  
  // Update available languages
  if (!this.availableLanguages.includes(language)) {
    this.availableLanguages.push(language);
  }
  
  await this.save();
};

CCSSchema.methods.updateVariantStatus = async function(
  language: string,
  status: 'draft' | 'review' | 'published',
  qualityScore?: number
) {
  const variant = this.languageVariants.find(v => v.language === language);
  if (!variant) {
    throw new Error(`Language variant ${language} not found`);
  }
  
  variant.translationStatus = status;
  if (qualityScore !== undefined) {
    variant.qualityScore = qualityScore;
  }
  
  await this.save();
};

CCSSchema.methods.getAvailableLanguages = function() {
  return this.availableLanguages;
};

CCSSchema.methods.getVariantByLanguage = function(language: string) {
  return this.languageVariants.find(v => v.language === language);
};
```

### 3. Migration Script

```typescript
// scripts/migrate-ccs-add-language-variants.ts

import connectDB from '../app/lib/mongodb';
import { Course, CCS } from '../app/lib/models';

async function migrateCCS() {
  await connectDB();
  
  const allCCS = await CCS.find({});
  
  for (const ccs of allCCS) {
    // Find all courses with this ccsId
    const courses = await Course.find({ ccsId: ccs.ccsId });
    
    if (courses.length === 0) continue;
    
    // Find original (English) course
    const originalCourse = courses.find(c => c.language === 'en' || !c.language) || courses[0];
    
    // Set original
    ccs.originalLanguage = originalCourse.language || 'en';
    ccs.originalCourseId = originalCourse.courseId;
    ccs.availableLanguages = [...new Set(courses.map(c => c.language || 'en'))];
    
    // Add variants
    ccs.languageVariants = courses
      .filter(c => c.courseId !== originalCourse.courseId)
      .map(c => ({
        language: c.language || 'en',
        courseId: c.courseId,
        translationStatus: 'published' as const,
        translatedAt: c.createdAt,
      }));
    
    await ccs.save();
    console.log(`✓ Migrated ${ccs.ccsId}: ${ccs.availableLanguages.join(', ')}`);
  }
  
  console.log('✅ Migration complete');
}
```

### 4. Update Translation Import

```typescript
// scripts/translate/import-translated-course.ts

async function importTranslatedCourse(translatedJSON: TranslatedCourse) {
  // ... existing import logic ...
  
  // After course creation, update CCS
  const ccs = await CCS.findOne({ ccsId: translatedJSON.ccsId });
  if (ccs) {
    await ccs.addLanguageVariant(
      newCourse.courseId,
      translatedJSON.target_language,
      'translation-agent'
    );
  }
}
```

### 5. UI Helper Functions

```typescript
// app/lib/course-helpers.ts

export async function getCourseLanguageVariants(courseId: string) {
  const course = await Course.findOne({ courseId });
  if (!course?.ccsId) return [];
  
  const ccs = await CCS.findOne({ ccsId: course.ccsId });
  if (!ccs) return [];
  
  return {
    original: {
      language: ccs.originalLanguage,
      courseId: ccs.originalCourseId,
    },
    variants: ccs.languageVariants,
    available: ccs.availableLanguages,
  };
}

export async function hasLanguageVariants(courseId: string): Promise<boolean> {
  const course = await Course.findOne({ courseId });
  if (!course?.ccsId) return false;
  
  const ccs = await CCS.findOne({ ccsId: course.ccsId });
  return (ccs?.availableLanguages?.length || 0) > 1;
}
```

---

## Usage Examples

### Check if Course Has Translations

```typescript
const hasTranslations = await hasLanguageVariants('AI_DUMMIES_1DAY_EN');
// Returns: true (has Spanish variant)
```

### Get All Language Variants

```typescript
const variants = await getCourseLanguageVariants('AI_DUMMIES_1DAY_EN');
console.log(variants);
// {
//   original: { language: 'en', courseId: 'AI_DUMMIES_1DAY_EN' },
//   variants: [
//     { language: 'es', courseId: 'AI_DUMMIES_1DAY_EN_ES', status: 'published' }
//   ],
//   available: ['en', 'es']
// }
```

### Show Language Switcher in UI

```tsx
// app/components/LanguageSwitcher.tsx

export function LanguageSwitcher({ courseId }: { courseId: string }) {
  const variants = await getCourseLanguageVariants(courseId);
  
  if (variants.available.length <= 1) return null;
  
  return (
    <div className="language-switcher">
      <h4>Available in:</h4>
      {variants.available.map(lang => (
        <Link 
          key={lang} 
          href={`/courses/${getVariantCourseId(variants, lang)}`}
        >
          {LANGUAGE_NAMES[lang]}
        </Link>
      ))}
    </div>
  );
}
```

---

## Benefits

### For Users
- ✅ Easy language switching in course UI
- ✅ See available translations
- ✅ Consistent experience across languages

### For Developers
- ✅ Fast variant lookups (no collection scans)
- ✅ Clear original course identification
- ✅ Translation status tracking
- ✅ Quality scores per variant

### For Content Managers
- ✅ Track translation progress
- ✅ Identify missing translations
- ✅ Monitor translation quality
- ✅ Manage variant lifecycle

---

## Next Steps

1. ✅ **Approve this proposal**
2. Implement enhanced CCS model
3. Create migration script
4. Update translation workflow
5. Add UI components for language switching
6. Test with existing Spanish course
7. Document in COURSE_CREATION_REQUIREMENTS.md

---

**Status**: Proposed  
**Estimated Effort**: 4-6 hours  
**Priority**: High (blocks efficient multi-language adoption)  
**Dependencies**: None (backward compatible)
