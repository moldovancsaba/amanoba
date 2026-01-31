/**
 * Content vote helpers (reset on lesson update per ROADMAP).
 */

import connectDB from './mongodb';
import { ContentVote, QuizQuestion } from './models';
import type mongoose from 'mongoose';

/**
 * Reset votes for a lesson and its quiz questions when lesson content is updated.
 * Call from admin lesson PATCH when content changes.
 */
export async function resetVotesForLesson(
  lessonDoc: { _id: unknown; lessonId: string },
  courseId: mongoose.Types.ObjectId
): Promise<{ lessonVotesDeleted: number; questionVotesDeleted: number }> {
  await connectDB();
  const lessonTargetId = String(lessonDoc._id);
  const deletedLesson = await ContentVote.deleteMany({
    targetType: 'lesson',
    targetId: lessonTargetId,
  });
  const questions = await QuizQuestion.find({ courseId, lessonId: lessonDoc.lessonId })
    .select('_id')
    .lean();
  const questionIds = questions.map((q) => String((q as { _id: unknown })._id));
  const deletedQuestions =
    questionIds.length > 0
      ? await ContentVote.deleteMany({
          targetType: 'question',
          targetId: { $in: questionIds },
        })
      : { deletedCount: 0 };
  return {
    lessonVotesDeleted: deletedLesson.deletedCount,
    questionVotesDeleted: deletedQuestions.deletedCount,
  };
}
