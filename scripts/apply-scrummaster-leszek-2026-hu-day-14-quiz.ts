/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 14 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-14-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-14-quiz.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuizQuestionType } from '../app/lib/models';
import { validateLessonQuestions } from './question-quality-validator';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_14';
const LANGUAGE = 'hu';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const questions: Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  questionType: QuizQuestionType;
  hashtags: string[];
}> = [
  {
    question:
      'Egy stakeholder a Sprint közepén új „must-have” kéréssel jön, a fejlesztők szerint ez szétveri a fókuszt. Mi a legjobb Scrum Master lépés a konfliktus gyors tisztázására?',
    options: [
      'Azonnal megígéred, hogy belefér, mert a stakeholder mindig első.',
      'Megkéred a csapatot, hogy vitatkozzon addig, amíg a hangosabb győz.',
      'Konfliktus-triage: tények + érdekek + korlátok, majd 2–3 opció (slice / trade-off / kísérlet) és konkrét next step.',
      'A kérést elutasítod automatikusan, mert Sprint közben semmi nem változhat.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#conflict', '#triage', '#application', '#hu'],
  },
  {
    question:
      'PO és Dev között vita van: a PO szerint „még ezt a funkciót” be kell tenni, a Dev szerint nem fér bele. Mi a legjobb kérdés, ami a valódi problémára visz?',
    options: [
      '„Ki hibázott a becslésnél?”',
      '„Mi a legkisebb érték-szelet, ami még validálható, és mi az, ami kikerülne a scope-ból emiatt?”',
      '„Miért nem vagytok elég motiváltak?”',
      '„Hány órát dolgoztok túl, hogy beleférjen?”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#scope', '#slice', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder gyorsaságot követel, a Dev minőségi kockázatra figyelmeztet. Mi a legjobb következő lépés, hogy ne „hitvita” legyen?',
    options: [
      'A Dev felülírja a stakeholdert, mert a minőség mindig fontosabb.',
      'A stakeholder felülírja a Dev-et, mert az üzlet mindig fontosabb.',
      'Elhalasztjátok a témát határidő nélkül, hogy ne legyen konfliktus.',
      'Közösen tisztázzátok, melyik kockázat a nagyobb (piaci vs technikai), és meghatároztok minimum minőség-védelmet + mérhető siker kritériumot.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#quality', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy beszélgetés személyeskedésbe fordul („te mindig…”, „ti soha…”). Mi a legjobb facilitátori mondat, ami visszahozza a fókuszt?',
    options: [
      '„Folytassátok, mert így kijönnek az indulatok.”',
      '„Álljunk meg: mi a megfigyelhető tény, és mi a konkrét kockázat, amit kezelni akarunk?”',
      '„Aki személyeskedik, azt kizárjuk a csapatból.”',
      '„Ezt nem lehet megoldani, úgyhogy lépjünk tovább.”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#facilitation', '#conflict', '#application', '#hu'],
  },
  {
    question:
      'Két opció közül kell választani: A) nagy, nehezen visszafordítható döntés (3 hónap fejlesztés), B) 1 hetes kísérlet gyors visszajelzéssel. Mikor érdemes inkább a B-t választani?',
    options: [
      'Ha minden információ biztos és nincs kockázat.',
      'Ha a csapatnak nincs kedve dönteni, ezért halogatni akar.',
      'Ha a stakeholder azt mondja, hogy „mindegy”, akkor felesleges kísérletezni.',
      'Ha nagy a bizonytalanság és a döntést olcsón szeretnétek validálni gyors visszajelzéssel.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#experiment', '#decision', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder azt mondja: „Az én igényem legyen első.” Mi a legjobb válasz, ami mégis tiszteletben tartja az üzleti szempontot, de elkerüli az ad-hoc priorizálást?',
    options: [
      '„A prioritás érték/kockázat/hatás alapján dől el; ha ezt előre hozzuk, akkor megnevezzük, mi csúszik miatta, és ezt transzparensen vállaljuk.”',
      '„Rendben, a leghangosabb igény mindig első.”',
      '„A prioritásokat a fejlesztők döntik el, stakeholder input nélkül.”',
      '„A prioritásokat véletlenszerűen rotáljuk, hogy igazságos legyen.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#prioritization', '#stakeholder', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy konfliktusnál mindkét fél érzelmileg túlfűtött, és a beszélgetés nem halad. Mi a legjobb „következő lépés” döntés, ha nincs elég információ a választáshoz?',
    options: [
      'Owner kijelölése adatgyűjtésre (pl. kockázatok, opciók), határidővel és visszahozási időponttal; addig parking lot.',
      'Azonnali konszenzust erőltetsz, mert a gyors döntés mindennél fontosabb.',
      'A döntést egy külső tanácsadóra bízod, mert a csapat nem képes rá.',
      'Lezárod a témát döntés nélkül, és soha többé nem hozod fel.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#triage', '#next-step', '#application', '#hu'],
  },
];

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID });
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) throw new Error(`Lesson not found: ${LESSON_ID}`);

  const validation = validateLessonQuestions(
    questions.map((q) => ({
      question: q.question,
      options: q.options,
      questionType: q.questionType,
      difficulty: q.difficulty,
      correctIndex: q.correctIndex,
    })),
    LANGUAGE,
    String((lesson as any).title ?? '')
  );

  if (!validation.isValid) {
    console.error('❌ Question validation failed');
    for (const err of validation.errors) console.error('-', err);
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️  Validation warnings:');
    for (const w of validation.warnings) console.warn('-', w);
  }

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'quiz-backups', COURSE_ID);
  const backupFile = join(backupDir, `${LESSON_ID}__${stamp}.json`);

  const existing = await QuizQuestion.find({
    courseId: course._id,
    lessonId: LESSON_ID,
    isCourseSpecific: true,
    isActive: true,
  })
    .sort({ displayOrder: 1, _id: 1 })
    .select({ _id: 1, uuid: 1, question: 1, options: 1, correctIndex: 1, questionType: 1, difficulty: 1, hashtags: 1, displayOrder: 1 })
    .lean();

  const backupPayload = {
    generatedAt: new Date().toISOString(),
    courseId: COURSE_ID,
    lessonId: LESSON_ID,
    existingActiveCount: existing.length,
    existingActiveQuestions: existing,
    newQuestions: questions.map((q, displayOrder) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      questionType: q.questionType,
      difficulty: q.difficulty,
      hashtags: q.hashtags,
      displayOrder,
    })),
  };

  if (!APPLY) {
    console.log('DRY RUN (no DB writes).');
    console.log(`- courseId: ${COURSE_ID}`);
    console.log(`- lessonId: ${LESSON_ID}`);
    console.log(`- existing active course-specific questions: ${existing.length}`);
    console.log(`- would backup to: ${backupFile}`);
    console.log(`- would deactivate existing and insert: ${questions.length}`);
    await mongoose.disconnect();
    return;
  }

  mkdirSync(backupDir, { recursive: true });
  writeFileSync(backupFile, JSON.stringify(backupPayload, null, 2));

  if (existing.length) {
    await QuizQuestion.updateMany(
      { _id: { $in: existing.map((q: any) => q._id) } },
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-14-quiz' } }
    );
  }

  const now = new Date();
  const inserts = questions.map((q, idx) => ({
    uuid: randomUUID(),
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    difficulty: q.difficulty,
    category: 'Course Specific',
    showCount: 0,
    correctCount: 0,
    isActive: true,
    lessonId: LESSON_ID,
    courseId: course._id,
    relatedCourseIds: [],
    isCourseSpecific: true,
    questionType: q.questionType,
    hashtags: q.hashtags,
    displayOrder: idx,
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: 'apply-day-14-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-14-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 14 quiz applied');
  console.log(`- courseId: ${COURSE_ID}`);
  console.log(`- lessonId: ${LESSON_ID}`);
  console.log(`- deactivated: ${existing.length}`);
  console.log(`- inserted: ${inserted.length}`);
  console.log(`- backup: ${backupFile}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
