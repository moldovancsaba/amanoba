# 🎯 QUIZ QUALITY AUDIT & ENHANCEMENT - MASTER PROJECT PLAN

**Project Owner**: Sultan  
**Project Lead**: AI Developer  
**Start Date**: 2026-01-24  
**Status**: 🟢 **READY TO RESUME** (Language separation complete, architecture ready)  
**Last Updated**: 2026-01-25  
**Paused For**: Course Language Separation (2026-01-24 to 2026-01-25)  
**Resume Date**: 2026-01-25

---

## 📌 PROJECT OVERVIEW

### Mission
Audit, enhance, and standardize ALL quiz questions across the Amanoba platform to ensure:
- ✅ **Standalone Questions**: Every question works independently (no references to other questions)
- ✅ **High Value**: All questions teach and provide learning value
- ✅ **Proper Length**: 7 questions per quiz (currently 5)
- ✅ **Balanced Difficulty**: Mix of recall (60%), application (30%), and critical thinking (10%)
- ✅ **Language Quality**: Native-level industry terminology across all languages
- ✅ **Searchability**: UUID + hashtags for future filtering and anonymization

### Scope
| Metric | Count |
|--------|-------|
| **Total Courses** | 8 unique topics |
| **Language Variants** | 10-11 per course |
| **Course Instances** (in menu) | ~80-88 total |
| **Lessons per Course** | 30 lessons |
| **Total Lessons** | ~2,400 lessons |
| **Questions Currently** | 5 per lesson = ~12,000 questions |
| **Questions After Enhancement** | 7 per lesson = ~16,800 questions |
| **Questions to Add** | 2 per lesson = ~4,800 new questions |
| **Questions to Audit** | All ~12,000 existing questions |

