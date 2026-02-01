/**
 * Question Quality Validator
 *
 * Purpose: Validate questions meet all quality requirements before saving.
 * This ensures no generic templates, proper context, and educational value.
 *
 * Gold-standard criteria (see docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md):
 * Only questions that satisfy ALL of these are acceptable:
 * 1. Standalone — no "this course", "today", "the lesson".
 * 2. Grounded — tests what the lesson actually teaches (concepts, deliverables, procedures).
 * 3. Scenario-based — clear situation (who, context, stakes), not bare "What is X?".
 * 4. Concrete deliverable/outcome — asks for a specific artifact, step, or decision.
 * 5. Concrete distractors — wrong answers are plausible domain mistakes, not generic filler.
 *
 * This module enforces rejections (lesson/course refs, templates, vague options, etc.).
 * Generators and human authors must also ensure the positive criteria above.
 */

import { QuestionDifficulty, QuizQuestionType } from '../app/lib/models';

export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generic patterns that are completely unacceptable
 */
const UNACCEPTABLE_PATTERNS = {
  questions: [
    'What is a key concept from',
    'Mi a kulcsfontosságú koncepció',
    'Mi a fő célja a(z)',
    'Mit ellenőriznél a(z)',
    'Mi a következménye, ha a(z)',
    'Miért fontos a(z)',
    'Hogyan alkalmazod a(z)',
    'A(z) "',
    // Disallowed “refer back to lesson” questions (HU)
    'A leckében leírt',
    'A leckében szereplő',
    'A leckében bemutatott',
    'A leckében tanult',
    'leckében tanultak alapján',
    'témakörből',
    // Disallowed “refer back to lesson” questions (multi-language)
    'as described in the lesson',
    'described in the lesson',
    'follow the method described in the lesson',
    'в уроке',
    'как описано в уроке',
    'derste',
    'dersde',
    'w lekcji',
    'na lekcji',
    'na lição',
    'na aula',
    'bài học',
    'dalam pelajaran',
    'в урока',
    'في الدرس',
    'पाठ में',
    // Template patterns for "What does X mean in the context"
    'Mit jelent a "',
    'What does "',
    'Что означает "',
    'Ne anlama gelir "',
    'Co oznacza "',
    'O que significa "',
    'Có nghĩa là gì "',
    'Apa arti "',
    'Какво означава "',
    'का मतलब है "'
  ],
  answers: [
    'A fundamental principle related to this topic',
    'An advanced technique not covered here',
    'A completely unrelated concept',
    'A basic misunderstanding',
    'Egy alapvető elv, amely kapcsolódik ehhez a témához',
    'Egy fejlett technika, amelyet itt nem tárgyalunk',
    'Egy teljesen kapcsolatban nem álló koncepció',
    'Egy alapvető félreértés',
    // Generic template answers
    'A leckében részletesen magyarázott',
    'A leckében részletesen leírt',
    'specifikus definíció és használat',
    'The specific definition and usage',
    'Конкретное определение и использование',
    'Spesifik tanım ve kullanım',
    'Konkretna definicja i użycie',
    'Definição e uso específicos',
    'Định nghĩa và cách sử dụng cụ thể',
    'Definisi dan penggunaan spesifik',
    'Конкретна дефиниция и употреба',
    'विशिष्ट परिभाषा और उपयोग',
    // Disallowed “refer back to lesson” answers
    'as described in the lesson',
    'as described in detail in the lesson',
    'described in the lesson',
    'follow the method described in the lesson',
    // HU: common misspellings / variants
    'léckében leírt',
    'leckében leírt',
    'a leckében leírt',
    'a leckében szereplő',
    'a leckében bemutatott',
    'leckében részletesen leírt',
    // Disallowed meta “learning behavior” options (HU) — not educational answer choices
    'egyszerre próbálom ki mindent',
    'egyszerre mindent átállítok',
    'majd nem ellenőrzöm, mi romlott el',
    'várok, amíg mások megcsinálják',
    'megvárom, hogy valaki más',
    'csak olvasom, nem alkalmazom',
    'csak elolvasom, de nem építem be',
    // Too-generic low-information options (multi-language)
    'no significant impact',
    'no impact',
    'only matters theoretically',
    'only an optional element',
    'only optional',
    'only theoretical knowledge',
    'only general information',
    'no specific content',
    'not mentioned in the lesson',
    'nincs jelentős hatás',
    'nincs hatás',
    'csak elméleti',
    'csak opcionális',
    'csak általános',
    'nincs konkrét',
    'nem szerepel a leckében',
    'нет значительного влияния',
    'нет влияния',
    'только теоретически',
    'только опционально',
    'нет конкретного содержания',
    'не упоминается в уроке',
    'önemli bir etkisi yok',
    'sadece teorik',
    'sadece isteğe bağlı',
    'không có tác động đáng kể',
    'chỉ mang tính lý thuyết',
    'tidak ada dampak signifikan',
    'hanya penting secara teoritis',
    'sem impacto significativo',
    'apenas teoricamente',
    'لا تأثير كبير',
    'فقط نظريًا',
    'कोई महत्वपूर्ण प्रभाव नहीं',
    'सिर्फ सैद्धांतिक'
  ]
};

