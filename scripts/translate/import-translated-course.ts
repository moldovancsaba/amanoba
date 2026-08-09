/**
 * Import Translated Course Script
 * 
 * Imports validated translated course JSON into MongoDB.
 * Creates course variant linked to original CCS (Canonical Course Spec).
 */

import { readFileSync } from 'fs';
import connectDB from '../../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, CCS } from '../../app/lib/models';
import { logger } from '../../app/lib/logger';

interface TranslationUnit {
  type: 'course_metadata' | 'lesson_content' | 'quiz_question';
  id: string;
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

interface TranslatedCourse {
  courseId: string;
  ccsId: string;
  target_language: string;
  units: TranslationUnit[];
  word_count: number;
  estimated_cost_usd: number;
  translation_metadata: {
    translated_at: string;
    translation_method: string;
    glossary_terms_used: number;
    total_units: number;
  };
}

async function importTranslatedCourse(translatedJSON: TranslatedCourse, dryRun: boolean = false) {
  await connectDB();

  console.log('='.repeat(70));
  console.log('Importing Translated Course');
  console.log('='.repeat(70));
  console.log(`Course ID: ${translatedJSON.courseId}`);
  console.log(`CCS ID: ${translatedJSON.ccsId}`);
  console.log(`Language: ${translatedJSON.target_language}`);
  console.log(`Dry Run: ${dryRun ? 'YES (no database changes)' : 'NO'}`);
  console.log('='.repeat(70));

  // 1. Find or create CCS
  let ccs = await CCS.findOne({ ccsId: translatedJSON.ccsId });
  
  if (!ccs) {
    console.log(`\n❌ CCS not found: ${translatedJSON.ccsId}`);
    console.log('   Create the original English course first, then translate.');
    process.exit(1);
  }

  console.log(`\n✓ Found CCS: ${ccs.name}`);

  // 2. Extract course metadata unit
  const courseMetadataUnit = translatedJSON.units.find(u => u.type === 'course_metadata');
  if (!courseMetadataUnit) {
    throw new Error('Course metadata unit not found in translation');
  }

  // 3. Check if course variant already exists
  const existingCourse = await Course.findOne({ courseId: translatedJSON.courseId });
  if (existingCourse) {
    console.log(`\n⚠️  Course variant already exists: ${translatedJSON.courseId}`);
    console.log('   Skipping course creation. Delete existing course first if you want to reimport.');
    return;
  }

  // 4. Find original English course to copy configuration
  const originalCourse = await Course.findOne({ ccsId: translatedJSON.ccsId }).lean();
  if (!originalCourse) {
    console.log(`\n❌ Original course not found for CCS: ${translatedJSON.ccsId}`);
    process.exit(1);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] Would create course:');
    console.log(`  courseId: ${translatedJSON.courseId}`);
    console.log(`  name: ${courseMetadataUnit.content.name}`);
    console.log(`  language: ${translatedJSON.target_language}`);
    console.log(`  ccsId: ${translatedJSON.ccsId}`);
  } else {
    // 5. Create course variant (copy config from original)
    const course = await Course.create({
      courseId: translatedJSON.courseId,
      ccsId: translatedJSON.ccsId,
      name: courseMetadataUnit.content.name || 'Untitled Course',
      description: courseMetadataUnit.content.description || '',
      language: translatedJSON.target_language,
      thumbnail: originalCourse.thumbnail || 'https://i.ibb.co/placeholder.png',
      durationDays: translatedJSON.units.filter(u => u.type === 'lesson_content').length,
      brandId: originalCourse.brandId,
      pointsConfig: originalCourse.pointsConfig,
      xpConfig: originalCourse.xpConfig,
      isActive: originalCourse.isActive,
      discussionEnabled: originalCourse.discussionEnabled || false,
      leaderboardEnabled: originalCourse.leaderboardEnabled || false,
      studyGroupsEnabled: originalCourse.studyGroupsEnabled || false,
      requiresPremium: originalCourse.requiresPremium || false,
      price: originalCourse.price || { currency: 'USD' },
      prerequisiteCourseIds: originalCourse.prerequisiteCourseIds || [],
      prerequisiteEnforcement: originalCourse.prerequisiteEnforcement || 'hard',
      lessonQuizPolicy: originalCourse.lessonQuizPolicy,
      certification: originalCourse.certification,
      metadata: originalCourse.metadata,
    });

    console.log(`\n✓ Created course: ${course.courseId}`);

    // 6. Import lessons
    const lessonUnits = translatedJSON.units.filter(u => u.type === 'lesson_content');
    console.log(`\nImporting ${lessonUnits.length} lessons...`);

    for (const unit of lessonUnits) {
      await Lesson.create({
        courseId: course._id,
        lessonId: `${translatedJSON.courseId}_DAY_${unit.metadata.dayNumber}`,
        dayNumber: unit.metadata.dayNumber || 1,
        title: unit.content.title || 'Untitled Lesson',
        content: unit.content.content || '',
        emailSubject: unit.content.emailSubject || unit.content.title || 'Lesson',
        emailBody: unit.content.emailBody || unit.content.content || '',
        pointsReward: 100,
        xpReward: 50,
        isActive: true,
        displayOrder: unit.metadata.dayNumber || 1,
      });
      
      console.log(`  ✓ Lesson ${unit.metadata.dayNumber}: ${unit.content.title}`);
    }

    // 7. Import quiz questions
    const quizUnits = translatedJSON.units.filter(u => u.type === 'quiz_question');
    console.log(`\nImporting ${quizUnits.length} quiz questions...`);

    let quizImportedCount = 0;
    let quizSkippedCount = 0;

    for (const unit of quizUnits) {
      try {
        await QuizQuestion.create({
          uuid: `${translatedJSON.courseId}_QUIZ_${Math.random().toString(36).substr(2, 9)}`,
          courseId: course._id,
          lessonId: unit.metadata.lessonId,
          question: unit.content.question || '',
          correctAnswer: unit.content.correctAnswer || '',
          wrongAnswers: unit.content.wrongAnswers || [],
          explanation: unit.content.explanation || '',
          difficulty: unit.metadata.difficulty || 'MEDIUM',
          category: unit.metadata.category || 'Course Specific',
          questionType: 'application',
          hashtags: [],
          isCourseSpecific: true,
          isActive: true,
          showCount: 0,
          correctCount: 0,
        });
        
        quizImportedCount++;
        console.log(`  ✓ Quiz: ${unit.content.question?.substring(0, 50)}...`);
      } catch (error) {
        quizSkippedCount++;
        console.log(`  ⚠ Skipped quiz (validation error): ${unit.content.question?.substring(0, 50)}...`);
      }
    }

    // 8. Validate quiz question count
    const lessonQuizCount = course.lessonQuizPolicy?.questionCount || 3;
    const minRequired = lessonQuizCount + 10;
    const actualCount = quizImportedCount;

    console.log('\n' + '='.repeat(70));
    console.log('Quiz Question Validation');
    console.log('='.repeat(70));
    console.log(`Lesson Quiz Policy: ${lessonQuizCount} questions per lesson`);
    console.log(`Minimum Required: ${minRequired} (${lessonQuizCount} lesson + 10 exam)`);
    console.log(`Actual Imported: ${actualCount}`);
    
    if (actualCount < minRequired) {
      const shortage = minRequired - actualCount;
      console.log(`\n❌ INSUFFICIENT QUIZ QUESTIONS`);
      console.log(`   Shortage: ${shortage} questions needed`);
      console.log(`   Formula: lessonQuizPolicy.questionCount + 10`);
      console.log(`   Why: Lesson quizzes need ${lessonQuizCount}, final exam needs 10 minimum`);
      console.log(`\n⚠️  WARNING: Course imported but lacks sufficient quiz questions for proper assessment.`);
      console.log(`   Generate ${shortage} more questions before publishing this course.`);
    } else {
      console.log(`\n✅ Quiz question count is sufficient`);
    }

    // 9. Update CCS with language variant tracking
    try {
      await ccs.addLanguageVariant(
        newCourse.courseId,
        translatedJSON.target_language,
        'translation-agent'
      );
      console.log(`\n✓ Added ${translatedJSON.target_language} variant to CCS ${ccs.ccsId}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.warn(`\n⚠️  Failed to update CCS with variant: ${errMsg}`);
      console.warn(`   The course was created successfully but CCS tracking may be incomplete.`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('Import Complete');
    console.log('='.repeat(70));
    console.log(`  Course: ${course.name}`);
    console.log(`  Course ID: ${course.courseId}`);
    console.log(`  Language: ${translatedJSON.target_language}`);
    console.log(`  Lessons: ${lessonUnits.length}`);
    console.log(`  Quiz Questions: ${quizImportedCount}/${quizUnits.length} (${quizSkippedCount} skipped)`);
    console.log('='.repeat(70));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const dryRunIndex = args.indexOf('--dry-run');

  if (inputIndex === -1) {
    console.error('Usage: npm run translate:import -- --input TRANSLATED_JSON [--dry-run]');
    console.error('Example: npm run translate:import -- --input output/translated/AI_DUMMIES_1DAY_ES.json');
    process.exit(1);
  }

  const inputPath = args[inputIndex + 1];
  const dryRun = dryRunIndex !== -1;

  try {
    const translatedJSON: TranslatedCourse = JSON.parse(readFileSync(inputPath, 'utf-8'));
    await importTranslatedCourse(translatedJSON, dryRun);
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
