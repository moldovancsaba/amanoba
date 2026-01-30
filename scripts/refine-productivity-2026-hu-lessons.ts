/**
 * Refine Productivity 2026 HU Lessons (low-quality days)
 *
 * Purpose:
 * - Improve lesson content quality so quizzes can be generated at strict standards (0 recall, >=7 questions, >=5 application).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PRODUCTIVITY_2026_HU/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (preview + report):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-hu-lessons.ts --from-day 7 --to-day 30
 *
 * - Apply (DB writes + backups):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-hu-lessons.ts --from-day 7 --to-day 30 --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course') || 'PRODUCTIVITY_2026_HU';
const FROM_DAY = Number(getArgValue('--from-day') || '7');
const TO_DAY = Number(getArgValue('--to-day') || '30');
const APPLY = process.argv.includes('--apply');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'lesson-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function stripHtml(input: string) {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

type CCSLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  requiredConcepts?: string[];
  requiredProcedures?: string[];
  canonicalExample?: string;
  commonMistakes?: string[];
};

type CCSProcedure = {
  id: string;
  name: string;
  steps: string[];
};

function loadProductivityCCS(): {
  lessons: CCSLesson[];
  concepts: Record<string, { definition: string; notes?: string[] }>;
  procedures: CCSProcedure[];
} {
  const p = join(process.cwd(), 'docs', 'canonical', 'PRODUCTIVITY_2026', 'PRODUCTIVITY_2026.canonical.json');
  const raw = readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function htmlSection(title: string, body: string) {
  return `<h2>${title}</h2>\n${body}\n`;
}

function ul(items: string[]) {
  return `<ul>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ul>`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ol>`;
}

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function conceptLabelHu(id: string) {
  const map: Record<string, string> = {
    Vision: 'Vízió',
    Output: 'Output (kimenet)',
    Outcome: 'Outcome (eredmény/hatás)',
    Project: 'Projekt',
    NextAction: 'Következő lépés (next action)',
    GoalHierarchy: 'Célhierarchia',
    Constraints: 'Korlátok',
    ProductivityDefinition: 'Termelékenység definíciója',
    TimeBlocking: 'Időblokkolás (time blocking)',
    DeepWork: 'Mélymunka (deep work)',
    Batching: 'Batching (kötegelt végrehajtás)',
    AttentionResidue: 'Figyelmi maradvány (attention residue)',
    Throughput: 'Throughput (átbocsátás / elkészült érték)',
    FocusBlocks: 'Fókuszblokkok',
    Carryover: 'Carryover (áthúzódó feladatok)',
    CaptureSystem: 'Rögzítési rendszer (capture)',
    TriggersList: 'Triggerek listája',
    HabitsVsSystems: 'Szokások vs rendszerek',
    Delegation: 'Delegálás',
    Elimination: 'Eliminálás (kivágás)',
    EnergyManagement: 'Energia menedzsment',
    DecisionMatrix: 'Döntési mátrix',
    DecisionCategories: 'Döntési kategóriák',
    GoodEnough80Rule: '„Elég jó 80%” szabály',
    SMARTGoals: 'SMART célok',
    OKR: 'OKR (Objective & Key Results)',
  };
  return map[id] || id;
}

function buildIntentHu(requiredConcepts: string[], requiredProcedureIds: string[]) {
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN') || requiredConcepts.includes('DeepWork')) {
    return 'Ma úgy tervezed meg a napodat, hogy védett fókuszblokkokban haladj, és a munkát mérhető eredményhez kösd a valós korlátok között.';
  }
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER') || requiredConcepts.includes('Throughput')) {
    return 'Ma visszacsatolási hurkot építesz: throughput, fókuszblokkok és carryover mérése alapján 1 szabályt finomhangolsz a következő hétre.';
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE') || requiredConcepts.includes('Delegation')) {
    return 'Ma csökkented a terhelést: feladat auditot csinálsz, delegálsz vagy kivágsz, és egyértelmű “kész” kritériumot állítasz be.';
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES') || requiredConcepts.includes('DecisionMatrix')) {
    return 'Ma a döntési késlekedést csökkented: kategorizálod a döntéseket, küszöböt és határidőt adsz, így nem ragadnak be a feladatok.';
  }
  if (requiredConcepts.includes('Output') && requiredConcepts.includes('Outcome')) {
    return 'Ma a kimenetet (output) mérhető eredményhez (outcome) kötöd: “kész” kritérium + mérőszám + küszöb alapján kicsiben tesztelsz.';
  }
  return 'Ma a valós korlátok között mérhető kimenetet hozol létre és ellenőrizhető eredményhez kötöd.';
}

function buildGoalsHu(requiredConcepts: string[], requiredProcedureIds: string[]) {
  const goals: string[] = [];
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    goals.push('Mérd meg a throughputot, a fókuszblokkokat és a carryovert; írj le 2 tanulságot.');
    goals.push('Válassz 1 szabályváltoztatást a következő hétre, és írd le, hogyan ellenőrzöd a hatását.');
  }
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    goals.push('Tervezz be 2 védett fókuszblokkot + 20–30% puffert, hogy a megszakítások ne borítsák fel a napot.');
    goals.push('Definiáld 1 kritikus output “kész” kritériumát és a várt eredményt.');
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    goals.push('Osztályozd a feladatokat: delegálás / kivágás / megtartás; írj 1 szabályt a bejövő kérésekre.');
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    goals.push('Adj 1 döntéshez kritériumot + küszöböt + határidőt; jelölj ki felelőst.');
  }
  if (goals.length < 3) {
    goals.push('Válassz 1 mérőszámot és 1 küszöböt a sikerhez, és futtass egy kicsi pilotot (ne mindent egyszerre).');
    if (requiredConcepts.includes('Constraints')) goals.push('Írj 1 szabályt, ami védi a idő/energia/figyelem korlátokat.');
  }
  return goals.slice(0, 6);
}

function conceptDefinitionHu(id: string) {
  const map: Record<string, string> = {
    Vision: 'A hosszabb távú irány és „miért”, amihez a napi döntések igazodnak.',
    Output: 'Konkrét, elkészült „kézzelfogható” kimenet (pl. dokumentum, döntés, leszállított részfeladat).',
    Outcome: 'A kimenet hatása az eredményre (pl. jobb ügyfélérték, gyorsabb átfutás, kevesebb hiba).',
    Project: 'Több lépésből álló munka, ami egy eredményhez vezet (nem egyetlen feladat).',
    NextAction: 'A legkisebb, egyértelműen elvégezhető következő lépés (igével kezdődik).',
    GoalHierarchy: 'A célok egymásra épülése: vízió → negyedév → hét → nap → következő lépés.',
    Constraints: 'A valós korlátok (idő, energia, figyelem, kapacitás), amelyek között eredményt kell elérni.',
    ProductivityDefinition:
      'Termelékenység = értékes kimenet (output) → mérhető eredmény (outcome) a korlátok figyelembevételével.',
    TimeBlocking: 'Időblokkok előre lefoglalása a naptárban konkrét munkatípusokra és prioritásokra.',
    DeepWork: 'Zavartalan, magas koncentrációt igénylő munka blokk, megszakítások nélkül.',
    Batching: 'Hasonló feladatok összevonása és egyben elvégzése, hogy csökkenjen a váltási költség.',
    AttentionResidue: 'Feladatváltás után „maradék figyelem” ragad a korábbi témán, emiatt romlik a fókusz.',
    Throughput: 'Időegység alatt befejezett, fontos kimenetek száma (nem „elfoglaltság”).',
    FocusBlocks: 'Előre tervezett, megszakítás nélküli fókusz-időblokkok száma és teljesülése.',
    Carryover: 'Áthúzódó, be nem fejezett feladatok aránya (jelzi a túltervezést vagy rossz priorizálást).',
    CaptureSystem: 'Egységes hely és szabály a feladatok/ötletek rögzítésére, hogy ne a fejedben tartsd.',
    TriggersList: 'Tipikus megszakítók (értesítések, emberek, oldalak) listája, amit tudatosan kezelsz.',
    HabitsVsSystems: 'A szokás „automatikus”, a rendszer pedig szabályok + környezet + mérés kombinációja.',
    Delegation: 'Feladat átadása úgy, hogy a cél, kritériumok és ellenőrzési pontok világosak.',
    Elimination: 'Alacsony értékű tevékenységek tudatos kivágása, hogy felszabaduljon kapacitás.',
    EnergyManagement: 'A munka intenzitásának igazítása az energia-ciklushoz (pihenés, ritmus, terhelés).',
    DecisionMatrix: 'Döntések rangsorolása hatás × erőfeszítés (vagy kockázat) alapján, világos kritériumokkal.',
    DecisionCategories: 'Döntések besorolása (kicsi/közepes/nagy) és a megfelelő mélységű folyamat választása.',
    GoodEnough80Rule:
      'A „jó elég” szint kijelölése: 80%-os megoldás gyorsabban eredményt hoz, mint a tökéletesítés.',
    SMARTGoals: 'Konkrét, mérhető, elérhető, releváns és időhöz kötött cél megfogalmazása.',
    OKR: 'Objective (irány) + 2–4 mérhető Key Result (kritérium/threshold) egy időszakra.',
  };
  return map[id] || '';
}

function procedureNameHu(id: string, fallback: string) {
  const map: Record<string, string> = {
    P1_PERSONAL_PRODUCTIVITY_DEFINITION: 'Saját termelékenység‑definíció (output → outcome → korlátok)',
    P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER: 'Heti review (throughput / fókuszblokkok / carryover)',
    P3_DEEP_WORK_DAY_DESIGN: 'Mélymunka‑nap tervezése (időblokkok + védelem + buffer)',
    P4_TASK_AUDIT_DELEGATE_ELIMINATE: 'Feladat audit (delegálás vs eliminálás)',
    P5_DECISION_MATRIX_AND_CATEGORIES: 'Döntési mátrix + döntési kategóriák',
  };
  return map[id] || fallback;
}

function translateProcedureStepHu(step: string) {
  const s = String(step || '').trim();
  const exact: Record<string, string> = {
    // P1_PERSONAL_PRODUCTIVITY_DEFINITION
    'List your recurring outputs (activities).': 'Írd össze a visszatérő kimeneteidet (tevékenységeidet).',
    'Convert each output into a desired outcome (result).': 'Minden outputot fordíts le egy kívánt outcome-ra (eredményre).',
    'List your constraints (time, energy, attention, resources).': 'Sorold fel a korlátaidat (idő, energia, figyelem, erőforrások).',
    'Write a 2–3 sentence definition of productivity for yourself using outcome/constraints.':
      'Írj 2–3 mondatos saját termelékenység-definíciót outcome + korlátok alapján.',
    'Pick one improvement lever for the week (reduce constraint waste or increase outcome quality).':
      'Válassz 1 fejlesztési kart a hétre (korlátpazarlás csökkentése vagy outcome-minőség növelése).',

    // P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER
    'Count throughput: completed important outcomes.': 'Számold meg a throughputot: hány fontos outcome készült el.',
    'Count focus blocks: uninterrupted deep work blocks completed.':
      'Számold meg a fókuszblokkokat: hány zavartalan mélymunka-blokk teljesült.',
    'Count carryover: tasks rolled from last week.': 'Számold meg a carryovert: hány feladat csúszott át a múlt hétről.',
    'Write 2 insights: what worked / what broke.': 'Írj 2 tanulságot: mi működött / mi tört el.',
    'Make 1 rule change for next week and schedule it.': 'Válassz 1 szabályváltoztatást a jövő hétre, és tedd be a naptárba.',

    // P3_DEEP_WORK_DAY_DESIGN
    'Audit your context switches for one day.': 'Egy napig figyeld meg a kontextusváltásaidat.',
    'Batch similar tasks into fixed windows (e.g., email twice daily).':
      'Csoportosítsd a hasonló feladatokat fix idősávokba (pl. email naponta kétszer).',
    'Schedule 1–3 deep work blocks (90–120 min) with explicit rules.':
      'Tervezd be 1–3 mélymunka-blokkot (90–120 perc) egyértelmű szabályokkal.',
    'Add buffer time and defend it from meetings/messages.': 'Adj hozzá buffer időt, és védd meg meetingektől/üzenetektől.',
    'Track adherence for one week and adjust.': 'Kövesd a betartást egy hétig, majd finomhangolj.',

    // P4_TASK_AUDIT_DELEGATE_ELIMINATE
    'List all tasks performed in a week.': 'Írd össze az összes feladatot, amit egy héten elvégzel.',
    'Mark low-value tasks (time cost, low outcome).': 'Jelöld meg az alacsony értékű feladatokat (időköltség magas, outcome alacsony).',
    'For each low-value task: decide delegate vs eliminate vs keep.':
      'Minden alacsony értékű feladatnál dönts: delegálod / kivágod / megtartod.',
    'Write delegation briefs (expected output, due date, success criteria, check-ins).':
      'Írj delegálási briefet (várt output, határidő, siker-kritériumok, check-in pontok).',
    'Execute: eliminate 1 and delegate 1 this week; review impact.':
      'Végrehajtás: ezen a héten vágj ki 1 dolgot és delegálj 1 feladatot; majd nézd meg a hatását.',

    // P5_DECISION_MATRIX_AND_CATEGORIES
    'Define decision category (small/medium/large) based on reversibility and impact.':
      'Határozd meg a döntés kategóriáját (kicsi/közepes/nagy) a visszafordíthatóság és a hatás alapján.',
    'For medium/large: list options and criteria; weight criteria; score options.':
      'Közepes/nagy döntésnél: sorold fel az opciókat és kritériumokat; súlyozz; pontozd az opciókat.',
    'Set an information boundary (time limit / minimum data).': 'Állíts be információs határt (időlimit / minimum adat).',
    'Make the 80% decision and implement.': 'Hozd meg a 80%-os döntést, és valósítsd meg.',
    'Review outcomes and update your decision rules.': 'Nézd át az eredményeket, és frissítsd a döntési szabályaidat.',
  };
  if (exact[s]) return exact[s];

  const map: Array<[RegExp, string]> = [
    [
      /^Write delegation briefs \(expected output, due date, success criteria, check-ins\)\.$/i,
      'Írj delegálási briefet (várt output, határidő, siker-kritériumok, check-in pontok).',
    ],
    [
      /^Execute: eliminate 1 and delegate 1 this week; review impact\.$/i,
      'Végrehajtás: ezen a héten vágj ki 1 dolgot és delegálj 1 feladatot; majd nézd meg a hatását.',
    ],
    [/^Review outcomes and update your decision rules\.$/i, 'Nézd át az eredményeket, és frissítsd a döntési szabályaidat.'],
    [/^Count throughput:/i, 'Számold meg a throughputot:'],
    [/^Count focus blocks:/i, 'Számold meg a fókuszblokkokat:'],
    [/^Count carryover:/i, 'Számold meg a carryovert:'],
    [/^Write 2 insights:/i, 'Írj 2 tanulságot:'],
    [/^Make 1 rule change/i, 'Válassz 1 szabályváltoztatást'],
    [/^Reserve/i, 'Foglalj le'],
    [/^Block/i, 'Blokkold'],
    [/^Add/i, 'Adj hozzá'],
    [/^Define/i, 'Határozd meg'],
    [/^Design/i, 'Tervezd meg'],
  ];
  for (const [re, rep] of map) {
    if (re.test(s)) return s.replace(re, rep);
  }
  return s;
}

function buildMetricsHu(params: { day: number; requiredConcepts: string[]; requiredProcedures: string[] }) {
  const { day, requiredConcepts, requiredProcedures } = params;

  const metrics: string[] = [];

  if (requiredConcepts.includes('Throughput')) {
    metrics.push('Throughput: hány fontos kimenet készült el ezen a héten? (mérőszám)');
  }
  if (requiredConcepts.includes('FocusBlocks') || requiredConcepts.includes('DeepWork')) {
    metrics.push('Fókuszblokkok: hány zavartalan blokk teljesült? (mérőszám + kritérium: „megszakítás nélkül”)');
  }
  if (requiredConcepts.includes('Carryover')) {
    metrics.push('Carryover: hány feladat csúszott át, és miért? (mérőszám + ok-okozat)');
  }
  if (requiredConcepts.includes('EnergyManagement')) {
    metrics.push('Energia: alvás/ritmus jelzések + délutáni teljesítmény (kritérium: fenntartható tempó)');
  }
  if (requiredConcepts.includes('Delegation')) {
    metrics.push('Delegálás: átadott feladatok aránya + visszapattanások száma (mérőszám)');
  }
  if (requiredConcepts.includes('DecisionMatrix') || requiredProcedures.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    metrics.push('Döntési késleltetés: idő az issue-tól a döntésig (mérőszám + küszöb, pl. 48 óra).');
  }
  if (requiredConcepts.includes('Constraints')) {
    metrics.push('Korlátok: napi védett idő és buffer arány (kritérium: nem túltervezett nap).');
  }

  if (metrics.length < 4) {
    metrics.push('Kritérium: a „kész” definíció egyértelmű és ellenőrizhető (kritérium).');
    metrics.push('Küszöb: előre rögzített minimum a sikerhez (threshold), majd utólagos ellenőrzés.');
  }

  return metrics.slice(0, 6);
}

function buildHULessonHtml(params: {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  requiredConcepts: string[];
  requiredProcedures: CCSProcedure[];
  canonicalExample?: string;
  commonMistakes: string[];
}) {
  const { day, title, intent, goals, requiredConcepts, requiredProcedures, canonicalExample, commonMistakes } = params;

  const conceptBlocks = requiredConcepts
    .map((id) => {
      const label = conceptLabelHu(id);
      const def = conceptDefinitionHu(id);
      const body = def
        ? `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(def)}</p>`
        : `<p><strong>${escapeHtml(label)}:</strong> (definíció hozzáadandó)</p>`;
      return body;
    })
    .join('\n');

  const procedureBlocks = requiredProcedures
    .map((p) => {
      const stepsHu = (p.steps || []).map(translateProcedureStepHu);
      return (
        `<h3>${escapeHtml(procedureNameHu(p.id, p.name))}</h3>\n` +
        `<p><em>Cél:</em> ezt a folyamatot használd úgy, hogy mérhető kimenet és ellenőrizhető kritérium legyen.</p>\n` +
        ol(stepsHu.map((s) => escapeHtml(s)))
      );
    })
    .join('\n');

  const metrics = buildMetricsHu({ day, requiredConcepts, requiredProcedures: requiredProcedures.map((p) => p.id) });

  const exampleText =
    canonicalExample ||
    'Példa (jó): 2 fókuszblokk, 1 elkészült kimenet, 0 kritikus carryover. Példa (rossz): 12 „elindított” feladat, de nincs lezárt eredmény, és a korlátok felborulnak.';

  const mistakes = commonMistakes.length
    ? commonMistakes.map((m) => `Hiba: ${m}. Javítás: írd le a kritériumot, mérj, és változtass csak 1 szabályon.`)
    : [
        'Hiba: túl sok mindent akarsz egyszerre. Javítás: 1 fókusz, 1 mérőszám, 1 szabályváltoztatás.',
        'Hiba: nincs ellenőrzés. Javítás: előre jelöld ki a mérőpontokat és a küszöböt, majd review.',
      ];

  const content =
    `<h1>${escapeHtml(`Termelékenység 2026 — ${day}. nap`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>Miért számít ma?</strong> ${escapeHtml(intent)}</p>\n` +
    htmlSection('Mai célok (outcome)', ul(goals.map((g) => escapeHtml(g)))) +
    htmlSection('Kulcsfogalmak (definíciók)', conceptBlocks) +
    htmlSection('Lépések és ellenőrzés (eljárások)', procedureBlocks || `<p>Ma a fókusz a gyakorlati bevezetésen van: 1 szabály, 1 mérőszám, 1 review.</p>`) +
    htmlSection('Példa (jó vs rossz)', `<p>${escapeHtml(exampleText)}</p>`) +
    htmlSection('Gyakori hibák és korrekciók', ul(mistakes.map((m) => escapeHtml(m)))) +
    htmlSection('Mérőszámok, kritériumok, küszöbök', ul(metrics.map((m) => escapeHtml(m))));

  return content;
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'hu') {
    throw new Error(`Course language is not HU for ${COURSE_ID} (found: ${course.language})`);
  }

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .lean();

  // Deduplicate by dayNumber (keep oldest record per day)
  const byDay = new Map<number, any>();
  for (const lesson of lessons) {
    const existing = byDay.get(lesson.dayNumber);
    if (!existing) {
      byDay.set(lesson.dayNumber, lesson);
      continue;
    }
    const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
    const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
    if (b < a) byDay.set(lesson.dayNumber, lesson);
  }

  const ccs = loadProductivityCCS();
  const ccsByDay = new Map<number, CCSLesson>();
  for (const l of ccs.lessons || []) ccsByDay.set(l.dayNumber, l);

  const procById = new Map<string, CCSProcedure>();
  for (const p of ccs.procedures || []) procById.set(p.id, p);

  const stamp = isoStamp();
  mkdirSync(OUT_DIR, { recursive: true });

  const planRows: any[] = [];
  const applyResults: any[] = [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  for (let day = FROM_DAY; day <= TO_DAY; day++) {
    const lesson = byDay.get(day);
    if (!lesson) {
      planRows.push({ day, action: 'SKIP_NO_LESSON', reason: 'Missing lesson in DB for that day' });
      continue;
    }

    const ccsLesson = ccsByDay.get(day);
    if (!ccsLesson) {
      planRows.push({ day, lessonId: lesson.lessonId, action: 'SKIP_NO_CCS', reason: 'Missing CCS entry' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'hu' });
    const oldIntegrity = validateLessonRecordLanguageIntegrity({
      language: 'hu',
      content: oldContent,
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });

    const forceRefineForLanguage = !oldIntegrity.ok;

    // Safety: never overwrite already-strong lessons unless language integrity fails.
    if (oldScore.score >= 70 && !forceRefineForLanguage) {
      planRows.push({
        day,
        lessonId: lesson.lessonId,
        title: oldTitle,
        action: 'SKIP_ALREADY_OK',
        quality: { old: oldScore, next: oldScore },
        lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(oldContent).length },
        applyEligible: true,
      });
      continue;
    }

    const requiredConcepts = (ccsLesson.requiredConcepts || []).filter(Boolean);
    const requiredProcedures = (ccsLesson.requiredProcedures || [])
      .map((id) => procById.get(id))
      .filter(Boolean) as CCSProcedure[];
    const requiredProcedureIds = (ccsLesson.requiredProcedures || []).filter(Boolean);

    const nextContent = buildHULessonHtml({
      day,
      title: oldTitle || `Termelékenység 2026 — ${day}. nap`,
      intent: buildIntentHu(requiredConcepts, requiredProcedureIds),
      goals: buildGoalsHu(requiredConcepts, requiredProcedureIds),
      requiredConcepts,
      requiredProcedures,
      canonicalExample: undefined,
      commonMistakes: [],
    });
    const nextScore = assessLessonQuality({ title: oldTitle, content: nextContent, language: 'hu' });
    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'hu',
      content: nextContent,
      emailSubject: `Termelékenység 2026 – ${day}. nap: ${oldTitle}`,
      emailBody:
        `<h1>Termelékenység 2026 – ${day}. nap</h1>\n` +
        `<h2>${escapeHtml(oldTitle)}</h2>\n` +
        `<p>${escapeHtml(buildIntentHu(requiredConcepts, requiredProcedureIds))}</p>\n` +
        `<p><a href=\"${appUrl}/hu/courses/${COURSE_ID}/day/${day}\">Lecke megnyitása →</a></p>`,
    });

    const row = {
      day,
      lessonId: lesson.lessonId,
      title: oldTitle,
      action: 'REFINE',
      quality: { old: oldScore, next: nextScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(nextContent).length },
      applyEligible: nextScore.score >= 70 && integrity.ok,
      languageIntegrity: integrity,
    };
    planRows.push(row);

    if (!APPLY) continue;
    if (!integrity.ok) {
      throw new Error(
        `Language integrity failed for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }

    // Backup before update
    const courseFolder = join(BACKUP_DIR, COURSE_ID);
    mkdirSync(courseFolder, { recursive: true });
    const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: oldTitle,
          content: oldContent,
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
        },
        null,
        2
      )
    );

    const emailSubject = `Termelékenység 2026 – ${day}. nap: ${oldTitle}`;
    const emailBody =
      `<h1>Termelékenység 2026 – ${day}. nap</h1>\n` +
      `<h2>${escapeHtml(oldTitle)}</h2>\n` +
      `<p>${escapeHtml(buildIntentHu(requiredConcepts, requiredProcedureIds))}</p>\n` +
      `<p><a href=\"${appUrl}/hu/courses/${COURSE_ID}/day/${day}\">Lecke megnyitása →</a></p>`;

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          content: nextContent,
          emailSubject,
          emailBody,
          'metadata.updatedAt': new Date(),
        },
      }
    );

    applyResults.push({
      day,
      lessonId: lesson.lessonId,
      backupPath,
      matched: update.matchedCount,
      modified: update.modifiedCount,
      newScore: nextScore.score,
    });
  }

  const reportPath = join(OUT_DIR, `lesson-refine-preview__${COURSE_ID}__${stamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        fromDay: FROM_DAY,
        toDay: TO_DAY,
        apply: APPLY,
        totals: {
          considered: planRows.length,
          eligible70: planRows.filter((r) => r.applyEligible).length,
          below70: planRows.filter((r) => !r.applyEligible).length,
          applied: applyResults.length,
        },
        planRows,
        applyResults,
      },
      null,
      2
    )
  );

  console.log('✅ Lesson refinement preview complete');
  console.log(`- Apply mode: ${APPLY ? 'YES (DB writes + backups)' : 'NO (dry-run only)'}`);
  console.log(`- Report: ${reportPath}`);
  if (APPLY) console.log(`- Backups: ${join(BACKUP_DIR, COURSE_ID)}`);
  if (APPLY) console.log(`- Applied lessons: ${applyResults.length}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
