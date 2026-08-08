import { randomUUID } from 'crypto';
import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import Lesson from '../app/lib/models/lesson';
import { readFileSync } from 'fs';
import { join } from 'path';

const STAGE2_COURSE_ID = 'AI_ESSENTIALS_3DAY_EN';

const lessonContent = readFileSync(join(__dirname, 'stage2-lesson1-content.md'), 'utf-8');

const selfCheck = {
  instruction: "Before moving on, verify your understanding of the AI Decision Framework:",
  questions: [
    "Can you name all five factors in the decision framework?",
    "Have you completed the assessment checklist for at least one scenario?",
    "Can you explain when traditional code is better than AI?",
    "Do you understand the data availability threshold for AI projects?",
    "Can you calculate a basic ROI for an AI vs traditional solution?"
  ]
};

const quizQuestions = [
  {
    uuid: randomUUID(),
    questionText: "Your team needs to validate user email addresses during signup (format check only, not verification). Which approach is most appropriate?",
    category: 'Course Specific',
    difficulty: 'EASY',
    questionType: 'recall',
    options: [
      { text: 'AI/ML classifier trained on valid email patterns', points: 0 },
      { text: 'Traditional regex-based validation', points: 10 },
      { text: 'Hybrid approach using both AI and regex', points: 0 },
      { text: 'Manual human review of each email', points: 0 }
    ],
    explanation: 'Email format validation is a deterministic problem with clear, stable rules defined by RFC standards. Traditional regex is 100% accurate, fast, and requires zero data or ML infrastructure. AI would be unnecessarily complex and costly for this use case.',
    tags: ['decision-framework', 'problem-type', 'traditional-vs-ai']
  },
  {
    uuid: randomUUID(),
    questionText: "You have 50 examples of a rare manufacturing defect and need to detect it in real-time on a production line. What is the primary concern?",
    category: 'Course Specific',
    difficulty: 'MEDIUM',
    questionType: 'application',
    options: [
      { text: 'AI will work perfectly with 50 examples', points: 0 },
      { text: 'Insufficient training data for reliable AI detection', points: 10 },
      { text: 'Traditional code cannot handle image recognition', points: 0 },
      { text: 'The business value is too low for any solution', points: 0 }
    ],
    explanation: 'AI typically requires hundreds to thousands of examples for reliable pattern recognition, especially for visual defect detection. With only 50 examples of a rare defect, the model will likely overfit or underperform. Consider collecting more data first, using synthetic data augmentation, or starting with traditional computer vision techniques if defect rules can be specified.',
    tags: ['data-availability', 'decision-framework', 'ai-limitations']
  },
  {
    uuid: randomUUID(),
    questionText: "A healthcare application needs to calculate medication dosages based on patient weight, age, and kidney function. Which factor most strongly determines the appropriate approach?",
    category: 'Course Specific',
    difficulty: 'MEDIUM',
    questionType: 'application',
    options: [
      { text: 'Business value of getting dosages right', points: 0 },
      { text: 'Accuracy requirement of 100% and catastrophic error cost', points: 10 },
      { text: 'Availability of patient data', points: 0 },
      { text: 'Resource constraints for AI infrastructure', points: 0 }
    ],
    explanation: 'Medical dosage calculation requires 100% accuracy with well-defined pharmacological formulas. Errors can be fatal. This is a deterministic problem with established rules (pharmacokinetic equations) that must be followed exactly. Traditional rule-based code ensures complete accuracy, auditability, and regulatory compliance. AI would introduce unnecessary risk and uncertainty.',
    tags: ['accuracy-requirements', 'critical-systems', 'decision-framework']
  },
  {
    uuid: randomUUID(),
    questionText: "Your e-commerce site wants to recommend products to users based on browsing history. You have 100,000 users and 5 years of interaction data. Three factors clearly favor AI. Which additional factor is most critical to validate before proceeding?",
    category: 'Course Specific',
    difficulty: 'HARD',
    questionType: 'critical-thinking',
    options: [
      { text: 'Whether you have ML expertise and infrastructure resources', points: 10 },
      { text: 'Whether users prefer recommendations or manual search', points: 0 },
      { text: 'Whether competitors are using AI recommendations', points: 0 },
      { text: 'Whether product categories are clearly defined', points: 0 }
    ],
    explanation: 'While the problem type (pattern recognition), data availability (abundant), and business value (increased sales) favor AI, the resource assessment is critical. Building and maintaining a recommendation system requires specialized ML expertise, computing infrastructure for model training and serving, and ongoing monitoring. Many companies fail by underestimating these resources. Consider starting with a managed recommendation service (e.g., AWS Personalize) to reduce resource burden.',
    tags: ['resource-assessment', 'decision-framework', 'implementation-planning']
  },
  {
    uuid: randomUUID(),
    questionText: "After applying the five-factor framework, you score 3 factors for AI and 2 for traditional code. What is the most appropriate next step?",
    category: 'Course Specific',
    difficulty: 'MEDIUM',
    questionType: 'best_practice',
    options: [
      { text: 'Proceed with full AI implementation immediately', points: 0 },
      { text: 'Build a small proof-of-concept to validate AI feasibility', points: 10 },
      { text: 'Choose traditional code since it is safer', points: 0 },
      { text: 'Hire more AI engineers to tip the scales', points: 0 }
    ],
    explanation: 'When factors are mixed (3-2 split), the framework suggests AI is viable but not conclusive. The best practice is to run a time-boxed proof-of-concept (1-2 weeks) to validate key assumptions: data quality, achievable accuracy, and technical feasibility. This de-risks the decision before committing to a full project. Document learnings to refine your framework scoring.',
    tags: ['decision-framework', 'risk-management', 'proof-of-concept']
  },
  {
    uuid: randomUUID(),
    questionText: "A customer support ticket categorization system achieves 91% accuracy with AI. Support staff complain that fixing the 9% of errors takes more time than the old manual process. What does this scenario illustrate?",
    category: 'Course Specific',
    difficulty: 'HARD',
    questionType: 'diagnostic',
    options: [
      { text: 'AI failed because 91% accuracy is too low for any use case', points: 0 },
      { text: 'The accuracy threshold assessment did not account for correction costs', points: 10 },
      { text: 'More training data is always the solution', points: 0 },
      { text: 'Traditional code should have been used instead', points: 0 }
    ],
    explanation: 'This illustrates a common pitfall: focusing only on accuracy percentage without considering the *cost of errors*. While 91% sounds good, if the 9% of misclassified tickets are the most complex/important ones, and correcting AI mistakes is harder than just doing it manually, the net value is negative. The framework\'s accuracy factor should evaluate both error rate and error remediation cost. Consider active learning (AI flags uncertain cases for human review) or hybrid approaches.',
    tags: ['accuracy-requirements', 'error-cost-analysis', 'lessons-learned']
  },
  {
    uuid: randomUUID(),
    questionText: "You are evaluating a problem where AI and traditional code both scored well on the five factors. What is the strategic advantage of choosing a hybrid approach?",
    category: 'Course Specific',
    difficulty: 'HARD',
    questionType: 'concept',
    options: [
      { text: 'Hybrid approaches always perform better than either approach alone', points: 0 },
      { text: 'You can use traditional rules for deterministic cases and AI for ambiguous cases', points: 10 },
      { text: 'Hybrid systems require fewer resources than pure AI', points: 0 },
      { text: 'It impresses stakeholders to use both technologies', points: 0 }
    ],
    explanation: 'The strategic power of hybrid approaches is leveraging the strengths of both: use fast, accurate, explainable traditional code for cases that fit clear rules (e.g., "if invoice total is negative, flag as error"), and reserve AI for genuinely ambiguous cases requiring pattern recognition (e.g., "is this expense description for a business meal or personal meal?"). This often achieves higher overall accuracy, lower costs, and better explainability than pure AI while handling complexity traditional code cannot.',
    tags: ['hybrid-approaches', 'decision-framework', 'system-design']
  }
];

