# Unified Course Building Rules

**Date**: 2026-01-24  
**Status**: ✅ ACTIVE  
**Version**: 1.0

---

## Overview

This document defines the standardized process for creating and delivering courses on the Amanoba platform. All course creation must follow these rules to ensure quality, consistency, and proper localization.

---

## Pre-Development Checklist

### 1. Language Requirements Check

**Before starting course creation:**

1. **Identify requested languages** - Check what languages the course should be delivered in
2. **Check UI translation status** - Verify if translation files exist in `messages/` folder
3. **Plan translation delivery** - If new languages appear without UI translations:
   - **PREREQUISITE**: UI translations MUST be delivered BEFORE the first lesson
   - Create translation files for all missing languages
   - Ensure all UI strings are translated (buttons, labels, navigation, etc.)
   - Test UI in target language to ensure no missing keys

**Current UI translation status:**
- ✅ Hungarian (`hu`) - Complete
- ✅ English (`en`) - Complete
- ❌ Turkish (`tr`) - Missing
- ❌ Bulgarian (`bg`) - Missing
- ❌ Polish (`pl`) - Missing
- ❌ Vietnamese (`vi`) - Missing
- ❌ Indonesian (`id`) - Missing
- ❌ Arabic (`ar`) - Missing
- ❌ Brazilian Portuguese (`pt-BR` or `pt`) - Missing
- ❌ Hindi (`hi`) - Missing

**Action**: For any missing language, create `messages/{locale}.json` file with complete translations before course delivery.

---

### 2. Content Similarity Check

**Before creating new course:**

1. **Search existing courses** - Check database and course documentation for similar content
2. **Review lesson plans** - If similar courses exist, review their lesson structure
3. **Identify reusable content** - Check if any lessons from existing courses can be:
   - Directly reused (if content matches)
   - Adapted/modified (if similar but needs customization)
   - Referenced (if concepts overlap)

**Benefits:**
- Avoid duplicate content creation
- Maintain consistency across courses
- Leverage existing high-quality content
- Faster course delivery

**Example**: If creating a "Productivity Basics" course and "Time Management 101" exists, check if Day 1-5 lessons can be adapted.

---

### 3. Course Structure & Audience Analysis

**Before writing content, ensure you have:**

1. **Clear course structure** - 30-day plan with daily lessons (20-30 min each)
2. **Target audience defined** - Who is this course for?
   - Solo operators
   - Product teams
   - Sales teams
   - Mixed audience
3. **Knowledge level** - Beginner, Intermediate, or Advanced
4. **Learning objectives** - What will students learn/achieve?
5. **Prerequisites** - What knowledge is assumed?

**If information is missing:**
- Request clarification from stakeholder
- Make reasonable assumptions and document them
- Create a course outline/proposal for approval

---

### 4. Source Material Preparation

**Prepare ALL sources, not just what you use:**

1. **Primary sources** - Books, articles, research papers used for content
2. **Reference materials** - Additional resources for deeper learning
3. **Student resources** - Materials to share with students:
   - Templates
   - Checklists
   - Worksheets
   - External links
   - Recommended reading
   - Tools/apps to use

**Document all sources:**
- Create a "Sources & Resources" section in course documentation
- Include citations where appropriate
- Provide links to external resources
- Note which sources were used for which lessons

---

## Course Delivery Process

### Step 1: Create Course & Language Variants

**For each language:**

1. **Create course record** via API or seed script:
   ```typescript
   {
     courseId: 'PRODUCTIVITY_2026', // Uppercase, alphanumeric + underscores
     name: 'Course Name in Target Language',
     description: 'Course description in target language',
     language: 'hu', // Language code (hu, en, tr, bg, pl, vi, id, ar, pt, hi)
     durationDays: 30,
     isActive: false, // Start as draft
     requiresPremium: false, // Or true if premium
     pointsConfig: {
       completionPoints: 1000,
       lessonPoints: 50,
       perfectCourseBonus: 500
     },
     xpConfig: {
       completionXP: 500,
       lessonXP: 25
     },
     metadata: {
       category: 'productivity',
       difficulty: 'intermediate',
       estimatedHours: 10,
       tags: ['productivity', 'time-management'],
       instructor: 'Amanoba'
     }
   }
   ```

2. **Create separate course record for each language** - Each language gets its own course document
3. **Link via courseId pattern** - Use `PRODUCTIVITY_2026_HU`, `PRODUCTIVITY_2026_EN`, etc., or use translations field

---

### Step 2: Create First Lesson & Quiz

**Quality Standards:**

