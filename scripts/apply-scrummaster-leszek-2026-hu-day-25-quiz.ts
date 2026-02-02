/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 25 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_25';
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
      'Egy csapat boardján rengeteg kártya van „In Progress”-ban, de valójában sok közülük várakozik review-ra vagy jóváhagyásra. Mi a legjobb változtatás, hogy a board a valóságot tükrözze?',
    options: [
      'A státuszokat konkrét folyamat-lépésekre bontjátok (pl. Review, Teszt, Jóváhagyás), és a kártyák oda kerülnek, ahol tényleg állnak.',
      'Minden kártyát „In Progress”-ban hagytok, mert a részletek „úgyis mindegyek”.',
      'A boardot csak a Sprint végén frissítitek, hogy ne legyen admin.',
      'A blokkolókat nem jelölitek, mert az rossz fényt vet a csapatra.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#board', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál a WIP limitet bevezetik, de amikor tele a Doing oszlop, a csapat inkább új oszlopot nyit („Doing 2”). Mi a legjobb Scrum Master reakció?',
    options: [
      'Elfogadod, mert a WIP limit lényege, hogy „ne legyen konfliktus”.',
      'Visszavezetsz a célhoz: a WIP limit a befejezést segíti; ha tele, akkor a csapat a torlódást oldja és befejez, nem új munkát kezd.',
      'A WIP limitet megszüntetitek, mert „úgysem működik”.',
      'Megemeled a WIP limitet végtelenre, hogy ne legyen akadály.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#wip', '#policy', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapatnál a kérések DM-ben és emailben jönnek, és sok munka sosem kerül fel a boardra. Mi a legjobb „SSOT” szabály, ami csökkenti a káoszt?',
    options: [
      'A Scrum Master fejben tartja a kéréseket, így gyorsabb.',
      'Minden kérés automatikusan „top priority”, hogy senki ne sértődjön meg.',
      'A szabály: ami nincs a boardon, az nem munka; a csatornák csak jelzésre valók, beérkeztetés a boardon történik.',
      'A boardot elhagyjátok, mert úgyis van chat.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#ssot', '#workflow', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál a „Done” azt jelenti: „a fejlesztő szerint kész”, de gyakori a visszanyitás és a bug. Mi a legjobb első lépés a helyzet javítására?',
    options: [
      'A Done definíciót pontosítjátok: teszt/review/átadás minimumai, és csak ezután lehet Done-ba tenni.',
      'A Done definíciót elhagyjátok, mert az „csak formalitás”.',
      'A visszanyitásokat nem számoljátok, mert az rossz hangulatot okoz.',
      'A csapatnak több meetinget adtok, hogy beszéljenek róla.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dod', '#quality', '#application', '#hu'],
  },
  {
    question:
      'A csapat boardján sok a „Blocked” jelölés, de senki nem tudja, mit kell tenni. Mi a legjobb „blocked policy” elem, amit bevezetsz?',
    options: [
      'Blokkolt csak akkor lehet, ha van konkrét ok és következő lépés (owner + eszkaláció időpont), különben a jelölés értéktelen.',
      'Minden blokkot a Sprint végén kezeltek, hogy addig ne zavarjon.',
      'A blokkolás szégyen, ezért tilos jelölni.',
      'A blokkolt kártyákat törlitek, hogy szebb legyen a board.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#blocked', '#policy', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál a board státuszai nem folyamat-lépések, hanem hangulatok („Majdnem kész”, „Halad”). Melyik a legjobb átalakítási elv?',
    options: [
      'Megkérdezed: „mi történik valójában a munka közben?”, és a státuszokat konkrét lépésekre nevezitek át, hogy mérhető legyen a várakozás és torlódás.',
      'A státuszok legyenek minél kreatívabbak, mert akkor motiválóbb.',
      'A státuszok maradjanak homályosak, mert így rugalmas a rendszer.',
      'A boardon csak egy oszlop legyen: „Minden”, mert úgy egyszerűbb.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#board', '#transparency', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapat bevezeti a heti 10 perces „board cleanup”-ot. Mi a legjobb mérhető jel, ami mutatja, hogy ez tényleg segít?',
    options: [
      'Az, hogy több emoji van a kártyákon.',
      'Csökken a „régi”, elavult kártyák száma, és kevesebb a hiányos/duplikált munka a boardon.',
      'Nő a meetingek száma, mert többet beszélnek.',
      'A kártyák címei hosszabbak lesznek.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#hygiene', '#metrics', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-25-quiz' } }
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
      auditedBy: 'apply-day-25-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 25 quiz applied');
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

