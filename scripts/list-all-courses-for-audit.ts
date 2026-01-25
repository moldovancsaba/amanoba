/**
 * List All Courses for Content Quality Audit
 * 
 * What: Lists all courses with metadata needed for the quality audit
 * Why: Provides course inventory ordered by creation date
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

async function listAllCourses() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get all courses, sorted by creation date (oldest first)
    const courses = await Course.find({})
      .sort({ createdAt: 1 })
      .lean();

    console.log(`📊 Found ${courses.length} total courses\n`);
    console.log('='.repeat(80));
    console.log('COURSE INVENTORY (Ordered by Creation Date - Oldest First)');
    console.log('='.repeat(80));
    console.log();

    let courseNumber = 1;
    for (const course of courses) {
      const lessonCount = await Lesson.countDocuments({ courseId: course._id });
      
      console.log(`${courseNumber}. ${course.courseId || 'NO_COURSE_ID'}`);
      console.log(`   Name: ${course.name || 'NO_NAME'}`);
      console.log(`   Language: ${course.language || 'NO_LANGUAGE'}`);
      console.log(`   Created: ${course.createdAt || 'NO_DATE'}`);
      console.log(`   Updated: ${course.updatedAt || 'NO_DATE'}`);
      console.log(`   Lessons: ${lessonCount}`);
      console.log(`   Active: ${course.isActive ? '✅' : '❌'}`);
      console.log(`   Premium: ${course.requiresPremium ? '💰' : '🆓'}`);
      console.log();
      
      courseNumber++;
    }

    console.log('='.repeat(80));
    console.log(`Total: ${courses.length} courses`);
    console.log('='.repeat(80));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

listAllCourses();
