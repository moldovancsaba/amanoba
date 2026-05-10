import { readFileSync } from 'fs';
import { resolve } from 'path';

const stderrLog = (...args: unknown[]) => {
  process.stderr.write(`${args.map((item) => String(item)).join(' ')}\n`);
};
console.log = stderrLog;
console.info = stderrLog;
console.warn = stderrLog;

const { config: loadEnv } = require('dotenv');
loadEnv({ path: resolve(process.cwd(), '.env.local') });

const mongoModule = require('../app/lib/mongodb');
const connectDB: () => Promise<unknown> = mongoModule.default;
const disconnectDB: () => Promise<void> = mongoModule.disconnectDB;
const { Course, Lesson, QuizQuestion } = require('../app/lib/models');

type LiveLessonRecord = {
  objectId: string;
  lessonId: string;
  courseObjectId: string;
  courseId: string;
  courseName: string;
  language: string;
  dayNumber: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
  lastAuditedAt: string | null;
};

type LiveQuestionRecord = {
  objectId: string;
  uuid: string;
  lessonId: string;
  courseObjectId: string;
  courseId: string;
  courseName: string;
  language: string;
  dayNumber: number;
  lessonTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  questionType: string;
  difficulty: string;
  category: string;
  hashtags: string[];
  lastAuditedAt: string | null;
};

type LiveTaskContext = {
  previousLesson: LiveLessonRecord | null;
  nextLesson: LiveLessonRecord | null;
  siblingQuestions: LiveQuestionRecord[];
};

const QUESTION_DIFFICULTIES = new Set(['EASY', 'MEDIUM', 'HARD', 'EXPERT']);
const QUESTION_CATEGORIES = new Set([
  'Science',
  'History',
  'Geography',
  'Math',
  'Technology',
  'Arts & Literature',
  'Sports',
  'General Knowledge',
  'Course Specific',
  'Productivity Foundations',
  'Time, Energy, Attention',
  'Goal Hierarchy',
  'Habits vs Systems',
  'Measurement & Metrics',
  'Capture & GTD',
  'Context Switching',
  'Delegation',
  'Energy Management',
  'Advanced Strategies',
  'Integration & Synthesis',
  'Workplace Application',
  'Team Dynamics',
  'Digital Tools',
  'Communication',
  'Stress Management',
  'Learning Systems',
  'Personal Development',
  'Decision Making',
  'Continuous Improvement',
]);

const QUESTION_TYPES = new Set([
  'recall',
  'application',
  'critical-thinking',
  'definition',
  'concept',
  'best_practice',
  'diagnostic',
  'metric',
]);

function normalizeQuestionDifficulty(value: unknown, fallback: unknown): string {
  const raw = String(value || '').trim().toUpperCase();
  if (QUESTION_DIFFICULTIES.has(raw)) return raw;
  const fallbackRaw = String(fallback || '').trim().toUpperCase();
  if (QUESTION_DIFFICULTIES.has(fallbackRaw)) return fallbackRaw;
  return 'MEDIUM';
}

function normalizeQuestionCategory(value: unknown, fallback: unknown): string {
  const raw = String(value || '').trim();
  if (QUESTION_CATEGORIES.has(raw)) return raw;
  const underscored = raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  if (QUESTION_CATEGORIES.has(underscored)) return underscored;
  const titleCase = underscored
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
  if (QUESTION_CATEGORIES.has(titleCase)) return titleCase;
  const fallbackRaw = String(fallback || '').trim();
  if (QUESTION_CATEGORIES.has(fallbackRaw)) return fallbackRaw;
  return 'Course Specific';
}

function normalizeQuestionType(value: unknown, fallback: unknown = 'application'): string {
  const raw = String(value || '').trim().toLowerCase();
  const normalized = raw.replace(/\s+/g, '-').replace(/_/g, '_');
  if (QUESTION_TYPES.has(normalized)) return normalized;
  if (normalized === 'critical_thinking') return 'critical-thinking';
  if (normalized === 'best-practice') return 'best_practice';
  const fallbackRaw = String(fallback || '').trim().toLowerCase();
  if (QUESTION_TYPES.has(fallbackRaw)) return fallbackRaw;
  if (fallbackRaw === 'critical_thinking') return 'critical-thinking';
  if (fallbackRaw === 'best-practice') return 'best_practice';
  return 'application';
}

function inferLanguage(preferred: unknown, courseId: unknown, lessonId: unknown): string {
  const known = new Set(['hu', 'en', 'es', 'pt', 'id', 'pl', 'ru', 'sv', 'vi', 'ar', 'bg']);
  const normalized = String(preferred || '').trim().toLowerCase();
  const tokens = [String(courseId || ''), String(lessonId || '')];
  for (const token of tokens) {
    const parts = token.split(/[_-]/).map((part) => part.trim().toLowerCase()).filter(Boolean);
    for (let index = parts.length - 1; index >= 0; index -= 1) {
      const value = parts[index];
      if (known.has(value)) return value;
    }
  }
  if (known.has(normalized)) return normalized;
  return normalized || 'en';
}

