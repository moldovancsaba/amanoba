/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 02 quiz questions (7) — backup-first.
 *
 * Standalone requirement:
 * - No “this course”, “today”, “the lesson”, “a leckében”, etc.
 * - 0 RECALL, >=5 APPLICATION, recommended >=2 CRITICAL_THINKING
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02-quiz.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02-quiz.ts --apply
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
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_02';
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
      'Egy csapat Daily Scrum-ja 25 perces státuszkör lett: mindenki a vezetőnek „jelent”, de a végén nincs döntés. Mi a legjobb első változtatás, hogy a Daily koordinációs kimenetet adjon?',
    options: [
      'Hetente egyszer hosszabb státusz meetinget tartanak, és a Daily-t változatlanul hagyják, mert „legalább mindenki hall mindent”.',
      'Azonnal megszüntetik a Daily-t, mert az „csak meeting”, és helyette mindenki üzenetekben koordinál egész nap.',
      'A Daily elejére kitesznek egy „akadály lista” táblát, és mindenki csak elmondja, hogy „nincs akadály”, döntés nélkül.',
      'Bevezetnek 10 perces timeboxot és egy fix struktúrát: mai Sprint Goal-hoz kötött fókusz, akadályok, és a végén 1–3 konkrét mai koordinációs döntés.',
    ],
    correctIndex: 3,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#scrum', '#daily', '#facilitation', '#application', '#hu'],
  },
  {
    question:
      'Sprint Planning végén van lista a feladatokról, de nincs Sprint Goal. Mi a legjobb lépés, hogy legyen fókusz és ellenőrizhető vállalás?',
    options: [
      'A csapat felosztja a feladatokat emberenként, és mindenki vállal 8 órát; ettől biztosan lesz fókusz.',
      'Egy mondatban megfogalmaznak egy érték-alapú célt, majd ellenőrzik, hogy a kiválasztott backlog elemek tényleg ezt a célt szolgálják.',
      'A Product Owner választ 1 nagy feladatot, és kijelenti, hogy az a cél; a csapat nem kérdez, hogy gyorsabb legyen a meeting.',
      'A Sprint Goal helyett csak a „kész feladatok darabszámát” rögzítik, mert az könnyen mérhető.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#scrum', '#planning', '#sprintgoal', '#application', '#hu'],
  },
  {
    question:
      'Egy Sprint Review-n a csapat bemutat egy új funkciót, de a stakeholder-ek csendben maradnak, így nincs döntés. Melyik facilitáció hozza legnagyobb eséllyel a szükséges ellenőrzést és alkalmazkodást?',
    options: [
      'A csapat részletesen elmagyarázza a technikai megoldást, mert a stakeholder-ek biztosan azért hallgatnak, mert nem értik a részleteket.',
      'A meeting végén mindenki kap egy kérdőívet, de nincs közös beszélgetés és nincs döntés arról, mi változik a következő Sprintben.',
      'A Scrum Master 3 konkrét kérdéssel vezeti a beszélgetést: mi volt a legértékesebb, mi hiányzott, milyen kockázatot látsz; majd rögzítenek 1–2 döntést a Product Backlog következő lépéseiről.',
      'A Review-t átrakják heti státusz meetinggé, és a stakeholder-eknek csak a készültségi százalékot mutatják meg.',
    ],
    correctIndex: 2,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#scrum', '#review', '#stakeholders', '#application', '#hu'],
  },
  {
    question:
      'Egy csapatnál a Product Backlog tele van félmondatokkal és meg nem értett igényekkel, ezért a Sprint Planning során sok idő megy el találgatásra. Mi a legjobb lépés az átláthatóság növelésére?',
    options: [
      'A csapat minden itemhez kötelezően 30 oldalas dokumentációt ír, mert így „biztosan érthető” lesz minden.',
      'Bevezetnek egy rendszeres backlog finomítási idősávot és egy egyszerű „készen áll” kritériumot (példa + elfogadási feltétel), hogy a kiválasztás gyors és ellenőrizhető legyen.',
      'A Product Owner letiltja a kérdéseket a Planning alatt, mert az „lassítja a haladást”.',
      'A csapat csak a legnagyobb itemeket veszi be a Sprintbe, mert azok „úgyis fontosak”, és majd menet közben kiderülnek a részletek.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.MEDIUM,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#scrum', '#backlog', '#transparency', '#application', '#hu'],
  },
  {
    question:
      'Retrospective végén a csapat 12 javító ötletet ír fel, de a következő Sprintben semmi nem változik. Mi a legjobb beavatkozás, hogy valódi alkalmazkodás történjen?',
    options: [
      'A Scrum Master kiválaszt 5 ötletet és kiosztja feladatként, mert így biztosan lesz változás.',
      'A csapat kiválaszt 1 kísérletet, megfogalmazza pontosan a változtatást, kijelöl felelőst és határidőt, és előre megad 1 mérőszámot, amivel 1 Sprint múlva ellenőrzik a hatást.',
      'A csapat leírja az összes ötletet egy dokumentumba, és azt tekinti sikernek, hogy „van lista”.',
      'A csapat kihagyja a Retrospective-et, mert „úgysem hoz változást”, és inkább többet dolgozik.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.APPLICATION,
    hashtags: ['#scrum', '#retro', '#adaptation', '#application', '#hu'],
  },
  {
    question:
      'Egy szervezetben két megközelítés közül kell választani: (A) „szigorú szabály betartatás” minden eseménynél, vagy (B) „kimenet és döntések” fókuszú facilitáció. Melyik hoz nagyobb eséllyel empirikus működést, és mi a tipikus kockázat?',
    options: [
      'A: nagyobb eséllyel empirikus, mert a szabály betartása önmagában garantálja az átláthatóságot; kockázat nincs.',
      'B: nagyobb eséllyel empirikus, mert a kimeneteket és döntéseket teszi láthatóvá; kockázat, hogy ha a kimenetek nincsenek tisztán definiálva, a meetingek „csak beszélgetéssé” válnak.',
      'A: nagyobb eséllyel empirikus, mert a timebox mindig elég; kockázat, hogy a csapat túl gyorsan dönt és romlik a minőség.',
      'B: kisebb eséllyel empirikus, mert a szabályok nélkül nincs Scrum; kockázat, hogy a csapat bármit megtehet következmények nélkül.',
    ],
    correctIndex: 1,
    difficulty: QuestionDifficulty.EXPERT,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#scrum', '#empiricism', '#leadership', '#critical-thinking', '#hu'],
  },
  {
    question:
      'Egy marketing csapat Scrumot akar használni. Mi az a változtatás, ami még összeegyeztethető az empirizmussal, és melyik jelzi leginkább, hogy csak „Scrum-színház” történik?',
    options: [
      'Összeegyeztethető: a Review-n a kész kampány elemeket és méréseket nézik; Scrum-színház jel: minden esemény megvan, de nincs kézzelfogható Increment és nincs döntés a backlogról.',
      'Összeegyeztethető: kihagyják a Review-t, mert „nincs mit megmutatni”; Scrum-színház jel: a Daily rövid és pontos.',
      'Összeegyeztethető: a Sprint helyett végtelen folyamat van; Scrum-színház jel: van Definition of Done és van tanulás a mérésekből.',
      'Összeegyeztethető: a Planning csak adminisztráció; Scrum-színház jel: a csapat minden Sprintben 1 kísérletet futtat és mér.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: ['#scrum', '#non-it', '#increment', '#critical-thinking', '#hu'],
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
      { $set: { isActive: false, 'metadata.updatedAt': new Date(), 'metadata.auditedAt': new Date(), 'metadata.auditedBy': 'apply-day-02-quiz' } }
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
      createdBy: 'apply-day-02-quiz',
      auditedAt: now,
      auditedBy: 'apply-day-02-quiz',
    },
  }));

  const inserted = await QuizQuestion.insertMany(inserts);

  console.log('✅ Day 02 quiz applied');
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

