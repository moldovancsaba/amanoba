# Amanoba – Első kurzus létrehozásának útmutatója (HU)

Verzió: 1.1
Frissítve: 2026-01-17

Ez az útmutató a jelenlegi Amanoba kód alapján készült. A modellek, API-k és admin UI név szerint a repóban található kódrészeket követik.

---

## 0) Rövid áttekintés – hogyan épül fel a kurzusrendszer

A kurzusok dokumentumokként vannak tárolva MongoDB-ben, Mongoose sémákkal:

- **Course**: kurzus metaadatok (név, leírás, nyelv, pont/XP config, státusz)
- **Lesson**: napi lecke (1–30), tartalom + email tárgy/szöveg
- **CourseProgress**: felhasználói haladás (melyik napon jár, mit teljesített)

Fájlok:
- `app/lib/models/course.ts`
- `app/lib/models/lesson.ts`
- `app/lib/models/course-progress.ts`

A publikálás kulcsa: **Course.isActive = true** és **Lesson.isActive = true**.

---

## 1) Előfeltételek

- Admin felület elérés: `/{locale}/admin`
- DB beállítva: `MONGODB_URI`
- Email küldés: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXT_PUBLIC_APP_URL`
- Napi emailekhez: `CRON_SECRET` + Vercel cron (POST `/api/cron/send-daily-lessons`)

---

## 2) Kurzus létrehozása (Course)

**UI:** `/{locale}/admin/courses/new`
**API:** `POST /api/admin/courses`

### Kötelező mezők
- `courseId` – csupa nagybetű, szám, aláhúzás (pl. `AI_30_NAP`)
- `name` – kurzus neve
- `description` – rövid leírás

### Ajánlott beállítások
- `language`: `hu` / `en` (alapértelmezett: `hu`)
- `durationDays`: 30
- `requiresPremium`: csak ha valóban prémium
- `pointsConfig` és `xpConfig`

### Mintapélda (Course)
```json
{
  "courseId": "AI_30_NAP",
  "name": "AI 30 Nap – mindennapi munkában",
  "description": "Gyakorlati, napi 10-15 perces AI rutinok...",
  "language": "hu",
  "thumbnail": "https://.../cover.jpg",
  "requiresPremium": false,
  "pointsConfig": {
    "completionPoints": 1000,
    "lessonPoints": 50,
    "perfectCourseBonus": 500
  },
  "xpConfig": {
    "completionXP": 500,
    "lessonXP": 25
  }
}
```

Megjegyzés: a Course nem tárolja a leckéket tömbben, minden lecke külön Lesson rekord.

---

## 3) 30 lecke létrehozása (Lesson)

**UI:** `/{locale}/admin/courses/{courseId}`
**API:** `POST /api/admin/courses/{courseId}/lessons`

### Kötelező mezők (minden napra)
- `lessonId` – egyedi (javasolt: `AI_30_NAP_DAY_01`)
- `dayNumber` – 1–30
- `title`
- `content` – HTML vagy Markdown
- `emailSubject`
- `emailBody` – HTML

### Opcionális mezők
- `assessmentGameId`
- `pointsReward`, `xpReward` (ha eltér a kurzus alapértéktől)
- `translations`
- `metadata` – itt tárolhatsz extra mezőket (pl. prompt sablon, napi feladat)

### Mintapélda (Lesson)
```json
{
  "lessonId": "AI_30_NAP_DAY_01",
  "dayNumber": 1,
  "title": "Mi az AI a napi munkában?",
  "content": "<h2>Bevezetés</h2><p>...</p>",
  "emailSubject": "1. nap: Mi az AI a napi munkában?",
  "emailBody": "<p>Ma ezt fogjuk csinálni...</p>",
  "metadata": {
    "promptTemplate": "Adj 3 példát...",
    "task": "Készíts 1 rövid promptot a napi feladatodra"
  }
}
```

---

## 4) Publikálás (Draft → Published)

**UI:** `/{locale}/admin/courses/{courseId}`

Kapcsold `Published` állapotba (ez `Course.isActive = true`).

Ekkor a kurzus megjelenik a publikus listában:
- `/{locale}/courses`

---

## 5) Tesztelés / Enroll

**Beiratkozás:** `POST /api/courses/{courseId}/enroll`

**Lecke lekérés (nap 1):** `GET /api/courses/{courseId}/day/1`

**UI oldal:** `/{locale}/courses/{courseId}/day/1`

Ha valami nem jelenik meg, ellenőrizd:
- `Course.isActive = true`
- `Lesson.isActive = true`
- `dayNumber` 1–30

---

## 6) Email küldés teszt (Resend)

**Dev mód:**
- `GET /api/cron/send-daily-lessons`

**Prod mód:**
- `POST /api/cron/send-daily-lessons`
- Header: `Authorization: Bearer <CRON_SECRET>`

Az email a `CourseProgress.currentDay` alapján megy ki.

---

## 7) Ismert eltérések (fontos!)

A `CourseProgress` sémában ezek a mezők léteznek:
- `completedDays`, `status`, `lastAccessedAt`, `emailSentDays`

A jelenlegi API-k viszont ezeket a mezőket használják:
- `lessonsCompleted`, `isCompleted`, `lastActivityAt`

Ez inkonzisztens. Javasolt a route-ok javítása, különben:
- a haladás nem lesz megbízható
- az email küldés hibás lehet

---

## 8) Többnyelvűség (i18n)

Mind a Course, mind a Lesson tartalmaz `translations` mezőt.
A jelenlegi API-k nem fordítanak automatikusan, ezért:

- ha HU tartalom kell: a `content`, `title`, `emailBody` legyen HU
- ha többnyelvű kell: bővítés szükséges az API/Frontend oldalon

---

## 9) Tartalom import (gyorsabb workflow)

A 30 napos tartalmat előre megírhatjátok Markdown/JSON-ben, majd:

- seed script
- vagy admin API (POST `/api/admin/courses/{courseId}/lessons`)

Ez gyorsabb, mint UI-ból kézzel feltölteni 30 leckét.

---

## 10) Quality Control (Minőségellenőrzés)

**⚠️ KRITIKUS**: Minden lecke tartalmát és kvízét ezen szabályok szerint kell ellenőrizni és javítani. A minőség a sebesség felett van prioritás.

### 10.1) Nyelvtan és Nyelvhasználat

- [ ] **Nincs nyelvtani hiba** - Tökéletes nyelvtan, helyes igeidők, mondatszerkezet
- [ ] **Helyes helyesírás** - Nyelvspecifikus helyesírási szabályok betartása
- [ ] **Helyes írásjelek** - Pontok, vesszők, idézőjelek, kötőjelek helyes használata
- [ ] **Alany-ige egyeztetés** - Pl. "Nincsenek számok" (nem "Nincs számok")
- [ ] **Konzisztens terminológia** - Ugyanazt a szakkifejezést használjuk végig
- [ ] **Helyes nagybetűzés** - Címek, szakkifejezések, tulajdonnevek

### 10.2) Stílus és Hangvétel (MANDATORY STANDARDS)

Minden tartalomnak ezeket a stílusirányelveket kell követnie:

- [ ] **Beszélgetős kapcsolat** - Úgy írunk, mintha közvetlenül egy barátnak vagy kollégának beszélnénk. Használjuk a "te" és "én" személyes névmásokat az azonnali kapcsolatért
- [ ] **Aktív igeidő** - Mindig az aktív igeidőt részesítjük előnyben ("A fejlesztő javította a hibát") a passzív helyett ("A hiba javítva lett")
- [ ] **Egyszerű nyelv** - Kerüljük az akadémiai zsargont, de tartsuk meg az ipari standard kifejezéseket. Cseréljük le a bonyolult szavakat egyszerűbbekre
- [ ] **Előtérbe helyezés (Inverted Pyramid)** - A legfontosabb információt és a "mi van benne nekem" (WIIFM) elejére tesszük. A átfutók az első néhány másodpercben meg kell értsék a fő pontot
- [ ] **Mikrotanulás (Chunking)** - 5-10 perces, harapható modulokra bontjuk. Minden modul egyetlen teljesítményalapú célra fókuszál
- [ ] **Moduláris önállóság** - A bekezdéseket úgy strukturáljuk, hogy önállóan is értelmezhetők legyenek. A tanulók pontosan oda ugorhatnak, ahol szükségük van információra, anélkül hogy az előző részeket el kellene olvasniuk
- [ ] **Felsorolások** - Használjunk listákat a "falak" szétbontására. Számozott listák sorozatokhoz, felsorolások nem hierarchikus elemekhez
- [ ] **Leíró alcímek** - Olyan címsorokat használunk, amelyek elmondják, mit fog a tanuló megtanulni ("Hogyan állítsd be a dashboardodat") a homályos címek helyett ("Bevezetés")
- [ ] **Cselekvő igék** - Erős cselekvő igéket használunk ("Elemezd," "Építsd fel," "Oldd meg") a tanulási célokban
- [ ] **Problémaalapú tanulás** - Olyan tartalommal kezdünk, amely segít megoldani egy aktuális problémát. Kezdjünk egy forgatókönyvvel vagy kérdéssel, amely aktiválja a korábbi tudást
- [ ] **Mutasd, ne csak mondd** - Használjunk valós példákat, analógiákat vagy rövid történeteket, hogy az elvont fogalmakat konkrét és emlékezetes legyen

### 10.3) Logika és Struktúra

- [ ] **Koherens folyamat** - Az ötletek logikusan következnek egymás után
- [ ] **Logikus haladás** - A tananyag épül, nem ugrál összevissza
- [ ] **Nincs ellentmondás** - Sem a leckén belül, sem a leckék között
- [ ] **Világos tanulási célok** - Minden lecke célja egyértelmű
- [ ] **Megfelelő szekció szervezés** - Logikus fejezetek, alcímek, szünetek

### 10.4) Tényellenőrzés (COMPREHENSIVE)

- [ ] **Pontos technikai információ** - Minden technikai állítás ellenőrizve
- [ ] **Naprakész hivatkozások** - Nincs elavult URL, dátum vagy tény
- [ ] **Helyes verziószámok** - Ha alkalmazandó (pl. API verziók)
- [ ] **Érvényes külső linkek** - Minden link működik és elérhető
- [ ] **Jelenlegi best practice-ek** - Az ipar legfrissebb ajánlásai
- [ ] **Elavult tények és dátumok** - Frissítsük a legfrissebb információra. Olyan információkhoz, amelyek elavulhatnak, adjunk hozzá dátumot, amikor igaz volt (pl. "2026 januárjában a Shopify API v2024-01 támogatja...")
- [ ] **Minden technikai állítás ellenőrizve** - Ne hagyjunk ellenőrizetlen állítást
- [ ] **Külső erőforrások elérhetősége** - Minden külső link működik

### 10.5) Tartalom Minősége

- [ ] **Oktatási érték** - A tanuló valóban megtanul valamit
- [ ] **Cselekvésre ösztönző** - Konkrét, alkalmazható tanácsok
- [ ] **Világos példák** - Valós, érthető példák
- [ ] **Gyakorlati feladatok** - Konkrét, elvégezhető gyakorlatok
- [ ] **Tisztelet a tanuló idejéhez** - Nincs felesleges szöveg, minden mondat számít

### 10.6) Ellenőrzési Folyamat

Minden lecke esetében:

1. **Olvasd el a teljes tartalmat** (title, content, emailSubject, emailBody)
2. **Alkalmazd a fenti ellenőrzőlistát** - Minden pontot ellenőrizz
3. **Dokumentáld a talált problémákat** - Jegyezd fel, mit találtál és mit javítottál
4. **Javítsd az összes problémát** - Ne hagyj ki semmit
5. **Frissítsd az adatbázist** - API vagy seed script használatával
6. **Jelöld meg késznek** - ✅ COMPLETE

### 10.7) Fontos Megjegyzések

- **Minőség a sebesség felett**: Jobb lassabban, de tökéletesen, mint gyorsan és hibásan
- **Konzisztencia**: Minden kurzus ugyanazokat a szabályokat követi
- **Tisztelet a tanulókhoz**: A tartalom méltó legyen az ő idejükhöz és bizalmukhoz
- **Dokumentálás**: Minden változtatást dokumentálj a master plan dokumentumban

### 10.8) Quiz Quality Control (Kvíz Minőségellenőrzés)

**⚠️ MANDATORY**: Minden kvíznek ezeket a szabályokat kell követnie. Nincs kivétel.

#### 10.8.1) Kvíz Struktúra (MANDATORY)
- [ ] **Pontosan 7 kérdés** - Nincs kivétel, nem több, nem kevesebb
- [ ] **Minden leckéhez kvíz** - Minden leckének kell kvíz
- [ ] **Ugyanaz a nyelv, mint a kurzus** - 100% nyelvi konzisztencia, nincs keverés, nincs fallback
- [ ] **Natív minőség** - Professzionális, anyanyelvi szintű írás, nem gépi fordítás
- [ ] **Helyes ipari zsargon** - Az ipari kifejezéseket a megfelelő nyelven tartjuk meg
- [ ] **Oktatási érték** - A kérdések tanítanak, nem csak tesztelnek. Minden válasz oktatási értékkel bír
- [ ] **Nincs hülye válasz** - A rossz opciók hihetők és oktatási értékkel bírnak (tanítják a gyakori hibákat)
- [ ] **Önálló kérdések** - Minden kérdés önállóan működik, nincs hivatkozás más kérdésekre
- [ ] **Értés tesztelése** - A kérdések a megértést és alkalmazást ellenőrzik, nem csak a memorizálást
- [ ] **Világos, egyértelmű** - Nincs zavaró megfogalmazás, nincs trükkös kérdés
- [ ] **4 válaszlehetőség** - Pontosan 4 opció (1 helyes + 3 hihető elterelő)

#### 10.8.2) Metadata Kötelező (MANDATORY)
- [ ] **UUID v4** - Minden kérdésnek egyedi azonosítója van
- [ ] **Hashtagok**: `[#téma, #nehézség, #típus, #nyelv, #all-languages]`
- [ ] **questionType**: `RECALL`, `APPLICATION`, vagy `CRITICAL_THINKING`
- [ ] **difficulty**: `EASY`, `MEDIUM`, `HARD`, vagy `EXPERT`
- [ ] **category**: Érvényes angol enum érték (nem fordított)

#### 10.8.3) Kognitív Mix (MANDATORY - STRICT RULES)
- [ ] **0 kérdés: RECALL** - NINCS recall kérdés engedélyezve (hard rule)
- [ ] **Legalább 5 kérdés: APPLICATION** - Minimum 5 application kérdés (hard rule)
- [ ] **Legalább 2 kérdés: CRITICAL_THINKING** - Ajánlott minimum 2 critical thinking kérdés (warning ha kevesebb)

#### 10.8.4) Tartalom Kapcsolat (MANDATORY)
- [ ] **100% kapcsolódik a leckéhez** - Minden kérdés a lecke tényleges anyagát teszteli
- [ ] **Olvasd el a lecke tartalmát** - A kérdések létrehozása előtt olvasd el a teljes lecke tartalmát
- [ ] **Értsd meg a tanulási célokat** - A kérdések a lecke tanulási céljait tükrözik
- [ ] **Teszteld a kulcsfogalmakat** - A kérdések a lecke kulcsfogalmait és tanítási pontjait fedik le

#### 10.8.5) Minőségi Követelmények (MANDATORY)
- [ ] **Minimum 40 karakter kérdés** - Minden kérdés legalább 40 karakter hosszú
- [ ] **Minimum 25 karakter válaszlehetőség** - Minden válaszlehetőség legalább 25 karakter hosszú
- [ ] **Nincs generikus sablon** - Nincs "Mi a kulcsfontosságú koncepció...", "Mit jelent a..." stb.
- [ ] **Nincs töredékes kifejezés idézőjelben** - Nincs "mestere" stb. kontextus nélkül
- [ ] **Oktatási érték** - Minden válasz oktatási értékkel bír, nincs "hülye" válasz

### 10.9) Kapcsolódó Dokumentumok

- **Master Plan**: `/docs/_archive/delivery/2026-01/2026-01-25_COURSE_CONTENT_QUALITY_AUDIT_AND_FIX_MASTER_PLAN.md`
- **Quiz System Fix**: `/docs/FINAL_QUIZ_SYSTEM_DELIVERY.md`
- **Quality Checklist**: Lásd a fenti pontokat
- **Style Guide**: Lásd 10.2 szekció

---

## 11) Gyors checklist

- [ ] Course létrehozva (Course.isActive = false)
- [ ] 30 Lesson létrehozva (mind `isActive = true`)
- [ ] **Quality Control elvégezve** - Minden lecke ellenőrizve a 10. szekció szerint
- [ ] **Quiz Quality Control elvégezve** - Minden kvíz ellenőrizve a 10.8. szekció szerint
- [ ] **Minden leckéhez 7 kérdés** - Pontosan 7 kérdés, minden metadata-val
- [ ] **Kognitív mix ellenőrizve** - 60% recall, 30% application, 10% critical thinking
- [ ] **Nyelvi konzisztencia** - Minden kérdés a kurzus nyelvén
- [ ] Course publikálva (Course.isActive = true)
- [ ] Kurzus megjelenik a /courses listában
- [ ] Enroll és Day 1 lecke elérhető
- [ ] Cron email teszt lefut