type LiveCandidate = {
  kind: 'lesson' | 'question';
  sortAudited: string | null;
  lesson?: LiveLessonRecord;
  question?: LiveQuestionRecord;
};

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  let currentKey: string | null = null;
  for (const value of argv) {
    if (value.startsWith('--')) {
      currentKey = value.slice(2);
      args[currentKey] = '';
      continue;
    }
    if (currentKey) {
      args[currentKey] = value;
      currentKey = null;
    }
  }
  return args;
}

function normalizeQuestionDoc(
  question: Record<string, any>,
  lesson: Record<string, any> | null,
  course: Record<string, any> | null
): LiveQuestionRecord {
  const legacyOptions = Array.isArray(question.options) ? question.options.map((item: unknown) => String(item)) : [];
  const wrongAnswers = Array.isArray(question.wrongAnswers) ? question.wrongAnswers.map((item: unknown) => String(item)) : [];
  const fallbackOptions =
    typeof question.correctAnswer === 'string' && wrongAnswers.length > 0
      ? [String(question.correctAnswer), ...wrongAnswers.slice(0, 3)]
      : [];
  const options = legacyOptions.length > 0 ? legacyOptions : fallbackOptions;
  const correctIndex =
    typeof question.correctIndex === 'number'
      ? question.correctIndex
      : typeof question.correctAnswer === 'string'
        ? 0
        : -1;

  return {
    objectId: String(question._id),
    uuid: String(question.uuid || question._id),
    lessonId: String(question.lessonId || lesson?.lessonId || ''),
    courseObjectId: String(question.courseId || course?._id || ''),
    courseId: String(course?.courseId || ''),
    courseName: String(course?.name || course?.courseId || ''),
    language: inferLanguage(course?.language || lesson?.language, course?.courseId, lesson?.lessonId),
    dayNumber: Number(lesson?.dayNumber || 0),
    lessonTitle: String(lesson?.title || question.lessonId || ''),
    question: String(question.question || ''),
    options,
    correctIndex,
    questionType: String(question.questionType || ''),
    difficulty: String(question.difficulty || 'MEDIUM'),
    category: String(question.category || 'Course Specific'),
    hashtags: Array.isArray(question.hashtags) ? question.hashtags.map((item: unknown) => String(item)) : [],
    lastAuditedAt: question?.metadata?.auditedAt ? new Date(question.metadata.auditedAt).toISOString() : null,
  };
}

function normalizeLessonDoc(lesson: Record<string, any>, course: Record<string, any> | null): LiveLessonRecord {
  return {
    objectId: String(lesson._id),
    lessonId: String(lesson.lessonId || ''),
    courseObjectId: String(lesson.courseId || course?._id || ''),
    courseId: String(course?.courseId || ''),
    courseName: String(course?.name || course?.courseId || ''),
    language: inferLanguage(course?.language || lesson.language, course?.courseId, lesson.lessonId),
    dayNumber: Number(lesson.dayNumber || 0),
    title: String(lesson.title || ''),
    content: String(lesson.content || ''),
    emailSubject: String(lesson.emailSubject || ''),
    emailBody: String(lesson.emailBody || ''),
    lastAuditedAt: lesson?.metadata?.courseQualityAuditedAt ? new Date(lesson.metadata.courseQualityAuditedAt).toISOString() : null,
  };
}

