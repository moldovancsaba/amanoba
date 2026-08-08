import { randomUUID } from 'crypto';
import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';
import { enforceLessonQuality, enforceQuizQuestionQuality, EnforcementLevel } from '../app/lib/content-quality/enforcement';
import { readFileSync } from 'fs';
import { join } from 'path';

const STAGE2_COURSE_ID = 'AI_ESSENTIALS_3DAY_EN';
const lessonContent = readFileSync(join(__dirname, 'stage2-lesson3-content.md'), 'utf-8');

const quizQuestions = [
  {
    uuid: randomUUID(),
    question: 'Your production AI model\'s accuracy dropped from 94% to 82% over 6 months. Users have not complained yet. What is the most appropriate immediate action?',
    correctAnswer: 'Investigate root cause (data drift vs. system issue) before deciding next steps',
    wrongAnswers: [
      'Immediately retrain the model with latest data',
      'Wait for user complaints before taking action',
      'Roll back to the previous model version'
    ],
    explanation: 'A 12-point accuracy drop is significant and requires investigation, not reflexive retraining. Check: (1) Is input data quality degraded? (2) Have real-world patterns shifted (data drift)? (3) Are there system issues (logging errors, corrupted inputs)? Root cause determines the fix: data quality issues need pipeline fixes, drift needs retraining, system issues need debugging—not blanket retraining.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'best_practice',
    hashtags: ['#model-drift', '#incident-response', '#production-monitoring']
  },
  {
    uuid: randomUUID(),
    question: 'A loan approval AI achieves 90% accuracy overall. When audited by demographic group, accuracy is 92% for Group A and 85% for Group B. What does this scenario most clearly demonstrate?',
    correctAnswer: 'Overall accuracy can mask significant fairness issues across subgroups',
    wrongAnswers: [
      'The AI is fair because overall accuracy exceeds 90%',
      'Group B data quality is lower and needs improvement',
      'This performance gap is statistically insignificant'
    ],
    explanation: 'This is a classic fairness issue: aggregate metrics (90% overall) hide disparate impact (7-point gap between groups). A loan AI with 92% vs. 85% accuracy means Group B faces 7% more erroneous denials or approvals. Regulators and courts evaluate fairness by subgroup performance, not overall averages. Always test AI across demographics, not just aggregates.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'diagnostic',
    hashtags: ['#fairness', '#bias-detection', '#disparate-impact']
  },
  {
    uuid: randomUUID(),
    question: 'You plan to deploy a new AI model to replace the current one. Current model accuracy: 88%. New model accuracy: 91% on test set. What deployment strategy minimizes production risk?',
    correctAnswer: 'Shadow mode for 1 week, then A/B test (5% traffic), then full rollout',
    wrongAnswers: [
      'Immediate 100% rollout since new model is better',
      'A/B test only (skip shadow mode to save time)',
      'Deploy to 50% of traffic immediately for faster validation'
    ],
    explanation: 'Gradual rollout minimizes risk. Shadow mode validates new model predictions against current model without affecting users, catching unexpected behavior. A/B testing (5-10% traffic) exposes new model to real users while limiting blast radius. Only after both pass do you expand to 100%. Test-set accuracy does not guarantee production performance—real-world data often surprises.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'best_practice',
    hashtags: ['#deployment-strategy', '#risk-management', '#shadow-mode']
  },
  {
    uuid: randomUUID(),
    question: 'An AI system for resume screening was trained on 2018-2021 hiring data. Now in 2026, it ranks candidates poorly for emerging job skills (e.g., prompt engineering, edge AI). What production challenge does this illustrate?',
    correctAnswer: 'Model drift due to evolving real-world patterns not present in training data',
    wrongAnswers: [
      'The AI is biased against new technologies',
      'Training data quality was insufficient from the start',
      'The model was overfitted to 2018-2021 data'
    ],
    explanation: 'This is model drift (also called concept drift). The AI learned what "good candidates" looked like in 2018-2021, but the job market evolved. New skills (prompt engineering, edge AI) that signal strong candidates in 2026 did not exist in training data. Solution: Retrain periodically with recent data to capture evolving patterns. Drift is inevitable as the world changes.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'concept',
    hashtags: ['#model-drift', '#concept-drift', '#training-data-staleness']
  },
  {
    uuid: randomUUID(),
    question: 'Your fraud detection AI flagged 10,000 transactions in the past month. Manual review found 200 were actually fraudulent (2% precision). However, it caught 95% of all fraud. What is the primary operational problem?',
    correctAnswer: 'Low precision creates unsustainable manual review burden (9,800 false positives)',
    wrongAnswers: [
      'The AI failed because precision is only 2%',
      '95% recall is too low and misses too much fraud',
      'The model should be retrained to increase overall accuracy'
    ],
    explanation: 'High recall (95%) but low precision (2%) means the AI catches most fraud but generates overwhelming false positives. Reviewing 9,800 legitimate transactions to find 200 fraudulent ones is operationally expensive and error-prone (humans will miss fraud in noise). Trade-off tuning needed: accept slightly lower recall (e.g., 90%) to dramatically improve precision (e.g., 10-20%), reducing manual review burden.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'diagnostic',
    hashtags: ['#precision-recall-tradeoff', '#operational-cost', '#false-positives']
  },
  {
    uuid: randomUUID(),
    question: 'A company removed gender and race fields from AI training data to ensure fairness. Post-deployment, the AI still exhibits bias favoring certain demographics. What is the most likely explanation?',
    correctAnswer: 'Correlated features (ZIP code, names, schools) proxy for protected attributes',
    wrongAnswers: [
      'The AI is inherently biased and cannot be fixed',
      'Training data was corrupted during preprocessing',
      'Removing the fields was done incorrectly'
    ],
    explanation: 'Removing explicit protected attributes (gender, race) is insufficient because other features correlate with them. ZIP codes proxy for race/income, first names proxy for gender/ethnicity, school names proxy for socioeconomic status. AI learns these proxies. Fairness requires testing outcomes (disparate impact analysis), not just removing fields. Use fairness-constrained training or post-processing adjustments.',
    difficulty: 'HARD',
    category: 'Course Specific',
    questionType: 'concept',
    hashtags: ['#bias-mitigation', '#proxy-features', '#fairness-testing']
  },
  {
    uuid: randomUUID(),
    question: 'Your AI-powered customer support chatbot is live. Which monitoring metric is most critical for detecting when users lose trust in the AI?',
    correctAnswer: 'Escalation rate (how often users request human support)',
    wrongAnswers: [
      'API response time (latency)',
      'Total number of chatbot conversations',
      'Model prediction confidence scores'
    ],
    explanation: 'Escalation rate (users asking for human help) directly signals user frustration and AI failure. If escalations spike, users do not trust AI answers. Latency matters but does not indicate trust. Total conversations could stay high even if AI provides poor answers (users keep trying). Confidence scores are internal metrics that may not correlate with user satisfaction. Measure business impact, not just system metrics.',
    difficulty: 'MEDIUM',
    category: 'Course Specific',
    questionType: 'application',
    hashtags: ['#monitoring', '#business-metrics', '#user-trust']
  }
];

