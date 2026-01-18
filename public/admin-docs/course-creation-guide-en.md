# Amanoba Course Creation Guide (EN)

**Version**: 2.0  
**Last Updated**: 2025-01-17  
**Based on**: Production AI_30_NAP course implementation

This guide is based on the actual implementation of the AI_30_NAP course and learnings from the development process.

---

## Overview: How the Course System Works

Courses are stored as documents in MongoDB using Mongoose schemas:

- **Course**: Course metadata (name, description, language, points/XP config, status, brandId)
- **Lesson**: Daily lesson (1-30), content + email subject/body
- **CourseProgress**: User progress (current day, completed lessons, enrollment status)

**Key Files:**
- `app/lib/models/course.ts`
- `app/lib/models/lesson.ts`
- `app/lib/models/course-progress.ts`

**Publishing Key**: Both `Course.isActive = true` AND `Lesson.isActive = true` must be set.

---

## Prerequisites

- Admin access: `/{locale}/admin` (default: `/en/admin`)
- Database configured: `MONGODB_URI` in `.env.local`
- Email service: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXT_PUBLIC_APP_URL`
- Daily emails: `CRON_SECRET` + Vercel cron (POST `/api/cron/send-daily-lessons`)

---

## Step 1: Create Course (Course Model)

**UI Path**: `/{locale}/admin/courses/new`  
**API Endpoint**: `POST /api/admin/courses`

### Required Fields

- `courseId` – **Uppercase only**, numbers, underscores (e.g., `AI_30_NAP`, `ENTREPRENEURSHIP_101`)
  - Must match regex: `/^[A-Z0-9_]+$/`
  - Must be unique across all courses
- `name` – Course display name (max 200 characters)
- `description` – Course description (max 2000 characters)

### Recommended Settings

- `language`: `hu` (Hungarian) or `en` (English) - default: `hu`
- `durationDays`: `30` (standard for 30-day courses)
- `requiresPremium`: `false` (unless truly premium-only)
- `thumbnail`: Optional image URL for course listing

### Points & XP Configuration

**Default Values** (based on AI_30_NAP):
```json
{
  "pointsConfig": {
    "completionPoints": 1000,
    "lessonPoints": 50,
    "perfectCourseBonus": 500
  },
  "xpConfig": {
    "completionXP": 500,
    "lessonXP": 25
  }
}
```

### Brand Configuration

**Important**: Every course requires a valid `brandId`. The system will:
- Automatically find or create the default "Amanoba" brand if no `brandId` is provided
- Validate `brandId` if provided
- Return error if `brandId` is invalid or missing

### Example Course (from AI_30_NAP)

```json
{
  "courseId": "AI_30_NAP",
  "name": "AI 30 Nap – tematikus tanulási út",
  "description": "30 napos, strukturált AI-kurzus, amely az alapoktól a haladó használatig vezet. Napi 10-15 perces leckékkel építsd be az AI-t a munkádba és a mindennapi életedbe.",
  "language": "hu",
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
    "category": "ai",
    "difficulty": "beginner",
    "estimatedHours": 7.5,
    "tags": ["ai", "productivity", "workflows", "business"],
    "instructor": "Amanoba"
  }
}
```

**Note**: The Course model does NOT store lessons in an array. Each lesson is a separate Lesson document linked via `courseId` (ObjectId reference).

---

## Step 2: Create 30 Lessons (Lesson Model)

**UI Path**: `/{locale}/admin/courses/{courseId}` (after course creation)  
**API Endpoint**: `POST /api/admin/courses/{courseId}/lessons`

### Required Fields (for each day 1-30)

- `lessonId` – Unique identifier (recommended format: `{COURSE_ID}_DAY_{DD}`)
  - Example: `AI_30_NAP_DAY_01`, `AI_30_NAP_DAY_02`, etc.
  - Must be unique per course
- `dayNumber` – Integer 1-30 (must be sequential, no gaps)
- `title` – Lesson title (shown in UI and emails)
- `content` – HTML content (full lesson content)
- `emailSubject` – Email subject line (supports placeholders)
- `emailBody` – HTML email body (supports placeholders)

### Optional Fields

- `assessmentGameId` – Link to a game for assessment (ObjectId)
- `pointsReward` – Override course default (default: `course.pointsConfig.lessonPoints`)
- `xpReward` – Override course default (default: `course.xpConfig.lessonXP`)
- `translations` – Multi-language support (Map structure)
- `metadata` – Flexible field for extra data:
  - `estimatedMinutes`: Reading time
  - `difficulty`: 'easy' | 'medium' | 'hard'
  - `tags`: Array of tags
  - Custom fields (prompt templates, tasks, tips, etc.)

### Email Template Placeholders

The email service supports these placeholders in `emailSubject` and `emailBody`:

- `{{courseName}}` – Course name
- `{{dayNumber}}` – Current day (1-30)
- `{{lessonTitle}}` – Lesson title
- `{{lessonContent}}` – Full lesson HTML content
- `{{appUrl}}` – Application URL (from `NEXT_PUBLIC_APP_URL`)
- `{{playerName}}` – Student's display name

**Important**: Use placeholders in email templates. The email service will replace them at send time.

### Example Lesson (Day 1 from AI_30_NAP)

```json
{
  "lessonId": "AI_30_NAP_DAY_01",
  "dayNumber": 1,
  "title": "Mi az AI valójában – és mire NEM való?",
  "content": "<h2>Napi cél</h2><p>Megismered, hogy mi az AI valójában...</p><h2>Mit fogsz megtanulni?</h2><ul>...</ul>",
  "emailSubject": "AI 30 Nap – 1. nap: Mi az AI valójában?",
  "emailBody": "<h1>{{courseName}}</h1><h2>{{dayNumber}}. nap: {{lessonTitle}}</h2><div>{{lessonContent}}</div><p><a href=\"{{appUrl}}/courses/AI_30_NAP/day/{{dayNumber}}\">Read full lesson →</a></p>",
  "pointsReward": 50,
  "xpReward": 25,
  "isActive": true,
  "displayOrder": 1,
  "language": "hu",
  "metadata": {
    "estimatedMinutes": 10,
    "difficulty": "beginner",
    "tags": ["ai", "basics", "daily-practice"]
  }
}
```

### Lesson Content Structure (Best Practice)

Based on AI_30_NAP, each lesson should include:

1. **Daily Goal** (`<h2>Napi cél</h2>`) – What the student will achieve
2. **What You'll Learn** (`<h2>Mit fogsz megtanulni?</h2>`) – Learning objectives
3. **Practice** (`<h2>Gyakorlat</h2>`) – Hands-on exercises
4. **Key Takeaways** (`<h2>Kulcs tanulságok</h2>`) – Important points
5. **Homework** (`<h2>Házi feladat</h2>`) – Optional follow-up task

**Format**: Use HTML for rich formatting. The content is rendered in the lesson viewer.

---

## Step 3: Publishing (Draft → Published)

**UI Path**: `/{locale}/admin/courses/{courseId}`

### Activation Steps

1. **Activate Course**: Toggle `isActive` to `true` in the course editor
2. **Verify Lessons**: Ensure all 30 lessons have `isActive: true`
3. **Check Brand**: Verify course has valid `brandId`

Once published, the course appears in:
- Public course listing: `/{locale}/courses`
- Student enrollment: `/{locale}/courses/{courseId}`

### Visibility Requirements

For a course to be visible to students:
- ✅ `Course.isActive = true`
- ✅ `Course.requiresPremium = false` (or student is premium)
- ✅ At least one `Lesson` with `isActive: true` exists
- ✅ Valid `brandId` reference

---

## Step 4: Testing & Enrollment

### Test Enrollment

**API**: `POST /api/courses/{courseId}/enroll`  
**UI**: `/{locale}/courses/{courseId}` → Click "Enroll"

### Test Lesson Access

**API**: `GET /api/courses/{courseId}/day/{dayNumber}`  
**UI**: `/{locale}/courses/{courseId}/day/1`

### Troubleshooting

If course/lessons don't appear, check:
- ✅ `Course.isActive = true`
- ✅ `Lesson.isActive = true` for all lessons
- ✅ `dayNumber` is 1-30 (no gaps)
- ✅ `courseId` matches exactly (case-sensitive)
- ✅ Brand exists and is active
- ✅ No API errors in browser console

---

## Step 5: Email Delivery Testing

### Development Mode

**Manual Trigger**: `GET /api/cron/send-daily-lessons` (no auth required in dev)

### Production Mode

**Cron Endpoint**: `POST /api/cron/send-daily-lessons`  
**Header**: `Authorization: Bearer <CRON_SECRET>`

### Email Scheduling

Emails are sent based on:
- `CourseProgress.currentDay` – Which day the student is on
- `CourseProgress.emailSentDays` – Days already sent (prevents duplicates)
- Student's timezone and preferred email time (from email settings)

### Email Template Best Practices

1. **Use Placeholders**: Always use `{{placeholders}}` in email templates
2. **Include Lesson Link**: Always include a link to the full lesson
3. **Keep Subject Short**: Email subjects should be concise (< 60 chars)
4. **HTML Formatting**: Use proper HTML structure for readability

---

## Step 6: Content Import (Faster Workflow)

Instead of manually creating 30 lessons via UI, use a seed script:

### Seed Script Pattern

**File**: `scripts/seed-{course-name}.ts`  
**Usage**: `npm run seed:{course-name}`

**Example Structure** (from `seed-ai-30-nap-course.ts`):

```typescript
const lessonPlan = [
  {
    day: 1,
    title: 'Lesson Title',
    content: '<h2>...</h2>',
    emailSubject: 'Day {{dayNumber}}: {{lessonTitle}}',
    emailBody: '<h1>{{courseName}}</h1>...',
  },
  // ... 29 more lessons
];

