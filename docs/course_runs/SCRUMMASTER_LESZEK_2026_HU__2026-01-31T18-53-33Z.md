# Run Log — SCRUMMASTER_LESZEK_2026_HU — “ScrumMaster leszek 2026” (HU, 30-day, free)

- Started (UTC): 2026-01-31T18:53:33Z
- Environment: **production** (`.env.local`, MongoDB Atlas, dbName=`amanoba`)
- Scope: New CCS + one language variant course (HU)

## Safety Rollback Plan (mandatory before any DB write)
- Lesson restore:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`
- Quiz restore:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`

## Outputs
- Tasklist: `docs/tasklists/SCRUMMASTER_LESZEK_2026_HU__2026-01-31T18-53-33Z.md`

## Phase A — Prereqs & scope (no DB writes)

- IDs confirmed (layout_grammar convention):
  - `CCS_ID = SCRUMMASTER_LESZEK_2026`
  - `COURSE_ID = SCRUMMASTER_LESZEK_2026_HU`
- Defaults confirmed:
  - Production (`.env.local`) → MongoDB Atlas dbName=`amanoba`
  - 30-day parent course
  - Free (`requiresPremium=false`)
  - Quizzes required (SSOT gates)
- Audience: complete beginner, Hungarian

## Phase B — Course idea (HU) — Draft v1

### 1) Kinek szól?
Teljes kezdőknek, akik 2026-ban szeretnének Scrum Masterként elindulni: még nem dolgoztak agilis csapatban, és nem tudják, hogyan néz ki a szerep a gyakorlatban (meetingek, backlog, csapatszokások, konfliktusok, mérőszámok, stakeholder kezelés).

### 2) Mit ígér (mérhető eredmény a 30. nap végére)?
A 30. nap végére a tanuló képes lesz:
- levezetni egy **alap Scrum ritmust** (Sprint Planning, Daily, Review, Retro) konkrét menetrenddel, kérdéslistákkal és döntési pontokkal,
- felépíteni egy **csapatműködési alapcsomagot** (Working Agreement + Definition of Done + basic metric set),
- felismerni és kezelni a leggyakoribb **kezdő hibákat** (mikromenedzsment, “meeting gyártás”, hamis agilisság, túl sok WIP, elmosódó felelősségek),
- megtervezni és facilitálni 3 tipikus “éles” helyzetet:
  1) széteső Daily,
  2) konfliktus a Product Owner és a fejlesztők között,
  3) “minden sürgős” és nincs fókusz.

### 3) Miért más, mint egy generikus “Agile bevezető”?
- **Gyakorlat-first**: minden nap van konkrét “kimenet” (dokumentum, menetrend, sablon, döntési logika).
- **Szituációs tanulás**: a kvíz kérdések mindig valós csapathelyzetből indulnak (0 recall, alkalmazás-központú).
- **2026-os fókusz**: remote/hybrid, stakeholder zaj, gyors változás, “AI/automatizálás a csapatfolyamatban” (csak annyira, amennyire Scrum Masterként releváns).

### 3.1 “Kóstoló az agilis óceánból” (pozicionálás)
Ez nem egy “mély, csak Scrum” képzés első körben, hanem egy **biztonságos belépő**:
- Megkóstolsz mindent, amivel Scrum Masterként 2026-ban találkozol (Scrum alapok + csapatdinamika + facilitation + PO/Dev együttműködés + alap metrikák + stakeholder kommunikáció + alap eszközök).
- Minden témából annyit kapsz, hogy tudj **dolgozni és dönteni**, ne csak definíciókat ismételni.
- A 30 nap végére kapsz egy “alap csomagot”, amivel magabiztosan belépsz a szerepbe, és tudod, merre mélyíts tovább.

### 4) Mit NEM vállal (non-goals)
- Nem ígér hivatalos minősítést vagy vizsgagaranciát.
- Nem helyettesít több hónap valódi csapat-tapasztalatot; cél az “első 90 nap” biztonságos megkezdése.
- Nem mélyül el extrém mértékben skálázási keretrendszerekben (SAFe/LeSS stb.) — csak kontextus szinten.

### 5) Tanúsítvány / bizonyítható track record (Amanoba fókusz)
A kurzus célja, hogy a tanuló a végén **Amanoba tanúsítványt** tudjon megszerezni és megosztani.
- A tanúsítvány üzleti célja: **megosztható, ellenőrizhető bizonyíték** → “proven track record” → organikus terjedés.
- A tanúsítvány megszerzésének előfeltételei: 30/30 lecke + 30/30 kvíz siker, majd final exam (platform szabályai szerint).

