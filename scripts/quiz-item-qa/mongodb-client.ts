import { config } from 'dotenv';
import connectDB from '../../app/lib/mongodb';
import QuizQuestion, { IQuizQuestion } from '../../app/lib/models/quiz-question';
import { loadConfig, QuizItemQAConfig } from './config';

// Load environment variables before importing MongoDB
config({ path: '.env.local' });

export interface QuizItem {
  _id: string;
  uuid?: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  category: string;
  questionType?: string;
  hashtags?: string[];
  isActive: boolean;
  isCourseSpecific: boolean;
  courseId?: string;
  lessonId?: string;
  relatedCourseIds?: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    auditedAt?: string;
    auditedBy?: string;
    lastShownAt?: string;
  };
  showCount?: number;
  correctCount?: number;
}

function documentToQuizItem(doc: IQuizQuestion): QuizItem {
  return {
    _id: doc._id.toString(),
    uuid: doc.uuid,
    question: doc.question,
    options: doc.options,
    correctIndex: doc.correctIndex,
    difficulty: doc.difficulty,
    category: doc.category,
    questionType: doc.questionType,
    hashtags: doc.hashtags,
    isActive: doc.isActive,
    isCourseSpecific: doc.isCourseSpecific,
    courseId: doc.courseId?.toString(),
    lessonId: doc.lessonId,
    relatedCourseIds: doc.relatedCourseIds?.map(id => id.toString()),
    metadata: {
      createdAt: doc.metadata.createdAt.toISOString(),
      updatedAt: doc.metadata.updatedAt.toISOString(),
      createdBy: doc.metadata.createdBy,
      auditedAt: doc.metadata.auditedAt?.toISOString(),
      auditedBy: doc.metadata.auditedBy,
      lastShownAt: doc.metadata.lastShownAt?.toISOString(),
    },
    showCount: doc.showCount,
    correctCount: doc.correctCount,
  };
}

export async function fetchAllQuestions(overrides?: Partial<QuizItemQAConfig>): Promise<QuizItem[]> {
  await connectDB();
  
  const docs = await QuizQuestion.find({}).lean();
  return docs.map(documentToQuizItem);
}

export async function fetchQuestionById(
  questionId: string,
  overrides?: Partial<QuizItemQAConfig>
): Promise<QuizItem> {
  await connectDB();
  
  const doc = await QuizQuestion.findById(questionId).lean();
  if (!doc) {
    throw new Error(`Question not found: ${questionId}`);
  }
  
  return documentToQuizItem(doc);
}

export async function patchQuestion(
  questionId: string,
  patch: Record<string, unknown>,
  overrides?: Partial<QuizItemQAConfig>
): Promise<QuizItem> {
  await connectDB();
  
  // Update the document
  const updateData = {
    ...patch,
    'metadata.updatedAt': new Date(),
  };
  
  const doc = await QuizQuestion.findByIdAndUpdate(
    questionId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  
  if (!doc) {
    throw new Error(`Question not found: ${questionId}`);
  }
  
  return documentToQuizItem(doc);
}

export async function getOldestByUpdatedAt(overrides?: Partial<QuizItemQAConfig>): Promise<QuizItem[]> {
  await connectDB();
  
  const docs = await QuizQuestion.find({})
    .sort({ 'metadata.updatedAt': 1 }) // Ascending order (oldest first)
    .lean();
  
  return docs.map(documentToQuizItem);
}

export async function auditLastModified(overrides?: Partial<QuizItemQAConfig>): Promise<QuizItem | null> {
  await connectDB();
  
  const doc = await QuizQuestion.findOne({})
    .sort({ 'metadata.updatedAt': -1 }) // Descending order (newest first)
    .lean();
  
  if (!doc) {
    return null;
  }
  
  return documentToQuizItem(doc);
}