# AI Course Progression Plan

**Date**: 2026-08-08  
**Current Course**: AI for Dummies in a Day (Stage 1)  
**Strategy**: Progressive content building with question pool reuse and difficulty scaling

---

## Recommended Next Course

### Course: "AI Essentials - 3 Days to Practical Skills"

**Stage**: 2 (Intermediate)  
**Duration**: 3 days  
**CourseID**: `AI_ESSENTIALS_3DAY_EN`  
**Trigger**: 50+ completions of "AI for Dummies in a Day"

---

## Course Progression Strategy

### Stage 1: AI for Dummies in a Day (COMPLETED)
- **Duration**: 1 day
- **Level**: Beginner (Introduction)
- **Focus**: What is AI? High-level concepts
- **Content**: 7-10 lessons, 50+ quiz questions
- **Target**: Complete beginners, general audience
- **Outcome**: Basic AI awareness

### Stage 2: AI Essentials - 3 Days (NEXT TO BUILD)
- **Duration**: 3 days
- **Level**: Intermediate (Practical)
- **Focus**: How can AI solve problems? When to use/not use
- **Content**: 15-20 lessons, 100+ quiz questions (includes all Stage 1 questions + 50 new)
- **Target**: Users who completed Stage 1
- **Outcome**: Practical AI application skills

### Stage 3: AI Mastery - 7 Days (FUTURE)
- **Duration**: 7 days
- **Level**: Advanced (SME)
- **Focus**: Subject Matter Expert level, best practices
- **Content**: 30-40 lessons, 200+ quiz questions
- **Target**: Users who completed Stage 2
- **Outcome**: Professional-level AI knowledge

### Stage 4: AI Expert - 30 Days (FUTURE)
- **Duration**: 30 days
- **Level**: Expert (Deep Dive)
- **Focus**: Extended knowledge, all segments, apply to similar problems
- **Content**: 60-80 lessons, 400+ quiz questions
- **Target**: Users who completed Stage 3
- **Outcome**: Expert-level mastery

---

## Content Reuse Strategy

### Question Pool Evolution

**Stage 1 → Stage 2**:
```
Stage 1: 50 questions (all EASY/MEDIUM recall)
Stage 2: 
  - Reuse: All 50 Stage 1 questions (as warm-up/review)
  - Add: 50 new questions (MEDIUM/HARD, application/critical-thinking)
  - Total: 100 questions
```

**Stage 2 → Stage 3**:
```
Stage 2: 100 questions
Stage 3:
  - Reuse: All 100 Stage 2 questions
  - Add: 100 new questions (HARD/EXPERT, best practices/diagnostic)
  - Total: 200 questions
```

**Stage 3 → Stage 4**:
```
Stage 3: 200 questions
Stage 4:
  - Reuse: All 200 Stage 3 questions
  - Add: 200 new questions (EXPERT, scenario-based/metric)
  - Total: 400 questions
```

### Difficulty Scaling Matrix

| Stage | Difficulty Mix | Question Types |
|-------|---------------|----------------|
| 1 | 70% EASY, 30% MEDIUM | recall, definition, concept |
| 2 | 30% EASY, 50% MEDIUM, 20% HARD | application, critical-thinking, best_practice |
| 3 | 20% MEDIUM, 60% HARD, 20% EXPERT | best_practice, diagnostic, scenario |
| 4 | 40% HARD, 60% EXPERT | diagnostic, metric, complex scenarios |

### Lesson Content Reuse

**Approach**: Build upon, not repeat

1. **Stage 1 Lessons** → Reference material for Stage 2
   - Don't repeat basic concepts
   - Link back to Stage 1 for review
   - Build on foundation

2. **New Lesson Structure**:
   ```
   Stage 2 Lesson = {
     prerequisiteLesson: "Stage 1 Lesson ID",
     content: "Advanced content building on prerequisite",
     practicalExamples: true,
     realWorldCases: true
   }
   ```

3. **Self-Assessment**:
   - Include Stage 1 questions in early Stage 2 lessons (review)
   - Gradually increase to Stage 2-level questions
   - Mix difficulty levels for spaced repetition

---

## Implementation Plan

### Step 1: Create CourseGenerationTracker

```bash
# Already implemented in Phase 1
# Check if tracker exists
npm run script:check-tracker -- AI_FOUNDATIONS
```

### Step 2: Generate Stage 2 Content Outline

**Topic**: AI Essentials - 3 Days

**Day 1: AI in Action**
1. Real-world AI applications
2. AI vs Traditional Programming
3. When to use AI (decision framework)
4. When NOT to use AI (limitations)
5. Common AI use cases by industry

**Day 2: Practical AI Skills**
6. Working with AI tools
7. Prompt engineering basics
8. Data requirements for AI
9. AI project planning
10. Measuring AI success

**Day 3: Best Practices**
11. AI ethics in practice
12. Bias detection and mitigation
13. AI security basics
14. Cost considerations
15. Future-proofing AI solutions

### Step 3: Question Pool Strategy