### 5.1 Fontos nyitott kérdés (platform constraint)
Jelenlegi rendszerben a final exam indításához **CertificateEntitlement** kell.
Free kurzus esetén is dönteni kell: a tanúsítvány hozzáférés legyen
- ingyenes (ehhez új entitlement-stratégia vagy automatikus entitlement kell), vagy
- pontokért (requires `course.certification.pricePoints > 0`), vagy
- pénzért (requires `course.certification.priceMoney`).

---

## Phase C — 30 napos “kóstoló” outline (HU) — Draft v1 (Day 1–30)

Formátum: minden nap konkrét **kimenettel** (dokumentum / döntési szabály / meeting terv). A kvízekhez minden nap adunk 2–3 tipikus “éles” szituációt, amiből scenario-alapú kérdések készíthetők (0 recall).

### 1. hét — Alapok + szerep (biztonságos belépő)
**Day 1 — Mi az a Scrum Master 2026-ban? (és mi nem)**
- Kimenet: “Scrum Master szerep-kártya” (felelősségek / anti-felelősségek)
- Gyakorlat: 5 tipikus helyzet: mit csinálsz / mit nem csinálsz
- Quiz-szituáció: PO rád tolja a prioritást; “legyél projektmenedzser”; csapat kéri, hogy te döntsd el a technikát

**Day 2 — Agile vs Scrum: mit kapsz a ‘kóstoló’ kurzustól?**
- Kimenet: 1 oldalas “Agile térkép”: értékek, elvek, és hol illeszkedik a Scrum
- Gyakorlat: 3 példamondat átírása “Agile szándékká” (mérhető)
- Quiz-szituáció: “agile = gyors” tévhit; vezető kéri, hogy legyen több meeting a gyorsuláshoz

**Day 3 — Scrum keret: események, artefaktok, szerepek (áttekintés)**
- Kimenet: “Scrum 1 oldal” (kinek mi a célja / outputja)
- Gyakorlat: esemény→output párosítás
- Quiz-szituáció: Review vs Retro összekeverése; Daily célja félremegy

**Day 4 — A csapat mint rendszer: pszichológiai biztonság és fókusz**
- Kimenet: 5 pontos “biztonság + fókusz” mikroszabály
- Gyakorlat: 2 mondatos beavatkozási script konfliktusnál
- Quiz-szituáció: csapattag fél megszólalni; domináns hang elnyom mindenkit

**Day 5 — Definition of Done (DoD) és minőség: miért kell ‘kapu’?**
- Kimenet: DoD v0.1 sablon (minőség + teszt + review + release feltételek)
- Gyakorlat: DoD-ből 3 “nem alkuképes” pont kijelölése
- Quiz-szituáció: “kész” = fejlesztő szerint kész; PO nyomja a félkész release-t

### 2. hét — Backlog, tervezés, flow
**Day 6 — Product Backlog alapok: érték, kockázat, bizonytalanság**
- Kimenet: backlog item “minimális kártya” sablon (érték + elfogadási kritérium)
- Gyakorlat: 2 user story átírása elfogadási kritériumokkal
- Quiz-szituáció: túl nagy story; nincs mérhető elfogadás; stakeholder “csak csináld meg”

**Day 7 — Refinement (kóstoló): hogyan készítsd elő a Sprint Planninget?**
- Kimenet: 30 perces refinement agenda + kérdéslista
- Gyakorlat: 1 backlog item feldarabolása + kockázat jelölés
- Quiz-szituáció: Planning káosz; csapat nem érti a work itemet; definíciók hiányoznak

**Day 8 — Sprint Planning: cél, forecast, kockázat**
- Kimenet: planning menetrend + “Definition of Ready” v0.1
- Gyakorlat: sprint cél mondat megfogalmazása 3 példából
- Quiz-szituáció: PO túl sokat akar; csapat “igen-t mond” majd csúszik

**Day 9 — Daily Scrum: hogyan lesz rövid, hasznos és nem státusz meeting?**
- Kimenet: Daily “3 kérdés” helyett akadály-vezérelt keret + timebox
- Gyakorlat: 2 tipikus Daily hiba javítása (script)
- Quiz-szituáció: Daily 25 perc; vezető státuszt kér; csapat nincs fókuszban

**Day 10 — WIP és fókusz: miért öl a párhuzamosság?**
- Kimenet: 1 WIP-szabály + “stop-start-continue” micro
- Gyakorlat: 1 táblán WIP limit beállítása és indoklás
- Quiz-szituáció: mindenki 5 dolgon dolgozik; “minden sürgős”

