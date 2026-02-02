/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 24 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_24';
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
      'Egy csapat gyorsabban akar szállítani, ezért lazítaná a „kész” kritériumokat. Mi a legjobb Scrum Master reakció, ha a cél a tartósan gyorsabb flow?',
    options: [
      'Elmagyarázod, hogy a minőség feladása reworköt és hibát hoz; inkább kicsi szeletek + stabil DoD + WIP csökkentés, hogy a flow gyorsuljon minőségromlás nélkül.',
      'Engeded el a minőséget, mert a „sebesség” a legfontosabb.',
      'Megkéred a csapatot, hogy dolgozzon többet, így lesz gyorsabb.',
      'A hibákat a következő évre ütemezitek, mert most nem fér bele.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#quality', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Minden második nap „piros” a build/CI, ezért a csapat gyakran félbehagyja a munkát és hibát javít. Mi a legjobb beavatkozás, amit Scrum Masterként kezdeményezel?',
    options: [
      'A hibás buildet figyelmen kívül hagyjátok, és csak a Sprint végén javítjátok, hogy ne zavarjon.',
      '„Stop-the-line” jellegű szabály: a csapat prioritása a stabilitás helyreállítása, és a DoD/folyamat része a zöld állapot fenntartása.',
      'A buildet lekapcsoljátok, hogy ne legyen piros.',
      'A csapat még több párhuzamos munkát indít, hogy „ne álljon meg a haladás”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#ci', '#stability', '#application', '#hu'],
  },
  {
    question:
      'A code review átlagosan 3 napig áll, mert csak 1 ember tud jóváhagyni. Mi a legjobb Scrum Master lépés, ha a cél a flow javítása és a minőség megtartása?',
    options: [
      'Eltörlitek a review-t, mert az csak lassít.',
      'A review-ert egyetlen „kapuőr” végzi, mert így biztosabb a minőség.',
      'Közösen kidolgoztok egy review politikát: limit, párosítás/rotáció, kisebb PR-ok, és tudásmegosztás, hogy ne legyen bottleneck.',
      'A csapat megvárja a jóváhagyót, és közben újabb munkát kezd, hogy ne unatkozzon.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#review', '#bottleneck', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy Sprint végén sok munka „majdnem kész”, mert a tesztelés mindig a végére marad. Mi a legjobb változtatás, amit Scrum Masterként javasolsz?',
    options: [
      'A tesztelést külön csapat csinálja később, így a fejlesztők gyorsabban készülnek el.',
      'A DoD részeként „tesztelés korán”: kisebb szeletek, folyamatos ellenőrzések, és WIP limit, hogy ne halmozódjon a félkész munka.',
      'A tesztelést elhagyjátok, mert úgyis a felhasználók kipróbálják.',
      'Mindenki hosszabb ideig dolgozik a Sprint végén, hogy „beérje magát”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dod', '#wip', '#application', '#hu'],
  },
  {
    question:
      'A csapatban sok a „kis hiba”, amit mindig elnapolnak, és a rendszer egyre törékenyebb. Mi a legjobb Scrum Master szemlélet a technikai adósság kezelésére?',
    options: [
      'A technikai adósságot nem szabad backlogba tenni, mert nem „üzleti érték”.',
      'A hibák javítását csak akkor kezditek el, amikor már teljesen megáll a szállítás.',
      'Átláthatóvá teszitek és priorizáljátok: technikai adósság elemek is kerülnek a backlogba, kockázat/érték alapján ütemezve.',
      'A technikai adósságot titokban tartjátok, hogy ne legyen vita.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#tech-debt', '#backlog', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder azt mondja: „Nem érdekel a minőség, csak legyen kész.” Mi a legjobb válasz, ami egyszerre empatikus és védi a csapatot?',
    options: [
      '„Rendben, akkor kihagyjuk a teszteket és a review-t.”',
      '„A minőség nem opció: a hibák később többszörös költséget és reputáció kárt okoznak; tegyük láthatóvá a kockázatot és válasszunk egy biztonságos, kisebb szeletet.”',
      '„Akkor nem dolgozunk tovább, viszlát.”',
      '„Majd valaki más kijavítja később.”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#stakeholder', '#risk', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapatnál gyakori a visszanyitás („nem kész”, „bugos”), de senki nem méri. Mi a legjobb első mérőjel, amit bevezetnél, hogy látható legyen a minőség és a rework?',
    options: [
      'A csapat hangulata, mert az mindent megmutat.',
      'A commitok száma, mert az a haladás.',
      'A visszanyitások és utólagos bugok aránya a befejezett munkához képest, trendben követve.',
      'A meetingek száma, mert az jelzi a koordinációt.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#metrics', '#rework', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-24-quiz' } }
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
      auditedBy: 'apply-day-24-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 24 quiz applied');
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

