/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 16 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-16-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-16-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_16';
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
      'Egy csapatnál nő a félkész munka és egyre később készülnek el a feladatok. Melyik két metrika kombináció adja a leggyorsabb jelzést a problémáról?',
    options: [
      'Story point összeg + meetingek száma (könnyen félrevisz, nem a flow-t méri)',
      'WIP (mennyi párhuzamos munka fut) + cycle time (mennyi idő, míg a munka elkészül)',
      'Emailek száma + commitok száma (aktivitást mér, nem befejezést és átfutást)',
      'Feladatok címeinek hossza + backlog mérete (nem ad jelzést a félkész munkáról)',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#flow', '#wip', '#application', '#hu'],
  },
  {
    question:
      'Egy termékcsapat gyorsabban szállít (nő a throughput), de nő a hibák száma és a visszajavítás is. Mi a legjobb következtetés és következő lépés?',
    options: [
      'A gyorsaság „megeszi” a minőséget: párosítsátok a flow metrikát minőségi jelzéssel (rework/defect escape) és vezessetek be minimum minőség-védelmet.',
      'A throughput elég, a hibák nem számítanak, ezért tovább gyorsítotok.',
      'A flow javult, ezért a minőséget nem kell mérni.',
      'A hibák csak pech, ezért hagyjátok figyelmen kívül.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#quality', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy stakeholder azt kérdezi: „Miért tart ilyen sokáig, amíg a kérésem megjelenik?” Melyik metrika válaszolja meg legjobban ezt a kérdést?',
    options: [
      'Cycle time: csak a „folyamatban” szakasztól a „kész”-ig tartó idő (nem a teljes várakozást)',
      'WIP: az egyszerre futó munka mennyisége (ok lehet, de nem közvetlen válasz a „mennyi ideig tart?” kérdésre)',
      'Lead time: a kérés megjelenésétől a leszállításig eltelt teljes idő',
      'Velocity: becslési egységek mennyisége idő alatt (könnyen félrevisz, nem ügyfél-kérés idejét méri)',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#lead-time', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat cycle time-ja javul, de a felhasználók nem használják az új funkciót. Melyik metrika-típus hiányzik leginkább a döntéshez?',
    options: [
      'WIP: csak a párhuzamos munka mennyiségét mutatja, nem a felhasználói hasznosságot',
      'Commit szám: aktivitás, nem érték vagy használat',
      'Érték/outcome jel: pl. adoption, aktiváció, konverzió vagy support terhelés változása',
      'Meeting hossza: folyamat-jel lehet, de nem mutatja, hogy a funkció hasznos-e',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#value', '#outcome', '#application', '#hu'],
  },
  {
    question:
      'Egy vezető egyetlen számot akar: „Hány story pointot csináltatok?” Mi a legjobb Scrum Master válasz, ha a cél a tanulás és nem a büntetés?',
    options: [
      'Ráálltok csak a story pointokra, és ehhez kötitek a bónuszt.',
      'Átterelitek a fókuszt trendekre és páros metrikákra: flow (WIP/cycle) + minőség (rework/defect) + 1 outcome jel, és elmagyarázzátok, mire jó ez a döntésekhez.',
      'Azt mondod, hogy metrikákra nincs szükség, ezért semmit nem mértek.',
      'A story pointokat megduplázzátok, hogy szebb legyen a szám.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#goodhart', '#metrics', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapatnál csökken a lead time, de nő a túlóra és romlik a hangulat. Melyik dashboard blokk jelzi ezt a problémát leginkább?',
    options: [
      'Egészség (fenntarthatóság) jelzések: túlóra, megszakítások, kiégés jelei, safety check',
      'Throughput: elkészült munkák száma (nem jelzi a csapat terhelését)',
      'Backlog mérete: a lista hossza (nem mutatja, hogy fenntartható-e a tempó)',
      'Story point összeg: becslési szám (könnyen torzít, nem egészség-jelzés)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#health', '#sustainability', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat mérni akar, de félnek, hogy a metrika „gaming”-hez vezet. Mi a legjobb szabály, ami csökkenti ezt a kockázatot?',
    options: [
      'A metrikához büntetést kapcsoltok, hogy mindenki komolyan vegye.',
      'A metrikához bónuszt kapcsoltok, hogy mindenki hajtsa.',
      'A metrikákat csak a vezetők látják, a csapat nem.',
      'A metrikákat tanulási célra használjátok, trendeket néztek, és nem kapcsoltok hozzájuk egyéni jutalmat/büntetést.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#goodhart', '#behavior', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-16-quiz' } }
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
      createdBy: 'apply-day-16-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-16-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 16 quiz applied');
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
