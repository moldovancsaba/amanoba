/**
 * Audit Question Coverage - All Courses
 * 
 * Purpose: Identify which courses/lessons need questions
 * Goal: Understand the full scope of work needed
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

async function auditCoverage() {
  try {
    await connectDB();
    console.log(`📊 QUESTION COVERAGE AUDIT\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const courses = await Course.find({ isActive: true }).sort({ name: 1 }).lean();
    
    const courseNeeds: Array<{
      courseId: string;
      name: string;
      language: string;
      lessons: number;
      currentQuestions: number;
      neededQuestions: number;
      missingQuestions: number;
      lessonsWith0: number;
      lessonsWithLessThan7: number;
      lessonsWith7: number;
    }> = [];

    for (const course of courses) {
      const lessons = await Lesson.find({ courseId: course._id, isActive: true }).lean();
      const totalNeeded = lessons.length * 7;
      
      let totalCurrent = 0;
      let lessonsWith0 = 0;
      let lessonsWithLessThan7 = 0;
      let lessonsWith7 = 0;
      
      for (const lesson of lessons) {
        const questions = await QuizQuestion.find({ 
          lessonId: lesson.lessonId, 
          courseId: course._id, 
          isCourseSpecific: true, 
          isActive: true 
        }).lean();
        
        totalCurrent += questions.length;
        
        if (questions.length === 0) {
          lessonsWith0++;
        } else if (questions.length < 7) {
          lessonsWithLessThan7++;
        } else {
          lessonsWith7++;
        }
      }
      
      const missing = totalNeeded - totalCurrent;
      
      courseNeeds.push({
        courseId: course.courseId,
        name: course.name,
        language: course.language,
        lessons: lessons.length,
        currentQuestions: totalCurrent,
        neededQuestions: totalNeeded,
        missingQuestions: missing,
        lessonsWith0,
        lessonsWithLessThan7,
        lessonsWith7,
      });
    }

    // Sort by missing questions
    courseNeeds.sort((a, b) => b.missingQuestions - a.missingQuestions);

    console.log('Courses needing most work:\n');
    courseNeeds.forEach((c, i) => {
      if (c.missingQuestions > 0) {
        console.log(`${i + 1}. ${c.name} (${c.courseId}) [${c.language.toUpperCase()}]`);
        console.log(`   ${c.lessons} lessons`);
        console.log(`   Current: ${c.currentQuestions}/${c.neededQuestions} questions`);
        console.log(`   Missing: ${c.missingQuestions} questions`);
        console.log(`   Breakdown: ${c.lessonsWith7} with 7, ${c.lessonsWithLessThan7} with <7, ${c.lessonsWith0} with 0\n`);
      }
    });

    const totalMissing = courseNeeds.reduce((sum, c) => sum + c.missingQuestions, 0);
    const totalNeeded = courseNeeds.reduce((sum, c) => sum + c.neededQuestions, 0);
    const totalCurrent = courseNeeds.reduce((sum, c) => sum + c.currentQuestions, 0);

    console.log(`\n${'═'.repeat(70)}`);
    console.log(`📊 SYSTEM SUMMARY`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`Total courses: ${courses.length}`);
    console.log(`Total lessons: ${courseNeeds.reduce((sum, c) => sum + c.lessons, 0)}`);
    console.log(`Total questions needed: ${totalNeeded}`);
    console.log(`Total questions current: ${totalCurrent}`);
    console.log(`Total questions missing: ${totalMissing}`);
    console.log(`\n💡 This is the scope of work needed to reach 7 perfect questions per lesson\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

auditCoverage();
