/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 06 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_06';
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
      'Egy backlog item így hangzik: „Legyen jobb a keresés.” Melyik átfogalmazás teszi a legjobban döntés-támogatóvá és ellenőrizhetővé?',
    options: [
      '„Legyen jobb a keresés, mert sokan panaszkodnak.”',
      '„Készítsünk új kereső oldalt modern designnal.”',
      '„A felhasználó 3 kattintásból találjon releváns találatot; jelzés: 0 találat arány és keresésből indított konverzió; 2 elfogadási feltétel: …”',
      '„Tegyük gyorsabbá a keresést, mert a sebesség mindig a legfontosabb.”',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#backlog', '#value', '#acceptance', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat magas értékű ötletet kap, de nem tudja, hogy a felhasználóknak tényleg kell-e. Mi a legjobb első lépés a bizonytalanság csökkentésére?',
    options: [
      'Azonnal teljesen megépítik, mert a magas értékű ötleteket nem szabad késleltetni.',
      'A munkát elhalasztják 6 hónapra, mert bizonytalanság esetén jobb semmit sem csinálni.',
      'Rövid kísérletet futtatnak (pl. prototípus + mérés vagy interjú), majd a tanulság alapján döntenek a további befektetésről.',
      'A Product Owner kijelenti, hogy kell, ezért a csapat nem kérdez és nem mér.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#uncertainty', '#experiment', '#backlog', '#application', '#hu'],
  },
  {
    question:
      'Egy backlog itemnél a kockázat magas (pl. pénzügyi vagy biztonsági tét), de a bizonytalanság alacsony. Mi a legjobb megközelítés?',
    options: [
      'Előre vesszük, de kockázat-kezelő kaput teszünk rá: ellenőrzés (teszt/review) és védelmi lépések, majd csak így tekintjük vállalhatónak.',
      'Hátra tesszük, mert a magas kockázat mindig azt jelenti, hogy nem szabad foglalkozni vele.',
      'Kizárólag dokumentációt írunk róla, mert a kockázatot csak papírral lehet csökkenteni.',
      'Csak a sebesség számít, ezért a kockázatot nem vizsgáljuk.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#risk', '#quality-gate', '#application', '#hu'],
  },
  {
    question:
      'Egy Sprint Planning során sok idő megy el találgatásra, mert a kiválasztott itemeknél hiányzik a cél és az elfogadás. Melyik kapu segít a legjobban megelőzni ezt?',
    options: [
      'Minden itemhez 30 oldalas dokumentációt írnak, és ettől várják, hogy megszűnik a találgatás.',
      'Csak a nagy itemeket választják be, mert azok „biztosan fontosak”.',
      'Kötelező minimum: outcome mondat + 2–4 elfogadási feltétel + 1 kockázat + 1 nyitott kérdés; ha ez nincs, előbb tisztázási munka kerül be.',
      'A csapat megtiltja a kérdéseket a Planning alatt, mert az lassít.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#planning', '#readiness', '#backlog', '#application', '#hu'],
  },
  {
    question:
      'Egy backlogban két item közül kell választani. Az A magas értékű, de sok a nyitott kérdés; a B közepes értékű, de tiszta és alacsony kockázatú. Mi a legjobb döntés rövid távon?',
    options: [
      'A-t választod teljes fejlesztésre, mert a magas érték mindig első, függetlenül a bizonytalanságtól.',
      'B-t fejleszted, és az A-hoz előbb egy rövid tisztázó/kísérleti lépést teszel be, hogy csökkenjen a bizonytalanság és jobb legyen a döntés.',
      'Mindkettőt párhuzamosan elkezditek, hogy „minden haladjon”.',
      'Egyiket sem választod, mert a döntés mindig konfliktust okoz.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#prioritization', '#uncertainty', '#application', '#hu'],
  },
  {
    question:
      'Egy szervezetben a backlog tele van feladatokkal (pl. „API endpoint megírása”), de kevés az outcome. Mi a legjobb első változtatás, hogy a backlog valóban termékdöntést támogasson?',
    options: [
      'A feladatokat átnevezitek, de a cél és a jelzés továbbra sincs megadva.',
      'A feladatokat átalakítjátok outcome-alapú itemekké: célérték + jelzés + elfogadás, és csak utána bontjátok technikai lépésekre.',
      'Minden feladathoz hozzáadtok egy becslést, mert a becslés önmagában értéket ad.',
      'Több státusz riportot kértek, mert attól a backlog jobb lesz.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#outcome', '#backlog', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Két stratégia közül választasz backlog priorizálásra: (A) mindig a legnagyobb értéket építitek először, (B) magas értéknél előbb csökkentitek a bizonytalanságot és a kockázatot kísérletekkel. Melyik támogatja jobban az empirikus döntéseket, és mi a tipikus kockázat?',
    options: [
      'A: jobban támogatja, mert a gyors építés automatikusan tanulást jelent; kockázat nincs.',
      'B: jobban támogatja, mert a tanulás olcsóbb lehet a teljes építésnél; kockázat, hogy ha túl sok a kísérlet és nincs döntés, elhúzódik a szállítás.',
      'A: jobban támogatja, mert a bizonytalanságot nem kell kezelni; kockázat, hogy a csapat túl gyors lesz.',
      'B: rosszabb, mert a kísérletek mindig feleslegesek; kockázat, hogy a csapat túl sokat mér.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#empiricism', '#tradeoffs', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-06-quiz' } }
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
      createdBy: 'apply-day-06-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-06-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 06 quiz applied');
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
