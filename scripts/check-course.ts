/**
 * Check Course in Database
 * 
 * What: Verifies if AI_30_NAP course exists and is active
 * Why: Debug tool to check course status
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'AI_30_NAP';

async function checkCourse() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Check if course exists
    const course = await Course.findOne({ courseId: COURSE_ID }).lean();
    
    if (!course) {
      console.log(`❌ Course ${COURSE_ID} NOT FOUND in database`);
      console.log('\n💡 Solution: Run the seed script:');
      console.log('   npm run seed:ai-course');
      return;
    }

    console.log(`\n✅ Course ${COURSE_ID} found in database`);
    console.log('\n📋 Course Details:');
    console.log(`   Name: ${course.name}`);
    console.log(`   Language: ${course.language}`);
    console.log(`   isActive: ${course.isActive}`);
    console.log(`   requiresPremium: ${course.requiresPremium}`);
    console.log(`   durationDays: ${course.durationDays}`);
    console.log(`   brandId: ${course.brandId}`);

    // Check lessons
    const lessonCount = await Lesson.countDocuments({ courseId: course._id });
    console.log(`\n📚 Lessons: ${lessonCount}/30`);

    if (lessonCount < 30) {
      console.log(`⚠️  Warning: Expected 30 lessons, found ${lessonCount}`);
    }

    // Check if course is active
    if (!course.isActive) {
      console.log('\n❌ Course is NOT ACTIVE');
      console.log('\n💡 Solution: Activate the course in admin panel or update directly:');
      console.log(`   Update course ${COURSE_ID} and set isActive: true`);
    } else {
      console.log('\n✅ Course is ACTIVE and should be visible to students');
    }

    // Check brand
    if (!course.brandId) {
      console.log('\n⚠️  Warning: Course has no brandId');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCourse();
