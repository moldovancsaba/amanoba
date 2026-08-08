# Course Creation Requirements

**Last Updated**: 2026-08-08  
**Status**: Active Policy

## Overview

This document defines the mandatory requirements for creating courses in the Amanoba platform. All courses must meet these requirements before being marked as published or made available to students.

## ⚠️ CRITICAL: Where to Find Information & How to Build Courses

### Mandatory Reading Before Creating ANY Course Content

**YOU MUST READ THESE DOCUMENTS IN THIS ORDER:**

1. **`docs/agents/CONTENT_CREATION_WORKFLOW.md`** - The ROCK-SOLID workflow for creating high-quality content
   - Read this FIRST before creating any lesson or quiz question
   - Contains forbidden patterns, quality gates, validation requirements
   - Shows good vs bad examples
   - Includes step-by-step validation workflow

2. **`docs/core/agent_working_loop_canonical_operating_document.md`** - Project rulebook
   - Section: "Mandatory Documentation for Course/Quiz Quality Work (SSOT Set)"
   - Lists all SSOT documents for content creation
   - Multi-language authoring rules
   - Quality control standards

3. **`docs/architecture/layout_grammar.md`** - Layout and structure grammar
   - Course/lesson/quiz structure specifications
   - UI and API layout rules
   - Language integrity requirements

### Where to Find Reference Information

#### Content Quality Enforcement System
- **Location**: `app/lib/content-quality/enforcement.ts`
- **Purpose**: Validates and enforces quality standards
- **Use**: Run before saving any lesson or quiz question

#### Content Standards Validator
- **Location**: `app/lib/validators/content-standards.ts`
- **Purpose**: Defines validation rules and forbidden patterns
- **Contains**: 
  - `FORBIDDEN_QUIZ_PHRASES` - Patterns that auto-reject content
  - `REQUIRED_LESSON_SECTIONS` - Mandatory 5W1H structure
  - `validateLesson()` - Lesson validation function
  - `validateQuizQuestion()` - Quiz validation function

#### External Content Creator Repository
The `amanoba_courses` repository contains detailed standards:

- **`process_them/docs/2026_course_creator_prompts.md`** - Recursive prompts for course creation
- **`process_them/docs/2026_course_quality_prompt.md`** - SSOT for quality control
- **`process_them/docs/reference/QUIZ_QUALITY_PIPELINE_HANDOVER.md`** - Operational procedures
- **`process_them/docs/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`** - Step-by-step workflow
- **`process_them/docs/COURSE_BUILDING_RULES.md`** - Creation rules and standards

### How to Build Courses Properly

#### Step 1: Research & Gather Information

**For each topic, gather information from:**

1. **Authoritative Sources** (REQUIRED):
   - Academic papers and journals
   - Official documentation (for technical topics)
   - Industry-recognized books
   - Expert blog posts from credible sources
   - Government or institutional resources
   - Published research studies

2. **Example Sources by Topic**:
   - **AI/Technology**: 
     - Stanford AI Index Report
     - Papers from arXiv.org
     - Google Research, OpenAI research blog
     - O'Reilly books, Manning publications
   
   - **Business/Strategy**:
     - Harvard Business Review
     - McKinsey insights
     - Industry-specific trade publications
   
   - **Programming**:
     - Official language documentation
     - GitHub repositories with examples
     - Stack Overflow developer survey data

3. **Document ALL Sources**:
   - Keep a running list of URLs, author names, publication dates
   - Note which sources informed which sections
   - Prepare bibliography as you write, not after

#### Step 2: Follow the 5W1H Lesson Structure

**EVERY lesson MUST include these 13 sections:**

```markdown
# Lesson X: [Title]

**One-liner:** [What this unlocks in one sentence]  
**Time:** [Total time, e.g. 20–30 min]  
**Deliverable:** [Exact artifact name]  
**Prerequisite (optional):** [Only if needed]

## Learning goal
You will be able to: **[single measurable capability]**

### Success criteria (observable)
- [ ] [Binary check]
- [ ] [Binary check]
- [ ] [Binary check]

### Output you will produce
- **Deliverable:** [Exact deliverable name]
- **Format:** [Table, checklist, short doc, screenshot set]
- **Where saved:** [Folder or doc name]

## Who
**Primary persona:** [Who is doing the work]  
**Secondary persona(s):** [Who is affected]  
**Stakeholders (optional):** [Who should be informed]

## What
### What it is
[1–2 sentences]

### What it is not
[1 sentence]

### 2-minute theory
- [Key idea 1]
- [Key idea 2]
- [Key idea 3]

### Key terms
- **Term:** short definition
- **Term:** short definition

## Where
### Applies in
- [Area / touchpoint]

### Does not apply in
- [Non-applicable case]

### Touchpoints
- [Specific places/contexts]

## When
### Use it when
- [Trigger point]

### Frequency
[How often: daily / weekly / once per setup / per launch]

### Late signals
- [Symptom that you should have acted earlier]

## Why it matters
### Practical benefits
- [Benefit]

### Risks of ignoring
- [Negative outcome]

### Expectations
- Improves: [What gets better]
- Does not guarantee: [What this alone won't achieve]

## How
### Step-by-step method
1. [Action step]
2. [Action step]
3. [Action step]

### Do and don't
**Do**
- [Good practice]

**Don't**
- [Anti-pattern to avoid]

### Common mistakes
- [Mistake]: [Why it happens] → [Fix]

## Guided exercise
[Direct, step-by-step instructions]

**Steps:**
1. [Specific instruction]
2. [Specific instruction]

**Expected result:** [What the learner should have]

## Independent exercise
[Task without step-by-step guidance]

**Your task:** [Clear goal]
**Deliverable:** [What to produce]
**Time:** [Estimated time]

## Self-check
Use this checklist to verify your work:
- [ ] [Observable verification]
- [ ] [Observable verification]

## Bibliography
**Sources used:**
- [Author]. [Title]. [URL or Publication]
- [Author]. [Title]. [URL or Publication]

## Read more
**For deeper learning:**
- [Resource title] – [URL] – [Why useful]
```

