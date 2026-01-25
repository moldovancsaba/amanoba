# Quiz Question Central Management System - Tervezési Dokumentum

**Dátum**: 2026-01-25  
**Státusz**: 🟡 TERV  
**Prioritás**: Magas

---

## 1. Cél és Indoklás

### 1.1 Jelenlegi Helyzet
- Quiz kérdések seed scriptekkel kerülnek be
- Nincs központi admin felület a kérdések kezelésére
- Nehéz újrahasznosítani a kérdéseket más kurzusokhoz
- Nincs lehetőség hashtag alapú szűrésre és újrafelhasználásra
- A minőségi standardok nem követhetők könnyen (pl. a generikus template kérdések)

### 1.2 Cél
- **Központi kérdés adatbázis** admin UI-val
- **Szűrés** nyelv/kurzus/lecke/hashtag szerint
- **API-alapú kezelés** (nem csak seed scriptek)
- **Reusable kérdések** (több kurzus/lecke/survey használhatja)
- **Később**: kérdőívekhez, szintfelmérésekhez is használható
- **Backward compatible**: a meglévő rendszer nem sérül

---

## 2. Jelenlegi Struktúra Elemzése

### 2.1 QuizQuestion Modell
✅ **Jó**: A modell már tartalmazza a szükséges mezőket:
- `hashtags?: string[]` - szűréshez
- `questionType?: QuestionType` - kognitív szint
- `uuid?: string` - egyedi azonosítás
- `metadata` - audit trail
- `isCourseSpecific: boolean` - reusable vs course-specific
- `lessonId?: string`, `courseId?: ObjectId` - opcionális kapcsolatok

### 2.2 Jelenlegi API-k
✅ **Meglévő**:
- `GET/POST /api/admin/courses/[courseId]/lessons/[lessonId]/quiz` - lesson-specifikus
- `PATCH/DELETE /api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]` - egyedi kérdés
- `GET /api/games/quizzz/questions?lessonId=...` - játékhoz lekérés

### 2.3 Jelenlegi Admin UI
✅ **Meglévő**:
- `QuizManagerModal` a course detail page-en
- Csak lesson-specifikus kérdéseket kezel

---

## 3. Tervezett Megoldás

### 3.1 Új Admin Oldal
**Útvonal**: `/admin/questions` vagy `/admin/quiz-questions`

**Funkciók**:
- 📋 **Kérdés lista** szűrhető táblázatban
- 🔍 **Szűrők**:
  - Nyelv (hashtag alapján: `#hu`, `#en`, stb.)
  - Kurzus (`courseId`)
  - Lecke (`lessonId`)
  - Hashtag (több hashtag is)
  - Kognitív szint (`questionType`)
  - Nehézség (`difficulty`)
  - Kategória (`category`)
  - Aktív státusz (`isActive`)
  - Course-specific vs reusable (`isCourseSpecific`)
- ➕ **Új kérdés létrehozása**
- ✏️ **Kérdés szerkesztése**
- 🗑️ **Kérdés törlése/deaktiválása**
- 📋 **Bulk műveletek** (több kérdés egyszerre)
- 🔗 **Kérdés linkelése** kurzusokhoz/leckékhez (opcionális)

### 3.2 Új API Endpoints

#### 3.2.1 Globális Kérdés Kezelés
```
GET    /api/admin/questions              - Lista szűrőkkel
POST   /api/admin/questions              - Új kérdés
GET    /api/admin/questions/[questionId] - Kérdés részletei
PATCH  /api/admin/questions/[questionId] - Kérdés frissítése
DELETE /api/admin/questions/[questionId] - Kérdés törlése
```

#### 3.2.2 Szűrési Paraméterek (GET /api/admin/questions)
```
?language=hu                    - Hashtag alapján (#hu)
?courseId=GEO_SHOPIFY_30        - Kurzus ID
?lessonId=GEO_SHOPIFY_30_DAY_1  - Lecke ID
?hashtag=geo                    - Hashtag tartalmazza
?hashtag=beginner               - Több hashtag (AND)
?questionType=recall             - Kognitív szint
?difficulty=EASY                 - Nehézség
?category=Course Specific         - Kategória
?isActive=true                   - Aktív státusz
?isCourseSpecific=true           - Course-specific vs reusable
?search=termékoldal             - Keresés a kérdés szövegében
?limit=50                        - Oldal méret
?offset=0                        - Pagination
```

