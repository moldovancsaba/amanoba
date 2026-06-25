/**
 * Course automation helpers powered by local AI.
 *
 * What: Generate import-ready course packages and maintenance plans.
 * Why: Keep course creation and ongoing maintenance grounded in one reusable pipeline.
 */

import { randomUUID } from 'crypto';
import { chatJson, resolveLocalLLMProvider, type LocalLLMProvider } from './local-llm';
import { buildCourseQuizPolicyPackageFields } from '@/app/lib/course-quiz-policy';

export interface CourseCreationBrief {
  topic: string;
  language: string;
  courseId?: string;
  audience?: string;
  outcome?: string;
  days?: number;
  ccsId?: string;
  requiresPremium?: boolean;
  certificateEnabled?: boolean;
  tone?: string;
  seoFocus?: string;
}

export interface CourseAutomationLesson {
  lessonId: string;
  dayNumber: number;
  language: string;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
  quizQuestions?: Array<Record<string, unknown>>;
  pointsReward?: number;
  xpReward?: number;
  isActive?: boolean;
  displayOrder?: number;
  metadata?: Record<string, unknown>;
  translations?: Record<string, unknown>;
}

export interface CourseAutomationPackage {
  packageVersion: '2.0';
  version: '2.0';
  exportedAt: string;
  exportedBy: string;
  quizGovernance: {
    authority: 'course.lessonQuizPolicy';
    lessonQuizConfigRole: 'compatibility-only';
  };
  course: Record<string, unknown>;
  lessons: CourseAutomationLesson[];
  canonicalSpec: null;
  courseIdea: null;
}

export interface CourseMaintenanceInput {
  course: {
    courseId: string;
    name?: string;
    language?: string;
    durationDays?: number;
    isActive?: boolean;
    requiresPremium?: boolean;
    ccsId?: string;
    parentCourseId?: string;
    selectedLessonIds?: string[];
    lessonQuizPolicy?: Record<string, unknown>;
  };
  lessons: Array<{
    lessonId: string;
    dayNumber: number;
    title?: string;
    language?: string;
    isActive?: boolean;
    questionCount?: number;
    activeQuestionCount?: number;
    qualitySignals?: Record<string, unknown>;
  }>;
  summary?: Record<string, unknown>;
}

export interface CourseMaintenanceAction {
  priority: 'high' | 'medium' | 'low';
  type: 'question-regeneration' | 'lesson-refresh' | 'resync-child-course' | 'publish-review' | 'metadata-update';
  title: string;
  reason: string;
  autoFixAvailable: boolean;
}

export interface CourseMaintenancePlan {
  generatedAt: string;
  provider: LocalLLMProvider;
  courseId: string;
  summary: string;
  actions: CourseMaintenanceAction[];
  nextStep: string;
}

export interface CourseContentFixGroupInput {
  key: 'lesson-content' | 'quiz-quality' | 'certification' | 'structure';
  label: string;
  priority: 'high' | 'medium' | 'low';
  bullets: string[];
}

export interface CourseContentFixGroupPlan {
  key: CourseContentFixGroupInput['key'];
  label: string;
  priority: 'high' | 'medium' | 'low';
  summary: string;
  nextActions: string[];
  researchNotes: string[];
}

export interface CourseContentFixPlanInput {
  course: {
    courseId: string;
    name?: string;
    language?: string;
    updatedAt?: string;
  };
  selectionReason: string;
  groups: CourseContentFixGroupInput[];
}

export interface CourseContentFixPlan {
  generatedAt: string;
  provider: LocalLLMProvider;
  courseId: string;
  courseName?: string;
  teacherPersona: string;
  executiveSummary: string;
  groups: CourseContentFixGroupPlan[];
}

function normalizeCourseId(input: string, fallback = 'COURSE_AUTOGEN'): string {
  const trimmed = String(input || '').trim();
  if (!trimmed) return fallback;
  return trimmed
    .toUpperCase()
    .replace(/[^A-Z0-9_]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '') || fallback;
}

function normalizeDayCount(value: unknown, fallback: number): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric < 1) return fallback;
  return Math.floor(numeric);
}

