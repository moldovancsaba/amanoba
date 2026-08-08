import connectDB from '../app/lib/mongodb';
import { Course, Brand } from '../app/lib/models';

async function create() {
  console.log('\n🚀 Creating AI Essentials - Stage 2\n');
  
  await connectDB();

  // Ensure brand exists
  let brand = await Brand.findOne({ brandId: 'amanoba' });
  if (!brand) {
    console.log('Creating brand...');
    brand = await Brand.create({
      brandId: 'amanoba',
      name: 'Amanoba',
      description: 'Unified Flexible Learning Platform',
      primaryColor: '#F59E0B',
      secondaryColor: '#0F172A',
      logoUrl: '/amanoba_logo.png',
      websiteUrl: 'https://www.amanoba.com',
    });
  }
  console.log('✓ Brand ready');

  // Delete if exists
  await Course.deleteOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });

  const course = await Course.create({
    courseId: 'AI_ESSENTIALS_3DAY_EN',
    brandId: brand._id,
    name: 'AI Essentials - 3 Days to Practical Skills',
    description: 'Build practical AI skills. Learn when to use AI, how to work with AI tools, and best practices.',
    language: 'en',
    difficulty: 'intermediate',
    estimatedHours: 6,
    category: 'artificial-intelligence',
    tags: ['AI', 'practical-skills', 'intermediate'],
    prerequisiteCourseIds: ['AI_DUMMIES_1DAY_EN'],
    progressionMetadata: {
      stage: 2,
      parentCourseId: 'AI_DUMMIES_1DAY_EN',
      topicName: 'AI Foundations',
    },
    certification: {
      enabled: true,
      passThresholdPercent: 60,
      maxErrorPercent: null,
    },
    lessons: Array.from({ length: 15 }, (_, i) => ({
      lessonId: `AI_ESS_L${i + 1}`,
      dayNumber: i + 1,
      title: `AI Essentials Day ${i + 1}`,
      displayOrder: i + 1,
      content: `# Day ${i + 1}: AI Essentials\n\nPractical content for day ${i + 1}.`,
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
  console.log(`  Prerequisites: ${course.prerequisiteCourseIds.join(', ')}`);
  console.log(`  Certification: Enabled`);
  console.log('\n📝 Next: Add quiz questions\n');
  
  process.exit(0);
}

create();
