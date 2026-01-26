export type LessonQualityIssue =
  | 'TOO_SHORT'
  | 'NO_CLEAR_DEFINITIONS'
  | 'NO_ACTIONABLE_STEPS'
  | 'NO_EXAMPLES'
  | 'NO_CONTRASTS_GOOD_BAD'
  | 'NO_METRICS_OR_CRITERIA'
  | 'LANGUAGE_MISMATCH_SUSPECTED';

export interface LessonQualityResult {
  score: number; // 0-100
  issues: LessonQualityIssue[];
  signals: {
    charCount: number;
    wordCount: number;
    hasBullets: boolean;
    hasNumberedSteps: boolean;
    hasExamples: boolean;
    hasGoodBadContrast: boolean;
    hasMetricsOrCriteria: boolean;
    hasDefinitionsOrComparisons: boolean;
  };
  refineTemplate: {
    addDefinitionSection: boolean;
    addChecklistSection: boolean;
    addExamplesSection: boolean;
    addPitfallsSection: boolean;
    addMetricsSection: boolean;
  };
}

function stripHtml(input: string) {
  return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(s: string) {
  const parts = s.split(/\s+/).filter(Boolean);
  return parts.length;
}

function hasAny(sLower: string, needles: string[]) {
  return needles.some(n => sLower.includes(n));
}

export function assessLessonQuality(params: {
  title: string;
  content: string;
  language: string;
}): LessonQualityResult {
  const clean = stripHtml(params.content || '');
  const lower = clean.toLowerCase();
  const charCount = clean.length;
  const wordCount = countWords(clean);

  // Heuristic signals (language-agnostic with some multilingual keywords)
  const hasBullets = /(\n|\s)[-•]\s/.test(params.content) || /<li\b/i.test(params.content);
  const hasNumberedSteps =
    /(\n|\s)\d+\.\s/.test(clean) ||
    /step\s+\d+/i.test(clean) ||
    hasAny(lower, ['lépés', 'шаг', 'passo', 'adım', 'कदम', 'bước', 'langkah']);
  const hasExamples = hasAny(lower, [
    'example',
    'examples',
    'e.g.',
    'for example',
    'példa',
    'példák',
    'пример',
    'örnek',
    'przykład',
    'ví dụ',
    'contoh',
    'exemplo',
    'उदाहरण',
  ]);
  const hasGoodBadContrast = hasAny(lower, [
    'good',
    'poor',
    'bad',
    '✅',
    '❌',
    'jó',
    'rossz',
    'плохо',
    'хорошо',
    'iyi',
    'kötü',
  ]);
  const hasMetricsOrCriteria = hasAny(lower, [
    'kpi',
    'metric',
    'metrics',
    'criteria',
    'threshold',
    'inclusion',
    'citation',
    'consistency',
    'kritérium',
    'mér',
    'показател',
    'критер',
  ]);
  const hasDefinitionsOrComparisons = hasAny(lower, [
    'definition',
    'means',
    'vs',
    'versus',
    'difference',
    'what it is',
    'what it is not',
    'mit jelent',
    'különbség',
    'что такое',
    'что не',
    'разница',
  ]);

  // Very rough language mismatch heuristic: if lesson language is non-en but content is mostly ASCII
  const nonAsciiCount = (clean.match(/[^\x00-\x7F]/g) || []).length;
  const asciiRatio = charCount > 0 ? (charCount - nonAsciiCount) / charCount : 1;
  const languageMismatchSuspected =
    params.language.toLowerCase() !== 'en' && asciiRatio > 0.98 && wordCount > 80;

  const issues: LessonQualityIssue[] = [];
  if (charCount < 900 || wordCount < 160) issues.push('TOO_SHORT');
  if (!hasDefinitionsOrComparisons) issues.push('NO_CLEAR_DEFINITIONS');
  if (!hasNumberedSteps && !hasBullets) issues.push('NO_ACTIONABLE_STEPS');
  if (!hasExamples) issues.push('NO_EXAMPLES');
  if (!hasGoodBadContrast) issues.push('NO_CONTRASTS_GOOD_BAD');
  if (!hasMetricsOrCriteria) issues.push('NO_METRICS_OR_CRITERIA');
  if (languageMismatchSuspected) issues.push('LANGUAGE_MISMATCH_SUSPECTED');

  // Score (simple weighted heuristic)
  let score = 100;
  const penalties: Record<LessonQualityIssue, number> = {
    TOO_SHORT: 25,
    NO_CLEAR_DEFINITIONS: 15,
    NO_ACTIONABLE_STEPS: 15,
    NO_EXAMPLES: 15,
    NO_CONTRASTS_GOOD_BAD: 10,
    NO_METRICS_OR_CRITERIA: 15,
    LANGUAGE_MISMATCH_SUSPECTED: 20,
  };
  for (const issue of issues) score -= penalties[issue];
  if (score < 0) score = 0;

  const refineTemplate = {
    addDefinitionSection: issues.includes('NO_CLEAR_DEFINITIONS'),
    addChecklistSection: issues.includes('NO_ACTIONABLE_STEPS'),
    addExamplesSection: issues.includes('NO_EXAMPLES') || issues.includes('NO_CONTRASTS_GOOD_BAD'),
    addPitfallsSection: issues.includes('NO_CONTRASTS_GOOD_BAD'),
    addMetricsSection: issues.includes('NO_METRICS_OR_CRITERIA'),
  };

  return {
    score,
    issues,
    signals: {
      charCount,
      wordCount,
      hasBullets,
      hasNumberedSteps,
      hasExamples,
      hasGoodBadContrast,
      hasMetricsOrCriteria,
      hasDefinitionsOrComparisons,
    },
    refineTemplate,
  };
}

