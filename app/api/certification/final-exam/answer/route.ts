import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { FinalExamAttempt, QuizQuestion } from '@/lib/models';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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

  // Ensure answer order exists
  if (!attempt.answerOrderByQuestion) {
    attempt.answerOrderByQuestion = {};
  }
  if (!attempt.answerOrderByQuestion[questionId]) {
    attempt.answerOrderByQuestion[questionId] = shuffle([0, 1, 2, 3]);
  }
  const optionOrder = attempt.answerOrderByQuestion[questionId];

  // Map selected index back to original correct index
  const chosenOriginalIndex = optionOrder[selectedIndex];
  const isCorrect = chosenOriginalIndex === question.correctIndex;
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

  // Determine next question
  const answeredCount = attempt.answers.length;
  let nextQuestionPayload = null;
  if (answeredCount < attempt.questionOrder.length) {
    const nextQuestionId = attempt.questionOrder[answeredCount];
    const nextQuestion = await QuizQuestion.findById(new mongoose.Types.ObjectId(nextQuestionId)).lean();
    if (!nextQuestion) {
      return NextResponse.json({ success: false, error: 'Next question not found' }, { status: 500 });
    }
    const nextOrder = shuffle([0, 1, 2, 3]);
    attempt.answerOrderByQuestion[nextQuestionId] = nextOrder;
    nextQuestionPayload = {
      questionId: nextQuestionId,
      question: nextQuestion.question,
      options: nextOrder.map((idx) => nextQuestion.options[idx]),
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
    },
  });
}
