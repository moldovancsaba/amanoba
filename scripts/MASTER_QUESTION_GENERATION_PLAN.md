# Master Question Generation Plan

## Goal
Generate 7 perfect questions for ALL 446 lessons (3122 total questions)

## Current Status
- 19 courses
- 446 lessons
- 1472 questions (need 3122)
- Missing: 1650 questions
- 83 lessons have 7 questions
- 315 lessons have < 7 questions
- 48 lessons have 0 questions

## Quality Requirements (MANDATORY)
1. **Context-rich**: Minimum 40 characters, provide full context
   - ❌ Bad: "Mi legyen az alt szövegben?"
   - ✅ Good: "Mi legyen az alt szövegben egy Shopify termékoldal képénél a GEO optimalizálás szempontjából?"

2. **100% content-specific**: Questions must be based on actual lesson content, not templates

3. **Educational**: Wrong answers must be plausible and educational

4. **Proper language**: Questions must match course language exactly

5. **Proper cognitive mix**: 4-5 RECALL, 2-3 APPLICATION, 0-1 CRITICAL_THINKING

6. **Proper metadata**: questionType, hashtags, difficulty, UUID

## Implementation Strategy

### Phase 1: GEO_SHOPIFY_30 (Hungarian)
- Extract seed file's 5 questions per day
- Enhance with metadata (questionType, hashtags)
- Add 2 more questions to reach 7
- Use batch API to create

### Phase 2: Other Courses
- Read lesson content systematically
- Generate questions based on actual content
- Ensure context-rich and educational
- Use batch API to create

## Scripts Created
1. `delete-generic-template-questions.ts` - ✅ Deleted 212 generic questions
2. `remove-duplicate-questions.ts` - ✅ Deleted 943 duplicate questions
3. `review-questions-by-lesson.ts` - Lists questions for review
4. `comprehensive-fix-all-questions-final.ts` - Framework for processing all lessons

## Next Steps
1. Implement question generation for GEO_SHOPIFY_30 using seed file
2. Expand to other courses systematically
3. Process all 446 lessons one by one