async function buildCandidateBatch(limit: number) {
  await connectDB();
  const safeLimit = Math.max(1, Math.min(limit, 100));

  const activeCourses = await Course.find({ isActive: true })
    .select({ _id: 1, courseId: 1, name: 1, language: 1, isActive: 1 })
    .lean();
  const englishCourses = activeCourses.filter((course: any) => String(course.language || '').toLowerCase() === 'en');
  const courseMap = new Map(englishCourses.map((course: any) => [String(course._id), course]));
  const activeCourseIds = englishCourses.map((course: any) => course._id);

  const lessonSelect = {
    _id: 1,
    lessonId: 1,
    courseId: 1,
    language: 1,
    dayNumber: 1,
    title: 1,
    content: 1,
    emailSubject: 1,
    emailBody: 1,
    metadata: 1,
  };

  const questionSelect = {
    _id: 1,
    uuid: 1,
    lessonId: 1,
    courseId: 1,
    question: 1,
    options: 1,
    correctIndex: 1,
    correctAnswer: 1,
    wrongAnswers: 1,
    questionType: 1,
    difficulty: 1,
    category: 1,
    hashtags: 1,
    metadata: 1,
  };

  const [lessonsUnreviewedRaw, lessonsReviewedRaw, questionsUnreviewedRaw, questionsReviewedRaw] = await Promise.all([
    Lesson.find({
      isActive: true,
      courseId: { $in: activeCourseIds },
      $or: [{ 'metadata.courseQualityAuditedAt': { $exists: false } }, { 'metadata.courseQualityAuditedAt': null }],
    })
      .select(lessonSelect)
      .sort({ updatedAt: 1, _id: 1 })
      .limit(safeLimit)
      .lean(),
    Lesson.find({
      isActive: true,
      courseId: { $in: activeCourseIds },
      'metadata.courseQualityAuditedAt': { $exists: true, $ne: null },
    })
      .select(lessonSelect)
      .sort({ 'metadata.courseQualityAuditedAt': 1, _id: 1 })
      .limit(safeLimit)
      .lean(),
    QuizQuestion.find({
      isActive: true,
      isCourseSpecific: true,
      courseId: { $in: activeCourseIds },
      $or: [{ 'metadata.auditedAt': { $exists: false } }, { 'metadata.auditedAt': null }],
    })
      .select(questionSelect)
      .sort({ 'metadata.updatedAt': 1, _id: 1 })
      .limit(safeLimit)
      .lean(),
    QuizQuestion.find({
      isActive: true,
      isCourseSpecific: true,
      courseId: { $in: activeCourseIds },
      'metadata.auditedAt': { $exists: true, $ne: null },
    })
      .select(questionSelect)
      .sort({ 'metadata.auditedAt': 1, _id: 1 })
      .limit(safeLimit)
      .lean(),
  ]);

  const lessonsUnreviewed = lessonsUnreviewedRaw.map((lesson: any) => normalizeLessonDoc(lesson, courseMap.get(String(lesson.courseId)) || null));
  const lessonsReviewed = lessonsReviewedRaw.map((lesson: any) => normalizeLessonDoc(lesson, courseMap.get(String(lesson.courseId)) || null));
  const lessonMap = new Map([...lessonsUnreviewed, ...lessonsReviewed].map((lesson) => [lesson.lessonId, lesson]));
  const reviewedLessonIds = new Set(lessonsReviewed.map((lesson) => String(lesson.lessonId || '')));

  const normalizeQuestion = (question: any) => {
    const course = courseMap.get(String(question.courseId)) || null;
    const lesson = lessonMap.get(String(question.lessonId || '')) || null;
    return normalizeQuestionDoc(question, lesson || null, course);
  };

  const questionsUnreviewed = questionsUnreviewedRaw
    .map(normalizeQuestion)
    .filter((question) => reviewedLessonIds.has(String(question.lessonId || '')));
  const questionsReviewed = questionsReviewedRaw
    .map(normalizeQuestion)
    .filter((question) => reviewedLessonIds.has(String(question.lessonId || '')));

  const candidates: LiveCandidate[] = [
    ...lessonsUnreviewed.map((lesson) => ({ kind: 'lesson' as const, sortAudited: null, lesson })),
    ...questionsUnreviewed.map((question) => ({ kind: 'question' as const, sortAudited: null, question })),
    ...lessonsReviewed.map((lesson) => ({ kind: 'lesson' as const, sortAudited: lesson.lastAuditedAt, lesson })),
    ...questionsReviewed.map((question) => ({ kind: 'question' as const, sortAudited: question.lastAuditedAt, question })),
  ];

  candidates.sort((left, right) => {
    const leftPriority = left.sortAudited ? 1 : 0;
    const rightPriority = right.sortAudited ? 1 : 0;
    if (leftPriority !== rightPriority) return leftPriority - rightPriority;
    const leftValue = left.sortAudited || '';
    const rightValue = right.sortAudited || '';
    if (leftValue !== rightValue) return leftValue.localeCompare(rightValue);
    const leftId = left.lesson?.objectId || left.question?.objectId || '';
    const rightId = right.lesson?.objectId || right.question?.objectId || '';
    return leftId.localeCompare(rightId);
  });

  return {
    generatedAt: new Date().toISOString(),
    counts: {
      courses: englishCourses.length,
      candidatePool: candidates.length,
    },
    candidates: candidates.slice(0, safeLimit).map((candidate) => {
      if (candidate.kind === 'lesson') {
        return { kind: 'lesson', lesson: candidate.lesson };
      }
      return { kind: 'question', question: candidate.question };
    }),
  };
}