/**
 * "Non-educational meta distractor" detection: options that are meta about not trying,
 * outsourcing thinking, or obviously refusing to engage. These are not useful distractors.
 */
const META_DISTRACTOR_PATTERNS: Array<{ label: string; re: RegExp }> = [
  // HU
  { label: 'HU: wait for someone else', re: /\bmegvárom\b.*\b(valaki\s+más|más)\b/i },
  { label: 'HU: just read / not integrate', re: /\bcsak\b.*\belolvasom\b.*\bnem\b.*\bépítem\b/i },
  { label: 'HU: change everything then no check', re: /\begyszerre\b.*\bmindent\b.*\bátállít(om|ok)\b.*\bnem\b.*\bell(en|ő)rz(öm|ok)\b/i },

  // EN (generic)
  { label: 'EN: wait for someone else', re: /\b(wait|waiting)\b.*\b(someone else|others)\b/i },
  { label: 'EN: just read / not apply', re: /\bjust\b.*\bread\b.*\bnot\b.*\b(apply|implement)\b/i },
];

/**
 * Strong rule: no lesson-referential phrasing anywhere (questions or options).
 * This is intentionally broad and language-agnostic.
 */
const LESSON_REFERENCE_TOKENS: Array<{ label: string; re: RegExp }> = [
  // EN: avoid explicit “in/as described in the lesson” references (do not ban the word "lesson" alone)
  { label: 'EN: in/as described in the lesson', re: /\b(in|from|as)\s+(described\s+in\s+)?the\s+lesson\b/i },
  { label: 'EN: described/discussed in the lesson', re: /\b(described|discussed)\s+in\s+the\s+lesson\b/i },

  // HU
  { label: 'HU: a/az/lecke/leckében', re: /\b(a|az)\s+leck(ében|e)\b/i },
  { label: 'HU: leckében', re: /\bleckében\b/i },

  // RU
  { label: 'RU: в уроке', re: /\bв\s+уроке\b/i },
  { label: 'RU: как описано в уроке', re: /\bкак\s+описано\b.*\bв\s+уроке\b/i },

  // TR
  { label: 'TR: derste/dersde/ders içinde', re: /\b(derste|dersde|ders\s+içinde)\b/i },

  // PL
  { label: 'PL: w/na/z lekcji', re: /\b(w|na|z)\s+lekcji\b/i },

  // PT
  { label: 'PT: na lição/na aula', re: /\bna\s+(liç(ão|ões)|aula)\b/i },

  // VI
  { label: 'VI: trong bài học', re: /\btrong\s+bài\s*học\b/i },

  // ID
  { label: 'ID: dalam pelajaran', re: /\bdalam\s+pelajaran\b/i },

  // BG
  { label: 'BG: в урока/в уроке', re: /\bв\s+урок(а|е)\b/i },

  // AR
  { label: 'AR: في الدرس', re: /\bفي\s+الدرس\b/i },

  // HI
  { label: 'HI: पाठ में', re: /\bपाठ\s+में\b/i },
];

/**
 * Strong rule: no course-referential phrasing anywhere (questions or options).
 * Standalone means no “this course / the course / from the course” shortcuts.
 */
