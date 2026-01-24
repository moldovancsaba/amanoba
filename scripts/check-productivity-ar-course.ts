/**
 * Check PRODUCTIVITY_2026_AR course state
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

async function checkCourseState() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Check PRODUCTIVITY_2026_AR
    const course = await Course.findOne({ courseId: 'PRODUCTIVITY_2026_AR' }).lean();
    
    if (course) {
      console.log('🔍 Found PRODUCTIVITY_2026_AR:');
      console.log(`   Language: ${course.language}`);
      console.log(`   _id: ${course._id}`);
      console.log(`   Name: ${course.name}\n`);

      if (course.language !== 'ar') {
        console.log(`⚠️  MISMATCH: courseId says AR but language="${course.language}"\n`);
        console.log('🗑️  This course should be DELETED\n');
      }
    } else {
      console.log('❌ PRODUCTIVITY_2026_AR not found in database\n');
    }

    // List all courses
    const allCourses = await Course.find({}).lean();
    console.log(`\n📊 Total courses: ${allCourses.length}\n`);
    
    for (const c of allCourses) {
      const parts = (c.courseId || '').split('_');
      const suffix = parts[parts.length - 1].toLowerCase();
      const match = suffix === c.language ? '✅' : '❌';
      console.log(`${match} ${c.courseId} - language: ${c.language}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkCourseState();
