/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 07 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_07';
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
      'Egy Sprint Planningen 40 perc megy el azon, hogy a csapat nem érti, mit jelent egy backlog elem. Mi a legjobb megelőző beavatkozás?',
    options: [
      'A Planninget hosszabbra állítjátok, hogy legyen idő minden vitára, mert a vita önmagában javítja a megértést.',
      'A csapat letiltja a kérdéseket a Planning alatt, mert az „lassít”, és inkább gyorsan becsülnek.',
      'Rendszeres refinementet tartotok, ahol outcome mondatot és 2–4 elfogadási feltételt rögzítetek, és a nyitott kérdéseket külön akcióként kezelitek.',
      'A Product Owner előre kiosztja a feladatokat emberenként, így nem kell közösen érteniük.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#refinement', '#planning', '#application', '#hu'],
  },
  {
    question:
      'Egy backlog elem túl nagy: „Új onboarding”. Melyik szeletelés csökkenti legjobban a kockázatot úgy, hogy közben gyorsan ad kézzelfogható értéket?',
    options: [
      'Mindent egyszerre megépítetek, mert az onboarding csak akkor jó, ha teljes.',
      'Három szeletet csináltok érték szerint: (1) alap regisztráció (2) első siker élmény (3) személyre szabás, és először az első szeletet szállítjátok.',
      'Az onboardingot adminisztrációként kezelitek, ezért a UI-t elhagyjátok, és csak belső dokumentációt írtok.',
      'Az onboardingot két szeletre vágjátok: „frontend” és „backend”, mert így könnyebb a csapatnak.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#slicing', '#value', '#application', '#hu'],
  },
  {
    question:
      'Egy refinementen a csapat így zár le egy itemet: „majd a Sprintben kitaláljuk a részleteket”. Mi a legjobb minimális kimenet, amit érdemes rögzíteni a találgatás csökkentésére?',
    options: [
      'Egy hosszú dokumentum minden lehetséges esetről, mert csak így lehet biztosan elkerülni a bizonytalanságot.',
      'Outcome mondat + 2–4 elfogadási feltétel + 1 nyitott kérdés; ha túl sok a nyitott kérdés, külön tisztázási akció.',
      'Csak egy becslés story pointban, mert a pontszám úgyis leír mindent.',
      'Csak egy címke (pl. „fontos”), mert az elég a priorizáláshoz.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#acceptance', '#uncertainty', '#application', '#hu'],
  },
  {
    question:
      'Egy backlog elemnél a bizonytalanság magas: több nyitott kérdés van, és nincs adat. Mi a legjobb következő lépés a „refinement kimenet” szempontjából?',
    options: [
      'Azonnal fejleszteni kezditek, mert a fejlesztés közben majd kiderül minden.',
      'Egy rövid kísérleti lépést terveztek (spike/prototípus/mérés), ami csökkenti a bizonytalanságot, és csak utána döntötök a teljes megvalósításról.',
      'A backlog elemet törlitek, mert a bizonytalanság azt jelenti, hogy rossz ötlet.',
      'A csapat megkéri a vezetőt, hogy döntsön a részletekről, így nem kell tisztázni.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#experiment', '#uncertainty', '#application', '#hu'],
  },
  {
    question:
      'Egy refinement végén nincs egyértelmű tulajdonos a nyitott kérdésekre, ezért a következő alkalomra semmi nem tisztul. Mi a legjobb lezárási szabály?',
    options: [
      'Minden nyitott kérdésre legyen owner + határidő; ha nincs, akkor a backlog elem nem tekinthető „kész a Sprinthez” állapotúnak.',
      'A Scrum Master megoldja a nyitott kérdéseket egyedül, mert neki kell biztosítani a haladást.',
      'A csapat felírja a kérdéseket, és majd „valaki egyszer” ránéz.',
      'A nyitott kérdéseket kitörlitek a backlogból, mert zavaróak.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#ownership', '#refinement', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat a refinementet státusz meetinggé alakította: sok beszámoló, kevés tisztázás. Mi a legjobb diagnózis és korrekció?',
    options: [
      'Diagnózis: túl kevés információ; korrekció: még több státusz riport és hosszabb meeting.',
      'Diagnózis: hiányzik a kimenet fókusz; korrekció: 30 perces agenda, 1–3 item, outcome + elfogadás + kockázat + nyitott kérdés, és a végén konkrét akciók.',
      'Diagnózis: a backlog a vezető dolga; korrekció: a csapatot kiveszitek a refinementből.',
      'Diagnózis: túl sok döntés; korrekció: a kérdéseket betiltjátok, hogy gyorsabb legyen.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#refinement', '#facilitation', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Két megközelítés közül választhatsz: (A) mindent részletesen kidolgoztok előre, (B) csak a Sprinthez közeli itemeket tisztázzátok és a bizonytalanságot kísérletekkel csökkentitek. Melyik működik nagyobb eséllyel, és mi a tipikus kockázat?',
    options: [
      'A működik jobban, mert minél több részlet, annál kevesebb a bizonytalanság; kockázat nincs.',
      'B működik jobban, mert a tanulást közelebb hozza a döntéshez; kockázat, hogy ha nincs fegyelem a kapuhoz (elfogadás/owner), a Planningben visszajön a káosz.',
      'A működik jobban, mert a backlog csak dokumentáció; kockázat, hogy a csapat túl gyorsan dönt.',
      'B működik jobban, mert a részletek sosem számítanak; kockázat nincs.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#tradeoffs', '#refinement', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-07-quiz' } }
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
      createdBy: 'apply-day-07-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-07-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 07 quiz applied');
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

