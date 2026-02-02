/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 13 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-13-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-13-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_13';
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
      'Egy retrospektíven a csapat azonnal hibást keres („X mindig elrontja”). Mi a legjobb facilitátori beavatkozás, hogy a beszélgetés tanulássá váljon?',
    options: [
      'Megkéred a csapatot, hogy szavazza meg, ki a hibás, és zárjátok le.',
      'Csendben maradsz, mert a konfliktus mindig önmagától megoldódik.',
      'Keretezed: „Tényekből induljunk, és nézzük meg, milyen folyamat vagy függőség tolta ebbe a helyzetbe a csapatot”, majd visszahozod a megfigyelésekhez.',
      'A hibáztatást jutalmazod, mert így gyorsabban megjavul a teljesítmény.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#retro', '#psychological-safety', '#application', '#hu'],
  },
  {
    question:
      'Egy retro végén 12 akciópont születik, de a következő időszakban egyik sem valósul meg. Mi a legjobb változtatás, hogy tényleg legyen javulás?',
    options: [
      'Még több akciópontot írtok, hogy biztosan legyen valami.',
      'A retrokat elhagyjátok, mert úgysem működnek.',
      'Az akciópontokat szándékosan homályosan fogalmazzátok meg, hogy később többféleképp lehessen értelmezni.',
      'Kiválasztotok 1–2 kísérletet, mindegyikhez owner + határidő + mérhető siker kritérium, és a többit parkoljátok.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#retro', '#experiments', '#application', '#hu'],
  },
  {
    question:
      'A csapat egy retro alatt végig „érzésekben” beszél, de nincs közös kép a tényekről. Mi a legjobb első lépés, hogy ne panaszkör legyen?',
    options: [
      'Gyorsan megkérdezed: „Ki mit érez?”, és ezzel le is zárjátok.',
      'Összegyűjtitek a megfigyelhető adatokat (pl. timeline, kész vs félkész elemek, megszakítások), és csak ezután kerestek mintákat.',
      'Megkéred a leghangosabb embert, hogy mondja meg, mi a probléma.',
      'Azonnal megoldásokat írtok, mert az idő drága.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#retro', '#data', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat „kísérletet” indít, de nincs meghatározva, honnan tudják, hogy jobb lett. Mi a legjobb kiegészítés, hogy empirikus legyen a javítás?',
    options: [
      'Siker kritérium és mérés: mit figyeltek (pl. cycle time, félkész elemek), mikor nézitek meg, és mi alapján döntötök stop/continue-ról.',
      'Semmi, mert az érzés úgyis elég.',
      'A kísérletet addig futtatjátok, amíg mindenki boldog lesz.',
      'A kísérletet titokban tartjátok, hogy ne zavarjon be senki.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#experiments', '#metrics', '#application', '#hu'],
  },
  {
    question:
      'A retro elején a csapat feszült és kevesen mernek megszólalni. Mi a legjobb lépés, hogy nőjön a biztonság és az őszinteség?',
    options: [
      'Bevezetsz egy rövid check-int és közös szabályt (pl. „feltételezzük a jó szándékot”), majd strukturált módszerrel (néma írás) indítasz.',
      'Azonnal belemész a legvitatottabb témába, mert ott a legtöbb energia.',
      'Megkéred a vezetőt, hogy mondja el, mi volt rossz, és utána mindenki kritizálhat.',
      'A csendeseket felszólítod, hogy azonnal beszéljenek, különben nincs retro.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#retro', '#safety', '#application', '#hu'],
  },
  {
    question:
      'Két lehetséges retro-kimenet között választasz. A) sok általános „javítsunk a kommunikáción” típusú pont, B) egy konkrét WIP-szabály kísérlet mérőponttal. Melyik ad jobb tanulást, és mi a fő kockázat?',
    options: [
      'A ad jobb tanulást, mert általános; kockázat nincs.',
      'A ad jobb tanulást, mert nem kell mérni; kockázat, hogy túl gyorsan javul minden.',
      'B ad jobb tanulást, mert konkrét és mérhető; kockázat, hogy túl nagy változtatást választotok egyszerre és nem tudjátok végrehajtani.',
      'B rosszabb, mert a mérés mindig demotivál; kockázat, hogy túl sok adat lesz.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#retro', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapatban a retro után sincs változás, mert senki nem vállal ownership-et az akciókért. Mi a legjobb facilitátori változtatás a következő alkalommal?',
    options: [
      'Kijelölsz egy „rossz embert”, hogy legyen felelős.',
      'Minden akcióhoz kötelezően neveztek ownt és konkrét next steppet, és a következő retro elején 2 percben visszanézitek, mi történt velük.',
      'Az akciókat elhagyjátok és csak beszélgettek, mert a felelősség stresszes.',
      'A felelőst mindig a Scrum Masternek jelölitek, mert ő a folyamatgazda.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#ownership', '#retro', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-13-quiz' } }
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
      createdBy: 'apply-day-13-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-13-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 13 quiz applied');
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