### 3. hét — Facilitation + meeting mastery
**Day 11 — Facilitation alapok: cél, keretek, döntés**
- Kimenet: “facilitációs checklista” (cél / döntési szabály / output)
- Gyakorlat: 15 perces mini workshop terv
- Quiz-szituáció: meeting “csak beszélgetés”; nincs döntés; résztvevők szétesnek

**Day 12 — Sprint Review: érték bemutatása és visszacsatolás kezelése**
- Kimenet: Review agenda + stakeholder kérdéslista
- Gyakorlat: 3 “érték mondat” megfogalmazása feature helyett outcome-ra
- Quiz-szituáció: stakeholder vitatkozik; demo elcsúszik; “miért nem kész?”

**Day 13 — Retrospective: valódi javulás vs panaszkör**
- Kimenet: Retro sablon (gyökérok + 1 akció + owner + mérőszám)
- Gyakorlat: 1 retro akció megfogalmazása úgy, hogy mérhető legyen
- Quiz-szituáció: “mindig ugyanaz”; nincs követés; bűnbakkeresés

**Day 14 — Konfliktusok: PO vs Dev vs Stakeholder**
- Kimenet: 3 konfliktus-kezelő mondat + mediációs keret
- Gyakorlat: “érdek vs pozíció” átfordítás 2 példán
- Quiz-szituáció: PO nyomja a scope-ot; Dev tiltakozik; vezető beleszól

**Day 15 — Döntéshozatal: mikor kell döntés, mikor kísérlet?**
- Kimenet: “döntés vagy kísérlet” döntési fa (2–3 lépés)
- Gyakorlat: 1 vitát kísérletté fordítani (hipotézis + mérőszám)
- Quiz-szituáció: csapat vitázik 40 percet; nincs adat; “érzésre”

### 4. hét — Metrikák + coaching + változás
**Day 16 — Metrikák kóstoló: flow, minőség, érték**
- Kimenet: 4 metrika “starter pack” (mit mérünk és miért)
- Gyakorlat: metric anti-pattern felismerése (vanity vs action)
- Quiz-szituáció: vezető velocity-t KPI-nak akar; csapat “számot gyárt”

**Day 17 — Coaching mindset: kérdések, nem megoldások**
- Kimenet: 10 coaching kérdés (akadály, fókusz, tulajdonlás)
- Gyakorlat: 1 helyzetben tanács helyett kérdés-sor
- Quiz-szituáció: csapat rád vár döntésre; te “megmentőként” viselkedsz

**Day 18 — Stakeholder management: kommunikáció és elvárások**
- Kimenet: stakeholder térkép + “kommunikációs cadencia”
- Gyakorlat: 1 konfliktusos stakeholder kezelési terv
- Quiz-szituáció: stakeholder megkerüli a PO-t; “urgent” csatornák

**Day 19 — Change management: hogyan vezetsz be új szokást?**
- Kimenet: “szokás bevezetés” 2 hetes kísérlet terv
- Gyakorlat: 1 szokás (WIP, DoD, retro) bevezetése ellenállással
- Quiz-szituáció: csapat passzív; “ez hülyeség”; vezető nyomja felül

**Day 20 — Remote/hybrid Scrum: működő meetingek és fókusz**
- Kimenet: remote meeting szabályok + tool etikett
- Gyakorlat: 1 remote Daily redesign
- Quiz-szituáció: kamera off; multitasking; time zone

### 5. hét — Kóstoló a “mélyebb vizekből” (de még nem mély merülés)
**Day 21 — Skálázás kóstoló: mikor kell és mikor árt? (SAFe/LeSS kontextus)**
- Kimenet: “skálázás jelzők” lista (tünetek + első lépés)
- Gyakorlat: 2 scenarió: kell-e skálázás vagy csak fókusz?
- Quiz-szituáció: management SAFe-et akar “mert nagy a cég”; káosz okát félreértik

**Day 22 — IT vs non-IT Scrum: mire figyelj?**
- Kimenet: 5 különbség + 5 azonos alapelv
- Gyakorlat: 1 non-IT folyamat backlogosítása
- Quiz-szituáció: “nálunk nem lehet” kifogások; output nehezen mérhető

**Day 23 — Kockázat és bizonytalanság: spike, prototípus, discovery**
- Kimenet: “spike definíció” + időkeret + output sablon
- Gyakorlat: spike kérdés megfogalmazása
- Quiz-szituáció: csapat “fejleszt” discovery helyett; scope nő

**Day 24 — Minőség és technikai gyakorlatok kóstoló (hogy tudd kérdezni)**
- Kimenet: 10 kérdéslista Dev csapatnak (CI/CD, teszt, review)
- Gyakorlat: 1 minőségprobléma diagnózis kérdésekkel
- Quiz-szituáció: “nincs idő tesztelni”; bugok nőnek; release félelem

