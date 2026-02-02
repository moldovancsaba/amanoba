/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 23 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_23';
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
      'Egy csapat új külső API-val integrálna, de nem tudják, működik-e a hitelesítés és a limitálás. Mi a legjobb következő lépés, hogy gyorsan csökkentsétek a bizonytalanságot?',
    options: [
      'Rögtön felvesztek 3 fejlesztőt és megírjátok a teljes integrációt, majd a végén kiderül, mi ment félre.',
      'Időkeretes spike: 1–2 konkrét tanulási kérdés (auth, rate limit), kis próbakód, és a végén döntés: milyen megoldás/riszk marad.',
      'Megvárjátok a következő negyedévet, hátha „magától tisztul” a helyzet.',
      'A hitelesítést kihagyjátok, mert az „később is ráér”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#uncertainty', '#spike', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder azt kéri: „Mondjátok meg most pontosan, mennyi idő a megoldás”, miközben az igény és a megoldás is homályos. Mi a legjobb Scrum Master válasz?',
    options: [
      'Kitalált, részletes dátumot adtok, mert „a bizonytalanságot nem szeretik”.',
      'A munkát elutasítjátok, mert bizonytalan dolgokra nem lehet ígérni.',
      'Kétlépcsős megközelítést ajánlasz: rövid discovery/spike a bizonytalanság csökkentésére, majd újratervezés konkrét opciókkal és kockázatokkal.',
      'A csapat vállalja azonnal, és párhuzamosan mindent elkezd, hogy „biztosra menjen”.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#stakeholder', '#discovery', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy új termékötletnél a csapat vitázik: „építsük meg rendesen” vagy „csináljunk prototípust”. Mikor a legjobb prototípust választani?',
    options: [
      'Amikor a cél a gyors visszajelzés: a felhasználó megértése és a hipotézis tesztelése a lehető legkisebb költséggel.',
      'Amikor már minden követelmény végleges, és nincs több kérdés.',
      'Amikor a csapatnak idő kell, hogy elfoglaltnak tűnjön.',
      'Amikor a prototípusból automatikusan kész termék lesz, extra munka nélkül.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#prototype', '#feedback', '#application', '#hu'],
  },
  {
    question:
      'Egy spike végén a csapat sok információt gyűjtött, de nincs döntés. Mi a legjobb kimenet, amit Scrum Masterként kérsz?',
    options: [
      'Egy döntési összefoglaló: opciók, fő kockázatok, ajánlás, és hogy mi a következő lépés (folytatjuk/módosítjuk/leállítjuk).',
      'Egy 30 oldalas dokumentum, amit senki nem olvas el, de „jó, hogy van”.',
      'Még egy spike, mert „még nem elég biztos”.',
      'A spike-ot elfelejtitek, és visszatértek a régi tervhez.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#decision', '#spike', '#application', '#hu'],
  },
  {
    question:
      'Egy discovery beszélgetés után kiderül, hogy a probléma nem ott van, ahol eddig hitték. Mi a legjobb lépés, hogy ez ne „kudarc”, hanem tanulás legyen?',
    options: [
      'Azonnal visszaállítjátok az eredeti tervet, mert a változás „kockázatos”.',
      'A tanulságot beépítitek: átírjátok a hipotézist, újraszeletelitek a backlogot, és a következő iterációt a friss tudás alapján tervezitek.',
      'A discovery-t titokban tartjátok, hogy senki ne lássa, hogy tévedtetek.',
      'A csapatot hibáztatjátok, mert „rosszul kérdeztek”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#learning', '#adapt', '#application', '#hu'],
  },
  {
    question:
      'Egy bizonytalan backlog elemet minden Sprintben „átpasszolnak” a következőre, mert túl nagy és túl ködös. Mi a legjobb beavatkozás?',
    options: [
      'A munkát törlitek a backlogból, mert ha bizonytalan, akkor úgysem fontos.',
      'Kisebb tanulási szeletekre bontjátok: először discovery/spike, majd egy kicsi, mérhető értékű inkrement.',
      'Megvárjátok, amíg a csapat egyszer csak magától megoldja.',
      'A tétet növelitek: egyszerre mindent elvállaltok, hogy „legyen már kész”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#slicing', '#backlog', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat prototípust készít, de a vezető azt mondja: „Ha már van, akkor tegyük élesbe”. Mi a legjobb Scrum Master reakció?',
    options: [
      'Beleegyezel, mert a prototípus ugyanaz, mint egy kész termék.',
      'A prototípust elrejted, hogy senki ne lássa.',
      'Azonnal élesítitek minden teszt nélkül, mert gyorsaság a lényeg.',
      'Tisztázod a célt és a kockázatot: prototípus tanulásra volt, éleshez DoD, minőségi kapuk és biztonság kell; döntsetek tudatosan a következő lépésről.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#prototype', '#quality', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-23-quiz' } }
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
      auditedBy: 'apply-day-23-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 23 quiz applied');
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