#### 3.2.3 POST /api/admin/questions
**Request body**:
```json
{
  "question": "Mit ellenőriznél egy termékoldalon a GEO szempontjából?",
  "options": [
    "Ár, készlet, GTIN, policy linkek, answer capsule",
    "Csak a termék nevét",
    "Semmit, nem kell ellenőrizni",
    "Csak a képeket"
  ],
  "correctIndex": 0,
  "difficulty": "MEDIUM",
  "category": "Course Specific",
  "questionType": "application",
  "hashtags": ["#geo", "#shopify", "#intermediate", "#application", "#hu"],
  "isCourseSpecific": false,  // false = reusable
  "courseId": null,            // opcionális: ha course-specific
  "lessonId": null,            // opcionális: ha lesson-specific
  "isActive": true
}
```

### 3.3 Backward Compatibility

#### 3.3.1 Meglévő API-k Maradnak
- ✅ `/api/admin/courses/[courseId]/lessons/[lessonId]/quiz` - **marad**
- ✅ `/api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]` - **marad**
- ✅ `/api/games/quizzz/questions?lessonId=...` - **marad**

#### 3.3.2 Dual Mode Support
A rendszer támogatja mindkét módot:
1. **Course-specific kérdések**: `isCourseSpecific: true`, `courseId` és `lessonId` beállítva
2. **Reusable kérdések**: `isCourseSpecific: false`, `courseId` és `lessonId` null, csak hashtag alapján linkelhető

#### 3.3.3 Migrációs Stratégia
1. **Fázis 1**: Új admin oldal + API (párhuzamosan a meglévővel)
2. **Fázis 2**: Meglévő kérdések migrálása (hashtag hozzáadása, reusable-é tétel ahol lehet)
3. **Fázis 3**: Seed scriptek továbbra is működnek, de lehet API-n keresztül is kezelni
4. **Fázis 4** (később): Survey modell QuizQuestion-t használhat

---

## 4. Implementációs Terv

### 4.1 API Endpoints (Új)

#### 4.1.1 GET /api/admin/questions
```typescript
// Szűrési logika
const filter: any = { isActive: true };
if (language) {
  filter.hashtags = { $in: [`#${language}`] };
}
if (courseId) {
  filter.courseId = courseId;
}
if (lessonId) {
  filter.lessonId = lessonId;
}
if (hashtag) {
  filter.hashtags = { $in: [hashtag] };
}
if (questionType) {
  filter.questionType = questionType;
}
if (difficulty) {
  filter.difficulty = difficulty;
}
if (category) {
  filter.category = category;
}
if (isCourseSpecific !== undefined) {
  filter.isCourseSpecific = isCourseSpecific === 'true';
}
if (search) {
  filter.question = { $regex: search, $options: 'i' };
}

const questions = await QuizQuestion.find(filter)
  .sort({ 'metadata.createdAt': -1 })
  .limit(limit)
  .skip(offset)
  .lean();
```

#### 4.1.2 POST /api/admin/questions
```typescript
// UUID generálás ha nincs
if (!body.uuid) {
  body.uuid = randomUUID();
}

// Hashtag validáció
if (body.hashtags && !Array.isArray(body.hashtags)) {
  return NextResponse.json({ error: 'hashtags must be an array' }, { status: 400 });
}

const question = new QuizQuestion({
  ...body,
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: session.user.email || session.user.id,
  },
});
```

### 4.2 Admin UI (Új)

#### 4.2.1 Oldal Struktúra
```
/admin/questions
├── Filter Panel (bal oldal)
│   ├── Nyelv szűrő
│   ├── Kurzus szűrő
│   ├── Lecke szűrő
│   ├── Hashtag szűrő
│   ├── Kognitív szint szűrő
│   ├── Nehézség szűrő
│   └── Kategória szűrő
├── Question List (központ)
│   ├── Táblázat: Kérdés | Opciók | Hashtagok | Típus | Nehézség | Műveletek
│   ├── Pagination
│   └── Bulk actions
└── Question Form (modal vagy sidebar)
    ├── Kérdés szöveg
    ├── 4 opció
    ├── Helyes válasz
    ├── Metadata (hashtags, type, difficulty, category)
    └── Linkelés (opcionális courseId/lessonId)
```

### 4.3 Hashtag Konvenciók

**Formátum**: `#téma #nehézség #típus #nyelv #all-languages`

**Példák**:
- `['#geo', '#shopify', '#intermediate', '#application', '#hu']`
- `['#time-management', '#beginner', '#recall', '#en']`
- `['#productivity', '#advanced', '#critical-thinking', '#hu', '#all-languages']`

**Hashtag típusok**:
- **Téma**: `#geo`, `#seo`, `#shopify`, `#time-management`, stb.
- **Nehézség**: `#beginner`, `#intermediate`, `#advanced`
- **Típus**: `#recall`, `#application`, `#critical-thinking`
- **Nyelv**: `#hu`, `#en`, `#de`, stb.
- **Speciális**: `#all-languages` (többnyelvű kérdés)

---