**Day 25 — Eszközök és workflow: Jira/Linear/Trello ‘jó használat’**
- Kimenet: “board hygiene” szabályok (definíciók + státuszok)
- Gyakorlat: 1 board átalakítás WIP és DoD szerint
- Quiz-szituáció: board kozmetika; státuszok nem jelentenek semmit

### 6. hét — Karrier + vizsga + tanúsítvány stratégia
**Day 26 — Scrum Master karrier út: junior → mid → senior**
- Kimenet: 90 napos “junior SM” fejlődési terv
- Gyakorlat: 3 mérhető kompetencia kijelölése
- Quiz-szituáció: “mitől leszel senior?” félreértések (nem admin, hanem hatás)

**Day 27 — Interjú kóstoló: 10 tipikus kérdés és jó válasz struktúra**
- Kimenet: válasz-sablon (helyzet → beavatkozás → eredmény → tanulság)
- Gyakorlat: 2 kérdésre válasz vázlat
- Quiz-szituáció: jelölt túl elméleti; nincs konkrét beavatkozás; blaming

**Day 28 — Etika és határok: mikor mondasz nemet?**
- Kimenet: “határ” szabályok + 3 nemet mondó mondat
- Gyakorlat: 1 vezetői kérés kezelése (nem Scrum kompatibilis)
- Quiz-szituáció: vezető daily-n státuszt kér; “tedd kötelezővé a túlórát”

**Day 29 — Final exam felkészítés: milyen jellegű szituációk jönnek?**
- Kimenet: 12 “vizsga-szituáció” lista (gyakori csapathibák + jó beavatkozás)
- Gyakorlat: 3 szituáció megoldási vázlat
- Quiz-szituáció: lásd a 12 lista

**Day 30 — Zárás: saját Scrum Master playbook v1 + tanúsítvány terv**
- Kimenet: személyes “SM Playbook v1” (agenda-k, szabályok, metrikák, script-ek)
- Gyakorlat: 30 napos utóterv: miben mélyülsz (Scrum mély / PO / facilitation / coaching)
- Quiz-szituáció: “mit csinálsz az első héten új csapatnál?”

## Process State
- Status: **RUNNING**
- Current phase: D (CCS — repo artifacts; no DB writes)
- Completed:
  - Environment defaults confirmed: production, dbName=amanoba, 30-day parent, free course, quizzes required
  - IDs confirmed: SCRUMMASTER_LESZEK_2026 / SCRUMMASTER_LESZEK_2026_HU
  - Course idea draft v1 written (HU)
  - Certification entitlement policy decided: **FREE certificate access**
  - Product support implemented: certification can be started without entitlement when course is free and unpriced
  - Phase C outline draft v1 written (Day 1–30)
  - CCS canonical artifacts created:
    - `docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026.canonical.json`
    - `docs/canonical/SCRUMMASTER_LESZEK_2026/SCRUMMASTER_LESZEK_2026_CCS.md`
- Open decisions/questions:
  - Do you want a future EN variant? (EN-first is default for multi-language families)
- Next step: Phase E — create the Course + link to CCS (`course.ccsId`) and configure certification enabled (still draft/inactive)
- Next command: `npm run seed:scrummaster-leszek-2026-hu` (dry-run). To also create 30 inactive lesson stubs: `npm run seed:scrummaster-leszek-2026-hu -- --apply --include-lessons`

## Phase E — Seed (dry-run) — 2026-01-31
- Command: `npm run seed:scrummaster-leszek-2026-hu`
- Result: OK (dry-run; no DB writes)
- Plan summary:
  - dbName=`amanoba`
  - CCS: `SCRUMMASTER_LESZEK_2026`
  - Course: `SCRUMMASTER_LESZEK_2026_HU` (hu, free, certification enabled)

## Phase E — Seed (apply) — 2026-01-31
- Command: `npm run seed:scrummaster-leszek-2026-hu -- --apply`
- Result: ✅ Applied
- Created/updated:
  - DB CCS: `SCRUMMASTER_LESZEK_2026`
  - DB Course: `SCRUMMASTER_LESZEK_2026_HU` (draft/inactive)

## Phase E — Seed (apply + lesson stubs) — 2026-01-31
- Command: `npm run seed:scrummaster-leszek-2026-hu -- --apply --include-lessons`
- Result: ✅ Applied
- Created/updated:
  - 30 inactive lesson stubs: `SCRUMMASTER_LESZEK_2026_HU_DAY_01` … `SCRUMMASTER_LESZEK_2026_HU_DAY_30`
  - Each lesson has `quizConfig.enabled=true`, `successThreshold=70`, `poolSize=7`, `required=true`

---

