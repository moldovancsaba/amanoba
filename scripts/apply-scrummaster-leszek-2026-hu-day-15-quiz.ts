/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 15 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-15-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-15-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_15';
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
      'Egy csapat 30 percig vitatkozik, hogy új ticket-rendszerre váltson-e, de nincs adat. Mi a legjobb következő lépés, hogy ne álljon le a haladás?',
    options: [
      'Időboxolt kísérlet: 1 hét pilot 1 csapattal, mérőpontokkal (pl. átfutási idő, hibaarány), majd döntés.',
      'Végleges döntés most azonnal, mert a bizonytalanság káros.',
      'Konszenzust erőltettek addig, amíg mindenki lelkes lesz.',
      'A témát elengeditek örökre, mert konfliktusos.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#experiment', '#decision', '#application', '#hu'],
  },
  {
    question:
      'Egy döntés könnyen visszafordítható, alacsony a kockázat, de a csapat mégis hetekig elemzi. Mi a legjobb Scrum Master beavatkozás?',
    options: [
      'Kísérletet javasolsz rövid időboxszal és egyszerű stop/continue szabállyal.',
      'További elemzést kérsz, mert a gyors döntés mindig rossz.',
      'A döntést a leghangosabb emberre bízod, hogy gyors legyen.',
      'Megkéred a csapatot, hogy ne hozzon több döntést a jövőben.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#reversible', '#experiment', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat „kísérletet” indít, de nem definiálja, honnan tudják, hogy sikerült. Mi hiányzik leginkább ahhoz, hogy empirikus legyen?',
    options: [
      'Egy inspiráló beszéd, hogy jobban higgyenek benne.',
      'Minél több akciópont, hogy mindent lefedjenek.',
      'Stop/continue szabály, 1–2 mérőpont és időbox (mikor értékeljük újra).',
      'Titoktartás, hogy ne legyen befolyásolva az eredmény.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#metrics', '#experiment', '#application', '#hu'],
  },
  {
    question:
      'Egy döntés hibája potenciálisan ügyféladat-vesztéssel járhat. Mi a legjobb megközelítés a „döntés vs kísérlet” keretben?',
    options: [
      'Azonnal élesben kipróbáljátok, mert gyors visszajelzés kell.',
      'Semmit nem csináltok, mert a kockázat mindig tiltás.',
      'A kockázatot ignoráljátok, mert a csapat motivált.',
      'Kísérletet csak védőkorláttal (biztonság, rollback, kis hatókör), több adatgyűjtéssel és óvatos bevezetéssel.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#risk', '#decision', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy meeting végén nincs döntés, csak hosszú vita. Melyik lezárás a legjobb, hogy a csapat haladjon tovább?',
    options: [
      '„Majd egyszer visszatérünk rá” — határidő nélkül.',
      '„Most nem döntünk” — owner adatot hoz, határidővel, és a témát visszahozzátok konkrét időpontban.',
      '„Döntsünk gyorsan” — véletlenszerűen választotok.',
      '„A vita a lényeg” — folytatjátok a következő meetingben ugyanonnan.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#closure', '#next-step', '#application', '#hu'],
  },
  {
    question:
      'Két opció van: A) nagy, drága és nehezen visszafordítható változtatás, B) kis, gyors kísérlet. Milyen helyzetben lehet mégis indokolt a nagy, drága változtatás?',
    options: [
      'Ha magas a bizonytalanság és nincs adat, akkor A mindig jobb.',
      'Ha a döntés olcsón visszafordítható, akkor A jobb.',
      'Ha jogi/szabályozási okból kötelező, és a kockázat kezelése védőkorlátokkal történik.',
      'Ha a csapat unatkozik, és kell egy nagy projekt.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#tradeoffs', '#risk', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapat nem tudja eldönteni, hogy változtasson-e a Daily formátumán. Mi a legjobb megoldás, ha szeretnétek gyorsan tanulni?',
    options: [
      'Véglegesen lecserélitek a Daily-t egy órás státusz-meetingre.',
      '1 hetes kísérlet: új struktúra + timebox + mérés (pl. megszakítások, blokkolások feloldási ideje), majd értékelés.',
      'Megtiltjátok a Daily-t, mert a meetingek feleslegesek.',
      'Minden nap más formátumot próbáltok, hogy ne legyen unalmas.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#daily', '#experiment', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-15-quiz' } }
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
      createdBy: 'apply-day-15-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-15-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 15 quiz applied');
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
