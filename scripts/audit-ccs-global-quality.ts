/**
 * CCS Global Audit (Lessons + Quizzes) — Read-only
 *
 * Purpose:
 * - Discover all CCS families and their linked courses.
 * - Audit lessons and quizzes for ALL hard errors:
 *   - Lesson quality score < threshold
 *   - Lesson language integrity failures (content + email fields)
 *   - Quiz invalid questions (per-question validator)
 *   - Quiz duplicates (normalized question text; keep first by _id)
 *   - Quiz minimums not met (>=7 valid, >=5 application, 0 recall)
 *   - Generator capacity check (dry-run): can we generate enough valid additions?
 *
 * Outputs:
 * - JSON report in scripts/reports/
 * - One master tasklist in docs/tasklists/
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts
 *   npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --ccs PRODUCTIVITY_2026
 *   npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --course PRODUCTIVITY_2026_HU
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { CCS, Course, Lesson, QuizQuestion, QuizQuestionType, QuestionDifficulty } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';
import { validateQuestionQuality } from './question-quality-validator';
import { generateContentBasedQuestions } from './content-based-question-generator';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course');
const CCS_ID = getArgValue('--ccs');
const MIN_LESSON_SCORE = Number(getArgValue('--min-lesson-score') || '70');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const TASKLIST_DIR = getArgValue('--tasklist-dir') || join(process.cwd(), 'docs', 'tasklists');
const INCLUDE_INACTIVE = process.argv.includes('--include-inactive');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function normalizeQuestionText(text: string) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function mdEscape(s: string) {
  return String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
}

type LessonAudit = {
  dayNumber: number;
  lessonId: string;
  title: string;
  createdAt?: string;
  lessonQuality: ReturnType<typeof assessLessonQuality>;
  languageIntegrity: ReturnType<typeof validateLessonRecordLanguageIntegrity>;
  quiz: {
    totalExisting: number;
    validExisting: number;
    invalidExisting: number;
    application: number;
    critical: number;
    recall: number;
    duplicateSets: number;
    duplicatesToDelete: number;
    invalidSamples: Array<{ _id: string; firstError: string }>;
    duplicateSamples: Array<{ question: string; keepId: string; deleteIds: string[] }>;
  };
  generator: null | {
    attempted: boolean;
    generateTarget: number;
    validatedNew: number;
    canSatisfyMinimums: boolean;
    reasonIfNot: string | null;
  };
  errors: string[];
  warnings: string[];
};

function inferCcsIdForCourse(courseId: string, knownCcsIds: string[]) {
  const cid = String(courseId || '').toUpperCase();
  if (!cid) return null;
  // Prefer exact match (courseId === ccsId), then prefix match (CCS_ID_...).
  for (const ccsId of knownCcsIds) {
    if (cid === ccsId) return ccsId;
  }
  let best: string | null = null;
  for (const ccsId of knownCcsIds) {
    if (cid.startsWith(`${ccsId}_`)) {
      if (!best || ccsId.length > best.length) best = ccsId;
    }
  }
  return best;
}

async function main() {
  await connectDB();
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(TASKLIST_DIR, { recursive: true });

  const stamp = isoStamp();

  const ccsFilter: any = {};
  if (CCS_ID) ccsFilter.ccsId = String(CCS_ID).toUpperCase();
  const allCcs = await CCS.find(ccsFilter).sort({ createdAt: 1, _id: 1 }).lean();
  const knownCcsIds = allCcs.map(c => String(c.ccsId || '').toUpperCase()).filter(Boolean);
  const knownCcsSet = new Set(knownCcsIds);

  // Courses missing ccsId were excluded from the first iteration of this audit.
  // We include them by inference (courseId prefix match) and also create action items to link them.
  const missingCcsIdCoursesAll = await Course.find({
    $or: [{ ccsId: { $exists: false } }, { ccsId: null }, { ccsId: '' }],
  })
    .select('courseId name language durationDays isActive isDraft requiresPremium parentCourseId courseVariant ccsId createdAt updatedAt')
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  const missingCcsByInferred = new Map<string, any[]>();
  const missingCcsUnmapped: any[] = [];

  for (const c of missingCcsIdCoursesAll) {
    const inferred = inferCcsIdForCourse(String(c.courseId || ''), knownCcsIds);
    if (inferred && knownCcsSet.has(inferred)) {
      const bucket = missingCcsByInferred.get(inferred);
      if (bucket) bucket.push(c);
      else missingCcsByInferred.set(inferred, [c]);
    } else {
      missingCcsUnmapped.push(c);
    }
  }

  const report: any = {
    generatedAt: new Date().toISOString(),
    env: 'production (via .env.local)',
    filters: {
      ccsId: CCS_ID || null,
      courseId: COURSE_ID || null,
      minLessonScore: MIN_LESSON_SCORE,
      includeInactive: INCLUDE_INACTIVE,
    },
    totals: {
      ccsFamilies: allCcs.length,
      courses: 0,
      coursesMissingCcsId: missingCcsIdCoursesAll.length,
      coursesMissingCcsIdMappedToKnownCcs: Array.from(missingCcsByInferred.values()).reduce((n, xs) => n + xs.length, 0),
      coursesMissingCcsIdUnmapped: missingCcsUnmapped.length,
      lessons: 0,
      duplicateDayLessonGroups: 0,
      missingLessonDayEntries: 0,
      lessonsFailingLanguageIntegrity: 0,
      lessonsBelowQualityThreshold: 0,
      lessonsWithQuizErrors: 0,
      duplicateQuestionSets: 0,
      duplicateQuestionsToDelete: 0,
      invalidQuestions: 0,
      lessonsGeneratorInsufficient: 0,
    },
    ccs: [] as any[],
    coursesMissingCcsId: missingCcsIdCoursesAll.map(c => ({
      courseId: c.courseId,
      inferredCcsId: inferCcsIdForCourse(String(c.courseId || ''), knownCcsIds),
      language: c.language,
      isActive: Boolean(c.isActive),
      isDraft: Boolean(c.isDraft),
      parentCourseId: c.parentCourseId || null,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
    })),
  };

  const taskLines: string[] = [];

  taskLines.push(`# CCS Global Audit Tasklist`);
  taskLines.push(``);
  taskLines.push(`Generated: ${report.generatedAt}`);
  taskLines.push(`Environment: **production** (via \`.env.local\`)`);
  taskLines.push(`Mode: **READ-ONLY audit** (no DB writes in this step)`);
  taskLines.push(`Include inactive: **${INCLUDE_INACTIVE ? 'YES' : 'NO'}**`);
  taskLines.push(``);
  taskLines.push(`## Safety Rollback Plan (for future apply steps)`);
  taskLines.push(`- Lesson restore: \`npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json\``);
  taskLines.push(`- Quiz restore: \`npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json\``);
  taskLines.push(``);
  taskLines.push(`## How to Re-run This Audit`);
  taskLines.push(`- Full: \`npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts\``);
  taskLines.push(`- Full (include inactive): \`npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --include-inactive\``);
  taskLines.push(`- Single CCS: \`npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --ccs <CCS_ID>\``);
  taskLines.push(`- Single course: \`npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --course <COURSE_ID>\``);
  taskLines.push(``);

  if (missingCcsIdCoursesAll.length > 0 && !COURSE_ID) {
    taskLines.push(`## Global: Courses Missing \`ccsId\``);
    taskLines.push(
      `These courses were previously omitted from CCS-scoped audits. Link them by setting \`Course.ccsId\` to the correct CCS family (no quality difference for free/premium/shorts).`
    );
    taskLines.push(``);
    for (const c of missingCcsIdCoursesAll) {
      const inferred = inferCcsIdForCourse(String(c.courseId || ''), knownCcsIds);
      taskLines.push(
        `- [ ] \`${String(c.courseId)}\` (${String(c.language || '').toLowerCase()}) — missing ccsId` +
          (inferred ? ` (inferred: \`${inferred}\`)` : ` (inferred: none)`) +
          ``
      );
    }
    taskLines.push(``);
  }

  for (const ccs of allCcs) {
    const ccsId = String(ccs.ccsId || '').toUpperCase();

    const courseFilter: any = { ccsId };
    if (COURSE_ID) courseFilter.courseId = String(COURSE_ID).toUpperCase();

    // Include both parent courses and shorts; they are part of the CCS family.
    const courses = await Course.find(courseFilter)
      .select('courseId name language durationDays isActive isDraft requiresPremium parentCourseId courseVariant ccsId createdAt updatedAt')
      .sort({ parentCourseId: 1, language: 1, courseId: 1 })
      .lean();

    const inferredCourses = (missingCcsByInferred.get(ccsId) || []).filter((c: any) => {
      if (!COURSE_ID) return true;
      return String(c.courseId || '').toUpperCase() === String(COURSE_ID).toUpperCase();
    });

    const allCoursesForCcs = [...courses, ...inferredCourses].sort((a: any, b: any) =>
      String(a.courseId || '').localeCompare(String(b.courseId || ''))
    );

    report.totals.courses += allCoursesForCcs.length;

    const ccsRow: any = {
      ccsId,
      name: ccs.name || null,
      ideaPresent: Boolean(ccs.idea),
      outlinePresent: Boolean(ccs.outline),
      relatedDocumentsCount: Array.isArray(ccs.relatedDocuments) ? ccs.relatedDocuments.length : 0,
      courses: [] as any[],
    };

    taskLines.push(`## CCS: \`${ccsId}\``);
    taskLines.push(`- Courses: ${allCoursesForCcs.length}`);
    taskLines.push(``);

    for (const course of allCoursesForCcs) {
      const courseId = String(course.courseId || '');
      const language = String(course.language || '').toLowerCase();
      const isInferred = !String((course as any).ccsId || '').trim();

      const lessonFilter: any = { courseId: course._id };
      if (!INCLUDE_INACTIVE) lessonFilter.isActive = true;

      const lessons = await Lesson.find(lessonFilter)
        .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
        .select({ _id: 0, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, language: 1, createdAt: 1 })
        .lean();

      // Detect duplicate day lessons (do NOT hide them from the audit).
      const byDay = new Map<number, any[]>();
      for (const lesson of lessons) {
        const bucket = byDay.get(lesson.dayNumber);
        if (bucket) bucket.push(lesson);
        else byDay.set(lesson.dayNumber, [lesson]);
      }
      const duplicateDayGroups = Array.from(byDay.entries())
        .filter(([, xs]) => xs.length > 1)
        .map(([dayNumber, xs]) => ({
          dayNumber,
          lessons: xs.map(x => ({
            lessonId: x.lessonId,
            createdAt: x.createdAt ? new Date(x.createdAt).toISOString() : null,
            title: x.title || '',
          })),
        }))
        .sort((a, b) => a.dayNumber - b.dayNumber);

      report.totals.duplicateDayLessonGroups += duplicateDayGroups.length;

      // Detect missing lesson day entries for the course.
      const expectedDays = Number((course as any).durationDays || 30) || 30;
      const seenDays = new Set<number>(lessons.map(l => Number(l.dayNumber)).filter(n => Number.isFinite(n) && n > 0));
      const missingDays: number[] = [];
      for (let d = 1; d <= expectedDays; d++) {
        if (!seenDays.has(d)) missingDays.push(d);
      }
      report.totals.missingLessonDayEntries += missingDays.length;

      const lessonAudits: LessonAudit[] = [];
      for (const lesson of lessons) {
        report.totals.lessons++;

        const lessonQuality = assessLessonQuality({
          title: lesson.title || '',
          content: lesson.content || '',
          language: language || lesson.language || 'en',
        });

        const languageIntegrity = validateLessonRecordLanguageIntegrity({
          language,
          content: lesson.content || '',
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
        });

        if (!languageIntegrity.ok) report.totals.lessonsFailingLanguageIntegrity++;
        if (lessonQuality.score < MIN_LESSON_SCORE) report.totals.lessonsBelowQualityThreshold++;

        const questionFilter: any = {
          isCourseSpecific: true,
          courseId: course._id,
          lessonId: lesson.lessonId,
        };
        if (!INCLUDE_INACTIVE) questionFilter.isActive = true;

        const existingQuestions = await QuizQuestion.find(questionFilter)
          .sort({ _id: 1 })
          .lean();

        const validExisting: any[] = [];
        const invalidExisting: Array<{ q: any; firstError: string }> = [];
        for (const q of existingQuestions) {
          const v = validateQuestionQuality(
            q.question || '',
            q.options || [],
            (q.questionType as any) || 'application',
            (q.difficulty as any) || QuestionDifficulty.MEDIUM,
            language,
            lesson.title,
            lesson.content
          );
          if (v.isValid) validExisting.push(q);
          else invalidExisting.push({ q, firstError: v.errors[0] || 'Invalid question' });
        }

        const existingCounts = {
          totalExisting: existingQuestions.length,
          validExisting: validExisting.length,
          invalidExisting: invalidExisting.length,
          application: validExisting.filter(q => q.questionType === 'application').length,
          critical: validExisting.filter(q => q.questionType === 'critical-thinking').length,
          recall: validExisting.filter(q => q.questionType === 'recall').length,
        };

        const dupMap = new Map<string, any[]>();
        for (const q of existingQuestions) {
          const key = normalizeQuestionText(q.question);
          if (!key) continue;
          const bucket = dupMap.get(key);
          if (bucket) bucket.push(q);
          else dupMap.set(key, [q]);
        }
        let duplicateSets = 0;
        let duplicatesToDelete = 0;
        const duplicateSamples: Array<{ question: string; keepId: string; deleteIds: string[] }> = [];
        for (const group of dupMap.values()) {
          if (group.length <= 1) continue;
          duplicateSets++;
          group.sort((a, b) => String(a._id).localeCompare(String(b._id)));
          const keep = group[0];
          const del = group.slice(1);
          duplicatesToDelete += del.length;
          if (duplicateSamples.length < 3) {
            duplicateSamples.push({
              question: String(keep.question || '').slice(0, 160),
              keepId: String(keep._id),
              deleteIds: del.slice(0, 5).map(x => String(x._id)),
            });
          }
        }
        report.totals.duplicateQuestionSets += duplicateSets;
        report.totals.duplicateQuestionsToDelete += duplicatesToDelete;
        report.totals.invalidQuestions += invalidExisting.length;

        const errors: string[] = [];
        const warnings: string[] = [];

        if (!languageIntegrity.ok) errors.push('LESSON_LANGUAGE_INTEGRITY_FAIL');
        if (lessonQuality.score < MIN_LESSON_SCORE) errors.push('LESSON_QUALITY_BELOW_THRESHOLD');

        if (existingCounts.recall > 0) errors.push('QUIZ_RECALL_PRESENT');
        if (existingCounts.validExisting < 7) errors.push('QUIZ_TOO_FEW_VALID');
        if (existingCounts.application < 5) errors.push('QUIZ_TOO_FEW_APPLICATION');
        if (invalidExisting.length > 0) errors.push('QUIZ_HAS_INVALID_QUESTIONS');
        if (duplicateSets > 0) errors.push('QUIZ_HAS_DUPLICATES');

        // Generator capacity (dry-run) — only if lesson is eligible for quiz work.
        let generator: LessonAudit['generator'] = null;
        const eligibleForQuizWork = errors.filter(e => e.startsWith('LESSON_')).length === 0;
        if (eligibleForQuizWork && (existingCounts.validExisting < 7 || existingCounts.application < 5 || invalidExisting.length > 0)) {
          const neededTotal = Math.max(0, 7 - existingCounts.validExisting);
          const neededApp = Math.max(0, 5 - existingCounts.application);
          const generateTarget = Math.max(neededTotal, neededApp, 12);

          const generated = generateContentBasedQuestions(
            lesson.dayNumber,
            lesson.title || '',
            lesson.content || '',
            language,
            courseId,
            validExisting,
            generateTarget
          );

          const validatedNew: any[] = [];
          for (const q of generated) {
            const v = validateQuestionQuality(
              q.question,
              q.options,
              q.questionType as any,
              q.difficulty as any,
              language,
              lesson.title,
              lesson.content
            );
            if (v.isValid) validatedNew.push(q);
          }

          const existingKeys = new Set<string>(validExisting.map(q => normalizeQuestionText(q.question)));
          let remainingTotal = neededTotal;
          let remainingApp = neededApp;
          const additions: any[] = [];

          const tryAdd = (q: any) => {
            const key = normalizeQuestionText(q.question);
            if (!key) return false;
            if (existingKeys.has(key)) return false;
            existingKeys.add(key);
            additions.push(q);
            return true;
          };

          if (remainingApp > 0) {
            for (const q of validatedNew) {
              if (remainingApp <= 0) break;
              if (q.questionType !== QuizQuestionType.APPLICATION && q.questionType !== 'application') continue;
              if (tryAdd(q)) {
                remainingApp--;
                if (remainingTotal > 0) remainingTotal--;
              }
            }
          }
          if (remainingTotal > 0) {
            for (const q of validatedNew) {
              if (remainingTotal <= 0) break;
              if (tryAdd(q)) remainingTotal--;
            }
          }

          const combined = [
            ...validExisting.map(q => ({
              question: q.question,
              options: q.options,
              questionType: q.questionType,
              difficulty: q.difficulty,
            })),
            ...additions.map(q => ({
              question: q.question,
              options: q.options,
              questionType: q.questionType,
              difficulty: q.difficulty,
            })),
          ];

          // Use batch validator for final check.
          // We re-import minimal rules by calling validateQuestionQuality for each + count checks already above.
          const finalValidCount = combined.length;
          const finalAppCount = combined.filter(q => String(q.questionType) === 'application').length;
          const canSatisfyMinimums = finalValidCount >= 7 && finalAppCount >= 5;

          generator = {
            attempted: true,
            generateTarget,
            validatedNew: validatedNew.length,
            canSatisfyMinimums,
            reasonIfNot: canSatisfyMinimums
              ? null
              : `Could not reach minimums with generator output (finalValid=${finalValidCount}, finalApp=${finalAppCount}).`,
          };

          if (!canSatisfyMinimums) {
            errors.push('GENERATOR_INSUFFICIENT_TO_REACH_MINIMUMS');
            report.totals.lessonsGeneratorInsufficient++;
          }
        }

        if (errors.some(e => e.startsWith('QUIZ_') || e.startsWith('GENERATOR_'))) report.totals.lessonsWithQuizErrors++;

        lessonAudits.push({
          dayNumber: lesson.dayNumber,
          lessonId: lesson.lessonId,
          title: lesson.title || '',
          createdAt: lesson.createdAt ? new Date(lesson.createdAt).toISOString() : undefined,
          lessonQuality,
          languageIntegrity,
          quiz: {
            ...existingCounts,
            duplicateSets,
            duplicatesToDelete,
            invalidSamples: invalidExisting.slice(0, 3).map(x => ({ _id: String(x.q._id), firstError: x.firstError })),
            duplicateSamples,
          },
          generator,
          errors,
          warnings,
        });
      }

      const courseSummary = {
        courseId,
        name: course.name,
        language,
        isActive: Boolean(course.isActive),
        isDraft: Boolean(course.isDraft),
        requiresPremium: Boolean(course.requiresPremium),
        durationDays: course.durationDays,
        parentCourseId: course.parentCourseId || null,
        courseVariant: course.courseVariant || null,
        inferredCcsId: isInferred ? ccsId : null,
        duplicateDayGroups,
        missingDays,
        lessonsAudited: lessonAudits.length,
        lessonsWithErrors: lessonAudits.filter(l => l.errors.length > 0).length,
      };

      ccsRow.courses.push({ course: courseSummary, lessons: lessonAudits });

      taskLines.push(`### Course: \`${courseId}\` (${language})`);
      taskLines.push(
        `- active=${courseSummary.isActive} draft=${courseSummary.isDraft} premium=${courseSummary.requiresPremium} parentCourseId=${courseSummary.parentCourseId || '—'}` +
          (courseSummary.inferredCcsId ? ` (⚠️ course.ccsId missing; inferred \`${courseSummary.inferredCcsId}\`)` : ``)
      );

      if (missingDays.length > 0) {
        taskLines.push(``);
        taskLines.push(`**Missing lesson days (must be created)**`);
        taskLines.push(
          `- [ ] **${courseId}** is missing ${missingDays.length} day(s): ${missingDays.join(', ')} (expected ${expectedDays} days; found ${seenDays.size})`
        );
      }

      if (duplicateDayGroups.length > 0) {
        taskLines.push(``);
        taskLines.push(`**Duplicate day lessons (must resolve before final apply)**`);
        for (const g of duplicateDayGroups) {
          taskLines.push(
            `- [ ] **${courseId}** Day ${g.dayNumber} has ${g.lessons.length} lessons: ` +
              g.lessons.map(x => `\`${x.lessonId}\`` + (x.createdAt ? ` (${x.createdAt})` : '')).join(', ') +
              ` — decide keep/merge; deactivate extras; migrate quizzes if needed`
          );
        }
      }

      const courseTaskCount = lessonAudits.reduce((sum, l) => sum + (l.errors.length ? 1 : 0), 0);
      if (courseTaskCount === 0) {
        taskLines.push(`- ✅ No issues detected by this audit.`);
        taskLines.push(``);
        continue;
      }

      taskLines.push(``);
      taskLines.push(`**Action items**`);

      for (const l of lessonAudits.filter(x => x.errors.length > 0)) {
        const tags = l.errors.join(', ');
        const firstLangErr = l.languageIntegrity.errors?.[0] || null;
        const firstLessonIssue = l.lessonQuality.issues?.[0] || null;
        const invalidSample = l.quiz.invalidSamples?.[0] || null;
        const dupSample = l.quiz.duplicateSamples?.[0] || null;

        let recommendedNext = `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course ${courseId} --min-lesson-score ${MIN_LESSON_SCORE} --dry-run`;
        if (l.errors.includes('LESSON_LANGUAGE_INTEGRITY_FAIL')) {
          recommendedNext = `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course ${courseId}`;
        } else if (l.errors.includes('LESSON_QUALITY_BELOW_THRESHOLD')) {
          recommendedNext = `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course ${courseId} --min-score ${MIN_LESSON_SCORE}`;
        }

        taskLines.push(
          `- [ ] **${courseId}** Day ${l.dayNumber} (lessonId: \`${l.lessonId}\`) — ${mdEscape(l.title)}\n` +
            `  - Errors: ${tags}\n` +
            (firstLangErr ? `  - Language: ${mdEscape(firstLangErr)}\n` : '') +
            (firstLessonIssue ? `  - Lesson issue: ${mdEscape(firstLessonIssue)}\n` : '') +
            (invalidSample ? `  - Invalid question sample: \`${invalidSample._id}\` — ${mdEscape(invalidSample.firstError)}\n` : '') +
            (dupSample
              ? `  - Duplicate sample: keep \`${dupSample.keepId}\`, delete ${dupSample.deleteIds.map(id => `\`${id}\``).join(', ')}\n`
              : '') +
            (l.generator && l.generator.attempted
              ? `  - Generator check: validatedNew=${l.generator.validatedNew}, canSatisfyMinimums=${l.generator.canSatisfyMinimums}\n`
              : '') +
            `  - Next command: \`${recommendedNext}\`\n`
        );
      }

      taskLines.push(``);
    }

    report.ccs.push(ccsRow);
    taskLines.push(``);
  }

  const reportPath = join(OUT_DIR, `ccs-global-audit__${stamp}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  taskLines.unshift(`Report: \`${reportPath}\``);
  taskLines.unshift('');
  const tasklistPath = join(TASKLIST_DIR, `CCS_GLOBAL_AUDIT__${stamp}.md`);
  writeFileSync(tasklistPath, taskLines.join('\n'));

  console.log('✅ CCS global audit complete (read-only)');
  console.log(`- Report: ${reportPath}`);
  console.log(`- Tasklist: ${tasklistPath}`);
  console.log(JSON.stringify(report.totals, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
