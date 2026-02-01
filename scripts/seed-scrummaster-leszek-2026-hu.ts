/**
 * Seed ScrumMaster leszek 2026 (SCRUMMASTER_LESZEK_2026_HU)
 *
 * What:
 * - Creates/updates the CCS DB record (course family) and the HU course variant in production DB (amanoba).
 * - Optionally creates 30 lesson stubs (inactive) or full lessons from CCS + HU glossary.
 *
 * Why:
 * - Enable a draft-first workflow on production while keeping course creation resume-safe.
 *
 * Usage:
 * - Dry run (no DB writes):
 *   npx tsx --env-file=.env.local scripts/seed-scrummaster-leszek-2026-hu.ts
 * - Apply (creates/updates CCS + course):
 *   npx tsx --env-file=.env.local scripts/seed-scrummaster-leszek-2026-hu.ts --apply
 * - Apply + create lesson stubs:
 *   npx tsx --env-file=.env.local scripts/seed-scrummaster-leszek-2026-hu.ts --apply --include-lessons
 * - Apply + create full lessons from CCS + HU glossary:
 *   npx tsx --env-file=.env.local scripts/seed-scrummaster-leszek-2026-hu.ts --apply --full-lessons
 * - Activate course and lessons (use with --apply --full-lessons):
 *   npx tsx --env-file=.env.local scripts/seed-scrummaster-leszek-2026-hu.ts --apply --full-lessons --activate
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { Brand, CCS, Course, Lesson } from '../app/lib/models';

const CCS_ID = 'SCRUMMASTER_LESZEK_2026';
const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';

const CANONICAL_JSON_PATH = 'docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026.canonical.json';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const APPLY = hasFlag('--apply');
const INCLUDE_LESSONS = hasFlag('--include-lessons');
const FULL_LESSONS = hasFlag('--full-lessons');
const ACTIVATE = hasFlag('--activate');

type CanonicalLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  requiredConcepts?: string[];
  requiredProcedures?: string[];
  commonMistakes: string[];
};

type Canonical = {
  courseName: string;
  intent?: { oneSentence?: string };
  concepts?: Record<string, { definition: string; notes?: string[] }>;
  procedures?: Array<{ id: string; name: string; steps: string[] }>;
  lessons?: CanonicalLesson[];
};

const lessonTitlesHu: Array<{ day: number; title: string }> = [
  { day: 1, title: 'Scrum Master 2026: szerep, határok, impact' },
  { day: 2, title: 'Agile vs Scrum: mit kapsz ettől a “kóstoló” kurzustól?' },
  { day: 3, title: 'Scrum térkép: szerepek, események, artefaktok (1 oldalban)' },
  { day: 4, title: 'A csapat mint rendszer: biztonság, fókusz, szabályok' },
  { day: 5, title: 'Definition of Done v0.1: minőség mint kapu' },
  { day: 6, title: 'Backlog alapok: érték, kockázat, elfogadási kritériumok' },
  { day: 7, title: 'Refinement kóstoló: készülj fel a Sprint Planningre' },
  { day: 8, title: 'Sprint Planning: cél, forecast, kockázat' },
  { day: 9, title: 'Daily Scrum státuszszínház nélkül: akadályok és koordináció' },
  { day: 10, title: 'WIP és fókusz: miért öl a párhuzamosság?' },
  { day: 11, title: 'Facilitáció alapok: outcome, timebox, döntési szabály' },
  { day: 12, title: 'Sprint Review: érték bemutatása és visszacsatolás kezelése' },
  { day: 13, title: 'Retrospective: valódi javulás vs panaszkör' },
  { day: 14, title: 'Konfliktus mintázatok: PO vs Dev vs Stakeholder' },
  { day: 15, title: 'Döntés vagy kísérlet? Hogyan zárd le a végtelen vitákat' },
  { day: 16, title: 'Metrikák kóstoló: flow + minőség + érték + egészség' },
  { day: 17, title: 'Coaching mindset: kérdések, nem megoldások' },
  { day: 18, title: 'Stakeholder management: elvárások és kommunikációs cadencia' },
  { day: 19, title: 'Change management: új szokás 2 hetes kísérletként' },
  { day: 20, title: 'Remote/hybrid Scrum: fókusz és meeting-higiénia' },
  { day: 21, title: 'Skálázás kóstoló: mikor segít és mikor árt?' },
  { day: 22, title: 'IT vs non-IT Scrum: mi változik, mi marad ugyanaz?' },
  { day: 23, title: 'Kockázat és bizonytalanság: spike, discovery, prototípus' },
  { day: 24, title: 'Minőség és technikai gyakorlatok kóstoló: mit kérdezz Scrum Masterként?' },
  { day: 25, title: 'Eszközök és workflow higiénia: board, ami a valóságot mutatja' },
  { day: 26, title: 'Karrier térkép: junior → mid → senior Scrum Master' },
  { day: 27, title: 'Interjú kóstoló: kérdésminták és jó válasz struktúra' },
  { day: 28, title: 'Etika és határok: mikor mondasz nemet?' },
  { day: 29, title: 'Final exam felkészítés: tipikus szituáció minták' },
  { day: 30, title: 'Zárás: Scrum Master playbook v1 + tanúsítvány terv' },
];

// Hungarian glossary for concepts (CCS-aligned). Used when building full lesson content.
const huConcepts: Record<string, { definition: string; notes?: string[] }> = {
  Agile: {
    definition: 'Egy gondolkodásmód és elvek gyűjteménye, amely a visszajelzésen, tanuláson és alkalmazkodáson alapul bizonytalanság mellett.',
    notes: ['Az Agile nem „gyorsabb”; hanem jobb tanulás és döntéshozatal változás mellett.'],
  },
  Scrum: {
    definition: 'Egy könnyűsúlyú keretrendszer összetett problémák megoldására, értéket szállítva iteratívan szerepek, események és artefaktok használatával.',
    notes: ['A Scrum az empirizmus konténere: átláthatóság, megvizsgálás, alkalmazkodás.'],
  },
  ScrumMasterRole: {
    definition: 'Egy szolgáló vezető, aki coachinggal, facilitációval, akadályok elhárításával és a csapat képességének védelmével teszi lehetővé a Scrumot.',
    notes: ['A Scrum Master nem a termék döntésekért felelős; a rendszert teszi lehetővé.'],
  },
  Empiricism: {
    definition: 'Bizonyítékokon és visszajelzési hurkokon alapuló munka: átláthatóság → megvizsgálás → alkalmazkodás.',
    notes: ['Ha nem vizsgálod meg a valóságot, nem javíthatod.'],
  },
  PsychologicalSafety: {
    definition: 'Olyan csapatklima, ahol az emberek nyugodtan szólalnak meg, elismerik a bizonytalanságot és tanulnak félelem nélkül.',
    notes: ['Biztonság nélkül csend, politizálás és álmegállapodás lesz.'],
  },
  WorkingAgreement: {
    definition: 'Egy írott megállapodás, amely leírja, hogyan dolgozik együtt a csapat (normák, kommunikáció, döntési szabályok).',
    notes: ['Élő szerződés; ismétlődő hibák után érdemes felülvizsgálni.'],
  },
  DefinitionOfDone: {
    definition: 'Egy megosztott minőségi és készesség-checklista, ami a „kész” fogalmát tesztelhetővé és konzisztenssé teszi.',
    notes: ['Gyenge DoD újramunkát és bizalomvesztést okoz.'],
  },
  BacklogItem: {
    definition: 'A Product Backlogban lévő munka/érték egység, amely érthető, tesztelhető és megfelelő méretű kell legyen.',
    notes: ['A backlog elem nem homályos ötlet; döntést kell támogatnia a szállításról.'],
  },
  AcceptanceCriteria: {
    definition: 'Konkrét feltételek, amelyek meghatározzák, mikor fogadható el egy backlog elem (tesztelhető kimenetelek és határok).',
    notes: ['A kritériumok csökkentik a kétértelműséget és a jó Sprint Planning alapjai.'],
  },
  SprintGoal: {
    definition: 'Egyetlen koherens cél, amely irányítja a sprintet és segít a kompromisszuszokban, ha scope nyomás van.',
    notes: ['Cél nélkül minden kérés „sürgős” lesz és összeomlik a fókusz.'],
  },
  WIP: {
    definition: 'Folyamatban lévő munka: elkezdett, de nem befejezett feladatok; a magas WIP csökkenti az átbocsátást és növeli a váltási költséget.',
    notes: ['A WIP limitek védik a flow-t és a fókuszt.'],
  },
  Facilitation: {
    definition: 'Csoportos beszélgetések megtervezése és irányítása egyértelmű kimenet felé (döntés, terv vagy tanulás).',
    notes: ['A facilitáció a kimenetekről szól, nem a beszédidőről.'],
  },
  CoachingMindset: {
    definition: 'Mások gondolkodásának és saját megoldásaik birtoklásának segítése kérdésekkel, reflexióval és visszajelzéssel a válaszok adása helyett.',
    notes: ['A coaching képességet épít; a megoldás függőséget.'],
  },
  Stakeholder: {
    definition: 'Bárki, akit a termék érint vagy aki befolyásolja a sikerét (ügyfelek, vezetés, szomszédos csapatok).',
    notes: ['A stakeholder nyomás valódi; a rendszernek csatornáznia kell anélkül, hogy összetörje a csapatot.'],
  },
  Experiment: {
    definition: 'Időkorlátos változtatás hipotézissel és méréssel, hogy megtudjuk, mi javítja az eredményeket.',
    notes: ['Ha nincs adat, vitákat kísérletekké alakíts.'],
  },
  FlowMetrics: {
    definition: 'Egy minimális mérőszám-készlet a flow, minőség és érték láthatóvá tételéhez (nem hiúság).',
    notes: ['Rossz metrikák játékozást, jók tanulást teremtenek.'],
  },
};

// Hungarian glossary for procedures (CCS-aligned).
const huProcedures: Record<string, { name: string; steps: string[] }> = {
  P1_ROLE_BOUNDARIES: {
    name: 'Szerep határok: mit csinálsz és mit nem',
    steps: [
      'Nevezd meg a kérést és, kié a döntés (PO / Developers / Stakeholder).',
      'Alakítsd át a kérést folyamatfejlesztési vagy facilitációs igénnyé.',
      'Ajánlj következő lépést, ami a tulajdonjogot a helyes helyen tartja (kérdések, napirend, döntési szabály).',
    ],
  },
  P2_PLANNING_AGENDA: {
    name: 'Sprint Planning napirend (cél → forecast → kockázatok → commitment nyelv)',
    steps: [
      'Állítsd be a célt és az időkeretet; erősítsd meg, mit jelent a „kész” (DoD).',
      'Fogalmazz meg egy Sprint Goal mondatot.',
      'Válassz elemeket a cél alapján; tisztázz az elfogadási kritériumokat és kockázatokat.',
      'Erősítsd meg a kapacitást és WIP-et; egyezz meg az első 24 órás tervben.',
      'Zárd: mi a cél, mi benne van, mi nincs benne.',
    ],
  },
  P3_DAILY_RESET: {
    name: 'Daily Scrum akadály-központú reset',
    steps: [
      'Ismételd meg a Sprint Goalt és a mai legfontosabb kimeneteket.',
      'Először az akadályok és függőségek (nem státusz).',
      'Egyezz meg 1–3 koordinációs döntésben (ki kivel beszél, meddig).',
      'Zárd WIP ellenőrzéssel és 24 órás fókusz elkötelezettséggel.',
    ],
  },
  P4_REVIEW_OUTCOMES: {
    name: 'Sprint Review értékre és tanulásra',
    steps: [
      'Nyisd meg a céllal és azzal, mit tanulni/szállítani terveztetek.',
      'Bemutató a működő kimenetekről; fogadd a stakeholder visszajelzést döntések/következő opciók formájában.',
      'Válaszd szét a kéréseket most / következő / később; védd a sprint határait.',
      'Zárd 3 ponttal: mit szállítottatok, mit tanultatok, merre tovább.',
    ],
  },
  P5_RETRO_ACTION: {
    name: 'Retrospective: panaszból mérhető akcióba',
    steps: [
      'Válassz egy témát (kerüld a „mindent”).',
      'Találd meg a gyökérokot (5 Mi vagy egyszerű ok-okozat).',
      'Fogalmazz meg egy akciót: tulajdonos + határidő + mérő/észlelhető jel.',
      'Tervezz follow-up ellenőrzést (következő retro).',
    ],
  },
  P6_WIP_POLICY: {
    name: 'WIP szabály: limit, reset, betartatás',
    steps: [
      'Határozz meg WIP limitet személyenként / csapat sávonként.',
      'Határozz meg stop-start szabályt, ha a limit túllépésre kerül.',
      'Heti felülvizsgálat: mi javult, mi romlott, állítsd a limitet.',
    ],
  },
  P7_CONFLICT_MEDIATION: {
    name: 'Konfliktusmediáció: pozíció → érdek → következő kísérlet',
    steps: [
      'Fogalmazd újra mindkét pozíciót semlegesen.',
      'Vond ki az érdekeket/korlátokat (miért számít mindkét oldalnak).',
      'Határozz meg döntési szabályt (adat, költség, kockázat, idő).',
      'Ha nincs adat: javasolj időkorlátos kísérletet mérővel.',
    ],
  },
  P8_METRICS_STARTER_PACK: {
    name: 'Metrika kóstoló: flow + minőség + érték',
    steps: [
      'Válassz 1 flow, 1 minőség, 1 érték és 1 egészség metrikát.',
      'Határozd meg, mi a jó (iránybeli célok, nem hiúság).',
      'Döntsd el a felülvizsgálati ritmust és, ki a tulajdonos.',
      'Írj szabályt: mit teszel, ha a metrika romlik.',
    ],
  },
  P9_HABIT_EXPERIMENT: {
    name: 'Új szokás bevezetése 2 hetes kísérletként',
    steps: [
      'Nevezd meg a tünetet és a kívánt kimenetet.',
      'Fogalmazz hipotézist: Ha X-et csinálunk, Y-t várunk, mert Z.',
      'Határozz meg egyszerű mérést és felülvizsgálati napot.',
      'Futtasd 2 hétig, majd tartsd/változtasd/állítsd le a bizonyíték alapján.',
    ],
  },
};

// Per-lesson Hungarian content (intent, goals, commonMistakes). Index = dayNumber - 1.
const huLessonContent: Array<{ intent: string; goals: string[]; commonMistakes: string[] }> = [
  { intent: 'Kezdőbiztos mentális modell a szerephez és PM/titkár anti-minták elkerülése.', goals: ['A Scrum Master munkájának gyakorlati leírása.', 'Felsorolni, amit nem te birtokolsz (termék és technikai döntések).', '3 anti-minta és a helyes reakció felismerése.'], commonMistakes: ['Projektmenedzserként viselkedni és scope döntéseket birtokolni.', 'A szerepet csak meeting ütemezésre redukálni.', '"Folyamat rendőr" lenni a kimenetek lehetővé tétele helyett.'] },
  { intent: 'A Scrum pozicionálása az Agile-en belül és az, ami kezdőknek számít.', goals: ['Az Agile gondolkodásmód és a Scrum keretrendszer megkülönböztetése.', 'Az empirizmus magyarázata visszajelzési hurokként.', 'Az "Agile = gyors" tévhit felismerése.'], commonMistakes: ['Az Agile-t sebességnek venni a tanulás helyett.', 'Címkéket használni viselkedésváltozás nélkül.'] },
  { intent: 'Egy oldalas Scrum-térkép a későbbi zavar csökkentésére.', goals: ['Minden esemény céljának és kimenetelének megnevezése.', 'Artefaktok feltérképezése a döntésekhez.', 'A Review és a Retro keverésének elkerülése.'], commonMistakes: ['Eseménycélok összekeverése.', 'A Scrumot checklistaként kezelni.'] },
  { intent: 'Csapatdinamika és biztonság bevezetése az őszinte megvizsgálás előfeltételeként.', goals: ['A pszichológiai biztonság gyakorlati meghatározása.', 'Dominancia/csend mintázatok felismerése.', '3 egyszerű csapat szabály megfogalmazása, ami növeli a biztonságot.'], commonMistakes: ['A biztonságot figyelmen kívül hagyni és "átláthatóságot" várni.', 'Egy hang dominanciáját megengedni a döntésekben.'] },
  { intent: 'A "kész" oktatása tesztelhető minőségként, nem érzésként; DoD v0.1 váz.', goals: ['Miért csökkenti a DoD az újramunkát.', 'DoD v0.1 vázlat készítése.', 'DoD hibamód felismerése egy szituációban.'], commonMistakes: ['"Kész"-nek nevezni tesztelhetőség nélkül.', 'Kivételeket megengedni, ami a normává válik.'] },
  { intent: 'Backlog elemek érthetővé és tesztelhetővé tétele, hogy a planning működjön.', goals: ['Minimális backlog elem kártya meghatározása.', 'Elfogadási kritériumok írása homályos kéréshez.', 'Kétértelműség felismerése és tisztázó kérdések.'], commonMistakes: ['Tisztázatlan elemekkel tervezni.', '"Csak csináld" kéréseket elfogadni kritériumok nélkül.'] },
  { intent: 'Refinement bevezetése kockázatcsökkentésként és tisztaságépítésként.', goals: ['30 perces refinement napirend készítése.', 'Egy nagy elem felbontása kisebb kimenetekre.', 'Kockázatok és ismeretlenek jelölése.'], commonMistakes: ['Refinement kihagyása és a költség a planningben.', 'Méretzés közös megértés nélkül.'] },
  { intent: 'Planning kimeneteinek oktatása és a fókusz védelme sprint céllal.', goals: ['Sprint cél mondat írása.', 'Elemek kiválasztása a cél alapján.', 'Scope nyomás kezelése összeomlás nélkül.'], commonMistakes: ['Planning bevásárlólistaként.', 'Lehetetlen scope-ban egyezni.'] },
  { intent: 'A daily átfordítása rövid resetként, ami koordinációt és fókuszt teremt.', goals: ['Akadály-központú daily lebonyolítása.', '1–3 koordinációs döntés előállítása.', 'Időkeret betartása értékvesztés nélkül.'], commonMistakes: ['A daily menedzsernek való jelentéssé válik.', 'Nincs döntés; csak beszéd.'] },
  { intent: 'WIP oktatása mint a legegyszerűbb kezdő emelő a szállítás javítására.', goals: ['WIP és váltási költség meghatározása.', 'WIP szabály megállapítása.', 'Stop-start alkalmazása, ha a limit túllépésre kerül.'], commonMistakes: ['Mindenki mindent elkezd.', 'Senki nem fejez be.'] },
  { intent: 'Facilitáció alapok a végtelen meetingek elkerülésére.', goals: ['Meeting kimenet meghatározása.', 'Döntési szabály választása.', '15 perces mini-workshop megtervezése.'], commonMistakes: ['Meetingek kimenet nélkül.', 'Döntések a leghangosabb hang alapján.'] },
  { intent: 'A review oktatása tanulásként a stakeholderekkel és jövőbeli iránnyal.', goals: ['Review napirend megtervezése.', 'Visszajelzés átfordítása opciókká.', 'Sprint határok védelme reaktivitás mellett.'], commonMistakes: ['A review státuszjelentéssé válik.', 'A visszajelzés scope creep triage nélkül.'] },
  { intent: 'A retro oktatása egy mérhető javulással tulajdonossal és mérővel.', goals: ['Egy téma kiválasztása.', 'Gyökérok megtalálása.', 'Egy mérhető akciópont megírása.'], commonMistakes: ['Ugyanazok a panaszok minden sprintben.', 'Nincs follow-up.'] },
  { intent: 'Kezdők felkészítése konfliktus mediálásra és tulajdonjog határok védelmére.', goals: ['Pozíciók átfordítása érdekekké.', 'Döntési szabály használata.', 'De-eskaláció tulajdonjog átvétel nélkül.'], commonMistakes: ['Oldalt választani.', 'A döntéshozóvá válni.'] },
  { intent: 'Egyszerű lépés: véleményháborúk átfordítása kísérletekké.', goals: ['Felismerni, ha hiányzik az adat.', 'Hipotézis írása.', 'Mérő és felülvizsgálati nap meghatározása.'], commonMistakes: ['Adat nélkül vitatkozni.', 'Változtatásokat mérés nélkül futtatni.'] },
  { intent: 'Minimális metrikák a valóság láthatóvá tételére játékozás nélkül.', goals: ['4 induló metrika kiválasztása.', 'Felülvizsgálati ritmus meghatározása.', 'Meghatározni, mit teszel, ha romlik.'], commonMistakes: ['Metrikákat büntetésként használni.', 'Hiúság metrikákat választani.'] },
  { intent: 'Átállás a "javításról" a csapat képességének és tulajdonjogának építésére.', goals: ['Coaching kérdések használata.', 'Mentési viselkedés elkerülése.', 'Csapat tulajdonjog növelése a megoldások felett.'], commonMistakes: ['Válaszokat adni, hogy hasznosnak tűnj.', 'Függőséget teremteni a Scrum Master iránt.'] },
  { intent: 'Kiszámítható kommunikáció a káosz és megszakítások csökkentésére.', goals: ['Kulcs stakeholderek feltérképezése.', 'Ritmus meghatározása.', 'Bypass és "sürgős" csatornák kezelése.'], commonMistakes: ['Minden pingre reagálni.', 'Stakeholderek bypassját megengedni.'] },
  { intent: 'A változás biztonságossá tétele időkorlátozással és kimenet mérésével.', goals: ['Hipotézis írása.', 'Mérés választása.', 'Ellenállás kezelése bizonyítékkal.'], commonMistakes: ['Változást parancsként bevezetni.', 'Mérés és tanulás nélkül.'] },
  { intent: 'A rendszer alkalmazkodtatása remote valósághoz (energia, figyelem, időzónák).', goals: ['Remote meeting szabályok meghatározása.', 'Daily áttervezése remote-ra.', 'Multitasking és drift csökkentése.'], commonMistakes: ['Kamera nélküli csend.', 'Meetingek húzódása bevonás nélkül.'] },
  { intent: 'Skálázási kontextus jelek mély keretrendszer oktatás nélkül.', goals: ['Skálázási jelek megnevezése.', 'Elő idő keretrendszer adoptálás elkerülése.', 'Első javítási lépés választása.'], commonMistakes: ['SAFe-et alap higiénia problémák megoldásaként.', 'Meetingek skálázása kimenetek helyett.'] },
  { intent: 'Scrum minták átültetése szoftveren túli kontextusba.', goals: ['5 különbség és 5 invariáns megnevezése.', 'Nem-IT folyamat backlogolása.', 'Elfogadási kritériumok meghatározása nem-IT kontextusban.'], commonMistakes: ['"Nem IT vagyunk" kifogásként.', 'Nincs tesztelhetőség a kimenetekben.'] },
  { intent: 'Biztonságos lépések ismeretlenekre bizonytalanság nélkül.', goals: ['Spike kimenet meghatározása.', 'Discovery időkorlátozása.', 'Építés tanulás nélkül megakadályozása.'], commonMistakes: ['A discovery scope creep lesz.', 'Tanulás előtt építeni.'] },
  { intent: 'Nem-technikus kezdőknek a megfelelő kérdések a minőség védelmére.', goals: ['CI/CD és tesztekről kérdezni.', 'Minőségi adósság tünetek felismerése.', 'DoD javítási kérdéssor összeállítása.'], commonMistakes: ['Minőség témákat "technikaiként" kerülni.', 'Krónikus hibákat normálisként elfogadni.'] },
  { intent: 'Board higiénia és szabályok, amelyek a flow-t támogatják, nem kosmetikát.', goals: ['Board szabályok meghatározása.', 'Státuszok igazítása valós állapotokhoz.', 'WIP szabály a boardon.'], commonMistakes: ['Board dekorációként.', 'Státuszok jelentéktelenek.'] },
  { intent: 'Előrehaladás mérhetővé tétele: hatás, nem admin munka.', goals: ['90 napos junior terv meghatározása.', '3 mérhető kompetencia kiválasztása.', '"Senior = több meeting" mítosz elkerülése.'], commonMistakes: ['Szenioritást tekintélynek venni.', 'Nincs mérhető hatás.'] },
  { intent: 'Kezdők felkészítése konkrét intervenciókra és kimenetekre szólásra.', goals: ['Strukturált válasz minta használata.', '2 példaválasz megadása.', 'Csak elmélet válaszok elkerülése.'], commonMistakes: ['Csak definíciók, nincs intervenció.', 'Vádaskodás a tanulás helyett.'] },
  { intent: 'Csapat integritás védelme; tudni, mikor mondani nemet nem-Scrum kérésekre.', goals: ['Határátlépések felismerése.', '3 "nem" szöveg használata.', 'Alternatíva ajánlása, ami megőrzi a kimeneteket.'], commonMistakes: ['Mindennek igent mondani.', 'A sürgősség felülírja az integritást.'] },
  { intent: 'Gyakori hibamódok és a helyes intervenciós lépések összefoglalása.', goals: ['12 vizsga szcenárió áttekintése.', 'Válasz vázlatok készítése.', 'Személyes gyenge területek felismerése.'], commonMistakes: ['A vizsgát recall-ként kezelni.', 'Kontextus és tulajdonjog figyelmen kívül hagyása.'] },
  { intent: 'Személyes playbook v1 és 90 napos terv; zárás a tanúsítvány útvonallal.', goals: ['Playbook v1 összeállítása.', 'Következő mélyítési irányok választása.', 'Tanúsítvány befejezés és megosztás tervezése.'], commonMistakes: ['Befejezés rendszer nélkül.', 'Nincs follow-up terv.'] },
];

function buildFullLessonContent(
  day: number,
  ccsLesson: CanonicalLesson,
  huLesson: { intent: string; goals: string[]; commonMistakes: string[] },
  titleHu: string
): { content: string; emailSubject: string; emailBody: string } {
  const conceptBlocks: string[] = [];
  for (const key of ccsLesson.requiredConcepts || []) {
    const c = huConcepts[key];
    if (c) {
      conceptBlocks.push(`<strong>${key}</strong>: ${c.definition}${c.notes?.length ? ' ' + c.notes.join(' ') : ''}`);
    }
  }
  const procedureBlocks: string[] = [];
  for (const id of ccsLesson.requiredProcedures || []) {
    const p = huProcedures[id];
    if (p) {
      procedureBlocks.push(`<strong>${p.name}</strong><ol>${p.steps.map((s) => `<li>${s}</li>`).join('')}</ol>`);
    }
  }
  const sections: string[] = [
    `<h1>${titleHu}</h1>`,
    `<p><em>${huLesson.intent}</em></p>`,
    `<hr /><h2>Napi célok</h2><ul>${huLesson.goals.map((g) => `<li>${g}</li>`).join('')}</ul>`,
    `<hr /><h2>Miért fontos</h2><p>${huLesson.intent}</p>`,
  ];
  if (conceptBlocks.length) sections.push(`<hr /><h2>Fogalmak</h2><ul>${conceptBlocks.map((b) => `<li>${b}</li>`).join('')}</ul>`);
  if (procedureBlocks.length) sections.push(`<hr /><h2>Eljárások</h2>${procedureBlocks.join('')}`);
  sections.push(`<hr /><h2>Gyakori hibák (kerüld)</h2><ul>${huLesson.commonMistakes.map((m) => `<li>${m}</li>`).join('')}</ul>`);
  sections.push(`<hr /><h2>Összefoglaló</h2><p>Ma: ${huLesson.goals.slice(0, 2).join('; ')}.</p>`);
  sections.push(`<hr /><h2>Akció</h2><p>Alkalmazd a mai fogalmakat és eljárásokat egy konkrét szituációban (csapat, sprint vagy stakeholder).</p>`);
  const content = sections.join('\n');
  const emailSubject = `ScrumMaster leszek 2026 — ${day}. nap: ${titleHu}`;
  const emailBody = `<h1>ScrumMaster leszek 2026</h1><h2>${day}. nap: ${titleHu}</h2><p>${huLesson.intent}</p><p><a href="{{appUrl}}/courses/${COURSE_ID}/day/${day}">Olvasd el a teljes leckét →</a></p>`;
  return { content, emailSubject, emailBody };
}

function buildLessonStub(day: number, title: string): { content: string; emailSubject: string; emailBody: string } {
  const content = [
    `<h1>${title}</h1>`,
    `<p><em>Kurzussablon (vázlat). A tartalom a CCS és az outline alapján kerül kidolgozásra.</em></p>`,
    `<hr />`,
    `<h2>Napi cél</h2>`,
    `<ul><li>Konkrét kimenet elkészítése (dokumentum/szabály/agenda)</li></ul>`,
    `<hr />`,
    `<h2>Fő tartalom</h2>`,
    `<p>Vázlat. (A végleges változatnak át kell mennie a minőség auditon: score >= 70.)</p>`,
    `<hr />`,
    `<h2>Akció</h2>`,
    `<p>Vázlat. (Konkrét feladat, amit a tanuló elvégez ma.)</p>`,
  ].join('\n');

  const emailSubject = `ScrumMaster leszek 2026 — ${day}. nap: ${title}`;
  const emailBody = [
    `<h1>{{courseName}}</h1>`,
    `<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>`,
    `<div>{{lessonContent}}</div>`,
    `<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`,
  ].join('\n');

  return { content, emailSubject, emailBody };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment');
  }

  const dbName = process.env.DB_NAME || 'amanoba';

  const canonicalRaw = readFileSync(CANONICAL_JSON_PATH, 'utf8');
  const canonical = JSON.parse(canonicalRaw) as Canonical;

  const courseName = canonical.courseName || 'ScrumMaster leszek 2026';
  const courseDescription =
    '30 napos, teljesen kezdő “kóstoló” a Scrum Master szerephez: a legfontosabb Agile/Scrum alapok, meeting mastery, csapatdinamika, facilitation, alap metrikák és stakeholder kezelés. A cél, hogy biztonságosan belépj a szerepbe, és a végén Amanoba tanúsítványt szerezz bizonyítható track recordként.';

  const plan = {
    apply: APPLY,
    includeLessons: INCLUDE_LESSONS,
    fullLessons: FULL_LESSONS,
    activate: ACTIVATE,
    dbName,
    ccsId: CCS_ID,
    courseId: COURSE_ID,
    courseName,
    language: 'hu',
    requiresPremium: false,
    certificationEnabled: true,
  };

  if (!APPLY) {
    console.log('DRY RUN (no DB writes). Plan:\n', JSON.stringify(plan, null, 2));
    console.log(`Would read: ${CANONICAL_JSON_PATH}`);
    const lessonNote = FULL_LESSONS ? ' + 30 full lessons (CCS + HU glossary)' : INCLUDE_LESSONS ? ' + 30 inactive lesson stubs' : '';
    console.log('Would create/update CCS + course' + lessonNote + (ACTIVATE ? ' and activate course + lessons' : ''));
    return;
  }

  await mongoose.connect(uri, { dbName });

  // Brand
  let brand = await Brand.findOne({ name: 'Amanoba', isActive: true });
  if (!brand) {
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      isActive: true,
      themeColors: {
        primary: '#000000',
        secondary: '#374151',
        accent: process.env.NEXT_PUBLIC_THEME_COLOR || '#FAB908',
      },
      allowedDomains: ['amanoba.com', 'www.amanoba.com'],
      supportedLanguages: ['hu', 'en'],
      defaultLanguage: 'hu',
    });
  }

  // CCS (DB)
  const ccs = await CCS.findOneAndUpdate(
    { ccsId: CCS_ID },
    {
      $set: {
        ccsId: CCS_ID,
        name: courseName,
        idea: `# ${courseName}\n\n(Kurzuskoncepció lásd run log és canonical CCS.)`,
        outline: `# ${courseName} — 30 napos outline\n\n(A részletes outline lásd: docs/course_runs/* és a canonical CCS.)`,
      },
    },
    { upsert: true, new: true }
  );

  // Course (DB)
  const courseActive = ACTIVATE && (FULL_LESSONS || INCLUDE_LESSONS);
  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      $set: {
        courseId: COURSE_ID,
        name: courseName,
        description: courseDescription,
        language: 'hu',
        durationDays: 30,
        isActive: courseActive,
        requiresPremium: false,
        brandId: brand._id,
        ccsId: ccs.ccsId,
        pointsConfig: { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
        xpConfig: { completionXP: 500, lessonXP: 25 },
        certification: {
          enabled: true,
          // IMPORTANT: no pricePoints / priceMoney => entitlementRequired=false (free certificate access policy)
        },
      },
    },
    { upsert: true, new: true }
  );

  const lessonActive = ACTIVATE;
  if (FULL_LESSONS && canonical.lessons?.length) {
    for (const ccsLesson of canonical.lessons) {
      const day = ccsLesson.dayNumber;
      const huLesson = huLessonContent[day - 1];
      const titleHu = lessonTitlesHu.find((t) => t.day === day)?.title ?? ccsLesson.canonicalTitle;
      if (!huLesson) continue;
      const { content, emailSubject, emailBody } = buildFullLessonContent(day, ccsLesson, huLesson, titleHu);
      const lessonId = `${COURSE_ID}_DAY_${String(day).padStart(2, '0')}`;
      await Lesson.findOneAndUpdate(
        { lessonId },
        {
          $set: {
            lessonId,
            courseId: course._id,
            dayNumber: day,
            language: 'hu',
            title: titleHu,
            content,
            emailSubject,
            emailBody,
            pointsReward: 10,
            xpReward: 5,
            isActive: lessonActive,
            displayOrder: day,
            quizConfig: {
              enabled: true,
              successThreshold: 70,
              questionCount: 5,
              poolSize: 7,
              required: true,
            },
          },
        },
        { upsert: true, new: true }
      );
    }
  } else if (INCLUDE_LESSONS) {
    for (const entry of lessonTitlesHu) {
      const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
      const stub = buildLessonStub(entry.day, entry.title);

      await Lesson.findOneAndUpdate(
        { lessonId },
        {
          $set: {
            lessonId,
            courseId: course._id,
            dayNumber: entry.day,
            language: 'hu',
            title: entry.title,
            content: stub.content,
            emailSubject: stub.emailSubject,
            emailBody: stub.emailBody,
            pointsReward: 10,
            xpReward: 5,
            isActive: lessonActive,
            displayOrder: entry.day,
            quizConfig: {
              enabled: true,
              successThreshold: 70,
              questionCount: 5,
              poolSize: 7,
              required: true,
            },
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  console.log(
    '✅ Seed applied:',
    JSON.stringify(
      { ccsId: ccs.ccsId, courseId: course.courseId, includeLessons: INCLUDE_LESSONS, fullLessons: FULL_LESSONS, activated: ACTIVATE },
      null,
      2
    )
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

