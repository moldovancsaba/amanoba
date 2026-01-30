/**
 * Language Integrity (Lessons + Emails)
 *
 * Purpose:
 * - Prevent mixed-language content reaching users.
 * - Used both in audits (scripts) and at send-time (email delivery).
 *
 * Design notes:
 * - For non-Latin-script languages (bg/ru/ar/hi), we can enforce script ratio and reject long Latin segments.
 * - For HU (Latin script), we detect injected English sentences/bullets using heuristics:
 *   - lines dominated by ASCII words + common English stopwords/verbs
 *   - common English "instruction" line starters (Create / Scale / Avoid / Delegate / ...).
 *
 * This is intentionally conservative: we aim to catch obvious leaks, not perfect language detection.
 */

export type LanguageIntegrityFinding = {
  label: string;
  snippet: string;
};

export type LanguageIntegrityResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  findings: LanguageIntegrityFinding[];
};

function stripHtmlPreserveLines(input: string) {
  const s = String(input || '');
  return s
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n')
    .replace(/<\/\s*li\s*>/gi, '\n')
    .replace(/<\/\s*h[1-6]\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    // Drop handlebars-style placeholders (these are replaced at send/render time and should not trip language checks).
    .replace(/{{{?[^}]+}?}}/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function linesOf(text: string) {
  return String(text || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

function letterCount(text: string) {
  const letters = String(text || '').match(/\p{L}/gu) || [];
  return letters.length;
}

function ratioByRegex(text: string, re: RegExp) {
  const letters = String(text || '').match(/\p{L}/gu) || [];
  if (letters.length === 0) return 0;
  const matches = String(text || '').match(re) || [];
  return matches.length / letters.length;
}

const EN_STOPWORDS = new Set(
  [
    'the','an','and','or','but','to','of','in','on','for','with','by','from','as','at','into','over','under',
    'your','you','we','they','it','this','that','these','those',
    'is','are','was','were','be','being','been',
    'not','no','do','does','did','done',
    'can','could','should','would','will',
    'if','then','than','so','because','while','when','where','what','which','who','how','why',
  ]
);

const EN_INSTRUCTION_START = /^(create|scale|avoid|delegate|build|design|write|track|review|define|measure|choose|connect|plan|execute)\b/i;

function looksLikeInjectedEnglishLine(line: string) {
  const raw = String(line || '').trim();
  if (!raw) return false;
  if (raw.length < 20) return false;

  // Heuristic: if most letters are non-ASCII, it's unlikely to be English.
  // Do NOT early-return just because a line contains a few non-ASCII letters (e.g., a localized course name inside an otherwise-English sentence).
  const letters = raw.match(/\p{L}/gu) || [];
  if (letters.length > 0) {
    let nonAsciiLetterCount = 0;
    for (const ch of letters) {
      if (ch.codePointAt(0) && ch.codePointAt(0)! > 0x7f) nonAsciiLetterCount++;
    }
    const nonAsciiRatio = nonAsciiLetterCount / letters.length;
    if (nonAsciiRatio >= 0.4) return false;
  }

  // Obvious instruction starter (common leak shape).
  if (EN_INSTRUCTION_START.test(raw)) return true;

  const words = raw
    .toLowerCase()
    // Keep non-ASCII letters so we don't accidentally split words for languages like HU/PL.
    .replace(/[^\p{L}0-9\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 6) return false;

  const stopwordCount = words.filter(w => EN_STOPWORDS.has(w)).length;
  const stopwordRatio = stopwordCount / words.length;

  // A strong English-sentence signal: many stopwords and mostly ASCII.
  if (stopwordCount >= 3 && stopwordRatio >= 0.25) return true;

  // Common "English coaching" fragments seen in leaks.
  if (/\b(turning|repeatable|artifacts?|feedback loops?|bottleneck|capability|execution)\b/i.test(raw)) return true;

  return false;
}

// HU is a Latin-script language, so we cannot use script ratio. We detect injected English sentences/bullets.
// IMPORTANT: Hungarian has common tokens that overlap with English stopwords (e.g., "a", "be", "is").
// To reduce false positives (blocking valid HU content/emails), we exclude those overlaps when using the stopword heuristic.
const EN_STOPWORDS_HU = new Set(Array.from(EN_STOPWORDS).filter(w => w !== 'a' && w !== 'be' && w !== 'is'));

function looksLikeInjectedEnglishLineForHU(line: string) {
  const raw = String(line || '').trim();
  if (!raw) return false;
  if (raw.length < 20) return false;

  const letters = raw.match(/\p{L}/gu) || [];
  if (letters.length > 0) {
    let nonAsciiLetterCount = 0;
    for (const ch of letters) {
      if (ch.codePointAt(0) && ch.codePointAt(0)! > 0x7f) nonAsciiLetterCount++;
    }
    const nonAsciiRatio = nonAsciiLetterCount / letters.length;
    if (nonAsciiRatio >= 0.4) return false;
  }

  if (EN_INSTRUCTION_START.test(raw)) return true;

  const words = raw
    .toLowerCase()
    .replace(/[^\p{L}0-9\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 6) return false;

  const stopwordCount = words.filter(w => EN_STOPWORDS_HU.has(w)).length;
  const stopwordRatio = stopwordCount / words.length;

  if (stopwordCount >= 3 && stopwordRatio >= 0.25) return true;
  if (/\b(turning|repeatable|artifacts?|feedback loops?|bottleneck|capability|execution)\b/i.test(raw)) return true;

  return false;
}

function findEnglishLeakLinesForHU(text: string) {
  const findings: LanguageIntegrityFinding[] = [];
  const lines = linesOf(text);
  for (const line of lines) {
    if (looksLikeInjectedEnglishLineForHU(line)) {
      findings.push({ label: 'HU: English sentence/bullet detected', snippet: line.slice(0, 240) });
      if (findings.length >= 6) break;
    }
  }
  return findings;
}

function findLongLatinSegments(text: string, minLen: number) {
  const findings: LanguageIntegrityFinding[] = [];
  // Use Unicode Latin script, not just ASCII A–Z, so we catch Hungarian/Polish/etc.
  const re = new RegExp(`\\p{Script=Latin}{${minLen},}`, 'gu');
  const lines = linesOf(text);
  for (const line of lines) {
    if (re.test(line)) {
      findings.push({ label: `Latin segment >= ${minLen}`, snippet: line.slice(0, 240) });
      if (findings.length >= 6) break;
    }
  }
  return findings;
}

function findLongScriptSegments(params: { text: string; minLen: number; script: 'Cyrillic' | 'Arabic' | 'Devanagari' }) {
  const findings: LanguageIntegrityFinding[] = [];
  const { text, minLen, script } = params;
  const re = new RegExp(`\\p{Script=${script}}{${minLen},}`, 'gu');
  const lines = linesOf(text);
  for (const line of lines) {
    if (re.test(line)) {
      findings.push({ label: `${script} segment >= ${minLen}`, snippet: line.slice(0, 240) });
      if (findings.length >= 6) break;
    }
  }
  return findings;
}

export function validateLessonTextLanguageIntegrity(params: {
  language: string;
  text: string;
  contextLabel: string; // e.g., "lesson.content" or "emailBody"
}): LanguageIntegrityResult {
  const language = String(params.language || '').toLowerCase();
  const contextLabel = params.contextLabel || 'text';
  const rawText = stripHtmlPreserveLines(params.text || '');

  const result: LanguageIntegrityResult = { ok: true, errors: [], warnings: [], findings: [] };

  // EN: no strict gate beyond "not empty" (English can include non-ASCII terms).
  if (language === 'en') return result;

  // HU: Latin script language -> we cannot use script ratio. Detect injected English sentences/bullets.
  if (language === 'hu') {
    const englishLines = findEnglishLeakLinesForHU(rawText);
    if (englishLines.length) {
      result.ok = false;
      result.errors.push(`Language integrity failed for ${contextLabel}: detected injected English sentence(s) in HU.`);
      result.findings.push(...englishLines);
    }
    return result;
  }

  // BG/RU: require Cyrillic presence and reject long Latin segments.
  if (language === 'bg' || language === 'ru') {
    const letters = letterCount(rawText);
    if (letters > 0) {
      const cyrRatio = ratioByRegex(rawText, /[\u0400-\u04FF]/g);
      if (cyrRatio < 0.25) {
        result.ok = false;
        result.errors.push(`Language integrity failed for ${contextLabel}: expected Cyrillic text for ${language} (ratio ${cyrRatio.toFixed(2)}).`);
      }
    }
    const latinLeaks = findLongLatinSegments(rawText, 10);
    if (latinLeaks.length) {
      result.ok = false;
      result.errors.push(`Language integrity failed for ${contextLabel}: contains long Latin segments for ${language}.`);
      result.findings.push(...latinLeaks);
    }
    return result;
  }

  // AR: require Arabic presence and reject long Latin segments.
  if (language === 'ar') {
    const letters = letterCount(rawText);
    if (letters > 0) {
      const arRatio = ratioByRegex(rawText, /[\u0600-\u06FF]/g);
      if (arRatio < 0.25) {
        result.ok = false;
        result.errors.push(`Language integrity failed for ${contextLabel}: expected Arabic script (ratio ${arRatio.toFixed(2)}).`);
      }
    }
    // Arabic: be stricter, because even short injected Latin words are user-visible (e.g., wrong-locale button labels).
    const latinLeaks = findLongLatinSegments(rawText, 5);
    if (latinLeaks.length) {
      result.ok = false;
      result.errors.push(`Language integrity failed for ${contextLabel}: contains long Latin segments for Arabic.`);
      result.findings.push(...latinLeaks);
    }
    return result;
  }

  // HI: require Devanagari presence and reject long Latin segments.
  if (language === 'hi') {
    const letters = letterCount(rawText);
    if (letters > 0) {
      const hiRatio = ratioByRegex(rawText, /[\u0900-\u097F]/g);
      if (hiRatio < 0.25) {
        result.ok = false;
        result.errors.push(`Language integrity failed for ${contextLabel}: expected Devanagari script (ratio ${hiRatio.toFixed(2)}).`);
      }
    }
    const latinLeaks = findLongLatinSegments(rawText, 10);
    if (latinLeaks.length) {
      result.ok = false;
      result.errors.push(`Language integrity failed for ${contextLabel}: contains long Latin segments for Hindi.`);
      result.findings.push(...latinLeaks);
    }
    return result;
  }

  // Default for other non-EN languages (Latin script): hard gate on obvious injected English instruction lines.
  const englishLines = linesOf(rawText).filter(l => looksLikeInjectedEnglishLine(l));
  if (englishLines.length) {
    result.ok = false;
    result.errors.push(
      `Language integrity failed for ${contextLabel}: detected injected English instruction line(s) for ${language}.`
    );
    result.findings.push(
      ...englishLines.slice(0, 4).map(l => ({ label: 'Potential English line', snippet: l.slice(0, 240) }))
    );
  }

  // Also hard-gate on obvious non-Latin script injections inside Latin-script course content.
  // Example: Cyrillic (BG/RU) inside Polish, Arabic inside Portuguese, etc.
  const cyrillicLeaks = findLongScriptSegments({ text: rawText, minLen: 10, script: 'Cyrillic' });
  if (cyrillicLeaks.length) {
    result.ok = false;
    result.errors.push(`Language integrity failed for ${contextLabel}: contains Cyrillic segments for ${language}.`);
    result.findings.push(...cyrillicLeaks);
  }

  const arabicLeaks = findLongScriptSegments({ text: rawText, minLen: 10, script: 'Arabic' });
  if (arabicLeaks.length) {
    result.ok = false;
    result.errors.push(`Language integrity failed for ${contextLabel}: contains Arabic segments for ${language}.`);
    result.findings.push(...arabicLeaks);
  }

  const devanagariLeaks = findLongScriptSegments({ text: rawText, minLen: 10, script: 'Devanagari' });
  if (devanagariLeaks.length) {
    result.ok = false;
    result.errors.push(`Language integrity failed for ${contextLabel}: contains Devanagari segments for ${language}.`);
    result.findings.push(...devanagariLeaks);
  }

  return result;
}

export function validateLessonRecordLanguageIntegrity(params: {
  language: string;
  content?: string;
  emailSubject?: string | null;
  emailBody?: string | null;
}): LanguageIntegrityResult {
  const language = String(params.language || '').toLowerCase();
  const aggregate: LanguageIntegrityResult = { ok: true, errors: [], warnings: [], findings: [] };

  const parts: Array<{ label: string; text: string }> = [];
  parts.push({ label: 'lesson.content', text: String(params.content || '') });
  if (params.emailSubject) parts.push({ label: 'lesson.emailSubject', text: String(params.emailSubject || '') });
  if (params.emailBody) parts.push({ label: 'lesson.emailBody', text: String(params.emailBody || '') });

  for (const p of parts) {
    const r = validateLessonTextLanguageIntegrity({ language, text: p.text, contextLabel: p.label });
    if (!r.ok) aggregate.ok = false;
    aggregate.errors.push(...r.errors);
    aggregate.warnings.push(...r.warnings);
    aggregate.findings.push(...r.findings);
  }

  // De-duplicate errors/warnings
  aggregate.errors = Array.from(new Set(aggregate.errors));
  aggregate.warnings = Array.from(new Set(aggregate.warnings));

  return aggregate;
}
