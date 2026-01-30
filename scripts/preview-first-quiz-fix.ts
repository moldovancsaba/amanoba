/**
 * Preview the first lesson (in createdAt/course order) that needs fixing.
 *
 * This is a read-only inspector to support a "chief editor" workflow:
 * - walk all active courses
 * - find the first lesson that fails lesson gates OR needs quiz fixes
 * - show a concrete preview (including the first new candidate question if quiz work is needed)
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/preview-first-quiz-fix.ts --min-lesson-score 70
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';
import { generateContentBasedQuestions } from './content-based-question-generator';
import { validateQuestionQuality } from './question-quality-validator';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const MIN_LESSON_SCORE = Number(getArgValue('--min-lesson-score') || '70');

function normalizeQuestionText(text: string) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function dedupeValidQuestions(validExisting: any[]) {
  const byText = new Map<string, any[]>();
  for (const q of validExisting) {
    const key = normalizeQuestionText(q.question);
    if (!key) continue;
    const bucket = byText.get(key);
    if (bucket) bucket.push(q);
    else byText.set(key, [q]);
  }

  const duplicatesToDelete: any[] = [];
  const deduped: any[] = [];
  for (const [, qs] of byText) {
    qs.sort((a, b) => String(a._id).localeCompare(String(b._id)));
    if (qs.length > 0) deduped.push(qs[0]);
    if (qs.length > 1) duplicatesToDelete.push(...qs.slice(1));
  }
  return { dedupedValidExisting: deduped, duplicatesToDelete };
}

async function main() {
  await connectDB();

  const courses = await Course.find({ isActive: true }).sort({ createdAt: 1, _id: 1 }).lean();
  for (const course of courses) {
    const lessons = await Lesson.find({ courseId: course._id, isActive: true })
      .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
      .select({ lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, language: 1, createdAt: 1 })
      .lean();

    // Deduplicate by dayNumber (keep oldest record per day)
    const byDay = new Map<number, any>();
    for (const lesson of lessons) {
      const existing = byDay.get(lesson.dayNumber);
      if (!existing) {
        byDay.set(lesson.dayNumber, lesson);
        continue;
      }
      const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
      const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
      if (b < a) byDay.set(lesson.dayNumber, lesson);
    }

    for (const lesson of byDay.values()) {
      const lessonQuality = assessLessonQuality({
        title: lesson.title || '',
        content: lesson.content || '',
        language: course.language || lesson.language || 'en',
      });

      const languageIntegrity = validateLessonRecordLanguageIntegrity({
        language: String(course.language || lesson.language || 'en'),
        content: lesson.content || '',
        emailSubject: (lesson as any).emailSubject || null,
        emailBody: (lesson as any).emailBody || null,
      });

      if (!languageIntegrity.ok) {
        console.log('FIRST_FIX: LESSON_LANGUAGE_INTEGRITY');
        console.log(
          JSON.stringify(
            {
              courseId: course.courseId,
              courseLanguage: course.language,
              lessonId: lesson.lessonId,
              dayNumber: lesson.dayNumber,
              title: lesson.title,
              firstError: languageIntegrity.errors[0] || null,
              example: languageIntegrity.findings?.[0]?.snippet || null,
            },
            null,
            2
          )
        );
        process.exit(0);
      }

      if (lessonQuality.score < MIN_LESSON_SCORE) {
        console.log('FIRST_FIX: LESSON_QUALITY');
        console.log(
          JSON.stringify(
            {
              courseId: course.courseId,
              courseLanguage: course.language,
              lessonId: lesson.lessonId,
              dayNumber: lesson.dayNumber,
              title: lesson.title,
              score: lessonQuality.score,
              issues: lessonQuality.issues,
              signals: lessonQuality.signals,
              refineTemplate: lessonQuality.refineTemplate,
            },
            null,
            2
          )
        );
        process.exit(0);
      }

      const existing = await QuizQuestion.find({
        isActive: true,
        isCourseSpecific: true,
        courseId: course._id,
        lessonId: lesson.lessonId,
      })
        .sort({ _id: 1 })
        .lean();

      const validExisting: any[] = [];
      const invalidExisting: any[] = [];
      for (const q of existing) {
        const v = validateQuestionQuality(
          q.question || '',
          q.options || [],
          (q.questionType as any) || 'application',
          (q.difficulty as any) || 'MEDIUM',
          course.language,
          lesson.title,
          lesson.content
        );
        if (v.isValid) validExisting.push(q);
        else invalidExisting.push({ q, errors: v.errors });
      }

      const { dedupedValidExisting, duplicatesToDelete } = dedupeValidQuestions(validExisting);

      const counts = {
        totalExisting: existing.length,
        validExisting: dedupedValidExisting.length,
        invalidExisting: invalidExisting.length,
        application: dedupedValidExisting.filter(q => q.questionType === 'application').length,
        critical: dedupedValidExisting.filter(q => q.questionType === 'critical-thinking').length,
        recall: dedupedValidExisting.filter(q => q.questionType === 'recall').length,
        duplicatesToDelete: duplicatesToDelete.length,
      };

      const needsFix =
        counts.recall > 0 ||
        counts.validExisting < 7 ||
        counts.application < 5 ||
        counts.invalidExisting > 0 ||
        counts.duplicatesToDelete > 0;

      if (!needsFix) continue;

      const neededTotal = Math.max(0, 7 - counts.validExisting);
      const neededApp = Math.max(0, 5 - counts.application);

      // Preview the *first* candidate question we would add (one-by-one workflow).
      let previewCandidate: any = null;
      if (neededTotal > 0 || neededApp > 0) {
        const candidates = generateContentBasedQuestions(
          lesson.dayNumber,
          lesson.title || '',
          lesson.content || '',
          course.language,
          course.courseId,
          dedupedValidExisting,
          50,
          { seed: `${course.courseId}::${lesson.lessonId}::preview` }
        );

        const existingKeys = new Set<string>(dedupedValidExisting.map((q: any) => normalizeQuestionText(q.question)));

        for (const c of candidates) {
          const v = validateQuestionQuality(
            c.question,
            c.options,
            c.questionType as any,
            c.difficulty as any,
            course.language,
            lesson.title,
            lesson.content
          );
          if (!v.isValid) continue;
          if (neededApp > 0 && c.questionType !== 'application') continue;
          const key = normalizeQuestionText(c.question);
          if (!key || existingKeys.has(key)) continue;
          previewCandidate = c;
          break;
        }
      }

      console.log('FIRST_FIX: QUIZ');
      console.log(
        JSON.stringify(
          {
            courseId: course.courseId,
            courseLanguage: course.language,
            lessonId: lesson.lessonId,
            dayNumber: lesson.dayNumber,
            title: lesson.title,
            lessonQualityScore: lessonQuality.score,
            quizCounts: counts,
            quizNeeds: { neededTotal, neededApp },
            wouldDelete: {
              invalidExisting: invalidExisting.slice(0, 3).map(x => ({
                question: x.q.question,
                firstError: x.errors?.[0] || null,
              })),
              duplicatesToDelete: duplicatesToDelete.slice(0, 3).map(q => ({ question: q.question })),
            },
            firstCandidateToAdd: previewCandidate,
          },
          null,
          2
        )
      );
      process.exit(0);
    }
  }

  console.log('✅ No fixes needed under current gates.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

