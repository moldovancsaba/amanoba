/**
 * Test Content Quality Enforcement
 *
 * What: Test script to verify content quality enforcement is working correctly
 * Why: Ensure the system blocks bad content and allows good content
 *
 * Usage: npx tsx scripts/test-content-quality-enforcement.ts
 */

import {
  validateLesson,
  validateQuizQuestion,
  validateQuizDistribution,
} from '../app/lib/validators/content-standards';
import {
  enforceLessonQuality,
  enforceQuizQuestionQuality,
  enforceCourseQuality,
  EnforcementLevel,
} from '../app/lib/content-quality/enforcement';
import { QuestionDifficulty, QuestionType } from '../app/lib/models/quiz-question';

console.log('🧪 Testing Content Quality Enforcement System\n');

let passedTests = 0;
let failedTests = 0;

function test(name: string, fn: () => boolean) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passedTests++;
    } else {
      console.log(`❌ ${name} - assertion failed`);
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ ${name} - ${error instanceof Error ? error.message : String(error)}`);
    failedTests++;
  }
}

// ============================================================================
// Test 1: Good Lesson Should Pass
// ============================================================================

test('Good lesson with 5W1H structure should pass', () => {
  const goodLesson = {
    lessonId: 'TEST_L01',
    dayNumber: 1,
    language: 'en',
    title: 'Product Promise and Success Criteria',
    content: `
# Lesson 1: Product Promise and Success Criteria

**One-liner:** Set a clear product promise and define what success looks like.
**Time:** 20–30 min
**Deliverable:** Product Promise and Success Checklist

## Learning goal

You will be able to: **Define a product promise and measurable success criteria for a sellable AI app.**

### Success criteria (observable)
- [ ] The promise states a specific user, problem, and outcome
- [ ] The success checklist includes at least 5 binary checks
- [ ] A baseline metric is recorded with a date

### Output you will produce
- **Deliverable:** Product Promise and Success Checklist
- **Format:** One page doc plus checklist
- **Where saved:** Course folder

## Who

**Primary persona:** Digital nomad building a commercial AI app
**Secondary persona(s):** Early customers who will pay for the solution

## What

### What it is
A short, testable promise that states who the app helps and what outcome it delivers.

### What it is not
It is not a feature list or a marketing slogan.

### 2-minute theory
- Clear promises reduce scope drift
- Success criteria make progress measurable
- Early metrics guide what to build next

### Key terms
- **Product promise:** A one sentence commitment to a user outcome
- **Success criteria:** Binary checks that confirm the promise is met

## Where

### Applies in
- Product planning and roadmap decisions
- Landing page copy and onboarding

### Does not apply in
- Low level code optimization discussions

### Touchpoints
- Landing page
- Onboarding screen
- Support FAQ

## When

### Use it when
- Starting a new AI product idea
- Realigning a project that feels too broad

### Frequency
Once per product idea, then revisit monthly

### Late signals
- Features keep expanding without user wins
- You cannot state success in one sentence

## Why it matters

### Practical benefits
- Faster build decisions
- Clearer messaging for sales
- Easier validation with early users

### Risks of ignoring
- Building features nobody pays for
- Confusing marketing and onboarding

### Expectations
- Improves: focus and decision speed
- Does not guarantee: product market fit

## How

### Step-by-step method
1. Name the target user and their core problem
2. Define the concrete outcome you deliver
3. Write the one sentence promise
4. List 5 to 7 binary success checks
5. Add a baseline metric with a date

### Do and don't

**Do**
- Use plain language a customer would understand
- Make each success check yes or no

**Don't**
- Use jargon or internal terms
- Make success checks vague or subjective

### Common mistakes
- Mistake 1: Feature list instead of outcome → Fix: Focus on user result
- Mistake 2: Vague success checks → Fix: Make them binary (yes/no)

## Guided exercise

**Steps:**
1. Choose a target user (e.g., freelance designers)
2. Name their problem (e.g., messy notes before proposals)
3. State your outcome (e.g., 5 minute brief for faster proposals)
4. Write the promise as one sentence
5. Add 5 binary checks

**Expected result:** One clear promise sentence and 5 yes/no checks

## Independent exercise

**Your task:** Create your own product promise and success checklist

**Deliverable:** Product Promise and Success Checklist document

**Time:** 15-20 minutes

## Self-check

Use this checklist to verify your work:

- [ ] Promise names specific user and outcome
- [ ] Success checks are binary (yes/no)
- [ ] Baseline metric has a date
- [ ] Everything fits on one page
- [ ] You can explain it to a customer

## Bibliography

**Sources used:**
- Ries, Eric. The Lean Startup. https://example.com/lean-startup
- Blank, Steve. The Four Steps to the Epiphany. https://example.com/four-steps

## Read more

**For deeper learning:**
- Jobs to be Done Framework – https://example.com/jtbd – Understand customer motivations
- Lean Canvas – https://example.com/lean-canvas – One-page business model
    `,
    emailSubject: 'Day 1: Product Promise and Success Criteria',
    emailBody: 'Start your AI product journey by defining a clear promise...',
    pointsReward: 100,
    xpReward: 50,
    isActive: true,
    displayOrder: 0,
  };

  const result = enforceLessonQuality(goodLesson, {
    level: EnforcementLevel.STRICT,
  });

  return result.allowed && result.validation.qualityScore >= 70;
});

// ============================================================================
// Test 2: Bad Lesson Should Fail
// ============================================================================

test('Lesson with missing sections should be blocked', () => {
  const badLesson = {
    lessonId: 'TEST_L02',
    dayNumber: 2,
    language: 'en',
    title: 'Incomplete Lesson',
    content: `
# Lesson 2: Incomplete Lesson

This is just some random content without proper structure.
No deliverable, no exercises, no 5W1H structure.

[TODO] Add content later.
    `,
    emailSubject: 'Day 2: Incomplete',
    emailBody: 'This is incomplete',
    pointsReward: 100,
    xpReward: 50,
    isActive: true,
    displayOrder: 0,
  };

  const result = enforceLessonQuality(badLesson, {
    level: EnforcementLevel.STRICT,
  });

  return !result.allowed && result.validation.errors.length > 0;
});

// ============================================================================
// Test 3: Good Quiz Question Should Pass
// ============================================================================

test('Standalone scenario-based question should pass', () => {
  const goodQuestion = {
    uuid: crypto.randomUUID(),
    question:
      'A builder says, "My AI app will use GPT-4 and a dashboard." Which revision makes this a product promise with a concrete outcome?',
    correctAnswer:
      'Freelance designers get a 5 minute brief from messy notes so they can send proposals faster.',
    wrongAnswers: [
      'My AI app will use GPT-4 and provide a sleek dashboard for modern teams.',
      'The app will include templates, automations, and a chat window for users.',
      'We will add more models and more integrations to cover more use cases.',
    ],
    explanation:
      'Option B states a clear user (freelance designers), the problem context (messy notes), and the specific outcome (send proposals faster in 5 minutes).',
    difficulty: QuestionDifficulty.EASY,
    category: 'product-strategy',
    questionType: QuestionType.APPLICATION,
    hashtags: ['#promise', '#user-outcome', '#mvp'],
    isActive: true,
    isCourseSpecific: true,
    lessonId: 'TEST_L01',
  };

  const result = enforceQuizQuestionQuality(goodQuestion, {
    level: EnforcementLevel.STRICT,
    expectedLanguage: 'en',
  });

  return result.allowed && result.validation.qualityScore >= 75;
});

// ============================================================================
// Test 4: Bad Quiz Question Should Fail (Context-Dependent)
// ============================================================================

test('Context-dependent question should be blocked', () => {
  const badQuestion = {
    uuid: crypto.randomUUID(),
    question: 'In this lesson, we learned about product promises. What is the main goal?',
    correctAnswer: 'To improve focus and decision speed',
    wrongAnswers: ['To create a feature list', 'To guarantee product-market fit', 'All of the above'],
    difficulty: QuestionDifficulty.EASY,
    category: 'product-strategy',
    questionType: QuestionType.APPLICATION,
    isActive: true,
    isCourseSpecific: true,
    lessonId: 'TEST_L01',
  };

  const result = enforceQuizQuestionQuality(badQuestion, {
    level: EnforcementLevel.STRICT,
  });

  return !result.allowed && result.validation.errors.some((e) => e.includes('standalone'));
});

// ============================================================================
// Test 5: Recall Question Should Fail
// ============================================================================

test('Recall-type question should be blocked', () => {
  const recallQuestion = {
    uuid: crypto.randomUUID(),
    question: 'What is a product promise?',
    correctAnswer: 'A one sentence commitment to a user outcome',
    wrongAnswers: ['A feature list', 'A marketing slogan', 'A technical specification'],
    difficulty: QuestionDifficulty.EASY,
    category: 'product-strategy',
    questionType: QuestionType.RECALL, // FORBIDDEN
    isActive: true,
    isCourseSpecific: true,
    lessonId: 'TEST_L01',
  };

  const result = enforceQuizQuestionQuality(recallQuestion, {
    level: EnforcementLevel.STRICT,
  });

  return !result.allowed && result.validation.errors.some((e) => e.includes('RECALL'));
});

// ============================================================================
// Test 6: Quiz Distribution Validation
// ============================================================================

test('Quiz distribution with < 7 questions should fail', () => {
  const questions = [
    {
      question: 'Question 1',
      correctAnswer: 'A',
      wrongAnswers: ['B', 'C', 'D'],
      difficulty: QuestionDifficulty.EASY,
      category: 'test',
      questionType: QuestionType.APPLICATION,
      isActive: true,
      isCourseSpecific: true,
    },
    {
      question: 'Question 2',
      correctAnswer: 'A',
      wrongAnswers: ['B', 'C', 'D'],
      difficulty: QuestionDifficulty.EASY,
      category: 'test',
      questionType: QuestionType.APPLICATION,
      isActive: true,
      isCourseSpecific: true,
    },
    // Only 2 questions - need 7+
  ];

  const result = validateQuizDistribution(questions);

  return !result.isValid && result.errors.some((e) => e.includes('7 minimum'));
});

// ============================================================================
// Test 7: English Leakage Detection
// ============================================================================

test('English leakage in non-English content should be detected', () => {
  const hungarianLessonWithEnglish = {
    lessonId: 'TEST_L03',
    dayNumber: 3,
    language: 'hu', // Hungarian
    title: 'Magyar lecke',
    content: `
# Lecke 3: Magyar lecke

**Deliverable:** A product promise table

## Learning goal
You will be able to: create a promise.

## Who
The primary persona is a digital nomad.

[... rest of content in English ...]
    `, // Mixed English/Hungarian
    emailSubject: 'Nap 3',
    emailBody: 'Tartalom',
    pointsReward: 100,
    xpReward: 50,
    isActive: true,
    displayOrder: 0,
  };

  const result = validateLesson(hungarianLessonWithEnglish);

  return !result.isValid && result.errors.some((e) => e.includes('English leakage'));
});

// ============================================================================
// Test 8: Batch Enforcement (Course-Level)
// ============================================================================

test('Course with one bad lesson should be blocked in STRICT mode', () => {
  const lessons = [
    {
      lessonId: 'TEST_L01',
      dayNumber: 1,
      language: 'en',
      title: 'Good Lesson',
      content: `
# Lesson 1: Good Lesson
**Deliverable:** Something
**One-liner:** Test
**Time:** 20 min

## Learning goal
You will be able to: do something

### Success criteria
- [ ] Check 1

## Who
**Primary persona:** Someone

## What
### What it is
Something
### What it is not
Nothing
### 2-minute theory
- Point 1
### Key terms
- **Term:** definition

## Where
### Applies in
- Somewhere
### Does not apply in
- Nowhere
### Touchpoints
- Touch 1

## When
### Use it when
- Sometime
### Frequency
Daily
### Late signals
- Signal

## Why it matters
### Practical benefits
- Benefit
### Risks of ignoring
- Risk
### Expectations
- Expectation

## How
### Step-by-step method
1. Step 1
### Do and don't
**Do** - Something
**Don't** - Nothing
### Common mistakes
- Mistake

## Guided exercise
Exercise content

## Independent exercise
Task

## Self-check
- [ ] Check

## Bibliography
- Source 1

## Read more
- Resource 1
      `,
      emailSubject: 'Day 1',
      emailBody: 'Body',
      pointsReward: 100,
      xpReward: 50,
      isActive: true,
      displayOrder: 0,
      quizQuestions: [],
    },
    {
      lessonId: 'TEST_L02',
      dayNumber: 2,
      language: 'en',
      title: 'Bad Lesson',
      content: 'This is incomplete with [TODO] markers', // BAD
      emailSubject: 'Day 2',
      emailBody: 'Body',
      pointsReward: 100,
      xpReward: 50,
      isActive: true,
      displayOrder: 0,
      quizQuestions: [],
    },
  ];

  const result = enforceCourseQuality(lessons, {
    level: EnforcementLevel.STRICT,
  });

  return !result.allowed && result.summary.blockedLessons > 0;
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('📊 Test Results Summary');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (failedTests > 0) {
  console.log('\n❌ Some tests failed. Please review the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed! Content quality enforcement is working correctly.');
  process.exit(0);
}
