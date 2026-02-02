/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 17 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-17-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-17-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_17';
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
      'Egy csapattag azt mondja: „Nem lehet befejezni időben, túl sok a megszakítás.” Mi a legjobb coaching jellegű válasz, ami a következő lépés felé visz?',
    options: [
      '„Majd én megmondom, mit csináljatok: holnaptól senki nem beszél senkivel.”',
      '„Mi a cél a következő 1 hétre, és mi a tény arról, mennyi megszakítás történik? Milyen 2–3 opcióval tudnátok csökkenteni?”',
      '„Ez kifogás, csak dolgozzatok gyorsabban.”',
      '„A megszakítások normálisak, úgyhogy fogadd el.”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#coaching', '#grow', '#application', '#hu'],
  },
  {
    question:
      'Egy Scrum Master mindig ő oldja meg a blokkolásokat a csapat helyett. Mi a legnagyobb hosszú távú kockázat, és mi a jobb alternatíva?',
    options: [
      'Kockázat: a csapat passzívvá válik; alternatíva: kérdésekkel és keretekkel segítesz, hogy a csapat maga vállaljon ownership-et és találjon megoldást.',
      'Kockázat nincs, mert a Scrum Master feladata mindent megoldani.',
      'Kockázat: túl kevés meeting lesz; alternatíva: több státusz meeting.',
      'Kockázat: túl gyors lesz a csapat; alternatíva: lassítsatok.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#ownership', '#coaching', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy beszélgetésben a csapat rögtön megoldásokba ugrik, de nem tiszta a cél. Melyik GROW lépés hiányzik leginkább?',
    options: [
      'Options: minél több ötletet gyűjteni vita nélkül',
      'Way forward: kijelölni a következő lépést ownerrel',
      'Reality: tényeket és korlátokat összegyűjteni',
      'Goal: tisztázni, mit akartok elérni a beszélgetés végére',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#grow', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál incidens van (ügyfélkár). Mi a legjobb hozzáállás: coaching vagy direktív döntés?',
    options: [
      'Coaching: hosszú kérdéssor, mert fontos, hogy mindenki tanuljon azonnal.',
      'Direktív döntés: gyors biztonsági lépések, majd utólagos tanulás (retro) és coaching.',
      'Semmit nem csináltok, mert a csapatnak kell megoldania spontán.',
      'A blame a legjobb, mert gyorsan meglesz a felelős.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#safety', '#decision', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapattag azt mondja: „A PO sosem dönt, ezért állunk.” Mi a legjobb coaching kérdés, ami előrevisz és nem hibáztat?',
    options: [
      '„Mit csináltatok eddig, és mi lett az eredménye? Mi lenne a legkisebb következő lépés, ami tisztázza a döntési pontot?”',
      '„Miért ilyen rossz a PO?”',
      '„Hagyjátok, majd valaki más megoldja.”',
      '„A PO-t ki kell cserélni, ez az egyetlen út.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#coaching', '#next-step', '#application', '#hu'],
  },
  {
    question:
      'Egy Scrum Master „coaching” címkével elkerüli a keretek tartását: nincs timebox, nincs lezárás, csak beszélgetés. Mi a legjobb korrekció?',
    options: [
      'Még több szabad beszélgetés, mert az őszinteség a lényeg.',
      'Kizárólag tanítás: a Scrum Master tartson előadást.',
      'Először facilitáció: outcome + timebox + döntési/next step keret, és ezen belül coaching kérdések.',
      'A beszélgetést tiltsátok, mert a kérdések feleslegesek.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#facilitation', '#coaching', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat döntési helyzetben van, de nincs elég adat. Mi a legjobb coaching jellegű zárás, ami nem halogatás?',
    options: [
      '„Akkor most ne döntsünk, majd lesz valahogy.”',
      '„Válasszunk véletlenszerűen, úgyis mindegy.”',
      '„Ki vállalja az adatgyűjtést, milyen határidővel, és mikor hozzuk vissza a döntést? Mi lesz a döntési szabály?”',
      '„A vezető majd eldönti, ti ne foglalkozzatok vele.”',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#closure', '#ownership', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-17-quiz' } }
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
      createdBy: 'apply-day-17-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-17-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 17 quiz applied');
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
