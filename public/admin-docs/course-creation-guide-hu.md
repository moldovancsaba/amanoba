# Amanoba Kurzus Létrehozási Útmutató (HU)

**Verzió**: 3.0  
**Utolsó frissítés**: 2025-01-20  
**Alapja**: AI_30_NAP kurzus valós implementációja Quiz Értékelésekkel

Ez az útmutató az AI_30_NAP kurzus tényleges implementációján és a fejlesztési folyamat során szerzett tapasztalatokon alapul.

---

## Áttekintés: Hogyan működik a kurzusrendszer

A kurzusok MongoDB-ben dokumentumokként vannak tárolva Mongoose sémákkal:

- **Course**: Kurzus metaadatok (név, leírás, nyelv, pont/XP config, státusz, brandId)
- **Lesson**: Napi lecke (1–30), tartalom + email tárgy/szöveg
- **CourseProgress**: Felhasználói haladás (aktuális nap, befejezett leckék, beiratkozási státusz)

**Kulcs fájlok:**
- `app/lib/models/course.ts`
- `app/lib/models/lesson.ts`
- `app/lib/models/course-progress.ts`

**Publikálás kulcsa**: Mind a `Course.isActive = true` ÉS a `Lesson.isActive = true` be kell legyen állítva.

---

## Előfeltételek

