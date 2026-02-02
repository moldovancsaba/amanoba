/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 27 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_27';
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
      'Interjú közben megkérdezik: „Mit csinálsz, ha a Daily státusz meetinggé válik?” Mi a legjobb válasz-struktúra, ami konkrét és hiteles?',
    options: [
      '„A Scrum szerint a Daily 15 perc, ezért mindenki tartsa be.”',
      '„Helyzet → beavatkozás → hatás → tanulság”: pl. cél tisztázás, kérdések a Sprint célhoz, parkoló, majd mérhető javulás (rövidebb Daily, több blokk látható).',
      '„Nálam ilyen sosem történik, mert nálam mindig fegyelem van.”',
      '„A Daily-t töröljük, mert az csak időpazarlás.”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#interview', '#daily', '#application', '#hu'],
  },
  {
    question:
      'Interjún azt mondod: „A csapat nem volt elég motivált, ezért nem haladtunk.” Mi a legjobb korrekció, hogy a válasz ne legyen blaming?',
    options: [
      'A hangsúlyt a rendszerre teszed: mi volt a folyamat/korlát, milyen kísérletet vezettél be, és mi változott megfigyelhetően.',
      'A csapatot még jobban kritizálod, hogy lásd a probléma gyökerét.',
      'A választ rövidebbre veszed és elhagyod a részleteket.',
      'A blaming rendben van, mert így a jelölt jól jön ki.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#interview', '#blaming', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Interjúkérdés: „Mesélj egy konfliktusról PO és Dev csapat között.” Melyik válasz a legjobb jelölt-válasz?',
    options: [
      '„A PO mindig problémás volt, én csak próbáltam túlélni.”',
      '„Elmagyaráztam a Scrum definíciókat, és megtiltottam a vitát.”',
      '„Konkrét helyzet: cél/érték tisztázás + közös döntési szabály + következő Sprintben mérhetően kevesebb scope vita; tanulság: korai tisztázás.”',
      '„Nem emlékszem konfliktusra, nálunk sosem volt.”',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#interview', '#conflict', '#application', '#hu'],
  },
  {
    question:
      'Interjúkérdés: „Hogyan kezeled a stakeholder nyomást, ha scope nő?” Mi a legjobb beavatkozás-sor?',
    options: [
      'Azonnal mindent bevállaltok, hogy a stakeholder elégedett legyen.',
      'Megtagadod a kérést, mert a stakeholdernek nincs beleszólása.',
      'Átláthatóvá teszed a tradeoffot: Sprint cél, opciók (csere, későbbre tolás), kockázat, és közös döntés a legkisebb érték-szelettel.',
      'A csapatot túlórára kötelezed, mert így minden belefér.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#stakeholder', '#scope', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Interjún megkérdezik: „Milyen mérőket nézel?” Melyik válasz a legjobb kezdő Scrum Master szinthez?',
    options: [
      '„Csak a velocity, mert az mindent megmutat.”',
      '„Meetingek száma, mert az mutatja a koordinációt.”',
      '„Nem nézek semmit, mert a mérés kontroll.”',
      '„Flow és minőség jelek: WIP/torlódás, blokk ideje, visszanyitás, átfutási idő trend; és mindig a célhoz kötöm.”',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#metrics', '#interview', '#application', '#hu'],
  },
  {
    question:
      'Egy jelölt nagyon elméleti válaszokat ad. Mi a legjobb follow-up kérdés, ami segít konkrétumot kapni?',
    options: [
      '„Mi a Scrum definíciója a Daily-nek?”',
      '„Mondj egy konkrét példát: mit tettél, mi változott megfigyelhetően, és mit tanultál belőle?”',
      '„Miért nem tudsz rendesen válaszolni?”',
      '„Melyik könyvet olvastad legutóbb?”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#interview', '#followup', '#application', '#hu'],
  },
  {
    question:
      'Interjún azt mondod: „Én mindig megmondom a csapatnak, mit csináljon.” Melyik átkeretezés mutat coach szemléletet és növeli az esélyedet?',
    options: [
      '„A csapat döntéseit tisztelem, kérdésekkel és kísérletekkel segítek; célom, hogy a csapat maga váljon egyre jobbá.”',
      '„A csapat gyerek, én vagyok a főnök.”',
      '„A Scrum Master főleg adminisztrál és riportál; a működés javítása úgyis a vezetők dolga.”',
      '„Mindig én döntök, mert így gyorsabb.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#coaching', '#interview', '#application', '#hu'],
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

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'quiz-backups', COURSE_ID);
  const backupFile = join(backupDir, `${LESSON_ID}__${stamp}.json`);

  const existing = await QuizQuestion.find({ courseId: course._id, lessonId: LESSON_ID, isCourseSpecific: true, isActive: true })
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-27-quiz' } }
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
      auditedAt: now,
      auditedBy: 'apply-day-27-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 27 quiz applied');
  console.log(`- courseId: ${COURSE_ID}`);
  console.log(`- lessonId: ${LESSON_ID}`);
  console.log(`- deactivated: ${existing.length}`);
  console.log(`- inserted: ${inserts.length}`);
  console.log(`- backup: ${backupFile}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
