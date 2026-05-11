import { beforeEach, describe, expect, it, vi } from 'vitest';

type ProgressRecord = {
  _id: string;
  playerId: { _id: { toString(): string }; email: string; emailPreferences?: { receiveLessonEmails?: boolean } };
  courseId: {
    _id: { toString(): string };
    isActive: boolean;
    parentCourseId?: string;
    selectedLessonIds?: unknown[];
  };
  currentDay: number;
  emailSentDays: number[];
  status: string;
  completedAt?: Date;
  metadata?: { lastEmailSentAt?: Date };
  save: ReturnType<typeof vi.fn>;
};

const connectDBMock = vi.fn().mockResolvedValue(undefined);
const sendLessonEmailMock = vi.fn();
const resolveLessonForChildDayMock = vi.fn();
const lessonFindOneMock = vi.fn();
const courseProgressFindMock = vi.fn();
const loggerInfoMock = vi.fn();
const loggerWarnMock = vi.fn();
const loggerErrorMock = vi.fn();

vi.mock('@/lib/mongodb', () => ({
  default: connectDBMock,
}));

vi.mock('@/lib/email/email-service', () => ({
  sendLessonEmail: sendLessonEmailMock,
  sendReminderEmail: vi.fn(),
}));

vi.mock('@/lib/course-helpers', () => ({
  resolveLessonForChildDay: resolveLessonForChildDayMock,
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: loggerInfoMock,
    warn: loggerWarnMock,
    error: loggerErrorMock,
  },
}));

vi.mock('@/lib/models', () => ({
  CourseProgressStatus: {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    ABANDONED: 'abandoned',
  },
  CourseProgress: {
    find: courseProgressFindMock,
  },
  Lesson: {
    findOne: lessonFindOneMock,
  },
}));

function makeProgressRecord(params: {
  progressId: string;
  playerId: string;
  courseId: string;
  currentDay: number;
  emailSentDays?: number[];
  status?: string;
  completedAt?: Date;
}): ProgressRecord {
  return {
    _id: params.progressId,
    playerId: {
      _id: { toString: () => params.playerId },
      email: `${params.playerId}@example.com`,
    },
    courseId: {
      _id: { toString: () => params.courseId },
      isActive: true,
    },
    currentDay: params.currentDay,
    emailSentDays: [...(params.emailSentDays ?? [])],
    status: params.status ?? 'in_progress',
    completedAt: params.completedAt,
    metadata: {},
    save: vi.fn().mockResolvedValue(undefined),
  };
}

describe('sendDailyLessons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendLessonEmailMock.mockResolvedValue({ success: true, messageId: 'msg-1' });
    resolveLessonForChildDayMock.mockResolvedValue(null);
    lessonFindOneMock.mockResolvedValue({
      _id: 'lesson-1',
      dayNumber: 1,
      title: 'Lesson',
      content: 'Body',
      emailSubject: 'Subject',
      emailBody: 'Email body',
    });
  });

  it('sends one lesson email per enrolled course and dedupes reruns by course/day', async () => {
    const progressA = makeProgressRecord({
      progressId: 'progress-a',
      playerId: 'player-1',
      courseId: 'course-a',
      currentDay: 2,
    });
    const progressB = makeProgressRecord({
      progressId: 'progress-b',
      playerId: 'player-1',
      courseId: 'course-b',
      currentDay: 5,
    });

    courseProgressFindMock.mockReturnValue({
      populate: vi.fn().mockResolvedValue([progressA, progressB]),
    });

    const { sendDailyLessons } = await import('@/lib/courses/email-scheduler');

    const firstRun = await sendDailyLessons(new Date('2026-05-10T08:00:00.000Z'));

    expect(courseProgressFindMock).toHaveBeenCalledWith({
      status: { $in: ['not_started', 'in_progress'] },
    });
    expect(sendLessonEmailMock).toHaveBeenCalledTimes(2);
    expect(sendLessonEmailMock).toHaveBeenNthCalledWith(
      1,
      'player-1',
      'course-a',
      expect.objectContaining({ dayNumber: 1 }),
      undefined,
      undefined
    );
    expect(sendLessonEmailMock).toHaveBeenNthCalledWith(
      2,
      'player-1',
      'course-b',
      expect.objectContaining({ dayNumber: 1 }),
      undefined,
      undefined
    );
    expect(progressA.emailSentDays).toEqual([2]);
    expect(progressB.emailSentDays).toEqual([5]);
    expect(progressA.save).toHaveBeenCalledTimes(1);
    expect(progressB.save).toHaveBeenCalledTimes(1);
    expect(firstRun).toMatchObject({
      success: true,
      sent: 2,
      skipped: 0,
      errors: 0,
    });

    const secondRun = await sendDailyLessons(new Date('2026-05-10T08:00:00.000Z'));

    expect(sendLessonEmailMock).toHaveBeenCalledTimes(2);
    expect(progressA.save).toHaveBeenCalledTimes(1);
    expect(progressB.save).toHaveBeenCalledTimes(1);
    expect(secondRun).toMatchObject({
      success: true,
      sent: 0,
      skipped: 2,
      errors: 0,
    });
    expect(secondRun.details).toEqual([
      { playerId: 'player-1', courseId: 'course-a', day: 2, status: 'skipped_already_sent' },
      { playerId: 'player-1', courseId: 'course-b', day: 5, status: 'skipped_already_sent' },
    ]);
  });

  it('skips completed progress rows even if they slip through the active query', async () => {
    const completedProgress = makeProgressRecord({
      progressId: 'progress-c',
      playerId: 'player-2',
      courseId: 'course-c',
      currentDay: 7,
      status: 'completed',
      completedAt: new Date('2026-05-09T08:00:00.000Z'),
    });

    courseProgressFindMock.mockReturnValue({
      populate: vi.fn().mockResolvedValue([completedProgress]),
    });

    const { sendDailyLessons } = await import('@/lib/courses/email-scheduler');
    const result = await sendDailyLessons(new Date('2026-05-10T08:00:00.000Z'));

    expect(sendLessonEmailMock).not.toHaveBeenCalled();
    expect(completedProgress.save).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      success: true,
      sent: 0,
      skipped: 1,
      errors: 0,
    });
    expect(result.details).toEqual([
      { playerId: 'player-2', courseId: 'course-c', day: 7, status: 'skipped_inactive_progress' },
    ]);
  });
});