## Phase F — Lessons (HU) — Day 1 Draft

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_01`

### Lesson title
Scrum Master 2026: szerep, határok, impact

### Lesson content (HTML draft)
```html
<h1>Scrum Master 2026: szerep, határok, impact</h1>
<p><em>Ma kapsz egy tiszta „szerep-kártyát”, hogy tudd: mit csinál a Scrum Master a gyakorlatban, és mit NEM. Ez megvéd a leggyakoribb kezdő hibáktól.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Megérted a Scrum Master szerep lényegét: <strong>rendszert és működést javítasz</strong>, nem „főnökösködsz”.</li>
  <li>Elkészítesz egy 1 oldalas <strong>Scrum Master szerep-kártyát</strong> (felelősségek + tiltott szerep-keverések).</li>
  <li>Megtanulsz 3 mondatot, amivel <strong>határt tartasz</strong> (PO / vezető / csapat helyzetekben) úgy, hogy közben segítesz.</li>
</ul>

<hr />

<h2>Miért fontos ez neked?</h2>
<ul>
  <li><strong>A legtöbb kezdő Scrum Master nem azért bukik el, mert nem tudja a definíciókat</strong>, hanem mert rossz szerepet vesz fel: projektmenedzser, meeting-szervező, „rendőr”.</li>
  <li>Ha nem tartod a határokat, a csapat tulajdonlása elolvad: minden döntést rád tolnak.</li>
  <li>Ha jól csinálod, gyorsan látszik az impact: tisztább meetingek, kevesebb felesleges vita, több fókusz, jobb minőség.</li>
</ul>

<hr />

<h2>Gyors fogalomtisztázás (kezdőknek, praktikus)</h2>
<ul>
  <li><strong>Agile</strong>: gondolkodásmód a bizonytalanság kezelésére (tanulás, visszacsatolás, alkalmazkodás).</li>
  <li><strong>Scrum</strong>: keretrendszer komplex problémákra: szerepek + események + artefaktok.</li>
  <li><strong>Empirizmus</strong>: <strong>átláthatóság → ellenőrzés → alkalmazkodás</strong>. Ha nem látod a valóságot, nem tudsz javítani.</li>
  <li><strong>Scrum Master</strong>: olyan szerep, aki <strong>segíti a rendszert működni</strong>: coachol, facilitál, akadályokat bont, védi a fókuszt.</li>
</ul>

<hr />

<h2>A Scrum Master 3 fő felelőssége (amit ma megjegyzel)</h2>
<ol>
  <li><strong>Facilitáció</strong>: meetingeknek legyen célja, outputja, döntési szabálya.</li>
  <li><strong>Coaching</strong>: kérdésekkel képességet építesz, nem „megoldást adsz” helyettük.</li>
  <li><strong>Rendszer-javítás</strong>: a csapat működése (szokások, szabályok, DoD, WIP, visszacsatolás) legyen stabil.</li>
</ol>

<hr />

<h2>A legfontosabb határ: mit NEM csinálsz Scrum Masterként</h2>
<ul>
  <li><strong>Nem te priorizálsz.</strong> (Ez a Product Owner döntési felelőssége.)</li>
  <li><strong>Nem te döntöd el a technikai megoldást.</strong> (Ez a fejlesztők felelőssége.)</li>
  <li><strong>Nem te vagy a státusz-riporter.</strong> (A rendszer adja a transzparenciát, nem a te prezentációd.)</li>
  <li><strong>Nem te vagy a „rendőr”.</strong> (A cél outcome és tanulás, nem szabály-fetisizmus.)</li>
</ul>

<hr />

<h2>Gyakorlati eljárás: „Határ + segítség” (3 lépés)</h2>
<p><strong>Cél:</strong> nemet mondasz a rossz szerepre, de azonnal adsz egy jobb utat.</p>
<ol>
  <li><strong>Nevezd meg a kérést</strong> (tényszerűen).</li>
  <li><strong>Tisztázd a tulajdonlást</strong> (kié a döntés / felelősség).</li>
  <li><strong>Adj egy következő lépést</strong> (agenda, kérdéslista, döntési szabály, mini workshop).</li>
</ol>

<h3>3 kész mondat (másold ki)</h3>
<ul>
  <li><strong>PO helyzet:</strong> „A prioritás a te döntésed. Amit én tudok adni: egy 20 perces döntési keret, hogy tisztán lássuk az opciókat és a kockázatokat.”</li>
  <li><strong>Vezető helyzet:</strong> „A Daily nem státusz-meeting. Ha státuszt szeretnél, csináljunk külön 10 perces összefoglalót. A Daily-t megvédem a csapat fókusza miatt.”</li>
  <li><strong>Csapat helyzet:</strong> „Nem én döntöm el helyettetek. Viszont segítek: fogalmazzuk meg a döntési szempontokat, és ha nincs adat, csináljunk 1 hetes kísérletet mérőszámmal.”</li>
