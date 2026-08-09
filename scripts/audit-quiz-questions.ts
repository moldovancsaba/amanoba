/**
 * Audit Quiz Questions for All Courses
 * 
 * Checks all published courses for sufficient quiz questions to support
 * lesson quizzes and final certification exams.
 */

import connectDB from '../app/lib/mongodb';
import { Course, QuizQuestion } from '../app/lib/models';

interface QuizIssue {
  courseId: string;
  name: string;
  language: string;
  current: number;
  needed: number;
  shortage: number;
}

(async () => {
  await connectDB();
  
  const courses = await Course.find({}).sort({ courseId: 1 });
  
  console.log('📊 ALL PUBLISHED COURSES - QUIZ QUESTION AUDIT');
  console.log('===============================================\n');
  
  const issues: QuizIssue[] = [];
  
  for (const course of courses) {
    const quizzes = await QuizQuestion.find({ courseId: course._id });
    const certEnabled = course.certification?.enabled;
    const passingScore = course.certification?.passThresholdPercent || 60;
    const lessonQuizCount = course.lessonQuizPolicy?.questionCount || 3;
    
    // Minimum needed: lesson quiz (3) + final exam (10 minimum for proper exam)
    const minNeeded = lessonQuizCount + 10;
    const status = quizzes.length >= minNeeded ? '✅' : '❌';
    
    console.log(`${status} ${course.courseId}`);
    console.log(`   Name: ${course.name}`);
    console.log(`   Language: ${course.language || 'en'}`);
    console.log(`   Quiz Questions: ${quizzes.length}`);
    console.log(`   Certification: ${certEnabled ? 'Enabled' : 'Disabled'} (${passingScore}% passing)`);
    console.log(`   Lesson Quiz: ${lessonQuizCount} questions per lesson`);
    console.log(`   Min Needed: ${minNeeded} (${lessonQuizCount} lesson + 10 exam)`);
    
    if (quizzes.length < minNeeded && certEnabled) {
      const shortage = minNeeded - quizzes.length;
      console.log(`   ⚠️  SHORTAGE: ${shortage} questions needed`);
      issues.push({
        courseId: course.courseId,
        name: course.name,
        language: course.language || 'en',
        current: quizzes.length,
        needed: minNeeded,
        shortage: shortage
      });
    }
    console.log('');
  }
  
  console.log('\n📋 SUMMARY');
  console.log('==========');
  console.log(`Total Courses: ${courses.length}`);
  console.log(`Courses with Issues: ${issues.length}`);
  console.log(`Courses OK: ${courses.length - issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n❌ COURSES WITH INSUFFICIENT QUIZ QUESTIONS:');
    console.log('============================================');
    issues.forEach(issue => {
      console.log(`- ${issue.courseId} (${issue.language}): ${issue.current}/${issue.needed} questions (need ${issue.shortage} more)`);
    });
  }
  
  process.exit(0);
})();
