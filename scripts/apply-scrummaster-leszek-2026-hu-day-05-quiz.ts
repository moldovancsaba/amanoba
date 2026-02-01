/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 05 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_05';
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
      'Egy csapat azt mondja: „Kész a fejlesztés, mert működik a gépemen”, de nincs review és nincs minimális teszt. Mi a legjobb döntés a minőség-kapu szempontjából?',
    options: [
      '„Kész”-nek jelölitek, mert a gyorsaság a legfontosabb, a teszt és a review ráér utólag.',
      '„Kész”-nek jelölitek, de a csapat tagjai megígérik, hogy legközelebb jobban figyelnek.',
      'Nem jelölitek „kész”-nek; előbb lefut a minimális teszt és megtörténik a review, majd csak utána válik vállalhatóvá a kiadás.',
      'Elhalasztjátok a kiadást 1 hónappal, és közben mindent újraírjátok, mert csak így lehet minőség.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#quality', '#dod', '#release', '#application', '#hu'],
  },
  {
    question:
      'Egy work itemnél tiszta acceptance criteria van, de a csapat minőségi minimuma nincs rögzítve. Melyik állítás írja le helyesen a különbséget a két fogalom között?',
    options: [
      'Az acceptance criteria a csapat általános minőségi minimuma, a DoD pedig az adott item üzleti elvárása.',
      'A DoD és az acceptance criteria ugyanaz, csak más néven; elég egyiket használni.',
      'Az acceptance criteria azt írja le, mit várunk az adott itemtől, a DoD pedig azt, hogyan válik ellenőrizhetően „kész”-zé a munka a csapat szintjén.',
      'A DoD csak dokumentáció, ami nem befolyásolja a döntést arról, hogy valami kész-e.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dod', '#acceptance-criteria', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat DoD-ja 35 pontból áll, ezért rendszeresen megszegik, és a „kész” szó hitelessége elvész. Mi a legjobb lépés, hogy a DoD működjön?',
    options: [
      'Még több pontot adtok hozzá, mert a részletesség mindig jobb minőséget ad.',
      'A DoD-t teljesen elengeditek, mert túl bonyolult; a csapat majd „érzésre” dönt.',
      'Készítetek egy rövid DoD-Minimumot (7–10 pont) és egy DoD-Plusz részt csak magas kockázat esetére, majd 2 Sprint múlva felülvizsgáljátok.',
      'A Scrum Master kijelenti, hogy innentől mindenki büntetést kap, ha a DoD nem teljesül, mert a fegyelem a megoldás.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dod', '#process', '#application', '#hu'],
  },
  {
    question:
      'Egy Product Owner sürgeti a kiadást, és azt kéri, hogy „csak most egyszer” engedjétek el a minőségi minimumot. Melyik válasz tartja a kaput tisztán, miközben üzletileg is kezelhető?',
    options: [
      'Azonnal engedtek, mert a piac fontosabb; majd utólag javítjátok, ha gond lesz.',
      'Azt mondod: vagy teljesül a minőségi minimum, vagy a kockázatot külön, tudatos megállapodásként rögzítitek (mit engedtek el, miért, mi a védelem/rollback), és nem nevezitek „kész”-nek ugyanúgy.',
      'Azt mondod: soha semmilyen körülmények között nem lehet eltérés, ezért a terméket leállítjátok 3 hónapra.',
      'Azt javaslod, hogy inkább csináljatok még egy státusz meetinget, mert attól gyorsabb lesz a kiadás.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dod', '#risk', '#release', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat azt szeretné, hogy a minőség javuljon, de nem akar „papírmunkát”. Melyik mérőpont segít a legjobban kimutatni, hogy a minőségi kapu tényleg értéket ad?',
    options: [
      'Hány oldalas a DoD dokumentum, mert a hosszabb dokumentum jobb minőséget jelent.',
      'Hány meetinget tartotok a minőségről, mert a beszélgetés önmagában javít.',
      'Hányszor kerül vissza a munka „kész” után (visszagörgetés) és mennyi rework-et okoz; csökkenő trend jelzi a javulást.',
      'Hány ember mondja azt, hogy elégedett, mert a hangulat a legfontosabb minőségmérő.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#quality', '#metrics', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál a minőségi kapu bevezetése után a lead time nő, de a hibák és a visszagörgetés csökkennek. Melyik értelmezés a legjobb, és mi a következő lépés?',
    options: [
      'A kaput azonnal el kell dobni, mert a lead time növekedése mindig rossz, függetlenül a hibáktól.',
      'A lead time növekedéséből az következik, hogy a csapat rossz; ezért növelni kell a kontrollt és a riportolást.',
      'A kapu valószínűleg „áthoz” minőségi munkát a folyamat elejére; a következő lépés a szűk keresztmetszet keresése és a DoD-Minimum finomítása, hogy a minőség megmaradjon, de a folyamat gyorsuljon.',
      'A hibák csökkenése biztosan véletlen; a legjobb lépés több pontot hozzáadni a DoD-hoz, hogy még lassabb legyen.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#tradeoffs', '#quality', '#flow', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Két DoD-stratégia között választasz: (A) minden itemre azonos, magas szintű követelmény, (B) DoD-Minimum + DoD-Plusz kockázat alapján. Melyik működik nagyobb eséllyel hosszú távon, és mi a tipikus kockázata?',
    options: [
      'A: mindig jobb, mert a magas követelmény garantálja a minőséget; kockázat nincs.',
      'B: nagyobb eséllyel működik, mert tartható minimumot ad és a magas kockázatnál erősít; kockázat, hogy ha a „kockázat” nincs tisztán definiálva, vita lesz arról, mikor kell a plusz.',
      'A: jobb, mert a csapat így gyorsabb lesz; kockázat, hogy túl kevés ellenőrzés lesz.',
      'B: rossz, mert a minimum mindig alacsony minőséget jelent; kockázat, hogy a csapat túl sokat tanul.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#dod', '#risk', '#tradeoffs', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-05-quiz' } }
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
      createdBy: 'apply-day-05-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-05-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 05 quiz applied');
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

