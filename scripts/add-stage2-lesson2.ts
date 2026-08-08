import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import Lesson from '../app/lib/models/lesson';
import { readFileSync } from 'fs';
import { join } from 'path';

const STAGE2_COURSE_ID = 'AI_ESSENTIALS_3DAY_EN';

const lessonContent = readFileSync(join(__dirname, 'stage2-lesson2-content.md'), 'utf-8');

const selfCheck = {
  instruction: "Before moving on, verify your understanding of AI Tool Selection:",
  questions: [
    "Can you explain the difference between API, Managed Platform, and Custom Model approaches?",
    "Have you completed the AI Tool Selection Matrix for at least one scenario?",
    "Can you calculate a realistic TCO for an AI tool over 12 months?",
    "Do you understand why POCs with real data are critical?",
    "Can you list at least 3 factors beyond just features when selecting tools?"
  ]
};

async function addLesson2() {
  await connectDB();

  const course = await Course.findOne({ courseId: STAGE2_COURSE_ID });
  if (!course) {
    throw new Error(`Course ${STAGE2_COURSE_ID} not found`);
  }

  console.log('Creating Lesson 2: Working with AI Tools...');

  const lesson = await Lesson.create({
    lessonId: `${STAGE2_COURSE_ID}_L02`,
    courseId: course._id,
    dayNumber: 2,
    title: 'Working with AI Tools - Practical Implementation',
    content: lessonContent,
    emailSubject: 'Day 2: Master AI Tool Selection',
    emailBody: `Welcome to Day 2 of AI Essentials!\n\nToday you'll learn how to select, evaluate, and implement AI tools effectively—from simple APIs to custom models.\n\nYour deliverable: AI Tool Selection Matrix with cost-benefit analysis\n\nLet's dive in!\n\n${course.title} Team`,
    displayOrder: 1,
    language: 'en',
    pointsReward: 100,
    xpReward: 50,
    isActive: true
  });

  console.log(`✅ Lesson created: ${lesson.title}`);
  console.log(`   Lesson ID: ${lesson.lessonId}`);
  console.log(`   Content length: ${lessonContent.length} characters`);
  console.log(`   Self-check questions: ${selfCheck.questions.length}`);

  process.exit(0);
}

addLesson2().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
