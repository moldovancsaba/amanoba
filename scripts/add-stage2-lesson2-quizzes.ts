import { randomUUID } from 'crypto';
import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';
import { enforceQuizQuestionQuality } from '../app/lib/content-quality/enforcement';
import { EnforcementLevel } from '../app/lib/content-quality/enforcement';

const LESSON_ID = 'AI_ESSENTIALS_3DAY_EN_L02';
const COURSE_ID = 'AI_ESSENTIALS_3DAY_EN';

const quizQuestions = [
  {
    uuid: randomUUID(),
    question: 'Your startup needs sentiment analysis for customer reviews (positive/neutral/negative). You have 6 months before launch and a small team with no ML expertise. Which tool category is most appropriate?',
    correctAnswer: 'API-first solution (e.g., Google Natural Language API)',
    wrongAnswers: [
      'Custom TensorFlow model built from scratch',
      'Managed platform with months of training required',
      'Hire ML engineers and build internal capability first'
    ],
    explanation: 'For common tasks like sentiment analysis, API-first solutions provide immediate value with zero ML expertise required. With only 6 months and no ML team, building custom models or investing in platform training would miss your launch window. APIs like Google Cloud Natural Language or AWS Comprehend handle sentiment analysis out-of-the-box.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'application',
    hashtags: ['#tool-selection', '#api-first', '#time-constraints']
  },
  {
    uuid: randomUUID(),
    question: 'You tested an AI API with 100 sample images in development and it worked perfectly. Now in production with 100,000 images/day, costs are 50x higher than projected. What was the primary mistake?',
    correctAnswer: 'Failed to model production-scale costs before committing',
    wrongAnswers: [
      'Chose the wrong API vendor',
      'Should have built a custom model instead',
      'The API pricing changed unexpectedly'
    ],
    explanation: 'This is a classic cost modeling failure. Development usage (100 images) is tiny compared to production (100,000/day = 3 million/month). The mistake was not calculating: (dev API calls) × (production multiplier) × (cost per call) before deployment. Always model production-scale costs, not just development costs.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'diagnostic',
    hashtags: ['#cost-modeling', '#production-scale', '#lessons-learned']
  },
  {
    uuid: randomUUID(),
    question: 'A company spent 8 months building a custom image classification model. A competitor launched the same feature in 2 weeks using an off-the-shelf API. Both achieve 92% accuracy. What does this scenario best illustrate?',
    correctAnswer: 'Opportunity cost of building vs buying for common AI tasks',
    wrongAnswers: [
      'Custom models provide superior accuracy',
      'APIs cannot match custom model performance',
      'The competitor made a mistake by using an API'
    ],
    explanation: 'This illustrates classic build-vs-buy opportunity cost. For common tasks (image classification), APIs provide comparable accuracy with 95% less development time. The 8-month delay meant 6 months of lost market opportunity, revenue, and customer feedback. Custom models make sense for specialized tasks, not commodity AI capabilities.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'concept',
    hashtags: ['#build-vs-buy', '#opportunity-cost', '#market-timing']
  },
  {
    uuid: randomUUID(),
    question: 'You are evaluating three AI tools. Tool A scores highest on features (95/100) but lowest on cost (40/100). Tool B is balanced (70 features, 70 cost). Tool C has fewer features (60/100) but excellent cost (90/100). You give features 40% weight and cost 30% weight. Which tool scores highest overall?',
    correctAnswer: 'Tool A (38 + 12 = highest weighted total)',
    wrongAnswers: [
      'Tool B (balanced scores mean best overall)',
      'Tool C (lowest cost is most important)',
      'All three tie (scoring does not determine winner)'
    ],
    explanation: 'Weighted scoring: Tool A = (95 × 0.4) + (40 × 0.3) = 38 + 12 = 50. Tool B = (70 × 0.4) + (70 × 0.3) = 28 + 21 = 49. Tool C = (60 × 0.4) + (90 × 0.3) = 24 + 27 = 51. Tool C actually scores highest (51) despite fewer features, because cost carries significant weight (30%) and it excels there. This shows why weighted scoring prevents feature-obsession.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'application',
    hashtags: ['#decision-matrix', '#weighted-scoring', '#quantitative-analysis']
  },
  {
    uuid: randomUUID(),
    question: 'Your proof-of-concept with an AI tool achieved 85% accuracy on 200 test samples, just below your 90% target. The vendor says more data will improve it. What is the best next step?',
    correctAnswer: 'Analyze failure cases to understand if they are fixable before investing more',
    wrongAnswers: [
      'Immediately reject the tool since it missed the 90% target',
      'Deploy to production and collect more data to improve over time',
      'Switch to a different vendor without investigating further'
    ],
    explanation: 'Analyze failure modes first. If the tool fails on edge cases you can handle separately (e.g., hybrid approach), it may still be viable. If failures are core to your use case, more data will not help. Understanding *why* it missed 90% determines whether to iterate, pivot, or abandon. Blanket rejecting 85% accuracy or deploying sub-threshold AI are both premature.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'best_practice',
    hashtags: ['#poc-evaluation', '#failure-analysis', '#iteration-strategy']
  },
  {
    uuid: randomUUID(),
    question: 'A vendor offers two pricing models: (1) $0.01/API call with no minimum, or (2) $500/month flat fee for unlimited calls. You expect 30,000 calls/month initially, growing to 80,000 within 6 months. Which model has lower total cost over the first year?',
    correctAnswer: 'Model 2 (flat fee) is cheaper long-term at expected volumes',
    wrongAnswers: [
      'Model 1 (pay-per-call) is cheaper at all volumes',
      'Both models cost exactly the same over 12 months',
      'Cannot determine without knowing exact monthly usage'
    ],
    explanation: 'Calculate breakeven: $500/month ÷ $0.01/call = 50,000 calls/month. Model 1: First 6 months at 30k calls = $300/month × 6 = $1,800. Next 6 months at 80k calls = $800/month × 6 = $4,800. Total = $6,600. Model 2: $500/month × 12 = $6,000. Model 2 saves $600 and provides cost predictability. Lesson: Flat fees often win at scale.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'application',
    hashtags: ['#pricing-models', '#cost-optimization', '#scaling-economics']
  },
  {
    uuid: randomUUID(),
    question: 'Your team integrated deeply with one cloud AI platform using proprietary features. Now a better, cheaper competitor emerged. Migration would take 4-6 months. What risk does this scenario demonstrate?',
    correctAnswer: 'Vendor lock-in from deep integration with proprietary features',
    wrongAnswers: [
      'Poor initial tool selection that should have been avoided',
      'Market volatility makes all AI tool choices risky',
      'The current vendor deliberately trapped you'
    ],
    explanation: 'This is textbook vendor lock-in. Using proprietary features (not available elsewhere) creates switching costs. Mitigation strategies: abstract proprietary features behind your own interfaces, prefer standard APIs over custom integrations, plan exit strategies upfront. Note: Some lock-in is acceptable if benefits outweigh switching costs—the key is making it an informed choice, not an accident.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'concept',
    hashtags: ['#vendor-lock-in', '#risk-management', '#integration-strategy']
  }
];