async function scan() {
  const payload = await buildCandidateBatch(25);
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

async function nextBatch(limit: number) {
  const payload = await buildCandidateBatch(limit);
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

async function stats() {
  await connectDB();
  const [courses, lessons, questions] = await Promise.all([
    Course.countDocuments({ isActive: true }),
    Lesson.countDocuments({ isActive: true }),
    QuizQuestion.countDocuments({ isActive: true, isCourseSpecific: true }),
  ]);
  process.stdout.write(
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        counts: {
          courses,
          lessons,
          questions,
        },
      },
      null,
      2
    )}\n`
  );
}

function parseTaskKey(taskKey: string) {
  const [kind, objectId] = taskKey.split('::');
  if (!kind || !objectId) {
    throw new Error(`Invalid task key: ${taskKey}`);
  }
  if (kind !== 'lesson' && kind !== 'question') {
    throw new Error(`Unsupported task kind: ${kind}`);
  }
  return { kind, objectId };
}

async function fetchTask(taskKey: string) {
  await connectDB();
  const { kind, objectId } = parseTaskKey(taskKey);
  const lessonSelect = {
    _id: 1,
    lessonId: 1,
    courseId: 1,
    language: 1,
    dayNumber: 1,
    title: 1,
    content: 1,
    emailSubject: 1,
    emailBody: 1,
    metadata: 1,
  };
  const questionSelect = {
    _id: 1,
    uuid: 1,
    lessonId: 1,
    courseId: 1,
    question: 1,
    options: 1,
    correctIndex: 1,
    correctAnswer: 1,
    wrongAnswers: 1,
    questionType: 1,
    difficulty: 1,
    category: 1,
    hashtags: 1,
    metadata: 1,
  };

  const buildContext = async (
    courseDoc: Record<string, any>,
    lessonDoc: Record<string, any>,
    currentQuestionDoc: Record<string, any> | null = null
  ): Promise<LiveTaskContext> => {
    const courseLessonsRaw = await Lesson.find({
      isActive: true,
      courseId: (lessonDoc as any).courseId,
    })
      .select(lessonSelect)
      .sort({ dayNumber: 1, _id: 1 })
      .lean();
    const courseLessons = courseLessonsRaw.map((item: any) => normalizeLessonDoc(item, courseDoc));
    const currentIndex = courseLessons.findIndex((item) => item.objectId === String((lessonDoc as any)._id));
    const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex + 1 < courseLessons.length ? courseLessons[currentIndex + 1] : null;
    const siblingFilter: Record<string, unknown> = {
      isActive: true,
      isCourseSpecific: true,
      courseId: (lessonDoc as any).courseId,
      lessonId: (lessonDoc as any).lessonId,
    };
    if (currentQuestionDoc?._id) {
      siblingFilter._id = { $ne: currentQuestionDoc._id };
    }
    const siblingQuestionsRaw = await QuizQuestion.find(siblingFilter)
      .select(questionSelect)
      .sort({ _id: 1 })
      .limit(3)
      .lean();
    const siblingQuestions = siblingQuestionsRaw.map((item: any) => normalizeQuestionDoc(item, lessonDoc, courseDoc));
    return {
      previousLesson,
      nextLesson,
      siblingQuestions,
    };
  };

  if (kind === 'lesson') {
    const lessonDoc = await Lesson.findById(objectId).lean();
    if (!lessonDoc) throw new Error(`Lesson not found: ${objectId}`);
    const courseDoc = await Course.findById((lessonDoc as any).courseId).lean();
    if (!courseDoc) throw new Error(`Course not found for lesson: ${objectId}`);
    const lesson = normalizeLessonDoc(lessonDoc as any, courseDoc as any);
    const context = await buildContext(courseDoc as any, lessonDoc as any, null);
    process.stdout.write(
      `${JSON.stringify(
        {
          taskKey,
          kind,
          course: {
            objectId: String((courseDoc as any)._id),
            courseId: String((courseDoc as any).courseId),
            name: String((courseDoc as any).name || ''),
            language: String((courseDoc as any).language || 'en'),
          },
          lesson,
          context,
        },
        null,
        2
      )}\n`
    );
    return;
  }

  const questionDoc = await QuizQuestion.findById(objectId).lean();
  if (!questionDoc) throw new Error(`Question not found: ${objectId}`);
  const courseDoc = await Course.findById((questionDoc as any).courseId).lean();
  if (!courseDoc) throw new Error(`Course not found for question: ${objectId}`);
  const lessonDoc = await Lesson.findOne({
    lessonId: (questionDoc as any).lessonId,
    courseId: (questionDoc as any).courseId,
  }).lean();
  if (!lessonDoc) throw new Error(`Lesson not found for question: ${objectId}`);
  const lesson = normalizeLessonDoc(lessonDoc as any, courseDoc as any);
  const question = normalizeQuestionDoc(questionDoc as any, lessonDoc as any, courseDoc as any);
  const context = await buildContext(courseDoc as any, lessonDoc as any, questionDoc as any);
  process.stdout.write(
    `${JSON.stringify(
      {
        taskKey,
        kind,
        course: {
          objectId: String((courseDoc as any)._id),
          courseId: String((courseDoc as any).courseId),
          name: String((courseDoc as any).name || ''),
          language: String((courseDoc as any).language || 'en'),
        },
        lesson,
        question,
        context,
      },
      null,
      2
    )}\n`
  );
}

async function applyTask(taskKey: string, payloadFile: string, actor: string) {
  await connectDB();
  const { kind, objectId } = parseTaskKey(taskKey);
  const payload = JSON.parse(readFileSync(payloadFile, 'utf-8'));

  if (kind === 'lesson') {
    const now = new Date();
    const existingLesson = await Lesson.findById(objectId).lean();
    if (!existingLesson) throw new Error(`Lesson not found during apply: ${objectId}`);
    const courseDoc = await Course.findById((existingLesson as any).courseId).lean();
    const update: Record<string, unknown> = {};
    const title = String(payload.title || '').trim();
    const content = String(payload.content || '').trim();
    const emailSubject = String(payload.emailSubject || title).trim();
    let emailBody = String(payload.emailBody || '').trim();
    if (!emailBody) {
      if (content) {
        emailBody = content.slice(0, 500).trim();
      } else if (title) {
        emailBody = `## Today\n${title}`;
      }
    }
    const normalizedLessonPayload = {
      title,
      content,
      emailSubject,
      emailBody,
    };
    for (const key of ['title', 'content', 'emailSubject', 'emailBody'] as const) {
      if (normalizedLessonPayload[key] !== undefined) {
        update[key] = normalizedLessonPayload[key];
      }
    }
    if ((courseDoc as any)?.language) {
      update['language'] = (courseDoc as any).language;
    }
    update['metadata.courseQualityAuditedAt'] = now;
    update['metadata.courseQualityAuditedBy'] = actor;
    update['metadata.courseQualityUpdatedAt'] = now;
    update['metadata.courseQualityUpdatedBy'] = actor;
    const lessonDoc = await Lesson.findByIdAndUpdate(objectId, { $set: update }, { new: true, runValidators: true }).lean();
    if (!lessonDoc) throw new Error(`Lesson not found during apply: ${objectId}`);
    process.stdout.write(
      `${JSON.stringify(
        {
          success: true,
          taskKey,
          actor,
          lesson: normalizeLessonDoc(lessonDoc as any, (courseDoc as any) || null),
        },
        null,
        2
      )}\n`
    );
    return;
  }

  const now = new Date();
  const existingQuestion = await QuizQuestion.findById(objectId).lean();
  if (!existingQuestion) throw new Error(`Question not found during apply: ${objectId}`);
  const courseDoc = await Course.findById((existingQuestion as any).courseId).lean();
  const update: Record<string, unknown> = {
    'metadata.updatedAt': now,
    'metadata.updatedBy': actor,
    'metadata.auditedAt': now,
    'metadata.auditedBy': actor,
  };
  for (const key of ['question', 'options', 'correctIndex', 'questionType', 'difficulty', 'category', 'hashtags']) {
    if (payload[key] !== undefined) {
      update[key] = payload[key];
    }
  }
  update['difficulty'] = normalizeQuestionDifficulty(payload.difficulty, (existingQuestion as any).difficulty);
  update['category'] = normalizeQuestionCategory(payload.category, (existingQuestion as any).category);
  if ((courseDoc as any)?.language) {
    update['language'] = (courseDoc as any).language;
  }
  const questionDoc = await QuizQuestion.findByIdAndUpdate(objectId, { $set: update }, { new: true, runValidators: true }).lean();
  if (!questionDoc) throw new Error(`Question not found during apply: ${objectId}`);
  const lessonDoc = await Lesson.findOne({
    lessonId: (questionDoc as any).lessonId,
    courseId: (questionDoc as any).courseId,
  }).lean();
  process.stdout.write(
    `${JSON.stringify(
      {
        success: true,
        taskKey,
        actor,
        question: normalizeQuestionDoc(questionDoc as any, (lessonDoc as any) || null, (courseDoc as any) || null),
      },
      null,
      2
    )}\n`
  );
}

