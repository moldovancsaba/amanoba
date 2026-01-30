/**
 * Verify DONE_BETTER_2026 CCS, course, lessons, and quizzes in the database.
 * Run: npx tsx --env-file=.env.local scripts/verify-done-better-2026-seed.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, CCS, Course, Lesson, QuizQuestion } from '../app/lib/models';

const CCS_ID = 'DONE_BETTER_2026';
const COURSE_ID = 'DONE_BETTER_2026_EN';

async function verify() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || 'amanoba',
  });

  const issues: string[] = [];
  const ok: string[] = [];

  // 1. CCS
  const ccs = await CCS.findOne({ ccsId: CCS_ID }).lean();
  if (!ccs) {
    issues.push(`CCS ${CCS_ID} not found in DB. Admin "Course families" will not show it.`);
  } else {
    ok.push(`CCS ${CCS_ID} exists (name: ${ccs.name || '(empty)'})`);
    if (!ccs.name?.trim()) issues.push(`CCS ${CCS_ID} has no name.`);
  }

  // 2. Brand (course must reference it)
  const brand = await Brand.findOne({ slug: 'amanoba' }).lean();
  if (!brand) {
    issues.push('Brand with slug "amanoba" not found. Course requires brandId.');
  } else {
    ok.push(`Brand amanoba exists (_id: ${brand._id})`);
  }

  // 3. Course
  const course = await Course.findOne({ courseId: COURSE_ID }).lean();
  if (!course) {
    issues.push(`Course ${COURSE_ID} not found.`);
  } else {
    ok.push(`Course ${COURSE_ID} exists (name: ${course.name})`);
    if (course.ccsId !== CCS_ID) {
      issues.push(`Course ccsId is "${course.ccsId}", expected "${CCS_ID}". Will not show under CCS in admin.`);
    } else {
      ok.push(`Course ccsId = ${CCS_ID} (will show under CCS).`);
    }
    const parentOk = course.parentCourseId == null || course.parentCourseId === '' || course.parentCourseId === undefined;
    if (!parentOk) {
      issues.push(`Course parentCourseId is set ("${course.parentCourseId}"). Admin CCS view only lists courses with no parent.`);
    } else {
      ok.push('Course has no parentCourseId (shows as language variant under CCS).');
    }
    if (!course.brandId) {
      issues.push('Course has no brandId.');
    } else {
      ok.push(`Course brandId set (${course.brandId}).`);
    }
    if (course.isActive !== true) {
      issues.push(`Course isActive is ${course.isActive}. Public catalog and admin expect active.`);
    } else {
      ok.push('Course isActive = true.');
    }
    if (course.isDraft === true) {
      issues.push('Course isDraft = true. Public /api/courses excludes draft courses.');
    } else {
      ok.push('Course isDraft is not true (visible in catalog).');
    }
    if (course.durationDays !== 30) {
      issues.push(`Course durationDays = ${course.durationDays}, expected 30.`);
    } else {
      ok.push('Course durationDays = 30.');
    }
  }

  const courseDoc = await Course.findOne({ courseId: COURSE_ID }).select('_id').lean();
  const courseIdObj = courseDoc?._id;

  // 4. Lessons (expect 30)
  if (courseIdObj) {
    const lessonCount = await Lesson.countDocuments({ courseId: courseIdObj });
    if (lessonCount !== 30) {
      issues.push(`Lesson count = ${lessonCount}, expected 30.`);
    } else {
      ok.push(`Lessons: ${lessonCount} (expected 30).`);
    }
    const lessonIds = await Lesson.find({ courseId: courseIdObj }).select('lessonId dayNumber').sort({ dayNumber: 1 }).lean();
    for (let d = 1; d <= 30; d++) {
      const expectedId = `${COURSE_ID}_DAY_${String(d).padStart(2, '0')}`;
      const found = lessonIds.find((l) => l.dayNumber === d && l.lessonId === expectedId);
      if (!found) {
        issues.push(`Lesson Day ${d} missing or wrong id (expected ${expectedId}).`);
      }
    }
    if (issues.filter((i) => i.includes('Lesson Day')).length === 0) {
      ok.push('All 30 lesson IDs and day numbers correct (DONE_BETTER_2026_EN_DAY_01..30).');
    }
  }

  // 5. Quiz questions (expect 7 per lesson)
  for (let d = 1; d <= 30; d++) {
    const lessonId = `${COURSE_ID}_DAY_${String(d).padStart(2, '0')}`;
    const count = await QuizQuestion.countDocuments({ lessonId, isActive: true });
    if (count < 7) {
      issues.push(`Lesson ${lessonId}: ${count} quiz questions (expected >= 7).`);
    }
  }
  const totalQuiz = await QuizQuestion.countDocuments({ lessonId: new RegExp(`^${COURSE_ID}_DAY_\\d{2}$`) });
  if (totalQuiz < 30 * 7) {
    issues.push(`Total quiz questions for course: ${totalQuiz}, expected >= 210.`);
  } else {
    ok.push(`Quiz questions: ${totalQuiz} total (>= 7 per lesson).`);
  }

  // Admin API sanity: courses under this CCS
  const coursesUnderCcs = await Course.find({
    ccsId: CCS_ID,
    parentCourseId: { $in: [null, undefined, ''] },
  })
    .select('courseId name language isActive isDraft')
    .lean();
  if (coursesUnderCcs.length === 0) {
    issues.push(`Admin API: no courses found for ccsId=${CCS_ID} (parentCourseId null/empty).`);
  } else {
    ok.push(`Admin CCS view: ${coursesUnderCcs.length} course(s) under ${CCS_ID} (${coursesUnderCcs.map((c) => c.courseId).join(', ')})`);
  }

  await mongoose.disconnect();

  // Report
  console.log('\n--- DONE_BETTER_2026 seed verification ---\n');
  ok.forEach((o) => console.log('✅', o));
  if (issues.length) {
    console.log('\n❌ Issues:\n');
    issues.forEach((i) => console.log('  -', i));
    console.log('\n');
    process.exit(1);
  }
  console.log('\n✅ All checks passed. CCS, course, lessons, and quizzes are correctly seeded.\n');
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
