import connectDB from '../app/lib/mongodb';
import { Course, Brand } from '../app/lib/models';

async function create() {
  console.log('\n🚀 Creating AI Essentials - Stage 2\n');
  
  await connectDB();

  const brand = await Brand.findOne({ brandId: 'amanoba' });
  if (!brand) throw new Error('Brand not found');

  // Delete if exists
  await Course.deleteOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });

  // Simplified lessons for now - will add full content via separate script
  const lessons = Array.from({ length: 15 }, (_, i) => ({
    lessonId: `AI_ESS_L${i + 1}`,
    dayNumber: i + 1,
    title: `Lesson ${i + 1} - AI Essentials Day ${i + 1}`,
    displayOrder: i + 1,
    content: `# Lesson ${i + 1}\n\nContent for day ${i + 1} will be added.`,
    quizQuestions: [],
  }));

  const course = await Course.create({
    courseId: 'AI_ESSENTIALS_3DAY_EN',
    brandId: brand._id,
    name: 'AI Essentials - 3 Days to Practical Skills',
    description: 'Build practical AI skills. Learn when to use AI, how to work with AI tools, and best practices for real-world applications.',
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
    lessons,
    lessonQuizPolicy: {
      enabled: true,
      questionsPerQuiz: 5,
      randomizeOrder: true,
      showCorrectAnswers: true,
    },
    published: true,
  });

  console.log(`✅ Created: ${course.name}`);
  console.log(`  ID: ${course.courseId}`);
  console.log(`  Lessons: ${course.lessons.length}`);
  console.log(`  Prerequisites: ${course.prerequisiteCourseIds[0]}`);
  
  process.exit(0);
}

create();
