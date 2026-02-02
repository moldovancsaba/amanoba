/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 28 quiz questions (7) — backup-first.
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_28';
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
      'Egy vezető azt kéri: „Jelöljétek Done-nak, majd később kijavítjuk.” Mi a legjobb Scrum Master reakció, ha a cél a transzparencia és a minőség védelme?',
    options: [
      'Ráhagyod, mert így gyorsabban „kész” lesz a Sprint.',
      'Partneri nemet mondasz: tisztázod a kockázatot, és alternatívát adsz (kisebb szelet, scope csere, vagy kész-kritériumok tisztázása).',
      'A kérést titokban teljesíted, hogy elkerüld a konfliktust.',
      'A csapatot hibáztatod, hogy miért nem gyorsabb.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#ethics', '#quality', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy vezető a Daily-n státuszt akar hallani tőled és a csapattól. Mi a legjobb beavatkozás, ami védi a Daily célját, de kiszolgálja az információigényt?',
    options: [
      'A Daily-t státusz meetinggé alakítjátok, mert a vezető ezt kéri.',
      'A vezetőt kizárod minden meetingről, hogy ne zavarjon.',
      'Külön transzparencia csatornát adsz (pl. board + heti rövid sync), a Daily-ben pedig a csapat a Sprint célhoz igazodik; a vezető igényét így is teljesíted.',
      'A csapatnak megmondod, hogy a vezetőnek mindent el kell mondani, különben baj lesz.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#boundaries', '#daily', '#application', '#hu'],
  },
  {
    question:
      'A csapat rendszeresen túlórázik, és a vezető ezt „normál üzemmódnak” tekinti. Mi a legjobb Scrum Master lépés, ha a cél a fenntarthatóság?',
    options: [
      'A túlórát kötelezővé teszitek, mert így biztosan kész lesz minden.',
      'Transzparenssé teszed a tradeoffot és a kockázatot, majd kísérletet javasolsz (WIP csökkentés, slicing, scope csere), hogy csökkenjen a túlóra.',
      'A túlórát elrejted, hogy ne legyen vita.',
      'A csapatot motivációs beszéddel „felpörgeted”, és marad minden ugyanígy.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#sustainability', '#wip', '#application', '#hu'],
  },
  {
    question:
      'Egy stakeholder azt kéri, hogy „ne írjátok ki a blokkokat a boardra, mert az rosszul mutat”. Mi a legjobb válasz, ami etikus és üzletileg is védhető?',
    options: [
      'Eltüntetitek a blokkokat, mert a látszat fontosabb.',
      'Megtagadod, de magyarázat nélkül („nem, mert nem”).',
      'Kiemelnéd, hogy a transzparencia segít gyorsabban megoldani a blokkokat; javasolsz eszkalációs és megoldási folyamatot a láthatóság megtartásával.',
      'A csapatot hibáztatod, hogy miért vannak blokkok.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#transparency', '#ethics', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy Scrum Master a konfliktus elkerülése miatt minden kérésre igent mond. Mi a legjobb „határ” jel, ami arra utal, hogy ez már káros?',
    options: [
      'A csapatnak több meetingje van, mint korábban.',
      'Sok a félkész munka, nő a rework, és a csapat kimerült — ez fenntarthatatlan működés jele.',
      'A boardon több szín van, ami zavaró.',
      'A sprint hossza változik.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#boundaries', '#health', '#application', '#hu'],
  },
  {
    question:
      'Egy vezető azt mondja: „A Scrum Master feladata, hogy rákényszerítse a csapatra a szabályokat.” Melyik válasz a legjobb átkeretezés?',
    options: [
      '„A cél a keret és elvek védelme, de kísérletekkel és partneri módon; a csapatot nem kényszerítem, hanem segítem, hogy működjön.”',
      '„Igen, én vagyok a rendőr, és én döntök mindenben.”',
      '„A Scrum Master semmiben nem vesz részt, csak nézi.”',
      '„A szabályokat a csapat helyett én tartom be, így ők lazíthatnak.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#role', '#coaching', '#application', '#hu'],
  },
  {
    question:
      'Egy kérést nem akarsz vállalni, de nem akarsz konfliktust sem. Mi a legjobb „partneri nem” formula?',
    options: [
      '„Nem, mert nem; ezt most nem szeretném megindokolni, és nem nyitok róla párbeszédet.”',
      '„Ezt így nem vállalom. Viszont ha a cél ez, akkor itt van két opció és a tradeoffok — válasszunk tudatosan.”',
      '„Rendben, megcsináljuk, majd valahogy lesz.”',
      '„Csak akkor csináljuk meg, ha senki nem tud róla.”',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#communication', '#boundaries', '#application', '#hu'],
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

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'quiz-backups', COURSE_ID);
  const backupFile = join(backupDir, `${LESSON_ID}__${stamp}.json`);

  const existing = await QuizQuestion.find({ courseId: course._id, lessonId: LESSON_ID, isCourseSpecific: true, isActive: true })
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-28-quiz' } }
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
      auditedAt: now,
      auditedBy: 'apply-day-28-quiz',
    },
  }));

  await QuizQuestion.insertMany(inserts, { ordered: true });
  console.log('✅ Day 28 quiz applied');
  console.log(`- courseId: ${COURSE_ID}`);
  console.log(`- lessonId: ${LESSON_ID}`);
  console.log(`- deactivated: ${existing.length}`);
  console.log(`- inserted: ${inserts.length}`);
  console.log(`- backup: ${backupFile}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
