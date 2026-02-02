/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 18 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-18-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-18-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_18';
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
      'Egy csapatot naponta 8 különböző stakeholder pingel chaten „csak egy gyors kérdés” jelleggel, és szétesik a fókusz. Mi a legjobb beavatkozás?',
    options: [
      'Minden pingre azonnal válaszoltok, mert a gyors reagálás a legfontosabb.',
      'Letiltjátok az összes stakeholdert, mert csak zavarják a csapatot.',
      'A fejlesztők külön-külön válaszolnak, hogy gyors legyen.',
      'Kommunikációs cadenciát és egy csatornát vezettek be: heti rövid update + Review, és ad-hoc csak vészhelyzetben; a kérdéseknek kijelölt időablak.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#stakeholder', '#cadence', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder fix dátumot kér 3 hónapra előre, de sok a bizonytalanság. Mi a legjobb válasz, ami empirikus marad és mégis segít?',
    options: [
      'Fix dátumot ígérsz feltételek nélkül, mert ezt várják.',
      'Azt mondod, hogy soha semmit nem lehet megmondani, ezért nincs forecast.',
      'Forecastot adsz feltételekkel és trade-offokkal: mi alapján áll a becslés, mi csúszik, és mikor pontosítjátok újra a tudás alapján.',
      'A témát elkerülöd, hogy ne legyen konfliktus.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#forecast', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'A stakeholder térképen valaki magas befolyású, de ritkán érintett. Mi a legjobb kommunikációs stílus felé?',
    options: [
      'Rövid, érték- és kockázat-fókuszú update, ritkább, de rendszeres ritmusban.',
      'Részletes napi technikai jelentés minden commitról.',
      'Semmit nem kommunikáltok, mert ritkán érintett.',
      'Csak akkor kommunikáltok, amikor baj van.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#stakeholder-map', '#application', '#hu'],
  },
  {
    question:
      'Egy kulcs stakeholder gyakran változtatja az elvárásait, és a csapat frusztrált. Mi a legjobb lépés a „zaj” csökkentésére és a bizalom növelésére?',
    options: [
      'Ad-hoc teljesítitek az összes kérést, hogy ne legyen konfliktus.',
      'Transzparens cadencia + döntésnapló jellegű rögzítés: mi készült el, mi változott, mi a következő, és hogyan hat a backlogra; egy csatorna az igényeknek.',
      'A stakeholdereket kizárjátok minden eseményből.',
      'A csapat elrejti a státuszt, hogy kevesebb kérdés legyen.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#transparency', '#trust', '#application', '#hu'],
  },
  {
    question:
      'Két stakeholder ellentétes irányba húz: az egyik új funkciót akar gyorsan, a másik stabilitást. Mi a legjobb Scrum Master támogatás a döntéshez?',
    options: [
      'A hangosabb stakeholder igényét választjátok automatikusan.',
      'Mindkettőt megígéritek ugyanarra az időre, hogy mindenki elégedett legyen.',
      'Közös keretet kértek: érték/kockázat/hatás, majd PO-val transzparens trade-off döntés (mi csúszik) és ezt kommunikáljátok.',
      'Egyik stakeholdert sem hallgatjátok meg, mert a csapat dönt.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#prioritization', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapat szeretné csökkenteni az ad-hoc kérdéseket. Melyik „kimenet” a leghasznosabb heti kommunikációra?',
    options: [
      'Egy 1 oldalas update: mi készült el, mi változott, kockázatok, következő lépés, és mire van szükség a stakeholdertől.',
      'Egy hosszú, technikai log minden hibajavításról és commitról.',
      'Csak egy „minden oké” mondat, részletek nélkül.',
      'Egy napi 2 órás státusz meeting minden stakeholderrel.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#cadence', '#communication', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder csak akkor hall a csapatról, amikor gond van, ezért romlik a bizalom. Mi a legjobb változtatás?',
    options: [
      'Csak incidens esetén kommunikáltok, mert akkor fontos.',
      'Rendszeres, rövid cadencia (heti update + Review), ahol a kockázatokat is korán jelzitek, nem csak utólag.',
      'Elrejtitek a kockázatokat, hogy ne aggódjanak.',
      'A kommunikációt teljesen a fejlesztőkre hagyjátok, keret nélkül.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#trust', '#cadence', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-18-quiz' } }
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
      createdBy: 'apply-day-18-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-18-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 18 quiz applied');
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