## 5. Későbbi Bővíthetőség

### 5.1 Survey Integráció
A Survey modell jelenleg külön van. Később lehet:
- Survey kérdések is QuizQuestion-t használhatnak
- Vagy Survey saját modell marad, de lehet QuizQuestion-t is használni

### 5.2 Szintfelmérések
- Szintfelmérés = QuizQuestion-ök gyűjteménye hashtag alapján
- Pl. "GEO alapfok szintfelmérés" = `#geo` + `#beginner` hashtagú kérdések

### 5.3 Kérdőívek
- Kérdőív = QuizQuestion-ök gyűjteménye (akár többnyelvű)
- Hashtag alapú összeállítás

---

## 6. Migrációs Lépések

### 6.1 Fázis 1: Alapstruktúra (Most)
1. ✅ Új API: `/api/admin/questions` (GET, POST, PATCH, DELETE)
2. ✅ Új admin oldal: `/admin/questions`
3. ✅ Szűrési logika implementálása
4. ✅ Hashtag alapú szűrés

### 6.2 Fázis 2: Meglévő Kérdések Migrálása (Később)
1. Script: meglévő kérdésekhez hashtag hozzáadása
2. Reusable-é tétel ahol lehet (pl. általános GEO kérdések)
3. Minőségi audit: rossz kérdések javítása

### 6.3 Fázis 3: Seed Scriptek Frissítése (Később)
1. Seed scriptek továbbra is működnek
2. De lehet API-n keresztül is kezelni
3. Best practice: API-n keresztül kezelés, seed csak inicializáláshoz

---

## 7. Technikai Részletek

### 7.1 Indexek (Már Megvannak)
✅ A QuizQuestion modellben már vannak:
- `hashtags` index
- `questionType` index
- `courseId`, `lessonId` indexek
- `isCourseSpecific` index

### 7.2 Validáció
- 4 opció kötelező
- `correctIndex` 0-3 között
- `hashtags` array
- `questionType` enum
- `difficulty` enum

### 7.3 Biztonság
- Admin only (requireAdmin middleware)
- Session ellenőrzés
- Input validáció

---

## 8. Példa Használati Esetek

### 8.1 Új Kurzus Kérdések Létrehozása
1. Admin megnyitja `/admin/questions`
2. Szűr: `hashtag=geo` + `language=hu`
3. Látja a meglévő GEO kérdéseket
4. Újrahasznosít néhányat (másolás + új hashtag)
5. Új kérdéseket hoz létre a kurzus specifikus témákhoz

### 8.2 Kérdés Javítása
1. Admin megtalálja a rossz kérdést (pl. "jelenlegi leckében tanultak alapján...")
2. Szerkeszti: specifikus, standalone kérdéssé alakítja
3. Frissíti a hashtagokat
4. Mentés → automatikusan frissül mindenhol, ahol használják

### 8.3 Reusable Kérdések Használata
1. Admin létrehoz egy reusable kérdést: `isCourseSpecific: false`
2. Hashtagok: `['#geo', '#beginner', '#recall', '#hu', '#all-languages']`
3. Később más kurzusok is használhatják ugyanazt a kérdést
4. Egy helyen javítva, mindenhol frissül

---

## 9. Következő Lépések

1. **API implementálás** - `/api/admin/questions` endpoint-ok
2. **Admin UI** - `/admin/questions` oldal
3. **Dokumentáció frissítés** - course-creation-checklist.md
4. **Tesztelés** - meglévő rendszerrel párhuzamosan
5. **Migráció** - meglévő kérdések hashtag hozzáadása

---

## 10. Kérdések és Döntések

### 10.1 Nyelv Kezelés
**Kérdés**: Hogyan kezeljük a nyelvet?
- **Opció A**: Hashtag alapján (`#hu`, `#en`)
- **Opció B**: Külön `language` mező
- **Javaslat**: Hashtag (flexibilisebb, több nyelv is lehet egy kérdésben)

### 10.2 Reusable vs Course-Specific
**Kérdés**: Mikor reusable, mikor course-specific?
- **Reusable**: Általános kérdések (pl. "Mi a GEO?"), több kurzus használhatja
- **Course-specific**: Kurzus specifikus (pl. "GEO Shopify 30 napos kurzus 5. napján mit tanultál?")
- **Javaslat**: Alapértelmezetten reusable, csak ha valóban course-specific, akkor `isCourseSpecific: true`

### 10.3 Survey Integráció
**Kérdés**: Survey is QuizQuestion-t használ?
- **Javaslat**: Később döntünk, most a QuizQuestion rendszert építjük ki, Survey marad külön (később integrálható)

---

**Státusz**: Ez a dokumentum a tervezési fázisban van. Implementáció előtt egyeztetés szükséges.
