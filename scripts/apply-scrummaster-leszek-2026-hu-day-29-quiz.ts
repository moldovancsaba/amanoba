/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 29 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_29';
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
      'Egy csapatnál a Daily 30–40 perces státusz meeting lett. Mi a legjobb első beavatkozás, ha gyors javulást akarsz és nem akarod „rendőrként” kezelni?',
    options: [
      'Kezdjétek a Daily-t azzal, hogy mindenki elmondja, min dolgozott tegnap, részletesen.',
      'Töröld a Daily-t, mert úgyis felesleges.',
      'Tisztázd a Daily célját (Sprint cél), vezess be parkolót a mély témáknak, és kérdéseket a célhoz kötve; mérjétek a Daily hosszát és a blokkok láthatóságát.',
      'Kötelezővé teszed, hogy mindenki kamera nélkül legyen, mert az gyorsít.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#daily', '#facilitation', '#application', '#hu'],
  },
  {
    question:
      'A Sprint végén sok munka „majdnem kész”, mert a tesztelés a végére marad. Mi a legjobb következő lépés a félkész WIP csökkentésére?',
    options: [
      'Emeljétek a WIP-et, hogy „több minden haladjon”.',
      'Erősítsd a DoD-t és bonts kisebb szeletekre; vezess WIP limitet és korai validációt, hogy a teszt ne a végén torlódjon.',
      'A tesztelést elhagyjátok, hogy elkészüljön a Sprint.',
      'A következő Sprintben több meetinget tartotok a tesztelésről.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#wip', '#dod', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder a Sprint közepén scope-ot akar növelni („még ezt tegyétek bele”). Mi a legjobb Scrum Master válasz, ami üzletileg is korrekt?',
    options: [
      'Azonnal mindent bevállaltok, mert a stakeholder a főnök.',
      'Átlátható opciókat adsz: csere a Sprint cél védelmével, szeletelés, vagy későbbre tolás; döntsetek közösen a tradeoffok alapján.',
      'Megtiltod a stakeholdernek, hogy bármit kérjen Sprint közben.',
      'A csapatot túlórára kötelezed, így minden belefér.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#stakeholder', '#tradeoff', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy retrospektív panaszkörbe csúszik („minden rossz”). Mi a legjobb facilitációs beavatkozás, hogy valódi javulás legyen?',
    options: [
      'Hagyod, hogy mindenki kibeszélje magát, és nem döntötök semmiről.',
      'Egyetlen kísérletet választotok (2 hét), mérőjellel és felelőssel; a következő retroban visszanézitek az eredményt.',
      'A retrot törlitek, mert úgyis panaszkör.',
      'Megkéred a vezetőt, hogy mondja meg, mit csináljon a csapat.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#retro', '#experiment', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál a refinement kimarad, ezért a Sprint Planning hosszú és vitás. Mi a legjobb beavatkozás, ami gyorsan javít?',
    options: [
      'Bevezetsz rövid, rendszeres refinementet (pl. heti 30 perc), és slicing + kockázat tisztázás fókuszú kérdéslistát használtok.',
      'A planninget még hosszabbra veszed, hogy minden beleférjen.',
      'A refinementet elhagyjátok, mert az „nem hivatalos esemény”.',
      'A backlogot a Scrum Master írja meg egyedül, hogy gyors legyen.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#refinement', '#planning', '#application', '#hu'],
  },
  {
    question:
      'Egy blokk külső jóváhagyás miatt rendszeresen napokig áll. Mi a legjobb rendszer-szintű lépés, ami nem a csapatot hibáztatja?',
    options: [
      'A csapat dolgozzon párhuzamosan még több dolgon, így „nem áll meg”.',
      'Elrejted a blokkot a boardon, hogy ne legyen kellemetlen.',
      'Kialakítotok egy policy-t: owner + SLA + eszkaláció, és a folyamat része lesz a jóváhagyás (nem a végén derül ki).',
      'A jóváhagyót kizárod a folyamatból, mert lassít.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#blocked', '#system', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy új csapatnál az első héten gyors képet akarsz kapni a működésről. Mi a legjobb „első lépés”, ami nem borítja fel a csapatot?',
    options: [
      'Azonnal minden eseményt átszervezel, mert te tudod a legjobban.',
      'Először megfigyelsz és kérdezel: Sprint cél, board/flow, DoD, blokkok, stakeholder feedback; majd 1 kicsi kísérletet javasolsz 2 hétre.',
      'Megvárod a negyedév végét, és majd akkor szólsz.',
      'A csapat helyett elkezdesz priorizálni, hogy gyorsuljon a munka.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#first-week', '#coaching', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-29-quiz' } }
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
      auditedBy: 'apply-day-29-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 29 quiz applied');
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

