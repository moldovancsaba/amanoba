import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export type CanonicalLessonSpec = {
  dayNumber?: number;
  canonicalTitle?: string;
  title?: string;
  objective?: string;
  keyConcepts?: string[];
  exercise?: string;
  deliverable?: string;
  sources?: string[];
  estimatedMinutes?: number;
  hasQuiz?: boolean;
};

export type CanonicalSpec = {
  language?: string;
  lessons?: CanonicalLessonSpec[];
};

function loadCanonicalSpec(ccsId?: string): CanonicalSpec | null {
  if (!ccsId) return null;
  const specPath = resolve(process.cwd(), 'docs', 'canonical', ccsId, `${ccsId}.canonical.json`);
  if (!existsSync(specPath)) {
    return null;
  }

  try {
    const raw = readFileSync(specPath, 'utf-8');
    return JSON.parse(raw) as CanonicalSpec;
  } catch (error) {
    console.error(`Failed to parse canonical spec for ${ccsId}:`, error);
    return null;
  }
}

function languageMatches(specLang?: string, courseLang?: string): boolean {
  if (!specLang || !courseLang) return true;
  return specLang.toLowerCase() === courseLang.toLowerCase();
}

export function canonicalLessonSpecsForCourse(course: { ccsId?: string; language?: string }) {
  const spec = loadCanonicalSpec(course.ccsId);
  if (!spec) return [];
  if (!languageMatches(spec.language, course.language)) return [];
  return (spec.lessons ?? [])
    .filter((lesson): lesson is CanonicalLessonSpec & { dayNumber: number } => typeof lesson.dayNumber === 'number')
    .sort((a, b) => a.dayNumber - b.dayNumber);
}

export function canonicalLessonForDay(course: { ccsId?: string; language?: string }, day: number) {
  const lessons = canonicalLessonSpecsForCourse(course);
  return lessons.find((lesson) => lesson.dayNumber === day) ?? null;
}

function formatSources(sources: string[] = []) {
  if (!sources.length) return '';
  return `<h2>Sources</h2><ul>${sources
    .map((source) => `<li><a href="${source}" target="_blank" rel="noreferrer">${source}</a></li>`)
    .join('')}</ul>`;
}

export function buildCanonicalLessonContent(lesson: CanonicalLessonSpec) {
  const objectiveLine = lesson.objective ? `<p><strong>Objective:</strong> ${lesson.objective}</p>` : '';
  const keyConcepts =
    Array.isArray(lesson.keyConcepts) && lesson.keyConcepts.length
      ? `<h2>Key concepts</h2><ul>${lesson.keyConcepts.map((concept) => `<li>${concept}</li>`).join('')}</ul>`
      : '';
  const exercise = lesson.exercise ? `<h2>Exercise</h2><p>${lesson.exercise}</p>` : '';
  const deliverable = lesson.deliverable ? `<h2>Deliverable</h2><p>${lesson.deliverable}</p>` : '';
  const sources = formatSources(Array.isArray(lesson.sources) ? lesson.sources : []);
  return [
    `<h1>${lesson.canonicalTitle ?? lesson.title ?? `Day ${lesson.dayNumber ?? '?'}`}</h1>`,
    objectiveLine,
    keyConcepts,
    exercise,
    deliverable,
    sources,
  ]
    .filter(Boolean)
    .join('\n');
}