</ul>

<hr />

<h2>Példák (valós helyzetek 2026-ban)</h2>

<h3>1) „Légy projektmenedzser” nyomás</h3>
<p><strong>Helyzet:</strong> valaki azt kéri, hogy te oszd ki a feladatokat és kérd számon.</p>
<p><strong>Jó válasz:</strong> visszaviszed a tulajdonlást a csapathoz (vizuális tábla, WIP szabály, következő lépés), és te a rendszert javítod.</p>

<h3>2) „A Daily túl hosszú és semmi nem dől el”</h3>
<p><strong>Helyzet:</strong> 20–30 perces körbemondás, nincs akadály-kezelés.</p>
<p><strong>Jó válasz:</strong> bevezetsz 10 perces timeboxot + akadály-first struktúrát + 1–3 napi koordinációs döntést.</p>

<h3>3) „A csapat rád tolja a technikai döntést”</h3>
<p><strong>Helyzet:</strong> „Te mondd meg, melyik megoldás a jó.”</p>
<p><strong>Jó válasz:</strong> döntési keret + kísérlet: kritériumok, kockázat, mérés, review dátum.</p>

<hr />

<h2>Akció (15–20 perc)</h2>
<ol>
  <li>Készíts egy 1 oldalas <strong>Scrum Master szerep-kártyát</strong> 2 oszloppal:
    <ul>
      <li><strong>Mit csinálok</strong> (facilitáció / coaching / rendszer)</li>
      <li><strong>Mit nem csinálok</strong> (priorizálás / tech döntés / státusz-riport)</li>
    </ul>
  </li>
  <li>Írd le a fenti 3 mondatot a saját szavaiddal, hogy természetesen hangozzon magyarul.</li>
  <li>Válassz ki <strong>1</strong> tipikus helyzetet a saját környezetedből (munka/iskola/saját projekt), és írd le: mi lenne a „határ + segítség” következő lépése.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok 1 mondatban válaszolni: „Mit csinál a Scrum Master?”</li>
  <li>✅ Van kész szerep-kártyám (mit igen / mit nem).</li>
  <li>✅ Van 1 konkrét mondatom PO-ra, vezetőre, csapatra.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Scrum Guide (hivatalos): olvasd át a szerepek és események részt, és jelöld be, mi volt új.</li>
  <li>Coaching Agile Teams (Lyssa Adkins): „coach vs solve” szemlélet (kóstoló).</li>
</ul>
```

### Email subject (HU)
`ScrumMaster leszek 2026 — 1. nap: Szerep, határok, impact`

### Email body (HTML draft)
```html
<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma kapsz egy tiszta „szerep-kártyát”, hogy tudd: mit csinál a Scrum Master, és mit nem.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/SCRUMMASTER_LESZEK_2026_HU/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>
```

### Quiz scenario seeds (for Day 1 question generation later)
- PO rád tolja a prioritást (“Te döntsd el, mi legyen a legfontosabb”).
- Vezető státuszt kér a Daily-n és részletes riportot akar.
- Csapat technikai döntést akar rád tolni (“Te mondd meg a megoldást”).

---

## Phase F — Day 1 Apply + Audits — 2026-01-31

### Apply Day 1 (backup-first)
- Dry-run: `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-01.ts`
- Apply: `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-01.ts --apply`
- Result: ✅ Applied to production DB (dbName=`amanoba`)
- Backup created:
  - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_01__2026-01-31T19-53-23-839Z.json`

### Lesson audits (include inactive drafts)
- Lesson quality: `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course SCRUMMASTER_LESZEK_2026_HU --min-score 70 --include-inactive`
  - Day 1 score: **100/100**
  - Note: the remaining Day 2–30 stubs are expected to be below threshold until written.
  - Report:
    - `scripts/reports/lesson-quality-audit__2026-01-31T19-54-18-610Z.json`
    - `scripts/reports/lesson-refine-tasks__2026-01-31T19-54-18-610Z.md`
- Language integrity: `npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts --course SCRUMMASTER_LESZEK_2026_HU --include-inactive`
  - Result: ✅ No lessons failed language integrity.
  - Report:
    - `scripts/reports/lesson-language-integrity-audit__2026-01-31T19-54-21-809Z.json`
    - `scripts/reports/lesson-language-integrity-tasks__2026-01-31T19-54-21-809Z.md`

### Publish Day 1 (make it visible to students)
Note: the student-facing app typically only shows `isActive=true` lessons. Draft lessons can remain inactive until ready.

- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-01.ts --apply`
- Result:
  - Course `SCRUMMASTER_LESZEK_2026_HU`: `isActive=true`
  - Lesson `SCRUMMASTER_LESZEK_2026_HU_DAY_01`: `isActive=true`
- Backup created:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-01__2026-01-31T22-11-29-604Z.json`

---

## Phase G — Day 1 Quiz Questions (7) — 2026-01-31

### Generate via quiz quality pipeline (0 recall)
- Dry-run: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course SCRUMMASTER_LESZEK_2026_HU --lesson-id SCRUMMASTER_LESZEK_2026_HU_DAY_01 --dry-run`
  - Report: `scripts/reports/quiz-quality-pipeline__2026-01-31T22-19-22-947Z.json`
- Apply: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course SCRUMMASTER_LESZEK_2026_HU --lesson-id SCRUMMASTER_LESZEK_2026_HU_DAY_01`
  - Result: ✅ Inserted **7** questions into `SCRUMMASTER_LESZEK_2026_HU_DAY_01`
  - Report: `scripts/reports/quiz-quality-pipeline__2026-01-31T22-19-57-673Z.json`

### Spot-check
- Command: `npx tsx --env-file=.env.local scripts/review-questions-by-lesson.ts SCRUMMASTER_LESZEK_2026_HU`
- Result: Day 1 shows **7** active, course-specific questions.

---

## Phase F — Day 2 Lesson + Quiz — 2026-01-31

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_02`

### Lesson (HU)
- Title: Scrum kóstoló: események, artefaktok, empirizmus
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-02.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02.ts --apply`
  - Backups:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_02__2026-01-31T22-30-02-416Z.json`
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_02__2026-01-31T22-31-35-311Z.json` (adds explicit “Példák” section; quality score 100)

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-02-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-02-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_02__2026-01-31T22-30-16-690Z.json`

### Publish Day 2 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-02.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-02.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-02__2026-01-31T22-30-28-736Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-01-31T22-31-43-245Z.json`
- Note: Day 2 score now **100/100**.

---

## Phase F — Day 3 Lesson + Quiz — 2026-01-31

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_03`

### Note (outline alignment)
The initial outline draft labeled “Agile vs Scrum” as Day 2 and “Scrum keret áttekintés” as Day 3, but Day 2 was implemented as the Scrum overview. Day 3 continues with the Agile vs Scrum “why / when / what to measure” content.

### Lesson (HU)
- Title: Agile vs Scrum: mikor melyik segít, és mit mérj?
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-03.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_03__2026-01-31T22-37-25-395Z.json`

### Lesson audits (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-01-31T22-37-40-736Z.json`
- Language integrity report:
  - `scripts/reports/lesson-language-integrity-audit__2026-01-31T22-37-43-618Z.json`
- Result: Day 3 score **100/100**, language integrity ✅

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-03-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_03__2026-01-31T22-37-48-953Z.json`

### Publish Day 3 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-03.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-03.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-03__2026-01-31T22-38-06-021Z.json`

---

## Phase F — Day 4 Lesson + Quiz — 2026-01-31

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_04`

### Lesson (HU)
- Title: Pszichológiai biztonság + fókusz: 5 mikroszabály kezdőknek
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-04.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_04__2026-01-31T22-43-52-739Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-01-31T22-44-43-566Z.json`
- Result: Day 4 score **100/100**, language integrity ✅

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-04-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_04__2026-01-31T22-44-04-818Z.json`

### Publish Day 4 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-04.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-04.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-04__2026-01-31T22-44-30-143Z.json`

---

## Phase F — Day 5 Lesson + Quiz — 2026-01-31

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_05`

### Lesson (HU)
- Title: Definition of Done (DoD): minőség-kapu, ami nem lassít, hanem gyorsít
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-05.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_05__2026-01-31T22-50-49-378Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-01-31T22-51-47-557Z.json`
- Result: Day 5 score **100/100**, language integrity ✅

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-05-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_05__2026-01-31T22-51-10-330Z.json`

### Publish Day 5 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-05.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-05.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-05__2026-01-31T22-51-32-947Z.json`

---

## Phase F — Day 6 Lesson + Quiz — 2026-01-31

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_06`

### Lesson (HU)
- Title: Product Backlog alapok: érték, kockázat, bizonytalanság
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-06.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_06__2026-01-31T22-58-31-904Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-01-31T22-59-34-183Z.json`
- Result: Day 6 score **100/100**, language integrity ✅

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-06-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-06-quiz.ts --apply`
  - Backups:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_06__2026-01-31T22-58-48-136Z.json` (initial set; low critical-thinking count warning)
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_06__2026-01-31T22-59-06-701Z.json` (final set; 2 critical-thinking)

### Publish Day 6 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-06.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-06.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-06__2026-01-31T22-59-22-028Z.json`