### Expected Deliverables
- ✅ 16,800 high-quality, standalone quiz questions
- ✅ Complete UUID system for all questions
- ✅ Multi-level hashtag system (#topic, #difficulty, #type, #language)
- ✅ Updated Mongoose schema for QuizQuestion model
- ✅ Migration script to add UUIDs and hashtags to existing questions
- ✅ Complete audit documentation for each course/lesson/language

---

## 🔧 TECHNICAL SPECIFICATIONS

### Database Schema Updates

**Current QuizQuestion Model** (before):
```javascript
{
  lessonId: String,
  question: String,
  options: [String], // 4 options
  correctIndex: Number,
  difficulty: Enum ['EASY', 'MEDIUM', 'HARD'],
  category: String,
  isCourseSpecific: Boolean,
  metadata: { createdAt: Date, updatedAt: Date }
}
```

**Updated QuizQuestion Model** (after):
```javascript
{
  uuid: String, // ← NEW: Hashed random UUID (v4) for anonymized references
  hashtags: [String], // ← NEW: Multi-level filtering tags
  lessonId: String,
  question: String,
  options: [String], // 4 options (MUST be exactly 4)
  correctIndex: Number,
  difficulty: Enum ['EASY', 'MEDIUM', 'HARD'], // Refers to #beginner, #intermediate, #advanced
  category: String,
  isCourseSpecific: Boolean,
  questionType: Enum ['recall', 'application', 'critical-thinking'], // ← NEW: Cognitive level
  metadata: { 
    createdAt: Date,
    updatedAt: Date,
    auditedAt: Date, // ← NEW: When this question was audited
    auditedBy: String // ← NEW: Reference to auditor (AI)
  }
}
```

### Hashtag System

**Structure**: `#category #difficulty #type #language`

**Example**:
```
Question: "What is the key to accountability?"
Hashtags: ["#accountability", "#beginner", "#recall", "#hu", "#all-languages"]
```

**Available Hashtags**:

| Category | Values |
|----------|--------|
| **Topic** | #productivity, #accountability, #decision-making, #teamwork, #motivation, #stress-management, #delegation, #energy-management, #goal-setting, #context-switching, #meetings, #skills, #technology, #creativity, #communication, #planning, #community, #habits, #values, #improvement |
| **Difficulty** | #beginner, #intermediate, #advanced |
| **Type** | #recall, #application, #critical-thinking |
| **Language** | #hu, #en, #tr, #bg, #pl, #vi, #id, #ar, #pt, #hi, #all-languages |

**Usage Rules**:
- Every question gets: 1 topic + 1 difficulty + 1 type + 1 language + 1 universal
- Hashtags are NOT displayed to users (backend only)
- Format: lowercase with # prefix, no spaces

### UUID Generation

**Standard**: UUID v4 (random, hashed)
**Format**: `a3f2b8e1-9c7d-4f2a-8e1c-3d9b5c7f2e1a`
**Encryption**: Store as-is (no additional hashing; UUID itself is anonymized)
**Usage**: For internal reference, filtering, and analytics

---

## 📋 COURSE & LESSON AUDIT STRUCTURE

### 8 Courses Overview

| # | Course Name | Lessons | Typical Languages | Status |
|---|-------------|---------|------------------|--------|
| 1 | Productivity 2026 | 30 | HU, EN, TR, BG, PL, VI, ID, AR, PT, HI (10) | ⏳ Ready |
| 2-8 | [Other Courses] | 30 each | Varies | ⏳ Ready |

### Audit Unit Definition

**Smallest atomic unit**: 1 Course × 1 Lesson × 1 Language

**Example Path**:
```
Course: Productivity 2026
├─ Lesson 1: Introduction to Productivity
│  ├─ Language: HU (Hungarian)
│  │  ├─ Question 1: [Audit + Enhance]
│  │  ├─ Question 2: [Audit + Enhance]
│  │  ├─ Question 3: [Audit + Enhance]
│  │  ├─ Question 4: [Audit + Enhance]
│  │  ├─ Question 5: [Audit + Enhance]
│  │  ├─ Question 6: [NEW - Add]
│  │  └─ Question 7: [NEW - Add]
│  │
│  ├─ Language: EN (English)
│  │  └─ [Same structure]
│  │
│  └─ [... 8 more languages]
│
├─ Lesson 2: [Same structure as Lesson 1]
└─ [... 28 more lessons]
```

---

## ✅ QUALITY STANDARDS & CHECKLIST

### Per-Question Audit Checklist

Every question must meet ALL criteria:

```
STANDALONE:
[ ] Question does NOT reference other questions
[ ] Question does NOT require lesson content context
[ ] Question works completely independently
[ ] All necessary context is in the question itself

OPTIONS:
[ ] Exactly 4 options (NO more, NO less)
[ ] Options are distinct and not overlapping
[ ] Wrong options are plausible (not obviously wrong)
[ ] Correct answer is definitively correct

LANGUAGE:
[ ] Native-level language quality
[ ] Industry-specific terminology correct
[ ] Sentence structure is natural
[ ] Grammar is perfect
[ ] No translation artifacts

VALUE:
[ ] Question teaches, not just quizzes
[ ] Answer options teach alternative viewpoints
[ ] Learning outcome is clear
[ ] Question type matches hashtag (#recall, #application, or #critical-thinking)

DIFFICULTY:
[ ] Difficulty matches hashtag (#beginner, #intermediate, #advanced)
[ ] For #recall: Direct facts from content
[ ] For #application: Requires applying knowledge to scenarios
[ ] For #critical-thinking: Requires analysis or synthesis

STRUCTURE:
[ ] UUID assigned (random v4)
[ ] Hashtags assigned (topic, difficulty, type, language)
[ ] Question type field set correctly
[ ] Metadata audit fields completed
```

### Cognitive Level Mix Target

**For each 7-question quiz**:
- **60% Recall** (4-5 questions): Test memory, definitions, facts
- **30% Application** (2-3 questions): Apply concepts to real scenarios
- **10% Critical Thinking** (0-1 questions): Analyze, synthesize, evaluate

**Example 7-question mix**:
- Questions 1-4: Recall
- Questions 5-6: Application
- Question 7: Critical Thinking

---

## 📊 PHASED EXECUTION PLAN

### Phase Architecture

**Total Phases**: 8 (one per course)  
**Each Phase Contains**: 30 lessons × ~10 languages = ~300 audit units per phase

### Phase Structure

```
PHASE N: [COURSE NAME]
├─ STEP 1: Data Extraction (Read from DB)
├─ STEP 2: Language Audit (All lessons, all languages)
├─ STEP 3: Question Enhancement (Audit existing 5, write 2 new)
├─ STEP 4: UUID + Hashtag Assignment
├─ STEP 5: Validation & Testing
├─ STEP 6: Database Migration (Insert updated questions)
├─ STEP 7: Verification & Sign-off
└─ COMPLETION: Phase marked complete with date/time
```

### Phase Breakdown

| Phase | Course | Lessons | Languages | Audit Units | Questions | Est. Duration |
|-------|--------|---------|-----------|-------------|-----------|----------------|
| 1 | Productivity 2026 | 30 | 10 | 300 | 2,100 | [TBD] |
| 2 | [Course 2] | 30 | ~10 | 300 | 2,100 | [TBD] |
| 3 | [Course 3] | 30 | ~10 | 300 | 2,100 | [TBD] |
| 4 | [Course 4] | 30 | ~10 | 300 | 2,100 | [TBD] |
| 5 | [Course 5] | 30 | ~10 | 300 | 2,100 | [TBD] |
| 6 | [Course 6] | 30 | ~10 | 300 | 2,100 | [TBD] |
| 7 | [Course 7] | 30 | ~10 | 300 | 2,100 | [TBD] |
| 8 | [Course 8] | 30 | ~10 | 300 | 2,100 | [TBD] |
| | **TOTAL** | **240** | **~80** | **~2,400** | **~16,800** | **[TBD]** |

---

## 🔄 EXECUTION WORKFLOW (Per Audit Unit)

### Standard Operating Procedure for ONE Audit Unit

**Unit**: 1 Lesson × 1 Language (7 questions total after completion)

#### STEP 1: Extract
```
Input: Course ID, Lesson ID, Language Code
Output: Current 5 questions + question details
```

#### STEP 2: Audit Existing Questions (5 questions)

For each of the 5 current questions:
1. **Read** question, options, correct answer
2. **Evaluate** against checklist (Standalone? Value? Language? Difficulty?)
3. **Classify**: Keep / Rewrite / Replace
4. **Document**: Issues found, decision made

#### STEP 3: Create New Questions (2 questions)

1. **Identify gaps** in cognitive levels (recall/application/critical-thinking mix)
2. **Identify gaps** in topic coverage
3. **Write 2 NEW questions** that fill those gaps
4. **Ensure** different difficulty levels
5. **Ensure** different cognitive types

#### STEP 4: Quality Review

Apply full checklist (above) to all 7 questions

#### STEP 5: Assign UUIDs & Hashtags

For each of 7 questions:
1. Generate UUID v4
2. Assign hashtags: #topic #difficulty #type #language
3. Set questionType field: 'recall' | 'application' | 'critical-thinking'
4. Set metadata.auditedAt: current date/time
5. Set metadata.auditedBy: 'AI-Developer'

#### STEP 6: Validate

- [ ] 7 questions total
- [ ] 4 options each
- [ ] All UUIDs unique
- [ ] All hashtags valid
- [ ] Mix correct (60/30/10)
- [ ] Language native-quality
- [ ] All standalone

#### STEP 7: Save to Database

Update MongoDB with all 7 questions (7 upsert operations or 1 bulk update)

#### STEP 8: Sign-off

```
Audit Unit: [Course] - [Lesson] - [Language]
Timestamp: [Date/Time]
Questions Audited: 5
Questions Added: 2
Questions Total: 7
Status: ✅ COMPLETE
```

---

## 📌 RULES & CONSTRAINTS (STRICT - DO NOT DEVIATE)

### Hard Rules

1. **NO Shortcuts**: Every question must pass full checklist
2. **NO Filler**: Every question must teach something
3. **NO Stupid Answers**: Wrong options must be plausible
4. **NO Standalone Violations**: Questions cannot reference other questions
5. **NO Language Mixing**: Each question stays in its original language
6. **NO Unapproved Changes**: AI cannot change course content/structure without approval
7. **NO Partial Saves**: Either all 7 questions pass, or rollback entire unit
8. **NO Loss of Data**: Always backup before DB migration

### Language Quality Standards

**Minimum Requirement**: Industry-standard terminology + native-speaker natural flow

**Research Process**:
1. Industry terminology glossaries (IT, business, marketing)
2. Native speaker reference materials
3. Official course content from Days 1-11 (gold standard)
4. Consistency with existing lesson content

**Red Flags**:
- ❌ Translation artifacts (e.g., "What is the X?" in Hungarian when it should be different structure)
- ❌ Uncommon words when common synonyms exist
- ❌ Grammar inconsistencies
- ❌ Inconsistency with lesson content

### Cognitive Mix Rules

**Per 7-question set**:
- 4-5 questions @ #recall (60%)
- 2-3 questions @ #application (30%)
- 0-1 questions @ #critical-thinking (10%)

**Definition**:
- **Recall**: "What is X?" "Define Y" (requires remembering facts)
- **Application**: "Which scenario demonstrates X?" "How would you use X?" (apply knowledge to real cases)
- **Critical Thinking**: "Why is X better than Y?" "What would happen if?" (analyze, synthesize, evaluate)

### Database Rules

1. **Idempotent**: Running same audit twice produces same result
2. **Traceable**: Every change logged with timestamp + auditor
3. **Recoverable**: If process fails, can restart from last checkpoint
4. **Versioned**: Keep history of question changes
5. **Validated**: No corrupt data enters database

---

## 🚨 SAFETY & RECOVERY PROCEDURES

### Checkpoint System

Save progress checkpoint after EACH completed audit unit (lesson):

```json
{
  "checkpoint": {
    "phase": 1,
    "course": "Productivity 2026",
    "lesson": 5,
    "language": "EN",
    "completed_at": "2026-01-24T14:30:00Z",
    "total_units_completed": 42,
    "total_questions_audited": 210,
    "status": "success"
  }
}
```

### Rollback Procedure

**If error or failure occurs during a unit**:

1. **Stop** all operations
2. **Identify** which audit unit failed
3. **Revert** that unit to pre-audit state
4. **Log** error details
5. **Restart** from last successful checkpoint
6. **Report** issue for resolution

**Restore Last Known Good State**:
```bash
# Revert to last checkpoint
db.quizzes.updateMany(
  { checkpoint: { $lt: LAST_SUCCESSFUL_CHECKPOINT } },
  { $restore: PREVIOUS_VERSION }
)
```

---

## 📝 TASK TRACKING TEMPLATE

Every completed audit unit gets logged:

```
[x] Phase 1 | Productivity 2026 | Lesson 5 | EN (Hungarian)
    - 5 questions audited
    - 2 questions rewritten
    - 2 new questions added
    - 7 total questions ✅
    - UUIDs assigned ✅
    - Hashtags assigned ✅
    - Timestamp: 2026-01-24 14:30:00
    - Status: COMPLETE
```

---

## 📄 EXECUTION SIGN-OFF

### Phase Sign-off Template

```
PHASE X: [COURSE NAME]
Lessons: 30
Languages: 10
Audit Units: 300
Questions: 2,100

COMPLETION CHECKLIST:
[ ] All 30 lessons audited
[ ] All 10 languages quality-checked
[ ] All 2,100 questions enhanced/created
[ ] All UUIDs generated
[ ] All hashtags assigned
[ ] Database migration complete
[ ] Validation tests passed
[ ] Backup verified
[ ] Documentation updated

SIGN-OFF:
Phase Lead: AI Developer
Reviewed By: Sultan
Approved Date: [YYYY-MM-DD]
Status: ✅ COMPLETE
```

---

## 🎯 EXECUTION ORDER

### Recommended Sequence

**PRIORITY**: Start with Productivity 2026 (most critical, already seeded)

**Order**:
1. ✅ Phase 1: Productivity 2026 (30 lessons × 10 languages)
2. ⏳ Phase 2: [Next course]
3. ⏳ Phase 3: [Next course]
4. ⏳ Phase 4: [Next course]
5. ⏳ Phase 5: [Next course]
6. ⏳ Phase 6: [Next course]
7. ⏳ Phase 7: [Next course]
8. ⏳ Phase 8: [Final course]

---

## 📚 ESSENTIAL KNOWLEDGE (READ CAREFULLY)

### Question Quality Principles

1. **Standalone is Sacred**: No question can assume context from previous questions or lesson
2. **Teaching > Testing**: Every question should educate, not just measure
3. **Plausibility Matters**: Wrong answers should seem reasonable to a learner (then teach why they're wrong)
4. **Language Precision**: Industry terminology must be exact, not approximated

### Cognitive Science Basis

- **60% Recall**: Foundation - students must know facts
- **30% Application**: Transfer - students can use knowledge in new situations
- **10% Critical Thinking**: Mastery - students can analyze and create

This mix ensures learning progression from basic to advanced.

### Language Quality Framework

- **Terminology**: Use industry-standard glossaries
- **Grammar**: Native speaker standards
- **Flow**: Sentences should read naturally in the language
- **Consistency**: Match the tone/style of Days 1-11 content

### Common Pitfalls to Avoid

❌ **Don't**: "Which of the following is not true about..."  
✅ **Do**: "What is the primary benefit of..."

❌ **Don't**: Write question assuming lesson content memory  
✅ **Do**: Provide all necessary context in the question

❌ **Don't**: Make wrong answers obviously wrong  
✅ **Do**: Make wrong answers plausible but ultimately incorrect

❌ **Don't**: Skip language review  
✅ **Do**: Verify native-quality language for every question

---

## 🔗 DEPENDENCIES & PREREQUISITES

### Before Starting Execution

- [ ] Read this entire document
- [ ] Understand quiz model schema (current vs. new)
- [ ] Verify all 8 courses exist in database
- [ ] Confirm language codes match system (hu, en, tr, bg, pl, vi, id, ar, pt, hi)
- [ ] Backup entire QuizQuestion collection
- [ ] Prepare UUID generation tool
- [ ] Test hashtag validation logic
- [ ] Verify database write permissions
- [ ] Set up checkpoint logging system

### Tools & Scripts Needed

- [ ] UUID v4 generator
- [ ] Hashtag validator
- [ ] Question checklist validator
- [ ] Database backup script
- [ ] Migration/upsert script
- [ ] Checkpoint tracker
- [ ] Progress reporting dashboard

---

## 📞 COMMUNICATION & ESCALATION

### Weekly Status Report

Every Friday (or after each phase):
- Phases completed
- Questions audited
- Issues encountered
- Blockers or decisions needed
- Next week's plan

### Escalation Path

**Question about quality standards** → Ask Sultan  
**Technical issue** → Document and rollback, then report  
**Language uncertainty** → Research + document reasoning, then verify  
**Scope change** → Pause execution, get Sultan approval, update plan  

---

## 📋 DOCUMENT VERSION & APPROVAL

| Version | Date | Author | Status | Notes |
|---------|------|--------|--------|-------|
| 1.0 | 2026-01-24 | AI Developer | 🟡 Awaiting Approval | Initial master plan |
| 2.0 | 2026-01-24 | AI Developer | 🟢 **APPROVED - EXECUTING** | Option A: Complete Sequential Audit |

**APPROVAL STATUS**: ✅ APPROVED BY SULTAN - 2026-01-24

**EXECUTION STATUS**: 🟡 **PAUSED - READY TO RESUME**

**Work Completed Before Pause**:
- ✅ Architecture analysis complete
- ✅ Master plan documented
- ✅ Quality standards defined
- ✅ Workflow procedures established

**Work Paused For**:
- Course Language Separation (2026-01-24 to 2026-01-25)
- 19 commits delivered for 100% course language separation
- All course pages now use course language for UI
- Navigation links fixed to use course language
- Architecture ready: Option 2 (any URL works, UI uses course language)

**Current State**:
- 🟢 **READY TO RESUME** - All prerequisites complete
- ✅ Architecture stable and tested
- ✅ Language separation complete
- ✅ No blocking issues
- ⏳ **Next Step**: Begin Phase 1, Day 1 execution

**Important Context for Resume**:
- All course pages now properly localized
- Quiz pages use course language for all UI elements
- Navigation links maintain course language consistency
- System is production-ready for quiz enhancement work

---

## 🚀 READY TO RESUME

**Prerequisites Complete**:
- ✅ Architecture fixes complete (19 commits)
- ✅ Course language separation delivered
- ✅ All navigation links fixed
- ✅ System stable and tested
- ✅ Master plan documented

**Ready to Begin**:
1. ✅ Architecture stable
2. ✅ Language system working correctly
3. ✅ No blocking issues
4. ✅ All tools and scripts ready
5. ✅ Quality standards defined

**Next Step**: Begin Phase 1, Day 1 execution - Analyze Day 1 questions, create 7 questions, translate, seed, verify.

---

**END OF MASTER PLAN DOCUMENT**
