/**
 * Create Stage 2: AI Essentials - 3 Days to Practical Skills
 * WITH PROPER QUALITY STANDARDS
 */

import connectDB from '../app/lib/mongodb';
import { Course, Brand } from '../app/lib/models';

async function createStage2() {
  console.log('\n🎓 Creating Stage 2: AI Essentials (Course Structure)\n');
  console.log('='.repeat(70));
  
  await connectDB();

  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) throw new Error('Brand not found');

  const parentCourse = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  if (!parentCourse) throw new Error('Parent course not found');

  // Delete if exists
  await Course.deleteOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });

  // Select thumbnail (different from Stage 1)
  const thumbnail = 'https://i.ibb.co/DDpm7xg5/9-D06-E9-E9-5421-4000-8170-EA863-BB10-E5-B.png';

  const course = await Course.create({
    courseId: 'AI_ESSENTIALS_3DAY_EN',
    brandId: brand._id,
    name: 'AI Essentials - 3 Days to Practical Skills',
    description: 'Building on AI fundamentals, learn practical skills for using AI effectively. Understand when to use AI, how to evaluate AI tools, and best practices for real-world applications.',
    language: 'en',
    thumbnail,
    durationDays: 3,
    
    xpConfig: {
      lessonXP: 50,
      quizXP: 25,
      completionXP: 500,
    },
    pointsConfig: {
      lessonPoints: 10,
      quizPoints: 5,
      completionPoints: 100,
    },
    
    metadata: {
      category: 'artificial-intelligence',
      difficulty: 'intermediate',
      estimatedHours: 3,
      tags: ['AI', 'practical-skills', 'intermediate'],
    },
    
    prerequisiteCourseIds: [parentCourse._id],
    prerequisiteEnforcement: 'soft',
    
    certification: {
      enabled: true,
      passThresholdPercent: 60,
      maxErrorPercent: null,
      requireAllLessonsCompleted: true,
      requireAllQuizzesPassed: false,
    },
    
    lessonQuizPolicy: {
      enabled: true,
      required: false,
      questionCount: 5,
      shownAnswerCount: 4,
      maxWrongAllowed: 2,
      successThreshold: 60,
    },
    
    progressionMetadata: {
      generationType: 'progressive',
      generationStage: 2,
      topicName: 'AI Foundations',
      isProgressionRoot: false,
      previousStageCourseId: 'AI_DUMMIES_1DAY_EN',
    },
    
    isActive: true,
    published: true,
  });

  console.log(`✅ Course created: ${course.name}`);
  console.log(`  ID: ${course.courseId}`);
  console.log(`  Thumbnail: Set`);
  console.log(`  Prerequisites: ${course.prerequisiteCourseIds.length}`);
  console.log(`  Certification: Enabled`);
  console.log(`\n📝 Next: Add 3 high-quality lessons with full 5W1H structure\n`);
  
  process.exit(0);
}

createStage2();