async function addQuizQuestions() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID });
  if (!course) throw new Error(`Course ${COURSE_ID} not found`);

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID });
  if (!lesson) throw new Error(`Lesson ${LESSON_ID} not found`);

  console.log(`\n📝 Adding ${quizQuestions.length} Quiz Questions to Lesson 2\n`);
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < quizQuestions.length; i++) {
    const q = quizQuestions[i];
    console.log(`\nQuestion ${i + 1}/${quizQuestions.length}:`);
    console.log(`  "${q.question.substring(0, 60)}..."`);

    const questionData = {
      ...q,
      lessonId: lesson.lessonId,
      courseId: course._id,
      isCourseSpecific: true,
      isActive: true,
      showCount: 0,
      correctCount: 0
    };

    const validation = enforceQuizQuestionQuality(questionData, {
      level: EnforcementLevel.STRICT,
      context: 'agent_generation',
      enforcedBy: 'agent',
      expectedLanguage: 'en',
    });

    if (validation.allowed) {
      console.log(`  ✅ PASSED (score: ${validation.validation.qualityScore}/100)`);
      await QuizQuestion.create(questionData);
      passed++;
    } else {
      console.log(`  ❌ BLOCKED: ${validation.enforcement.reason}`);
      console.log(`  Errors:`, validation.validation.errors);
      failed++;
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`\n✅ Added: ${passed} questions`);
  console.log(`❌ Failed: ${failed} questions`);
  console.log();

  process.exit(0);
}

addQuizQuestions().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
