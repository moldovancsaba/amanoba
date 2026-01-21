import mongoose from 'mongoose';
import connectDB from './mongodb';
import { Course, QuizQuestion } from './models';

/**
 * Resolve the pool course (_id and doc) given a courseId string.
 * Uses course.certification.poolCourseId if present, otherwise the course itself.
 */
export async function resolvePoolCourse(courseId: string) {
  await connectDB();
  const course = await Course.findOne({ courseId: courseId.toUpperCase() }).lean();
  if (!course) return null;

  const poolCourseId = course.certification?.poolCourseId || course.courseId;
  const poolCourse = await Course.findOne({ courseId: poolCourseId }).lean();
  return poolCourse;
}

/**
 * Count active course-specific questions for a pool course.
 * Returns 0 if course not found.
 */
export async function getCertificationPoolCount(courseId: string): Promise<number> {
  const poolCourse = await resolvePoolCourse(courseId);
  if (!poolCourse?._id) return 0;
  const count = await QuizQuestion.countDocuments({
    courseId: new mongoose.Types.ObjectId(poolCourse._id),
    isCourseSpecific: true,
    isActive: true,
  });
  return count;
}

/**
 * Determine if certification is available for a given course:
 * - certification.enabled === true
 * - poolCount >= 50
 */
export async function isCertificationAvailable(courseId: string): Promise<{ available: boolean; poolCount: number }> {
  await connectDB();
  const course = await Course.findOne({ courseId: courseId.toUpperCase() }).lean();
  if (!course || !course.certification?.enabled) {
    return { available: false, poolCount: 0 };
  }
  const poolCount = await getCertificationPoolCount(courseId);
  return { available: poolCount >= 50, poolCount };
}
