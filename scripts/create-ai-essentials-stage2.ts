import connectDB from '../app/lib/mongodb';
import { Course, Brand } from '../app/lib/models';

async function create() {
  console.log('\n🚀 Creating AI Essentials - Stage 2\n');
  console.log('='.repeat(70));
  
  await connectDB();

  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) throw new Error('Brand not found');
  console.log('✓ Brand found');

  // Get parent course
  const parentCourse = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  if (!parentCourse) throw new Error('Parent course not found');
  console.log('✓ Parent course found:', parentCourse.name);

  // Delete if exists
  const existing = await Course.findOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });
  if (existing) {
    console.log('⚠️  Course exists, deleting...');
    await Course.deleteOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });
  }

  console.log('\n📚 Creating course...\n');

  const course = await Course.create({
    courseId: 'AI_ESSENTIALS_3DAY_EN',
    brandId: brand._id,
    name: 'AI Essentials - 3 Days to Practical Skills',
    description: 'Building on AI fundamentals, this 3-day course teaches practical AI skills: when to use AI, how to work with AI tools, and best practices for real-world applications.',
    language: 'en',
    durationDays: 15,
    
    // Gamification
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
    
    // Metadata
    metadata: {
      category: 'artificial-intelligence',
      difficulty: 'intermediate',
      estimatedHours: 6,
      tags: ['AI', 'practical-skills', 'intermediate', 'applications'],
    },
    
    // Prerequisites
    prerequisiteCourseIds: [parentCourse._id],
    prerequisiteEnforcement: 'soft',
    
    // Certification
    certification: {
      enabled: true,
      passThresholdPercent: 60,
      maxErrorPercent: null,
      requireAllLessonsCompleted: true,
      requireAllQuizzesPassed: false,
    },
    
    // Quiz policy
    lessonQuizPolicy: {
      enabled: true,
      required: false,
      questionCount: 5,
      shownAnswerCount: 4,
      maxWrongAllowed: 2,
      successThreshold: 60,
    },
    
    // Progressive generation metadata
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

  console.log('✅ Course created!');
  console.log(`\n  Name: ${course.name}`);
  console.log(`  ID: ${course.courseId}`);
  console.log(`  Duration: ${course.durationDays} days`);
  console.log(`  Difficulty: ${course.metadata?.difficulty}`);
  console.log(`  Prerequisites: ${course.prerequisiteCourseIds?.length || 0} courses`);
  console.log(`  Certification: ${course.certification?.enabled ? 'Enabled' : 'Disabled'} (${course.certification?.passThresholdPercent}% to pass)`);
  console.log(`  Progression Stage: ${course.progressionMetadata?.generationStage}`);
  console.log(`  Progression Type: ${course.progressionMetadata?.generationType}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📝 Next: Add lessons and quiz questions\n');
  
  process.exit(0);
}

create();
