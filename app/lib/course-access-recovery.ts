/**
 * Normalize course lesson/quiz access API errors into learner-facing recovery states.
 */

export type CourseAccessRecoveryAction = 'signin' | 'course' | 'retry' | 'continue';

export type CourseAccessRecoveryIssue = {
  status: number;
  code: string;
  title: string;
  message: string;
  action: CourseAccessRecoveryAction;
  continueDay?: number;
};

export type CourseAccessApiPayload = {
  success?: boolean;
  error?: string;
  code?: string;
  continueDay?: number;
};

type AccessCopy = {
  signInRequired: string;
  signInToContinueLesson: string;
  signInToContinueQuiz: string;
  lessonNotFound: string;
  courseNotFound: string;
  failedToLoadLesson: string;
  failedToLoad: string;
};

const ACCESS_COPY: Record<string, AccessCopy> = {
  en: {
    signInRequired: 'Sign in required',
    signInToContinueLesson: 'Sign in to continue this course from your saved progress.',
    signInToContinueQuiz: 'Sign in to take this lesson quiz and save your progress.',
    lessonNotFound: 'Lesson not found',
    courseNotFound: 'Course not found',
    failedToLoadLesson: 'Failed to load lesson',
    failedToLoad: 'The lesson could not be loaded. Retry the request or return to the course overview.',
  },
  hu: {
    signInRequired: 'Bejelentkezés szükséges',
    signInToContinueLesson: 'Jelentkezz be a kurzus folytatásához és a mentett haladásodhoz.',
    signInToContinueQuiz: 'Jelentkezz be a lecke kvíz kitöltéséhez és az eredmények mentéséhez.',
    lessonNotFound: 'Lecke nem található',
    courseNotFound: 'Kurzus nem található',
    failedToLoadLesson: 'Nem sikerült betölteni a leckét',
    failedToLoad: 'A lecke nem tölthető be. Próbáld újra, vagy térj vissza a kurzus oldalára.',
  },
  ar: {
    signInRequired: 'تسجيل الدخول مطلوب',
    signInToContinueLesson: 'سجّل الدخول لمتابعة هذه الدورة من تقدمك المحفوظ.',
    signInToContinueQuiz: 'سجّل الدخول لإجراء اختبار الدرس وحفظ تقدمك.',
    lessonNotFound: 'الدرس غير موجود',
    courseNotFound: 'الدورة غير موجودة',
    failedToLoadLesson: 'فشل تحميل الدرس',
    failedToLoad: 'تعذر تحميل الدرس. أعد المحاولة أو ارجع إلى صفحة الدورة.',
  },
};

function copyForLanguage(language: string): AccessCopy {
  return ACCESS_COPY[language] ?? ACCESS_COPY.en;
}

export function resolveCourseAccessIssue(
  status: number,
  payload: CourseAccessApiPayload,
  language: string,
  context: 'lesson' | 'quiz'
): CourseAccessRecoveryIssue {
  const copy = copyForLanguage(language);
  const code = payload.code ?? inferCode(status, payload.error);

  if (code === 'SIGN_IN_REQUIRED' || status === 401) {
    return {
      status: 401,
      code: 'SIGN_IN_REQUIRED',
      title: copy.signInRequired,
      message: context === 'quiz' ? copy.signInToContinueQuiz : copy.signInToContinueLesson,
      action: 'signin',
    };
  }

  if (code === 'COURSE_NOT_FOUND' || (status === 404 && payload.error === 'Course not found')) {
    return {
      status: 404,
      code: 'COURSE_NOT_FOUND',
      title: copy.courseNotFound,
      message: copy.courseNotFound,
      action: 'course',
    };
  }

  if (code === 'LESSON_NOT_FOUND' || (status === 404 && payload.error === 'Lesson not found')) {
    return {
      status: 404,
      code: 'LESSON_NOT_FOUND',
      title: copy.lessonNotFound,
      message: copy.lessonNotFound,
      action: 'course',
    };
  }

  if (code === 'INVALID_DAY_NUMBER' || payload.error === 'Invalid day number') {
    return {
      status,
      code: 'INVALID_DAY_NUMBER',
      title: copy.failedToLoadLesson,
      message: copy.failedToLoad,
      action: 'course',
    };
  }

  if (code === 'LESSON_LOCKED' && typeof payload.continueDay === 'number') {
    return {
      status: 403,
      code: 'LESSON_LOCKED',
      title: copy.lessonNotFound,
      message: copy.failedToLoadLesson,
      action: 'continue',
      continueDay: payload.continueDay,
    };
  }

  if (status === 0) {
    return {
      status: 0,
      code: 'NETWORK_ERROR',
      title: copy.failedToLoadLesson,
      message: copy.failedToLoad,
      action: 'retry',
    };
  }

  return {
    status,
    code: code || 'UNKNOWN',
    title: copy.failedToLoadLesson,
    message: payload.error || copy.failedToLoad,
    action: status === 404 ? 'course' : 'retry',
  };
}

function inferCode(status: number, error?: string): string {
  if (status === 401 || error === 'Unauthorized') return 'SIGN_IN_REQUIRED';
  if (status === 404 && error === 'Course not found') return 'COURSE_NOT_FOUND';
  if (status === 404 && error === 'Lesson not found') return 'LESSON_NOT_FOUND';
  if (status === 400 && error === 'Invalid day number') return 'INVALID_DAY_NUMBER';
  return 'UNKNOWN';
}