const COURSE_REFERENCE_TOKENS: Array<{ label: string; re: RegExp }> = [
  // EN
  { label: 'EN: this course / the course', re: /\b(this|the)\s+course\b/i },
  { label: 'EN: in/from the course', re: /\b(in|from)\s+the\s+course\b/i },
  { label: 'EN: throughout the program', re: /\bthrough(out|out)\s+the\s+(program|course)\b/i },

  // HU
  { label: 'HU: a kurzusban / ebből a kurzusból', re: /\b(kurzusban|ebből\s+a\s+kurzusból|a\s+kurzus)\b/i },

  // PL/PT/VI/ID/RU/BG/TR/AR/HI (lightweight, safe tokens)
  { label: 'PL: w tym kursie', re: /\bw\s+tym\s+kursie\b/i },
  { label: 'PT: neste curso', re: /\bneste\s+curso\b/i },
  { label: 'VI: trong khóa học', re: /\btrong\s+khóa\s+học\b/i },
  { label: 'ID: dalam kursus', re: /\bdalam\s+kursus\b/i },
  { label: 'RU: в этом курсе', re: /\bв\s+этом\s+курсе\b/i },
  { label: 'BG: в този курс', re: /\bв\s+този\s+курс\b/i },
  { label: 'TR: bu kursta', re: /\bbu\s+kursta\b/i },
  { label: 'AR: في هذه الدورة', re: /\bفي\s+هذه\s+(الدورة|دوره)\b/i },
  { label: 'HI: इस कोर्स में', re: /\bइस\s+कोर्स\s+में\b/i },
];

function tokenizeForOverlap(text: string) {
  const tokens = String(text || '')
    .toLowerCase()
    .match(/\p{L}[\p{L}\p{M}\p{N}_-]{2,}/gu);
  return tokens ? tokens.map(t => t.trim()).filter(Boolean) : [];
}

/**
 * Strong rule: reject “checklist snippet” questions like:
 * `A leckében leírt "✅ ..."` or any quoted text containing ✅ / …
 */
function hasChecklistSnippet(question: string) {
  const q = String(question || '');
  const quoted = q.match(/"([^"]+)"/);
  if (!quoted) return false;
  const inside = quoted[1];
  return /✅/.test(inside) || /\.\.\./.test(inside);
}

function languageScriptCheck(language: string, text: string): string | null {
  const lang = String(language || '').toLowerCase();
  const t = String(text || '');

  const letters = t.match(/\p{L}/gu) || [];
  if (letters.length === 0) return null;

  const ratio = (re: RegExp) => {
    const matches = t.match(re) || [];
    return matches.length / letters.length;
  };

  // For non-Latin script languages, require sufficient script presence and disallow long Latin segments.
  if (lang === 'bg' || lang === 'ru') {
    const cyrRatio = ratio(/[\u0400-\u04FF]/g);
    if (cyrRatio < 0.25) return `Language mismatch: expected Cyrillic text for ${lang} (too much Latin).`;
    if (/\p{Script=Latin}{10,}/u.test(t)) return `Language mismatch: contains long Latin segment for ${lang}.`;
  }
  if (lang === 'ar') {
    const arRatio = ratio(/[\u0600-\u06FF]/g);
    if (arRatio < 0.25) return 'Language mismatch: expected Arabic script (too much Latin).';
    if (/\p{Script=Latin}{10,}/u.test(t)) return 'Language mismatch: contains long Latin segment for Arabic course.';
  }
  if (lang === 'hi') {
    const hiRatio = ratio(/[\u0900-\u097F]/g);
    if (hiRatio < 0.25) return 'Language mismatch: expected Devanagari script (too much Latin).';
    if (/\p{Script=Latin}{10,}/u.test(t)) return 'Language mismatch: contains long Latin segment for Hindi course.';
  }

  // For Latin-script non-EN languages, reject obvious non-Latin script injections (e.g., Cyrillic inside Polish).
  if (lang !== 'en' && lang !== 'bg' && lang !== 'ru' && lang !== 'ar' && lang !== 'hi') {
    if (/\p{Script=Cyrillic}{10,}/u.test(t)) return `Language mismatch: contains Cyrillic segment for ${lang}.`;
    if (/\p{Script=Arabic}{10,}/u.test(t)) return `Language mismatch: contains Arabic segment for ${lang}.`;
    if (/\p{Script=Devanagari}{10,}/u.test(t)) return `Language mismatch: contains Devanagari segment for ${lang}.`;
  }

  return null;
}

