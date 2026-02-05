# 📋 QUIZ FIXING DOCUMENTS - COMPLETE LIST

**Quick entry:** For a short history and "what to use now", see **QUIZ_SYSTEM_HISTORY.md**. This file is the full list of docs and scripts.

**Last Updated**: 2026-01-25  
**Status**: Processing all courses systematically

---

## 📚 Main Documentation Files

### Planning & Strategy Documents
1. `docs/QUIZ_SYSTEM_COMPLETE_FIX_ACTION_PLAN.md` - Comprehensive action plan
2. `docs/_archive/delivery/2026-01/2026-01-24_QUIZ_ENHANCEMENT_MASTER_PLAN.md` - Master enhancement plan
3. `docs/_archive/delivery/2026-01/2026-01-24_QUIZ_QUALITY_AUDIT_AND_ENHANCEMENT_MASTER_PLAN.md` - Quality audit plan
4. `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md` - **Handover**: repeatable audit→refine→rewrite workflow + prompt + rollback
4. `scripts/QUIZ_SYSTEM_COMPLETE_FIX_PLAN.md` - System fix plan
5. `scripts/MASTER_QUESTION_GENERATION_PLAN.md` - Question generation strategy
6. `scripts/systematic-question-review-process.md` - Review process documentation

### Release Notes & Summaries
7. `docs/QUIZ_SYSTEM_FIX_RELEASE_NOTE.md` - Release note for quiz system fix
8. `docs/QUIZ_SYSTEM_FIX_COMPLETE.md` - Completion report
9. `docs/QUIZ_SYSTEM_FIX_SUMMARY.md` - Summary of fixes
10. `docs/QUIZ_FIX_DELIVERY_SUMMARY.md` - Delivery summary
11. `docs/FINAL_QUIZ_SYSTEM_DELIVERY.md` - Final delivery report

### Management & Tracking
12. `docs/_archive/delivery/2026-01/2026-01-25_QUIZ_QUESTION_CENTRAL_MANAGEMENT_PLAN.md` - Central management plan
13. `docs/_archive/delivery/2026-01/2026-01-25_QUIZ_QUESTION_CENTRAL_MANAGEMENT_COMPLETE.md` - Management completion
14. `docs/QUIZ_SEEDING_COMPLETE_REPORT.md` - Seeding completion report

### Question Quality Documents
15. `docs/DAY1_QUESTIONS_COMPARISON_EN.md` - Day 1 questions comparison
16. `docs/DAY_1_QUESTIONS_ALL_LANGUAGES.md` - Day 1 all languages
17. `docs/DAY_1_QUESTIONS_PROFESSIONAL.md` - Professional Day 1 questions

---

## 🔧 Scripts for Quiz Fixing

### Processing Scripts
- `scripts/process-course-questions-generic.ts` - **MAIN SCRIPT** - Generic course processor (use this!)
- `scripts/process-geo-shopify-30-hu-complete.ts` - GEO Shopify HU processor
- `scripts/comprehensive-fix-all-questions-final.ts` - Comprehensive fixer
- `scripts/systematic-question-generation-all-courses.ts` - Systematic generator
- `scripts/process-all-lessons-systematic-questions.ts` - All lessons processor
- `scripts/process-all-courses-priority.ts` - Lists courses by priority

### Audit & Review Scripts
- `scripts/audit-question-coverage.ts` - Coverage audit (shows what's missing)
- `scripts/review-questions-by-lesson.ts` - Review by lesson
- `scripts/audit-full-quiz-system.ts` - Full system audit

### Cleanup Scripts
- `scripts/delete-generic-template-questions.ts` - Delete generic questions (v1)
- `scripts/delete-generic-template-questions-v2.ts` - **UPDATED** - Delete generic questions with answer pattern detection
- `scripts/remove-duplicate-questions.ts` - Remove duplicates

### Seed Scripts
- `scripts/seed-all-productivity-quizzes.ts` - Productivity quizzes seeder
- `scripts/seed-geo-shopify-course.ts` - GEO Shopify seeder
- `scripts/extract-and-enhance-seed-questions.ts` - Extract seed questions

### ⚠️ DEPRECATED (DO NOT USE)
- `scripts/fix-course-quizzes.ts` - **DEPRECATED** - Creates generic template questions (DO NOT USE)

---

## ✅ Quality Requirements (MANDATORY)

### Requirements
1. **Minimum questions per quiz** - **>= 7** valid questions per lesson (can be more; never delete valid questions just to cap)
2. **Quiz for all lessons** - Every lesson must have a quiz
3. **All questions in same language as course** - 100% language consistency
4. **All questions 100% related to actual lesson** - Must test lesson content
5. **All questions follow course creation rules** - Native quality, proper industry jargon
6. **All questions lectured and have proper not stupid answers** - Educational value
7. **Quality** - Professional, native-level quality
8. **For every language** - All course languages covered
9. **For every course** - All courses fixed

### Unacceptable Question Patterns
- ❌ Generic templates: "What is a key concept from..."
- ❌ Placeholder answers: "A fundamental principle related to this topic"
- ❌ Language mismatches: Hungarian question for Russian course
- ❌ Too short: "Mi legyen az alt szövegben?" (without context)
- ❌ Duplicate questions with different UUIDs
- ❌ Questions missing proper metadata

### Quality Standards
- ✅ Context-rich (minimum 40 characters, provide full context)
- ✅ Content-specific (100% related to lesson content)
- ✅ Educational (wrong answers are plausible and educational)
- ✅ Proper language match
- ✅ Proper cognitive mix (**0 RECALL**, **5 APPLICATION**, **2 CRITICAL_THINKING**)
- ✅ Proper metadata (questionType, hashtags, difficulty, UUID)

**SSOT**: For the current, authoritative QC rules use `2026_course_quality_prompt.md` + `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md`.

---

## 📊 Current Status

**Last Audit**: Run `npx tsx scripts/audit-question-coverage.ts` to get current status

**Target**: 446 lessons × 7 = 3,122 perfect questions

---

## 🚀 How to Use

### To Process a Single Course:
```bash
npx tsx --env-file=.env.local scripts/process-course-questions-generic.ts COURSE_ID
```

### To See What Needs Processing:
```bash
npx tsx --env-file=.env.local scripts/process-all-courses-priority.ts
```

### To Audit Current Status:
```bash
npx tsx --env-file=.env.local scripts/audit-question-coverage.ts
```

### To Delete Generic Questions:
```bash
npx tsx --env-file=.env.local scripts/delete-generic-template-questions-v2.ts
```

---

## 📝 Notes

- Always use `process-course-questions-generic.ts` for processing courses
- Never use `fix-course-quizzes.ts` (it creates generic templates)
- Run audit scripts regularly to track progress
- Delete generic questions before processing courses
