# Course Creation Requirements

**Last Updated**: 2026-08-08  
**Status**: Active Policy

## Overview

This document defines the mandatory requirements for creating courses in the Amanoba platform. All courses must meet these requirements before being marked as published or made available to students.

## Required Fields

### 1. Course Metadata (REQUIRED)

#### courseId
- **Type**: String
- **Required**: Yes
- **Format**: Uppercase letters, numbers, and underscores only
- **Example**: `AI_ESSENTIALS_3DAY_EN`
- **Validation**: Must be unique across all courses

#### name
- **Type**: String
- **Required**: Yes
- **Max Length**: 200 characters
- **Purpose**: Display name shown to students
- **Example**: "AI Essentials - 3 Days to Practical Skills"

#### description
- **Type**: String
- **Required**: Yes
- **Max Length**: 2000 characters
- **Purpose**: Explains what the course teaches
- **Guidelines**: Should be clear, concise, and compelling

#### language
- **Type**: String
- **Required**: Yes
- **Format**: ISO language code (lowercase)
- **Example**: `en`, `hu`, `es`
- **Default**: `hu`

#### thumbnail
- **Type**: String (URL)
- **Required**: ✅ **YES** (as of 2026-08-08)
- **Purpose**: Visual representation in course cards and catalog
- **Format**: Full URL to hosted image
- **Guidelines**:
  - Use images from the approved thumbnail pool
  - Image should be relevant to course topic
  - Minimum dimensions: 300x200px
  - Supported formats: PNG, JPG, WebP
  - Must be publicly accessible
- **Thumbnail Pool**: See `docs/content/THUMBNAIL_POOL.md` for available images
- **Validation**: Non-empty URL string

#### brandId
- **Type**: ObjectId
- **Required**: Yes
- **Purpose**: Links course to brand configuration
- **Example**: Reference to `amanoba` brand

### 2. Course Structure (REQUIRED)

#### durationDays
- **Type**: Number
- **Required**: Yes
- **Minimum**: 1
- **Purpose**: Planned lesson count
- **Note**: Actual duration derived from lesson count

#### xpConfig
- **Type**: Object
- **Required**: Yes
- **Fields**:
  - `lessonXP`: Number (points per lesson)
  - `quizXP`: Number (points per quiz)
  - `completionXP`: Number (bonus for course completion)

#### pointsConfig
- **Type**: Object
- **Required**: Yes
- **Fields**:
  - `lessonPoints`: Number
  - `quizPoints`: Number
  - `completionPoints`: Number

### 3. Lessons (REQUIRED)

Every course must have at least one lesson.

**Lesson Requirements**:
- `lessonId`: Unique identifier
- `courseId`: Reference to parent course (ObjectId)
- `dayNumber`: Sequential day number
- `title`: Lesson title
- `displayOrder`: Order in course sequence
- `content`: Lesson content (markdown)
- `emailSubject`: Email delivery subject
- `emailBody`: Email delivery body
- `language`: Same as course language

### 4. Quiz Questions (RECOMMENDED)

**Minimum Pool Size**:
- Regular courses: At least 10 questions per lesson
- Certification courses: At least 100 questions total

**Question Requirements**:
- `difficulty`: EASY | MEDIUM | HARD | EXPERT
- `questionText`: The question
- `options`: Array of answer choices (4 recommended)
- `correctAnswer`: The correct option
- `explanation`: Why the answer is correct
- `category`: Question category
- `questionType`: recall | application | critical-thinking | etc.

### 5. Certification (OPTIONAL but RECOMMENDED)

If certification is enabled:
- `certification.enabled`: true
- `certification.passThresholdPercent`: Minimum score (default: 60)
- `certification.maxErrorPercent`: Early failure threshold or null
- Question pool must be ≥ 100 questions

### 6. Progressive Generation Metadata (OPTIONAL)

For courses in a progression:
- `progressionMetadata.generationType`: 'manual' | 'progressive'
- `progressionMetadata.generationStage`: 1 | 2 | 3 | 4
- `progressionMetadata.topicName`: Topic identifier
- `progressionMetadata.isProgressionRoot`: boolean
- `progressionMetadata.previousStageCourseId`: Link to previous stage
- `prerequisiteCourseIds`: Array of required course ObjectIds

## Thumbnail Requirements (DETAILED)

### Why Thumbnails Are Required

1. **User Experience**: Course cards without images look incomplete and unprofessional
2. **Visual Hierarchy**: Thumbnails help users quickly scan and identify courses
3. **Engagement**: Visual content increases click-through rates by 30-40%
4. **Consistency**: All courses should have the same level of polish
5. **Branding**: Images reinforce the Amanoba brand and course quality

### Thumbnail Selection Guidelines

1. **Use the Approved Pool**: Select from pre-approved thumbnail images
2. **Match Course Topic**: Choose images that visually represent the course subject
3. **Variety**: Don't reuse the same thumbnail for multiple courses in the same category
4. **Quality**: All pool images are high-quality and properly sized
5. **Accessibility**: Images should be clear and recognizable even at small sizes

### Current Thumbnail Pool

