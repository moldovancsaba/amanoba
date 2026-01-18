/**
 * Test Course API
 * 
 * What: Tests the course API to see what courses are returned
 * Why: Debug why AI_30_NAP course is not showing
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Course } from '../app/lib/models';

async function testAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    // Test the same query the API uses
    const query: Record<string, unknown> = {
      isActive: true, // Default to active only
    };

    console.log('🔍 Query:', JSON.stringify(query, null, 2));
    console.log('');

    const courses = await Course.find(query)
      .select('courseId name description language thumbnail isActive requiresPremium durationDays pointsConfig xpConfig')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📊 Found ${courses.length} active courses:\n`);

    if (courses.length === 0) {
      console.log('❌ No active courses found!');
      console.log('\n💡 Checking all courses (including inactive):');
      const allCourses = await Course.find({}).select('courseId name isActive language').lean();
      console.log(`   Total courses: ${allCourses.length}`);
      allCourses.forEach(c => {
        console.log(`   - ${c.courseId}: isActive=${c.isActive}, language=${c.language}`);
      });
    } else {
      courses.forEach(course => {
        console.log(`✅ ${course.courseId}`);
        console.log(`   Name: ${course.name}`);
        console.log(`   Language: ${course.language}`);
        console.log(`   isActive: ${course.isActive}`);
        console.log(`   requiresPremium: ${course.requiresPremium}`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAPI();
