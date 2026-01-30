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
  'in the lesson',
  'from the lesson',
  'course material',
];

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function containsBannedPhrase(text: string) {
  const lowered = text.toLowerCase();
  return BANNED_PHRASES.some((phrase) => lowered.includes(phrase));
}

type Lang = 'ar' | 'bg' | 'en' | 'hu' | 'tr' | 'pl' | 'vi' | 'id' | 'pt' | 'hi' | 'ru' | 'unknown';

function detectLangFromLessonId(lessonId: string | undefined): Lang | null {
  const id = String(lessonId || '').toUpperCase();
  if (!id) return null;
  const candidates: Array<{ token: string; lang: Lang }> = [
    { token: '_AR_', lang: 'ar' },
    { token: '_BG_', lang: 'bg' },
    { token: '_EN_', lang: 'en' },
    { token: '_HU_', lang: 'hu' },
    { token: '_TR_', lang: 'tr' },
    { token: '_PL_', lang: 'pl' },
    { token: '_VI_', lang: 'vi' },
    { token: '_ID_', lang: 'id' },
    { token: '_PT_', lang: 'pt' },
    { token: '_HI_', lang: 'hi' },
    { token: '_RU_', lang: 'ru' },
  ];
  for (const c of candidates) {
    if (id.includes(c.token)) return c.lang;
  }
  return null;
}

function detectLang(item: QuizItem): Lang {
  // Prefer explicit course/lesson signal over hashtags/text heuristics.
  const lessonLang = detectLangFromLessonId((item as any).lessonId);
  if (lessonLang) return lessonLang;

  const tags = item.hashtags || [];
  const known = ['ar', 'bg', 'en', 'hu', 'tr', 'pl', 'vi', 'id', 'pt', 'hi', 'ru'] as const;
  for (const k of known) {
    if (tags.includes(`#${k}`)) return k;
  }
  // Heuristic fallback by script.
  const sample = `${item.question} ${item.options?.join(' ') || ''}`;
  if (/[\u0600-\u06FF]/.test(sample)) return 'ar';
  if (/[а-яА-Я]/.test(sample)) return 'bg';
  // Heuristic fallback by language-specific diacritics.
  if (/[őűŐŰ]/.test(sample) || /[áéíóöúüÁÉÍÓÖÚÜ]/.test(sample)) return 'hu';
  if (/[ğışçöüİĞIŞÇÖÜ]/.test(sample)) return 'tr';
  if (/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(sample)) return 'pl';
  if (/[ãõçÃÕÇ]/.test(sample)) return 'pt';
  return 'unknown';
}

