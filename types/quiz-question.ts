/**
 * Quiz Question Types (Client-Safe)
 * 
 * What: TypeScript types and enums for quiz questions
 * Why: Client components need these types but cannot import Mongoose models
 * 
 * Note: This file contains only types and enums, no server-side code
 */

/**
 * Difficulty Levels Enum
 * Why: Type-safe difficulty references matching game component
 */
export enum QuestionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

/**
 * Question Type Enum
 * Why: Categorize questions by cognitive level for analytics and filtering
 */
export enum QuestionType {
  RECALL = 'recall',
  APPLICATION = 'application',
  CRITICAL_THINKING = 'critical-thinking',
}

/**
 * Question Interface (Client-Side)
 * Why: TypeScript type for question data in client components
 */
export interface Question {
  _id: string;
  uuid?: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
  category: string;
  questionType?: QuestionType;
  hashtags?: string[];
  isActive: boolean;
  isCourseSpecific: boolean;
  lessonId?: string;
  courseId?: string | { toString(): string };
  relatedCourseIds?: string[];
  showCount: number;
  correctCount: number;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    auditedAt?: string;
    auditedBy?: string;
  };
}