async function addLesson3Complete() {
  await connectDB();

  const course = await Course.findOne({ courseId: STAGE2_COURSE_ID });
  if (!course) throw new Error(`Course ${STAGE2_COURSE_ID} not found`);

  console.log('\n' + '='.repeat(70));
  console.log('CREATING LESSON 3: AI Best Practices');
  console.log('='.repeat(70) + '\n');

  // Create Lesson
  const lesson = await Lesson.create({
    lessonId: `${STAGE2_COURSE_ID}_L03`,
    courseId: course._id,
    dayNumber: 3,
    title: 'AI Best Practices - From Pilot to Production',
    content: lessonContent,
    emailSubject: 'Day 3: Master AI Production Best Practices',
    emailBody: `Welcome to Day 3 of AI Essentials!\n\nToday you'll master the essential practices for deploying, monitoring, and maintaining AI systems responsibly in production.\n\nYour deliverable: AI Production Readiness Checklist\n\nLet's dive in!\n\n${course.title} Team`,
    displayOrder: 1,
    language: 'en',
    pointsReward: 100,
    xpReward: 50,
    isActive: true
  });

  console.log(`✅ Lesson created: ${lesson.title}`);
  console.log(`   Lesson ID: ${lesson.lessonId}`);
  console.log(`   Content length: ${lessonContent.length} characters\n`);

  // Validate Lesson
  console.log('Validating lesson content...');
  const validation = enforceLessonQuality({
    lessonId: lesson.lessonId,
    dayNumber: lesson.dayNumber,
    language: 'en',
    title: lesson.title,
    content: lesson.content,
    emailSubject: lesson.emailSubject,
    emailBody: lesson.emailBody,
    pointsReward: 100,
    xpReward: 50,
    isActive: true,
    displayOrder: lesson.displayOrder
  }, 'STRICT');

  console.log(`   Quality Score: ${validation.validation.qualityScore}/100`);
  console.log(`   Status: ${validation.enforcement.action}`);
  console.log(`   Allowed: ${validation.allowed ? '✅ PASSED' : '❌ FAILED'}\n`);

  if (!validation.allowed) {
    console.error('❌ Lesson validation failed. Aborting.');
    process.exit(1);
  }

  // Add Quiz Questions
  console.log(`Adding ${quizQuestions.length} quiz questions...\n`);
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < quizQuestions.length; i++) {
    const q = quizQuestions[i];
    console.log(`Question ${i + 1}/${quizQuestions.length}: "${q.question.substring(0, 50)}..."`);

    const questionData = {
      ...q,
      lessonId: lesson.lessonId,
      courseId: course._id,
      isCourseSpecific: true,
      isActive: true,
      showCount: 0,
      correctCount: 0
    };

    const qValidation = enforceQuizQuestionQuality(questionData, {
      level: EnforcementLevel.STRICT,
      context: 'agent_generation',
      enforcedBy: 'agent',
      expectedLanguage: 'en',
    });

    if (qValidation.allowed) {
      console.log(`  ✅ PASSED (score: ${qValidation.validation.qualityScore}/100)`);
      await QuizQuestion.create(questionData);
      passed++;
    } else {
      console.log(`  ❌ BLOCKED: ${qValidation.enforcement.reason}`);
      failed++;
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`LESSON 3 COMPLETE`);
  console.log(`  Lesson: ✅ Created and validated (score: ${validation.validation.qualityScore}/100)`);
  console.log(`  Quiz: ${passed}/${quizQuestions.length} questions added`);
  if (failed > 0) console.log(`  ⚠️  ${failed} questions failed validation`);
  console.log('='.repeat(70) + '\n');

  process.exit(0);
}

addLesson3Complete().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