// Seed function
async function seed() {
  // 1. Connect to MongoDB
  // 2. Find or create Brand
  // 3. Create or update Course
  // 4. Loop through lessonPlan and create Lessons
  // 5. Use upsert to avoid duplicates
}
```

**Benefits**:
- ✅ Faster than manual UI entry
- ✅ Version controlled (in git)
- ✅ Repeatable (can re-run safely)
- ✅ Can include all 30 lessons in one file

---

## Step 7: Multi-Language Support

### Course-Level Translations

Both `Course` and `Lesson` models support `translations` field:

```typescript
translations: Map<string, {
  name: string;
  description: string;
  // For lessons: title, content, emailSubject, emailBody
}>
```

### Current Implementation

- **Primary Language**: Set via `language` field (`hu` or `en`)
- **Translations**: Store in `translations` Map (key = locale code)
- **API**: Currently returns primary language only (translation API expansion needed)

### Best Practice

For now, create separate courses for different languages:
- `AI_30_NAP` (Hungarian)
- `AI_30_DAYS` (English) - future

---

## Step 8: Common Issues & Solutions

### Issue: Course Not Visible

**Symptoms**: Course exists in DB but doesn't appear in `/courses` list

**Solutions**:
1. Check `isActive: true` on Course
2. Check `requiresPremium: false` (or student is premium)
3. Verify API query: `/api/courses?status=active`
4. Check browser console for API errors
5. Verify `brandId` is valid

### Issue: Lessons Not Loading

**Symptoms**: Course visible but lessons return 404

**Solutions**:
1. Verify `dayNumber` is 1-30 (no gaps)
2. Check `Lesson.isActive = true`
3. Verify `courseId` matches exactly (case-sensitive)
4. Check lesson exists: `Lesson.findOne({ courseId, dayNumber })`

### Issue: Email Not Sending

**Symptoms**: Students enrolled but not receiving daily emails

**Solutions**:
1. Check `RESEND_API_KEY` is set
2. Verify cron job is configured in Vercel
3. Check `CRON_SECRET` matches in request header
4. Verify student has email preferences enabled
5. Check `CourseProgress.emailSentDays` array

### Issue: Course Creation Fails

**Symptoms**: "Failed to create course" error

**Solutions**:
1. Verify `courseId` is unique (uppercase, no spaces)
2. Check required fields: `courseId`, `name`, `description`
3. Verify `brandId` is valid ObjectId (or let system create default)
4. Check API response for specific error message
5. Verify admin authentication

---

## Step 9: Quick Checklist

Before publishing a course, verify:

- [ ] Course created with valid `courseId` (uppercase, unique)
- [ ] All 30 lessons created (days 1-30, no gaps)
- [ ] All lessons have `isActive: true`
- [ ] Course has `isActive: true`
- [ ] Course has valid `brandId`
- [ ] Email templates use placeholders (`{{courseName}}`, `{{dayNumber}}`, etc.)
- [ ] Lesson content is HTML formatted
- [ ] Course appears in `/courses` listing
- [ ] Enrollment works (`POST /api/courses/{courseId}/enroll`)
- [ ] Day 1 lesson accessible (`/courses/{courseId}/day/1`)
- [ ] Email delivery tested (manual or cron)

---

## Step 10: Best Practices (From AI_30_NAP)

### Content Structure

1. **Start with Basics**: Days 1-5 should cover fundamentals
2. **Build Progressively**: Each day builds on previous
3. **Include Practice**: Every lesson should have hands-on exercises
4. **Provide Examples**: Include prompt examples, templates, tips
5. **End with Action**: Final days should focus on implementation

### Email Templates

1. **Personalize**: Use `{{playerName}}` and `{{courseName}}`
2. **Include Link**: Always link to full lesson
3. **Preview Content**: Include lesson preview in email body
4. **Clear Subject**: Make subject line actionable

### Metadata Usage

Use `metadata` field to store:
- Learning objectives
- Prerequisites
- Estimated time
- Difficulty level
- Tags for filtering
- Custom fields (prompts, tasks, tips)

### Lesson Naming

- Use consistent `lessonId` format: `{COURSE_ID}_DAY_{DD}`
- Keep titles concise but descriptive
- Include day number in email subject

---

## Reference: AI_30_NAP Course Structure

### Course Phases

**Days 1-5**: Basics & Mindset
- Day 1: What AI really is (and what it's NOT for)
- Day 2: The 4 elements of a good prompt
- Day 3: How to ask follow-up questions
- Day 4: Style and tone – teach it to "write like you"
- Day 5: Security & ethics in practice

**Days 6-10**: Daily Work Facilitation
- Email writing, meeting notes, document creation
- Table thinking with AI
- Review & prompt debugging

**Days 11-15**: System Building
- Personal prompt library
- Workflow: input → processing → output
- Error handling, hallucination management
- Personal "AI assistant" voice development

**Days 16-20**: Role-Specific Usage
- Role-adapted template packages
- Common pitfalls in specific roles
- Skill check & level up

**Days 21-25**: AI for Revenue
- Idea validation with AI
- Persona & value proposition
- Landing page drafts and copy
- Pricing basics
- MVP thinking

**Days 26-30**: Closing & Next Level
- Personal AI routine development
- 60-second pitch with AI
- Portfolio-level outputs
- Personal development roadmap
- Closing – where to go next

---

## API Reference

### Course Endpoints

- `GET /api/admin/courses` – List all courses (admin)
- `POST /api/admin/courses` – Create course (admin)
- `GET /api/admin/courses/{courseId}` – Get course details (admin)
- `PATCH /api/admin/courses/{courseId}` – Update course (admin)
- `GET /api/courses` – List active courses (public)
- `GET /api/courses/{courseId}` – Get course details (public)
- `POST /api/courses/{courseId}/enroll` – Enroll in course

### Lesson Endpoints

- `GET /api/admin/courses/{courseId}/lessons` – List lessons (admin)
- `POST /api/admin/courses/{courseId}/lessons` – Create lesson (admin)
- `GET /api/courses/{courseId}/day/{dayNumber}` – Get lesson (public)

### Email Endpoints

- `GET /api/cron/send-daily-lessons` – Test email delivery (dev)
- `POST /api/cron/send-daily-lessons` – Send daily emails (prod, requires auth)

---

**Last Updated**: 2025-01-17  
**Based on**: Production AI_30_NAP course (30 lessons, fully seeded)  
**Status**: ✅ Tested and verified in production