---

## Phase F — Day 7 Lesson + Quiz — 2026-01-31

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_07`

### Lesson (HU)
- Title: Refinement kóstoló: 30 perces agenda + kérdéslista
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-07.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_07__2026-01-31T23-09-01-826Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-01-31T23-09-45-337Z.json`
- Result: Day 7 score **100/100**, language integrity ✅

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-07-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-07-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_07__2026-01-31T23-09-18-216Z.json`

### Publish Day 7 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-07.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-07.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-07__2026-01-31T23-09-36-841Z.json`

---

## Phase F — Day 8 Lesson + Quiz — 2026-01-31

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_08`

### Lesson (HU)
- Title: Sprint Planning: cél, forecast, kockázat (kezdetektől jól)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-08.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_08__2026-01-31T23-32-41-481Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-01-31T23-33-19-476Z.json`
- Result: Day 8 score **100/100**, language integrity ✅

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-08-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-08-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_08__2026-01-31T23-32-55-646Z.json`

### Publish Day 8 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-08.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-08.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-08__2026-01-31T23-33-15-835Z.json`

---

## Phase F — Day 9 Lesson + Quiz — 2026-02-01

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_09`

### Lesson (HU)
- Title: Daily Scrum: rövid, hasznos, nem státusz-meeting
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-09.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_09__2026-02-01T00-17-57-534Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-02-01T00-18-24-310Z.json`
- Result: Day 9 score **100/100**, language integrity ✅

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-09-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-09-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_09__2026-02-01T00-18-08-026Z.json`

### Publish Day 9 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-09.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-09.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-09__2026-02-01T00-18-21-020Z.json`

---

## Phase F — Day 10 Lesson + Quiz — 2026-02-01

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_10`

### Lesson (HU)
- Title: WIP és fókusz: miért öl a párhuzamosság?
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-10.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_10__2026-02-01T00-21-15-410Z.json`

### Lesson audit (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-02-01T02-52-43-510Z.json`
- Result: Course meets min threshold (no refine tasks emitted for Day 10)

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-10-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10-quiz.ts --apply`
  - Backup (final, balanced correctIndex distribution):
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_10__2026-02-01T02-51-56-105Z.json`

### Publish Day 10 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-10.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-10.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-10__2026-02-01T02-52-24-391Z.json`

---

## Phase F — Day 11 Lesson + Quiz — 2026-02-01

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_11`

### Lesson (HU)
- Title: Facilitáció alapok: outcome, timebox, döntési szabály
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-11.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_11__2026-02-01T04-09-19-267Z.json`

### Lesson audits (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-02-01T04-09-27-909Z.json`
- Lesson language integrity report:
  - `scripts/reports/lesson-language-integrity-audit__2026-02-01T04-09-33-932Z.json`

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-11-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_11__2026-02-01T04-10-26-796Z.json`

### Publish Day 11 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-11.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-11.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-11__2026-02-01T04-10-47-334Z.json`

---

## Phase F — Day 12 Lesson + Quiz — 2026-02-01

Target lessonId: `SCRUMMASTER_LESZEK_2026_HU_DAY_12`

### Lesson (HU)
- Title: Sprint Review: érték bemutatása és visszacsatolás kezelése
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-12.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12.ts --apply`
  - Backup:
    - `scripts/lesson-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_12__2026-02-01T04-13-31-293Z.json`

### Lesson audits (include inactive drafts)
- Lesson quality report:
  - `scripts/reports/lesson-quality-audit__2026-02-01T04-13-38-463Z.json`
- Lesson language integrity report:
  - `scripts/reports/lesson-language-integrity-audit__2026-02-01T04-13-48-090Z.json`

### Quiz (7, standalone, 0 recall)
- Applied via backup-first script:
  - Script: `scripts/apply-scrummaster-leszek-2026-hu-day-12-quiz.ts`
  - Command (apply): `npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-12-quiz.ts --apply`
  - Backup:
    - `scripts/quiz-backups/SCRUMMASTER_LESZEK_2026_HU/SCRUMMASTER_LESZEK_2026_HU_DAY_12__2026-02-01T04-13-56-049Z.json`

### Publish Day 12 (visibility)
- Script: `scripts/publish-scrummaster-leszek-2026-hu-day-12.ts`
- Command (apply): `npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-12.ts --apply`
- Backup:
  - `scripts/course-backups/SCRUMMASTER_LESZEK_2026_HU/publish-day-12__2026-02-01T04-14-11-816Z.json`