async function markReviewed(taskKey: string, actor: string, result: string) {
  await connectDB();
  const { kind, objectId } = parseTaskKey(taskKey);
  const now = new Date();

  if (kind === 'lesson') {
    const lessonDoc = await Lesson.findByIdAndUpdate(
      objectId,
      {
        $set: {
          'metadata.courseQualityAuditedAt': now,
          'metadata.courseQualityAuditedBy': actor,
          'metadata.courseQualityLastResult': result,
        },
      },
      { new: true, runValidators: true }
    ).lean();
    if (!lessonDoc) throw new Error(`Lesson not found during mark-reviewed: ${objectId}`);
    process.stdout.write(`${JSON.stringify({ success: true, taskKey, actor, result }, null, 2)}\n`);
    return;
  }

  const questionDoc = await QuizQuestion.findByIdAndUpdate(
    objectId,
    {
      $set: {
        'metadata.auditedAt': now,
        'metadata.auditedBy': actor,
      },
    },
    { new: true, runValidators: true }
  ).lean();
  if (!questionDoc) throw new Error(`Question not found during mark-reviewed: ${objectId}`);
  process.stdout.write(`${JSON.stringify({ success: true, taskKey, actor, result }, null, 2)}\n`);
}

async function importPackage(payloadFile: string, actor: string) {
  await connectDB();
  const pkg = JSON.parse(readFileSync(payloadFile, 'utf-8')) as Record<string, any>;
  const courseInfo = (pkg.course ?? {}) as Record<string, any>;
  const lessons = Array.isArray(pkg.lessons) ? (pkg.lessons as PackageLesson[]) : [];
  const courseId = String(courseInfo.courseId || '').trim();
  if (!courseId) throw new Error('Package import requires course.courseId');

  let brand = await Course.db.model('Brand').findOne({ slug: 'amanoba' }).lean();
  if (!brand) {
    brand = await Course.db.model('Brand').findOne({ name: 'Amanoba', isActive: true }).lean();
  }
  if (!brand) {
    throw new Error('Amanoba brand not found');
  }

  const now = new Date();
  const existingCourse = await Course.findOne({ courseId }).lean();
  const metadata = {
    ...(courseInfo.metadata && typeof courseInfo.metadata === 'object' ? courseInfo.metadata : {}),
    creatorImportedAt: now,
    creatorImportedBy: actor,
    draftOnly: true,
  };
  const courseSet: Record<string, unknown> = {
    courseId,
    name: String(courseInfo.name || courseId),
    description: String(courseInfo.description || ''),
    language: String(courseInfo.language || 'en').toLowerCase(),
    thumbnail: courseInfo.thumbnail ? String(courseInfo.thumbnail) : undefined,
    durationDays: Number(courseInfo.durationDays || 30),
    isActive: false,
    isDraft: true,
    requiresPremium: Boolean(courseInfo.requiresPremium),
    brandId: (brand as any)._id,
    ccsId: courseInfo.ccsId ? String(courseInfo.ccsId) : undefined,
    discussionEnabled: courseInfo.discussionEnabled !== undefined ? Boolean(courseInfo.discussionEnabled) : false,
    leaderboardEnabled: courseInfo.leaderboardEnabled !== undefined ? Boolean(courseInfo.leaderboardEnabled) : false,
    studyGroupsEnabled: courseInfo.studyGroupsEnabled !== undefined ? Boolean(courseInfo.studyGroupsEnabled) : false,
    quizMaxWrongAllowed: courseInfo.quizMaxWrongAllowed !== undefined ? Number(courseInfo.quizMaxWrongAllowed) : undefined,
    pointsConfig: courseInfo.pointsConfig || { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
    xpConfig: courseInfo.xpConfig || { completionXP: 500, lessonXP: 25 },
    metadata,
  };
  const course = await Course.findOneAndUpdate(
    { courseId },
    { $set: courseSet },
    { upsert: true, new: true, setDefaultsOnInsert: true, omitUndefined: true }
  );
  if (!course) throw new Error(`Failed to import course ${courseId}`);

  let lessonsCreated = 0;
  let lessonsUpdated = 0;
  let questionsCreated = 0;
  let questionsUpdated = 0;
  let questionsDeleted = 0;

  for (const lessonData of lessons) {
    const existingLesson = await Lesson.findOne({ lessonId: lessonData.lessonId }).lean();
    const lessonMetadata = {
      ...(lessonData.metadata && typeof lessonData.metadata === 'object' ? lessonData.metadata : {}),
      creatorImportedAt: now,
      creatorImportedBy: actor,
      creatorSource: 'amanoba_courses',
    };
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId: lessonData.lessonId },
      {
        $set: {
          lessonId: lessonData.lessonId,
          courseId: course._id,
          dayNumber: lessonData.dayNumber ?? 1,
          language: lessonData.language ?? course.language ?? 'en',
          title: lessonData.title ?? '',
          content: lessonData.content ?? '',
          emailSubject: lessonData.emailSubject ?? '',
          emailBody: lessonData.emailBody ?? '',
          quizConfig: lessonData.quizConfig ?? null,
          unlockConditions: lessonData.unlockConditions ?? {},
          pointsReward: lessonData.pointsReward ?? 10,
          xpReward: lessonData.xpReward ?? 5,
          isActive: false,
          displayOrder: lessonData.displayOrder ?? lessonData.dayNumber ?? 1,
          metadata: lessonMetadata,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true, omitUndefined: true }
    ).lean();
    if (!lesson) throw new Error(`Failed to import lesson ${lessonData.lessonId}`);
    if (existingLesson) lessonsUpdated += 1;
    else lessonsCreated += 1;

    const incomingQuestions = Array.isArray(lessonData.quizQuestions) ? lessonData.quizQuestions : [];
    const incomingUuids = incomingQuestions.map((item) => String(item.uuid || '')).filter(Boolean);
    const deleteResult = await QuizQuestion.deleteMany({
      courseId: course._id,
      lessonId: lessonData.lessonId,
      isCourseSpecific: true,
      ...(incomingUuids.length ? { uuid: { $nin: incomingUuids } } : {}),
    });
    questionsDeleted += Number(deleteResult.deletedCount || 0);

    for (let index = 0; index < incomingQuestions.length; index += 1) {
      const questionData = incomingQuestions[index] || {};
      const uuid = String(questionData.uuid || `${lessonData.lessonId}-q${index + 1}`);
      const existingQuestion = await QuizQuestion.findOne({ uuid }).lean();
      const options = Array.isArray(questionData.options) ? questionData.options.map((item) => String(item)) : [];
      const questionMetadata = {
        ...(((existingQuestion as any)?.metadata || {}) as Record<string, unknown>),
        updatedAt: now,
        updatedBy: actor,
        creatorImportedAt: now,
        creatorImportedBy: actor,
      };
      const questionDoc = await QuizQuestion.findOneAndUpdate(
        { uuid },
        {
          $set: {
            uuid,
            question: String(questionData.question || ''),
            options,
            correctIndex: Number(questionData.correctIndex ?? 0),
            difficulty: String(questionData.difficulty || 'MEDIUM'),
            category: String(questionData.category || 'Course Specific'),
            isActive: false,
            lessonId: lessonData.lessonId,
            courseId: course._id,
            relatedCourseIds: [],
            isCourseSpecific: true,
            hashtags: Array.isArray(questionData.hashtags) ? questionData.hashtags.map((item) => String(item)) : [],
            questionType: normalizeQuestionType(questionData.questionType) || 'application',
            metadata: questionMetadata,
          },
          $setOnInsert: {
            showCount: 0,
            correctCount: 0,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true, omitUndefined: true }
      ).lean();
      if (!questionDoc) throw new Error(`Failed to import question ${uuid}`);
      if (existingQuestion) questionsUpdated += 1;
      else questionsCreated += 1;
    }
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        success: true,
        action: 'import-package',
        actor,
        course: {
          courseId,
          objectId: String((course as any)._id),
          isDraft: Boolean((course as any).isDraft ?? true),
          isActive: Boolean((course as any).isActive ?? false),
        },
        counts: {
          lessonsCreated,
          lessonsUpdated,
          questionsCreated,
          questionsUpdated,
          questionsDeleted,
        },
        existed: Boolean(existingCourse),
      },
      null,
      2
    )}\n`
  );
}

async function publishCourse(courseId: string, actor: string) {
  await connectDB();
  const now = new Date();
  const course = await Course.findOneAndUpdate(
    { courseId },
    {
      $set: {
        isDraft: false,
        isActive: true,
        'metadata.creatorPublishedAt': now,
        'metadata.creatorPublishedBy': actor,
      },
    },
    { new: true, runValidators: true }
  ).lean();
  if (!course) throw new Error(`Course not found for publish: ${courseId}`);
  const lessonUpdate = await Lesson.updateMany(
    { courseId: (course as any)._id },
    {
      $set: {
        isActive: true,
        'metadata.creatorPublishedAt': now,
        'metadata.creatorPublishedBy': actor,
      },
    }
  );
  const questionUpdate = await QuizQuestion.updateMany(
    { courseId: (course as any)._id, isCourseSpecific: true },
    {
      $set: {
        isActive: true,
        'metadata.updatedAt': now,
        'metadata.updatedBy': actor,
        'metadata.creatorPublishedAt': now,
        'metadata.creatorPublishedBy': actor,
      },
    }
  );
  process.stdout.write(
    `${JSON.stringify(
      {
        success: true,
        action: 'publish-course',
        actor,
        course: {
          courseId: String((course as any).courseId),
          objectId: String((course as any)._id),
          isDraft: Boolean((course as any).isDraft ?? false),
          isActive: Boolean((course as any).isActive ?? true),
        },
        counts: {
          lessonsActivated: Number((lessonUpdate as any).modifiedCount || 0),
          questionsActivated: Number((questionUpdate as any).modifiedCount || 0),
        },
      },
      null,
      2
    )}\n`
  );
}

async function rollbackPublish(courseId: string, actor: string) {
  await connectDB();
  const now = new Date();
  const course = await Course.findOneAndUpdate(
    { courseId },
    {
      $set: {
        isDraft: true,
        isActive: false,
        'metadata.creatorRolledBackAt': now,
        'metadata.creatorRolledBackBy': actor,
      },
    },
    { new: true, runValidators: true }
  ).lean();
  if (!course) throw new Error(`Course not found for rollback: ${courseId}`);
  const lessonUpdate = await Lesson.updateMany(
    { courseId: (course as any)._id },
    {
      $set: {
        isActive: false,
        'metadata.creatorRolledBackAt': now,
        'metadata.creatorRolledBackBy': actor,
      },
    }
  );
  const questionUpdate = await QuizQuestion.updateMany(
    { courseId: (course as any)._id, isCourseSpecific: true },
    {
      $set: {
        isActive: false,
        'metadata.updatedAt': now,
        'metadata.updatedBy': actor,
        'metadata.creatorRolledBackAt': now,
        'metadata.creatorRolledBackBy': actor,
      },
    }
  );
  process.stdout.write(
    `${JSON.stringify(
      {
        success: true,
        action: 'rollback-publish',
        actor,
        course: {
          courseId: String((course as any).courseId),
          objectId: String((course as any)._id),
          isDraft: Boolean((course as any).isDraft ?? true),
          isActive: Boolean((course as any).isActive ?? false),
        },
        counts: {
          lessonsDeactivated: Number((lessonUpdate as any).modifiedCount || 0),
          questionsDeactivated: Number((questionUpdate as any).modifiedCount || 0),
        },
      },
      null,
      2
    )}\n`
  );
}

async function deleteImportedCourse(courseId: string, actor: string) {
  await connectDB();
  const course = await Course.findOne({ courseId });
  if (!course) throw new Error(`Course not found for delete: ${courseId}`);
  const courseObjectId = (course as any)._id;
  const [lessonsDeleted, quizQuestionsDeleted] = await Promise.all([
    Lesson.deleteMany({ courseId: courseObjectId }),
    QuizQuestion.deleteMany({ courseId: courseObjectId, isCourseSpecific: true }),
  ]);
  await Course.findByIdAndDelete(courseObjectId);
  process.stdout.write(
    `${JSON.stringify(
      {
        success: true,
        action: 'delete-imported-course',
        actor,
        course: {
          courseId,
          objectId: String(courseObjectId),
        },
        counts: {
          lessonsDeleted: Number((lessonsDeleted as any).deletedCount || 0),
          questionsDeleted: Number((quizQuestionsDeleted as any).deletedCount || 0),
        },
      },
      null,
      2
    )}\n`
  );
}

async function main() {
  const [,, command, ...rest] = process.argv;
  const args = parseArgs(rest);

  try {
    if (command === 'scan') {
      await scan();
      return;
    }
    if (command === 'next-batch') {
      await nextBatch(Number(args.limit || '25'));
      return;
    }
    if (command === 'stats') {
      await stats();
      return;
    }
    if (command === 'fetch') {
      if (!args['task-key']) throw new Error('Missing --task-key');
      await fetchTask(args['task-key']);
      return;
    }
    if (command === 'apply') {
      if (!args['task-key']) throw new Error('Missing --task-key');
      if (!args['payload-file']) throw new Error('Missing --payload-file');
      await applyTask(args['task-key'], args['payload-file'], args.actor || 'course-quality-daemon');
      return;
    }
    if (command === 'mark-reviewed') {
      if (!args['task-key']) throw new Error('Missing --task-key');
      await markReviewed(args['task-key'], args.actor || 'course-quality-daemon', args.result || 'valid');
      return;
    }
    if (command === 'import-package') {
      if (!args['payload-file']) throw new Error('Missing --payload-file');
      await importPackage(args['payload-file'], args.actor || 'course-quality-daemon');
      return;
    }
    if (command === 'publish-course') {
      if (!args['course-id']) throw new Error('Missing --course-id');
      await publishCourse(args['course-id'], args.actor || 'course-quality-daemon');
      return;
    }
    if (command === 'rollback-publish') {
      if (!args['course-id']) throw new Error('Missing --course-id');
      await rollbackPublish(args['course-id'], args.actor || 'course-quality-daemon');
      return;
    }
    if (command === 'delete-imported-course') {
      if (!args['course-id']) throw new Error('Missing --course-id');
      await deleteImportedCourse(args['course-id'], args.actor || 'course-quality-daemon');
      return;
    }
    throw new Error(`Unknown command: ${command}`);
  } finally {
    await disconnectDB();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