async function addLesson1() {
  await connectDB();

  const course = await Course.findOne({ courseId: STAGE2_COURSE_ID });
  if (!course) {
    throw new Error(`Course ${STAGE2_COURSE_ID} not found`);
  }

  console.log('Creating Lesson 1: AI Decision Framework...');

  const lesson = await Lesson.create({
    lessonId: `${STAGE2_COURSE_ID}_L01`,
    courseId: course._id,
    dayNumber: 1,
    title: 'AI Decision Framework - When to Use AI',
    content: lessonContent,
    selfCheck,
    emailSubject: 'Day 1: Master the AI Decision Framework',
    emailBody: `Welcome to Day 1 of AI Essentials!\n\nToday you'll learn a systematic five-factor framework to decide when AI is the right solution versus traditional programming.\n\nYour deliverable: AI Suitability Assessment Checklist\n\nLet's dive in!\n\n${course.title} Team`,
    displayOrder: 1,
    quizQuestions: quizQuestions as any
  });

  console.log(`✅ Lesson created: ${lesson.title}`);
  console.log(`   Lesson ID: ${lesson.lessonId}`);
  console.log(`   Content length: ${lessonContent.length} characters`);
  console.log(`   Self-check questions: ${selfCheck.questions.length}`);
  console.log(`   Quiz questions: ${quizQuestions.length}`);

  process.exit(0);
}

addLesson1().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
