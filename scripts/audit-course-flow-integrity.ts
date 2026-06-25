/**
 * Course Flow Integrity Audit
 *
 * Checks learner-flow regressions across all course types:
 * - standard courses
 * - short/child courses using selectedLessonIds
 * - certification/final-exam courses with custom exam sizes
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/audit-course-flow-integrity.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { calculateCurrentLessonDay, resolveCourseLength } from '../app/lib/course-helpers';
import { getCertQuestionLimit } from '../app/lib/certification';
import { buildThreeOptions } from '../app/lib/quiz-questions';

config({ path: resolve(process.cwd(), '.env.local') });

type Severity = 'BLOCKER' | 'WARN';

type Finding = {
  severity: Severity;
  courseId: string;
  type: string;
  message: string;
};

type CourseDoc = {
  _id: mongoose.Types.ObjectId;
  courseId: string;
  name?: string;
  language?: string;
  durationDays?: number;
  isActive?: boolean;
  isDraft?: boolean;
  parentCourseId?: string;
  selectedLessonIds?: string[];
  certification?: {
    enabled?: boolean;
    poolCourseId?: string;
    certQuestionCount?: number;
    requireAllLessonsCompleted?: boolean;
    requireAllQuizzesPassed?: boolean;
    templateId?: string;
    templateVariantIds?: string[];
    passThresholdPercent?: number;
    maxErrorPercent?: number;
  };
};

function add(finding: Finding, findings: Finding[]) {
  findings.push(finding);
}

function normalizeCourseId(value: unknown) {
  return String(value || '').trim().toUpperCase();
}

async function countCertificationReadyQuestions(courseObjectId: unknown) {
  const questions = await QuizQuestion.find({
    courseId: courseObjectId,
    isCourseSpecific: true,
    isActive: true,
  })
    .select('options correctIndex correctAnswer wrongAnswers')
    .lean();

  return questions.filter((question) => buildThreeOptions(question) !== null).length;
}

async function auditCourse(course: CourseDoc, courseById: Map<string, CourseDoc>, findings: Finding[]) {
  const courseId = normalizeCourseId(course.courseId);
  const length = await resolveCourseLength(course);
  const totalDays = length.totalDays;
  const storedDuration = Number(course.durationDays || 0);
  const isChildCourse = Boolean(course.parentCourseId);

  if (!course.language) {
    add({ severity: 'BLOCKER', courseId, type: 'COURSE_LANGUAGE_MISSING', message: 'Course has no language, so localized course/lesson/final-exam links can break.' }, findings);
  }

  if (!Number.isFinite(storedDuration) || storedDuration < 1) {
    add({ severity: 'BLOCKER', courseId, type: 'DURATION_INVALID', message: `durationDays is invalid: ${String(course.durationDays)}` }, findings);
  }

  if (storedDuration > 0 && storedDuration !== totalDays) {
    add({
      severity: 'WARN',
      courseId,
      type: 'DURATION_SOURCE_MISMATCH',
      message: `Stored durationDays=${storedDuration}, resolved learner totalDays=${totalDays} from ${length.source}. Navigation should use resolved totalDays.`,
    }, findings);
  }

  const completedDays = Array.from({ length: totalDays }, (_, index) => index + 1);
  const completedCurrentDay = calculateCurrentLessonDay(completedDays, totalDays);
  if (completedCurrentDay !== totalDays + 1) {
    add({
      severity: 'BLOCKER',
      courseId,
      type: 'COMPLETED_CURRENT_DAY_INVALID',
      message: `Completed course currentDay should become ${totalDays + 1}, got ${completedCurrentDay}.`,
    }, findings);
  }

  const lastValidDay = Math.max(totalDays, 1);
  if (lastValidDay < 1) {
    add({ severity: 'BLOCKER', courseId, type: 'NO_VALID_DAY', message: 'Course has no valid learner day.' }, findings);
  }

  if (isChildCourse) {
    const parentCourseId = normalizeCourseId(course.parentCourseId);
    const parent = courseById.get(parentCourseId);
    if (!parent) {
      add({ severity: 'BLOCKER', courseId, type: 'CHILD_PARENT_MISSING', message: `parentCourseId=${parentCourseId} does not exist.` }, findings);
    }

    const selectedLessonIds = Array.isArray(course.selectedLessonIds) ? course.selectedLessonIds.map(String) : [];
    if (selectedLessonIds.length === 0) {
      add({ severity: 'BLOCKER', courseId, type: 'CHILD_SELECTED_LESSONS_EMPTY', message: 'Child/short course has no selectedLessonIds.' }, findings);
    }
    if (selectedLessonIds.length !== totalDays) {
      add({
        severity: 'BLOCKER',
        courseId,
        type: 'CHILD_SELECTED_LESSONS_LENGTH_MISMATCH',
        message: `selectedLessonIds=${selectedLessonIds.length}, resolved totalDays=${totalDays}.`,
      }, findings);
    }

    if (parent?._id && selectedLessonIds.length > 0) {
      const parentLessonCount = await Lesson.countDocuments({
        _id: { $in: selectedLessonIds.filter((id) => mongoose.Types.ObjectId.isValid(id)).map((id) => new mongoose.Types.ObjectId(id)) },
        courseId: parent._id,
      });
      if (parentLessonCount !== selectedLessonIds.length) {
        add({
          severity: 'BLOCKER',
          courseId,
          type: 'CHILD_SELECTED_LESSONS_NOT_FOUND',
          message: `${selectedLessonIds.length - parentLessonCount} selected lesson(s) are missing or not attached to parent ${parentCourseId}.`,
        }, findings);
      }
    }
  } else {
    const activeLessonCount = await Lesson.countDocuments({ courseId: course._id, isActive: true });
    if (activeLessonCount === 0) {
      add({ severity: 'BLOCKER', courseId, type: 'STANDARD_LESSONS_MISSING', message: 'Standard course has no active lessons.' }, findings);
    }

    const missingDays: number[] = [];
    for (let day = 1; day <= totalDays; day += 1) {
      const exists = await Lesson.exists({ courseId: course._id, dayNumber: day, isActive: true });
      if (!exists) missingDays.push(day);
    }
    if (missingDays.length > 0) {
      add({
        severity: 'BLOCKER',
        courseId,
        type: 'STANDARD_LESSON_DAY_GAPS',
        message: `Missing active lesson day(s): ${missingDays.slice(0, 12).join(', ')}${missingDays.length > 12 ? '...' : ''}.`,
      }, findings);
    }
  }

  if (course.certification?.enabled) {
    const questionLimit = getCertQuestionLimit(course);
    if (questionLimit < 1) {
      add({ severity: 'BLOCKER', courseId, type: 'CERT_QUESTION_LIMIT_INVALID', message: `certQuestionCount resolves to ${questionLimit}.` }, findings);
    }

    const poolCourseId = normalizeCourseId(course.certification.poolCourseId || course.courseId);
    const poolCourse = courseById.get(poolCourseId);
    if (!poolCourse) {
      add({ severity: 'BLOCKER', courseId, type: 'CERT_POOL_COURSE_MISSING', message: `Certification pool course ${poolCourseId} does not exist.` }, findings);
    } else {
      const readyQuestionCount = await countCertificationReadyQuestions(poolCourse._id);
      if (readyQuestionCount < questionLimit) {
        add({
          severity: 'BLOCKER',
          courseId,
          type: 'CERT_POOL_TOO_SMALL',
          message: `Certification requires ${questionLimit} valid display-ready question(s), pool ${poolCourseId} has ${readyQuestionCount}.`,
        }, findings);
      }
    }

    if (!course.certification.templateId && !course.certification.templateVariantIds?.length) {
      add({ severity: 'WARN', courseId, type: 'CERT_TEMPLATE_MISSING', message: 'Certification has no templateId/templateVariantIds; issuance will fall back to defaults.' }, findings);
    }

    const passThreshold = course.certification.passThresholdPercent ?? 50;
    if (passThreshold < 0 || passThreshold > 100) {
      add({ severity: 'BLOCKER', courseId, type: 'CERT_PASS_THRESHOLD_INVALID', message: `passThresholdPercent=${passThreshold} is outside 0-100.` }, findings);
    }

    const maxErrorPercent = course.certification.maxErrorPercent;
    if (typeof maxErrorPercent === 'number' && (maxErrorPercent < 0 || maxErrorPercent > 100)) {
      add({ severity: 'BLOCKER', courseId, type: 'CERT_MAX_ERROR_INVALID', message: `maxErrorPercent=${maxErrorPercent} is outside 0-100.` }, findings);
    }
  }
}

async function main() {
  await connectDB();

  const includeInactive = process.argv.includes('--include-inactive');
  const query = includeInactive ? {} : { isActive: true, isDraft: { $ne: true } };
  const courses = await Course.find(query)
    .select('_id courseId name language durationDays isActive isDraft parentCourseId selectedLessonIds certification')
    .lean<CourseDoc[]>();

  const courseById = new Map(courses.map((course) => [normalizeCourseId(course.courseId), course]));
  const findings: Finding[] = [];

  for (const course of courses) {
    await auditCourse(course, courseById, findings);
  }

  const blockers = findings.filter((finding) => finding.severity === 'BLOCKER');
  const warnings = findings.filter((finding) => finding.severity === 'WARN');

  console.log('\nCourse flow integrity audit');
  console.log('='.repeat(32));
  console.log(`Courses audited: ${courses.length}`);
  console.log(`Blockers: ${blockers.length}`);
  console.log(`Warnings: ${warnings.length}`);

  const grouped = new Map<string, Finding[]>();
  for (const finding of findings) {
    const list = grouped.get(finding.courseId) || [];
    list.push(finding);
    grouped.set(finding.courseId, list);
  }

  for (const [courseId, courseFindings] of grouped) {
    console.log(`\n${courseId}`);
    for (const finding of courseFindings) {
      console.log(`- [${finding.severity}] ${finding.type}: ${finding.message}`);
    }
  }

  await mongoose.disconnect();

  if (blockers.length > 0) {
    process.exit(1);
  }
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
