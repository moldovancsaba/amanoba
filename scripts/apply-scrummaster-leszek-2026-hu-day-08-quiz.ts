/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 08 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_08';
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
      'Egy Sprint Planning végén van feladatlista, de nincs Sprint Goal. Mi a legjobb első lépés, hogy legyen fókusz és érték-alapú vállalás?',
    options: [
      'A feladatlistát megtartjátok, és csak gyorsabban dolgoztok, mert a fókusz majd kialakul.',
      'Egy mondatban megfogalmaztok egy érték-alapú célt, majd ellenőrzitek, hogy a kiválasztott munkák tényleg ezt a célt szolgálják.',
      'A Product Owner egyedül megírja a célt, és a csapat nem kérdez, hogy gyorsabb legyen a meeting.',
      'A Sprint Goal helyett csak a becslések összegét rögzítitek, mert az objektív.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#planning', '#sprintgoal', '#application', '#hu'],
  },
  {
    question:
      'Egy Product Owner 12 elemet akar betenni a Sprintbe, és azt mondja: „mind fontos”. A csapat kapacitása láthatóan nem elég. Mi a legjobb Scrum Master beavatkozás?',
    options: [
      'A csapat igent mond mindenre, mert a cél a „csapat commitment”, és a csúszás majd utólag kezelhető.',
      'A csapat elutasít mindent, mert a kapacitás kevés, és így nincs konfliktus.',
      'Kapacitás checket csináltok, majd a Sprint Goal-hoz igazítva kiválasztjátok a legkisebb, vállalható csomagot, a maradékot pedig tudatosan hátrébb teszitek.',
      'A Scrum Master dönt a sorrendről, mert neki kell megvédenie a csapatot.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#capacity', '#planning', '#application', '#hu'],
  },
  {
    question:
      'Egy backlog elemnek nincs elfogadási feltétel leírva, és több nyitott kérdés van. Mi a legjobb döntés a Sprintbe kerülésről?',
    options: [
      'Beveszitek, mert majd a Sprintben tisztázódik, és így gyorsabb a haladás.',
      'Nem veszitek be; előbb tisztázási/kísérleti lépést terveztek és rögzítetek minimum elfogadási feltételeket.',
      'Beveszitek, de csak akkor, ha a csapat megígéri, hogy „figyelni fog”, mert a figyelem pótolja a tisztázást.',
      'Törlitek a backlogból, mert a nyitott kérdések azt jelentik, hogy rossz ötlet.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dor', '#readiness', '#application', '#hu'],
  },
  {
    question:
      'Egy Sprint Planning során a csapat nem beszél kockázatokról, csak „feladatokat választ”. Mi a legjobb minimális kockázatkezelési gyakorlat?',
    options: [
      'A kockázatokat nem érdemes előre kezelni, mert csak lassítják a csapatot.',
      'Rögzítetek 1–3 fő kockázatot, és mindegyikhez választotok egy egyszerű védelmet (teszt/spike/limit/review/rollback).',
      'Minden kockázatra részletes 20 oldalas dokumentációt készítetek, mert az garantálja a megelőzést.',
      'A Scrum Master egyedül ír kockázatlistát, mert a csapatnak nem kell ezzel foglalkoznia.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#risk', '#planning', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat „forecastot” ígéretként kezeli, ezért a terhelés rendszeresen túl magas. Melyik változtatás segít a legjobban reális vállalást kialakítani?',
    options: [
      'A forecastot még szigorúbb ígéretté teszitek, és büntetitek a csúszást, mert az fegyelmet ad.',
      'A csapat minden Sprintben ugyanannyi work itemet vállal, mert az „stabil”.',
      'Kapacitást láthatóvá tesztek (szabadság/support/meetingek), és a vállalást ehhez igazítjátok, miközben a forecastot előrejelzésként kezelitek, nem ígéretként.',
      'A forecastot elhagyjátok, mert a tervezés mindig felesleges.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#forecast', '#capacity', '#application', '#hu'],
  },
  {
    question:
      'Két Sprint Goal jelölt közül kell választani. A: „Megcsináljuk a backlog elemeket.” B: „A felhasználó 3 perc alatt hiba nélkül végig tud menni a folyamaton.” Melyik ad nagyobb eséllyel fókuszt, és mi a tipikus kockázat a rossz választásnál?',
    options: [
      'A ad fókuszt, mert konkrétan felsorolja a munkát; kockázat, hogy túl kevés feladat készül el.',
      'B ad fókuszt, mert érték-alapú és döntést ad a kiválasztáshoz; kockázat A esetén, hogy a csapat feladatlistát optimalizál érték helyett.',
      'A ad fókuszt, mert rövid; kockázat nincs.',
      'B rosszabb, mert outcome-ot mérni nehéz; kockázat, hogy túl sok érték készül el.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#sprintgoal', '#tradeoffs', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy csapat bevezeti a DoR kaput, de azonnal konfliktus lesz: „ez bürokrácia”. Mi a legjobb megközelítés, hogy a kapu minőséget adjon, mégse fulladjon vitába?',
    options: [
      'A DoR-t megszüntetitek, mert a konfliktus azt jelzi, hogy a csapat még nem érett rá.',
      'A DoR-t kőbe vésitek és szankcionáltok, mert a szabály a lényeg.',
      'A DoR-t rövid, tartható minimumra állítjátok, megmutatjátok, hogy csökkenti a Sprintben a találgatást, és 2 Sprint után felülvizsgáljátok a mért hatás alapján.',
      'A Scrum Master egyedül tölti ki a DoR-t, hogy a csapatnak ne legyen vele dolga.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#dor', '#change', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-08-quiz' } }
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
      createdBy: 'apply-day-08-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-08-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 08 quiz applied');
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

