/**
 * PHASE 1, STEP 1.1: Audit Current Course Structure
 * 
 * Purpose: Understand current database state
 * - List all courses
 * - Show language distribution
 * - Identify mixed-language courses
 * - Count lessons per language per course
 * - Verify lesson patterns
 */

import connectDB from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';

interface CourseAudit {
  courseId: string;
  courseName: string;
  totalLessons: number;
  languagesInCourse: Set<string>;
  lessonsByLanguage: Record<string, number>;
  quizzesByLanguage: Record<string, number>;
  isMixedLanguage: boolean;
}

async function auditCourseStructure() {
  try {
    await connectDB();
    
    console.log('\n🔍 AUDITING COURSE STRUCTURE - PHASE 1, STEP 1.1\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Get all courses
    const courses = await Course.find({}).select('_id courseId title description');
    console.log(`📊 Found ${courses.length} total courses in database\n`);

    const auditResults: CourseAudit[] = [];
    let totalLessons = 0;
    let totalQuizzes = 0;

    // Audit each course
    for (const course of courses) {
      console.log(`\n📖 Course: ${course.courseId || course._id}`);
      
      // Get all lessons for this course
      const lessons = await Lesson.find({ courseId: course._id }).select('lessonId dayNumber');
      console.log(`   Lessons: ${lessons.length}`);

      if (lessons.length === 0) {
        console.log(`   ⚠️  No lessons found for this course`);
        continue;
      }

      // Analyze languages in this course
      const languagesInCourse = new Set<string>();
      const lessonsByLanguage: Record<string, number> = {};
      const quizzesByLanguage: Record<string, number> = {};

      for (const lesson of lessons) {
        // Extract language from lessonId (e.g., "PRODUCTIVITY_2026_HU_DAY_01" -> "HU")
        const match = lesson.lessonId?.match(/_([A-Z]{2})_DAY/);
        const lang = match ? match[1] : 'UNKNOWN';
        
        languagesInCourse.add(lang);
        lessonsByLanguage[lang] = (lessonsByLanguage[lang] || 0) + 1;

        // Count quizzes for this lesson
        const quizzesForLesson = await QuizQuestion.countDocuments({ lessonId: lesson.lessonId });
        quizzesByLanguage[lang] = (quizzesByLanguage[lang] || 0) + quizzesForLesson;
      }

      // Check if course is mixed language
      const isMixedLanguage = languagesInCourse.size > 1;
      
      console.log(`   Languages: ${Array.from(languagesInCourse).join(', ')}`);
      console.log(`   Mixed Language: ${isMixedLanguage ? '⚠️ YES' : '✅ NO (Single language)'}`);
      console.log(`   Lessons by Language:`);
      
      for (const [lang, count] of Object.entries(lessonsByLanguage)) {
        console.log(`     - ${lang}: ${count} lessons, ${quizzesByLanguage[lang] || 0} quizzes`);
      }

      auditResults.push({
        courseId: course.courseId || course._id.toString(),
        courseName: course.title || 'Unknown',
        totalLessons: lessons.length,
        languagesInCourse,
        lessonsByLanguage,
        quizzesByLanguage,
        isMixedLanguage,
      });

      totalLessons += lessons.length;
      totalQuizzes += Object.values(quizzesByLanguage).reduce((a, b) => a + b, 0);
    }

    // Summary Report
    console.log(`\n${'═'.repeat(60)}\n`);
    console.log('📊 AUDIT SUMMARY\n');

    console.log(`Total Courses: ${courses.length}`);
    console.log(`Total Lessons: ${totalLessons}`);
    console.log(`Total Quizzes: ${totalQuizzes}`);

    // Count mixed vs single language
    const mixedLangCourses = auditResults.filter(c => c.isMixedLanguage).length;
    const singleLangCourses = auditResults.filter(c => !c.isMixedLanguage).length;

    console.log(`\nCourse Language Distribution:`);
    console.log(`  ✅ Single Language: ${singleLangCourses}`);
    console.log(`  ⚠️  Mixed Language: ${mixedLangCourses}`);

    if (mixedLangCourses > 0) {
      console.log(`\n⚠️  MIXED LANGUAGE COURSES (REQUIRES SPLITTING):\n`);
      
      for (const course of auditResults.filter(c => c.isMixedLanguage)) {
        console.log(`  ${course.courseId}:`);
        for (const lang of course.languagesInCourse) {
          console.log(`    - ${lang}: ${course.lessonsByLanguage[lang]} lessons`);
        }
      }
    }

    // Language coverage
    const allLanguages = new Set<string>();
    for (const course of auditResults) {
      course.languagesInCourse.forEach(lang => allLanguages.add(lang));
    }

    console.log(`\nLanguages Across All Courses:`);
    console.log(`  Total: ${allLanguages.size}`);
    console.log(`  Languages: ${Array.from(allLanguages).sort().join(', ')}`);

    // Recommended actions
    console.log(`\n${'═'.repeat(60)}\n`);
    console.log('🔧 REQUIRED ACTIONS:\n');
    
    if (mixedLangCourses > 0) {
      console.log(`⚠️  CRITICAL: Found ${mixedLangCourses} mixed-language courses`);
      console.log(`   These must be split into language-specific courses`);
      console.log(`   Expected new courses after split: ~${totalLessons / 30} (if evenly distributed)\n`);
    }

    console.log(`Next Steps:`);
    console.log(`  1. Review: docs/2026-01-24_ARCHITECTURE_FIX_COURSE_LANGUAGE_SEPARATION.md`);
    console.log(`  2. Proceed: PHASE 1, STEP 1.2 (Review current code)`);
    console.log(`\n✅ AUDIT COMPLETE\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

auditCourseStructure();
