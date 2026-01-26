/**
 * Process All Courses - Priority Order
 * 
 * Purpose: Process all courses in priority order (most missing questions first)
 * Goal: Reach 3122 perfect questions (446 lessons × 7)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

async function getCoursePriority() {
  await connectDB();
  
  const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
  
  const courseNeeds: Array<{
    courseId: string;
    name: string;
    language: string;
    lessons: number;
    currentQuestions: number;
    neededQuestions: number;
    missingQuestions: number;
  }> = [];

  for (const course of courses) {
    const lessons = await Lesson.find({ courseId: course._id, isActive: true }).lean();
    const totalNeeded = lessons.length * 7;
    
    let totalCurrent = 0;
    for (const lesson of lessons) {
      const questions = await QuizQuestion.find({ 
        lessonId: lesson.lessonId, 
        courseId: course._id, 
        isCourseSpecific: true, 
        isActive: true 
      }).lean();
      totalCurrent += questions.length;
    }
    
    const missing = totalNeeded - totalCurrent;
    
    if (missing > 0) {
      courseNeeds.push({
        courseId: course.courseId,
        name: course.name,
        language: course.language,
        lessons: lessons.length,
        currentQuestions: totalCurrent,
        neededQuestions: totalNeeded,
        missingQuestions: missing,
      });
    }
  }

  // Sort by missing questions (descending)
  courseNeeds.sort((a, b) => b.missingQuestions - a.missingQuestions);

  console.log('📋 COURSES TO PROCESS (Priority Order):\n');
  courseNeeds.forEach((c, i) => {
    console.log(`${i + 1}. ${c.name} (${c.courseId}) [${c.language.toUpperCase()}]`);
    console.log(`   ${c.lessons} lessons, ${c.currentQuestions}/${c.neededQuestions} questions, missing ${c.missingQuestions}\n`);
  });

  console.log(`\n💡 To process a course, run:`);
  console.log(`   npx tsx scripts/process-course-questions-generic.ts ${courseNeeds[0]?.courseId || 'COURSE_ID'}\n`);

  process.exit(0);
}

getCoursePriority();
