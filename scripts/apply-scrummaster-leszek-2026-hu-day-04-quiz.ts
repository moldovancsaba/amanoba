/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 04 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_04';
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
      'Egy csapat Retro-ján hiba történt a kiadásban, és a beszélgetés azonnal „ki rontotta el?” irányba megy. Mi a legjobb beavatkozás, ami csökkenti a bűnbakkeresést és növeli a tanulást?',
    options: [
      'Megnevezed a felelőst, mert ettől mindenki látja, hogy van következmény, és legközelebb óvatosabbak lesznek.',
      'Kéred, hogy a téma helyett inkább beszéljenek arról, ki mennyit dolgozott a héten, mert a túlterheltség mindig hibát okoz.',
      'A kérdést átfordítod: „Mi tette ésszerűvé ezt a döntést akkor?” és „mit változtatunk a rendszerben?”, majd 1 konkrét folyamatváltozást rögzítetek ownerrel és határidővel.',
      'Leállítod a beszélgetést, mert a hibákról beszélni negatív, és inkább „pozitív” témákat választotok.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#psychological-safety', '#retro', '#learning', '#application', '#hu'],
  },
  {
    question:
      'Egy meetingben 2 ember beszél a teljes idő 80%-ában, a többiek hallgatnak. Melyik lépés növeli legjobban az esélyét annak, hogy mindenki hozzátegyen anélkül, hogy megszégyenítenél bárkit?',
    options: [
      'Megkérdezed a csendeseket, hogy „miért nem szóltok hozzá?”, mert ettől majd felbátorodnak.',
      'Bevezetsz egy körkérdést: mindenki 1 mondatban mond 1 kockázatot vagy ötletet, és addig nem megy tovább a beszélgetés, amíg mindenki sorra nem került.',
      'A domináns beszélőket félbeszakítod és kijelented, hogy „mostantól csendben maradtok”, mert a szabály a legfontosabb.',
      'A meeting után külön megkéred a csendeseket, hogy írják le az ötleteiket, mert a közös döntések nem fontosak.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#facilitation', '#team-dynamics', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál gyakori, hogy a meetingek 30 perc beszélgetéssel végződnek döntés nélkül. Melyik beavatkozás javítja leggyorsabban a fókuszt?',
    options: [
      'A meetingeket megszüntetitek, mert a beszélgetés eleve felesleges, és mindenki majd külön dönt.',
      'Bevezettek egy timeboxot és a végére kötelező kimenetet: 1 döntés vagy 1 következő lépés ownerrel és határidővel.',
      'A meetingek elejére hosszú prezentációt raktok, mert ettől mindenki jobban megérti a kontextust.',
      'A résztvevők számát csökkentitek, de nem változtattok a struktúrán vagy a kimeneten.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#focus', '#decision', '#timebox', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatban egy junior fejlesztő észrevesz egy kockázatot, de nem szól, mert fél a megszégyenítéstől. Melyik vezetői viselkedés növeli leginkább a pszichológiai biztonságot?',
    options: [
      'A vezető megköszöni a jelzést, megkérdezi a tényeket és a tanulságot, majd a hibát a folyamat javítására használja, nem a személy minősítésére.',
      'A vezető gyorsan kijavítja a problémát, de közben jelzi, hogy „legközelebb ezt ne rontsátok el”, mert fontos a fegyelem.',
      'A vezető azt kéri, hogy csak akkor szóljanak, ha teljes bizonyosságuk van, különben „feleslegesen pánikolnak”.',
      'A vezető privátban megbeszéli a jelzővel, de nyilvánosan nem engedi, hogy mások is tanuljanak belőle.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#psychological-safety', '#leadership', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatot naponta többször „sürgős” kérés szakít meg. Melyik triage folyamat segít a fókusz védelmében úgy, hogy közben a sürgős igények is kezelhetők maradnak?',
    options: [
      'Minden sürgős kérést azonnal megszakítás nélkül végrehajtanak, mert a gyors reagálás a legfontosabb, a tervezés felesleges.',
      'A „sürgős” kéréseket automatikusan elutasítják, mert a fókusz mindig fontosabb, mint bármilyen határidő.',
      'Két perces triage: mi a hatás, mi a határidő, ki az owner, és mi csúszik miatta; majd ezek alapján döntötök a sorrendről.',
      'A kéréseket egy hosszú listába írják, és a hét végén döntenek róluk, mert akkor lesz rá idő.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#focus', '#interruptions', '#triage', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatban a pszichológiai biztonság nő, de a teljesítmény romlik, mert a nehéz témákat kerülik és „minden rendben” hangulat van. Melyik lépés javítja legjobban a helyzetet?',
    options: [
      'A biztonságot csökkented: megszégyeníted a hibázókat, mert ettől majd gyorsabban dolgoznak.',
      'A fókuszt növeled: kijelölöd a közös célt és bevezetsz egy „tények + kockázat + következő lépés” struktúrát, hogy a nehéz témák is biztonságosan kimondhatók legyenek.',
      'A teljesítményt növeled: több meetinget tartotok, hogy mindent megbeszéljetek, de nem vezetsz be döntési szabályt vagy kimenetet.',
      'A biztonságot növeled: megtiltod az ellentmondást, mert az konfliktust szül.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#psychological-safety', '#accountability', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy Scrum Master két beavatkozás között vacillál: (A) szigorú beszéd-idő szabályt vezet be azonnali megszakítással, (B) körkérdés + timebox + kimenet struktúrát vezet be. Melyik növeli nagyobb eséllyel egyszerre a biztonságot és a fókuszt, és mi a tipikus kockázat?',
    options: [
      'A: jobb, mert a szigor gyorsan rendet tesz; kockázat, hogy túl gyorsan javul a hangulat.',
      'B: jobb, mert strukturáltan ad mindenkinek teret és kimenetet hoz; kockázat, hogy ha nincs következetes követés, visszacsúszik a meeting a régi mintába.',
      'A: jobb, mert a szabály betartása önmagában biztonságot teremt; kockázat nincs.',
      'B: rosszabb, mert a struktúra mindig „mesterséges”; kockázat, hogy túl sok döntés születik.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#facilitation', '#focus', '#tradeoffs', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-04-quiz' } }
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
      createdBy: 'apply-day-04-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-04-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 04 quiz applied');
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