function buildCreationSystemPrompt(): string {
  return [
    'You are Amanoba course architecture assistant.',
    'Return a strict JSON object only. No markdown, no prose, no code fences.',
    'Generate an import-ready course package for the Amanoba platform.',
    'The package must include packageVersion, version, quizGovernance, course, lessons, canonicalSpec=null, and courseIdea=null.',
    'Lessons must be practical, specific, and written in the course language.',
    'Every lesson must include visible Student tasks, Useful external sources, and Bibliography sections.',
    'External sources must be real, useful, topic-relevant links. Do not fabricate citations or URLs.',
    'Set lesson.quizQuestions to an empty array unless you are certain the questions are excellent.',
    'Set course.isActive to false because generated content should be reviewed before publishing.',
    'Use course.lessonQuizPolicy as the canonical quiz authority.',
    'Default lesson quiz policy: enabled=true, required=true, questionCount=5, shownAnswerCount=3, successThreshold=70.',
    'If certificateEnabled is requested, set course.certification.enabled=true and choose safe defaults.',
  ].join(' ');
}

function buildMaintenanceSystemPrompt(): string {
  return [
    'You are Amanoba course operations assistant.',
    'Return a strict JSON object only. No markdown, no prose, no code fences.',
    'Review the course snapshot and recommend the smallest safe maintenance plan.',
    'Prefer high-confidence, low-risk actions that improve lesson quality, quiz coverage, sync state, and publish readiness.',
    'Do not invent course changes that require new business approval.',
    'Use autoFixAvailable=true only for actions that can be safely automated with existing repo tooling.',
  ].join(' ');
}

function buildContentFixSystemPrompt(): string {
  return [
    'You are Amanoba course maintenance lead, acting like the best university professor in the topic and a serious business owner who cares about outcomes.',
    'Return a strict JSON object only. No markdown, no prose, no code fences.',
    'Rewrite the provided audit findings into issue-ready summaries without inventing facts.',
    'Keep the language practical, direct, and grounded in the evidence.',
    'Use research notes to identify what should be verified externally later, but do not fabricate citations.',
    'Prefer precise, task-oriented language that helps a GitHub issue turn into action quickly.',
  ].join(' ');
}

function courseShellFromBrief(brief: CourseCreationBrief) {
  const language = String(brief.language || 'hu').toLowerCase();
  const courseId = normalizeCourseId(brief.courseId || `${brief.topic}_course`);
  const lessonCount = normalizeDayCount(brief.days, 7);
  const quizPolicy = buildCourseQuizPolicyPackageFields({
    lessonQuizPolicy: {
      enabled: true,
      required: true,
      questionCount: 5,
      shownAnswerCount: 3,
      successThreshold: 70,
    },
  });

  return {
    packageVersion: '2.0' as const,
    version: '2.0' as const,
    exportedAt: new Date().toISOString(),
    exportedBy: 'app/lib/ai/course-automation',
    quizGovernance: {
      authority: 'course.lessonQuizPolicy' as const,
      lessonQuizConfigRole: 'compatibility-only' as const,
    },
    course: {
      courseId,
      name: brief.topic,
      description: brief.outcome || `A practical course about ${brief.topic}.`,
      language,
      durationDays: lessonCount,
      isActive: false,
      requiresPremium: brief.requiresPremium ?? false,
      pointsConfig: {
        completionPoints: 1000,
        lessonPoints: 50,
        perfectCourseBonus: 500,
      },
      xpConfig: {
        completionXP: 500,
        lessonXP: 25,
      },
      metadata: {
        category: brief.seoFocus || 'AI-assisted course',
        difficulty: 'beginner',
        estimatedHours: Math.max(2, lessonCount * 0.5),
        tags: ['course-automation', 'local-ai', 'amanoba'],
        instructor: 'Amanoba AI',
        audience: brief.audience || undefined,
        tone: brief.tone || undefined,
      },
      translations: {},
      discussionEnabled: false,
      leaderboardEnabled: false,
      studyGroupsEnabled: false,
      ccsId: brief.ccsId || undefined,
      lessonQuizPolicy: quizPolicy.lessonQuizPolicy,
      quizMaxWrongAllowed: quizPolicy.quizMaxWrongAllowed,
      defaultLessonQuizQuestionCount: quizPolicy.defaultLessonQuizQuestionCount,
      certification: brief.certificateEnabled
        ? {
            enabled: true,
            certQuestionCount: Math.max(10, Math.min(50, lessonCount * 2)),
            passThresholdPercent: 70,
            requireAllLessonsCompleted: true,
            requireAllQuizzesPassed: true,
            templateId: 'default_v1',
          }
        : {
            enabled: false,
          },
    },
    lessons: Array.from({ length: lessonCount }, (_, index) => {
      const dayNumber = index + 1;
      const lessonId = `${courseId}_DAY_${String(dayNumber).padStart(2, '0')}`;
      return {
        lessonId,
        dayNumber,
        language,
        title: `Lesson ${dayNumber}`,
        content: '',
        emailSubject: `Day ${dayNumber}: Lesson`,
        emailBody: '',
        quizQuestions: [],
        pointsReward: 50,
        xpReward: 25,
        isActive: true,
        displayOrder: dayNumber,
        metadata: {
          generatedBy: 'course-ai-autopilot',
          needsEditorialReview: true,
        },
        translations: {},
      } satisfies CourseAutomationLesson;
    }),
    canonicalSpec: null,
    courseIdea: null,
  };
}

