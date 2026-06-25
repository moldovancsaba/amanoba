import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  Certificate,
  CertificationSettings,
  Course,
  CourseProgress,
  FinalExamAttempt,
  Player,
} from '@/lib/models';
import { resolveTemplateVariantAtIssue } from '@/lib/certification';
import { resolveCourseLength } from '@/lib/course-helpers';
import { hasAssessmentResultsForEveryDay } from '@/lib/course-progress-assessment-results';
import { checkAndUnlockCourseAchievements } from '@/lib/gamification';
import { logger } from '@/lib/logger';

type DocWithId = { _id: { toString(): string } };

export type FinalExamFinalizeResult = {
  scorePercentInteger: number;
  passed: boolean;
  certificateUpdated: boolean;
};

export async function finalizeFinalExamAttempt(
  attemptId: string,
  playerId: string
): Promise<FinalExamFinalizeResult> {
  const attempt = await FinalExamAttempt.findOne({ _id: attemptId, playerId });
  if (!attempt) {
    throw new Error('Attempt not found');
  }

  const total = attempt.questionOrder.length || 50;
  const calculatedScorePercentRaw = total > 0 ? (attempt.correctCount / total) * 100 : 0;
  const calculatedScorePercentInteger = Math.round(calculatedScorePercentRaw);
  const scorePercentRaw = attempt.scorePercentRaw ?? calculatedScorePercentRaw;
  const scorePercentInteger = attempt.scorePercentInteger ?? calculatedScorePercentInteger;

  const course = await Course.findById(attempt.courseId).lean();
  const player = await Player.findById(playerId).lean();
  if (!course || !player) {
    throw new Error('Course or player not found');
  }

  const existing = await Certificate.findOne({
    playerId: (player as DocWithId)._id.toString(),
    courseId: course.courseId,
    isRevoked: { $ne: true },
  });

  const wasAlreadyGraded = attempt.status === 'GRADED';
  if (!wasAlreadyGraded && attempt.status !== 'IN_PROGRESS') {
    throw new Error('Attempt not in progress');
  }

  const passThreshold = course.certification?.passThresholdPercent ?? 50;
  const passed = wasAlreadyGraded ? Boolean(attempt.passed) : scorePercentInteger >= passThreshold;

  if (!wasAlreadyGraded) {
    attempt.scorePercentRaw = scorePercentRaw;
    attempt.scorePercentInteger = scorePercentInteger;
    attempt.passed = passed;
    attempt.status = 'GRADED';
    attempt.submittedAtISO = new Date().toISOString();
    await attempt.save();
  }

  const requireAllLessons = course.certification?.requireAllLessonsCompleted !== false;
  const requireAllQuizzes = course.certification?.requireAllQuizzesPassed !== false;

  const progress = await CourseProgress.findOne({
    playerId: new mongoose.Types.ObjectId(playerId),
    courseId: attempt.courseId,
  }).lean();

  const enrolled = Boolean(progress);
  const { totalDays } = await resolveCourseLength(course);
  const allLessonsCompleted = !requireAllLessons || (enrolled && progress &&
    (progress.completedDays?.length || 0) >= totalDays);

  const allQuizzesPassed = !requireAllQuizzes || (enrolled &&
    hasAssessmentResultsForEveryDay(progress?.assessmentResults, totalDays));

  const certificateEligible = enrolled && allLessonsCompleted && allQuizzesPassed && passed;
  let certificateUpdated = Boolean(existing);

  if (certificateEligible) {
    if (existing) {
      existing.finalExamScorePercentInteger = scorePercentInteger;
      existing.lastAttemptId = (attempt as DocWithId)._id.toString();
      existing.isRevoked = false;
      existing.revokedAtISO = undefined;
      existing.revokedReason = undefined;
      await existing.save();
      certificateUpdated = true;
    } else {
      const globalSettings = await CertificationSettings.findOne({ key: 'global' }).lean();
      const { designTemplateId, credentialId } = resolveTemplateVariantAtIssue(
        course.certification,
        globalSettings ?? undefined,
        (player as DocWithId)._id.toString(),
        course.courseId
      );

      await Certificate.create({
        certificateId: crypto.randomUUID(),
        playerId: (player as DocWithId)._id.toString(),
        recipientName: player.displayName || player.email || 'Learner',
        courseId: course.courseId,
        courseTitle: course.name || course.courseId,
        locale: course.language || 'en',
        designTemplateId,
        credentialId,
        completionPhraseId: 'completion_final_exam',
        deliverableBulletIds: [],
        issuedAtISO: new Date().toISOString(),
        awardedPhraseId: 'awarded_verified_mastery',
        verificationSlug: crypto.randomBytes(10).toString('hex'),
        finalExamScorePercentInteger: scorePercentInteger,
        lastAttemptId: (attempt as DocWithId)._id.toString(),
        isRevoked: false,
        isPublic: true,
      });
      certificateUpdated = true;
    }
  } else if (existing) {
    existing.finalExamScorePercentInteger = scorePercentInteger;
    existing.lastAttemptId = (attempt as DocWithId)._id.toString();
    existing.isRevoked = true;
    existing.revokedAtISO = new Date().toISOString();
    existing.revokedReason = passed ? 'requirements_not_met' : 'score_below_threshold';
    await existing.save();
    certificateUpdated = false;
  }

  try {
    const courseIdStr = (course as { courseId?: string }).courseId;
    if (courseIdStr) {
      const unlocked = await checkAndUnlockCourseAchievements(
        new mongoose.Types.ObjectId(playerId),
        courseIdStr
      );
      if (unlocked.length > 0) {
        logger.info(
          { playerId, courseId: courseIdStr, unlocked: unlocked.length },
          'Course achievements unlocked after final exam'
        );
      }
    }
  } catch (_err) {
    // Do not fail the request if achievement check fails.
  }

  return {
    scorePercentInteger,
    passed,
    certificateUpdated,
  };
}
