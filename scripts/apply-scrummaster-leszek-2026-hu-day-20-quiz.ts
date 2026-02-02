/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 20 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-20-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-20-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_20';
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
      'Egy remote csapat Daily-je 30 perces státusz-kör lett, és senki nem hoz döntéseket. Mi a legjobb új struktúra, ha a cél a flow és akadályok kezelése?',
    options: [
      'Mindenki 5 percben részletesen elmondja, mit csinált tegnap, mert ettől lesz transzparens.',
      '12 perces meeting: rövid fókusz (Sprint Goal), majd flow kérdések (blokkolók/WIP/next step), végén döntés + owner + határidő.',
      'A Daily helyett 1 órás státusz meetinget tartotok kétnaponta, hogy legyen idő mindenre.',
      'A Daily-t megszüntetitek, mert remote-ban úgysem működik.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#remote', '#daily', '#flow', '#application', '#hu'],
  },
  {
    question:
      'Egy remote meetingben egyszerre megy a hangbeszélgetés és három párhuzamos chat-thread, ezért szétesik a fókusz. Melyik szabály csökkenti ezt a legjobban?',
    options: [
      'Mindenki írjon egyszerre a chatbe, hogy gyorsabban összejöjjön a döntés.',
      'A chatet teljesen tiltjátok, mert akkor senki nem tud kérdezni.',
      'Single-thread szabály: egyszerre egy beszélgetési szál, a chat csak kérdés/parking lot, facilitátorral.',
      'A meetinget hagyjátok kifolyni, mert a kreativitásnak idő kell.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#meeting', '#facilitation', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál az „urgent” chat csatornát mindenre használják, ezért állandó megszakítás van. Mi a legjobb beavatkozás?',
    options: [
      'Az urgent csatornát megtartjátok, de mindenki némítsa le, így nincs probléma.',
      'Az urgent csatornában minden kérést azonnal teljesítetek, mert ettől lesz gyors a csapat.',
      'Az urgent csatornát törlitek, és ezentúl mindenki privátban ír mindenkinek.',
      'Definiáljátok, mi számít valóban urgentnek, és csak arra használjátok; minden más egy normál csatornába vagy backlogba kerül, cadenciával.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#interruptions', '#cadence', '#application', '#hu'],
  },
  {
    question:
      'Egy remote csapatnál az igények 6 különböző csatornán jönnek (email, chat, meeting, DM), ezért elvész a transzparencia. Mi a legjobb „tool etikett” megoldás?',
    options: [
      'Egy „single source of truth” helyet jelöltök ki az igényeknek (pl. ticket/backlog), és a csatornák csak beérkeztetésre szolgálnak, nem döntésre.',
      'Hagyjátok így, mert a rugalmasság a lényeg.',
      'Minden csatornát engedélyeztek, és majd a Scrum Master összegyűjti fejben.',
      'A csapat minden kérést azonnal elvállal, mert így nem vesz el semmi.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#tools', '#transparency', '#application', '#hu'],
  },
  {
    question:
      'Egy remote meeting után nincs nyoma annak, mi lett a döntés, ezért ugyanazt vitatjátok újra. Mi a legjobb megoldás?',
    options: [
      'A döntéseket nem írjátok le, mert úgyis minden változik.',
      'A döntéseket csak a vezető tudja, a csapatnak nem kell.',
      'Döntésnapló: döntés + owner + határidő + mi változik, és ezt megosztjátok ugyanabban a csatornában, ahol a meeting volt.',
      'A meetingek végét nyitva hagyjátok, hogy mindenki rugalmasan értelmezze.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#decision-log', '#remote', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat remote-ban panaszkodik: „meetingről meetingre élünk”. Mi a legjobb Scrum Master lépés, ha valódi fókusz-idősávot akarsz védeni?',
    options: [
      'Minden meetinget hosszabbra állítotok, hogy legyen idő mindent megbeszélni.',
      'Meeting charter + timebox + fókusz idősáv: előre kijelölt meeting-mentes blokkok, és csak outcome-alapú meetingek kerülhetnek be.',
      'A fókusz-idősávot úgy oldjátok meg, hogy mindenki egyszerre több meetingben ül, multitaskinggal.',
      'A fókusz-idősávot nem lehet védeni, ezért felesleges próbálkozni.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#focus', '#meetings', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy remote Daily-n a kamerák ki vannak kapcsolva, és a csapat passzív. Mi a legjobb beavatkozás, ha nem akarsz „kamera rendőrséget”, de jobb bevonást szeretnél?',
    options: [
      'Struktúrát és bevonási módot váltasz: néma írás 1 perc, körkérdés, és a meeting célja döntésekre/akadályokra fókuszál, nem kontrollra.',
      'Kötelezővé teszed a kamerát mindenkinek, és aki nem kapcsolja be, azt számon kéred.',
      'Elfogadod, hogy a passzivitás remote-ban normális, és nem teszel semmit.',
      'A Daily-t lecseréled egy hosszú státusz e-mailre, hogy „látszódjon a munka”.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#remote', '#engagement', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-20-quiz' } }
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
      createdBy: 'apply-day-20-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-20-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 20 quiz applied');
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