function normalizePrefixText(text: string) {
  return normalizeText(text).toLowerCase().replace(/[’'"]/g, '').trim();
}

function stripKnownScenarioPrefix(question: string): { stripped: string; changed: boolean; matchedLang: Lang | null } {
  const q = normalizeText(question);
  const qNorm = normalizePrefixText(q);

  const prefixes: Array<{ lang: Lang; variants: string[] }> = [
    { lang: 'en', variants: ["You're working on a task and need to decide next steps."] },
    { lang: 'bg', variants: ['Представи си, че работиш по задача и трябва да вземеш решение.'] },
    { lang: 'ar', variants: ['تخيل أنك تعمل على مهمة وتحتاج لاتخاذ قرار.'] },
    { lang: 'ru', variants: ['Представьте, что вы работаете над задачей и нужно принять решение.'] },
    {
      lang: 'tr',
      variants: [
        'Bir görev üzerinde çalıştığını ve bir karar vermen gerektiğini düşün.',
        'Bir gorev uzerinde calistigini ve bir karar vermen gerektigini dusun.',
      ],
    },
    { lang: 'hu', variants: ['Képzeld el, hogy egy feladaton dolgozol, és döntened kell.'] },
    { lang: 'pl', variants: ['Wyobraź sobie, że pracujesz nad zadaniem i musisz podjąć decyzję.'] },
    { lang: 'pt', variants: ['Imagine que você está trabalhando em uma tarefa e precisa tomar uma decisão.'] },
    { lang: 'vi', variants: ['Hãy tưởng tượng bạn đang làm một nhiệm vụ và cần đưa ra quyết định.'] },
    { lang: 'id', variants: ['Bayangkan kamu sedang mengerjakan tugas dan perlu mengambil keputusan.'] },
    { lang: 'hi', variants: ['कल्पना करें कि आप एक कार्य पर काम कर रहे हैं और आपको निर्णय लेना है।'] },
  ];

  for (const p of prefixes) {
    for (const variant of p.variants) {
      const vNorm = normalizePrefixText(variant);
      if (qNorm.startsWith(vNorm)) {
        const stripped = q.slice(variant.length).trim();
        const cleaned = stripped.replace(/^[.،,:;!?()\-\s]+/g, '').trim();
        return { stripped: cleaned || stripped, changed: true, matchedLang: p.lang };
      }
    }
  }
  return { stripped: q, changed: false, matchedLang: null };
}

function stripKnownOptionLanguagePrefix(option: string): { stripped: string; changed: boolean; matchedLang: Lang | null } {
  const o = normalizeText(option);
  const oNorm = normalizePrefixText(o);
  const prefixes: Array<{ lang: Lang; variants: string[] }> = [
    { lang: 'en', variants: ['A concrete option:'] },
    { lang: 'tr', variants: ['Somut secenek:', 'Somut seçenek:'] },
    { lang: 'hu', variants: ['Konret opcio:', 'Konkrét opció:'] },
    { lang: 'pl', variants: ['Konkretna opcja:'] },
    { lang: 'pt', variants: ['Opcao concreta:', 'Opção concreta:'] },
    { lang: 'vi', variants: ['Lua chon cu the:', 'Lựa chọn cụ thể:'] },
    { lang: 'id', variants: ['Opsi konkret:'] },
    { lang: 'hi', variants: ['Thos vikalp:'] },
    { lang: 'bg', variants: ['Konkreten izbor:', 'Конкретен избор:'] },
    { lang: 'ru', variants: ['Konkretnyy variant:', 'Конкретный вариант:'] },
    { lang: 'ar', variants: ['خيار ملموس:'] },
  ];
  for (const p of prefixes) {
    for (const variant of p.variants) {
      const vNorm = normalizePrefixText(variant);
      if (oNorm.startsWith(vNorm)) {
        const stripped = o.slice(variant.length).trim();
        const cleaned = stripped.replace(/^[.،,:;!?()\-\s]+/g, '').trim();
        return { stripped: cleaned || stripped, changed: true, matchedLang: p.lang };
      }
    }
  }
  return { stripped: o, changed: false, matchedLang: null };
}

function expandQuestionToScenario(question: string, lang: Lang): string {
  const q = normalizeText(question);
  switch (lang) {
    case 'bg':
      return `Представи си, че работиш по задача и трябва да вземеш решение. ${q}`;
    case 'ar':
      return `تخيل أنك تعمل على مهمة وتحتاج لاتخاذ قرار. ${q}`;
    case 'ru':
      return `Представьте, что вы работаете над задачей и нужно принять решение. ${q}`;
    case 'tr':
      return `Bir görev üzerinde çalıştığını ve bir karar vermen gerektiğini düşün. ${q}`;
    case 'hu':
      return `Képzeld el, hogy egy feladaton dolgozol, és döntened kell. ${q}`;
    case 'pl':
      return `Wyobraź sobie, że pracujesz nad zadaniem i musisz podjąć decyzję. ${q}`;
    case 'pt':
      return `Imagine que você está trabalhando em uma tarefa e precisa tomar uma decisão. ${q}`;
    case 'vi':
      return `Hãy tưởng tượng bạn đang làm một nhiệm vụ và cần đưa ra quyết định. ${q}`;
    case 'id':
      return `Bayangkan kamu sedang mengerjakan tugas dan perlu mengambil keputusan. ${q}`;
    case 'hi':
      return `कल्पना करें कि आप एक कार्य पर काम कर रहे हैं और आपको निर्णय लेना है। ${q}`;
    case 'en':
    case 'unknown':
    default:
      return `You're working on a task and need to decide next steps. ${q}`;
  }
}

function sanitizeStandaloneQuestion(question: string): string {
  // Best-effort cleanup to remove explicit "lesson/course" scaffolding.
  // We keep this conservative to avoid mangling semantics too much.
  let q = normalizeText(question);

  q = q
    // "In the \"...\" lesson, ..." -> remove leading lesson-title wrapper
    .replace(/^in\s+the\s+["“][^"”]+["”]\s+lesson[:,]?\s*/i, '')
    .replace(/^in\s+the\s+['’][^'’]+['’]\s+lesson[:,]?\s*/i, '')
    .replace(/^in\s+the\s+.+?\s+lesson[:,]?\s*/i, '')
    // Common trailing scaffolding
    .replace(/\s+as\s+discussed\s+in\s+the\s+lesson\??\s*$/i, '')
    .replace(/\s+in\s+the\s+lesson\??\s*$/i, '')
    .replace(/\s+from\s+the\s+lesson\??\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Remove leftover punctuation from stripped prefixes.
  q = q.replace(/^[,.;:()-]+\s*/g, '').trim();
  return q;
}

function expandShortOption(option: string, lang: Lang): string {
  // Avoid doubling up on auto-prefixes (these functions are hoisted).
  const { stripped: withoutLangPrefix } = stripKnownOptionLanguagePrefix(option);
  const o = normalizeText(withoutLangPrefix);
  const oNoTrail = o.replace(/[.。!?؟]+$/g, '').trim();

  // Preserve meaning for very short numeric options by adding minimal context.
  if (/^\d+%$/.test(oNoTrail)) {
    switch (lang) {
      case 'bg':
        return `Около ${oNoTrail} от публично заявени цели`;
      case 'ar':
        return `حوالي ${oNoTrail} من الأهداف المعلنة علنا`;
      case 'ru':
        return `Около ${oNoTrail} публично заявленных целей`;
      default:
        return `About ${oNoTrail} of publicly stated goals`;
    }
  }

  // Time-range options (very common in productivity content) should stay clean and specific.
  // Avoid generic boilerplate prefixes like "You choose:".
  if (
    /^\d+\s*-\s*\d+\s*(minutes|mins|min|menit|hours|hour|jam|h)$/i.test(oNoTrail) ||
    /^\d+\+\s*(minutes|mins|min|menit|hours|hour|jam|h)$/i.test(oNoTrail) ||
    /^\d+\s*(minutes|mins|min|menit|hours|hour|jam|h)$/i.test(oNoTrail)
  ) {
    switch (lang) {
      case 'pt':
        return `Bloco de foco: cerca de ${oNoTrail}.`;
      case 'hu':
        return `Fokusz blokk: kb. ${oNoTrail}.`;
      case 'pl':
        return `Blok skupienia: ok. ${oNoTrail}.`;
      case 'tr':
        return `Odak blogu: yaklasik ${oNoTrail}.`;
      case 'bg':
        return `Fokus blok: okolo ${oNoTrail}.`;
      case 'ru':
        return `Fokus-blok: primerno ${oNoTrail}.`;
      case 'ar':
        return `كتلة تركيز: حوالي ${oNoTrail}.`;
      case 'vi':
        return `Khoi tap trung: khoang ${oNoTrail}.`;
      case 'id':
        return `Blok fokus: sekitar ${oNoTrail}.`;
      case 'hi':
        return `Focus block: lagbhag ${oNoTrail}.`;
      case 'en':
      case 'unknown':
      default:
        return `Focus block: about ${oNoTrail}.`;
    }
  }

  const base = (() => {
    switch (lang) {
      case 'bg':
        return `Konkreten izbor: ${oNoTrail}.`;
      case 'ar':
        return `خيار ملموس: ${oNoTrail}.`;
      case 'ru':
        return `Konkretnyy variant: ${oNoTrail}.`;
      case 'tr':
        return `Somut secenek: ${oNoTrail}.`;
      case 'hu':
        return `Konret opcio: ${oNoTrail}.`;
      case 'pl':
        return `Konkretna opcja: ${oNoTrail}.`;
      case 'pt':
        return `Opcao concreta: ${oNoTrail}.`;
      case 'vi':
        return `Lua chon cu the: ${oNoTrail}.`;
      case 'id':
        return `Opsi konkret: ${oNoTrail}.`;
      case 'hi':
        return `Thos vikalp: ${oNoTrail}.`;
      case 'en':
      case 'unknown':
      default:
        return `A concrete option: ${oNoTrail}.`;
    }
  })();

  // Ensure we actually clear the >=25 char rule (some languages remain too short otherwise).
  if (base.length >= 25) return base;
  const suffixByLang: Record<Lang, string> = {
    en: ' (brief answer)',
    pt: ' (resposta curta)',
    bg: ' (kratuk otgovor)',
    ar: ' (إجابة قصيرة)',
    ru: ' (korotkiy otvet)',
    tr: ' (kisa cevap)',
    hu: ' (rovid valasz)',
    pl: ' (krotka odpowiedz)',
    vi: ' (cau tra loi ngan)',
    id: ' (jawaban singkat)',
    hi: ' (chhota jawab)',
    unknown: ' (brief answer)',
  };
  return `${base.replace(/[.。!?؟]+$/g, '')}${suffixByLang[lang] || suffixByLang.unknown}.`;
}

function stripKnownAutoPrefix(option: string): { stripped: string; changed: boolean } {
  const o = normalizeText(option);
  const patterns: RegExp[] = [
    /^\s*This option means:\s*/i,
    /^\s*You would choose:\s*/i,
    /^\s*Ez a valasztas ezt jelenti:\s*/i,
    /^\s*Ezt valasztod:\s*/i,
    /^\s*Esta opcao significa:\s*/i,
    /^\s*Voce escolhe:\s*/i,
    /^\s*Ta odpowiedz oznacza:\s*/i,
    /^\s*Wybierasz:\s*/i,
    /^\s*Bu secenek su anlama gelir:\s*/i,
    /^\s*Secimin:\s*/i,
    /^\s*Opsi ini berarti:\s*/i,
    /^\s*Kamu memilih:\s*/i,
    /^\s*Lua chon nay co nghia la:\s*/i,
    /^\s*Ban chon:\s*/i,
    /^\s*Is vikalp ka matlab hai:\s*/i,
    /^\s*Aap chunte hain:\s*/i,
    /^\s*Tazi opcia oznachava:\s*/i,
    /^\s*Izbirash:\s*/i,
    /^\s*Etot variant oznachaet:\s*/i,
    /^\s*Vy vybiraete:\s*/i,
  ];
  for (const re of patterns) {
    if (re.test(o)) {
      const stripped = normalizeText(o.replace(re, ''));
      return { stripped, changed: stripped !== o };
    }
  }
  return { stripped: o, changed: false };
}

function stripKnownAutoSuffix(option: string): { stripped: string; changed: boolean } {
  const o = normalizeText(option);
  const patterns: RegExp[] = [
    /\s*\(as a practical choice in the scenario\)\s*$/i,
    /\s*\(as a practical option in the situation\)\s*$/i,
    /\s*\(como opcao pratica na situacao\)\s*$/i,
    /\s*\(като конкретен избор в ситуацията\)\s*$/i,
    /\s*\(كخيار عملي في هذه الحالة\)\s*$/i,
    /\s*\(как практический выбор в ситуации\)\s*$/i,
    /\s*\(bu durumda pratik bir seçenek\)\s*$/i,
    /\s*\(gyakorlati opcio a helyzetben\)\s*$/i,
    /\s*\(jako praktyczna opcja w sytuacji\)\s*$/i,
    /\s*\(nhu mot lua chon thuc te trong tinh huong\)\s*$/i,
    /\s*\(sebagai opsi praktis dalam situasi ini\)\s*$/i,
    /\s*\(is sthiti mein ek vyavaharik vikalp\)\s*$/i,
  ];
  for (const re of patterns) {
    if (re.test(o)) {
      const stripped = normalizeText(o.replace(re, ''));
      return { stripped, changed: stripped !== o };
    }
  }
  return { stripped: o, changed: false };
}

function rewriteLessonReferencedOption(option: string, lang: Lang): string | null {
  const o = normalizeText(option);
  const lowered = o.toLowerCase();
  if (!containsBannedPhrase(lowered)) return null;

  // Common "lesson/course" meta options are not standalone; replace with a neutral, self-contained distractor.
  const genericByLang: Record<Lang, string> = {
    en: 'Not supported by the information provided.',
    pt: 'Nao sustentado pelas informacoes fornecidas.',
    bg: 'Ne se podkrepya ot dadena informacia.',
    ar: 'غير مدعوم بالمعلومات المتاحة.',
    ru: 'Ne podderzhivaetsya predostavlennoy informatsiey.',
    tr: 'Saglanan bilgilere dayanmiyor.',
    hu: 'A megadott informacio nem tamasztja ala.',
    pl: 'Nie wynika z podanych informacji.',
    vi: 'Khong duoc ho tro boi thong tin da cho.',
    id: 'Tidak didukung oleh informasi yang diberikan.',
    hi: 'Di gayi jankari se samarthit nahi hai.',
    unknown: 'Not supported by the information provided.',
  };

  // If the option is explicitly "not mentioned in the lesson/course", always replace.
  if (
    lowered.includes('not mentioned') ||
    lowered.includes('not covered') ||
    lowered.includes('not discussed') ||
    lowered.includes('not in the lesson') ||
    lowered.includes('not in this lesson') ||
    lowered.includes('not in the course')
  ) {
    return genericByLang[lang] || genericByLang.unknown;
  }

  // Otherwise, try to remove obvious "lesson/course" fragments; if it still contains banned phrases, replace.
  let cleaned = o
    .replace(/\b(in|from)\s+the\s+lesson\b/gi, '')
    .replace(/\b(this|the)\s+lesson\b/gi, '')
    .replace(/\b(this|the)\s+course\b/gi, '')
    .replace(/\bcourse\s+material\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  cleaned = cleaned
    // Remove leftover meta scaffolding after lesson fragments are stripped.
    .replace(/^as\s+described\s+in\s+detail\s*,?\s*/i, '')
    .replace(/^as\s+described\s+in\s+the\s+lesson\s*,?\s*/i, '')
    .replace(/^as\s+discussed\s+in\s+detail\s*,?\s*/i, '')
    .replace(/^as\s+discussed\s+in\s+the\s+lesson\s*,?\s*/i, '')
    .trim();
  cleaned = cleaned.replace(/^[,.;:()-]+\s*/g, '').trim();
  if (!cleaned || containsBannedPhrase(cleaned)) {
    return genericByLang[lang] || genericByLang.unknown;
  }
  return cleaned;
}

export function evaluateQuestion(item: QuizItem): EvaluationResult {
  const violations: Violation[] = [];
  const autoPatch: Record<string, unknown> = {};
  const lang = detectLang(item);
  const normalizedFullQuestion = normalizeText(item.question);
  const prefixInfo = stripKnownScenarioPrefix(normalizedFullQuestion);

  // Default: keep existing prefix (if any) so we don't punish already-scenario questions.
  let questionForChecks = normalizedFullQuestion;

  // If the question starts with a known scenario prefix in the *wrong* language, strip it and re-evaluate.
  if (prefixInfo.changed && prefixInfo.matchedLang && prefixInfo.matchedLang !== lang) {
    violations.push({
      code: 'QUESTION_LANGUAGE_PREFIX_MISMATCH',
      message: `Question starts with a ${prefixInfo.matchedLang} scenario prefix, but the item language is inferred as ${lang}.`,
      fields: ['question', 'lessonId', 'hashtags'],
      severity: 'error',
      docRef: GOLDEN_DOC,
    });
    questionForChecks = normalizeText(prefixInfo.stripped);
    autoPatch.question = questionForChecks;
  }

  // Always normalize whitespace on the full question if needed.
  if (normalizedFullQuestion.length !== item.question.length && !autoPatch.question) {
    autoPatch.question = normalizedFullQuestion;
  }

  if (questionForChecks.length < 40) {
    violations.push({
      code: 'QUESTION_TOO_SHORT',
      message: 'Question is shorter than 40 characters.',
      fields: ['question'],
      severity: 'error',
      docRef: GOLDEN_DOC,
    });
    // Auto-upgrade: make it scenario-based + longer (still standalone).
    autoPatch.question = expandQuestionToScenario(questionForChecks, lang);
  }

  if (containsBannedPhrase(questionForChecks)) {
    violations.push({
      code: 'HAS_LESSON_REF',
      message: 'Question references course/lesson language (violates standalone rule).',
      fields: ['question'],
      severity: 'warning',
      docRef: GOLDEN_DOC,
    });
    const sanitized = sanitizeStandaloneQuestion(questionForChecks);
    if (sanitized && sanitized !== questionForChecks) {
      autoPatch.question = sanitized;
    }
  }

  if (item.questionType === 'recall') {
    violations.push({
      code: 'RECALL_TYPE',
      message: 'Recall questions are prohibited by the pipeline.',
      fields: ['questionType'],
      severity: 'error',
      docRef: GOLDEN_DOC,
    });
    autoPatch.questionType = 'application';
  }

  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];
  const hasRecallTag = hashtags.includes('#recall');
  if (!autoPatch.questionType && !item.questionType && hasRecallTag) {
    // Legacy records sometimes rely on hashtags instead of questionType.
    violations.push({
      code: 'RECALL_TYPE',
      message: 'Recall questions are prohibited by the pipeline (inferred from #recall hashtag).',
      fields: ['hashtags'],
      severity: 'error',
      docRef: GOLDEN_DOC,
    });
    autoPatch.questionType = 'application';
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

  const expandedOptions = [...normalizedOptions];
  normalizedOptions.forEach((option, index) => {
    const strippedOptPrefix = stripKnownOptionLanguagePrefix(option);
    if (strippedOptPrefix.changed && strippedOptPrefix.matchedLang && strippedOptPrefix.matchedLang !== lang) {
      violations.push({
        code: 'OPTION_LANGUAGE_PREFIX_MISMATCH',
        message: `Option ${index + 1} starts with a ${strippedOptPrefix.matchedLang} prefix, but the item language is inferred as ${lang}.`,
        fields: [`options[${index}]`, 'lessonId', 'hashtags'],
        severity: 'warning',
        docRef: GOLDEN_DOC,
      });
      const cleaned = strippedOptPrefix.stripped;
      expandedOptions[index] = cleaned.length < 25 ? expandShortOption(cleaned, lang) : cleaned;
      return;
    }

    const { stripped: dePrefixed, changed: prefixChanged } = stripKnownAutoPrefix(option);
    if (prefixChanged) {
      violations.push({
        code: 'OPTION_HAS_BAD_PREFIX',
        message: `Option ${index + 1} contains low-quality auto-expansion text and must be cleaned.`,
        fields: [`options[${index}]`],
        severity: 'warning',
        docRef: GOLDEN_DOC,
      });
      expandedOptions[index] = dePrefixed.length < 25 ? expandShortOption(dePrefixed, lang) : dePrefixed;
      return;
    }

    const { stripped, changed } = stripKnownAutoSuffix(option);
    if (changed) {
      violations.push({
        code: 'OPTION_HAS_BAD_SUFFIX',
        message: `Option ${index + 1} contains low-quality auto-expansion text and must be cleaned.`,
        fields: [`options[${index}]`],
        severity: 'warning',
        docRef: GOLDEN_DOC,
      });
      expandedOptions[index] = stripped.length < 25 ? expandShortOption(stripped, lang) : stripped;
      return;
    }

    if (containsBannedPhrase(option)) {
      violations.push({
        code: 'OPTION_HAS_LESSON_REF',
        message: `Option ${index + 1} references course/lesson language (violates standalone rule).`,
        fields: [`options[${index}]`],
        severity: 'warning',
        docRef: GOLDEN_DOC,
      });
      const rewritten = rewriteLessonReferencedOption(option, lang);
      if (rewritten) {
        expandedOptions[index] = rewritten;
        return;
      }
    }
    if (option.length < 25) {
      violations.push({
        code: 'OPTION_TOO_SHORT',
        message: `Option ${index + 1} is shorter than 25 characters.`,
        fields: [`options[${index}]`],
        severity: 'warning',
        docRef: GOLDEN_DOC,
      });
      expandedOptions[index] = expandShortOption(option, lang);
    }
  });

  // If we expanded any short option or normalized whitespace, patch the options.
  if (expandedOptions.some((opt, index) => opt !== item.options[index])) {
    autoPatch.options = expandedOptions;
  }

  // Keep hashtags consistent when we auto-convert recall -> application.
  const shouldUpgradeHashtags =
    (item.questionType === 'recall' || (!item.questionType && hasRecallTag)) &&
    Array.isArray(item.hashtags);
  if (shouldUpgradeHashtags) {
    const cleaned = hashtags.filter((t) => t && t !== '#' && t !== '#recall');
    const updated = cleaned.includes('#application') ? cleaned : [...cleaned, '#application'];
    autoPatch.hashtags = updated;
  }

  return {
    questionId: item._id,
    violations,
    needsUpdate: violations.length > 0 || Object.keys(autoPatch).length > 0,
    autoPatch,
  };
}
