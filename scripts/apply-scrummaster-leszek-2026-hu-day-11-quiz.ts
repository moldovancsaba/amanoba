/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 11 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_11';
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
      'Egy 30 perces megbeszélés előtt valaki azt mondja: „Beszéljük át a release-t.” Mi a legjobb facilitátori visszakérdezés, hogy értelmes kimenet legyen?',
    options: [
      '„A meeting végére milyen kézzelfogható kimenetet szeretnétek: döntést, tervet vagy next step listát ownerrel?”',
      '„Ki hibázott legutóbb a release-nél, és miért?”',
      '„Kezdjünk el beszélni, majd a végén kiderül, mi lett belőle.”',
      '„A release-ről csak a vezető dönthet, úgyhogy nem kell megbeszélni.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#facilitation', '#outcome', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat 15 perce vitatkozik ugyanazon a ponton, nincs közeledés, és a meeting kifut az időből. Mi a legjobb beavatkozás a flow megmentésére?',
    options: [
      'Még több véleményt kérsz, mert a több beszéd gyorsítja a döntést.',
      'Mini-timeboxot adsz (pl. 2 perc), majd döntés: folytatjuk / parking lot / owner viszi tovább konkrét next steppel.',
      'Megszakítod a meetinget és kijelented, hogy a csapat éretlen a döntéshez.',
      'A vitát addig folytatjátok, amíg mindenki teljesen egyetért.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#timebox', '#parking-lot', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat döntést akar hozni egy 1 hetes kísérletről, de nincs idő konszenzusra. Melyik döntési szabály illik legjobban, ha „nincs megalapozott kifogás” elv mentén akartok haladni?',
    options: [
      'Konszenzus: addig megyünk, amíg mindenki lelkes.',
      'Többségi szavazás: a kisebbség majd hozzászokik.',
      'Consent: akkor megyünk tovább, ha nincs biztonsági vagy érdemi kifogás; időboxolt kísérlet és későbbi felülvizsgálat.',
      'Random választás: feldobtok egy érmét, hogy gyors legyen.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#decision', '#consent', '#experiment', '#application', '#hu'],
  },
  {
    question:
      'Egy megbeszélésen két ember beszél szinte végig, a többiek csendben maradnak. Mi a legjobb módszer, hogy a csendesebb résztvevők is hozzátegyenek értéket?',
    options: [
      'Megkéred a dominánsakat, hogy beszéljenek még többet, mert ők a leghangosabbak.',
      'Azonnal lezárod a meetinget, mert a csend azt jelenti, nincs ötlet.',
      'Néma írást vezetsz be 2–3 percre, majd körben mindenki felolvas 1–1 pontot (vita nélkül).',
      'Csak privátban kérdezed meg a csendeseket később, a meetingben nem számít.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#facilitation', '#inclusion', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat azért nem tud lezárni egy témát, mert mindenki mást ért „kész” alatt. Mi a legjobb lezáró kérdés, ami konkrét döntést hoz?',
    options: [
      '„Akkor mindenki elmondja még egyszer az álláspontját?”',
      '„Mi a döntés, ki az owner, mikor ellenőrizzük, és honnan tudjuk, hogy sikeres?”',
      '„Majd a következő meetingben folytatjuk, most lépjünk tovább.”',
      '„Ha nincs egyetértés, akkor nincs is döntés.”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#decision', '#closure', '#application', '#hu'],
  },
  {
    question:
      'Egy meeting célja „problémamegoldás”, de a csapat rögtön megoldásokba ugrik adat nélkül. Mi a legjobb facilitátori lépés, ha gyorsan szeretnél jobb minőségű döntést?',
    options: [
      'Megkéred őket, hogy vitatkozzanak hangosabban, mert attól lesznek jók az érvek.',
      'Átveszed a döntést és te választasz megoldást, hogy időt spóroljatok.',
      'Először keretet adsz: 5 perc tények/megfigyelések, 5 perc kockázatok, majd csak utána megoldási opciók; timeboxolt sorrenddel.',
      'Kizárod a csendeseket, mert ők lassítják a vitát.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#facilitation', '#quality', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Két döntési szabály közül választhatsz: A) többségi szavazás, B) owner dönt, de előtte strukturált inputot kér. Mikor lehet a B jobb választás, és mi a fő kockázata?',
    options: [
      'B akkor jobb, ha gyors döntés kell és egyértelmű felelősség kell; kockázat, hogy ha nincs transzparens indoklás, csökkenhet az elköteleződés.',
      'B mindig jobb, mert a szavazás tiltott minden csapatban; kockázat nincs.',
      'B akkor jobb, ha mindenki teljesen azonos információval rendelkezik; kockázat, hogy túl sok konszenzus lesz.',
      'B akkor jobb, ha nincs idő; kockázat, hogy túl sok ember kap beleszólást.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#decision', '#tradeoffs', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-11-quiz' } }
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
      createdBy: 'apply-day-11-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-11-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 11 quiz applied');
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
