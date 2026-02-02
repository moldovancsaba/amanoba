/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 19 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-19-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-19-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_19';
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
      'Egy csapatban sok a félkész munka és nő a frusztráció. Új szokásként bevezetnétek egy WIP limitet, de ellenállás van. Mi a legjobb bevezetési stratégia?',
    options: [
      'Azonnali, végleges szabály: holnaptól kötelező, mérés nélkül, mert a fegyelem a lényeg.',
      'Egyszerre 6 új szabályt vezettek be, hogy „mindent rendbe tegyetek”.',
      'Két hetes kísérletként vezeted be: világos probléma + hipotézis + 1 konkrét szabály + mérés + védőkorlát + stop/continue döntés.',
      'Nem kommunikáltok róla, csak csendben elvárod, hogy mindenki betartsa.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#change', '#wip', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat azt mondja egy új szokásra: „Már próbáltuk, nem működik.” Melyik válasz csökkenti legjobban a hitvitát?',
    options: [
      '„Akkor nincs mit tenni, minden marad így.”',
      '„Működni fog, csak higgyetek benne.”',
      '„Kipróbáljuk 2 hétig pontos hipotézissel, mérőponttal és védőkorláttal; nem végleges döntés, hanem teszt.”',
      '„Aki ellenkezik, az akadályozza a csapatot.”',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#skepticism', '#experiment', '#application', '#hu'],
  },
  {
    question:
      'Egy új szokás bevezetésénél valaki azt mondja: „Mi lesz, ha ez elrontja a minőséget?” Mi a legjobb válasz, ha gyorsan szeretnél biztonságot adni?',
    options: [
      '„Nem fogja elrontani, bízz bennem.”',
      'A kockázatot figyelmen kívül hagyjátok, mert a változás mindig fáj.',
      'A minőséget feláldozzátok, mert a sebesség fontosabb.',
      'Védőkorlátot definiáltok (minőség/biztonság), kis hatókörrel indítotok, és ha sérül a védőkorlát, leállítjátok vagy módosítjátok a kísérletet.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#fear', '#guardrails', '#application', '#hu'],
  },
  {
    question:
      'Egy Scrum Master bevezet egy új szabályt, de nem definiál mérőpontot és nincs felülvizsgálat. Mi a legvalószínűbb következmény?',
    options: [
      'A csapat gyorsan és tartósan javul, mert a szabály önmagában elég.',
      'A változás hitvitává válik, nem derül ki, működik-e, és az ellenállás nő.',
      'Mindenki automatikusan betartja, mert „új szabály”.',
      'A stakeholderek hirtelen kevesebbet kérnek, mert így szokták.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#measurement', '#change', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapat egyszerre akarja bevezetni: WIP limit, új DoD, új Daily struktúra és fókusz idősáv. Mi a legjobb Scrum Master döntés, ha a cél a sikeres változás?',
    options: [
      'Egyet választotok (1 szokás), 2 hetes kísérletként; a többit későbbre ütemezitek, hogy legyen kapacitás befejezni és tanulni.',
      'Mindent egyszerre vezettek be, mert így gyorsabb a változás.',
      'A változtatásokat csak dokumentáljátok, de nem próbáljátok ki.',
      'A csapat helyett a Scrum Master egyedül dönti el és kihirdeti mindet.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#focus', '#change', '#application', '#hu'],
  },
  {
    question:
      'Egy új szokás bevezetésénél a csapat azt mondja: „Mindig így csináltuk.” Mi a legjobb lépés, hogy az inertia ellenére elinduljon a tanulás?',
    options: [
      'Addig vitatkoztok, amíg mindenki el nem fogadja elméletben.',
      'Apró változtatással indítotok, emlékeztetőt használtok, és gyors visszajelzést gyűjtötök 1–2 metrikával.',
      'A szokás erejét úgy töröd meg, hogy azonnal lecseréled a csapat felét.',
      'Semmit nem csináltok, mert a szokások nem változnak.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#inertia', '#change', '#application', '#hu'],
  },
  {
    question:
      'Két bevezetési stílus között választasz: A) „Holnaptól kötelező, mert így lesz jó.” B) „2 hét kísérlet, mérés, védőkorlát, közös döntés.” Miért lehet B hosszú távon jobb, és mi a fő kockázata?',
    options: [
      'B jobb, mert a csapat tanul és elköteleződik; kockázat, hogy ha nincs valódi felülvizsgálat, a kísérlet „örökre félkész” marad döntés nélkül.',
      'A jobb, mert a félelem mindig motivál; kockázat nincs.',
      'B rosszabb, mert a mérés mindig gaminghez vezet; kockázat, hogy túl sok adat lesz.',
      'A jobb, mert gyors; kockázat, hogy túl sok lesz a bizalom.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#change', '#tradeoffs', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-19-quiz' } }
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
      createdBy: 'apply-day-19-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-19-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 19 quiz applied');
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
