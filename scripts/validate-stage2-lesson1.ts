import connectDB from '../app/lib/mongodb';
import Lesson from '../app/lib/models/lesson';
import { enforceLessonQuality } from '../app/lib/content-quality/enforcement';
import { enforceQuizQuestionQuality } from '../app/lib/validators/content-standards';

const LESSON_ID = 'AI_ESSENTIALS_3DAY_EN_L01';

async function validateLesson1() {
  await connectDB();

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) {
    throw new Error(`Lesson ${LESSON_ID} not found`);
  }

  console.log(`\n📋 Validating Lesson: ${lesson.title}\n`);

  // Validate lesson content
  console.log('1️⃣ LESSON CONTENT VALIDATION');
  const lessonValidation = enforceLessonQuality(
    {
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
    },
    'STRICT'
  );

  console.log(`   Status: ${lessonValidation.enforcement.action}`);
  console.log(`   Quality Score: ${lessonValidation.validation.qualityScore}/100`);
  console.log(`   Allowed: ${lessonValidation.allowed}`);
  
  if (lessonValidation.validation.warnings && lessonValidation.validation.warnings.length > 0) {
    console.log(`   Warnings: ${lessonValidation.validation.warnings.length}`);
    lessonValidation.validation.warnings.forEach((w: string) => console.log(`      - ${w}`));
  }
  if (lessonValidation.validation.errors && lessonValidation.validation.errors.length > 0) {
    console.log(`   Errors: ${lessonValidation.validation.errors.length}`);
    lessonValidation.validation.errors.forEach((e: string) => console.log(`      - ${e}`));
  }

  // Validate quiz questions
  console.log('\n2️⃣ QUIZ QUESTION VALIDATION');
  const questions = lesson.quizQuestions || [];
  console.log(`   Total questions: ${questions.length}`);

  let passedQuestions = 0;
  const failedQuestions: Array<{question: string; score: number; status: string}> = [];

  for (const q of questions) {
    const validation = enforceQuizQuestionQuality(q as any, 'STRICT');
    if (validation.status === 'valid') {
      passedQuestions++;
    } else {
      failedQuestions.push({
        question: (q as any).questionText?.substring(0, 60) + '...',
        score: validation.details?.qualityScore?.score || 0,
        status: validation.status
      });
    }
  }

  console.log(`   ✅ Passed: ${passedQuestions}/${questions.length}`);
  
  if (failedQuestions.length > 0) {
    console.log(`   ❌ Failed: ${failedQuestions.length}`);
    failedQuestions.forEach((f: {question: string; score: number; status: string}) => {
      console.log(`      "${f.question}" - Score: ${f.score}, Status: ${f.status}`);
    });
  }

  // Summary
  console.log('\n📊 VALIDATION SUMMARY');
  console.log(`   Lesson: ${lessonValidation.allowed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Quiz: ${failedQuestions.length === 0 ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Overall: ${lessonValidation.allowed && failedQuestions.length === 0 ? '✅ READY FOR PRODUCTION' : '❌ NEEDS FIXES'}\n`);

  process.exit(lessonValidation.allowed && failedQuestions.length === 0 ? 0 : 1);
}

validateLesson1().catch((error) => {
  console.error('❌ Validation error:', error);
  process.exit(1);
});