#### Lesson Content:
- ✅ **High quality** - Well-researched, accurate, valuable
- ✅ **Avoid bullshitting** - No fluff, no generic platitudes
- ✅ **Avoid too general content** - Be specific, actionable, practical
- ✅ **Deliver VALUE** - Students should learn something concrete and applicable
- ✅ **20-30 minute reading time** - Appropriate length for daily lesson
- ✅ **Clear structure** - Introduction, main content, summary, action items

#### Quiz Questions (MANDATORY QUALITY STANDARDS):
- ✅ **Minimum 7 questions per quiz** - can be **more** than 7 (never delete valid questions just to cap)
- ✅ **100% related to lesson content** - Every question must test actual lesson material
- ✅ **Same language as course** - 100% language consistency, no mixing, no fallbacks
- ✅ **Native quality** - Professional, native-level writing, not machine translation
- ✅ **Proper industry jargon** - Keep industry terms in appropriate language
- ✅ **Educational value** - Questions teach, not just test. All answers are educational
- ✅ **No stupid answers** - Wrong options are plausible and educational (teach common mistakes)
- ✅ **Standalone questions** - Each question works independently, no references to other questions
- ✅ **Test understanding** - Questions verify comprehension and application, not just memorization
- ✅ **Clear, unambiguous** - No confusing wording, no trick questions
- ✅ **4 answer options** - Exactly 4 options (1 correct + 3 plausible distractors)
- ✅ **Proper metadata** - Every question must have:
  - UUID v4 (unique identifier)
  - Hashtags: `[#topic, #difficulty, #type, #language, #all-languages]`
  - questionType: `RECALL`, `APPLICATION`, or `CRITICAL_THINKING`
  - difficulty: `EASY`, `MEDIUM`, `HARD`, or `EXPERT`
  - category: Valid English enum value (not translated)

**Quiz Structure (MANDATORY):**
- **Minimum 7 questions** - can be **more** than 7 (do not delete valid questions just to cap at 7)
- **Cognitive mix** (MANDATORY - STRICT RULES):
  - **0 questions: RECALL** - NO recall questions allowed (hard rule)
  - **At least 5 questions: APPLICATION** - Minimum 5 application questions (hard rule)
  - **At least 2 questions: CRITICAL_THINKING** - Recommended minimum 2 critical thinking questions (warning if less)
- **Question Quality Requirements**:
  - Minimum 40 characters per question
  - Minimum 25 characters per answer option
  - No generic template patterns (e.g., "What is a key concept from...", "Mit jelent a...")
  - No fragmented terms in quotes (e.g., "mestere" without context)
  - All questions must be 100% related to actual lesson content
  - All answers must have educational value (no "stupid" answers)
- **Pass threshold**: 70% (configurable per course)
- **Question types**: Multiple choice only (for now)
- **Language**: 100% same as course language, no fallbacks

#### Language Integrity (LESSONS + QUIZZES) — HARD GATE

We must prevent mixed-language lessons/quizzes.

- **Lesson content + emailSubject/emailBody** must match the course language.
- **Quiz question + all options** must match the course language.
- No English leakage into non-EN content (e.g., English “why it matters” sentences, bullet steps, or the literal token `goals`).

If Language Integrity fails:
- Block apply-mode changes for that lesson.
- Create an action item to localize/repair (do not “ship anyway”).

---

### Step 3: Translation Quality Standards

**Translation Requirements:**

1. **High quality translation** - Professional, native-level quality
2. **Industry jargon handling**:
   - **IT terms** → Keep in English (e.g., "API", "SaaS", "Kanban")
   - **Medical terms** → Keep in Latin/English (e.g., "diagnosis", "symptom")
   - **Business terms** → Keep in English if commonly used (e.g., "OKR", "KPI", "ROI")
   - **Technical terms** → Keep in original language if industry standard
3. **Natural translation** - Translate like a human, not a machine:
   - ✅ Easy to read
   - ✅ Easy to understand
   - ✅ Localized (cultural context, examples)
   - ✅ Native writer quality
   - ❌ NOT like a foreigner trying to write in that language
   - ❌ NOT literal word-for-word translation
   - ❌ NOT machine-translation style

**Translation Process:**
1. Translate main content naturally
2. Keep industry terms in original language
3. Localize examples and cultural references
4. Review for readability and flow
5. Ensure technical accuracy is maintained

---

## Course Creation Workflow

### Phase 1: Preparation (Before Coding)

1. ✅ Read course idea/blueprint document
2. ✅ Check language requirements
3. ✅ Check for similar existing courses
4. ✅ Verify UI translations exist (or create them)
5. ✅ Gather source materials
6. ✅ Define target audience and learning objectives
7. ✅ Create course outline (30 days)

