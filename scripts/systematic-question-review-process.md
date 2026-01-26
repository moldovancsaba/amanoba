# Systematic Question Review Process

## Goal
Review and fix every single question to ensure:
- Context-rich (not too short, provides necessary context)
- Content-specific (100% related to actual lesson content)
- Educational (teaches, not just tests)
- Proper language (matches course language)
- Good wrong answers (plausible, educational)

## Process

1. **For each course:**
   - List all lessons
   - For each lesson, list all questions

2. **For each question:**
   - Read the full lesson content
   - Understand what the lesson teaches
   - Check if question is context-rich enough
   - Check if question tests actual understanding
   - Check if wrong answers are educational
   - Fix if needed

3. **Quality Checklist:**
   - [ ] Question provides enough context (not just "Mi legyen az alt szövegben?" but "Mi legyen az alt szövegben egy Shopify termékoldal képénél a GEO optimalizálás szempontjából?")
   - [ ] Question is 100% related to lesson content
   - [ ] Question tests actual understanding, not just memorization
   - [ ] Wrong answers are plausible and educational
   - [ ] Question is in the correct language
   - [ ] Question has proper metadata (questionType, hashtags, difficulty)

## Scripts Needed

1. `review-questions-by-lesson.ts` - Lists all questions per lesson for review
2. `fix-question-context.ts` - Fixes a specific question with better context
3. `validate-question-quality.ts` - Validates all questions meet quality standards
