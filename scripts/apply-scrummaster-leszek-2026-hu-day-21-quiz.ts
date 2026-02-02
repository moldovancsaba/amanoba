/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 21 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_21';
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
      'Egy vezető azt mondja: „Nagy a cég, holnaptól SAFe kell.” A csapatnál viszont a fő gond, hogy nincs tiszta prioritás és túl magas a WIP. Mi a legjobb első lépés?',
    options: [
      'Azonnal bevezeted a teljes keretrendszert, mert a méret önmagában indok.',
      'Diagnózis után az alapokat rendezed: prioritás-keret + WIP limit + finish-first, és csak utána vizsgálod a skálázási szükségletet.',
      'További meetingeket raksz be, hogy több koordináció legyen.',
      'Mindent központosítasz egy emberre, hogy „gyorsabb” legyen a döntés.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#scaling', '#wip', '#critical-thinking', '#hu'],
  },
  {
    question:
      '8 csapat dolgozik ugyanazon terméken, és minden érték-szelet 4 csapatot érint. A Sprint végén az integráció összeomlik. Mi a legjobb első beavatkozás?',
    options: [
      'Minden csapat külön deployol, integráció nélkül, mert így kevesebb konfliktus lesz.',
      'A hibákat nem rögzítitek, mert demotiváló.',
      'A függőségek és integrációs fájdalom láthatóvá tétele, vertikális szeletelés és integrációs gyakorlatok (CI/CD) erősítése, mielőtt keretrendszert választotok.',
      'A problémát csak több státusz riporttal oldjátok meg.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#dependencies', '#integration', '#application', '#hu'],
  },
  {
    question:
      'Egy szervezetben minden döntés egyetlen vezetőn akad el, ezért a csapatok várakoznak. Melyik „skálázás jelző” és első lépés illik ide legjobban?',
    options: [
      'Túl kevés meeting: több meetinget kell bevezetni, hogy gyorsuljon.',
      'Túl sok fejlesztő: csökkenteni kell a létszámot, és majd megoldódik.',
      'Túl sok backlog: törölni kell a backlogot, hogy ne legyen teher.',
      'Koordinációs torlódás: döntési jogkörök tisztázása és döntésnapló, hogy a döntések visszakereshetőek legyenek.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#decision', '#bottleneck', '#application', '#hu'],
  },
  {
    question:
      'Egy szervezetben 10 stakeholder 10 irányt húz, és a csapatok össze-vissza fejlesztenek. Mit érdemes elsőként tisztázni a „skálázás előtt alapok” elv szerint?',
    options: [
      'A csapatok napi 2 órás státusz riportját, hogy a vezetők lássák a munkát.',
      'Hogy minden csapat ugyanazt az eszközt használja, mert ettől lesz fókusz.',
      'Termékcélok és priorizálási keret: mi a cél, mi az érték, és mi csúszik, ha valamit előre hozunk.',
      'Hogy mindenki egyszerre ugyanakkor deployoljon, mert így könnyebb.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#product', '#prioritization', '#application', '#hu'],
  },
  {
    question:
      'Egy szervezetben a „skálázás” szó alatt valójában azt értik, hogy „több koordinációs meetinget szeretnénk”. Mi a legjobb Scrum Master korrekció?',
    options: [
      'Elfogadod a kérésüket, és bevezetsz heti 10 extra meetinget, mert a koordináció mindig segít.',
      'Megkéred, hogy előbb konkrét tüneteket soroljanak (függőségek, integráció, döntési torlódás), majd ezekhez első beavatkozásokat rendeltek, és csak utána beszéltek keretrendszerről.',
      'A skálázásról nem beszélsz, mert konfliktusos téma.',
      'Minden problémát a csapatokra tolsz, mert „a Scrum a csapaté”.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#diagnosis', '#scaling', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Két scenarió van. A) 4 csapat, káosz a prioritásokban, sok félkész munka. B) 8 csapat, erős cross-team függőségek és integrációs fájdalom. Melyiknél valószínűbb, hogy előbb alapokat kell rendbe tenni, és melyiknél van erős skálázási jelző?',
    options: [
      'A-nál előbb alapok (prioritás + WIP + befejezés), B-nél erős jelző a függőség és integráció, ott a szeletelés és integrációs gyakorlatok a kulcs.',
      'Mindkettőnél azonnal keretrendszer bevezetése a legjobb, mert gyors eredményt ad.',
      'A-nál és B-nél is csak több státusz riport kell, mert az oldja meg a káoszt.',
      'A-nál és B-nél is a létszám növelése a kulcs, mert több ember = gyorsabb.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#diagnosis', '#tradeoffs', '#application', '#hu'],
  },
  {
    question:
      'Egy csapat azt mondja: „Skálázás kell, mert lassú az átfutás.” A metrikák alapján viszont a WIP nagyon magas és sok a „majdnem kész”. Mi a legjobb következtetés?',
    options: [
      'A lassúság valószínűleg flow probléma: WIP limit + finish-first + szeletelés javít először; a skálázás nem első gyógyszer.',
      'A lassúság mindig skálázási probléma, ezért keretrendszert kell választani.',
      'A lassúság azért van, mert kevés a meeting; több meeting kell.',
      'A lassúság azért van, mert a csapat nem elég motivált; motivációs tréning kell.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#flow', '#wip', '#application', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-21-quiz' } }
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
      createdBy: 'apply-day-21-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-21-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);
  console.log('✅ Day 21 quiz applied');
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
