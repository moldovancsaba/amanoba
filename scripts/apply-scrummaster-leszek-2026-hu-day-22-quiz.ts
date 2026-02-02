/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 22 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_22';
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
      'Egy HR csapat onboarding folyamatot akar javítani Scrum-szerűen, de azt mondják: „Nálunk nincs release.” Mi a legjobb válasz, hogy mégis legyen empirikus működés?',
    options: [
      'Scrum csak fejlesztésre jó, ezért nem is próbáljátok.',
      'A folyamatot egyszerre teljesen átszervezitek, majd fél év múlva megnézitek, jobb lett-e.',
      'Megkeresitek a „release” megfelelőjét: kisméretű, befejezhető érték-szeletek és rendszeres review pontok a visszajelzéshez.',
      'Csak státusz meetingeket tartotok, mert az helyettesíti a visszajelzést.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#non-it', '#empiricism', '#application', '#hu'],
  },
  {
    question:
      'Egy non-IT csapat „kész” definíciója annyi: „elküldtük emailben”. Melyik a legjobb javítás, ha a cél a valódi befejezés és az outcome?',
    options: [
      'A „kész” definíció felesleges, mert csak lassít.',
      'DoD kibővítése: jóváhagyás, publikálás/átadás, mérés (outcome jel), és visszajelzés pont meghatározása.',
      'A „kész” az, amikor valaki azt mondja, hogy kész, így rugalmas marad.',
      'A DoD-t csak IT-ben kell használni, non-IT-ben nem.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dod', '#done', '#application', '#hu'],
  },
  {
    question:
      'Egy marketing csapat kampányt készít, de minden Sprintben a jóváhagyás csúszása miatt áll a munka. Mi a legjobb Scrum Master lépés?',
    options: [
      'A probléma csak motiváció, ezért motivációs tréninget tartotok.',
      'A jóváhagyást figyelmen kívül hagyjátok, és „kész”-nek jelölitek a kampányt.',
      'A csapat több párhuzamos kampányt indít, hogy „ne álljon a munka”.',
      'A jóváhagyási lépések és korlátok beépítése a folyamatba: döntési owner, SLA/idősáv, és a „kész” definíció része legyen a jóváhagyás.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#constraints', '#approval', '#application', '#hu'],
  },
  {
    question:
      'Egy operations csapatban azt mondják: „Nálunk nem lehet mérni az értéket.” Mi a legjobb kérdés, ami előrevisz?',
    options: [
      '„Mi az a jel, ami alapján egy érintett azt mondaná: gyorsabb, kevesebb hiba, kevesebb újranyitás, elégedettebb ügyfél?”',
      '„Miért vagytok ennyire negatívak?”',
      '„Akkor nem is kell mérni, csak dolgozzatok.”',
      '„A value mindig bevétel, ha nincs bevétel, nincs érték.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#value', '#outcome', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy non-IT folyamatban túl nagyok a munkadarabok, ezért a review ritka és a feedback későn jön. Mi a legjobb beavatkozás?',
    options: [
      'Nagyobb munkadarabokat készítetek, hogy „egyszerre legyen kész minden”.',
      'Érték-szeletelés: kisebb, befejezhető deliverable-ok, gyakori review ponttal és egy egyszerű mérőjellel.',
      'A review-t elhagyjátok, mert a feedback úgyis zavar.',
      'A csapat több párhuzamos munkát indít, hogy látszódjon a haladás.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#slicing', '#feedback', '#application', '#hu'],
  },
  {
    question:
      'Egy HR csapat backlogot vezet, de a kérések DM-ben és emailben jönnek, ezért a backlog nem SSOT. Mi a legjobb „tool etikett” döntés?',
    options: [
      'A backlogot elhagyjátok, és mindenki DM-ben kéri, amit akar.',
      'A Scrum Master fejben tartja a kéréseket, mert így gyorsabb.',
      'Egy beérkeztetési szabály: minden igény csak a backlogon keresztül válik munkává; a csatornák csak jelzésre valók, nem prioritásra.',
      'Minden kérést azonnal elvállaltok, hogy ne legyen konfliktus.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#ssot', '#backlog', '#application', '#hu'],
  },
  {
    question:
      'Egy non-IT csapatban a „kód integráció” helyett a fő fájdalom a több jóváhagyó és a compliance. Mi a legjobb Scrum Master szemlélet?',
    options: [
      'A compliance-t ignoráljátok, mert az „agile-ellenes”.',
      'A jóváhagyókat kizárjátok, mert lassítanak.',
      'A csapat minden Sprint végén egyben kér jóváhagyást, mert így „kevesebb a megszakítás”.',
      'A korlátot a rendszer részeként kezeled: transzparens lépések, időkeretek, owner, és a DoD része a szükséges jóváhagyás, hogy ne a végén derüljön ki.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#constraints', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-22-quiz' } }
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
    metadata: { createdAt: now, updatedAt: now, createdBy: 'apply-day-22-quiz', auditedAt: now, auditedBy: 'apply-day-22-quiz' },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);
  console.log('✅ Day 22 quiz applied');
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
