/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 10 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_10';
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
      'Egy csapatban mindenki egyszerre 5 feladaton dolgozik, ezért sok a félkész munka és ritkán készül el bármi. Mi a legjobb első lépés a flow javítására?',
    options: [
      'A problémát motivációs beszéddel oldjátok meg, mert a flow csak hozzáállás kérdése.',
      'A félkész munkát „kész”-nek jelölitek, hogy a statisztika jobb legyen.',
      'Bevezettek egy WIP limitet (pl. 1 munka/fő) és a „finish-first” szabályt: előbb befejeztek, csak utána indítotok újat.',
      'Még több munkát indítotok el, mert a párhuzamosság mindig gyorsít.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#wip', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Egy munka blokkolt (külső függőség), ezért a csapat tagjai új munkákat kezdenek el. Mi a legjobb szabály, ami csökkenti a káoszt?',
    options: [
      'Blokkolásnál azonnal új munkát kell kezdeni, mert a befejezés úgysem lehetséges.',
      'Blokkolásnál a Scrum Master átveszi a munkát, mert neki kell megoldania az akadályt.',
      'Blokkolásnál a csapat leáll, mert a függőségeket nem lehet kezelni.',
      'Blokkolásnál először owner + next step, és a csapat a blokkolás feloldására fókuszál, mielőtt új munkát indít.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#wip', '#impediment', '#application', '#hu'],
  },
  {
    question:
      '„Minden sürgős” helyzetben a csapat naponta többször kap új kéréseket, és emiatt szétesik a fókusz. Mi a legjobb döntési keret?',
    options: [
      'Egy 2 perces triage: hatás, deadline, owner, és mi csúszik miatta; csak ezután döntötök a sorrendről és a WIP-ről.',
      'Minden új kérést azonnal bevesztek, mert a gyors reagálás a legfontosabb.',
      'A kéréseket elutasítjátok automatikusan, mert a fókusz mindig fontosabb.',
      'A döntést a vezetőre bízzátok, mert a csapatnak nem dolga priorizálni.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#triage', '#focus', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatban a „majdnem kész” elemek száma nő, és a Sprint végén sok a rész-kész munka. Melyik beavatkozás javítja legjobban az érték-szállítást?',
    options: [
      'A rész-kész munkát elfogadjátok, mert legalább haladás látszik.',
      'A „majdnem kész” elemeket befejezitek, és csak utána indítotok új munkát (finish-first + WIP limit).',
      'A csapat több feladatot indít, hogy nagyobb legyen az aktivitás.',
      'A Sprint végén mindent egyszerre próbáltok befejezni, mert a kapkodás gyorsít.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#finish-first', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat bevezet WIP limitet, de a lead time nem javul, mert a munka gyakran várakozik külső jóváhagyásra. Mi a legjobb következő lépés?',
    options: [
      'A WIP limitet törlitek, mert a várakozás azt jelenti, hogy a WIP limit haszontalan.',
      'Még több munkát indítotok, hogy a várakozás ideje „kitöltődjön”.',
      'A várakozó munkát „kész”-nek jelölitek, mert így javul a statisztika.',
      'Azonosítjátok a szűk keresztmetszetet (jóváhagyás), és bevezettek védelmet: előre egyeztetett SLA, gyors jóváhagyási idősáv, vagy a munka szeletelése kisebbre, hogy kevesebb legyen a várakozás.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#bottleneck', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Két stratégia között választasz a csapatnál. A: mindenki több mindent kezd el, hogy „pörögjön”. B: kevesebb WIP, befejezés-fókusz. Melyik támogatja jobban az empirikus tanulást, és mi a tipikus kockázat?',
    options: [
      'A támogatja jobban, mert több munka = több tanulás; kockázat nincs.',
      'B támogatja jobban, mert több befejezett kimenet ad visszajelzést; kockázat, hogy ha a triage rossz, a csapat túl óvatos lesz és nem választ jó kísérleteket.',
      'A támogatja jobban, mert a félkész munka is visszajelzés; kockázat, hogy a csapat túl gyors lesz.',
      'B rosszabb, mert a WIP limit mindig lassít; kockázat, hogy túl sok minden készül el.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#wip', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapat WIP limitet vezet be, és a cycle time javul, de a csapat panaszkodik: „kevesebb dolgon dolgozunk, unalmas”. Mi a legjobb válasz és következő lépés?',
    options: [
      'Megmutatjátok a javuló metrikát (cycle time) és bevezettek „pull” szabályt: ha valaki befejezett, segítsen blokkolást oldani vagy minőséget javítani, ne új munkát indítson a limit megkerülésével.',
      'Visszaállítjátok a régi állapotot, mert a csapat hangulata fontosabb a flow-nál.',
      'Kijelented, hogy a WIP limit a szabály, és aki panaszkodik, az nem elég motivált.',
      'A WIP limitet úgy oldjátok meg, hogy mindenki egyszerre több oszlopba húz feladatokat, így a limit papíron teljesül.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#wip', '#change', '#critical-thinking', '#hu'],
  },
];

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID });
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) throw new Error(`Lesson not found: ${LESSON_ID}`);

  const validation = validateLessonQuestions(
    questions.map(q => ({
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
    throw new Error(`Question validation failed:\n- ${validation.errors.join('\n- ')}`);
  }
  if (validation.warnings.length) {
    console.log('⚠️ Validation warnings:');
    for (const w of validation.warnings) console.log(`- ${w}`);
  }

  const existing = await QuizQuestion.find({
    lessonId: LESSON_ID,
    courseId: course._id,
    isCourseSpecific: true,
    isActive: true,
  })
    .sort({ displayOrder: 1, 'metadata.createdAt': 1, _id: 1 })
    .lean();

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'quiz-backups', COURSE_ID);
  mkdirSync(backupDir, { recursive: true });
  const backupPath = join(backupDir, `${LESSON_ID}__${stamp}.json`);

  if (!APPLY) {
    console.log('DRY RUN (no DB writes).');
    console.log(`- courseId: ${COURSE_ID}`);
    console.log(`- lessonId: ${LESSON_ID}`);
    console.log(`- existing active course-specific questions: ${existing.length}`);
    console.log(`- would backup to: ${backupPath}`);
    console.log(`- would deactivate existing and insert: ${questions.length}`);
    await mongoose.disconnect();
    return;
  }

  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        backedUpAt: new Date().toISOString(),
        course: { courseId: COURSE_ID, name: course.name, language: course.language },
        lesson: { lessonId: LESSON_ID, dayNumber: (lesson as any).dayNumber, title: (lesson as any).title },
        questionCount: existing.length,
        questions: existing.map((q: any) => ({
          _id: String(q._id),
          uuid: q.uuid,
          questionType: q.questionType,
          difficulty: q.difficulty,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          hashtags: q.hashtags,
          displayOrder: q.displayOrder,
        })),
      },
      null,
      2
    )
  );

  if (existing.length) {
    await QuizQuestion.updateMany(
      { _id: { $in: existing.map((q: any) => q._id) } },
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-10-quiz' } }
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
      createdBy: 'apply-day-10-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-10-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 10 quiz applied');
  console.log(`- courseId: ${COURSE_ID}`);
  console.log(`- lessonId: ${LESSON_ID}`);
  console.log(`- deactivated: ${existing.length}`);
  console.log(`- inserted: ${inserted.length}`);
  console.log(`- backup: ${backupPath}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