function buildCreationPrompt(brief: CourseCreationBrief): string {
  const shell = courseShellFromBrief(brief);
  return [
    `Create a course package for this brief: ${JSON.stringify(brief)}`,
    `Use this shell as guidance: ${JSON.stringify(shell)}`,
    'Requirements:',
    '- Keep the course language consistent across course, lessons, and emails.',
    '- Produce practical lesson drafts with a clear learning progression.',
    '- Make each lesson title specific, not generic.',
    '- Each lesson content must include an intro, core explanation, a short recap, a Student tasks section with concrete learner work, a Useful external sources section, and a Bibliography section.',
    '- Use real, useful, topic-relevant external links only. If you cannot verify a source, omit it and mark the lesson for editorial review.',
    '- Leave quizQuestions as [] unless you can produce excellent course-specific questions without template language.',
    '- Keep the package import-ready for the existing import pipeline.',
    '- Return the full JSON package only.',
  ].join('\n');
}

function buildMaintenancePrompt(input: CourseMaintenanceInput): string {
  return [
    `Review this Amanoba course snapshot and recommend an action plan: ${JSON.stringify(input)}`,
    'Return JSON with: summary (string), actions (array of objects with priority, type, title, reason, autoFixAvailable), and nextStep (string).',
    'Focus on the smallest safe interventions:',
    '- question-regeneration when lessons have low or missing quiz coverage',
    '- lesson-refresh when content is stale or too generic',
    '- resync-child-course when selected lessons drift from the parent',
    '- metadata-update when course shell fields are incomplete',
    '- publish-review when the course is ready but not yet live',
    'Prefer actions that can be automated by the repo tooling and mark them autoFixAvailable=true.',
  ].join('\n');
}

export async function generateCoursePackage(brief: CourseCreationBrief, provider?: LocalLLMProvider): Promise<CourseAutomationPackage> {
  const shell = courseShellFromBrief(brief);
  const prompt = buildCreationPrompt(brief);
  const packageData = await chatJson<CourseAutomationPackage>({
    provider,
    system: buildCreationSystemPrompt(),
    user: prompt,
    temperature: 0.2,
  });

  const normalizedCourseId = normalizeCourseId(
    String(packageData?.course?.courseId || shell.course.courseId),
    shell.course.courseId as string
  );
  const lessonCount = normalizeDayCount(packageData?.course?.durationDays, shell.lessons.length);
  const lessons = Array.isArray(packageData?.lessons) ? packageData.lessons : [];

  return {
    packageVersion: '2.0',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    exportedBy: 'app/lib/ai/course-automation',
    quizGovernance: {
      authority: 'course.lessonQuizPolicy',
      lessonQuizConfigRole: 'compatibility-only',
    },
    course: {
      ...shell.course,
      ...packageData.course,
      courseId: normalizedCourseId,
      durationDays: lessonCount,
      isActive: false,
      lessonQuizPolicy: {
        enabled: true,
        required: true,
        questionCount: 5,
        shownAnswerCount: 3,
        successThreshold: 70,
        ...(typeof packageData?.course?.lessonQuizPolicy === 'object' ? packageData.course.lessonQuizPolicy : {}),
      },
      certification: packageData?.course?.certification || shell.course.certification,
    },
    lessons: shell.lessons.map((draftLesson, index) => {
      const lesson = lessons[index] || {};
      const dayNumber = normalizeDayCount(lesson.dayNumber, draftLesson.dayNumber);
      const lessonId = String(lesson.lessonId || draftLesson.lessonId || `${normalizedCourseId}_DAY_${String(dayNumber).padStart(2, '0')}`);
      return {
        ...draftLesson,
        ...lesson,
        lessonId,
        dayNumber,
        language: String(lesson.language || packageData.course.language || brief.language || 'hu').toLowerCase(),
        quizQuestions: Array.isArray(lesson.quizQuestions) ? lesson.quizQuestions : [],
        pointsReward: typeof lesson.pointsReward === 'number' ? lesson.pointsReward : draftLesson.pointsReward,
        xpReward: typeof lesson.xpReward === 'number' ? lesson.xpReward : draftLesson.xpReward,
        isActive: lesson.isActive !== undefined ? lesson.isActive : true,
        displayOrder: lesson.displayOrder ?? dayNumber,
        metadata: {
          ...(draftLesson.metadata || {}),
          ...(lesson.metadata || {}),
          generatedBy: 'course-ai-autopilot',
        },
        translations: lesson.translations || {},
      } satisfies CourseAutomationLesson;
    }).slice(0, lessonCount),
    canonicalSpec: null,
    courseIdea: null,
  };
}

