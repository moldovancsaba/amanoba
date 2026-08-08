import connectDB from '../app/lib/mongodb';
import { Course, Brand } from '../app/lib/models';

async function create() {
  console.log('\n🚀 Creating AI Essentials - Stage 2\n');
  
  await connectDB();

  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) throw new Error('Brand not found');

  // Get parent course ObjectId
  const parentCourse = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  if (!parentCourse) throw new Error('Parent course AI_DUMMIES_1DAY_EN not found');
  
  console.log('✓ Parent course found:', parentCourse.name);

  // Delete if exists
  await Course.deleteOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });

  const course = await Course.create({
    courseId: 'AI_ESSENTIALS_3DAY_EN',
    brandId: brand._id,
    name: 'AI Essentials - 3 Days to Practical Skills',
    description: 'Build practical AI skills. Learn when to use AI, how to work with AI tools, and apply best practices.',
    language: 'en',
    difficulty: 'intermediate',
    estimatedHours: 6,
    category: 'artificial-intelligence',
    tags: ['AI', 'practical-skills', 'intermediate'],
    
    // Use ObjectId for prerequisite
    prerequisiteCourseIds: [parentCourse._id],
    
    // Progression metadata
    progressionMetadata: {
      stage: 2,
      parentCourseId: 'AI_DUMMIES_1DAY_EN',
      topicName: 'AI Foundations',
    },
    
    // Gamification config
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
    
    // Certification
    certification: {
      enabled: true,
      passThresholdPercent: 60,
      maxErrorPercent: null,
    },
    
    // 15 lessons
    lessons: Array.from({ length: 15 }, (_, i) => ({
      lessonId: `AI_ESS_L${i + 1}`,
      dayNumber: i + 1,
      title: `Day ${i + 1}: AI Essentials`,
      displayOrder: i + 1,
      content: `# Day ${i + 1}: AI Essentials\n\nPractical AI skills for day ${i + 1}.`,
      quizQuestions: [],
    })),
    
    lessonQuizPolicy: {
      enabled: true,
      questionsPerQuiz: 5,
      randomizeOrder: true,
      showCorrectAnswers: true,
    },
    
    published: true,
  });

  console.log(`\n✅ Created: ${course.name}`);
  console.log(`  ID: ${course.courseId}`);
  console.log(`  Lessons: ${course.lessons.length}`);
  console.log(`  Stage: ${course.progressionMetadata?.stage}`);
  console.log(`  Parent: ${course.progressionMetadata?.parentCourseId}`);
  console.log(`  Certification: Enabled (${course.certification.passThresholdPercent}% pass)`);
  console.log('\n📝 Next: Add 100 quiz questions for certification\n');
  
  process.exit(0);
}

create();