### Phase 2: Course Setup

1. ✅ Create course records for all languages
2. ✅ Set course metadata (category, difficulty, tags)
3. ✅ Configure points and XP
4. ✅ Set premium/free status

### Phase 3: Content Creation

1. ✅ Write Lesson 1 content (high quality, valuable)
2. ✅ Create Quiz 1 (minimum 7 questions, following quality standards)
   - 0 RECALL questions (hard disallow)
   - Minimum 5 APPLICATION questions (practical scenarios)
   - Add CRITICAL_THINKING questions to reach strong coverage (recommended minimum 2)
   - All questions: UUID, hashtags, questionType, proper metadata
3. ✅ Translate Lesson 1 to all target languages
4. ✅ Translate Quiz 1 to all target languages (native quality)
5. ✅ Review translations for quality
6. ✅ Verify all questions have proper metadata
7. ✅ Test content in each language

### Phase 4: Database Injection

1. ✅ Create lessons via API or seed script
2. ✅ Create quiz questions via API or seed script
3. ✅ Link lessons to course
4. ✅ Link quiz questions to lessons
5. ✅ Verify data integrity

### Phase 5: Testing & Activation

1. ✅ Test course in each language
2. ✅ Verify lessons load correctly
3. ✅ Test quiz functionality
4. ✅ Check translations display properly
5. ✅ Activate course (`isActive: true`)

---

## Quality Checklist

### Before Marking Course Complete:

- [ ] All requested languages have course records
- [ ] All requested languages have UI translations (if new languages)
- [ ] Lesson 1 content is high quality and valuable
- [ ] Quiz 1 has 5-10 quality questions
- [ ] All translations are natural and readable
- [ ] Industry terms are handled correctly
- [ ] Course metadata is complete
- [ ] Points/XP configuration is set
- [ ] Course is tested in all languages
- [ ] No missing translations or broken links

---

## Language Code Reference

| Language | Code | Notes |
|----------|------|-------|
| Hungarian | `hu` | Default language |
| English | `en` | International |
| Turkish | `tr` | Needs UI translation |
| Bulgarian | `bg` | Needs UI translation |
| Polish | `pl` | Needs UI translation |
| Vietnamese | `vi` | Needs UI translation |
| Indonesian | `id` | Needs UI translation |
| Arabic | `ar` | Needs UI translation |
| Brazilian Portuguese | `pt` or `pt-BR` | Needs UI translation |
| Hindi | `hi` | Needs UI translation |

---

## Example: Course Creation Script Structure

```typescript
// 1. Create courses for all languages
const languages = ['hu', 'en', 'ru', 'tr', 'bg', 'pl', 'vi', 'id', 'ar', 'pt', 'hi'];

for (const lang of languages) {
  const course = await Course.create({
    courseId: `PRODUCTIVITY_2026_${lang.toUpperCase()}`,
    name: getCourseName(lang), // Translated name
    description: getCourseDescription(lang), // Translated description
    language: lang,
    // ... other fields
  });
  
  // 2. Create Lesson 1
  const lesson = await Lesson.create({
    courseId: course._id,
    lessonId: `${course.courseId}_DAY_01`,
    dayNumber: 1,
    title: getLessonTitle(lang),
    content: getLessonContent(lang), // High quality, translated
    // ... other fields
  });
  
  // 3. Create Quiz 1
  const questions = getQuizQuestions(lang); // 5-10 questions, translated
  for (const q of questions) {
    await QuizQuestion.create({
      lessonId: lesson.lessonId,
      courseId: course.courseId,
      // ... question data
    });
  }
}
```

---

## Common Pitfalls to Avoid

1. ❌ **Creating course without checking UI translations** - Always check first
2. ❌ **Generic, fluff content** - Be specific and valuable
3. ❌ **Stupid quiz questions** - Test understanding, not memorization
4. ❌ **Machine-translation style** - Translate naturally like a human
5. ❌ **Translating industry terms** - Keep IT/Medical/Business terms in original
6. ❌ **Missing source materials** - Document all sources
7. ❌ **Skipping quality review** - Always review translations before delivery

---

## Success Criteria

A course is ready for delivery when:

1. ✅ All language variants created
2. ✅ UI translations complete (for new languages)
3. ✅ Lesson 1 is high quality and valuable
4. ✅ Quiz 1 has quality questions (5-10)
5. ✅ All translations are natural and readable
6. ✅ Industry terms handled correctly
7. ✅ Course tested in all languages
8. ✅ Documentation complete

---

**Last Updated**: 2026-01-24  
**Next Review**: After first course delivery
