import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, FinalExamAttempt, QuizQuestion } from '@/lib/models';
import { buildThreeOptions } from '@/lib/quiz-questions';
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

  await connectDB();

  const attempt = await FinalExamAttempt.findOne({ _id: attemptId, playerId: session.user.id });
  if (!attempt) {
    return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
  }

  if (attempt.status !== 'IN_PROGRESS') {
    return NextResponse.json({ success: false, error: 'Attempt not in progress' }, { status: 400 });
  }

  // Validate question membership
  if (!attempt.questionIds.includes(questionId)) {
    return NextResponse.json({ success: false, error: 'Question not part of attempt' }, { status: 400 });
  }

  // Load question
  const question = await QuizQuestion.findById(new mongoose.Types.ObjectId(questionId)).lean();
  if (!question) {
    return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
  }

  // Grade: prefer 3-option display index when stored; fallback to legacy 4-option order
  let isCorrect: boolean;
  const storedCorrectIndex = attempt.correctIndexInDisplayByQuestion?.[questionId];
  if (typeof storedCorrectIndex === 'number' && storedCorrectIndex >= 0 && storedCorrectIndex <= 2) {
    isCorrect = selectedIndex === storedCorrectIndex;
  } else if (attempt.answerOrderByQuestion?.[questionId] && typeof (question as { correctIndex?: number }).correctIndex === 'number') {
    const optionOrder = attempt.answerOrderByQuestion[questionId];
    const chosenOriginalIndex = optionOrder[selectedIndex];
    isCorrect = chosenOriginalIndex === (question as { correctIndex: number }).correctIndex;
  } else {
    isCorrect = false;
  }
  if (isCorrect) {
    attempt.correctCount += 1;
  }

  // Store answer
  attempt.answers = attempt.answers || [];
  attempt.answers.push({
    questionId,
    selectedIndex,
    isCorrect,
  });

  const answeredCount = attempt.answers.length;
  const wrongCount = answeredCount - attempt.correctCount;
  const totalQuestions = attempt.questionOrder.length;

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
      attempt.status = 'GRADED';
      attempt.passed = false;
      attempt.submittedAtISO = new Date().toISOString();
      attempt.scorePercentRaw = totalQuestions > 0 ? (attempt.correctCount / totalQuestions) * 100 : 0;
      attempt.scorePercentInteger = Math.round(attempt.scorePercentRaw);
    }
  }

  // Determine next question (3 options per question via buildThreeOptions)
  let nextQuestionPayload = null;
  if (!immediateFail && answeredCount < attempt.questionOrder.length) {
    const nextQuestionId = attempt.questionOrder[answeredCount];
    const nextQuestion = await QuizQuestion.findById(new mongoose.Types.ObjectId(nextQuestionId)).lean();
    if (!nextQuestion) {
      return NextResponse.json({ success: false, error: 'Next question not found' }, { status: 500 });
    }
    const nextThree = buildThreeOptions(nextQuestion);
    if (!nextThree) {
      return NextResponse.json({ success: false, error: 'Next question invalid' }, { status: 500 });
    }
    const nextCorrectIndex = nextThree.options.indexOf(nextThree.correctAnswerValue);
    if (!attempt.correctIndexInDisplayByQuestion) {
      attempt.correctIndexInDisplayByQuestion = {};
    }
    attempt.correctIndexInDisplayByQuestion[nextQuestionId] = nextCorrectIndex;
    nextQuestionPayload = {
      questionId: nextQuestionId,
      question: nextQuestion.question,
      options: nextThree.options,
      index: answeredCount,
      total: attempt.questionOrder.length,
    };
  }

  await attempt.save();

  return NextResponse.json({
    success: true,
    data: {
      correct: isCorrect,
      nextQuestion: nextQuestionPayload,
      completed: nextQuestionPayload === null,
      passed: immediateFail ? false : undefined,
    },
  });
}
