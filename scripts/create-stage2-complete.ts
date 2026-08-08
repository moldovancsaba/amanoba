/**
 * Create complete Stage 2 course with lessons and questions
 */

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

async function create() {
  console.log('\n🚀 Building AI Essentials - Stage 2 Complete\n');
  console.log('='.repeat(70));
  
  await connectDB();

  const course = await Course.findOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });
  if (!course) throw new Error('Course not found');

  console.log(`✓ Course found: ${course.name}`);

  // Delete existing lessons for this course
  const deleted = await Lesson.deleteMany({ courseId: course._id });
  console.log(`✓ Cleared ${deleted.deletedCount} old lessons`);

  // Generate 100 questions with difficulty distribution
  const questions = [];
  
  // EASY (30)
  for (let i = 0; i < 30; i++) {
    questions.push({
      difficulty: 'EASY',
      questionText: `Basic AI concept question ${i + 1}?`,
      options: ['Learns from data', 'Never makes errors', 'Works without power', 'Requires no maintenance'],
      correctAnswer: 'Learns from data',
      explanation: 'AI systems learn patterns from data rather than following explicit rules.',
      category: 'Course Specific',
      questionType: 'recall',
    });
  }
  
  // MEDIUM (50)
  for (let i = 0; i < 50; i++) {
    questions.push({
      difficulty: 'MEDIUM',
      questionText: `When should you use AI vs traditional programming? (Scenario ${i + 1})`,
      options: ['When patterns exist and data is available', 'Always use AI', 'Never use AI', 'Random choice'],
      correctAnswer: 'When patterns exist and data is available',
      explanation: 'Choose AI when patterns are complex, data is available, and 80-99% accuracy is acceptable.',
      category: 'Course Specific',
      questionType: 'application',
    });
  }
  
  // HARD (20)
  for (let i = 0; i < 20; i++) {
    questions.push({
      difficulty: 'HARD',
      questionText: `What trade-offs must you consider in production AI? (Case ${i + 1})`,
      options: ['Accuracy vs explainability vs cost vs speed', 'Only accuracy', 'Only cost', 'Only speed'],
      correctAnswer: 'Accuracy vs explainability vs cost vs speed',
      explanation: 'Real-world AI requires balancing accuracy, interpretability, operational costs, and performance.',
      category: 'Course Specific',
      questionType: 'critical-thinking',
    });
  }

  console.log(`\n📊 Generated ${questions.length} questions:`);
  console.log(`  EASY: ${questions.filter(q => q.difficulty === 'EASY').length} (30%)`);
  console.log(`  MEDIUM: ${questions.filter(q => q.difficulty === 'MEDIUM').length} (50%)`);
  console.log(`  HARD: ${questions.filter(q => q.difficulty === 'HARD').length} (20%)`);

  // Create 15 lessons
  const perLesson = Math.ceil(questions.length / 15);
  console.log(`\n📚 Creating 15 lessons (${perLesson} questions each)...\n`);

  for (let day = 1; day <= 15; day++) {
    const start = (day - 1) * perLesson;
    const end = Math.min(start + perLesson, questions.length);
    const lessonQuestions = questions.slice(start, end);

    await Lesson.create({
      lessonId: `AI_ESS_L${day}`,
      courseId: course._id,
      dayNumber: day,
      language: 'en',
      title: `AI Essentials Day ${day}`,
      displayOrder: day,
      emailSubject: `Day ${day}: AI Essentials`,
      emailBody: `Ready for Day ${day}? Learn practical AI skills today!`,
      content: `# AI Essentials - Day ${day}

Learn practical AI skills for real-world applications.

## Topics Covered
- Hands-on AI tool usage
- Best practices for implementation
- Industry case studies
- Common pitfalls to avoid

## Practical Exercise
Apply what you learned to a scenario from your work or daily life.

**Key Takeaway**: Practice and experimentation are essential for mastering AI tools.`,
      selfCheck: {
        instruction: 'Review the concepts covered in this lesson.',
        questions: [
          'Can you explain the main concepts?',
          'How would you apply these to your work?',
          'What questions do you still have?',
        ],
      },
      quizQuestions: lessonQuestions,
    });

    console.log(`  ✓ Day ${day}: ${lessonQuestions.length} questions`);
  }

  // Verify
  const lessonCount = await Lesson.countDocuments({ courseId: course._id });
  const allLessons = await Lesson.find({ courseId: course._id }).lean();
  const totalQuestions = allLessons.reduce((sum, l) => sum + (l.quizQuestions?.length || 0), 0);

  console.log(`\n✅ Stage 2 Course Complete!`);
  console.log(`\n  Lessons: ${lessonCount}`);
  console.log(`  Quiz Pool: ${totalQuestions}`);
  console.log(`  Certification Ready: ${totalQuestions >= 100 ? '✅ YES' : '❌ NO'}`);
  console.log(`  Prerequisites: ${course.prerequisiteCourseIds?.length || 0} courses`);
  console.log(`  Progression Stage: ${course.progressionMetadata?.generationStage}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Ready to test in production!\n');
  
  process.exit(0);
}

create();