- Admin hozzáférés: `/{locale}/admin` (alapértelmezett: `/hu/admin`)
- Adatbázis beállítva: `MONGODB_URI` a `.env.local`-ban
- Email szolgáltatás: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXT_PUBLIC_APP_URL`
- Napi emailek: `CRON_SECRET` + Vercel cron (POST `/api/cron/send-daily-lessons`)

---

## 1. lépés: Kurzus létrehozása (Course modell)

**UI útvonal**: `/{locale}/admin/courses/new`  
**API végpont**: `POST /api/admin/courses`

### Kötelező mezők

- `courseId` – **Csak nagybetű**, számok, aláhúzás (pl. `AI_30_NAP`, `ENTREPRENEURSHIP_101`)
  - Regex: `/^[A-Z0-9_]+$/`
  - Egyedinek kell lennie az összes kurzus között
- `name` – Kurzus megjelenített neve (max 200 karakter)
- `description` – Kurzus leírás (max 2000 karakter)

### Ajánlott beállítások

- `language`: `hu` (magyar) vagy `en` (angol) - alapértelmezett: `hu`
- `durationDays`: `30` (30 napos kurzusokhoz standard)
- `requiresPremium`: `false` (kivéve, ha valóban prémium)
- `thumbnail`: Opcionális kép URL a kurzus listázáshoz

### Pontok és XP konfiguráció

**Alapértelmezett értékek** (AI_30_NAP alapján):
```json
{
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

### Brand konfiguráció

**Fontos**: Minden kurzusnak érvényes `brandId`-re van szüksége. A rendszer:
- Automatikusan megkeresi vagy létrehozza az alapértelmezett "Amanoba" brandet, ha nincs `brandId` megadva
- Validálja a `brandId`-t, ha meg van adva
- Hibát ad vissza, ha a `brandId` érvénytelen vagy hiányzik

### Példa kurzus (AI_30_NAP-ból)

```json
{
  "courseId": "AI_30_NAP",
  "name": "AI 30 Nap – tematikus tanulási út",
  "description": "30 napos, strukturált AI-kurzus, amely az alapoktól a haladó használatig vezet. Napi 10-15 perces leckékkel építsd be az AI-t a munkádba és a mindennapi életedbe.",
  "language": "hu",
  "durationDays": 30,
  "isActive": false,
  "requiresPremium": false,
  "pointsConfig": {
    "completionPoints": 1000,
    "lessonPoints": 50,
    "perfectCourseBonus": 500
  },
  "xpConfig": {
    "completionXP": 500,
    "lessonXP": 25
  },
  "metadata": {
    "category": "ai",
    "difficulty": "beginner",
    "estimatedHours": 7.5,
    "tags": ["ai", "productivity", "workflows", "business"],
    "instructor": "Amanoba"
  }
}
```

**Megjegyzés**: A Course modell NEM tárolja a leckéket tömbben. Minden lecke külön Lesson dokumentum, amely a `courseId` (ObjectId referencia) révén kapcsolódik.

---

## 2. lépés: 30 lecke létrehozása (Lesson modell)

**UI útvonal**: `/{locale}/admin/courses/{courseId}` (kurzus létrehozása után)  
**API végpont**: `POST /api/admin/courses/{courseId}/lessons`

### Kötelező mezők (minden napra 1-30)

- `lessonId` – Egyedi azonosító (ajánlott formátum: `{COURSE_ID}_DAY_{DD}`)
  - Példa: `AI_30_NAP_DAY_01`, `AI_30_NAP_DAY_02`, stb.
  - Egyedinek kell lennie kurzusonként
- `dayNumber` – Egész szám 1-30 (sorrendben kell lennie, nincs hézag)
- `title` – Lecke címe (UI-ban és emailekben megjelenik)
- `content` – HTML tartalom (teljes lecke tartalom)
- `emailSubject` – Email tárgy (támogatja a helyőrzőket)
- `emailBody` – HTML email törzs (támogatja a helyőrzőket)

### Opcionális mezők

- `assessmentGameId` – Játék hivatkozás értékeléshez (ObjectId) - **Megjegyzés**: Ez opcionális. Lecke értékelésekhez használd a `quizConfig`-ot.
- `pointsReward` – Felülírja a kurzus alapértékét (alapértelmezett: `course.pointsConfig.lessonPoints`)
- `xpReward` – Felülírja a kurzus alapértékét (alapértelmezett: `course.xpConfig.lessonXP`)
- `quizConfig` – **Quiz/Feladatlap Értékelés Konfiguráció** (lásd lentebb)
- `translations` – Többnyelvű támogatás (Map struktúra)
- `metadata` – Rugalmas mező extra adatokhoz:
  - `estimatedMinutes`: Olvasási idő
  - `difficulty`: 'easy' | 'medium' | 'hard'
  - `tags`: Címkék tömbje
  - Egyedi mezők (prompt sablonok, feladatok, tippek, stb.)

### Quiz/Feladatlap Értékelés Konfiguráció (`quizConfig`)

Minden lecke rendelkezhet quiz értékeléssel a QUIZZZ játék modul használatával. Ezt a `quizConfig` objektummal konfigurálod:

```json
{
  "quizConfig": {
    "enabled": true,
    "successThreshold": 100,  // Százalék (0-100) a sikeres válaszokhoz
    "questionCount": 5,       // Megjelenítendő kérdések száma
    "poolSize": 15,           // Összes kérdés a pool-ban (a rendszer véletlenszerűen választ questionCount-ot ebből a pool-ból)
    "required": true          // Ha true, a tanulónak át kell mennie a quiz-en a lecke befejezéséhez
  }
}
```

**Konfigurációs irányelvek** (AI_30_NAP kurzus alapján):
- **`enabled`**: Állítsd `true`-ra, hogy engedélyezd a quiz-t a leckéhez
- **`successThreshold`**: Százalék a helyes válaszokhoz (pl. 100 = minden kérdésnek helyesnek kell lennie)
- **`questionCount`**: Megjelenítendő kérdések száma (ajánlott: 5)
- **`poolSize`**: Összes elérhető kérdés (ajánlott: 15, így a rendszer véletlenszerűen választ 5-öt 15-ből)
- **`required`**: Ha `true`, a lecke nem fejezhető be a quiz sikeres teljesítése nélkül

**Quiz Kérdések Kezelése**:
- A quiz kérdéseket külön kezeled a "Quiz Kérdések Kezelése" gombbal a lecke szerkesztőben
- A kérdések kurzus/lecke-specifikusak (jelölve `isCourseSpecific: true`-val)
- Minden kérdésnek 4 opciója van, egy helyes válasz
- A kérdéseket létrehozhatod, szerkesztheted és törölheted az admin felületen
- A kérdések a `QuizQuestion` modellben tárolódnak `lessonId` és `courseId` hivatkozásokkal

**Példa Quiz Konfiguráció** (AI_30_NAP-ból):
```json
{
  "quizConfig": {
    "enabled": true,
    "successThreshold": 100,  // Mind az 5 helyes válasz szükséges (5/5 = 100%)
    "questionCount": 5,       // 5 kérdés megjelenítése
    "poolSize": 15,           // 15 kérdés a pool-ban (a rendszer véletlenszerűen választ 5-öt)
    "required": true          // Quiz szükséges a lecke befejezéséhez
  }
}
```

### Email sablon helyőrzők

Az email szolgáltatás ezeket a helyőrzőket támogatja az `emailSubject` és `emailBody` mezőkben:

- `{{courseName}}` – Kurzus neve
- `{{dayNumber}}` – Aktuális nap (1-30)
- `{{lessonTitle}}` – Lecke címe
- `{{lessonContent}}` – Teljes lecke HTML tartalom
- `{{appUrl}}` – Alkalmazás URL (`NEXT_PUBLIC_APP_URL`-ból)
- `{{playerName}}` – Tanuló megjelenített neve

**Fontos**: Használj helyőrzőket az email sablonokban. Az email szolgáltatás küldéskor lecseréli őket.

### Példa lecke (1. nap az AI_30_NAP-ból)

```json
{
  "lessonId": "AI_30_NAP_DAY_01",
  "dayNumber": 1,
  "title": "Mi az AI valójában – és mire NEM való?",
  "content": "<h2>Napi cél</h2><p>Megismered, hogy mi az AI valójában...</p><h2>Mit fogsz megtanulni?</h2><ul>...</ul>",
  "emailSubject": "AI 30 Nap – 1. nap: Mi az AI valójában?",
  "emailBody": "<h1>{{courseName}}</h1><h2>{{dayNumber}}. nap: {{lessonTitle}}</h2><div>{{lessonContent}}</div><p><a href=\"{{appUrl}}/courses/AI_30_NAP/day/{{dayNumber}}\">Olvasd el a teljes leckét →</a></p>",
  "pointsReward": 50,
  "xpReward": 25,
  "isActive": true,
  "displayOrder": 1,
  "language": "hu",
  "metadata": {
    "estimatedMinutes": 10,
    "difficulty": "beginner",
    "tags": ["ai", "basics", "daily-practice"]
  }
}
```

### Lecke tartalom struktúra (ajánlott gyakorlat)

Az AI_30_NAP alapján minden leckének tartalmaznia kellene:

1. **Napi cél** (`<h2>Napi cél</h2>`) – Mit fog elérni a tanuló
2. **Mit fogsz megtanulni?** (`<h2>Mit fogsz megtanulni?</h2>`) – Tanulási célok
3. **Gyakorlat** (`<h2>Gyakorlat</h2>`) – Gyakorlati feladatok
4. **Kulcs tanulságok** (`<h2>Kulcs tanulságok</h2>`) – Fontos pontok
5. **Házi feladat** (`<h2>Házi feladat</h2>`) – Opcionális következő feladat

**Formátum**: Használj HTML-t a formázáshoz. A tartalom a lecke megjelenítőben jelenik meg.

---

## 3. lépés: Publikálás (Draft → Published)

**UI útvonal**: `/{locale}/admin/courses/{courseId}`

### Aktiválási lépések

1. **Kurzus aktiválása**: Kapcsold be az `isActive`-t `true`-ra a kurzus szerkesztőben
2. **Leckék ellenőrzése**: Bizonyosodj meg róla, hogy mind a 30 lecke `isActive: true`
3. **Brand ellenőrzése**: Ellenőrizd, hogy a kurzusnak érvényes `brandId`-je van

Publikálás után a kurzus megjelenik:
- Publikus kurzus listában: `/{locale}/courses`
- Tanulói beiratkozásnál: `/{locale}/courses/{courseId}`

### Láthatósági követelmények

Ahhoz, hogy egy kurzus látható legyen a tanulók számára:
- ✅ `Course.isActive = true`
- ✅ `Course.requiresPremium = false` (vagy a tanuló prémium)
- ✅ Legalább egy `Lesson` létezik `isActive: true`-val
- ✅ Érvényes `brandId` referencia

---

## 4. lépés: Tesztelés és beiratkozás

### Teszt beiratkozás

**API**: `POST /api/courses/{courseId}/enroll`  
**UI**: `/{locale}/courses/{courseId}` → Kattints a "Beiratkozás" gombra

### Teszt lecke hozzáférés

**API**: `GET /api/courses/{courseId}/day/{dayNumber}`  
**UI**: `/{locale}/courses/{courseId}/day/1`

### Hibakeresés

Ha a kurzus/leckék nem jelennek meg, ellenőrizd:
- ✅ `Course.isActive = true`
- ✅ `Lesson.isActive = true` minden leckénél
- ✅ `dayNumber` 1-30 (nincs hézag)
- ✅ `courseId` pontosan egyezik (kis-nagybetű érzékeny)
- ✅ Brand létezik és aktív
- ✅ Nincs API hiba a böngésző konzolban

---

## 5. lépés: Email kézbesítés tesztelése

### Fejlesztési mód

**Manuális indítás**: `GET /api/cron/send-daily-lessons` (dev módban nincs auth szükség)

### Éles mód

**Cron végpont**: `POST /api/cron/send-daily-lessons`  
**Header**: `Authorization: Bearer <CRON_SECRET>`

### Email ütemezés

Az emailek a következők alapján mennek ki:
- `CourseProgress.currentDay` – Melyik napon jár a tanuló
- `CourseProgress.emailSentDays` – Már elküldött napok (megelőzi a duplikációkat)
- Tanuló időzónája és preferált email ideje (email beállításokból)

### Email sablon ajánlott gyakorlatok

1. **Használj helyőrzőket**: Mindig használj `{{helyőrzőket}}` az email sablonokban
2. **Tartalmazz linket**: Mindig tartalmazz linket a teljes leckéhez
3. **Rövid tárgy**: Az email tárgyak legyenek tömörek (< 60 karakter)
4. **HTML formázás**: Használj megfelelő HTML struktúrát az olvashatósághoz

---

## 6. lépés: Tartalom import (gyorsabb munkafolyamat)

A 30 lecke manuális UI-beli létrehozása helyett használj seed scriptet:

### Seed script minta

**Fájl**: `scripts/seed-{kurzus-nev}.ts`  
**Használat**: `npm run seed:{kurzus-nev}`

**Példa struktúra** (`seed-ai-30-nap-course.ts`-ból):

```typescript
const lessonPlan = [
  {
    day: 1,
    title: 'Lecke címe',
    content: '<h2>...</h2>',
    emailSubject: '{{dayNumber}}. nap: {{lessonTitle}}',
    emailBody: '<h1>{{courseName}}</h1>...',
  },
  // ... 29 további lecke
];

// Seed függvény
async function seed() {
  // 1. Csatlakozás MongoDB-hez
  // 2. Brand keresése vagy létrehozása
  // 3. Kurzus létrehozása vagy frissítése
  // 4. Ciklus a lessonPlan-on és Lesson-ök létrehozása
  // 5. Upsert használata a duplikációk elkerülésére
}
```

**Előnyök**:
- ✅ Gyorsabb, mint a manuális UI bevitel
- ✅ Verziókezelt (git-ben)
- ✅ Ismételhető (biztonságosan újrafuttatható)
- ✅ Mind a 30 lecke egy fájlban

---

## 7. lépés: Többnyelvű támogatás

### Kurzus szintű fordítások

Mind a `Course`, mind a `Lesson` modell támogatja a `translations` mezőt:

```typescript
translations: Map<string, {
  name: string;
  description: string;
  // Leckéknél: title, content, emailSubject, emailBody
}>
```

### Jelenlegi implementáció

- **Elsődleges nyelv**: A `language` mezővel állítható (`hu` vagy `en`)
- **Fordítások**: A `translations` Map-ben tárolva (kulcs = locale kód)
- **API**: Jelenleg csak az elsődleges nyelvet adja vissza (fordítási API bővítés szükséges)

### Ajánlott gyakorlat

Egyelőre külön kurzusokat hozz létre különböző nyelvekhez:
- `AI_30_NAP` (magyar)
- `AI_30_DAYS` (angol) - jövőbeli

---

## 8. lépés: Gyakori problémák és megoldások

### Probléma: Kurzus nem látható

**Tünetek**: Kurzus létezik az adatbázisban, de nem jelenik meg a `/courses` listában

**Megoldások**:
1. Ellenőrizd az `isActive: true`-t a kurzuson
2. Ellenőrizd a `requiresPremium: false`-t (vagy a tanuló prémium)
3. Verifikáld az API lekérdezést: `/api/courses?status=active`
4. Ellenőrizd a böngésző konzolt API hibákért
5. Verifikáld, hogy a `brandId` érvényes

### Probléma: Leckék nem töltődnek be

**Tünetek**: Kurzus látható, de a leckék 404-et adnak vissza

**Megoldások**:
1. Verifikáld, hogy a `dayNumber` 1-30 (nincs hézag)
2. Ellenőrizd a `Lesson.isActive = true`-t
3. Verifikáld, hogy a `courseId` pontosan egyezik (kis-nagybetű érzékeny)
4. Ellenőrizd, hogy a lecke létezik: `Lesson.findOne({ courseId, dayNumber })`

### Probléma: Email nem megy ki

**Tünetek**: Tanulók beiratkoztak, de nem kapnak napi emaileket

**Megoldások**:
1. Ellenőrizd, hogy a `RESEND_API_KEY` be van állítva
2. Verifikáld, hogy a cron feladat be van állítva a Vercel-ben
3. Ellenőrizd, hogy a `CRON_SECRET` egyezik a kérés header-ben
4. Verifikáld, hogy a tanuló engedélyezte az email preferenciákat
5. Ellenőrizd a `CourseProgress.emailSentDays` tömböt

### Probléma: Kurzus létrehozás sikertelen

**Tünetek**: "Failed to create course" hiba

**Megoldások**:
1. Verifikáld, hogy a `courseId` egyedi (nagybetű, nincs szóköz)
2. Ellenőrizd a kötelező mezőket: `courseId`, `name`, `description`
3. Verifikáld, hogy a `brandId` érvényes ObjectId (vagy hagyd, hogy a rendszer létrehozza az alapértelmezettet)
4. Ellenőrizd az API választ a konkrét hibaüzenetért
5. Verifikáld az admin autentikációt

---

## 9. lépés: Gyors ellenőrzőlista

Kurzus publikálása előtt ellenőrizd:

- [ ] Kurzus létrehozva érvényes `courseId`-vel (nagybetű, egyedi)
- [ ] Mind a 30 lecke létrehozva (napok 1-30, nincs hézag)
- [ ] Minden lecke `isActive: true`
- [ ] Kurzus `isActive: true`
- [ ] Kurzusnak érvényes `brandId`-je van
- [ ] Email sablonok helyőrzőket használnak (`{{courseName}}`, `{{dayNumber}}`, stb.)
- [ ] Lecke tartalom HTML formázott
- [ ] Kurzus megjelenik a `/courses` listában
- [ ] Beiratkozás működik (`POST /api/courses/{courseId}/enroll`)
- [ ] 1. nap lecke elérhető (`/courses/{courseId}/day/1`)
- [ ] Email kézbesítés tesztelve (manuális vagy cron)

---

## 10. lépés: Ajánlott gyakorlatok (AI_30_NAP alapján)

### Tartalom struktúra

1. **Kezdés az alapokkal**: Az 1-5. napok az alapokat fedjék le
2. **Fokozatos építés**: Minden nap az előzőre épül
3. **Tartalmazz gyakorlatot**: Minden leckének legyen gyakorlati feladata
4. **Adj példákat**: Tartalmazz prompt példákat, sablonokat, tippeket
5. **Zárás akcióval**: A végső napok az implementációra fókuszáljanak

### Email sablonok

1. **Személyre szabás**: Használd a `{{playerName}}` és `{{courseName}}` helyőrzőket
2. **Tartalmazz linket**: Mindig linkeld a teljes leckét
3. **Előnézet tartalom**: Tartalmazz lecke előnézetet az email törzsben
4. **Világos tárgy**: Tegyél cselekvésre ösztönző tárgyat

### Metadata használat

Használd a `metadata` mezőt a következők tárolására:
- Tanulási célok
- Előfeltételek
- Becsült idő
- Nehézségi szint
- Címkék szűréshez
- Egyedi mezők (promptok, feladatok, tippek)

### Lecke elnevezés

- Használj konzisztens `lessonId` formátumot: `{COURSE_ID}_DAY_{DD}`
- Tartsd a címeket tömörek, de leíróak
- Tartalmazz nap számot az email tárgyban

---

## Referencia: AI_30_NAP kurzus struktúra

### Kurzus fázisok

**1-5. nap**: Alapok és szemlélet
- 1. nap: Mi az AI valójában (és mire NEM való)
- 2. nap: A jó prompt 4 eleme
- 3. nap: Hogyan kérdezz vissza az AI-tól
- 4. nap: Stílus és hang – tanítsd meg "úgy írni, mint te"
- 5. nap: Biztonság és etika a gyakorlatban

**6-10. nap**: Napi munka megkönnyítése
- Email írás, meeting jegyzetek, dokumentumok létrehozása
- Táblázat-gondolkodás AI-val
- Ismétlés és prompt-debug nap

**11-15. nap**: Rendszerépítés
- Személyes prompt könyvtár
- Munkafolyamat: input → feldolgozás → output
- Hibakezelés, hallucinációk kezelése
- Személyes "AI-asszisztens" hang kialakítása

**16-20. nap**: Szerep-specifikus használat
- Szerephez illesztett sabloncsomagok
- Tipikus csapdák adott szerepben
- Skill-check és szintlépés

**21-25. nap**: AI a bevételhez
- Ötletvalidálás AI-val
- Persona és értékajánlat
- Landing oldal vázlatok és szöveg
- Árazás alapjai
- MVP gondolkodás

**26-30. nap**: Lezárás és következő szint
- Személyes AI-rutin kialakítása
- 60 másodperces pitch AI-val
- Portfólió-szintű kimenetek
- Személyes fejlődési térkép
- Zárás – merre tovább?

---

## API referencia

### Kurzus végpontok

- `GET /api/admin/courses` – Összes kurzus listázása (admin)
- `POST /api/admin/courses` – Kurzus létrehozása (admin)
- `GET /api/admin/courses/{courseId}` – Kurzus részletek (admin)
- `PATCH /api/admin/courses/{courseId}` – Kurzus frissítése (admin)
- `GET /api/courses` – Aktív kurzusok listázása (publikus)
- `GET /api/courses/{courseId}` – Kurzus részletek (publikus)
- `POST /api/courses/{courseId}/enroll` – Beiratkozás kurzusra

### Lecke végpontok

- `GET /api/admin/courses/{courseId}/lessons` – Leckék listázása (admin)
- `POST /api/admin/courses/{courseId}/lessons` – Lecke létrehozása (admin)
- `GET /api/courses/{courseId}/day/{dayNumber}` – Lecke lekérése (publikus)

### Email végpontok

- `GET /api/cron/send-daily-lessons` – Email kézbesítés tesztelése (dev)
- `POST /api/cron/send-daily-lessons` – Napi emailek küldése (éles, auth szükséges)

---

**Utolsó frissítés**: 2025-01-17  
**Alapja**: Éles AI_30_NAP kurzus (30 lecke, teljesen seedelve)  
**Státusz**: ✅ Tesztelve és verifikálva éles környezetben
