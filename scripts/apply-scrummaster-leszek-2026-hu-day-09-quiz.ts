/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 09 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_09';
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
      'Egy Daily 25 perces státuszkör: mindenki elmondja, mit csinált, de a végén nincs döntés és nincs együttműködés. Mi a legjobb első változtatás?',
    options: [
      'A Daily-t megszüntetitek, mert a meetingek mindig feleslegesek.',
      'Bevezetitek a 10 perces timeboxot és a végére kötelezően 1–3 konkrét koordinációs döntést tesztek (sorrend/együttműködés/akadály).',
      'Mindenki részletesebb státuszt ad, mert attól jobban látszik a munka.',
      'A vezetőnek külön prezentációt készítetek a Daily helyett, mert az professzionálisabb.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#daily', '#timebox', '#application', '#hu'],
  },
  {
    question:
      'Egy Daily-n vita indul egy technikai részletről, és 10 perc alatt senki nem dönt. Mi a legjobb facilitációs lépés, hogy a koordináció megmaradjon?',
    options: [
      'Folytatjátok a vitát a Daily keretein belül, mert a technikai döntés a legfontosabb.',
      'A vitát azonnal lezárod a saját döntéseddel, hogy gyorsan menjetek tovább.',
      'Parking lotot használsz: rögzíted a témát, kijelölöd az érintetteket, és a Daily után külön 10 percben döntenek; a Daily-t 1 koordinációs döntéssel lezárod.',
      'A vitát elhalasztod a Sprint végére, mert ott több idő lesz rá.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#facilitation', '#daily', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatban senki nem hoz be akadályt a Daily-re, de napközben sok a megszakítás és „tűzoltás”. Mi a legjobb változtatás a valóság láthatóvá tételére?',
    options: [
      'Megtiltod, hogy napközben kérdezzenek egymástól, mert az megszakítás.',
      'Bevezetsz egy „akadály/kockázat” blokkot: ha nincs akadály, mindenki mond 1 kockázatot vagy függőséget, és rögzítitek azonnali következő lépésként.',
      'A Daily-t átrakjátok heti státusz meetinggé, mert ott több idő van beszélni.',
      'A csapatnak azt mondod, hogy „legyetek őszinték”, de nem változtatsz a struktúrán.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#impediments', '#transparency', '#application', '#hu'],
  },
  {
    question:
      'Egy vezető beül a Daily-re és státuszt kér egyenként. Mi a legjobb megoldás, ami megőrzi a Daily célját és a vezető igényét is kezeli?',
    options: [
      'A vezetőt kitiltod minden megbeszélésről, mert a vezetők mindig zavarnak.',
      'A Daily-t átalakítod státusz meetinggé, mert így a vezető elégedett lesz.',
      'A Daily-t megvéded koordinációs eseményként, és külön 10 perces státusz csatornát ajánlasz (külön meeting vagy dashboard), ami a vezető igényét kielégíti.',
      'A csapat tagjait kéred, hogy röviden jelentsenek, és a koordinációt majd utólag egyeztetik külön.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#leadership', '#daily', '#application', '#hu'],
  },
  {
    question:
      'Egy Daily végén mindig elhangzik, hogy „mindenki csinálja a dolgát”, de nem derül ki, ki kivel dolgozik együtt és mi a mai sorrend. Melyik kimenet-követelmény javítja legjobban a fókuszt?',
    options: [
      'A végén mindig legyen 1–3 konkrét döntés: mai prioritás/sorrend, együttműködési párok, és legalább 1 akadály ownerrel.',
      'A végén mindenki elmondja, mit csinált tegnap, mert az motivál.',
      'A végén a Scrum Master összefoglalja a meetinget 10 percben, mert így professzionális.',
      'A végén mindenki egyetért, hogy „haladunk”, mert a pozitív gondolkodás segít.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#focus', '#daily', '#application', '#hu'],
  },
  {
    question:
      'Két Daily struktúra közül kell választani. A: „mindenki tegnap/ma/akadály” körben beszél. B: Sprint Goal fókusz + akadály-first + 1–3 döntés. Melyik ad nagyobb eséllyel valódi koordinációt, és mi a tipikus kockázat?',
    options: [
      'A jobb, mert mindenki beszél; kockázat, hogy túl gyors lesz a meeting.',
      'B jobb, mert döntés-kimenetre és akadályokra épít; kockázat, hogy ha nincs fegyelem a timeboxhoz, visszacsúszik vitába.',
      'A jobb, mert így a vezető is kap státuszt; kockázat nincs.',
      'B rosszabb, mert a Sprint Goal úgyis csak papír; kockázat, hogy túl sok döntés születik.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#daily', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapatnál a Daily rövid (10 perc), de a napközbeni koordináció mégis kaotikus és sok a megszakítás. Mi a legvalószínűbb ok és legjobb következő lépés?',
    options: [
      'Ok: túl kevés beszámoló; lépés: hosszabb Daily, hogy mindenki elmondhasson mindent.',
      'Ok: hiányzik a kimenet-követés; lépés: a Daily végén rögzített döntéseket (sorrend/owner/akadály) láthatóvá teszitek és nap közben ehhez igazítotok, nem ad-hoc módon.',
      'Ok: a Scrum keret rossz; lépés: megszüntetitek a Daily-t.',
      'Ok: túl sok mérés; lépés: elhagyjátok a döntéseket és csak „haladunk” módon folytatjátok.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#coordination', '#daily', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-09-quiz' } }
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
      createdBy: 'apply-day-09-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-09-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 09 quiz applied');
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

