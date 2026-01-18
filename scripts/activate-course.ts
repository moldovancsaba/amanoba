/**
 * Activate Course
 * 
 * What: Ensures AI_30_NAP course is active and visible
 * Why: Fix course visibility issues
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Course } from '../app/lib/models';

const COURSE_ID = 'AI_30_NAP';

async function activateCourse() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    // Find the course
    const course = await Course.findOne({ courseId: COURSE_ID });

    if (!course) {
      console.log(`❌ Course ${COURSE_ID} NOT FOUND`);
      console.log('\n💡 Run the seed script first:');
      console.log('   npm run seed:ai-course');
      await mongoose.disconnect();
      return;
    }

    console.log(`📋 Current Course Status:`);
    console.log(`   isActive: ${course.isActive}`);
    console.log(`   requiresPremium: ${course.requiresPremium}`);
    console.log(`   language: ${course.language}`);
    console.log('');

    // Ensure course is active
    if (!course.isActive) {
      course.isActive = true;
      await course.save();
      console.log('✅ Course activated (isActive set to true)');
    } else {
      console.log('✅ Course is already active');
    }

    // Ensure course is not premium-only
    if (course.requiresPremium) {
      course.requiresPremium = false;
      await course.save();
      console.log('✅ Course set to free (requiresPremium set to false)');
    } else {
      console.log('✅ Course is already free');
    }

    // Verify the course can be found by the API query
    const apiQuery = { isActive: true };
    const foundCourses = await Course.find(apiQuery)
      .select('courseId name isActive requiresPremium language')
      .lean();

    console.log(`\n🔍 API Query Test (isActive: true):`);
    console.log(`   Found ${foundCourses.length} courses`);
    
    const found = foundCourses.find(c => c.courseId === COURSE_ID);
    if (found) {
      console.log(`   ✅ ${COURSE_ID} is visible via API`);
    } else {
      console.log(`   ❌ ${COURSE_ID} is NOT visible via API`);
    }

    console.log('\n📊 All Active Courses:');
    foundCourses.forEach(c => {
      console.log(`   - ${c.courseId}: ${c.name} (${c.language})`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    console.log('\n💡 If course still not visible, check:');
    console.log('   1. API route is working: /api/courses?status=active');
    console.log('   2. Frontend is calling the API correctly');
    console.log('   3. No language filter is applied');
    console.log('   4. Browser console for errors');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

activateCourse();