/**
 * Validate a single question for quality
 */
export function validateQuestionQuality(
  question: string,
  options: string[],
  questionType: QuizQuestionType,
  difficulty: QuestionDifficulty,
  language: string,
  lessonTitle?: string,
  lessonContent?: string
): QuestionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Defensive normalization: historical DB records may have missing questionType/difficulty.
  const effectiveType = questionType ?? QuizQuestionType.APPLICATION;
  const effectiveDifficulty = difficulty ?? QuestionDifficulty.MEDIUM;

  // Defensive normalization: historical DB records may have malformed option shapes.
  const safeOptions: string[] = Array.isArray(options) ? options.map(o => String(o ?? '')) : [];

  // 0. RECALL is disallowed (hard rule)
  if (effectiveType === QuizQuestionType.RECALL || String(effectiveType) === 'recall') {
    errors.push('RECALL questions are disallowed. Regenerate this question as APPLICATION or CRITICAL_THINKING.');
  }

  // 0.1 Strong disallow: lesson-referential wording anywhere
  {
    const textBlob = `${question}\n${safeOptions.join('\n')}`;
    for (const token of LESSON_REFERENCE_TOKENS) {
      if (token.re.test(textBlob)) {
        errors.push(
          `Contains lesson-referential wording (${token.label}). Questions and answers must be fully standalone and must not refer to the lesson/course.`
        );
        break;
      }
    }
  }

  // 0.1b Strong disallow: course-referential wording anywhere
  {
    const textBlob = `${question}\n${safeOptions.join('\n')}`;
    for (const token of COURSE_REFERENCE_TOKENS) {
      if (token.re.test(textBlob)) {
        errors.push(
          `Contains course-referential wording (${token.label}). Questions and answers must be fully standalone and must not refer to the course/program.`
        );
        break;
      }
    }
  }

  // 0.2 Disallow “checklist snippet” style questions (quoted ✅ / …)
  if (hasChecklistSnippet(question)) {
    errors.push(
      'Question quotes a checklist/snippet (e.g., ✅ or …). This is fuzzy and not standalone. Rewrite as a concrete scenario question.'
    );
  }

  // 0.3 Disallow checklist symbols / ellipsis anywhere in Q or options (not standalone, usually a snippet)
  if (/[✅✔️☑️]/.test(question) || safeOptions.some(o => /[✅✔️☑️]/.test(o))) {
    errors.push('Contains checklist symbol (✅/✔️/☑️). Replace with a concrete standalone scenario.');
  }
  if (/\.\.\./.test(question) || safeOptions.some(o => /\.\.\./.test(o))) {
    errors.push('Contains ellipsis (...) which typically indicates a truncated snippet. Replace with complete, clear text.');
  }

  // 0.4 Disallow the literal English word "goals" in non-EN courses (common leakage)
  if (String(language || '').toLowerCase() !== 'en') {
    const blob = `${question}\n${safeOptions.join('\n')}`;
    if (/\bgoals\b/i.test(blob)) {
      errors.push('Language leak: contains the English word "goals". Use the correct language term or rewrite the sentence.');
    }
  }

  // 0.4b Per-locale: disallow non-native / typo terms (see docs/REPHRASE_RULES_*.md, docs/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md)
  const lang = String(language || '').toLowerCase();
  {
    const blob = `${question}\n${safeOptions.join('\n')}`;
    if (lang === 'hu') {
      if (/\bvisszacsatolás(t)?\b/i.test(blob)) errors.push('HU: use "visszajelzés" / "visszajelzést", not "visszacsatolás". Non-native term.');
      if (/\bbevezetési\s+táv\b/i.test(blob)) errors.push('HU: use "bevezetési terv", not "bevezetési táv". Typo (táv = distance).');
      if (/\btartalo\b/i.test(blob)) errors.push('HU: likely typo "tartalo" → use "tartalmat" (content).');
    }
    if (lang === 'pl' && /\bfeedback\s+loop\b/i.test(blob)) {
      errors.push('PL: use "pętla informacji zwrotnej" / "pętlę informacji zwrotnej", not "feedback loop".');
    }
    if (lang === 'vi' && /\bfeedback\s+loop\b/i.test(blob)) {
      errors.push('VI: use "vòng phản hồi", not "feedback loop".');
    }
  }

  // 0.4c Truncation heuristic: question or option ending with space or very short trailing fragment (incomplete word)
  {
    const trimEnd = (t: string) => t.trimEnd();
    const mayBeTruncated = (t: string) => {
      const s = trimEnd(t);
      if (s.length < 10) return false;
      if (/[\s\u00a0]$/.test(t)) return true;
      const lastWord = (s.match(/\s+(\S{1,3})$/)?.[1] ?? s.slice(-4)) || '';
      return lastWord.length <= 2 && /\p{L}/u.test(lastWord);
    };
    if (mayBeTruncated(question)) {
      warnings.push('Question may be truncated (ends with space or very short word). Ensure full sentence.');
    }
    for (let i = 0; i < safeOptions.length; i++) {
      if (mayBeTruncated(safeOptions[i])) {
        warnings.push(`Option ${i + 1} may be truncated. Ensure complete text.`);
        break;
      }
    }
  }

  // 0.5 Disallow obvious “meta” distractors (not a real domain mistake)
  {
    const blob = safeOptions.join('\n');
    for (const p of META_DISTRACTOR_PATTERNS) {
      if (p.re.test(blob)) {
        errors.push(`Contains non-educational meta distractor (${p.label}). Replace with a plausible, domain-specific mistake.`);
        break;
      }
    }
  }

  // 0.6 Disallow answer-leakage / self-answering stems (common when trying to avoid lesson references)
  {
    const qLower = String(question || '').toLowerCase();
    const hasThreePartLoop = /\b(three[-\s]?part|3[-\s]?part)\s+loop\b/i.test(question);
    const mentionsThinkDecideDeliver =
      /\bthink\b/i.test(question) && /\bdecide\b/i.test(question) && /\bdeliver\b/i.test(question);
    if (hasThreePartLoop && mentionsThinkDecideDeliver) {
      errors.push('Answer leakage: the question includes the loop terms and then asks about the loop. Rewrite as a scenario that tests application without giving away the answer.');
    }
    if (/\bwhich\s+option\s+best\s+matches\s+that\s+loop\b/i.test(question) && mentionsThinkDecideDeliver) {
      errors.push('Answer leakage: the stem describes the loop and asks which option matches it. Rewrite to test choosing the right action in a scenario.');
    }
    // Generic “structured program” framing is often disconnected from the lesson.
    if (/^(someone|a person|a student)\b/i.test(qLower) || /\bstructured\s+learning\s+program\b/i.test(qLower) || /\ba\s+structured\s+program\b/i.test(qLower)) {
      if (lessonContent) {
        const lessonTokens = new Set(tokenizeForOverlap(lessonContent).filter(t => t.length >= 6).slice(0, 400));
        const qTokens = new Set(tokenizeForOverlap(`${question}\n${safeOptions.join('\n')}`));
        let overlap = 0;
        for (const t of qTokens) {
          if (lessonTokens.has(t)) overlap++;
          if (overlap >= 2) break;
        }
        if (overlap < 2) {
          errors.push('Not grounded: generic “someone/program” framing with low overlap to the lesson content. Rewrite using a concrete scenario that uses the lesson’s actual concepts/practices.');
        }
      }
    }
  }

  // 1. Check minimum length (context-rich requirement)
  if (question.length < 40) {
    errors.push(`Question too short (${question.length} chars, minimum 40). Must provide full context.`);
  }

  // 2. Check for generic template patterns
  // Only flag if the pattern appears at the START of the question (indicating a template)
  // or if it's a standalone generic phrase
  const questionLower = question.toLowerCase();
  const questionTrimmed = questionLower.trim();
  
  for (const pattern of UNACCEPTABLE_PATTERNS.questions) {
    const patternLower = pattern.toLowerCase();
    
    // Check if pattern appears at start (definitely a template)
    if (questionTrimmed.startsWith(patternLower)) {
      errors.push(`Starts with generic template pattern: "${pattern}". Questions must be content-specific, not templates.`);
    }
    // Check for standalone generic phrases (not part of a larger, specific question)
    else if (patternLower.includes('tanultak alapján') || patternLower.includes('témakörből') || 
             patternLower.includes('mit jelent') || patternLower.includes('what does') ||
             patternLower.includes('что означает') || patternLower.includes('ne anlama')) {
      if (questionLower.includes(patternLower)) {
        errors.push(`Contains generic template phrase: "${pattern}". Questions must be content-specific.`);
      }
    }
  }
  
  // Check for invalid/fragment terms in quotes (like "mestere" - too short, not a real term)
  const quotedTermMatch = question.match(/"([^"]+)"/);
  if (quotedTermMatch) {
    const quotedTerm = quotedTermMatch[1].trim();
    // If the quoted term is very short (< 4 chars) or looks like a fragment, it's likely invalid
    if (quotedTerm.length < 4) {
      errors.push(`Question contains invalid/fragment term in quotes: "${quotedTerm}". Terms must be meaningful and complete.`);
    }
    // Check if it's a common word fragment (like "mestere" which is incomplete)
    const commonFragments = ['mestere', 'ra', 're', 'ban', 'ben', 'bol', 'ből', 'val', 'vel'];
    if (commonFragments.includes(quotedTerm.toLowerCase())) {
      errors.push(`Question contains fragment/invalid term: "${quotedTerm}". Must use complete, meaningful terms.`);
    }
  }

  // 3. Check for placeholder answers
  for (const option of safeOptions) {
    const optionLower = option.toLowerCase();
    for (const pattern of UNACCEPTABLE_PATTERNS.answers) {
      const patternLower = pattern.toLowerCase();
      // Check if pattern appears in the answer (especially at the start)
      if (optionLower.includes(patternLower)) {
        // If it's a generic template answer pattern, reject it
        if (patternLower.includes('specifikus definíció') || patternLower.includes('specific definition') ||
            patternLower.includes('конкретное определение') || patternLower.includes('spesifik tanım')) {
          errors.push(`Contains generic template answer: "${pattern}". Answers must be educational and specific, not templates.`);
        } else {
          errors.push(`Contains placeholder answer: "${pattern}". Answers must be educational and plausible.`);
        }
      }
    }
    
    // Check for generic answer patterns like "A leckében részletesen magyarázott, X-ra vonatkozó..."
    if (optionLower.match(/a leckében részletesen (magyarázott|leírt).*?vonatkozó specifikus/i) ||
        optionLower.match(/the specific definition and usage.*?as explained.*?in the lesson/i) ||
        optionLower.match(/конкретное определение.*?как.*?объяснено.*?в уроке/i)) {
      errors.push(`Contains generic template answer pattern. Answers must be specific and educational, not generic templates.`);
    }
  }

  // 4. Check options quality
  if (safeOptions.length !== 4) {
    errors.push(`Must have exactly 4 options, found ${safeOptions.length}`);
  }

  // 4.1 Language script check (hard) for non-Latin-script courses
  {
    const blob = `${question}\n${safeOptions.join('\n')}`;
    const scriptErr = languageScriptCheck(language, blob);
    if (scriptErr) errors.push(scriptErr);
  }

  // Enforce non-trivial educational options
  safeOptions.forEach((opt, index) => {
    if (opt.trim().length < 25) {
      errors.push(`Option ${index + 1} is too short (${opt.trim().length} chars). Options must be detailed and educational.`);
    }
  });

  // Check for duplicate options
  const uniqueOptions = new Set(safeOptions.map(opt => opt.trim().toLowerCase()));
  if (uniqueOptions.size < safeOptions.length) {
    errors.push('Duplicate options found. All options must be unique.');
  }

  // Check option lengths (too short = not educational)
  safeOptions.forEach((opt, index) => {
    if (opt.trim().length < 10) {
      warnings.push(`Option ${index + 1} is very short (${opt.length} chars). Consider making it more educational.`);
    }
  });

  // 5. No title-based crutches: do not require lesson title overlap (standalone wording is required).

  // 6. Validate question type is set (effectiveType already defaulted above)
  const validQuestionTypes = ['recall', 'application', 'critical-thinking'];
  const questionTypeStr = typeof effectiveType === 'string' ? effectiveType : effectiveType?.toString();
  if (!questionTypeStr || !validQuestionTypes.includes(questionTypeStr.toLowerCase())) {
    errors.push(`Question type must be set (RECALL, APPLICATION, or CRITICAL_THINKING). Got: ${questionTypeStr || 'undefined'}`);
  }

  // 7. Validate difficulty is set (effectiveDifficulty already defaulted above)
  if (!effectiveDifficulty) {
    errors.push('Difficulty must be set (EASY, MEDIUM, HARD, or EXPERT)');
  }

  // 8. Check cognitive mix appropriateness
  if (effectiveType === QuizQuestionType.CRITICAL_THINKING && effectiveDifficulty !== QuestionDifficulty.HARD && effectiveDifficulty !== QuestionDifficulty.EXPERT) {
    warnings.push('Critical thinking questions should typically be HARD or EXPERT difficulty.');
  }

  // 9. Check for proper context (not just "What is X?" without context)
  if (questionLower.match(/^(what|mi|mit|miért|hogyan|как|что|почему)\s+(is|a|az|есть)/) && question.length < 60) {
    warnings.push('Question may lack context. Ensure it provides enough context to be understood standalone.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a batch of questions for a lesson
 */
export function validateLessonQuestions(
  questions: Array<{
    question: string;
    options: string[];
    questionType: QuizQuestionType;
    difficulty: QuestionDifficulty;
    correctIndex?: number;
  }>,
  language: string,
  lessonTitle?: string
): QuestionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check count (MINIMUM 7)
  if (questions.length < 7) {
    errors.push(`Must have at least 7 questions per lesson, found ${questions.length}`);
  }

  // Check cognitive mix (rules)
  // - 0 RECALL (hard)
  // - APPLICATION >= 5 (hard)
  // - CRITICAL_THINKING recommended >= 2 (warning)
  const recallCount = questions.filter(q => {
    const qType = typeof q.questionType === 'string' ? q.questionType : q.questionType?.toString();
    return qType === 'recall' || qType === QuizQuestionType.RECALL;
  }).length;
  const appCount = questions.filter(q => {
    const qType = typeof q.questionType === 'string' ? q.questionType : q.questionType?.toString();
    return qType === 'application' || qType === QuizQuestionType.APPLICATION;
  }).length;
  const criticalCount = questions.filter(q => {
    const qType = typeof q.questionType === 'string' ? q.questionType : q.questionType?.toString();
    return qType === 'critical-thinking' || qType === QuizQuestionType.CRITICAL_THINKING;
  }).length;

  if (recallCount !== 0) {
    errors.push(`RECALL questions: ${recallCount} (must be 0). Regenerate the lesson quiz.`);
  }
  if (appCount < 5) {
    errors.push(`APPLICATION questions: ${appCount} (must be at least 5). Regenerate/add questions.`);
  }
  if (criticalCount < 2) {
    warnings.push(`CRITICAL_THINKING questions: ${criticalCount} (recommended at least 2).`);
  }

  // Validate each question
  questions.forEach((q, index) => {
    const result = validateQuestionQuality(
      q.question,
      q.options,
      q.questionType,
      q.difficulty,
      language,
      lessonTitle
    );

    if (!result.isValid) {
      errors.push(`Question ${index + 1}: ${result.errors.join('; ')}`);
    }
    if (result.warnings.length > 0) {
      warnings.push(`Question ${index + 1}: ${result.warnings.join('; ')}`);
    }
  });

  // Optional: validate correctIndex distribution if provided by the caller.
  {
    const provided = questions.filter(q => typeof q.correctIndex === 'number');
    if (provided.length === questions.length && provided.length > 0) {
      const counts = new Map<number, number>();
      for (const q of provided) {
        const idx = Number(q.correctIndex);
        if (![0, 1, 2, 3].includes(idx)) {
          errors.push(`Invalid correctIndex ${idx} (must be 0..3).`);
          continue;
        }
        counts.set(idx, (counts.get(idx) || 0) + 1);
      }
      const values = Array.from(counts.values());
      const max = values.length ? Math.max(...values) : 0;
      if (max === provided.length) {
        warnings.push(
          `All questions use the same correctIndex (${Array.from(counts.keys())[0]}). Shuffle option order so the correct answer position varies.`
        );
      } else if (provided.length > 0 && max / provided.length >= 0.8) {
        warnings.push('Correct answer position is highly imbalanced. Shuffle option order for fairness.');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
