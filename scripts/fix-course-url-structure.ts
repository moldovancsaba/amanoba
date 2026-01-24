/**
 * Fix Course URL Structure
 * 
 * Identifies and deletes courses with mismatched language/suffix
 * Ensures courseId suffix matches course.language field
 * 
 * Example:
 * - WRONG: courseId="PRODUCTIVITY_2026_AR", language="hu"
 * - CORRECT: courseId="PRODUCTIVITY_2026_AR", language="ar"
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

async function fixCourseURLStructure() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Language code mappings
    const languageMap: Record<string, string> = {
      'hu': 'hu', 'en': 'en', 'ar': 'ar', 'ru': 'ru',
      'pt': 'pt', 'vi': 'vi', 'id': 'id', 'hi': 'hi',
      'tr': 'tr', 'bg': 'bg', 'pl': 'pl'
    };

    // Get all courses
    const allCourses = await Course.find({}).lean();
    console.log(`Total courses in database: ${allCourses.length}\n`);

    const wrongURLCourses: any[] = [];
    const correctURLCourses: any[] = [];

    // Analyze each course
    for (const course of allCourses) {
      // Extract suffix from courseId (last part after underscore)
      const parts = (course.courseId || '').split('_');
      const suffix = parts[parts.length - 1].toLowerCase();
      const courseLanguage = course.language;

      // Check if suffix matches language
      if (suffix !== courseLanguage) {
        wrongURLCourses.push({
          courseId: course.courseId,
          _id: course._id,
          language: courseLanguage,
          suffix: suffix,
          url: `/${courseLanguage}/courses/${course.courseId}`
        });
      } else {
        correctURLCourses.push({
          courseId: course.courseId,
          language: courseLanguage,
          url: `/${courseLanguage}/courses/${course.courseId}`
        });
      }
    }

    console.log(`════════════════════════════════════════════════════\n`);
    console.log(`✅ CORRECT URL STRUCTURE: ${correctURLCourses.length}`);
    console.log(`════════════════════════════════════════════════════\n`);

    for (const course of correctURLCourses.slice(0, 10)) {
      console.log(`✅ ${course.courseId}`);
      console.log(`   Language: ${course.language}`);
      console.log(`   URL: ${course.url}\n`);
    }

    if (correctURLCourses.length > 10) {
      console.log(`   ... and ${correctURLCourses.length - 10} more\n`);
    }

    console.log(`════════════════════════════════════════════════════\n`);
    console.log(`❌ WRONG URL STRUCTURE: ${wrongURLCourses.length}`);
    console.log(`════════════════════════════════════════════════════\n`);

    for (const course of wrongURLCourses) {
      console.log(`❌ ${course.courseId}`);
      console.log(`   Language: ${course.language} (Suffix: ${course.suffix})`);
      console.log(`   Current URL: /${course.language}/courses/${course.courseId}`);
      console.log(`   SHOULD BE: /${course.suffix}/courses/${course.courseId}\n`);
    }

    if (wrongURLCourses.length > 0) {
      console.log(`════════════════════════════════════════════════════\n`);
      console.log(`🚨 DELETING ${wrongURLCourses.length} COURSES WITH WRONG STRUCTURE\n`);

      for (const course of wrongURLCourses) {
        // Delete all lessons for this course
        const lessonsDeleted = await Lesson.deleteMany({ courseId: course._id });
        console.log(`   Deleted ${lessonsDeleted.deletedCount} lessons`);

        // Delete all quiz questions for this course
        const questionsDeleted = await QuizQuestion.deleteMany({ courseId: course._id });
        console.log(`   Deleted ${questionsDeleted.deletedCount} quiz questions`);

        // Delete the course
        await Course.deleteOne({ _id: course._id });
        
        console.log(`🗑️  Deleted: ${course.courseId}\n`);
      }

      console.log(`✅ Cleanup complete!\n`);
      console.log(`Deleted courses: ${wrongURLCourses.length}`);
      console.log(`Remaining courses: ${correctURLCourses.length}\n`);
      
      console.log(`NEXT STEPS:`);
      console.log(`1. Verify seed scripts use correct language in courseId suffix`);
      console.log(`2. Re-seed courses with proper structure`);
      console.log(`3. Verify all courses have matching language/suffix\n`);
    } else {
      console.log(`✅ All courses have correct URL structure!\n`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixCourseURLStructure();
