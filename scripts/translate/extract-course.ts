/**
 * Course Content Extraction Script
 * 
 * Extracts translatable content from English courses into structured JSON format.
 * Preserves markdown structure, metadata, and relationships for translation pipeline.
 */

import connectDB from '../../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../../app/lib/models';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface TranslationUnit {
  type: 'course_metadata' | 'lesson_content' | 'quiz_question';
  id: string;
  source_language: 'en';
  content: {
    name?: string;
    description?: string;
    title?: string;
    content?: string;
    emailSubject?: string;
    emailBody?: string;
    question?: string;
    correctAnswer?: string;
    wrongAnswers?: string[];
    explanation?: string;
  };
  metadata: {
    dayNumber?: number;
    lessonId?: string;
    courseId?: string;
    difficulty?: string;
    category?: string;
  };
}

interface ExtractedCourse {
  courseId: string;
  ccsId: string;
  source_language: 'en';
  units: TranslationUnit[];
  word_count: number;
  estimated_cost_usd: number;
}

async function extractCourse(courseId: string): Promise<ExtractedCourse> {
  await connectDB();

  // Load course
  const course = await Course.findOne({ courseId }).lean();
  if (!course) {
    throw new Error(`Course ${courseId} not found`);
  }

  console.log(`Extracting course: ${course.name}`);

  // Load lessons
  const lessons = await Lesson.find({ courseId: course._id })
    .sort({ dayNumber: 1 })
    .lean();

  console.log(`Found ${lessons.length} lessons`);

  // Load quiz questions
  const quizzes = await QuizQuestion.find({ 
    courseId: course._id,
    isCourseSpecific: true 
  }).lean();

  console.log(`Found ${quizzes.length} quiz questions`);

  // Build translation units
  const units: TranslationUnit[] = [];

  // Course metadata unit
  units.push({
    type: 'course_metadata',
    id: course._id.toString(),
    source_language: 'en',
    content: {
      name: course.name,
      description: course.description
    },
    metadata: { courseId }
  });

  // Lesson content units
  for (const lesson of lessons) {
    units.push({
      type: 'lesson_content',
      id: lesson._id.toString(),
      source_language: 'en',
      content: {
        title: lesson.title,
        content: lesson.content,
        emailSubject: lesson.emailSubject,
        emailBody: lesson.emailBody
      },
      metadata: {
        dayNumber: lesson.dayNumber,
        lessonId: lesson.lessonId,
        courseId
      }
    });
  }

  // Quiz question units
  for (const quiz of quizzes) {
    units.push({
      type: 'quiz_question',
      id: quiz._id.toString(),
      source_language: 'en',
      content: {
        question: quiz.question,
        correctAnswer: quiz.correctAnswer,
        wrongAnswers: quiz.wrongAnswers,
        explanation: quiz.explanation
      },
      metadata: {
        lessonId: quiz.lessonId,
        courseId,
        difficulty: quiz.difficulty,
        category: quiz.category
      }
    });
  }

  // Calculate metadata
  const wordCount = units.reduce((sum, unit) => {
    const text = Object.values(unit.content).join(' ');
    return sum + text.split(/\s+/).length;
  }, 0);

  const estimatedCost = (wordCount / 750) * 0.03; // $0.03 per 1000 words (GPT-4 estimate)

  return {
    courseId,
    ccsId: course.ccsId || courseId,
    source_language: 'en',
    units,
    word_count: wordCount,
    estimated_cost_usd: parseFloat(estimatedCost.toFixed(2))
  };
}

async function main() {
  const args = process.argv.slice(2);
  const courseIdIndex = args.indexOf('--courseId');
  const outputIndex = args.indexOf('--output');

  if (courseIdIndex === -1) {
    console.error('Usage: npm run translate:extract -- --courseId COURSE_ID [--output OUTPUT_PATH]');
    process.exit(1);
  }

  const courseId = args[courseIdIndex + 1];
  const outputPath = outputIndex !== -1 
    ? args[outputIndex + 1] 
    : join(process.cwd(), 'output', 'translate', `${courseId}.json`);

  try {
    console.log('='.repeat(70));
    console.log('Course Content Extraction');
    console.log('='.repeat(70));

    const extracted = await extractCourse(courseId);

    // Save to file
    writeFileSync(outputPath, JSON.stringify(extracted, null, 2));

    console.log('\n✓ Extraction Complete');
    console.log(`  Course: ${extracted.courseId}`);
    console.log(`  Units: ${extracted.units.length}`);
    console.log(`  Word Count: ${extracted.word_count.toLocaleString()}`);
    console.log(`  Estimated Translation Cost: $${extracted.estimated_cost_usd}`);
    console.log(`  Output: ${outputPath}`);
    console.log('='.repeat(70));

    process.exit(0);
  } catch (error) {
    console.error('❌ Extraction failed:', error);
    process.exit(1);
  }
}

main();
