/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 30 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_30';
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
      'Egy új csapathoz csatlakozol Scrum Masterként. Mi a legjobb első heti stratégia, ha gyorsan szeretnél hatást, de nem akarod felborítani a csapatot?',
    options: [
      'Azonnal átírod a teljes folyamatot és minden eseményt, mert így gyorsabb lesz.',
      'Először megfigyelsz és kérdezel (cél, flow, DoD, blokkok), majd 1 kicsi kísérletet javasolsz 2 hétre mérőjellel.',
      'Nem beszélsz senkivel, csak a boardot nézed, mert abból minden látszik.',
      'A csapat helyett te kezdesz priorizálni, hogy „végre haladjanak”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#first-week', '#playbook', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat túl sok párhuzamos munkát futtat, és sosem érnek a végére. Mit érdemes először bevezetni a Playbookból?',
    options: [
      'WIP limitet és „befejezés előnyben” szabályt, hogy a flow stabilabb legyen.',
      'Még több projektet, hogy mindenki foglalt legyen.',
      'A státuszokat kreatívabbra nevezni, mert az motivál.',
      'A problémát elrejteni, hogy ne legyen konfliktus.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#wip', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat „Done”-ba tesz munkát, ami gyakran visszanyílik. Mi a legjobb playbook-szintű beavatkozás?',
    options: [
      'A DoD megerősítése (teszt/review/átadás minimum), és a visszanyitás trendjének követése, hogy látszódjon a hatás.',
      'A visszanyitásokat nem számoljátok, mert az rossz hangulatot okoz.',
      'A Done definícióját rugalmasabbá teszitek („kész, ha annak érezzük”).',
      'A csapatot megkéred, hogy dolgozzon többet, így nem lesz bug.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dod', '#quality', '#application', '#hu'],
  },
  {
    question:
      'A Review után a stakeholder mindig „jó volt” visszajelzést ad, de sosem derül ki, mi legyen a következő lépés. Mi a legjobb változtatás?',
    options: [
      'A Review-t demóra rövidítitek, és nem kértek több kérdést.',
      'A Review végén döntési pontot vezettek be: mi a következő lépés, milyen opciók vannak, és mit tanultunk a feedbackből.',
      'A stakeholdert kizárjátok a Review-ról, mert nem ad hasznos feedbacket.',
      'A Review-t törlitek, mert így gyorsabb.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#review', '#feedback', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy vezető azt kéri: „Legyen több riport, mert nem látom, hol tart a munka.” Mi a legjobb válasz, ami nem admin-t növel, hanem transzparenciát?',
    options: [
      'Napi 2 órás státusz meetingeket vezetsz be, mert az biztosan láthatóvá tesz mindent.',
      'A transzparenciát a rendszerbe teszed: board hygiene + definíciók + rendszeres, rövid cadence (pl. heti sync), így kevesebb a manuális riport.',
      'A riportot elutasítod, mert a vezetőnek nem jár információ.',
      'A csapatot megkéred, hogy írjon hosszabb kommenteket a ticketekre, mert az elég.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#stakeholder', '#transparency', '#application', '#hu'],
  },
  {
    question:
      'A tanúsítványra készülésnél mi a leghatékonyabb stratégia, ha a kérdések szituációs jellegűek?',
    options: [
      'Definíciók bemagolása, mert a vizsga úgyis ezt kéri.',
      'Napi rövid gyakorlás szituációs kérdésekkel, hibák elemzése (miért rossz?), és a gondolkodási keret használata a tradeoffokhoz.',
      'A gyakorlást elhagyod, mert a való élet úgyis más.',
      'Csak a legnehezebb kérdéseket olvasod, válasz nélkül.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#certificate', '#study', '#application', '#hu'],
  },
  {
    question:
      'Egy playbookot megírtatok, de senki nem használja. Mi a legjobb Scrum Master lépés, hogy a playbook „élő” legyen?',
    options: [
      'Elküldöd PDF-ben, és elvárod, hogy mindenki elolvassa.',
      'Kiválasztasz 1 policy-t, kipróbáljátok 2 hétig, mérőjelet néztek, majd a playbookot a tanulság alapján frissítitek.',
      'A playbookot lezárod, mert „kész”, és nem nyúlsz hozzá többé.',
      'A playbookot titkosítod, hogy ne kritizálják.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#playbook', '#experiment', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-30-quiz' } }
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
      auditedBy: 'apply-day-30-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 30 quiz applied');
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

