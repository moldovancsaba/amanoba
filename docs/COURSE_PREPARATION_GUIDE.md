# Complete Course Preparation Guide

**Version**: 1.0  
**Last Updated**: 2026-01-22  
**Based on**: Production courses (AI_30_NAP, GEO_SHOPIFY_30_EN, B2B_SALES_2026_30_RU)

This guide provides everything you need to prepare a complete 30-day course with lessons and quizzes.

---

## 📋 Table of Contents

1. [Course Structure Overview](#course-structure-overview)
2. [Course Metadata Format](#course-metadata-format)
3. [Lesson Content Format](#lesson-content-format)
4. [Quiz Question Format](#quiz-question-format)
5. [Complete Example](#complete-example)
6. [Step-by-Step Process](#step-by-step-process)
7. [Best Practices](#best-practices)

---

## Course Structure Overview

### What You Need to Create

1. **Course** (1 document)
   - Metadata: name, description, language, points/XP config
   - Settings: duration (30 days), premium status, brand

2. **Lessons** (30 documents, one per day)
   - Content: HTML lesson content
   - Email templates: subject and body
   - Quiz config: enabled, threshold, question count, pool size
   - Metadata: estimated minutes, difficulty, tags

3. **Quiz Questions** (15 per lesson = 450 total)
   - 4 options per question, 1 correct answer
   - Linked to specific lesson via `lessonId`
   - Pool of 15 questions, system randomly selects 5

---

## Course Metadata Format

### Required Fields

```typescript
{
  courseId: string;        // UPPERCASE, numbers, underscores only (e.g., "MY_COURSE_30")
  name: string;            // Display name (max 200 chars)
  description: string;     // Course description (max 2000 chars)
  language: string;        // "hu" | "en" | "ru"
  durationDays: number;    // Always 30 for standard courses
  isActive: boolean;       // Start as false (draft), set to true when ready
  requiresPremium: boolean; // false for free courses
  brandId: ObjectId;      // Will be auto-assigned to default brand
}
```

### Points & XP Configuration

```typescript
{
  pointsConfig: {
    completionPoints: 1000,    // Points for completing entire course
    lessonPoints: 50,          // Points per lesson completed
    perfectCourseBonus: 500    // Bonus for completing all 30 days
  },
  xpConfig: {
    completionXP: 500,         // XP for completing entire course
    lessonXP: 25              // XP per lesson completed
  }
}
```

### Metadata (Optional but Recommended)

```typescript
{
  metadata: {
    category: "sales" | "ai" | "marketing" | "business",
    difficulty: "beginner" | "intermediate" | "advanced",
    estimatedHours: 7.5,      // Total course time (30 days × 15 min/day)
    tags: ["sales", "b2b", "2026"],
    instructor: "Amanoba"
  }
}
```

### Example Course

```json
{
  "courseId": "MY_COURSE_30",
  "name": "My Course – 30-Day Learning Path",
  "description": "30-day structured course that teaches...",
  "language": "en",
  "durationDays": 30,
  "isActive": false,
  "requiresPremium": false,
  "pointsConfig": {
    "completionPoints": 1000,
    "lessonPoints": 50,
    "perfectCourseBonus": 500
  },
  "xpConfig": {
    "completionXP": 500,
    "lessonXP": 25
  },
  "metadata": {
    "category": "business",
    "difficulty": "intermediate",
    "estimatedHours": 7.5,
    "tags": ["course-topic", "skill"],
    "instructor": "Amanoba"
  }
}
```

---

## Lesson Content Format

### Required Fields (per lesson, days 1-30)

```typescript
{
  lessonId: string;           // Format: "{COURSE_ID}_DAY_{DD}" (e.g., "MY_COURSE_30_DAY_01")
  dayNumber: number;          // 1-30 (must be sequential, no gaps)
  title: string;              // Lesson title (max 200 chars)
  content: string;            // HTML content (full lesson)
  emailSubject: string;       // Email subject (supports {{placeholders}})
  emailBody: string;          // HTML email body (supports {{placeholders}})
  language: string;          // "hu" | "en" | "ru"
  isActive: boolean;          // true (all lessons should be active)
  pointsReward: number;      // Usually 50 (from course.pointsConfig.lessonPoints)
  xpReward: number;          // Usually 25 (from course.xpConfig.lessonXP)
}
```

### Quiz Configuration

```typescript
{
  quizConfig: {
    enabled: true,              // Enable quiz for this lesson
    successThreshold: 100,      // Percentage (0-100) - 100 = all questions must be correct
    questionCount: 5,           // Number of questions shown to student
    poolSize: 15,              // Total questions in pool (system selects questionCount from this)
    required: true              // Must pass quiz to complete lesson
  }
}
```

### Lesson Metadata

```typescript
{
  metadata: {
    estimatedMinutes: 15,       // Reading time (10-30 minutes typical)
    difficulty: "beginner" | "medium" | "hard",
    tags: ["topic", "skill", "practice"]
  }
}
```

### Lesson Content Structure (Best Practice)

Based on production courses, each lesson should follow this structure:

```html
<h1>Lesson Title</h1>
<p><em>Brief summary of what student will learn today.</em></p>
<hr />

<h2>Цель дня</h2> <!-- or "Learning Goal" or "Daily Goal" -->
<ul>
  <li>Specific, measurable objective 1</li>
  <li>Specific, measurable objective 2</li>
  <li>Specific, measurable objective 3</li>
</ul>
<hr />

<h2>Почему это важно</h2> <!-- or "Why it matters" -->
<ul>
  <li>Reason 1</li>
  <li>Reason 2</li>
  <li>Reason 3</li>
</ul>
<hr />

<h2>Объяснение</h2> <!-- or "Explanation" -->
<h3>Subsection 1</h3>
<p>Detailed explanation...</p>
<h3>Subsection 2</h3>
<p>More details...</p>
<hr />

<h2>Примеры</h2> <!-- or "Examples" -->
<h3>Good Example</h3>
<p>What works well...</p>
<h3>Poor Example</h3>
<p>What doesn't work...</p>
<hr />

<h2>Практика 1 — [Exercise Name] (10–15 min)</h2> <!-- or "Practice 1" -->
<ol>
  <li>Step 1</li>
  <li>Step 2</li>
  <li>Step 3</li>
</ol>

<h2>Практика 2 — [Exercise Name] (5–10 min)</h2> <!-- or "Practice 2" -->
<p>Independent exercise...</p>
<hr />

<h2>Подсказка</h2> <!-- or "Tip" or "Key Takeaway" -->
<p><strong>Important insight or reminder.</strong></p>
<hr />

<h2>Доп. материалы (по желанию)</h2> <!-- or "Optional Resources" -->
<ul>
  <li>Resource 1: <a href="https://..." target="_blank" rel="noopener noreferrer">Link</a></li>
  <li>Resource 2: <a href="https://..." target="_blank" rel="noopener noreferrer">Link</a></li>
</ul>
```

### Email Template Placeholders

Use these placeholders in `emailSubject` and `emailBody`:

- `{{courseName}}` – Course name
- `{{dayNumber}}` – Current day (1-30)
- `{{lessonTitle}}` – Lesson title
- `{{lessonContent}}` – Full lesson HTML content
- `{{appUrl}}` – Application URL (from `NEXT_PUBLIC_APP_URL`)
- `{{playerName}}` – Student's display name

**Example Email Subject:**
```
{{courseName}} – Day {{dayNumber}}: {{lessonTitle}}
```

**Example Email Body:**
```html
<h1>{{courseName}}</h1>
<h2>Day {{dayNumber}}: {{lessonTitle}}</h2>
<p>Today you'll learn...</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/MY_COURSE_30/day/{{dayNumber}}">Read the full lesson →</a></p>
```

---

## Quiz Question Format

### Structure

Each quiz question has:
- **Question text** (string)
- **4 options** (array of 4 strings)
- **Correct index** (0-3, which option is correct)
- **Difficulty** ("easy" | "medium" | "hard")
- **Category** (string, usually "Course Specific")

### Format

```typescript
{
  question: string;           // The question text
  options: [string, string, string, string];  // Exactly 4 options
  correctIndex: number;       // 0-3 (which option is correct)
  difficulty: "easy" | "medium" | "hard",
  category: "Course Specific",
  lessonId: string,           // Links to lesson (e.g., "MY_COURSE_30_DAY_01")
  courseId: ObjectId,        // Links to course
  isCourseSpecific: true      // Must be true for course questions
}
```

### Example Quiz Questions (for Day 1)

```typescript
[
  {
    question: "What is the main goal of this lesson?",
    options: [
      "To memorize all concepts",
      "To understand the core principles and apply them",
      "To skip to the next lesson",
      "To read without practice"
    ],
    correctIndex: 1,
    difficulty: "easy",
    category: "Course Specific"
  },
  {
    question: "Which practice exercise should you complete first?",
    options: [
      "Skip all exercises",
      "Practice 1 - Guided exercise (10-15 min)",
      "Only read the examples",
      "Jump to optional resources"
    ],
    correctIndex: 1,
    difficulty: "medium",
    category: "Course Specific"
  },
  {
    question: "What should you do after completing the lesson?",
    options: [
      "Forget everything",
      "Take the quiz to verify understanding",
      "Skip the quiz",
      "Move to day 30"
    ],
    correctIndex: 1,
    difficulty: "easy",
    category: "Course Specific"
  },
  {
    question: "How many quiz questions will you see?",
    options: [
      "10 questions",
      "5 questions (selected from pool of 15)",
      "1 question",
      "No quiz"
    ],
    correctIndex: 1,
    difficulty: "medium",
    category: "Course Specific"
  },
  {
    question: "What percentage do you need to pass the quiz?",
    options: [
      "50%",
      "70%",
      "100% (all 5 questions correct)",
      "Any percentage"
    ],
    correctIndex: 2,
    difficulty: "hard",
    category: "Course Specific"
  }
]
```

### Quiz Question Guidelines

1. **Create 15 questions per lesson** (pool size)
2. **System randomly selects 5** (questionCount)
3. **All 5 must be correct** (successThreshold: 100)
4. **Questions should test understanding**, not memorization
5. **Options should be plausible** (avoid obviously wrong answers)
6. **Cover all major concepts** from the lesson

---

## Complete Example

### Day 1 Lesson (Full Structure)

```typescript
{
  day: 1,
  title: "Introduction to the Topic",
  content: `
<h1>Introduction to the Topic</h1>
<p><em>Today you'll learn the fundamentals and set the foundation for the next 30 days.</em></p>
<hr />

<h2>Learning Goal</h2>
<ul>
  <li>Understand what [topic] is and why it matters</li>
  <li>Identify 3 key principles</li>
  <li>Complete your first practice exercise</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li>Without understanding fundamentals, advanced concepts won't make sense</li>
  <li>This lesson sets the mental model for the entire course</li>
  <li>You'll use these concepts every day going forward</li>
</ul>
<hr />

<h2>Explanation</h2>
<h3>What is [Topic]?</h3>
<p>Detailed explanation of the concept...</p>

<h3>Key Principles</h3>
<ul>
  <li><strong>Principle 1:</strong> Explanation...</li>
  <li><strong>Principle 2:</strong> Explanation...</li>
  <li><strong>Principle 3:</strong> Explanation...</li>
</ul>
<hr />

<h2>Examples</h2>
<h3>Good Example</h3>
<p>This works because...</p>

<h3>Poor Example</h3>
<p>This doesn't work because...</p>
<hr />

<h2>Practice 1 — First Exercise (10–15 min)</h2>
<ol>
  <li>Step 1: Do this...</li>
  <li>Step 2: Then do this...</li>
  <li>Step 3: Finally, do this...</li>
</ol>

<h2>Practice 2 — Independent Exercise (5–10 min)</h2>
<p>Now try this on your own...</p>
<hr />

<h2>Key Takeaway</h2>
<p><strong>The most important thing to remember from today's lesson.</strong></p>
<hr />

<h2>Optional Resources</h2>
<ul>
  <li>Article: <a href="https://example.com/article" target="_blank" rel="noopener noreferrer">Link</a></li>
  <li>Video: <a href="https://example.com/video" target="_blank" rel="noopener noreferrer">Link</a></li>
</ul>
  `.trim(),
  emailSubject: "{{courseName}} – Day 1: Introduction to the Topic",
  emailBody: `
<h1>{{courseName}}</h1>
<h2>Day 1: Introduction to the Topic</h2>
<p>Welcome! Today you'll learn the fundamentals and set the foundation for your 30-day journey.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/MY_COURSE_30/day/1">Read the full lesson →</a></p>
  `.trim(),
  quiz: [
    {
      q: "What is the main goal of today's lesson?",
      options: [
        "To skip ahead",
        "To understand fundamentals and set the foundation",
        "To memorize everything",
        "To finish quickly"
      ],
      correct: 1
    },
    {
      q: "How many key principles are covered?",
      options: [
        "1 principle",
        "2 principles",
        "3 principles",
        "5 principles"
      ],
      correct: 2
    },
    {
      q: "What should you do after reading the lesson?",
      options: [
        "Skip the practice",
        "Complete Practice 1 and Practice 2",
        "Only read examples",
        "Move to day 2"
      ],
      correct: 1
    },
    {
      q: "Which practice exercise comes first?",
      options: [
        "Practice 2 (independent)",
        "Practice 1 (guided, 10-15 min)",
        "Optional resources",
        "Quiz only"
      ],
      correct: 1
    },
    {
      q: "What is the key takeaway?",
      options: [
        "Skip everything",
        "The most important thing to remember from today's lesson",
        "Forget what you learned",
        "Don't practice"
      ],
      correct: 1
    }
  ]
}
```

---

## Step-by-Step Process

### Phase 1: Planning (Before Writing)

1. **Define Course Topic**
   - What will students learn?
   - Who is the target audience?
   - What is the learning path (beginner → advanced)?

2. **Create 30-Day Outline**
   - Days 1-5: Fundamentals
   - Days 6-10: Building on basics
   - Days 11-15: Intermediate concepts
   - Days 16-20: Advanced topics
   - Days 21-25: Specialized applications
   - Days 26-30: Mastery and implementation

3. **Plan Each Day**
   - What concept will be taught?
   - What practice exercises?
   - What quiz questions (15 per day)?

### Phase 2: Content Creation

1. **Write Course Metadata**
   - Course ID (uppercase, unique)
   - Name and description
   - Language
   - Points/XP config

2. **Write 30 Lessons**
   - Follow the lesson structure template
   - Include all sections (Goal, Why, Explanation, Examples, Practice, Takeaways)
   - Write email templates with placeholders

3. **Create 450 Quiz Questions** (15 per lesson)
   - Test understanding, not memorization
   - Cover all major concepts
   - Make options plausible

### Phase 3: Formatting

1. **HTML Formatting**
   - Use proper HTML tags (`<h1>`, `<h2>`, `<ul>`, `<ol>`, `<p>`, `<hr />`)
   - Use `<strong>` for emphasis
   - Use `<em>` for italics
   - Include links with `target="_blank" rel="noopener noreferrer"`

2. **Email Templates**
   - Use placeholders: `{{courseName}}`, `{{dayNumber}}`, `{{lessonTitle}}`, `{{lessonContent}}`, `{{appUrl}}`
   - Keep subject lines short (< 60 chars)
   - Include link to full lesson

3. **Quiz Questions**
   - Exactly 4 options per question
   - Correct index: 0-3 (which option is correct)
   - Difficulty: "easy", "medium", or "hard"

### Phase 4: Seed Script Creation

1. **Create Seed Script**
   - File: `scripts/seed-{course-name}.ts`
   - Follow pattern from `seed-b2b-sales-ru.ts` or `seed-geo-shopify-course-en.ts`

2. **Structure**
   ```typescript
   const lessonPlan: LessonSeed[] = [
     // Day 1
     {
       day: 1,
       title: "...",
       contentHtml: "...",
       emailSubject: "...",
       emailBodyHtml: "...",
       quiz: [...]
     },
     // ... 29 more days
   ];
   ```

3. **Seed Function**
   - Connect to MongoDB
   - Find or create Brand
   - Create or update Course
   - Loop through lessonPlan and create Lessons
   - Create QuizQuestions for each lesson

### Phase 5: Testing

1. **Run Seed Script**
   ```bash
   npx tsx scripts/seed-{course-name}.ts
   ```

2. **Verify in Admin UI**
   - Go to `/{locale}/admin/courses`
   - Check course appears
   - Check all 30 lessons exist
   - Check quiz questions exist (15 per lesson)

3. **Test Enrollment**
   - Enroll in course
   - Access Day 1 lesson
   - Take quiz
   - Verify completion

4. **Test Email Delivery**
   - Check email templates render correctly
   - Verify placeholders are replaced

---

## Best Practices

### Content Quality

1. **Progressive Learning**
   - Each day builds on previous
   - Start simple, get complex
   - Review key concepts periodically

2. **Practical Focus**
   - Every lesson should have hands-on exercises
   - Include real-world examples
   - Provide actionable takeaways

3. **Clear Structure**
   - Use consistent section headers
   - Break content into digestible chunks
   - Use lists and examples liberally

### Quiz Questions

1. **Test Understanding**
   - Ask "why" and "how", not just "what"
   - Include scenario-based questions
   - Test application, not memorization

2. **Plausible Options**
   - All 4 options should be reasonable
   - Avoid obviously wrong answers
   - Use common misconceptions as wrong options

3. **Coverage**
   - Test all major concepts from lesson
   - Mix easy, medium, and hard questions
   - Ensure questions align with learning goals

### Email Templates

1. **Engaging Subjects**
   - Include day number and topic
   - Make it actionable
   - Keep it short

2. **Preview Content**
   - Include lesson summary in email
   - Show learning goals
   - Link to full lesson

3. **Personalization**
   - Use `{{playerName}}` when appropriate
   - Use `{{courseName}}` for branding
   - Use `{{appUrl}}` for links

### Technical

1. **Naming Conventions**
   - Course ID: `UPPERCASE_WITH_UNDERSCORES`
   - Lesson ID: `{COURSE_ID}_DAY_{DD}` (e.g., `MY_COURSE_30_DAY_01`)
   - Consistent across all 30 days

2. **HTML Validation**
   - Use proper HTML structure
   - Close all tags
   - Escape special characters
   - Test rendering in browser

3. **Placeholder Usage**
   - Always use placeholders in email templates
   - Don't hardcode values
   - Test placeholder replacement

---

## Reference: Production Course Examples

### Course Phases (30 Days)

**Days 1-5: Foundations**
- Day 1: Introduction and core concepts
- Day 2: Basic principles
- Day 3: Common mistakes
- Day 4: First practical application
- Day 5: Review and consolidation

**Days 6-10: Building Skills**
- Daily practice exercises
- Progressive complexity
- Real-world scenarios

**Days 11-15: Intermediate**
- Advanced concepts
- System building
- Workflow development

**Days 16-20: Advanced**
- Specialized topics
- Role-specific applications
- Optimization techniques

**Days 21-25: Mastery**
- Complex scenarios
- Integration concepts
- Best practices

**Days 26-30: Implementation**
- Personal development
- Long-term planning
- Next steps

---

## Quick Checklist

Before creating your course, ensure you have:

- [ ] Course topic and 30-day outline
- [ ] Course metadata (ID, name, description, language)
- [ ] 30 lesson titles (one per day)
- [ ] 30 lesson content blocks (HTML formatted)
- [ ] 30 email subjects
- [ ] 30 email bodies (with placeholders)
- [ ] 450 quiz questions (15 per lesson, 4 options each)
- [ ] Quiz configuration (5 shown, 15 in pool, 100% threshold)
- [ ] Metadata for each lesson (estimated minutes, difficulty, tags)

---

## Next Steps

1. **Prepare Your Content**
   - Write all 30 lessons following the structure
   - Create all 450 quiz questions
   - Format everything in HTML

2. **Create Seed Script**
   - Use `scripts/seed-b2b-sales-ru.ts` as template
   - Adapt for your course
   - Test locally

3. **Run Seed Script**
   - Verify all data is created
   - Check in admin UI
   - Test enrollment and lessons

4. **Publish Course**
   - Set `isActive: true` on course
   - Verify all lessons are active
   - Test email delivery

---

**Last Updated**: 2026-01-22  
**Status**: ✅ Complete and ready for use  
**Based on**: Production courses (AI_30_NAP, GEO_SHOPIFY_30_EN, B2B_SALES_2026_30_RU)
