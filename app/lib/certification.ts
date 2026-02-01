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
    courseId: new mongoose.Types.ObjectId(String(poolCourse._id)),
    isCourseSpecific: true,
    isActive: true,
  });
  return count;
}

/**
 * Effective question count for final exam: certQuestionCount if set (child courses), else 50.
 */
export function getCertQuestionLimit(course: { certification?: { certQuestionCount?: number } } | null): number {
  const n = course?.certification?.certQuestionCount;
  return n != null && n >= 1 ? n : 50;
}

/**
 * Determine if certification is available for a given course:
 * - certification.enabled === true
 * - poolCount >= getCertQuestionLimit(course)
 */
export async function isCertificationAvailable(courseId: string): Promise<{ available: boolean; poolCount: number }> {
  await connectDB();
  const course = await Course.findOne({ courseId: courseId.toUpperCase() }).lean();
  if (!course || !course.certification?.enabled) {
    return { available: false, poolCount: 0 };
  }
  const poolCount = await getCertificationPoolCount(courseId);
  const limit = getCertQuestionLimit(course);
  return { available: poolCount >= limit, poolCount };
}

// --- Certificate template A/B (P1 #5) ---

export type CertificateRenderTemplateId = 'default' | 'minimal';

/**
 * Map stored designTemplateId to render layout.
 * Used by certificate image routes so each issued cert renders with its assigned variant.
 */
export function mapDesignTemplateIdToRender(designTemplateId: string): CertificateRenderTemplateId {
  if (designTemplateId === 'minimal') return 'minimal';
  return 'default'; // default_v1 and any other ID use default layout
}

type CourseCert = {
  templateId?: string;
  templateVariantIds?: string[];
  templateVariantWeights?: number[];
  credentialTitleId?: string;
} | null | undefined;

type GlobalCertSettings = {
  templateId?: string;
  templateVariantIds?: string[];
  templateVariantWeights?: number[];
  credentialTitleId?: string;
} | null | undefined;

/**
 * Resolve allowed template variant IDs: course first, then global, then single default.
 */
function getAllowedTemplateIds(courseCert: CourseCert, globalCert: GlobalCertSettings): string[] {
  const fromCourse = courseCert?.templateVariantIds?.length
    ? courseCert.templateVariantIds
    : courseCert?.templateId
      ? [courseCert.templateId]
      : null;
  if (fromCourse?.length) return fromCourse;
  const fromGlobal = globalCert?.templateVariantIds?.length
    ? globalCert.templateVariantIds
    : globalCert?.templateId
      ? [globalCert.templateId]
      : null;
  if (fromGlobal?.length) return fromGlobal;
  return ['default_v1'];
}

/**
 * Pick one variant index by stable hash(playerId + courseId) so the same learner gets the same variant for that course.
 */
function pickVariantIndexStable(variantIds: string[], playerId: string, courseId: string): number {
  if (variantIds.length === 0) return 0;
  if (variantIds.length === 1) return 0;
  const str = `${playerId}:${courseId}`;
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h) % variantIds.length;
}

/**
 * Resolve designTemplateId and credentialId at certificate issue time (A/B: assign at issue).
 * Uses course.certification (templateVariantIds or templateId), fallback global settings, then default_v1 / CERT.
 * Picks variant by stable hash(playerId, courseId).
 */
export function resolveTemplateVariantAtIssue(
  courseCert: CourseCert,
  globalCert: GlobalCertSettings,
  playerId: string,
  courseId: string
): { designTemplateId: string; credentialId: string } {
  const variantIds = getAllowedTemplateIds(courseCert, globalCert);
  const index = pickVariantIndexStable(variantIds, playerId, courseId);
  const designTemplateId = variantIds[index] ?? 'default_v1';
  const credentialId =
    courseCert?.credentialTitleId ?? globalCert?.credentialTitleId ?? 'CERT';
  return { designTemplateId, credentialId };
}
