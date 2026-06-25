import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, FinalExamAttempt, QuizQuestion } from '@/lib/models';
import { finalizeFinalExamAttempt } from '@/lib/certification/final-exam-finalize';
import { buildThreeOptions } from '@/lib/quiz-questions';
import { getMapLikeValue, setMapLikeValue } from '@/lib/map-like';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const attemptId = body?.attemptId as string | undefined;
  const questionId = body?.questionId as string | undefined;
  const selectedIndex = body?.selectedIndex as number | undefined;

  if (!attemptId || !questionId || selectedIndex === undefined) {
    return NextResponse.json({ success: false, error: 'attemptId, questionId, selectedIndex required' }, { status: 400 });
  }
  if (!mongoose.isValidObjectId(attemptId) || !mongoose.isValidObjectId(questionId)) {
    return NextResponse.json({ success: false, error: 'Invalid attempt or question id' }, { status: 400 });
  }
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 2) {
    return NextResponse.json({ success: false, error: 'selectedIndex must be 0, 1, or 2' }, { status: 400 });
  }

  await connectDB();

  const attempt = await FinalExamAttempt.findOne({ _id: attemptId, playerId: session.user.id });
  if (!attempt) {
    return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
  }

  if (attempt.status === 'GRADED') {
    const result = await finalizeFinalExamAttempt(attemptId, session.user.id);
    return NextResponse.json({
      success: true,
      data: {
        correct: false,
        nextQuestion: null,
        completed: true,
        result,
        passed: result.passed,
      },
    });
  }

  if (attempt.status !== 'IN_PROGRESS') {
    return NextResponse.json({ success: false, error: 'Attempt not in progress' }, { status: 400 });
  }

  // Validate question membership
  const currentQuestionIndex = attempt.questionOrder.indexOf(questionId);
  if (!attempt.questionIds.includes(questionId) || currentQuestionIndex === -1) {
    return NextResponse.json({ success: false, error: 'Question not part of attempt' }, { status: 400 });
  }

  // Load question
  const question = await QuizQuestion.findById(new mongoose.Types.ObjectId(questionId)).lean();
  if (!question) {
    return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
  }

  // Grade: prefer 3-option display index when stored; fallback to legacy 4-option order
  let isCorrect: boolean;
  const storedCorrectIndex = getMapLikeValue<number>(attempt.correctIndexInDisplayByQuestion, questionId);
  if (typeof storedCorrectIndex === 'number' && storedCorrectIndex >= 0 && storedCorrectIndex <= 2) {
    isCorrect = selectedIndex === storedCorrectIndex;
  } else if (getMapLikeValue<number[]>(attempt.answerOrderByQuestion, questionId) && typeof (question as { correctIndex?: number }).correctIndex === 'number') {
    const optionOrder = getMapLikeValue<number[]>(attempt.answerOrderByQuestion, questionId) ?? [];
    const chosenOriginalIndex = optionOrder[selectedIndex];
    isCorrect = chosenOriginalIndex === (question as { correctIndex: number }).correctIndex;
  } else {
    isCorrect = false;
  }
  const answers = Array.isArray(attempt.answers) ? attempt.answers : [];
  const alreadyAnswered = answers.some((answer) => answer.questionId === questionId);
  if (isCorrect && !alreadyAnswered) {
    attempt.correctCount += 1;
  }

  // Store answer
  if (!alreadyAnswered) {
    answers.push({
      questionId,
      selectedIndex,
      isCorrect,
    });
    attempt.answers = answers;
    attempt.markModified('answers');
  }

  const answeredCount = Math.max(answers.length, currentQuestionIndex + 1);
  const wrongCount = Math.max(0, answers.length - attempt.correctCount);

  // Immediate fail: course-level max error % exceeded (e.g. 10% = fail as soon as error rate > 10%)
  let immediateFail = false;
  const course = await Course.findById(attempt.courseId).lean();
  const maxErrorPercent = course?.certification?.maxErrorPercent;
  if (
    typeof maxErrorPercent === 'number' &&
    maxErrorPercent >= 0 &&
    answeredCount > 0
  ) {
    const currentErrorPercent = (wrongCount / answeredCount) * 100;
    if (currentErrorPercent > maxErrorPercent) {
      immediateFail = true;
    }
  }

  // Determine next question (3 options per question via buildThreeOptions)
  let nextQuestionPayload = null;
  const nextQuestionIndex = currentQuestionIndex + 1;
  if (!immediateFail && nextQuestionIndex < attempt.questionOrder.length) {
    const nextQuestionId = attempt.questionOrder[nextQuestionIndex];
    const nextQuestion = await QuizQuestion.findById(new mongoose.Types.ObjectId(nextQuestionId)).lean();
    if (!nextQuestion) {
      return NextResponse.json({ success: false, error: 'Next question not found' }, { status: 500 });
    }
    const nextThree = buildThreeOptions(nextQuestion);
    if (!nextThree) {
      return NextResponse.json({ success: false, error: 'Next question invalid' }, { status: 500 });
    }
    const nextCorrectIndex = nextThree.options.indexOf(nextThree.correctAnswerValue);
    const nextCorrectIndexByQuestion = setMapLikeValue(
      attempt.correctIndexInDisplayByQuestion,
      nextQuestionId,
      nextCorrectIndex
    );
    attempt.correctIndexInDisplayByQuestion = nextCorrectIndexByQuestion instanceof Map
      ? Object.fromEntries(nextCorrectIndexByQuestion.entries())
      : nextCorrectIndexByQuestion;
    attempt.markModified('correctIndexInDisplayByQuestion');
    nextQuestionPayload = {
      questionId: nextQuestionId,
      question: nextQuestion.question,
      options: nextThree.options,
      index: nextQuestionIndex,
      total: attempt.questionOrder.length,
    };
  }

  await attempt.save();

  const result = nextQuestionPayload === null
    ? await finalizeFinalExamAttempt(attemptId, session.user.id)
    : null;

  return NextResponse.json({
    success: true,
    data: {
      correct: isCorrect,
      nextQuestion: nextQuestionPayload,
      completed: nextQuestionPayload === null,
      passed: result?.passed ?? (immediateFail ? false : undefined),
      result,
    },
  });
}