#### Step 3: Create Standalone, Scenario-Based Quiz Questions

**Every quiz question must:**

✅ Be standalone (no "in this lesson", "today", "Day X")  
✅ Use natural scenario language ("A builder says...", "Your team asks...")  
✅ Have 1 correct + 3 plausible distractors  
✅ Include explanation of WHY the answer is correct  
✅ Be type APPLICATION or CRITICAL-THINKING (NOT recall)  
✅ Pass language integrity checks (no English in non-English content)

**Example of GOOD question:**

```markdown
**Question:** A builder says, "My AI app will use GPT-4 and a dashboard." Which revision makes this a product promise with a concrete outcome?

A) "My AI app will use GPT-4 and provide a sleek dashboard for modern teams."
B) "Freelance designers get a 5 minute brief from messy notes so they can send proposals faster."
C) "The app will include templates, automations, and a chat window for users."
D) "We will add more models and more integrations to cover more use cases."

**Correct:** B

**Explanation:** Option B states a clear user (freelance designers), the problem context (messy notes), and the specific outcome (send proposals faster in 5 minutes). The other options focus on features or tech, not user outcomes.

**Difficulty:** MEDIUM
**Type:** application
**Category:** Course Specific
```

#### Step 4: Validate EVERYTHING

**Before saving any content, run validation:**

```typescript
import { enforceLessonQuality, enforceQuizQuestionQuality } from '@/lib/content-quality/enforcement';
import { EnforcementLevel } from '@/lib/content-quality/enforcement';

// Validate lesson
const lessonResult = enforceLessonQuality(lesson, {
  level: EnforcementLevel.STRICT,
  context: 'agent_generation',
  enforcedBy: 'your-name',
});

if (!lessonResult.allowed) {
  console.error('❌ LESSON BLOCKED:', lessonResult.enforcement.reason);
  console.error('Errors:', lessonResult.validation.errors);
  // FIX THE ISSUES - DO NOT PROCEED
}

// Validate each quiz question
const questionResult = enforceQuizQuestionQuality(question, {
  level: EnforcementLevel.STRICT,
  context: 'agent_generation',
  enforcedBy: 'your-name',
  expectedLanguage: 'en',
});

if (!questionResult.allowed) {
  console.error('❌ QUESTION BLOCKED:', questionResult.enforcement.reason);
  // FIX THE ISSUES - DO NOT PROCEED
}
```

#### Step 5: Batch Validate Complete Course

```typescript
import { enforceCourseQuality } from '@/lib/content-quality/enforcement';

const batchResult = enforceCourseQuality(lessons, {
  level: EnforcementLevel.STRICT,
  context: 'course_import',
  enforcedBy: 'your-name',
  expectedLanguage: 'en',
});

if (!batchResult.allowed) {
  console.error('❌ COURSE BLOCKED');
  console.error('Summary:', batchResult.summary);
  // DO NOT PROCEED - FIX ALL ISSUES
}
```

### Quality Score Requirements

| Content Type | Minimum Score | Status |
|--------------|---------------|--------|
| **Lesson** | ≥70 (strict) or ≥50 (blocking) | Required |
| **Quiz Question** | ≥75 (strict) or ≥60 (blocking) | Required |
| **Overall Course** | ≥80 | Recommended |

### Forbidden Content Patterns

❌ **NEVER include these in quiz questions:**
- "in this lesson", "today", "Day X"
- "as mentioned", "we learned", "you saw"
- "[TODO]", "[PLACEHOLDER]", "lorem ipsum"
- "all of the above", "none of the above"
- Administrative openings: "The goal is...", "The main risk is..."

❌ **NEVER create lessons without:**
- Complete 5W1H structure (all 13 sections)
- Named concrete deliverable
- Bibliography with real sources
- Guided and Independent exercises
- Self-check verification list

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
- `selfCheck`: ✅ **REQUIRED** Self-check questionnaire object with:
  - `instruction`: String guiding the learner
  - `questions`: Array of reflection questions (minimum 3, recommended 4-5)

**Self-Check Purpose**:
- Helps learners reflect on what they've learned
- Reinforces key concepts
- Identifies knowledge gaps
- Provides active learning opportunities
- No right/wrong answers - focused on comprehension and application

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
- [ ] ✅ **Each lesson has selfCheck with instruction and questions array**
- [ ] Self-check questions are meaningful and promote reflection (3-5 per lesson)
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
  
  // Create lessons with self-check questions
  await Lesson.create({
    lessonId: 'YOUR_LESSON_ID',
    courseId: course._id,
    dayNumber: 1,
    language: 'en',
    title: 'Your Lesson Title',
    displayOrder: 1,
    emailSubject: 'Day 1: Your Lesson',
    emailBody: 'Ready for Day 1? Let\'s learn!',
    content: '# Your Lesson Content\n\nLesson markdown here...',
    selfCheck: {
      instruction: 'Review the concepts covered and reflect on your understanding.',
      questions: [
        'Can you explain the main concept in your own words?',
        'How would you apply this to your work?',
        'What questions do you still have?',
        'What will you do differently now?',
      ],
    },
    quizQuestions: [ /* quiz questions array */ ],
  });
  
  console.log('✅ Course created with thumbnail and self-checks!');
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
