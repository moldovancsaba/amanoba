/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 12 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_12';
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
      'Egy Sprint Review-ra valaki hoz egy 15 perces státusz riportot (feladatlista, százalékok), de a stakeholder nem érti az értéket. Mi a legjobb átterelés?',
    options: [
      'Átkeretezed: inkrementum bemutatása + „mi változott a felhasználónak/üzletnek” + rövid kérdések a visszajelzéshez.',
      'Hagyod végigmenni a riportot, mert a státusz minden meeting alapja.',
      'Kéred, hogy a csapat tagjai mentegetőzzenek, miért nincs több kész feladat.',
      'A Review helyett azonnal egy órás backlog groomingot tartotok.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#sprint-review', '#value', '#application', '#hu'],
  },
  {
    question:
      'A bemutató közben a stakeholder azt mondja: „Ez nem ilyen kellett.” Mi a legjobb válasz, hogy a feedback hasznos legyen és ne személyeskedés?',
    options: [
      'Visszavágsz: „De ezt kértétek.”',
      'Láthatóan rögzíted a feedbacket, majd pontosítasz: „Mi hiányzik konkrétan, milyen példával?” és döntésre viszed (most/owner/backlog).',
      'Megszakítod a meetinget, mert a negatív feedback tönkreteszi a hangulatot.',
      'Kijelented, hogy a stakeholdernek nincs joga beleszólni a megoldásba.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#feedback', '#facilitation', '#application', '#hu'],
  },
  {
    question:
      'Egy Review-on 10 különböző igény érkezik egyszerre, és a beszélgetés szétesik. Mi a legjobb keret, hogy döntés is szülessen?',
    options: [
      'Minden igényt azonnal beígértek a következő Sprintre, hogy elégedettek legyenek.',
      'Timeboxot adsz, kategóriákba rendezed a feedbacket (érték/kockázat/UX), majd kiválasztjátok a top 1–2 témát és a többit backlogba viszitek ownerrel.',
      'A témákat nem rögzíted, mert úgyis minden változik.',
      'A döntést teljesen a fejlesztőkre bízod, a stakeholder véleményét nem kéred.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#timebox', '#prioritization', '#application', '#hu'],
  },
  {
    question:
      'A csapat egy Sprintben keveset tudott bemutatni, mert sok munka félig kész. Mi a legjobb tanulság a következő Review-ig, ha értéket akartok mutatni?',
    options: [
      'Következő Sprintben több munkát indítotok, hogy több minden „elkezdődjön”.',
      'Kisebb érték-szeletekre bontjátok a munkát, és „finish-first” fókuszt alkalmaztok, hogy legyen bemutatható inkrementum.',
      'A Review-t elhagyjátok, mert csak akkor érdemes, ha minden tökéletes.',
      'A bemutatható hiányt PR szöveggel pótoljátok (slide-okkal).',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#increment', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder a Review végén azt kéri: „Döntsétek el most, hogy pontosan mikor lesz kész a következő 3 hónap!” Mi a legjobb válasz, ami megőrzi az empirikus működést?',
    options: [
      'Azonnal fix dátumot mondasz mindenre, hogy megnyugodjon.',
      'Elmagyarázod, hogy a Review célja az inkrementum és a backlog adaptálása; rövid távú forecastot adhattok, de a részleteket iteratívan pontosítjátok a feedback alapján.',
      'Azt mondod, hogy a Scrum nem tervez, ezért semmit nem lehet megmondani.',
      'A kérdést figyelmen kívül hagyod és gyorsan lezárod a meetinget.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#empiricism', '#forecast', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Két stakeholder ellentétes feedbacket ad: az egyik gyorsabb funkciót kér, a másik stabilitást és kevesebb hibát. Mi a legjobb következő lépés, hogy a backlog döntés ne ad-hoc legyen?',
    options: [
      'Mindkettőt megígéred ugyanarra az időszakra, mert így mindenki elégedett.',
      'A hangosabb stakeholder kérését választod automatikusan.',
      'Rögzíted mindkettőt, majd közös keretet kérsz: érték/kockázat, célcsoport, mérhető siker; ennek alapján PO-val priorizált backlog döntés készül.',
      'Kidobod a feedbacket, mert ellentmondásos.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#prioritization', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy Review után rengeteg feedback gyűlt, de semmi nem változik a backlogban, ezért a stakeholder bizalma csökken. Mi a legjobb beavatkozás?',
    options: [
      'Bevezetsz Decision Logot: minden fontos feedbackhez döntés + backlog hatás + owner + határidő, és ezt transzparensen követitek.',
      'Következő alkalommal kevesebb stakeholdert hívtok, hogy kevesebb feedback legyen.',
      'Nem rögzítitek a feedbacket, mert úgyis csak zaj.',
      'A Review-t inkább prezentációvá alakítjátok, kérdések nélkül.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#decision-log', '#feedback', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-12-quiz' } }
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
      createdBy: 'apply-day-12-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-12-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 12 quiz applied');
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

