/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 26 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_26';
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
      'Egy Scrum Master azt mondja: „Én csak meetingeket szervezek, mert a csapatnak erre van szüksége.” Mi a legjobb következő lépés, hogy a szerep hatása mérhetően nőjön?',
    options: [
      'Kijelöl 1–2 problémát (pl. WIP, blokk, visszanyitás) és egy 2 hetes kísérletet mérőjelekkel, hogy a fókusz a hatásra kerüljön.',
      'Még több meetinget szervez, mert az biztosan növeli a teljesítményt.',
      'A csapat helyett a Scrum Master kezdi el megoldani a feladatokat, mert úgy gyorsabb.',
      'A problémákat elrejti, mert az „rossz fényt vet”.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#career', '#impact', '#application', '#hu'],
  },
  {
    question:
      'Egy junior Scrum Master első 30 napjában mi a legjobb fókusz, ha gyorsan szeretne stabil alapot teremteni?',
    options: [
      'Szervezeti átalakítás és több csapat skálázása azonnal.',
      'Alap működés stabilizálás: board hygiene, DoD tisztázás, események célja és timebox fegyelem.',
      'Csak tréningek tartása Scrum elméletről, gyakorlati változtatás nélkül.',
      'A csapat helyett priorizálni és dönteni, mert úgy „megy a munka”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#junior', '#baseline', '#application', '#hu'],
  },
  {
    question:
      'Egy Scrum Master azt mondja: „Senior vagyok, mert én vagyok a legjobb Jira admin.” Mi a legjobb válasz, ami tiszteletben tartja, de helyreteszi a fókuszt?',
    options: [
      '„A senioritás inkább a szervezeti hatásban mérhető: akadályok eltávolítása, coaching, több csapat együttműködésének javítása, outcomes.”',
      '„Igazad van, a senior Scrum Master definíciója a Jira admin.”',
      '„A Jira admin haszontalan, nem számít semmit.”',
      '„Senior vagy, ha sok meetinget vezetsz egy nap.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#senior', '#impact', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy Scrum Master 90 napos tervet ír, de nincs benne mérőjel. Mi a legjobb javítás, hogy a fejlődés követhető legyen?',
    options: [
      'Mérőjelek hozzáadása kompetenciánként (pl. blokk ideje, visszanyitás arány, review feedback ciklus), trendben követve.',
      'A mérőket elhagyja, mert a „fejlődést úgyis érezni lehet”.',
      'Csak egy mérőt választ: mennyi meeting volt.',
      'A tervet kidobja, mert úgysem lehet tervezni.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#metrics', '#plan', '#application', '#hu'],
  },
  {
    question:
      'Egy mid szintű Scrum Masternek a csapatán kívül is hatása van. Mi a legjobb példa erre?',
    options: [
      'A backlogot ő írja meg a csapat helyett.',
      'Rendszer-szintű akadályt tesz láthatóvá (pl. jóváhagyási bottleneck), és vezetőkkel közösen javítja a folyamatot.',
      'Ő dönt minden szakmai kérdésben, mert az gyorsabb.',
      'Elkerüli a konfliktust, mert az „nem Scrum”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#mid', '#system', '#application', '#hu'],
  },
  {
    question:
      'Interjúhelyzetben egy Scrum Master csak elméleti válaszokat ad („a Scrum szerint…”), de nincs konkrét példa. Mi a legjobb javaslat a válasz minőségének javítására?',
    options: [
      'A válasz legyen hosszabb és tele definíciókkal.',
      'Használjon „eredmény sztori” struktúrát: helyzet → beavatkozás → hatás → tanulság (mérőjellel).',
      'Kerülje a konkrétumokat, mert akkor nem lehet belekötni.',
      'Mindig a csapatot hibáztassa, hogy ő jól jöjjön ki.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#interview', '#story', '#application', '#hu'],
  },
  {
    question:
      'Egy senior Scrum Mastertől azt várják, hogy „minden csapatot ugyanúgy működtessen”. Mi a legjobb válasz, ami megvédi az elveket és kezeli a kontextust?',
    options: [
      'Minden csapat ugyanazt a sablont kapja, mert a kontextus nem számít.',
      'A Scrum Master feladja az empirikus működést, mert „így kérték”.',
      'A cél közös (empirizmus + érték), de a megvalósítás kontextusfüggő; keretrendszert és elveket adsz, majd kísérletekkel hangoljátok csapatonként.',
      'Nem válaszolsz, mert ez túl bonyolult.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#senior', '#context', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-26-quiz' } }
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
      auditedBy: 'apply-day-26-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 26 quiz applied');
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

