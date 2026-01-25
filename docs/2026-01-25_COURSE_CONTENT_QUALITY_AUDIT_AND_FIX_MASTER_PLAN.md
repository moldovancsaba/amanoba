# Course Content Quality Audit and Fix - Master Plan

**Status**: 🟢 READY TO START  
**Created**: 2026-01-25  
**Priority**: P0 (Critical - Content Quality)  
**Scope**: 18 courses × 30 lessons = 540 lessons total  
**Update Method**: API or Seed Scripts (developer's choice, safe for system)  
**Language Coverage**: All languages (fix all courses regardless of language)  
**Progress Reports**: Every 5 lessons

---

## 📋 Executive Summary

This document tracks the comprehensive quality audit and fix of all course content across the platform. Every lesson will be reviewed and corrected by a rhetoric and communication professor-level standard to ensure:

- **Grammar & Language**: Perfect grammar, spelling, punctuation
- **Tone & Style**: Professional, clear, engaging, appropriate for learning
- **Logic & Flow**: Coherent structure, logical progression, no contradictions
- **Fact-Checking**: Accurate, up-to-date information, no outdated references
- **Content Quality**: Respectful of learners, educational value maximized

---

## 🎯 Objectives

1. **Fix all critical errors** in course content (grammar, typos, punctuation)
2. **Improve tone and style** to match professional educational standards
3. **Eliminate logical errors** and contradictions
4. **Fact-check and update** outdated information
5. **Ensure consistency** across all courses
6. **Respect the learners** - content must be worthy of their time and trust

---

## 📊 Scope & Scale

### Course Inventory
- **Total Courses**: 18
- **Lessons per Course**: 30
- **Total Lessons**: 540
- **Languages**: Multiple (primarily Hungarian and English)

### Starting Point
- **First Course**: "GEO Shopify – 30-day course" (GEO_SHOPIFY_30)
- **Order**: Oldest to newest (by `createdAt` date)

---

## 🔍 Quality Standards

### Grammar & Language
- ✅ Zero grammatical errors
- ✅ Correct spelling (language-specific)
- ✅ Proper punctuation
- ✅ Consistent terminology
- ✅ Subject-verb agreement (e.g., "Nincsenek számok" not "Nincs számok")

### Tone & Style (MANDATORY STANDARDS)
- ✅ **Conversational Engagement**: Write as if talking directly to a friend/colleague. Use "you" and "I" for immediate connection
- ✅ **Active Voice**: Always favor active voice ("The developer fixed the bug") over passive ("The bug was fixed")
- ✅ **Plain Language**: Avoid academic jargon but keep industry standard phrases. Replace complex words with simpler alternatives
- ✅ **Frontloading (Inverted Pyramid)**: Put critical information and WIIFM (What's In It For Me) first. Skimmers should grasp main point in first few seconds
- ✅ **Microlearning (Chunking)**: Break into 5-10 minute bite-sized modules, each with single performance-based objective
- ✅ **Modular Self-Containment**: Structure paragraphs to stand alone. Learners can jump to needed info without reading preceding sections
- ✅ **Bulleted and Numbered Lists**: Use lists to break up "walls of text." Numbered for sequences, bullets for non-hierarchical items
- ✅ **Descriptive Subheadings**: Headings that tell what they'll learn ("How to Set Up Your Dashboard") not vague titles ("Introduction")
- ✅ **Action Verbs**: Use strong action verbs ("Analyze," "Construct," "Solve") in learning objectives
- ✅ **Problem-Based Learning**: Start with scenario/question that activates prior knowledge
- ✅ **Show, Don't Just Tell**: Use real-world examples, analogies, brief storytelling to make abstract concepts concrete

### Logic & Structure
- ✅ Coherent flow of ideas
- ✅ Logical progression
- ✅ No contradictions within or between lessons
- ✅ Clear learning objectives
- ✅ Proper section organization

### Fact-Checking (COMPREHENSIVE)
- ✅ Accurate technical information
- ✅ Up-to-date references (no outdated URLs, dates, or facts)
- ✅ Correct version numbers (if applicable)
- ✅ Valid external links
- ✅ Current best practices
- ✅ **Outdated Facts & Dates**: Update to fresh information. For information that could become outdated, add date when it was true (e.g., "As of January 2026, Shopify API v2024-01 supports...")
- ✅ Verify all technical claims
- ✅ Check all external resources are still accessible

### Content Quality
- ✅ Educational value
- ✅ Actionable insights
- ✅ Clear examples
- ✅ Practical exercises
- ✅ Respectful of learner's time

---

## 📝 Workflow Process

### Phase 1: Preparation ✅
1. ✅ Create this master plan document
2. ⏳ Get clarifications from Sultan
3. ⏳ List all courses with metadata (courseId, name, language, createdAt)
4. ⏳ Create detailed tracking for each course

### Phase 2: Course-by-Course Audit
For each course (oldest first):

1. **Course Overview**
   - Review course metadata (name, description)
   - Check course-level consistency

2. **Lesson-by-Lesson Review** (Day 1 → Day 30)
   For each lesson:
   - Read full content (title, content, emailSubject, emailBody)
   - Apply quality standards checklist
   - Document all issues found
   - Fix all issues
   - Update database via API or seed script
   - Mark lesson as ✅ COMPLETE

3. **Course Completion**
   - Final review of course
   - Update course metadata if needed
   - Mark course as ✅ COMPLETE

### Phase 3: Final Verification
- Cross-course consistency check
- Final quality pass
- Documentation update

---

## 📋 Action Items Tracking

### Course List (Ordered by Creation Date)

| # | Course ID | Course Name | Language | Status | Lessons Fixed | Started | Completed |
|---|-----------|-------------|----------|--------|---------------|---------|-----------|
| 1 | GEO_SHOPIFY_30 | GEO Shopify – 30-day course | hu | 🔄 IN PROGRESS | 25/30 | 2026-01-25 | - |
| 2 | ? | ? | ? | ⏳ PENDING | 0/30 | - | - |
| 3 | ? | ? | ? | ⏳ PENDING | 0/30 | - | - |
| ... | ... | ... | ... | ... | ... | ... | ... |
| 18 | ? | ? | ? | ⏳ PENDING | 0/30 | - | - |

**Status Legend**:
- ⏳ PENDING - Not started
- 🔄 IN PROGRESS - Currently being worked on
- ✅ COMPLETE - All lessons fixed and verified
- ⚠️ BLOCKED - Waiting for clarification/decision

### Current Work

**Active Course**: GEO_SHOPIFY_30 (Hungarian)  
**Active Lesson**: Lesson 21  
**Last Updated**: 2026-01-25  
**Progress**: 20/30 lessons complete (66.7%) - All updated in database and available to learners

---

## 🔧 Technical Implementation

### Data Access
- **Database**: MongoDB
- **Models**: `Course`, `Lesson` from `app/lib/models`
- **API Endpoints**: 
  - GET `/api/admin/courses/[courseId]/lessons` - List lessons
  - PATCH `/api/admin/courses/[courseId]/lessons/[lessonId]` - Update lesson
- **Seed Scripts**: Can update lessons via `findOneAndUpdate`

### Update Method
**Decision**: Developer's choice - API or Seed Scripts (whichever is safest for the system)
- Will use most appropriate method per course/lesson
- Prefer seed scripts for batch updates
- Use API for individual corrections if needed

### Fields to Review & Fix
- `title` - Lesson title
- `content` - Main lesson content (HTML)
- `emailSubject` - Email subject line
- `emailBody` - Email body content (HTML)
- `metadata` - Additional metadata (if contains text)

---

## 📚 Quality Checklist (Per Lesson)

### Grammar & Language
- [ ] No grammatical errors
- [ ] Correct spelling
- [ ] Proper punctuation
- [ ] Subject-verb agreement
- [ ] Consistent terminology
- [ ] Proper capitalization

### Tone & Style
- [ ] Professional tone
- [ ] Clear and concise
- [ ] Engaging without condescension
- [ ] Appropriate for target audience
- [ ] Consistent voice

### Logic & Structure
- [ ] Coherent flow
- [ ] Logical progression
- [ ] No contradictions
- [ ] Clear learning objectives
- [ ] Proper section breaks

### Fact-Checking
- [ ] Accurate technical info
- [ ] Up-to-date references
- [ ] Valid URLs
- [ ] Current best practices
- [ ] No outdated information

### Content Quality
- [ ] Educational value
- [ ] Actionable insights
- [ ] Clear examples
- [ ] Practical exercises
- [ ] Respectful of learner's time

---

## 🚨 Issues & Blockers

### Current Blockers
- ✅ All clarifications received - Ready to start

### Known Issues
- None yet (will be documented as work progresses)

---

## 📈 Progress Tracking

### Overall Progress
- **Courses Completed**: 1 / 18 (5.6%)
- **Lessons Completed**: 30 / 540 (5.6%)
- **Current Course**: GEO_SHOPIFY_30 (English) - Next
- **Current Lesson**: Lesson 1 (next course)
- **Batches Complete**: ✅ GEO_SHOPIFY_30 (Hungarian) - ALL 30 LESSONS COMPLETE! ✅ Lessons 1-5, ✅ Lessons 6-10, ✅ Lessons 11-15, ✅ Lessons 16-20, ✅ Lessons 21-25, ✅ Lessons 26-30 (all fixed and updated in database)

### Daily Progress Log

#### 2026-01-25
- ✅ Created master plan document
- ✅ Received all clarifications from Sultan
- ✅ Updated plan with style guidelines and quality standards
- ✅ Added comprehensive Quality Control section to course creation checklist (including Quiz Quality Control)
- ✅ **Course #1 Started**: GEO_SHOPIFY_30 (Hungarian)
  - ✅ **Lesson 1 COMPLETE**: Fixed grammar, improved conversational tone, updated dates (2025→2026), applied all style guidelines
  - ✅ **Lesson 2 COMPLETE**: Fixed grammar, improved structure, added date disclaimer for API reference, applied style guidelines
  - ✅ **Lesson 3 COMPLETE**: Fixed conversational tone, improved structure, added date disclaimers - ✅ DATABASE UPDATED
  - ✅ **Lesson 4 COMPLETE**: Fixed conversational tone, improved structure, added date disclaimers - ✅ DATABASE UPDATED
  - ✅ **Lesson 5 COMPLETE**: Fixed conversational tone, improved structure, added date disclaimers - ✅ DATABASE UPDATED
  - ✅ **FIRST BATCH (Lessons 1-5) COMPLETE**: All 5 lessons fixed, updated in database, available to learners
  - 🔄 **Lessons 6-10 IN PROGRESS**: Next batch
  - ⏳ Lessons 6-30: Pending
- 📝 **Update Method**: Using individual update scripts per lesson (safest approach - one lesson at a time)
- 📝 **Note**: Each lesson gets its own update script, then we run it to update database safely

---

## 🔄 Handover Instructions

If work needs to be continued by another agent or developer:

1. **Read this document first** - Understand the scope and standards
2. **Check "Current Work" section** - See what's in progress
3. **Review "Action Items Tracking"** - See what's done and what's pending
4. **Continue from the last incomplete course/lesson**
5. **Follow the Quality Checklist** - Don't skip steps
6. **Update this document** - Mark progress as you go
7. **Maintain consistency** - Follow the same standards throughout

### Key Files
- This document: `/docs/2026-01-25_COURSE_CONTENT_QUALITY_AUDIT_AND_FIX_MASTER_PLAN.md`
- Course models: `/app/lib/models/course.ts`, `/app/lib/models/lesson.ts`
- Update API: `/app/api/admin/courses/[courseId]/lessons/[lessonId]/route.ts`

### Key Commands
- List all courses: Run `scripts/check-all-courses.ts`
- Get lesson content: Use API `GET /api/admin/courses/[courseId]/lessons`
- Update lesson: Use API `PATCH /api/admin/courses/[courseId]/lessons/[lessonId]`

---

## ✅ Clarifications Received (2026-01-25)

1. **Update Method**: ✅ Developer's choice - API or Seed Scripts (safest for system)
2. **Language Priority**: ✅ Fix ALL languages - every course regardless of language
3. **Fact-Checking Scope**: ✅ Everything - technical accuracy, links, versions, best practices, outdated facts
4. **Tone Guidelines**: ✅ Comprehensive style guide provided (see Tone & Style section above)
5. **Outdated Information**: ✅ Update to fresh info, add date disclaimers for time-sensitive content
6. **Course Order**: ✅ Start with "GEO Shopify – 30-day course" (oldest first)
7. **Progress Updates**: ✅ Every 5 lessons
8. **Testing**: ✅ No UI verification needed

---

## 📝 Notes

- This is a comprehensive, one-time quality pass
- Quality over speed - each lesson must meet all standards
- Document issues as we find them for future reference
- Maintain consistency across all courses

---

**Last Updated**: 2026-01-25  
**Next Steps**: Begin Course #1 (GEO_SHOPIFY_30), Lesson 1, fixing all languages
