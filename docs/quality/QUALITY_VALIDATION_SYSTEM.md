# 🔒 Quality Validation System for Quiz Questions

**Purpose**: Ensure ALL questions meet strict quality requirements before being saved to the database.

---

## ✅ Quality Checks Implemented

### 1. **Generic Template Detection**
- ❌ Rejects questions starting with generic patterns:
  - "What is a key concept from..."
  - "Mi a kulcsfontosságú koncepció..."
  - "Mi a következménye, ha a(z)..." (at start)
  - "Miért fontos a(z)..." (at start)
- ✅ Allows these patterns if they're part of a larger, context-specific question

### 2. **Placeholder Answer Detection**
- ❌ Rejects answers like:
  - "A fundamental principle related to this topic"
  - "An advanced technique not covered here"
  - "A completely unrelated concept"
  - "A basic misunderstanding"

### 3. **Context-Rich Requirement**
- ✅ Minimum 40 characters
- ✅ Must provide enough context to be understood standalone
- ❌ Rejects: "Mi legyen az alt szövegben?" (too short, no context)
- ✅ Accepts: "Mi legyen az alt szövegben egy Shopify termékoldal képénél a GEO optimalizálás szempontjából?" (context-rich)

### 4. **Metadata Validation**
- ✅ Must have questionType (RECALL, APPLICATION, CRITICAL_THINKING)
- ✅ Must have difficulty (EASY, MEDIUM, HARD, EXPERT)
- ✅ Must have proper category

### 5. **Cognitive Mix Validation**
- ✅ 4-5 RECALL questions
- ✅ 2-3 APPLICATION questions
- ✅ 0-1 CRITICAL_THINKING questions
- ⚠️ Warns if mix is off (but doesn't reject)

### 6. **Answer Quality**
- ✅ Must have exactly 4 options
- ✅ All options must be unique
- ⚠️ Warns if options are too short (< 10 chars)

---

## 🔧 How It Works

### Script: `process-course-questions-generic.ts`

1. **Loads existing questions**
2. **Validates each existing question** - Deletes broken/generic ones
3. **Enhances valid questions** with proper metadata
4. **Generates additional questions** to reach 7
5. **Validates each new question** - Rejects generic templates
6. **Validates complete set** - Ensures 7 questions with proper mix
7. **Saves only if ALL validations pass**

### Validator: `question-quality-validator.ts`

- `validateQuestionQuality()` - Validates a single question
- `validateLessonQuestions()` - Validates a complete lesson set (7 questions)

---

## 🚀 Usage

### Process a Single Course (with quality validation):
```bash
npx tsx --env-file=.env.local scripts/process-course-questions-generic.ts COURSE_ID
```

### Process All Courses:
```bash
npx tsx --env-file=.env.local scripts/process-all-courses-quality-secured.ts
```

---

## 📊 What Gets Rejected

### ❌ Rejected Questions:
- Generic templates: "What is a key concept from..."
- Placeholder answers: "A fundamental principle related to this topic"
- Too short: < 40 characters
- Missing metadata: No questionType or difficulty
- Duplicate options

### ✅ Accepted Questions:
- Context-rich: "Mi legyen az alt szövegben egy Shopify termékoldal képénél a GEO optimalizálás szempontjából?"
- Content-specific: Questions that test actual lesson content
- Educational answers: Plausible wrong answers that teach
- Proper metadata: All fields set correctly

---

## 🎯 Quality Guarantee

**Every question saved to the database has:**
- ✅ Passed all quality validations
- ✅ No generic templates
- ✅ No placeholder answers
- ✅ Proper context (minimum 40 chars)
- ✅ Proper metadata
- ✅ Educational value

---

## 📝 Notes

- The validator is **strict** - it will reject questions that don't meet standards
- If a question is rejected, the script will try to generate alternatives
- If a lesson can't reach 7 valid questions, it will log warnings
- Run `audit-question-coverage.ts` to see what still needs work
