export const COURSE_LANGUAGE_OPTIONS = [
  { code: 'hu', label: 'Hungarian' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Russian' },
  { code: 'tr', label: 'Turkish' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'pl', label: 'Polish' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'hi', label: 'Hindi' },
] as const;

export type CourseLanguageCode = (typeof COURSE_LANGUAGE_OPTIONS)[number]['code'];