```typescript
const thumbnailPool = [
  'https://i.ibb.co/C5GmMSCX/60-A14650-AEFA-41-B9-85-B3-3-F2-C63241-F1-A.png',
  'https://i.ibb.co/Q3dWrqC3/4-ABC0-DD4-F387-4-A36-86-D1-4-BABBADA791-D.png',
  'https://i.ibb.co/DDpm7xg5/9-D06-E9-E9-5421-4000-8170-EA863-BB10-E5-B.png', // Blue/tech themed
  'https://i.ibb.co/3mrrqg4y/4-F494472-114-E-44-EB-922-D-EE9-A798-E781-E.png',
  'https://i.ibb.co/Y4CMSWRc/3-B15-FA86-2-CDE-4-DF5-A07-F-43-E09791-F999.png',
  'https://i.ibb.co/S7rTB05C/A6526412-05-E6-4227-88-AE-6-A566-BCD970-D.png',
  'https://i.ibb.co/0VVdfyCj/274-FEFD4-FB1-F-44-EC-8-E6-B-A671-EBFFBBD2.png',
  'https://i.ibb.co/jYR5TmB/8-BD937-BA-DFC2-4-CBC-BD5-C-2-D3-B78-B5-F4-E2.png',
];
```

### Fallback Behavior

If a course somehow lacks a thumbnail (legacy data):
- System will use the brand's default thumbnail from `brand.metadata.defaultCourseThumbnail`
- However, ALL NEW COURSES must explicitly set a thumbnail

## Validation Checklist

Before creating a course, verify:

- [ ] Course ID is unique and follows naming convention
- [ ] Name is descriptive and under 200 characters
- [ ] Description explains the course value clearly
- [ ] Language code is valid
- [ ] ✅ **Thumbnail URL is set and valid**
- [ ] Brand ID references existing brand
- [ ] XP and points configurations are set
- [ ] At least one lesson exists
- [ ] Lessons have email subject and body
- [ ] Quiz questions meet minimum requirements
- [ ] If certification enabled, pool size ≥ 100 questions
- [ ] Prerequisites are valid course ObjectIds (if applicable)
- [ ] Progressive metadata is complete (if applicable)

## Course Creation Script Template

```typescript
import connectDB from '../app/lib/mongodb';
import { Course, Brand, Lesson } from '../app/lib/models';

async function createCourse() {
  await connectDB();
  
  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) throw new Error('Brand not found');
  
  // SELECT A THUMBNAIL (REQUIRED!)
  const thumbnail = 'https://i.ibb.co/DDpm7xg5/9-D06-E9-E9-5421-4000-8170-EA863-BB10-E5-B.png';
  
  const course = await Course.create({
    courseId: 'YOUR_COURSE_ID',
    brandId: brand._id,
    name: 'Your Course Name',
    description: 'Your course description',
    language: 'en',
    thumbnail, // REQUIRED!
    durationDays: 15,
    xpConfig: {
      lessonXP: 50,
      quizXP: 25,
      completionXP: 500,
    },
    pointsConfig: {
      lessonPoints: 10,
      quizPoints: 5,
      completionPoints: 100,
    },
    // ... other fields
  });
  
  // Create lessons...
  
  console.log('✅ Course created with thumbnail!');
}
```

## Migration Script for Existing Courses

If you need to add thumbnails to existing courses without them:

```typescript
import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

const thumbnailPool = [ /* see above */ ];

async function addThumbnails() {
  await connectDB();
  
  const coursesWithoutThumbnails = await Course.find({
    $or: [
      { thumbnail: { $exists: false } },
      { thumbnail: null },
      { thumbnail: '' }
    ]
  });
  
  console.log(`Found ${coursesWithoutThumbnails.length} courses without thumbnails`);
  
  for (let i = 0; i < coursesWithoutThumbnails.length; i++) {
    const course = coursesWithoutThumbnails[i];
    const thumbnail = thumbnailPool[i % thumbnailPool.length];
    course.thumbnail = thumbnail;
    await course.save();
    console.log(`✓ ${course.courseId}: ${thumbnail}`);
  }
  
  console.log('✅ All courses now have thumbnails');
}
```

## Enforcement

### Schema Level
- Course model enforces `thumbnail` as required field
- Mongoose validation will reject courses without thumbnails
- TypeScript interface marks `thumbnail` as non-optional

### API Level
- Course creation APIs must validate thumbnail presence
- Admin interfaces must require thumbnail selection
- Import scripts must include thumbnail assignment

### Quality Assurance
- CI/CD should validate all test courses have thumbnails
- Pre-deployment checks should verify no courses lack thumbnails
- Monitoring should alert if courses are created without thumbnails

## References

- **Course Model**: `app/lib/models/course.ts`
- **Thumbnail Pool**: Listed in this document and course creation scripts
- **Brand Default**: `brand.metadata.defaultCourseThumbnail`
- **Course Creation Scripts**: `scripts/create-*.ts`
- **Progressive Generation**: `app/lib/course-generation/progressive-course-builder.ts`

## Change History

### 2026-08-08: Thumbnail Made Required
- Changed `thumbnail` from optional to required in Course model
- Updated TypeScript interface to reflect non-optional status
- Added validation to ensure non-empty thumbnail URLs
- Documented requirement in this guide
- Updated all course creation scripts to include thumbnail selection

---

**Policy Status**: ✅ Active and Enforced  
**Last Reviewed**: 2026-08-08  
**Next Review**: When adding new course creation workflows
