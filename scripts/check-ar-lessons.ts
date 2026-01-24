/**
 * Check if Arabic lessons exist
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

async function checkArLesson() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get PRODUCTIVITY_2026_AR course
    const course = await Course.findOne({ courseId: 'PRODUCTIVITY_2026_AR' }).lean();
    
    if (!course) {
      console.log('❌ Course not found');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`📚 Course: ${course.courseId}`);
    console.log(`   _id: ${course._id}`);
    console.log(`   Language: ${course.language}\n`);

    // Check day 1 lesson
    const lesson = await Lesson.findOne({
      courseId: course._id,
      dayNumber: 1
    }).lean();

    if (lesson) {
      console.log(`✅ Day 1 Lesson Found:`);
      console.log(`   Title: ${lesson.title}`);
      console.log(`   Content length: ${lesson.content?.length || 0} chars`);
      console.log(`   Has quiz: ${!!lesson.quizConfig?.enabled}`);
      console.log(`   Unlocked: ${lesson.isUnlocked}`);
    } else {
      console.log(`❌ Day 1 Lesson NOT FOUND\n`);
    }

    // Count all lessons
    const totalLessons = await Lesson.countDocuments({ courseId: course._id });
    console.log(`\n📊 Total lessons for this course: ${totalLessons}`);

    // List first 5 lessons
    const lessons = await Lesson.find({ courseId: course._id })
      .sort({ dayNumber: 1 })
      .limit(5)
      .lean();

    console.log(`\nFirst 5 lessons:`);
    for (const l of lessons) {
      console.log(`  Day ${l.dayNumber}: ${l.title}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkArLesson();