**Reuse Script**:
```typescript
import { Course } from '@/lib/models';

async function reuseQuestions(sourceCourseId: string, targetCourseId: string) {
  const source = await Course.findOne({ courseId: sourceCourseId });
  const target = await Course.findOne({ courseId: targetCourseId });
  
  // Extract all questions from source
  const sourceQuestions = [];
  source.lessons.forEach(lesson => {
    sourceQuestions.push(...lesson.quizQuestions);
  });
  
  // Distribute reused questions across target lessons
  // Add difficulty tags for filtering
  const reusePool = sourceQuestions.map(q => ({
    ...q,
    difficultyLevel: q.difficulty,
    sourceStage: 1,
    isReused: true
  }));
  
  return reusePool;
}
```

### Step 4: Automated Content Generation

**Use Trinity Architecture** (already implemented):
1. **Drafter**: Creates course outline and lesson structure
2. **Writer**: Generates lesson content building on Stage 1
3. **Judge**: Validates quality, ensures proper progression

**Configuration**:
```json
{
  "sourceCourse": "AI_DUMMIES_1DAY_EN",
  "targetCourse": "AI_ESSENTIALS_3DAY_EN",
  "reuseQuestions": true,
  "minNewQuestions": 50,
  "difficultyProgression": true,
  "prerequisiteEnforcement": true
}
```

### Step 5: Progressive Difficulty

**Question Addition Strategy**:
- Days 1-5: Mix 60% Stage 1 questions, 40% new
- Days 6-10: Mix 40% Stage 1 questions, 60% new
- Days 11-15: Mix 20% Stage 1 questions, 80% new

This ensures:
- Spaced repetition of fundamentals
- Smooth difficulty curve
- Comprehensive assessment

---

## Automation System Design

### Content Builder Service

**File**: `app/lib/course-generation/progressive-builder.ts`

```typescript
interface ProgressiveCourseConfig {
  sourceStage: number;
  targetStage: number;
  topicName: string;
  reuseContent: {
    questions: boolean;
    concepts: boolean;
    prerequisites: boolean;
  };
  additions: {
    newLessons: number;
    newQuestions: number;
    difficultyIncrease: DifficultyLevel;
  };
}

class ProgressiveCourseBuilder {
  async buildNextStage(config: ProgressiveCourseConfig) {
    // 1. Load source course
    // 2. Extract reusable content
    // 3. Generate new content outline
    // 4. Create difficulty progression
    // 5. Assemble final course
    // 6. Validate quality
    // 7. Deploy to production
  }
}
```

### Trigger System

**Already implemented** in Phase 1:
- Metrics tracking (enrollments, completions, scores)
- Threshold evaluation (50 completions → Stage 2)
- Admin API for manual triggers

### Quality Assurance

1. **Content Validation**:
   - Ensure no exact repetition
   - Verify difficulty progression
   - Check question pool diversity

2. **Prerequisite Chain**:
   - Stage 2 requires Stage 1 completion
   - Auto-link in course metadata

3. **Quiz Pool Size**:
   - Minimum 100 questions for Stage 2 (50 reused + 50 new)
   - Minimum 200 for Stage 3
   - Minimum 400 for Stage 4

---

## Next Steps

### Immediate Actions

1. **Review Stage 1 Content**:
   ```bash
   npm run script:analyze-course -- AI_DUMMIES_1DAY_EN
   ```

2. **Create Stage 2 Outline**:
   - Use Trinity Architecture
   - Build on Stage 1 foundation
   - Add practical examples

3. **Generate Question Pool**:
   - Extract all 50 Stage 1 questions
   - Create 50 new harder questions
   - Tag and categorize

4. **Set Up Tracker**:
   ```bash
   npm run script:create-tracker -- AI_FOUNDATIONS --stage 2
   ```

5. **Deploy Stage 2**:
   - Test prerequisite enforcement
   - Verify question pool size
   - Enable certification

### Monitoring

- Track Stage 1 completion rate
- Monitor when 50 completions reached
- Auto-trigger Stage 2 development
- Notify admins when ready

---

## Benefits of This Approach

### For Learners
- ✅ Smooth learning curve
- ✅ Spaced repetition of concepts
- ✅ Clear progression path
- ✅ Practical skill building

### For Content Team
- ✅ Reuse existing quality content
- ✅ Faster course development
- ✅ Consistent difficulty scaling
- ✅ Automated quality checks

### For Platform
- ✅ Data-driven course generation
- ✅ Scalable content strategy
- ✅ Better learner retention
- ✅ Professional certification paths

---

## Success Metrics

### Stage 2 Launch Criteria
- [ ] Stage 1 has 50+ completions
- [ ] 100+ questions in Stage 2 pool (50 reused + 50 new)
- [ ] 15+ lessons created
- [ ] Prerequisite chain configured
- [ ] Certification enabled
- [ ] Quality validation passed

### Ongoing Metrics
- Completion rate (target: >40%)
- Average score (target: >70%)
- Time to completion (target: 3-5 days)
- Progression to Stage 3 (target: >30% of Stage 2 graduates)

---

**Next Review**: After 50 completions of AI for Dummies in a Day  
**Owner**: Development Team + Content Team  
**Status**: Ready to implement when triggered
