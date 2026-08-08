import { randomUUID } from 'crypto';
import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';
import { enforceQuizQuestionQuality } from '../app/lib/content-quality/enforcement';
import { EnforcementLevel } from '../app/lib/content-quality/enforcement';

const LESSON_ID = 'AI_ESSENTIALS_3DAY_EN_L01';
const COURSE_ID = 'AI_ESSENTIALS_3DAY_EN';

const quizQuestions = [
  {
    uuid: randomUUID(),
    question: 'Your team needs to validate user email addresses during signup (format check only, not verification). Which approach is most appropriate?',
    correctAnswer: 'Traditional regex-based validation',
    wrongAnswers: [
      'AI/ML classifier trained on valid email patterns',
      'Hybrid approach using both AI and regex',
      'Manual human review of each email'
    ],
    explanation: 'Email format validation is a deterministic problem with clear, stable rules defined by RFC standards. Traditional regex is 100% accurate, fast, and requires zero data or ML infrastructure. AI would be unnecessarily complex and costly for this use case.',
    difficulty: 'EASY',
    category: 'Course Specific',
    questionType: 'recall',
    hashtags: ['#decision-framework', '#problem-type', '#traditional-vs-ai']
  },
  {
    uuid: randomUUID(),
    question: 'You have 50 examples of a rare manufacturing defect and need to detect it in real-time on a production line. What is the primary concern?',
    correctAnswer: 'Insufficient training data for reliable AI detection',
    wrongAnswers: [
      'AI will work perfectly with 50 examples',
      'Traditional code cannot handle image recognition',
      'The business value is too low for any solution'
    ],
    explanation: 'AI typically requires hundreds to thousands of examples for reliable pattern recognition, especially for visual defect detection. With only 50 examples of a rare defect, the model will likely overfit or underperform. Consider collecting more data first, using synthetic data augmentation, or starting with traditional computer vision techniques if defect rules can be specified.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'application',
    hashtags: ['#data-availability', '#decision-framework', '#ai-limitations']
  },
  {
    uuid: randomUUID(),
    question: 'A healthcare application needs to calculate medication dosages based on patient weight, age, and kidney function. Which factor most strongly determines the appropriate approach?',
    correctAnswer: 'Accuracy requirement of 100% and catastrophic error cost',
    wrongAnswers: [
      'Business value of getting dosages right',
      'Availability of patient data',
      'Resource constraints for AI infrastructure'
    ],
    explanation: 'Medical dosage calculation requires 100% accuracy with well-defined pharmacological formulas. Errors can be fatal. This is a deterministic problem with established rules (pharmacokinetic equations) that must be followed exactly. Traditional rule-based code ensures complete accuracy, auditability, and regulatory compliance. AI would introduce unnecessary risk and uncertainty.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'application',
    hashtags: ['#accuracy-requirements', '#critical-systems', '#decision-framework']
  },
  {
    uuid: randomUUID(),
    question: 'Your e-commerce site wants to recommend products to users based on browsing history. You have 100,000 users and 5 years of interaction data. Three factors clearly favor AI. Which additional factor is most critical to validate before proceeding?',
    correctAnswer: 'Whether you have ML expertise and infrastructure resources',
    wrongAnswers: [
      'Whether users prefer recommendations or manual search',
      'Whether competitors are using AI recommendations',
      'Whether product categories are clearly defined'
    ],
    explanation: 'While the problem type (pattern recognition), data availability (abundant), and business value (increased sales) favor AI, the resource assessment is critical. Building and maintaining a recommendation system requires specialized ML expertise, computing infrastructure for model training and serving, and ongoing monitoring. Many companies fail by underestimating these resources. Consider starting with a managed recommendation service (e.g., AWS Personalize) to reduce resource burden.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'critical-thinking',
    hashtags: ['#resource-assessment', '#decision-framework', '#implementation-planning']
  },
  {
    uuid: randomUUID(),
    question: 'After applying the five-factor framework, you score 3 factors for AI and 2 for traditional code. What is the most appropriate next step?',
    correctAnswer: 'Build a small proof-of-concept to validate AI feasibility',
    wrongAnswers: [
      'Proceed with full AI implementation immediately',
      'Choose traditional code since it is safer',
      'Hire more AI engineers to tip the scales'
    ],
    explanation: 'When factors are mixed (3-2 split), the framework suggests AI is viable but not conclusive. The best practice is to run a time-boxed proof-of-concept (1-2 weeks) to validate key assumptions: data quality, achievable accuracy, and technical feasibility. This de-risks the decision before committing to a full project. Document learnings to refine your framework scoring.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'best_practice',
    hashtags: ['#decision-framework', '#risk-management', '#proof-of-concept']
  },
  {
    uuid: randomUUID(),
    question: 'A customer support ticket categorization system achieves 91% accuracy with AI. Support staff complain that fixing the 9% of errors takes more time than the old manual process. What does this scenario illustrate?',
    correctAnswer: 'The accuracy threshold assessment did not account for correction costs',
    wrongAnswers: [
      'AI failed because 91% accuracy is too low for any use case',
      'More training data would solve the issue',
      'Traditional code should have been used instead'
    ],
    explanation: 'This illustrates a common pitfall: focusing only on accuracy percentage without considering the *cost of errors*. While 91% sounds good, if the 9% of misclassified tickets are the most complex/important ones, and correcting AI mistakes is harder than just doing it manually, the net value is negative. The framework\'s accuracy factor should evaluate both error rate and error remediation cost. Consider active learning (AI flags uncertain cases for human review) or hybrid approaches.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'diagnostic',
    hashtags: ['#accuracy-requirements', '#error-cost-analysis', '#lessons-learned']
  },
  {
    uuid: randomUUID(),
    question: 'You are evaluating a problem where AI and traditional code both scored well on the five factors. What is the strategic advantage of choosing a hybrid approach?',
    correctAnswer: 'You can use traditional rules for deterministic cases and AI for ambiguous cases',
    wrongAnswers: [
      'Hybrid approaches perform better than either approach alone',
      'Hybrid systems require fewer resources than pure AI',
      'Using both technologies impresses stakeholders'
    ],
    explanation: 'The strategic power of hybrid approaches is leveraging the strengths of both: use fast, accurate, explainable traditional code for cases that fit clear rules (e.g., "if invoice total is negative, flag as error"), and reserve AI for genuinely ambiguous cases requiring pattern recognition (e.g., "is this expense description for a business meal or personal meal?"). This often achieves higher overall accuracy, lower costs, and better explainability than pure AI while handling complexity traditional code cannot.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'concept',
    hashtags: ['#hybrid-approaches', '#decision-framework', '#system-design']
  }
];

async function addQuizQuestions() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID });
  if (!course) {
    throw new Error(`Course ${COURSE_ID} not found`);
  }

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID });
  if (!lesson) {
    throw new Error(`Lesson ${LESSON_ID} not found`);
  }

  console.log(`\n📝 Adding ${quizQuestions.length} Quiz Questions to Lesson 1\n`);
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
