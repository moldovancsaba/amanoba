import { QuizItem } from './client';

export interface Violation {
  code: string;
  message: string;
  fields: string[];
  severity: 'error' | 'warning';
  docRef: string;
}

export interface EvaluationResult {
  questionId: string;
  violations: Violation[];
  needsUpdate: boolean;
  autoPatch: Record<string, unknown>;
}

const GOLDEN_DOC = 'docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md#gold-standard-question-type';
const COURSE_RULES_DOC = 'docs/COURSE_BUILDING_RULES.md#gold-standard-only-acceptable-form';
const BANNED_PHRASES = [
  'this course',
  'this lesson',
  'the lesson',
  'the course',
  "today's lesson",
  'lesson',
];

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function containsBannedPhrase(text: string) {
  const lowered = text.toLowerCase();
  return BANNED_PHRASES.some((phrase) => lowered.includes(phrase));
}

export function evaluateQuestion(item: QuizItem): EvaluationResult {
  const violations: Violation[] = [];
  const autoPatch: Record<string, unknown> = {};
  const trimmedQuestion = normalizeText(item.question);
  if (trimmedQuestion.length !== item.question.length) {
    autoPatch.question = trimmedQuestion;
  }

  if (trimmedQuestion.length < 40) {
    violations.push({
      code: 'QUESTION_TOO_SHORT',
      message: 'Question is shorter than 40 characters.',
      fields: ['question'],
      severity: 'error',
      docRef: GOLDEN_DOC,
    });
  }

  if (containsBannedPhrase(trimmedQuestion)) {
    violations.push({
      code: 'HAS_LESSON_REF',
      message: 'Question references course/lesson language (violates standalone rule).',
      fields: ['question'],
      severity: 'warning',
      docRef: GOLDEN_DOC,
    });
  }

  if (item.questionType === 'recall') {
    violations.push({
      code: 'RECALL_TYPE',
      message: 'Recall questions are prohibited by the pipeline.',
      fields: ['questionType'],
      severity: 'error',
      docRef: GOLDEN_DOC,
    });
  }

  const normalizedOptions = item.options.map(normalizeText);
  const uniqueOptions = new Set(normalizedOptions);
  if (uniqueOptions.size !== normalizedOptions.length) {
    violations.push({
      code: 'DUPLICATE_OPTION',
      message: 'Options must be unique as per schema.',
      fields: ['options'],
      severity: 'error',
      docRef: COURSE_RULES_DOC,
    });
  }

  normalizedOptions.forEach((option, index) => {
    if (option.length < 25) {
      violations.push({
        code: 'OPTION_TOO_SHORT',
        message: `Option ${index + 1} is shorter than 25 characters.`,
        fields: [`options[${index}]`],
        severity: 'warning',
        docRef: GOLDEN_DOC,
      });
    }
  });

  if (normalizedOptions.some((opt, index) => opt !== item.options[index])) {
    autoPatch.options = normalizedOptions;
  }

  return {
    questionId: item._id,
    violations,
    needsUpdate: violations.length > 0 || Object.keys(autoPatch).length > 0,
    autoPatch,
  };
}
