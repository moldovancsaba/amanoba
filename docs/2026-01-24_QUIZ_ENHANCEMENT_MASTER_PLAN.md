# 2026-01-24_QUIZ_QUALITY_ENHANCEMENT_MASTER_PLAN.md

## QUIZ QUALITY ENHANCEMENT PROJECT - MASTER PLAN

**Date**: 2026-01-24  
**Status**: 🟢 **READY TO RESUME** (Language separation complete, architecture ready)  
**Priority**: P0 (Core Quality Work)  
**Scope**: ~2,136 quizzes across ~23 language-specific courses  
**Paused For**: Course Language Separation (2026-01-24 to 2026-01-25)  
**Resume Date**: 2026-01-25

---

## EXECUTIVE SUMMARY

### What Needs to Happen

**Objective**: Enhance ALL quizzes across ALL courses from 5 questions to 7 questions with:
- Professional question writing
- Cognitive mix (60% recall, 30% application, 10% critical thinking)
- UUIDs for each question & quiz
- Hashtags for filtering (#topic, #difficulty, #type, #language)
- 100% native language quality (no English fallbacks)
- Teaching value (questions that reinforce key concepts)

### Scope

| Item | Count |
|------|-------|
| Total Courses | 23 (language-specific) |
| Total Lessons | 443 |
| Current Quizzes | ~2,136 (5 questions each) |
| Target Quizzes | ~2,136 (7 questions each) |
| Questions to Create | ~4,272 new questions |
| Languages | 12 |

### Timeline & Effort

**Estimated**: 80-100 hours over 2-3 weeks (1 lesson per day)

**Approach**: 
- Create ONE lesson (all languages) per day
- Quality over speed
- Continuous delivery (commit after each lesson)

---

## PHASE BREAKDOWN

### PHASE 1: Preparation & Day 1 (Today - 2026-01-24)

**Duration**: 4 hours  
**Deliverable**: Day 1 enhanced for all courses, all languages

**Steps**:
- [ ] Step 1.1: Review existing Day 1 questions (all languages)
- [ ] Step 1.2: Read Day 1 lesson content (understand teaching)
- [ ] Step 1.3: Create 7 professional English questions
- [ ] Step 1.4: Translate to 10 target languages
- [ ] Step 1.5: Create seed script for Day 1
- [ ] Step 1.6: Run migration, verify in database
- [ ] Step 1.7: Commit and document

**Courses to Enhance**:
- PRODUCTIVITY_2026_HU, _EN, _TR, _BG, _PL, _VI, _ID, _AR, _PT, _HI
- SALES_PRODUCTIVITY_30_HU, _EN, _RU
- (Other existing courses as needed)

### PHASE 2: Days 2-10 (3-5 days)

**Duration**: 12-20 hours  
**Deliverable**: Days 2-10 enhanced, daily commits

**Approach**: Same as Day 1, one day per day

### PHASE 3: Days 11-20 (3-5 days)

**Duration**: 12-20 hours  
**Deliverable**: Days 11-20 enhanced

### PHASE 4: Days 21-30 (2-4 days)

**Duration**: 8-16 hours  
**Deliverable**: Days 21-30 enhanced, ALL 30 days complete

### PHASE 5: Cross-Language Quality Assurance (1-2 days)

**Duration**: 8-12 hours  
**Deliverable**: Verify language quality, fix any issues

### PHASE 6: Deploy & Verify (1 day)

**Duration**: 4-6 hours  
**Deliverable**: Production deployment complete

---

## QUALITY STANDARDS

### Per-Question Requirements

✅ **Standalone**: Can be answered without other questions  
✅ **Language Quality**: 100% native language (no English)  
✅ **Teaching Value**: Reinforces key lesson concept  
✅ **Clarity**: Unambiguous, clear wording  
✅ **Distractor Quality**: Plausible but clearly wrong answers  
✅ **Cognitive Level**: Recall, Application, or Critical Thinking  
✅ **UUID**: Unique v4 UUID for every question  
✅ **Hashtags**: #topic, #difficulty, #type, #language

### Per-Quiz Requirements

✅ **7 Questions**: Exactly 7 per quiz  
✅ **Mix**: 60% recall (4-5 Q), 30% application (2-3 Q), 10% critical (0-1 Q)  
✅ **Coverage**: Covers key concepts from lesson  
✅ **Consistency**: Same structure across all languages  
✅ **UUID**: Unique v4 UUID for each quiz  
✅ **Metadata**: Complete audit metadata

### Per-Lesson Requirements

✅ **All Languages**: Enhanced in all available languages simultaneously  
✅ **Consistency**: Same questions across languages (different wording, same meaning)  
✅ **Database Integrity**: Referential integrity maintained  
✅ **Verification**: Scripts verify enhancement success  
✅ **Rollback**: Can rollback to previous version if issues found

---

## WORK PROCESS (Per Lesson)

### 1. ANALYSIS (30 minutes)

**Step 1.1**: Review existing questions (understand current state)
- [ ] Fetch existing 5 questions for this lesson (all languages)
- [ ] Analyze what works/what doesn't
- [ ] Note issues found

**Step 1.2**: Read lesson content (understand teaching)
- [ ] Fetch lesson HTML content
- [ ] Identify key concepts
- [ ] Note teaching objectives
- [ ] Understand context

### 2. QUESTION CREATION (90 minutes)

**Step 2.1**: Create 7 questions in English
- [ ] Q1 (RECALL): Basic definition/concept
- [ ] Q2 (RECALL): Specific fact/example
- [ ] Q3 (RECALL): Another key concept
- [ ] Q4 (RECALL): Related concept
- [ ] Q5 (APPLICATION): How to apply concept
- [ ] Q6 (APPLICATION): Real-world scenario
- [ ] Q7 (CRITICAL): Analysis/evaluation

**Step 2.2**: For each question:
- [ ] Write clear question text
- [ ] Create 4 plausible answer options
- [ ] Mark correct answer
- [ ] Verify standalone (no context needed)
- [ ] Generate UUID v4
- [ ] Assign hashtags

### 3. TRANSLATION (60 minutes)

**Step 3.1**: Translate to target languages
- [ ] HU (Hungarian)
- [ ] TR (Turkish)
- [ ] BG (Bulgarian)
- [ ] PL (Polish)
- [ ] VI (Vietnamese)
- [ ] ID (Indonesian)
- [ ] AR (Arabic)
- [ ] PT (Portuguese)
- [ ] HI (Hindi)
- [ ] RU (Russian)

**Step 3.2**: Quality check translations
- [ ] Maintain meaning (not literal translation)
- [ ] Use native phrasing
- [ ] Preserve answer correctness
- [ ] Check for cultural appropriateness

### 4. SEEDING (30 minutes)

**Step 4.1**: Create seed script
- [ ] Map lesson to courses needing this day
- [ ] Create data structure with all languages
- [ ] Include UUIDs and hashtags
- [ ] Test script locally

**Step 4.2**: Execute migration
- [ ] Backup database
- [ ] Run seed script
- [ ] Verify in database
- [ ] Check all languages present
- [ ] Validate counts

### 5. VERIFICATION (30 minutes)

**Step 5.1**: Quality verification
- [ ] Verify all 7 questions exist
- [ ] Check all languages present
- [ ] Validate UUIDs assigned
- [ ] Confirm hashtags present
- [ ] Review answer correctness

**Step 5.2**: Create verification script
- [ ] Compare to original questions (what changed)
- [ ] Count questions per course
- [ ] Verify language distribution
- [ ] Output report

### 6. DOCUMENTATION (20 minutes)

**Step 6.1**: Document findings
- [ ] Update feature document
- [ ] Document any issues found
- [ ] Note translation notes (if any)
- [ ] Record time spent

**Step 6.2**: Commit & deploy
- [ ] Commit with clear message
- [ ] Push to origin
- [ ] Update TASKLIST
- [ ] Update progress tracking

**Total Time Per Lesson**: ~4 hours

---

## RESOURCES NEEDED

### Existing Scripts

✅ `scripts/get-lesson-content.ts` - Fetch lesson content  
✅ `scripts/examine-actual-questions.ts` - Analyze existing questions  
✅ `scripts/test-language-filtering.ts` - Verify distribution

### Scripts to Create

- [ ] `scripts/get-day-X-questions.ts` - Fetch existing questions
- [ ] `scripts/seed-day-X-enhanced.ts` - Seed new questions
- [ ] `scripts/verify-day-X-enhancement.ts` - Verify quality
- [ ] `scripts/test-quiz-language-consistency.ts` - Cross-language validation

### Documentation to Create

- [ ] `docs/2026-01-24_QUIZ_DAY_X_ENHANCEMENT.md` - Per-day documentation
- [ ] Accumulate all days into master document

---

## STARTING NOW: DAY 1 EXECUTION

### Immediate Actions (First 30 min)

1. [ ] Analyze current Day 1 questions across all languages
2. [ ] Read Day 1 lesson content (PRODUCTIVITY_2026_HU_DAY_01)
3. [ ] Understand teaching objectives
4. [ ] Create question outline

### Next 90 minutes: Create 7 Questions

Following the cognitive mix:
- 4-5 Recall questions (easy to medium)
- 2-3 Application questions (medium to hard)
- 1 Critical thinking question (hard)

### Then 60 minutes: Translate

Translate to all 10 languages with native quality.

### Then Execute & Verify

Create seed script, run migration, verify success, commit.

---

## SUCCESS CRITERIA

### Per Day

✅ 7 new questions created (instead of 5)  
✅ All target languages included  
✅ UUIDs assigned  
✅ Hashtags assigned  
✅ Seeds successfully  
✅ Verification passes  
✅ Committed to git  

### Overall Project

✅ 30 lessons enhanced  
✅ ~2,136 quizzes from 5Q to 7Q  
✅ ~4,272 new questions created  
✅ 100% native language quality  
✅ Zero mixing of languages  
✅ Full documentation  
✅ Production deployment  

---

## RULES FOR THIS WORK

**From Agent Operating Document:**

✅ Safety Rollback Plan required for every delivery  
✅ Error-free, Warning-free code  
✅ Documentation = Code (rigorous, updated immediately)  
✅ No placeholders or TBD  
✅ Production-grade quality  
✅ Complete ownership & accountability  

**Additional Rules for Quiz Work:**

✅ ONE LESSON AT A TIME (no rushing)  
✅ QUALITY OVER SPEED (professional questions)  
✅ DAILY COMMITS (continuous delivery)  
✅ NO PLACEHOLDERS (real content only)  
✅ NATIVE LANGUAGE (no English on non-English pages)  
✅ TEACHING VALUE (questions teach, not just test)

---

## STARTING PHASE 1, DAY 1: NOW

Let's begin with Productivity 2026, Day 1 (Introduction to Productivity).

**Current Status**: 🟢 **READY TO RESUME**  
**Architecture**: ✅ FIXED & DELIVERED (19 commits)  
**Prerequisites**: ✅ COMPLETE  
**Language Separation**: ✅ COMPLETE (100% course language UI)

**Work Completed**:
- ✅ Course language separation: 19 commits delivered
- ✅ All course pages use course language for UI
- ✅ Navigation links fixed to maintain course language
- ✅ Architecture: Option 2 active (any URL works, UI uses course language)
- ✅ System stable and production-ready

**Next Step**: Begin Phase 1, Day 1 - Analyze Day 1 questions, create 7 questions, translate, seed, verify, commit.

---

**Last Updated**: 2026-01-25 (Ready to resume after language separation)  
**Status**: 🟢 READY TO RESUME (All prerequisites complete)
