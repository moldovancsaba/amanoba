/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 03 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_03';
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
      'Egy vezető azt mondja: „Legyünk Agile-ok, ezért mostantól nincs tervezés, csak csináljuk gyorsan.” Scrum Masterként mi a legjobb válasz, ami nem vitatkozik, de a döntéseket empirikus irányba tereli?',
    options: [
      'Egyetértesz: az Agile tényleg azt jelenti, hogy nincs szükség semmilyen célra és mérésre; a lényeg a gyorsaság.',
      'Azt javaslod, hogy először mindent dokumentáljanak részletesen, és csak utána kezdjenek dolgozni, mert így biztosan nem lesz bizonytalanság.',
      'Azt javaslod, hogy válasszanak 1 érték-alapú célt, állítsanak be 1–2 jelzést (mérőszám vagy döntési küszöb), és futtassanak egy rövid kísérletet, amit utána közösen értékelnek.',
      'Azt javaslod, hogy vezessék be az összes Scrum eseményt és szabályt, mert a szabályok önmagukban garantálják a sikeres átalakulást.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#agile', '#empiricism', '#leadership', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat „Agile”-nak nevezi magát, de hónapok óta nincs kézzelfogható, használható eredmény, és a prioritások hetente ugrálnak. Melyik beavatkozás növeli legjobban az átláthatóságot és a fókuszt?',
    options: [
      'Megkérik a csapatot, hogy írjon több státusz riportot, mert ettől a vezetők jobban látják, mi történik.',
      'Bevezetnek egy rövid, rendszeres döntési pontot és egy fókusz-célt (pl. 1 időszakos cél + látható vállalás), majd ellenőrzik, mi szolgálja ezt a célt.',
      'Megengedik, hogy mindenki egyszerre minél több feladaton dolgozzon, mert így „biztosan lesz haladás”.',
      'A problémát kommunikációs tréninggel oldják meg, és nem nyúlnak a munkaszervezéshez vagy a döntési ritmushoz.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#agile', '#focus', '#transparency', '#application', '#hu'],
  },
  {
    question:
      'Egy Sprint Review-n mindenki látja a bemutatót, de a végén nem születik döntés arról, mi legyen a következő érték vagy mi változzon a backlogban. Scrum Masterként mi a legjobb facilitációs lépés?',
    options: [
      'A Review-t átalakítod státusz meetinggé, és a döntések helyett a készültségi százalékot teszed a középpontba.',
      'A meeting végére beépítesz 2–3 kötelező döntéskérdést (mi a legnagyobb érték, mi hiányzik, mi a kockázat), és ezekből 1–2 konkrét backlog döntést rögzítesz.',
      'A Review-t elhagyod, mert ha nincs döntés, akkor felesleges; a csapat majd „valahogy” halad tovább.',
      'A Review-n csak technikai részleteket mutatsz, mert a döntéshez úgyis előbb technikai megértés kell.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#scrum', '#review', '#decision', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat azt mondja: „Kevesebb meetinget szeretnénk.” Melyik átírás a leginkább ellenőrizhető és tanulás-orientált?',
    options: [
      '„Legyen 50%-kal kevesebb meeting, mert a meetingek rosszak.”',
      '„Hagyjuk el a megbeszéléseket, és majd kiderül, hogyan koordinálunk.”',
      '„A következő 2 hétben 2 meetinget megszüntetünk, és mérjük, hogy nő-e a megszakítások száma és romlik-e a koordináció; ha romlik, visszaállítjuk és más kísérletet választunk.”',
      '„Legyen rövidebb minden meeting, de nem határozzuk meg, hogy mi legyen a kimenet, mert a lényeg a gyorsaság.”',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#agile', '#experiment', '#metrics', '#application', '#hu'],
  },
  {
    question:
      'Egy termékcsapat célja: „Legyen jobb a minőség.” Melyik mérőszám-választás segít a legjobban elválasztani az aktivitást a valódi javulástól?',
    options: [
      'A csapat hány órát tölt teszteléssel, mert a több tesztidő automatikusan jobb minőséget jelent.',
      'A heti lezárt feladatok darabszáma, mert az gyorsan nőhet.',
      'A hibaarány és a rework arány trendje, kiegészítve azzal, hogy mennyi munka „görgetődik vissza” kész után.',
      'Az, hogy hány meetinget tartanak a minőségről, mert a beszélgetés önmagában megoldja a problémát.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#quality', '#metrics', '#agile', '#application', '#hu'],
  },
  {
    question:
      'Egy szervezet bevezette a Scrum ceremóniákat, de a működés nem javul: nincs mérés, nincs kísérlet, csak „letudják” a meetingeket. Mi a legjobb diagnózis és első beavatkozás?',
    options: [
      'Diagnózis: túl kevés szabály; beavatkozás: több kötelező rituálé és több adminisztráció, mert a fegyelem a megoldás.',
      'Diagnózis: hiányzik az empirizmus; beavatkozás: tegyék kötelezővé, hogy minden Review végén legyen 1 backlog döntés, és minden Retro végén legyen 1 kísérlet 1 mérőszámmal.',
      'Diagnózis: kevés a meeting; beavatkozás: a Daily legyen 30 perc, hogy mindent meg tudjanak beszélni.',
      'Diagnózis: a csapat túl sokat mér; beavatkozás: hagyjanak fel a mérőszámokkal, mert azok csak feszültséget okoznak.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#scrum', '#agile-theater', '#empiricism', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Két csapat közül kell választani egy komplex termékrész fejlesztésére. A csapat A gyorsan szállít, de sok a visszagörgetett munka; a csapat B lassabb, de stabil minőségű Incrementet ad. Melyik döntés segíti jobban az empirikus tanulást, és mi a tipikus kockázat?',
    options: [
      'A-t választod: a sebesség mindig jobb, mert több változtatás = több tanulás; kockázat nincs.',
      'B-t választod: a stabil Increment növeli az átláthatóságot és a megbízható ellenőrzést; kockázat, hogy túlzott óvatosság miatt csökkenhet a kísérletezés, ha nincs tudatos tanulási cél.',
      'A-t választod: a hibák nem számítanak, mert a visszagörgetés természetes; kockázat, hogy a csapat motivációja túl magas lesz.',
      'B-t választod: a lassúság önmagában minőséget jelent; kockázat, hogy a csapat túl gyorsan fog haladni.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#empiricism', '#quality', '#tradeoffs', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-03-quiz' } }
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
      createdBy: 'apply-day-03-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-03-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 03 quiz applied');
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

