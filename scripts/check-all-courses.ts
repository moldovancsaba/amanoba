/**
 * Check All Courses in Database
 * 
 * What: Lists all courses in the database and checks their structure
 * Why: Debug tool to find inconsistencies in course storage
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course, Lesson, Brand } from '../app/lib/models';

async function checkAllCourses() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get all courses
    const courses = await Course.find({}).lean();
    console.log(`📊 Found ${courses.length} total courses in database\n`);

    if (courses.length === 0) {
      console.log('❌ No courses found in database!');
      console.log('\n💡 Solution: Run the seed script:');
      console.log('   npm run seed:ai-course');
      await mongoose.disconnect();
      return;
    }

    // Check each course
    for (const course of courses) {
      console.log('─'.repeat(60));
      console.log(`\n📚 Course: ${course.courseId || 'NO COURSE ID'}`);
      console.log(`   Name: ${course.name || 'NO NAME'}`);
      console.log(`   _id: ${course._id}`);
      console.log(`   Language: ${course.language || 'NO LANGUAGE'}`);
      console.log(`   isActive: ${course.isActive}`);
      console.log(`   requiresPremium: ${course.requiresPremium}`);
      console.log(`   durationDays: ${course.durationDays || 'NO DURATION'}`);
      console.log(`   brandId: ${course.brandId || 'NO BRAND ID'}`);
      console.log(`   createdAt: ${course.createdAt || 'NO DATE'}`);
      console.log(`   updatedAt: ${course.updatedAt || 'NO DATE'}`);

      // Check if brandId is valid
      if (course.brandId) {
        try {
          const brand = await Brand.findById(course.brandId).lean();
          if (brand) {
            console.log(`   Brand: ${brand.name} (${brand.slug})`);
          } else {
            console.log(`   ⚠️  Brand ID exists but brand not found!`);
          }
        } catch (err) {
          console.log(`   ⚠️  Invalid brandId format`);
        }
      }

      // Check lessons
      const lessonCount = await Lesson.countDocuments({ courseId: course._id });
      console.log(`   Lessons: ${lessonCount}`);

      // Check if course has all required fields
      const issues: string[] = [];
      if (!course.courseId) issues.push('Missing courseId');
      if (!course.name) issues.push('Missing name');
      if (!course.description) issues.push('Missing description');
      if (!course.language) issues.push('Missing language');
      if (!course.brandId) issues.push('Missing brandId');
      if (course.isActive === undefined) issues.push('Missing isActive');
      if (course.requiresPremium === undefined) issues.push('Missing requiresPremium');

      if (issues.length > 0) {
        console.log(`   ⚠️  Issues: ${issues.join(', ')}`);
      } else {
        console.log(`   ✅ All required fields present`);
      }
    }

    console.log('\n' + '─'.repeat(60));
    console.log('\n🔍 Checking admin API query...');
    
    // Simulate admin API query
    const adminQuery = {};
    const adminCourses = await Course.find(adminQuery).sort({ createdAt: -1 }).lean();
    console.log(`   Admin API would return: ${adminCourses.length} courses`);
    
    if (adminCourses.length !== courses.length) {
      console.log(`   ⚠️  Mismatch! Total courses: ${courses.length}, Admin query: ${adminCourses.length}`);
    }

    // Check for AI_30_NAP specifically
    const aiCourse = courses.find(c => c.courseId === 'AI_30_NAP');
    if (aiCourse) {
      console.log(`\n✅ AI_30_NAP course found:`);
      console.log(`   _id: ${aiCourse._id}`);
      console.log(`   isActive: ${aiCourse.isActive}`);
      console.log(`   Would appear in admin: ${aiCourse.isActive !== undefined ? 'YES' : 'NO'}`);
    } else {
      console.log(`\n❌ AI_30_NAP course NOT FOUND in database!`);
      console.log(`\n💡 Solution: Run the seed script:`);
      console.log(`   npm run seed:ai-course`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkAllCourses();