export async function generateCourseMaintenancePlan(
  input: CourseMaintenanceInput,
  provider?: LocalLLMProvider
): Promise<CourseMaintenancePlan> {
  const plan = await chatJson<CourseMaintenancePlan>({
    provider,
    system: buildMaintenanceSystemPrompt(),
    user: buildMaintenancePrompt(input),
    temperature: 0.2,
  });

  return {
    generatedAt: new Date().toISOString(),
    provider: resolveLocalLLMProvider(provider),
    courseId: input.course.courseId,
    summary: String(plan.summary || 'Review complete.'),
    actions: Array.isArray(plan.actions)
      ? plan.actions.map((action) => ({
          priority: action.priority === 'low' ? 'low' : action.priority === 'medium' ? 'medium' : 'high',
          type:
            action.type === 'lesson-refresh' ||
            action.type === 'metadata-update' ||
            action.type === 'publish-review' ||
            action.type === 'resync-child-course' ||
            action.type === 'question-regeneration'
              ? action.type
              : 'metadata-update',
          title: String(action.title || 'Update course'),
          reason: String(action.reason || ''),
          autoFixAvailable: action.autoFixAvailable === true,
        }))
      : [],
    nextStep: String(plan.nextStep || 'Review the plan and apply low-risk fixes first.'),
  };
}

function buildContentFixPrompt(input: CourseContentFixPlanInput): string {
  return [
    `Audit this course maintenance packet and turn it into issue-ready summaries: ${JSON.stringify(input)}`,
    'Return JSON with: teacherPersona (string), executiveSummary (string), groups (array).',
    'Each group must include key, label, priority, summary, nextActions, and researchNotes.',
    'Use the provided bullets only; do not invent new findings.',
    'Keep summaries concise but specific enough that a GitHub issue can be created from them directly.',
    'If a finding needs external verification, put it in researchNotes rather than claiming it as already verified.',
  ].join('\n');
}

export async function generateCourseContentFixPlan(
  input: CourseContentFixPlanInput,
  provider?: LocalLLMProvider
): Promise<CourseContentFixPlan> {
  const plan = await chatJson<CourseContentFixPlan>({
    provider,
    system: buildContentFixSystemPrompt(),
    user: buildContentFixPrompt(input),
    temperature: 0.2,
  });

  const normalizedGroups = Array.isArray(plan.groups)
    ? plan.groups.map((group, index) => {
        const source = input.groups[index];
        const priority: 'high' | 'medium' | 'low' =
          group.priority === 'low' || group.priority === 'medium' || group.priority === 'high'
            ? group.priority
            : source?.priority || 'medium';

        return {
          key: source?.key || group.key,
          label: source?.label || String(group.label || group.key || 'Course audit'),
          priority,
          summary: String(group.summary || source?.bullets?.[0] || 'Review the grouped findings and make the smallest safe fix.'),
          nextActions: Array.isArray(group.nextActions)
            ? group.nextActions.map((item) => String(item).trim()).filter(Boolean)
            : [],
          researchNotes: Array.isArray(group.researchNotes)
            ? group.researchNotes.map((item) => String(item).trim()).filter(Boolean)
            : [],
        } satisfies CourseContentFixGroupPlan;
      })
    : [];

  return {
    generatedAt: new Date().toISOString(),
    provider: resolveLocalLLMProvider(provider),
    courseId: input.course.courseId,
    courseName: input.course.name,
    teacherPersona: String(plan.teacherPersona || 'A rigorous professor-practitioner focused on course quality and outcomes.'),
    executiveSummary: String(
      plan.executiveSummary ||
        'Weekly content review complete. The course should be updated where the evidence shows quality, quiz, or structure problems.'
    ),
    groups: normalizedGroups,
  };
}

export function createCourseDraftId(courseId: string, prefix = 'COURSE_DRAFT'): string {
  return `${normalizeCourseId(prefix)}_${normalizeCourseId(courseId)}_${randomUUID().slice(0, 8).toUpperCase()}`;
}
