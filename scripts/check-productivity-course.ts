/**
 * Check Productivity 2026 Course Status
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

async function check() {
  await connectDB();
  console.log('✅ Connected to MongoDB\n');

  // Check Productivity 2026 courses
  const courses = await Course.find({ courseId: /^PRODUCTIVITY_2026_/ }).sort({ language: 1 });
  console.log(`Found ${courses.length} Productivity 2026 courses:\n`);

  let totalLessons = 0;
  let totalQuizzes = 0;

  for (const course of courses) {
    const lessons = await Lesson.find({ courseId: course._id }).sort({ dayNumber: 1 });
    const lessonCount = lessons.length;
    totalLessons += lessonCount;

    let quizCount = 0;
    for (const lesson of lessons) {
      const quizzes = await QuizQuestion.find({ lessonId: lesson.lessonId });
      quizCount += quizzes.length;
    }
    totalQuizzes += quizCount;

    console.log(`  ${course.language.toUpperCase().padEnd(3)}: ${lessonCount.toString().padStart(2)} lessons, ${quizCount.toString().padStart(3)} quiz questions`);
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Courses: ${courses.length}`);
  console.log(`   Total Lessons: ${totalLessons} (expected: ${courses.length * 30} for full course)`);
  console.log(`   Total Quiz Questions: ${totalQuizzes}`);
  console.log(`\n⚠️  Status: Only Lesson 1 (Day 1) has been seeded.`);
  console.log(`   The course blueprint shows 30 days, but only Day 1 is in the database.`);

  process.exit(0);
}

check().catch((error) => {
  console.error('❌ Check failed:', error);
  process.exit(1);
});
