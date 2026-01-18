/**
 * Force Create AI Course
 * 
 * What: Explicitly creates the AI_30_NAP course if it doesn't exist
 * Why: Debug tool to ensure course is created correctly
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course, Brand } from '../app/lib/models';

const COURSE_ID = 'AI_30_NAP';
const COURSE_NAME = 'AI 30 Nap – tematikus tanulási út';
const COURSE_DESCRIPTION = '30 napos, strukturált AI-kurzus, amely az alapoktól a haladó használatig vezet. Napi 10-15 perces leckékkel építsd be az AI-t a munkádba és a mindennapi életedbe.';

async function forceCreateCourse() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Check if course already exists
    const existing = await Course.findOne({ courseId: COURSE_ID });
    if (existing) {
      console.log(`✅ Course ${COURSE_ID} already exists:`);
      console.log(`   _id: ${existing._id}`);
      console.log(`   Name: ${existing.name}`);
      console.log(`   isActive: ${existing.isActive}`);
      console.log(`   brandId: ${existing.brandId}`);
      
      // Update it to ensure it's active
      existing.isActive = true;
      existing.name = COURSE_NAME;
      existing.description = COURSE_DESCRIPTION;
      await existing.save();
      console.log(`\n✅ Course updated and saved`);
      await mongoose.disconnect();
      return;
    }

    // Get or create brand
    let brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      brand = await Brand.create({
        name: 'Amanoba',
        slug: 'amanoba',
        displayName: 'Amanoba',
        description: 'Unified Learning Platform',
        logo: '/AMANOBA.png',
        themeColors: {
          primary: '#FAB908',
          secondary: '#2D2D2D',
          accent: '#FAB908'
        },
        allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
        supportedLanguages: ['hu', 'en'],
        defaultLanguage: 'hu',
        isActive: true
      });
      console.log('✅ Brand created');
    } else {
      console.log(`✅ Using existing brand: ${brand.name}`);
    }

    // Create course explicitly
    const course = new Course({
      courseId: COURSE_ID,
      name: COURSE_NAME,
      description: COURSE_DESCRIPTION,
      language: 'hu',
      durationDays: 30,
      isActive: true,
      requiresPremium: false,
      brandId: brand._id,
      pointsConfig: {
        completionPoints: 1000,
        lessonPoints: 50,
        perfectCourseBonus: 500
      },
      xpConfig: {
        completionXP: 500,
        lessonXP: 25
      },
      metadata: {
        category: 'ai',
        difficulty: 'beginner',
        estimatedHours: 7.5,
        tags: ['ai', 'productivity', 'workflows', 'business'],
        instructor: 'Amanoba'
      }
    });

    await course.save();
    console.log(`\n✅ Course ${COURSE_ID} created successfully!`);
    console.log(`   _id: ${course._id}`);
    console.log(`   Name: ${course.name}`);
    console.log(`   isActive: ${course.isActive}`);
    console.log(`   brandId: ${course.brandId}`);

    // Verify it was saved
    const verify = await Course.findOne({ courseId: COURSE_ID });
    if (verify) {
      console.log(`\n✅ Verification: Course found in database`);
    } else {
      console.log(`\n❌ Verification failed: Course not found after save!`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

forceCreateCourse();
