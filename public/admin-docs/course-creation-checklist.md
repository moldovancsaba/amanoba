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

## 10) Gyors checklist

- [ ] Course létrehozva (Course.isActive = false)
- [ ] 30 Lesson létrehozva (mind `isActive = true`)
- [ ] Course publikálva (Course.isActive = true)
- [ ] Kurzus megjelenik a /courses listában
- [ ] Enroll és Day 1 lecke elérhető
- [ ] Cron email teszt lefut

