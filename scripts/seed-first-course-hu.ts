/**
 * Seed First Course (HU)
 *
 * What: Creates a Hungarian 30-day AI course with 30 lessons
 * Why: Provide visible course content on the website
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'AI_30_NAP';
const COURSE_NAME = 'AI 30 Nap – mindennapi munkában';
const COURSE_DESCRIPTION = '30 napos, gyakorlati AI-kurzus. Napi 10–15 perces feladatokkal segít beépíteni az AI-t a munkádba.';

const lessonPlan = [
  {
    day: 1,
    title: 'AI alapok és biztonságos használat',
    goal: 'Értsd meg, mire jó az AI a napi munkában, és hogyan használd biztonságosan.',
    task: 'Írj le 3 feladatot, amit a héten gyorsítanál AI-val.',
    prompt: 'Adj 5 gyakorlati AI-használati példát irodai munkához. Legyen rövid, pontokba szedett válasz.',
    tip: 'Ne ossz meg személyes, pénzügyi vagy üzleti titkos adatot.'
  },
  {
    day: 2,
    title: 'Prompt alapok: cél + kontextus + forma',
    goal: 'Tanuld meg a jó prompt felépítését.',
    task: 'Fogalmazz meg egy promptot, ami egy professzionális emailt kér tőled.',
    prompt: 'Írj udvarias, rövid emailt időpont-egyeztetéshez. Kontextus: 30 perces online meeting jövő hét kedden 10:00-kor. Stílus: üzleti.',
    tip: 'Mindig add meg a célt, a kontextust és az elvárt formát.'
  },
  {
    day: 3,
    title: 'Iteráció és pontosítás',
    goal: 'Lásd, hogyan javul a válasz, ha finomítod a promptot.',
    task: 'Futtasd le ugyanazt a promptot két módosítással (rövidebben + konkrétabb stílusban).',
    prompt: 'Adj 3 alternatív változatot ugyanarra a válaszra, formázott listában.',
    tip: 'Kérj példákat, hosszkorlátot és hangnemet.'
  },
  {
    day: 4,
    title: 'Összefoglalás és kivonatolás',
    goal: 'Hosszú szövegből rövid, használható összegzés készítése.',
    task: 'Másolj be egy hosszabb szöveget és kérj 5 pontos összegzést.',
    prompt: 'Összegzed 5 pontban, és írj 1 mondatos döntési javaslatot. Max 120 szó.',
    tip: 'Adj meg hosszkorlátot és kért formátumot.'
  },
  {
    day: 5,
    title: 'Email gyorsírás és variációk',
    goal: 'Gyors, profi email-változatok készítése.',
    task: 'Készíts 2 verziót: hivatalos és barátságos.',
    prompt: 'Írj 2 változatot ugyanarra az emailre: 1) hivatalos 2) barátságos. Tárgy: határidő csúszás bejelentése.',
    tip: 'Kérj két hangnemet ugyanarra a tartalomra.'
  },
  {
    day: 6,
    title: 'Meeting jegyzetből összefoglaló',
    goal: 'Nyers jegyzetekből strukturált összefoglaló készítése.',
    task: 'Adj meg 5-10 sor meeting jegyzetet, és kérj Action items listát.',
    prompt: 'Készíts rövid összefoglalót és teendőlistát felelőssel, határidővel.',
    tip: 'Kérj külön "Döntések" és "Teendők" szekciót.'
  },
  {
    day: 7,
    title: 'Stílusváltás és szerkesztés',
    goal: 'Szöveg átírása rövidebbre vagy más stílusba.',
    task: 'Írj át egy bekezdést 50%-kal rövidebbre.',
    prompt: 'Rövidítsd a szöveget 50%-kal, de tartsd meg a lényeget és a hangnemet.',
    tip: 'Kérj 3 kulcspontot is.'
  },
  {
    day: 8,
    title: 'Ötletelés és brainstorming',
    goal: 'Gyors ötletgyűjtés egy témára.',
    task: 'Kérj 10 ötletet egy kampányhoz vagy projektindításhoz.',
    prompt: 'Adj 10 kreatív ötletet a témára, csoportosítsd őket témák szerint.',
    tip: 'Kérd, hogy a javaslatok ne legyenek hasonlóak egymáshoz.'
  },
  {
    day: 9,
    title: 'Döntéstámogatás: pro/kontra',
    goal: 'Opciók összehasonlítása és érvek gyűjtése.',
    task: 'Hasonlíts össze két eszközt vagy megoldást.',
    prompt: 'Készíts pro/kontra táblázatot A és B opcióról, rövid indoklással.',
    tip: 'Kérj súlyozást is a szempontokra.'
  },
  {
    day: 10,
    title: 'Strukturálás táblázatba',
    goal: 'Szöveges lista átalakítása táblázattá.',
    task: 'Készíts 5 feladatot és kérj táblázatot felelőssel, határidővel.',
    prompt: 'Alakítsd táblázattá: Feladat | Felelős | Határidő.',
    tip: 'Kérj CSV formátumot, ha exportálni szeretnéd.'
  },
  {
    day: 11,
    title: 'Prioritás és időbeosztás',
    goal: 'Feladatok priorizálása és fókusz meghatározása.',
    task: 'Írj le 8 feladatot és kérj Eisenhower-besorolást.',
    prompt: 'Rendezd 4 kvadránsba a feladatokat (sürgős/fontos).',
    tip: 'Kérj napi 3 fókuszfeladatot.'
  },
  {
    day: 12,
    title: 'Projektterv vázlat',
    goal: 'Gyors projektvázlat készítése.',
    task: 'Készíts 5-7 lépéses tervet egy új projekthez.',
    prompt: 'Írj 5-7 lépéses projekttervet mérföldkövekkel és becsült idővel.',
    tip: 'Add meg az erőforrásigényeket is.'
  },
  {
    day: 13,
    title: 'Kockázatelemzés',
    goal: 'Lehetséges kockázatok feltárása és kezelése.',
    task: 'Kérj 5 kockázatot és mitigációs javaslatot.',
    prompt: 'Adj 5 kockázat-mitigáció párost valószínűség és hatás skálával.',
    tip: 'Kérj "kritikus kockázatok" listát is.'
  },
  {
    day: 14,
    title: 'Ügyfélkommunikáció és válasz sablonok',
    goal: 'Empatikus, tiszta ügyfélválaszok készítése.',
    task: 'Készíts 3 válasz verziót különböző hangnemben.',
    prompt: 'Írj rövid, empatikus választ egy késés miatt reklamáló ügyfélnek.',
    tip: 'Mindig javasolj következő lépést.'
  },
  {
    day: 15,
    title: 'Marketing pitch és értékajánlat',
    goal: 'Rövid, ütős pitch megfogalmazása.',
    task: 'Készíts 3 pitch verziót különböző stílusban.',
    prompt: 'Fogalmazz 3 rövid értékajánlatot (1-2 mondat) a termékhez.',
    tip: 'Kérj egyetlen "tagline"-t is.'
  },
  {
    day: 16,
    title: 'Kutatási kérdések és források',
    goal: 'Jó kutatási kérdések és források azonosítása.',
    task: 'Írj 10 kutatási kérdést a témádhoz.',
    prompt: 'Adj 10 kutatási kérdést és javasolj 5 forrást a témához.',
    tip: 'Kérj priorizálást fontosság szerint.'
  },
  {
    day: 17,
    title: 'Tanulási jegyzet és mini teszt',
    goal: 'Anyagból gyors tanulókártyák készítése.',
    task: 'Készíts 5 kérdés-válasz kártyát.',
    prompt: 'Készíts 5 Q/A kártyát és 1 mini tesztet 5 kérdéssel.',
    tip: 'Kérj rövid, egyértelmű válaszokat.'
  },
  {
    day: 18,
    title: 'Minőségellenőrzés és checklist',
    goal: 'Ellenőrző lista készítése a hibák megelőzésére.',
    task: 'Kérj 10 pontos checklistet a feladatodhoz.',
    prompt: 'Írj 10 pontos checklistet és 5 tipikus hibát (piros zászlókat).',
    tip: 'Használd a checklistet publikálás előtt.'
  },
  {
    day: 19,
    title: 'Prezentáció vázlat',
    goal: 'Prezentáció gyors strukturálása.',
    task: 'Készíts 10 slide-os vázlatot.',
    prompt: 'Készíts 10 slide vázlatot címmel és 1 mondatos üzenettel.',
    tip: 'Kérj nyitó és záró üzenetet.'
  },
  {
    day: 20,
    title: 'KPI és OKR megfogalmazás',
    goal: 'Mérhető célok megadása.',
    task: 'Írj 1 Objective + 3 Key Results példát.',
    prompt: 'Készíts OKR-t egy 3 hónapos projektre.',
    tip: 'Kérj metrika definíciókat is.'
  },
  {
    day: 21,
    title: 'Esettanulmány összegzés',
    goal: 'Esettanulmány lényegének kiemelése.',
    task: 'Foglalj össze 1 esettanulmányt 5 pontban.',
    prompt: 'Készíts rövid összefoglalót: Mi működött? Mi nem? Fő tanulságok.',
    tip: 'Kérj 3 alkalmazható tanulságot.'
  },
  {
    day: 22,
    title: 'Interjúkérdések és értékelés',
    goal: 'Strukturált interjúkérdések készítése.',
    task: 'Készíts 10 kérdést és értékelési szempontokat.',
    prompt: 'Írj 10 interjúkérdést (5 szakmai, 5 soft skill) és értékelési pontokat.',
    tip: 'Kérj "mit keresünk a válaszban" listát.'
  },
  {
    day: 23,
    title: 'Álláshirdetés megfogalmazása',
    goal: 'Vonzo álláshirdetés írása.',
    task: 'Készíts 2 verziót (rövid és részletes).',
    prompt: 'Írj álláshirdetést: rövid bevezető, feladatok, elvárások, előnyök.',
    tip: 'Kérj bullet pointokat az előnyökhöz.'
  },
  {
    day: 24,
    title: 'Műszaki specifikáció vázlat',
    goal: 'Specifikáció gyors összerakása.',
    task: 'Készíts vázlatot scope-pal és kizárásokkal.',
    prompt: 'Készíts specifikáció vázlatot: cél, scope, funkcionalitás, nem része.',
    tip: 'Kérj mérhető elfogadási kritériumokat.'
  },
  {
    day: 25,
    title: 'Hibakeresési terv',
    goal: 'Hibakeresési lépések strukturálása.',
    task: 'Állíts fel 5 lépéses hibaelhárítási tervet.',
    prompt: 'Adj 5 lépést hibaelhárításhoz, logolás és reprodukció részletekkel.',
    tip: 'Kérj ellenőrző kérdéseket is.'
  },
  {
    day: 26,
    title: 'AI etikett és adatvédelem',
    goal: 'Biztonságos, etikus AI-használat.',
    task: 'Fogalmazz meg 5 irányelvet a csapatodnak.',
    prompt: 'Készíts 5 adatvédelmi és etikai irányelvet AI használathoz.',
    tip: 'Adj példát tiltott adatokra.'
  },
  {
    day: 27,
    title: 'Saját prompt könyvtár',
    goal: 'Ismételhető prompt sablonok gyűjtése.',
    task: 'Írj 5 prompt sablont a saját munkádhoz.',
    prompt: 'Adj 5 prompt sablont, rövid leírással és használati céllal.',
    tip: 'Kategorizáld a sablonokat.'
  },
  {
    day: 28,
    title: 'Napi AI workflow kialakítása',
    goal: '10 perces napi rutin kialakítása.',
    task: 'Állíts össze napi 3 lépést a saját rutinodra.',
    prompt: 'Írj 10 perces napi AI rutin tervet reggeli és esti változattal.',
    tip: 'Kezdj kicsiben: 1-2 feladattal naponta.'
  },
  {
    day: 29,
    title: 'Mérés és visszacsatolás',
    goal: 'Mérőszámok kijelölése és követés.',
    task: 'Írj 3 mérőszámot, amivel a fejlődést méred.',
    prompt: 'Adj 3 mérőszámot és heti review sablont a fejlődés méréséhez.',
    tip: 'Kérj egyszerű, számszerű mutatókat.'
  },
  {
    day: 30,
    title: '30 napos akcióterv és következő lépések',
    goal: 'Önálló akcióterv készítése a folytatáshoz.',
    task: 'Készíts 4 hetes akciótervet a következő hónapra.',
    prompt: 'Írj 4 hetes akciótervet heti célokkal és heti fókuszfeladattal.',
    tip: 'Válassz 3 készséget, amit tovább fejlesztesz.'
  }
];

function buildLessonContent(entry: typeof lessonPlan[number]) {
  return [
    '<h2>Napi cél</h2>',
    `<p>${entry.goal}</p>`,
    '<h2>Gyakorlat</h2>',
    '<ul>',
    `<li>${entry.task}</li>`,
    '</ul>',
    '<h2>Prompt minta</h2>',
    `<blockquote>${entry.prompt}</blockquote>`,
    `<p><strong>Tipp:</strong> ${entry.tip}</p>`
  ].join('');
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://amanoba.com';

  await mongoose.connect(mongoUri);

  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified gamification platform',
      logo: '🎮',
      themeColors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        accent: '#a855f7'
      },
      allowedDomains: ['amanoba.com', 'localhost'],
      supportedLanguages: ['hu', 'en'],
      defaultLanguage: 'hu',
      isActive: true,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      $set: {
        courseId: COURSE_ID,
        name: COURSE_NAME,
        description: COURSE_DESCRIPTION,
        language: 'hu',
        durationDays: 30,
        isActive: true,
        requiresPremium: false,
        brandId: brand._id,
        pointsConfig: {
          completionPoints: 1000,
          lessonPoints: 50,
          perfectCourseBonus: 500
        },
        xpConfig: {
          completionXP: 500,
          lessonXP: 25
        },
        metadata: {
          category: 'ai',
          difficulty: 'beginner',
          estimatedHours: 7,
          tags: ['ai', 'productivity', 'workflows'],
          instructor: 'Amanoba'
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  for (const entry of lessonPlan) {
    const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
    const content = buildLessonContent(entry);
    const emailSubject = '{{courseName}} – {{dayNumber}}. nap: {{lessonTitle}}';
    const emailBody = [
      `<h1>{{courseName}}</h1>`,
      `<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>`,
      '<div>{{lessonContent}}</div>',
      `<p><a href="${appUrl}/courses/${COURSE_ID}/day/${entry.day}">Megnyitom a leckét</a></p>`
    ].join('');

    await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: entry.day,
          language: 'hu',
          title: entry.title,
          content,
          emailSubject,
          emailBody,
          pointsReward: course.pointsConfig.lessonPoints,
          xpReward: course.xpConfig.lessonXP,
          isActive: true,
          displayOrder: entry.day,
          metadata: {
            promptTemplate: entry.prompt,
            task: entry.task,
            tags: ['ai', 'napi-gyakorlat']
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('✅ First course seeded:', COURSE_ID);
  console.log(`✅ Lessons upserted: ${lessonPlan.length}`);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
